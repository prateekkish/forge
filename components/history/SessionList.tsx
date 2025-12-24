'use client';

import React from 'react';
import { SessionCard } from './SessionCard';
import type { WorkoutSession } from '@/lib/db/schema';

interface SessionListProps {
  sessions: WorkoutSession[];
  onSessionClick: (session: WorkoutSession) => void;
}

export function SessionList({ sessions, onSessionClick }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <svg
          className="w-16 h-16 text-zinc-300 dark:text-zinc-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
            No workouts yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Start your first workout to see it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onClick={() => onSessionClick(session)}
        />
      ))}
    </div>
  );
}
