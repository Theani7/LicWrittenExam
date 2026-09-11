import React from 'react';
import { ShieldCheck, WifiOff } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Nepal Driving License Written Prep
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Category A (Motorcycle) &amp; Category K (Scooter)</span>
          <span className="hidden sm:inline">•</span>
          <span>Syllabus FY 2082/83</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DoTM 500 Question Curriculum</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <WifiOff className="w-3.5 h-3.5 text-blue-500" />
            <span>100% Offline Capable</span>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 gap-2">
        <p>
          Curriculum reference: Department of Transport Management (DoTM), Ministry of Physical Infrastructure &amp; Transport, Government of Nepal.
        </p>
        <p className="flex items-center space-x-1">
          <span>Crafted for Nepali aspirants</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
