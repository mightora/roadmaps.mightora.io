import test from 'node:test';
import assert from 'node:assert/strict';
import { newId } from '../dist/ids.mjs';

test('prefers native randomUUID in a secure context', () => {
  const expected = '00000000-0000-4000-8000-000000000001';
  assert.equal(newId({ randomUUID: () => expected }), expected);
});

test('generates a valid UUID v4 without randomUUID (HTTP context)', () => {
  let calls = 0;
  const provider = { getRandomValues(bytes) {
    for (let i = 0; i < bytes.length; i++) bytes[i] = (i + calls) & 0xff;
    calls++;
    return bytes;
  }};
  const first = newId(provider), second = newId(provider);
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.notEqual(first, second);
  assert.equal(calls, 2);
});

test('fails safely if secure randomness is unavailable', () => {
  assert.throws(() => newId({}), /cannot generate secure random identifiers/);
});
