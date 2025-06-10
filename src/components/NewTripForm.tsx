import React, { useState, useEffect } from 'react';
import { TripDetails } from '../types';
import { MapPin, Calendar, Users, Baby, Minus, Plus, X, Sparkles, MessageSquare, CalendarDays, CalendarRange } from 'lucide-react';

interface NewTripFormProps {
  onSubmit: (details: TripDetails) => void;
  disabled?: boolean;
}

export function NewTripForm({ onSubmit, disabled }: NewTripFormProps) {
  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Get end date (3 days after start date)
  const defaultEndDate = new Date(tomorrow);
  defaultEndDate.setDate(defaultEndDate.getDate() + 2); // Add 2 more days (total 3 days)

  const [details, setDetails] = useState<TripDetails>({
    destination: '',
    travelDays: 3,
    startDate: tomorrow.toISOString().split('T')[0],
    endDate: defaultEndDate.toISOString().split('T')[0],
    withKids: false,
    withElders: false,
    kidsAge: [],
    specialRequests: '',
  });

  const [useDates, setUseDates] = useState(true);

  // Calculate travel days when dates change
  useEffect(() => {
    if (useDates && details.startDate && details.endDate) {
      const start = new Date(details.startDate);
      const end = new Date(details.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDetails(prev => ({ ...prev, travelDays: diffDays }));
    }
  }, [details.startDate, details.endDate, useDates]);

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

  const addKid = () => {
    setDetails((prev) => ({
      ...prev,
      kidsAge: [...(prev.kidsAge || []), 5], // Default age of 5
    }));
  };

  const removeKid = (index: number) => {
    setDetails((prev) => ({
      ...prev,
      kidsAge: (prev.kidsAge || []).filter((_, i) => i !== index),
    }));
  };

  const updateKidAge = (index: number, age: number) => {
    setDetails((prev) => ({
      ...prev,
      kidsAge: (prev.kidsAge || []).map((kidAge, i) => 
        i === index ? Math.min(Math.max(Math.floor(age), 0), 17) : kidAge
      ),
    }));
  };

  const incrementKidAge = (index: number) => {
    const currentAge = details.kidsAge?.[index] || 0;
    updateKidAge(index, currentAge + 1);
  };

  const decrementKidAge = (index: number) => {
    const currentAge = details.kidsAge?.[index] || 0;
    updateKidAge(index, currentAge - 1);
  };

  const handleDateToggle = () => {
    setUseDates(!useDates);
    if (!useDates) {
      // Switching to date mode - set default dates
      const newStartDate = new Date();
      newStartDate.setDate(newStartDate.getDate() + 1); // Tomorrow
      
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + 2); // 3 days total
      
      setDetails(prev => ({
        ...prev,
        startDate: newStartDate.toISOString().split('T')[0],
        endDate: newEndDate.toISOString().split('T')[0],
      }));
    } else {
      // Switching to duration mode - clear dates
      setDetails(prev => ({
        ...prev,
        startDate: null,
        endDate: null,
      }));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setDetails(prev => {
      // Calculate new end date (3 days from new start date)
      const endDate = new Date(newStartDate);
      endDate.setDate(endDate.getDate() + 2); // Add 2 more days (total 3 days)
      const newEndDate = endDate.toISOString().split('T')[0];

      // If end date exists and is before new start date, adjust it
      if (prev.endDate && prev.endDate < newStartDate) {
        return { ...prev, startDate: newStartDate, endDate: newEndDate };
      }
      return { ...prev, startDate: newStartDate, endDate: newEndDate };
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setDetails(prev => {
      // If start date exists and is after new end date, adjust it
      if (prev.startDate && prev.startDate > newEndDate) {
        return { ...prev, startDate: newEndDate, endDate: newEndDate };
      }
      return { ...prev, endDate: newEndDate };
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
        <div>
          <label
            htmlFor="destination"
            className="block text-2xl font-display font-semibold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
          >
            Where would you like to go?
          </label>
          <div className="relative group">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-hover:text-orange-600"
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
              className="pl-12 w-full h-14 rounded-2xl border-0 bg-orange-50/50 text-lg text-gray-900 placeholder-gray-400 
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-sm
                focus:bg-orange-50/80 focus:ring-2 focus:ring-orange-500/50 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                transition-all duration-200"
              required
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-2xl font-display font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              When are you traveling?
            </label>
            <button
              type="button"
              onClick={handleDateToggle}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700
                bg-orange-50/50 rounded-xl hover:bg-orange-100/50 
                border border-orange-100/20 hover:border-orange-200/30 
                transition-all duration-200"
            >
              {useDates ? (
                <>
                  <CalendarRange size={16} />
                  <span>I don't know exact dates</span>
                </>
              ) : (
                <>
                  <CalendarDays size={16} />
                  <span>I know my travel dates</span>
                </>
              )}
            </button>
          </div>

          {useDates ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-hover:text-orange-600"
                  size={20}
                />
                <input
                  type="date"
                  value={details.startDate || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleStartDateChange}
                  className="pl-12 w-full h-14 rounded-2xl border-0 bg-orange-50/50 text-lg text-gray-900
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-sm
                    focus:bg-orange-50/80 focus:ring-2 focus:ring-orange-500/50 
                    focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                    transition-all duration-200"
                  required={useDates}
                  disabled={disabled}
                />
                <span className="absolute left-4 -top-2 px-2 bg-orange-50/80 text-sm font-medium text-orange-600">
                  Start Date
                </span>
              </div>

              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-hover:text-orange-600"
                  size={20}
                />
                <input
                  type="date"
                  value={details.endDate || ''}
                  min={details.startDate || new Date().toISOString().split('T')[0]}
                  onChange={handleEndDateChange}
                  className="pl-12 w-full h-14 rounded-2xl border-0 bg-orange-50/50 text-lg text-gray-900
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-sm
                    focus:bg-orange-50/80 focus:ring-2 focus:ring-orange-500/50 
                    focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                    transition-all duration-200"
                  required={useDates}
                  disabled={disabled}
                />
                <span className="absolute left-4 -top-2 px-2 bg-orange-50/80 text-sm font-medium text-orange-600">
                  End Date
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decrementDays}
                disabled={details.travelDays <= 1 || disabled}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50/50 text-orange-600 
                  hover:bg-orange-100/80 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
              >
                <Minus size={20} />
              </button>
              <div className="relative flex-1 group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-hover:text-orange-600"
                  size={20}
                />
                <input
                  type="number"
                  value={details.travelDays}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      travelDays: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 14),
                    })
                  }
                  className="pl-12 w-full h-14 rounded-2xl border-0 bg-orange-50/50 text-lg text-gray-900 text-center 
                    shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-sm
                    focus:bg-orange-50/80 focus:ring-2 focus:ring-orange-500/50 
                    focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                    transition-all duration-200"
                  disabled={disabled}
                />
                <span className="absolute left-4 -top-2 px-2 bg-orange-50/80 text-sm font-medium text-orange-600">
                  Number of Days
                </span>
              </div>
              <button
                type="button"
                onClick={incrementDays}
                disabled={details.travelDays >= 14 || disabled}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50/50 text-orange-600 
                  hover:bg-orange-100/80 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
              >
                <Plus size={20} />
              </button>
            </div>
          )}

          {useDates && details.startDate && details.endDate && (
            <p className="text-sm text-gray-600 mt-2">
              Trip duration: {details.travelDays} day{details.travelDays > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-orange-50/50 transition-colors">
              <input
                type="checkbox"
                checked={details.withKids}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setDetails({
                    ...details,
                    withKids: isChecked,
                    kidsAge: isChecked && (!details.kidsAge || details.kidsAge.length === 0) 
                      ? [5]
                      : isChecked 
                      ? details.kidsAge 
                      : []
                  });
                }}
                className="w-5 h-5 text-orange-600 rounded-lg border-orange-200 focus:ring-orange-500/50"
                disabled={disabled}
              />
              <Baby
                size={20}
                className="text-orange-500 group-hover:text-orange-600 transition-colors"
              />
              <span className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                With Kids
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-orange-50/50 transition-colors">
              <input
                type="checkbox"
                checked={details.withElders}
                onChange={(e) =>
                  setDetails({ ...details, withElders: e.target.checked })
                }
                className="w-5 h-5 text-orange-600 rounded-lg border-orange-200 focus:ring-orange-500/50"
                disabled={disabled}
              />
              <Users
                size={20}
                className="text-orange-500 group-hover:text-orange-600 transition-colors"
              />
              <span className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                With Elderly
              </span>
            </label>
          </div>

          {details.withKids && (
            <div className="pl-8 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-lg font-medium text-gray-700">
                  Kids Ages
                </label>
                <button
                  type="button"
                  onClick={addKid}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50/80 
                    rounded-xl hover:bg-orange-100/80 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Plus size={16} />
                  Add Kid
                </button>
              </div>
              
              <div className="space-y-3">
                {details.kidsAge?.map((age, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50/30 backdrop-blur-sm">
                    <span className="text-sm font-medium text-orange-600 min-w-[60px]">
                      Kid {index + 1}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        type="button"
                        onClick={() => decrementKidAge(index)}
                        disabled={age <= 0 || disabled}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-orange-600 
                          hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <div className="relative flex-1 max-w-[120px] group">
                        <Baby
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 transition-colors group-hover:text-orange-600"
                          size={16}
                        />
                        <input
                          type="number"
                          min="0"
                          max="17"
                          value={age}
                          onChange={(e) =>
                            updateKidAge(index, parseInt(e.target.value) || 0)
                          }
                          className="pl-10 w-full h-10 rounded-lg border-0 bg-white/80 text-gray-900 text-center text-sm 
                            shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-orange-500/50
                            transition-all duration-200"
                          placeholder="Age"
                          required
                          disabled={disabled}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => incrementKidAge(index)}
                        disabled={age >= 17 || disabled}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 text-orange-600 
                          hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeKid(index)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        disabled={details.kidsAge && details.kidsAge.length === 1}
                        title={details.kidsAge && details.kidsAge.length === 1 ? "At least one kid is required when 'With Kids' is selected" : "Remove this kid"}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="specialRequests"
              className="block text-2xl font-display font-semibold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
            >
              Any special requests?
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100">
              optional
            </span>
          </div>
          <div className="relative group">
            <MessageSquare
              className="absolute left-4 top-4 text-orange-500 transition-colors group-hover:text-orange-600"
              size={20}
            />
            <textarea
              id="specialRequests"
              placeholder="Tell us about any special requirements or preferences for your trip (e.g., 'I'll be traveling with my 2-year-old daughter' or 'I would like to explore more nature attractions')"
              value={details.specialRequests || ''}
              onChange={(e) =>
                setDetails({ ...details, specialRequests: e.target.value })
              }
              className="pl-12 w-full h-32 rounded-2xl border-0 bg-orange-50/50 text-lg text-gray-900 placeholder-gray-400 
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] backdrop-blur-sm resize-none
                focus:bg-orange-50/80 focus:ring-2 focus:ring-orange-500/50 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                transition-all duration-200"
              disabled={disabled}
            />
          </div>
          <p className="text-sm text-gray-500 ml-4">
            Your special requests help us tailor the perfect itinerary for you
          </p>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-4 px-6 text-xl font-bold text-white 
              bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl
              hover:from-orange-700 hover:to-amber-700 
              shadow-lg hover:shadow-xl shadow-orange-600/10 hover:shadow-orange-600/20
              transform hover:-translate-y-0.5 transition-all duration-200"
            disabled={disabled}
          >
            {disabled ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Your Plan...</span>
              </div>
            ) : (
              'Plan My Trip'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
