import React, { useState } from 'react';
import { DayPlan, TripDetails, Attraction } from '../types';
import { Trash2, GripVertical } from 'lucide-react';
import { getDayLabel } from '../utils/dateUtils';

interface ItineraryProps {
  itinerary: DayPlan[];
  tripDetails: TripDetails;
  onRemoveAttraction: (day: number, attractionIndex: number) => void;
  onDropAttraction?: (attractionData: any, day: number) => void;
  onMoveAttractionBetweenDays?: (fromDay: number, fromIndex: number, toDay: number) => void;
  onReorderAttractionInDay?: (day: number, fromIndex: number, toIndex: number) => void;
}

export function Itinerary({ 
  itinerary, 
  tripDetails, 
  onRemoveAttraction, 
  onDropAttraction,
  onMoveAttractionBetweenDays,
  onReorderAttractionInDay
}: ItineraryProps) {
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, day: number, index?: number) => {
    e.preventDefault();
    setDragOverDay(day);
    if (index !== undefined) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    // Only clear if we're actually leaving the box (not entering a child element)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverDay(null);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, day: number, dropIndex?: number) => {
    e.preventDefault();
    setDragOverDay(null);
    setDragOverIndex(null);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (dragData.type === 'itinerary-item') {
        // Handle moving existing attractions
        const { fromDay, fromIndex } = dragData.data;
        
        if (fromDay === day && dropIndex !== undefined && onReorderAttractionInDay) {
          // Reordering within the same day
          onReorderAttractionInDay(day, fromIndex, dropIndex);
        } else if (fromDay !== day && onMoveAttractionBetweenDays) {
          // Moving between different days
          onMoveAttractionBetweenDays(fromDay, fromIndex, day);
        }
      } else if (onDropAttraction) {
        // Handle dropping new attractions from cards/wishlist
        onDropAttraction(dragData, day);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleAttractionDragStart = (e: React.DragEvent, day: number, index: number, attraction: Attraction) => {
    const dragData = {
      type: 'itinerary-item',
      data: {
        fromDay: day,
        fromIndex: index,
        attraction: attraction
      }
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
        Selected Places for Planning
      </h2>
      <p className="text-sm text-gray-600 -mt-2">
        Drag places here to organize by day. AI will create your detailed itinerary with timing and routes.
      </p>
      {itinerary.map((dayPlan) => {
        const isDragOver = dragOverDay === dayPlan.day;
        
        return (
          <div 
            key={dayPlan.day} 
            className={`
              rounded-2xl shadow-sm border p-6 min-h-[140px] transition-all duration-200
              ${isDragOver 
                ? 'bg-gradient-to-br from-orange-100/80 to-amber-100/80 border-orange-300/60 shadow-lg scale-[1.02] ring-2 ring-orange-400/30' 
                : 'bg-gradient-to-br from-orange-50/50 to-amber-50/50 border-orange-100/30 hover:shadow-md hover:border-orange-200/50'
              }
            `}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, dayPlan.day)}
            onDragLeave={(e) => handleDragLeave(e, dayPlan.day)}
            onDrop={(e) => handleDrop(e, dayPlan.day)}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold transition-all duration-200
                ${isDragOver 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg scale-110' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500'
                }
              `}>
                {dayPlan.day}
              </div>
              <span className={isDragOver ? 'text-orange-700 font-bold' : ''}>
                {getDayLabel(dayPlan.day, tripDetails.startDate)}
              </span>
              {isDragOver && (
                <span className="text-orange-600 text-sm font-medium animate-pulse">
                  Drop here!
                </span>
              )}
            </h3>
            
            {dayPlan.attractions.length > 0 ? (
              <ul className="space-y-3">
                {dayPlan.attractions.map((attraction, index) => {
                  const isDropTarget = dragOverDay === dayPlan.day && dragOverIndex === index;
                  
                  return (
                    <li 
                      key={`${attraction.name}-${index}`} 
                      className={`
                        flex items-center justify-between rounded-xl p-3 border cursor-move transition-all duration-200
                        ${isDropTarget 
                          ? 'bg-orange-100/80 border-orange-300 shadow-md scale-[1.02]'
                          : 'bg-white/70 border-orange-100/50 hover:bg-white/90 hover:shadow-sm'
                        }
                      `}
                      draggable="true"
                      onDragStart={(e) => handleAttractionDragStart(e, dayPlan.day, index, attraction)}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, dayPlan.day, index)}
                      onDrop={(e) => handleDrop(e, dayPlan.day, index)}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-gray-400 hover:text-gray-600 transition-colors" />
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="text-gray-700 font-medium">{attraction.name}</span>
                        {/* Show count if there are duplicates */}
                        {dayPlan.attractions.filter(a => a.name === attraction.name).length > 1 && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                            #{dayPlan.attractions.slice(0, index + 1).filter(a => a.name === attraction.name).length}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveAttraction(dayPlan.day, index)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove from itinerary"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className={`
                flex items-center justify-center h-20 text-sm border-2 border-dashed rounded-xl transition-all duration-200
                ${isDragOver 
                  ? 'border-orange-400/70 bg-orange-50/50 text-orange-700' 
                  : 'border-orange-200/50 text-gray-400'
                }
              `}>
                {isDragOver ? (
                  <span className="font-medium">Release to add here!</span>
                ) : (
                  "Drop attractions here or click \"Add to Itinerary\""
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}