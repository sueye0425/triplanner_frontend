import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Share2,
  Printer,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { TripPlan } from '../types';
import { BackButton } from './BackButton';
import { LoadingState } from './LoadingState';
import { RestaurantCard } from './RestaurantCard';

interface FinalItineraryProps {
  tripPlan: TripPlan;
  onBack: () => void;
  onComplete: () => void;
  error?: string | null;
  prefetchStatus: 'idle' | 'fetching' | 'done' | 'error';
}

export function FinalItinerary({
  tripPlan,
  onBack,
  onComplete,
  error,
  prefetchStatus,
}: FinalItineraryProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Trip to ${tripPlan.details.destination}`,
        text: `Check out my ${tripPlan.details.travelDays}-day itinerary for ${tripPlan.details.destination}!`,
      });
    } catch (err) {
      console.log('Sharing not supported');
    }
  };

  const handleDownload = () => {
    const content =
      `Trip to ${tripPlan.details.destination}\n\n` +
      tripPlan.itinerary
        .map(
          (day) =>
            `Day ${day.day}:\n` +
            day.attractions.map((attr) => `- ${attr.name}`).join('\n')
        )
        .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripPlan.details.destination.toLowerCase()}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (prefetchStatus === 'fetching') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState variant="finalize" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div
          className="absolute inset-0 h-[400px] bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2946&q=80")',
          }}
        ></div>
        <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-black/60 to-black/20"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="flex justify-between items-center mb-8">
            <BackButton
              onClick={onBack}
              label="Back to Planning"
              variant="light"
            />
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="text-center text-white">
            <h1 className="font-display text-5xl font-bold mb-6">
              Your Trip to {tripPlan.details.destination}
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
                  {tripPlan.details.withKids &&
                    `With kids${
                      tripPlan.details.kidsAge
                        ? ` (${tripPlan.details.kidsAge} years)`
                        : ''
                    }`}
                  {tripPlan.details.withElders && ' • With elderly'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[100px]">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            {tripPlan.itinerary.map((day) => (
              <div
                key={day.day}
                className="border-b border-gray-200 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Day {day.day}
                </h2>
                {day.attractions.length > 0 ? (
                  <ul className="space-y-4">
                    {day.attractions.map((attraction, index) => (
                      <li key={attraction.name}>
                        {attraction.type === 'restaurant' ? (
                          <RestaurantCard
                            name={attraction.name}
                            description={attraction.description}
                            mealType={attraction.mealType}
                          />
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <span className="flex-none w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {attraction.name}
                              </div>
                              {attraction.description && (
                                <p className="text-sm text-gray-600">
                                  {attraction.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No attractions planned for this day
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={onComplete}
            disabled={prefetchStatus === 'error'}
            className={`
              w-full max-w-md px-8 py-4 text-lg font-semibold rounded-xl shadow-lg
              transition-all duration-200
              ${
                prefetchStatus === 'error'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }
            `}
          >
            <span className="flex items-center justify-center gap-3">
              {prefetchStatus === 'fetching' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enhancing your itinerary...</span>
                </>
              ) : prefetchStatus === 'error' ? (
                'Try Again'
              ) : (
                'Complete with Details'
              )}
            </span>
          </button>

          {prefetchStatus === 'fetching' && (
            <p className="text-sm text-gray-600">
              We're adding restaurant recommendations and optimizing your
              schedule...
            </p>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Generated with AI-Powered Trip Planner
        </div>
      </div>
    </div>
  );
}
