/**
 * STORAGE LAYER
 *
 * Handles all data persistence using localStorage.
 * All data is stored locally - no backend required.
 *
 * Key functions:
 * - Template management (save/load workout templates)
 * - Session management (save/load completed workout sessions)
 * - Active workout state (persist current workout in progress)
 * - Builder state (persist workout builder configuration)
 */

import {
  WorkoutTemplate,
  WorkoutSession,
  STORAGE_KEYS,
} from "@/types/workout";

// TYPE-SAFE LOCAL STORAGE HELPERS

/**
 * Safely get item from localStorage with type safety
 */
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

// WORKOUT TEMPLATES

/**
 * Get all saved workout templates
 */
export function getTemplates(): WorkoutTemplate[] {
  return getStorageItem<WorkoutTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
}

/**
 * Save a workout template (creates new or updates existing)
 */
export function saveTemplate(template: WorkoutTemplate): void {
  const templates = getTemplates();
  const existingIndex = templates.findIndex((t) => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  setStorageItem(STORAGE_KEYS.TEMPLATES, templates);
}

/**
 * Delete a workout template by ID
 */
export function deleteTemplate(id: string): void {
  const templates = getTemplates();
  const filtered = templates.filter((t) => t.id !== id);
  setStorageItem(STORAGE_KEYS.TEMPLATES, filtered);
}

/**
 * Get a single template by ID
 */
export function getTemplateById(id: string): WorkoutTemplate | null {
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

// WORKOUT SESSIONS (HISTORY)

/**
 * Get all completed workout sessions, sorted by date (most recent first)
 */
export function getSessions(): WorkoutSession[] {
  const sessions = getStorageItem<WorkoutSession[]>(STORAGE_KEYS.SESSIONS, []);
  return sessions.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

/**
 * Save a completed workout session
 */
export function saveSession(session: WorkoutSession): void {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  setStorageItem(STORAGE_KEYS.SESSIONS, sessions);
}

/**
 * Get recent sessions (default: last 5)
 */
export function getRecentSessions(limit: number = 5): WorkoutSession[] {
  return getSessions().slice(0, limit);
}

/**
 * Get a single session by ID
 */
export function getSessionById(id: string): WorkoutSession | null {
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Delete a workout session by ID
 */
export function deleteSession(id: string): void {
  const sessions = getSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SESSIONS, filtered);
}

// ACTIVE WORKOUT

/**
 * Get the currently active workout (in progress)
 */
export function getActiveWorkout(): WorkoutSession | null {
  return getStorageItem<WorkoutSession | null>(
    STORAGE_KEYS.ACTIVE_WORKOUT,
    null
  );
}

/**
 * Save the active workout state
 */
export function saveActiveWorkout(workout: WorkoutSession | null): void {
  setStorageItem(STORAGE_KEYS.ACTIVE_WORKOUT, workout);
}

/**
 * Clear the active workout (called when workout is finished or cancelled)
 */
export function clearActiveWorkout(): void {
  saveActiveWorkout(null);
}

// BUILDER STATE

/**
 * Get the saved builder state (for persistence across page reloads)
 */
export function getBuilderState(): WorkoutTemplate | null {
  return getStorageItem<WorkoutTemplate | null>(
    STORAGE_KEYS.BUILDER_STATE,
    null
  );
}

/**
 * Save the builder state
 */
export function saveBuilderState(state: WorkoutTemplate | null): void {
  setStorageItem(STORAGE_KEYS.BUILDER_STATE, state);
}

/**
 * Clear the builder state
 */
export function clearBuilderState(): void {
  saveBuilderState(null);
}

// UTILITY FUNCTIONS

/**
 * Calculate total volume for a workout session
 * Volume = sum of (weight × reps) for all sets
 */
export function calculateTotalVolume(session: WorkoutSession): number {
  return session.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((sum, set) => {
      return sum + set.weight * set.reps;
    }, 0);
    return total + exerciseVolume;
  }, 0);
}

/**
 * Calculate total number of sets in a workout
 */
export function calculateTotalSets(session: WorkoutSession): number {
  return session.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
}

/**
 * Estimate workout duration in seconds based on template
 * Formula: (total_sets × avg_time_per_set) + (total_rests × rest_time)
 */
export function estimateWorkoutDuration(template: WorkoutTemplate): number {
  const avgTimePerSetSeconds = 40; // Average time to perform one set

  const totalSets = template.exercises.reduce(
    (sum, ex) => sum + ex.defaultSets,
    0
  );

  // Calculate total rest time (rest after each set except the last)
  const totalRests = Math.max(0, totalSets - 1);
  const totalRestTime = totalRests * template.defaultRestSeconds;

  const totalSetTime = totalSets * avgTimePerSetSeconds;

  return totalSetTime + totalRestTime;
}

/**
 * Format duration in seconds to readable string (e.g., "1h 23m" or "45m")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Generate a unique ID (simple implementation)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
