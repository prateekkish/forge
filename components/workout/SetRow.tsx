'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import type { Set } from '@/lib/db/schema';

interface SetRowProps {
  set: Set;
  setNumber: number;
  onUpdate: (data: Partial<Set>) => void;
  onComplete: () => void;
  disabled?: boolean;
  unit: string;
  isActive?: boolean;
}

export function SetRow({
  set,
  setNumber,
  onUpdate,
  onComplete,
  disabled = false,
  unit,
  isActive = false,
}: SetRowProps) {
  const isComplete = set.completedAt !== null;
  const isPending = !isComplete && set.completedWeight === null && set.completedReps === null;

  const handleWeightChange = (value: string | number) => {
    const numValue = Number(value);
    onUpdate({
      completedWeight: numValue,
      completedReps: set.completedReps ?? set.targetReps // Initialize reps if not set
    });
  };

  const handleRepsChange = (value: string | number) => {
    const numValue = Number(value);
    onUpdate({
      completedReps: numValue,
      completedWeight: set.completedWeight ?? set.targetWeight // Initialize weight if not set
    });
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
      isComplete
        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'
        : isActive
        ? 'bg-emerald-50/50 border-emerald-300 dark:bg-emerald-950/10 dark:border-emerald-800 ring-2 ring-emerald-500/50'
        : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-700'
    }`}>
      {/* Set Number */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
        isComplete
          ? 'bg-emerald-500 text-white'
          : isActive
          ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
          : isPending
          ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
          : 'bg-black dark:bg-white text-white dark:text-black'
      }`}>
        {setNumber}
      </div>

      {/* Weight Input */}
      <div className="flex-1">
        <Input
          type="number"
          value={set.completedWeight ?? set.targetWeight}
          onChange={handleWeightChange}
          unit={unit}
          disabled={disabled || isComplete}
          min={0}
          step={2.5}
          className="h-10 text-base"
        />
      </div>

      {/* Reps Input */}
      <div className="w-20">
        <Input
          type="number"
          value={set.completedReps ?? set.targetReps}
          onChange={handleRepsChange}
          disabled={disabled || isComplete}
          min={0}
          max={20}
          className="h-10 text-base"
        />
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={disabled || isComplete}
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isComplete ? 'bg-emerald-500 cursor-default' : 'bg-black dark:bg-white hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed'}`}
      >
        {isComplete ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
