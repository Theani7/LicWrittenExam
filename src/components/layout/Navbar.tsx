import React, { useState } from 'react';
import {
  Compass,
  FileCheck2,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export type NavigationTab = 'learn' | 'test' | 'bookmarks';

export interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  bookmarkCount?: number;
  onOpenGuidelines: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  bookmarkCount = 0,
  onOpenGuidelines,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems: { id: NavigationTab; label: string; hint: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: t('tabLearn', 'Learn'), hint: t('hintLearn', '500 Qs'), icon: Compass },
    { id: 'test', label: t('tabTest', 'Mock Exam'), hint: t('hintTest', '30 min'), icon: FileCheck2 },
    { id: 'bookmarks', label: t('tabBookmarks', 'Saved'), hint: t('hintBookmarks', 'Review'), icon: Bookmark },
  ];

  return (
    <>
      {/* Announcement ribbon — scrolls away, not sticky */}
      <div className="bg-gradient-to-r from-crimson-800 via-crimson-600 to-navy-800 px-3 py-1.5 text-center">
        <p className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-white/95 sm:text-[11px]">
          <Sparkles className="h-3 w-3 shrink-0" />
          <span className="hidden truncate sm:inline">{t('ribbonText')}</span>
          <span className="truncate sm:hidden">{t('ribbonShort')}</span>
        </p>
      </div>

      <header className="sticky top-0 z-40 pt-safe">
        <div className="glass border-b border-zinc-200/70 bg-white/85 dark:border-white/10 dark:bg-[#060b16]/85">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6 md:h-[68px]">
            {/* Brand */}
            <button
              type="button"
              onClick={() => handleTabClick('learn')}
              className="group flex min-h-[44px] items-center gap-2.5 text-left sm:gap-3"
              aria-label="Go to Learn mode"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-crimson-700 via-crimson-600 to-rose-500 text-white shadow-glow-crimson transition-transform group-active:scale-95 sm:h-10 sm:w-10 sm:rounded-2xl">
                <span className="bg-diagonal-lines absolute inset-0 opacity-60" />
                <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-white sm:h-5 sm:w-5" aria-hidden="true">
                  <path d="M4 2v20h2v-5.5l9-5.5-7.5-3 8-6z" />
                </svg>
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-base">
                  {t('appTitle', 'Nepal License Prep')}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center truncate rounded-md bg-crimson-600/10 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-crimson-700 ring-1 ring-crimson-600/20 dark:bg-crimson-500/10 dark:text-crimson-300">
                    {t('catTag', 'Cat A & K 2082/83')}
                  </span>
                </span>
              </span>
            </button>

            {/* Desktop nav pill */}
            <nav
              aria-label="Main Navigation"
              className="hidden items-center gap-1 rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-1.5 dark:border-white/10 dark:bg-white/5 md:flex"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    data-testid={`nav-tab-${item.id}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white text-zinc-900 shadow-card ring-1 ring-zinc-200 dark:bg-white/10 dark:text-white dark:ring-white/15'
                        : 'text-zinc-500 hover:bg-white/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-crimson-600 dark:text-crimson-400' : ''}`} />
                    <span>{item.label}</span>
                    {item.id === 'bookmarks' && bookmarkCount > 0 && (
                      <span
                        data-testid="nav-bookmark-count"
                        className="rounded-full bg-crimson-600 px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-white"
                      >
                        {bookmarkCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-[7px] h-0.5 rounded-full bg-gradient-to-r from-crimson-600 to-navy-600" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 md:flex">
              {/* Language Switcher */}
              <div
                className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-0.5 dark:border-white/10 dark:bg-white/5"
                role="group"
                aria-label="Select Language"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  data-testid="lang-switch-en"
                  className={`flex min-h-[32px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm">🇬🇧</span>
                  <span>EN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ne')}
                  data-testid="lang-switch-ne"
                  className={`flex min-h-[32px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    language === 'ne'
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm">🇳🇵</span>
                  <span>नेपाली</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenGuidelines}
                data-testid="guidelines-button"
                className="btn-ghost !min-h-[36px] !rounded-xl !py-2 text-[13px]"
              >
                <FileText className="h-4 w-4 text-crimson-600 dark:text-crimson-400" />
                <span>{t('guidelinesBtn', 'Guidelines')}</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                data-testid="theme-toggle-btn"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-card transition hover:-translate-y-px hover:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-white"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              {/* Mobile Language Switcher */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'ne' ? 'en' : 'ne')}
                data-testid="mobile-lang-toggle"
                aria-label="Toggle language"
                className="flex h-11 min-w-[64px] items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-2 text-xs font-bold text-zinc-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                <span>{language === 'ne' ? '🇳🇵' : '🇬🇧'}</span>
                <span>{language === 'ne' ? 'नेपाली' : 'EN'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                data-testid="mobile-theme-toggle-btn"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                {theme === 'dark' ? <Sun className="h-[18px] w-[18px] text-amber-300" /> : <Moon className="h-[18px] w-[18px]" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                data-testid="mobile-menu-toggle-btn"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white active:scale-95 dark:bg-white dark:text-zinc-900"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div
              data-testid="mobile-menu-drawer"
              className="border-t border-zinc-200/70 bg-white/95 px-3 pb-safe-offset pt-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#060b16]/95 md:hidden animate-slide-in-top"
            >
              <div className="grid max-h-[60dvh] gap-1.5 overflow-y-auto overscroll-contain-y pb-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabClick(item.id)}
                      data-testid={`mobile-nav-tab-${item.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex min-h-[52px] items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                        isActive
                          ? 'bg-gradient-to-r from-crimson-700 to-crimson-600 text-white shadow-glow-crimson'
                          : 'bg-zinc-100/70 text-zinc-700 dark:bg-white/5 dark:text-zinc-300'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="truncate">{item.label}</span>
                        <span className={`truncate font-mono text-[11px] font-semibold ${isActive ? 'text-white/70' : 'text-zinc-400'}`}>
                          {item.hint}
                        </span>
                      </span>
                      {item.id === 'bookmarks' && bookmarkCount > 0 && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-crimson-600 text-white'}`}>
                          {bookmarkCount}
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    onOpenGuidelines();
                    setMobileMenuOpen(false);
                  }}
                  data-testid="mobile-guidelines-button"
                  className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-4 py-3 text-sm font-bold text-zinc-700 dark:border-white/15 dark:text-zinc-300"
                >
                  <FileText className="h-[18px] w-[18px] shrink-0 text-crimson-600" />
                  {t('guidelinesBtn', 'Guidelines')}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
