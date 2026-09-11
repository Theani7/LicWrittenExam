import React from 'react';
import { ShieldCheck, Zap, BookOpenCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
      <div className="bg-dot-grid-faint absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-700 to-rose-500 text-white shadow-glow-crimson">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                  <path d="M4 2v20h2v-5.5l9-5.5-7.5-3 8-6z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-extrabold tracking-tight">Nepal License Written Prep</p>
                <p className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  DOTM · CAT A & K · 2082/83
                </p>
              </div>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Practice the official 500-question Department of Transport Management bank with learn mode, flashcards and timed mock exams — all offline, all client-side.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                500 Questions
              </span>
              <span className="chip border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                <Zap className="h-3 w-3" />
                100% Client-side
              </span>
              <span className="chip border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <ShieldCheck className="h-3 w-3" />
                No sign-up
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">STUDY</p>
            <ul className="space-y-2 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 text-crimson-600" /> Learn — 500Q bank + search</li>
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 text-crimson-600" /> Flashcards + shuffle + keys</li>
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 text-crimson-600" /> Bookmarks + missed drills</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">EXAM RULES</p>
            <ul className="space-y-2 font-mono text-[12px] font-semibold text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between rounded-xl bg-zinc-100/70 px-3 py-2 dark:bg-white/5"><span>QUESTIONS</span><span className="text-zinc-900 dark:text-white">25 × 4 pts</span></li>
              <li className="flex justify-between rounded-xl bg-zinc-100/70 px-3 py-2 dark:bg-white/5"><span>PASS MARK</span><span className="text-zinc-900 dark:text-white">60 / 100</span></li>
              <li className="flex justify-between rounded-xl bg-zinc-100/70 px-3 py-2 dark:bg-white/5"><span>TIME</span><span className="text-zinc-900 dark:text-white">30 min</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-zinc-200/70 pt-5 text-[12px] text-zinc-500 dark:border-white/10 dark:text-zinc-500 sm:flex-row">
          <p>DoTM 500 Question Curriculum · Syllabus FY 2082/83 · Ministry of Physical Infrastructure & Transport, Nepal.</p>
          <p className="font-mono font-semibold">DECOUPLED JSON DATASET · OFFLINE READY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
