/* Dependency-free Office Open XML (.xlsx) export. Runs entirely on the device. */
(function (root) {
  'use strict';
  const enc = new TextEncoder();
  const workbookMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const xml = (v) => String(v == null ? '' : v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const col = (n) => { let s=''; for(n++;n;n=Math.floor((n-1)/26)) s=String.fromCharCode(65+(n-1)%26)+s; return s; };
  const letter = (r,c) => col(c)+r;
  const row = (n,cells,style=0) => `<row r="${n}">${cells.map((v,i) => cell(letter(n,i),v,style)).join('')}</row>`;
  function cell(addr,v,style=0) {
    if(v===null || v===undefined || v==='') return '';
    if (typeof v==='number' && Number.isFinite(v)) return `<c r="${addr}" s="${style}"><v>${v}</v></c>`;
    return `<c r="${addr}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`;
  }
  function formula(addr,f,value,style=0) {
    return `<c r="${addr}" s="${style}"><f>${xml(f)}</f><v>${Number.isFinite(value)?value:0}</v></c>`;
  }
  const values = (r, vals, styles) => `<row r="${r}">${vals.map((v,i)=>cell(letter(r,i),v,Array.isArray(styles)?styles[i]||0:styles||0)).join('')}</row>`;
  function makeReportSheet(report, rates, calc) {
    const rateMap = new Map(rates.map(x=>[x.id,x]));
    const lines=report.lines.filter(x=>rateMap.has(x.structureId));
    const r = [];
    r.push(`<row r="1">${cell('A1','MARMOT  /  DAILY CONCRETE POUR REPORT',1)}</row>`);
    r.push(values(3,['POUR DATE',report.date,'FOREMAN',report.foreman], [2,0,2,0]));
    r.push(values(4,['JOB NUMBER',report.jobNumber?Number(report.jobNumber):'', 'SUBDIVISION',report.subdivision], [2,0,2,0]));
    const hand=report.pourType==='hand';
    r.push(values(5,['PHASE',report.phase, 'POUR TYPE',hand?'HAND POUR':'MACHINE POUR'],[2,0,2,0]));
    r.push(values(6,['VOLUME METHOD',hand?'Volume only — no waste calculation':report.mode==='combined'?'Single combined order':'Allocated by structure'],[2,0]));
    r.push(values(7,['NOTES',report.notes||''],[2,0]));
    if(hand){
      const volume=Number(report.handVolume);
      if(!Number.isFinite(volume)||volume<=0)throw new Error('Hand pour volume must be greater than zero.');
      r.push(`<row r="8">${cell('A8','Hand pour: enter cubic metres poured only. Theoretical and waste are not applicable.',3)}</row>`);
      r.push(values(10,['DESCRIPTION','THICKNESS','ORDERED (m³)','RETURNED (m³)','POURED (m³)','MEASURED','UNIT','PULL RATE','THEORETICAL (m³)','EXCESS (m³)','WASTE %'],2));
      r.push(`<row r="11">${cell('A11','Hand-poured concrete')}${cell('E11',volume,5)}</row>`);
      r.push(`<row r="13">${cell('A13','DAILY TOTAL',2)}${formula('E13','SUM(E11:E11)',volume,5)}</row>`);
      r.push(`<row r="15">${cell('A15','No machine structure, theoretical or waste calculations for hand pours.',3)}</row>`);
      r.push(`<row r="16">${cell('A16','Source: Marmot PullSheet(1).xls. See Pull rates tab for reference.',3)}</row>`);
      const widths=[38,20,19,34,16,15,10,15,21,15,14];
      const cols=widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('');
      return sheetXml(`<sheetViews><sheetView workbookViewId="0"><pane ySplit="10" topLeftCell="A11" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${r.join('')}</sheetData><mergeCells count="2"><mergeCell ref="A1:K1"/><mergeCell ref="A8:K8"/></mergeCells>`);
    }
    r.push(`<row r="8">${cell('A8','Concrete volume in m³. Theoretical = measured quantity × pull rate. Waste % = (actual used − theoretical) ÷ theoretical.',3)}</row>`);
    const headers=['STRUCTURE','THICKNESS','ORDERED (m³)','RETURNED (m³)','USED (m³)','MEASURED','UNIT','PULL RATE','THEORETICAL (m³)','EXCESS (m³)','WASTE %'];
    r.push(values(10,headers,2));
    let orderSum=0, returnSum=0, theorySum=0;
    lines.forEach((line,i)=>{
      const rate=rateMap.get(line.structureId);
      const n=11+i;
      const qty=+line.quantity||0, ordered=+line.ordered||0, returned=+line.returned||0;
      const theor=qty*rate.rate;
      const used=ordered-returned;
      orderSum+=ordered;returnSum+=returned;theorySum+=theor;
      const cells=[];
      cells.push(cell('A'+n,rate.name,0));
      cells.push(cell('B'+n,rate.thickness?rate.thickness+' mm':'—'));
      if(report.mode!=='combined'){
        cells.push(cell('C'+n,ordered,4));
        cells.push(cell('D'+n,returned,4));
        cells.push(formula('E'+n,`C${n}-D${n}`,used,5));
      }
      cells.push(cell('F'+n,qty,4));
      cells.push(cell('G'+n,rate.unit==='m2'?'m²':'LM'));
      cells.push(cell('H'+n,rate.rate,6));
      cells.push(formula('I'+n,`F${n}*H${n}`,theor,5));
      if(report.mode!=='combined'){
        cells.push(formula('J'+n,`E${n}-I${n}`,used-theor,5));
        if(theor>0)cells.push(formula('K'+n,`IF(I${n}>0,J${n}/I${n},0)`,(used-theor)/theor,7));
      }
      r.push(`<row r="${n}">${cells.join('')}</row>`);
    });
    const end=10+lines.length;
    const totalRow=end+2;
    const combined=report.mode==='combined';
    const ordered=combined?(+report.combinedOrdered||0):orderSum;
    const returned=combined?(+report.combinedReturned||0):returnSum;
    const used=ordered-returned;
    let parts=[cell('A'+totalRow,'DAILY TOTAL',2)];
    if(combined){
      parts.push(cell('C'+totalRow,ordered,5));
      parts.push(cell('D'+totalRow,returned,5));
    }else{
      parts.push(formula('C'+totalRow,`SUM(C11:C${end})`,ordered,5));
      parts.push(formula('D'+totalRow,`SUM(D11:D${end})`,returned,5));
    }
    parts.push(formula('E'+totalRow,`C${totalRow}-D${totalRow}`,used,5));
    parts.push(formula('I'+totalRow,`SUM(I11:I${end})`,theorySum,5));
    parts.push(formula('J'+totalRow,`E${totalRow}-I${totalRow}`,used-theorySum,5));
    if(theorySum>0)parts.push(formula('K'+totalRow,`IF(I${totalRow}>0,J${totalRow}/I${totalRow},0)`,(used-theorySum)/theorySum,7));
    r.push(`<row r="${totalRow}">${parts.join('')}</row>`);
    r.push(`<row r="${totalRow+2}">${cell('A'+(totalRow+2),combined?'Combined concrete order: line-by-line waste is not allocated.':'Volumes are allocated to individual structures; do not enter the same truck order twice.',3)}</row>`);
    r.push(`<row r="${totalRow+3}">${cell('A'+(totalRow+3),'Source: Marmot PullSheet(1).xls. See Pull rates tab for reference.',3)}</row>`);
    const widths=[38,20,19,34,16,15,10,15,21,15,14];
    const cols=widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('');
    return sheetXml(`<sheetViews><sheetView workbookViewId="0"><pane ySplit="10" topLeftCell="A11" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${r.join('')}</sheetData><mergeCells count="2"><mergeCell ref="A1:K1"/><mergeCell ref="A8:K8"/></mergeCells>`);
  }
  function makeRatesSheet(rates) {
    const r=[];
    r.push(values(1,['PULL SHEET REFERENCE — READ ONLY'],1));
    r.push(values(3,['STRUCTURE','THICKNESS','UNIT','PULL RATE','SOURCE ROW','CATEGORY'],2));
    rates.forEach((rate,i)=>r.push(values(i+4,[rate.name,rate.thickness?rate.thickness+' mm':'—',rate.unit==='m2'?'m³/m²':'m³/LM',rate.rate,rate.sourceRow,rate.category],[0,0,0,6,0,0])));
    return sheetXml(`<sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="46" customWidth="1"/><col min="2" max="2" width="15" customWidth="1"/><col min="3" max="3" width="15" customWidth="1"/><col min="4" max="4" width="17" customWidth="1"/><col min="5" max="5" width="15" customWidth="1"/><col min="6" max="6" width="24" customWidth="1"/></cols><sheetData>${r.join('')}</sheetData><mergeCells count="1"><mergeCell ref="A1:F1"/></mergeCells>`);
  }
  function sheetXml(body){return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${body}</worksheet>`;}
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="0.0000"/><numFmt numFmtId="165" formatCode="0.0%"/></numFmts><fonts count="3"><font><sz val="11"/><name val="Aptos"/><color rgb="FF223047"/></font><font><b/><sz val="16"/><name val="Aptos Display"/><color rgb="FFFFFFFF"/></font><font><b/><sz val="10"/><name val="Aptos"/><color rgb="FFFFFFFF"/></font></fonts><fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF17253D"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0E7490"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDBEAFE"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="8"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="0" xfId="0" applyFill="1" applyFont="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="4" borderId="0" xfId="0" applyNumberFormat="1" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="4" borderId="0" xfId="0" applyNumberFormat="1" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="4" borderId="0" xfId="0" applyNumberFormat="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbook=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Pour report" sheetId="1" r:id="rId1"/><sheet name="Pull rates" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`;
  const workbookRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const crcTable = (()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
  function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=crcTable[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function zip(files){
    const local=[],central=[];let offset=0;
    for(const [name,str] of Object.entries(files)){
      const nb=enc.encode(name), db=enc.encode(str), crc=crc32(db);
      const lh=new Uint8Array(30+nb.length);let dv=new DataView(lh.buffer);
      dv.setUint32(0,0x04034b50,true);dv.setUint16(4,20,true);dv.setUint16(6,0,true);dv.setUint16(8,0,true);
      dv.setUint32(14,crc,true);dv.setUint32(18,db.length,true);dv.setUint32(22,db.length,true);dv.setUint16(26,nb.length,true);lh.set(nb,30);
      local.push(lh,db);
      const ch=new Uint8Array(46+nb.length);dv=new DataView(ch.buffer);
      dv.setUint32(0,0x02014b50,true);dv.setUint16(4,20,true);dv.setUint16(6,20,true);dv.setUint16(8,0,true);dv.setUint16(10,0,true);dv.setUint32(16,crc,true);
      dv.setUint32(20,db.length,true);dv.setUint32(24,db.length,true);dv.setUint16(28,nb.length,true);dv.setUint32(42,offset,true);ch.set(nb,46);
      central.push(ch);offset+=lh.length+db.length;
    }
    const centerSize=central.reduce((s,x)=>s+x.length,0);
    const footer=new Uint8Array(22),dv=new DataView(footer.buffer);
    dv.setUint32(0,0x06054b50,true);dv.setUint16(8,central.length,true);dv.setUint16(10,central.length,true);dv.setUint32(12,centerSize,true);dv.setUint32(16,offset,true);
    return new Blob([...local,...central,footer],{type:workbookMime});
  }
  function create(report,rates){
    const files={
      '[Content_Types].xml':contentTypes,
      '_rels/.rels':rootRels,
      'xl/workbook.xml':workbook,
      'xl/_rels/workbook.xml.rels':workbookRels,
      'xl/styles.xml':styles,
      'xl/worksheets/sheet1.xml':makeReportSheet(report,rates),
      'xl/worksheets/sheet2.xml':makeRatesSheet(rates)
    };
    return zip(files);
  }
  root.MarmotExcel={create,mime:workbookMime};
})(typeof window==='undefined'?globalThis:window);
