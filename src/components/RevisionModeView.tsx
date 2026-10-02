import React, { useState, useMemo } from 'react';
import { Question } from '../types.ts';
import { QUESTIONS, TOPICS } from '../data/curriculum.ts';
import { QuestionCard } from './QuestionCard.tsx';
import { Flame, Star, AlertCircle, Layers, CheckCircle2 } from 'lucide-react';

interface RevisionModeViewProps {
  solvedQuestions: string[];
  difficultQuestions: string[];
  personalNotes: Record<string, string>;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail: (patternId: string) => void;
}

type RevisionFilter = 'all-weak' | 'difficult-only' | 'core-unsolved' | 'lowest-topics';

export const RevisionModeView: React.FC<RevisionModeViewProps> = ({
  solvedQuestions,
  difficultQuestions,
  personalNotes,
  onToggleSolved,
  onToggleDifficult,
  onSaveNote,
  onOpenPatternDetail,
}) => {
  const [filterMode, setFilterMode] = useState<RevisionFilter>('all-weak');

  // Identify lowest completion topics
  const lowestTopicIds = useMemo(() => {
    return TOPICS.map((topic) => {
      const topicQuestions = QUESTIONS.filter((q) => q.topicId === topic.id);
      const solvedInTopic = topicQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
      const percentage = topicQuestions.length > 0 ? (solvedInTopic / topicQuestions.length) * 100 : 0;
      return { id: topic.id, percentage, remaining: topicQuestions.length - solvedInTopic };
    })
      .filter((t) => t.remaining > 0)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 5)
      .map((t) => t.id);
  }, [solvedQuestions]);

  const targetQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      const isSolved = solvedQuestions.includes(q.id);
      const isDiff = difficultQuestions.includes(q.id);
      const isInLowestTopic = lowestTopicIds.includes(q.topicId);

      switch (filterMode) {
        case 'difficult-only':
          return isDiff;
        case 'core-unsolved':
          return !isSolved && q.core;
        case 'lowest-topics':
          return !isSolved && isInLowestTopic;
        case 'all-weak':
        default:
          // Any problem that is difficult, OR unsolved from lowest topics, OR unsolved core pattern
          return isDiff || (!isSolved && (q.core || isInLowestTopic));
      }
    }).sort((a, b) => {
      // Prioritize marked difficult first, then unsolved core
      const aDiff = difficultQuestions.includes(a.id);
      const bDiff = difficultQuestions.includes(b.id);
      if (aDiff !== bDiff) return aDiff ? -1 : 1;

      const aSolved = solvedQuestions.includes(a.id);
      const bSolved = solvedQuestions.includes(b.id);
      if (aSolved !== bSolved) return aSolved ? 1 : -1;

      return a.number - b.number;
    });
  }, [filterMode, solvedQuestions, difficultQuestions, lowestTopicIds]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#170e10] via-[#140e11] to-[#0d0c0e] border border-rose-900/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-xs font-semibold text-rose-300">
            <Flame className="w-3.5 h-3.5" />
            <span>Targeted Weakness Elimination</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rapid Revision Mode
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Stop solving problems you already know. This mode isolates unsolved archetypes, lowest-completion topics, and problems you flagged for review.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0a0c] border border-[#222226] rounded-xl self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode('all-weak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all-weak'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Weak Points
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('difficult-only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              filterMode === 'difficult-only'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>Starred ({difficultQuestions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('core-unsolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'core-unsolved'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Core Unsolved
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('lowest-topics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'lowest-topics'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Weakest Topics
          </button>
        </div>
      </div>

      {/* Target Problems Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <div>
          Focus Queue: <span className="font-bold text-zinc-100">{targetQuestions.length}</span> problems prioritized for your revision session
        </div>
        <div className="text-zinc-500 font-mono">
          Tip: Hit star on any card to add it to your priority review
        </div>
      </div>

      {/* Questions Grid */}
      {targetQuestions.length === 0 ? (
        <div className="py-16 text-center bg-[#0d0d0f] border border-[#1e1e22] rounded-xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white">No weak points in this view!</h2>
          <p className="text-zinc-400 text-xs max-w-sm mx-auto">
            You've solved the core problems or haven't starred any difficult ones yet. Excellent progress!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isSolved={solvedQuestions.includes(question.id)}
              isDifficult={difficultQuestions.includes(question.id)}
              personalNote={personalNotes[question.id]}
              onToggleSolved={onToggleSolved}
              onToggleDifficult={onToggleDifficult}
              onSaveNote={onSaveNote}
              onOpenPatternDetail={onOpenPatternDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
