import React, { useState } from 'react';
import { TripDetails } from '../types';
import { MapPin, Calendar, Users, Baby, Minus, Plus } from 'lucide-react';

interface NewTripFormProps {
  onSubmit: (details: TripDetails) => void;
  disabled?: boolean;
}

export function NewTripForm({ onSubmit, disabled }: NewTripFormProps) {
  const [details, setDetails] = useState<TripDetails>({
    destination: '',
    travelDays: 3,
    withKids: false,
    withElders: false,
    kidsAge: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🧭 Submitting new trip details:', details);
    console.time('🔄 Trip generation total time');
    console.time('📡 Request started');
    const wrappedSubmit = async () => {
      await onSubmit({
        ...details,
        destination: details.destination.trim(),
      });
      console.timeEnd('📡 Request started');
      console.timeEnd('🔄 Trip generation total time');
    };
    wrappedSubmit();
  };

  const incrementDays = () => {
    setDetails((prev) => ({
      ...prev,
      travelDays: Math.min(prev.travelDays + 1, 14),
    }));
  };

  const decrementDays = () => {
    setDetails((prev) => ({
      ...prev,
      travelDays: Math.max(prev.travelDays - 1, 1),
    }));
  };

  const incrementKidsAge = () => {
    setDetails((prev) => ({
      ...prev,
      kidsAge: Math.min((prev.kidsAge ?? 0) + 1, 17),
    }));
  };

  const decrementKidsAge = () => {
    setDetails((prev) => ({
      ...prev,
      kidsAge: Math.max((prev.kidsAge ?? 1) - 1, 0),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="destination"
          className="block text-xl font-display font-semibold text-gray-900 mb-3"
        >
          Where would you like to go?
        </label>
        <div className="relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            id="destination"
            placeholder="Enter destination"
            value={details.destination}
            onChange={(e) =>
              setDetails({ ...details, destination: e.target.value })
            }
            className="pl-12 w-full h-14 rounded-xl border-gray-200 bg-white text-lg text-gray-900 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="block text-xl font-display font-semibold text-gray-900 mb-3">
          How many days?
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={decrementDays}
            disabled={details.travelDays <= 1 || disabled}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={20} />
          </button>
          <div className="relative flex-1">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="number"
              value={details.travelDays}
              onChange={(e) =>
                setDetails({
                  ...details,
                  travelDays: Math.min(
                    Math.max(parseInt(e.target.value) || 1, 1),
                    14
                  ),
                })
              }
              className="pl-12 w-full h-14 rounded-xl border-gray-200 bg-white text-lg text-gray-900 text-center shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={disabled}
            />
          </div>
          <button
            type="button"
            onClick={incrementDays}
            disabled={details.travelDays >= 14 || disabled}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={details.withKids}
              onChange={(e) =>
                setDetails({ ...details, withKids: e.target.checked })
              }
              className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              disabled={disabled}
            />
            <Baby
              size={20}
              className="text-gray-400 group-hover:text-gray-600"
            />
            <span className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
              With Kids
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={details.withElders}
              onChange={(e) =>
                setDetails({ ...details, withElders: e.target.checked })
              }
              className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              disabled={disabled}
            />
            <Users
              size={20}
              className="text-gray-400 group-hover:text-gray-600"
            />
            <span className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
              With Elderly
            </span>
          </label>
        </div>

        {details.withKids && (
          <div className="pl-8 pt-2">
            <label
              htmlFor="kidsAge"
              className="block text-base font-medium text-gray-700 mb-2"
            >
              Kids Age
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decrementKidsAge}
                disabled={!details.kidsAge || details.kidsAge <= 0 || disabled}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              <div className="relative flex-1">
                <Baby
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  id="kidsAge"
                  min="0"
                  max="17"
                  value={details.kidsAge ?? ''}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      kidsAge: parseInt(e.target.value),
                    })
                  }
                  className="pl-12 w-full h-12 rounded-xl border-gray-200 bg-white text-gray-900 text-center shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Age"
                  required
                  disabled={disabled}
                />
              </div>
              <button
                type="button"
                onClick={incrementKidsAge}
                disabled={
                  (details.kidsAge !== null && details.kidsAge >= 17) ||
                  disabled
                }
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-4 px-6 text-xl font-bold text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
          disabled={disabled}
        >
          {disabled ? 'Creating Your Plan...' : 'Plan My Trip'}
        </button>
      </div>
    </form>
  );
}
