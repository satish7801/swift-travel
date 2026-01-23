'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  React.useEffect(() => {
    const handleError = (error: Error) => {
      // In development, throw the error to trigger the Next.js overlay for rich debugging.
      if (process.env.NODE_ENV === 'development') {
        // We throw it in a timeout to break out of the current render cycle
        // and ensure Next.js catches it as a runtime error.
        setTimeout(() => {
            throw error;
        }, 0);
      } else {
        // In production, show a generic toast to the user.
        console.error("A Firestore permission error was caught:", error);
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off(handleError);
    };
  }, [toast]);

  return <>{children}</>;
}
