/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Activity, Plus, Trash2, Check, Sparkles, Sliders, ChevronRight } from "lucide-react";
import { WorkoutPlan } from "../types";

export default function FitnessFitness() {
  // State: Hydration
  const [waterIntake, setWaterIntake] = useState(1250); // ml
  const waterGoal = 3000; // ml

  // State: Calories
  const caloriesBurned = 480;
  const calorieGoal = 750;

  // State: Workout schedule planner
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([
    { id: "1", day: "Mon", exercise: "Zone 2 Cardiovascular Run", sets: 1, reps: 1, durationMin: 45, completed: true },
    { id: "2", day: "Wed", exercise: "Hypertrophy Upper Body Split", sets: 4, reps: 12, durationMin: 50, completed: false },
    { id: "3", day: "Thu", exercise: "Lower Body Quadriceps Press", sets: 3, reps: 10, durationMin: 40, completed: false },
  ]);

  const [newDay, setNewDay] = useState("Mon");
  const [newEx, setNewEx] = useState("");
  const [newSets, setNewSets] = useState("3");
  const [newReps, setNewReps] = useState("10");
  const [newDur, setNewDur] = useState("30");

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEx.trim()) return;
    setWorkouts((prev) => [
      ...prev,
      {
        id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        day: newDay,
        exercise: newEx.trim(),
        sets: parseInt(newSets),
        reps: parseInt(newReps),
        durationMin: parseInt(newDur),
        completed: false,
      },
    ]);
    setNewEx("");
  };

  const handleToggleWorkout = (id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Fitness & Activity Planner
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Active workout calendars, daily macro hydration trackers, and calorie burned index monitors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WATER INTAKE & CALORIES (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hydration Widget */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Hydration Monitor</h3>
                <p className="text-xs text-[#c3c6d7]/50 font-light">Target standard: 3.0 Liters</p>
              </div>
              <span className="text-xs text-blue-400 font-bold font-mono">
                {((waterIntake / waterGoal) * 100).toFixed(0)}%
              </span>
            </div>

            {/* Circular progress simulated */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#2563EB"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * Math.min(waterIntake, waterGoal)) / waterGoal}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-white font-sans">{waterIntake}</span>
                  <p className="text-[10px] text-[#c3c6d7]/40 uppercase font-semibold">ML Intake</p>
                </div>
              </div>

              {/* Adjust buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setWaterIntake((prev) => Math.max(0, prev - 250))}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-white cursor-pointer"
                >
                  -250 ml
                </button>
                <button
                  onClick={() => setWaterIntake((prev) => prev + 250)}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  +250 ml
                </button>
              </div>
            </div>
          </div>

          {/* Calorie Burn tracker */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Active Energy Burn</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#c3c6d7]/60">Calorie Progress</span>
                <span className="text-emerald-400 font-mono">{caloriesBurned} / {calorieGoal} kcal</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(caloriesBurned / calorieGoal) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* WORKOUT PLANNER (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Workout Schedule Planner</h3>
              <p className="text-xs text-[#c3c6d7]/50 font-light">Schedule aerobic or clinical physiotherapy routines</p>
            </div>
          </div>

          <form onSubmit={handleAddWorkout} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#020617]/50 border border-white/5 rounded-2xl p-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#c3c6d7]/40">Exercise Name</label>
              <input
                type="text"
                placeholder="Zone 2 Aerobic Run..."
                className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                value={newEx}
                onChange={(e) => setNewEx(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-[#c3c6d7]/40">Day</label>
              <select
                className="w-full p-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
              >
                <option value="Mon">Mon</option>
                <option value="Tue">Tue</option>
                <option value="Wed">Wed</option>
                <option value="Thu">Thu</option>
                <option value="Fri">Fri</option>
                <option value="Sat">Sat</option>
                <option value="Sun">Sun</option>
              </select>
            </div>
            <button type="submit" className="py-2 mt-4.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">
              Schedule Action
            </button>
          </form>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {workouts.map((w) => (
              <div
                key={w.id}
                className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all ${
                  w.completed
                    ? "bg-blue-950/20 border-blue-500/25 opacity-70"
                    : "bg-[#020617]/50 border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleWorkout(w.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer ${
                      w.completed
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${w.completed ? "line-through text-white/50" : "text-white"}`}>
                      {w.exercise}
                    </p>
                    <p className="text-[10px] text-[#c3c6d7]/50 font-light">
                      Scheduled {w.day} • {w.sets} Sets • {w.reps} Reps • {w.durationMin} mins
                    </p>
                  </div>
                </div>

                <button onClick={() => handleDeleteWorkout(w.id)} className="p-1 rounded-lg text-[#c3c6d7]/30 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
