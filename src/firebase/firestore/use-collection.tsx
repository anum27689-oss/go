
'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  type DocumentData,
  type Query,
  type CollectionReference,
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

export function useCollection<T = DocumentData>(
  pathOrQuery: string | Query | CollectionReference | null,
  options: Options = defaultOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firestore || !pathOrQuery) {
      setIsLoading(false);
      return;
    }

    let q: Query | CollectionReference;
    if (typeof pathOrQuery === 'string') {
      q = collection(firestore, pathOrQuery);
    } else {
      q = pathOrQuery;
    }

    if (options.listen) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as T)
          );
          setData(docs);
          setIsLoading(false);
        },
        (err) => {
          const permissionError = new FirestorePermissionError({
            path: 'path' in q ? q.path : 'Unknown path',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setIsLoading(true);
      getDocs(q)
        .then((snapshot) => {
          const docs = snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as T)
          );
          setData(docs);
          setIsLoading(false);
        })
        .catch((err) => {
          const permissionError = new FirestorePermissionError({
            path: 'path' in q ? q.path : 'Unknown path',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(permissionError);
          setIsLoading(false);
        });
    }
  }, [firestore, pathOrQuery, options.listen]);

  return { data, isLoading, error };
}
