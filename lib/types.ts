// Temporary types for frontend development
// These will be replaced by /lib/db/schema.ts when backend is ready

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Set {
  id: string;
  setNumber: number;
  targetWeight: number;
  targetReps: number;
  completedWeight: number | null;
  completedReps: number | null;
  completedAt: Date | null;
  skipped: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  sets: Set[];
  notes: string;
  restTimerSeconds: number;
}

export interface WorkoutSession {
  id: string;
  programId: string;
  workoutType: 'A' | 'B';
  startedAt: Date;
  completedAt: Date | null;
  exercises: WorkoutExercise[];
  status: 'in-progress' | 'completed' | 'abandoned';
  duration: number | null;
  notes: string;
}

export interface UserProgress {
  id: string;
  exerciseId: string;
  currentWeight: number;
  unit: 'kg' | 'lbs';
  lastWorkoutDate: Date;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  personalRecord: number;
  updatedAt: Date;
}
