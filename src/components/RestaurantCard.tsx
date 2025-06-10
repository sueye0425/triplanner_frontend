// src/components/RestaurantCard.tsx
import React from 'react';
import { Restaurant } from '../types';
import { MapPin, Phone, Globe, Clock, DollarSign, Star, Users } from 'lucide-react';

// Use environment variable or fallback to local development server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function RestaurantCard({
  name,
  description,
  rating,
  user_ratings_total,
  price_level,
  website,
  phone,
  opening_hours,
  wheelchair_accessible,
  photos,
  place_id,
  location,
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
        phone,
        opening_hours,
        wheelchair_accessible,
        photos,
        place_id,
        location,
      }
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPhotoUrl = (path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return Array(level).fill('$').join('');
  };

  const isOpenNow = opening_hours?.open_now;
  const priceText = getPriceLevel(price_level);

  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] 
        border border-amber-100/30 hover:border-amber-200/50
        transform hover:-translate-y-2 transition-all duration-300 cursor-move"
      draggable="true"
      onDragStart={handleDragStart}
    >
      
      {/* Photo Section */}
      {photos && photos.length > 0 && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={getPhotoUrl(photos![0])}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

          {/* Open/Closed status overlay */}
          {opening_hours && (
            <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg border ${
              isOpenNow 
                ? 'bg-green-500/90 text-white border-green-400/50' 
                : 'bg-red-500/90 text-white border-red-400/50'
            }`}>
              {isOpenNow ? 'Open Now' : 'Closed'}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
            {name}
          </h3>
          {!photos && rating && (
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
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm line-clamp-3">{description}</span>
          </div>

          {!photos && opening_hours && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="flex-shrink-0 text-gray-600" />
              <span className={`text-sm font-medium ${
                isOpenNow ? 'text-green-600' : 'text-red-600'
              }`}>
                {isOpenNow ? 'Open Now' : 'Closed'}
              </span>
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
            >
              <Globe size={16} />
              <span>Website</span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700
                bg-amber-50/80 rounded-xl hover:bg-amber-100/80 border border-amber-200/50
                hover:border-amber-300/50 transition-all duration-200 shadow-sm hover:shadow"
            >
              <Phone size={16} />
              <span>{phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
