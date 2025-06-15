import React from 'react';
import { Star, MapPin, ExternalLink, Clock } from 'lucide-react';
import { Attraction } from '../types';
import { getFullPhotoUrl } from '../services/tripService';

export function AttractionCard(attraction: Attraction) {
  const { name, description, rating, user_ratings_total, photos, website, address, badge, photo_url, estimated_duration } = attraction;

  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      type: 'attraction',
      data: attraction
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

  // Use photos array first (backend sends photos array), then fallback to photo_url
  const displayPhoto = (photos && photos.length > 0 ? photos[0] : null) || photo_url || null;
  const fullPhotoUrl = getFullPhotoUrl(displayPhoto);
  
  // Debug logging for landmarks only
  console.log(`🏛️ LANDMARK ${name}:`, {
    photos_length: photos?.length,
    first_photo: photos?.[0],
    displayPhoto,
    fullPhotoUrl,
    will_show_photo: !!fullPhotoUrl,
    website: website,
    hasWebsite: !!website
  });

  return (
    <div 
      className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] 
        border border-blue-100/30 hover:border-blue-200/50
        transform hover:-translate-y-2 transition-all duration-300 cursor-move
        ${website ? 'hover:cursor-pointer' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onClick={handleCardClick}
      title={website ? `Click to visit ${name} website` : ''}
    >
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 text-xs font-medium text-white rounded-full
          bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
          {badge}
        </div>
      )}

      {/* Photo Section */}
      {fullPhotoUrl && (
        <div className="relative h-48 overflow-hidden">
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
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-800 rounded-full border border-white/20 backdrop-blur-sm shadow-lg">
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
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
              {name}
              {website && (
                <ExternalLink size={14} className="inline-block ml-2 text-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              )}
            </h3>
            
            {/* Duration Badge - Only show if backend provides estimated_duration */}
            {estimated_duration && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 rounded-lg border border-blue-200/50">
                <Clock size={14} className="flex-shrink-0 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{estimated_duration}</span>
              </div>
            )}
          </div>
          
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
          {/* Description */}
          <div className="flex items-start gap-2 text-gray-700">
            {description && description.trim() ? (
              <p className="text-sm line-clamp-3">
                {description}
                {description.endsWith('...') && (
                  <span className="text-gray-400 italic"> (more details available)</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic line-clamp-3">
                Attraction details will be provided when you visit
              </p>
            )}
          </div>
          
          {/* Address */}
          {address && (
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{address}</span>
            </div>
          )}


        </div>

        {/* Website Link */}
        {website && (
          <div className="flex flex-wrap gap-2">
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700
                bg-blue-50/80 rounded-xl hover:bg-blue-100/80 border border-blue-200/50
                hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
              <span>Visit Website</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}