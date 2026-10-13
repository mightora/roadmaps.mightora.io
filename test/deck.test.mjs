import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seedRoadmap} from '../dist/model.mjs';
import {buildRoadmapDeck,validateDeck,activeSlides} from '../dist/deck-model.mjs';
import {createPowerPoint} from '../dist/deck-export.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const roadmap=seedRoadmap();

test('presentation includes title, high-level metrics, overview, dependencies, quarters, workstreams and next steps',()=>{
  const deck=buildRoadmapDeck(roadmap);
  assert.equal(deck.schemaVersion,1);
  assert.equal(deck.slides[0].kind,'cover');
  assert.equal(deck.slides[0].title,roadmap.title);
  assert.ok(deck.slides.some(s=>s.section==='Executive overview'));
  assert.ok(deck.slides.some(s=>s.kind==='timeline'));
  assert.ok(deck.slides.some(s=>s.section==='Dependencies'));
  assert.ok(deck.slides.filter(s=>s.section==='Quarter-by-quarter').length>=roadmap.periodCount);
  assert.ok(deck.slides.filter(s=>s.section==='Workstream detail').length>=roadmap.tracks.length);
  assert.equal(deck.slides.at(-1).section,'Decisions & next steps');
  assert.ok(deck.slides.length>20);
  assert.ok(deck.slides.every(s=>s.cards.length<=4),'Slides must stay readable');
  assert.doesNotThrow(()=>validateDeck(deck));
});

test('timeline paginates for readability and covers all workstreams and quarters',()=>{
  const deck=buildRoadmapDeck(roadmap);
  const timeline=deck.slides.filter(s=>s.kind==='timeline');
  assert.equal(timeline.length,4);
  assert.ok(timeline.every(s=>s.timeline.length<=7&&s.periods.length<=6));
  const quarters=new Set(timeline.flatMap(s=>s.periods));
  assert.equal(quarters.size,roadmap.periodCount);
  const names=new Set(timeline.flatMap(s=>s.timeline.map(row=>row.title)));
  assert.equal(names.size,roadmap.tracks.length);
});

test('every activity and dependency link appears in a detail slide',()=>{
  const deck=buildRoadmapDeck(roadmap);
  const details=deck.slides.filter(s=>s.section==='Workstream detail').flatMap(s=>s.cards);
  assert.equal(details.length,roadmap.activities.length);
  for(const a of roadmap.activities)assert.ok(details.some(c=>c.title===a.title));
  const links=deck.slides.filter(s=>s.section==='Dependencies'&&s.kind==='cards').flatMap(s=>s.cards);
  assert.equal(links.length,roadmap.activities.reduce((n,a)=>n+a.dependencies.length,0));
  assert.ok(links.every(c=>c.title.includes(' → ')));
});

test('owners are opt-in, descriptions and deep dives are configurable',()=>{
  const normal=buildRoadmapDeck(roadmap);
  const owners=roadmap.activities.map(a=>a.owner).filter(Boolean);
  assert.ok(!normal.slides.filter(s=>s.section==='Workstream detail').flatMap(s=>s.cards).some(c=>owners.some(o=>c.meta.includes(o))));
  const detailed=buildRoadmapDeck(roadmap,{includeOwners:true,includeDescriptions:false,includeDeepDives:true});
  assert.equal(detailed.slides.filter(s=>s.section==='Activity deep dive').length,roadmap.activities.length);
  assert.ok(detailed.slides.filter(s=>s.section==='Workstream detail').flatMap(s=>s.cards).some(c=>owners.some(o=>c.meta.includes(o))));
  assert.ok(detailed.slides.filter(s=>s.section==='Workstream detail').flatMap(s=>s.cards).every(c=>c.detail===''));
});

test('deck editing does not mutate the original roadmap',()=>{
  const source=JSON.stringify(roadmap);
  const deck=buildRoadmapDeck(roadmap);
  deck.slides[0].title='Board presentation';
  deck.slides[1].enabled=false;
  deck.slides[2].notes='Discuss schedule risks';
  assert.equal(JSON.stringify(roadmap),source);
  assert.equal(activeSlides(deck).length,deck.slides.length-1);
  assert.equal(validateDeck(deck).slides[0].title,'Board presentation');
});

test('invalid deck imports and unsafe colour values are rejected',()=>{
  const deck=buildRoadmapDeck(roadmap);
  assert.throws(()=>validateDeck({schemaVersion:1,slides:[]}));
  const invalid=structuredClone(deck);invalid.slides[0].id=invalid.slides[1].id;
  assert.throws(()=>validateDeck(invalid));
  const badColor=structuredClone(deck);badColor.slides.find(s=>s.cards.length).cards[0].color='red; background:url(javascript:alert(1))';
  assert.throws(()=>validateDeck(badColor));
});

class FakePptx{
  constructor(){this.ShapeType={rect:'rect',roundRect:'roundRect'};this.slides=[];}
  addSlide(){const result={shapes:[],texts:[],notes:[],addShape(type,opts){this.shapes.push({type,opts});},addText(text,opts){this.texts.push({text,opts});},addNotes(text){this.notes.push(text);}};this.slides.push(result);return result;}
}
test('PowerPoint export uses editable native shapes and text for every included slide',()=>{
  const deck=buildRoadmapDeck(roadmap);
  deck.slides[1].enabled=false;deck.slides[0].notes='Present this to the steering group';
  const pptx=createPowerPoint(deck,FakePptx);
  assert.equal(pptx.layout,'LAYOUT_WIDE');
  assert.equal(pptx.slides.length,deck.slides.length-1);
  assert.ok(pptx.slides.every(s=>s.texts.length>3&&s.shapes.length>1));
  assert.ok(pptx.slides.some(s=>s.texts.some(t=>t.text===roadmap.title)));
  assert.ok(pptx.slides.some(s=>s.texts.some(t=>t.text==='WORKSTREAM')));
  assert.ok(pptx.slides[0].notes.includes('Present this to the steering group'));
});

test('preview, editor, save/load, presentation entry point and help page are wired',()=>{
  const html=read('dist/index.html'),ui=read('dist/deck-ui.mjs'),page=read('dist/deck.html'),app=read('dist/app.mjs');
  assert.ok(html.includes('id="presentation-preview"'));
  assert.ok(app.includes("sessionStorage.setItem('mightora-roadmaps-presentation-source-v1'"));
  assert.ok(page.includes('id="deck-stage"')&&page.includes('id="deck-editor"'));
  assert.ok(page.includes('id="deck-export-pptx"'));
  assert.ok(ui.includes('downloadPowerPoint(validateDeck(deck))'));
  assert.ok(ui.includes('id="deck-current-enabled"'));
  assert.ok(ui.includes('sessionStorage.setItem(DRAFT'));
  assert.ok(read('dist/docs/presentations.html').includes('Presentation exports'));
});
