import { newId } from './ids.mjs';
import { seedRoadmap, validateRoadmap, validateReadiness } from './model.mjs';

export const STORAGE_KEY='mightora-local-workspace-v1';
export const MAX_BACKUP_BYTES=50*1024*1024;
export const COLLECTIONS=['roadmaps','templates','snapshots','comments','reviews','reports','audit','views'];
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const fail=message=>{throw new Error(message);};
const text=(v,max=160,empty=false)=>typeof v==='string'&&v.length<=max&&(empty||v.trim().length>0);
const integer=v=>Number.isSafeInteger(v)&&v>=0;
function keys(row,fields){if(!object(row)||Object.keys(row).some(k=>!fields.includes(k)))fail('Unsupported workspace fields.');}
const FIELDS={roadmaps:['id','roadmap','revision','updatedAt'],templates:['id','name','roadmap','createdAt'],snapshots:['id','roadmapId','revision','roadmap','at'],comments:['id','roadmapId','activityId','author','text','at'],reviews:['id','roadmapId','revision','reviewer','status','note','at'],reports:['id','at','roadmaps','totals'],audit:['id','action','resourceId','detail','at'],views:['id','roadmapId','name','query','status','view']};
export function cleanRoadmap(source){
  const r={schemaVersion:source.schemaVersion,title:source.title,client:source.client,startDate:source.startDate,periodCount:source.periodCount,tracks:source.tracks.map(t=>({id:t.id,name:t.name,color:t.color})),activities:source.activities.map(a=>({id:a.id,title:a.title,trackId:a.trackId,start:a.start,end:a.end,status:a.status,owner:a.owner,description:a.description,dependencies:[...a.dependencies]}))};
  if(source.quarterLabels)r.quarterLabels=[...source.quarterLabels];
  return validateReadiness(validateRoadmap(r));
}
export function emptyWorkspace(){return {format:'mightora-local-workspace',schemaVersion:1,revision:0,...Object.fromEntries(COLLECTIONS.map(k=>[k,[]]))};}
export function validateWorkspace(w){
  keys(w,['format','schemaVersion','revision',...COLLECTIONS]);
  if(w.format!=='mightora-local-workspace'||w.schemaVersion!==1||!integer(w.revision))fail('Unsupported workspace format or version.');
  const sets={};
  for(const name of COLLECTIONS){
    const rows=w[name],limit=name==='roadmaps'?1000:name==='templates'?100:100000;
    if(!Array.isArray(rows)||rows.length>limit)fail(`Workspace exceeds the ${name} limit.`);
    sets[name]=new Set();
    for(const row of rows){keys(row,FIELDS[name]);if(!text(row.id)||sets[name].has(row.id))fail(`Invalid or duplicate ${name} ID.`);sets[name].add(row.id);}
  }
  for(const name of ['roadmaps','templates','snapshots'])for(const r of w[name]){cleanRoadmap(r.roadmap);if(name==='templates'){if(!text(r.name,120)||!integer(r.createdAt))fail('Invalid template.');}else if(!integer(r.revision)||!integer(name==='roadmaps'?r.updatedAt:r.at))fail('Invalid version history.');}
  for(const name of ['snapshots','comments','reviews','views'])for(const r of w[name]){
    if(!sets.roadmaps.has(r.roadmapId))fail(`Missing roadmap reference in ${name}.`);
    if(name==='comments'&&(!text(r.author,100)||!text(r.text,2000)||!(r.activityId===null||text(r.activityId,80))||!integer(r.at)))fail('Invalid note.');
    if(name==='reviews'&&(!integer(r.revision)||!text(r.reviewer,100)||!['Pending','Approved','Changes requested','Archived'].includes(r.status)||!text(r.note,2000,true)||!integer(r.at)))fail('Invalid review.');
    if(name==='views'&&(!text(r.name,80)||!text(r.query,500,true)||!['','Planned','In progress','Done','On hold','blocked','conflict'].includes(r.status)||!['roadmap','dependencies','activities'].includes(r.view)))fail('Invalid saved view.');
  }
  for(const r of w.audit)if(!text(r.action)||!text(r.resourceId)||!text(r.detail,2000,true)||!integer(r.at))fail('Invalid change log.');
  for(const r of w.reports){
    if(!integer(r.at)||!Array.isArray(r.roadmaps)||r.roadmaps.length>1000)fail('Invalid report.');
    keys(r.totals,['roadmaps','activities','done','inProgress']);if(['roadmaps','activities','done','inProgress'].some(k=>!integer(r.totals[k])))fail('Invalid report totals.');
    for(const s of r.roadmaps){keys(s,['id','title','client','revision','activities','done','inProgress']);if(!text(s.id)||!text(s.title,120)||!text(s.client,120)||['revision','activities','done','inProgress'].some(k=>!integer(s[k])))fail('Invalid report summary.');}
  }
  if(new TextEncoder().encode(JSON.stringify(w)).length>MAX_BACKUP_BYTES)fail('Workspace exceeds the 50 MB backup limit.');
  return w;
}
export function appendRoadmap(w,roadmap,now=Date.now()){
  const record={id:newId(),roadmap:cleanRoadmap(roadmap),revision:1,updatedAt:now};w.roadmaps.push(record);return record;
}
export function saveRecord(w,id,roadmap,expectedRevision,now=Date.now()){
  const r=w.roadmaps.find(r=>r.id===id);if(!r)fail('Roadmap no longer exists. Reload to continue.');
  if(r.revision!==expectedRevision)fail('This roadmap changed in another tab. Reload before saving.');
  const next=cleanRoadmap(roadmap);
  w.snapshots.push({id:newId(),roadmapId:id,revision:r.revision,roadmap:structuredClone(r.roadmap),at:r.updatedAt});
  r.roadmap=next;r.revision++;r.updatedAt=now;w.audit.push({id:newId(),action:'Roadmap saved',resourceId:id,detail:`Revision ${r.revision}`,at:now});return r;
}
export function importWorkspace(current,input,mode='add'){
  validateWorkspace(current);validateWorkspace(input);if(!['add','replace'].includes(mode))fail('Choose add or replace.');
  const result=mode==='replace'?emptyWorkspace():structuredClone(current),copy=structuredClone(input),maps={};
  for(const name of COLLECTIONS)maps[name]=new Map(copy[name].map(r=>[r.id,newId()]));
  for(const name of COLLECTIONS)for(const row of copy[name]){
    const oldId=row.id;row.id=maps[name].get(oldId);
    if(row.roadmapId)row.roadmapId=maps.roadmaps.get(row.roadmapId);
    if(row.resourceId)for(const map of Object.values(maps))if(map.has(row.resourceId)){row.resourceId=map.get(row.resourceId);break;}
    if(name==='reports')for(const r of row.roadmaps)r.id=maps.roadmaps.get(r.id)||r.id;
    result[name].push(row);
  }
  result.revision=current.revision;return validateWorkspace(result);
}
// One-way conversion of earlier browser saves and Markdown backups. Account,
// membership and subscription records are deliberately outside the local model.
export function migrateLegacy(db){
  const data=db.format==='mightora-workspace-backup'?db.data:db,w=emptyWorkspace();
  const people=new Map((data.people||data.users||[]).map(p=>[p.id,p.name]));
  for(const r of data.roadmaps||[])w.roadmaps.push({id:r.id,roadmap:cleanRoadmap(r.roadmap),revision:r.revision||1,updatedAt:r.updatedAt||Date.now()});
  const ids=new Set(w.roadmaps.map(r=>r.id));
  for(const t of data.templates||[])w.templates.push({id:t.id,name:t.name,roadmap:cleanRoadmap(t.roadmap),createdAt:t.createdAt||Date.now()});
  for(const s of data.snapshots||[])if(ids.has(s.roadmapId))w.snapshots.push({id:s.id,roadmapId:s.roadmapId,revision:s.revision,roadmap:cleanRoadmap(s.roadmap),at:s.at});
  for(const c of data.comments||[])if(ids.has(c.roadmapId))w.comments.push({id:c.id,roadmapId:c.roadmapId,activityId:c.activityId||null,author:people.get(c.userId)||'Previous contributor',text:c.text,at:c.at});
  for(const v of data.views||[])if(ids.has(v.roadmapId))w.views.push({id:v.id,roadmapId:v.roadmapId,name:v.name,query:v.query||'',status:v.status||'',view:v.view});
  for(const a of data.approvals||[])if(ids.has(a.roadmapId))w.reviews.push({id:a.id,roadmapId:a.roadmapId,revision:a.revision,reviewer:people.get(a.reviewerId)||'Previous reviewer',status:'Archived',note:a.note||`Previous status: ${a.status}`,at:a.at});
  for(const a of data.audit||[])w.audit.push({id:a.id,action:a.action,resourceId:a.resourceId,detail:a.detail||'',at:a.at});
  for(const r of data.reports||[])w.reports.push({id:r.id,at:r.at,totals:r.totals,roadmaps:r.roadmaps.map(s=>({id:s.id,title:s.title,client:s.client,revision:s.revision,activities:s.activities,done:s.done,inProgress:s.inProgress}))});
  return validateWorkspace(w);
}
export function loadWorkspace(storage){
  const raw=storage.getItem(STORAGE_KEY);if(raw)return validateWorkspace(JSON.parse(raw));
  const old=storage.getItem('mightora-workspaces-v2');let w;
  if(old)w=migrateLegacy(JSON.parse(old));else{w=emptyWorkspace();const single=storage.getItem('mightora-roadmap-v1');appendRoadmap(w,single?JSON.parse(single):seedRoadmap());}
  storage.setItem(STORAGE_KEY,JSON.stringify(w));return w;
}
export function writeWorkspace(storage,w,expectedRevision){
  const raw=storage.getItem(STORAGE_KEY),current=raw?JSON.parse(raw):emptyWorkspace();
  if(current.revision!==expectedRevision)fail('Your workspace changed in another tab. Reload before saving.');
  const next=structuredClone(w);next.revision=expectedRevision+1;validateWorkspace(next);
  // setItem is atomic. Quota failures leave the previous complete save untouched.
  storage.setItem(STORAGE_KEY,JSON.stringify(next));return next;
}
