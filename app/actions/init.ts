import { seedDefaultExercises } from '@/lib/db/exercises';
import { seedDefaultProgram } from '@/lib/db/programs';
import { initDB } from '@/lib/db';

/**
 * Initialize the application by seeding default data
 * This should be called when the app first loads (client-side only)
 */
export async function initializeApp(): Promise<void> {
  // Check if running in browser
  if (typeof window === 'undefined') return;

  // Initialize the database
  await initDB();

  // Seed default exercises if they don't exist
  await seedDefaultExercises();

  // Seed default 5x5 program if it doesn't exist
  await seedDefaultProgram();
}
