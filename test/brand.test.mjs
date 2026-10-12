import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('Mightora footer loads its validated local configuration without a global fetch shim',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const config=JSON.parse(await readFile(new URL('../dist/footer.json',import.meta.url),'utf8'));
  assert.match(html,/shared-ui@main\/components\.js/);
  assert.match(html,/<mightora-footer yaml-url="\.\/footer\.json">/);
  assert.doesNotMatch(html,/brand-compat\.js/);
  assert.ok(config.sections.some(section=>section.title==='Roadmaps'));
  assert.ok(config.sections.some(section=>section.title==='Contribute'));
  assert.ok(config.sections.some(section=>section.title==='Mightora'));
});
