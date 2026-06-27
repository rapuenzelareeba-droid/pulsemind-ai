/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType =
  | "landing"
  | "dashboard"
  | "ai-modules"
  | "medical-records"
  | "emergency-sos"
  | "mental-health"
  | "fitness"
  | "nutrition"
  | "patient-portal";

export interface UserProfile {
  name: string;
  pulseId: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  age: number;
  weight: number; // kg
  height: number; // cm
  bodyFat: number; // %
  vaccinations: string[];
  insuranceProvider: string;
  insurancePolicyNum: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  refillsRemaining: number;
  time: string; // e.g., "08:00 AM"
  taken: boolean;
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

export interface ActivityLog {
  id: string;
  type: "workout" | "medication" | "lab" | "diet" | "sleep" | "mood";
  title: string;
  description: string;
  timestamp: string;
}

export interface VitalMetric {
  heartRate: number; // bpm
  sleepScore: number; // 0-100
  stressLevel: "Low" | "Medium" | "High" | "Optimal";
  healthScore: number; // 0-100
  steps: number;
  caloriesBurned: number;
  waterIntake: number; // ml
  waterGoal: number; // ml
  caloriesConsumed: number; // kcal
  calorieGoal: number; // kcal
}

export interface MoodLog {
  date: string;
  score: number; // 1-5
  note: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood: string;
}

export interface WorkoutPlan {
  id: string;
  day: string;
  exercise: string;
  sets: number;
  reps: number;
  durationMin: number;
  completed: boolean;
}

export interface Meal {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
}

export interface ReportAnalysisResult {
  patientName: string;
  confidence: number;
  summary: string;
  entities: Array<{
    name: string;
    value: string;
    referenceRange: string;
    status: "optimal" | "elevated" | "low" | "critical";
  }>;
  recommendations: string[];
}
