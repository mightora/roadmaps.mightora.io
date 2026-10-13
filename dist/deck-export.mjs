import {activeSlides} from './deck-model.mjs';
import {normalizeDeckTheme,presentationPalette} from './deck-theme.mjs';

function makeRenderer(theme){
const C=presentationPalette(theme);
const clean=s=>String(s??'');
const limit=(s,n=360)=>clean(s).length>n?clean(s).slice(0,n-1)+'…':clean(s);
const hex=s=>/^#[0-9a-f]{6}$/i.test(s||'')?s.slice(1).toUpperCase():C.green;
const fileName=s=>clean(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'roadmap';
const tx=(slide,text,x,y,w,h,opt={})=>slide.addText(clean(text),{x,y,w,h,margin:0,breakLine:false,fontFace:opt.bold?theme.headingFont:theme.bodyFont,fontSize:14,color:C.ink,fit:'shrink',valign:'mid',...opt});
const rect=(pptx,slide,x,y,w,h,fill,line=fill,radius=false)=>slide.addShape(radius?pptx.ShapeType.roundRect:pptx.ShapeType.rect,{x,y,w,h,rectRadius:0.1,line:{color:line,width:0.5},fill:{color:fill},radius:0.1});
function chrome(pptx,slide,model,index,total){
  rect(pptx,slide,0,0,13.333,0.12,C.deep);
  tx(slide,'MIGHTORA  /  ROADMAPS',0.45,0.28,5,0.22,{fontSize:9,bold:true,charSpacing:1.8,color:C.green});
  tx(slide,model.section.toUpperCase(),0.52,0.68,11.8,0.28,{fontSize:10,bold:true,charSpacing:1.3,color:C.green});
  tx(slide,limit(model.title,160),0.52,1.08,12.25,0.57,{fontSize:26,bold:true,color:C.deep});
  if(model.subtitle)tx(slide,limit(model.subtitle,250),0.54,1.69,12.05,0.35,{fontSize:12,color:C.muted});
  if(model.summary)tx(slide,limit(model.summary,480),0.54,2.06,12.15,0.48,{fontSize:11,color:C.muted,valign:'top'});
  rect(pptx,slide,0.5,7.02,12.35,0.015,C.line);
  tx(slide,'MIGHTORA ROADMAPS · EDITABLE PRESENTATION',0.52,7.13,9,0.18,{fontSize:8,color:C.muted});
  tx(slide,index+' / '+total,11.85,7.11,0.95,0.2,{fontSize:8,color:C.muted,align:'right'});
}
function statRow(pptx,slide,stats,y){
  if(!stats.length)return y;
  const n=Math.min(stats.length,4),gap=0.14,w=(12.28-gap*(n-1))/n;
  for(let i=0;i<n;i++){
    const x=0.52+i*(w+gap);
    rect(pptx,slide,x,y,w,0.77,C.soft,C.line,true);
    tx(slide,limit(stats[i].value,30),x+0.15,y+0.08,w-0.3,0.37,{fontSize:23,bold:true,color:C.deep});
    tx(slide,limit(stats[i].label,65),x+0.15,y+0.51,w-0.3,0.16,{fontSize:9,color:C.muted});
  }
  return y+0.96;
}
function cardGrid(pptx,slide,cards,start){
  if(!cards.length){tx(slide,'No activities or dependencies to display in this section.',0.7,start+0.4,11.7,0.7,{fontSize:15,color:C.muted});return;}
  const max=Math.min(cards.length,4),columns=2,rows=Math.ceil(max/columns),gap=0.16;
  const cellW=(12.28-gap)/2,available=Math.max(1.5,6.77-start),cellH=Math.min(1.48,(available-(rows-1)*gap)/rows);
  for(let i=0;i<max;i++){
    const card=cards[i],x=0.52+(i%2)*(cellW+gap),y=start+Math.floor(i/2)*(cellH+gap);
    rect(pptx,slide,x,y,cellW,cellH,C.white,C.line,true);
    rect(pptx,slide,x,y,0.065,cellH,hex(card.color||'#376d62'));
    tx(slide,limit(card.title,230),x+0.19,y+0.13,cellW-0.35,0.31,{fontSize:13,bold:true,color:C.deep,valign:'top'});
    if(card.detail)tx(slide,limit(card.detail,420),x+0.19,y+0.51,cellW-0.36,Math.max(0.22,cellH-0.88),{fontSize:10.5,color:C.ink,valign:'top'});
    if(card.meta)tx(slide,limit(card.meta,230),x+0.19,y+cellH-0.32,cellW-0.37,0.18,{fontSize:8.5,color:C.muted});
  }
}
function timeline(pptx,slide,model){
  const cols=model.periods.length,rows=model.timeline.length;
  if(!cols||!rows){tx(slide,'No workstreams to display.',0.6,3,10,0.4);return;}
  const x0=0.55,y0=2.74,left=2.28,w=(12.25-left)/cols,rowH=Math.min(0.53,3.88/rows);
  rect(pptx,slide,x0,y0,left,0.48,C.deep);
  tx(slide,'WORKSTREAM',x0+0.1,y0+0.12,left-0.2,0.18,{fontSize:9,bold:true,color:C.white});
  for(let j=0;j<cols;j++){
    const x=x0+left+j*w;
    rect(pptx,slide,x,y0,w,0.48,C.green);
    tx(slide,limit(model.periods[j],50),x+0.04,y0+0.09,w-0.08,0.25,{fontSize:10,bold:true,color:C.white,align:'center'});
  }
  for(let i=0;i<rows;i++){
    const row=model.timeline[i],y=y0+0.48+i*rowH;
    rect(pptx,slide,x0,y,left,rowH,i%2?C.paper:C.white,C.line);
    rect(pptx,slide,x0+0.07,y+0.13,0.08,rowH-0.24,hex(row.color));
    tx(slide,limit(row.title,85),x0+0.24,y+0.08,left-0.32,rowH-0.14,{fontSize:10,bold:true});
    for(let j=0;j<cols;j++){
      const cell=row.cells[j]||{count:0,done:0,blocked:0},x=x0+left+j*w;
      rect(pptx,slide,x,y,w,rowH,cell.count?(cell.blocked?'FFF2E3':cell.done===cell.count?C.soft:C.soft):C.white,C.line);
      if(cell.count){
        tx(slide,cell.count+' activit'+(cell.count===1?'y':'ies'),x+0.04,y+0.08,w-0.08,0.2,{fontSize:9.5,bold:true,align:'center',color:C.deep});
        tx(slide,cell.done+' complete',x+0.04,y+0.30,w-0.08,0.14,{fontSize:8,align:'center',color:C.muted});
      }
    }
  }
  tx(slide,'Counts include work spanning each quarter. Amber cells include unfinished prerequisites.',0.55,6.63,12,0.2,{fontSize:9,color:C.muted});
}
function cover(pptx,slide,model,index,total){
  rect(pptx,slide,0,0,13.333,7.5,C.deep);
  rect(pptx,slide,0,0,0.22,7.5,C.mint);
  rect(pptx,slide,8.45,0.95,3.9,4.8,C.green);
  rect(pptx,slide,8.75,1.24,3.3,0.22,C.mint);
  rect(pptx,slide,8.75,1.86,2.4,0.22,C.mint);
  rect(pptx,slide,8.75,2.48,2.92,0.22,C.mint);
  rect(pptx,slide,8.75,3.10,1.94,0.22,C.mint);
  rect(pptx,slide,8.75,3.72,2.75,0.22,C.mint);
  tx(slide,'MIGHTORA / ROADMAPS',0.75,0.75,7,0.34,{fontSize:12,color:C.mint,bold:true,charSpacing:2});
  tx(slide,limit(model.title,180),0.75,2.1,7.2,1.6,{fontSize:36,bold:true,color:C.white,breakLine:false,valign:'mid'});
  tx(slide,limit(model.subtitle,250),0.8,4.0,7.1,0.65,{fontSize:15,color:C.mint,valign:'top'});
  tx(slide,limit(model.summary,260),0.8,5.05,7.1,0.8,{fontSize:13,color:C.white,valign:'top'});
  tx(slide,'PLANNING  ·  DELIVERY  ·  DEPENDENCIES',0.8,6.72,9,0.25,{fontSize:10,color:C.mint,charSpacing:1.4});
  tx(slide,index+' / '+total,11.8,7.08,0.9,0.2,{fontSize:8,color:C.white,align:'right'});
}
return {cover,chrome,timeline,statRow,cardGrid};
}
export function createPowerPoint(deck,PptxConstructor){
  if(typeof PptxConstructor!=='function')throw Error('The PowerPoint generator could not be loaded.');
  const slides=activeSlides(deck);if(!slides.length)throw Error('Include at least one slide before exporting.');
  const theme=normalizeDeckTheme(deck.theme),palette=presentationPalette(theme),render=makeRenderer(theme);
  const pptx=new PptxConstructor();pptx.layout='LAYOUT_WIDE';pptx.author='Mightora Roadmaps';pptx.subject='Editable roadmap presentation';pptx.title=deck.sourceTitle+' · Roadmap presentation';pptx.company='Mightora';pptx.lang='en-GB';
  pptx.theme={headFontFace:theme.headingFont,bodyFontFace:theme.bodyFont,lang:'en-GB'};
  slides.forEach((model,i)=>{
    const slide=pptx.addSlide();slide.background={color:palette.paper};
    if(model.kind==='cover')render.cover(pptx,slide,model,i+1,slides.length);
    else{
      render.chrome(pptx,slide,model,i+1,slides.length);
      if(model.kind==='timeline')render.timeline(pptx,slide,model);
      else{const y=render.statRow(pptx,slide,model.stats,2.72);render.cardGrid(pptx,slide,model.cards,y);}
    }
    const speakerNotes=[model.notes,model.summary,...model.cards.map(c=>[c.title,c.detail,c.meta].filter(Boolean).join(' — '))].filter(Boolean).join('\n\n');
    if(speakerNotes&&typeof slide.addNotes==='function')slide.addNotes(speakerNotes);
  });
  return pptx;
}
let loader;
export function loadPowerPointLibrary(){
  if(typeof window==='undefined')return Promise.reject(Error('PowerPoint download requires a browser.'));
  if(typeof window.pptxgen==='function'||typeof window.PptxGenJS==='function')return Promise.resolve(window.pptxgen||window.PptxGenJS);
  if(loader)return loader;
  loader=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';script.async=true;script.crossOrigin='anonymous';
    script.onload=()=>{const Constructor=window.pptxgen||window.PptxGenJS;if(typeof Constructor==='function')resolve(Constructor);else reject(Error('PowerPoint library loaded but was not available.'));};
    script.onerror=()=>reject(Error('Unable to load the PowerPoint library. Check your connection and try again.'));
    document.head.appendChild(script);
  }).catch(e=>{loader=null;throw e;});
  return loader;
}
export async function downloadPowerPoint(deck){
  const Constructor=await loadPowerPointLibrary(),pptx=createPowerPoint(deck,Constructor);
  await pptx.writeFile({fileName:fileName(deck.sourceTitle)+'-roadmap.pptx'});
}
