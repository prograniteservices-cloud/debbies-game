import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { SPELLING_LEVELS } from '../src/data/spellingFactory.js';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const CHARACTERS = {
  debbie: {
    voice: { languageCode: 'en-US', name: 'en-US-Studio-O', ssmlGender: 'FEMALE' },
    correct: [
      "Magical job, Debbie! You powered the word machine!",
      "Sparkle on, Debbie! That word is exactly right!",
      "Wow, Debbie! The factory is glowing because of you!"
    ],
    incorrect: [
      "Almost there, Debbie. Try a different socket.",
      "Not quite, Debbie. Look for the glowing clue.",
      "Good try, Debbie. Let's find the next letter together."
    ],
    hint: [
      "Listen closely and look for the next helpful letter.",
      "The machine is giving you a clue.",
      "Try the glowing letter first."
    ],
  },
  bubba: {
    voice: { languageCode: 'en-US', name: 'en-US-Studio-Q', ssmlGender: 'MALE' },
    correct: [
      "Boom, Bubba! You fixed that word machine!",
      "Roar, Bubba! That spelling was powerful!",
      "Bubba, you stamped that word perfectly!"
    ],
    incorrect: [
      "Almost, Bubba. Try one more letter.",
      "So close, Bubba. Check the glowing socket.",
      "Good try, hero. Let's test another tile."
    ],
    hint: [
      "The factory lights are showing the next step.",
      "Listen to the clue and try again.",
      "Look for the letter that matches the glowing socket."
    ],
  },
  milo: {
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-D', ssmlGender: 'MALE' },
    correct: [
      "Incredible discovery, Milo! The word machine is fixed!",
      "Great exploring, Milo. You spelled it!",
      "Milo, that word badge is ready to stamp!"
    ],
    incorrect: [
      "Almost, Milo. Let's explore another tile.",
      "Not quite, Milo. The machine has another clue.",
      "Good search, Milo. Try the glowing spot."
    ],
    hint: [
      "The next clue is lighting up.",
      "Listen again and follow the machine lights.",
      "Try the letter that belongs in the glowing socket."
    ],
  },
  luna: {
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-H', ssmlGender: 'FEMALE' },
    correct: [
      "Brilliant work, Luna! The word machine is shining!",
      "Wonderful spelling, Luna. The factory is brighter now!",
      "Luna, you found the perfect word pattern!"
    ],
    incorrect: [
      "Almost, Luna. Think for a moment and try again.",
      "Not quite, Luna. Watch the glowing clue.",
      "Good try, Luna. The next letter is close."
    ],
    hint: [
      "The machine is sharing a helpful clue.",
      "Listen again and follow the glowing letters.",
      "Try the letter that fits the next space."
    ],
  },
};

async function speak(text, filename, voiceOptions) {
  console.log(`Synthesizing "${text}" -> ${filename}.mp3`);

  const body = {
    input: { text },
    voice: voiceOptions || { languageCode: 'en-US', name: 'en-US-Studio-O' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const response = await fetch(TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`TTS API error for ${filename}: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audioContent, 'base64');
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio', 'tts');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, `${filename}.mp3`), audioBuffer);
}

async function main() {
  if (!API_KEY) {
    throw new Error('No GOOGLE_TTS_API_KEY found in .env.local');
  }

  const generatedWords = new Set();

  for (const level of SPELLING_LEVELS) {
    if (!generatedWords.has(level.wordAudio)) {
      await speak(level.word, level.wordAudio, { languageCode: 'en-US', name: 'en-US-Studio-O' });
      generatedWords.add(level.wordAudio);
    }
    await speak(level.hint, level.hintAudio, { languageCode: 'en-US', name: 'en-US-Studio-O' });
  }

  for (const [key, character] of Object.entries(CHARACTERS)) {
    for (let i = 0; i < character.correct.length; i += 1) {
      await speak(character.correct[i], `${key}_correct_${i + 1}`, character.voice);
    }
    for (let i = 0; i < character.incorrect.length; i += 1) {
      await speak(character.incorrect[i], `${key}_incorrect_${i + 1}`, character.voice);
    }
    for (let i = 0; i < character.hint.length; i += 1) {
      await speak(character.hint[i], `${key}_hint_${i + 1}`, character.voice);
    }
  }

  console.log('Spelling TTS generation complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
