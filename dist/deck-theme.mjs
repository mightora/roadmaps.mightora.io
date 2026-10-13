// Presentation styling shared by the browser preview, deck drafts and native PowerPoint export.
export const DEFAULT_DECK_THEME=Object.freeze({
  headingFont:'Aptos Display',bodyFont:'Aptos',
  primary:'#173D33',accent:'#285C49',highlight:'#D7E6B5',
  background:'#F7FAF6',text:'#173D33',muted:'#60776C'
});
export const DECK_THEME_PRESETS=Object.freeze({
  mightora:{label:'Mightora',colors:{primary:'#173D33',accent:'#285C49',highlight:'#D7E6B5',background:'#F7FAF6',text:'#173D33',muted:'#60776C'}},
  ocean:{label:'Ocean',colors:{primary:'#143D59',accent:'#246E8F',highlight:'#ADE7EB',background:'#F5FAFC',text:'#153B51',muted:'#527486'}},
  graphite:{label:'Graphite',colors:{primary:'#263342',accent:'#546478',highlight:'#D6E0EB',background:'#F5F7FA',text:'#263342',muted:'#647386'}},
  plum:{label:'Plum',colors:{primary:'#492C4F',accent:'#805B88',highlight:'#F3DDED',background:'#FBF8FC',text:'#452C4D',muted:'#7A687F'}}
});
export const DECK_FONT_SUGGESTIONS=Object.freeze([
  'Aptos Display','Aptos','Arial','Calibri','Segoe UI','Georgia','Verdana',
  'Trebuchet MS','Tahoma','Times New Roman','Inter','Century Gothic'
]);
export const DECK_THEME_COLORS=Object.freeze([
  ['primary','Primary / cover'],['accent','Accent'],['highlight','Highlight'],
  ['background','Slide background'],['text','Body text'],['muted','Secondary text']
]);
const HEX=/^#[0-9a-f]{6}$/i;
// A font family is stored as a plain name, not arbitrary CSS. It must be installed
// wherever the presentation is viewed to render with precisely that typeface.
const FONT=/^[\p{L}\p{N}][\p{L}\p{N} .,'()_+-]{0,79}$/u;
export function normalizeDeckTheme(input){
  if(input===undefined||input===null)return {...DEFAULT_DECK_THEME};
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid presentation theme.');
  const theme={...DEFAULT_DECK_THEME,...input};
  if(Object.keys(input).some(key=>!(key in DEFAULT_DECK_THEME)))throw Error('Unknown presentation theme setting.');
  for(const key of ['headingFont','bodyFont']){
    if(typeof theme[key]!=='string'||!FONT.test(theme[key])||theme[key]!==theme[key].trim())throw Error('Invalid presentation font: '+key);
  }
  for(const [key] of DECK_THEME_COLORS){
    if(typeof theme[key]!=='string'||!HEX.test(theme[key]))throw Error('Invalid presentation colour: '+key);
    theme[key]=theme[key].toUpperCase();
  }
  return theme;
}
export function blendColor(first,second,amount){
  const a=normalizeHex(first),b=normalizeHex(second),factor=Math.max(0,Math.min(1,amount));
  const channel=i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-factor)+parseInt(b.slice(i,i+2),16)*factor).toString(16).padStart(2,'0');
  return (channel(0)+channel(2)+channel(4)).toUpperCase();
}
function normalizeHex(v){if(typeof v!=='string'||!HEX.test(v))throw Error('Invalid hex colour');return v.slice(1).toUpperCase();}
export function presentationPalette(input){
  const t=normalizeDeckTheme(input);
  return {deep:t.primary.slice(1),green:t.accent.slice(1),mint:t.highlight.slice(1),
    paper:t.background.slice(1),ink:t.text.slice(1),muted:t.muted.slice(1),
    white:'FFFFFF',soft:blendColor(t.background,t.accent,0.09),
    line:blendColor(t.background,t.primary,0.17),
    amber:'B27B3D'};
}
