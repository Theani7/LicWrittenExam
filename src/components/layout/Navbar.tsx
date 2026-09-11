import React, { useState } from 'react';
import {
  Compass,
  FileCheck,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'Learn', icon: Compass },
    { id: 'test', label: 'Test Mode', icon: FileCheck },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <header className="border-b border-zinc-200 dark:border-navy-900/80 bg-white/85 dark:bg-[#070d19]/85 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo with Nepal Pennon Flag Motif */}
          <div
            onClick={() => handleTabClick('learn')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Minimalist Geometric Nepal Pennant Icon */}
            <div className="w-7 h-7 rounded border border-navy-700/20 dark:border-navy-700/40 bg-crimson-600 flex items-center justify-center text-white font-mono text-[11px] font-bold tracking-tighter shrink-0 shadow-xs ring-1 ring-navy-700/30">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                {/* Clean stylized double triangle flag */}
                <path d="M4 2v20h2v-5.5l9-5.5-7.5-3 8-6z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm tracking-tight">
                Nepal License Prep
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-crimson-700 dark:text-crimson-300 bg-crimson-50 dark:bg-crimson-950/60 px-1.5 py-0.5 rounded border border-crimson-200/80 dark:border-crimson-900/60 font-medium">
                Cat A &amp; K 2082/83
              </span>
            </div>
          </div>

          {/* Desktop Navigation Segmented Bar */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-navy-900 bg-zinc-100/60 dark:bg-navy-950/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  data-testid={`nav-tab-${item.id}`}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 bg-white dark:bg-navy-900 text-navy-700 dark:text-white shadow-2xs border border-zinc-200/70 dark:border-navy-700/70 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-crimson-600 dark:text-crimson-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.id === 'bookmarks' && bookmarkCount > 0 && (
                    <span
                      data-testid="nav-bookmark-count"
                      className="font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded bg-crimson-100 dark:bg-crimson-950 text-crimson-700 dark:text-crimson-300"
                    >
                      {bookmarkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Guidelines & Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenGuidelines}
              data-testid="guidelines-button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-navy-700 dark:hover:text-white rounded-md border border-zinc-200 dark:border-navy-900 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-navy-600 dark:text-navy-400" />
              <span>Guidelines</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-md border border-zinc-200 dark:border-navy-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-navy-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              data-testid="mobile-theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-md border border-zinc-200 dark:border-navy-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-navy-700" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              data-testid="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
              className="p-1.5 rounded-md border border-zinc-200 dark:border-navy-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-menu-drawer"
          className="md:hidden border-t border-zinc-200 dark:border-navy-900 bg-white/95 dark:bg-[#070d19]/95 backdrop-blur-md px-4 py-3 space-y-2 animate-in slide-in-from-top-1 duration-150"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  data-testid={`mobile-nav-tab-${item.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-700 text-white dark:bg-navy-800 dark:text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'bookmarks' && bookmarkCount > 0 && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-crimson-600 text-white' : 'bg-zinc-200 dark:bg-navy-900 text-zinc-700 dark:text-zinc-300'}`}>
                      {bookmarkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-navy-900/80">
            <button
              type="button"
              onClick={() => {
                onOpenGuidelines();
                setMobileMenuOpen(false);
              }}
              data-testid="mobile-guidelines-button"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-navy-900 transition-colors"
            >
              <FileText className="w-4 h-4 text-navy-600 dark:text-navy-400" />
              <span>Official Exam Guidelines</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
