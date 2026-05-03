import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAudio(prompt, filename) {
  console.log(`Generating audio for: ${filename}`);
  try {
    const response = await ai.models.generateContent({
      model: 'lyria-3-pro-preview',
      contents: prompt,
    });

    // Check if we got audio data
    let audioData = null;
    let mimeType = 'audio/mp3';
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('audio')) {
          audioData = part.inlineData.data;
          mimeType = part.inlineData.mimeType;
          break;
        }
      }
    }

    if (audioData) {
      const buffer = Buffer.from(audioData, 'base64');
      const ext = mimeType.split('/')[1] || 'mp3';
      const filepath = path.join(process.cwd(), 'public', 'assets', 'audio', `${filename}.${ext}`);
      fs.writeFileSync(filepath, buffer);
      console.log(`✅ Saved ${filepath}`);
    } else {
      console.log(`❌ No audio data returned for ${filename}. Raw response keys:`, Object.keys(response));
      if (response.text) console.log("Text response:", response.text);
    }
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    if (error.status) console.error(`Status: ${error.status}`);
  }
}

async function main() {
  const dir = path.join(process.cwd(), 'public', 'assets', 'audio');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await generateAudio('A highly polished, premium UI sound effect for a successful action. Bright, magical, with a satisfying chime.', 'ding');
  await generateAudio('Whimsical toy workshop soundtrack for a premium children spelling puzzle game. Marimba, pizzicato strings, glockenspiel, soft brushed drums, tiny magical machine ticks, upbeat but not frantic, 112 BPM, seamless loop.', 'spelling_factory_main');
  await generateAudio('Light focus puzzle loop for a children spelling game. Gentle marimba pulse, soft pizzicato strings, airy glockenspiel accents, minimal percussion, calm concentration mood, 96 BPM, seamless loop.', 'spelling_factory_focus');
  await generateAudio('Short celebration music bed for completing a magical word machine. Bright glockenspiel flourish, pizzicato strings, warm toy percussion, joyful child-safe reward energy, loopable 20 second stinger.', 'spelling_factory_celebration');
  await generateAudio('Playful pop celebration music for a children spelling game bonus moment. Bouncy marimba, bubble pops, toy percussion, sparkly glockenspiel, 120 BPM, seamless loop.', 'spelling_factory_pop');
}

main();
