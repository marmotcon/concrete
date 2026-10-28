/**
 * Vercel Serverless Function for automatic Excel email delivery.
 * Set RESEND_API_KEY, RESEND_FROM_EMAIL (verified sending domain),
 * and REPORT_SUBMISSION_KEY (long, private passphrase) in Vercel.
 * The destination is intentionally fixed and never controlled by the browser.
 */
'use strict';
const crypto=require('node:crypto');
const rates=require('../pull-rates.json');
const rateMap=new Map(rates.map(r=>[r.id,r]));
const DESTINATION='estimating@marmotconstruction.com';
const clean=s=>String(s??'').trim().slice(0,250);
const safe=s=>clean(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const readNum=x=>x===''||x==null?null:Number(x);
const equal=(a,b)=>{
  const aa=crypto.createHash('sha256').update(String(a)).digest();
  const bb=crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(aa,bb);
};
const fail=(res,status,error)=>res.status(status).json({error});
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return fail(res,405,'Only POST is supported.');
  if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM_EMAIL||!process.env.REPORT_SUBMISSION_KEY){return fail(res,503,'Automatic email has not been configured by the administrator.');}
  if(!equal(req.body?.submissionKey||'',process.env.REPORT_SUBMISSION_KEY))return fail(res,401,'Incorrect submission key.');
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    const report=body?.report;
    if(!report||typeof report!=='object')return fail(res,400,'Report is missing.');
    const date=clean(report.date),foreman=clean(report.foreman),subdivision=clean(report.subdivision),phase=clean(report.phase);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!foreman||!subdivision||!phase)return fail(res,400,'Complete date, foreman, subdivision and phase.');
    const isHand=report.pourType==='hand';
    const combined=report.mode==='combined';
    if(!isHand&&(!Array.isArray(report.lines)||!report.lines.length||report.lines.length>120))return fail(res,400,'Invalid structure list.');
    let theoretical=0,ordered=0,returned=0;
    const parsed=(isHand?[]:report.lines).map((line,i)=>{
      const rate=rateMap.get(line.structureId),q=readNum(line.quantity),o=readNum(line.ordered),r=readNum(line.returned)??0;
      if(!rate||!Number.isFinite(q)||q<=0||q>1e7)throw new Error(`Structure ${i+1} has invalid measured quantity.`);
      if(!combined&&(!Number.isFinite(o)||o<0||o>1e7||!Number.isFinite(r)||r<0||r>o))throw new Error(`Structure ${i+1} has invalid order/return volumes.`);
      const th=q*rate.rate;theoretical+=th;
      if(!combined){ordered+=o;returned+=r;}
      return {name:rate.label,quantity:q,unit:rate.unit==='m2'?'m²':'LM',pull:rate.rate,theoretical:th,ordered:combined?null:o,used:combined?null:o-r};
    });
    if(isHand){ordered=readNum(report.handVolume);returned=0;}
    else if(combined){ordered=readNum(report.combinedOrdered);returned=readNum(report.combinedReturned)??0;}
    if(!Number.isFinite(ordered)||ordered<=0||ordered>1e7||!Number.isFinite(returned)||returned<0||returned>ordered||(!isHand&&theoretical<=0))return fail(res,400,'Invalid concrete volumes.');
    const fileName=clean(body.filename);
    if(!/^Marmot-Pour-[A-Za-z0-9-]+\.xlsx$/.test(fileName))return fail(res,400,'Invalid attachment filename.');
    const input=body.xlsxBase64;
    if(typeof input!=='string'||input.length>2800000||input.length<100||!/^[A-Za-z0-9+/]+={0,2}$/.test(input))return fail(res,400,'Invalid Excel attachment.');
    const buf=Buffer.from(input,'base64');
    if(buf.length>2*1024*1024||buf.subarray(0,4).toString('hex')!=='504b0304')return fail(res,400,'Attachment is not a valid-sized XLSX package.');
    const used=ordered-returned,excess=isHand?null:used-theoretical,pct=isHand?null:(excess/theoretical)*100;
    const two=n=>Number(n).toFixed(2);
    const detailRows=parsed.map(line=>`<tr><td>${safe(line.name)}</td><td>${two(line.quantity)} ${safe(line.unit)}</td><td>${line.pull}</td><td>${two(line.theoretical)}</td><td>${line.ordered===null?'Combined':two(line.ordered)}</td></tr>`).join('');
    const html=isHand
      ?`<div style="font:14px Arial,sans-serif;max-width:700px;color:#1e3348"><h2>Marmot Hand Pour Report</h2><p><b>Date:</b> ${safe(date)}<br><b>Foreman:</b> ${safe(foreman)}<br><b>Subdivision:</b> ${safe(subdivision)}<br><b>Phase:</b> ${safe(phase)}</p><p><b>Concrete poured:</b> ${two(used)} m³</p><p>Hand pour — no structure or waste measurement required.</p><p><b>Notes:</b> ${safe(report.notes||'None')}</p><p>Excel report attached.</p></div>`
      :`<div style="font:14px Arial,sans-serif;max-width:700px;color:#1e3348"><h2>Marmot Machine Pour Report</h2><p><b>Date:</b> ${safe(date)}<br><b>Foreman:</b> ${safe(foreman)}<br><b>Subdivision:</b> ${safe(subdivision)}<br><b>Phase:</b> ${safe(phase)}</p><table style="border-collapse:collapse;width:100%"><tr><th style="text-align:left">Ordered</th><th style="text-align:left">Returned</th><th style="text-align:left">Used</th><th style="text-align:left">Theoretical</th><th style="text-align:left">Excess</th><th style="text-align:left">Waste</th></tr><tr><td>${two(ordered)} m³</td><td>${two(returned)} m³</td><td>${two(used)} m³</td><td>${two(theoretical)} m³</td><td>${two(excess)} m³</td><td>${two(pct)}%</td></tr></table><h3>Structures</h3><table style="width:100%;border-collapse:collapse"><tr><th>Structure</th><th>Measured</th><th>Pull</th><th>Theoretical m³</th><th>Ordered m³</th></tr>${detailRows}</table><p><b>Volume method:</b> ${combined?'One combined order':'By structure'}</p><p><b>Notes:</b> ${safe(report.notes||'None')}</p><p>The Excel report is attached and includes the pull rate library.</p></div>`;
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':crypto.createHash('sha256').update(String(report.id)+'|'+String(report.updatedAt)).digest('hex')},
      body:JSON.stringify({from:process.env.RESEND_FROM_EMAIL,to:[DESTINATION],subject:`Marmot ${isHand?'Hand':'Machine'} Pour | ${subdivision} | ${phase} | ${date}`,html,attachments:[{filename:fileName,content:input}]})
    });
    let answer={};try{answer=await response.json();}catch{}
    if(!response.ok){console.error('Resend error',response.status,answer);return fail(res,502,'The email provider rejected the report. Confirm sender domain and email configuration.');}
    return res.status(200).json({ok:true,id:answer.id||null,to:DESTINATION});
  }catch(err){
    if(/invalid|Invalid|Structure/.test(err?.message||''))return fail(res,400,err.message);
    console.error('Report send failure',err);
    return fail(res,500,'Email service error. Please use manual sharing.');
  }
};
