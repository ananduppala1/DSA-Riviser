import React, { useState } from 'react';
import { Question } from '../types.ts';
import {
  Check,
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
      ? 'text-[#83C7A1] bg-[#1D3A32] border-[#2D5549]'
      : question.difficulty === 'Medium'
      ? 'text-[#E3BC78] bg-[#3C3427] border-[#5A4D35]'
      : 'text-[#E18B91] bg-[#402B33] border-[#5C3A46]';

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        isSolved
          ? 'bg-[#121C2B] border-[#27354A] hover:border-[#55B7A8]/50'
          : 'bg-[#182436] border-[#304055] hover:border-[#475B73]'
      }`}
    >
      {/* Main Row: Columns aligned horizontally (Desktop) & Stacked (Mobile) */}
      <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
        {/* Left Section: Status Check Circle + Problem Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Status Circle Checkbox */}
          <button
            type="button"
            onClick={() => onToggleSolved(question.id)}
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isSolved
                ? 'bg-[#1D3A32] border-[#2D5549] text-[#83C7A1]'
                : 'bg-[#0E1522] border-[#304055] hover:border-[#55B7A8] text-transparent'
            }`}
            title={isSolved ? 'Completed (Click to unmark)' : 'Mark as Solved'}
            aria-label={`Toggle solved for ${question.title}`}
          >
            {isSolved && <Check className="w-3 h-3 stroke-[2.5]" />}
          </button>

          {/* Problem #, Title, and Core tag */}
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-[#7F90A6] font-semibold shrink-0">
                #{question.number}
              </span>
              <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-semibold truncate hover:underline transition-colors ${
                  isSolved
                    ? 'text-[#A6B3C5] hover:text-[#70C8B9]'
                    : 'text-[#E7EDF5] hover:text-[#70C8B9]'
                }`}
                title="Open LeetCode problem"
              >
                {question.title}
              </a>
              {question.core && (
                <span className="text-[10px] font-medium text-[#A6B3C5] bg-[#202F43] px-1.5 py-0.5 rounded border border-[#304055] shrink-0">
                  Core
                </span>
              )}
            </div>

            {/* Pattern & Sub-pattern breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-[#7F90A6] truncate">
              <button
                type="button"
                onClick={() => onOpenPatternDetail?.(question.patternId)}
                className="text-[#A6B3C5] hover:text-[#70C8B9] hover:underline transition-colors truncate"
              >
                {question.pattern}
              </button>
              <span className="text-[#304055]">→</span>
              <span className="text-[#E7EDF5] font-medium truncate">{question.subPattern}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Recognition Clue & Expected Technique (Desktop/Tablet) */}
        <div className="hidden lg:flex flex-col flex-1 max-w-md px-2 text-xs space-y-1">
          <div className="text-[#A6B3C5] italic truncate" title={question.recognition}>
            <span className="text-[#7F90A6] not-italic mr-1">Clue:</span>"{question.recognition}"
          </div>
          <div className="text-[#91B8DF] font-mono text-[11px] truncate" title={question.technique}>
            <span className="text-[#7F90A6] font-sans mr-1">Tech:</span>
            {question.technique}
          </div>
        </div>

        {/* Right Section: Level + Practice Button + Save/Bookmark + Expand Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#304055]">
          {/* Level (Difficulty Pill Badge) */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyBadgeStyle} shrink-0`}
          >
            {question.difficulty}
          </span>

          {/* Practice (</> circular code button) */}
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#182436] border border-[#304055] hover:border-[#55B7A8] hover:bg-[#202F43] text-[#A6B3C5] hover:text-[#55B7A8] flex items-center justify-center transition-all group font-mono text-xs font-semibold shrink-0"
            title="Practice on LeetCode ↗"
            aria-label="Practice on LeetCode"
          >
            <span className="group-hover:scale-105 transition-transform">&lt;/&gt;</span>
          </a>

          {/* Bookmark / Star (Save) */}
          <button
            type="button"
            onClick={() => onToggleDifficult(question.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
              isDifficult
                ? 'bg-[#3A3026] border-[#5A4D35] text-[#D9AD70]'
                : 'bg-[#182436] border-[#304055] text-[#7F90A6] hover:text-[#D9AD70] hover:bg-[#202F43]'
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
                ? 'bg-[#203D41] border-[#55B7A8]/50 text-[#70C8B9]'
                : 'bg-[#182436] border-[#304055] text-[#7F90A6] hover:text-[#E7EDF5] hover:bg-[#202F43]'
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
            className="p-1.5 rounded-lg text-[#7F90A6] hover:text-[#E7EDF5] hover:bg-[#202F43] transition-colors shrink-0 flex items-center gap-1 text-xs"
            title={isExpanded ? 'Collapse details' : 'Expand full details'}
            aria-label="Toggle details"
          >
            <span className="hidden sm:inline text-[11px] text-[#7F90A6]">
              {isExpanded ? 'Less' : 'Details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#A6B3C5]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#7F90A6]" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Details Drawer */}
      {isExpanded && (
        <div className="border-t border-[#304055] bg-[#121C2B] p-4 sm:p-5 space-y-3.5 animate-fade-in text-xs sm:text-sm">
          {/* Why This Matters */}
          <div className="bg-[#182436] border border-[#304055] rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-[#91B8DF] font-medium text-xs uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-[#91B8DF]" />
              <span>Why This Problem Matters</span>
            </div>
            <p className="text-[#E7EDF5] leading-relaxed font-normal">
              {question.whyImportant}
            </p>
          </div>

          {/* Full Recognition Clue & Expected Technique Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#182436] border border-[#304055] rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#D9AD70] font-medium text-xs uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-[#D9AD70]" />
                <span>Recognition Clue</span>
              </div>
              <p className="text-[#A6B3C5] italic leading-relaxed">
                "{question.recognition}"
              </p>
            </div>

            <div className="bg-[#182436] border border-[#304055] rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#55B7A8] font-medium text-xs uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-[#55B7A8]" />
                <span>Expected Technique</span>
              </div>
              <p className="text-[#D7DFEA] font-mono text-xs leading-relaxed">
                {question.technique}
              </p>
            </div>
          </div>

          {/* Personal Note Editor */}
          <div className="pt-2 border-t border-[#304055]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#A6B3C5]">
                Personal Revision Takeaway / Edge Case:
              </label>
              {personalNote && !isNoteOpen && (
                <button
                  type="button"
                  onClick={() => setIsNoteOpen(true)}
                  className="text-xs text-[#55B7A8] hover:text-[#70C8B9] hover:underline"
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
                className="flex-1 bg-[#0E1522] border border-[#304055] rounded-lg px-3 py-1.5 text-xs text-[#E7EDF5] placeholder-[#7F90A6] font-mono focus:outline-none focus:border-[#55B7A8]"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-1.5 text-xs font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] rounded-lg transition-colors whitespace-nowrap"
              >
                {isSavedNotice ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          {/* Bottom Action Footer inside Drawer */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#304055]">
            <a
              href={question.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A6B3C5] hover:text-[#55B7A8] font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Solve on Official LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7F90A6]" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleSolved(question.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSolved
                    ? 'bg-[#1D3A32] text-[#83C7A1] border border-[#2D5549] hover:bg-[#254A40]'
                    : 'bg-[#182436] text-[#E7EDF5] border border-[#304055] hover:bg-[#202F43] hover:border-[#55B7A8]/50'
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
