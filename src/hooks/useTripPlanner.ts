import { useState, useEffect } from 'react';
import { TripPlan, TripDetails, Attraction, CompletedItinerary } from '../types';
import * as tripService from '../services/tripService';

type Step = 'new' | 'planning' | 'final' | 'completed';
type PrefetchStatus = 'idle' | 'fetching' | 'done' | 'error';

export function useTripPlanner() {
  const [step, setStep] = useState<Step>('new');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedItinerary, setCompletedItinerary] = useState<CompletedItinerary | null>(null);
  const [prefetchStatus, setPrefetchStatus] = useState<PrefetchStatus>('idle');

  useEffect(() => {
    if (!tripPlan && ['planning', 'final', 'completed'].includes(step)) {
      console.warn('Invalid app state detected. Resetting to step=new.');
      setStep('new');
    }
  }, [step, tripPlan]);

  useEffect(() => {
    tripService.warmupServer();
  }, []);

  const handleNewTrip = async (details: TripDetails) => {
    console.log('🚀 Submitting trip details:', details);
    setLoading(true);
    setError(null);

    try {
      const formattedAttractions = await tripService.generateTrip(details);

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
    } catch (err) {
      console.error('Error generating trip:', err);
      setError('Failed to generate trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!tripPlan) return;
    setPrefetchStatus('fetching');
    setError(null);

    try {
      const data = await tripService.completeItinerary(tripPlan);
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
      wishlist: tripPlan.wishlist.filter((item) => item.name !== attraction.name),
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
      wishlist: tripPlan.wishlist.filter((item) => item.name !== attraction.name),
    });
  };

  const removeFromItinerary = (day: number, attractionName: string) => {
    if (!tripPlan) return;
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          attractions: dayPlan.attractions.filter((a) => a.name !== attractionName),
        };
      }
      return dayPlan;
    });

    setTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

  return {
    step,
    setStep,
    tripPlan,
    attractions,
    loading,
    error,
    completedItinerary,
    prefetchStatus,
    handleNewTrip,
    handleComplete,
    handleBack,
    addToWishlist,
    removeFromWishlist,
    addToItinerary,
    removeFromItinerary,
  };
} 