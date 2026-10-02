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
    <header className="h-14 shrink-0 bg-[#070707]/90 backdrop-blur-md border-b border-[#181818] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile Hamburger & Page Context Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-[#141414] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-200">
          <span className="text-zinc-500 hidden sm:inline">Vault</span>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="tracking-tight">{getTabLabel(currentTab)}</span>
        </div>
      </div>

      {/* Zone 2: Quick Search Trigger */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-zinc-400 bg-[#121212] hover:bg-[#181818] border border-[#222222] rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400" />
            <span>{searchQuery ? `Searching: "${searchQuery}"` : 'Search topics, patterns, problem # or title...'}</span>
          </div>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#1c1c1c] text-zinc-500 border border-[#2b2b2b]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Quick Action Shortcuts */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-[#141414] rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('quick-revision')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            currentTab === 'quick-revision'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#141414] text-zinc-300 hover:text-white border border-[#222222] hover:bg-[#1a1a1a]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Quick</span>
          <span>Revision</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('revision-mode')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            currentTab === 'revision-mode'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-[#141414] text-zinc-300 hover:text-white border border-[#222222] hover:bg-[#1a1a1a]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Focus Mode</span>
        </button>
      </div>
    </header>
  );
};
