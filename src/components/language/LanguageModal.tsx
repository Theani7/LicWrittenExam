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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-modal backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1222]/95 sm:p-8">
        {/* Decorative Top Accent Gradient */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-crimson-600 via-amber-500 to-navy-700" />

        {/* Icon & Title */}
        <div className="mb-6 text-center">
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
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
            Please choose your preferred language for driving license practice questions.
          </p>
        </div>

        {/* Language Options Grid */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Nepali Card */}
          <button
            type="button"
            onClick={() => handleSelect('ne')}
            className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.99] ${
              language === 'ne'
                ? 'border-crimson-600 bg-crimson-50/70 ring-2 ring-crimson-500/30 dark:border-crimson-500 dark:bg-crimson-950/30'
                : 'border-zinc-200/80 bg-zinc-50/70 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'
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
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
            className={`group relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.99] ${
              language === 'en'
                ? 'border-crimson-600 bg-crimson-50/70 ring-2 ring-crimson-500/30 dark:border-crimson-500 dark:bg-crimson-950/30'
                : 'border-zinc-200/80 bg-zinc-50/70 hover:border-zinc-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'
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
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Official DoTM 500 questions translated into English
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-bold text-crimson-600 dark:text-crimson-400 group-hover:underline">
              Select English →
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 border-t border-zinc-200/70 pt-4 text-center dark:border-white/10">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            💡 You can switch language anytime using the <span className="font-semibold text-zinc-700 dark:text-zinc-200">[ EN | नेपाली ]</span> toggle on the top navigation bar.
          </p>
        </div>
      </div>
    </div>
  );
};
