import { TripDetails, Attraction, CompletedItinerary, GenerateResponse, Restaurant } from '../types';
import { getCacheKey, getFromCache, setInCache } from '../utils/cache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 30000;

interface AttractionInfo {
  description: string;
  badge: 'new' | 'trending' | null;
}

interface GenerateResult {
  attractions: Attraction[];
  restaurants: Restaurant[];
}

export const warmupServer = async () => {
  try {
    const start = performance.now();
    const res = await fetch(`${API_URL}/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    const end = performance.now();
    console.log('🔥 Server warm-up success:', data.message);
    console.log(`⏱️ Warm-up latency: ${(end - start).toFixed(2)} ms`);
  } catch (err) {
    console.warn('⚠️ Warm-up request failed:', err);
  }
};

export const generateTrip = async (details: TripDetails): Promise<GenerateResult> => {
  console.log('📥 Input details:', JSON.stringify(details, null, 2));
  
  const cacheKey = getCacheKey(details);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  // Format payload to match the working curl request
  const payload = {
    destination: details.destination,
    travel_days: details.travelDays,
    with_kids: details.withKids,
    kids_age: details.withKids && details.kidsAge && details.kidsAge.length > 0 
      ? details.kidsAge  // Always send as array
      : null,
    with_elderly: details.withElders,
    start_date: details.startDate,
    end_date: details.endDate,
    special_requests: details.specialRequests
  };

  console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Request payload:', JSON.stringify(payload, null, 2));
      try {
        const errorJson = JSON.parse(errorText);
        console.error('❌ Parsed error:', errorJson);
      } catch (e) {
        console.error('❌ Raw error text:', errorText);
      }
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GenerateResponse;
    console.log('✅ Backend response:', data);
    
    if (!data?.landmarks || !data?.restaurants) {
      console.error('❌ Invalid API response structure:', data);
      throw new Error('Invalid API response');
    }

    const formattedAttractions = Object.entries(data.landmarks).map(([name, attraction]) => ({
      ...attraction,
      type: 'suggested' as const
    }));

    const formattedRestaurants = Object.entries(data.restaurants).map(([name, restaurant]) => ({
      ...restaurant
    }));

    const result = {
      attractions: formattedAttractions,
      restaurants: formattedRestaurants
    };

    setInCache(cacheKey, result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error generating trip:', error.message);
    }
    throw error;
  }
};

export const completeItinerary = async (
  tripPlan: {
    details: TripDetails;
    itinerary: { day: number; attractions: Attraction[] }[];
  }
): Promise<CompletedItinerary> => {
  console.log('📥 Input trip plan:', JSON.stringify(tripPlan, null, 2));

  // Transform the frontend structure to backend format
  const payload = {
    details: {
      destination: tripPlan.details.destination,
      travelDays: tripPlan.details.travelDays,
      startDate: tripPlan.details.startDate,
      endDate: tripPlan.details.endDate,
      withKids: tripPlan.details.withKids,
      withElders: tripPlan.details.withElders,
      kidsAge: tripPlan.details.kidsAge,
      specialRequests: tripPlan.details.specialRequests
    },
    wishlist: [], // Always empty since we're only sending planned itinerary
    itinerary: tripPlan.itinerary.map(dayPlan => ({
      day: dayPlan.day,
      attractions: dayPlan.attractions.map(attraction => {
        // Map frontend types to backend types
        let backendType = 'landmark'; // default
        if (attraction.type === 'additional') {
          backendType = 'restaurant';
        } else if (attraction.type === 'suggested') {
          backendType = 'landmark';
        }
        
        return {
          name: attraction.name,
          description: attraction.description,
          location: attraction.location,
          type: backendType
        };
      })
    }))
  };

  console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/complete-itinerary`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Request payload:', JSON.stringify(payload, null, 2));
      try {
        const errorJson = JSON.parse(errorText);
        console.error('❌ Parsed error:', errorJson);
      } catch (e) {
        console.error('❌ Raw error text:', errorText);
      }
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Completed itinerary response:', data);

    // Validate the response structure
    if (!data?.itinerary || !Array.isArray(data.itinerary)) {
      console.error('❌ Invalid API response structure:', data);
      throw new Error('Invalid API response: Missing itinerary array');
    }

    // Validate each day has the expected structure
    for (const day of data.itinerary) {
      if (!day.day || !Array.isArray(day.blocks)) {
        console.error(`❌ Invalid day structure:`, day);
        throw new Error(`Invalid API response: Day must have day number and blocks array`);
      }

      for (const block of day.blocks) {
        if (!block.type || !block.name || !block.description || !block.start_time || !block.duration) {
          console.error(`❌ Invalid block structure:`, block);
          throw new Error(`Invalid API response: Invalid block structure`);
        }
      }
    }

    return data as CompletedItinerary;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error completing itinerary:', error.message);
    }
    throw error;
  }
}; 