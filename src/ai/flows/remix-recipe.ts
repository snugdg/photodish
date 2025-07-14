'use server';
/**
 * @fileOverview An AI agent that remixes a recipe based on a user's prompt.
 *
 * - remixRecipe - A function that handles the recipe remixing process.
 * - RemixRecipeInput - The input type for the remixRecipe function.
 * - RemixRecipeOutput - The return type for the remixRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeSchema = z.object({
    name: z.string().describe('The name of the dish.'),
    ingredients: z.array(z.string()).describe('The ingredients of the dish.'),
    instructions: z.array(z.string()).describe('The instructions to prepare the dish.'),
});

const RemixRecipeInputSchema = z.object({
  recipe: RecipeSchema,
  prompt: z.string().describe('The user\'s request for how to change the recipe. For example: "Make it vegetarian" or "Give it a Japanese twist".'),
});
export type RemixRecipeInput = z.infer<typeof RemixRecipeInputSchema>;

const RemixRecipeOutputSchema = z.object({
  recipe: RecipeSchema.describe('The new, remixed recipe.'),
});
export type RemixRecipeOutput = z.infer<typeof RemixRecipeOutputSchema>;

export async function remixRecipe(input: RemixRecipeInput): Promise<RemixRecipeOutput> {
  return remixRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'remixRecipePrompt',
  input: {schema: RemixRecipeInputSchema},
  output: {schema: RemixRecipeOutputSchema},
  prompt: `You are an expert chef who excels at creatively modifying recipes. A user wants to "remix" an existing recipe.

You will be given the original recipe (name, ingredients, instructions) and a prompt from the user on how they want to change it.

Your task is to generate a new recipe that incorporates the user's request. This may involve changing the name, adding/removing/substituting ingredients, and altering the instructions. Make sure the new instructions are complete and make sense for the new set of ingredients.

Original Recipe Name: {{{recipe.name}}}
Original Ingredients:
{{#each recipe.ingredients}}- {{{this}}}
{{/each}}
Original Instructions:
{{#each recipe.instructions}}- {{{this}}}
{{/each}}

User's Remix Request: {{{prompt}}}

Generate the new, remixed recipe below.`,
});

const remixRecipeFlow = ai.defineFlow(
  {
    name: 'remixRecipeFlow',
    inputSchema: RemixRecipeInputSchema,
    outputSchema: RemixRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
