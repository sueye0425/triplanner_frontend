import React from 'react';
import { TripPlan, Attraction, Restaurant } from '../types';
import { BackButton } from '../components/BackButton';
import { Wishlist } from '../components/Wishlist';
import { Itinerary } from '../components/Itinerary';
import { PlacesTabs } from '../components/PlacesTabs';
import { UserNav } from '../components/UserNav';
import { MapPin, Calendar, Users } from 'lucide-react';

interface PlanningLayoutProps {
  tripPlan: TripPlan;
  attractions: Attraction[];
  restaurants: Restaurant[];
  onBack: () => void;
  onAddToWishlist: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction, day: number) => void;
  onRemoveFromWishlist: (attraction: Attraction) => void;
  onRemoveFromItinerary: (day: number, attractionIndex: number) => void;
  onMoveAttractionBetweenDays: (fromDay: number, fromIndex: number, toDay: number) => void;
  onReorderAttractionInDay: (day: number, fromIndex: number, toIndex: number) => void;
  onContinue: () => void;
}

export function PlanningLayout({
  tripPlan,
  attractions,
  restaurants,
  onBack,
  onAddToWishlist,
  onAddToItinerary,
  onRemoveFromWishlist,
  onRemoveFromItinerary,
  onMoveAttractionBetweenDays,
  onReorderAttractionInDay,
  onContinue,
}: PlanningLayoutProps) {
  const handleDropToWishlist = (dragData: any) => {
    if (dragData.type === 'attraction') {
      onAddToWishlist(dragData.data);
    } else if (dragData.type === 'restaurant') {
      // Convert restaurant to attraction-like format for wishlist
      const restaurantAsAttraction = {
        ...dragData.data,
        type: 'additional' as const,
        badge: null,
        place_id: dragData.data.place_id || '',
        location: dragData.data.location || { lat: 0, lng: 0 }
      };
      onAddToWishlist(restaurantAsAttraction);
    } else if (dragData.type === 'itinerary-item') {
      // Handle itinerary items being dragged back to wishlist
      const { fromDay, fromIndex, attraction } = dragData.data;
      
      // Add to wishlist
      onAddToWishlist(attraction);
      
      // Remove from itinerary
      onRemoveFromItinerary(fromDay, fromIndex);
    }
  };

  const handleDropToItinerary = (dragData: any, day: number) => {
    if (dragData.type === 'attraction') {
      onAddToItinerary(dragData.data, day);
    } else if (dragData.type === 'restaurant') {
      // Convert restaurant to attraction-like format for itinerary
      const restaurantAsAttraction = {
        ...dragData.data,
        type: 'additional' as const,
        badge: null,
        place_id: dragData.data.place_id || '',
        location: dragData.data.location || { lat: 0, lng: 0 }
      };
      onAddToItinerary(restaurantAsAttraction, day);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-200 to-amber-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="relative">
        {/* User Navigation */}
        <div className="absolute top-4 right-4 z-30">
          <UserNav />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <BackButton onClick={onBack} label="Back to Start" />
          <div className="text-center">
            {/* Step 2 Header Box */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-orange-200/40 shadow-xl shadow-orange-100/30 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <span className="text-2xl font-semibold text-orange-600">Step 2</span>
              </div>
              
              <h1 className="font-display text-4xl font-bold mb-4 text-gray-900">
                Choose Your Places
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select the landmarks and restaurants you're interested to visit from our recommendations
              </p>
            </div>
            
            {/* Trip Info */}
            <div className="text-lg text-gray-600 mb-8">
              Exploring <span className="text-orange-600 font-semibold">{tripPlan.details.destination}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <MapPin className="text-orange-600" size={20} />
                <span className="text-gray-700">{tripPlan.details.destination}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Calendar className="text-orange-600" size={20} />
                <span className="text-gray-700">{tripPlan.details.travelDays} days</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Users className="text-orange-600" size={20} />
                <span className="text-gray-700">
                  {tripPlan.details.withKids &&
                    `With kids${
                      tripPlan.details.kidsAge && tripPlan.details.kidsAge.length > 0
                        ? ` (ages: ${tripPlan.details.kidsAge.join(', ')})`
                        : ''
                    }`}
                  {tripPlan.details.withElders && ' • With elderly'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-8 pb-6 border-b border-orange-100/30">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Places to Visit
                </h2>
              </div>
              <div className="p-8 pt-6">
                <PlacesTabs
                  attractions={attractions}
                  restaurants={restaurants}
                />
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start space-y-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
              <Wishlist
                wishlist={tripPlan.wishlist}
                onRemove={onRemoveFromWishlist}
                onAddToItinerary={onAddToItinerary}
                onDropAttraction={handleDropToWishlist}
                totalDays={tripPlan.details.travelDays}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
              <Itinerary
                itinerary={tripPlan.itinerary}
                tripDetails={tripPlan.details}
                onRemoveAttraction={onRemoveFromItinerary}
                onDropAttraction={handleDropToItinerary}
                onMoveAttractionBetweenDays={onMoveAttractionBetweenDays}
                onReorderAttractionInDay={onReorderAttractionInDay}
              />
            </div>
          </div>
        </div>
        
        {/* Floating Generate Button - Always visible */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={onContinue}
            className="px-8 py-4 text-lg font-bold text-white 
              bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl
              hover:from-orange-700 hover:to-amber-700 
              shadow-xl hover:shadow-2xl shadow-orange-600/20 hover:shadow-orange-600/30
              transform hover:-translate-y-1 transition-all duration-200
              flex items-center gap-3 group
              border border-orange-300/50 backdrop-blur-lg"
          >
            <span>Generate Itinerary</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 