import { TripDetails, Attraction, CompletedItinerary, GenerateResponse, Restaurant, TripPlan } from '../types';
import { getCacheKey, getFromCache, setInCache, clearCache, clearCacheForKey } from '../utils/cache';

// Use environment variable or fallback to local development server
const API_URL = 'http://localhost:8000'; // Temporarily hardcoded for debugging
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 30000;

interface AttractionInfo {
  description: string;
  badge: 'new' | 'trending' | null;
}

interface GenerateResult {
  attractions: Attraction[];
  restaurants: Restaurant[];
}

// Warmup function to reduce cold start latency
export const warmupServer = async () => {
  try {
    await fetch(`${API_URL}/health`, { method: 'GET' });
  } catch (error) {
    console.log('Server warmup failed (this is normal if server is not running)');
  }
};

export const generateTrip = async (details: TripDetails): Promise<GenerateResult> => {
  console.log('📥 Input details:', JSON.stringify(details, null, 2));
  
  const cacheKey = getCacheKey(details);
  
  // Only force fresh data in development mode (localhost API)
  const isDev = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
  if (isDev) {
    clearCacheForKey(cacheKey);
    console.log('🔄 Development mode: Forcing fresh data from backend...');
  }
  
  const cachedData = getFromCache(cacheKey);

  if (cachedData && !isDev) {
    console.log('📦 Using cached data (production mode)');
    return cachedData;
  } else if (cachedData && isDev) {
    console.log('🔄 Ignoring cache in development mode');
  }

  // Format payload to match the new backend API
  const payload = {
    destination: details.destination,
    travel_days: details.travelDays,
    start_date: details.startDate,
    end_date: details.endDate,
    with_kids: details.withKids,
    with_elderly: details.withElders,
    kids_age: details.withKids && details.kidsAge && details.kidsAge.length > 0 
      ? details.kidsAge  // Always send as array
      : [],
    special_requests: details.specialRequests || ""
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
    console.log('🔍 Recommendations structure:', data.recommendations);
    console.log('🔍 Landmarks type:', typeof data.recommendations?.landmarks, data.recommendations?.landmarks);
    console.log('🔍 Restaurants type:', typeof data.recommendations?.restaurants, data.recommendations?.restaurants);
    
    if (!data?.recommendations) {
      console.error('❌ Missing recommendations in response:', data);
      throw new Error('Invalid API response: Missing recommendations');
    }

    let landmarks, restaurants;

    // Handle landmarks - could be array or object
    if (Array.isArray(data.recommendations.landmarks)) {
      landmarks = data.recommendations.landmarks;
    } else if (data.recommendations.landmarks && typeof data.recommendations.landmarks === 'object') {
      // Convert object to array
      landmarks = Object.entries(data.recommendations.landmarks).map(([name, landmark]) => ({
        name,
        ...(landmark as any)
      }));
    } else {
      console.error('❌ Invalid landmarks structure:', data.recommendations.landmarks);
      throw new Error('Invalid API response: landmarks must be array or object');
    }

    // Handle restaurants - could be array or object  
    if (Array.isArray(data.recommendations.restaurants)) {
      restaurants = data.recommendations.restaurants;
    } else if (data.recommendations.restaurants && typeof data.recommendations.restaurants === 'object') {
      // Convert object to array
      restaurants = Object.entries(data.recommendations.restaurants).map(([name, restaurant]) => ({
        name,
        ...(restaurant as any)
      }));
    } else {
      console.error('❌ Invalid restaurants structure:', data.recommendations.restaurants);
      throw new Error('Invalid API response: restaurants must be array or object');
    }

    console.log('🔍 Processed landmarks:', landmarks.length, 'items');
    console.log('🔍 First landmark sample:', landmarks[0]);
    console.log('🔍 Landmark keys:', landmarks[0] ? Object.keys(landmarks[0]) : 'No landmarks');
    console.log('🔍 Processed restaurants:', restaurants.length, 'items');
    console.log('🔍 First restaurant sample:', restaurants[0]);
    console.log('🔍 Restaurant keys:', restaurants[0] ? Object.keys(restaurants[0]) : 'No restaurants');

    // Convert landmarks to attractions with 'suggested' type
    const formattedAttractions = landmarks.map(landmark => ({
      ...landmark, // Preserve all original fields first
      type: 'suggested' as const,
      description: landmark.description || '',
      address: landmark.address || '',
      // Keep photo_url as-is, don't overwrite with photos array
      photos: landmark.photo_url ? [landmark.photo_url] : (landmark.photos || [])
    }));

    // Format restaurants
    const formattedRestaurants = restaurants.map(restaurant => ({
      ...restaurant, // Preserve all original fields first
      description: restaurant.description || '',
      address: restaurant.address || '',
      // Keep photo_url as-is, don't overwrite with photos array
      photos: restaurant.photo_url ? [restaurant.photo_url] : (restaurant.photos || [])
    }));

    const result = {
      attractions: formattedAttractions,
      restaurants: formattedRestaurants
    };

    console.log('🔍 Final formatted attractions sample:', formattedAttractions[0]);
    console.log('🔍 Final formatted restaurants sample:', formattedRestaurants[0]);

    setInCache(cacheKey, result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error generating trip:', error.message);
    }
    throw error;
  }
};

export const completeItinerary = async (tripPlan: TripPlan): Promise<CompletedItinerary> => {
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
    wishlist: tripPlan.wishlist.map(item => ({
      name: item.name,
      type: item.type === 'suggested' ? 'landmark' : item.type
    })),
    itinerary: tripPlan.itinerary.map(day => ({
      day: day.day,
      attractions: day.attractions.map(attraction => {
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

  console.log('📤 Sending complete-itinerary payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/complete-itinerary`, {
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

    const data = await response.json() as CompletedItinerary;
    console.log('✅ Complete itinerary response:', data);
    
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
        if (!block.type || !block.name || !block.start_time || !block.duration) {
          console.error(`❌ Invalid block structure:`, block);
          throw new Error(`Invalid API response: Invalid block structure`);
        }
      }
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error completing itinerary:', error.message);
    }
    throw error;
  }
};

// Utility function to get full photo URL
export const getFullPhotoUrl = (photoUrl: string | null): string | null => {
  if (!photoUrl) {
    return null;
  }
  
  // If it's already a full URL, return as-is
  if (photoUrl.startsWith('http')) {
    return photoUrl;
  }
  
  // If it's a proxy URL, prepend the API base URL
  return `${API_URL}${photoUrl}`;
}; 