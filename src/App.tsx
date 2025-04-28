import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { NewTripForm } from './components/NewTripForm';
import { AttractionCard } from './components/AttractionCard';
import { Wishlist } from './components/Wishlist';
import { Itinerary } from './components/Itinerary';
import { FinalItinerary } from './components/FinalItinerary';
import { CompletedItinerary } from './components/CompletedItinerary';
import { LoadingState } from './components/LoadingState';
import { BackButton } from './components/BackButton';
import {
  TripPlan,
  TripDetails,
  Attraction,
  CompletedItinerary as CompletedItineraryData,
} from './types';
import { getCacheKey, getFromCache, setInCache } from './utils/cache';

const API_URL = 'https://plan-your-trip-wcaj.onrender.com';
const API_TIMEOUT = 30000;

interface AttractionInfo {
  description: string;
  badge: 'new' | 'trending' | null;
}

function App() {
  const [step, setStep] = useState<'new' | 'planning' | 'final' | 'completed'>(
    'new'
  );
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedItinerary, setCompletedItinerary] =
    useState<CompletedItineraryData | null>(null);
  const [prefetchStatus, setPrefetchStatus] = useState<
    'idle' | 'fetching' | 'done' | 'error'
  >('idle');

  useEffect(() => {
    if (!tripPlan && ['planning', 'final', 'completed'].includes(step)) {
      console.warn('Invalid app state detected. Resetting to step=new.');
      setStep('new');
    }
  }, [step, tripPlan]);

  useEffect(() => {
    const warmup = async () => {
      try {
        const start = performance.now();
        const res = await fetch(`${API_URL}/`);
        const data = await res.json();
        const end = performance.now();
        console.log('🔥 Server warm-up success:', data.message);
        console.log(`⏱️ Warm-up latency: ${(end - start).toFixed(2)} ms`);
      } catch (err) {
        console.warn('⚠️ Warm-up request failed:', err);
      }
    };
    warmup();
  }, []);

  const handleNewTrip = async (details: TripDetails) => {
    console.log('🚀 Submitting trip details:', details);
    setLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey(details);
      const cachedData = getFromCache(cacheKey);

      let formattedAttractions: Attraction[];

      if (cachedData) {
        formattedAttractions = cachedData.attractions;
      } else {
        const payload = {
          destination: details.destination,
          travel_days: details.travelDays,
          with_kids: details.withKids,
          kids_age: details.withKids ? details.kidsAge : null,
          with_elderly: details.withElders,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(`${API_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.itinerary?.Suggested_Things_to_Do) {
          throw new Error('Invalid API response');
        }

        formattedAttractions = Object.entries(
          data.itinerary.Suggested_Things_to_Do
        ).map(([name, info]: [string, AttractionInfo]) => ({
          name,
          description: info.description,
          type: 'suggested' as const,
          badge: info.badge,
        }));

        setInCache(cacheKey, { attractions: formattedAttractions });
      }

      const newTripPlan: TripPlan = {
        details,
        wishlist: [],
        itinerary: Array.from({ length: details.travelDays }, (_, i) => ({
          day: i + 1,
          attractions: [],
        })),
      };

      setTripPlan(newTripPlan);
      setAttractions(formattedAttractions);
      setStep('planning');
      setLoading(false);
    } catch (err) {
      console.error('Error generating trip:', err);
      setError('Failed to generate trip. Please try again.');
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!tripPlan) return;
    setPrefetchStatus('fetching');
    setError(null);

    try {
      const selected_landmarks = tripPlan.itinerary.reduce((acc, day) => {
        acc[`Day ${day.day}`] = day.attractions.map((attr) => attr.name);
        return acc;
      }, {} as Record<string, string[]>);

      const payload = {
        destination: tripPlan.details.destination,
        travel_days: tripPlan.details.travelDays,
        with_kids: tripPlan.details.withKids,
        with_elderly: tripPlan.details.withElders,
        selected_landmarks,
      };

      const response = await fetch(`${API_URL}/complete-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setCompletedItinerary(data);
      setPrefetchStatus('done');
      setStep('completed');
    } catch (err) {
      console.error('Error completing itinerary:', err);
      setPrefetchStatus('error');
      setError('Failed to complete itinerary. Please try again.');
    }
  };

  const handleBack = () => {
    setError(null);
    switch (step) {
      case 'planning':
        setStep('new');
        setTripPlan(null);
        setAttractions([]);
        setCompletedItinerary(null);
        setPrefetchStatus('idle');
        break;
      case 'final':
        setStep('planning');
        setCompletedItinerary(null);
        setPrefetchStatus('idle');
        break;
      case 'completed':
        setStep('final');
        break;
    }
  };

  const addToWishlist = (attraction: Attraction) => {
    if (!tripPlan) return;
    setTripPlan({
      ...tripPlan,
      wishlist: [...tripPlan.wishlist, attraction],
    });
  };

  const removeFromWishlist = (attraction: Attraction) => {
    if (!tripPlan) return;
    setTripPlan({
      ...tripPlan,
      wishlist: tripPlan.wishlist.filter(
        (item) => item.name !== attraction.name
      ),
    });
  };

  const addToItinerary = (attraction: Attraction, day: number) => {
    if (!tripPlan) return;
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          attractions: [...dayPlan.attractions, attraction],
        };
      }
      return dayPlan;
    });

    setTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
      wishlist: tripPlan.wishlist.filter(
        (item) => item.name !== attraction.name
      ),
    });
  };

  const removeFromItinerary = (day: number, attractionName: string) => {
    if (!tripPlan) return;
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          attractions: dayPlan.attractions.filter(
            (a) => a.name !== attractionName
          ),
        };
      }
      return dayPlan;
    });

    setTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

  if (step === 'completed' && completedItinerary) {
    return (
      <CompletedItinerary
        tripPlan={tripPlan}
        completedItinerary={completedItinerary}
        onBack={handleBack}
      />
    );
  }

  if (step === 'final') {
    return (
      <FinalItinerary
        tripPlan={tripPlan!}
        onBack={handleBack}
        onComplete={handleComplete}
        error={error}
        prefetchStatus={prefetchStatus}
      />
    );
  }

  if (step === 'planning' && tripPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <div
            className="absolute inset-0 h-[300px] bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2944&q=80")',
            }}
          ></div>
          <div className="absolute inset-0 h-[300px] bg-black/50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
            <div className="mb-8">
              <BackButton
                onClick={handleBack}
                label="Back to Start"
                variant="light"
              />
            </div>
            <div className="text-center text-white">
              <h1 className="font-display text-4xl font-bold mb-6">
                Planning Your Trip to {tripPlan.details.destination}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Suggested Attractions
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {attractions.map((attraction) => (
                    <AttractionCard
                      key={attraction.name}
                      attraction={attraction}
                      onAddToWishlist={() => addToWishlist(attraction)}
                      onAddToItinerary={(day) =>
                        addToItinerary(attraction, day)
                      }
                      totalDays={tripPlan.details.travelDays}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Wishlist
                wishlist={tripPlan.wishlist}
                onRemove={removeFromWishlist}
                onAddToItinerary={addToItinerary}
                totalDays={tripPlan.details.travelDays}
              />
              <Itinerary
                itinerary={tripPlan.itinerary}
                onRemoveAttraction={removeFromItinerary}
              />
              <div className="sticky top-6">
                <button
                  onClick={() => setStep('final')}
                  className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Continue to Final Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2946&q=80")',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
                  Your Dream Vacation Starts Here
                </h1>
                <p className="text-xl text-gray-200">
                  Let us help you plan the perfect trip. Tell us where you want
                  to go, and we'll create a personalized itinerary just for you.
                </p>
              </div>
              <div>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                  {loading || error ? (
                    <LoadingState error={error} variant="initial" />
                  ) : (
                    <NewTripForm onSubmit={handleNewTrip} disabled={loading} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
