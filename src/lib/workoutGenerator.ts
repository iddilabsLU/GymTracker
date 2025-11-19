/**
 * AUTOMATIC WORKOUT GENERATOR
 *
 * Generates balanced workouts based on muscle groups and time constraints.
 *
 * Algorithm:
 * 1. Filter exercises by selected muscle groups
 * 2. Prioritize compound movements first
 * 3. Add isolation exercises for targeted work
 * 4. Add finisher if time permits
 * 5. Balance push/pull/legs when multiple groups selected
 * 6. Avoid duplicate exercises
 * 7. Respect duration constraints
 */

import { EXERCISE_DATABASE } from "@/data/exerciseDatabase";
import type {
  ExerciseTemplate,
  MuscleGroup,
  WorkoutTemplate,
  WorkoutGenerationPreferences,
} from "@/types/workout";
import { generateId } from "./storage";

// Constants for workout generation
const AVG_TIME_PER_SET_SECONDS = 40;
const AVG_REST_BETWEEN_EXERCISES_SECONDS = 60;

/**
 * Calculate estimated exercise duration in seconds
 */
function estimateExerciseDuration(exercise: ExerciseTemplate, workoutRestTime: number): number {
  const sets = exercise.defaultSets;
  const restTime = exercise.restSeconds || workoutRestTime;

  // Time = (sets × time_per_set) + ((sets - 1) × rest_time)
  const totalSetTime = sets * AVG_TIME_PER_SET_SECONDS;
  const totalRestTime = (sets - 1) * restTime;

  return totalSetTime + totalRestTime;
}

/**
 * Categorize muscle groups into push/pull/legs for balance
 */
function getMuscleCategory(muscle: MuscleGroup): "push" | "pull" | "legs" | "other" {
  if (muscle === "Chest" || muscle === "Shoulders") return "push";
  if (muscle === "Back") return "pull";
  if (muscle === "Legs") return "legs";
  if (muscle === "Arms") return "push"; // Simplified - could be split
  return "other";
}

/**
 * Filter exercises by muscle groups (including secondary muscles)
 */
function filterExercisesByMuscles(
  muscles: MuscleGroup[],
  category?: "compound" | "isolation" | "finisher"
): ExerciseTemplate[] {
  return EXERCISE_DATABASE.filter((ex) => {
    // Check if primary muscle matches
    const primaryMatch = muscles.includes(ex.muscleGroup);

    // Check if any secondary muscle matches
    const secondaryMatch = ex.secondaryMuscles?.some((m) => muscles.includes(m));

    // Category filter if provided
    const categoryMatch = !category || ex.category === category;

    return (primaryMatch || secondaryMatch) && categoryMatch;
  });
}

/**
 * Select exercises ensuring variety and balance
 */
function selectExercises(
  availableExercises: ExerciseTemplate[],
  count: number,
  excludeIds: Set<string> = new Set()
): ExerciseTemplate[] {
  // Filter out already selected exercises
  const filtered = availableExercises.filter((ex) => !excludeIds.has(ex.id));

  // Shuffle for variety
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  // Select up to count exercises
  return shuffled.slice(0, count);
}

/**
 * Balance muscle groups across push/pull/legs
 */
function balanceExerciseSelection(
  muscles: MuscleGroup[],
  totalExerciseCount: number
): Map<MuscleGroup, number> {
  const distribution = new Map<MuscleGroup, number>();

  // If only one muscle group, use all exercises for it
  if (muscles.length === 1) {
    distribution.set(muscles[0], totalExerciseCount);
    return distribution;
  }

  // Categorize muscles
  const push = muscles.filter((m) => getMuscleCategory(m) === "push");
  const pull = muscles.filter((m) => getMuscleCategory(m) === "pull");
  const legs = muscles.filter((m) => getMuscleCategory(m) === "legs");
  const other = muscles.filter((m) => getMuscleCategory(m) === "other");

  // Calculate distribution
  const categories = [
    { muscles: push, count: push.length },
    { muscles: pull, count: pull.length },
    { muscles: legs, count: legs.length },
    { muscles: other, count: other.length },
  ].filter((cat) => cat.count > 0);

  const exercisesPerCategory = Math.floor(totalExerciseCount / categories.length);
  const remainder = totalExerciseCount % categories.length;

  // Distribute exercises
  categories.forEach((cat, index) => {
    const exercisesPerMuscle = Math.floor(exercisesPerCategory / cat.count);
    const extra = index < remainder ? 1 : 0;

    cat.muscles.forEach((muscle) => {
      distribution.set(muscle, exercisesPerMuscle + (extra / cat.count > 0.5 ? 1 : 0));
    });
  });

  return distribution;
}

/**
 * Generate a complete workout based on preferences
 */
export function generateWorkout(
  preferences: WorkoutGenerationPreferences
): WorkoutTemplate {
  const {
    muscleGroups,
    durationMinutes = 60,
    difficulty,
    exerciseCount,
  } = preferences;

  // Default rest time based on workout type
  const defaultRestSeconds = muscleGroups.includes("Legs") ? 90 : 60;

  // Calculate target number of exercises
  const targetExerciseCount = exerciseCount || estimateExerciseCount(durationMinutes, defaultRestSeconds);

  // Distribution: 50% compound, 35% isolation, 15% finisher
  const compoundCount = Math.ceil(targetExerciseCount * 0.5);
  const isolationCount = Math.ceil(targetExerciseCount * 0.35);
  const finisherCount = Math.max(1, Math.floor(targetExerciseCount * 0.15));

  const selectedExercises: ExerciseTemplate[] = [];
  const usedIds = new Set<string>();

  // 1. SELECT COMPOUND EXERCISES (foundational movements)
  const compoundExercises = filterExercisesByMuscles(muscleGroups, "compound");
  const selectedCompounds = selectExercises(compoundExercises, compoundCount, usedIds);
  selectedCompounds.forEach((ex) => {
    selectedExercises.push(ex);
    usedIds.add(ex.id);
  });

  // 2. SELECT ISOLATION EXERCISES (targeted work)
  const isolationExercises = filterExercisesByMuscles(muscleGroups, "isolation");
  const selectedIsolations = selectExercises(isolationExercises, isolationCount, usedIds);
  selectedIsolations.forEach((ex) => {
    selectedExercises.push(ex);
    usedIds.add(ex.id);
  });

  // 3. SELECT FINISHER EXERCISES (burnout)
  const finisherExercises = filterExercisesByMuscles(muscleGroups, "finisher");
  const selectedFinishers = selectExercises(finisherExercises, finisherCount, usedIds);
  selectedFinishers.forEach((ex) => {
    selectedExercises.push(ex);
    usedIds.add(ex.id);
  });

  // 4. ORGANIZE IN LOGICAL ORDER
  // Compound → Isolation → Finisher
  const orderedExercises = [
    ...selectedCompounds,
    ...selectedIsolations,
    ...selectedFinishers,
  ];

  // 5. FILTER BY DIFFICULTY (if specified)
  let finalExercises = orderedExercises;
  if (difficulty) {
    finalExercises = orderedExercises.filter((ex) => {
      if (!ex.difficulty) return true;
      if (difficulty === "beginner") return ex.difficulty === "beginner";
      if (difficulty === "intermediate") return ex.difficulty !== "advanced";
      return true; // Advanced can do all
    });
  }

  // Ensure we have at least some exercises
  if (finalExercises.length === 0) {
    // Fallback: just get any exercises for these muscles
    const fallback = filterExercisesByMuscles(muscleGroups);
    finalExercises = selectExercises(fallback, 5);
  }

  // 6. CREATE WORKOUT NAME
  const workoutName = generateWorkoutName(muscleGroups);

  // 7. BUILD WORKOUT TEMPLATE
  const workout: WorkoutTemplate = {
    id: generateId(),
    name: workoutName,
    date: new Date().toISOString().split("T")[0],
    muscles: muscleGroups,
    exercises: finalExercises,
    defaultRestSeconds,
    estimatedDurationMinutes: durationMinutes,
  };

  return workout;
}

/**
 * Estimate how many exercises fit in given duration
 */
function estimateExerciseCount(durationMinutes: number, defaultRestSeconds: number): number {
  const durationSeconds = durationMinutes * 60;

  // Average exercise takes: 3 sets × 40s + 2 rests × rest_time + transition
  const avgExerciseDuration = (3 * AVG_TIME_PER_SET_SECONDS) + (2 * defaultRestSeconds) + AVG_REST_BETWEEN_EXERCISES_SECONDS;

  const count = Math.floor(durationSeconds / avgExerciseDuration);

  // Clamp between 3 and 12 exercises
  return Math.max(3, Math.min(12, count));
}

/**
 * Generate a descriptive workout name
 */
function generateWorkoutName(muscles: MuscleGroup[]): string {
  if (muscles.length === 1) {
    return `${muscles[0]} Day`;
  }

  if (muscles.length === 2) {
    return `${muscles[0]} & ${muscles[1]}`;
  }

  // Check for common patterns
  const hasChest = muscles.includes("Chest");
  const hasShoulders = muscles.includes("Shoulders");
  const hasArms = muscles.includes("Arms");
  const hasBack = muscles.includes("Back");
  const hasLegs = muscles.includes("Legs");

  if (hasChest && hasShoulders && hasArms) return "Push Day";
  if (hasBack && hasArms) return "Pull Day";
  if (hasLegs) return "Leg Day";
  if (hasChest && hasBack) return "Upper Body";

  // Default: list first two + "more"
  if (muscles.length > 2) {
    return `${muscles[0]}, ${muscles[1]} + More`;
  }

  return "Full Body Workout";
}

/**
 * Get exercise recommendations for a muscle group
 */
export function getRecommendedExercises(
  muscle: MuscleGroup,
  category: "compound" | "isolation" | "finisher",
  count: number = 5
): ExerciseTemplate[] {
  const exercises = EXERCISE_DATABASE.filter(
    (ex) => ex.muscleGroup === muscle && ex.category === category
  );

  return exercises.slice(0, count);
}

/**
 * Quick workout presets
 */
export const WORKOUT_PRESETS = {
  pushDay: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Chest", "Shoulders", "Arms"],
      durationMinutes: 60,
    }),

  pullDay: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Back", "Arms"],
      durationMinutes: 60,
    }),

  legDay: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Legs", "Core"],
      durationMinutes: 60,
    }),

  fullBody: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Chest", "Back", "Legs"],
      durationMinutes: 75,
    }),

  upperBody: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
      durationMinutes: 75,
    }),

  quickWorkout: (): WorkoutTemplate =>
    generateWorkout({
      muscleGroups: ["Chest", "Back"],
      durationMinutes: 30,
      exerciseCount: 4,
    }),
};
