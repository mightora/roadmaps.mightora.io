import {buildRoadmapDeck,validateDeck,activeSlides} from './deck-model.mjs';
import {downloadPowerPoint} from './deck-export.mjs';
import {validateRoadmap} from './model.mjs';

const SOURCE='mightora-roadmaps-presentation-source-v1';
const DRAFT='mightora-roadmaps-presentation-draft-v1';
const RETURN='mightora-roadmaps-presentation-return-v1';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeColor=v=>/^#[0-9a-f]{6}$/i.test(v||'')?v:'#376d62';
const uid=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2);
let source=null,deck=null,selected=0;
function status(message,error=false){$('#deck-status').textContent=message;$('#deck-status').style.color=error?'#a24632':'#276c47';}
function store(){try{sessionStorage.setItem(DRAFT,JSON.stringify(deck));}catch{status('Unable to save a temporary deck draft in this browser.',true);}}
function selectedSlide(){return deck?.slides[selected];}
function summaryCount(){return activeSlides(deck).length+' included / '+deck.slides.length+' total';}
function slideHtml(s,index){
  const footer='<div class="deck-slide-footer"><span>MIGHTORA ROADMAPS · EDITABLE PRESENTATION</span><span>'+(index+1)+' / '+deck.slides.length+'</span></div>';
  if(s.kind==='cover')return '<article class="deck-slide cover"><div class="deck-cover-art" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><div class="deck-slide-kicker">MIGHTORA / ROADMAPS</div><h2>'+esc(s.title)+'</h2><p class="deck-slide-subtitle">'+esc(s.subtitle)+'</p><p class="deck-slide-summary">'+esc(s.summary)+'</p>'+footer+'</article>';
  const stats=s.stats.length?'<div class="deck-slide-stats" style="--stat-cols:'+Math.min(4,s.stats.length)+'">'+s.stats.slice(0,4).map(x=>'<div class="deck-slide-stat"><strong>'+esc(x.value)+'</strong><span>'+esc(x.label)+'</span></div>').join('')+'</div>':'';
  const cards=s.cards.length?'<div class="deck-slide-cards" style="--card-rows:'+Math.ceil(Math.min(s.cards.length,4)/2)+'">'+s.cards.slice(0,4).map(c=>'<div class="deck-slide-card" style="--card-color:'+safeColor(c.color)+'"><strong>'+esc(c.title)+'</strong><p>'+esc(c.detail)+'</p><small>'+esc(c.meta)+'</small></div>').join('')+'</div>':(!s.stats.length&&s.kind!=='timeline'?'<div class="deck-empty">No content on this slide yet. Add a card in the editor.</div>':'');
  const timeline=s.kind==='timeline'?'<div class="deck-timeline" style="--quarter-count:'+s.periods.length+';--track-count:'+s.timeline.length+'"><div class="deck-timeline-header">WORKSTREAM</div>'+s.periods.map(p=>'<div class="deck-timeline-header">'+esc(p)+'</div>').join('')+s.timeline.map(row=>'<div class="deck-timeline-label" style="--track-color:'+safeColor(row.color)+'"><i aria-hidden="true"></i><span>'+esc(row.title)+'</span></div>'+row.cells.map(cell=>'<div class="deck-timeline-cell'+(cell.count?' filled':'')+(cell.blocked?' blocked':'')+'">'+(cell.count?'<strong>'+cell.count+' activit'+(cell.count===1?'y':'ies')+'</strong><small>'+cell.done+' complete</small>':'')+'</div>').join('')).join('')+'</div>':'';
  return '<article class="deck-slide"><div class="deck-slide-kicker">'+esc(s.section.toUpperCase())+'</div><h2>'+esc(s.title)+'</h2><p class="deck-slide-subtitle">'+esc(s.subtitle)+'</p><p class="deck-slide-summary">'+esc(s.summary)+'</p><div class="deck-slide-content">'+stats+timeline+cards+'</div>'+footer+'</article>';
}
function renderList(){
  $('#deck-slide-count').textContent=summaryCount();
  $('#deck-slide-list').innerHTML=deck.slides.map((s,i)=>'<div class="deck-list-item'+(i===selected?' selected':'')+(!s.enabled?' muted':'')+'" role="listitem"><button class="deck-list-select" type="button" data-select="'+i+'" aria-current="'+(i===selected?'true':'false')+'"><span class="deck-list-kicker">'+(i+1)+'. '+esc(s.section)+'</span><span class="deck-list-title">'+esc(s.title||'Untitled slide')+'</span></button><div class="deck-list-bottom"><label><input type="checkbox" data-toggle="'+i+'" '+(s.enabled?'checked':'')+'> Include</label><span>'+esc(s.kind)+'</span></div></div>').join('');
}
function renderPreview(){
  const s=selectedSlide();if(!s)return;
  $('#deck-stage').innerHTML=slideHtml(s,selected);
  $('#deck-active-title').textContent=s.title||'Untitled slide';
  $('#deck-position').textContent='Slide '+(selected+1)+' of '+deck.slides.length+(s.enabled?'':' · excluded from export');
  $('#deck-prev').disabled=selected===0;$('#deck-next').disabled=selected===deck.slides.length-1;
  $('#deck-export-pptx').disabled=!activeSlides(deck).length;
}
const field=(label,value,attr,rows=0)=>{
  const max=attr.includes('data-field="title"')?200:attr.includes('data-field="subtitle"')?1000:attr.includes('data-field="summary"')||attr.includes('data-field="notes"')?8000:attr.includes('data-card-field="title"')?500:attr.includes('data-card-field="detail"')?8000:attr.includes('data-card-field="meta"')?1000:attr.includes('data-stat-field="label"')?200:attr.includes('data-stat-field="value"')?100:attr.includes('data-period-index')?80:attr.includes('data-row-index')?160:500;
  return '<label class="deck-field"><span>'+esc(label)+'</span>'+(rows?'<textarea '+attr+' rows="'+rows+'" maxlength="'+max+'">'+esc(value)+'</textarea>':'<input type="text" '+attr+' maxlength="'+max+'" value="'+esc(value)+'">')+'</label>';
};
function renderEditor(){
  const s=selectedSlide();if(!s)return;
  let html='<label class="deck-toggle"><input type="checkbox" id="deck-current-enabled" '+(s.enabled?'checked':'')+'> Include this slide in PowerPoint</label>'+
    field('Slide title',s.title,'data-field="title"')+field('Subtitle',s.subtitle,'data-field="subtitle"')+field('Introduction / summary',s.summary,'data-field="summary"',3);
  if(s.stats.length)html+='<h3 class="deck-editor-heading">Key figures</h3>'+s.stats.map((stat,i)=>'<div class="deck-editor-card">'+field('Label',stat.label,'data-stat-index="'+i+'" data-stat-field="label"')+field('Value',stat.value,'data-stat-index="'+i+'" data-stat-field="value"')+'</div>').join('');
  if(s.kind==='cover'){
    html+='<p class="deck-editor-note">The cover uses its title, subtitle and introduction. The executive overview on the next slide contains the key figures.</p>';
  }else if(s.kind==='timeline'){
    html+='<h3 class="deck-editor-heading">Quarter labels</h3>'+s.periods.map((p,i)=>field('Quarter '+(i+1),p,'data-period-index="'+i+'"')).join('');
    html+='<h3 class="deck-editor-heading">Workstream labels</h3>'+s.timeline.map((row,i)=>field('Workstream '+(i+1),row.title,'data-row-index="'+i+'"')).join('');
    html+='<p class="deck-editor-note">Activity counts and completion states come from the roadmap snapshot. To change those, edit the roadmap and regenerate the presentation.</p>';
  }else{
    html+='<h3 class="deck-editor-heading">Content cards</h3>'+s.cards.map((card,i)=>'<div class="deck-editor-card">'+field('Heading',card.title,'data-card-index="'+i+'" data-card-field="title"')+field('Description',card.detail,'data-card-index="'+i+'" data-card-field="detail"',2)+field('Supporting detail',card.meta,'data-card-index="'+i+'" data-card-field="meta"')+'<div class="deck-editor-card-actions"><button type="button" class="deck-button secondary" data-remove-card="'+i+'">Remove card</button></div></div>').join('');
    if(s.cards.length<4)html+='<button type="button" id="deck-add-card" class="deck-button secondary">+ Add content card</button>';
  }
  html+='<h3 class="deck-editor-heading">Presenter notes</h3>'+field('Notes (also added to PowerPoint)',s.notes,'data-field="notes"',3);
  html+='<div class="deck-editor-actions"><button type="button" class="deck-button secondary" id="deck-move-up" '+(selected===0?'disabled':'')+'>↑ Move up</button><button type="button" class="deck-button secondary" id="deck-move-down" '+(selected===deck.slides.length-1?'disabled':'')+'>↓ Move down</button></div>';
  html+='<p class="deck-editor-note">Edits affect this presentation draft only. You can save a deck draft as JSON, reopen it later and export the same slides to PowerPoint.</p>';
  $('#deck-editor').innerHTML=html;
}
function render(){renderList();renderPreview();renderEditor();}
function mutate(){store();renderPreview();renderList();}
function select(i){if(i<0||i>=deck.slides.length)return;selected=i;render();$('#deck-stage').focus?.();}
function downloadText(text,name,type){
  const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function optionsFromForm(){return {includeOwners:$('#deck-opt-owners').checked,includeDescriptions:$('#deck-opt-descriptions').checked,includeDeepDives:$('#deck-opt-deepdives').checked};}
function setOptions(o={}){$('#deck-opt-owners').checked=!!o.includeOwners;$('#deck-opt-descriptions').checked=o.includeDescriptions!==false;$('#deck-opt-deepdives').checked=!!o.includeDeepDives;}
function loadDraft(){
  try{
    const raw=sessionStorage.getItem(DRAFT);if(raw){const saved=validateDeck(JSON.parse(raw));if(!source||saved.sourceTitle===source.title)return saved;}
  }catch{status('Saved presentation draft could not be opened; generating a fresh one.',true);}
  return source?buildRoadmapDeck(source):null;
}
function init(){
  try{const raw=sessionStorage.getItem(SOURCE);if(raw)source=validateRoadmap(JSON.parse(raw));}catch{source=null;}
  try{const back=sessionStorage.getItem(RETURN);if(back){const u=new URL(back,location.href);if(u.origin===location.origin)$('#deck-back').href=u.href;}}catch{}
  deck=loadDraft();
  if(!deck){$('#deck-workspace').hidden=true;$('#deck-error').hidden=false;$('#deck-error').innerHTML='<strong>No roadmap loaded.</strong> Open a roadmap in the editor and choose <em>Presentation preview</em>. You can also open a saved deck draft from this page.';return;}
  setOptions(deck.options);$('#deck-subheading').textContent='A presentation based on '+deck.sourceTitle+'. Edit the slides without changing your roadmap.';render();status('Deck ready · '+summaryCount()+'.');
}
$('#deck-slide-list').addEventListener('click',e=>{const button=e.target.closest('[data-select]');if(button)select(Number(button.dataset.select));});
$('#deck-slide-list').addEventListener('change',e=>{const input=e.target.closest('[data-toggle]');if(!input)return;deck.slides[Number(input.dataset.toggle)].enabled=input.checked;mutate();});
$('#deck-editor').addEventListener('input',e=>{
  const el=e.target,s=selectedSlide();if(!s)return;
  if(el.dataset.field){s[el.dataset.field]=el.value;}
  else if(el.dataset.cardIndex!==undefined){s.cards[Number(el.dataset.cardIndex)][el.dataset.cardField]=el.value;}
  else if(el.dataset.statIndex!==undefined){s.stats[Number(el.dataset.statIndex)][el.dataset.statField]=el.value;}
  else if(el.dataset.periodIndex!==undefined){s.periods[Number(el.dataset.periodIndex)]=el.value;}
  else if(el.dataset.rowIndex!==undefined){s.timeline[Number(el.dataset.rowIndex)].title=el.value;}
  else return;
  mutate();
});
$('#deck-editor').addEventListener('change',e=>{if(e.target.id==='deck-current-enabled'){selectedSlide().enabled=e.target.checked;mutate();}});
$('#deck-editor').addEventListener('click',e=>{
  const remove=e.target.closest('[data-remove-card]');
  if(remove){selectedSlide().cards.splice(Number(remove.dataset.removeCard),1);store();render();return;}
  if(e.target.closest('#deck-add-card')){selectedSlide().cards.push({title:'New item',detail:'Add the information you want to present.',meta:'',status:'',color:'#376d62'});store();render();return;}
  if(e.target.closest('#deck-move-up')&&selected>0){[deck.slides[selected-1],deck.slides[selected]]=[deck.slides[selected],deck.slides[selected-1]];selected--;store();render();return;}
  if(e.target.closest('#deck-move-down')&&selected<deck.slides.length-1){[deck.slides[selected+1],deck.slides[selected]]=[deck.slides[selected],deck.slides[selected+1]];selected++;store();render();}
});
$('#deck-prev').onclick=()=>select(selected-1);$('#deck-next').onclick=()=>select(selected+1);
$('#deck-add-slide').onclick=()=>{
  deck.slides.push({id:'custom-'+uid(),kind:'cards',section:'Commentary',title:'Additional context',subtitle:'',summary:'Add a decision, risk or recommendation for your audience.',cards:[],stats:[],timeline:[],periods:[],notes:'',enabled:true});
  selected=deck.slides.length-1;store();render();status('Commentary slide added.');
};
$('#deck-regenerate').onclick=()=>{
  if(!source){status('The original roadmap is not available. Reopen the editor to regenerate.',true);return;}
  if(!confirm('Regenerate this deck from the roadmap? This replaces all slide edits, order and inclusion choices. Save a deck draft first if you need to keep them.'))return;
  deck=buildRoadmapDeck(source,optionsFromForm());selected=0;store();render();status('Slides regenerated from the original roadmap.');
};
$('#deck-download-json').onclick=()=>{if(!deck)return;downloadText(JSON.stringify(validateDeck(deck),null,2),(deck.sourceTitle||'roadmap').replace(/[^a-z0-9]+/gi,'-').toLowerCase()+'-deck.json','application/json');status('Deck draft saved as JSON.');};
$('#deck-import-json').onclick=()=>$('#deck-json-file').click();
$('#deck-json-file').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{if(file.size>4_000_000)throw Error('Choose a deck draft smaller than 4 MB.');const next=validateDeck(JSON.parse(await file.text()));deck=structuredClone(next);selected=0;setOptions(deck.options);$('#deck-workspace').hidden=false;$('#deck-error').hidden=true;store();render();status('Deck draft opened. The original roadmap was not changed.');}catch(error){status('Could not open deck draft: '+error.message,true);}
};
$('#deck-export-pptx').onclick=async()=>{
  const button=$('#deck-export-pptx');button.disabled=true;button.textContent='Preparing PowerPoint…';status('Generating editable PowerPoint slides in your browser…');
  try{await downloadPowerPoint(validateDeck(deck));status('PowerPoint downloaded. The text and shapes can be edited in PowerPoint.');}
  catch(error){status('PowerPoint export failed: '+error.message,true);}
  finally{button.textContent='Export PowerPoint (.pptx)';button.disabled=!activeSlides(deck).length;}
};
$('#deck-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#deck-stage-wrap').requestFullscreen();}catch{status('Full-screen preview is unavailable in this browser.',true);}};
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,button,select'))return;if(e.key==='ArrowRight')select(Math.min(deck.slides.length-1,selected+1));if(e.key==='ArrowLeft')select(Math.max(0,selected-1));});
init();
