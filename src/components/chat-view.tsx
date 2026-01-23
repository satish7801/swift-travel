"use client";

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { AlertCircle, Bot, Send, User } from 'lucide-react';
import { askChatbot, type ChatState } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Route } from '@/lib/types';

const initialState: ChatState = {
  messages: [
    {
      role: 'assistant',
      content: 'Hello! How can I help you plan your travel today?',
      id: 1,
      suggestedReplies: [
        "Plan a trip to Goa",
        "Find flights from Delhi to Mumbai",
      ]
    }
  ],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      <Send className="h-4 w-4" />
      <span className="sr-only">Send</span>
    </Button>
  );
}

export default function ChatView({ results }: { results: Route[] | null }) {
  const [state, formAction] = useFormState(askChatbot, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.role === 'error') {
      toast({
        variant: "destructive",
        title: "Error",
        description: lastMessage.content,
      });
    }
  }, [state.messages, toast]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [state.messages]);

  const handleSuggestionClick = (suggestion: string) => {
    if (textAreaRef.current && formRef.current) {
        textAreaRef.current.value = suggestion;
        formRef.current.requestSubmit();
    }
  };


  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 -mx-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {state.messages.map((message) => (
            <div key={message.id}>
              <div
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
                 {message.role === 'error' && (
                  <Avatar className="h-8 w-8 bg-destructive text-destructive-foreground">
                    <AvatarFallback><AlertCircle className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    'max-w-[75%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted',
                    message.role === 'error' && 'bg-destructive text-destructive-foreground'
                  )}
                >
                  {message.content}
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>

              {message.role === 'assistant' && message.suggestedReplies && message.suggestedReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pl-11">
                  {message.suggestedReplies.map((reply, index) => (
                    <Button key={index} size="sm" variant="outline" onClick={() => handleSuggestionClick(reply)}>
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="py-4 border-t">
        <form
          ref={formRef}
          action={(formData) => {
            formAction(formData);
            formRef.current?.reset();
          }}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="searchContext" value={results ? JSON.stringify(results) : ''} />
          <Textarea
            ref={textAreaRef}
            name="query"
            placeholder="Ask about a destination..."
            className="min-h-0"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
