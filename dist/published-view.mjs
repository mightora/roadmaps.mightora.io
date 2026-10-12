import {validateRoadmap,validateReadiness,quarterOf,periodLabel,blockers} from './model.mjs';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cls=s=>({'Planned':'planned','In progress':'progress','Done':'done','On hold':'hold'}[s]||'planned');
const readable=date=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));

export function renderPublishedRoadmap(source){
  const r=validateReadiness(validateRoadmap(source));
  const total=r.activities.length,done=r.activities.filter(a=>a.status==='Done').length;
  const active=r.activities.filter(a=>a.status==='In progress').length;
  const blocked=r.activities.filter(a=>a.status!=='Done'&&blockers(a,r).length).length;
  const percent=total?Math.round(done/total*100):0;
  const byId=new Map(r.activities.map(a=>[a.id,a]));
  const periods=Array.from({length:r.periodCount},(_,i)=>periodLabel(r,i));
  const next=r.activities.filter(a=>a.status!=='Done'&&a.status!=='On hold'&&!blockers(a,r).length)
    .sort((a,b)=>a.start.localeCompare(b.start)).slice(0,3);
  const stats=[['Activities',total],['In progress',active],['Waiting on others',blocked],['Complete',percent+'%']];
  const cards=(items)=>items.length?items.map(a=>{
    const deps=a.dependencies.map(id=>byId.get(id)).filter(Boolean);
    const body=[a.description?'<p class="activity-description">'+esc(a.description)+'</p>':'',
      '<p class="activity-dates">'+esc(readable(a.start))+' – '+esc(readable(a.end))+'</p>',
      a.owner?'<p class="activity-owner">Owner: '+esc(a.owner)+'</p>':'',
      deps.length?'<div class="activity-dependencies"><strong>Depends on</strong><ul>'+deps.map(d=>'<li>'+esc(d.title)+'</li>').join('')+'</ul></div>':''].join('');
    return '<details class="published-activity"><summary><span class="activity-name">'+esc(a.title)+'</span><span class="published-status '+cls(a.status)+'">'+esc(a.status)+'</span></summary><div class="activity-detail">'+body+'</div></details>';
  }).join(''):'<span class="empty-period" aria-label="No activities in this quarter">—</span>';
  return '<div class="published-hero"><div class="published-hero-copy"><p class="published-eyebrow">MIGHTORA · PUBLISHED ROADMAP</p><h1>'+esc(r.title)+'</h1><p class="published-subtitle">'+esc(r.client)+' · '+esc(readable(r.startDate))+' · '+r.periodCount+' quarters</p><p class="published-summary">A clear view of the work, the timeline and what depends on what.</p></div><img class="published-hero-art" src="./assets/publish-preview.svg" alt="" aria-hidden="true"></div>'+
    '<section class="published-overview" aria-label="Roadmap progress"><div class="published-stat-grid">'+stats.map(([label,value])=>'<div class="published-stat"><strong>'+value+'</strong><span>'+label+'</span></div>').join('')+'</div><div class="published-progress-label"><span>Overall completion</span><strong>'+percent+'%</strong></div><div class="published-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'" aria-label="Roadmap completion"><span style="width:'+percent+'%"></span></div></section>'+
    '<section class="published-section" aria-labelledby="timeline-title"><div class="published-section-heading"><div><p class="published-eyebrow">THE DELIVERY JOURNEY</p><h2 id="timeline-title">Workstreams &amp; milestones</h2><p>Select an activity to see its dates, description and prerequisites.</p></div><span class="published-count">'+r.tracks.length+' workstreams · '+r.periodCount+' quarters</span></div>'+
    '<div class="published-board-scroll" tabindex="0" aria-label="Scroll horizontally to explore the roadmap"><div class="published-board" style="--quarters:'+r.periodCount+'"><div class="published-corner">WORKSTREAM</div>'+
    periods.map(p=>'<div class="published-period"><small>'+esc(p.phase)+'</small><strong>'+esc(p.title)+'</strong><span>'+esc(readable(p.start))+'</span></div>').join('')+
    r.tracks.map((track,i)=>'<div class="published-track-name"><span class="published-track-dot" style="background:'+esc(track.color)+'"></span><strong>'+esc(track.name)+'</strong><small>'+r.activities.filter(a=>a.trackId===track.id).length+' activities</small></div>'+
      periods.map((p,q)=>'<div class="published-cell" data-quarter="'+(q+1)+'">'+cards(r.activities.filter(a=>a.trackId===track.id&&quarterOf(a.start,r)===q).sort((a,b)=>a.start.localeCompare(b.start)))+'</div>').join('')).join('')+
    '</div></div></section>'+
    '<section class="published-next" aria-labelledby="next-title"><div><p class="published-eyebrow">WHAT COMES NEXT</p><h2 id="next-title">Ready to move forward</h2><p>Activities without unfinished prerequisites.</p></div><ol>'+ (next.length?next.map(a=>'<li><strong>'+esc(a.title)+'</strong><span>'+esc(readable(a.start))+' · '+esc(r.tracks.find(t=>t.id===a.trackId)?.name||'')+'</span></li>').join(''):'<li><strong>No ready activities at present</strong><span>Review dependencies or completed work.</span></li>')+'</ol></section>';
}
