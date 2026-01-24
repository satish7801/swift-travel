"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-session';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        if (fallback) return <>{fallback}</>;

        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Lock className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Sign in required</h1>
                    <p className="text-muted-foreground">
                        Please sign in to access this feature and start planning your trips.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => signIn('google')}
                        className="bg-primary hover:bg-primary/90"
                    >
                        Sign in with Google
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// Hook for programmatic auth check
export function useRequireAuth(redirectTo?: string) {
    const { user, loading } = useUser();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user && redirectTo) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    return { user, loading, isAuthenticated: !!user };
}
