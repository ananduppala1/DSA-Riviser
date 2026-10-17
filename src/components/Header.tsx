import React from 'react';
import { ViewTab } from '../types.ts';
import { Menu, Search, Zap, Flame } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onOpenSearch,
  searchQuery,
}) => {
  const getTabLabel = (tab: ViewTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'patterns':
        return 'Pattern Hierarchy';
      case 'questions':
        return 'Curated Problem Bank (98)';
      case 'quick-revision':
        return '⚡ Quick Revision (2-3 Day Plan)';
      case 'revision-mode':
        return '🔥 Rapid Revision Mode';
      case 'progress':
        return 'Progress Analytics';
      case 'settings':
        return 'Vault Settings & Data';
    }
  };

  return (
    <header className="h-14 shrink-0 bg-[#121C2B]/95 backdrop-blur-md border-b border-[#304055] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile Hamburger & Page Context Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#A6B3C5] hover:text-[#E7EDF5] hover:bg-[#182436] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E7EDF5]">
          <span className="text-[#7F90A6] hidden sm:inline">Vault</span>
          <span className="text-[#304055] hidden sm:inline">/</span>
          <span className="tracking-tight">{getTabLabel(currentTab)}</span>
        </div>
      </div>

      {/* Zone 2: Quick Search Trigger */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-[#A6B3C5] bg-[#0E1522] hover:bg-[#182436] border border-[#304055] hover:border-[#55B7A8]/60 rounded-lg transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#7F90A6] group-hover:text-[#55B7A8] transition-colors" />
            <span>{searchQuery ? `Searching: "${searchQuery}"` : 'Search topics, patterns, problem # or title...'}</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#182436] text-[#7F90A6] border border-[#304055] group-hover:text-[#A6B3C5]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Quick Action Shortcuts */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="md:hidden p-2 text-[#A6B3C5] hover:text-[#E7EDF5] hover:bg-[#182436] rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('quick-revision')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            currentTab === 'quick-revision'
              ? 'bg-[#243E48] text-[#70C8B9] border border-[#55B7A8]/50 shadow-sm'
              : 'bg-[#182436] text-[#A6B3C5] hover:text-[#E7EDF5] border border-[#304055] hover:bg-[#202F43] hover:border-[#55B7A8]/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#55B7A8]" />
          <span className="hidden sm:inline">Quick</span>
          <span>Revision</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('revision-mode')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
            currentTab === 'revision-mode'
              ? 'bg-[#3A3026] text-[#E7BE88] border border-[#D9AD70]/50 shadow-sm'
              : 'bg-[#182436] text-[#A6B3C5] hover:text-[#E7EDF5] border border-[#304055] hover:bg-[#202F43] hover:border-[#D9AD70]/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#D9AD70]" />
          <span>Focus Mode</span>
        </button>
      </div>
    </header>
  );
};
