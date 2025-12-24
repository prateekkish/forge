// Database schema and TypeScript interfaces for 5x5 Workout Tracker

export interface Exercise {
  id: string;              // UUID
  name: string;            // "Squat", "Bench Press", "Barbell Row", "Overhead Press", "Deadlift"
  category: string;        // "compound", "isolation"
  muscleGroups: string[];  // ["legs", "back", "chest", etc.]
  createdAt: Date;
  updatedAt: Date;
}

export interface Set {
  id: string;              // UUID
  setNumber: number;       // 1-5 for 5x5
  targetWeight: number;    // In kg or lbs
  targetReps: number;      // Target reps (5 for 5x5)
  completedWeight: number | null;  // Actual weight used
  completedReps: number | null;    // Actual reps completed
  completedAt: Date | null;
  skipped: boolean;        // If user skipped this set
  difficulty: 'easy' | 'good' | 'hard' | 'failed' | null; // User feedback on set difficulty
}

export interface WorkoutExercise {
  id: string;              // UUID
  exerciseId: string;      // Reference to Exercise
  orderIndex: number;      // Order in workout (0-based)
  sets: Set[];             // Array of 5 sets
  notes: string;           // Optional exercise notes
  restTimerSeconds: number; // Rest time between sets (default: 180s)
}

export interface WorkoutSession {
  id: string;              // UUID
  programId: string;       // "5x5" (extensible for future programs)
  workoutType: "A" | "B";  // For 5x5: Workout A or B
  startedAt: Date;
  completedAt: Date | null;
  exercises: WorkoutExercise[];
  status: "in-progress" | "completed" | "abandoned";
  duration: number | null;  // Total workout time in seconds
  notes: string;            // Optional session notes
}

export interface Program {
  id: string;              // "5x5"
  name: string;            // "StrongLifts 5x5"
  description: string;
  workouts: {
    A: string[];           // Array of exercise IDs for Workout A
    B: string[];           // Array of exercise IDs for Workout B
  };
  defaultSets: number;     // 5
  defaultReps: number;     // 5
  defaultRestTime: number; // 180 seconds
}

export interface UserProgress {
  id: string;
  exerciseId: string;
  currentWeight: number;   // Current working weight
  unit: "kg" | "lbs";
  lastWorkoutDate: Date;
  consecutiveSuccesses: number;  // For progression tracking
  consecutiveFailures: number;   // For deload tracking
  personalRecord: number;        // All-time max weight
  updatedAt: Date;
}
