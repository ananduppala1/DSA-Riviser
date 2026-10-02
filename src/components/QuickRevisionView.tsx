import React, { useState } from 'react';
import { TOPICS, QUESTIONS, PATTERNS_DETAIL } from '../data/curriculum.ts';
import { QuestionCard } from './QuestionCard.tsx';
import { Zap, Calendar, CheckCircle2, ArrowRight, Lightbulb, Check } from 'lucide-react';

interface QuickRevisionViewProps {
  solvedQuestions: string[];
  difficultQuestions: string[];
  personalNotes: Record<string, string>;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail: (patternId: string) => void;
}

export const QuickRevisionView: React.FC<QuickRevisionViewProps> = ({
  solvedQuestions,
  difficultQuestions,
  personalNotes,
  onToggleSolved,
  onToggleDifficult,
  onSaveNote,
  onOpenPatternDetail,
}) => {
  const [activePlan, setActivePlan] = useState<'3-day' | '2-day'>('3-day');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedRevisionTopics, setCompletedRevisionTopics] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('dsa_pv_quick_revision_topics');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const toggleTopicRevisionCheck = (topicId: string) => {
    setCompletedRevisionTopics((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      try {
        localStorage.setItem('dsa_pv_quick_revision_topics', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // 3-Day Plan groupings:
  // Day 1: Arrays, Strings, Two Pointers, Sliding Window, Prefix Sum, Binary Search
  // Day 2: Sorting + Matrix, Linked List, Stack + Queue, Heap, Recursion + Backtracking, Trees
  // Day 3: Graphs, Greedy, DP, Bit Manipulation, Trie/DSU, Math
  const day1TopicIds = ['arrays-hashing', 'strings', 'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search'];
  const day2TopicIds = ['sorting-intervals-matrix', 'linked-lists', 'stack-queue', 'heap-pq', 'recursion-backtracking', 'trees-bst'];
  const day3TopicIds = ['graphs', 'greedy', 'dynamic-programming', 'bit-manipulation', 'union-find-trie', 'math-simulation'];

  // 2-Day Plan groupings:
  // Day 1: Linear + Search (Arrays, Strings, Two Pointers, Sliding Window, Binary Search, Stack, Linked List)
  // Day 2: Non-linear + DP (Trees, Graphs, Heap, Backtracking, DP, Greedy, Bit)
  const plan2Day1TopicIds = ['arrays-hashing', 'strings', 'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search', 'linked-lists', 'stack-queue'];
  const plan2Day2TopicIds = ['trees-bst', 'graphs', 'heap-pq', 'recursion-backtracking', 'greedy', 'dynamic-programming', 'union-find-trie', 'bit-manipulation', 'math-simulation'];

  const currentTopicIds =
    activePlan === '3-day'
      ? selectedDay === 1
        ? day1TopicIds
        : selectedDay === 2
        ? day2TopicIds
        : day3TopicIds
      : selectedDay === 1
      ? plan2Day1TopicIds
      : plan2Day2TopicIds;

  const currentTopics = TOPICS.filter((t) => currentTopicIds.includes(t.id));

  // Compute total questions for current active day
  const dayQuestions = QUESTIONS.filter((q) => currentTopicIds.includes(q.topicId));
  const daySolvedCount = dayQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
  const dayPercentage = dayQuestions.length > 0 ? Math.round((daySolvedCount / dayQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#17140b] via-[#14120f] to-[#0c0c0e] border border-amber-900/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-300">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Yield Assessment Sprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quick Revision Sequence
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Have only 2 to 3 days before an online coding assessment? Follow this disciplined, curated itinerary to systematically cover all patterns without burnout.
          </p>
        </div>

        {/* Plan Mode Switcher */}
        <div className="flex items-center p-1 bg-[#09090b] border border-[#222222] rounded-xl self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActivePlan('3-day');
              if (selectedDay > 3) setSelectedDay(1);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activePlan === '3-day'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3-Day Schedule (Recommended)
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePlan('2-day');
              if (selectedDay > 2) setSelectedDay(1);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activePlan === '2-day'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            2-Day Blitz
          </button>
        </div>
      </div>

      {/* Day Selector Tabs & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0f0f12] border border-[#1e1e24] rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2">
          {activePlan === '3-day' ? (
            <>
              <button
                type="button"
                onClick={() => setSelectedDay(1)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#15151a] text-zinc-400 hover:text-white border border-[#24242d]'
                }`}
              >
                DAY 1: Linear & Sliding & BS
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(2)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 2
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#15151a] text-zinc-400 hover:text-white border border-[#24242d]'
                }`}
              >
                DAY 2: Linked Lists, Stack, Heap, Trees
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(3)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 3
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#15151a] text-zinc-400 hover:text-white border border-[#24242d]'
                }`}
              >
                DAY 3: Graphs, Greedy, DP, Bit & Math
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setSelectedDay(1)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#15151a] text-zinc-400 hover:text-white border border-[#24242d]'
                }`}
              >
                DAY 1: Fundamentals, Pointers & Search
              </button>
              <button
                type="button"
                onClick={() => setSelectedDay(2)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedDay === 2
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#15151a] text-zinc-400 hover:text-white border border-[#24242d]'
                }`}
              >
                DAY 2: Trees, Graphs, DP & Greedy
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-zinc-400 font-mono">
            Day Progress: <span className="font-bold text-amber-300">{daySolvedCount}</span> / {dayQuestions.length} ({dayPercentage}%)
          </span>
          <div className="w-24 h-1.5 bg-[#202028] rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${dayPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics for current Day */}
      <div className="space-y-6">
        {currentTopics.map((topic) => {
          const isTopicChecked = !!completedRevisionTopics[topic.id];
          const topicQuestions = QUESTIONS.filter((q) => q.topicId === topic.id);
          const solvedInTopic = topicQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
          const isAllSolved = solvedInTopic === topicQuestions.length;

          // Unique patterns
          const patterns = Array.from(new Set(topicQuestions.map((q) => q.pattern)));

          return (
            <div
              key={topic.id}
              className={`rounded-xl border transition-all ${
                isTopicChecked
                  ? 'bg-[#0f1411] border-emerald-900/40'
                  : 'bg-[#0d0d10] border-[#1e1e23]'
              } p-5 space-y-4`}
            >
              {/* Header with Topic Checkbox */}
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#1b1b22]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTopicRevisionCheck(topic.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isTopicChecked
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'border-zinc-600 hover:border-zinc-400 bg-transparent'
                    }`}
                    aria-label={`Mark ${topic.name} revised`}
                  >
                    {isTopicChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {topic.letter}.
                      </span>
                      <h2 className="text-base font-bold text-white">
                        {topic.name}
                      </h2>
                      {isTopicChecked && (
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                          REVISED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{topic.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-semibold text-zinc-300">
                    {solvedInTopic}/{topicQuestions.length} Solved
                  </span>
                </div>
              </div>

              {/* Core Recognition Clues for Fast Recall */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {patterns.map((pName) => {
                  const pQ = topicQuestions.find((q) => q.pattern === pName);
                  const pDetail = pQ ? PATTERNS_DETAIL[pQ.patternId] : null;

                  return (
                    <div
                      key={pName}
                      className="p-3 rounded-lg bg-[#131317] border border-[#222228] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{pName}</span>
                        {pQ?.patternId && (
                          <button
                            type="button"
                            onClick={() => onOpenPatternDetail(pQ.patternId)}
                            className="text-[10px] text-amber-400 hover:underline font-mono"
                          >
                            Template →
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        {pDetail?.whenToThink || pQ?.recognition}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Curated Questions in this Topic */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  High-Yield Revision Problems:
                </span>
                <div className="space-y-2">
                  {topicQuestions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      isSolved={solvedQuestions.includes(q.id)}
                      isDifficult={difficultQuestions.includes(q.id)}
                      personalNote={personalNotes[q.id]}
                      onToggleSolved={onToggleSolved}
                      onToggleDifficult={onToggleDifficult}
                      onSaveNote={onSaveNote}
                      onOpenPatternDetail={onOpenPatternDetail}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
