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
  ArrowRight,
  Star,
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

  const isFetching = prefetchStatus === 'fetching';
  const isError = prefetchStatus === 'error';

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <LoadingState variant="finalize" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="relative">
        <div
          className="absolute inset-0 h-[400px] bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
          }}
        ></div>
        <div className="absolute inset-0 h-[400px] bg-gradient-to-b from-amber-900/30 to-transparent"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <BackButton
              onClick={onBack}
              label="Back to Planning"
              variant="light"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 rounded-full hover:bg-white transition-colors backdrop-blur-sm shadow-sm"
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 rounded-full hover:bg-white transition-colors backdrop-blur-sm shadow-sm"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-full hover:from-orange-700 hover:to-amber-700 transition-all shadow-sm"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-display text-5xl font-bold mb-6 text-gray-900">
              Your Trip to{' '}
              <span className="text-orange-600">{tripPlan.details.destination}</span>
            </h1>
            <div className="flex flex-wrap justify-center gap-6">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-[100px]">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="space-y-12">
            {tripPlan.itinerary.map((day) => (
              <div
                key={day.day}
                className="border-b border-orange-100 pb-12 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-orange-600">
                      {day.day}
                    </span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">
                    Day {day.day}
                  </h2>
                </div>
                {day.attractions.length > 0 ? (
                  <ul className="space-y-4">
                    {day.attractions.map((attraction, index) => (
                      <li key={attraction.name}>
                        <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                          <div className="flex-none w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {attraction.name}
                              {attraction.badge && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {attraction.badge === 'new' ? (
                                    'New'
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <Star
                                        size={12}
                                        className="fill-orange-500 text-orange-500"
                                      />
                                      Trending
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                            {attraction.description && (
                              <p className="mt-1 text-gray-600">
                                {attraction.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-center py-8">
                    No attractions planned for this day
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={onComplete}
            disabled={isError}
            className={`
              w-full max-w-md px-8 py-4 text-lg font-semibold rounded-2xl
              transition-all duration-200 flex items-center justify-center gap-3
              ${
                isError
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isFetching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enhancing your itinerary...</span>
              </>
            ) : isError ? (
              'Try Again'
            ) : (
              <>
                <span>Complete with Details</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {isFetching && (
            <p className="text-sm text-gray-600 text-center max-w-md">
              We're adding restaurant recommendations and optimizing your schedule
              to make your trip even more enjoyable...
            </p>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700">
            <Star size={16} className="fill-orange-500 text-orange-500" />
            <span className="font-medium">Generated with AI-Powered Trip Planner</span>
          </div>
        </div>
      </div>
    </div>
  );
}
