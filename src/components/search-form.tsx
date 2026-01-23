"use client";

import * as React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { ArrowRightLeft, Calendar as CalendarIcon, Loader2, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SearchFilters } from '@/lib/schemas';

interface SearchFormProps {
  form: UseFormReturn<SearchFilters>;
  onSearch: (filters: SearchFilters) => void;
  isSearching: boolean;
}

export default function SearchForm({ form, onSearch, isSearching }: SearchFormProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 md:items-end">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="From" className="pl-10 h-12 text-base" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-1 flex items-center justify-center">
                <Button variant="ghost" size="icon" type="button" className="hidden md:flex" onClick={() => {
                    const from = form.getValues("from");
                    const to = form.getValues("to");
                    form.setValue("from", to);
                    form.setValue("to", from);
                }}>
                    <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="To" className="pl-10 h-12 text-base" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col md:col-span-3 lg:col-span-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal h-12 text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto h-12 text-base md:col-span-12 lg:col-span-1" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
               <span className="md:hidden ml-2">Search</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
