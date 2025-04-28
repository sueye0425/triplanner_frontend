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
    <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{attraction.name}</h3>
        {attraction.badge && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
            attraction.badge === 'new' 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {attraction.badge === 'new' ? (
              <>
                <Sparkles size={14} />
                <span>New</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                <span>Trending</span>
              </>
            )}
          </div>
        )}
      </div>
      <p className="text-base text-gray-700 mb-4">{attraction.description}</p>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onAddToWishlist}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ListPlus size={18} />
          Add to Wishlist
        </button>
        <button
          onClick={() => setShowDaySelect(!showDaySelect)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <PlusCircle size={18} />
          Add to Itinerary
        </button>
      </div>
      {showDaySelect && (
        <div className="mt-3">
          <select
            onChange={(e) => {
              onAddToItinerary(parseInt(e.target.value));
              setShowDaySelect(false);
            }}
            className="w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-gray-700"
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