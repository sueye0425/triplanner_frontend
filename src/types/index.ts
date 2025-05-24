export interface ItineraryItem {
  type: 'landmark' | 'restaurant';
  name: string;
  description: string;
  mealtime: 'Breakfast' | 'Lunch' | 'Dinner' | null;
}

export interface CompletedItinerary {
  [key: `Day ${number}`]: ItineraryItem[];
} 