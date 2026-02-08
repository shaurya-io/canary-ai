import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateToken(length: number = 10): string {
  return nanoid(length);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Quirky thinking words - attempting Claude Code parity
export const THINKING_WORDS = [
  'Contemplating',
  'Pondering',
  'Ruminating',
  'Deliberating',
  'Cogitating',
  'Musing',
  'Discombobulating',
  'Percolating',
  'Synthesizing',
  'Calibrating',
  'Orchestrating',
  'Harmonizing',
  'Crystallizing',
  'Distilling',
  'Formulating',
  'Conjuring',
  'Weaving',
  'Assembling',
  'Sculpting',
  'Cultivating',
  'Brewing',
  'Simmering',
  'Marinating',
  'Fermenting',
  'Incubating',
  'Germinating',
  'Blossoming',
  'Unfurling',
  'Manifesting',
  'Transmuting',
  'Alchemizing',
  'Concocting',
  'Deciphering',
  'Unraveling',
  'Untangling',
  'Parsing',
  'Extrapolating',
  'Interpolating',
  'Triangulating',
  'Navigating',
  'Charting',
  'Mapping',
  'Surveying',
  'Exploring',
  'Investigating',
  'Researching',
  'Analyzing',
  'Examining',
  'Scrutinizing',
  'Inspecting',
];

export function getRandomThinkingWord(): string {
  return THINKING_WORDS[Math.floor(Math.random() * THINKING_WORDS.length)];
}
