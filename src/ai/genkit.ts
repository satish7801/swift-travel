import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import Handlebars from 'handlebars';

Handlebars.registerHelper('json', (context) => {
  return JSON.stringify(context, null, 2);
});

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
