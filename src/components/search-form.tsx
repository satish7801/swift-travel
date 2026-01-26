"use client";

import * as React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { ArrowRightLeft, Calendar as CalendarIcon, Loader2, Search, Plane, Train, Bus, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import type { SearchFilters } from '@/lib/schemas';

import type { City } from '@/lib/data/cities';

interface SearchFormProps {
  form: UseFormReturn<SearchFilters>;
  onSearch: (filters: SearchFilters) => void;
  isSearching: boolean;
  onModeChange?: (mode: TransportMode) => void;
  onCitySelect?: (city: City) => void;
  selectedMode?: TransportMode;
}

type TransportMode = 'all' | 'flight' | 'train' | 'bus' | 'car';

export default function SearchForm({ form, onSearch, isSearching, onModeChange, onCitySelect, selectedMode: externalMode }: SearchFormProps) {
  const [internalMode, setInternalMode] = React.useState<TransportMode>('all');
  const selectedMode = externalMode ?? internalMode;

  const handleModeChange = (mode: TransportMode) => {
    setInternalMode(mode);
    onModeChange?.(mode);
  };

  const modes = [
    { id: 'all', label: 'All', icon: null, color: 'bg-gradient-to-r from-primary to-accent' },
    { id: 'flight', label: 'Flights', icon: Plane, color: 'bg-blue-500' },
    { id: 'train', label: 'Trains', icon: Train, color: 'bg-orange-500' },
    { id: 'bus', label: 'Buses', icon: Bus, color: 'bg-emerald-500' },
    { id: 'car', label: 'Personal Vehicle', icon: Car, color: 'bg-indigo-500' },
  ] as const;

  return (
    <div className="glass rounded-3xl p-2 md:p-3 shadow-2xl max-w-4xl mx-auto backdrop-blur-2xl">
      {/* Transport Mode Tabs */}
      <div className="flex gap-1 md:gap-2 mb-4 p-1 bg-white/5 rounded-2xl">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => handleModeChange(mode.id)}
            className={cn(
              "flex-1 py-2.5 px-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2",
              selectedMode === mode.id
                ? `${mode.color} text-white shadow-lg`
                : "text-foreground/60 hover:text-foreground hover:bg-white/10"
            )}
          >
            {mode.icon && <mode.icon className="h-4 w-4" />}
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSearch)} className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3 p-3">
          {/* From */}
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
                  <FormControl>
                    <LocationAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      onCitySelect={onCitySelect}
                      placeholder="Where from?"
                      className="pl-8 h-14 input-glass bg-white/5 border-white/10 text-foreground placeholder:text-foreground/40 rounded-xl focus:bg-white/10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Swap Button */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="hidden md:flex h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0"
            onClick={() => {
              const from = form.getValues("from");
              const to = form.getValues("to");
              form.setValue("from", to);
              form.setValue("to", from);
            }}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          {/* To */}
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-400" />
                  <FormControl>
                    <LocationAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      onCitySelect={onCitySelect}
                      placeholder="Where to?"
                      className="pl-8 h-14 input-glass bg-white/5 border-white/10 text-foreground placeholder:text-foreground/40 rounded-xl focus:bg-white/10"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="md:w-44 shrink-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal input-glass bg-white/5 border border-white/10 text-foreground rounded-xl hover:bg-white/10",
                          !field.value && "text-foreground/40"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "dd MMM") : "When?"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto h-14 px-8 bg-gradient-to-r from-accent to-orange-600 hover:from-accent/90 hover:to-orange-600/90 text-white font-semibold rounded-xl shadow-lg shadow-accent/30 shrink-0"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                <span>Search</span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
