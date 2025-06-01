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

export interface ItineraryItem {
  type: 'landmark' | 'restaurant';
  name: string;
  description: string;
  mealtime: 'Breakfast' | 'Lunch' | 'Dinner' | null;
}

export interface CompletedItinerary {
  [key: `Day ${number}`]: ItineraryItem[];
} 