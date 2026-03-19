
'use client';
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  getDoc,
  type DocumentData,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Options = {
  listen: boolean;
};

const defaultOptions: Options = {
  listen: true,
};

export function useDoc<T = DocumentData>(
  pathOrRef: string | DocumentReference | null,
  options: Options = defaultOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore || !pathOrRef) {
        setIsLoading(false);
        return;
    };

    const docRef = typeof pathOrRef === 'string' ? doc(firestore, pathOrRef) : pathOrRef;

    if (options.listen) {
      const unsubscribe = onSnapshot(docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setData({ ...docSnap.data(), id: docSnap.id } as T);
          } else {
            setData(null);
          }
          setIsLoading(false);
        },
        (err) => {
            const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'get' });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setIsLoading(true);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setData({ ...docSnap.data(), id: docSnap.id } as T);
          } else {
            setData(null);
          }
          setIsLoading(false);
        })
        .catch((err) => {
            const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'get' });
            errorEmitter.emit('permission-error', permissionError);
            setError(permissionError);
            setIsLoading(false);
        });
    }
  }, [firestore, pathOrRef, options.listen]);

  return { data, isLoading, error };
}
