export interface Location {
  lat: number;
  lng: number;
}

export interface OpeningHoursPeriod {
  close: {
    day: number;
    time: string;
  };
  open: {
    day: number;
    time: string;
  };
}

export interface OpeningHours {
  open_now: boolean;
  periods: OpeningHoursPeriod[];
  weekday_text: string[];
}

export interface BasePlace {
  name: string;
  description: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  location: Location;
  photos?: string[];
}

export interface Restaurant extends BasePlace {
  opening_hours?: OpeningHours;
  price_level?: number;
  website?: string;
  phone?: string;
  wheelchair_accessible?: boolean;
}

export interface Attraction extends BasePlace {
  type: 'suggested' | 'additional';
  badge?: 'new' | 'trending' | null;
}

export interface TripDetails {
  destination: string;
  travelDays: number;
  startDate: string | null;  // YYYY-MM-DD format
  endDate: string | null;    // YYYY-MM-DD format
  withKids: boolean;
  withElders: boolean;
  kidsAge: number[];
  specialRequests?: string;  // Optional field
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

export interface GenerateResponse {
  landmarks: Record<string, Attraction>;
  restaurants: Record<string, Restaurant>;
}

export interface CompletedAttractionItem {
  type: 'landmark' | 'restaurant';
  name: string;
  description: string;
  mealtime: 'breakfast' | 'lunch' | 'dinner' | null;
}

export interface CompletedItineraryBlock {
  type: 'landmark' | 'restaurant';
  name: string;
  description: string;
  start_time: string;
  duration: string;
  mealtime: string | null;
  place_id: string;
  rating: number;
  location: {
    lat: number;
    lng: number;
  } | null;
  address: string;
  photo_url: string | null;
  notes: string;
}

export interface CompletedItineraryDay {
  day: number;
  blocks: CompletedItineraryBlock[];
}

export interface CompletedItinerary {
  itinerary: CompletedItineraryDay[];
}