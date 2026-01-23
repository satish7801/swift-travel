"use client";

import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ChatView from './chat-view';
import type { Route } from '@/lib/types';

export default function ChatWidget({ results }: { results: Route[] | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          size="icon"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <MessageSquarePlus className="h-7 w-7" />
          <span className="sr-only">Open Travel Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Personal Travel Assistant</SheetTitle>
          <SheetDescription>
            Ask me anything about destinations, routes, or bookings!
          </SheetDescription>
        </SheetHeader>
        <ChatView results={results} />
      </SheetContent>
    </Sheet>
  );
}
