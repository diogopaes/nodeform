import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore, FieldValue } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let db: Firestore | undefined;
let storage: Storage | undefined;

function getFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Verifica se as variáveis de ambiente estão configuradas
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error(
        "Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
      );
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // A private key vem com \n escapados, precisamos converter
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  if (!db) {
    db = getFirestore();
  }

  if (!storage) {
    storage = getStorage();
  }

  return { db, storage, FieldValue };
}

export { getFirebaseAdmin };
