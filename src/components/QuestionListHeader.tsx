import React from 'react';

export const QuestionListHeader: React.FC = () => {
  return (
    <div className="hidden md:flex items-center justify-between px-4 py-2.5 bg-[#0b0b0e] border border-[#1b1b22] rounded-xl text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 select-none">
      {/* Left: Status & Problem */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="w-6 text-center text-zinc-500 font-mono text-[10px]">Status</span>
        <span className="truncate">Problem & Pattern</span>
      </div>

      {/* Middle: Clue & Technique */}
      <div className="hidden lg:block flex-1 max-w-md px-2 text-zinc-500">
        Recognition Clue & Technique
      </div>

      {/* Right: Level, Practice, Save */}
      <div className="flex items-center justify-end gap-3 w-auto shrink-0 text-zinc-500">
        <span className="w-16 text-center">Level</span>
        <span className="w-12 text-center">Practice</span>
        <span className="w-20 text-center">Save / Note</span>
        <span className="w-12 text-right">Details</span>
      </div>
    </div>
  );
};
