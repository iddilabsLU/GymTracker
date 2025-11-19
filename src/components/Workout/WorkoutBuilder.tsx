"use client";

/**
 * WORKOUT BUILDER COMPONENT
 *
 * Allows users to create and configure workouts before starting them.
 *
 * Features:
 * - Set workout name, date, and target muscles
 * - Add/remove/reorder exercises
 * - Configure default rest times
 * - Save as template
 * - Estimate total workout duration
 * - Persist state to localStorage
 */

import React, { useState, useEffect } from "react";
import {
  WorkoutTemplate,
  ExerciseTemplate,
  MuscleGroup,
} from "@/types/workout";
import {
  saveTemplate,
  getBuilderState,
  saveBuilderState,
  generateId,
  estimateWorkoutDuration,
  formatDuration,
} from "@/lib/storage";
import { useWorkout } from "@/contexts/WorkoutContext";

// Available muscle groups - edit this array to add/remove options
const MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Other",
];

// Default rest time in seconds - change this to adjust the default
const DEFAULT_REST_SECONDS = 60;

export default function WorkoutBuilder() {
  const { startWorkout } = useWorkout();

  const [workout, setWorkout] = useState<WorkoutTemplate>({
    id: generateId(),
    name: "",
    date: new Date().toISOString().split("T")[0],
    muscles: [],
    exercises: [],
    defaultRestSeconds: DEFAULT_REST_SECONDS,
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null);

  // Load saved builder state on mount
  useEffect(() => {
    const saved = getBuilderState();
    if (saved) {
      setWorkout(saved);
    }
  }, []);

  // Save builder state whenever it changes
  useEffect(() => {
    saveBuilderState(workout);
  }, [workout]);

  const handleMuscleToggle = (muscle: MuscleGroup) => {
    setWorkout((prev) => ({
      ...prev,
      muscles: prev.muscles.includes(muscle)
        ? prev.muscles.filter((m) => m !== muscle)
        : [...prev.muscles, muscle],
    }));
  };

  const handleAddExercise = (exercise: ExerciseTemplate) => {
    if (editingExerciseIndex !== null) {
      // Update existing exercise
      const updated = [...workout.exercises];
      updated[editingExerciseIndex] = exercise;
      setWorkout((prev) => ({ ...prev, exercises: updated }));
      setEditingExerciseIndex(null);
    } else {
      // Add new exercise
      setWorkout((prev) => ({
        ...prev,
        exercises: [...prev.exercises, exercise],
      }));
    }
    setShowExerciseForm(false);
  };

  const handleRemoveExercise = (index: number) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleMoveExercise = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= workout.exercises.length) return;

    const updated = [...workout.exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setWorkout((prev) => ({ ...prev, exercises: updated }));
  };

  const handleSaveTemplate = () => {
    if (!workout.name.trim()) {
      alert("Please enter a workout name");
      return;
    }
    saveTemplate(workout);
    alert("Workout template saved!");
  };

  const handleStartWorkout = () => {
    if (!workout.name.trim()) {
      alert("Please enter a workout name");
      return;
    }
    if (workout.exercises.length === 0) {
      alert("Please add at least one exercise");
      return;
    }
    startWorkout(workout);
    // Scroll to tracker section
    document.getElementById("tracker-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const estimatedDuration = estimateWorkoutDuration(workout);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Workout Builder
      </h2>

      {/* Workout Meta */}
      <div className="mb-6 space-y-4">
        <div>
          <label
            htmlFor="workout-name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Workout Name
          </label>
          <input
            id="workout-name"
            type="text"
            value={workout.name}
            onChange={(e) =>
              setWorkout((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Push Day, Leg Day, Full Body"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="workout-date"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Date
          </label>
          <input
            id="workout-date"
            type="date"
            value={workout.date}
            onChange={(e) =>
              setWorkout((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Muscles Trained
          </label>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((muscle) => (
              <button
                key={muscle}
                onClick={() => handleMuscleToggle(muscle)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  workout.muscles.includes(muscle)
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-pressed={workout.muscles.includes(muscle)}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="default-rest"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Default Rest Time (seconds)
          </label>
          <input
            id="default-rest"
            type="number"
            min="0"
            step="5"
            value={workout.defaultRestSeconds}
            onChange={(e) =>
              setWorkout((prev) => ({
                ...prev,
                defaultRestSeconds: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Exercises List */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exercises ({workout.exercises.length})
          </h3>
          <button
            onClick={() => {
              setEditingExerciseIndex(null);
              setShowExerciseForm(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            + Add Exercise
          </button>
        </div>

        {workout.exercises.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400">
            No exercises added yet. Click &quot;Add Exercise&quot; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {exercise.title}
                    </h4>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {exercise.muscleGroup}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.description}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{exercise.defaultSets} sets</span>
                    <span>
                      Rest: {exercise.restSeconds || workout.defaultRestSeconds}
                      s
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveExercise(index, "up")}
                    disabled={index === 0}
                    className="rounded p-1 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-600"
                    aria-label="Move exercise up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveExercise(index, "down")}
                    disabled={index === workout.exercises.length - 1}
                    className="rounded p-1 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-600"
                    aria-label="Move exercise down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => {
                      setEditingExerciseIndex(index);
                      setShowExerciseForm(true);
                    }}
                    className="rounded p-1 text-blue-600 hover:bg-gray-200 dark:text-blue-400 dark:hover:bg-gray-600"
                    aria-label="Edit exercise"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleRemoveExercise(index)}
                    className="rounded p-1 text-red-600 hover:bg-gray-200 dark:text-red-400 dark:hover:bg-gray-600"
                    aria-label="Remove exercise"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estimated Duration */}
      {workout.exercises.length > 0 && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Estimated Duration:{" "}
            <span className="font-semibold">
              {formatDuration(estimatedDuration)}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveTemplate}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Save Template
        </button>
        <button
          onClick={handleStartWorkout}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Start Workout
        </button>
      </div>

      {/* Exercise Form Modal */}
      {showExerciseForm && (
        <ExerciseFormModal
          exercise={
            editingExerciseIndex !== null
              ? workout.exercises[editingExerciseIndex]
              : null
          }
          defaultRestSeconds={workout.defaultRestSeconds}
          onSave={handleAddExercise}
          onCancel={() => {
            setShowExerciseForm(false);
            setEditingExerciseIndex(null);
          }}
        />
      )}
    </div>
  );
}

// EXERCISE FORM MODAL
interface ExerciseFormModalProps {
  exercise: ExerciseTemplate | null;
  defaultRestSeconds: number;
  onSave: (exercise: ExerciseTemplate) => void;
  onCancel: () => void;
}

function ExerciseFormModal({
  exercise,
  defaultRestSeconds,
  onSave,
  onCancel,
}: ExerciseFormModalProps) {
  const [formData, setFormData] = useState<ExerciseTemplate>(
    exercise || {
      id: generateId(),
      title: "",
      muscleGroup: "Chest",
      description: "",
      defaultSets: 3,
      restSeconds: defaultRestSeconds,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter an exercise title");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {exercise ? "Edit Exercise" : "Add Exercise"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="exercise-title"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Exercise Title
            </label>
            <input
              id="exercise-title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Flat Bench Press"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="exercise-muscle"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Target Muscle
            </label>
            <select
              id="exercise-muscle"
              value={formData.muscleGroup}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  muscleGroup: e.target.value as MuscleGroup,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {MUSCLE_GROUPS.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="exercise-description"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="exercise-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of how to perform this exercise..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="exercise-sets"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Default Sets
            </label>
            <input
              id="exercise-sets"
              type="number"
              min="1"
              max="20"
              value={formData.defaultSets}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defaultSets: parseInt(e.target.value) || 1,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="exercise-rest"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Rest Time (seconds)
            </label>
            <input
              id="exercise-rest"
              type="number"
              min="0"
              step="5"
              value={formData.restSeconds}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  restSeconds: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {exercise ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
