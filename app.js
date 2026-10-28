(() => {
  'use strict';
  const RATES = window.MARMOT_PULL_RATES;
  const RATE_MAP = new Map(RATES.map(item => [item.id,item]));
  const STORE_DRAFT = 'marmot-pour-draft-v1';
  const STORE_SAVED = 'marmot-pour-saved-v1';
  const qs=(sel,ctx=document)=>ctx.querySelector(sel);
  const qsa=(sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));
  const byId=(id)=>document.getElementById(id);
  const esc=(s)=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const num=(v)=>v===''||v==null?null:Number(v);
  const fmt=(n,d=2)=>Number(n||0).toLocaleString('en-CA',{minimumFractionDigits:d,maximumFractionDigits:d});
  const uid=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2);
  const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
  const freshLine=()=>({id:uid(),structureId:'',quantity:'',ordered:'',returned:''});
  const freshReport=()=>({id:uid(),date:today(),foreman:'',subdivision:'',phase:'',notes:'',pourType:'machine',handVolume:'',mode:'allocated',combinedOrdered:'',combinedReturned:'',lines:[freshLine()],updatedAt:new Date().toISOString(),sentAt:null});
  const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  let report=readJSON(STORE_DRAFT,null)||freshReport();
  let saved=readJSON(STORE_SAVED,[]);
  let activeTab='report',toastTimer;
  let reportCounter=0;
  if(!Array.isArray(report.lines)||!report.lines.length) report.lines=[freshLine()];
  if(!['combined','allocated'].includes(report.mode))report.mode='allocated';
  // Pre-v1.1 saved reports have no pourType; they are machine pours.
  if(report.pourType!=='hand')report.pourType='machine';
  if(report.handVolume==null)report.handVolume='';
  function updateSaveIndicator(label='Saved locally'){
    byId('saveStatus').textContent=label;
    byId('savedCount').textContent=String(saved.length);
  }
  function persist(){
    report.updatedAt=new Date().toISOString();
    if(report.sentAt)report.sentAt=null;
    try{localStorage.setItem(STORE_DRAFT,JSON.stringify(report));updateSaveIndicator('Draft saved on this device');}
    catch{updateSaveIndicator('Storage full — export report');}
  }
  function flash(message){
    const el=byId('toast');el.textContent=message;el.classList.add('visible');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3400);
  }
  function showError(message){const v=byId('validationMessage');v.innerText=message;v.classList.remove('hidden');}
  function clearError(){byId('validationMessage').classList.add('hidden');}
  function getCalculation(){
    if(report.pourType==='hand'){
      const volume=num(report.handVolume);
      const complete=volume!==null&&Number.isFinite(volume)&&volume>0;
      return {lines:[],theoretical:0,ordered:volume??0,returned:0,used:volume??0,excess:null,complete,wastePct:null};
    }
    const lines=report.lines.map(line=>{
      const r=RATE_MAP.get(line.structureId);
      const quantity=num(line.quantity);
      const ordered=num(line.ordered),returned=num(line.returned)??0;
      const theoretical=r&&quantity!=null&&quantity>=0?quantity*r.rate:0;
      const actual=ordered!=null?ordered-returned:0;
      const complete=!!r && quantity!==null && quantity>0 && (report.mode==='combined'||(ordered!==null && ordered>=0 && returned>=0 && returned<=ordered));
      return {...line,structure:r,quantityNum:quantity,orderedNum:ordered,returnedNum:returned,theoretical,actual,complete};
    });
    const theoretical=lines.reduce((s,x)=>s+x.theoretical,0);
    const ordered=report.mode==='combined'?(num(report.combinedOrdered)??0):lines.reduce((s,x)=>s+(x.orderedNum??0),0);
    const returned=report.mode==='combined'?(num(report.combinedReturned)??0):lines.reduce((s,x)=>s+(x.returnedNum??0),0);
    const used=ordered-returned;
    const volumeOK=report.mode==='combined' ? num(report.combinedOrdered)!==null && ordered>0 && returned>=0 && returned<=ordered : lines.every(x=>x.complete);
    const complete=lines.length>0 && lines.every(x=>x.complete) && volumeOK && theoretical>0;
    const excess=used-theoretical;
    return {lines,theoretical,ordered,returned,used,excess,complete,wastePct:complete?(excess/theoretical*100):null};
  }
  function updateCalculations(){
    const hand=report.pourType==='hand';
    const c=getCalculation();
    byId('orderedLabel').textContent=hand?'CONCRETE POURED':'ORDERED VOLUME';
    byId('orderedSubtitle').textContent=hand?'Hand pour — volume only':'Total ordered';
    qs('.summary-grid').classList.toggle('hand-summary',hand);
    qsa('.machine-summary').forEach(el=>el.classList.toggle('hidden',hand));
    byId('sumOrdered').textContent=fmt(c.ordered);
    byId('sumUsed').textContent=fmt(c.used);
    byId('sumTheoretical').textContent=fmt(c.theoretical);
    byId('sumWaste').textContent=c.wastePct===null?'—':fmt(c.wastePct,1);
    byId('sumExcess').textContent=c.wastePct===null?'Enter your pour measurements':`${c.excess>=0?'+':''}${fmt(c.excess)} m³ ${c.excess>=0?'above':'below'} theoretical`;
    const wasteCard=qs('.waste-card');wasteCard.classList.toggle('good',c.wastePct!==null&&c.wastePct>=0&&c.wastePct<=5);
    wasteCard.classList.toggle('warning',c.wastePct!==null&&(c.wastePct>5||c.wastePct<0));
    c.lines.forEach(line=>{
      const container=qs(`[data-line-id="${CSS.escape(line.id)}"]`);
      if(!container)return;
      const qtyTitle=qs('[data-quantity-title]',container);
      const quantityInput=qs('[data-value="quantity"]',container);
      const rateHint=qs('[data-rate-hint]',container);
      const u=line.structure?.unit==='m2'?'m²':'LM';
      qtyTitle.textContent=`Measured ${u} *`;
      quantityInput.placeholder=u==='m²'?'Area in m²':'Length in LM';
      rateHint.textContent=line.structure?`Pull: ${line.structure.rate} m³/${u==='m²'?'m²':'LM'} · Source row ${line.structure.sourceRow}`:'Select a structure to view its pull rate';
      const theoEl=qs('[data-metric="theoretical"]',container);
      const usedEl=qs('[data-metric="actual"]',container);
      const wasteEl=qs('[data-metric="waste"]',container);
      theoEl.textContent=fmt(line.theoretical,3)+' m³';
      if(report.mode==='combined'){
        usedEl.textContent='—';wasteEl.textContent='—';wasteEl.className='subtle';
      }else{
        usedEl.textContent=line.orderedNum===null?'—':fmt(line.actual,2)+' m³';
        wasteEl.textContent=line.complete?fmt((line.actual-line.theoretical)/line.theoretical*100,1)+'%':'—';
        wasteEl.className=line.complete?(line.actual-line.theoretical>=0?'positive':'negative'):'subtle';
      }
    });
    byId('lineCount').textContent=String(report.lines.length);
    byId('reportReference').textContent=(report.date||'NEW REPORT').replaceAll('-',' / ');
  }
  const optGroups = [...new Set(RATES.map(r=>r.category))];
  const structureOptions=()=>'<option value="">Choose a structure...</option>'+optGroups.map(cat=>`<optgroup label="${esc(cat)}">`+RATES.filter(r=>r.category===cat).map(r=>`<option value="${esc(r.id)}">${esc(r.label)} · ${r.rate} ${r.unit==='m2'?'m³/m²':'m³/LM'}</option>`).join('')+'</optgroup>').join('');
  function renderLines(){
    byId('lineItems').innerHTML=report.lines.map((line,index)=>`
      <div class="line-card" data-line-id="${esc(line.id)}">
        <div class="line-head"><span class="line-index">STRUCTURE ${String(index+1).padStart(2,'0')}</span><button type="button" class="line-remove" data-remove="${esc(line.id)}" ${report.lines.length===1?'disabled style="opacity:.4"':''}>Remove ×</button></div>
        <div class="line-fields">
          <label class="field structure-choice">Structure &amp; thickness *<select data-value="structureId" aria-label="Structure and thickness">${structureOptions()}</select></label>
          <label class="field"> <span data-quantity-title>Measured LM *</span><input type="number" min="0" step="any" inputmode="decimal" placeholder="Length in LM" data-value="quantity" value="${esc(line.quantity)}"></label>
          <label class="field allocated-field ${report.mode==='combined'?'hidden':''}">Ordered (m³) *<input type="number" min="0" step="any" inputmode="decimal" placeholder="0.00" data-value="ordered" value="${esc(line.ordered)}"></label>
          <label class="field allocated-field ${report.mode==='combined'?'hidden':''}">Returned (m³)<input type="number" min="0" step="any" inputmode="decimal" placeholder="0.00" data-value="returned" value="${esc(line.returned)}"></label>
        </div>
        <div class="line-rate-hint" data-rate-hint>Select a structure to view its pull rate</div>
        <div class="line-results"><div class="line-stat"><span>Theoretical</span><strong data-metric="theoretical">—</strong></div><div class="line-stat"><span>Actual used</span><strong data-metric="actual">—</strong></div><div class="line-stat"><span>Waste %</span><strong data-metric="waste" class="subtle">—</strong></div></div>
      </div>`).join('');
    report.lines.forEach(line=>{const el=qs(`[data-line-id="${CSS.escape(line.id)}"] select`);if(el)el.value=line.structureId;});
    updateCalculations();
  }
  function renderBasics(){
    if(report.pourType!=='hand')report.pourType='machine'; // Read legacy saved reports safely.
    for(const [key,id] of [['date','pourDate'],['foreman','foreman'],['subdivision','subdivision'],['phase','phase'],['notes','notes'],['combinedOrdered','combinedOrdered'],['combinedReturned','combinedReturned'],['handVolume','handVolume']])byId(id).value=report[key]??'';
    qsa('[data-pour-type]').forEach(x=>{const chosen=x.dataset.pourType===report.pourType;x.classList.toggle('selected',chosen);x.setAttribute('aria-pressed',String(chosen));});
    const hand=report.pourType==='hand';
    byId('handPourPanel').classList.toggle('hidden',!hand);
    byId('machineVolumePanel').classList.toggle('hidden',hand);
    byId('machineStructuresPanel').classList.toggle('hidden',hand);
    byId('formulaPanel').classList.toggle('hidden',hand);
    qsa('[data-mode]').forEach(x=>x.classList.toggle('selected',x.dataset.mode===report.mode));
    byId('combinedFields').classList.toggle('hidden',hand||report.mode!=='combined');
    byId('modeExplanation').textContent=report.mode==='combined'?'One order covers all listed structures. Total waste is calculated accurately; individual waste percentages are not allocated.':'Allocate orders to each structure to see individual waste percentages. Do not count the same truckload twice.';
    clearError();byId('manualPanel').classList.add('hidden');renderLines();
  }
  function validate(){
    const missing=[];
    if(!report.date)missing.push('pour date');
    if(!report.foreman.trim())missing.push('foreman');
    if(!report.subdivision.trim())missing.push('subdivision');
    if(!report.phase.trim())missing.push('phase');
    const c=getCalculation();
    if(report.pourType==='hand'){
      const volume=num(report.handVolume);
      if(volume===null||!Number.isFinite(volume)||volume<=0)missing.push('hand pour: enter cubic metres poured above zero');
      return [...new Set(missing)];
    }
    c.lines.forEach((line,index)=>{
      if(!line.structure) missing.push(`structure ${index+1}: select a structure`);
      if(line.quantityNum===null||line.quantityNum<=0||!Number.isFinite(line.quantityNum))missing.push(`structure ${index+1}: enter a measured quantity above zero`);
      if(report.mode==='allocated'){
        if(line.orderedNum===null||line.orderedNum<0||!Number.isFinite(line.orderedNum))missing.push(`structure ${index+1}: enter ordered volume`);
        if(line.returnedNum<0||line.returnedNum>(line.orderedNum??0)||!Number.isFinite(line.returnedNum))missing.push(`structure ${index+1}: check returned volume`);
      }
    });
    if(report.mode==='combined'){
      if(num(report.combinedOrdered)===null||c.ordered<=0||!Number.isFinite(c.ordered))missing.push('combined ordered volume');
      if(c.returned<0||c.returned>c.ordered||!Number.isFinite(c.returned))missing.push('combined returned volume must not exceed ordered volume');
    }
    if(!c.theoretical||!Number.isFinite(c.theoretical))missing.push('valid theoretical volume');
    return [...new Set(missing)];
  }
  function check(){const errors=validate();if(errors.length){showError('Please complete: '+errors.slice(0,5).join('; ')+(errors.length>5?'; and more.':''));flash('Complete required report fields first');return false;}clearError();return true;}
  function saveReport(){
    report.updatedAt=new Date().toISOString();
    const index=saved.findIndex(item=>item.id===report.id);
    if(index>=0)saved[index]=structuredClone(report);else saved.unshift(structuredClone(report));
    try{localStorage.setItem(STORE_SAVED,JSON.stringify(saved));localStorage.setItem(STORE_DRAFT,JSON.stringify(report));}catch{flash('Could not save. Export Excel to back up this report.');return;}
    updateSaveIndicator('Report saved on this device');renderSaved();flash('Report saved on this device');
  }
  function exportFilename(rep=report){
    const safe=s=>String(s||'').trim().replace(/[^a-zA-Z0-9-]+/g,'-').replace(/^-|-$/g,'').slice(0,34)||'Unspecified';
    return `Marmot-Pour-${safe(rep.date)}-${safe(rep.subdivision)}-${safe(rep.phase)}-${rep.pourType==='hand'?'Hand':'Machine'}.xlsx`;
  }
  function makeFile(rep=report){return new File([window.MarmotExcel.create(rep,RATES)],exportFilename(rep),{type:window.MarmotExcel.mime});}
  function download(file){
    const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  }
  function exportExcel(){if(!check())return;download(makeFile());saveReport();flash('Excel report exported');}
  function showManual(message){byId('manualPanel').classList.remove('hidden');byId('manualText').textContent=message||'Share the Excel file through Mail, or download it and attach it yourself.';}
  async function shareExcel(){
    if(!check())return;
    const file=makeFile();
    if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
      try{
        flash('In Mail, address the attachment to estimating@marmotconstruction.com');
        await navigator.share({title:'Marmot Concrete Pour Report',text:`Send to estimating@marmotconstruction.com — ${report.subdivision} / ${report.phase} / ${report.date}`,files:[file]});
        saveReport();return;
      }catch(err){if(err.name==='AbortError')return;}
    }
    download(file);
    const body=`Please see the attached Excel pour report for ${report.subdivision} / ${report.phase}, ${report.date}.\n\nAttach the downloaded ${file.name} file before sending.`;
    setTimeout(()=>{window.location.href=`mailto:estimating@marmotconstruction.com?subject=${encodeURIComponent('Marmot Concrete Pour Report — '+report.subdivision+' — '+report.date)}&body=${encodeURIComponent(body)}`;},150);
    flash('Excel downloaded. Attach it to the email draft.');
  }
  async function base64(file){
    const arr=new Uint8Array(await file.arrayBuffer());let str='';for(let i=0;i<arr.length;i+=8192)str+=String.fromCharCode(...arr.subarray(i,i+8192));return btoa(str);
  }
  async function sendReport(){
    if(!check())return;
    if(!navigator.onLine){showManual('Offline: connect to the internet to send automatically, or export the Excel file now.');flash('You are offline');return;}
    const key=byId('submissionKey').value.trim();
    if(!key){showError('Enter the team submission key to send automatically, or use the manual share option below.');showManual('Automatic email needs the server submission key. You can still share the Excel attachment through the iPhone share sheet.');return;}
    const btn=byId('sendButton');btn.disabled=true;btn.textContent='Sending report…';
    try{
      const file=makeFile();
      const response=await fetch('/api/send-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({submissionKey:key,report,filename:file.name,xlsxBase64:await base64(file)})});
      let reply={};try{reply=await response.json();}catch{}
      if(!response.ok)throw new Error(reply.error||(response.status===404?'Automatic email is not set up on this website.':`Email service returned ${response.status}.`));
      report.sentAt=new Date().toISOString();
      saveReport();
      byId('manualPanel').classList.add('hidden');clearError();
      flash('Email accepted for delivery to estimating@marmotconstruction.com');
    }catch(err){
      showError(err.message||'Email could not be sent.');
      showManual('Automatic email was not confirmed. Share the Excel attachment through Mail, or export and attach it manually.');
    }finally{btn.disabled=false;btn.innerHTML='<span>Send to estimating</span><span>↗</span>';}
  }
  function renderSaved(){
    byId('savedCount').textContent=String(saved.length);
    const view=byId('savedList');
    if(!saved.length){view.innerHTML='<div class="empty-state">No saved reports yet. Complete or save a pour report to see it here.</div>';return;}
    view.innerHTML=saved.map(rep=>{
      const short=rep.pourType==='hand'
        ?`${rep.date||'No date'} · ${rep.foreman||'Unassigned'} · Hand pour · ${fmt(num(rep.handVolume)??0)} m³`
        :`${rep.date||'No date'} · ${rep.foreman||'Unassigned'} · Machine pour · ${rep.lines?.length||0} structures`;
      return `<div class="saved-entry"><div><h3>${rep.sentAt?'<span class="sent-mark">SENT</span>':''}${esc(rep.subdivision||'Untitled subdivision')} · ${esc(rep.phase||'No phase')}</h3><p>${esc(short)}</p></div><div class="saved-actions"><button type="button" data-load="${esc(rep.id)}">Open</button><button type="button" data-export="${esc(rep.id)}">Excel</button><button type="button" class="danger" data-delete="${esc(rep.id)}">Delete</button></div></div>`;
    }).join('');
  }
  function renderRates(){
    const filter=byId('rateSearch').value.trim().toLowerCase();
    const subset=RATES.filter(r=>(r.label+' '+r.category+' '+r.rate).toLowerCase().includes(filter));
    byId('rateList').innerHTML=subset.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.thickness?r.thickness+' mm':'—'}</td><td>${r.rate} ${r.unit==='m2'?'m³/m²':'m³/LM'}</td><td>Row ${r.sourceRow}</td></tr>`).join('')||'<tr><td colspan="4">No matches found.</td></tr>';
  }
  function tab(name){
    activeTab=name;
    qsa('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.tab===name));
    for(const t of ['report','saved','rates'])byId(t+'View').classList.toggle('hidden',t!==name);
    if(name==='saved')renderSaved();
    if(name==='rates')renderRates();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function bind(){
    qsa('[data-tab]').forEach(button=>button.addEventListener('click',()=>tab(button.dataset.tab)));
    [['pourDate','date'],['foreman','foreman'],['subdivision','subdivision'],['phase','phase'],['notes','notes'],['combinedOrdered','combinedOrdered'],['combinedReturned','combinedReturned'],['handVolume','handVolume']].forEach(([id,field])=>byId(id).addEventListener('input',e=>{report[field]=e.target.value;persist();updateCalculations();clearError();}));
    qsa('[data-pour-type]').forEach(button=>button.addEventListener('click',()=>{
      if(report.pourType===button.dataset.pourType)return;
      report.pourType=button.dataset.pourType;persist();renderBasics();
    }));
    qsa('[data-mode]').forEach(button=>button.addEventListener('click',()=>{report.mode=button.dataset.mode;persist();renderBasics();}));
    for(const id of ['addLineTop','addLineBottom'])byId(id).addEventListener('click',()=>{report.lines.push(freshLine());persist();renderLines();});
    byId('lineItems').addEventListener('input',event=>{
      const target=event.target;if(!target.dataset.value)return;
      const el=target.closest('[data-line-id]');if(!el)return;
      const ln=report.lines.find(l=>l.id===el.dataset.lineId);if(!ln)return;
      ln[target.dataset.value]=target.value;
      persist();updateCalculations();clearError();
    });
    byId('lineItems').addEventListener('change',event=>{
      const target=event.target;
      if(target.dataset.value==='structureId'){const ln=report.lines.find(l=>l.id===target.closest('[data-line-id]').dataset.lineId);if(!ln)return;ln.structureId=target.value;persist();updateCalculations();}
    });
    byId('lineItems').addEventListener('click',event=>{
      const btn=event.target.closest('[data-remove]');if(!btn||report.lines.length===1)return;
      report.lines=report.lines.filter(line=>line.id!==btn.dataset.remove);persist();renderLines();
    });
    byId('excelButton').addEventListener('click',exportExcel);
    byId('saveButton').addEventListener('click',saveReport);
    byId('sendButton').addEventListener('click',sendReport);
    byId('shareButton').addEventListener('click',shareExcel);
    byId('newReportButton').addEventListener('click',()=>{
      if((report.lines.some(l=>l.structureId||l.quantity||l.ordered)||report.handVolume||report.foreman||report.subdivision)&&!confirm('Start a new report? Save the current one first if you want it in your report history.'))return;
      report=freshReport();persist();renderBasics();flash('New daily report created');window.scrollTo({top:0,behavior:'smooth'});
    });
    byId('rateSearch').addEventListener('input',renderRates);
    byId('savedList').addEventListener('click',event=>{
      const btn=event.target.closest('button');if(!btn)return;
      const id=btn.dataset.load||btn.dataset.export||btn.dataset.delete;
      const rep=saved.find(item=>item.id===id);if(!rep)return;
      if(btn.dataset.load){report=structuredClone(rep);localStorage.setItem(STORE_DRAFT,JSON.stringify(report));renderBasics();tab('report');return;}
      if(btn.dataset.export){download(makeFile(rep));flash('Saved Excel report exported');return;}
      if(btn.dataset.delete){if(!confirm('Delete this saved report from this device?'))return;saved=saved.filter(item=>item.id!==id);localStorage.setItem(STORE_SAVED,JSON.stringify(saved));renderSaved();flash('Saved report deleted');}
    });
    const refreshStatus=()=>{const online=navigator.onLine;const badge=byId('onlineBadge');badge.textContent=online?'● Online':'● Offline';badge.classList.toggle('offline',!online);};
    window.addEventListener('online',refreshStatus);window.addEventListener('offline',refreshStatus);refreshStatus();
  }
  bind();renderBasics();renderSaved();renderRates();persist();
  if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
