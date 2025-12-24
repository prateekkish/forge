'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutSession } from '@/components/workout/WorkoutSession';
import { WorkoutControls } from '@/components/workout/WorkoutControls';
import { useWorkout } from '@/contexts/WorkoutContext';
import { createWorkoutSession, completeWorkoutSession, abandonWorkoutSession } from '@/app/actions/sessions';
import { getExercises } from '@/app/actions/exercises';
import type { Exercise, Set } from '@/lib/db/schema';

export default function WorkoutPage() {
  const router = useRouter();
  const { state, dispatch } = useWorkout();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const loadExercises = async () => {
      const allExercises = await getExercises();
      setExercises(allExercises);
    };
    loadExercises();
  }, []);

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    data: Partial<Set>
  ) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: { exerciseIndex, setIndex, data }
    });
  };

  const handleFinish = async () => {
    if (!state.currentSession) return;
    try {
      await completeWorkoutSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
      router.push('/history');
    } catch (error) {
      console.error('Failed to finish workout:', error);
    }
  };

  const handleStartWorkout = async (workoutType: 'A' | 'B') => {
    try {
      const session = await createWorkoutSession('5x5', workoutType);
      dispatch({ type: 'START_SESSION', payload: session });
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  const handleAbandonWorkout = async () => {
    if (!state.currentSession) return;
    try {
      await abandonWorkoutSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
      router.push('/');
    } catch (error) {
      console.error('Failed to abandon workout:', error);
    }
  };

  if (!state.currentSession) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] sm:min-h-[calc(100vh-16rem)]">
        <div className="text-center w-full max-w-md px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-zinc-50 mb-3 sm:mb-4">
            No Active Workout
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-6 sm:mb-8">
            Start a new workout to begin training
          </p>
          <WorkoutControls
            onStart={handleStartWorkout}
            onFinish={handleFinish}
            onAbandon={handleAbandonWorkout}
            hasActiveSession={false}
          />
        </div>
      </div>
    );
  }

  return (
    <WorkoutSession
      session={state.currentSession}
      exercises={exercises}
      onUpdateSet={handleUpdateSet}
      onFinish={handleFinish}
      unit={state.settings.unit}
    />
  );
}
