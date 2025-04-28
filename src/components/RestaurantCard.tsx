// src/components/RestaurantCard.tsx
import React from 'react';

interface RestaurantCardProps {
  name: string;
  description?: string;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export function RestaurantCard({
  name,
  description,
  mealType,
}: RestaurantCardProps) {
  return (
    <div className="flex flex-col bg-yellow-50 p-4 rounded-xl border border-yellow-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-lg">
          🍽️
        </div>
        <div className="font-semibold text-lg text-yellow-700">{name}</div>
        {mealType && (
          <span className="ml-2 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            {mealType}
          </span>
        )}
      </div>
      {description && <p className="text-sm text-yellow-800">{description}</p>}
    </div>
  );
}
