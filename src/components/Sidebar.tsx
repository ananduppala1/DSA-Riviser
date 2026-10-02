import React from 'react';
import { ViewTab } from '../types.ts';
import {
  LayoutDashboard,
  Layers,
  ListFilter,
  Zap,
  Flame,
  BarChart3,
  Settings,
  Flame as StreakIcon,
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  solvedCount: number;
  streakCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  solvedCount,
  streakCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const percentage = Math.round((solvedCount / 98) * 100);

  const navItems: { tab: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      tab: 'patterns',
      label: 'Patterns',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      tab: 'questions',
      label: 'Questions',
      icon: <ListFilter className="w-4 h-4" />,
      badge: '98',
    },
    {
      tab: 'quick-revision',
      label: 'Quick Revision',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      badge: '2-3d',
    },
    {
      tab: 'revision-mode',
      label: 'Revision Mode',
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      badge: 'Focus',
    },
    {
      tab: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      tab: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const content = (
    <aside className="w-64 h-full flex flex-col bg-[#0a0a0a] border-r border-[#1a1a1a] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-950/40 text-sm tracking-wider">
            PV
          </div> */}
          <img
            src="/BugBros Neon Coding Emblem.png"
            alt="BugBros"
            className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-violet-950/40"
          />
          <div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight leading-none">
              DSA Pattern Vault
            </h1>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">
              98 Curated Questions
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => handleNavClick(item.tab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-violet-600/15 text-violet-300 border border-violet-500/25 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-violet-400' : 'text-zinc-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'bg-[#181818] text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Summary Widget */}
      <div className="p-4 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-zinc-400 font-medium">Vault Progress</span>
          <span className="font-mono text-zinc-200 font-semibold tabular-nums">
            {solvedCount} <span className="text-zinc-500 font-normal">/ 98</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="font-mono tabular-nums">{percentage}% complete</span>
          <div className="flex items-center gap-1 text-amber-400 font-mono">
            <StreakIcon className="w-3.5 h-3.5 fill-amber-400/20" />
            <span className="font-semibold tabular-nums">{streakCount}d streak</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-screen sticky top-0">
        {content}
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl animate-slide-right">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
