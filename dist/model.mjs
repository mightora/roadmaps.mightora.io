export const STATUSES = ['Planned', 'In progress', 'Done', 'On hold'];
export const COLORS = ['#376d62','#6979ab','#bd8659','#8a70a1','#528ba2','#799054','#bb7489','#8793a2','#688f85'];
export function addDays(date,n){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function addMonths(date, n) {
  const d = new Date(date + 'T12:00:00Z');
  const day = d.getUTCDate();
  d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n);
  d.setUTCDate(Math.min(day, new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth()+1, 0)).getUTCDate()));
  return d.toISOString().slice(0, 10);
}
export function quarterOf(date, roadmap) {
  for (let i = 0; i < roadmap.periodCount; i++) if (date >= addMonths(roadmap.startDate, i*3) && date < addMonths(roadmap.startDate, (i+1)*3)) return i;
  return -1;
}
export function periodLabel(roadmap, i) {
  const phase = i < 2 ? 'Foundation' : i < 4 ? 'Build' : i < 6 ? 'Scale' : 'Optimise';
  return { title: roadmap.quarterLabels?.[i] || `Q${i+1}`, phase, start: addMonths(roadmap.startDate,i*3), end: addMonths(roadmap.startDate,(i+1)*3) };
}
export function predecessors(activity, roadmap) { return activity.dependencies.map(id=>roadmap.activities.find(a=>a.id===id)).filter(Boolean); }
export function blockers(activity, roadmap) { return predecessors(activity,roadmap).filter(a=>a.status!=='Done'); }
export function scheduleConflicts(activity, roadmap) { return predecessors(activity,roadmap).filter(a=>a.end>=activity.start); }
export function downstream(id, roadmap) {
  const found=new Set(); const queue=[id];
  while(queue.length){ const current=queue.shift(); for(const a of roadmap.activities) if(a.dependencies.includes(current)&&!found.has(a.id)){found.add(a.id);queue.push(a.id);} }
  found.delete(id);return [...found];
}
export function hasCycle(activities) {
  const map=new Map(activities.map(a=>[a.id,a])); const visiting=new Set(), visited=new Set();
  function visit(id){if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const dep of map.get(id)?.dependencies??[])if(visit(dep))return true;visiting.delete(id);visited.add(id);return false;}
  return activities.some(a=>visit(a.id));
}
const dateValid=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
const str=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function validateRoadmap(r) {
  if(!r||r.schemaVersion!==1||!str(r.title,120)||!str(r.client,120)||!dateValid(r.startDate)||!Number.isInteger(r.periodCount)||r.periodCount<4||r.periodCount>12)throw new Error('Invalid roadmap settings. Use 4–12 quarters and a valid start date.');
  if(!Array.isArray(r.tracks)||r.tracks.length<1||r.tracks.length>20||!Array.isArray(r.activities)||r.activities.length>500)throw new Error('Use 1–20 workstreams and up to 500 activities.');
  if(r.quarterLabels!==undefined&&(!Array.isArray(r.quarterLabels)||r.quarterLabels.length!==r.periodCount||r.quarterLabels.some(v=>typeof v!=='string'||!v.trim()||v.length>80)))throw new Error('Each quarter needs a label of 1–80 characters.');
  const tracks=new Set(),ids=new Set();
  for(const t of r.tracks){if(!str(t.id,80)||tracks.has(t.id)||!str(t.name,80)||!/^#[0-9a-f]{6}$/i.test(t.color))throw new Error('Invalid or duplicate workstream.');tracks.add(t.id);}
  for(const a of r.activities){
    if(!str(a.id,80)||ids.has(a.id)||!str(a.title,160)||!tracks.has(a.trackId)||!dateValid(a.start)||!dateValid(a.end)||a.end<a.start||quarterOf(a.start,r)<0||a.end>=addMonths(r.startDate,r.periodCount*3)||!STATUSES.includes(a.status)||typeof a.owner!=='string'||a.owner.length>100||typeof a.description!=='string'||a.description.length>8000||!Array.isArray(a.dependencies))throw new Error('Invalid activity. Check its title, workstream, dates and status; dates must fit the roadmap horizon.');
    ids.add(a.id);
  }
  for(const a of r.activities){if(new Set(a.dependencies).size!==a.dependencies.length||a.dependencies.some(d=>typeof d!=='string'||d===a.id||!ids.has(d)))throw new Error('Dependencies must point to distinct existing activities.');}
  if(hasCycle(r.activities))throw new Error('This dependency creates a circular path. Remove one link to continue.');
  return r;
}
export function updateActivity(r, activity) {
  const next=structuredClone(r); const index=next.activities.findIndex(a=>a.id===activity.id);
  if(index<0)next.activities.push(activity);else next.activities[index]=activity;
  validateRoadmap(next);
  const old=r.activities.find(a=>a.id===activity.id);
  if(['In progress','Done'].includes(activity.status)&&old?.status!==activity.status&&blockers(activity,next).length)throw new Error('Complete the predecessor activities before starting or completing this activity.');
  // Reopening a completed prerequisite cannot leave its successors active or complete.
  if(old?.status==='Done'&&activity.status!=='Done'&&next.activities.some(a=>a.dependencies.includes(activity.id)&&['In progress','Done'].includes(a.status)))throw new Error('Move active or completed successors back to Planned or On hold before reopening this prerequisite.');
  if(['In progress','Done'].includes(activity.status)&&blockers(activity,next).length)throw new Error('An active or completed activity cannot have unfinished prerequisites.');
  return next;
}
export function deleteActivity(r,id) {
  const next=structuredClone(r); next.activities=next.activities.filter(a=>a.id!==id).map(a=>({...a,dependencies:a.dependencies.filter(d=>d!==id)}));return validateRoadmap(next);
}
export function addWorkstream(r,name,color='#059669'){
  const next=structuredClone(r);next.tracks.push({id:crypto.randomUUID(),name:name.trim(),color});return validateRoadmap(next);
}
export function editWorkstream(r,id,name,color){
  const next=structuredClone(r),track=next.tracks.find(t=>t.id===id);if(!track)throw new Error('Workstream not found.');track.name=name.trim();track.color=color;return validateRoadmap(next);
}
export function reorderWorkstream(r,id,direction){
  const next=structuredClone(r),index=next.tracks.findIndex(t=>t.id===id),target=index+direction;if(index<0||![1,-1].includes(direction)||target<0||target>=next.tracks.length)throw new Error('Cannot move this workstream in that direction.');
  [next.tracks[index],next.tracks[target]]=[next.tracks[target],next.tracks[index]];return validateRoadmap(next);
}
export function removeWorkstream(r,id,destinationId=''){
  const next=structuredClone(r);if(!next.tracks.some(t=>t.id===id))throw new Error('Workstream not found.');if(next.tracks.length===1)throw new Error('Keep at least one workstream.');
  const activities=next.activities.filter(a=>a.trackId===id);if(activities.length&&(!next.tracks.some(t=>t.id===destinationId)||destinationId===id))throw new Error('Choose another workstream for these activities.');
  for(const a of activities)a.trackId=destinationId;next.tracks=next.tracks.filter(t=>t.id!==id);return validateReadiness(validateRoadmap(next));
}
export function validateReadiness(r) {
  for(const a of r.activities)if(['In progress','Done'].includes(a.status)&&blockers(a,r).length)throw new Error(`"${a.title}" has unfinished prerequisites. Move it to Planned or On hold.`);
  return r;
}
export function seedRoadmap() {
  const names=['Business outcomes','Governance & security','Demand & discovery','Feature library & patterns','Platform & environments','Delivery & ALM','People & skills','Value & adoption'];
  const tracks=names.map((name,i)=>({id:`t${i+1}`,name,color:COLORS[i]}));
  const entries=[
    ['a1','Agree success measures',0,0,0,'Done','Client sponsor',[],'Define outcomes, delivery measures and the baseline for the factory.'],
    ['a2','Prioritise first use cases',0,0,1,'In progress','Product owner',['a1'],'Select the first client outcomes to validate through small deliveries.'],
    ['a3','Review product portfolio',0,3,0,'Planned','Product owner',['a2'],'Review the portfolio against strategic outcomes and capacity.'],
    ['a4','Establish governance principles',1,0,0,'Done','Architecture lead',[],'Agree ownership, accountability and the governance decision process.'],
    ['a5','Define DLP & access model',1,0,1,'In progress','Security lead',['a4'],'Set connector policies, access groups and proportionate security reviews.'],
    ['a6','Introduce architecture reviews',1,1,1,'Planned','Architecture lead',['a5'],'Introduce a lightweight architecture review at key lifecycle gates.'],
    ['a7','Review governance effectiveness',1,5,0,'Planned','Security lead',['a6'],'Measure review effort, policy exceptions and recurring findings.'],
    ['a8','Create a single front door',2,0,0,'Done','Business analyst',[],'Use a shared intake with a clear triage decision and accountable owner.'],
    ['a9','Define discovery playbook',2,0,1,'In progress','Business analyst',['a8'],'Right-size the requirements, context, user journeys and concepts for discovery.'],
    ['a10','Run discovery for pilot apps',2,1,0,'Planned','Product owner',['a2','a9'],'Validate the problem, users and reuse options for the first pilot applications.'],
    ['a11','Scale demand prioritisation',2,4,0,'Planned','Product owner',['a10'],'Compare demand against value, feasibility and available capacity.'],
    ['a12','Catalogue reusable building blocks',3,0,0,'Done','Architecture lead',[],'Inventory components and integrations before commissioning new features.'],
    ['a13','Publish reference patterns',3,1,0,'Planned','Architecture lead',['a12','a5'],'Publish agreed integration, security and data patterns.'],
    ['a14','Package first managed feature',3,2,0,'Planned','Feature team',['a13','a17'],'Create a supported first-party feature with dev, test and demo environments.'],
    ['a15','Launch feature library',3,3,0,'Planned','Feature team',['a14'],'Make supported features discoverable, with owners, versions and guidance.'],
    ['a16','Expand shared integrations',3,5,0,'Planned','Integration lead',['a15'],'Grow the shared integration catalogue using proven client demand.'],
    ['a17','Provision dev / test / prod',4,0,0,'Done','Platform lead',['a4'],'Provision isolated environments with named owners and service identities.'],
    ['a18','Baseline monitoring & capacity',4,1,0,'Planned','Platform lead',['a17','a5'],'Agree capacity budgets, analytics, alerting and error reporting.'],
    ['a19','Test recovery & continuity',4,3,0,'Planned','Platform lead',['a18'],'Exercise recovery procedures and clarify support responsibilities.'],
    ['a20','Automate solution pipelines',5,1,0,'Planned','DevOps lead',['a17','a5'],'Use repeatable versioning, managed deployments and environment settings.'],
    ['a21','Deliver pilot alpha',5,2,0,'Planned','Delivery lead',['a10','a13','a20'],'Validate a thin slice with users, building reusable capabilities as needed.'],
    ['a22','Pilot private beta',5,3,0,'Planned','Delivery lead',['a21','a18'],'Test support, accessibility and real-world use with a limited audience.'],
    ['a23','Launch pilot to public stage',5,4,0,'Planned','Delivery lead',['a22','a19'],'Move to the public lifecycle stage with agreed service ownership. Public here means wider authorised use, not anonymous access.'],
    ['a24','Improve delivery flow',5,6,0,'Planned','DevOps lead',['a23'],'Use lead time, change failure and recovery measures to improve the factory.'],
    ['a25','Map skills & accountable roles',6,0,0,'Done','Capability lead',[],'Map maker, developer, architect, service owner and product responsibilities.'],
    ['a26','Coach first delivery teams',6,1,0,'Planned','Capability lead',['a25'],'Coach teams through the delivery playbook and shared engineering standards.'],
    ['a27','Establish community of practice',6,3,0,'Planned','Capability lead',['a26'],'Share lessons, demonstrate features and review emerging patterns.'],
    ['a28','Grow factory capacity',6,5,1,'Planned','Capability lead',['a27','a23'],'Increase sustainable delivery capacity using the pilot evidence.'],
    ['a29','Capture benefits baseline',7,0,0,'Done','Benefits lead',['a1'],'Measure current process time, cost, user experience and service outcomes.'],
    ['a30','Validate pilot benefits',7,4,1,'Planned','Benefits lead',['a23','a29'],'Compare pilot outcomes with the baseline and record lessons.'],
    ['a31','Scale adoption & ownership',7,6,0,'Planned','Change lead',['a30','a28'],'Extend adoption with support, feedback and clear product ownership.'],
    ['a32','Plan the next roadmap',7,7,0,'Planned','Client sponsor',['a31','a24'],'Refresh priorities using delivery evidence and client strategy.']
  ];
  const r={schemaVersion:1,title:'Low-code App Factory',client:'Example client',startDate:'2027-01-01',periodCount:8,tracks,activities:[]};
  r.activities=entries.map(([id,title,t,q,offset,status,owner,dependencies,description])=>({id,title,trackId:tracks[t].id,start:addMonths(r.startDate,q*3+offset),end:addMonths(r.startDate,q*3+offset).slice(0,8)+'24',status,owner,dependencies,description}));
  for(const id of ['a1','a4'])r.activities.find(a=>a.id===id).end='2027-01-10';
  for(const id of ['a17','a29'])r.activities.find(a=>a.id===id).start='2027-01-12';
  return validateReadiness(validateRoadmap(r));
}
