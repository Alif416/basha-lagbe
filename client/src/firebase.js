// Firebase configuration
// To enable Google OAuth, create a Firebase project and add your config here
// Then replace the placeholder values below with your actual Firebase config

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  }
} catch (error) {
  console.warn('Firebase not configured. Google OAuth will be unavailable.');
}

export { app };
export default app;
