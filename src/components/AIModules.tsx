/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  MessageSquare,
  FileText,
  Activity,
  Send,
  Upload,
  RefreshCw,
  Shield,
  FileWarning,
  CheckCircle,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { ReportAnalysisResult } from "../types";

export default function AIModules() {
  const [activeTab, setActiveTab] = useState<"doctor" | "checker" | "analyzer">("doctor");

  // State: AI Doctor Q&A
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am PulseMind AI, your precision healthcare coach. How can I help you understand your biomarkers, diet, or clinical metrics today?",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // State: Symptom Checker
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("Male");
  const [vitalsHeart, setVitalsHeart] = useState("68");
  const [checkerResult, setCheckerResult] = useState<string | null>(null);
  const [checkerLoading, setCheckerLoading] = useState(false);

  // State: Lab Report Analyzer
  const [reportResult, setReportResult] = useState<ReportAnalysisResult | null>(null);
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  // Handles chat input submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          systemInstruction:
            "You are PulseMind AI Doctor Coach. Respond in an extremely authoritative, scientific, professional medical consultant tone. Provide evidence-based clinical insights, structure recommendations with logical spacing, and always append a clear, non-obtrusive medical disclaimer.",
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: data.text || "No response received." }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Failed to fetch response. Please verify your internet connection or backend configuration." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handles symptom checker submit
  const handleCheckSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || checkerLoading) return;

    setCheckerLoading(true);
    setCheckerResult(null);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Check symptoms for a ${age} year old ${gender}. Standard heart rate is ${vitalsHeart} BPM. Symptoms described: "${symptoms}"`,
          systemInstruction:
            "You are PulseMind AI Disease Diagnostic assistant. Estimate possible conditions with specific estimated probability indexes (e.g. 10%, 40%), classify clinical urgency levels, suggest home wellness care remedies, and write crucial triage rules (e.g., when to seek emergency help). Clearly structure the results in readable sections. Do not use generic placeholders.",
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setCheckerResult(data.text);
    } catch (err: any) {
      console.error(err);
      setCheckerResult("Error calculating diagnosis. Please verify your backend API key settings.");
    } finally {
      setCheckerLoading(false);
    }
  };

  // Helper: converts file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Strip out the data:image/...;base64, prefix
        const cleanBase64 = base64String.split(",")[1];
        resolve(cleanBase64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handles OCR report uploader
  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzerLoading(true);
    setReportResult(null);
    setAnalyzerError(null);

    try {
      const base64Data = await fileToBase64(file);
      const payload = {
        fileData: base64Data,
        mimeType: file.type || "image/png",
        fileName: file.name,
      };

      const res = await fetch("/api/gemini/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const parsedJson = await res.json();
      setReportResult(parsedJson);
    } catch (err: any) {
      console.error("OCR Report upload error:", err);
      setAnalyzerError(err.message || "Failed to parse lab report. Ensure a valid PNG, JPG, or PDF is uploaded.");
    } finally {
      setAnalyzerLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          PulseMind Precision AI Clinic
        </h1>
        <p className="text-sm text-[#c3c6d7]/60 font-light mt-1">
          Deep reasoning models providing advanced medical diagnostics, laboratory parsing, and longevity coaching.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("doctor")}
          className={`pb-3 text-sm font-semibold relative cursor-pointer ${
            activeTab === "doctor" ? "text-blue-400" : "text-[#c3c6d7]/50 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>AI Health Coach Chat</span>
          </div>
          {activeTab === "doctor" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("checker")}
          className={`pb-3 text-sm font-semibold relative cursor-pointer ${
            activeTab === "checker" ? "text-cyan-400" : "text-[#c3c6d7]/50 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Clinical Symptom Checker</span>
          </div>
          {activeTab === "checker" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("analyzer")}
          className={`pb-3 text-sm font-semibold relative cursor-pointer ${
            activeTab === "analyzer" ? "text-pink-400" : "text-[#c3c6d7]/50 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Laboratory Report Analyzer</span>
          </div>
          {activeTab === "analyzer" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="min-h-[400px]">
        {/* TAB 1: AI DOCTOR CHAT COACH */}
        {activeTab === "doctor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
            {/* Chat Area (8 cols) */}
            <div className="lg:col-span-8 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between h-full shadow-lg">
              {/* Message Log */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-[#020617]/70 border border-white/5 text-[#dae2fd] font-light"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#020617]/70 border border-white/5 rounded-2xl p-4 text-xs text-[#c3c6d7]/60 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                      Formulating evidence-based answer...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Ask about lipids, hydration schedules, stress levels..."
                  className="flex-1 p-3.5 rounded-2xl bg-[#020617]/85 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-45 cursor-pointer flex items-center justify-center shadow-lg shadow-blue-500/15"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Coach Context Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-4">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white text-sm uppercase tracking-wider">Clinical Guidance</h4>
                </div>
                <p className="text-xs text-[#c3c6d7]/75 leading-relaxed font-light">
                  PulseMind AI Doctor utilizes the fine-tuned Gemini model configured with a strict clinical guideline mask to prioritize evidence-based medical literature and safe, non-invasive advice.
                </p>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-[#c3c6d7]/60 font-medium">HIPAA Encryption Active</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#111827]/60 border border-white/5 backdrop-blur-md shadow-lg space-y-3">
                <h5 className="font-bold text-white text-xs uppercase">Suggested Queries:</h5>
                <ul className="space-y-2 text-xs text-[#c3c6d7]/60 font-light">
                  <li
                    onClick={() => setChatInput("Explain how HDL vs LDL cholesterol values impact coronary calcium indexes.")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600/10 hover:text-white transition-all cursor-pointer border border-transparent hover:border-blue-500/25"
                  >
                    "Explain HDL vs LDL cholesterol..."
                  </li>
                  <li
                    onClick={() => setChatInput("What are safe breathing pacing exercises to lower resting heart rate from 80 to 60 BPM?")}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600/10 hover:text-white transition-all cursor-pointer border border-transparent hover:border-blue-500/25"
                  >
                    "Pacing exercises to reduce heart rate..."
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLINICAL SYMPTOM CHECKER */}
        {activeTab === "checker" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg h-fit space-y-4">
              <h3 className="text-lg font-bold text-white">Symptom Profiler</h3>
              <p className="text-xs text-[#c3c6d7]/50 font-light">Provide details to calculate possible matches</p>

              <form onSubmit={handleCheckSymptoms} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#c3c6d7]/60">Age</label>
                    <input
                      type="number"
                      className="w-full p-2.5 rounded-xl bg-[#020617]/50 border border-white/10 text-xs text-white"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#c3c6d7]/60">Assigned Gender</label>
                    <select
                      className="w-full p-2.5 rounded-xl bg-[#020617]/50 border border-white/10 text-xs text-white"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c3c6d7]/60">Current Resting Heart Rate (BPM)</label>
                  <input
                    type="number"
                    className="w-full p-2.5 rounded-xl bg-[#020617]/50 border border-white/10 text-xs text-white"
                    value={vitalsHeart}
                    onChange={(e) => setVitalsHeart(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#c3c6d7]/60">Describe Symptoms</label>
                  <textarea
                    rows={4}
                    placeholder="Enter pain scale, location, duration, and triggering factors (e.g. pain in wrist when rotating, scale 3/10, lasts 3 days)"
                    className="w-full p-3 rounded-xl bg-[#020617]/50 border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-cyan-500"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkerLoading}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-600/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {checkerLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Computing Clinical Model...
                    </>
                  ) : (
                    "Run Symptom Check"
                  )}
                </button>
              </form>
            </div>

            {/* Diagnostic Results Output (7 cols) */}
            <div className="lg:col-span-7 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg min-h-[400px] flex flex-col justify-between">
              {checkerResult ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-xs text-[#c3c6d7]/40 font-semibold uppercase">Predictive Diagnostic Response</span>
                    <span className="px-2.5 py-0.5 bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <FileWarning className="w-3 h-3" /> INFORMATIONAL ONLY
                    </span>
                  </div>

                  <div className="text-sm leading-relaxed text-[#dae2fd] whitespace-pre-line font-light">
                    {checkerResult}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full py-12 text-[#c3c6d7]/40 space-y-3">
                  <Brain className="w-12 h-12 stroke-[1.2] text-[#c3c6d7]/20" />
                  <div>
                    <p className="text-sm font-semibold text-white/70">No Diagnostic Computed</p>
                    <p className="text-xs max-w-sm mt-1">
                      Describe symptoms and press "Run Symptom Check" to model probabilities and clinical next steps.
                    </p>
                  </div>
                </div>
              )}

              {/* Mandatory Triage Warning Disclaimer footer inside card */}
              <div className="mt-8 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-[#c3c6d7]/50 leading-relaxed flex items-start gap-2.5">
                <FileWarning className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Triage Guideline:</span> Diagnostic forecasts are calculated via clinical probability models. If experiencing severe chest compression, shortness of breath, acute localized pain, or high fevers, trigger the <span className="text-red-400 font-bold">Emergency SOS beacon</span> immediately or contact nearest clinical hospital.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LABORATORY REPORT ANALYZER & OCR */}
        {activeTab === "analyzer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            {/* File Drag / Upload (4 cols) */}
            <div className="lg:col-span-4 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg h-fit space-y-4">
              <h3 className="text-lg font-bold text-white">Upload Laboratory Panel</h3>
              <p className="text-xs text-[#c3c6d7]/50 font-light">
                Securely drop clinical blood panels, CBC profiles, PDF, PNG, or JPEG reports.
              </p>

              <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/40 transition-all relative flex flex-col items-center justify-center space-y-2 cursor-pointer bg-[#020617]/40">
                <Upload className="w-8 h-8 text-[#c3c6d7]/30" />
                <div className="text-xs text-[#c3c6d7]/60">
                  <span className="font-semibold text-white">Click to select file</span> or drag & drop here
                </div>
                <p className="text-[10px] text-[#c3c6d7]/30">PDF, PNG, JPG (Max 15MB)</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReportUpload}
                  disabled={analyzerLoading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {analyzerLoading && (
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs text-[#c3c6d7]/60 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  Running clinical OCR & structured extraction...
                </div>
              )}

              {analyzerError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-xl">
                  {analyzerError}
                </div>
              )}

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[10px] text-[#c3c6d7]/50 font-light leading-relaxed">
                <span className="font-bold text-white">Privacy Seal:</span> File contents are analyzed securely using transient memory. No persistent storage is committed under HIPAA-compliant routing policies.
              </div>
            </div>

            {/* Extracted Structured Biomarkers (8 cols) */}
            <div className="lg:col-span-8 bg-[#111827]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg">
              {reportResult ? (
                <div className="space-y-6">
                  {/* Summary & Confidence Headers */}
                  <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h4 className="font-extrabold text-white text-lg">Lab Panel Interpretation</h4>
                      <p className="text-xs text-[#c3c6d7]/50 font-medium">Patient: {reportResult.patientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#c3c6d7]/50 font-bold uppercase">Confidence Score</p>
                      <span className="text-xl font-bold text-blue-400">{reportResult.confidence}%</span>
                    </div>
                  </div>

                  {/* Clinical Summary */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                    <span className="text-[10px] text-[#c3c6d7]/40 font-semibold uppercase tracking-wider">Overall Clinical Summary</span>
                    <p className="text-xs text-white leading-relaxed font-light">{reportResult.summary}</p>
                  </div>

                  {/* Biomarkers Table */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#c3c6d7]/40 font-semibold uppercase tracking-wider block mb-2">Biomarker Extraction Entities</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#dae2fd]">
                        <thead>
                          <tr className="border-b border-white/10 text-[#c3c6d7]/40">
                            <th className="pb-2 font-semibold">Biomarker Entity</th>
                            <th className="pb-2 font-semibold">Observed Value</th>
                            <th className="pb-2 font-semibold">Reference Interval</th>
                            <th className="pb-2 font-semibold text-right">Status State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {reportResult.entities?.map((ent, idx) => (
                            <tr key={idx} className="hover:bg-white/5">
                              <td className="py-2.5 font-bold text-white">{ent.name}</td>
                              <td className="py-2.5 font-mono text-cyan-400 font-medium">{ent.value}</td>
                              <td className="py-2.5 font-mono text-[#c3c6d7]/60">{ent.referenceRange}</td>
                              <td className="py-2.5 text-right">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                  ent.status === "optimal"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                    : ent.status === "critical"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/25 animate-pulse"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {ent.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#c3c6d7]/40 font-semibold uppercase tracking-wider block">Lifestyle & Clinical Action Items</span>
                    <ul className="space-y-1.5">
                      {reportResult.recommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#dae2fd]/90 font-light">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 text-[#c3c6d7]/40 space-y-3 min-h-[350px]">
                  <FileText className="w-12 h-12 stroke-[1.2] text-[#c3c6d7]/20" />
                  <div>
                    <p className="text-sm font-semibold text-white/70">No Lab Report Analyzed</p>
                    <p className="text-xs max-w-sm mt-1">
                      Upload a clinical blood report image or PDF on the left panel to trigger automatic OCR entity interpretation and recommendation graphs.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
