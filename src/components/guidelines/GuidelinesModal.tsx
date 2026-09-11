import React, { useEffect, useRef } from 'react';
import {
  X,
  BookOpen,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalContentRef}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="guidelines-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
              >
                Official Examination Guidelines
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nepal DoTM • Category A (Motorcycle) &amp; Category K (Scooter)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close guidelines"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Exam Rules Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Questions</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">25 Qs</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">4 Marks Each</div>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                <Award className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Pass Mark</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">60 / 100</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Min 15 Correct</div>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
                <Clock className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Time Limit</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">30 Mins</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">72s per question</div>
            </div>

            <div className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 rounded-xl p-3.5 text-center">
              <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Marking</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">No Penalty</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Attempt all 25</div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Official Category Weightage (Syllabus Breakdown)</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total: 500 Question Bank</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 text-center w-12">#</th>
                      <th className="py-3 px-3.5">Subject Category</th>
                      <th className="py-3 px-3.5 text-center">Question Pool</th>
                      <th className="py-3 px-3.5 text-center">Exam Questions</th>
                      <th className="py-3 px-3.5 text-right pr-4">Total Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    {CATEGORY_BREAKDOWN.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3.5 text-center font-bold text-slate-400 dark:text-slate-500">
                          {cat.id}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{cat.nameNepali}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{cat.name}</div>
                        </td>
                        <td className="py-2.5 px-3.5 text-center text-slate-600 dark:text-slate-400">
                          {cat.poolCount}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-semibold text-blue-600 dark:text-blue-400">
                          {cat.examQuestions}
                        </td>
                        <td className="py-2.5 px-3.5 text-right pr-4 font-semibold text-slate-900 dark:text-slate-100">
                          {cat.marks}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 font-bold text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-700">
                      <td colSpan={2} className="py-2.5 px-3.5 text-right font-bold">
                        Grand Total:
                      </td>
                      <td className="py-2.5 px-3.5 text-center">500</td>
                      <td className="py-2.5 px-3.5 text-center text-blue-600 dark:text-blue-400">25</td>
                      <td className="py-2.5 px-3.5 text-right pr-4">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Exam Tips & Official Note */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Exam Tips &amp; Strategic Advice</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                  Focus on High-Yield Sections
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Category 1 (Vehicle Operation) &amp; Category 6 (Traffic Signs) contribute 12 questions (48 marks) out of 100 marks. Mastering these two categories is essential for passing.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                  Never Leave Blank Answers
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  There is no negative marking. Even if you are unsure of the correct option, always select your best guess before submitting the exam.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                  Pacing and Flagging
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  You have 30 minutes for 25 questions (~72 seconds per question). Flag tricky questions to return to them later without losing your rhythm.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                  Official Source
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Based on the official curriculum published by the Department of Transport Management (DoTM), Ministry of Physical Infrastructure &amp; Transport, Government of Nepal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pass standard: 15 / 25 questions correct (60%)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidelinesModal;
