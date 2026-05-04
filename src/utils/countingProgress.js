const COUNTING_LEVEL_SIZE = 5;

function toNonNegativeInteger(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.floor(number));
}

export function getCountingLevelForScore(score) {
  return Math.floor(toNonNegativeInteger(score) / COUNTING_LEVEL_SIZE) + 1;
}

export function normalizeCountingProgress(progress = {}) {
  const maxScore = toNonNegativeInteger(progress?.max_score ?? progress?.score);

  return {
    ...progress,
    game_mode: 'counting',
    max_score: maxScore,
    max_level: getCountingLevelForScore(maxScore),
  };
}

export function toCountingLevelInfo(progress = {}) {
  const normalized = normalizeCountingProgress(progress);

  return {
    level: normalized.max_level,
    score: normalized.max_score,
  };
}

export function normalizeScoreRecord(record) {
  if (!record || record.game_mode !== 'counting') return record;
  return normalizeCountingProgress(record);
}
