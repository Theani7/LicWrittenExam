import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-navy-900 bg-white/80 dark:bg-[#0c1424]/80 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Nepal License Written Prep
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">/</span>
          <span className="font-mono text-xs font-semibold">Category A &amp; K</span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">/</span>
          <span className="font-mono text-xs font-semibold">Syllabus FY 2082/83</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>500 Questions</span>
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span>100% Client-Side</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-zinc-100 dark:border-navy-950 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 gap-2">
        <p>
          DoTM 500 Question Curriculum • Ministry of Physical Infrastructure &amp; Transport, Government of Nepal.
        </p>
        <p className="font-mono font-medium">
          Decoupled JSON Dataset
        </p>
      </div>
    </footer>
  );
};

export default Footer;
