/**
 * WORKOUT DATA MODELS
 *
 * This file contains all TypeScript types and interfaces for the workout tracking PWA.
 *
 * To extend the muscle groups, edit the MuscleGroup type below.
 * To add new fields to exercises or workouts, extend the respective interfaces.
 */

// MUSCLE GROUPS
// Add or remove muscle groups here as needed
export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Other";

// EXERCISE CATEGORY
// Used for workout generation logic (compound → isolation → finisher)
export type ExerciseCategory = "compound" | "isolation" | "finisher";

// EXERCISE DIFFICULTY
export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

// EQUIPMENT TYPE
export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "bodyweight"
  | "resistance_band"
  | "kettlebell"
  | "other";

// EXERCISE TEMPLATE
// Represents a reusable exercise definition
export interface ExerciseTemplate {
  id: string;
  title: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[]; // Secondary muscles worked
  description: string;
  category: ExerciseCategory; // compound, isolation, or finisher
  difficulty?: ExerciseDifficulty;
  equipment?: EquipmentType[];
  defaultSets: number;
  suggestedReps?: string; // e.g., "8-12", "15-20", "AMRAP"
  restSeconds?: number; // If not set, uses workout default
  isCustom?: boolean; // True if user-created, false if from preloaded database
}

// WORKOUT TEMPLATE
// Represents a reusable workout plan
export interface WorkoutTemplate {
  id: string;
  name: string;
  date: string; // ISO date string
  muscles: MuscleGroup[];
  exercises: ExerciseTemplate[];
  defaultRestSeconds: number; // Default rest time for the workout (in seconds)
  estimatedDurationMinutes?: number; // User input for auto-generation
}

// WORKOUT GENERATION PREFERENCES
export interface WorkoutGenerationPreferences {
  muscleGroups: MuscleGroup[];
  durationMinutes?: number; // Target workout duration
  difficulty?: ExerciseDifficulty;
  availableEquipment?: EquipmentType[];
  exerciseCount?: number; // Optional: specific number of exercises
}

// SET DATA
// Represents a single set within an exercise
export interface SetData {
  setNumber: number;
  reps: number;
  weight: number; // in kg
}

// WORKOUT SESSION EXERCISE
// Represents an exercise within an active or completed workout session
export interface WorkoutSessionExercise {
  templateId?: string; // Reference to original exercise template if applicable
  title: string;
  muscleGroup: MuscleGroup;
  description: string;
  sets: SetData[];
  completed?: boolean; // Whether this exercise is marked as done
}

// WORKOUT SESSION
// Represents an active or completed workout session
export interface WorkoutSession {
  id: string;
  templateId?: string; // Reference to template if created from one
  name: string;
  date: string; // ISO date string
  muscles: MuscleGroup[];
  exercises: WorkoutSessionExercise[];
  defaultRestSeconds: number;
  startedAt: string; // ISO timestamp
  finishedAt?: string; // ISO timestamp when completed
  totalVolume?: number; // Sum of (weight × reps) across all sets
  totalDurationSeconds?: number; // Total time from start to finish
}

// STORAGE KEYS
// localStorage keys used throughout the app
export const STORAGE_KEYS = {
  TEMPLATES: "gym-tracker-templates",
  SESSIONS: "gym-tracker-sessions",
  ACTIVE_WORKOUT: "gym-tracker-active-workout",
  BUILDER_STATE: "gym-tracker-builder-state",
  CUSTOM_EXERCISES: "gym-tracker-custom-exercises", // User's custom exercises
} as const;
