import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChWVS_PDX6PizXH24IITn0qvx88DsBZic",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "butter-vdef.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "butter-vdef",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "butter-vdef.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "743945650254",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:743945650254:ios:6488209a31fe881e41831f"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export { app };
