'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { WorkoutSession, Exercise } from '@/lib/db/schema';

interface SessionDetailsProps {
  session: WorkoutSession;
  exercises: Exercise[];
  onClose: () => void;
}

export function SessionDetails({ session, exercises, onClose }: SessionDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const calculateTotalVolume = () => {
    let volume = 0;
    session.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.completedWeight && set.completedReps) {
          volume += set.completedWeight * set.completedReps;
        }
      });
    });
    return volume;
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Workout ${session.workoutType}`}>
      <div className="space-y-6">
        {/* Session Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Date</span>
            <span className="font-medium text-black dark:text-zinc-50">
              {formatDate(session.startedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Time</span>
            <span className="font-medium text-black dark:text-zinc-50">
              {formatTime(session.startedAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Duration</span>
            <span className="font-medium text-black dark:text-zinc-50">
              {formatDuration(session.duration)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Total Volume</span>
            <span className="font-medium text-black dark:text-zinc-50">
              {calculateTotalVolume().toFixed(0)} kg
            </span>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          {/* Exercises */}
          <div className="space-y-6">
            {session.exercises.map((workoutExercise) => {
              const exerciseDetails = exercises.find(
                (e) => e.id === workoutExercise.exerciseId
              );
              if (!exerciseDetails) return null;

              return (
                <div key={workoutExercise.id} className="space-y-3">
                  <h4 className="font-semibold text-lg text-black dark:text-zinc-50">
                    {exerciseDetails.name}
                  </h4>
                  <div className="space-y-2">
                    {workoutExercise.sets
                      .filter((set) => set.completedAt !== null)
                      .map((set, index) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between text-sm p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                        >
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">
                            Set {index + 1}
                          </span>
                          <span className="font-semibold text-black dark:text-zinc-50">
                            {set.completedWeight} kg × {set.completedReps} reps
                          </span>
                        </div>
                      ))}
                  </div>
                  {workoutExercise.notes && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                      Note: {workoutExercise.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}
