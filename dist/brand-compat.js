// Compatibility repair required by Mightora's design-system instructions.
// Only repair the known two-space over-indent in the shared footer YAML.
(() => {
  const original=window.fetch.bind(window);
  window.fetch=async function(input,options){
    const response=await original(input,options);
    const url=typeof input==='string'?input:input?.url||'';
    if(url==='https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/footer.yaml'&&response.ok){
      const source=await response.text();const lines=source.split('\n');let repair=false;
      const fixed=lines.map(line=>{if(/^    - title:/.test(line))repair=true;else if(/^  - title:/.test(line)||/^  #.*Column/.test(line))repair=false;return repair&&line.startsWith('  ')?line.slice(2):line;}).join('\n');
      return new Response(fixed,{status:response.status,statusText:response.statusText,headers:response.headers});
    }
    return response;
  };
})();
