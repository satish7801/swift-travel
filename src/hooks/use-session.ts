'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export function useUser() {
    const { data: session, status } = useSession();

    const user = React.useMemo(() => {
        return session?.user
            ? {
                id: session.user.id ?? '',
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            }
            : null;
    }, [session?.user]);

    return {
        user,
        status: status === 'loading' ? 'loading' : status,
        loading: status === 'loading',
    };
}
