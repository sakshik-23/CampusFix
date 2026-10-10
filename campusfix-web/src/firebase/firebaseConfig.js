import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read Firebase config from environment variables with fallback to campusfix-360dd project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCFYsBiNSw5n581nFf6NlnCCynyG0sOaY4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campusfix-360dd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campusfix-360dd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campusfix-360dd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1042223313585",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1042223313585:web:39c3d3029cf0f45c46a890"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("[Firebase] Initialized in Live Mode.");
  } catch (error) {
    console.warn("[Firebase] Error initializing Firebase. Falling back to persistent store:", error);
  }
} else {
  console.info("[CampusFix] Running in Local Mode.");
}

export { app, auth, db };
