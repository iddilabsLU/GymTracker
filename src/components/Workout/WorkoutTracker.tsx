"use client";

/**
 * WORKOUT TRACKER COMPONENT
 *
 * Tracks an active workout session in real-time.
 *
 * Features:
 * - Display workout info and muscles trained
 * - Log sets/reps/weight for each exercise
 * - Quick-fill functionality (prefill next set)
 * - Exercise swapping
 * - Rest timer integration
 * - Workout overview modal
 * - Complete/cancel workout
 * - View workout history
 */

import React, { useState, useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import {
  MuscleGroup,
  WorkoutSession,
  ExerciseTemplate,
  WorkoutSessionExercise,
} from "@/types/workout";
import { EXERCISE_DATABASE } from "@/data/exerciseDatabase";
import {
  getRecentSessions,
  calculateTotalSets,
  formatDuration,
  getTemplates,
  generateId,
} from "@/lib/storage";
import RestTimer from "./RestTimer";

export default function WorkoutTracker() {
  const {
    activeWorkout,
    updateExerciseSet,
    addSet,
    removeSet,
    markExerciseComplete,
    swapExercise,
    finishWorkout,
    cancelWorkout,
  } = useWorkout();

  const [showOverview, setShowOverview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExerciseSwap, setShowExerciseSwap] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time every second
  useEffect(() => {
    if (!activeWorkout) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(activeWorkout.startedAt);
      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div
        id="tracker-section"
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Workout Tracker
        </h2>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
          <p className="mb-2 text-lg">No active workout</p>
          <p className="text-sm">
            Create a workout in the builder above and click &quot;Start Workout&quot;
          </p>
        </div>

        <button
          onClick={() => setShowHistory(true)}
          className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          View History
        </button>

        {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      </div>
    );
  }

  const handleFinish = () => {
    if (
      window.confirm(
        "Are you sure you want to finish this workout? It will be saved to your history."
      )
    ) {
      finishWorkout();
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this workout? All progress will be lost."
      )
    ) {
      cancelWorkout();
    }
  };

  return (
    <div
      id="tracker-section"
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeWorkout.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {activeWorkout.date} • Elapsed: {formatDuration(elapsedTime)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {activeWorkout.muscles.map((muscle) => (
              <span
                key={muscle}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowOverview(true)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Overview
        </button>
      </div>

      {/* Rest Timer */}
      <div className="mb-6">
        <RestTimer
          defaultSeconds={activeWorkout.defaultRestSeconds}
          onComplete={() => {
            // Optional: Show notification
          }}
        />
      </div>

      {/* Exercises */}
      <div className="mb-6 space-y-6">
        {activeWorkout.exercises.map((exercise, exerciseIndex) => (
          <ExerciseCard
            key={exerciseIndex}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            onUpdateSet={(setIndex, data) =>
              updateExerciseSet(exerciseIndex, setIndex, data)
            }
            onAddSet={() => addSet(exerciseIndex)}
            onRemoveSet={(setIndex) => removeSet(exerciseIndex, setIndex)}
            onToggleComplete={(completed) =>
              markExerciseComplete(exerciseIndex, completed)
            }
            onSwap={() => setShowExerciseSwap(exerciseIndex)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleFinish}
          className="flex-1 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Finish Workout
        </button>
      </div>

      {/* Modals */}
      {showOverview && (
        <OverviewModal
          workout={activeWorkout}
          onClose={() => setShowOverview(false)}
        />
      )}
      {showExerciseSwap !== null && (
        <ExerciseSwapModal
          currentExercise={activeWorkout.exercises[showExerciseSwap]}
          onSwap={(newExercise) => {
            swapExercise(showExerciseSwap, newExercise);
            setShowExerciseSwap(null);
          }}
          onClose={() => setShowExerciseSwap(null)}
        />
      )}
    </div>
  );
}

// EXERCISE CARD
interface ExerciseCardProps {
  exercise: WorkoutSessionExercise;
  exerciseIndex: number;
  onUpdateSet: (setIndex: number, data: { reps?: number; weight?: number }) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  onToggleComplete: (completed: boolean) => void;
  onSwap: () => void;
}

function ExerciseCard({
  exercise,
  exerciseIndex,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onToggleComplete,
  onSwap,
}: ExerciseCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        exercise.completed
          ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
          : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50"
      }`}
    >
      {/* Exercise Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {exercise.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {exercise.description}
          </p>
          <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {exercise.muscleGroup}
          </span>
        </div>
        <button
          onClick={onSwap}
          className="ml-2 rounded px-2 py-1 text-sm text-blue-600 hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-600"
          aria-label="Swap exercise"
        >
          Swap
        </button>
      </div>

      {/* Sets Table */}
      <div className="mb-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="pb-2 text-left font-medium text-gray-700 dark:text-gray-300">
                Set
              </th>
              <th className="pb-2 text-left font-medium text-gray-700 dark:text-gray-300">
                Reps
              </th>
              <th className="pb-2 text-left font-medium text-gray-700 dark:text-gray-300">
                Weight (kg)
              </th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set, setIndex) => (
              <tr
                key={setIndex}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-2 font-medium text-gray-900 dark:text-white">
                  {set.setNumber}
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    min="0"
                    value={set.reps || ""}
                    onChange={(e) =>
                      onUpdateSet(setIndex, {
                        reps: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={set.weight || ""}
                    onChange={(e) =>
                      onUpdateSet(setIndex, {
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </td>
                <td className="py-2 text-right">
                  {exercise.sets.length > 1 && (
                    <button
                      onClick={() => onRemoveSet(setIndex)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Remove set"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAddSet}
          className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          + Add Set
        </button>
        <button
          onClick={() => onToggleComplete(!exercise.completed)}
          className={`flex-1 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            exercise.completed
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600"
          }`}
        >
          {exercise.completed ? "Reopen" : "Mark Done"}
        </button>
      </div>
    </div>
  );
}

// OVERVIEW MODAL
interface OverviewModalProps {
  workout: WorkoutSession;
  onClose: () => void;
}

function OverviewModal({ workout, onClose }: OverviewModalProps) {
  const totalSets = calculateTotalSets(workout);
  const totalVolume = workout.exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
    );
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Workout Overview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close overview"
          >
            ×
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Sets
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalSets}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Volume
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalVolume.toFixed(0)} kg
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">
                {exercise.title}
              </h4>
              <div className="space-y-1 text-sm">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex justify-between text-gray-600 dark:text-gray-400"
                  >
                    <span>Set {set.setNumber}</span>
                    <span>
                      {set.reps} reps × {set.weight} kg ={" "}
                      {(set.reps * set.weight).toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// EXERCISE SWAP MODAL
interface ExerciseSwapModalProps {
  currentExercise: WorkoutSessionExercise;
  onSwap: (exercise: WorkoutSessionExercise) => void;
  onClose: () => void;
}

function ExerciseSwapModal({
  currentExercise,
  onSwap,
  onClose,
}: ExerciseSwapModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "All">("All");

  // Merge preloaded database with user's custom exercises
  const templates = getTemplates();
  const userExercises = templates.flatMap((t) => t.exercises);
  const allExercises: ExerciseTemplate[] = [...EXERCISE_DATABASE, ...userExercises];

  // Remove duplicates by title (prioritize database exercises)
  const uniqueExercises = allExercises.filter(
    (exercise, index, self) =>
      index === self.findIndex((e) => e.title === exercise.title)
  );

  // Filter by search and muscle group
  const filteredExercises = uniqueExercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || exercise.muscleGroup === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscles: ("All" | MuscleGroup)[] = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  const handleSwap = (template: ExerciseTemplate) => {
    const newExercise: WorkoutSessionExercise = {
      templateId: template.id,
      title: template.title,
      muscleGroup: template.muscleGroup,
      description: template.description,
      sets: currentExercise.sets,
      completed: false,
    };
    onSwap(newExercise);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Swap Exercise
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close swap modal"
          >
            ×
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Current: <span className="font-medium">{currentExercise.title}</span>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        {/* Muscle filter chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {muscles.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedMuscle === muscle
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>

        {filteredExercises.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No exercises found. Try different filters.
          </div>
        ) : (
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleSwap(exercise)}
                className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {exercise.title}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {exercise.muscleGroup}
                  </span>
                  {exercise.category && (
                    <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      {exercise.category}
                    </span>
                  )}
                  {exercise.difficulty && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {exercise.difficulty}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {exercise.description.slice(0, 80)}...
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// HISTORY MODAL
interface HistoryModalProps {
  onClose: () => void;
}

function HistoryModal({ onClose }: HistoryModalProps) {
  const recentSessions = getRecentSessions(5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Workouts
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close history"
          >
            ×
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No completed workouts yet. Finish a workout to see it here.
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {session.name}
                  </h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.date}
                  </span>
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {session.muscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    Sets: <span className="font-medium">{calculateTotalSets(session)}</span>
                  </div>
                  <div>
                    Volume:{" "}
                    <span className="font-medium">
                      {(session.totalVolume || 0).toFixed(0)} kg
                    </span>
                  </div>
                  <div>
                    Duration:{" "}
                    <span className="font-medium">
                      {formatDuration(session.totalDurationSeconds || 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
