import { TripPlan, Attraction, CompletedItinerary } from '../types';

export const STORAGE_KEYS = {
  STEP: 'trip_planner_step',
  TRIP_PLAN: 'trip_planner_trip_plan',
  ATTRACTIONS: 'trip_planner_attractions',
  COMPLETED_ITINERARY: 'trip_planner_completed_itinerary'
} as const;

type Step = 'new' | 'planning' | 'final' | 'completed';

export function saveStep(step: Step): void {
  localStorage.setItem(STORAGE_KEYS.STEP, step);
}

export function getStep(): Step | null {
  const step = localStorage.getItem(STORAGE_KEYS.STEP) as Step;
  if (step && ['new', 'planning', 'final', 'completed'].includes(step)) {
    return step;
  }
  return null;
}

export function saveTripPlan(tripPlan: TripPlan | null): void {
  if (tripPlan) {
    localStorage.setItem(STORAGE_KEYS.TRIP_PLAN, JSON.stringify(tripPlan));
  } else {
    localStorage.removeItem(STORAGE_KEYS.TRIP_PLAN);
  }
}

export function getTripPlan(): TripPlan | null {
  const saved = localStorage.getItem(STORAGE_KEYS.TRIP_PLAN);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved trip plan:', e);
      return null;
    }
  }
  return null;
}

export function saveAttractions(attractions: Attraction[]): void {
  if (attractions.length > 0) {
    localStorage.setItem(STORAGE_KEYS.ATTRACTIONS, JSON.stringify(attractions));
  } else {
    localStorage.removeItem(STORAGE_KEYS.ATTRACTIONS);
  }
}

export function getAttractions(): Attraction[] {
  const saved = localStorage.getItem(STORAGE_KEYS.ATTRACTIONS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved attractions:', e);
      return [];
    }
  }
  return [];
}

export function saveCompletedItinerary(itinerary: CompletedItinerary | null): void {
  if (itinerary) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_ITINERARY, JSON.stringify(itinerary));
  } else {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_ITINERARY);
  }
}

export function getCompletedItinerary(): CompletedItinerary | null {
  const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_ITINERARY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved completed itinerary:', e);
      return null;
    }
  }
  return null;
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}