'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface WorkoutControlsProps {
  onStart: (workoutType: 'A' | 'B') => void;
  onFinish: () => void;
  onAbandon: () => void;
  hasActiveSession: boolean;
}

export function WorkoutControls({
  onStart,
  onFinish,
  onAbandon,
  hasActiveSession,
}: WorkoutControlsProps) {
  const [showAbandonModal, setShowAbandonModal] = useState(false);

  const handleAbandon = () => {
    onAbandon();
    setShowAbandonModal(false);
  };

  if (hasActiveSession) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <Button variant="success" size="lg" onClick={onFinish} className="w-full">
            Finish Workout
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowAbandonModal(true)}
            className="w-full"
          >
            Abandon Workout
          </Button>
        </div>

        <Modal
          isOpen={showAbandonModal}
          onClose={() => setShowAbandonModal(false)}
          title="Abandon Workout?"
        >
          <div className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Are you sure you want to abandon this workout? All progress will be lost.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowAbandonModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAbandon}
                className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Abandon
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button variant="primary" size="lg" onClick={() => onStart('A')} className="w-full">
        Start Workout A
      </Button>
      <Button variant="secondary" size="lg" onClick={() => onStart('B')} className="w-full">
        Start Workout B
      </Button>
    </div>
  );
}
