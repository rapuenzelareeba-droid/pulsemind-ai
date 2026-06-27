/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Trash2,
  Plus,
  RefreshCw,
  TrendingUp,
  Sliders,
  Sparkles,
  Award
} from "lucide-react";
import {
  Appointment,
  Medication,
  VitalMetric,
  ActivityLog
} from "../types";

interface DashboardProps {
  vitalMetric: VitalMetric;
  appointments: Appointment[];
  medications: Medication[];
  activityLogs: ActivityLog[];
  onTakeMedication: (id: string) => void;
  onAddAppointment: (appointment: Omit<Appointment, "id">) => void;
  onDeleteAppointment: (id: string) => void;
}

export default function Dashboard({
  vitalMetric,
  appointments,
  medications,
  activityLogs,
  onTakeMedication,
  onAddAppointment,
  onDeleteAppointment,
}: DashboardProps) {
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [newDoctor, setNewDoctor] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLoc, setNewLoc] = useState("");

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor || !newSpecialty || !newDate || !newTime) return;
    onAddAppointment({
      doctor: newDoctor,
      specialty: newSpecialty,
      date: newDate,
      time: newTime,
      location: newLoc || "Main Medical Wing B",
    });
    setNewDoctor("");
    setNewSpecialty("");
    setNewDate("");
    setNewTime("");
    setNewLoc("");
    setShowAddAppt(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
            Clinical Live Workspace
          </h1>
          <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
            Real-time biometric telemetry, predictive longevity auditing, and active appointments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Telemetry Live Stream</span>
        </div>
      </div>

      {/* Real-time Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Core Health Score */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4 relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-blue-500/10 blur-xl" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-[#c3c6d7]/50 tracking-wider">Longevity Index</span>
            <Award className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white tracking-tight">{vitalMetric.healthScore}</span>
            <span className="text-xs text-emerald-400 font-semibold uppercase">Optimal</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${vitalMetric.healthScore}%` }} />
          </div>
        </motion.div>

        {/* Resting Heart Rate */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4 relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-red-500/10 blur-xl" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-[#c3c6d7]/50 tracking-wider">Resting Heart Rate</span>
            <Activity className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white tracking-tight">{vitalMetric.heartRate}</span>
            <span className="text-xs text-[#c3c6d7]/60">BPM</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Standard baseline (58-64 bpm)</span>
          </div>
        </motion.div>

        {/* Autonomic Stress */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4 relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-pink-500/10 blur-xl" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-[#c3c6d7]/50 tracking-wider">Autonomic Stress</span>
            <Sliders className="w-5 h-5 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white tracking-tight">{vitalMetric.stressLevel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimal vagal nerve tone</span>
          </div>
        </motion.div>

        {/* Sleep Metric */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4 relative overflow-hidden"
        >
          <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-cyan-500/10 blur-xl" />
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase text-[#c3c6d7]/50 tracking-wider">Sleep Metric</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-white tracking-tight">{vitalMetric.sleepScore}</span>
            <span className="text-xs text-[#c3c6d7]/60">/ 100</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full" style={{ width: `${vitalMetric.sleepScore}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Dynamic Animated Charts (Longevity & Cardiac waves) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Longevity Weekly Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Biometric Telemetry Mapping</h3>
              <p className="text-xs text-[#c3c6d7]/50">Longevity Index tracking vs stress index</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#c3c6d7]/70">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Index Trend
              </span>
              <span className="flex items-center gap-1.5 text-[#c3c6d7]/70">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Autonomic Level
              </span>
            </div>
          </div>

          {/* Premium Custom Draw Chart via SVG with Motion path */}
          <div className="w-full h-60 bg-[#020617]/40 rounded-2xl border border-white/5 p-4 flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="longevityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="autonomicGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Day markers vertical lines */}
              <line x1="40" y1="0" x2="40" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="120" y1="0" x2="120" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="200" y1="0" x2="200" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="280" y1="0" x2="280" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="360" y1="0" x2="360" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <line x1="440" y1="0" x2="440" y2="180" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Line Area 1: Longevity Index Trend */}
              <path
                d="M 40 100 Q 120 70 200 85 T 280 40 T 360 60 T 440 25"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 40 100 Q 120 70 200 85 T 280 40 T 360 60 T 440 25 L 440 180 L 40 180 Z"
                fill="url(#longevityGrad)"
              />

              {/* Line Area 2: Autonomic Stress Level */}
              <path
                d="M 40 130 Q 120 120 200 140 T 280 90 T 360 110 T 440 80"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
              <path
                d="M 40 130 Q 120 120 200 140 T 280 90 T 360 110 T 440 80 L 440 180 L 40 180 Z"
                fill="url(#autonomicGrad)"
              />

              {/* Data Points */}
              <circle cx="280" cy="40" r="4" fill="#2563EB" stroke="#fff" strokeWidth="1.5" />
              <circle cx="440" cy="25" r="4" fill="#2563EB" stroke="#fff" strokeWidth="1.5" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute bottom-1 w-full flex justify-between px-6 text-[10px] text-[#c3c6d7]/40 font-mono">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Action Quick Stats list (Right column) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Wearables Panel */}
          <div className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Device Integration</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#020617]/50 border border-white/5 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-white">Apple HealthKit</span>
                </div>
                <span className="text-xs text-[#c3c6d7]/40">Synced 1m ago</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#020617]/50 border border-white/5 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-white">Whoop Strap 4.0</span>
                </div>
                <span className="text-xs text-[#c3c6d7]/40">Synced 4m ago</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#020617]/20 border border-white/5 opacity-50 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#c3c6d7]/30" />
                  <span className="font-semibold text-[#c3c6d7]/60">Fitbit Scale</span>
                </div>
                <span className="text-xs text-[#c3c6d7]/40">Unlinked</span>
              </div>
            </div>
          </div>

          {/* Clinician Advice */}
          <div className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-blue-500/10 blur-xl" />
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Longevity Suggestion</span>
            <p className="text-sm text-white leading-relaxed font-light">
              "Your Autonomic Stress Index matches a highly synchronized vagal tone state. Recommended: standard aerobic work at Zone 2 limit (122-134 bpm) for 45 mins."
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Medications and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Medicine reminders (6 col equivalents) */}
        <div className="lg:col-span-6 p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Medication & Refills Reminders</h3>
              <p className="text-xs text-[#c3c6d7]/50">Verify scheduled dosages</p>
            </div>
            <span className="text-xs text-[#c3c6d7]/40 font-semibold uppercase bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
              Today
            </span>
          </div>

          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                  med.taken
                    ? "bg-blue-950/20 border-blue-500/25 opacity-70"
                    : "bg-[#020617]/50 border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTakeMedication(med.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      med.taken
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-white/20 text-transparent hover:border-blue-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${med.taken ? "line-through text-white/50" : "text-white"}`}>
                      {med.name}
                    </p>
                    <p className="text-xs text-[#c3c6d7]/50 font-light">
                      {med.dosage} • {med.time} • {med.schedule}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  med.refillsRemaining <= 2
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-white/5 text-[#c3c6d7]/40"
                }`}>
                  {med.refillsRemaining} Refills left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments (6 col equivalents) */}
        <div className="lg:col-span-6 p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Active Consultations</h3>
              <p className="text-xs text-[#c3c6d7]/50">Hospital visits and telemetry sessions</p>
            </div>
            <button
              onClick={() => setShowAddAppt(!showAddAppt)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Book Consultation
            </button>
          </div>

          {showAddAppt && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitAppointment}
              className="p-4 rounded-2xl bg-[#020617]/80 border border-blue-500/20 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Doctor Name (e.g. Dr. Sarah Chen)"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-blue-500"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Specialty (e.g. Cardiology)"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-blue-500"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  required
                />
                <input
                  type="date"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-blue-500"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-blue-500"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Location / Wing (Optional)"
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-blue-500"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddAppt(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-white/5 text-xs text-[#c3c6d7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.form>
          )}

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#c3c6d7]/30">No upcoming consultations booked.</div>
            ) : (
              appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex justify-between items-center p-4 rounded-2xl bg-[#020617]/50 border border-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{appt.doctor}</p>
                      <p className="text-xs text-[#c3c6d7]/60 font-medium">{appt.specialty}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#c3c6d7]/40 font-light mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400" /> {appt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400" /> {appt.time}</span>
                      </div>
                      <p className="text-[10px] text-blue-400/80 mt-1 font-mono">{appt.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteAppointment(appt.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-[#c3c6d7]/40 transition-colors cursor-pointer"
                    title="Cancel Consultation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-time System Audit Logging Activity Timeline */}
      <div className="p-6 rounded-[24px] bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Biometric Stream Activity Audit</h3>
          <p className="text-xs text-[#c3c6d7]/50">Chronological telemetry sync and medical transactions log</p>
        </div>

        <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-6">
          {activityLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Bullet circle */}
              <span className="absolute left-[-26px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-[#111827] z-10" />
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-sm font-semibold text-white">{log.title}</p>
                  <span className="text-[10px] text-[#c3c6d7]/40 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-xs text-[#c3c6d7]/60 mt-0.5 leading-relaxed font-light">{log.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
