import { getDB } from './index';
import type { UserProgress } from './schema';

export async function getProgressByExercise(
  exerciseId: string
): Promise<UserProgress | undefined> {
  const db = await getDB();
  const tx = db.transaction('userProgress', 'readonly');
  const index = tx.store.index('by-exerciseId');

  const progressList = await index.getAll(exerciseId);

  // Should only be one progress record per exercise
  return progressList[0];
}

export async function updateProgress(
  progress: Partial<UserProgress> & { exerciseId: string }
): Promise<UserProgress> {
  const db = await getDB();

  // Try to find existing progress for this exercise
  const existingProgress = await getProgressByExercise(progress.exerciseId);

  let updatedProgress: UserProgress;

  if (existingProgress) {
    // Update existing progress
    updatedProgress = {
      ...existingProgress,
      ...progress,
      updatedAt: new Date(),
    };
  } else {
    // Create new progress record
    updatedProgress = {
      id: crypto.randomUUID(),
      exerciseId: progress.exerciseId,
      currentWeight: progress.currentWeight ?? 0,
      unit: progress.unit ?? 'kg',
      lastWorkoutDate: progress.lastWorkoutDate ?? new Date(),
      consecutiveSuccesses: progress.consecutiveSuccesses ?? 0,
      consecutiveFailures: progress.consecutiveFailures ?? 0,
      personalRecord: progress.personalRecord ?? progress.currentWeight ?? 0,
      updatedAt: new Date(),
    };
  }

  await db.put('userProgress', updatedProgress);
  return updatedProgress;
}

export async function getAllProgress(): Promise<UserProgress[]> {
  const db = await getDB();
  return db.getAll('userProgress');
}
