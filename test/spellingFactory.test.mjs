import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  SPELLING_LEVELS,
  SPELLING_STATIONS,
  getInitialSpellingLevel,
  getSpellingLevel,
  getSpellingLevelChoices,
  getSpellingStars,
} from '../src/data/spellingFactory.js';
import { SPELLING_FACTORY_GALLERY_ITEMS } from '../src/data/spellingGallery.js';

test('spelling curriculum has 60 playable levels with rotating factory stations', () => {
  assert.equal(SPELLING_LEVELS.length, 60);
  assert.deepEqual(SPELLING_STATIONS, ['build', 'sort', 'find']);

  const stationCounts = SPELLING_LEVELS.reduce((counts, level) => {
    counts[level.station] = (counts[level.station] || 0) + 1;
    return counts;
  }, {});

  assert.equal(stationCounts.build, 20);
  assert.equal(stationCounts.sort, 20);
  assert.equal(stationCounts.find, 20);
});

test('every fifth spelling level is an inline pop celebration milestone', () => {
  const milestoneLevels = SPELLING_LEVELS.filter((level) => level.isMilestone).map((level) => level.level);

  assert.deepEqual(milestoneLevels, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
});

test('each spelling level exposes generated audio keys and avoids native speech fallback data', () => {
  for (const level of SPELLING_LEVELS) {
    assert.match(level.wordAudio, /^word_[a-z]+$/);
    assert.match(level.hintAudio, /^hint_\d+$/);
    assert.equal(level.nativeTtsFallback, undefined);
  }
});

test('spelling helpers clamp level lookup and calculate star ratings', () => {
  assert.equal(getSpellingLevel(0).level, 1);
  assert.equal(getSpellingLevel(999).level, 60);
  assert.equal(getSpellingStars({ mistakes: 0, hintsUsed: 0 }), 3);
  assert.equal(getSpellingStars({ mistakes: 1, hintsUsed: 0 }), 2);
  assert.equal(getSpellingStars({ mistakes: 3, hintsUsed: 2 }), 1);
});

test('spelling level picker exposes milestones and clamps resume progress', () => {
  const choices = getSpellingLevelChoices();

  assert.equal(choices.length, 13);
  assert.deepEqual(choices.map((choice) => choice.level), [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
  assert.equal(getInitialSpellingLevel({ savedLevel: 0 }), 1);
  assert.equal(getInitialSpellingLevel({ savedLevel: 37 }), 37);
  assert.equal(getInitialSpellingLevel({ savedLevel: 999 }), 60);
});

test('magic studio includes the four spelling factory music videos', () => {
  assert.deepEqual(
    SPELLING_FACTORY_GALLERY_ITEMS.map((item) => item.src),
    [
      '/assets/videos/spelling_factory_main.mp4',
      '/assets/videos/spelling_factory_focus.mp4',
      '/assets/videos/spelling_factory_celebration.mp4',
      '/assets/videos/spelling_factory_pop.mp4',
    ]
  );
});
