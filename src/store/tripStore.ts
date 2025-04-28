import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { TripPlan } from '../types';

type Step = 'new' | 'planning' | 'final' | 'completed';

interface TripState {
  version: number;
  step: Step;
  setStep: (step: Step) => void;
  tripPlan: TripPlan | null;
  setTripPlan: (plan: TripPlan | null) => void;
  updateTripPlan: (updates: Partial<TripPlan>) => void;
  reset: () => void;
}

const CURRENT_VERSION = 1;
const STORAGE_KEY = 'trip-planner-storage';

const initialState = {
  version: CURRENT_VERSION,
  step: 'new' as Step,
  tripPlan: null,
};

// Helper to validate state consistency
const validateState = (state: Partial<TripState>): Partial<TripState> => {
  const validated = { ...state };
  
  if (validated.tripPlan && validated.step === 'new') {
    validated.step = 'planning';
  }
  if (!validated.tripPlan && validated.step !== 'new') {
    validated.step = 'new';
  }
  
  return validated;
};

// Create store with middlewares
export const useTripStore = create<TripState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setStep: (step) => set((state) => validateState({ ...state, step })),
        
        setTripPlan: (plan) => set((state) => {
          if (!plan) {
            return validateState({ ...state, tripPlan: null });
          }
          
          return validateState({
            ...state,
            tripPlan: plan,
            step: 'planning'
          });
        }),
        
        updateTripPlan: (updates) => set((state) => {
          const currentPlan = state.tripPlan;
          if (!currentPlan) return state;
          
          return validateState({
            ...state,
            tripPlan: {
              ...currentPlan,
              ...updates
            }
          });
        }),
        
        reset: () => set(initialState),
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          step: state.step,
          tripPlan: state.tripPlan,
          version: state.version,
        }),
        version: CURRENT_VERSION,
      }
    )
  )
);