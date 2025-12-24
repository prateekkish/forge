'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SetFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (difficulty: 'easy' | 'good' | 'hard' | 'failed') => void;
  setNumber: number;
}

export function SetFeedbackModal({
  isOpen,
  onClose,
  onFeedback,
  setNumber,
}: SetFeedbackModalProps) {
  const handleFeedback = (difficulty: 'easy' | 'good' | 'hard' | 'failed') => {
    onFeedback(difficulty);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Set ${setNumber} Complete`}>
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          How did that set feel?
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleFeedback('easy')}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <span className="text-2xl">😊</span>
            <span className="text-sm font-semibold">Easy</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Could do more</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleFeedback('good')}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <span className="text-2xl">👍</span>
            <span className="text-sm font-semibold">Good</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Just right</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleFeedback('hard')}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <span className="text-2xl">😤</span>
            <span className="text-sm font-semibold">Hard</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Very challenging</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleFeedback('failed')}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <span className="text-2xl">❌</span>
            <span className="text-sm font-semibold">Failed</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Couldn't complete</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Skip Feedback
        </Button>
      </div>
    </Modal>
  );
}
