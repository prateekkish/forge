'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { SetRow } from './SetRow';
import { SetFeedbackModal } from './SetFeedbackModal';
import type { WorkoutExercise, Exercise, Set } from '@/lib/db/schema';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseDetails: Exercise;
  onUpdateSet: (setIndex: number, data: Partial<Set>) => void;
  onStartRest: (seconds: number) => void;
  unit: string;
}

export function ExerciseCard({
  exercise,
  exerciseDetails,
  onUpdateSet,
  onStartRest,
  unit,
}: ExerciseCardProps) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null);

  const handleSetComplete = (setIndex: number) => {
    onUpdateSet(setIndex, { completedAt: new Date() });
    setCurrentSetIndex(setIndex);
    setFeedbackModalOpen(true);
    // Start timer immediately when feedback modal opens
    onStartRest(exercise.restTimerSeconds);
  };

  const handleFeedback = (difficulty: 'easy' | 'good' | 'hard' | 'failed') => {
    if (currentSetIndex !== null) {
      onUpdateSet(currentSetIndex, { difficulty });
    }
  };

  const handleSkipFeedback = () => {
    // Timer already started, no action needed
  };

  return (
    <Card className="space-y-4">
      {/* Exercise Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
          {exerciseDetails.name}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {exerciseDetails.muscleGroups.join(', ')}
        </p>
      </div>

      {/* Sets */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => {
          // Find the first incomplete set to mark as active
          const firstIncompleteIndex = exercise.sets.findIndex(s => s.completedAt === null);
          const isActive = index === firstIncompleteIndex && firstIncompleteIndex !== -1;

          return (
            <SetRow
              key={set.id}
              set={set}
              setNumber={index + 1}
              onUpdate={(data) => onUpdateSet(index, data)}
              onComplete={() => handleSetComplete(index)}
              unit={unit}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* Notes Section */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setNotesExpanded(!notesExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${notesExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Notes
        </button>
        {notesExpanded && (
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {exercise.notes || 'No notes for this exercise.'}
          </div>
        )}
      </div>

      {/* Set Feedback Modal */}
      <SetFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          handleSkipFeedback();
        }}
        onFeedback={handleFeedback}
        setNumber={currentSetIndex !== null ? currentSetIndex + 1 : 0}
      />
    </Card>
  );
}
