"use client";

/**
 * WORKOUT CONTEXT
 *
 * Provides global state management for the workout tracking app.
 * Manages both the active workout session and syncs with localStorage.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  WorkoutSession,
  WorkoutTemplate,
  SetData,
  WorkoutSessionExercise,
} from "@/types/workout";
import {
  getActiveWorkout,
  saveActiveWorkout,
  clearActiveWorkout,
  saveSession,
  calculateTotalVolume,
  generateId,
} from "@/lib/storage";

interface WorkoutContextType {
  activeWorkout: WorkoutSession | null;
  startWorkout: (template: WorkoutTemplate) => void;
  updateExerciseSet: (
    exerciseIndex: number,
    setIndex: number,
    data: Partial<SetData>
  ) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  markExerciseComplete: (exerciseIndex: number, completed: boolean) => void;
  swapExercise: (exerciseIndex: number, newExercise: WorkoutSessionExercise) => void;
  finishWorkout: () => void;
  cancelWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(
    null
  );

  // Load active workout from localStorage on mount
  useEffect(() => {
    const saved = getActiveWorkout();
    if (saved) {
      setActiveWorkout(saved);
    }
  }, []);

  // Sync active workout to localStorage whenever it changes
  useEffect(() => {
    if (activeWorkout) {
      saveActiveWorkout(activeWorkout);
    }
  }, [activeWorkout]);

  /**
   * Start a new workout from a template
   */
  const startWorkout = (template: WorkoutTemplate) => {
    const newSession: WorkoutSession = {
      id: generateId(),
      templateId: template.id,
      name: template.name,
      date: new Date().toISOString().split("T")[0],
      muscles: template.muscles,
      defaultRestSeconds: template.defaultRestSeconds,
      exercises: template.exercises.map((ex) => ({
        templateId: ex.id,
        title: ex.title,
        muscleGroup: ex.muscleGroup,
        description: ex.description,
        sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
          setNumber: i + 1,
          reps: 0,
          weight: 0,
        })),
        completed: false,
      })),
      startedAt: new Date().toISOString(),
    };

    setActiveWorkout(newSession);
  };

  /**
   * Update a specific set's data (reps or weight)
   */
  const updateExerciseSet = (
    exerciseIndex: number,
    setIndex: number,
    data: Partial<SetData>
  ) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const exercise = updated.exercises[exerciseIndex];

    if (exercise && exercise.sets[setIndex]) {
      exercise.sets[setIndex] = {
        ...exercise.sets[setIndex],
        ...data,
      };
      setActiveWorkout(updated);
    }
  };

  /**
   * Add a new set to an exercise
   * Prefills with values from the last set if available
   */
  const addSet = (exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const exercise = updated.exercises[exerciseIndex];

    if (exercise) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet: SetData = {
        setNumber: exercise.sets.length + 1,
        reps: lastSet?.reps || 0,
        weight: lastSet?.weight || 0,
      };
      exercise.sets.push(newSet);
      setActiveWorkout(updated);
    }
  };

  /**
   * Remove a set from an exercise
   */
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const exercise = updated.exercises[exerciseIndex];

    if (exercise && exercise.sets.length > 1) {
      exercise.sets.splice(setIndex, 1);
      // Renumber remaining sets
      exercise.sets.forEach((set, idx) => {
        set.setNumber = idx + 1;
      });
      setActiveWorkout(updated);
    }
  };

  /**
   * Mark an exercise as completed or not
   */
  const markExerciseComplete = (exerciseIndex: number, completed: boolean) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const exercise = updated.exercises[exerciseIndex];

    if (exercise) {
      exercise.completed = completed;
      setActiveWorkout(updated);
    }
  };

  /**
   * Swap an exercise with a different one
   */
  const swapExercise = (
    exerciseIndex: number,
    newExercise: WorkoutSessionExercise
  ) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const oldExercise = updated.exercises[exerciseIndex];

    // Keep the sets from the old exercise if possible
    const updatedExercise: WorkoutSessionExercise = {
      ...newExercise,
      sets: oldExercise.sets.length > 0 ? oldExercise.sets : newExercise.sets,
      completed: false,
    };

    updated.exercises[exerciseIndex] = updatedExercise;
    setActiveWorkout(updated);
  };

  /**
   * Finish the workout and save to history
   */
  const finishWorkout = () => {
    if (!activeWorkout) return;

    const finishedAt = new Date().toISOString();
    const startedAt = new Date(activeWorkout.startedAt);
    const finishedAtDate = new Date(finishedAt);
    const durationSeconds = Math.floor(
      (finishedAtDate.getTime() - startedAt.getTime()) / 1000
    );

    const completedSession: WorkoutSession = {
      ...activeWorkout,
      finishedAt,
      totalDurationSeconds: durationSeconds,
      totalVolume: calculateTotalVolume(activeWorkout),
    };

    saveSession(completedSession);
    clearActiveWorkout();
    setActiveWorkout(null);
  };

  /**
   * Cancel the current workout without saving
   */
  const cancelWorkout = () => {
    clearActiveWorkout();
    setActiveWorkout(null);
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        updateExerciseSet,
        addSet,
        removeSet,
        markExerciseComplete,
        swapExercise,
        finishWorkout,
        cancelWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

/**
 * Hook to access workout context
 */
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
}
