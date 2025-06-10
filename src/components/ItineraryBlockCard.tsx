import React from 'react';
import { Clock, MapPin, Star, Utensils, Camera, StickyNote } from 'lucide-react';
import { CompletedItineraryBlock } from '../types';

// Use environment variable or fallback to local development server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ItineraryBlockCardProps {
  block: CompletedItineraryBlock;
}

export function SkeletonItineraryCard({ isRestaurant = false }: { isRestaurant?: boolean }) {
  const cardStyles = isRestaurant
    ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-amber-200/50'
    : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/50';

  return (
    <div className={`relative rounded-2xl border backdrop-blur-sm shadow-sm overflow-hidden ${cardStyles} animate-pulse`}>
      <div className="flex">
        {/* Content Section - Left Side */}
        <div className="flex-1 p-6">
          {/* Title skeleton */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 bg-gray-300/50 rounded w-48"></div>
              <div className="flex items-center gap-2">
                {/* Duration skeleton */}
                <div className="h-5 bg-gray-300/50 rounded-full w-16"></div>
                <div className="h-6 bg-gray-300/50 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300/50 rounded w-20 mb-3"></div>
          </div>

          {/* Description skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 bg-gray-300/50 rounded w-full"></div>
            <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
          </div>

          {/* Address skeleton */}
          <div className="flex items-start gap-2 mb-4">
            <div className="w-4 h-4 bg-gray-300/50 rounded mt-0.5"></div>
            <div className="h-4 bg-gray-300/50 rounded w-64"></div>
          </div>

          {/* Notes skeleton */}
          <div className="p-3 rounded-xl border-l-4 border-gray-300/50 bg-gray-100/30">
            <div className="flex items-start gap-2">
              <div className="w-3.5 h-3.5 bg-gray-300/50 rounded mt-0.5"></div>
              <div>
                <div className="h-4 bg-gray-300/50 rounded w-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo skeleton - Right Side */}
        <div className="relative w-80 flex-shrink-0 bg-gray-300/50">
          <div className="w-full h-full bg-gradient-to-r from-gray-200/50 to-gray-300/50"></div>
        </div>
      </div>
    </div>
  );
}

export function ItineraryBlockCard({ block }: ItineraryBlockCardProps) {
  const isRestaurant = block.type === 'restaurant';
  
  const cardStyles = isRestaurant
    ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-amber-200/50 hover:border-amber-300/60'
    : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/50 hover:border-blue-300/60';
    
  const iconColor = isRestaurant ? 'text-amber-600' : 'text-blue-600';

  // Handle both absolute and relative photo URLs
  const getPhotoUrl = (photoUrl: string | null) => {
    if (!photoUrl) return null;
    
    // If it's already a full URL, use it directly
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // For relative URLs (like /photo-proxy/...), prepend the API base URL
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}${photoUrl}`;
  };

  const getMealtimeDisplay = (mealtime: string | null) => {
    if (!mealtime) return null;
    const mealtimeColors = {
      breakfast: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      lunch: 'bg-orange-100 text-orange-800 border-orange-200',
      dinner: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${mealtimeColors[mealtime as keyof typeof mealtimeColors]}`}>
        <Utensils size={12} />
        {mealtime.charAt(0).toUpperCase() + mealtime.slice(1)}
      </span>
    );
  };

  const finalPhotoUrl = getPhotoUrl(block.photo_url);

  return (
    <div className={`relative rounded-2xl border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${cardStyles}`}>
      <div className="flex">
        {/* Content Section - Left Side */}
        <div className="flex-1 p-6">
          {/* Title and Mealtime with Icons */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{block.name}</h3>
              <div className="flex items-center gap-2">
                {/* Duration Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100/80 rounded-full border border-gray-200/50">
                  <Clock size={12} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{block.duration}</span>
                </div>
                {block.mealtime && getMealtimeDisplay(block.mealtime)}
                {!finalPhotoUrl && (
                  <>
                    {isRestaurant ? (
                      <div className={`p-2 rounded-full bg-amber-100/70 ${iconColor}`}>
                        <Utensils size={16} />
                      </div>
                    ) : (
                      <div className={`p-2 rounded-full bg-blue-100/70 ${iconColor}`}>
                        <Camera size={16} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {block.rating && (
              <div className="flex items-center gap-1.5 mb-3">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-sm text-gray-700">{block.rating}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4 leading-relaxed">{block.description}</p>

          {/* Address */}
          <div className="flex items-start gap-2 mb-4 text-gray-600">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{block.address}</span>
          </div>

          {/* Notes */}
          {block.notes && (
            <div className={`p-3 rounded-xl border-l-4 ${
              isRestaurant 
                ? 'bg-amber-50/50 border-l-amber-400 border-amber-100/50' 
                : 'bg-blue-50/50 border-l-blue-400 border-blue-100/50'
            }`}>
              <div className="flex items-start gap-2">
                <StickyNote size={14} className={`flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div>
                  <span className="font-medium text-gray-900 text-sm">Notes: </span>
                  <span className="text-sm text-gray-700">{block.notes}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photo Section - Right Side */}
        {finalPhotoUrl && (
          <div className="relative w-80 flex-shrink-0">
            <img
              src={finalPhotoUrl}
              alt={block.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', finalPhotoUrl);
                // Hide the image container if photo fails to load
                const container = e.currentTarget.parentElement;
                if (container) container.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent" />
            
            {/* Type icon overlay */}
            <div className="absolute top-3 right-3">
              {isRestaurant ? (
                <div className={`p-2 rounded-full bg-amber-100/90 backdrop-blur-sm border border-white/20 shadow-lg ${iconColor}`}>
                  <Utensils size={16} />
                </div>
              ) : (
                <div className={`p-2 rounded-full bg-blue-100/90 backdrop-blur-sm border border-white/20 shadow-lg ${iconColor}`}>
                  <Camera size={16} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 