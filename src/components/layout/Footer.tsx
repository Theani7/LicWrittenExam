import React from 'react';
import { ShieldCheck, Zap, BookOpenCheck, Star } from 'lucide-react';

export const REPO_URL = 'https://github.com/Theani7/LicWrittenExam';

const GitHubMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
      <div className="bg-dot-grid-faint absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:py-10 md:pb-10">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-crimson-700 to-rose-500 text-white shadow-glow-crimson">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                  <path d="M4 2v20h2v-5.5l9-5.5-7.5-3 8-6z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold tracking-tight">Nepal License Written Prep</p>
                <p className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  DOTM · CAT A & K · 2082/83
                </p>
              </div>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              Practice the official 500-question Department of Transport Management bank with learn mode, flashcards and timed mock exams — all offline, all client-side.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-crimson-600" /> Learn — 500Q bank + search</li>
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-crimson-600" /> Flashcards + shuffle + keys</li>
              <li className="flex items-center gap-2"><BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-crimson-600" /> Bookmarks + missed drills</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[11px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400">EXAM RULES</p>
            <ul className="space-y-2 font-mono text-[12px] font-semibold text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between gap-2 rounded-xl bg-zinc-100/70 px-3 py-2.5 dark:bg-white/5"><span>QUESTIONS</span><span className="text-zinc-900 dark:text-white">25 × 4 pts</span></li>
              <li className="flex justify-between gap-2 rounded-xl bg-zinc-100/70 px-3 py-2.5 dark:bg-white/5"><span>PASS MARK</span><span className="text-zinc-900 dark:text-white">60 / 100</span></li>
              <li className="flex justify-between gap-2 rounded-xl bg-zinc-100/70 px-3 py-2.5 dark:bg-white/5"><span>TIME</span><span className="text-zinc-900 dark:text-white">30 min</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2.5 border-t border-zinc-200/70 pt-4 text-center text-[12px] text-zinc-500 dark:border-white/10 dark:text-zinc-500 sm:mt-8 sm:flex-row sm:pt-5 sm:text-left">
          <p className="max-w-xl">DoTM 500 Question Curriculum · Syllabus FY 2082/83 · Ministry of Physical Infrastructure & Transport, Nepal.</p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View source code on GitHub"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-[12px] font-bold text-zinc-700 transition active:scale-[0.97] dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
          >
            <GitHubMark className="h-4 w-4" />
            Open source
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
