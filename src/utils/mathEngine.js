const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Mode cycles every 5 levels: multichoice → magnet → blast → builder → repeat
export function getMathMode(level) {
  const modeIndex = Math.floor((level - 1) / 5) % 4;
  return ['multichoice', 'magnet', 'blast', 'builder'][modeIndex];
}

function getZone(level) {
  if (level <= 10) return 'counting';
  if (level <= 20) return 'add_simple';
  if (level <= 30) return 'sub_simple';
  if (level <= 40) return 'mixed_20';
  if (level <= 50) return 'mul_early';
  if (level <= 60) return 'mul_5';
  if (level <= 70) return 'mul_10';
  if (level <= 80) return 'div_5';
  if (level <= 90) return 'div_10';
  return 'multi_step';
}

export function getZoneLabel(level) {
  const labels = {
    counting: 'Counting', add_simple: 'Addition', sub_simple: 'Subtraction',
    mixed_20: 'Mixed (+/−)', mul_early: 'Multiplication', mul_5: 'Multiplication',
    mul_10: 'Multiplication', div_5: 'Division', div_10: 'Division', multi_step: 'Multi-Step',
  };
  return labels[getZone(level)] || 'Math';
}

// --- Problem Generators ---

function genCounting(level) {
  const max = Math.min(20, level * 2);
  const answer = randInt(1, max);
  return { type: 'counting', question: 'How many?', answer, a: answer, b: null, op: null };
}

function genAddSimple(level) {
  const scale = Math.min(1, (level - 10) / 10);
  const max = Math.max(4, Math.round(10 * (0.4 + scale * 0.6)));
  const a = randInt(1, max - 1);
  const b = randInt(1, max - a);
  return { type: 'addition', question: `${a} + ${b}`, answer: a + b, a, b, op: '+' };
}

function genSubSimple(level) {
  const scale = Math.min(1, (level - 20) / 10);
  const max = Math.max(4, Math.round(10 * (0.4 + scale * 0.6)));
  const a = randInt(2, max);
  const b = randInt(1, a - 1);
  return { type: 'subtraction', question: `${a} \u2212 ${b}`, answer: a - b, a, b, op: '\u2212' };
}

function genMixed20(level) {
  const scale = Math.min(1, (level - 30) / 10);
  const max = Math.max(8, Math.round(20 * (0.4 + scale * 0.6)));
  if (Math.random() > 0.5) {
    const a = randInt(1, max - 1);
    const b = randInt(1, max - a);
    return { type: 'addition', question: `${a} + ${b}`, answer: a + b, a, b, op: '+' };
  } else {
    const a = randInt(2, max);
    const b = randInt(1, a - 1);
    return { type: 'subtraction', question: `${a} \u2212 ${b}`, answer: a - b, a, b, op: '\u2212' };
  }
}

function genMulEarly() {
  const tables = [2, 3, 4, 5];
  const a = tables[randInt(0, tables.length - 1)];
  const b = randInt(1, 10);
  return { type: 'multiplication', question: `${a} \u00d7 ${b}`, answer: a * b, a, b, op: '\u00d7' };
}

function genMul(maxFactor, maxTable) {
  const a = randInt(2, maxFactor);
  const b = randInt(2, maxTable);
  return { type: 'multiplication', question: `${a} \u00d7 ${b}`, answer: a * b, a, b, op: '\u00d7' };
}

function genDiv(maxDivisor) {
  const b = randInt(2, maxDivisor);
  const q = randInt(2, 12);
  return { type: 'division', question: `${b * q} \u00f7 ${b}`, answer: q, a: b * q, b, op: '\u00f7' };
}

function genMultiStep() {
  const a = randInt(1, 8);
  const b = randInt(1, 8);
  const c = randInt(2, 5);
  return { type: 'multistep', question: `(${a} + ${b}) \u00d7 ${c}`, answer: (a + b) * c, a, b, op: 'multistep', c };
}

export function generateProblem(level) {
  const zone = getZone(level);
  switch (zone) {
    case 'counting':   return genCounting(level);
    case 'add_simple': return genAddSimple(level);
    case 'sub_simple': return genSubSimple(level);
    case 'mixed_20':   return genMixed20(level);
    case 'mul_early':  return genMulEarly();
    case 'mul_5':      return genMul(5, 12);
    case 'mul_10':     return genMul(10, 12);
    case 'div_5':      return genDiv(5);
    case 'div_10':     return genDiv(10);
    case 'multi_step': return genMultiStep();
    default:           return genAddSimple(level);
  }
}

// For NumberMagnet: one operand is blank, player finds missing value
export function generateMissingProblem(level) {
  let prob = generateProblem(level);
  // Counting doesn't work for missing-number format, bump to addition
  if (prob.type === 'counting') {
    const a = randInt(1, 8);
    const b = randInt(1, 8);
    prob = { type: 'addition', question: `${a} + ${b}`, answer: a + b, a, b, op: '+' };
  }

  const { a, b, op, answer } = prob;

  // For division/multistep, always blank the answer side (simpler)
  if (op === '\u00f7' || op === 'multistep') {
    return { type: prob.type, fullEquation: `${prob.question} = ___`, missingValue: answer, op };
  }

  // For add/sub/mul, randomly blank left or right operand
  const blankLeft = Math.random() > 0.5;
  const missingValue = blankLeft ? a : b;
  const fullEquation = blankLeft
    ? `___ ${op} ${b} = ${answer}`
    : `${a} ${op} ___ = ${answer}`;

  return { type: prob.type, fullEquation, missingValue, op };
}

// For EquationBuilder: player fills both blanks. Multiple valid pairs allowed.
export function generateBuilderProblem(level) {
  const zone = getZone(level);
  let target, op, validPairs;

  if (['counting', 'add_simple', 'mixed_20'].includes(zone) || zone === 'sub_simple') {
    target = randInt(4, 14);
    op = '+';
    validPairs = [];
    for (let i = 1; i < target; i++) validPairs.push([i, target - i]);
  } else if (['mul_early', 'mul_5', 'mul_10'].includes(zone)) {
    const maxF = zone === 'mul_10' ? 10 : 5;
    const a = randInt(2, maxF);
    const b = randInt(2, 9);
    target = a * b;
    op = '\u00d7';
    validPairs = [];
    for (let i = 2; i <= Math.sqrt(target) + 1; i++) {
      if (target % i === 0) validPairs.push([i, target / i]);
    }
    if (validPairs.length === 0) validPairs = [[a, b]];
  } else {
    // Division zones — use addition with larger numbers
    target = randInt(10, 30);
    op = '+';
    validPairs = [];
    for (let i = 1; i < target; i++) validPairs.push([i, target - i]);
  }

  // Build a tile pool: include at least some valid tiles + distractors
  const validFlat = new Set(validPairs.flat());
  const pool = new Set([...validFlat]);
  let attempts = 0;
  while (pool.size < 8 && attempts < 100) {
    attempts++;
    const n = randInt(1, Math.max(15, target));
    if (!validFlat.has(n)) pool.add(n);
  }

  return {
    type: op === '+' ? 'addition' : 'multiplication',
    equationDisplay: `___ ${op} ___ = ${target}`,
    target,
    op,
    validPairs,
    tilePool: Array.from(pool).sort(() => Math.random() - 0.5),
  };
}

export function generateDistractors(answer, count = 2, level = 1) {
  const range = Math.max(3, Math.floor(answer * 0.5) + 2);
  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    attempts++;
    const offset = randInt(1, range);
    const wrong = Math.random() > 0.5 ? answer + offset : answer - offset;
    if (wrong > 0 && wrong !== answer) distractors.add(wrong);
  }
  let i = 1;
  while (distractors.size < count) {
    if (i !== answer) distractors.add(i);
    i++;
    if (i > 300) break;
  }
  return Array.from(distractors).slice(0, count);
}
