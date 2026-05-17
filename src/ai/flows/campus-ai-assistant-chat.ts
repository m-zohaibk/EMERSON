
'use server';
/**
 * @fileOverview A helpful AI assistant for Emerson Connect powered by Gemini 2.5 Flash.
 * Provides detailed information about campus locations and official notices.
 * Optimized for natural language search across notices and locations.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

function getDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

const ChatWithCampusAIAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question about campus info.'),
});
export type ChatWithCampusAIAssistantInput = z.infer<typeof ChatWithCampusAIAssistantInputSchema>;

const ChatWithCampusAIAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI generated answer.'),
});
export type ChatWithCampusAIAssistantOutput = z.infer<typeof ChatWithCampusAIAssistantOutputSchema>;

const searchLocationsTool = ai.defineTool(
  {
    name: 'searchLocations',
    description: 'Searches campus buildings, blocks, labs, and offices.',
    inputSchema: z.object({ query: z.string().optional() }),
    outputSchema: z.array(z.any()),
  },
  async (input) => {
    const db = getDb();
    try {
      const snapshot = await getDocs(collection(db, 'locations'));
      const locs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (!input.query) return locs.slice(0, 10);

      const queryWords = input.query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      if (queryWords.length === 0) return locs.slice(0, 10);

      return locs.filter((l: any) => {
        const name = (l.name || '').toLowerCase();
        const desc = (l.description || '').toLowerCase();
        const tags = (l.tags || []).join(' ').toLowerCase();
        return queryWords.some(word => name.includes(word) || desc.includes(word) || tags.includes(word));
      }).slice(0, 10);
    } catch { return []; }
  }
);

const getNoticesTool = ai.defineTool(
  {
    name: 'getNotices',
    description: 'Searches for official campus notices, exam schedules, and announcements.',
    inputSchema: z.object({ query: z.string().optional() }),
    outputSchema: z.array(z.any()),
  },
  async (input) => {
    const db = getDb();
    try {
      const snapshot = await getDocs(collection(db, 'notices'));
      const notices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (!input.query) return notices.slice(0, 10);

      const queryWords = input.query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      if (queryWords.length === 0) return notices.slice(0, 10);

      return notices.filter((n: any) => {
        const title = (n.title || '').toLowerCase();
        const desc = (n.description || '').toLowerCase();
        const cat = (n.category || '').toLowerCase();
        return queryWords.some(word => 
          title.includes(word) || 
          desc.includes(word) || 
          cat.includes(word) || 
          (word.endsWith('s') && title.includes(word.slice(0, -1))) || 
          (title.includes(word + 's'))
        );
      }).slice(0, 15);
    } catch { return []; }
  }
);

const campusAssistantPrompt = ai.definePrompt({
  name: 'campusAssistantPrompt',
  input: { schema: ChatWithCampusAIAssistantInputSchema },
  output: { schema: ChatWithCampusAIAssistantOutputSchema },
  tools: [searchLocationsTool, getNoticesTool],
  config: { 
    temperature: 0.1,
    safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }]
  },
  model: 'googleai/gemini-2.5-flash',
  system: `You are the official Emerson Connect AI Assistant for Emerson University Multan.
  Your goal is to provide accurate, detailed, and professional information.
  
  CORE INSTRUCTIONS:
  1. ALWAYS use the getNotices tool to check for exam dates, result announcements, and alerts.
  2. Use searchLocations to find departments and facilities.
  3. Provide full, comprehensive, and accurate answers. Do not truncate information.
  4. If a user asks for "exams" or "results", search the notices immediately.
  5. If the tools return information, relay it precisely.
  6. Maintain a polite, professional, and helpful tone.`,
  prompt: `{{{question}}}`,
});

const chatWithCampusAIAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithCampusAIAssistantFlow',
    inputSchema: ChatWithCampusAIAssistantInputSchema,
    outputSchema: ChatWithCampusAIAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await campusAssistantPrompt(input);
    return output || { answer: "I apologize, I couldn't find specific information regarding that query in our digital records. Please check the official notice boards near the registrar's office." };
  }
);

export async function chatWithCampusAIAssistant(input: ChatWithCampusAIAssistantInput): Promise<ChatWithCampusAIAssistantOutput> {
  return chatWithCampusAIAssistantFlow(input);
}

export async function speakAnswer(text: string): Promise<{ audioUrl: string }> {
  const { media } = await ai.generate({
    model: googleAI.model('gemini-2.5-flash-preview-tts'),
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } } },
    },
    prompt: text,
  });
  if (!media) throw new Error('No audio');
  const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
  const wavBase64 = await toWav(audioBuffer);
  return { audioUrl: 'data:audio/wav;base64,' + wavBase64 };
}

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({ channels, sampleRate: rate, bitDepth: sampleWidth * 8 });
    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}
