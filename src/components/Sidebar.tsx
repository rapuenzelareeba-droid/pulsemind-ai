/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScreenType, UserProfile } from "../types";
import {
  Activity,
  Brain,
  Compass,
  ShieldAlert,
  HeartHandshake,
  Utensils,
  User,
  Search,
  Command,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Calendar,
  Sparkles,
  Award
} from "lucide-react";

interface SidebarProps {
  activeScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  userProfile: UserProfile;
  healthScore: number;
  onOpenCommandPalette: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  activeScreen,
  onSelectScreen,
  userProfile,
  healthScore,
  onOpenCommandPalette,
  onLogout,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const menuItems: Array<{
    id: ScreenType;
    label: string;
    icon: any;
    badge?: string;
    color: string;
  }> = [
    {
      id: "dashboard",
      label: "Clinical Live Dashboard",
      icon: Activity,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      id: "ai-modules",
      label: "PulseMind AI Doctor",
      icon: Brain,
      badge: "AI Pro",
      color: "text-cyan-400 bg-cyan-500/10",
    },
    {
      id: "medical-records",
      label: "Patient Medical Records",
      icon: Compass,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      id: "emergency-sos",
      label: "Emergency SOS Center",
      icon: ShieldAlert,
      badge: "SOS",
      color: "text-red-400 bg-red-500/10",
    },
    {
      id: "mental-health",
      label: "Mental Health Lounge",
      icon: HeartHandshake,
      color: "text-pink-400 bg-pink-500/10",
    },
    {
      id: "fitness",
      label: "Fitness & Workouts",
      icon: Activity,
      color: "text-amber-400 bg-amber-500/10",
    },
    {
      id: "nutrition",
      label: "Nutrition & Meals",
      icon: Utensils,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "patient-portal",
      label: "Patient Hub Settings",
      icon: User,
      color: "text-slate-400 bg-slate-500/10",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <aside
      className={`relative h-screen flex flex-col bg-[#020617] border-r border-white/5 text-[#dae2fd] transition-all duration-300 z-40 shrink-0 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45 animate-pulse"></div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-white to-[#0EA5E9]">
              PulseMind AI
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-[#c3c6d7] hover:text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Cmd+K Search trigger */}
      <div className="px-4 py-3">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between py-2 rounded-xl bg-[#020617]/50 border border-white/5 text-[#c3c6d7]/40 text-xs transition-colors hover:border-blue-500/20 hover:text-white cursor-pointer ${
            isCollapsed ? "px-2 justify-center" : "px-3"
          }`}
          title="Search Command Palette (Ctrl+K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {!isCollapsed && <span>Search system...</span>}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">
              <Command className="w-2.5 h-2.5" />K
            </div>
          )}
        </button>
      </div>

      {/* Main Menu Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeScreen === item.id;
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left group relative ${
                isActive
                  ? "bg-blue-600/15 border-blue-500/30 text-white"
                  : "bg-transparent border-transparent text-[#c3c6d7]/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isActive ? item.color : "bg-white/5 text-[#c3c6d7]/60 group-hover:text-white"
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-semibold tracking-tight truncate">
                    {item.label}
                  </span>
                )}
              </div>

              {/* Badges */}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.id === "emergency-sos"
                      ? "bg-red-500/20 text-red-400 border border-red-500/20 animate-pulse"
                      : "bg-cyan-500/25 text-cyan-400 border border-cyan-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Hover Indicator tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-20 ml-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Date and Clinical Health Index Panel */}
      {!isCollapsed && (
        <div className="m-4 p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#c3c6d7]/60">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold">Sync Ok</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#c3c6d7]/40 font-semibold uppercase tracking-wider">Health Index</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">{healthScore}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed user quick stats badge */}
      {isCollapsed && (
        <div className="py-4 flex justify-center">
          <div className="w-9 h-9 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shadow-md shadow-blue-500/5">
            {healthScore}
          </div>
        </div>
      )}

      {/* User Footer Account Profile */}
      <div className="p-4 border-t border-white/5 bg-[#020617] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#0EA5E9] border border-white/10 flex items-center justify-center font-bold text-white uppercase shadow-md shadow-blue-500/10">
            {userProfile.name[0]}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{userProfile.name}</p>
              <p className="text-[10px] text-[#0EA5E9] font-mono truncate">{userProfile.pulseId}</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg hover:bg-white/5 text-[#c3c6d7] hover:text-red-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
