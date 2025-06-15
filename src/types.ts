export interface Location {
  lat: number;
  lng: number;
}



export interface BasePlace {
  name: string;
  description: string;
  address?: string;
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  location: Location;
  photos?: string[];
  website?: string;
}

export interface Restaurant extends BasePlace {
  price_level?: number;
  website?: string;
  wheelchair_accessible?: boolean;
  cuisine?: string;
  kid_friendly?: boolean;
  photo_url?: string;
}

export interface Attraction extends BasePlace {
  type: 'suggested' | 'additional' | 'landmark';
  badge?: 'new' | 'trending' | null;
  estimated_duration?: string;
  kid_friendly?: boolean;
  photo_url?: string;
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
  recommendations: {
    landmarks: Attraction[];
    restaurants: Restaurant[];
  };
  performance_metrics?: {
    response_time: number;
    api_calls_used: number;
    estimated_cost: string;
  };
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
  description: string | null; // Can be null for restaurants (optimization)
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
  notes?: string;
  website?: string;
}

export interface CompletedItineraryDay {
  day: number;
  blocks: CompletedItineraryBlock[];
}

export interface CompletedItinerary {
  itinerary: CompletedItineraryDay[];
  performance_metrics?: {
    timings: {
      llm_generation: number;
      restaurant_addition: number;
      landmark_enhancement: number;
      duplicate_removal: number;
      total_response_time: number;
    };
    api_usage: {
      google_places: {
        geocoding_calls: number;
        nearby_search_calls: number;
        place_details_calls: number;
        total_calls: number;
        estimated_cost: string;
      };
      openai: {
        llm_calls: number;
        tokens_used: number;
        estimated_cost: string;
      };
      total_estimated_cost: string;
    };
    optimizations: Record<string, string>;
  };
}