'use server';

import { auth } from '@/lib/firebase';
import { db, storage } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const RecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required."),
  ingredients: z.array(z.string()).min(1, "Ingredients are required."),
  instructions: z.array(z.string()).min(1, "Instructions are required."),
  simpleInstructions: z.array(z.string()).optional(),
  photoUrl: z.string().startsWith("data:image/", "A valid photo data URL is required."),
});

export async function saveRecipeAction(data: z.infer<typeof RecipeSchema>) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to save a recipe.');
  }

  const validatedData = RecipeSchema.parse(data);

  // Extract image data
  const mimeType = validatedData.photoUrl.match(/data:(.*);base64,/)?.[1];
  const base64Data = validatedData.photoUrl.split(',')[1];
  if (!mimeType || !base64Data) {
    throw new Error('Invalid image data URL.');
  }
  const imageBuffer = Buffer.from(base64Data, 'base64');

  // Upload image to Firebase Storage using Admin SDK
  const bucket = storage.bucket();
  const filePath = `recipes/${user.uid}/${Date.now()}`;
  const file = bucket.file(filePath);
  
  await file.save(imageBuffer, {
    metadata: {
      contentType: mimeType,
    },
  });

  const downloadUrl = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491', // Far future expiration date
  }).then(urls => urls[0]);

  // Save recipe to Firestore using Admin SDK
  await db.collection('recipes').add({
    userId: user.uid,
    name: validatedData.name,
    ingredients: validatedData.ingredients,
    instructions: validatedData.instructions,
    simpleInstructions: validatedData.simpleInstructions || [],
    photoUrl: downloadUrl,
    createdAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/recipes');
}
