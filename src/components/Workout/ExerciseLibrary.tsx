"use client";

/**
 * EXERCISE LIBRARY COMPONENT
 *
 * Browse and search through all available exercises in the database.
 *
 * Features:
 * - Search by exercise name
 * - Filter by muscle group, equipment, difficulty, and category
 * - View detailed exercise information
 * - Add exercises to custom workouts
 * - Responsive grid layout
 */

import React, { useState } from "react";
import { EXERCISE_DATABASE } from "@/data/exerciseDatabase";
import type {
  ExerciseTemplate,
  MuscleGroup,
  ExerciseCategory,
  ExerciseDifficulty,
  EquipmentType,
} from "@/types/workout";

interface ExerciseLibraryProps {
  onAddExercise?: (exercise: ExerciseTemplate) => void;
  showAddButton?: boolean;
}

export default function ExerciseLibrary({
  onAddExercise,
  showAddButton = false,
}: ExerciseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ExerciseDifficulty | "All">("All");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | "All">("All");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseTemplate | null>(null);

  // Filter exercises based on all criteria
  const filteredExercises = EXERCISE_DATABASE.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || exercise.muscleGroup === selectedMuscle;
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty;
    const matchesEquipment = selectedEquipment === "All" ||
      exercise.equipment?.includes(selectedEquipment);

    return matchesSearch && matchesMuscle && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  const muscles: ("All" | MuscleGroup)[] = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
  const categories: ("All" | ExerciseCategory)[] = ["All", "compound", "isolation", "finisher"];
  const difficulties: ("All" | ExerciseDifficulty)[] = ["All", "beginner", "intermediate", "advanced"];
  const equipmentTypes: ("All" | EquipmentType)[] = [
    "All",
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "bodyweight",
    "resistance_band",
    "kettlebell",
    "other",
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMuscle("All");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedEquipment("All");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            💪 Exercise Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse {EXERCISE_DATABASE.length} exercises • Search and filter to find what you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search exercises by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          {/* Muscle Group Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Muscle Group
            </label>
            <div className="flex flex-wrap gap-2">
              {muscles.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedMuscle === muscle
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    selectedDifficulty === difficulty
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentTypes.map((equipment) => (
                <button
                  key={equipment}
                  onClick={() => setSelectedEquipment(equipment)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    selectedEquipment === equipment
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {equipment === "resistance_band" ? "band" : equipment}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear all filters
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? "s" : ""}
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No exercises found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  {exercise.title}
                </h3>

                {/* Badges */}
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {exercise.muscleGroup}
                  </span>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {exercise.category}
                  </span>
                  {exercise.difficulty && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {exercise.difficulty}
                    </span>
                  )}
                </div>

                {/* Equipment Icons */}
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {exercise.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                      >
                        {eq === "resistance_band" ? "band" : eq}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description Preview */}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {exercise.description.slice(0, 100)}
                  {exercise.description.length > 100 ? "..." : ""}
                </p>

                {/* Sets/Reps Info */}
                <div className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-500">
                  {exercise.defaultSets} sets
                  {exercise.suggestedReps && ` × ${exercise.suggestedReps}`}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Exercise Detail Modal */}
        {selectedExercise && (
          <ExerciseDetailModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onAdd={
              showAddButton && onAddExercise
                ? () => {
                    onAddExercise(selectedExercise);
                    setSelectedExercise(null);
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

// EXERCISE DETAIL MODAL
interface ExerciseDetailModalProps {
  exercise: ExerciseTemplate;
  onClose: () => void;
  onAdd?: () => void;
}

function ExerciseDetailModal({ exercise, onClose, onAdd }: ExerciseDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {exercise.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Primary Muscle */}
        <div className="mb-4">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
            {exercise.muscleGroup}
          </span>
        </div>

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Secondary Muscles:
            </p>
            <div className="flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
            <p className="font-medium capitalize text-gray-900 dark:text-white">
              {exercise.category}
            </p>
          </div>
          {exercise.difficulty && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
              <p className="font-medium capitalize text-gray-900 dark:text-white">
                {exercise.difficulty}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sets</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {exercise.defaultSets}
            </p>
          </div>
          {exercise.suggestedReps && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reps</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {exercise.suggestedReps}
              </p>
            </div>
          )}
        </div>

        {/* Equipment */}
        {exercise.equipment && exercise.equipment.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Equipment Needed:
            </p>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((eq) => (
                <span
                  key={eq}
                  className="rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium capitalize text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                >
                  {eq === "resistance_band" ? "Resistance Band" : eq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            How to Perform:
          </p>
          <p className="text-gray-600 dark:text-gray-400">{exercise.description}</p>
        </div>

        {/* Rest Time */}
        {exercise.restSeconds && (
          <div className="mb-6 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                Recommended Rest:
              </span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {exercise.restSeconds} seconds
              </span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add to Workout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
