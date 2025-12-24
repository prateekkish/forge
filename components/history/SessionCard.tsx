'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import type { WorkoutSession } from '@/lib/db/schema';

interface SessionCardProps {
  session: WorkoutSession;
  onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const totalSets = session.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );

  const isCompleted = session.status === 'completed';

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-all hover:shadow-md ${
        isCompleted
          ? 'border-l-4 border-l-emerald-500'
          : 'border-l-4 border-l-zinc-300 dark:border-l-zinc-700'
      }`}
      padding="md"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          {/* Workout Type & Status */}
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-black dark:text-zinc-50">
              Workout {session.workoutType}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              {session.status}
            </span>
          </div>

          {/* Date & Time */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatDate(session.startedAt)} at {formatTime(session.startedAt)}
          </p>

          {/* Exercise Summary */}
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {session.exercises.length} exercises · {totalSets} sets ·{' '}
            {formatDuration(session.duration)}
          </p>
        </div>

        {/* Arrow Icon */}
        <svg
          className="w-6 h-6 text-zinc-400 dark:text-zinc-600 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Card>
  );
}
