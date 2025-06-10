import React from 'react';
import { HomeLayout } from './layouts/HomeLayout';
import { PlanningLayout } from './layouts/PlanningLayout';
import { CompletedItinerary } from './components/CompletedItinerary';
import { useTripPlanner } from './hooks/useTripPlanner';

function App() {
  const {
    step,
    setStep,
    tripPlan,
    attractions,
    restaurants,
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
    moveAttractionBetweenDays,
    reorderAttractionInDay,
  } = useTripPlanner();

  if (step === 'completed' && tripPlan) {
    return (
      <CompletedItinerary
        tripPlan={tripPlan}
        completedItinerary={completedItinerary}
        onBack={handleBack}
        prefetchStatus={prefetchStatus}
        error={error}
      />
    );
  }

  if (step === 'planning' && tripPlan) {
    return (
      <PlanningLayout
        tripPlan={tripPlan}
        attractions={attractions}
        restaurants={restaurants}
        onBack={handleBack}
        onAddToWishlist={addToWishlist}
        onAddToItinerary={addToItinerary}
        onRemoveFromWishlist={removeFromWishlist}
        onRemoveFromItinerary={removeFromItinerary}
        onMoveAttractionBetweenDays={moveAttractionBetweenDays}
        onReorderAttractionInDay={reorderAttractionInDay}
        onContinue={handleComplete}
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
