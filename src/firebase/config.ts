
import { FirebaseOptions } from 'firebase/app';

// This configuration will be populated by the Firebase CLI
// during the deployment process.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig(): FirebaseOptions {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
  ) {
    console.warn(`
    Firebase configuration is incomplete. Using placeholder values to allow the app to run.
    For a full backend experience, please set up your Firebase project credentials.
    `);
    
    // Return placeholder values to prevent the app from crashing.
    return {
      apiKey: "placeholder-key",
      authDomain: "placeholder.firebaseapp.com",
      projectId: "placeholder-project",
      storageBucket: "placeholder.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:placeholder",
    };
  }
  return firebaseConfig;
}
