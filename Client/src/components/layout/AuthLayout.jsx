import React from 'react';
import { Link } from 'react-router-dom';
import { Chrome, MessageCircle, Radio, ShieldCheck, Users } from 'lucide-react';
import CosmicAtmosphere from './CosmicAtmosphere';
import ThemeToggle from '../navigation/ThemeToggle';
import { API_BASE_URL } from '../../api/config';

export default function AuthLayout({ title, subtitle, footer, children }) {
  const startGoogleLogin = () => {
    window.location.assign(`${API_BASE_URL}/api/auth/google`);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#07090E] text-slate-100 selection:bg-cyan-500/30">
      <CosmicAtmosphere />

      <header className="relative z-20 flex h-20 w-full items-center justify-between border-b border-white/[0.07] px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3" aria-label="OpenTalk home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300">
            <Radio className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-white">OpenTalk</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-12 lg:py-12">
        <section className="hidden min-w-0 lg:block">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-xs text-cyan-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Your conversations, all in one place
          </div>
          <h1 className="max-w-xl font-display text-5xl font-semibold leading-[1.08] text-white xl:text-6xl">
            Good conversations
            <span className="mt-2 block text-cyan-300">bring people closer.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            Find your people, join a community, and keep every conversation moving with OpenTalk.
          </p>

          <div className="mt-12 max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d1219]/90 shadow-[0_28px_80px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <MessageCircle className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">The OpenTalk community</p>
                  <p className="mt-0.5 text-xs text-slate-500">A little space to catch up</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
              </span>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-300/15 text-xs font-semibold text-amber-200">M</span>
                <div className="rounded-xl rounded-tl-sm bg-white/[0.055] px-3.5 py-2.5">
                  <p className="text-xs font-medium text-amber-200">Maya</p>
                  <p className="mt-1 text-sm text-slate-300">Anyone up for sharing what they are building?</p>
                </div>
              </div>
              <div className="ml-auto flex max-w-[85%] items-center gap-3">
                <p className="rounded-xl rounded-tr-sm border border-cyan-300/10 bg-cyan-300/[0.09] px-3.5 py-2.5 text-sm text-slate-200">
                  Just joined. This feels like a good place to start.
                </p>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-xs font-semibold text-cyan-200">Y</span>
              </div>
            </div>
            <div className="flex items-center gap-5 border-t border-white/[0.08] px-5 py-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-cyan-300" /> Communities</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Your space, your people</span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[520px]">
          <div className="rounded-2xl border border-white/[0.1] bg-[#0c1118]/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-8">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">OpenTalk account</p>
              <h2 className="font-display text-3xl font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>

            <button
              type="button"
              onClick={startGoogleLogin}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/[0.035] px-4 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-300/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
            >
              <Chrome className="h-4 w-4 text-cyan-200" />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">or with email</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            {children}
          </div>
          <div className="mt-5 text-center text-sm text-slate-400">{footer}</div>
        </section>
      </main>
    </div>
  );
}