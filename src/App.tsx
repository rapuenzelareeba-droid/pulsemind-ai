/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ScreenType,
  UserProfile,
  Appointment,
  Medication,
  VitalMetric,
  ActivityLog
} from "./types";

import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AIModules from "./components/AIModules";
import MedicalRecords from "./components/MedicalRecords";
import EmergencySOS from "./components/EmergencySOS";
import MentalHealth from "./components/MentalHealth";
import FitnessFitness from "./components/FitnessFitness";
import Nutrition from "./components/Nutrition";
import PatientPortal from "./components/PatientPortal";
import CommandPalette from "./components/CommandPalette";

import { Activity, Bell, Search, Info, CheckCircle, ShieldAlert } from "lucide-react";

export default function App() {
  // Navigation Screen State
  const [activeScreen, setActiveScreen] = useState<ScreenType>("landing");
  
  // Collapsed Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Command Palette Open state
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Core Patient Registry Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Aarav Sharma",
    pulseId: "PM-80281-WHO",
    bloodGroup: "B+",
    allergies: ["Penicillin"],
    emergencyContact: {
      name: "Priya Sharma",
      relationship: "Sister",
      phone: "+91 98765 43210",
    },
    age: 30,
    weight: 74.5,
    height: 178,
    bodyFat: 14.8,
    vaccinations: ["COVID Booster 2025", "Tetanus Booster 2024"],
    insuranceProvider: "Max Bupa Clinical Care",
    insurancePolicyNum: "MB-9028-CAD",
  });

  // Telemetry Vital Metrics state
  const [vitalMetric, setVitalMetric] = useState<VitalMetric>({
    heartRate: 62,
    sleepScore: 94,
    stressLevel: "Optimal",
    healthScore: 89.4,
    steps: 8420,
    caloriesBurned: 480,
    waterIntake: 1250,
    waterGoal: 3000,
    caloriesConsumed: 1340,
    calorieGoal: 1800,
  });

  // Upcoming Consultation Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctor: "Dr. Sarah Chen",
      specialty: "Cardiovascular Genomics",
      date: "2026-06-29",
      time: "10:30 AM",
      location: "Cardiology Suite B",
    },
    {
      id: "2",
      doctor: "Dr. Marc Henderson",
      specialty: "Metabolic Longevity",
      date: "2026-07-04",
      time: "02:15 PM",
      location: "Telemetry Room A",
    },
  ]);

  // Medication lists
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Atorvastatin (Lipitor)", dosage: "10mg", schedule: "Once daily", refillsRemaining: 3, time: "09:00 PM", taken: false },
    { id: "2", name: "Coenzyme Q10", dosage: "100mg", schedule: "Twice daily", refillsRemaining: 5, time: "08:00 AM", taken: true },
    { id: "3", name: "Omega-3 Ethyl Esters", dosage: "1000mg", schedule: "Once daily", refillsRemaining: 1, time: "01:00 PM", taken: false },
  ]);

  // System Transactions and Telemetry Logs list
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: "1", type: "lab", title: "Lipid Blood Panel extraction", description: "Successfully OCR parsed high-density lipids via model.", timestamp: "2h ago" },
    { id: "2", type: "medication", title: "Atorvastatin verified", description: "Standard dosage marked as completed for index.", timestamp: "5h ago" },
    { id: "3", type: "sleep", title: "Sleep stream synchronized", description: "Autonomic night score registered as optimal (94/100).", timestamp: "8h ago" },
  ]);

  // Active notifications state list
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; type: "success" | "info" | "warn" }>>([]);

  // Trigger Notification helper
  const triggerNotification = (text: string, type: "success" | "info" | "warn" = "info") => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Callback: Takes a medication
  const handleTakeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const updatedTaken = !med.taken;
          if (updatedTaken) {
            triggerNotification(`Medication "${med.name}" checked as taken!`, "success");
            // Add activity log
            setActivityLogs((logs) => [
              {
                id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                type: "medication",
                title: `${med.name} marked taken`,
                description: `Patient marked medication dose ${med.dosage} as taken successfully.`,
                timestamp: "Just now",
              },
              ...logs,
            ]);
            // Increase health score slightly for compliance!
            setVitalMetric((prevMetric) => ({
              ...prevMetric,
              healthScore: Math.min(100, parseFloat((prevMetric.healthScore + 0.5).toFixed(1))),
            }));
          }
          return { ...med, taken: updatedTaken };
        }
        return med;
      })
    );
  };

  // Callback: Book a consultation
  const handleAddAppointment = (appt: Omit<Appointment, "id">) => {
    const newId = `appt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setAppointments((prev) => [...prev, { id: newId, ...appt }]);
    triggerNotification(`Consultation booked with ${appt.doctor}!`, "success");
    setActivityLogs((logs) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: "workout",
        title: "Telemetry Consultation Booked",
        description: `Scheduled session with ${appt.doctor} (${appt.specialty}) at ${appt.time}.`,
        timestamp: "Just now",
      },
      ...logs,
    ]);
  };

  // Callback: Cancel consultation
  const handleDeleteAppointment = (id: string) => {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    if (appt) {
      triggerNotification(`Consultation with ${appt.doctor} cancelled.`, "warn");
      setActivityLogs((logs) => [
        {
          id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: "workout",
          title: "Consultation Cancelled",
          description: `Cancelled consultation session with ${appt.doctor}.`,
          timestamp: "Just now",
        },
        ...logs,
      ]);
    }
  };

  // Callback: Update Patient Profile Settings
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    triggerNotification("Patient registry credentials updated successfully.", "success");
    setActivityLogs((logs) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: "mood",
        title: "Demographic Baselines Adjusted",
        description: "Patient modified personal metrics profile securely.",
        timestamp: "Just now",
      },
      ...logs,
    ]);
  };

  // Mount Ctrl+K global keyboard tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Set up initial telemetry notification on launch
  useEffect(() => {
    if (activeScreen !== "landing") {
      triggerNotification("Autonomic cardiac wearables connected successfully.", "success");
      triggerNotification("Telemetry Live Stream initialized.", "info");
    }
  }, [activeScreen]);

  // Landing view rendering logic
  if (activeScreen === "landing") {
    return (
      <LandingPage
        onLaunchDashboard={() => {
          setActiveScreen("dashboard");
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#020617] text-[#dae2fd] font-sans">
      {/* Cmd+K Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectScreen={(scr) => {
          setActiveScreen(scr);
          triggerNotification(`Navigated to ${scr} workspace`, "info");
        }}
      />

      {/* Floating Notifications Alert Bubbles */}
      <div className="fixed top-6 right-6 z-[120] space-y-3 pointer-events-none max-w-sm">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className={`p-4 rounded-2xl border flex items-start gap-3 shadow-2xl pointer-events-auto bg-[#111827] ${
                notif.type === "success"
                  ? "border-emerald-500/20 shadow-emerald-950/20"
                  : notif.type === "warn"
                  ? "border-amber-500/20 shadow-amber-950/20"
                  : "border-blue-500/20 shadow-blue-950/20"
              }`}
            >
              <div className="mt-0.5">
                {notif.type === "success" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : notif.type === "warn" ? (
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                ) : (
                  <Info className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <p className="text-xs font-semibold text-white tracking-tight leading-relaxed">
                {notif.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Left Application Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        userProfile={userProfile}
        healthScore={vitalMetric.healthScore}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        onLogout={() => {
          setActiveScreen("landing");
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Right Content Stream Wrapper */}
      <main className="flex-1 overflow-y-auto bg-[#020617] px-6 md:px-12 py-8 relative">
        {/* Ambient Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#06B6D4]/10 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10">
          {/* Universal Top Workspace Controls Bar */}
          <div className="flex justify-between items-center border-b border-white/5 pb-5 mb-8 text-xs text-[#c3c6d7]/50 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-blue-500 animate-pulse" /> Precision Link</span>
              <span className="hidden sm:inline">HIPAA Compliant Session</span>
            </div>

            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search (Ctrl+K)
              </button>
              <span className="relative cursor-pointer hover:text-white" title="Active Alerts">
                <Bell className="w-4.5 h-4.5 text-[#c3c6d7]" />
                <span className="absolute top-[-2px] right-[-2px] w-2 h-2 rounded-full bg-blue-500" />
              </span>
            </div>
          </div>

          {/* Dynamic Inner Screens Router switcher */}
          <div className="max-w-7xl mx-auto">
          {activeScreen === "dashboard" && (
            <Dashboard
              vitalMetric={vitalMetric}
              appointments={appointments}
              medications={medications}
              activityLogs={activityLogs}
              onTakeMedication={handleTakeMedication}
              onAddAppointment={handleAddAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}

          {activeScreen === "ai-modules" && <AIModules />}

          {activeScreen === "medical-records" && (
            <MedicalRecords userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
          )}

          {activeScreen === "emergency-sos" && <EmergencySOS userProfile={userProfile} />}

          {activeScreen === "mental-health" && <MentalHealth />}

          {activeScreen === "fitness" && <FitnessFitness />}

          {activeScreen === "nutrition" && <Nutrition />}

          {activeScreen === "patient-portal" && (
            <PatientPortal userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
