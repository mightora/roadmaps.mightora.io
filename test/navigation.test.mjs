import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('dist/index.html'),portal=read('dist/portal.mjs'),css=read('dist/workspace-nav.css');
test('permanent workspace sidebar is replaced by a compact accessible top Manage menu',()=>{
  assert.doesNotMatch(html,/<aside class="sidebar"/);
  assert.doesNotMatch(html,/>YOUR WORKSPACE</);
  assert.match(html,/<details class="workspace-menu-wrap">/);
  assert.match(html,/<summary id="workspace-menu-toggle" aria-label="Manage roadmap workspace">/);
  assert.match(html,/<nav id="workspace-menu" aria-label="Workspace tools">/);
  assert.match(html,/<button id="workspace-return"[^>]+data-view="roadmap"/);
  assert.match(html,/href="\.\/workspace-nav\.css"/);
});
test('core editor views remain accessible without duplicate sidebar tabs',()=>{
  for(const view of ['roadmap','dependencies','activities'])assert.match(html,new RegExp('<button data-view="'+view+'"'));
  for(const page of ['library','workstreams','portfolio','data'])assert.match(html,new RegExp('class="workspace-menu-item" data-page="'+page+'"'));
  assert.match(html,/class="workspace-menu-item" id="settings"/);
  assert.doesNotMatch(html,/data-page="reports"/);
});
test('workspace navigation routes to the same existing pages and returns to roadmap',()=>{
  assert.match(portal,/querySelectorAll\('#workspace-menu \[data-view\],#workspace-menu \[data-page\]'\)/);
  assert.match(portal,/function showPage\(page\)/);
  assert.match(portal,/function showRoadmap\(selectedView\)/);
  assert.match(portal,/\$\('#workspace-return'\)\.hidden=false/);
  assert.match(portal,/\$\('#workspace-return'\)\.hidden=true/);
  assert.match(portal,/if\(page==='workstreams'\)workstreamsPage\(\)/);
  assert.match(portal,/else if\(page==='data'\)dataPage\(\)/);
  assert.match(portal,/else if\(page==='library'\)libraryPage\(\)/);
  assert.match(portal,/page==='portfolio'\|\|page==='reports'/);
});
test('mobile and desktop workspaces are full-width, menu supports keyboard escape',()=>{
  assert.match(css,/#application-shell > main#workspace\{margin:0;width:100%/);
  assert.match(css,/#brand-bottom\{margin-left:0\}/);
  assert.match(css,/@media\(max-width:600px\)/);
  assert.match(portal,/e\.key==='Escape'/);
  assert.match(portal,/!menu\.contains\(e\.target\)/);
});
test('documentation refers to the new menu rather than the removed sidebar',()=>{
  for(const path of ['dist/docs/editing.html','dist/docs/saving.html','dist/docs/data.html']){
    const page=read(path);
    assert.doesNotMatch(page,/in the sidebar/);
    assert.match(page,/Manage →/);
  }
});
