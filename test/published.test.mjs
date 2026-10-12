import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {seedRoadmap} from '../dist/model.mjs';
import {renderPublishedRoadmap} from '../dist/published-view.mjs';
import {makePlanUrl,requestedPlanId} from '../dist/links.mjs';
import {makeShareUrl,readShareHash} from '../dist/share.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('plan links are browser-local bookmarks with a stable identifier',()=>{
  const id='roadmap_abc-123';
  const url=makePlanUrl('https://example.org/app/?example=chemistry#share=old',id);
  assert.equal(url,'https://example.org/app/?plan=roadmap_abc-123');
  assert.equal(requestedPlanId(new URL(url).search),id);
  assert.equal(requestedPlanId('?plan=../invalid'),null);
  assert.throws(()=>makePlanUrl('https://example.org/', '../bad'));
});
test('published HTML escapes untrusted roadmap content',()=>{
  const r=seedRoadmap();r.title='<img src=x onerror=alert(1)>';r.client='Project "test"';
  r.activities[0].title='<script>alert(1)</script>';
  const html=renderPublishedRoadmap(r);
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('&lt;script'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('published-board'));
  assert.ok(html.includes('Overall completion'));
});
test('published URLs use the self-contained validated snapshot format',async()=>{
  const r=seedRoadmap();
  const url=await makeShareUrl(r,'https://example.org/app/published.html',{includeOwners:false});
  assert.ok(url.startsWith('https://example.org/app/published.html#share='));
  const decoded=await readShareHash(new URL(url).hash);
  assert.equal(decoded.title,r.title);
  assert.equal(decoded.activities.length,r.activities.length);
  assert.ok(decoded.activities.every(a=>a.owner===''));
});
test('published page, documentation and SVG graphics are present',()=>{
  const html=read('dist/published.html');
  assert.match(html,/id="published-content"/);
  assert.match(html,/noindex,nofollow/);
  assert.ok(html.includes('published.mjs'));
  assert.match(read('dist/index.html'),/id="publish-roadmap"/);
  assert.match(read('dist/index.html'),/id="save-plan-link"/);
  assert.match(read('dist/docs/index.html'),/Documentation/);
  assert.match(read('dist/sitemap.xml'),/docs\\/publishing\\.html/);
  for(const name of ['roadmap-journey','publish-preview','save-plan','dependencies']){
    const svg=read('dist/assets/'+name+'.svg');
    assert.ok(svg.includes('<svg') && svg.includes('viewBox='));
    assert.ok(svg.includes('</svg>'));
    assert.doesNotMatch(svg,/<script|onload=|<foreignObject/i);
  }
});
