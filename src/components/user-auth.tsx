'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LogIn, LogOut, User } from 'lucide-react';

import { useAuth, useUser, useFirestore } from '@/firebase';
import { upsertUserProfile } from '@/firebase/firestore/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { SidebarMenuButton } from './ui/sidebar';
import { useToast } from '@/hooks/use-toast';

export default function UserAuth() {
  const { user, status } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (status === 'authenticated' && user && firestore) {
      upsertUserProfile(firestore, user).catch(err => {
        console.error("Failed to sync user profile:", err);
      });
    }
  }, [status, user, firestore]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication failed", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not sign in with Google. Please try again."
      })
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  if (status === 'loading' || status === 'loading-uninitialized') {
    return (
      <div className="p-2">
        <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="p-2">
        <SidebarMenuButton onClick={handleLogin}>
          <LogIn />
          <span>Login</span>
        </SidebarMenuButton>
      </div>
    );
  }

  return (
    <div className="p-2">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start items-center gap-2 p-2 h-auto text-left">
            <Avatar className="h-8 w-8">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                <AvatarFallback>
                {user.displayName ? user.displayName[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>
            <div className="truncate">
                <span className="font-semibold block truncate">{user.displayName}</span>
            </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" side="top">
            <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
