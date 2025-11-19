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

// EXERCISE TEMPLATE
// Represents a reusable exercise definition
export interface ExerciseTemplate {
  id: string;
  title: string;
  muscleGroup: MuscleGroup;
  description: string;
  defaultSets: number;
  restSeconds?: number; // If not set, uses workout default
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
} as const;
