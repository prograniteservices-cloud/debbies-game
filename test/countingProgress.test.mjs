import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getCountingLevelForScore,
  normalizeCountingProgress,
  normalizeScoreRecord,
  toCountingLevelInfo,
} from '../src/utils/countingProgress.js';

test('counting level is derived from score every five completions', () => {
  assert.equal(getCountingLevelForScore(0), 1);
  assert.equal(getCountingLevelForScore(4), 1);
  assert.equal(getCountingLevelForScore(5), 2);
  assert.equal(getCountingLevelForScore(9), 2);
  assert.equal(getCountingLevelForScore(10), 3);
});

test('counting progress ignores corrupted max_level and trusts score', () => {
  assert.deepEqual(
    normalizeCountingProgress({
      profile_id: 'unicorn',
      game_mode: 'counting',
      max_level: 131,
      max_score: 0,
    }),
    {
      profile_id: 'unicorn',
      game_mode: 'counting',
      max_level: 1,
      max_score: 0,
    }
  );
});

test('counting progress coerces unsafe score values to safe level info', () => {
  assert.deepEqual(toCountingLevelInfo({ max_score: '12' }), { level: 3, score: 12 });
  assert.deepEqual(toCountingLevelInfo({ max_score: -8 }), { level: 1, score: 0 });
  assert.deepEqual(toCountingLevelInfo({ max_score: 'nope', max_level: 131 }), { level: 1, score: 0 });
});

test('normalizing score records leaves non-counting modes unchanged', () => {
  const spelling = {
    game_mode: 'spelling',
    max_level: 37,
    max_score: 3725,
  };

  assert.equal(normalizeScoreRecord(spelling), spelling);
  assert.equal(normalizeScoreRecord(null), null);
});
