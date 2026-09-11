import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  FileCheck2,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
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
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'test', label: 'Test Mode', icon: FileCheck2 },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleTabClick('learn')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 transition-colors shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-none">
                  Nepal License Prep
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Cat A &amp; K 2082/83
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight hidden xs:block sm:block">
                Motorcycle &amp; Scooter Written Exam
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  data-testid={`nav-tab-${item.id}`}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.id === 'bookmarks' && bookmarkCount > 0 && (
                    <span
                      data-testid="nav-bookmark-count"
                      className="ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                    >
                      {bookmarkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Guidelines & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenGuidelines}
              data-testid="guidelines-button"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guidelines</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              type="button"
              onClick={toggleTheme}
              data-testid="mobile-theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              data-testid="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-menu-drawer"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-150"
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'bookmarks' && bookmarkCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                      {bookmarkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onOpenGuidelines();
                setMobileMenuOpen(false);
              }}
              data-testid="mobile-guidelines-button"
              className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Official Exam Guidelines</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
