'use server';

/**
 * @fileOverview A recipe summarization AI agent.
 *
 * - summarizeRecipe - A function that handles the recipe summarization process.
 * - SummarizeRecipeInput - The input type for the summarizeRecipe function.
 * - SummarizeRecipeOutput - The return type for the summarizeRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRecipeInputSchema = z.object({
  recipe: z.string().describe('The recipe to summarize.'),
  mode: z.enum(['Simple', 'Expert']).describe('The mode to summarize the recipe in.'),
});
export type SummarizeRecipeInput = z.infer<typeof SummarizeRecipeInputSchema>;

const SummarizeRecipeOutputSchema = z.object({
  summary: z.string().describe('The summarized recipe.'),
});
export type SummarizeRecipeOutput = z.infer<typeof SummarizeRecipeOutputSchema>;

export async function summarizeRecipe(input: SummarizeRecipeInput): Promise<SummarizeRecipeOutput> {
  return summarizeRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRecipePrompt',
  input: {schema: SummarizeRecipeInputSchema},
  output: {schema: SummarizeRecipeOutputSchema},
  prompt: `You are an expert chef specializing in summarizing recipes for different skill levels.

You will be provided with a recipe and a mode (Simple or Expert).

If the mode is Simple, you will summarize the recipe in a way that is easy for beginners to understand.
If the mode is Expert, you will summarize the recipe in a way that is more detailed and technical for experienced cooks.

Recipe: {{{recipe}}}
Mode: {{{mode}}}

Summary:`,
});

const summarizeRecipeFlow = ai.defineFlow(
  {
    name: 'summarizeRecipeFlow',
    inputSchema: SummarizeRecipeInputSchema,
    outputSchema: SummarizeRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
