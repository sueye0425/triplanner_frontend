import { TripDetails } from '../types';

interface CacheEntry {
  timestamp: number;
  data: any;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const cache = new Map<string, CacheEntry>();

export function getCacheKey(details: TripDetails): string {
  return `${details.destination}-${details.travelDays}-${details.withKids}-${details.kidsAge}-${details.withElders}`;
}

export function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

export function setInCache(key: string, data: any): void {
  cache.set(key, {
    timestamp: Date.now(),
    data
  });
}