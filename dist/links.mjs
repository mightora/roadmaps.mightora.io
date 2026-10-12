// Plan links identify browser-local records. They are bookmarks, not cloud URLs.
const ID=/^[a-zA-Z0-9_-]{6,120}$/;
export function requestedPlanId(search){
  const id=new URLSearchParams(search).get('plan');
  return id&&ID.test(id)?id:null;
}
export function makePlanUrl(baseUrl,id){
  if(typeof id!=='string'||!ID.test(id))throw new Error('Invalid plan identifier.');
  const url=new URL(baseUrl);
  if(!['https:','http:'].includes(url.protocol))throw new Error('A plan link requires an HTTP or HTTPS URL.');
  url.searchParams.delete('example');
  url.searchParams.set('plan',id);
  url.hash='';
  return url.href;
}
