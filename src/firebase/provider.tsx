
'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type FirebaseContextValue = {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
};

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export const FirebaseProvider = ({
  children,
  ...value
}: { children: React.ReactNode } & FirebaseContextValue) => {
  return (
    <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = () => {
    const { app } = useFirebase();
    return app;
}

export const useAuth = () => {
    const { auth } = useFirebase();
    return auth;
}

export const useFirestore = () => {
    const { firestore } = useFirebase();
    return firestore;
}
