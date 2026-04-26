import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const CHARACTERS = {
  debbie: { 
    name: "Debbie", 
    voice: { languageCode: 'en-US', name: 'en-US-Studio-O', ssmlGender: 'FEMALE' },
    correct: [
      "Magical job, Debbie! You're a spelling star!",
      "Sparkle on, Debbie! That's exactly right!",
      "Wow, Debbie! You found all the letters!"
    ],
    incorrect: [
      "Almost there, Debbie! Try one more time!",
      "Not quite, but I believe in you, Debbie!",
      "Oops! Let's find the right letter together, Debbie."
    ]
  },
  bubba: { 
    name: "Bubba", 
    voice: { languageCode: 'en-US', name: 'en-US-Studio-Q', ssmlGender: 'MALE' },
    correct: [
      "Boom! Great job, Bubba! You're a total hero!",
      "Roar! Bubba, you're a spelling champion!",
      "Bubba! That was super fast! Perfect!"
    ],
    incorrect: [
      "Almost, Bubba! Try again, big hero!",
      "So close, Bubba! You've got this!",
      "Oops! Even heroes need a second try, Bubba!"
    ]
  },
  milo: { 
    name: "Milo", 
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-D', ssmlGender: 'MALE' },
    correct: [
      "Incredible discovery, Milo! You spelled it!",
      "You're a spelling explorer, Milo! Great work!",
      "Milo, you found the right path! Perfect!"
    ],
    incorrect: [
      "Almost, Milo! Let's explore another letter!",
      "Not quite, but keep searching, Milo!",
      "Oops! Let's find the right way, Milo!"
    ]
  },
  luna: { 
    name: "Luna", 
    voice: { languageCode: 'en-US', name: 'en-US-Neural2-H', ssmlGender: 'FEMALE' },
    correct: [
      "How wise, Luna! You spelled it perfectly!",
      "Brilliant work, Luna! You're so smart!",
      "Luna, your spelling is wonderful!"
    ],
    incorrect: [
      "Almost, Luna! Think for a moment and try again.",
      "Not quite, but I know you can do it, Luna.",
      "Oops! Let's try that one more time, Luna."
    ]
  }
};

const WORDS = [
  "CAT", "DOG", "SUN", "BEE", "CAR", "HAT", "BAT", "COW", "PIG", "BOX", "CUP", "BUS",
  "STAR", "FROG", "CAKE", "BIRD", "FISH", "DUCK", "MOON", "BEAR", "TREE", "BOAT", "DOOR", "SHOE"
];

async function speak(text, filename, voiceOptions) {
  console.log(`🎙️ Synthesizing: "${text}" -> ${filename}.mp3`);
  
  const body = {
    input: { text },
    voice: voiceOptions || { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const response = await fetch(TTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`TTS API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const audioBuffer = Buffer.from(data.audioContent, 'base64');
    
    const outputDir = path.join(process.cwd(), 'public', 'assets', 'audio', 'tts');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    
    fs.writeFileSync(path.join(outputDir, `${filename}.mp3`), audioBuffer);
    console.log(`✅ Saved ${filename}.mp3`);
  } catch (error) {
    console.error(`❌ Error synthesizing ${filename}:`, error.message);
  }
}

async function main() {
  if (!API_KEY) {
    console.error("❌ No GOOGLE_TTS_API_KEY found in .env.local");
    return;
  }

  console.log("🚀 Starting TTS Generation for Spelling Game...");

  // 1. Generate Words
  for (const word of WORDS) {
    await speak(word, `word_${word.toLowerCase()}`, { languageCode: 'en-US', name: 'en-US-Studio-O' });
  }

  // 2. Generate Character Phrases
  for (const [key, char] of Object.entries(CHARACTERS)) {
    // Correct phrases
    for (let i = 0; i < char.correct.length; i++) {
      await speak(char.correct[i], `${key}_correct_${i + 1}`, char.voice);
    }
    
    // Incorrect phrases
    for (let i = 0; i < char.incorrect.length; i++) {
      await speak(char.incorrect[i], `${key}_incorrect_${i + 1}`, char.voice);
    }
  }

  console.log("✨ TTS Generation Complete!");
}

main();
