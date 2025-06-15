// src/components/RestaurantCard.tsx
import React from 'react';
import { Restaurant } from '../types';
import { MapPin, Globe, DollarSign, Star, Users, ExternalLink } from 'lucide-react';
import { getFullPhotoUrl } from '../services/tripService';

// Use environment variable or fallback to local development server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function RestaurantCard({
  name,
  description,
  rating,
  user_ratings_total,
  price_level,
  website,
  wheelchair_accessible,
  photos,
  place_id,
  location,
  address,
  photo_url,
}: Restaurant) {
  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      type: 'restaurant',
      data: {
        name,
        description,
        rating,
        user_ratings_total,
        price_level,
        website,
        wheelchair_accessible,
        photos,
        place_id,
        location,
        address,
        photo_url,
      }
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open website if clicking on buttons or links
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return Array(level).fill('$').join('');
  };

  const priceText = getPriceLevel(price_level);

  // Use photos array first (backend sends photos array), then fallback to photo_url
  const displayPhoto = (photos && photos.length > 0 ? photos[0] : null) || photo_url || null;
  const fullPhotoUrl = getFullPhotoUrl(displayPhoto);
  
  // Debug logging for restaurants only
  console.log(`🍽️ RESTAURANT ${name}:`, {
    photos_length: photos?.length,
    first_photo: photos?.[0],
    displayPhoto,
    fullPhotoUrl,
    will_show_photo: !!fullPhotoUrl
  });

  return (
    <div 
      className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] 
        border border-amber-100/30 hover:border-amber-200/50
        transform hover:-translate-y-2 transition-all duration-300 cursor-move
        ${website ? 'hover:cursor-pointer' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onClick={handleCardClick}
      title={website ? `Click to visit ${name} website` : ''}
    >
      
      {/* Photo Section */}
      {fullPhotoUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={fullPhotoUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => {
              console.log(`✅ Image loaded successfully for ${name}:`, fullPhotoUrl);
            }}
            onError={(e) => {
              console.error(`❌ Image failed to load for ${name}:`, fullPhotoUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Rating overlay */}
          {rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-800 rounded-full border border-white/20 backdrop-blur-sm shadow-lg">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-sm">{rating}</span>
              {user_ratings_total && (
                <span className="text-xs text-gray-600">({user_ratings_total})</span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
            {name}
            {website && (
              <ExternalLink size={14} className="inline-block ml-2 text-amber-500 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </h3>
          {!fullPhotoUrl && rating && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100/70 text-yellow-700 rounded-full border border-yellow-200 backdrop-blur-sm">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-sm">{rating}</span>
              {user_ratings_total && (
                <span className="text-xs text-yellow-600">({user_ratings_total})</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {/* Description - Only show if not null/empty */}
          {description && description.trim() && (
            <div className="flex items-start gap-2 text-gray-700">
              <p className="text-sm line-clamp-3">
                {description}
                {description.endsWith('...') && (
                  <span className="text-gray-400 italic"> (more details available)</span>
                )}
              </p>
            </div>
          )}

          {/* Address */}
          {address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{address}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {priceText && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100/70 rounded-lg">
                <DollarSign size={14} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{priceText}</span>
              </div>
            )}

            {wheelchair_accessible && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100/70 rounded-lg">
                <Users size={14} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Accessible</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700
                bg-amber-50/80 rounded-xl hover:bg-amber-100/80 border border-amber-200/50
                hover:border-amber-300/50 transition-all duration-200 shadow-sm hover:shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe size={16} />
              <span>Visit Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
