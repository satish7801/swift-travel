import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a duration string (e.g., "2h 15m", "3h", "45m") into total minutes.
 * @param durationStr The duration string.
 * @returns The total duration in minutes.
 */
export function parseDuration(durationStr: string): number {
  if (!durationStr) return Infinity;

  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/);
  const minutesMatch = durationStr.match(/(\d+)\s*m/);

  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1]) * 60;
  }
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1]);
  }

  return totalMinutes;
}

export function generateId(length: number = 7): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
