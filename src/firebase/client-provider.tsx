'use client';

import { ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';
import { getFirebaseConfig } from './config';

// This is a singleton to ensure we only initialize Firebase once.
const firebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const value = {
    app: firebaseApp,
    auth,
    firestore,
  };

  return <FirebaseProvider value={value}>{children}</FirebaseProvider>;
}
