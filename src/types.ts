export interface TripDetails {
  destination: string;
  travelDays: number;
  withKids: boolean;
  kidsAge?: number;
  withElders: boolean;
}

export interface Attraction {
  name: string;
  description: string;
  type: 'suggested' | 'additional';
  badge?: 'new' | 'trending' | null;
}

export interface DayPlan {
  day: number;
  attractions: Attraction[];
}

export interface TripPlan {
  details: TripDetails;
  wishlist: Attraction[];
  itinerary: DayPlan[];
}

export interface CompletedAttractionItem {
  type: 'landmark' | 'restaurant';
  name: string;
  description: string;
  mealtime: 'breakfast' | 'lunch' | 'dinner' | null;
}

export interface CompletedItinerary {
  [key: string]: CompletedAttractionItem[];
}