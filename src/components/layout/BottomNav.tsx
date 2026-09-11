import React from 'react';
import { Compass, FileCheck2, Bookmark } from 'lucide-react';
import type { NavigationTab } from './Navbar';

export interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  bookmarkCount?: number;
  hidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  bookmarkCount = 0,
  hidden = false,
}) => {
  if (hidden) return null;

  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'learn', label: 'Learn', icon: Compass },
    { id: 'test', label: 'Mock Exam', icon: FileCheck2 },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass border-t border-zinc-200/80 bg-white/90 px-2 pt-1.5 shadow-[0_-8px_30px_-12px_rgb(16_24_40/0.25)] dark:border-white/10 dark:bg-[#060b16]/90">
        <div className="grid grid-cols-3 gap-1 pb-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCenter = tab.id === 'test';
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                data-testid={`bottom-nav-tab-${tab.id}`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={tab.label}
                className={`relative flex min-h-[56px] touch-manipulation select-none flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-1.5 text-[11px] font-bold transition-all active:scale-[0.96] ${
                  isActive
                    ? isCenter
                      ? 'text-crimson-700 dark:text-crimson-300'
                      : 'bg-zinc-900/[0.06] text-zinc-900 dark:bg-white/10 dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isCenter ? (
                  <span
                    className={`flex h-9 w-14 items-center justify-center rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-crimson-700 to-rose-600 text-white shadow-glow-crimson'
                        : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="relative">
                    <Icon className={`h-[22px] w-[22px] ${isActive ? 'text-crimson-600 dark:text-crimson-400' : ''}`} />
                    {tab.id === 'bookmarks' && bookmarkCount > 0 && (
                      <span
                        data-testid="bottom-nav-bookmark-count"
                        className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-crimson-600 px-1 font-mono text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-[#060b16]"
                      >
                        {bookmarkCount > 99 ? '99+' : bookmarkCount}
                      </span>
                    )}
                  </span>
                )}
                <span className="leading-none">{tab.label}</span>
                {isActive && !isCenter && (
                  <span className="absolute bottom-0.5 h-1 w-8 rounded-full bg-gradient-to-r from-crimson-600 to-navy-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
