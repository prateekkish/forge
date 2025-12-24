import type { Set, WorkoutSession, WorkoutExercise } from '../db/schema';

/**
 * Generate empty sets for a new exercise
 */
export function generateEmptySets(count: number, targetReps: number): Set[] {
  const sets: Set[] = [];

  for (let i = 0; i < count; i++) {
    sets.push({
      id: crypto.randomUUID(),
      setNumber: i + 1,
      targetWeight: 0,
      targetReps,
      completedWeight: null,
      completedReps: null,
      completedAt: null,
      skipped: false,
      difficulty: null,
    });
  }

  return sets;
}

/**
 * Calculate the total duration of a workout session in seconds
 */
export function calculateSessionDuration(session: WorkoutSession): number {
  if (!session.completedAt) {
    // Session not completed yet, calculate from start to now
    const now = new Date();
    return Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
  }

  return Math.floor((session.completedAt.getTime() - session.startedAt.getTime()) / 1000);
}

/**
 * Check if all sets in a session are complete
 */
export function isSessionComplete(session: WorkoutSession): boolean {
  return session.exercises.every((exercise) => isExerciseComplete(exercise));
}

/**
 * Check if all sets in an exercise are complete
 */
export function isExerciseComplete(exercise: WorkoutExercise): boolean {
  return exercise.sets.every(
    (set) => set.skipped || (set.completedWeight !== null && set.completedReps !== null)
  );
}

/**
 * Check if an exercise was successfully completed (all reps achieved)
 */
export function isExerciseSuccessful(exercise: WorkoutExercise): boolean {
  return exercise.sets.every(
    (set) => set.skipped || (set.completedReps !== null && set.completedReps >= set.targetReps)
  );
}

/**
 * Count the number of completed sets in an exercise
 */
export function countCompletedSets(exercise: WorkoutExercise): number {
  return exercise.sets.filter(
    (set) => set.completedWeight !== null && set.completedReps !== null
  ).length;
}
