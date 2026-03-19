
'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

// Re-export hooks and providers
export { FirebaseProvider, FirebaseClientProvider } from './client-provider';
export { useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';


type FirebaseInstances = {
    app: FirebaseApp,
    auth: Auth,
    firestore: Firestore | null,
};

let firebaseInstances: FirebaseInstances | null = null;

// This function initializes Firebase and returns the app, auth, and firestore instances.
// It's designed to be called on the client-side and ensures that Firebase is only initialized once.
export function initializeFirebase(): FirebaseInstances {
    if (firebaseInstances) {
        return firebaseInstances;
    }

    const firebaseConfig = getFirebaseConfig();
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    let firestore: Firestore | null = null;
    
    try {
        firestore = getFirestore(app);
    } catch (e) {
        console.warn('Could not initialize Firestore. This may be due to browser limitations or misconfiguration.');
    }

    firebaseInstances = { app, auth, firestore };
    return firebaseInstances;
}


// A convenience function to get the initialized firebase instances.
// Throws an error if Firebase is not initialized.
export function getFirebase() {
    if (!firebaseInstances) {
        throw new Error('Firebase not initialized. Call initializeFirebase in your root layout.');
    }
    return firebaseInstances;
}
