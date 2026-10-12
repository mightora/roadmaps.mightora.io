import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
test('Footer compatibility repair is limited to the Mightora YAML resource',async()=>{
  const script=await readFile(new URL('../dist/brand-compat.js',import.meta.url),'utf8');const malformed='sections:\n  - title: Site\n    links: []\n    - title: Mightora\n      column: 1\n      links: []\n  # Column 2\n  - title: Tools\n    links: []';
  const context={window:{fetch:async()=>new Response(malformed)},Response};vm.runInNewContext(script,context);
  const repaired=await(await context.window.fetch('https://cdn.jsdelivr.net/gh/mightora/shared-ui@main/footer.yaml')).text();assert.match(repaired,/\n  - title: Mightora\n    column: 1/);assert.match(repaired,/\n  - title: Tools\n    links: \[\]/);
  assert.equal(await(await context.window.fetch('/api/me')).text(),malformed);
});
