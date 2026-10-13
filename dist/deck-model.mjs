import {validateRoadmap,periodLabel,quarterOf,blockers,scheduleConflicts,addMonths,addDays} from './model.mjs';

const humanDate=s=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
const clip=(s,n=210)=>{const value=String(s||'').replace(/\s+/g,' ').trim();return value.length>n?value.slice(0,n-1).trimEnd()+'…':value;};
const page=(list,n)=>Array.from({length:Math.max(1,Math.ceil(list.length/n))},(_,i)=>list.slice(i*n,(i+1)*n));
const makeSlide=(kind,section,title,subtitle='',summary='',extra={})=>({id:'slide-'+Math.random().toString(36).slice(2),kind,section,title,subtitle,summary,cards:[],stats:[],timeline:[],periods:[],notes:'',enabled:true,...extra});
const asCard=(a,r,options)=>{
  const track=r.tracks.find(t=>t.id===a.trackId);
  const prereqs=a.dependencies.map(id=>r.activities.find(x=>x.id===id)?.title).filter(Boolean);
  const owner=options.includeOwners&&a.owner?' · '+a.owner:'';
  return {title:a.title,detail:options.includeDescriptions?clip(a.description,200):'',meta:humanDate(a.start)+' – '+humanDate(a.end)+' · '+a.status+owner+(prereqs.length?' · '+prereqs.length+' prerequisite'+(prereqs.length===1?'':'s'):''),status:a.status,color:track?.color||'#376d62'};
};
function metrics(r){
  const all=r.activities,done=all.filter(a=>a.status==='Done').length;
  return {total:all.length,done,progress:all.filter(a=>a.status==='In progress').length,hold:all.filter(a=>a.status==='On hold').length,blocked:all.filter(a=>a.status!=='Done'&&blockers(a,r).length).length,conflicts:all.filter(a=>scheduleConflicts(a,r).length).length,links:all.reduce((n,a)=>n+a.dependencies.length,0),percent:all.length?Math.round(done/all.length*100):0};
}
function readyActivities(r){return r.activities.filter(a=>a.status!=='Done'&&a.status!=='On hold'&&!blockers(a,r).length).sort((a,b)=>a.start.localeCompare(b.start));}
function timelineSlides(r,periods){
  const result=[],tracks=page(r.tracks,7),chunks=page(periods,6);
  for(let i=0;i<tracks.length;i++)for(let j=0;j<chunks.length;j++){
    const quarterSet=chunks[j],rows=tracks[i].map(t=>({title:t.name,color:t.color,cells:quarterSet.map(p=>{
      const activities=r.activities.filter(a=>a.trackId===t.id&&a.start<p.end&&a.end>=p.start);
      return {count:activities.length,done:activities.filter(a=>a.status==='Done').length,blocked:activities.filter(a=>a.status!=='Done'&&blockers(a,r).length).length};
    })}));
    const suffix=tracks.length*chunks.length>1?' · '+(result.length+1)+'/'+(tracks.length*chunks.length):'';
    result.push(makeSlide('timeline','Roadmap overview','Delivery roadmap'+suffix,quarterSet[0].title+' – '+quarterSet.at(-1).title,'Cells show activities scheduled during each quarter, including work spanning multiple quarters. Completed work is shown in green.',{timeline:rows,periods:quarterSet.map(p=>p.title)}));
  }
  return result;
}
function dependencySlides(r,m){
  const edges=r.activities.flatMap(target=>target.dependencies.map(id=>{
    const source=r.activities.find(a=>a.id===id);
    if(!source)return null;
    const conflict=source.end>=target.start,waiting=source.status!=='Done'&&target.status!=='Done';
    return {title:source.title+' → '+target.title,detail:(r.tracks.find(t=>t.id===source.trackId)?.name||'Source workstream')+' → '+(r.tracks.find(t=>t.id===target.trackId)?.name||'Target workstream')+' · '+humanDate(source.end)+' → '+humanDate(target.start),meta:conflict?'Date overlap — review schedule':waiting?'Waiting for prerequisite':'Prerequisite complete',status:conflict?'Date conflict':waiting?'Blocked':'Ready',color:conflict?'#b16d36':waiting?'#b38b48':'#376d62'};
  })).filter(Boolean).sort((a,b)=>Number(b.status==='Date conflict')-Number(a.status==='Date conflict')||Number(b.status==='Blocked')-Number(a.status==='Blocked'));
  const summary=makeSlide('summary','Dependencies','What depends on what','Prerequisites, blockers and schedule conflicts','A dependency means its predecessor must finish before the next activity starts. Date overlaps need review; they are not automatically proof of delivery failure.',{stats:[{label:'Links',value:String(m.links)},{label:'Blocked activities',value:String(m.blocked)},{label:'Date overlaps',value:String(m.conflicts)},{label:'Ready to progress',value:String(readyActivities(r).length)}],cards:[{title:'Priority review',detail:m.conflicts?m.conflicts+' activities have dates overlapping a prerequisite. Check whether dates need moving.':'No date overlaps detected between linked activities.',meta:'Schedule quality',status:m.conflicts?'Date conflict':'Ready',color:'#376d62'},{title:'Unfinished prerequisites',detail:m.blocked?m.blocked+' activities cannot yet proceed because at least one prerequisite is unfinished.':'No activities are currently blocked by unfinished prerequisites.',meta:'Delivery readiness',status:m.blocked?'Blocked':'Ready',color:'#376d62'}]});
  return [summary,...page(edges,4).map((cards,i)=>makeSlide('cards','Dependencies','Dependency links'+(edges.length>4?' · '+(i+1)+'/'+Math.ceil(edges.length/4):''),cards.length+' links on this page','Arrows run from the prerequisite to the dependent activity. Review amber date overlaps and blocked activities first.',{cards}))];
}
export function buildRoadmapDeck(source,settings={}){
  const r=validateRoadmap(structuredClone(source));
  const options={includeOwners:!!settings.includeOwners,includeDescriptions:settings.includeDescriptions!==false,includeDeepDives:!!settings.includeDeepDives};
  const m=metrics(r),periods=Array.from({length:r.periodCount},(_,i)=>({...periodLabel(r,i),index:i}));
  const horizon=humanDate(r.startDate)+' – '+humanDate(addMonths(r.startDate,r.periodCount*3-1));
  const ready=readyActivities(r),slides=[];
  slides.push(makeSlide('cover','Introduction',r.title,r.client+' · '+horizon,'A clear view of delivery priorities, timing, workstreams and dependencies.'));
  slides.push(makeSlide('summary','Executive overview','Roadmap at a glance','High-level delivery position',m.percent+'% of activities are marked complete. '+m.progress+' are in progress and '+m.blocked+' are waiting on prerequisites.',{stats:[{label:'Complete',value:m.percent+'%'},{label:'In progress',value:String(m.progress)},{label:'Waiting',value:String(m.blocked)},{label:'On hold',value:String(m.hold)}],cards:[{title:'Delivery horizon',detail:horizon,meta:r.periodCount+' quarters',status:'',color:'#376d62'},{title:'Next ready activity',detail:ready[0]?.title||'No ready activities identified',meta:ready[0]?humanDate(ready[0].start):'Review dependencies',status:ready[0]?.status||'',color:'#376d62'},{title:'Dependencies to review',detail:m.conflicts?m.conflicts+' date overlaps across prerequisite relationships.':'No overlapping predecessor dates identified.',meta:m.links+' dependency links',status:m.conflicts?'Date conflict':'Ready',color:'#b38b48'},{title:'Workstream coverage',detail:r.tracks.map(t=>t.name).join(' · '),meta:r.tracks.length+' workstreams',status:'',color:'#376d62'}]}));
  slides.push(...timelineSlides(r,periods));
  slides.push(...dependencySlides(r,m));
  slides.push(makeSlide('cards','Delivery assurance','Risks and decisions','Areas that may need attention','These are evidence-based prompts from the current plan, not a formal risk register. Confirm the impact, owner and mitigation with your delivery team.',{cards:[
    {title:'Dependency blockers',detail:m.blocked?m.blocked+' activities have unfinished prerequisites. Confirm ownership and realistic release dates.':'No unfinished prerequisite blockers currently identified.',meta:'Delivery readiness',status:m.blocked?'Blocked':'Ready',color:m.blocked?'#b27b3d':'#376d62'},
    {title:'Schedule alignment',detail:m.conflicts?m.conflicts+' activities overlap the finish date of a predecessor. Review sequencing and contingency.':'No predecessor date overlaps detected.',meta:'Finish-to-start dependencies',status:m.conflicts?'Date conflict':'Ready',color:m.conflicts?'#b27b3d':'#376d62'},
    {title:'Work on hold',detail:m.hold?m.hold+' activities are on hold. Confirm whether they affect the delivery horizon.':'No activities currently marked on hold.',meta:'Delivery decisions',status:m.hold?'On hold':'Ready',color:'#376d62'},
    {title:'Next delivery focus',detail:ready.length?ready.length+' activities have no unfinished prerequisites; prioritise the next viable outcomes.':'No unfinished activities are currently ready to start. Review blockers or the roadmap status.',meta:'Suggested steering discussion',status:'',color:'#376d62'}
  ]}));
  for(const p of periods){
    const activities=r.activities.filter(a=>quarterOf(a.start,r)===p.index).sort((a,b)=>a.start.localeCompare(b.start));
    const parts=page(activities,4);
    for(let i=0;i<parts.length;i++)slides.push(makeSlide('cards','Quarter-by-quarter',p.title+(parts.length>1?' · '+(i+1)+'/'+parts.length:''),p.phase+' · '+humanDate(p.start)+' – '+humanDate(addDays(p.end,-1)),'Activities starting in this quarter, grouped by delivery date. Workstreams and prerequisite counts are shown for context.',{cards:parts[i].map(a=>{const c=asCard(a,r,options);c.meta=r.tracks.find(t=>t.id===a.trackId)?.name+' · '+c.meta;return c;}),stats:[{label:'Activities starting',value:String(activities.length)},{label:'Completed',value:String(activities.filter(a=>a.status==='Done').length)},{label:'Blocked',value:String(activities.filter(a=>a.status!=='Done'&&blockers(a,r).length).length)}]}));
  }
  for(const track of r.tracks){
    const activities=r.activities.filter(a=>a.trackId===track.id).sort((a,b)=>a.start.localeCompare(b.start));
    const parts=page(activities,4);
    for(let i=0;i<parts.length;i++)slides.push(makeSlide('cards','Workstream detail',track.name+(parts.length>1?' · '+(i+1)+'/'+parts.length:''),activities.length+' activities · '+activities.filter(a=>a.status==='Done').length+' complete','Delivery commitments, owners and prerequisite counts for this workstream.',{accent:track.color,cards:parts[i].map(a=>asCard(a,r,options)),stats:[{label:'Activities',value:String(activities.length)},{label:'In progress',value:String(activities.filter(a=>a.status==='In progress').length)},{label:'Blocked',value:String(activities.filter(a=>a.status!=='Done'&&blockers(a,r).length).length)}]}));
  }
  if(options.includeDeepDives)for(const a of r.activities){
    const track=r.tracks.find(t=>t.id===a.trackId);
    const deps=a.dependencies.map(id=>r.activities.find(x=>x.id===id)?.title).filter(Boolean);
    slides.push(makeSlide('cards','Activity deep dive',a.title,(track?.name||'Workstream')+' · '+a.status,options.includeDescriptions?a.description:'',{accent:track?.color,cards:[{title:'Delivery dates',detail:humanDate(a.start)+' – '+humanDate(a.end),meta:a.status,status:a.status,color:track?.color||'#376d62'},{title:'Prerequisites',detail:deps.join(' · ')||'No prerequisites',meta:deps.length+' linked activities',status:deps.length?'Blocked':'Ready',color:'#376d62'},...(options.includeOwners&&a.owner?[{title:'Accountable owner',detail:a.owner,meta:'Owner',status:'',color:'#376d62'}]:[])]}));
  }
  slides.push(makeSlide('cards','Decisions & next steps','What happens next','Suggested priorities from the current plan','These suggestions are derived from roadmap statuses and dependencies. Edit them for the intended audience before exporting.',{cards:[...ready.slice(0,m.conflicts?3:4).map(a=>({title:a.title,detail:'Ready to progress · '+humanDate(a.start),meta:r.tracks.find(t=>t.id===a.trackId)?.name||'',status:a.status,color:'#376d62'})),...(m.conflicts?[{title:'Resolve date overlaps',detail:m.conflicts+' activities have overlapping predecessor dates.',meta:'Schedule review',status:'Date conflict',color:'#b38b48'}]:[])].slice(0,4)}));
  return {schemaVersion:1,sourceTitle:r.title,generatedAt:new Date().toISOString(),options,slides};
}
export function validateDeck(deck){
  if(!deck||deck.schemaVersion!==1||!Array.isArray(deck.slides)||deck.slides.length<1||deck.slides.length>1500)throw Error('Invalid presentation deck.');
  if(typeof deck.sourceTitle!=='string'||deck.sourceTitle.length>160)throw Error('Invalid presentation source.');
  const kinds=new Set(['cover','summary','timeline','cards']);
  const goodText=(v,max=8000)=>typeof v==='string'&&v.length<=max;
  const ids=new Set();
  for(const slide of deck.slides){
    if(!slide||!goodText(slide.id,100)||ids.has(slide.id)||!kinds.has(slide.kind)||!goodText(slide.title,200)||!goodText(slide.subtitle,1000)||!goodText(slide.summary)||!goodText(slide.notes)||!goodText(slide.section,100)||typeof slide.enabled!=='boolean'||!Array.isArray(slide.cards)||slide.cards.length>4||!Array.isArray(slide.stats)||slide.stats.length>4||!Array.isArray(slide.timeline)||slide.timeline.length>12||!Array.isArray(slide.periods)||slide.periods.length>12)throw Error('Invalid presentation slide.');
    ids.add(slide.id);
    if(slide.cards.some(c=>!goodText(c.title,500)||!goodText(c.detail)||!goodText(c.meta,1000)||!goodText(c.status,100)||!/^#[0-9a-f]{6}$/i.test(c.color||'')))throw Error('Invalid presentation card.');
    if(slide.stats.some(x=>!goodText(x.label,200)||!goodText(x.value,100)))throw Error('Invalid presentation metric.');
    if(slide.timeline.some(row=>!goodText(row.title,160)||!/^#[0-9a-f]{6}$/i.test(row.color||'')||!Array.isArray(row.cells)||row.cells.length>12||row.cells.some(cell=>!Number.isInteger(cell.count)||cell.count<0||!Number.isInteger(cell.done)||cell.done<0||!Number.isInteger(cell.blocked)||cell.blocked<0)))throw Error('Invalid timeline data.');
    if(slide.periods.some(x=>!goodText(x,80)))throw Error('Invalid quarter label.');
  }
  return deck;
}
export function activeSlides(deck){return validateDeck(deck).slides.filter(s=>s.enabled);}
