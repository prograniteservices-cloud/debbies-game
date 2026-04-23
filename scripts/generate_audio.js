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
}

main();
