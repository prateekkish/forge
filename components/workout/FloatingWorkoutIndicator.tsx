'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWorkout } from '@/contexts/WorkoutContext';

export function FloatingWorkoutIndicator() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useWorkout();

  // Don't show on workout page or if no active session
  if (pathname === '/workout' || !state.currentSession) {
    return null;
  }

  const handleClick = () => {
    router.push('/workout');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="font-semibold text-sm">
          Workout {state.currentSession.workoutType} in progress
        </span>
      </div>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}
