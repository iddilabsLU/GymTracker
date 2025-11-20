"use client";

/**
 * GYM WORKOUT TRACKER PWA
 *
 * Main page that combines the workout builder and tracker.
 * This is a single-page experience with two sections:
 * 1. Workout Builder - Configure and create workouts
 * 2. Workout Tracker - Track active workout sessions
 *
 * Features:
 * - Offline-first (works without internet)
 * - Installable as PWA
 * - Mobile-first design
 * - Fast and frictionless between sets
 */

import React, { useState } from "react";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import WorkoutBuilder from "@/components/Workout/WorkoutBuilder";
import WorkoutTracker from "@/components/Workout/WorkoutTracker";
import ExerciseLibrary from "@/components/Workout/ExerciseLibrary";
import PWAInstaller from "@/components/Workout/PWAInstaller";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"builder" | "tracker" | "library">("builder");

  return (
    <WorkoutProvider>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gym Tracker
              </h1>
              <PWAInstaller />
            </div>

            {/* Tabs */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActiveTab("builder")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "builder"
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-pressed={activeTab === "builder"}
              >
                Builder
              </button>
              <button
                onClick={() => setActiveTab("tracker")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "tracker"
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-pressed={activeTab === "tracker"}
              >
                Tracker
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "library"
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-pressed={activeTab === "library"}
              >
                Library
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        {activeTab === "library" ? (
          <ExerciseLibrary />
        ) : (
          <div className="mx-auto max-w-4xl px-4 py-6">
            {activeTab === "builder" ? <WorkoutBuilder /> : <WorkoutTracker />}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Gym Tracker - Your offline-first workout companion
            </p>
            <p className="mt-1">
              All data stored locally on your device
            </p>
          </div>
        </footer>
      </main>
    </WorkoutProvider>
  );
}
