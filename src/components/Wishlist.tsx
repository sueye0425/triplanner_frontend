import React from 'react';
import { Attraction } from '../types';
import { Trash2, PlusCircle } from 'lucide-react';

interface WishlistProps {
  wishlist: Attraction[];
  onRemove: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction, day: number) => void;
  totalDays: number;
}

export function Wishlist({ wishlist, onRemove, onAddToItinerary, totalDays }: WishlistProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Wishlist</h2>
      <ul className="space-y-3">
        {wishlist.map((attraction) => (
          <li key={attraction.name} className="flex items-center justify-between">
            <span>{attraction.name}</span>
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => onAddToItinerary(attraction, parseInt(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Add to Day...</option>
                {Array.from({ length: totalDays }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onRemove(attraction)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}