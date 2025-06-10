import React from 'react';
import { PlusCircle, ListPlus, Sparkles, Zap, Star, MapPin } from 'lucide-react';
import { Attraction } from '../types';

// Use environment variable or fallback to local development server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AttractionCardProps {
  attraction: Attraction;
  onAddToWishlist: () => void;
  onAddToItinerary: (day: number) => void;
  totalDays: number;
}

export function AttractionCard({ attraction, onAddToWishlist, onAddToItinerary, totalDays }: AttractionCardProps) {
  const [showDaySelect, setShowDaySelect] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      type: 'attraction',
      data: attraction
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPhotoUrl = (path: string) => {
    // If path is an absolute URL, use it directly
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Ensure leading slash
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalized}`;
  };

  return (
    <div 
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)] 
        border border-orange-100/30 hover:border-orange-200/50
        transform hover:-translate-y-2 transition-all duration-300 cursor-move"
      draggable="true"
      onDragStart={handleDragStart}
    >
      
      {/* Photo Section */}
      {attraction.photos && attraction.photos.length > 0 && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={getPhotoUrl(attraction.photos![0])}
            alt={attraction.name}
            onError={(e) => console.error('Image failed to load:', getPhotoUrl(attraction.photos![0]), e)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Badge overlay */}
          {attraction.badge && (
            <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 
              ${attraction.badge === 'new' 
                ? 'bg-emerald-500/90 text-white border border-emerald-400/50'
                : 'bg-amber-500/90 text-white border border-amber-400/50'
              } backdrop-blur-sm shadow-lg`}>
              {attraction.badge === 'new' ? (
                <>
                  <Sparkles size={14} className="animate-pulse" />
                  <span>New</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="animate-pulse" />
                  <span>Trending</span>
                </>
              )}
            </div>
          )}

          {/* Rating overlay */}
          {attraction.rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-800 rounded-full border border-white/20 backdrop-blur-sm shadow-lg">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-sm">{attraction.rating}</span>
              {attraction.user_ratings_total && (
                <span className="text-xs text-gray-600">({attraction.user_ratings_total})</span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-2">
            {attraction.name}
          </h3>
          {!attraction.photos && attraction.badge && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 
              ${attraction.badge === 'new' 
                ? 'bg-emerald-100/70 text-emerald-700 border border-emerald-200'
                : 'bg-amber-100/70 text-amber-700 border border-amber-200'
              } backdrop-blur-sm`}>
              {attraction.badge === 'new' ? (
                <>
                  <Sparkles size={14} className="animate-pulse" />
                  <span>New</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="animate-pulse" />
                  <span>Trending</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Location and Rating for cards without photos */}
        {!attraction.photos && attraction.rating && (
          <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 bg-yellow-100/70 text-yellow-700 rounded-full border border-yellow-200 backdrop-blur-sm w-fit">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span className="font-medium text-sm">{attraction.rating}</span>
            {attraction.user_ratings_total && (
              <span className="text-xs text-yellow-600">({attraction.user_ratings_total})</span>
            )}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-3">{attraction.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddToWishlist}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-700
              bg-orange-50/80 rounded-xl hover:bg-orange-100/80 border border-orange-200/50
              hover:border-orange-300/50 transition-all duration-200
              shadow-sm hover:shadow group/btn"
          >
            <ListPlus size={18} className="text-orange-500 group-hover/btn:text-orange-600 transition-colors" />
            <span>Add to Wishlist</span>
          </button>
          <button
            onClick={() => setShowDaySelect(!showDaySelect)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-700
              bg-orange-50/80 rounded-xl hover:bg-orange-100/80 border border-orange-200/50
              hover:border-orange-300/50 transition-all duration-200
              shadow-sm hover:shadow group/btn"
          >
            <PlusCircle size={18} className="text-orange-500 group-hover/btn:text-orange-600 transition-colors" />
            <span>Add to Itinerary</span>
          </button>
        </div>

        {showDaySelect && (
          <div className="mt-4 animate-fadeIn">
            <select
              onChange={(e) => {
                onAddToItinerary(parseInt(e.target.value));
                setShowDaySelect(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl border-orange-200/50 bg-white/90 
                text-gray-700 shadow-sm backdrop-blur-sm
                focus:border-orange-300 focus:ring focus:ring-orange-200/50
                transition-all duration-200"
            >
              <option value="">Select Day</option>
              {Array.from({ length: totalDays }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Day {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}