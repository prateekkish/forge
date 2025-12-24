'use client';

import React, { useEffect, useState } from 'react';
import { SessionList } from '@/components/history/SessionList';
import { SessionDetails } from '@/components/history/SessionDetails';
import { getWorkoutHistory } from '@/app/actions/sessions';
import { getExercises } from '@/app/actions/exercises';
import type { WorkoutSession, Exercise } from '@/lib/db/schema';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getWorkoutHistory();
      setSessions(history);
      const allExercises = await getExercises();
      setExercises(allExercises);
    };
    loadHistory();
  }, []);

  const handleSessionClick = (session: WorkoutSession) => {
    setSelectedSession(session);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Workout History
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          View your past workouts and track progress
        </p>
      </div>

      <SessionList sessions={sessions} onSessionClick={handleSessionClick} />

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          exercises={exercises}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
