import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

import { getFirestore } from 'firebase/firestore';

// Configuration Firebase - vos clés

const firebaseConfig = {
  apiKey: "AIzaSyChWVS_PDX6PizXH24IITn0qvx88DsBZic",
  authDomain: "butter-vdef.firebaseapp.com", 
  projectId: "butter-vdef",
  storageBucket: "butter-vdef.appspot.com",
  messagingSenderId: "743945650254",
  appId: "1:743945650254:ios:6488209a31fe881e41831f"
};

// Initialiser Firebase

const app = initializeApp(firebaseConfig);

// Obtenir une référence au service de stockage

export const storage = getStorage(app);

// Obtenir une référence à Firestore

export const db = getFirestore(app);

export { app };

