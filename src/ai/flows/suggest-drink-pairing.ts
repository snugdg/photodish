'use server';
/**
 * @fileOverview An AI agent that suggests drink pairings for a recipe.
 *
 * - suggestDrinkPairing - A function that handles the drink pairing suggestion process.
 * - SuggestDrinkPairingInput - The input type for the suggestDrinkPairing function.
 * - SuggestDrinkPairingOutput - The return type for the suggestDrinkPairing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDrinkPairingInputSchema = z.object({
  recipeName: z.string().describe('The name of the dish.'),
  recipeIngredients: z.array(z.string()).describe('The list of ingredients for the dish.'),
});
export type SuggestDrinkPairingInput = z.infer<typeof SuggestDrinkPairingInputSchema>;

const PairingSuggestionSchema = z.object({
  name: z.string().describe('The name of the suggested drink (e.g., "Sauvignon Blanc", "IPA", "Sparkling Cranberry Punch").'),
  reason: z.string().describe('A brief explanation for why this drink pairs well with the dish.'),
  imageHint: z.string().describe('A one or two word hint for generating an image of the drink. E.g. "white wine", "craft beer", "fruity cocktail".'),
});

const SuggestDrinkPairingOutputSchema = z.object({
  wine: PairingSuggestionSchema.optional().describe('The suggested wine pairing.'),
  beer: PairingSuggestionSchema.optional().describe('The suggested beer pairing.'),
  nonAlcoholic: PairingSuggestionSchema.optional().describe('The suggested non-alcoholic drink pairing.'),
});
export type SuggestDrinkPairingOutput = z.infer<typeof SuggestDrinkPairingOutputSchema>;

export async function suggestDrinkPairing(input: SuggestDrinkPairingInput): Promise<SuggestDrinkPairingOutput> {
  return suggestDrinkPairingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDrinkPairingPrompt',
  input: {schema: SuggestDrinkPairingInputSchema},
  output: {schema: SuggestDrinkPairingOutputSchema},
  prompt: `You are an expert sommelier and food pairing specialist. Given a recipe name and its ingredients, suggest one wine, one beer, and one non-alcoholic beverage that would pair wonderfully with the dish.

For each suggestion, provide the name of the drink, a concise, one-sentence reason explaining why it's a good match, and a short hint for generating an image of it.

Dish Name: {{{recipeName}}}

Ingredients:
{{#each recipeIngredients}}- {{{this}}}
{{/each}}

Generate the drink pairings below. If you cannot find a suitable pairing for a category, you may omit it.`,
});

const suggestDrinkPairingFlow = ai.defineFlow(
  {
    name: 'suggestDrinkPairingFlow',
    inputSchema: SuggestDrinkPairingInputSchema,
    outputSchema: SuggestDrinkPairingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
