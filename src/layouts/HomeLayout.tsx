import React from 'react';
import { LoadingState } from '../components/LoadingState';
import { NewTripForm } from '../components/NewTripForm';
import { TripDetails } from '../types';
import { Compass } from 'lucide-react';

interface HomeLayoutProps {
  loading: boolean;
  error: string | null;
  onSubmit: (details: TripDetails) => void;
}

export function HomeLayout({ loading, error, onSubmit }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80")',
          }}
        ></div>
        <div className="relative h-full flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 mb-8">
                  <Compass size={20} />
                  <span className="font-medium">Plan Your Next Adventure</span>
                </div>
                <h1 className="font-display text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Dream Vacation{' '}
                  <span className="text-orange-600">Starts Here</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Let us help you create the perfect journey. Tell us your
                  preferences, and we'll craft a personalized itinerary that
                  matches your travel style.
                </p>
                <div className="mt-8 hidden lg:block">
                  <div className="flex items-center gap-8 text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-orange-600">1</span>
                      </div>
                      <span>Choose your destination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-orange-600">2</span>
                      </div>
                      <span>Set your preferences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-2xl font-semibold text-orange-600">3</span>
                      </div>
                      <span>Get your itinerary</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 lg:p-10">
                  {loading || error ? (
                    <LoadingState error={error} variant="initial" />
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Start Planning
                        </h2>
                        <p className="text-gray-600">
                          Fill in the details below and let's create your perfect trip.
                        </p>
                      </div>
                      <NewTripForm onSubmit={onSubmit} disabled={loading} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 