import React from 'react';
import { MapPin, Calendar, Users, Utensils, MapPinned } from 'lucide-react';
import type { TripPlan, CompletedItinerary as CompletedItineraryData, CompletedAttractionItem } from '../types';
import { BackButton } from './BackButton';

interface CompletedItineraryProps {
  tripPlan: TripPlan;
  completedItinerary: CompletedItineraryData;
  onBack: () => void;
}

export function CompletedItinerary({ tripPlan, completedItinerary, onBack }: CompletedItineraryProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="absolute inset-0 h-[400px] bg-cover bg-center" style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
        }}></div>
        <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-black/60 to-black/20"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="mb-8">
            <BackButton 
              onClick={onBack} 
              label="Back to Final Itinerary"
              variant="light"
            />
          </div>

          <div className="text-center text-white">
            <h1 className="font-display text-5xl font-bold mb-6">
              Your Complete Guide to {tripPlan.details.destination}
            </h1>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary-300" size={20} />
                <span>{tripPlan.details.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary-300" size={20} />
                <span>{tripPlan.details.travelDays} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary-300" size={20} />
                <span>
                  {tripPlan.details.withKids && `With kids${tripPlan.details.kidsAge ? ` (${tripPlan.details.kidsAge} years)` : ''}`}
                  {tripPlan.details.withElders && ' • With elderly'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[100px]">
        <div className="space-y-12">
          {Object.entries(completedItinerary).map(([day, items]) => (
            <div key={day} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gray-900 px-8 py-4">
                <h2 className="text-2xl font-display font-bold text-white">
                  {day}
                </h2>
              </div>
              <div className="p-8 space-y-8">
                {items.map((item, index) => {
                  const isMeal = item.mealtime?.toLowerCase() === 'lunch' || item.mealtime?.toLowerCase() === 'dinner';

                  return (
                    <div 
                      key={`${item.name}-${index}`}
                      className={`flex gap-4 p-6 rounded-xl ${
                        isMeal 
                          ? 'bg-amber-50 border border-amber-100' 
                          : 'bg-primary-50 border border-primary-100'
                      }`}
                    >
                      <div className="flex-none">
                        {isMeal ? (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100">
                            <Utensils className="w-5 h-5 text-amber-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100">
                            <MapPinned className="w-5 h-5 text-primary-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {item.name}
                          </h3>
                          {item.mealtime && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 capitalize">
                              {item.mealtime}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isMeal ? 'text-amber-700' : 'text-primary-700'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Generated with AI-Powered Trip Planner
          </p>
        </div>
      </div>
    </div>
  );
}