/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HeartHandshake,
  Smile,
  Frown,
  Meh,
  Calendar,
  Sparkles,
  BookOpen,
  Play,
  Pause,
  Clock,
  Trash2,
  CheckCircle
} from "lucide-react";
import { JournalEntry, MoodLog } from "../types";

export default function MentalHealth() {
  // State: Mood tracker
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([
    { date: "Jun 22", score: 4, note: "Felt very productive today." },
    { date: "Jun 23", score: 3, note: "Standard day, a bit of stress in the afternoon." },
    { date: "Jun 24", score: 5, note: "Exceptional night of sleep. High energy!" },
    { date: "Jun 25", score: 4, note: "Coached my first cardiac recovery class successfully." },
  ]);

  // State: Journal
  const [journalText, setJournalText] = useState("");
  const [journalMood, setJournalMood] = useState("Calm");
  const [journals, setJournals] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "Jun 24, 2026",
      text: "Woke up feeling exceptionally clear. Did a 10-minute diaphragmatic breathing set. Heart rate dropped beautifully into the optimal zone.",
      mood: "Calm",
    },
  ]);

  // State: Breathing Bubble
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathCounter, setBreathCounter] = useState(4); // seconds
  const [pacingSeconds, setPacingSeconds] = useState(4); // 4-4-4 standard box breathing or similar

  // Breathing loop simulation
  useEffect(() => {
    let interval: any;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            // State transition
            if (breathState === "Inhale") {
              setBreathState("Hold");
              return pacingSeconds;
            } else if (breathState === "Hold") {
              setBreathState("Exhale");
              return pacingSeconds;
            } else {
              setBreathState("Inhale");
              return pacingSeconds;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathCounter(pacingSeconds);
      setBreathState("Inhale");
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathState, pacingSeconds]);

  const handleAddMood = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood === null) return;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setMoodHistory((prev) => [
      ...prev,
      {
        date: dateStr,
        score: selectedMood,
        note: moodNote || "Felt stable.",
      },
    ]);
    setSelectedMood(null);
    setMoodNote("");
  };

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setJournals((prev) => [
      ...prev,
      {
        id: `journal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        date: dateStr,
        text: journalText.trim(),
        mood: journalMood,
      },
    ]);
    setJournalText("");
  };

  const handleDeleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const getMoodIcon = (score: number) => {
    if (score >= 4) return <Smile className="w-5 h-5 text-emerald-400" />;
    if (score === 3) return <Meh className="w-5 h-5 text-amber-400" />;
    return <Frown className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Mental Health Lounge
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Track autonomic stress variables, log daily psychological journals, and practice visual deep-breathing loops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MOOD & JOURNAL INPUT (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Mood Logger */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex justify-between items-center">
              <span>Mood Charting Log</span>
              <span className="text-xs text-[#c3c6d7]/40">Active Tracker</span>
            </h3>

            <form onSubmit={handleAddMood} className="space-y-4">
              <div className="flex justify-around items-center py-2 bg-[#020617]/40 rounded-2xl border border-white/5">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setSelectedMood(score)}
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedMood === score
                        ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20"
                        : "bg-white/5 text-[#c3c6d7]/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-bold">{score}</span>
                    <span className="text-[9px] opacity-60">
                      {score === 5 ? "Great" : score === 3 ? "Neutral" : score === 1 ? "Sad" : ""}
                    </span>
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Notes on stress variables or focus levels..."
                className="w-full p-2.5 rounded-xl bg-[#020617]/50 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-blue-500"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              />

              <button
                type="submit"
                disabled={selectedMood === null}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                Log Biometric Mood State
              </button>
            </form>
          </div>

          {/* Daily Well-being quote panel */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-3 relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 rounded-full bg-pink-500/10 blur-xl" />
            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Mindfulness Focus</span>
            <p className="text-sm text-white leading-relaxed font-light">
              "The greatest weapon against stress is our ability to choose one thought over another. Diaphragmatic breathing is the direct physical interface to lowering cortisol."
            </p>
          </div>
        </div>

        {/* DIAPHRAGMATIC BREATHING INTERACTIVE COACH (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[420px]">
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-base">Diaphragmatic Breathing Coach</h3>
              <p className="text-xs text-[#c3c6d7]/50">Autonomic nervous coordination loop</p>
            </div>

            <div className="flex gap-2">
              {[4, 6, 8].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setPacingSeconds(sec)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                    pacingSeconds === sec
                      ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                      : "bg-white/5 text-[#c3c6d7]/40 border-white/5 hover:text-white"
                  }`}
                >
                  {sec}s Box
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Paced Scaling Circle Bubble */}
          <div className="relative my-8 flex items-center justify-center h-56 w-56">
            {/* Animated Ring backing */}
            <motion.div
              animate={isBreathing ? {
                scale: breathState === "Inhale" ? [1, 1.45] : breathState === "Hold" ? 1.45 : [1.45, 1],
              } : { scale: 1 }}
              transition={{
                duration: pacingSeconds,
                ease: "easeInOut",
              }}
              className={`absolute inset-4 rounded-full flex items-center justify-center border-2 border-pink-500/30 ${
                isBreathing ? "bg-gradient-to-br from-pink-500/10 to-blue-500/10" : "bg-white/5"
              }`}
            />

            {/* Core glowing bubble */}
            <div className="relative z-10 text-center space-y-1 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-full p-8 w-36 h-36 flex flex-col items-center justify-center shadow-xl">
              <span className="text-[10px] uppercase text-[#c3c6d7]/50 tracking-widest font-bold">
                {isBreathing ? breathState : "Ready"}
              </span>
              <span className="text-4xl font-extrabold text-white font-sans">
                {isBreathing ? breathCounter : pacingSeconds}
              </span>
              <span className="text-[9px] text-pink-400 font-semibold uppercase">Secs left</span>
            </div>
          </div>

          <div className="space-y-4 w-full max-w-sm z-10">
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl ${
                isBreathing
                  ? "bg-white/10 border border-white/10 hover:bg-white/15 text-white"
                  : "bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/15"
              }`}
            >
              {isBreathing ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Breathing Exercise
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Start Paced Vagal Exercise
                </>
              )}
            </button>
            <p className="text-[10px] text-[#c3c6d7]/50 font-light">
              Coordinating visual expansion cycles is shown to immediately reduce autonomic heart rate variability within 3 minutes of training.
            </p>
          </div>
        </div>
      </div>

      {/* HISTORIC MOOD TREND & JOURNALS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mood history line (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Autonomic Mood Stream</h4>
          <div className="space-y-3">
            {moodHistory.map((m, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-[#020617]/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                    {getMoodIcon(m.score)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.note}</p>
                    <p className="text-[10px] text-[#c3c6d7]/40 font-mono mt-0.5">{m.date} • Score {m.score}/5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal Entries (7 cols) */}
        <div className="lg:col-span-7 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Interactive Wellness Journals</h4>
            <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">HIPAA Protected</span>
          </div>

          <form onSubmit={handleAddJournal} className="space-y-3 bg-[#020617]/50 border border-white/5 rounded-2xl p-4">
            <textarea
              rows={3}
              placeholder="Record deep psychological observations, gratitude, or stress variables..."
              className="w-full bg-transparent text-xs text-white placeholder-white/20 outline-none resize-none"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              required
            />
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <div className="flex gap-2 text-xs">
                {["Calm", "Anxious", "Inspired", "Fatigued"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setJournalMood(m)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                      journalMood === m
                        ? "bg-blue-600/20 text-blue-400 border-blue-500/20"
                        : "bg-white/5 text-[#c3c6d7]/40 border-transparent hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">
                Commit Journal entry
              </button>
            </div>
          </form>

          <div className="space-y-3 overflow-y-auto max-h-[220px]">
            {journals.map((j) => (
              <div key={j.id} className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#c3c6d7]/40 font-mono">{j.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-pink-500/15 text-pink-400 border border-pink-500/25 text-[9px] font-bold rounded-full">
                      {j.mood}
                    </span>
                    <button onClick={() => handleDeleteJournal(j.id)} className="text-[#c3c6d7]/40 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#dae2fd] font-light leading-relaxed whitespace-pre-line">{j.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
