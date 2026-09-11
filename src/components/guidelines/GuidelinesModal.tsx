import React, { useEffect } from 'react';
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryBreakdownItem {
  id: number;
  name: string;
  nameNepali: string;
  poolCount: number;
  examQuestions: number;
  marks: number;
}

const CATEGORY_BREAKDOWN: CategoryBreakdownItem[] = [
  { id: 1, name: 'Knowledge Related to Vehicle Operation', nameNepali: 'सवारी सञ्चालन सम्बन्धी ज्ञान', poolCount: 130, examQuestions: 6, marks: 24 },
  { id: 2, name: 'Knowledge of Vehicle Laws & Regulations', nameNepali: 'सवारी ऐन नियम सम्बन्धी ज्ञान', poolCount: 90, examQuestions: 5, marks: 20 },
  { id: 3, name: 'Technical and Mechanical Knowledge of Vehicles', nameNepali: 'सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान', poolCount: 80, examQuestions: 3, marks: 12 },
  { id: 4, name: 'Conceptual Knowledge of Environmental Pollution', nameNepali: 'वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान', poolCount: 30, examQuestions: 2, marks: 8 },
  { id: 5, name: 'Knowledge on Accident Awareness & Safety', nameNepali: 'दुर्घटना सचेतना सम्बन्धी ज्ञान', poolCount: 60, examQuestions: 3, marks: 12 },
  { id: 6, name: 'Knowledge of Traffic Signs & Signals', nameNepali: 'ट्राफिक सङ्केत सम्बन्धी ज्ञान', poolCount: 110, examQuestions: 6, marks: 24 },
];

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guidelines-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/60 p-3 backdrop-blur-md animate-fade-in sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-float dark:border-white/10 dark:bg-ink-900 animate-scale-in">
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-crimson-700 via-rose-500 via-amber-400 to-navy-700" />
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-crimson-700 to-rose-500 font-mono text-[12px] font-bold text-white shadow-glow-crimson">NP</span>
            <div>
              <h2 id="guidelines-modal-title" className="font-extrabold tracking-tight sm:text-lg">Official Examination Guidelines</h2>
              <p className="font-mono text-[11px] font-semibold text-zinc-500">DOTM · CATEGORY A & K · 2082/83</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close guidelines" className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: CheckCircle2, label: 'QUESTIONS', value: '25 Qs', sub: '4 marks each', tint: 'text-navy-700 bg-blue-50 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900/60' },
              { icon: Award, label: 'PASS MARK', value: '60 / 100', sub: 'Min 15 Correct', tint: 'text-crimson-700 bg-crimson-50 ring-crimson-200 dark:bg-crimson-950/40 dark:text-crimson-300 dark:ring-crimson-900/60' },
              { icon: Clock, label: 'TIME', value: '30 Mins', sub: '72s per Q', tint: 'text-amber-700 bg-amber-50 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60' },
              { icon: ShieldCheck, label: 'MARKING', value: 'No −ve', sub: 'attempt all', tint: 'text-emerald-700 bg-emerald-50 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60' },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl p-4 text-center ring-1 ${c.tint}`}>
                <c.icon className="mx-auto mb-1 h-4 w-4" />
                <p className="font-mono text-[10px] font-bold tracking-widest opacity-70">{c.label}</p>
                <p className="font-mono text-2xl font-extrabold tracking-tight">{c.value}</p>
                <p className="font-mono text-[11px] font-semibold opacity-70">{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight"><FileText className="h-4 w-4 text-crimson-600" /> Official Category Weightage (Syllabus Breakdown)</h3>
              <span className="font-mono text-[11px] font-bold text-zinc-400">500Q BANK → 25Q PAPER</span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="bg-zinc-50 font-mono text-[11px] font-bold tracking-wider text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                      <th className="px-4 py-3 text-center">#</th>
                      <th className="px-4 py-3">CATEGORY</th>
                      <th className="px-4 py-3 text-center">POOL</th>
                      <th className="px-4 py-3 text-center">EXAM</th>
                      <th className="px-4 py-3 text-right">MARKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {CATEGORY_BREAKDOWN.map((cat) => (
                      <tr key={cat.id} className="transition hover:bg-zinc-50/70 dark:hover:bg-white/[0.03]">
                        <td className="px-4 py-3 text-center font-mono font-bold text-zinc-400">{cat.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold">{cat.nameNepali}</p>
                          <p className="text-[12px] text-zinc-500">{cat.name}</p>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-zinc-500">{cat.poolCount}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-crimson-600">{cat.examQuestions}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold">{cat.marks}</td>
                      </tr>
                    ))}
                    <tr className="bg-zinc-50 font-mono font-bold dark:bg-white/5">
                      <td colSpan={2} className="px-4 py-3 text-right">Grand Total:</td>
                      <td className="px-4 py-3 text-center">500</td>
                      <td className="px-4 py-3 text-center text-crimson-600">25</td>
                      <td className="px-4 py-3 text-right">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-[15px] font-extrabold tracking-tight"><AlertCircle className="h-4 w-4 text-amber-500" /> Strategy that works</h3>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ['Win the big two first', 'Cat 1 + Cat 6 = 12 Qs / 48 marks. Own them and you are halfway to passing.'],
                ['Never leave blanks', 'No negative marking — a guess is always better than a skip. Flag and return.'],
                ['Pace at 72s per Q', '30 minutes for 25 Qs. If a Q takes over a minute, flag it and move on.'],
                ['Trust the source', 'Every Q mirrors the DoTM 500Q curriculum, Ministry of Physical Infrastructure & Transport.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="flex items-center gap-1.5 text-[13px] font-bold"><CheckCircle2 className="h-4 w-4 shrink-0 text-crimson-600" />{t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">
          <p className="flex items-center gap-1.5 font-mono text-[12px] font-semibold text-zinc-500"><HelpCircle className="h-4 w-4 text-navy-600" /> PASS = 15/25 CORRECT</p>
          <button type="button" onClick={onClose} className="btn-primary !py-2.5">Got it</button>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesModal;
