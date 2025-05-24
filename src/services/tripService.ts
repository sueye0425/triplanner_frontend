import { TripDetails, Attraction, CompletedItinerary } from '../types';
import { getCacheKey, getFromCache, setInCache } from '../utils/cache';

const API_URL = 'https://plan-your-trip-wcaj.onrender.com';
const API_TIMEOUT = 30000;

interface AttractionInfo {
  description: string;
  badge: 'new' | 'trending' | null;
}

export const warmupServer = async () => {
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

export const generateTrip = async (details: TripDetails): Promise<Attraction[]> => {
  console.log('📥 Input details:', JSON.stringify(details, null, 2));
  
  const cacheKey = getCacheKey(details);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return cachedData.attractions;
  }

  // Format payload to match the working curl request
  const payload = {
    destination: details.destination,
    travel_days: details.travelDays,
    with_kids: details.withKids,
    kids_age: details.withKids && details.kidsAge && details.kidsAge.length > 0 
      ? details.kidsAge  // Always send as array
      : null,
    with_elderly: details.withElders
  };

  console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    const data = await response.json();
    console.log('✅ Backend response:', data);
    
    if (!data?.itinerary?.Suggested_Things_to_Do) {
      console.error('❌ Invalid API response structure:', data);
      throw new Error('Invalid API response');
    }

    const formattedAttractions = Object.entries(
      data.itinerary.Suggested_Things_to_Do as Record<string, AttractionInfo>
    ).map(([name, info]) => ({
      name,
      description: info.description,
      type: 'suggested' as const,
      badge: info.badge,
    }));

    setInCache(cacheKey, { attractions: formattedAttractions });
    return formattedAttractions;
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

  // Format the selected landmarks to match the API format
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

  console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_URL}/complete-itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const days = Object.keys(data).filter(key => key.startsWith('Day '));
    if (days.length === 0) {
      console.error('❌ Invalid API response structure:', data);
      throw new Error('Invalid API response: No days found in the itinerary');
    }

    // Validate each day has the expected structure
    for (const day of days) {
      const items = data[day];
      if (!Array.isArray(items)) {
        console.error(`❌ Invalid day structure for ${day}:`, items);
        throw new Error(`Invalid API response: ${day} is not an array`);
      }

      for (const item of items) {
        if (!item.type || !item.name || !item.description) {
          console.error(`❌ Invalid item structure in ${day}:`, item);
          throw new Error(`Invalid API response: Invalid item structure in ${day}`);
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