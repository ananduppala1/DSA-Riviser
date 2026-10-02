import React, { useState } from 'react';
import { Question } from '../types.ts';
import { ExternalLink, Check, Star, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  isSolved: boolean;
  isDifficult: boolean;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  personalNote?: string;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail?: (patternId: string) => void;
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
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(personalNote);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveNote = () => {
    onSaveNote(question.id, noteText);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const difficultyColor =
    question.difficulty === 'Easy'
      ? 'text-emerald-400'
      : question.difficulty === 'Medium'
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isSolved
          ? 'bg-[#0d120f] border-emerald-900/40 shadow-sm'
          : 'bg-[#101010] border-[#222222] hover:border-[#333333]'
      } p-4 sm:p-5 flex flex-col justify-between gap-4`}
    >
      <div>
        {/* Top line: Problem # and Difficulty & Priority Actions */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-zinc-400 font-semibold tracking-wider">
              #{question.number}
            </span>
            <span className="text-zinc-600 font-mono">·</span>
            <span className={`font-semibold tracking-wide ${difficultyColor}`}>
              {question.difficulty.toUpperCase()}
            </span>
            {question.core && (
              <>
                <span className="text-zinc-600 font-mono">·</span>
                <span className="text-violet-400 text-[11px] font-medium">Core Pattern</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleDifficult(question.id)}
              className={`p-1.5 rounded-md transition-colors ${
                isDifficult
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
              title={isDifficult ? 'Marked as priority review' : 'Mark as difficult for revision'}
              aria-label="Toggle review priority"
            >
              <Star className="w-4 h-4" fill={isDifficult ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={() => setIsNoteOpen(!isNoteOpen)}
              className={`p-1.5 rounded-md transition-colors ${
                personalNote
                  ? 'text-violet-400 hover:text-violet-300 bg-violet-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Add personal revision cue / note"
              aria-label="Toggle note field"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight mb-2">
          {question.title}
        </h3>

        {/* Pattern & Sub-pattern hierarchy */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 mb-3.5">
          <button
            type="button"
            onClick={() => onOpenPatternDetail?.(question.patternId)}
            className="hover:text-violet-300 hover:underline transition-colors text-left"
          >
            {question.pattern}
          </button>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-300 font-medium">{question.subPattern}</span>
        </div>

        {/* Structured Revision Clues (No full spoilers, active recall) */}
        <div className="space-y-2 text-xs sm:text-[13px] bg-[#141414] rounded-lg p-3 border border-[#1e1e1e]">
          <div>
            <span className="text-zinc-500 font-medium block mb-0.5">Recognition Clue:</span>
            <span className="text-zinc-200 font-normal leading-relaxed italic">
              "{question.recognition}"
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium block mb-0.5">Expected Technique:</span>
            <span className="text-zinc-300 font-mono text-xs">
              {question.technique}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 font-medium block mb-0.5">Why This Matters:</span>
            <span className="text-zinc-400 leading-relaxed">
              {question.whyImportant}
            </span>
          </div>
        </div>

        {/* Expandable personal revision note */}
        {isNoteOpen && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80">
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
              Personal Revision Takeaway / Edge Case:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. remember: map needs {0: 1} base case!"
                className="flex-1 bg-[#0a0a0a] border border-[#2b2b2b] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap"
              >
                {isSavedNotice ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Row: Solve on LeetCode + Mark Solved Checkbox */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1d1d1d]">
        <a
          href={question.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors group"
        >
          <span>Solve on LeetCode</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </a>

        <button
          type="button"
          onClick={() => onToggleSolved(question.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isSolved
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-[#1b1b1b] text-zinc-300 border border-[#2c2c2c] hover:bg-[#252525] hover:text-white'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
              isSolved
                ? 'bg-emerald-500 border-emerald-400 text-black'
                : 'border-zinc-500 bg-transparent'
            }`}
          >
            {isSolved && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </span>
          <span>{isSolved ? 'Completed' : 'Mark Solved'}</span>
        </button>
      </div>
    </div>
  );
};
