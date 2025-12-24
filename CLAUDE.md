# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

5x5 Workout Tracker - A minimalist, mobile-first progressive web app built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Implements the StrongLifts 5x5 program with local-first data storage using IndexedDB.

## Tech Stack

- **Frontend**: Next.js 16.1.1 (App Router), React 19.2.3, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Data**: IndexedDB via `idb` library for offline-first storage
- **State**: React Context API + useReducer (`/contexts/WorkoutContext.tsx`)

## Development Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint (ESLint)
npm run lint
```

## Architecture Overview

### Data Layer (`/lib/db/`)
- **schema.ts** - TypeScript interfaces for all data models (Exercise, Set, WorkoutExercise, WorkoutSession, Program, UserProgress)
- **index.ts** - IndexedDB initialization and connection management
- **exercises.ts** - CRUD operations for exercises
- **sessions.ts** - Session management (create, update, query)
- **progress.ts** - User progress tracking and retrieval
- **programs.ts** - Program definitions (5x5)

### Utilities (`/lib/utils/`)
- **workout.ts** - Workout calculations (duration, completion status, empty set generation)
- **progression.ts** - Weight progression algorithm (5x5 rules: +2.5kg on success, deload on 3 failures)

### Server Actions (`/app/actions/`)
Next.js server actions that wrap database operations:
- **sessions.ts** - `createWorkoutSession()`, `completeWorkoutSession()`, `getWorkoutHistory()`, `getCurrentSession()`
- **exercises.ts** - Exercise retrieval
- **progress.ts** - Progress tracking and weight calculation
- **init.ts** - Database initialization and seeding

### Global State (`/contexts/WorkoutContext.tsx`)
React Context provider managing:
- Current active workout session
- Rest timer state (active/remaining time)
- Selected exercise index
- User settings (units, default rest time, sound)

**Usage**: Components use `useWorkout()` hook to access `state` and `dispatch`

### UI Components (`/components/`)

**Base UI (`/ui/`)**:
- Button.tsx - 4 variants (primary, secondary, success, ghost), 3 sizes
- Input.tsx - Number/text input with optional unit badge
- Card.tsx - Container with configurable padding
- Modal.tsx - Full-screen overlay modal

**Workout (`/workout/`)**:
- WorkoutSession.tsx - Main workout container, exercise navigation
- ExerciseCard.tsx - Exercise display with 5 sets
- SetRow.tsx - Individual set input (weight/reps/completion)
- RestTimer.tsx - Countdown timer with circular progress
- WorkoutControls.tsx - Start/finish/abandon buttons

**History (`/history/`)**:
- SessionList.tsx - List of past workouts
- SessionCard.tsx - Workout summary card
- SessionDetails.tsx - Detailed session view modal

**Layout (`/layout/`)**:
- Header.tsx - App header with title and settings
- BottomNav.tsx - Mobile bottom navigation

### Pages (`/app/`)

- **page.tsx** - Dashboard (quick start, recent sessions)
- **workout/page.tsx** - Active workout session page
- **history/page.tsx** - Workout history list
- **settings/page.tsx** - User preferences (units, rest time, sound)
- **layout.tsx** - Root layout with WorkoutProvider, Header, BottomNav

## Design System

### Color Palette
- Background: `zinc-50` (light) / `black` (dark)
- Cards: `white` (light) / `zinc-900` (dark)
- Text: `black` / `zinc-50` with semantic variants (`zinc-600`, `zinc-400`)
- Accent: `emerald-500` for success states
- Borders: `zinc-200` / `zinc-800`

### Touch Targets
Minimum 44px for all interactive elements (mobile-first design)

### Typography
- Geist Sans font family (configured in layout)
- Scale: text-3xl (h1), text-2xl (h2), text-xl (h3), text-base (body)

## 5x5 Program Logic

### Workout Structure
- **Workout A**: Squat, Bench Press, Barbell Row (5x5)
- **Workout B**: Squat, Overhead Press, Deadlift (1x5 for deadlift only)

### Progression Rules (implemented in `/lib/utils/progression.ts`)
- Complete all reps (5x5): increase weight by 2.5kg next session
- Fail to complete 3 sessions in a row: deload by 10%
- Track personal records and consecutive successes/failures

### Special Cases
- Deadlift: 1x5 instead of 5x5
- Starting weights: Default 20kg if no progress history

## Data Flow

1. **Start Workout**: `createWorkoutSession()` → creates session with exercises and recommended weights from progress
2. **During Workout**: UI updates → dispatch to Context → persists to localStorage (session restoration)
3. **Complete Workout**: `completeWorkoutSession()` → updates status → calculates duration → updates progress for each exercise
4. **Progress Update**: Analyzes completed sets → applies progression rules → saves to IndexedDB

## Key Files to Reference

- `/docs/tech-spec.md` - Full technical specification
- `/docs/frontend-tasks.md` - Frontend component requirements
- `/docs/backend-tasks.md` - Backend/data layer requirements
- `/docs/integration-guide.md` - Integration checklist

## Common Development Patterns

### Creating a New Component
```typescript
// Use consistent prop typing
interface ComponentProps {
  // Props here
}

export function Component({ }: ComponentProps) {
  // Implementation
}
```

### Accessing Workout State
```typescript
import { useWorkout } from '@/contexts/WorkoutContext';

const { state, dispatch } = useWorkout();
```

### Database Operations
```typescript
// Always use server actions from /app/actions/
import { createWorkoutSession } from '@/app/actions/sessions';

// Server actions handle IndexedDB operations
const session = await createWorkoutSession('5x5', 'A');
```

### Styling Conventions
- Use Tailwind utility classes
- Dark mode: `dark:` prefix for dark mode variants
- Responsive: Mobile-first, use `sm:`, `lg:` breakpoints sparingly
- Consistent spacing: prefer `gap-4`, `gap-6`, `p-4`, `p-6`

## Important Notes

- **Local-first**: All data stored in IndexedDB, no backend required
- **Offline-capable**: App works completely offline
- **Session persistence**: Active sessions saved to localStorage, restored on reload
- **Settings persistence**: User preferences saved to localStorage
- **Type safety**: Strict TypeScript mode, no `any` types
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation
- **Dark mode**: Full support via Tailwind's `dark:` variants

## Testing Workflow

1. Start dev server: `npm run dev`
2. Test workout flow: Start Workout A → Enter sets → Complete → Check history
3. Test settings: Change units → Verify in workout inputs
4. Test persistence: Refresh page → Verify session/settings restored
5. Test dark mode: Toggle system dark mode → Verify all components
