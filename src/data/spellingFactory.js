export const SPELLING_STATIONS = ['build', 'sort', 'find'];

const WORDS = [
  ['CAT', 'A furry pet that says meow'],
  ['DOG', 'A friendly pet that barks'],
  ['SUN', 'The bright star in the daytime sky'],
  ['BEE', 'A tiny insect that makes honey'],
  ['CAR', 'A vehicle with four wheels'],
  ['HAT', 'Something you wear on your head'],
  ['PIG', 'A farm animal that says oink'],
  ['COW', 'A farm animal that gives milk'],
  ['CUP', 'Something you drink from'],
  ['BUS', 'A big vehicle that takes kids to school'],
  ['STAR', 'A tiny light that twinkles at night'],
  ['FROG', 'A green animal that jumps and says ribbit'],
  ['CAKE', 'A sweet treat for a party'],
  ['BIRD', 'An animal with wings that sings'],
  ['FISH', 'An animal that swims in water'],
  ['DUCK', 'A bird that says quack'],
  ['MOON', 'The round light in the night sky'],
  ['BEAR', 'A big furry animal from the woods'],
  ['TREE', 'A tall plant with leaves and branches'],
  ['BOAT', 'A vehicle that floats on water'],
  ['LEAF', 'A green part of a plant'],
  ['JUMP', 'To spring up into the air'],
  ['BLUE', 'The color of the sky'],
  ['RAIN', 'Water that falls from clouds'],
  ['KITE', 'A toy that flies on a string'],
  ['SNOW', 'Cold white flakes from the sky'],
  ['FIRE', 'Something hot and bright'],
  ['WIND', 'Air that blows around'],
  ['SAND', 'Tiny grains found at the beach'],
  ['ROCK', 'A hard stone from the ground'],
  ['APPLE', 'A red or green fruit'],
  ['TRAIN', 'A long vehicle that runs on tracks'],
  ['MOUSE', 'A small animal that likes cheese'],
  ['CLOCK', 'Something that tells time'],
  ['SMILE', 'A happy face shape'],
  ['WATER', 'A clear drink from a cup'],
  ['HOUSE', 'A place where people live'],
  ['CHAIR', 'Something you sit on'],
  ['HORSE', 'A big animal people can ride'],
  ['PUPPY', 'A baby dog'],
  ['PLANET', 'A world that moves around a star'],
  ['MONKEY', 'An animal that swings from trees'],
  ['FLOWER', 'A colorful plant in a garden'],
  ['PENCIL', 'A tool used for writing and drawing'],
  ['RABBIT', 'An animal with long ears'],
  ['WINDOW', 'Something you look through in a wall'],
  ['DRAGON', 'A pretend creature that breathes fire'],
  ['CASTLE', 'A home for kings and queens'],
  ['ORANGE', 'A fruit and a color'],
  ['SCHOOL', 'A place where kids learn'],
  ['CIRCLE', 'A round shape'],
  ['SPIDER', 'A small animal with eight legs'],
  ['BUTTON', 'A small piece you press or fasten'],
  ['ROCKET', 'A ship that blasts into space'],
  ['TURTLE', 'An animal with a hard shell'],
  ['BANANA', 'A long yellow fruit'],
  ['GARDEN', 'A place where plants grow'],
  ['PIRATE', 'A sailor who searches for treasure'],
  ['CASTLE', 'A magical building with towers'],
  ['RAINBOW', 'Colors that appear after rain'],
];

export const SPELLING_LEVELS = WORDS.map(([word, hint], index) => {
  const level = index + 1;
  const chapter = Math.ceil(level / 5);
  const station = SPELLING_STATIONS[index % SPELLING_STATIONS.length];

  return {
    id: `spell-${level}`,
    level,
    chapter,
    station,
    word,
    hint,
    wordAudio: `word_${word.toLowerCase()}`,
    hintAudio: `hint_${level}`,
    isMilestone: level % 5 === 0,
    distractorCount: level < 11 ? 0 : level < 26 ? 1 : level < 46 ? 2 : 3,
    showWord: level <= 10,
  };
});

export function getSpellingLevel(levelNumber) {
  const index = Math.max(0, Math.min(SPELLING_LEVELS.length - 1, levelNumber - 1));
  return SPELLING_LEVELS[index];
}

export function getInitialSpellingLevel({ savedLevel }) {
  return getSpellingLevel(Number(savedLevel) || 1).level;
}

export function getSpellingLevelChoices() {
  return SPELLING_LEVELS
    .filter((level) => level.level === 1 || level.level % 5 === 0)
    .map((level) => ({
      level: level.level,
      chapter: level.chapter,
      word: level.word,
      station: level.station,
      isMilestone: level.isMilestone,
    }));
}

export function getSpellingStars({ mistakes, hintsUsed }) {
  if (mistakes === 0 && hintsUsed === 0) return 3;
  if (mistakes <= 1 && hintsUsed <= 1) return 2;
  return 1;
}

export function getStationTitle(station) {
  if (station === 'sort') return 'Sort and Stamp';
  if (station === 'find') return 'Find and Assemble';
  return 'Build and Repair';
}

export function getStationPrompt(station) {
  if (station === 'sort') return 'Send each letter through the machine in the right order.';
  if (station === 'find') return 'Open the glowing panels, then place the letters into the word tray.';
  return 'Place the letters into the sockets to power the word machine.';
}
