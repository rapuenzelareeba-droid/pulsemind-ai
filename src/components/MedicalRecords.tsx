/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Compass, ShieldCheck, Heart, Trash2, Plus, Sparkles } from "lucide-react";
import { UserProfile } from "../types";

interface MedicalRecordsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export default function MedicalRecords({ userProfile, onUpdateProfile }: MedicalRecordsProps) {
  const [newAllergy, setNewAllergy] = useState("");
  const [newVaccine, setNewVaccine] = useState("");

  const [familyProfiles, setFamilyProfiles] = useState<Array<{ name: string; age: number; relation: string; bloodGroup: string }>>([
    { name: "Suresh Sharma", age: 58, relation: "Father", bloodGroup: "B+" },
    { name: "Kiran Sharma", age: 54, relation: "Mother", bloodGroup: "O+" },
  ]);
  const [famName, setFamName] = useState("");
  const [famAge, setFamAge] = useState("");
  const [famRelation, setFamRelation] = useState("Spouse");
  const [famBlood, setFamBlood] = useState("O+");

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    onUpdateProfile({
      allergies: [...userProfile.allergies, newAllergy.trim()],
    });
    setNewAllergy("");
  };

  const handleDeleteAllergy = (allergy: string) => {
    onUpdateProfile({
      allergies: userProfile.allergies.filter((a) => a !== allergy),
    });
  };

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaccine.trim()) return;
    onUpdateProfile({
      vaccinations: [...userProfile.vaccinations, newVaccine.trim()],
    });
    setNewVaccine("");
  };

  const handleDeleteVaccine = (vac: string) => {
    onUpdateProfile({
      vaccinations: userProfile.vaccinations.filter((v) => v !== vac),
    });
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName || !famAge) return;
    setFamilyProfiles((prev) => [
      ...prev,
      {
        name: famName,
        age: parseInt(famAge),
        relation: famRelation,
        bloodGroup: famBlood,
      },
    ]);
    setFamName("");
    setFamAge("");
  };

  const handleDeleteFamily = (idx: number) => {
    setFamilyProfiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          Patient Medical Records
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Clinical registry details, active vaccine history, severe allergies, and authorized family member delegation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Profile Card Registry (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Compass className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Registry Credentials</h3>
          </div>

          <div className="space-y-3.5">
            <div className="p-4 bg-[#020617]/50 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-[#c3c6d7]/40 font-semibold uppercase">Authorized Patient ID</span>
              <p className="text-sm font-bold text-white font-mono text-blue-400">{userProfile.pulseId}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60">
                <p className="font-semibold text-white/40 text-[9px] uppercase">Blood Type</p>
                <p className="text-base font-bold text-white mt-1">{userProfile.bloodGroup}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60">
                <p className="font-semibold text-white/40 text-[9px] uppercase">Age Index</p>
                <p className="text-base font-bold text-white mt-1">{userProfile.age} Yrs</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60">
                <p className="font-semibold text-white/40 text-[9px] uppercase">Weight</p>
                <p className="text-sm font-bold text-white mt-1">{userProfile.weight} KG</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60">
                <p className="font-semibold text-white/40 text-[9px] uppercase">Height</p>
                <p className="text-sm font-bold text-white mt-1">{userProfile.height} CM</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60 space-y-1">
              <p className="font-semibold text-white/40 text-[9px] uppercase">HIPAA Insurance Carrier</p>
              <p className="font-bold text-white">{userProfile.insuranceProvider}</p>
              <p className="text-[10px] text-blue-400 font-mono">Policy: {userProfile.insurancePolicyNum}</p>
            </div>
          </div>
        </div>

        {/* Allergy and Vaccines Hub (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergies Container */}
            <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider flex justify-between items-center">
                <span>Severe Allergies</span>
                <span className="text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded-full">HIGH RISK</span>
              </h4>

              <form onSubmit={handleAddAllergy} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts"
                  className="flex-1 p-2 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
                <button type="submit" className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer">
                  Add
                </button>
              </form>

              <div className="space-y-2">
                {userProfile.allergies.length === 0 ? (
                  <p className="text-xs text-[#c3c6d7]/30 text-center py-4">No critical allergy records.</p>
                ) : (
                  userProfile.allergies.map((allergy) => (
                    <div key={allergy} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <span className="font-semibold text-white">{allergy}</span>
                      <button onClick={() => handleDeleteAllergy(allergy)} className="text-[#c3c6d7]/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Vaccines Container */}
            <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider flex justify-between items-center">
                <span>Vaccinations Registry</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">UP TO DATE</span>
              </h4>

              <form onSubmit={handleAddVaccine} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Covid booster, Tetanus"
                  className="flex-1 p-2 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                  value={newVaccine}
                  onChange={(e) => setNewVaccine(e.target.value)}
                />
                <button type="submit" className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer">
                  Add
                </button>
              </form>

              <div className="space-y-2">
                {userProfile.vaccinations.length === 0 ? (
                  <p className="text-xs text-[#c3c6d7]/30 text-center py-4">No vaccine history records.</p>
                ) : (
                  userProfile.vaccinations.map((vac) => (
                    <div key={vac} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <span className="font-semibold text-white">{vac}</span>
                      <button onClick={() => handleDeleteVaccine(vac)} className="text-[#c3c6d7]/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Family profile delegation */}
          <div className="p-6 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl shadow-lg space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Family Health Accounts Delegation</h3>
            <p className="text-xs text-[#c3c6d7]/50 font-light">Link family accounts to delegate telemedicine consults or emergency access.</p>

            <form onSubmit={handleAddFamily} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                value={famName}
                onChange={(e) => setFamName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Age"
                className="p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                value={famAge}
                onChange={(e) => setFamAge(e.target.value)}
                required
              />
              <select
                className="p-2.5 bg-[#020617]/50 border border-white/10 rounded-xl text-xs text-white"
                value={famRelation}
                onChange={(e) => setFamRelation(e.target.value)}
              >
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
              </select>
              <button type="submit" className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer">
                Delegate Profile
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyProfiles.map((fam, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-[#020617]/50 border border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">{fam.name}</p>
                    <p className="text-xs text-[#c3c6d7]/50 font-medium">
                      {fam.relation} • {fam.age} Yrs old • Blood {fam.bloodGroup}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteFamily(idx)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#c3c6d7]/40 hover:text-red-400 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
