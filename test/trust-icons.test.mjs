import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {icon,ICON_NAMES} from '../dist/icons.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('homepage shows genuine linked project badges, not invented certification marks',()=>{
  const html=read('dist/index.html');
  assert.match(html,/id="trust-and-transparency"/);
  assert.match(html,/class="trust-badge-list"/);
  for(const name of ['pages.yml','codeql.yml']){
    const url='https://github.com/mightora/roadmaps.mightora.io/actions/workflows/'+name;
    assert.ok(html.includes(url+'/badge.svg?branch=main'),'Missing live status badge for '+name);
    assert.ok(html.includes('href="'+url+'"'),'Badge does not link to its evidence');
  }
  assert.ok(html.includes('https://img.shields.io/badge/License-MIT-blue.svg'));
  assert.ok(html.includes('href="https://github.com/mightora/roadmaps.mightora.io/blob/main/LICENSE"'));
  assert.ok(html.includes('alt="Build and tests: live GitHub Actions status"'));
  assert.ok(html.includes('alt="CodeQL analysis: live GitHub Actions status"'));
  assert.ok(html.includes('not an independent audit or security certification'));
  assert.match(read('PRIVACY.md'),/The homepage displays live GitHub Actions workflow status badges/);
});

test('compact Manage navigation uses unified SVG icons and readable names',()=>{
  const html=read('dist/index.html');
  const nav=html.match(/<nav id="workspace-menu" aria-label="Workspace tools">([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,'Missing workspace tools navigation');
  for(const label of ['Roadmap editor','My roadmaps','Workstreams','Portfolio &amp; reports','Data backup','Roadmap settings']){
    assert.ok(nav.includes(label),'Missing navigation item '+label);
  }
  assert.equal((nav.match(/class="mi-icon"/g)||[]).length,6);
  assert.doesNotMatch(nav,/<span>[▦◇☷▤≡◫▥⇄?]<\/span>/);
  assert.match(html,/<button[^>]*id="settings"[^>]*><svg class="mi-icon"/);
  assert.match(html,/class="quick-jump-nav"/);
  assert.match(read('dist/workspace-nav.css'),/\.workspace-menu-item\.active/);
  assert.doesNotMatch(html,/<aside class="sidebar"/);
});

test('icons have consistent rounded strokes, accessible decorative treatment and a strict whitelist',()=>{
  for(const name of ['roadmap','dependencies','activities','library','workstreams','portfolio','reports','backup','documentation','settings','share','publish','download','bookmark','search','check']){
    assert.ok(ICON_NAMES.includes(name));
    const svg=icon(name);
    assert.match(svg,/^<svg class="mi-icon"/);
    assert.match(svg,/viewBox="0 0 24 24"/);
    assert.match(svg,/stroke="currentColor"/);
    assert.match(svg,/stroke-width="1.8"/);
    assert.match(svg,/aria-hidden="true"/);
    assert.ok(svg.endsWith('</svg>'));
    assert.doesNotMatch(svg,/<script|onload=|<foreignObject/i);
  }
  assert.throws(()=>icon('nonexistent-icon'));
  assert.throws(()=>icon('<script>'));
});

test('editor and portfolio components reuse the branded icons',()=>{
  const app=read('dist/app.mjs'),portal=read('dist/portal.mjs'),html=read('dist/index.html');
  assert.match(app,/import \{ icon \} from '\.\/icons\.mjs'/);
  assert.match(portal,/import \{ icon \} from '\.\/icons\.mjs'/);
  assert.match(app,/icon\(symbol\)/);
  assert.match(app,/icon\('dependencies'\)/);
  assert.match(portal,/markSidebar\('page',page\)/);
  assert.ok(html.includes('id="publish-roadmap"'));
  assert.ok(html.includes('id="share-roadmap"'));
});
