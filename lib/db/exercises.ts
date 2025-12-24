import { getDB } from './index';
import type { Exercise } from './schema';

export async function getAllExercises(): Promise<Exercise[]> {
  const db = await getDB();
  return db.getAll('exercises');
}

export async function getExerciseById(id: string): Promise<Exercise | undefined> {
  const db = await getDB();
  return db.get('exercises', id);
}

export async function createExercise(
  exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Exercise> {
  const db = await getDB();
  const now = new Date();
  const newExercise: Exercise = {
    ...exercise,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.put('exercises', newExercise);
  return newExercise;
}

export async function seedDefaultExercises(): Promise<void> {
  const db = await getDB();
  const existingExercises = await db.getAll('exercises');

  // Only seed if no exercises exist
  if (existingExercises.length > 0) {
    return;
  }

  const default5x5Exercises = [
    {
      name: 'Squat',
      category: 'compound',
      muscleGroups: ['legs', 'core'],
    },
    {
      name: 'Bench Press',
      category: 'compound',
      muscleGroups: ['chest', 'triceps', 'shoulders'],
    },
    {
      name: 'Barbell Row',
      category: 'compound',
      muscleGroups: ['back', 'biceps'],
    },
    {
      name: 'Overhead Press',
      category: 'compound',
      muscleGroups: ['shoulders', 'triceps'],
    },
    {
      name: 'Deadlift',
      category: 'compound',
      muscleGroups: ['legs', 'back', 'core'],
    },
  ];

  for (const exercise of default5x5Exercises) {
    await createExercise(exercise);
  }
}
