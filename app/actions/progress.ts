
import { getProgressByExercise, getAllProgress } from '@/lib/db/progress';
import { calculateNextWeight } from '@/lib/utils/progression';
import type { UserProgress } from '@/lib/db/schema';

/**
 * Get progress for a specific exercise
 */
export async function getExerciseProgress(exerciseId: string): Promise<UserProgress | null> {
  const progress = await getProgressByExercise(exerciseId);
  return progress || null;
}

/**
 * Get progress for all exercises
 */
export async function getAllExerciseProgress(): Promise<UserProgress[]> {
  return getAllProgress();
}

/**
 * Calculate the recommended weight for an exercise based on progression algorithm
 */
export async function calculateRecommendedWeight(exerciseId: string): Promise<number> {
  return calculateNextWeight(exerciseId);
}
