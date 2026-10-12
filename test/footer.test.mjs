import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = file => readFileSync(new URL('../'+file,import.meta.url),'utf8');
const footer = JSON.parse(read('dist/footer.json'));

test('site-specific footer config has valid sections, URLs and three distinct columns',()=>{
  assert.equal(footer.sections.length,3);
  assert.deepEqual(footer.sections.map(s=>s.column),[1,2,3]);
  for(const section of footer.sections){
    assert.ok(section.title);
    assert.ok(section.links.length>=3);
    for(const link of section.links){
      assert.ok(link.name);
      const u=new URL(link.url,'https://roadmaps.mightora.io/');
      assert.ok(['https:','http:'].includes(u.protocol));
      assert.ok(!/^\/(about|contact|privacy-policy|cookie-policy|terms)\//.test(link.url),'no links to absent pages');
    }
  }
});
test('footer is local and does not globally intercept fetch',()=>{
  const html=read('dist/index.html');
  assert.match(html,/<mightora-footer yaml-url="\.\/footer\.json">/);
  assert.doesNotMatch(html,/brand-compat\.js/);
  assert.match(html,/footer-bottom-links/);
  assert.match(read('dist/platform.css'),/#brand-bottom \.footer-main/);
});
