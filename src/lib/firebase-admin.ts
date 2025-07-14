import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountKey && !getApps().length) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Error parsing Firebase service account key:', error);
  }
}

// Ensure db and storage are exported, but they will only work if initialized.
const app = getApps().length ? getApps()[0] : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;


export { db, storage };
