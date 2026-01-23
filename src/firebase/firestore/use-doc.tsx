'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  DocumentData,
  FirestoreError,
  DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useDoc<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore || !path) {
      setLoading(false);
      return;
    };

    const docRef = doc(firestore, path) as DocumentReference<T>;

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() } as unknown as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]);

  return { data, loading, error };
}
