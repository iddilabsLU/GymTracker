"use client";

/**
 * REST TIMER COMPONENT
 *
 * A simple countdown timer for rest periods between sets.
 * Features:
 * - Large, easy-to-read countdown display
 * - Progress bar showing remaining time
 * - Start/Pause/Reset controls
 * - Audio notification when timer completes (optional)
 */

import React, { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultSeconds: number;
  onComplete?: () => void;
}

export default function RestTimer({
  defaultSeconds,
  onComplete,
}: RestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            // Optional: Play a sound or vibration
            if (typeof window !== "undefined" && window.navigator.vibrate) {
              window.navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, secondsLeft, onComplete]);

  const handleStart = () => {
    if (secondsLeft === 0) {
      // Reset if timer is at 0
      setSecondsLeft(totalSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const handleSetTime = (seconds: number) => {
    setIsRunning(false);
    setTotalSeconds(seconds);
    setSecondsLeft(seconds);
  };

  // Calculate progress percentage
  const progress = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  // Format seconds as MM:SS
  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Rest Timer
      </h3>

      {/* Timer Display */}
      <div className="mb-4 text-center">
        <div
          className={`text-5xl font-bold tabular-nums ${
            secondsLeft === 0
              ? "text-green-600 dark:text-green-400"
              : isRunning
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(secondsLeft)}
        </div>
        {secondsLeft === 0 && (
          <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
            Rest complete!
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            secondsLeft === 0
              ? "bg-green-500"
              : isRunning
              ? "bg-blue-500"
              : "bg-gray-400"
          }`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            aria-label="Start timer"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:bg-yellow-500 dark:hover:bg-yellow-600"
            aria-label="Pause timer"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>

      {/* Quick Time Presets */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => handleSetTime(30)}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Set timer to 30 seconds"
        >
          30s
        </button>
        <button
          onClick={() => handleSetTime(60)}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Set timer to 60 seconds"
        >
          60s
        </button>
        <button
          onClick={() => handleSetTime(90)}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Set timer to 90 seconds"
        >
          90s
        </button>
        <button
          onClick={() => handleSetTime(120)}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label="Set timer to 120 seconds"
        >
          2m
        </button>
      </div>
    </div>
  );
}
