import React from 'react';

export const QuestionListHeader: React.FC = () => {
  return (
    <div className="hidden md:flex items-center justify-between px-4 py-2.5 bg-[#121C2B] border border-[#304055] rounded-xl text-xs font-semibold text-[#A6B3C5] uppercase tracking-wider mb-2 select-none">
      {/* Left: Status & Problem */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="w-6 text-center text-[#7F90A6] font-mono text-[10px]">Status</span>
        <span className="truncate">Problem & Pattern</span>
      </div>

      {/* Middle: Clue & Technique */}
      <div className="hidden lg:block flex-1 max-w-md px-2 text-[#7F90A6]">
        Recognition Clue & Technique
      </div>

      {/* Right: Level, Practice, Save */}
      <div className="flex items-center justify-end gap-3 w-auto shrink-0 text-[#7F90A6]">
        <span className="w-16 text-center">Level</span>
        <span className="w-12 text-center">Practice</span>
        <span className="w-20 text-center">Save / Note</span>
        <span className="w-12 text-right">Details</span>
      </div>
    </div>
  );
};
