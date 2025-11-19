/**
 * Generate comprehensive exercise database
 * Run with: node scripts/generate-exercise-database.js
 */

const fs = require('fs');
const path = require('path');

// Exercise data organized by muscle group
const exercises = {
  Chest: {
    compound: [
      { title: "Barbell Bench Press", desc: "Lie on bench, lower bar to mid-chest, press up. Keep feet flat, retract scapula.", secondary: ["Shoulders", "Arms"], sets: 4, reps: "6-10", rest: 120, difficulty: "intermediate", equipment: ["barbell"] },
      { title: "Incline Barbell Bench Press", desc: "Set bench to 30-45°. Lower bar to upper chest, press up. Targets upper chest.", secondary: ["Shoulders", "Arms"], sets: 4, reps: "8-12", rest: 90, difficulty: "intermediate", equipment: ["barbell"] },
      { title: "Decline Barbell Bench Press", desc: "Set bench to -15 to -30°. Lower to lower chest. Emphasizes lower pecs.", secondary: ["Shoulders", "Arms"], sets: 3, reps: "8-12", rest: 90, difficulty: "intermediate", equipment: ["barbell"] },
      { title: "Dumbbell Bench Press", desc: "Press dumbbells from chest level. Greater ROM than barbell. Keep elbows at 45°.", secondary: ["Shoulders", "Arms"], sets: 4, reps: "8-12", rest: 90, difficulty: "beginner", equipment: ["dumbbell"] },
      { title: "Incline Dumbbell Press", desc: "30-45° incline. Press dumbbells together at top. Builds upper chest mass.", secondary: ["Shoulders"], sets: 4, reps: "8-12", rest: 90, difficulty: "beginner", equipment: ["dumbbell"] },
      { title: "Decline Dumbbell Press", desc: "Decline bench, press dumbbells up. Good for lower chest development.", secondary: ["Shoulders", "Arms"], sets: 3, reps: "8-12", rest: 90, difficulty: "beginner", equipment: ["dumbbell"] },
      { title: "Push-Ups", desc: "Hands shoulder-width, lower chest to ground. Keep core tight, full ROM.", secondary: ["Shoulders", "Arms", "Core"], sets: 3, reps: "15-25", rest: 60, difficulty: "beginner", equipment: ["bodyweight"] },
      { title: "Weighted Dips (Chest Focus)", desc: "Lean forward ~30°, wide grip. Lower deep, press up. Add weight when able.", secondary: ["Shoulders", "Arms"], sets: 3, reps: "8-12", rest: 90, difficulty: "advanced", equipment: ["bodyweight", "other"] },
      { title: "Close-Grip Bench Press", desc: "Hands 6-8 inches apart. Lower to lower chest. Great for inner chest and triceps.", secondary: ["Arms"], sets: 3, reps: "8-12", rest: 90, difficulty: "intermediate", equipment: ["barbell"] },
      { title: "Landmine Press", desc: "Press barbell from shoulder level at 45° angle. Alternating or single-arm.", secondary: ["Shoulders", "Core"], sets: 3, reps: "10-12", rest: 75, difficulty: "intermediate", equipment: ["barbell"] },
    ],
    isolation: [
      { title: "Dumbbell Flyes", desc: "Flat bench, slight elbow bend. Arc dumbbells out and up. Feel chest stretch.", secondary: [], sets: 3, reps: "10-15", rest: 60, difficulty: "beginner", equipment: ["dumbbell"] },
      { title: "Incline Dumbbell Flyes", desc: "30-45° incline. Arc motion, slight bend in elbows. Targets upper chest.", secondary: [], sets: 3, reps: "10-15", rest: 60, difficulty: "beginner", equipment: ["dumbbell"] },
      { title: "Cable Crossovers", desc: "High pulleys, step forward, cross cables at waist level. Squeeze pecs.", secondary: [], sets: 3, reps: "12-15", rest: 60, difficulty: "beginner", equipment: ["cable"] },
      { title: "Low to High Cable Flyes", desc: "Low pulleys, press upward and together. Emphasizes upper chest.", secondary: [], sets: 3, reps: "12-15", rest: 60, difficulty: "beginner", equipment: ["cable"] },
      { title: "Pec Deck Machine", desc: "Sit upright, bring handles together. Focus on squeezing pecs at peak.", secondary: [], sets: 3, reps: "12-15", rest: 60, difficulty: "beginner", equipment: ["machine"] },
      { title: "Chest Press Machine", desc: "Adjust seat, press handles forward. Good for beginners or burnout sets.", secondary: ["Shoulders", "Arms"], sets: 3, reps: "10-15", rest: 60, difficulty: "beginner", equipment: ["machine"] },
    ],
    finisher: [
      { title: "Diamond Push-Ups", desc: "Hands together forming diamond. Lower chest to hands. Great tricep builder.", secondary: ["Arms"], sets: 2, reps: "AMRAP", rest: 45, difficulty: "intermediate", equipment: ["bodyweight"] },
      { title: "Plate Press", desc: "Hold plate with both hands, press out. Squeeze plate hard throughout.", secondary: [], sets: 2, reps: "15-20", rest: 45, difficulty: "beginner", equipment: ["other"] },
    ]
  },
  // I'll continue with other muscle groups in similar format...
};

console.log("Note: This script is a template. The full implementation would generate all ~300 exercises.");
console.log("For now, the exercise database is being built manually in exerciseDatabase.ts");
