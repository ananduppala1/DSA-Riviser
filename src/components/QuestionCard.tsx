import React, { useState } from 'react';
import { Question } from '../types.ts';
import {
  Check,
  Star,
  Bookmark,
  Edit3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Code2,
  Info,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  isSolved: boolean;
  isDifficult: boolean;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  personalNote?: string;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail?: (patternId: string) => void;
  showHeader?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSolved,
  isDifficult,
  onToggleSolved,
  onToggleDifficult,
  personalNote = '',
  onSaveNote,
  onOpenPatternDetail,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(personalNote);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveNote = () => {
    onSaveNote(question.id, noteText);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const difficultyBadgeStyle =
    question.difficulty === 'Easy'
      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
      : question.difficulty === 'Medium'
      ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
      : 'text-rose-400 bg-rose-950/40 border-rose-500/30';

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        isSolved
          ? 'bg-[#0b100d] border-emerald-950/50 hover:border-emerald-800/60'
          : 'bg-[#0e0e11] border-[#1d1d24] hover:border-[#2f2f3c]'
      }`}
    >
      {/* Main Row: Columns aligned horizontally (Desktop) & Stacked (Mobile) */}
      <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
        {/* Left Section: Status Check Circle + Problem Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Status Circle Checkbox (matching Image 1) */}
          <button
            type="button"
            onClick={() => onToggleSolved(question.id)}
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
              isSolved
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm shadow-emerald-950'
                : 'border-zinc-600 hover:border-zinc-400 bg-transparent'
            }`}
            title={isSolved ? 'Completed (Click to unmark)' : 'Mark as Solved'}
            aria-label={`Toggle solved for ${question.title}`}
          >
            {isSolved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Problem #, Title, and Core tag */}
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-zinc-500 font-semibold shrink-0">
                #{question.number}
              </span>
              <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-semibold truncate hover:underline transition-colors ${
                  isSolved ? 'text-zinc-200 hover:text-emerald-300' : 'text-zinc-100 hover:text-violet-300'
                }`}
                title="Open LeetCode problem"
              >
                {question.title}
              </a>
              {question.core && (
                <span className="text-[10px] font-medium text-violet-400 bg-violet-950/40 px-1.5 py-0.2 rounded border border-violet-500/25 shrink-0">
                  Core
                </span>
              )}
            </div>

            {/* Pattern & Sub-pattern breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate">
              <button
                type="button"
                onClick={() => onOpenPatternDetail?.(question.patternId)}
                className="text-zinc-400 hover:text-violet-300 hover:underline transition-colors truncate"
              >
                {question.pattern}
              </button>
              <span className="text-zinc-600">→</span>
              <span className="text-zinc-300 font-medium truncate">{question.subPattern}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Recognition Clue & Expected Technique (Desktop/Tablet) */}
        <div className="hidden lg:flex flex-col flex-1 max-w-md px-2 text-xs space-y-1">
          <div className="text-zinc-300 italic truncate" title={question.recognition}>
            <span className="text-zinc-500 not-italic mr-1">Clue:</span>"{question.recognition}"
          </div>
          <div className="text-zinc-400 font-mono text-[11px] truncate" title={question.technique}>
            <span className="text-zinc-500 font-sans mr-1">Tech:</span>
            {question.technique}
          </div>
        </div>

        {/* Right Section: Level + Practice Button + Save/Bookmark + Expand Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1a1a22]">
          {/* Level (Difficulty Pill Badge - matching Image 1) */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeStyle} shrink-0`}
          >
            {question.difficulty}
          </span>

          {/* Practice (</> circular code button - matching Image 1) */}
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#15151c] border border-[#262633] hover:border-violet-500/60 hover:bg-violet-950/30 text-zinc-300 hover:text-white flex items-center justify-center transition-all group font-mono text-xs font-bold shrink-0"
            title="Practice on LeetCode ↗"
            aria-label="Practice on LeetCode"
          >
            <span className="group-hover:scale-110 transition-transform">&lt;/&gt;</span>
          </a>

          {/* Bookmark / Star (Save - matching Image 1) */}
          <button
            type="button"
            onClick={() => onToggleDifficult(question.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
              isDifficult
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-[#15151c] border-[#262633] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1f2a]'
            }`}
            title={isDifficult ? 'Saved in Priority Review' : 'Save / Star for Revision'}
            aria-label="Save problem"
          >
            <Bookmark className="w-3.5 h-3.5" fill={isDifficult ? 'currentColor' : 'none'} />
          </button>

          {/* Personal Note Button */}
          <button
            type="button"
            onClick={() => {
              setIsExpanded(true);
              setIsNoteOpen(true);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
              personalNote
                ? 'bg-violet-500/15 border-violet-500/40 text-violet-300'
                : 'bg-[#15151c] border-[#262633] text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1f2a]'
            }`}
            title={personalNote ? 'Edit personal note' : 'Add personal note'}
            aria-label="Personal note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Details Expand Chevron */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c1c24] transition-colors shrink-0 flex items-center gap-1 text-xs`}
            title={isExpanded ? 'Collapse details' : 'Expand full details'}
            aria-label="Toggle details"
          >
            <span className="hidden sm:inline text-[11px] text-zinc-500">
              {isExpanded ? 'Less' : 'Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-violet-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Details Drawer (Preserving 100% of all info from Image 2!) */}
      {isExpanded && (
        <div className="border-t border-[#1c1c24] bg-[#09090c] p-4 sm:p-5 space-y-3.5 animate-fade-in text-xs sm:text-sm">
          {/* Why This Matters */}
          <div className="bg-[#121217] border border-[#202029] rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              <span>Why This Problem Matters</span>
            </div>
            <p className="text-zinc-200 leading-relaxed font-normal">
              {question.whyImportant}
            </p>
          </div>

          {/* Full Recognition Clue & Expected Technique Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#121217] border border-[#202029] rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Recognition Clue</span>
              </div>
              <p className="text-zinc-300 italic leading-relaxed">
                "{question.recognition}"
              </p>
            </div>

            <div className="bg-[#121217] border border-[#202029] rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-xs uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Expected Technique</span>
              </div>
              <p className="text-zinc-300 font-mono text-xs leading-relaxed">
                {question.technique}
              </p>
            </div>
          </div>

          {/* Personal Note Editor */}
          <div className="pt-2 border-t border-[#1c1c24]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Personal Revision Takeaway / Edge Case:
              </label>
              {personalNote && !isNoteOpen && (
                <button
                  type="button"
                  onClick={() => setIsNoteOpen(true)}
                  className="text-xs text-violet-400 hover:underline"
                >
                  Edit Note
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Remember: HashMap needs {0: 1} base case to handle subarray from index 0!"
                className="flex-1 bg-[#15151c] border border-[#292936] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 font-mono focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap"
              >
                {isSavedNotice ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          {/* Bottom Action Footer inside Drawer */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1a1a22]">
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1.5"
            >
              <span>Solve on Official LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSolved(question.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSolved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#181820] text-zinc-300 border border-[#2c2c3a] hover:bg-[#22222e]'
                }`}
              >
                {isSolved ? '✓ Marked Completed' : 'Mark as Solved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
