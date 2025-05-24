import React from 'react';
import { PlusCircle, ListPlus, Sparkles, Zap } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
  onAddToWishlist: () => void;
  onAddToItinerary: (day: number) => void;
  totalDays: number;
}

export function AttractionCard({ attraction, onAddToWishlist, onAddToItinerary, totalDays }: AttractionCardProps) {
  const [showDaySelect, setShowDaySelect] = React.useState(false);

  return (
    <div className="group relative bg-orange-50/50 backdrop-blur-sm rounded-2xl p-6 
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-lg 
      border border-orange-100/20 hover:border-orange-200/30
      transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">
          {attraction.name}
        </h3>
        {attraction.badge && (
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
      <p className="text-base text-gray-600 mb-6 line-clamp-3">{attraction.description}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddToWishlist}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-700
            bg-white/80 rounded-xl hover:bg-orange-50 border border-orange-100/20
            hover:border-orange-200/30 transition-all duration-200
            shadow-sm hover:shadow group/btn"
        >
          <ListPlus size={18} className="text-orange-500 group-hover/btn:text-orange-600 transition-colors" />
          <span>Add to Wishlist</span>
        </button>
        <button
          onClick={() => setShowDaySelect(!showDaySelect)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-700
            bg-white/80 rounded-xl hover:bg-orange-50 border border-orange-100/20
            hover:border-orange-200/30 transition-all duration-200
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
            className="w-full px-4 py-2.5 rounded-xl border-orange-100/20 bg-white/80 
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
  );
}