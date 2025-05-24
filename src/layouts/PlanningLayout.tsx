import React from 'react';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { AttractionCard } from '../components/AttractionCard';
import { Wishlist } from '../components/Wishlist';
import { Itinerary } from '../components/Itinerary';
import { TripPlan, Attraction } from '../types';

interface PlanningLayoutProps {
  tripPlan: TripPlan;
  attractions: Attraction[];
  onBack: () => void;
  onAddToWishlist: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction, day: number) => void;
  onRemoveFromWishlist: (attraction: Attraction) => void;
  onRemoveFromItinerary: (day: number, attractionName: string) => void;
  onContinue: () => void;
}

export function PlanningLayout({
  tripPlan,
  attractions,
  onBack,
  onAddToWishlist,
  onAddToItinerary,
  onRemoveFromWishlist,
  onRemoveFromItinerary,
  onContinue,
}: PlanningLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="relative">
        <div
          className="absolute inset-0 h-[300px] bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
          }}
        ></div>
        <div className="absolute inset-0 h-[300px] bg-gradient-to-b from-amber-900/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="mb-8">
            <BackButton onClick={onBack} label="Back to Start" variant="light" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold mb-6 text-gray-900">
              Planning Your Trip to{' '}
              <span className="text-orange-600">{tripPlan.details.destination}</span>
            </h1>
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
                  Suggested Attractions
                </h2>
              </div>
              <div className="p-8 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {attractions.map((attraction) => (
                    <AttractionCard
                      key={attraction.name}
                      attraction={attraction}
                      onAddToWishlist={() => onAddToWishlist(attraction)}
                      onAddToItinerary={(day) => onAddToItinerary(attraction, day)}
                      totalDays={tripPlan.details.travelDays}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Wishlist
              wishlist={tripPlan.wishlist}
              onRemove={onRemoveFromWishlist}
              onAddToItinerary={onAddToItinerary}
              totalDays={tripPlan.details.travelDays}
            />
            <Itinerary
              itinerary={tripPlan.itinerary}
              onRemoveAttraction={onRemoveFromItinerary}
            />
            <div className="sticky top-6">
              <button
                onClick={onContinue}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-2xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Continue to Final Itinerary</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 