
import { createSession, updateSession, getRecentSessions, getSessionsByStatus, deleteAllSessions } from '@/lib/db/sessions';
import { getProgram } from '@/lib/db/programs';
import { getProgressByExercise } from '@/lib/db/progress';
import { generateEmptySets, calculateSessionDuration, isSessionComplete } from '@/lib/utils/workout';
import { updateProgressFromSession } from '@/lib/utils/progression';
import type { WorkoutSession, WorkoutExercise } from '@/lib/db/schema';

/**
 * Create a new workout session based on program and workout type
 */
export async function createWorkoutSession(
  programId: string,
  workoutType: 'A' | 'B'
): Promise<WorkoutSession> {
  const program = await getProgram(programId);

  if (!program) {
    throw new Error(`Program with id ${programId} not found`);
  }

  const exerciseIds = program.workouts[workoutType];
  const exercises: WorkoutExercise[] = [];

  // Create workout exercises with sets and recommended weights
  for (let i = 0; i < exerciseIds.length; i++) {
    const exerciseId = exerciseIds[i];
    const progress = await getProgressByExercise(exerciseId);

    // Get recommended weight (either from progress or default starting weight)
    const targetWeight = progress?.currentWeight || 20;

    // Special handling for deadlift (1x5 instead of 5x5)
    const sets = exerciseId.includes('deadlift') || exerciseId.includes('Deadlift')
      ? generateEmptySets(1, program.defaultReps)
      : generateEmptySets(program.defaultSets, program.defaultReps);

    // Set target weight for all sets
    sets.forEach((set) => {
      set.targetWeight = targetWeight;
    });

    exercises.push({
      id: crypto.randomUUID(),
      exerciseId,
      orderIndex: i,
      sets,
      notes: '',
      restTimerSeconds: program.defaultRestTime,
    });
  }

  const newSession: Omit<WorkoutSession, 'id'> = {
    programId,
    workoutType,
    startedAt: new Date(),
    completedAt: null,
    exercises,
    status: 'in-progress',
    duration: null,
    notes: '',
  };

  return createSession(newSession);
}

/**
 * Update an existing workout session
 */
export async function updateWorkoutSession(
  id: string,
  updates: Partial<WorkoutSession>
): Promise<WorkoutSession> {
  return updateSession(id, updates);
}

/**
 * Complete a workout session and update progress
 */
export async function completeWorkoutSession(id: string): Promise<WorkoutSession> {
  const completedAt = new Date();

  const session = await updateSession(id, {
    status: 'completed',
    completedAt,
  });

  // Calculate duration
  const duration = calculateSessionDuration(session);
  const updatedSession = await updateSession(id, { duration });

  // Update progress for all exercises
  await updateProgressFromSession(updatedSession);

  return updatedSession;
}

/**
 * Abandon a workout session without updating progress
 */
export async function abandonWorkoutSession(id: string): Promise<WorkoutSession> {
  const completedAt = new Date();

  const session = await updateSession(id, {
    status: 'abandoned',
    completedAt,
  });

  // Calculate duration
  const duration = calculateSessionDuration(session);
  const updatedSession = await updateSession(id, { duration });

  return updatedSession;
}

/**
 * Get workout history with optional limit
 * Excludes in-progress workouts
 */
export async function getWorkoutHistory(limit: number = 10): Promise<WorkoutSession[]> {
  const sessions = await getRecentSessions(limit * 2); // Fetch more to account for filtering
  return sessions
    .filter(session => session.status === 'completed' || session.status === 'abandoned')
    .slice(0, limit);
}

/**
 * Get the current in-progress session, if any
 */
export async function getCurrentSession(): Promise<WorkoutSession | null> {
  const inProgressSessions = await getSessionsByStatus('in-progress');

  // Should only be one in-progress session at a time
  return inProgressSessions[0] || null;
}

/**
 * Delete all workout sessions
 */
export async function clearAllWorkoutHistory(): Promise<void> {
  return deleteAllSessions();
}
