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
} from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  orderBy?: [string, 'asc' | 'desc'];
  // Future options can be added here, e.g.,
  // where?: [string, any, any][];
  // limit?: number;
}

export function useCollection<T>(
  path: string,
  options?: UseCollectionOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore || !path) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(firestore, path) as CollectionReference<T>;

    let q: Query<T> = query(collectionRef);

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy[0], options.orderBy[1]));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as (T & { id: string }))
        );
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, options?.orderBy?.[0], options?.orderBy?.[1]]); // Make sure to include orderBy params in dependency array

  return { data, loading, error };
}
