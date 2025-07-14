import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-recipe.ts';
import '@/ai/flows/generate-recipe-from-photo.ts';
import '@/ai/flows/remix-recipe.ts';
import '@/ai/flows/suggest-drink-pairing.ts';
