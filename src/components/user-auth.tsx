'use client';

import * as React from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';

import { useUser } from '@/hooks/use-session';
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

export default function UserAuth() {
  const { user, status } = useUser();

  const handleLogin = () => {
    signIn('google');
  };

  const handleLogout = () => {
    signOut();
  };

  if (status === 'loading') {
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
                {user.image && <AvatarImage src={user.image} alt={user.name || 'User'} />}
                <AvatarFallback>
                {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>
            <div className="truncate">
                <span className="font-semibold block truncate">{user.name}</span>
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
