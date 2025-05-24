import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CompletedItinerary } from '../CompletedItinerary';
import '@testing-library/jest-dom';
import type { CompletedItinerary as CompletedItineraryData } from '../../types';

const mockTripPlan = {
  details: {
    destination: 'Paris',
    travelDays: 3,
    withKids: true,
    kidsAge: [10],
    withElders: false
  },
  wishlist: [],
  itinerary: []
};

const mockCompletedItinerary: CompletedItineraryData = {
  'Day 1': [
    {
      type: 'landmark' as const,
      name: 'Golden Gate Bridge',
      description: 'Iconic suspension bridge spanning the Golden Gate strait',
      mealtime: null
    },
    {
      type: 'restaurant' as const,
      name: 'House of Prime Rib',
      description: 'Classic San Francisco institution serving prime rib',
      mealtime: 'dinner' as const
    }
  ],
  'Day 2': [
    {
      type: 'landmark' as const,
      name: 'Alcatraz Island',
      description: 'Historic former prison on an island in San Francisco Bay',
      mealtime: null
    },
    {
      type: 'restaurant' as const,
      name: 'Tartine Bakery',
      description: 'Famous bakery known for sourdough bread',
      mealtime: 'breakfast' as const
    }
  ],
  'Day 3': [
    {
      type: 'landmark' as const,
      name: 'Fisherman\'s Wharf',
      description: 'Waterfront community with seafood restaurants and shops',
      mealtime: null
    },
    {
      type: 'restaurant' as const,
      name: 'State Bird Provisions',
      description: 'Modern American restaurant with dim sum-style service',
      mealtime: 'dinner' as const
    }
  ]
};

describe('CompletedItinerary Component', () => {
  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders the component without crashing', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );
    });

    it('displays the correct destination in the header', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );
      expect(screen.getByText('Your Complete Guide to San Francisco')).toBeInTheDocument();
    });

    it('shows all trip details in the header', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );
      expect(screen.getByText('3 days')).toBeInTheDocument();
      expect(screen.getByText('With kids (10 years)')).toBeInTheDocument();
    });
  });

  // Layout and structure tests
  describe('Layout and Structure', () => {
    it('renders all days in correct order', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );
      
      const days = screen.getAllByRole('heading', { level: 2 });
      expect(days).toHaveLength(3);
      expect(days[0]).toHaveTextContent('Day 1');
      expect(days[1]).toHaveTextContent('Day 2');
      expect(days[2]).toHaveTextContent('Day 3');
    });

    it('maintains consistent card layout structure', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      const cards = document.querySelectorAll('div[class*="rounded-xl"]');
      cards.forEach(card => {
        expect(card).toHaveClass('flex');
        expect(card).toHaveClass('gap-4');
        expect(card).toHaveClass('p-6');
      });
    });
  });

  // Style tests
  describe('Styling', () => {
    it('applies correct styles to landmark cards', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      const landmarks = [
        'Golden Gate Bridge',
        'Alcatraz Island',
        'Fisherman\'s Wharf'
      ];

      landmarks.forEach(landmark => {
        const card = screen.getByText(landmark).closest('div[class*="rounded-xl"]');
        expect(card).toHaveClass('bg-primary-50');
        expect(card).toHaveClass('border');
        expect(card).toHaveClass('border-primary-100');
      });
    });

    it('applies correct styles to restaurant cards', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      const restaurants = [
        'House of Prime Rib',
        'Tartine Bakery',
        'State Bird Provisions'
      ];

      restaurants.forEach(restaurant => {
        const card = screen.getByText(restaurant).closest('div[class*="rounded-xl"]');
        expect(card).toHaveClass('bg-amber-50');
        expect(card).toHaveClass('border');
        expect(card).toHaveClass('border-amber-100');
      });
    });

    it('styles mealtime badges correctly', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      const mealtimeBadges = screen.getAllByText(/(breakfast|lunch|dinner)/i);
      mealtimeBadges.forEach(badge => {
        const badgeContainer = badge.closest('span');
        expect(badgeContainer).toHaveClass('px-3');
        expect(badgeContainer).toHaveClass('py-1');
        expect(badgeContainer).toHaveClass('text-xs');
        expect(badgeContainer).toHaveClass('font-medium');
        expect(badgeContainer).toHaveClass('rounded-full');
        expect(badgeContainer).toHaveClass('bg-amber-100');
        expect(badgeContainer).toHaveClass('text-amber-700');
      });
    });
  });

  // Icon tests
  describe('Icons', () => {
    it('uses correct icons for landmarks and restaurants', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      // Check landmark icons
      const landmarkCards = screen.getAllByText(/Golden Gate Bridge|Alcatraz Island|Fisherman's Wharf/);
      landmarkCards.forEach(card => {
        const iconContainer = card.closest('div[class*="rounded-xl"]')?.querySelector('div.w-10.h-10');
        expect(iconContainer).toHaveClass('bg-primary-100');
      });

      // Check restaurant icons
      const restaurantCards = screen.getAllByText(/House of Prime Rib|Tartine Bakery|State Bird Provisions/);
      restaurantCards.forEach(card => {
        const iconContainer = card.closest('div[class*="rounded-xl"]')?.querySelector('div.w-10.h-10');
        expect(iconContainer).toHaveClass('bg-amber-100');
      });
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('calls onBack when back button is clicked', () => {
      const mockOnBack = vi.fn();
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={mockOnBack}
        />
      );

      const backButton = screen.getByText('Back to Final Itinerary');
      fireEvent.click(backButton);
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('maintains proper heading hierarchy', () => {
      render(
        <CompletedItinerary
          tripPlan={mockTripPlan}
          completedItinerary={mockCompletedItinerary}
          onBack={() => {}}
        />
      );

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Your Complete Guide to San Francisco');

      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s).toHaveLength(3);
      expect(h2s[0]).toHaveTextContent('Day 1');
    });
  });
});