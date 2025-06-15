import React, { useState } from 'react';
import { Attraction, Restaurant } from '../types';
import { AttractionCard } from './AttractionCard';
import { RestaurantCard } from './RestaurantCard';
import { MapPin, Utensils } from 'lucide-react';

interface PlacesTabsProps {
  attractions: Attraction[];
  restaurants: Restaurant[];
}

export function PlacesTabs({
  attractions,
  restaurants,
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
          <div className="space-y-6">
            {/* Drag & Drop Tutorial */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-800">How to Build Your Itinerary</h3>
              </div>
              <p className="text-blue-700 mb-3 leading-relaxed">
                Simply <strong>drag and drop</strong> any landmark or restaurant card to your wishlist or directly into your itinerary on the right sidebar.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <span className="bg-blue-100 px-2 py-1 rounded-full">🖱️ Drag</span>
                <span>→</span>
                <span className="bg-blue-100 px-2 py-1 rounded-full">📋 Wishlist</span>
                <span>or</span>
                <span className="bg-blue-100 px-2 py-1 rounded-full">📅 Itinerary</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {attractions.map((attraction) => (
                <AttractionCard
                  key={attraction.place_id || attraction.name}
                  {...attraction}
                />
              ))}
            </div>
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