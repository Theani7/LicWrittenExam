import React from 'react';
import { Languages, Check, Globe } from 'lucide-react';
import { useLanguage, type Language } from '../../context/LanguageContext';

interface LanguageModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, hasChosenLanguage, setHasChosenLanguage } = useLanguage();

  // Show if explicitly opened OR if user has not yet chosen a language
  const show = isOpen ?? !hasChosenLanguage;

  if (!show) return null;

  const handleSelect = (selectedLang: Language) => {
    setLanguage(selectedLang);
    setHasChosenLanguage(true);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity" />

      {/* Modal Dialog Card — bottom sheet on mobile */}
      <div className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain-y rounded-t-3xl border border-zinc-200/80 bg-white/95 p-5 pb-safe-offset shadow-float backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1222]/95 sm:max-w-lg sm:rounded-3xl sm:p-8 animate-slide-up sm:animate-scale-in">
        {/* Decorative Top Accent Gradient */}
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-crimson-600 via-amber-500 to-navy-700 sm:rounded-t-3xl" />
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-200 dark:bg-white/15 sm:hidden" aria-hidden="true" />

        {/* Icon & Title */}
        <div className="mb-5 text-center sm:mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson-500/10 text-crimson-600 shadow-glow-crimson dark:bg-crimson-500/20 dark:text-crimson-400">
            <Languages className="h-7 w-7" />
          </div>
          <h2
            id="language-modal-title"
            className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-2xl"
          >
            Choose Exam Language
          </h2>
          <p className="mt-1 text-sm font-semibold text-crimson-600 dark:text-crimson-400">
            आफ्नो परीक्षा भाषा छान्नुहोस्
          </p>
          <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-400 sm:text-sm">
            Please choose your preferred language for driving license practice questions.
          </p>
        </div>

        {/* Language Options Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5 sm:grid-cols-2">
          {/* Nepali Card */}
          <button
            type="button"
            onClick={() => handleSelect('ne')}
            className={`group relative flex min-h-[96px] touch-manipulation flex-col items-start rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
              language === 'ne'
                ? 'border-crimson-600 bg-crimson-50/70 ring-2 ring-crimson-500/30 dark:border-crimson-500 dark:bg-crimson-950/30'
                : 'border-zinc-200/80 bg-zinc-50/70 dark:border-white/10 dark:bg-white/5'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-2xl" role="img" aria-label="Nepal Flag">
                🇳🇵
              </span>
              {language === 'ne' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson-600 text-white dark:bg-crimson-500">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                नेपाली (Nepali)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                यातायात व्यवस्था विभागको आधिकारिक ५०० प्रश्नोत्तरहरू
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-bold text-crimson-600 dark:text-crimson-400 group-hover:underline">
              नेपाली छान्नुहोस् →
            </span>
          </button>

          {/* English Card */}
          <button
            type="button"
            onClick={() => handleSelect('en')}
            className={`group relative flex min-h-[96px] touch-manipulation flex-col items-start rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
              language === 'en'
                ? 'border-crimson-600 bg-crimson-50/70 ring-2 ring-crimson-500/30 dark:border-crimson-500 dark:bg-crimson-950/30'
                : 'border-zinc-200/80 bg-zinc-50/70 dark:border-white/10 dark:bg-white/5'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600/10 text-navy-700 dark:bg-navy-500/20 dark:text-navy-300">
                <Globe className="h-5 w-5" />
              </span>
              {language === 'en' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-crimson-600 text-white dark:bg-crimson-500">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                English
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Official DoTM 500 questions translated into English
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-bold text-crimson-600 dark:text-crimson-400 group-hover:underline">
              Select English →
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-5 border-t border-zinc-200/70 pt-3.5 text-center dark:border-white/10 sm:mt-6 sm:pt-4">
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            💡 You can switch language anytime using the toggle on the top bar or bottom navigation area.
          </p>
        </div>
      </div>
    </div>
  );
};
