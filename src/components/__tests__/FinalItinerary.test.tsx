import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinalItinerary } from '../FinalItinerary';
import '@testing-library/jest-dom';

const mockTripPlan = {
  details: {
    destination: 'New York City',
    travelDays: 3,
    withKids: false,
    withElders: false
  },
  wishlist: [],
  itinerary: [
    {
      day: 1,
      attractions: [
        { name: 'Statue of Liberty', description: 'Famous landmark', type: 'suggested' }
      ]
    },
    {
      day: 2,
      attractions: [
        { name: 'Central Park', description: 'Urban park', type: 'suggested' }
      ]
    },
    {
      day: 3,
      attractions: [
        { name: 'Empire State Building', description: 'Historic skyscraper', type: 'suggested' }
      ]
    }
  ]
};

describe('FinalItinerary Component', () => {
  describe('Button States', () => {
    it('shows "Complete with Details" button with spinner during prefetch', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
          prefetchStatus="fetching"
        />
      );

      const button = screen.getByRole('button', { name: /Complete with Details/i });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('shows normal "Complete with Details" button when not prefetching', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
          prefetchStatus="idle"
        />
      );

      const button = screen.getByRole('button', { name: /Complete with Details/i });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('shows loading state when loading prop is true', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
          loading={true}
        />
      );

      expect(screen.getByText(/Creating your detailed itinerary/i)).toBeInTheDocument();
    });

    it('disables button when there is an error', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
          prefetchStatus="error"
          error="Something went wrong"
        />
      );

      const button = screen.getByRole('button', { name: /Complete with Details/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onComplete when button is clicked', () => {
      const mockOnComplete = vi.fn();
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={mockOnComplete}
        />
      );

      const button = screen.getByRole('button', { name: /Complete with Details/i });
      fireEvent.click(button);
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('calls onBack when back button is clicked', () => {
      const mockOnBack = vi.fn();
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={mockOnBack}
          onComplete={() => {}}
        />
      );

      const backButton = screen.getByText('Back to Planning');
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Content Display', () => {
    it('displays trip details correctly', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('Your Trip to New York City')).toBeInTheDocument();
      expect(screen.getByText('3 days')).toBeInTheDocument();
    });

    it('displays all attractions in the itinerary', () => {
      render(
        <FinalItinerary
          tripPlan={mockTripPlan}
          onBack={() => {}}
          onComplete={() => {}}
        />
      );

      expect(screen.getByText('Statue of Liberty')).toBeInTheDocument();
      expect(screen.getByText('Central Park')).toBeInTheDocument();
      expect(screen.getByText('Empire State Building')).toBeInTheDocument();
    });
  });
});