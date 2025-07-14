import type { Timestamp } from "firebase/firestore";

export type Recipe = {
  id: string;
  userId: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  simpleInstructions?: string[];
  photoUrl: string;
  createdAt: Timestamp;
};
