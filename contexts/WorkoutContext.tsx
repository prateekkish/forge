'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { WorkoutSession } from '@/lib/db/schema';

// State interface
export interface WorkoutState {
  currentSession: WorkoutSession | null;
  isRestTimerActive: boolean;
  restTimeRemaining: number;
  restTimeInitial: number;
  selectedExerciseIndex: number;
  settings: {
    unit: 'kg' | 'lbs';
    defaultRestTime: number;
    soundEnabled: boolean;
  };
}

// Action types
export type WorkoutAction =
  | { type: 'START_SESSION'; payload: WorkoutSession }
  | { type: 'UPDATE_SESSION'; payload: WorkoutSession }
  | {
      type: 'UPDATE_SET';
      payload: {
        exerciseIndex: number;
        setIndex: number;
        data: Partial<WorkoutSession['exercises'][0]['sets'][0]>;
      };
    }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'ABANDON_SESSION' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'START_REST_TIMER'; payload: number }
  | { type: 'TICK_REST_TIMER' }
  | { type: 'CANCEL_REST_TIMER' }
  | { type: 'ADJUST_REST_TIMER'; payload: number }
  | { type: 'SET_SELECTED_EXERCISE'; payload: number }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<WorkoutState['settings']> }
  | { type: 'RESTORE_SESSION'; payload: WorkoutSession | null };

// Initial state
const initialState: WorkoutState = {
  currentSession: null,
  isRestTimerActive: false,
  restTimeRemaining: 0,
  restTimeInitial: 0,
  selectedExerciseIndex: 0,
  settings: {
    unit: 'kg',
    defaultRestTime: 180,
    soundEnabled: true,
  },
};

// Reducer function
function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        currentSession: action.payload,
        selectedExerciseIndex: 0,
        isRestTimerActive: false,
        restTimeRemaining: 0,
      };

    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };

    case 'UPDATE_SET': {
      if (!state.currentSession) return state;

      const { exerciseIndex, setIndex, data } = action.payload;
      const updatedExercises = [...state.currentSession.exercises];
      const updatedSets = [...updatedExercises[exerciseIndex].sets];

      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        ...data,
      };

      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedSets,
      };

      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          exercises: updatedExercises,
        },
      };
    }

    case 'COMPLETE_SESSION':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          status: 'completed',
          completedAt: new Date(),
        },
      };

    case 'ABANDON_SESSION':
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          status: 'abandoned',
          completedAt: new Date(),
        },
      };

    case 'CLEAR_SESSION':
      return {
        ...state,
        currentSession: null,
        selectedExerciseIndex: 0,
        isRestTimerActive: false,
        restTimeRemaining: 0,
      };

    case 'START_REST_TIMER':
      return {
        ...state,
        isRestTimerActive: true,
        restTimeRemaining: action.payload,
        restTimeInitial: action.payload,
      };

    case 'TICK_REST_TIMER':
      if (state.restTimeRemaining <= 1) {
        return {
          ...state,
          isRestTimerActive: false,
          restTimeRemaining: 0,
        };
      }
      return {
        ...state,
        restTimeRemaining: state.restTimeRemaining - 1,
      };

    case 'CANCEL_REST_TIMER':
      return {
        ...state,
        isRestTimerActive: false,
        restTimeRemaining: 0,
        restTimeInitial: 0,
      };

    case 'ADJUST_REST_TIMER':
      return {
        ...state,
        restTimeRemaining: Math.max(0, state.restTimeRemaining + action.payload),
      };

    case 'SET_SELECTED_EXERCISE':
      return {
        ...state,
        selectedExerciseIndex: action.payload,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };

    default:
      return state;
  }
}

// Context
const WorkoutContext = createContext<
  | {
      state: WorkoutState;
      dispatch: React.Dispatch<WorkoutAction>;
    }
  | undefined
>(undefined);

// Provider component
export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Persist session to localStorage on changes
  useEffect(() => {
    if (state.currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(state.currentSession));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [state.currentSession]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('workoutSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Restore session from localStorage or IndexedDB on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedSession = localStorage.getItem('currentSession');
      const savedSettings = localStorage.getItem('workoutSettings');

      // Try localStorage first
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          // Convert date strings back to Date objects
          session.startedAt = new Date(session.startedAt);
          if (session.completedAt) {
            session.completedAt = new Date(session.completedAt);
          }
          session.exercises.forEach((exercise: WorkoutSession['exercises'][0]) => {
            exercise.sets.forEach((set) => {
              if (set.completedAt) {
                set.completedAt = new Date(set.completedAt);
              }
            });
          });

          dispatch({ type: 'RESTORE_SESSION', payload: session });
        } catch (error) {
          console.error('Failed to restore session from localStorage:', error);
          localStorage.removeItem('currentSession');
        }
      } else {
        // If not in localStorage, check IndexedDB for in-progress session
        try {
          const { getCurrentSession } = await import('@/app/actions/sessions');
          const inProgressSession = await getCurrentSession();
          if (inProgressSession) {
            dispatch({ type: 'RESTORE_SESSION', payload: inProgressSession });
          }
        } catch (error) {
          console.error('Failed to restore session from IndexedDB:', error);
        }
      }

      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
        } catch (error) {
          console.error('Failed to restore settings:', error);
        }
      }
    };

    restoreSession();
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (!state.isRestTimerActive) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK_REST_TIMER' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRestTimerActive]);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Hook to use workout context
export function useWorkout() {
  const context = useContext(WorkoutContext);

  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }

  return context;
}
