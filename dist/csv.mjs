import { cleanRoadmap, validateWorkspace, COLLECTIONS, MAX_BACKUP_BYTES } from './workspace.mjs';

export const MAX_ROADMAP_CSV_BYTES=2_000_000;
const byteLength=s=>new TextEncoder().encode(s).length;
// Encode potentially executable spreadsheet cells reversibly. All generated files
// declare this convention with a versioned format column; ordinary CSVs aren't
// silently unescaped. JSON cells start with { or [ and need no formula escaping.
const safe=s=>{s=String(s??'');return s.startsWith("'")||/^\s*[=+\-@]/.test(s)?"'"+s:s;};
const unsafe=s=>s.startsWith("'")&&(s[1]==="'"||/^\s*[=+\-@]/.test(s.slice(1)))?s.slice(1):s;
export function encodeCsv(rows){return rows.map(row=>row.map(v=>'"'+safe(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';}
export function parseCsv(source,limit=MAX_BACKUP_BYTES){
  if(typeof source!=='string'||byteLength(source)>limit)throw new Error('CSV exceeds the supported file limit.');
  source=source.replace(/^\uFEFF/,'');const rows=[];let row=[],cell='',quoted=false,closed=false;
  const pushCell=()=>{row.push(cell);cell='';closed=false;};
  const pushRow=()=>{pushCell();if(row.some(v=>v!==''))rows.push(row);row=[];};
  for(let i=0;i<source.length;i++){
    const c=source[i];
    if(quoted){if(c==='"'){if(source[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=c;continue;}
    if(c==='"'){if(cell||closed)throw new Error('Invalid CSV quoting.');quoted=true;}
    else if(c===',')pushCell();
    else if(c==='\r'||c==='\n'){if(c==='\r'&&source[i+1]==='\n')i++;pushRow();}
    else{if(closed)throw new Error('Unexpected text after a quoted CSV cell.');cell+=c;}
  }
  if(quoted)throw new Error('Unclosed quoted CSV cell.');
  if(cell||closed||row.length)pushRow();
  if(rows.length<2)throw new Error('CSV has no data rows.');
  return rows;
}
function records(source,header,format,limit){
  const rows=parseCsv(source,limit);if(JSON.stringify(rows.shift())!==JSON.stringify(header))throw new Error('Unsupported CSV columns. Use the matching Mightora CSV export as a template.');
  return rows.map(row=>{if(row.length!==header.length)throw new Error('CSV row has the wrong number of columns.');if(row[0]!==format)throw new Error('Unsupported CSV format or version.');return Object.fromEntries(header.map((k,i)=>[k,unsafe(row[i])]));});
}
const ROADMAP_HEADER=['format','row_type','id','title','client','start_date','quarters','quarter_labels','workstream_id','workstream_name','colour','start','finish','status','owner','description','dependencies'];
export function roadmapToCsv(input){
  const r=cleanRoadmap(input),rows=[ROADMAP_HEADER],format='mightora-roadmap-csv-v1';
  rows.push([format,'roadmap','',r.title,r.client,r.startDate,r.periodCount,JSON.stringify(r.quarterLabels||[]),'','','','','','','','','']);
  for(const t of r.tracks)rows.push([format,'workstream',t.id,'','','','','', '',t.name,t.color,'','','','','','']);
  for(const a of r.activities)rows.push([format,'activity',a.id,a.title,'','','','',a.trackId,'','',a.start,a.end,a.status,a.owner,a.description,JSON.stringify(a.dependencies)]);
  const csv=encodeCsv(rows);if(byteLength(csv)>MAX_ROADMAP_CSV_BYTES)throw new Error('Roadmap CSV exceeds 2 MB.');return csv;
}
export function roadmapFromCsv(source){
  const rows=records(source,ROADMAP_HEADER,'mightora-roadmap-csv-v1',MAX_ROADMAP_CSV_BYTES),settings=rows.filter(r=>r.row_type==='roadmap');
  if(settings.length!==1)throw new Error('CSV needs exactly one roadmap settings row.');
  if(rows.some(r=>!['roadmap','workstream','activity'].includes(r.row_type)))throw new Error('Unknown roadmap CSV row type.');
  const s=settings[0],r={schemaVersion:1,title:s.title,client:s.client,startDate:s.start_date,periodCount:Number(s.quarters),tracks:rows.filter(r=>r.row_type==='workstream').map(t=>({id:t.id,name:t.workstream_name,color:t.colour})),activities:rows.filter(r=>r.row_type==='activity').map(a=>{let dependencies;try{dependencies=JSON.parse(a.dependencies||'[]');}catch{throw new Error(`Invalid dependencies JSON for activity ${a.id}.`);}return {id:a.id,title:a.title,trackId:a.workstream_id,start:a.start,end:a.finish,status:a.status,owner:a.owner,description:a.description,dependencies};})};
  if(s.quarter_labels){const labels=JSON.parse(s.quarter_labels);if(labels.length)r.quarterLabels=labels;}
  return cleanRoadmap(r);
}
const WORKSPACE_HEADER=['format','collection','id','data_json'];
export function workspaceToCsv(w){
  validateWorkspace(w);const format='mightora-workspace-csv-v1',rows=[WORKSPACE_HEADER,[format,'workspace','',JSON.stringify({format:w.format,schemaVersion:w.schemaVersion,revision:w.revision})]];
  for(const name of COLLECTIONS)for(const r of w[name])rows.push([format,name,r.id,JSON.stringify(r)]);
  const csv=encodeCsv(rows);if(byteLength(csv)>MAX_BACKUP_BYTES)throw new Error('Workspace CSV exceeds 50 MB.');return csv;
}
export function workspaceFromCsv(source){
  const rows=records(source,WORKSPACE_HEADER,'mightora-workspace-csv-v1',MAX_BACKUP_BYTES),metadata=rows.filter(r=>r.collection==='workspace');
  if(metadata.length!==1)throw new Error('CSV needs exactly one workspace metadata row.');
  const json=r=>{try{return JSON.parse(r.data_json);}catch{throw new Error('Invalid JSON in workspace CSV detail cell.');}};
  const w={...json(metadata[0]),...Object.fromEntries(COLLECTIONS.map(k=>[k,[]]))};
  for(const row of rows)if(row.collection!=='workspace'){if(!COLLECTIONS.includes(row.collection))throw new Error('Unknown workspace CSV collection.');const data=json(row);if(data?.id!==row.id)throw new Error('CSV record ID and detail ID differ.');w[row.collection].push(data);}
  return validateWorkspace(w);
}
