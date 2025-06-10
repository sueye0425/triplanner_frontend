import React, { useState } from 'react';
import { Attraction, Restaurant } from '../types';
import { AttractionCard } from './AttractionCard';
import { RestaurantCard } from './RestaurantCard';
import { MapPin, Utensils } from 'lucide-react';

interface PlacesTabsProps {
  attractions: Attraction[];
  restaurants: Restaurant[];
  onAddAttractionToWishlist: (attraction: Attraction) => void;
  onAddAttractionToItinerary: (attraction: Attraction, day: number) => void;
  totalDays: number;
}

export function PlacesTabs({
  attractions,
  restaurants,
  onAddAttractionToWishlist,
  onAddAttractionToItinerary,
  totalDays,
}: PlacesTabsProps) {
  const [activeTab, setActiveTab] = useState<'attractions' | 'restaurants'>('attractions');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-orange-50/50 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('attractions')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
            ${activeTab === 'attractions'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-orange-600'
            }`}
        >
          <MapPin size={18} />
          <span>Landmarks</span>
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200
            ${activeTab === 'restaurants'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-orange-600'
            }`}
        >
          <Utensils size={18} />
          <span>Restaurants</span>
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'attractions' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {attractions.map((attraction) => (
              <AttractionCard
                key={attraction.place_id || attraction.name}
                attraction={attraction}
                onAddToWishlist={() => onAddAttractionToWishlist(attraction)}
                onAddToItinerary={(day) => onAddAttractionToItinerary(attraction, day)}
                totalDays={totalDays}
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.place_id || restaurant.name}
                {...restaurant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 