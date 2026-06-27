/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, ShieldCheck, CreditCard, CheckCircle, RefreshCw, FileText } from "lucide-react";
import { UserProfile } from "../types";

interface PatientPortalProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export default function PatientPortal({ userProfile, onUpdateProfile }: PatientPortalProps) {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age.toString());
  const [weight, setWeight] = useState(userProfile.weight.toString());
  const [height, setHeight] = useState(userProfile.height.toString());

  // Payment states
  const [copayAmount, setCopayAmount] = useState("45");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardHolder, setCardHolder] = useState(userProfile.name);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      age: parseInt(age) || userProfile.age,
      weight: parseFloat(weight) || userProfile.weight,
      height: parseFloat(height) || userProfile.height,
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setPaymentSuccess(false);

    // Simulate clinical settlement processor delay
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Patient Portal Settings
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Review premium clinical subscriptions, settles laboratory co-pays, and update physical telemetry baselines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PHYSICAL BASELINE CONTROLS (6 cols) */}
        <div className="lg:col-span-6 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-5">
          <div className="flex items-center gap-2.5 text-blue-400">
            <User className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Demographic & Telemetry Settings</h3>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#c3c6d7]/60">Patient Name</label>
              <input
                type="text"
                className="w-full p-3 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#c3c6d7]/60">Age Index</label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#c3c6d7]/60">Weight (KG)</label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#c3c6d7]/60">Height (CM)</label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/15">
              Save Baseline Updates
            </button>
          </form>

          {/* Security details info */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Cryptographic protection
            </span>
            <p className="text-[10px] text-[#c3c6d7]/50 leading-relaxed font-light">
              Your patient identifier logs are protected under 256-bit secure end-to-end telemetry encryption policies.
            </p>
          </div>
        </div>

        {/* CLINICAL BILLING & CO-PAYS SETTLEMENTS (6 cols) */}
        <div className="lg:col-span-6 p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-5">
          <div className="flex items-center gap-2.5 text-blue-400">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Clinical Co-Pays settling</h3>
          </div>

          {/* Visa Card Layout */}
          <div className="w-full aspect-[1.7] rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] border border-white/20 p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/5 rounded-full blur-xl" />
            
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-widest uppercase">PULSEMIND HEALTHCARE</span>
              <CreditCard className="w-8 h-8 opacity-80" />
            </div>

            <p className="text-lg font-mono font-medium tracking-widest">{cardNumber}</p>

            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[8px] opacity-60 uppercase">Patient Holder</span>
                <p className="font-bold tracking-tight">{cardHolder}</p>
              </div>
              <div>
                <span className="text-[8px] opacity-60 uppercase font-mono">Expires</span>
                <p className="font-bold font-mono">08/29</p>
              </div>
            </div>
          </div>

          {/* Payment processor form */}
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#c3c6d7]/60">Copay Amount ($)</label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={copayAmount}
                  onChange={(e) => setCopayAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#c3c6d7]/60">Simulator Card</label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white font-mono"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPaying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPaying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Stripe Copay...
                </>
              ) : (
                `Settle Copay of $${copayAmount}`
              )}
            </button>
          </form>

          {/* Payment Success state display */}
          {paymentSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 rounded-xl flex items-start gap-2.5 animate-bounce">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Copay Settled successfully!</span>
                <p className="text-[10px] text-emerald-400/80 mt-0.5">Stripe transaction ref: PM-90281-WHO5. Ledger audited.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
