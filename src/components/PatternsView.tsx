import React, { useState, useEffect } from 'react';
import { Question } from '../types.ts';
import { TOPICS, QUESTIONS, PATTERNS_DETAIL } from '../data/curriculum.ts';
import { QuestionCard } from './QuestionCard.tsx';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface PatternsViewProps {
  solvedQuestions: string[];
  difficultQuestions: string[];
  personalNotes: Record<string, string>;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail: (patternId: string) => void;
  initialTopicId?: string | null;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  solvedQuestions,
  difficultQuestions,
  personalNotes,
  onToggleSolved,
  onToggleDifficult,
  onSaveNote,
  onOpenPatternDetail,
  initialTopicId = null,
}) => {
  // Level 1 topic expansions
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    TOPICS.forEach((t, i) => {
      init[t.id] = initialTopicId ? t.id === initialTopicId : i === 0;
    });
    return init;
  });

  // Level 2 pattern expansions
  const [expandedPatterns, setExpandedPatterns] = useState<Record<string, boolean>>({});

  // Level 3 sub-pattern expansions
  const [expandedSubPatterns, setExpandedSubPatterns] = useState<Record<string, boolean>>({});

  // Active topic filter tab
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>(initialTopicId || 'all');

  useEffect(() => {
    if (initialTopicId) {
      setActiveTopicFilter(initialTopicId);
      setExpandedTopics((prev) => ({ ...prev, [initialTopicId]: true }));
    }
  }, [initialTopicId]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const togglePattern = (patternKey: string) => {
    setExpandedPatterns((prev) => ({ ...prev, [patternKey]: !prev[patternKey] }));
  };

  const toggleSubPattern = (subPatternKey: string) => {
    setExpandedSubPatterns((prev) => ({ ...prev, [subPatternKey]: !prev[subPatternKey] }));
  };

  const expandAll = () => {
    const allTopics: Record<string, boolean> = {};
    const allPatterns: Record<string, boolean> = {};
    const allSubPatterns: Record<string, boolean> = {};

    TOPICS.forEach((t) => {
      allTopics[t.id] = true;
    });

    QUESTIONS.forEach((q) => {
      allPatterns[`${q.topicId}__${q.pattern}`] = true;
      allSubPatterns[`${q.topicId}__${q.pattern}__${q.subPattern}`] = true;
    });

    setExpandedTopics(allTopics);
    setExpandedPatterns(allPatterns);
    setExpandedSubPatterns(allSubPatterns);
  };

  const collapseAll = () => {
    setExpandedTopics({});
    setExpandedPatterns({});
    setExpandedSubPatterns({});
  };

  const visibleTopics =
    activeTopicFilter === 'all'
      ? TOPICS
      : TOPICS.filter((t) => t.id === activeTopicFilter);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* View Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121C2B] border border-[#304055] rounded-xl p-4 sm:p-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#E7EDF5] tracking-tight">
            Algorithmic Pattern Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-[#A6B3C5] mt-1">
            4-Level Structural Breakdown: Topic → Pattern → Sub-pattern → LeetCode Archetypes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#182436] hover:bg-[#202F43] border border-[#304055] transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expand All</span>
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#182436] hover:bg-[#202F43] border border-[#304055] transition-colors flex items-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Quick Topic Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTopicFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTopicFilter === 'all'
              ? 'bg-[#243E48] text-[#E7EDF5] border border-[#55B7A8]/50 shadow-xs'
              : 'bg-[#182436] text-[#A6B3C5] hover:text-[#E7EDF5] border border-[#304055]'
          }`}
        >
          All 18 Topics
        </button>
        {TOPICS.map((topic) => {
          const topicQuestions = QUESTIONS.filter((q) => q.topicId === topic.id);
          const solved = topicQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
          const isComplete = solved === topicQuestions.length && topicQuestions.length > 0;

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopicFilter(topic.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTopicFilter === topic.id
                  ? 'bg-[#243E48] text-[#E7EDF5] border border-[#55B7A8]/50 shadow-xs'
                  : 'bg-[#182436] text-[#A6B3C5] hover:text-[#E7EDF5] border border-[#304055]'
              }`}
            >
              <span>{topic.shortName}</span>
              <span
                className={`text-[10px] font-mono ${
                  isComplete
                    ? 'text-[#83C7A1] font-bold'
                    : activeTopicFilter === topic.id
                    ? 'text-[#70C8B9]'
                    : 'text-[#7F90A6]'
                }`}
              >
                {solved}/{topicQuestions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Topics Hierarchy List */}
      <div className="space-y-4">
        {visibleTopics.map((topic) => {
          const topicQuestions = QUESTIONS.filter((q) => q.topicId === topic.id);
          const solvedInTopic = topicQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
          const isTopicExpanded = !!expandedTopics[topic.id];
          const isTopicComplete = solvedInTopic === topicQuestions.length && topicQuestions.length > 0;
          const percentage = topicQuestions.length > 0 ? Math.round((solvedInTopic / topicQuestions.length) * 100) : 0;

          const patternsInTopic = Array.from(new Set(topicQuestions.map((q) => q.pattern)));

          return (
            <div
              key={topic.id}
              className="bg-[#121C2B] border border-[#304055] rounded-xl overflow-hidden transition-all shadow-xs"
            >
              {/* Level 1: Topic Bar */}
              <div
                onClick={() => toggleTopic(topic.id)}
                className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors ${
                  isTopicExpanded ? 'bg-[#182436]' : 'hover:bg-[#182436]/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1 text-[#7F90A6] hover:text-[#E7EDF5] transition-colors">
                    {isTopicExpanded ? (
                      <ChevronDown className="w-5 h-5 text-[#A6B3C5]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#7F90A6]" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#70C8B9] bg-[#203D41] border border-[#55B7A8]/30 px-2 py-0.5 rounded">
                        {topic.letter}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-[#E7EDF5]">
                        {topic.name}
                      </h2>
                      {isTopicComplete && (
                        <CheckCircle2 className="w-4 h-4 text-[#83C7A1] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#A6B3C5] mt-1 hidden sm:block">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-xs font-bold text-[#E7EDF5] tabular-nums">
                      {solvedInTopic} / {topicQuestions.length} Solved
                    </span>
                    <div className="w-24 h-1.5 bg-[#202F43] rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isTopicComplete ? 'bg-[#83C7A1]' : 'bg-[#55B7A8]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-[#A6B3C5] sm:hidden">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Level 1 Expanded Body */}
              {isTopicExpanded && (
                <div className="border-t border-[#304055] p-3 sm:p-5 space-y-4 bg-[#0E1522]">
                  {patternsInTopic.map((patternName) => {
                    const patternKey = `${topic.id}__${patternName}`;
                    const patternQuestions = topicQuestions.filter((q) => q.pattern === patternName);
                    const solvedInPattern = patternQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
                    const isPatternComplete = solvedInPattern === patternQuestions.length && patternQuestions.length > 0;
                    const isPatternExpanded = expandedPatterns[patternKey] !== false;
                    const firstQ = patternQuestions[0];
                    const patternId = firstQ?.patternId;

                    const subPatternsInPattern = Array.from(new Set(patternQuestions.map((q) => q.subPattern)));

                    return (
                      <div
                        key={patternKey}
                        className="bg-[#182436] border border-[#304055] rounded-xl overflow-hidden shadow-xs"
                      >
                        {/* Level 2: Pattern Header */}
                        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-[#1A283C]">
                          <div
                            onClick={() => togglePattern(patternKey)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1"
                          >
                            <span className="p-0.5 text-[#7F90A6]">
                              {isPatternExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[#A6B3C5]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-[#7F90A6]" />
                              )}
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-[#E7EDF5] flex items-center gap-2">
                                <span>{patternName}</span>
                                {isPatternComplete && (
                                  <span className="text-[10px] font-mono font-semibold text-[#83C7A1] bg-[#1D3A32] border border-[#2D5549] px-1.5 py-0.5 rounded">
                                    ✓ Solved
                                  </span>
                                )}
                              </h3>
                              <span className="text-xs text-[#7F90A6] font-mono">
                                {solvedInPattern}/{patternQuestions.length} problems completed
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {patternId && PATTERNS_DETAIL[patternId] && (
                              <button
                                type="button"
                                onClick={() => onOpenPatternDetail(patternId)}
                                className="px-2.5 py-1 rounded text-xs font-medium text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#202F43] hover:bg-[#243E48] border border-[#304055] hover:border-[#55B7A8]/50 transition-colors flex items-center gap-1.5"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-[#55B7A8]" />
                                <span className="hidden sm:inline">Blueprint & Template</span>
                                <span className="sm:hidden">Blueprint</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Level 2 Expanded Body (Sub-patterns) */}
                        {isPatternExpanded && (
                          <div className="p-3 sm:p-4 space-y-4 border-t border-[#304055] bg-[#121C2B]">
                            {subPatternsInPattern.map((subPatternName) => {
                              const subPatternKey = `${patternKey}__${subPatternName}`;
                              const subQuestions = patternQuestions.filter((q) => q.subPattern === subPatternName);
                              const isSubExpanded = expandedSubPatterns[subPatternKey] !== false;

                              return (
                                <div key={subPatternKey} className="space-y-3">
                                  {/* Level 3: Sub-pattern Tag / Header */}
                                  <div
                                    onClick={() => toggleSubPattern(subPatternKey)}
                                    className="flex items-center justify-between cursor-pointer py-1 text-xs font-semibold text-[#A6B3C5] hover:text-[#E7EDF5] transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#55B7A8]" />
                                      <span className="tracking-wide text-[#E7EDF5]">
                                        Sub-pattern: {subPatternName}
                                      </span>
                                      <span className="text-[#7F90A6] font-mono text-[11px]">
                                        ({subQuestions.length} {subQuestions.length === 1 ? 'problem' : 'problems'})
                                      </span>
                                    </div>
                                    <span className="text-[#7F90A6] text-[11px]">
                                      {isSubExpanded ? 'Collapse' : 'Expand'}
                                    </span>
                                  </div>

                                  {/* Level 4: Representative LeetCode Questions */}
                                  {isSubExpanded && (
                                    <div className="space-y-2 pl-2 sm:pl-3 border-l-2 border-[#304055]">
                                      {subQuestions.map((question) => (
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
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
