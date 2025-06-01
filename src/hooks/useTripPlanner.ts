import { useState, useEffect } from 'react';
import { TripPlan, TripDetails, Attraction, CompletedItinerary, Restaurant } from '../types';
import * as tripService from '../services/tripService';

type Step = 'new' | 'planning' | 'final' | 'completed';
type PrefetchStatus = 'idle' | 'fetching' | 'done' | 'error';

export function useTripPlanner() {
  const [step, setStep] = useState<Step>('new');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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
      const { attractions: formattedAttractions, restaurants: formattedRestaurants } = 
        await tripService.generateTrip(details);

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
      setRestaurants(formattedRestaurants);
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
    
    // Immediately transition to completed view with loading state
    setStep('completed');
    setCompletedItinerary(null); // This will trigger skeleton loading
    setPrefetchStatus('fetching');
    setError(null);

    try {
      const data = await tripService.completeItinerary(tripPlan);
      setCompletedItinerary(data);
      setPrefetchStatus('done');
    } catch (err) {
      console.error('Error completing itinerary:', err);
      setPrefetchStatus('error');
      setError('Failed to complete itinerary. Please try again.');
      // Stay on completed view but show error state
    }
  };

  const handleBack = () => {
    setError(null);
    switch (step) {
      case 'planning':
        setStep('new');
        setTripPlan(null);
        setAttractions([]);
        setRestaurants([]);
        setCompletedItinerary(null);
        setPrefetchStatus('idle');
        break;
      case 'completed':
        setStep('planning');
        setCompletedItinerary(null);
        setPrefetchStatus('idle');
        break;
    }
  };

  const addToWishlist = (attraction: Attraction) => {
    if (!tripPlan) return;
    
    // Add a unique timestamp to handle duplicates
    const attractionWithId = {
      ...attraction,
      _wishlistId: Date.now() + Math.random()
    };
    
    setTripPlan({
      ...tripPlan,
      wishlist: [...tripPlan.wishlist, attractionWithId],
    });
  };

  const removeFromWishlist = (attraction: Attraction) => {
    if (!tripPlan) return;
    
    // Use the unique _wishlistId if available, otherwise fall back to name
    const attractionToRemove = attraction as Attraction & { _wishlistId?: number };
    
    setTripPlan({
      ...tripPlan,
      wishlist: tripPlan.wishlist.filter((item) => {
        const itemWithId = item as Attraction & { _wishlistId?: number };
        if (attractionToRemove._wishlistId && itemWithId._wishlistId) {
          return itemWithId._wishlistId !== attractionToRemove._wishlistId;
        }
        return item.name !== attraction.name;
      }),
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

  const removeFromItinerary = (day: number, attractionIndex: number) => {
    if (!tripPlan) return;
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === day) {
        return {
          ...dayPlan,
          attractions: dayPlan.attractions.filter((_, index) => index !== attractionIndex),
        };
      }
      return dayPlan;
    });

    setTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

  const moveAttractionBetweenDays = (fromDay: number, fromIndex: number, toDay: number) => {
    if (!tripPlan) return;
    
    // Get the attraction to move
    const fromDayPlan = tripPlan.itinerary.find(day => day.day === fromDay);
    if (!fromDayPlan || !fromDayPlan.attractions[fromIndex]) return;
    
    const attractionToMove = fromDayPlan.attractions[fromIndex];
    
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === fromDay) {
        // Remove from source day
        return {
          ...dayPlan,
          attractions: dayPlan.attractions.filter((_, index) => index !== fromIndex),
        };
      } else if (dayPlan.day === toDay) {
        // Add to target day
        return {
          ...dayPlan,
          attractions: [...dayPlan.attractions, attractionToMove],
        };
      }
      return dayPlan;
    });

    setTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

  const reorderAttractionInDay = (day: number, fromIndex: number, toIndex: number) => {
    if (!tripPlan) return;
    
    const newItinerary = tripPlan.itinerary.map((dayPlan) => {
      if (dayPlan.day === day) {
        const newAttractions = [...dayPlan.attractions];
        const [movedAttraction] = newAttractions.splice(fromIndex, 1);
        newAttractions.splice(toIndex, 0, movedAttraction);
        
        return {
          ...dayPlan,
          attractions: newAttractions,
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
    restaurants,
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
    moveAttractionBetweenDays,
    reorderAttractionInDay,
  };
} 