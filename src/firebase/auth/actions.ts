
'use client';

import { getAuth, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebase } from '@/firebase';

export async function signInWithGoogle(): Promise<User> {
  const { auth, firestore } = getFirebase();
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create or update user profile in Firestore
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const { auth } = getFirebase();
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
}
