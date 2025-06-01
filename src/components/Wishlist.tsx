import React from 'react';
import { Attraction } from '../types';
import { Trash2, PlusCircle, Heart, GripVertical } from 'lucide-react';

interface WishlistProps {
  wishlist: Attraction[];
  onRemove: (attraction: Attraction) => void;
  onAddToItinerary: (attraction: Attraction, day: number) => void;
  onDropAttraction?: (attractionData: any) => void;
  totalDays: number;
}

export function Wishlist({ wishlist, onRemove, onAddToItinerary, onDropAttraction, totalDays }: WishlistProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDropAttraction) {
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        
        // Handle both regular attractions and itinerary items being dragged back
        if (dragData.type === 'itinerary-item') {
          // Convert itinerary item back to attraction for wishlist
          onDropAttraction({
            type: 'attraction',
            data: dragData.data.attraction
          });
        } else {
          // Handle regular attractions (from cards/restaurants)
          onDropAttraction(dragData);
        }
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    }
  };

  const handleWishlistItemDragStart = (e: React.DragEvent, attraction: Attraction) => {
    const dragData = {
      type: 'attraction',
      data: attraction
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
        Wishlist
      </h2>
      <div
        className="bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-2xl shadow-sm border border-rose-100/30 p-6 
          min-h-[120px] transition-all duration-200 hover:shadow-md hover:border-rose-200/50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {wishlist.length > 0 ? (
          <ul className="space-y-3">
            {wishlist.map((attraction, index) => {
              const attractionWithId = attraction as Attraction & { _wishlistId?: number };
              const uniqueKey = attractionWithId._wishlistId ? `${attraction.name}-${attractionWithId._wishlistId}` : `${attraction.name}-${index}`;
              
              return (
                <li 
                  key={uniqueKey}
                  className="bg-white/70 rounded-xl p-3 border border-rose-100/50 cursor-move hover:bg-white/90 hover:shadow-sm transition-all duration-200"
                  draggable="true"
                  onDragStart={(e) => handleWishlistItemDragStart(e, attraction)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                      <Heart size={16} className="text-rose-400 fill-rose-400" />
                      <span className="text-gray-700 font-medium">{attraction.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            onAddToItinerary(attraction, parseInt(e.target.value));
                            e.target.value = ''; // Reset selection
                          }
                        }}
                        className="text-sm px-2 py-1 rounded-lg border border-rose-200 bg-white/80 
                          focus:border-rose-300 focus:ring focus:ring-rose-200/50 transition-all"
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
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-16 text-gray-400 text-sm border-2 border-dashed border-rose-200/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Heart size={16} />
              Drop attractions here or click "Add to Wishlist"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}