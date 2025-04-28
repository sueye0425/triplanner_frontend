import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  saveStep,
  getStep,
  saveTripPlan,
  getTripPlan,
  saveAttractions,
  getAttractions,
  saveCompletedItinerary,
  getCompletedItinerary,
  clearAllStorage,
  STORAGE_KEYS
} from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Step Storage', () => {
    it('saves and retrieves step correctly', () => {
      saveStep('planning');
      expect(getStep()).toBe('planning');
    });

    it('returns null for invalid step', () => {
      localStorage.setItem(STORAGE_KEYS.STEP, 'invalid');
      expect(getStep()).toBeNull();
    });
  });

  describe('Trip Plan Storage', () => {
    const mockTripPlan = {
      details: {
        destination: 'Paris',
        travelDays: 5,
        withKids: false,
        withElders: false
      },
      wishlist: [],
      itinerary: []
    };

    it('saves and retrieves trip plan correctly', () => {
      saveTripPlan(mockTripPlan);
      expect(getTripPlan()).toEqual(mockTripPlan);
    });

    it('handles null trip plan', () => {
      saveTripPlan(null);
      expect(getTripPlan()).toBeNull();
    });

    it('handles invalid JSON', () => {
      localStorage.setItem(STORAGE_KEYS.TRIP_PLAN, 'invalid json');
      expect(getTripPlan()).toBeNull();
    });
  });

  describe('Attractions Storage', () => {
    const mockAttractions = [
      {
        name: 'Eiffel Tower',
        description: 'Famous landmark',
        type: 'suggested' as const,
        badge: 'new' as const
      }
    ];

    it('saves and retrieves attractions correctly', () => {
      saveAttractions(mockAttractions);
      expect(getAttractions()).toEqual(mockAttractions);
    });

    it('handles empty attractions array', () => {
      saveAttractions([]);
      expect(getAttractions()).toEqual([]);
    });

    it('handles invalid JSON', () => {
      localStorage.setItem(STORAGE_KEYS.ATTRACTIONS, 'invalid json');
      expect(getAttractions()).toEqual([]);
    });
  });

  describe('Completed Itinerary Storage', () => {
    const mockCompletedItinerary = {
      'Day 1': [
        {
          type: 'landmark' as const,
          name: 'Eiffel Tower',
          description: 'Famous landmark',
          mealtime: null
        }
      ]
    };

    it('saves and retrieves completed itinerary correctly', () => {
      saveCompletedItinerary(mockCompletedItinerary);
      expect(getCompletedItinerary()).toEqual(mockCompletedItinerary);
    });

    it('handles null completed itinerary', () => {
      saveCompletedItinerary(null);
      expect(getCompletedItinerary()).toBeNull();
    });

    it('handles invalid JSON', () => {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_ITINERARY, 'invalid json');
      expect(getCompletedItinerary()).toBeNull();
    });
  });

  describe('Clear All Storage', () => {
    it('clears all storage keys', () => {
      saveStep('planning');
      saveTripPlan({ details: { destination: 'Paris', travelDays: 5, withKids: false, withElders: false }, wishlist: [], itinerary: [] });
      saveAttractions([{ name: 'Test', description: 'Test', type: 'suggested', badge: null }]);
      
      clearAllStorage();
      
      expect(getStep()).toBeNull();
      expect(getTripPlan()).toBeNull();
      expect(getAttractions()).toEqual([]);
      expect(getCompletedItinerary()).toBeNull();
    });
  });
});