import {readShareHash} from './share.mjs';
import {renderPublishedRoadmap} from './published-view.mjs';
const $=s=>document.querySelector(s);
const setStatus=(message)=>{$('#published-copy-status').textContent=message;};
async function init(){
  try{
    const roadmap=await readShareHash(location.hash);
    if(!roadmap)throw new Error('No published roadmap was included in this link.');
    document.title=roadmap.title+' · Published roadmap | Mightora';
    $('#published-content').innerHTML=renderPublishedRoadmap(roadmap);
    $('#published-actions').hidden=false;
    const editor=new URL('./',location.href);
    editor.hash=location.hash;
    editor.search='';
    $('#edit-copy').href=editor.href;
    $('#copy-published-link').onclick=async()=>{
      try{await navigator.clipboard.writeText(location.href);setStatus('Published link copied.');}
      catch{const input=$('#published-link-field');input.hidden=false;input.value=location.href;input.focus();input.select();setStatus('Select and copy the link above.');}
    };
    $('#print-published').onclick=()=>window.print();
  }catch(error){
    $('#published-content').innerHTML='<section class="published-error"><h1>We couldn’t open this roadmap</h1><p id="published-error-message"></p><a class="published-button" href="./">Open the roadmap editor</a></section>';
    $('#published-error-message').textContent=error.message;
  }
}
init();
