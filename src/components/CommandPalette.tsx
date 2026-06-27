/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Search, Command, Activity, Brain, ShieldAlert, HeartHandshake, User, Utensils, Compass, HelpCircle } from "lucide-react";
import { ScreenType } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScreen: (screen: ScreenType) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectScreen }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    icon: any;
    action: () => void;
  }> = [
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      description: "Access main clinical charts, metrics & timelines",
      category: "Navigation",
      icon: Activity,
      action: () => {
        onSelectScreen("dashboard");
        onClose();
      },
    },
    {
      id: "nav-ai",
      title: "PulseMind AI Clinical Doctor",
      description: "Symptom check, OCR reports & lab analysis",
      category: "Navigation",
      icon: Brain,
      action: () => {
        onSelectScreen("ai-modules");
        onClose();
      },
    },
    {
      id: "nav-records",
      title: "Medical Records & Prescriptions",
      description: "Manage vaccines, medications & family profiles",
      category: "Navigation",
      icon: Compass,
      action: () => {
        onSelectScreen("medical-records");
        onClose();
      },
    },
    {
      id: "nav-emergency",
      title: "Emergency SOS Dashboard",
      description: "Trigger SOS beacon, find hospital, show medical QR card",
      category: "Navigation",
      icon: ShieldAlert,
      action: () => {
        onSelectScreen("emergency-sos");
        onClose();
      },
    },
    {
      id: "nav-mental",
      title: "Mental Health Lounge",
      description: "Guided deep-breathing, mood charting & journal log",
      category: "Navigation",
      icon: HeartHandshake,
      action: () => {
        onSelectScreen("mental-health");
        onClose();
      },
    },
    {
      id: "nav-fitness",
      title: "Fitness & Activity Planner",
      description: "Water tracker, logs, workouts & sleep metrics",
      category: "Navigation",
      icon: Activity,
      action: () => {
        onSelectScreen("fitness");
        onClose();
      },
    },
    {
      id: "nav-nutrition",
      title: "Nutrition & Diet Planner",
      description: "Track calories, macro protein intake, recipes & meals",
      category: "Navigation",
      icon: Utensils,
      action: () => {
        onSelectScreen("nutrition");
        onClose();
      },
    },
    {
      id: "nav-portal",
      title: "Patient Settings & Profile",
      description: "Manage billing, insurance, HIPAA keys & notifications",
      category: "Navigation",
      icon: User,
      action: () => {
        onSelectScreen("patient-portal");
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-[#020617]/80 backdrop-blur-md">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Palette Card */}
      <div className="relative w-full max-w-xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[450px]">
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#111827]">
          <Search className="w-5 h-5 text-[#c3c6d7]/60" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-sm text-white placeholder-[#c3c6d7]/40 outline-none"
            placeholder="Type a command or page name to navigate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#c3c6d7]/50 font-mono">
            <Command className="w-3 h-3" />K
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#c3c6d7]/50 text-sm">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No results match "{searchQuery}"
            </div>
          ) : (
            filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/20 border border-transparent text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-blue-600/20 border border-white/5 flex items-center justify-center text-[#c3c6d7]/80 group-hover:text-blue-400 transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#c3c6d7]/60 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#c3c6d7]/30 group-hover:text-blue-400 font-semibold uppercase bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-[#020617]/50 flex justify-between items-center text-xs text-[#c3c6d7]/40">
          <span>Use <kbd className="text-white">Esc</kbd> to dismiss</span>
          <span>Press <kbd className="text-white">↑↓</kbd> or click to execute</span>
        </div>
      </div>
    </div>
  );
}
