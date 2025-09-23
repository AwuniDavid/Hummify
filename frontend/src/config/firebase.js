import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyABx3uKRcgU0bnjciMx7HIYGNmhj44lTZE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hummify-fb46d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hummify-fb46d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hummify-fb46d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "339093350007",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:339093350007:web:2c8b77dd0d6f93d7ca4872",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XR0N6DPYH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;