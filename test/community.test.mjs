import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('public site links to source, contribution, issue and security routes', () => {
  const html = read('dist/index.html');
  for (const text of ['id="open-source"', 'issues/new?template=bug_report.yml', 'issues/new?template=feature_request.yml', '/blob/main/CONTRIBUTING.md', '/blob/main/SECURITY.md', '/blob/main/PRIVACY.md']) {
    assert.ok(html.includes(text), 'Missing site community link: ' + text);
  }
});

test('trust documentation and GitHub community templates exist', () => {
  for (const file of ['LICENSE','SECURITY.md','PRIVACY.md','CODE_OF_CONDUCT.md','GOVERNANCE.md','SUPPORT.md','ACCESSIBILITY.md','CONTRIBUTING.md','.github/ISSUE_TEMPLATE/bug_report.yml','.github/ISSUE_TEMPLATE/feature_request.yml','.github/ISSUE_TEMPLATE/industry_example.yml','.github/dependabot.yml']) {
    assert.ok(read(file).length > 50, 'Missing or empty: ' + file);
  }
});

test('CodeQL and CI workflows are linked by real workflow status badges', () => {
  const readme = read('README.md');
  const codeql = read('.github/workflows/codeql.yml');
  for (const name of ['pages.yml','codeql.yml']) assert.ok(readme.includes('/actions/workflows/' + name + '/badge.svg?branch=main'));
  assert.match(codeql, /github\/codeql-action\/init@v4/);
  assert.match(codeql, /github\/codeql-action\/analyze@v4/);
  assert.match(codeql, /security-events: write/);
  assert.match(codeql, /javascript-typescript, actions/);
});
