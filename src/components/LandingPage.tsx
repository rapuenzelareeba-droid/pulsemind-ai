/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Activity, Brain, ArrowRight, Play, Heart, Shield, Globe, Users, MessageSquare } from "lucide-react";

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export default function LandingPage({ onLaunchDashboard }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HTML5 Canvas Neural Mesh & Pulse Brain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Neural particles
    const particleCount = 80;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulseOffset: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a sphere-like shape in the center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(width, height) * 0.25;
      particles.push({
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw pulsing center background glow
      const basePulse = Math.sin(time) * 15 + 180;
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        basePulse * 1.5
      );
      glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.15)");
      glowGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.05)");
      glowGrad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Connect particles with translucent lines (mesh)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        
        // Orbital motion towards center to preserve neural shape
        const dx = p1.x - width / 2;
        const dy = p1.y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Soft force pulling particles back to central cluster
        const force = 0.002;
        p1.vx -= dx * force;
        p1.vy -= dy * force;

        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Pulse size
        const pSize = p1.radius + Math.sin(time * 2 + p1.pulseOffset) * 0.5;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + Math.sin(time + p1.pulseOffset) * 0.2})`;
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const distSq = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
          const maxDist = 90;

          if (distSq < maxDist * maxDist) {
            const currentDist = Math.sqrt(distSq);
            const opacity = (1 - currentDist / maxDist) * 0.18;
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw central animated neural heart pulse indicator
      ctx.beginPath();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.4)";
      ctx.lineWidth = 1;
      const pulseRadius = 130 + Math.sin(time * 3) * 6;
      ctx.arc(width / 2, height / 2, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617] text-[#dae2fd] overflow-x-hidden selection:bg-blue-600/30">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-16 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-blue-500/45 flex items-center justify-center text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-2xl font-bold font-sans tracking-tight text-white">
              PulseMind <span className="text-blue-500">AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center text-sm text-[#c3c6d7] font-medium">
            <a href="#platform" className="hover:text-blue-400 transition-colors">Platform</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">AI Demo</a>
            <a href="#roadmap" className="hover:text-blue-400 transition-colors">Evolution</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="text-[#c3c6d7] hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onLaunchDashboard}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
            >
              Launch Platform
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6 overflow-hidden">
        {/* Particle/Mesh Background */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Backdrop Aurora Ambient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-cyan-600/5 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center space-y-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>V2.0 NOW IN BETA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl lg:text-[84px] leading-[1.05] font-extrabold tracking-tight text-white font-sans"
          >
            The Future of <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 bg-clip-text text-transparent">Precision Health</span> is Here.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[#c3c6d7] max-w-2xl mx-auto font-light leading-relaxed"
          >
            PulseMind AI integrates predictive analytics, real-time diagnostics, and personalized coaching into one seamless, clinical-grade medical ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full sm:w-auto"
          >
            <button
              onClick={onLaunchDashboard}
              className="group flex items-center justify-center gap-2 bg-white hover:bg-[#F8FAFC] text-[#020617] px-8 py-4 rounded-full font-bold text-base transition-all active:scale-95 cursor-pointer shadow-xl shadow-white/5"
            >
              Launch Live Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLaunchDashboard}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-full font-semibold text-base transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              Watch Vision Video
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="platform" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Engineered for Longevity
          </h2>
          <p className="text-base text-[#c3c6d7] font-light">
            Our platform merges clinical intelligence with elegant software interfaces. No compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Box 1: AI Doctor & Checker */}
          <div className="md:col-span-5 p-8 rounded-3xl bg-[#111827]/60 border border-white/5 backdrop-blur-md flex flex-col justify-between group hover:border-blue-500/40 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Clinical Symptom Checker</h3>
              <p className="text-sm text-[#c3c6d7] font-light leading-relaxed">
                Instant medical insights powered by our fine-tuned clinical LLM. Securely upload labs or describe symptoms for real-time analysis.
              </p>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 cursor-pointer hover:bg-blue-950/20 transition-all">
                <p className="text-xs text-blue-400 font-semibold mb-1">User Symptom Query:</p>
                <p className="text-sm text-white">"I have a persistent dull ache in my chest after running..."</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#020617]/30 border border-white/5 opacity-60">
                <p className="text-xs text-cyan-400 font-semibold mb-1">PulseMind Clinical Analysis:</p>
                <p className="text-xs text-white">Analyzing biomarkers, age, ECG data + formulating risk index...</p>
              </div>
            </div>
          </div>

          {/* Bento Box 2: Live Statistics */}
          <div className="md:col-span-7 p-8 rounded-3xl bg-[#111827]/60 border border-white/5 backdrop-blur-md flex flex-col justify-between group hover:border-blue-500/40 transition-all shadow-xl overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">Precision Live Vitals</h3>
                <p className="text-sm text-[#c3c6d7] font-light">Real-time sync to medical wearables and trackers.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                LIVE SYNC
              </span>
            </div>

            {/* Simulated Clinical Waves SVG Chart */}
            <div className="w-full h-44 my-4 bg-[#020617]/60 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden relative">
              <svg className="w-full h-full p-4" viewBox="0 0 400 150">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* Heart Beat Wave */}
                <path
                  d="M 0 75 L 40 75 L 50 50 L 55 100 L 60 20 L 65 110 L 70 75 L 120 75 L 130 65 L 135 75 L 180 75 L 190 40 L 195 110 L 200 75 L 260 75 L 270 50 L 275 100 L 280 20 L 285 110 L 290 75 L 400 75"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-pulse"
                />
                <path
                  d="M 0 75 L 40 75 L 50 50 L 55 100 L 60 20 L 65 110 L 70 75 L 120 75 L 130 65 L 135 75 L 180 75 L 190 40 L 195 110 L 200 75 L 260 75 L 270 50 L 275 100 L 280 20 L 285 110 L 290 75 L 400 75 L 400 150 L 0 150 Z"
                  fill="url(#chartGrad)"
                  opacity="0.5"
                />
              </svg>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] text-[#c3c6d7]/60 font-semibold uppercase">Resting Heart Rate</span>
                <span className="text-xl font-bold text-blue-400">62 BPM</span>
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] text-[#c3c6d7]/60 font-semibold uppercase">Sleep Longevity</span>
                <span className="text-xl font-bold text-cyan-400">94/100</span>
              </div>
              <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] text-[#c3c6d7]/60 font-semibold uppercase">Autonomic Stress Index</span>
                <span className="text-xl font-bold text-emerald-400">Low</span>
              </div>
            </div>
          </div>

          {/* Bento Box 3: Health Risk Score Panel */}
          <div className="md:col-span-12 p-8 rounded-3xl bg-[#111827]/60 border border-white/5 backdrop-blur-md flex flex-col md:flex-row items-center gap-8 hover:border-blue-500/40 transition-all shadow-xl relative overflow-hidden">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5" />
                <span>REAL-TIME BIOMETRICS</span>
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">The Precision Longevity Index</h3>
              <p className="text-base text-[#c3c6d7] font-light leading-relaxed max-w-xl">
                Our proprietary clinical grading algorithm compiles genomic markers, metabolic factors, and real-time autonomic stream monitoring into a unified longevity index.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <span className="flex items-center gap-1.5 text-xs text-blue-400"><Shield className="w-4 h-4 text-blue-500" /> Genomic Integration</span>
                <span className="flex items-center gap-1.5 text-xs text-blue-400"><Shield className="w-4 h-4 text-blue-500" /> Blood Panel Extraction</span>
                <span className="flex items-center gap-1.5 text-xs text-blue-400"><Shield className="w-4 h-4 text-blue-500" /> Autonomic Auditing</span>
              </div>
            </div>

            <div className="w-full md:w-64 aspect-square flex items-center justify-center relative bg-[#020617] rounded-full border border-white/10 p-6 shadow-2xl">
              {/* Spinning Ring */}
              <div className="absolute inset-2 rounded-full border border-blue-500/15 border-dashed animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-5 rounded-full border border-cyan-500/10 animate-[spin_12s_linear_infinite_reverse]" />
              <div className="text-center z-10">
                <span className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-sans">
                  89.4
                </span>
                <p className="text-[10px] text-[#c3c6d7]/50 font-semibold tracking-wider uppercase mt-1">Health Score</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolutionary Roadmap */}
      <section id="roadmap" className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Evolutionary Roadmap
          </h2>
          <p className="text-base text-[#c3c6d7] font-light">
            Building the next generation of patient-centric precision health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#111827]/60 border border-white/5 backdrop-blur-md border-l-4 border-l-blue-500 shadow-lg space-y-3 hover:translate-y-[-4px] transition-all">
            <span className="text-xs text-blue-400 font-bold uppercase">Q1 2026</span>
            <h4 className="text-lg font-bold text-white">Predictive AI Analysis</h4>
            <p className="text-sm text-[#c3c6d7] font-light leading-relaxed">
              Deploying fine-tuned clinical diagnostic models on multi-modal blood biomarkers to trace asymptomatic cardiac stress points.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-[#111827]/60 border border-white/5 backdrop-blur-md border-l-4 border-l-cyan-500 shadow-lg space-y-3 hover:translate-y-[-4px] transition-all">
            <span className="text-xs text-cyan-400 font-bold uppercase">Q2 2026</span>
            <h4 className="text-lg font-bold text-white">Genomic Sequencing Direct</h4>
            <p className="text-sm text-[#c3c6d7] font-light leading-relaxed">
              Accepting 23andMe / Ancestry direct genomic sequence raw data to map absolute drug and supplement compatibility recommendations.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-[#111827]/60 border border-white/5 backdrop-blur-md border-l-4 border-l-emerald-500 shadow-lg space-y-3 hover:translate-y-[-4px] transition-all">
            <span className="text-xs text-emerald-400 font-bold uppercase">Q3 2026</span>
            <h4 className="text-lg font-bold text-white">Decentralized Health Mesh</h4>
            <p className="text-sm text-[#c3c6d7] font-light leading-relaxed">
              Secure local encryption for clinical histories. Own your biometric data. Total HIPAA protection via device-local key management.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimers & Info */}
      <section className="max-w-4xl mx-auto px-6 py-4 text-center">
        <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-[#c3c6d7]/60 leading-relaxed">
          <span className="font-bold text-white">Informational Disclaimer:</span> PulseMind AI diagnostic modules, health recommendations, and diet/exercise formulas are informational only and designed for tracking longevity metrics. Always consult a healthcare professional before modifying medication schedules or diets.
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-[#020617] border-t border-white/5 py-16 px-6 mt-16 text-sm text-[#c3c6d7]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <span className="text-xl font-bold text-white font-sans">PulseMind AI</span>
            <p className="font-light text-xs leading-relaxed max-w-xs">
              Pioneering clinical longevity through high-performance biometric algorithms.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white">Product</h5>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#platform" className="hover:text-white">Platform Overview</a></li>
              <li><a href="#platform" className="hover:text-white">Biometric Wearables</a></li>
              <li><a href="#platform" className="hover:text-white">Security & Encryption</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white">Company</h5>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#platform" className="hover:text-white">Our Mission</a></li>
              <li><a href="#platform" className="hover:text-white">Research Studies</a></li>
              <li><a href="#platform" className="hover:text-white">Press Kit</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white">Legal</h5>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#platform" className="hover:text-white">HIPAA Privacy Policy</a></li>
              <li><a href="#platform" className="hover:text-white">Terms of Clinical Service</a></li>
              <li><a href="#platform" className="hover:text-white">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light">
          <p>© 2026 PulseMind AI Corporation. All rights reserved.</p>
          <div className="flex gap-4">
            <Globe className="w-4 h-4 hover:text-white cursor-pointer" />
            <Users className="w-4 h-4 hover:text-white cursor-pointer" />
            <MessageSquare className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
