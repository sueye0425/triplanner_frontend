import React from 'react';
import { MapPin, Calendar, Users, Share2, Printer, Download, Loader2 } from 'lucide-react';
import type { TripPlan, CompletedItinerary as CompletedItineraryData } from '../types';
import { BackButton } from './BackButton';
import { UserNav } from './UserNav';
import { ItineraryBlockCard, SkeletonItineraryCard } from './ItineraryBlockCard';

interface CompletedItineraryProps {
  tripPlan: TripPlan;
  completedItinerary: CompletedItineraryData | null;
  onBack: () => void;
  prefetchStatus?: 'idle' | 'fetching' | 'done' | 'error';
  error?: string | null;
}

function ProgressiveLoadingIndicator() {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    "Analyzing your preferences...",
    "Finding the best restaurants...",
    "Discovering hidden gems...",
    "Optimizing your route...",
    "Adding local insights...",
    "Finalizing your itinerary..."
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15 + 5, 95);
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(stepIndex);
        return newProgress;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-orange-200/50">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="animate-spin text-orange-600" size={20} />
            <span className="text-gray-700 font-medium">
              {steps[Math.min(currentStep, steps.length - 1)]}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-600">
            {Math.floor(progress)}% complete
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompletedItinerary({ tripPlan, completedItinerary, onBack, prefetchStatus, error }: CompletedItineraryProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Trip to ${tripPlan.details.destination}`,
        text: `Check out my ${tripPlan.details.travelDays}-day itinerary for ${tripPlan.details.destination}!`,
      });
    } catch (err) {
      console.log('Sharing not supported');
    }
  };

  const handleDownload = () => {
    const content = `Trip to ${tripPlan.details.destination}\n\n` +
      completedItinerary?.itinerary
        .map(day => 
          `Day ${day.day}:\n` +
          day.blocks.map(block => 
            `${block.start_time} - ${block.name} (${block.duration})\n` +
            `  ${block.description}\n` +
            (block.notes ? `  Notes: ${block.notes}\n` : '')
          ).join('\n')
        )
        .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripPlan.details.destination.toLowerCase()}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-200 to-amber-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <BackButton onClick={onBack} label="Back to Planning" />
          
          {/* User Navigation - Top Right */}
          <div className="fixed top-4 right-4 z-50">
            <UserNav />
          </div>
          
          {/* Floating Action Buttons - Top Right */}
          <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-12 h-12 text-gray-700 bg-white/95 backdrop-blur-lg rounded-xl hover:bg-orange-50 hover:text-orange-600 border border-gray-200/50 shadow-lg transition-all duration-200 group"
              title="Share itinerary"
            >
              <Share2 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center w-12 h-12 text-gray-700 bg-white/95 backdrop-blur-lg rounded-xl hover:bg-orange-50 hover:text-orange-600 border border-gray-200/50 shadow-lg transition-all duration-200 group"
              title="Print itinerary"
            >
              <Printer size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl hover:from-orange-700 hover:to-amber-700 border border-orange-300/50 shadow-lg hover:shadow-xl transition-all duration-200 group"
              title="Download itinerary"
            >
              <Download size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="text-center">
            {/* Step 3 Header Box */}
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-orange-200/40 shadow-xl shadow-orange-100/30 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <span className="text-2xl font-semibold text-orange-600">Step 3</span>
              </div>
              
              <h1 className="font-display text-4xl font-bold mb-4 text-gray-900">
                Your Complete Guide to {tripPlan.details.destination}
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Your personalized itinerary with detailed schedules, timings, and helpful tips for each day
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <MapPin className="text-orange-600" size={20} />
                  <span className="text-gray-700">{tripPlan.details.destination}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <Calendar className="text-orange-600" size={20} />
                  <span className="text-gray-700">{tripPlan.details.travelDays} days</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <Users className="text-orange-600" size={20} />
                  <span className="text-gray-700">
                    {tripPlan.details.withKids &&
                      `With kids${
                        tripPlan.details.kidsAge && tripPlan.details.kidsAge.length > 0
                          ? ` (ages: ${tripPlan.details.kidsAge.join(', ')})`
                          : ''
                      }`}
                    {tripPlan.details.withElders && ' • With elderly'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading Progress Indicator */}
        {prefetchStatus === 'fetching' && (
          <ProgressiveLoadingIndicator />
        )}

        {/* Error State */}
        {prefetchStatus === 'error' && (
          <div className="text-center mb-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50/95 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-red-200/50">
                <div className="text-red-700 font-medium mb-4">
                  {error?.includes('timed out') || error?.includes('timeout') 
                    ? 'The request timed out. This sometimes happens with complex itineraries.'
                    : 'Failed to generate your itinerary. Please try again.'
                  }
                </div>
                
                <button
                  onClick={onBack}
                  className="px-6 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-16">
          {/* Show skeleton loading if no data yet */}
          {!completedItinerary && prefetchStatus === 'fetching' && (
            <>
              {Array.from({ length: tripPlan.details.travelDays }, (_, index) => (
                <div key={`skeleton-day-${index + 1}`} className="relative">
                  {/* Day Header */}
                  <div className="flex items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">{index + 1}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Day {index + 1}</h2>
                        <div className="h-4 bg-gray-300/50 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative ml-8">
                    {/* Vertical line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-300"></div>
                    
                    {/* Skeleton blocks - estimate 3-5 per day */}
                    <div className="space-y-8">
                      {Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, blockIndex) => (
                        <div 
                          key={`skeleton-block-${blockIndex}`} 
                          className="relative flex items-start gap-6"
                          style={{ 
                            animationDelay: `${(index * 500) + (blockIndex * 200)}ms`,
                            opacity: 0,
                            animation: `fadeInUp 0.6s ease-out forwards ${(index * 500) + (blockIndex * 200)}ms`
                          }}
                        >
                          {/* Time marker */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 border-2 border-white shadow-lg"></div>
                            <div className="ml-6 min-w-[80px]">
                              <div className="h-6 bg-gray-300/50 rounded-full w-16 animate-pulse"></div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <SkeletonItineraryCard isRestaurant={blockIndex % 3 === 0} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Show actual data when available */}
          {completedItinerary?.itinerary.map((day, dayIndex) => (
            <div 
              key={day.day} 
              className="relative animate-fadeIn"
              style={{ animationDelay: `${dayIndex * 100}ms` }}
            >
              {/* Day Header */}
              <div className="flex items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">{day.day}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Day {day.day}</h2>
                    <p className="text-gray-600">{day.blocks.filter(block => block.type !== 'restaurant').length} activities planned</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative ml-8">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-300"></div>
                
                {/* Timeline blocks */}
                <div className="space-y-8">
                  {day.blocks
                    .sort((a, b) => {
                      // Sort by start_time (convert to comparable format)
                      const timeA = a.start_time.replace(':', '');
                      const timeB = b.start_time.replace(':', '');
                      return timeA.localeCompare(timeB);
                    })
                    .map((block, blockIndex) => (
                    <div key={`${block.name}-${blockIndex}`} className="relative flex items-start gap-6">
                      {/* Time marker */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute -left-2 w-4 h-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 border-2 border-white shadow-lg"></div>
                        <div className="ml-6 min-w-[80px]">
                          <div className="text-sm font-semibold text-orange-700 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200/50">
                            {block.start_time}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <ItineraryBlockCard block={block} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}