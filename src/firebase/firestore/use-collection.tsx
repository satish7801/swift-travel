'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  doc,
  getDoc,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  // Add any options you need for querying, e.g.,
  // where?: [string, any, any][];
  // orderBy?: [string, 'asc' | 'desc'];
  // limit?: number;
}

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore) return;

    const collectionRef = collection(firestore, path) as CollectionReference<T>;

    // Here you could build a more complex query based on options
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as unknown as T)
        );
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path]); // Add options to dependency array if it's not stable

  return { data, loading, error };
}
