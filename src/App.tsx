import React from 'react';
import { HomeLayout } from './layouts/HomeLayout';
import { PlanningLayout } from './layouts/PlanningLayout';
import { CompletedItinerary } from './components/CompletedItinerary';
import { AuthForm } from './components/AuthForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTripPlanner } from './hooks/useTripPlanner';

function AppContent() {
  const { currentUser } = useAuth();
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

  // If user is not logged in, show login form
  if (!currentUser) {
    return <AuthForm />;
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
