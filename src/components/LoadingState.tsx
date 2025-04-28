import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  error?: string | null;
  variant?: 'initial' | 'finalize';
}

const initialLoadingMessages = [
  "Your travel planner is spinning up...",
  "Browsing recently opened landmarks...",
  "Browsing recent events...",
  "Generating landmarks personalized to your needs..."
];

const finalizeLoadingMessages = [
  "Creating your detailed itinerary...",
  "Adding restaurant recommendations...",
  "Optimizing your schedule...",
  "Finalizing your perfect trip plan..."
];

export function LoadingState({ error, variant = 'initial' }: LoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = variant === 'initial' ? initialLoadingMessages : finalizeLoadingMessages;

  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [error, messages]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-red-600">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Please try again in a few moments
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary-100"></div>
        <Loader2 
          size={64} 
          className="absolute top-0 left-0 text-primary-600 animate-spin"
        />
      </div>
      <div className="text-center space-y-3">
        <div className="h-8">
          <p 
            key={messageIndex} 
            className="text-lg font-medium text-gray-900 animate-fade-in"
          >
            {messages[messageIndex]}
          </p>
        </div>
        <div className="flex gap-1 justify-center">
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}