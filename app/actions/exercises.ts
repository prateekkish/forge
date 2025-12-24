
import { getAllExercises, getExerciseById } from '@/lib/db/exercises';
import type { Exercise } from '@/lib/db/schema';

/**
 * Get all exercises
 */
export async function getExercises(): Promise<Exercise[]> {
  return getAllExercises();
}

/**
 * Get a single exercise by ID
 */
export async function getExercise(id: string): Promise<Exercise | null> {
  const exercise = await getExerciseById(id);
  return exercise || null;
}
