import { getDB } from './index';
import type { WorkoutSession } from './schema';

export async function getSessionById(id: string): Promise<WorkoutSession | undefined> {
  const db = await getDB();
  return db.get('workoutSessions', id);
}

export async function createSession(
  session: Omit<WorkoutSession, 'id'>
): Promise<WorkoutSession> {
  const db = await getDB();
  const newSession: WorkoutSession = {
    ...session,
    id: crypto.randomUUID(),
  };
  await db.put('workoutSessions', newSession);
  return newSession;
}

export async function updateSession(
  id: string,
  updates: Partial<WorkoutSession>
): Promise<WorkoutSession> {
  const db = await getDB();
  const existingSession = await db.get('workoutSessions', id);

  if (!existingSession) {
    throw new Error(`Session with id ${id} not found`);
  }

  const updatedSession: WorkoutSession = {
    ...existingSession,
    ...updates,
    id, // Ensure ID is not changed
  };

  await db.put('workoutSessions', updatedSession);
  return updatedSession;
}

export async function getRecentSessions(limit: number = 10): Promise<WorkoutSession[]> {
  const db = await getDB();
  const tx = db.transaction('workoutSessions', 'readonly');
  const index = tx.store.index('by-startedAt');

  // Get all sessions ordered by startedAt (descending)
  const allSessions = await index.getAll();

  // Sort by startedAt descending (most recent first)
  allSessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

  return allSessions.slice(0, limit);
}

export async function getSessionsByStatus(
  status: WorkoutSession['status']
): Promise<WorkoutSession[]> {
  const db = await getDB();
  const tx = db.transaction('workoutSessions', 'readonly');
  const index = tx.store.index('by-status');

  return index.getAll(status);
}

export async function deleteAllSessions(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('workoutSessions', 'readwrite');
  await tx.store.clear();
  await tx.done;
}
