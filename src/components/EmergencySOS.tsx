/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  MapPin,
  Radio,
  Phone,
  QrCode,
  CheckCircle,
  FileWarning,
  Heart,
  ChevronRight,
  Activity
} from "lucide-react";
import { UserProfile } from "../types";

interface EmergencySOSProps {
  userProfile: UserProfile;
}

export default function EmergencySOS({ userProfile }: EmergencySOSProps) {
  const [isBeaconActive, setIsBeaconActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState({ lat: 28.6139, lng: 77.209 }); // Mock default coordinates
  const [beaconDuration, setBeaconDuration] = useState(0);

  // Random GPS offset simulation when beacon is active to represent moving tracker
  useEffect(() => {
    let interval: any;
    if (isBeaconActive) {
      interval = setInterval(() => {
        setBeaconDuration((prev) => prev + 1);
        setGpsCoords((prev) => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.0002,
          lng: prev.lng + (Math.random() - 0.5) * 0.0002,
        }));
      }, 1000);
    } else {
      setBeaconDuration(0);
    }
    return () => clearInterval(interval);
  }, [isBeaconActive]);

  const toggleBeacon = () => {
    setIsBeaconActive(!isBeaconActive);
  };

  const hospitals = [
    { name: "Max Super Specialty Hospital", dist: "1.2 KM", phone: "+91 11-4055-4055", location: "Saket Institutional Area" },
    { name: "Fortis Escorts Heart Institute", dist: "3.4 KM", phone: "+91 11-4713-5000", location: "Okhla Road, New Delhi" },
    { name: "All India Institute of Medical Sciences (AIIMS)", dist: "4.8 KM", phone: "+91 11-2658-8500", location: "Ansari Nagar" },
  ];

  const guides = [
    {
      title: "Cardiac Distress (CPR)",
      steps: [
        "Verify responsive status by shaking shoulders and talking clearly.",
        "Check breathing stream. If missing, trigger EMS immediately.",
        "Position hands on center of chest. Perform 100-120 compressions per minute.",
        "Compress chest exactly 2 inches deep. Allow complete recoil.",
      ],
    },
    {
      title: "Acute Stroke (F.A.S.T.)",
      steps: [
        "Face drooping: Ask person to smile. Is one side drooping?",
        "Arm weakness: Ask person to raise both arms. Does one drift down?",
        "Speech difficulty: Ask person to repeat a simple phrase. Is speech slurred?",
        "Time to call emergency services: Prompt action preserves brain tissue.",
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Emergency SOS Command Center
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          High-urgency satellite telemetry beacons, automated hospital notifications, and certified medical ID cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BIG BEACON PANEL (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[480px]">
          {/* Beacon Glowing Indicator in Background */}
          {isBeaconActive && (
            <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
          )}

          <div className="w-full">
            <div className="flex justify-between items-center w-full mb-6">
              <span className="text-xs text-[#c3c6d7]/40 font-bold uppercase tracking-widest">
                Satellite Uplink Status
              </span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                isBeaconActive
                  ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                  : "bg-white/5 text-[#c3c6d7]/40 border-white/5"
              }`}>
                {isBeaconActive ? "● TRANSMITTING BEACON" : "IDLE"}
              </span>
            </div>
          </div>

          {/* Pulse Emergency Button */}
          <div className="relative my-8">
            <button
              onClick={toggleBeacon}
              className={`relative z-10 w-44 h-44 rounded-full border-4 font-extrabold text-xl font-sans tracking-wide transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-2xl ${
                isBeaconActive
                  ? "bg-red-600 border-red-400 text-white shadow-red-600/30"
                  : "bg-red-950/25 border-red-600/40 text-red-500 hover:border-red-500 hover:text-red-400 hover:bg-red-900/10"
              }`}
            >
              <ShieldAlert className="w-9 h-9 mb-1 animate-bounce" />
              <span>{isBeaconActive ? "STOP SOS" : "TRIGGER SOS"}</span>
            </button>
            {isBeaconActive && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-[ping_2s_ease-in-out_infinite]" />
                <div className="absolute inset-[-15px] rounded-full bg-red-500/10 animate-[ping_3s_ease-in-out_infinite]" />
              </>
            )}
          </div>

          <div className="space-y-3.5 w-full z-10">
            {isBeaconActive ? (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-1">
                <p className="font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 animate-spin" /> Broadcast stream live
                </p>
                <p className="font-mono text-[10px] text-white">Lat: {gpsCoords.lat.toFixed(6)} | Lng: {gpsCoords.lng.toFixed(6)}</p>
                <p className="text-[10px] font-semibold text-red-400/80 mt-1">Duration: {beaconDuration}s • Holy Family Hospital alerted</p>
              </div>
            ) : (
              <p className="text-xs text-[#c3c6d7]/50 font-light leading-relaxed">
                Pressing this button activates a secure satellite telemetry broadcast, locks your active GPS coordinates, and relays emergency records immediately to registered nearby hospital hubs.
              </p>
            )}

            <div className="flex gap-4 justify-center text-xs text-[#c3c6d7]/60">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-blue-500" /> GPS Tracked</span>
              <span className="flex items-center gap-1"><Radio className="w-4 h-4 text-blue-500" /> Radio Uplink</span>
            </div>
          </div>
        </div>

        {/* MEDICAL ID & NEAREST CLINICS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* QR MEDICAL ID CARD */}
          <div className="p-6 bg-gradient-to-br from-[#1e293b]/60 to-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 rounded-full bg-blue-500/10 blur-xl" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  Verified HIPAA Medical ID
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{userProfile.name}</h3>
                  <p className="text-xs text-blue-400 font-mono mt-0.5">{userProfile.pulseId}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2 text-xs">
                  <div>
                    <span className="text-white/40 uppercase text-[9px]">Blood Group</span>
                    <p className="font-bold text-white text-sm">{userProfile.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-[9px]">Severe Allergies</span>
                    <p className="font-bold text-white text-sm truncate">{userProfile.allergies.join(", ") || "None recorded"}</p>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-[9px]">Emergency Contact</span>
                    <p className="font-bold text-white text-sm truncate">{userProfile.emergencyContact.name}</p>
                    <p className="text-[10px] text-[#c3c6d7]/60 font-mono mt-0.5">{userProfile.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-[9px]">Insurance ID</span>
                    <p className="font-bold text-[#c3c6d7] text-xs font-mono">{userProfile.insurancePolicyNum}</p>
                  </div>
                </div>
              </div>

              {/* Digital QR Code wrapper */}
              <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 self-center md:self-auto border border-white/15">
                <QrCode className="w-20 h-20 text-slate-900" />
                <span className="text-[8px] text-slate-900/60 font-bold tracking-widest mt-1.5 uppercase">SCAN MEDICAL CARD</span>
              </div>
            </div>
          </div>

          {/* NEAREST HOSPITALS */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Nearest Authorized EMS Hospitals</h4>
            <div className="space-y-3">
              {hospitals.map((hosp, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 rounded-2xl bg-[#020617]/50 border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{hosp.name}</p>
                    <p className="text-xs text-[#c3c6d7]/50 mt-0.5">{hosp.location} • <span className="text-cyan-400 font-semibold">{hosp.dist}</span></p>
                  </div>

                  <a
                    href={`tel:${hosp.phone}`}
                    className="p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all cursor-pointer"
                    title="Call EMS directly"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY FIRST AID GUIDE */}
      <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Clinical First Aid Protocol Guidelines</h3>
          <p className="text-xs text-[#c3c6d7]/50">Official instruction summaries for critical stabilization situations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-3">
              <h5 className="font-bold text-white text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                {g.title}
              </h5>
              <ul className="space-y-2">
                {g.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#dae2fd]/70 font-light leading-relaxed">
                    <span className="text-blue-400 font-mono font-bold mt-0.5">{i + 1}.</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
