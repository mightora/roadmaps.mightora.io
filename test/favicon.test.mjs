import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const pages=['index.html','deck.html','published.html','guide.html',
  ...['index','editing','saving','publishing','data','presentations'].map(n=>'docs/'+n+'.html'),
  ...['chemistry','energy','manufacturing','power-platform'].map(n=>'examples/'+n+'.html')];
test('public pages use official Mightora favicon and touch icon',()=>{
  for(const page of pages){
    const html=read('dist/'+page);
    assert.ok(html.includes('raw.githubusercontent.com/mightora/mightora.io/main/static/favicon-32x32.png'),page);
    assert.ok(html.includes('raw.githubusercontent.com/mightora/mightora.io/main/static/apple-touch-icon.png'),page);
    assert.doesNotMatch(html,/rel="icon" href="data:image\/svg\+xml/,page);
  }
  assert.match(read('scripts/build-discovery.mjs'),/favicon-32x32\.png/);
});
