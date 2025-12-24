import { getDB } from './index';
import { getAllExercises } from './exercises';
import type { Program } from './schema';

export async function getProgram(id: string): Promise<Program | undefined> {
  const db = await getDB();
  return db.get('programs', id);
}

export async function seedDefaultProgram(): Promise<void> {
  const db = await getDB();
  const existingProgram = await db.get('programs', '5x5');

  // Only seed if program doesn't exist
  if (existingProgram) {
    return;
  }

  // Get all exercises to map names to IDs
  const exercises = await getAllExercises();

  const exerciseMap = new Map(exercises.map((ex) => [ex.name, ex.id]));

  const strongLifts5x5: Program = {
    id: '5x5',
    name: 'StrongLifts 5x5',
    description:
      'A beginner strength training program focusing on compound lifts with 5 sets of 5 reps, 3 times per week.',
    workouts: {
      A: [
        exerciseMap.get('Squat') || '',
        exerciseMap.get('Bench Press') || '',
        exerciseMap.get('Barbell Row') || '',
      ],
      B: [
        exerciseMap.get('Squat') || '',
        exerciseMap.get('Overhead Press') || '',
        exerciseMap.get('Deadlift') || '',
      ],
    },
    defaultSets: 5,
    defaultReps: 5,
    defaultRestTime: 180,
  };

  await db.put('programs', strongLifts5x5);
}
