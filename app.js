(() => {
  'use strict';
  const RATES = window.MARMOT_PULL_RATES;
  const JOBS = [{"id":26000,"name":"Miscellaneous","group":"Commercial"},{"id":26001,"name":"Northest Yard/Wolf Willow Pile","group":"Commercial"},{"id":26002,"name":"Mahogany Speciality","group":"Commercial"},{"id":26003,"name":"Marda Loop","group":"Commercial"},{"id":26004,"name":"University District","group":"Commercial"},{"id":26005,"name":"Spruce Meadows","group":"Commercial"},{"id":26006,"name":"Stampede Trail","group":"Commercial"},{"id":26008,"name":"Legacy MR Entry","group":"Commercial"},{"id":26009,"name":"Seton Market Street","group":"Commercial"},{"id":26010,"name":"Creekview Entry Features/MR","group":"Commercial"},{"id":26011,"name":"South Yard","group":"Commercial"},{"id":26012,"name":"Seton MR's","group":"Commercial"},{"id":26013,"name":"Nostalgia MR's","group":"Commercial"},{"id":26014,"name":"Rangeview MRs/Pavers/GH","group":"Commercial"},{"id":26015,"name":"Glacier Ridge","group":"Commercial"},{"id":26017,"name":"8th Street Redevelopment","group":"Commercial"},{"id":26019,"name":"Canyon Meadows Parking Lot","group":"Commercial"},{"id":26020,"name":"Jared WC Dev","group":"Commercial"},{"id":26021,"name":"Livingston","group":"Commercial"},{"id":26022,"name":"Lewiston","group":"Commercial"},{"id":26023,"name":"East Village","group":"Commercial"},{"id":26024,"name":"Silversprings House","group":"Commercial"},{"id":26025,"name":"Park Place","group":"Commercial"},{"id":26026,"name":"Wolfwillow","group":"Commercial"},{"id":26027,"name":"Cornerstone MR","group":"Commercial"},{"id":26028,"name":"Ridgemont MR","group":"Commercial"},{"id":26029,"name":"West Springs MR","group":"Commercial"},{"id":26030,"name":"Logan Landing","group":"Commercial"},{"id":26031,"name":"Fireside","group":"Commercial"},{"id":26032,"name":"1916 - 10a Street SW","group":"Commercial"},{"id":26033,"name":"Pine Creek MR","group":"Commercial"},{"id":26034,"name":"South Winds","group":"Commercial"},{"id":26035,"name":"Lanark MR","group":"Commercial"},{"id":26036,"name":"Midtown MR","group":"Commercial"},{"id":26037,"name":"Yorkville MR","group":"Commercial"},{"id":26038,"name":"Key Ranch Airdrie MR","group":"Commercial"},{"id":26039,"name":"Huxley MR","group":"Commercial"},{"id":26040,"name":"Lewisberg MR","group":"Commercial"},{"id":26041,"name":"Clearwater MR","group":"Commercial"},{"id":26042,"name":"Rockland MR","group":"Commercial"},{"id":26043,"name":"Greystone MR / Summit","group":"Commercial"},{"id":26044,"name":"Alpine Park MR","group":"Commercial"},{"id":26045,"name":"St. Patricks Island","group":"Commercial"},{"id":26046,"name":"Sawgrass Med./T.C.","group":"Commercial"},{"id":26047,"name":"Cobblestone MR","group":"Commercial"},{"id":26048,"name":"Chaparral Meadows MR","group":"Commercial"},{"id":26101,"name":"Seton","group":"Maintenance"},{"id":26102,"name":"Livingston","group":"Maintenance"},{"id":26103,"name":"Glacier Ridge","group":"Maintenance"},{"id":26104,"name":"Belmont/Pinecreek/Sirocco/Quadra/Thiessen","group":"Maintenance"},{"id":26105,"name":"Mahogany","group":"Maintenance"},{"id":26106,"name":"Alpine Park","group":"Maintenance"},{"id":26107,"name":"Crown Park","group":"Maintenance"},{"id":26108,"name":"Carrington","group":"Maintenance"},{"id":26109,"name":"Rockland Park","group":"Maintenance"},{"id":26110,"name":"Rangeview","group":"Maintenance"},{"id":26111,"name":"Greystone","group":"Maintenance"},{"id":26112,"name":"Heartland","group":"Maintenance"},{"id":26113,"name":"Cornerbrook/Cornerstone","group":"Maintenance"},{"id":26114,"name":"Cityscape","group":"Maintenance"},{"id":26115,"name":"Silverton/Silverado","group":"Maintenance"},{"id":26116,"name":"Montrose","group":"Maintenance"},{"id":26117,"name":"Yorkville","group":"Maintenance"},{"id":26118,"name":"Chelsea","group":"Maintenance"},{"id":26119,"name":"District South","group":"Maintenance"},{"id":26120,"name":"Darcy/Wedderburn","group":"Maintenance"},{"id":26121,"name":"Belvedere","group":"Maintenance"},{"id":26122,"name":"Chinook Gate","group":"Maintenance"},{"id":26123,"name":"Sage Hill/Nolan Hill","group":"Maintenance"},{"id":26124,"name":"Cobblestone","group":"Maintenance"},{"id":26125,"name":"Goldwynn","group":"Maintenance"},{"id":26126,"name":"Heritage Hills","group":"Maintenance"},{"id":26127,"name":"Hotchkiss","group":"Maintenance"},{"id":26128,"name":"Lanark","group":"Maintenance"},{"id":26129,"name":"Legacy","group":"Maintenance"},{"id":26130,"name":"Riversong","group":"Maintenance"},{"id":26131,"name":"West Springs","group":"Maintenance"},{"id":26132,"name":"Midtown","group":"Maintenance"},{"id":26133,"name":"South Shores","group":"Maintenance"},{"id":26134,"name":"Sunset Ridge","group":"Maintenance"},{"id":26135,"name":"Shawnee","group":"Maintenance"},{"id":26136,"name":"University","group":"Maintenance"},{"id":26137,"name":"Vista Crossing","group":"Maintenance"},{"id":26138,"name":"Watermark","group":"Maintenance"},{"id":26139,"name":"Lewiston/Lewisburg","group":"Maintenance"},{"id":26140,"name":"Chestermere CB Repairs","group":"Maintenance"},{"id":26201,"name":"Rangeview","group":"New Construction"},{"id":26202,"name":"Belmont/Pinecreek/Thiessen/Sirocco/Creekview","group":"New Construction"},{"id":26203,"name":"Wildflower","group":"New Construction"},{"id":26204,"name":"Glacier Ridge","group":"New Construction"},{"id":26206,"name":"Mahogany","group":"New Construction"},{"id":26207,"name":"Sawgrass","group":"New Construction"},{"id":26208,"name":"Livingston","group":"New Construction"},{"id":26209,"name":"Wolfwillow","group":"New Construction"},{"id":26210,"name":"Alpine Park","group":"New Construction"},{"id":26211,"name":"Starling","group":"New Construction"},{"id":26212,"name":"Seton/Seton Ridge","group":"New Construction"},{"id":26213,"name":"Huxley / Princeton","group":"New Construction"},{"id":26214,"name":"Nostalgia","group":"New Construction"},{"id":26215,"name":"Wolfwillow Swales","group":"New Construction"},{"id":26216,"name":"Liberty","group":"New Construction"},{"id":26217,"name":"Rose Ranch","group":"New Construction"},{"id":26218,"name":"Robinson","group":"New Construction"},{"id":26219,"name":"Silverado","group":"New Construction"},{"id":26220,"name":"Hazel","group":"New Construction"},{"id":26221,"name":"Chestermere Blvd. Upgrades","group":"New Construction"},{"id":26222,"name":"Silverado/Silverton","group":"New Construction"},{"id":26223,"name":"Chelsea","group":"New Construction"},{"id":26224,"name":"Carrington","group":"New Construction"},{"id":26225,"name":"Cityscape","group":"New Construction"},{"id":26226,"name":"Hotchkiss","group":"New Construction"},{"id":26227,"name":"Darcy Ranch/Wedderburn","group":"New Construction"},{"id":26228,"name":"Legacy","group":"New Construction"},{"id":26229,"name":"Esker Park","group":"New Construction"},{"id":26230,"name":"Yorkville","group":"New Construction"},{"id":26231,"name":"Sunset Ridge","group":"New Construction"},{"id":26232,"name":"Shawnee","group":"New Construction"},{"id":26233,"name":"Lewisburg","group":"New Construction"},{"id":26234,"name":"Cornerstone","group":"New Construction"},{"id":26235,"name":"Cobblestone","group":"New Construction"},{"id":26236,"name":"South Foothills","group":"New Construction"},{"id":26237,"name":"Tillotson","group":"New Construction"},{"id":26238,"name":"Rockland","group":"New Construction"},{"id":26239,"name":"Chaparral Meadows","group":"New Construction"},{"id":26240,"name":"District North","group":"New Construction"},{"id":26241,"name":"Lanark","group":"New Construction"},{"id":26242,"name":"Aspen Woods","group":"New Construction"},{"id":26243,"name":"Goldwynn","group":"New Construction"},{"id":26244,"name":"Logan Landing","group":"New Construction"},{"id":26245,"name":"Monarch","group":"New Construction"},{"id":26246,"name":"Riversong","group":"New Construction"},{"id":26250,"name":"Morton Ridge","group":"New Construction"},{"id":26252,"name":"Montrose","group":"New Construction"}];
  const JOB_MAP = new Map(JOBS.map(j=>[String(j.id),j]));
  const FOREMEN = ['Dave','Johnny','Tony','Jay','Carlos','Eddie'];
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
  const freshReport=()=>({id:uid(),date:today(),foreman:'',subdivision:'',jobNumber:'',phase:'',notes:'',pourType:'machine',handVolume:'',mode:'allocated',combinedOrdered:'',combinedReturned:'',lines:[freshLine()],updatedAt:new Date().toISOString(),sentAt:null});
  const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  let report=readJSON(STORE_DRAFT,null)||freshReport();
  let saved=readJSON(STORE_SAVED,[]);
  let activeTab='report',toastTimer;
  let reportCounter=0;
  let jobDropdownOpen=false;
  let activeJobIndex=0;
  let matchingJobs=[];
  const displayJob = job => `${job.id} — ${job.name}`;
  const currentJob = rep => JOB_MAP.get(String(rep.jobNumber??''));
  function closeJobChoices(){
    jobDropdownOpen=false;
    byId('jobOptions').classList.add('hidden');
    byId('subdivision').setAttribute('aria-expanded','false');
    byId('jobToggle').setAttribute('aria-expanded','false');
    byId('subdivision').removeAttribute('aria-activedescendant');
  }
  function highlightJob(scroll=false){
    const choices=byId('jobOptions');
    const buttons=qsa('[data-job]',choices);
    buttons.forEach((el,i)=>{
      const active=i===activeJobIndex;
      el.classList.toggle('active',active);
      el.setAttribute('aria-selected',String(active));
    });
    const activeEl=buttons[activeJobIndex];
    if(activeEl){
      byId('subdivision').setAttribute('aria-activedescendant',activeEl.id);
      if(scroll){
        const visibleTop=choices.scrollTop;
        const visibleBottom=visibleTop+choices.clientHeight;
        const itemTop=activeEl.offsetTop;
        if(itemTop<visibleTop)choices.scrollTop=itemTop;
        else if(itemTop+activeEl.offsetHeight>visibleBottom)choices.scrollTop=itemTop+activeEl.offsetHeight-choices.clientHeight;
      }
    }else byId('subdivision').removeAttribute('aria-activedescendant');
  }
  function showJobChoices(query=''){
    const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    matchingJobs=JOBS.filter(j=>terms.every(term=>(`${j.id} ${j.name} ${j.group}`).toLocaleLowerCase().includes(term)));
    const choices=byId('jobOptions');
    choices.innerHTML=`<div class="job-options-header">${matchingJobs.length} of ${JOBS.length} jobs · Scroll or type to filter</div>`+
      (matchingJobs.length?matchingJobs.map(j=>`<button type="button" role="option" id="job-${j.id}" data-job="${j.id}" aria-selected="false"><span><b>${j.id}</b> <span class="job-option-name">${esc(j.name)}</span></span><small>${esc(j.group)}</small></button>`).join(''):
      '<div class="job-no-match">No matches. Try a different job number or subdivision name.</div>');
    choices.scrollTop=0;
    activeJobIndex=0;
    jobDropdownOpen=true;
    choices.classList.remove('hidden');
    byId('subdivision').setAttribute('aria-expanded','true');
    byId('jobToggle').setAttribute('aria-expanded','true');
    highlightJob();
    byId('jobHint').textContent=matchingJobs.length?`${matchingJobs.length} jobs shown · Tap one to select.`:'No matching jobs. Clear your search to view the full list.';
  }
  function selectJob(job){
    report.jobNumber=String(job.id);
    report.subdivision=job.name;
    byId('subdivision').value=displayJob(job);
    byId('jobHint').textContent=`Selected ${job.id} — ${job.name} · ${job.group}`;
    closeJobChoices();
    persist();updateCalculations();clearError();
  }
  function renderJobField(){
    const job=currentJob(report);
    byId('subdivision').value=job?displayJob(job):report.subdivision||'';
    byId('jobHint').textContent=job?`Selected ${job.id} — ${job.name} · ${job.group}`:`Tap to browse all ${JOBS.length} jobs, or type a name or job number.`;
    closeJobChoices();
  }
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
    for(const [key,id] of [['date','pourDate'],['phase','phase'],['notes','notes'],['combinedOrdered','combinedOrdered'],['combinedReturned','combinedReturned'],['handVolume','handVolume']])byId(id).value=report[key]??'';
    const f=byId('foreman');
    f.innerHTML='<option value="">Select foreman...</option>'+FOREMEN.map(name=>`<option value="${name}">${name}</option>`).join('')+(report.foreman&&!FOREMEN.includes(report.foreman)?`<option value="${esc(report.foreman)}">${esc(report.foreman)} (previous report)</option>`:'');
    f.value=report.foreman||'';
    renderJobField();
    qsa('[data-pour-type]').forEach(x=>{const chosen=x.dataset.pourType===report.pourType;x.classList.toggle('selected',chosen);x.setAttribute('aria-pressed',String(chosen));});
    const hand=report.pourType==='hand';
    byId('handPourPanel').classList.toggle('hidden',!hand);
    byId('machineVolumePanel').classList.toggle('hidden',hand);
    byId('machineStructuresPanel').classList.toggle('hidden',hand);
    byId('formulaPanel').classList.toggle('hidden',hand);
    qsa('[data-mode]').forEach(x=>x.classList.toggle('selected',x.dataset.mode===report.mode));
    byId('combinedFields').classList.toggle('hidden',hand||report.mode!=='combined');
    byId('modeExplanation').textContent=report.mode==='combined'?'One order covers all listed structures. Total waste is calculated accurately; individual waste percentages are not allocated.':'Allocate orders to each structure to see individual waste percentages. Do not count the same truckload twice.';
    clearError();byId('shareNotice').classList.add('hidden');renderLines();
  }
  function validate(){
    const missing=[];
    if(!report.date)missing.push('pour date');
    if(!report.foreman.trim())missing.push('foreman');
    if(!report.subdivision.trim()||!currentJob(report))missing.push('select a subdivision / job number from the list');
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
    return `Marmot-Pour-${safe(rep.date)}-${rep.jobNumber?safe(rep.jobNumber)+'-':''}${safe(rep.subdivision)}-${safe(rep.phase)}-${rep.pourType==='hand'?'Hand':'Machine'}.xlsx`;
  }
  function makeFile(rep=report){return new File([window.MarmotExcel.create(rep,RATES)],exportFilename(rep),{type:window.MarmotExcel.mime});}
  function download(file){
    const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
  }
  function exportExcel(){if(!check())return;download(makeFile());saveReport();flash('Excel report exported');}
  const RECIPIENT='estimating@marmotconstruction.com';
  function showShareNotice(message){const el=byId('shareNotice');el.textContent=message;el.classList.remove('hidden');}
  function emailSubject(){
    return `Marmot ${report.pourType==='hand'?'Hand':'Machine'} Pour — ${report.jobNumber||''} ${report.subdivision} — ${report.phase} — ${report.date}`;
  }
  function emailBody(){
    const c=getCalculation();
    const type=report.pourType==='hand'?'Hand pour':'Machine pour';
    const lines=[
      'Marmot Construction — Daily Concrete Pour Report',
      '',
      `Date: ${report.date}`,
      `Foreman: ${report.foreman}`,
      `Job number: ${report.jobNumber||'Unspecified'}`,
      `Subdivision: ${report.subdivision}`,
      `Phase: ${report.phase}`,
      `Pour type: ${type}`
    ];
    if(report.pourType==='hand'){
      lines.push(`Concrete poured: ${fmt(c.ordered)} m³`);
    }else{
      lines.push(`Concrete ordered: ${fmt(c.ordered)} m³`,
        `Concrete returned: ${fmt(c.returned)} m³`,
        `Actual concrete used: ${fmt(c.used)} m³`,
        `Theoretical volume: ${fmt(c.theoretical,3)} m³`,
        `Waste: ${fmt(c.wastePct,1)}%`);
    }
    if(report.notes.trim())lines.push('',`Notes: ${report.notes.trim().slice(0,500)}`);
    lines.push('',`Excel filename: ${exportFilename()}`,'','Please see the Excel report attached.');
    return lines.join('\n');
  }
  async function shareExcel(){
    if(!check())return;
    // Direct file share only: foremen never have to download and attach a file manually.
    const file=makeFile();
    byId('shareNotice').classList.add('hidden');
    const canShareFile=typeof navigator.share==='function' &&
      (typeof navigator.canShare!=='function' || navigator.canShare({files:[file]}));
    if(!canShareFile){
      showShareNotice('This browser cannot open the native Excel share sheet. Open the app in Safari on your iPhone and tap Share Excel Report.');
      return;
    }
    try{
      // iOS shares the file as an attachment. Recipients cannot be prefilled by the Web Share API.
      await navigator.share({files:[file],title:emailSubject()});
      saveReport();
      showShareNotice('The Excel report was shared with your selected app. If you chose Mail, enter estimating@marmotconstruction.com as the recipient and tap Send.');
    }catch(err){
      if(err && err.name==='AbortError')return;
      showShareNotice('The share sheet could not attach the Excel report. Open this app in iPhone Safari and try Share Excel Report again.');
    }
  }
  async function copyRecipient(){
    try{
      if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(RECIPIENT);}
      else{
        const temp=document.createElement('textarea');temp.value=RECIPIENT;temp.style.position='fixed';temp.style.opacity='0';document.body.append(temp);temp.select();
        const ok=document.execCommand('copy');temp.remove();if(!ok)throw new Error('Cannot copy');
      }
      flash('Estimating email copied — paste it into Mail');
    }catch{flash(`Email: ${RECIPIENT}`);}
  }
  function renderSaved(){
    byId('savedCount').textContent=String(saved.length);
    const view=byId('savedList');
    if(!saved.length){view.innerHTML='<div class="empty-state">No saved reports yet. Complete or save a pour report to see it here.</div>';return;}
    view.innerHTML=saved.map(rep=>{
      const short=rep.pourType==='hand'
        ?`${rep.date||'No date'} · ${rep.foreman||'Unassigned'} · Hand pour · ${fmt(num(rep.handVolume)??0)} m³`
        :`${rep.date||'No date'} · ${rep.foreman||'Unassigned'} · Machine pour · ${rep.lines?.length||0} structures`;
      return `<div class="saved-entry"><div><h3>${rep.sentAt?'<span class="sent-mark">SENT</span>':''}${rep.jobNumber?esc(rep.jobNumber)+' — ':''}${esc(rep.subdivision||'Untitled subdivision')} · ${esc(rep.phase||'No phase')}</h3><p>${esc(short)}</p></div><div class="saved-actions"><button type="button" data-load="${esc(rep.id)}">Open</button><button type="button" data-export="${esc(rep.id)}">Excel</button><button type="button" class="danger" data-delete="${esc(rep.id)}">Delete</button></div></div>`;
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
    [['pourDate','date'],['foreman','foreman'],['phase','phase'],['notes','notes'],['combinedOrdered','combinedOrdered'],['combinedReturned','combinedReturned'],['handVolume','handVolume']].forEach(([id,field])=>byId(id).addEventListener('input',e=>{report[field]=e.target.value;persist();updateCalculations();clearError();}));
    byId('subdivision').addEventListener('focus',e=>{
      // On focus the full, scrollable list opens. Replacing selected text is easy.
      if(currentJob(report))e.target.select();
      showJobChoices('');
    });
    byId('subdivision').addEventListener('input',e=>{
      report.jobNumber='';report.subdivision=e.target.value;
      persist();clearError();showJobChoices(e.target.value);
    });
    byId('jobToggle').addEventListener('click',()=>{
      if(jobDropdownOpen){closeJobChoices();return;}
      showJobChoices('');
    });
    byId('subdivision').addEventListener('keydown',e=>{
      if(e.key==='Escape'){closeJobChoices();return;}
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){
        e.preventDefault();
        if(!jobDropdownOpen)showJobChoices('');
        if(!matchingJobs.length)return;
        activeJobIndex=(activeJobIndex+(e.key==='ArrowDown'?1:-1)+matchingJobs.length)%matchingJobs.length;
        highlightJob(true);
      }else if(e.key==='Enter'&&jobDropdownOpen&&matchingJobs[activeJobIndex]){
        e.preventDefault();selectJob(matchingJobs[activeJobIndex]);
      }
    });
    byId('jobOptions').addEventListener('click',e=>{
      const button=e.target.closest('[data-job]');if(!button)return;
      const job=JOB_MAP.get(button.dataset.job);if(job)selectJob(job);
    });
    // Do not close on input blur: iPhone moves focus before dispatching a tap to the option.
    document.addEventListener('pointerdown',e=>{if(!e.target.closest('.job-lookup'))closeJobChoices();});
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
    byId('shareButton').addEventListener('click',shareExcel);
    byId('copyRecipientButton').addEventListener('click',copyRecipient);
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
