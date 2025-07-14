'use server';
/**
 * @fileOverview An AI agent that generates a recipe from a photo of a dish.
 *
 * - generateRecipeFromPhoto - A function that handles the recipe generation process.
 * - GenerateRecipeFromPhotoInput - The input type for the generateRecipeFromPhoto function.
 * - GenerateRecipeFromPhotoOutput - The return type for the generateRecipeFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateRecipeFromPhotoInput = z.infer<typeof GenerateRecipeFromPhotoInputSchema>;

const GenerateRecipeFromPhotoOutputSchema = z.object({
  isFood: z.boolean().describe('Whether the image contains food or not.'),
  recipe: z.object({
    name: z.string().describe('The name of the dish. Should be empty if isFood is false.'),
    ingredients: z.array(z.string()).describe('The ingredients of the dish. Should be empty if isFood is false.'),
    instructions: z.array(z.string()).describe('The instructions to prepare the dish. Should be empty if isFood is false.'),
  }).optional(),
});
export type GenerateRecipeFromPhotoOutput = z.infer<typeof GenerateRecipeFromPhotoOutputSchema>;

export async function generateRecipeFromPhoto(input: GenerateRecipeFromPhotoInput): Promise<GenerateRecipeFromPhotoOutput> {
  return generateRecipeFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromPhotoPrompt',
  input: {schema: GenerateRecipeFromPhotoInputSchema},
  output: {schema: GenerateRecipeFromPhotoOutputSchema},
  prompt: `You are an expert chef specializing in reverse engineering recipes from dish photos.

First, determine if the image provided is a picture of food.
If it is not food, set the isFood flag to false and do not generate a recipe.
If it IS food, set the isFood flag to true and use this information to create a complete recipe for the dish in the photo. You will provide the ingredients and instructions for the recipe.

Photo: {{media url=photoDataUri}}`,
});

const generateRecipeFromPhotoFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromPhotoFlow',
    inputSchema: GenerateRecipeFromPhotoInputSchema,
    outputSchema: GenerateRecipeFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
