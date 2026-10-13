import { newId } from './ids.mjs';
import { icon } from './icons.mjs';
import { STATUSES, COLORS, seedRoadmap, validateRoadmap, validateReadiness, updateActivity, deleteActivity, quarterOf, periodLabel, addMonths, addDays, blockers, scheduleConflicts, downstream } from './model.mjs';
import { initialise, saveRoadmap, isEditor, organisationMembers, assigneeField, decorateDrawer, demoRuntime, communityRuntime, sharedPreview, setBusy } from './portal.mjs';
import { roadmapToCsv, roadmapFromCsv } from './csv.mjs';
import { roadmapToMarkdown,roadmapFromMarkdown } from './markdown.mjs';

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatDate=s=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
const formatMonth=s=>new Intl.DateTimeFormat('en-GB',{month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));
const statusClass=s=>({'Planned':'planned','In progress':'progress','Done':'done','On hold':'hold'}[s]);
const KEY='mightora-roadmap-v1';
let roadmap,revision=0,mode='local',view='roadmap',saving=false,compact=false,dragId=null,lastFocus=null,toastTimer;
let graphObserver;
let timelineUnit='quarters';
function blockStart(index){return timelineUnit==='weeks'?addDays(roadmap.startDate,index*7):addMonths(roadmap.startDate,index*(timelineUnit==='months'?1:3));}
function blockCount(){if(timelineUnit!=='weeks')return roadmap.periodCount*(timelineUnit==='months'?3:1);const end=addMonths(roadmap.startDate,roadmap.periodCount*3);return Math.ceil((Date.parse(end+'T12:00:00Z')-Date.parse(roadmap.startDate+'T12:00:00Z'))/604800000);}
function blockIndex(date){for(let i=0;i<blockCount();i++)if(date>=blockStart(i)&&date<blockStart(i+1))return i;return -1;}
function blockTitle(i){if(timelineUnit==='quarters')return periodLabel(roadmap,i).title;if(timelineUnit==='months')return new Intl.DateTimeFormat('en-GB',{month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(blockStart(i)+'T12:00:00Z'));return 'Week '+(i+1);}
function blockEnd(i){return addDays(blockStart(i+1),-1);}

function toast(message,error=false){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').className='toast'+(error?' error':'');$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,error?8000:3500);}
function savedLabel(message,error=false){$('#save-indicator').textContent=message;$('#save-indicator').classList.toggle('error',error);}
function currentSaveLabel(){return sharedPreview()?'Shared snapshot · not saved':communityRuntime()?'Saved in this browser':demoRuntime()?'Saved · demo workspace':'Saved to organisation';}
async function load(){
  await initialise({toast,open(record){roadmap=record.roadmap;revision=record.revision;mode='organisation';savedLabel(currentSaveLabel());render();},clear(){roadmap=null;revision=0;$('#canvas').innerHTML='<div class="no-results">Select or create a roadmap to begin.</div>';$('#stats').innerHTML='';$('#roadmap-title').textContent='Roadmap';},contextChange(){closeDrawer();$('#settings-dialog').close();$('#platform-dialog').close();},getRoadmap:()=>roadmap,getFilter:()=>({query:$('#search').value,status:$('#status-filter').value,view}),applyFilter(f){$('#search').value=f.query||'';$('#status-filter').value=f.status||'';view=f.view||'roadmap';render();}});
}
async function commit(next){
  if(saving)throw new Error('A save is already in progress. Please try again shortly.');
  if(!isEditor())throw new Error('Your Viewer role has read-only access.');
  validateReadiness(validateRoadmap(next));saving=true;setBusy(true);savedLabel('Saving…');
  try{
    const record=await saveRoadmap(next,revision);revision=record.revision;
    roadmap=next;savedLabel(currentSaveLabel());render();
  }catch(error){savedLabel('Save failed · reload to retry',true);throw error;}
  finally{saving=false;setBusy(false);}
}
function filtered(){
  const q=$('#search').value.trim().toLowerCase(),status=$('#status-filter').value;
  return roadmap.activities.filter(a=>(!q||[a.title,a.owner,a.description,roadmap.tracks.find(t=>t.id===a.trackId)?.name].join(' ').toLowerCase().includes(q))&&(!status||(status==='blocked'?blockers(a,roadmap).length>0&&a.status!=='Done':status==='conflict'?scheduleConflicts(a,roadmap).length>0:a.status===status)));
}
function render(){
  if(!roadmap)return;
  $('#roadmap-title').textContent=roadmap.title;
  $('#subtitle').textContent=`${roadmap.client} · ${formatMonth(roadmap.startDate)} – ${formatMonth(addMonths(roadmap.startDate,roadmap.periodCount*3-1))} · A connected path to repeatable delivery`;
  const all=roadmap.activities,total=all.length,done=all.filter(a=>a.status==='Done').length;
  const stats=[['Total activities',total,`${roadmap.tracks.length} connected workstreams`,'roadmap'],['In progress',all.filter(a=>a.status==='In progress').length,`${done} completed activities`,'trending'],['Waiting on dependencies',all.filter(a=>a.status!=='Done'&&blockers(a,roadmap).length).length,'Complete predecessors to unlock','dependencies'],['Completion',`${total?Math.round(done/total*100):0}%`,`${done} of ${total} activities complete`,'check']];
  $('#stats').innerHTML=stats.map(([label,value,caption,symbol],i)=>`<div class="stat"><div style="width:100%"><div class="stat-label">${label}</div><span class="stat-value">${value}</span><div class="stat-caption">${caption}</div>${i===3?`<div class="stat-track"><span style="width:${total?done/total*100:0}%"></span></div>`:''}</div><span class="stat-icon">${icon(symbol)}</span></div>`).join('');
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  const visible=filtered();
  $('#view-caption').textContent=view==='roadmap'?`${roadmap.tracks.length} workstreams · ${blockCount()} ${timelineUnit} · ${visible.length} activities`:view==='dependencies'?`${roadmap.activities.reduce((n,a)=>n+a.dependencies.length,0)} finish-to-start links · hover to trace a path`:`${visible.length} of ${all.length} activities`;
  $('#footer-hint').textContent=view==='roadmap'?'Select a card to edit · drag to reschedule':view==='dependencies'?'Arrows point from prerequisite to successor':'Select an activity to edit it';
  $('#density').hidden=view!=='roadmap';
  graphObserver?.disconnect();
  if(view==='roadmap')renderBoard(visible);else if(view==='activities')renderTable(visible);else renderGraph(visible);
}
function card(a,graph=false){
  const track=roadmap.tracks.find(t=>t.id===a.trackId),blocked=blockers(a,roadmap).length,conflicts=scheduleConflicts(a,roadmap).length;
  const startQ=blockIndex(a.start),endQ=blockIndex(a.end);
  return `<button type="button" class="activity-card" data-activity="${esc(a.id)}" ${graph?'':`draggable="${isEditor()}"`} style="--track-color:${track.color}" aria-label="${esc(a.title)}, ${esc(a.status)}, ${blocked} unfinished predecessors"><span class="activity-title">${esc(a.title)}</span><span class="card-labels"><span class="badge ${statusClass(a.status)}">${esc(a.status)}</span>${blocked&&a.status!=='Done'?`<span class="badge blocked" title="Unfinished prerequisites">${icon('dependencies')} Waiting</span>`:''}${conflicts?`<span class="badge conflict" title="The scheduled start overlaps a predecessor finish">${icon('alert')} Dates</span>`:''}${endQ>startQ?`<span class="badge">${icon("arrow-right")} ${blockTitle(endQ)}</span>`:''}</span><span class="card-meta"><span class="owner">${esc(a.owner||'Unassigned')}</span><span class="dep-count" title="Predecessor activities">${a.dependencies.length?icon('link')+' '+a.dependencies.length:formatDate(a.start)}</span></span>${graph?`<span class="track-meta">${esc(track.name)}</span>`:''}</button>`;
}
function bindCards(container){
  container.querySelectorAll('[data-activity]').forEach(button=>{
    button.addEventListener('click',()=>openActivity(button.dataset.activity));
    button.addEventListener('dragstart',e=>{if(!isEditor()){e.preventDefault();return;}dragId=button.dataset.activity;e.dataTransfer.setData('text/plain',dragId);e.dataTransfer.effectAllowed='move';});
    button.addEventListener('dragend',()=>{dragId=null;document.querySelectorAll('.drag-over').forEach(c=>c.classList.remove('drag-over'));});
  });
}
function renderBoard(activities){
  const count=blockCount();
  let html=`<div class="timeline-controls"><label for="timeline-unit">Time blocks</label><select id="timeline-unit"><option value="weeks" ${timelineUnit==='weeks'?'selected':''}>Weeks</option><option value="months" ${timelineUnit==='months'?'selected':''}>Months</option><option value="quarters" ${timelineUnit==='quarters'?'selected':''}>Quarters</option></select><span>Longer activities continue across blocks.</span></div><div class="board ${compact?'compact':''}" style="--count:${count}"><div class="board-corner">WORKSTREAMS</div>`;
  for(let i=0;i<count;i++)html+=`<div class="period"><div class="period-bottom"><strong>${esc(blockTitle(i))}</strong><small>${formatDate(blockStart(i))} – ${formatDate(blockEnd(i))}</small></div></div>`;
  roadmap.tracks.forEach((t,n)=>{
    const trackActivities=activities.filter(a=>a.trackId===t.id);
    html+=`<div class="track-label" style="--track-color:${t.color}"><span class="track-line"></span><span class="track-index">${String(n+1).padStart(2,'0')}</span><div><strong class="track-name">${esc(t.name)}</strong><small class="track-meta">${trackActivities.length} activities</small></div></div>`;
    for(let i=0;i<count;i++){
      const list=trackActivities.filter(a=>blockIndex(a.start)===i).sort((a,b)=>a.start.localeCompare(b.start));
      const ongoing=trackActivities.filter(a=>blockIndex(a.start)<i&&blockIndex(a.end)>=i);
      html+=`<div class="cell" data-track="${esc(t.id)}" data-period="${i}">${list.map(a=>card(a)).join('')}${ongoing.map(a=>`<button type="button" class="activity-continuation" data-activity="${esc(a.id)}" style="--track-color:${t.color}" title="${esc(a.title)} continues through ${esc(formatDate(a.end))}">↳ ${esc(a.title)} <span>continues</span></button>`).join('')}${!list.length&&!ongoing.length?'<div class="empty-slot" aria-hidden="true">·</div>':''}<button class="cell-add" data-add-track="${esc(t.id)}" data-add-period="${i}" aria-label="Add activity to ${esc(t.name)}, ${esc(blockTitle(i))}">+ Add activity</button></div>`;
    }
  });
  $('#canvas').innerHTML=html+'</div>';
  $('#timeline-unit').onchange=e=>{timelineUnit=e.target.value;render();};
  bindCards($('#canvas'));
  $('#canvas').querySelectorAll('[data-add-track]').forEach(b=>{b.hidden=!isEditor();b.addEventListener('click',()=>openActivity(null,b.dataset.addTrack,Number(b.dataset.addPeriod)));});
  $('#canvas').querySelectorAll('.cell').forEach(cell=>{
    cell.addEventListener('dragover',e=>{if(!dragId)return;e.preventDefault();cell.classList.add('drag-over');e.dataTransfer.dropEffect='move';});
    cell.addEventListener('dragleave',e=>{if(!cell.contains(e.relatedTarget))cell.classList.remove('drag-over');});
    cell.addEventListener('drop',async e=>{
      e.preventDefault();cell.classList.remove('drag-over');if(!dragId||saving)return;
      const a=roadmap.activities.find(a=>a.id===dragId);if(!a)return;
      const newStart=blockStart(Number(cell.dataset.period));
      const delta=Math.round((Date.parse(newStart+'T12:00:00Z')-Date.parse(a.start+'T12:00:00Z'))/86400000);
      const moved={...a,trackId:cell.dataset.track,start:newStart,end:addDays(a.end,delta)};
      try{await commit(updateActivity(roadmap,moved));toast('Activity moved.');}catch(error){toast(error.message,true);}
    });
  });
}
function renderTable(activities){
  $('#canvas').innerHTML=activities.length?`<div class="table-wrap"><table class="activities-table"><thead><tr><th>ACTIVITY</th><th>WORKSTREAM</th><th>OWNER</th><th>SCHEDULE</th><th>STATUS</th><th>DEPENDENCIES</th></tr></thead><tbody>${activities.sort((a,b)=>a.start.localeCompare(b.start)).map(a=>`<tr><td><button class="table-title" data-activity="${esc(a.id)}">${esc(a.title)}</button></td><td>${esc(roadmap.tracks.find(t=>t.id===a.trackId).name)}</td><td>${esc(a.owner||'Unassigned')}</td><td>${formatDate(a.start)} – ${formatDate(a.end)}, ${a.start.slice(0,4)}${a.end.slice(0,4)!==a.start.slice(0,4)?' – '+a.end.slice(0,4):''}</td><td><span class="badge ${statusClass(a.status)}">${a.status}</span></td><td>${a.dependencies.length?`${a.dependencies.length} predecessors`: 'Independent'}${blockers(a,roadmap).length?`<br><span class="badge blocked">${blockers(a,roadmap).length} unfinished</span>`:''}${scheduleConflicts(a,roadmap).length?'<br><span class="badge conflict">Schedule conflict</span>':''}</td></tr>`).join('')}</tbody></table></div>`:'<div class="no-results">No activities match these filters.</div>';
  bindCards($('#canvas'));
}
function renderGraph(activities){
  if(!activities.length){$('#canvas').innerHTML='<div class="no-results">No activities match these filters.</div>';return;}
  let html=`<div class="graph-key">${icon("dependencies")} Activity-level links · only links between visible cards are drawn <span class="sr-only">Select a card to edit its dependencies.</span></div><div class="graph" style="--count:${roadmap.periodCount}"><svg class="graph-svg" aria-hidden="true"></svg>`;
  for(let i=0;i<roadmap.periodCount;i++){const p=periodLabel(roadmap,i);html+=`<div class="graph-column"><div class="graph-heading">${esc(p.title)} · ${p.phase}<small>${formatMonth(p.start)}</small></div>${activities.filter(a=>quarterOf(a.start,roadmap)===i).sort((a,b)=>a.start.localeCompare(b.start)).map(a=>card(a,true)).join('')}</div>`;}
  $('#canvas').innerHTML=html+'</div>';bindCards($('#canvas'));
  const graph=$('.graph');
  function draw(){
    const bounds=graph.getBoundingClientRect(),svg=$('.graph-svg');if(!svg)return;
    svg.setAttribute('width',graph.scrollWidth);svg.setAttribute('height',graph.scrollHeight);
    let lines='<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#9aac83;stroke:none;opacity:1"/></marker></defs>';
    const nodes=new Map([...graph.querySelectorAll('[data-activity]')].map(n=>[n.dataset.activity,n]));
    for(const a of activities){const dest=nodes.get(a.id);for(const id of a.dependencies){const source=nodes.get(id);if(!source||!dest)continue;const s=source.getBoundingClientRect(),d=dest.getBoundingClientRect();let path;
      if(quarterOf(a.start,roadmap)===quarterOf(roadmap.activities.find(b=>b.id===id).start,roadmap)){
        const x=s.right-bounds.left,y=s.top+s.height/2-bounds.top,ey=d.top+d.height/2-bounds.top,side=x+12;
        path=`M${x},${y} C${side},${y} ${side},${ey} ${d.right-bounds.left},${ey}`;
      }else{const x=s.right-bounds.left,y=s.top+s.height/2-bounds.top,ex=d.left-bounds.left,ey=d.top+d.height/2-bounds.top,bend=Math.max(20,(ex-x)/2);path=`M${x},${y} C${x+bend},${y} ${ex-bend},${ey} ${ex},${ey}`;}
      lines+=`<path data-source="${esc(id)}" data-target="${esc(a.id)}" d="${path}" marker-end="url(#arrow)"/>`;
    }}svg.innerHTML=lines;
  }
  requestAnimationFrame(draw);graphObserver=new ResizeObserver(draw);graphObserver.observe(graph);
  graph.querySelectorAll('[data-activity]').forEach(node=>{
    const highlight=()=>{
      const id=node.dataset.activity,related=new Set([id,...downstream(id,roadmap)]),queue=[id];
      while(queue.length){const a=roadmap.activities.find(a=>a.id===queue.shift());for(const dep of a?.dependencies??[])if(!related.has(dep)){related.add(dep);queue.push(dep);}}
      graph.querySelectorAll('[data-activity]').forEach(n=>{n.classList.toggle('dim',!related.has(n.dataset.activity));n.classList.toggle('related',n.dataset.activity===id);});
      graph.querySelectorAll('[data-source]').forEach(p=>p.classList.toggle('highlight',related.has(p.dataset.source)&&related.has(p.dataset.target)));
    };
    const clear=()=>{graph.querySelectorAll('.dim,.related').forEach(n=>n.classList.remove('dim','related'));graph.querySelectorAll('.highlight').forEach(n=>n.classList.remove('highlight'));};
    node.addEventListener('mouseenter',highlight);node.addEventListener('mouseleave',clear);node.addEventListener('focus',highlight);node.addEventListener('blur',clear);
  });
}
function closeDrawer(){if(saving)return;$('#drawer').hidden=true;$('#drawer-overlay').hidden=true;document.body.style.overflow='';lastFocus?.focus();}
function activityFromForm(form,id){const data=new FormData(form),assigneeId=data.get('assigneeId')||'';const member=organisationMembers().find(m=>m.userId===assigneeId);return {id,title:data.get('title').trim(),description:data.get('description').trim(),trackId:data.get('trackId'),owner:member?.name||data.get('owner').trim(),assigneeId,start:data.get('start'),end:data.get('end'),status:data.get('status'),dependencies:data.getAll('dependency')};}
function openActivity(id=null,trackId=null,period=0){
  if(!roadmap)return;
  if(!id&&!isEditor())return;
  const existing=roadmap.activities.find(a=>a.id===id);
  const start=blockStart(period);
  const end=[blockEnd(period),addDays(addMonths(roadmap.startDate,roadmap.periodCount*3),-1)].sort()[0];
  const a=existing||{id:newId(),title:'',description:'',trackId:trackId||roadmap.tracks[0].id,owner:'',start,end,status:'Planned',dependencies:[]};
  const affected=existing?downstream(a.id,roadmap):[],successors=roadmap.activities.filter(b=>b.dependencies.includes(a.id));
  const unavailable=new Set(affected);
  lastFocus=document.activeElement;
  $('#drawer').innerHTML=`<div class="drawer-header"><h2 id="drawer-title">${existing?'Activity details':'Add activity'}</h2><button type="button" class="close" id="close-drawer" aria-label="Close activity editor"><svg class="mi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5 5 19"/></svg></button></div><form class="activity-form"><div class="drawer-content"><div class="form-alert" id="form-error" role="alert" hidden></div><label class="field"><span>Activity name</span><input name="title" value="${esc(a.title)}" maxlength="160" required placeholder="What needs to happen?"></label><label class="field"><span>Workstream</span><select name="trackId">${roadmap.tracks.map(t=>`<option value="${esc(t.id)}" ${t.id===a.trackId?'selected':''}>${esc(t.name)}</option>`).join('')}</select></label><div class="field-row"><label class="field"><span>Owner</span><input name="owner" value="${esc(a.owner)}" maxlength="100" placeholder="Person or team"></label><label class="field"><span>Status</span><select name="status">${STATUSES.map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join('')}</select></label></div><div class="field-row"><label class="field"><span>Start date</span><input name="start" type="date" value="${esc(a.start)}" required min="${roadmap.startDate}" max="${addMonths(roadmap.startDate,roadmap.periodCount*3)}"></label><label class="field"><span>Finish date</span><input name="end" type="date" value="${esc(a.end)}" required min="${roadmap.startDate}" max="${addMonths(roadmap.startDate,roadmap.periodCount*3)}"></label></div><label class="field"><span>Description / acceptance criteria</span><textarea name="description" maxlength="8000" placeholder="Describe the outcome and how you will know it is complete.">${esc(a.description)}</textarea></label><div class="field-heading">Depends on</div><p class="field-note">Finish-to-start: these activities must be complete before this activity can start. Self-links and circular paths are prevented.</p><div class="dependencies-list">${roadmap.activities.filter(b=>b.id!==a.id).map(b=>`<label class="dependency-option"><input type="checkbox" name="dependency" value="${esc(b.id)}" ${a.dependencies.includes(b.id)?'checked':''} ${unavailable.has(b.id)?'disabled':''}><span>${esc(b.title)}<small>${esc(roadmap.tracks.find(t=>t.id===b.trackId).name)} · ${esc(b.status)}${unavailable.has(b.id)?' · would create a cycle':''}</small></span></label>`).join('')||'<div class="deplist-note">No other activities yet. Add one to create a dependency.</div>'}</div><div id="dependency-warnings" style="margin-top:15px"></div>${existing?`<h3 class="section-title">Downstream impact</h3><div class="impact-box"><strong>${affected.length} ${affected.length===1?'activity depends':'activities depend'} on this activity</strong><p>${successors.length} direct successors. A change to its dates can affect the work that follows.</p></div>${successors.map(b=>`<div class="dependent-item"><span>${esc(b.title)}</span><span class="badge ${statusClass(b.status)}">${esc(b.status)}</span></div>`).join('')}`:''}</div><div class="drawer-footer">${existing?'<button type="button" class="delete" id="delete-activity">Delete activity</button>':''}<button type="button" class="button" id="cancel-activity">Cancel</button><button type="submit" class="button primary" id="save-activity">${existing?'Save changes':'Create activity'}</button></div></form>`;
  $('#drawer').hidden=false;$('#drawer-overlay').hidden=false;document.body.style.overflow='hidden';
  $('.field-row').insertAdjacentHTML('afterend',assigneeField(a));
  $('#close-drawer').addEventListener('click',closeDrawer);$('#cancel-activity').addEventListener('click',closeDrawer);
  const form=$('.activity-form');
  const refreshWarnings=()=>{
    const draft=activityFromForm(form,a.id),pending=blockers(draft,roadmap),conflicts=scheduleConflicts(draft,roadmap);
    $('#dependency-warnings').innerHTML=(pending.length?`<div class="form-alert info"><strong>${pending.length} unfinished prerequisites.</strong><br>${pending.map(b=>esc(b.title)).join(', ')}</div>`:'')+(conflicts.length?`<div class="form-alert"><strong>Scheduled before prerequisites finish.</strong><br>${conflicts.map(b=>`${esc(b.title)} finishes ${formatDate(b.end)}`).join('<br>')}<br>Review these dates. Dates do not move automatically.</div>`:'');
  };
  form.addEventListener('change',refreshWarnings);refreshWarnings();
  form.addEventListener('submit',async e=>{
    e.preventDefault();$('#form-error').hidden=true;const button=$('#save-activity');button.disabled=true;
    try{await commit(updateActivity(roadmap,activityFromForm(form,a.id)));closeDrawer();toast(existing?'Activity updated.':'Activity created.');}catch(error){$('#form-error').textContent=error.message;$('#form-error').hidden=false;$('#form-error').scrollIntoView({block:'nearest'});}finally{button.disabled=false;}
  });
  $('#delete-activity')?.addEventListener('click',async()=>{
    const yes=await confirmAction('Delete this activity?',`This removes “${a.title}” and its ${successors.length} direct dependency links. Successor activities stay on the roadmap.`, 'Delete activity');
    if(yes)try{await commit(deleteActivity(roadmap,a.id));closeDrawer();toast('Activity deleted.');}catch(error){toast(error.message,true);}
  });
  decorateDrawer(a);
  requestAnimationFrame(()=>isEditor()?form.elements.title.focus():$('#close-drawer').focus());
}
function confirmAction(title,message,label){
  return new Promise(resolve=>{
    const dialog=$('#confirm-dialog');$('#confirm-title').textContent=title;$('#confirm-message').textContent=message;$('#confirm-ok').textContent=label;
    const finish=result=>{dialog.close();$('#confirm-ok').onclick=null;$('#confirm-cancel').onclick=null;dialog.oncancel=null;resolve(result);};
    $('#confirm-ok').onclick=()=>finish(true);$('#confirm-cancel').onclick=()=>finish(false);dialog.oncancel=e=>{e.preventDefault();finish(false);};dialog.showModal();
  });
}
function openSettings(){
  if(!roadmap||!isEditor())return;
  const draft=structuredClone(roadmap),dialog=$('#settings-dialog');
  dialog.innerHTML=`<h2>Roadmap settings</h2><p>Make this roadmap fit your client. A cell groups activities by workstream and their start quarter.</p><form id="settings-form"><div class="form-alert" id="settings-error" role="alert" hidden></div><label class="field"><span>Roadmap title</span><input name="title" value="${esc(draft.title)}" maxlength="120" required></label><label class="field"><span>Client / workspace</span><input name="client" value="${esc(draft.client)}" maxlength="120" required></label><div class="field-row"><label class="field"><span>Roadmap start</span><input name="startDate" type="date" value="${draft.startDate}" required></label><label class="field"><span>Number of quarters</span><input name="periodCount" type="number" min="4" max="12" value="${draft.periodCount}" required></label></div><p class="field-note">Changing the start date shifts every activity by the same number of days. Shortening the horizon must still leave room for every activity.</p><div class="field-heading">Quarter labels</div><div id="quarter-labels"></div><div class="field-heading">Workstreams</div><div id="settings-tracks" class="settings-tracks"></div><button class="text-button" id="add-track" type="button">+ Add workstream</button><div class="dialog-actions"><button type="button" id="reset-sample" class="text-button" style="margin-right:auto">Reset example</button><button type="button" class="button" id="cancel-settings">Cancel</button><button type="submit" class="button primary">Save settings</button></div></form>`;
  const labels=Array.from({length:12},(_,i)=>draft.quarterLabels?.[i]||`Q${i+1}`);
  const renderQuarters=()=>{const count=Number($('#settings-form [name=periodCount]').value);$('#quarter-labels').innerHTML=labels.slice(0,count).map((label,i)=>`<label class="field"><span>Quarter ${i+1}</span><input data-quarter-label="${i}" value="${esc(label)}" required maxlength="80"></label>`).join('');document.querySelectorAll('[data-quarter-label]').forEach(input=>input.oninput=()=>labels[+input.dataset.quarterLabel]=input.value);};
  $('#settings-form [name=periodCount]').oninput=renderQuarters;renderQuarters();
  const renderTracks=()=>{
    $('#settings-tracks').innerHTML=draft.tracks.map((t,i)=>`<div class="track-setting"><input type="color" value="${t.color}" data-track-color="${i}" aria-label="Colour for ${esc(t.name)}"><input type="text" value="${esc(t.name)}" data-track-name="${i}" maxlength="80" required aria-label="Workstream ${i+1} name"><button type="button" data-remove-track="${i}" ${draft.activities.some(a=>a.trackId===t.id)||draft.tracks.length===1?'disabled':''} aria-label="Remove ${esc(t.name)}" title="Move or remove all activities before deleting a workstream"><svg class="mi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5 5 19"/></svg></button></div>`).join('');
    document.querySelectorAll('[data-track-name]').forEach(input=>input.addEventListener('input',()=>draft.tracks[Number(input.dataset.trackName)].name=input.value));
    document.querySelectorAll('[data-track-color]').forEach(input=>input.addEventListener('input',()=>draft.tracks[Number(input.dataset.trackColor)].color=input.value));
    document.querySelectorAll('[data-remove-track]').forEach(button=>button.addEventListener('click',()=>{draft.tracks.splice(Number(button.dataset.removeTrack),1);renderTracks();}));
  };
  renderTracks();$('#cancel-settings').onclick=()=>dialog.close();
  $('#add-track').onclick=()=>{if(draft.tracks.length>=20){toast('A roadmap supports up to 20 workstreams.',true);return;}draft.tracks.push({id:newId(),name:'New workstream',color:COLORS[draft.tracks.length%COLORS.length]});renderTracks();};
  $('#reset-sample').onclick=async()=>{if(await confirmAction('Reset to the example plan?','This replaces all activities, dependencies and settings. Export your current roadmap first if you want to keep it.','Reset roadmap'))try{await commit(seedRoadmap());dialog.close();toast('Example roadmap restored.');}catch(error){toast(error.message,true);}};
  $('#settings-form').onsubmit=async e=>{
    e.preventDefault();const data=new FormData(e.target),start=data.get('startDate');const delta=(Date.parse(start)-Date.parse(draft.startDate))/86400000;
    const shifted=date=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10);};
    const next={...draft,title:data.get('title').trim(),client:data.get('client').trim(),startDate:start,periodCount:Number(data.get('periodCount')),quarterLabels:labels.slice(0,Number(data.get('periodCount'))).map(s=>s.trim()),activities:draft.activities.map(a=>({...a,start:shifted(a.start),end:shifted(a.end)}))};
    try{await commit(next);dialog.close();toast('Roadmap settings updated.');}catch(error){$('#settings-error').textContent=error.message;$('#settings-error').hidden=false;}
  };
  dialog.showModal();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;render();}));
$('#search').addEventListener('input',render);$('#status-filter').addEventListener('change',render);
$('#density').addEventListener('click',()=>{compact=!compact;$('#density').textContent=compact?'Comfortable view':'Compact view';render();});
$('#add-activity').addEventListener('click',()=>openActivity());$('#settings').addEventListener('click',openSettings);
$('#drawer-overlay').addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{
  if($('#drawer').hidden||$('dialog[open]'))return;
  if(e.key==='Escape'){closeDrawer();return;}
  if(e.key==='Tab'){const nodes=[...$('#drawer').querySelectorAll('button,input,textarea,select')].filter(n=>!n.disabled&&!n.hidden);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
$('#presentation-preview').addEventListener('click',()=>{
  if(!roadmap)return;
  try{
    sessionStorage.setItem('mightora-roadmaps-presentation-source-v1',JSON.stringify(roadmap));
    sessionStorage.setItem('mightora-roadmaps-presentation-return-v1',location.href);
    sessionStorage.removeItem('mightora-roadmaps-presentation-draft-v1');
    location.assign(new URL('deck.html',new URL('./',location.href)).href);
  }catch(error){toast('Could not open presentation preview: '+error.message,true);}
});
$('#export').addEventListener('click',()=>{
  if(!roadmap)return;try{const blob=new Blob([$('#export-format').value==='csv'?roadmapToCsv(roadmap):roadmapToMarkdown(roadmap)],{type:$('#export-format').value==='csv'?'text/csv':'text/markdown'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='roadmap.'+$('#export-format').value;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Roadmap exported, including all dependency links.');}catch(error){toast(error.message,true);}
});
$('#import').addEventListener('click',()=>{if(roadmap)$('#import-file').click();});
$('#import-file').addEventListener('change',async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{if(file.size>2_000_000)throw new Error('Choose a roadmap file smaller than 2 MB.');const source=await file.text(),next=file.name.toLowerCase().endsWith('.csv')?roadmapFromCsv(source):roadmapFromMarkdown(source);if(await confirmAction('Replace the current roadmap?',`Import “${next.title}” with ${next.activities.length} activities and ${next.tracks.length} workstreams. Export the current roadmap first to keep a copy.`,'Import roadmap')){await commit(next);toast('Roadmap imported.');}}catch(error){toast(error.message,true);}
});
load();
