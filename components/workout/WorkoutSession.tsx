'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ExerciseCard } from './ExerciseCard';
import { RestTimer } from './RestTimer';
import { useWorkout } from '@/contexts/WorkoutContext';
import type { WorkoutSession, Exercise, Set } from '@/lib/db/schema';

interface WorkoutSessionProps {
  session: WorkoutSession;
  exercises: Exercise[];
  onUpdateSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  onFinish: () => void;
  unit: string;
}

export function WorkoutSession({
  session,
  exercises,
  onUpdateSet,
  onFinish,
  unit,
}: WorkoutSessionProps) {
  const { state, dispatch } = useWorkout();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const currentExercise = session.exercises[currentExerciseIndex];
  const currentExerciseDetails = exercises.find(
    (e) => e.id === currentExercise.exerciseId
  );

  const handleStartRest = (seconds: number) => {
    dispatch({ type: 'START_REST_TIMER', payload: seconds });
  };

  const handleRestComplete = () => {
    dispatch({ type: 'CANCEL_REST_TIMER' });
  };

  const handleRestSkip = () => {
    dispatch({ type: 'CANCEL_REST_TIMER' });
  };

  const handleRestAdjust = (delta: number) => {
    dispatch({ type: 'ADJUST_REST_TIMER', payload: delta });
  };

  const goToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  if (!currentExerciseDetails) {
    return <div>Loading exercise details...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-black dark:text-zinc-50">
            Workout {session.workoutType}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Exercise {currentExerciseIndex + 1} of {session.exercises.length}
          </p>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            disabled={currentExerciseIndex === 0}
            className="min-w-[44px] min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            disabled={currentExerciseIndex === session.exercises.length - 1}
            className="min-w-[44px] min-h-[44px]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Exercise Card */}
      <ExerciseCard
        exercise={currentExercise}
        exerciseDetails={currentExerciseDetails}
        onUpdateSet={(setIndex, data) =>
          onUpdateSet(currentExerciseIndex, setIndex, data)
        }
        onStartRest={handleStartRest}
        unit={unit}
      />

      {/* Finish Button */}
      {currentExerciseIndex === session.exercises.length - 1 && (
        <Button variant="success" size="lg" onClick={onFinish} className="w-full min-h-[48px]">
          Finish Workout
        </Button>
      )}

      {/* Rest Timer */}
      {state.isRestTimerActive && (
        <RestTimer
          seconds={state.restTimeRemaining}
          initialSeconds={state.restTimeInitial}
          onComplete={handleRestComplete}
          onSkip={handleRestSkip}
          onAdjust={handleRestAdjust}
        />
      )}
    </div>
  );
}
