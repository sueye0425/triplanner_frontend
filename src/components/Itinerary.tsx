import React from 'react';
import { DayPlan } from '../types';
import { Trash2 } from 'lucide-react';

interface ItineraryProps {
  itinerary: DayPlan[];
  onRemoveAttraction: (day: number, attractionName: string) => void;
}

export function Itinerary({ itinerary, onRemoveAttraction }: ItineraryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
      {itinerary.map((dayPlan) => (
        <div key={dayPlan.day} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Day {dayPlan.day}</h3>
          <ul className="space-y-2">
            {dayPlan.attractions.map((attraction) => (
              <li key={attraction.name} className="flex items-center justify-between">
                <span>{attraction.name}</span>
                <button
                  onClick={() => onRemoveAttraction(dayPlan.day, attraction.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}