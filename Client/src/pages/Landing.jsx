import React from 'react';
import { useNavigate } from 'react-router-dom';
import CosmicAtmosphere from '../components/layout/CosmicAtmosphere';
import GlowButton from '../components/common/GlowButton';
import ThemeToggle from '../components/navigation/ThemeToggle';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Radio,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 flex flex-col overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Atmosphere */}
      <CosmicAtmosphere />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-20 w-full border-b border-white/[0.07] bg-[#07090E]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] flex items-center justify-center text-cyan-300">
            <Radio className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-slate-100">
            Open<span className="text-cyan-400">Talk</span>
          </span>
        </div>

        <div className="hidden items-center gap-7 md:flex">
          <a href="#experience" className="text-sm text-slate-400 transition-colors hover:text-slate-100">Experience</a>
          <a href="#features" className="text-sm text-slate-400 transition-colors hover:text-slate-100">Features</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <GlowButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign in
          </GlowButton>
          <GlowButton
            variant="primary"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/register')}
          >
            Get started
          </GlowButton>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center z-10 max-w-5xl mx-auto">
        {/* Anti-Gravity Pill Announcement */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-surface border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-300 tracking-wide">
            Anti-Gravity UI Architecture v1.0 Live
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-slate-100 max-w-4xl leading-[1.1] mb-6">
          Conversations without boundaries.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Communities without gravity.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          Suspended floating docks, zero-friction spatial frequencies, and real-time cosmic synchronization.
          Break free from traditional boxy application grids.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <GlowButton
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={() => navigate('/app')}
            className="w-full sm:w-auto"
          >
            Launch Experience
          </GlowButton>
          <GlowButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto"
          >
            Create Free Account
          </GlowButton>
        </div>

        {/* Floating Mockup Preview Stage */}
        <div id="experience" className="w-full max-w-4xl p-2 rounded-2xl glass-card border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative animate-float-gentle">
          <div className="w-full h-80 sm:h-96 rounded-2xl bg-[#0F121A]/80 border border-white/5 flex flex-col p-4 relative overflow-hidden">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                orbit://nexus.opentalk.space/#general
              </span>
              <div className="w-12" />
            </div>

            {/* Inner Mock Stage */}
            <div className="flex-1 flex gap-3 pt-3">
              {/* Mock Rail */}
              <div className="w-12 h-full rounded-2xl glass-surface flex flex-col items-center py-2 gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xs font-bold">
                  OT
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 text-xs font-bold">
                  QL
                </div>
              </div>

              {/* Mock Messages Viewport */}
              <div className="flex-1 flex flex-col justify-end gap-2.5 pb-2">
                <div className="self-start p-3 rounded-2xl glass-card max-w-md text-left">
                  <span className="text-[11px] font-semibold text-cyan-400 block mb-0.5">
                    @CosmoDev
                  </span>
                  <p className="text-xs text-slate-200">
                    Transmission confirmed. All panels are hovering at 20px altitude with backdrop blur.
                  </p>
                </div>
                <div className="self-end p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 max-w-md text-left">
                  <span className="text-[11px] font-semibold text-purple-300 block mb-0.5">
                    @AuraNova
                  </span>
                  <p className="text-xs text-slate-200">
                    Real-time WebSocket telemetry is receiving live packets effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-20 text-left scroll-mt-24">
          <div className="p-6 rounded-3xl glass-card border border-white/5">
            <Zap className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-display font-semibold text-slate-100 text-base mb-1">
              Zero-G Atmosphere
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every dock and card breathes independently. No rigid column walls, no cluttered sidebars.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/5">
            <Radio className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-display font-semibold text-slate-100 text-base mb-1">
              Spatial Synchronicity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time WebSockets directly reconcile into TanStack Query caches without UI flickering.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-white/5">
            <Shield className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-display font-semibold text-slate-100 text-base mb-1">
              Robust Architecture
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modular REST services, multipart file attachments, and JWT/cookie authentication.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.05] py-8 text-center text-xs text-slate-500">
        © 2026 OpenTalk. Anti-Gravity Communication Architecture.
      </footer>
    </div>
  );
}
