import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Exercise, WorkoutSession, Program, UserProgress } from './schema';

// Define the database schema
interface WorkoutTrackerDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
  };
  workoutSessions: {
    key: string;
    value: WorkoutSession;
    indexes: {
      'by-startedAt': Date;
      'by-status': WorkoutSession['status'];
    };
  };
  programs: {
    key: string;
    value: Program;
  };
  userProgress: {
    key: string;
    value: UserProgress;
    indexes: {
      'by-exerciseId': string;
    };
  };
}

const DB_NAME = 'workout-tracker-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<WorkoutTrackerDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<WorkoutTrackerDB>> {
  // Check if running in browser
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in the browser');
  }

  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<WorkoutTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create exercises store
      if (!db.objectStoreNames.contains('exercises')) {
        db.createObjectStore('exercises', { keyPath: 'id' });
      }

      // Create workoutSessions store with indexes
      if (!db.objectStoreNames.contains('workoutSessions')) {
        const sessionStore = db.createObjectStore('workoutSessions', { keyPath: 'id' });
        sessionStore.createIndex('by-startedAt', 'startedAt');
        sessionStore.createIndex('by-status', 'status');
      }

      // Create programs store
      if (!db.objectStoreNames.contains('programs')) {
        db.createObjectStore('programs', { keyPath: 'id' });
      }

      // Create userProgress store with index
      if (!db.objectStoreNames.contains('userProgress')) {
        const progressStore = db.createObjectStore('userProgress', { keyPath: 'id' });
        progressStore.createIndex('by-exerciseId', 'exerciseId');
      }
    },
  });

  return dbInstance;
}

export async function getDB(): Promise<IDBPDatabase<WorkoutTrackerDB>> {
  if (!dbInstance) {
    return initDB();
  }
  return dbInstance;
}
