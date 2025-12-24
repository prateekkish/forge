import { getProgressByExercise, updateProgress } from '../db/progress';
import { getExerciseById } from '../db/exercises';
import type { WorkoutSession, WorkoutExercise } from '../db/schema';
import { isExerciseSuccessful } from './workout';

/**
 * Calculate the next recommended weight for an exercise based on progression algorithm
 *
 * Algorithm:
 * - Success (all sets 5x5): +2.5kg for upper body, +5kg for lower body
 * - Failure: same weight next time
 * - 3 consecutive failures: deload 10%
 */
export async function calculateNextWeight(
  exerciseId: string,
  lastSession?: WorkoutSession
): Promise<number> {
  const progress = await getProgressByExercise(exerciseId);
  const exercise = await getExerciseById(exerciseId);

  if (!progress) {
    // No progress record, return default starting weight
    // For most exercises start with 20kg (empty bar)
    return 20;
  }

  // Check if we need to deload (3 consecutive failures)
  if (progress.consecutiveFailures >= 3) {
    // Deload by 10%
    const deloadWeight = progress.currentWeight * 0.9;
    return roundToNearest2_5(deloadWeight);
  }

  // If last session provided, check if it was successful
  if (lastSession) {
    const exerciseInSession = lastSession.exercises.find(
      (ex) => ex.exerciseId === exerciseId
    );

    if (exerciseInSession) {
      const wasSuccessful = isExerciseSuccessful(exerciseInSession);

      if (wasSuccessful) {
        // Increase weight based on exercise type
        const increment = getWeightIncrement(exercise?.name || '');
        return roundToNearest2_5(progress.currentWeight + increment);
      }
    }
  }

  // No increase - use current weight
  return progress.currentWeight;
}

/**
 * Get the weight increment for an exercise based on its type
 * Upper body: +2.5kg
 * Lower body: +5kg
 * Deadlift: +5kg (special case, only 1x5)
 */
function getWeightIncrement(exerciseName: string): number {
  const lowerBodyExercises = ['Squat', 'Deadlift'];
  const upperBodyExercises = ['Bench Press', 'Overhead Press', 'Barbell Row'];

  if (lowerBodyExercises.includes(exerciseName)) {
    return 5; // 5kg for lower body
  }

  if (upperBodyExercises.includes(exerciseName)) {
    return 2.5; // 2.5kg for upper body
  }

  // Default to 2.5kg for unknown exercises
  return 2.5;
}

/**
 * Round weight to nearest 2.5kg (or 5 lbs if using imperial)
 */
function roundToNearest2_5(weight: number): number {
  return Math.round(weight / 2.5) * 2.5;
}

/**
 * Update progress for all exercises in a completed session
 */
export async function updateProgressFromSession(session: WorkoutSession): Promise<void> {
  if (session.status !== 'completed') {
    throw new Error('Can only update progress from completed sessions');
  }

  for (const workoutExercise of session.exercises) {
    await updateExerciseProgress(workoutExercise, session.completedAt || new Date());
  }
}

/**
 * Update progress for a single exercise based on workout performance
 */
async function updateExerciseProgress(
  workoutExercise: WorkoutExercise,
  workoutDate: Date
): Promise<void> {
  const wasSuccessful = isExerciseSuccessful(workoutExercise);
  const progress = await getProgressByExercise(workoutExercise.exerciseId);

  // Get the actual weight used (use first set's completed weight)
  const completedWeight =
    workoutExercise.sets.find((set) => set.completedWeight !== null)?.completedWeight || 0;

  if (!progress) {
    // Create new progress record
    await updateProgress({
      exerciseId: workoutExercise.exerciseId,
      currentWeight: completedWeight,
      unit: 'kg',
      lastWorkoutDate: workoutDate,
      consecutiveSuccesses: wasSuccessful ? 1 : 0,
      consecutiveFailures: wasSuccessful ? 0 : 1,
      personalRecord: completedWeight,
    });
    return;
  }

  // Update existing progress
  const newConsecutiveSuccesses = wasSuccessful ? progress.consecutiveSuccesses + 1 : 0;
  const newConsecutiveFailures = wasSuccessful ? 0 : progress.consecutiveFailures + 1;

  // Calculate next weight based on success/failure
  let nextWeight = progress.currentWeight;

  if (wasSuccessful) {
    // Increase weight
    const exercise = await getExerciseById(workoutExercise.exerciseId);
    const increment = getWeightIncrement(exercise?.name || '');
    nextWeight = roundToNearest2_5(progress.currentWeight + increment);
  } else if (newConsecutiveFailures >= 3) {
    // Deload by 10%
    nextWeight = roundToNearest2_5(progress.currentWeight * 0.9);
  }
  // If failed but < 3 times, keep same weight (no change)

  // Update personal record if this was heavier
  const newPersonalRecord = Math.max(progress.personalRecord, completedWeight);

  await updateProgress({
    exerciseId: workoutExercise.exerciseId,
    currentWeight: nextWeight,
    unit: progress.unit,
    lastWorkoutDate: workoutDate,
    consecutiveSuccesses: newConsecutiveSuccesses,
    consecutiveFailures: newConsecutiveFailures,
    personalRecord: newPersonalRecord,
  });
}
