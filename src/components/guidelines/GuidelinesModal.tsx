import React, { useEffect, useRef } from 'react';
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
  {
    id: 1,
    name: 'Knowledge Related to Vehicle Operation',
    nameNepali: 'सवारी सञ्चालन सम्बन्धी ज्ञान',
    poolCount: 130,
    examQuestions: 6,
    marks: 24,
  },
  {
    id: 2,
    name: 'Knowledge of Vehicle Laws & Regulations',
    nameNepali: 'सवारी ऐन नियम सम्बन्धी ज्ञान',
    poolCount: 90,
    examQuestions: 5,
    marks: 20,
  },
  {
    id: 3,
    name: 'Technical and Mechanical Knowledge of Vehicles',
    nameNepali: 'सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान',
    poolCount: 80,
    examQuestions: 3,
    marks: 12,
  },
  {
    id: 4,
    name: 'Conceptual Knowledge of Environmental Pollution',
    nameNepali: 'वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान',
    poolCount: 30,
    examQuestions: 2,
    marks: 8,
  },
  {
    id: 5,
    name: 'Knowledge on Accident Awareness & Safety',
    nameNepali: 'दुर्घटना सचेतना सम्बन्धी ज्ञान',
    poolCount: 60,
    examQuestions: 3,
    marks: 12,
  },
  {
    id: 6,
    name: 'Knowledge of Traffic Signs & Signals',
    nameNepali: 'ट्राफिक सङ्केत सम्बन्धी ज्ञान',
    poolCount: 110,
    examQuestions: 6,
    marks: 24,
  },
];

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ isOpen, onClose }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guidelines-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 dark:bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContentRef}
        className="bg-white dark:bg-navy-950 border border-zinc-200 dark:border-navy-900 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-navy-900 bg-zinc-50/70 dark:bg-navy-900/40 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-crimson-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              NP
            </div>
            <div>
              <h2
                id="guidelines-modal-title"
                className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
              >
                Official Examination Guidelines
              </h2>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Nepal DoTM • Category A (Motorcycle) &amp; Category K (Scooter)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guidelines"
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Exam Rules Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-50 dark:bg-navy-900/40 border border-zinc-200 dark:border-navy-900 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-navy-600 dark:text-navy-300 mb-1 font-mono text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Questions</span>
              </div>
              <div className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">25 Qs</div>
              <div className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">4 Marks Each</div>
            </div>

            <div className="bg-crimson-50/50 dark:bg-crimson-950/20 border border-crimson-200 dark:border-crimson-900/50 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-crimson-600 dark:text-crimson-400 mb-1 font-mono text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 mr-1.5" />
                <span>Pass Mark</span>
              </div>
              <div className="font-mono text-2xl font-extrabold text-crimson-600 dark:text-crimson-400">60 / 100</div>
              <div className="font-mono text-xs text-crimson-600 dark:text-crimson-400 font-bold mt-0.5">Min 15 Correct</div>
            </div>

            <div className="bg-zinc-50 dark:bg-navy-900/40 border border-zinc-200 dark:border-navy-900 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1 font-mono text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>Time Limit</span>
              </div>
              <div className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">30 Mins</div>
              <div className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">72s per question</div>
            </div>

            <div className="bg-zinc-50 dark:bg-navy-900/40 border border-zinc-200 dark:border-navy-900 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>Marking</span>
              </div>
              <div className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">No Penalty</div>
              <div className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">Attempt all 25</div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base flex items-center space-x-2">
                <FileText className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
                <span>Official Category Weightage (Syllabus Breakdown)</span>
              </h3>
              <span className="font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total: 500 Question Bank</span>
            </div>

            <div className="border border-zinc-200 dark:border-navy-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-zinc-100/70 dark:bg-navy-900/80 border-b border-zinc-200 dark:border-navy-900 text-zinc-700 dark:text-zinc-300 font-mono uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 text-center w-12">#</th>
                      <th className="py-3 px-3.5">Subject Category</th>
                      <th className="py-3 px-3.5 text-center">Question Pool</th>
                      <th className="py-3 px-3.5 text-center">Exam Questions</th>
                      <th className="py-3 px-3.5 text-right pr-4">Total Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-navy-900/60 text-zinc-700 dark:text-zinc-300">
                    {CATEGORY_BREAKDOWN.map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-50/60 dark:hover:bg-navy-900/40 transition-colors">
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-zinc-400 dark:text-zinc-500">
                          {cat.id}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">{cat.nameNepali}</div>
                          <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{cat.name}</div>
                        </td>
                        <td className="py-3 px-3.5 text-center font-mono font-medium text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          {cat.poolCount}
                        </td>
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-xs sm:text-sm text-crimson-600 dark:text-crimson-400">
                          {cat.examQuestions}
                        </td>
                        <td className="py-3 px-3.5 text-right pr-4 font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                          {cat.marks}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-zinc-100/60 dark:bg-navy-900/60 font-mono font-bold text-zinc-900 dark:text-zinc-100 border-t-2 border-zinc-200 dark:border-navy-800 text-sm">
                      <td colSpan={2} className="py-3 px-3.5 text-right font-black">
                        Grand Total:
                      </td>
                      <td className="py-3 px-3.5 text-center font-bold">500</td>
                      <td className="py-3 px-3.5 text-center font-bold text-crimson-600 dark:text-crimson-400">25</td>
                      <td className="py-3 px-3.5 text-right pr-4 font-bold">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Exam Tips & Official Note */}
          <div className="space-y-3">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Exam Tips &amp; Strategic Advice</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <div className="p-3.5 bg-zinc-50/60 dark:bg-navy-900/30 rounded-lg border border-zinc-200 dark:border-navy-900 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-crimson-600 dark:text-crimson-400 mr-1.5 shrink-0" />
                  Focus on High-Yield Sections
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Category 1 (Vehicle Operation) &amp; Category 6 (Traffic Signs) contribute 12 questions (48 marks) out of 100 marks. Mastering these two categories is essential for passing.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-50/60 dark:bg-navy-900/30 rounded-lg border border-zinc-200 dark:border-navy-900 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-crimson-600 dark:text-crimson-400 mr-1.5 shrink-0" />
                  Never Leave Blank Answers
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  There is no negative marking. Even if you are unsure of the correct option, always select your best guess before submitting the exam.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-50/60 dark:bg-navy-900/30 rounded-lg border border-zinc-200 dark:border-navy-900 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-crimson-600 dark:text-crimson-400 mr-1.5 shrink-0" />
                  Pacing and Flagging
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  You have 30 minutes for 25 questions (~72 seconds per question). Flag tricky questions to return to them later without losing your rhythm.
                </p>
              </div>

              <div className="p-3.5 bg-zinc-50/60 dark:bg-navy-900/30 rounded-lg border border-zinc-200 dark:border-navy-900 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-crimson-600 dark:text-crimson-400 mr-1.5 shrink-0" />
                  Official Source
                </span>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Based on the official curriculum published by the Department of Transport Management (DoTM), Ministry of Physical Infrastructure &amp; Transport, Government of Nepal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-navy-900 bg-zinc-50/70 dark:bg-navy-900/40">
          <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-navy-600 dark:text-navy-400" />
            <span>Pass standard: 15 / 25 questions correct (60%)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-crimson-600 hover:bg-crimson-700 text-white font-mono text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesModal;
