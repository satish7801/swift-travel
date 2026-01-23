'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { useAuth } from '../provider';

type AuthStatus = 'loading' | 'loading-uninitialized' | 'authenticated' | 'unauthenticated';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading-uninitialized');

  useEffect(() => {
    if (!auth) {
      return;
    }

    setStatus('loading');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, status };
}
