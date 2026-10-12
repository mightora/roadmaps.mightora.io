import { validateRoadmap,validateReadiness } from './model.mjs';
export const MAX_SHARE_CHARS=16000,MAX_SHARE_BYTES=2_000_000;
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
function pick(o,keys){return Object.fromEntries(keys.map(k=>[k,structuredClone(o[k])]));}
export function sharedRoadmap(source,{includeOwners=false,includeDescriptions=true}={}){
  validateReadiness(validateRoadmap(source));const r=pick(source,['schemaVersion','title','client','startDate','periodCount']);if(source.quarterLabels)r.quarterLabels=[...source.quarterLabels];r.tracks=source.tracks.map(t=>pick(t,['id','name','color']));r.activities=source.activities.map(a=>({...pick(a,['id','title','trackId','start','end','status','dependencies']),owner:includeOwners?a.owner:'',description:includeDescriptions?a.description:''}));return validateRoadmap(r);
}
function base64(bytes){let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function unbase64(value){if(!/^[A-Za-z0-9_-]+$/.test(value))throw new Error('Invalid share-link encoding.');const raw=atob(value.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
async function limitedBytes(stream,max){const reader=stream.getReader(),chunks=[];let size=0;try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('Shared roadmap exceeds the supported size.');}chunks.push(value);}}finally{reader.releaseLock();}const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;}
export async function makeShareUrl(source,baseUrl,options={}){
  const roadmap=sharedRoadmap(source,options),raw=encoder.encode(JSON.stringify({format:'mightora-roadmap-share',schemaVersion:1,roadmap}));if(raw.length>MAX_SHARE_BYTES)throw new Error('This roadmap is too large for a share link. Export Markdown instead.');
  let bytes=raw,kind='base64';if(typeof CompressionStream!=='undefined'){bytes=await limitedBytes(new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip')),MAX_SHARE_BYTES);kind='gzip';}
  const encoded=kind+'.'+base64(bytes);const url=new URL(baseUrl);if(!['https:','http:'].includes(url.protocol))throw new Error('Share links require an HTTP or HTTPS app URL.');url.search='';url.hash='share='+encoded;
  if(url.href.length>MAX_SHARE_CHARS)throw new Error('This share link would be too long. Export Markdown or omit descriptions.');return url.href;
}
export async function readShareHash(hash){
  const value=new URLSearchParams(hash.replace(/^#/,'')).get('share');if(!value)return null;if(value.length>MAX_SHARE_CHARS)throw new Error('Share link is too long.');const separator=value.indexOf('.'),kind=value.slice(0,separator),encoded=value.slice(separator+1);if(!['gzip','base64'].includes(kind))throw new Error('Unsupported share-link version.');
  let bytes=unbase64(encoded);if(kind==='gzip'){if(typeof DecompressionStream==='undefined')throw new Error('This browser cannot open compressed links. Import a Markdown file instead.');bytes=await limitedBytes(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')),MAX_SHARE_BYTES);}if(bytes.length>MAX_SHARE_BYTES)throw new Error('Shared roadmap exceeds the supported size.');
  const data=JSON.parse(decoder.decode(bytes));if(data.format!=='mightora-roadmap-share'||data.schemaVersion!==1)throw new Error('Unsupported shared roadmap.');return sharedRoadmap(data.roadmap,{includeOwners:true,includeDescriptions:true});
}
