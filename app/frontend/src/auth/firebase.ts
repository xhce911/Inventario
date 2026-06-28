import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const requiredFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
};

const firebaseConfig = {
  ...requiredFirebaseConfig,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseConfigured = Object.values(requiredFirebaseConfig).every(Boolean);

const firebaseApp = isFirebaseConfigured
  ? getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : undefined;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : undefined;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : undefined;
export const googleProvider = firebaseApp ? new GoogleAuthProvider() : undefined;
export const firebaseAnalytics = firebaseApp
  ? isSupported()
      .then((supported) => (supported ? getAnalytics(firebaseApp) : undefined))
      .catch(() => undefined)
  : Promise.resolve(undefined);
