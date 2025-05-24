import React from 'react';
import { HomeLayout } from './layouts/HomeLayout';
import { PlanningLayout } from './layouts/PlanningLayout';
import { FinalItinerary } from './components/FinalItinerary';
import { CompletedItinerary } from './components/CompletedItinerary';
import { useTripPlanner } from './hooks/useTripPlanner';

function App() {
  const {
    step,
    setStep,
    tripPlan,
    attractions,
    loading,
    error,
    completedItinerary,
    prefetchStatus,
    handleNewTrip,
    handleComplete,
    handleBack,
    addToWishlist,
    removeFromWishlist,
    addToItinerary,
    removeFromItinerary,
  } = useTripPlanner();

  if (step === 'completed' && completedItinerary && tripPlan) {
    return (
      <CompletedItinerary
        tripPlan={tripPlan}
        completedItinerary={completedItinerary}
        onBack={handleBack}
      />
    );
  }

  if (step === 'final' && tripPlan) {
    return (
      <FinalItinerary
        tripPlan={tripPlan}
        onBack={handleBack}
        onComplete={handleComplete}
        error={error}
        prefetchStatus={prefetchStatus}
      />
    );
  }

  if (step === 'planning' && tripPlan) {
    return (
      <PlanningLayout
        tripPlan={tripPlan}
        attractions={attractions}
        onBack={handleBack}
        onAddToWishlist={addToWishlist}
        onAddToItinerary={addToItinerary}
        onRemoveFromWishlist={removeFromWishlist}
        onRemoveFromItinerary={removeFromItinerary}
        onContinue={() => setStep('final')}
      />
    );
  }

  return (
    <HomeLayout
      loading={loading}
      error={error}
      onSubmit={handleNewTrip}
    />
  );
}

export default App;
