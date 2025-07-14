'use server';

import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
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

  // Upload image to Firebase Storage
  const storageRef = ref(storage, `recipes/${user.uid}/${Date.now()}`);
  const uploadResult = await uploadString(storageRef, validatedData.photoUrl, 'data_url');
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  // Save recipe to Firestore
  await addDoc(collection(db, 'recipes'), {
    userId: user.uid,
    name: validatedData.name,
    ingredients: validatedData.ingredients,
    instructions: validatedData.instructions,
    simpleInstructions: validatedData.simpleInstructions || [],
    photoUrl: downloadUrl,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/recipes');
}
