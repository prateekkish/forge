'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WorkoutControls } from '@/components/workout/WorkoutControls';
import { SessionCard } from '@/components/history/SessionCard';
import { useWorkout } from '@/contexts/WorkoutContext';
import { createWorkoutSession, completeWorkoutSession, abandonWorkoutSession, getWorkoutHistory } from '@/app/actions/sessions';
import { initializeApp } from '@/app/actions/init';
import type { WorkoutSession } from '@/lib/db/schema';

export default function DashboardPage() {
  const router = useRouter();
  const { state, dispatch } = useWorkout();
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      const history = await getWorkoutHistory(3);
      setRecentSessions(history);
      setIsInitialized(true);
    };
    init();
  }, []);

  const handleStartWorkout = async (workoutType: 'A' | 'B') => {
    try {
      const session = await createWorkoutSession('5x5', workoutType);
      dispatch({ type: 'START_SESSION', payload: session });
      router.push('/workout');
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  const handleFinishWorkout = async () => {
    if (!state.currentSession) return;
    try {
      await completeWorkoutSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
      router.push('/history');
    } catch (error) {
      console.error('Failed to finish workout:', error);
    }
  };

  const handleAbandonWorkout = async () => {
    if (!state.currentSession) return;
    try {
      await abandonWorkoutSession(state.currentSession.id);
      dispatch({ type: 'CLEAR_SESSION' });
    } catch (error) {
      console.error('Failed to abandon workout:', error);
    }
  };

  const handleResumeWorkout = () => {
    router.push('/workout');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <Card>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-zinc-50">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-2">
              Ready to train today?
            </p>
          </div>

          {/* Current Streak - Future Feature */}
          {/* <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">7</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-500">Day Streak</div>
            </div>
          </div> */}
        </div>
      </Card>

      {/* Active Session or Quick Start */}
      <Card>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-zinc-50">
            {state.currentSession ? 'Resume Workout' : 'Quick Start'}
          </h2>

          {state.currentSession ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  In Progress
                </p>
                <p className="text-base sm:text-lg font-semibold text-black dark:text-zinc-50">
                  Workout {state.currentSession.workoutType}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                  {state.currentSession.exercises.length} exercises
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleResumeWorkout}
                  className="flex-1"
                >
                  Resume
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleAbandonWorkout}
                  className="flex-1"
                >
                  Abandon
                </Button>
              </div>
            </div>
          ) : (
            <WorkoutControls
              onStart={handleStartWorkout}
              onFinish={handleFinishWorkout}
              onAbandon={handleAbandonWorkout}
              hasActiveSession={false}
            />
          )}
        </div>
      </Card>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-zinc-50">
              Recent Workouts
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/history')}
              className="min-h-[44px]"
            >
              View All
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {recentSessions.slice(0, 3).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => router.push('/history')}
              />
            ))}
          </div>
        </div>
      )}

      {/* About 5x5 Program */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-zinc-50">
            What is StrongLifts 5x5?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A simple, effective strength training program using just 5 compound exercises.
            Perfect for beginners and intermediates looking to build real strength.
          </p>

          {/* Workout Structure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Workout A</h3>
              <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                <li>Squat 5×5</li>
                <li>Bench Press 5×5</li>
                <li>Barbell Row 5×5</li>
              </ul>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900">
              <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Workout B</h3>
              <ul className="text-xs text-purple-600 dark:text-purple-300 space-y-1">
                <li>Squat 5×5</li>
                <li>Overhead Press 5×5</li>
                <li>Deadlift 1×5</li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-3">
            <h3 className="font-medium text-black dark:text-zinc-50">How It Works</h3>
            <div className="grid gap-2">
              <div className="flex items-start gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-black dark:text-zinc-200">Train 3x/week</span> — Alternate between Workout A and B with rest days between
                </p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-black dark:text-zinc-200">5 sets × 5 reps</span> — Same weight across all sets (except Deadlift: 1×5)
                </p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-black dark:text-zinc-200">Add weight</span> — Complete all reps? Add 2.5kg next session
                </p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">!</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-black dark:text-zinc-200">Deload</span> — Miss reps 3 times in a row? Drop weight by 10%
                </p>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">Simple</span>
            <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">Progressive</span>
            <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">Full Body</span>
            <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">3x per Week</span>
            <span className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">~45 min</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
