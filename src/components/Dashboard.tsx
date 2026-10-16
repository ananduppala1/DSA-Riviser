import React, { useState, useEffect } from 'react';
import { ViewTab, Question } from '../types.ts';
import { TOPICS, QUESTIONS, MOTIVATIONAL_QUOTES } from '../data/curriculum.ts';
import {
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface DashboardProps {
  solvedQuestions: string[];
  completionDates: Record<string, string>;
  streak: { current: number; longest: number };
  onSelectTab: (tab: ViewTab) => void;
  onSelectTopic: (topicId: string) => void;
  onToggleSolved: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  solvedQuestions,
  completionDates,
  streak,
  onSelectTab,
  onSelectTopic,
  onToggleSolved,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = 98;
  const solvedCount = solvedQuestions.length;
  const remainingCount = totalQuestions - solvedCount;
  const overallPercentage = Math.round((solvedCount / totalQuestions) * 100);

  // Compute topic stats
  const topicStats = TOPICS.map((topic) => {
    const topicQuestions = QUESTIONS.filter((q) => q.topicId === topic.id);
    const solvedInTopic = topicQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
    const percentage = topicQuestions.length > 0 ? Math.round((solvedInTopic / topicQuestions.length) * 100) : 0;
    return {
      ...topic,
      total: topicQuestions.length,
      solved: solvedInTopic,
      remaining: topicQuestions.length - solvedInTopic,
      percentage,
      isComplete: solvedInTopic === topicQuestions.length && topicQuestions.length > 0,
    };
  });

  const topicsCompletedCount = topicStats.filter((t) => t.isComplete).length;

  // Weakest topics (topics with lowest completion percentage that still have remaining questions)
  const weakestTopics = [...topicStats]
    .filter((t) => t.remaining > 0)
    .sort((a, b) => a.percentage - b.percentage || b.remaining - a.remaining)
    .slice(0, 4);

  // Recently completed questions
  const sortedSolvedIds = [...solvedQuestions].sort((a, b) => {
    const dateA = completionDates[a] ? new Date(completionDates[a]).getTime() : 0;
    const dateB = completionDates[b] ? new Date(completionDates[b]).getTime() : 0;
    return dateB - dateA;
  });

  const recentSolvedQuestions = sortedSolvedIds
    .slice(0, 5)
    .map((id) => QUESTIONS.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  // Circular progress SVG values
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0f0f12] border border-[#222228] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Assessment Revision Cockpit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              DSA Pattern Vault
            </h1>

            <p className="text-base sm:text-lg font-medium text-zinc-300">
              “Recognize the pattern. Solve the problem. Repeat.”
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              98 representative problems across all major algorithmic paradigms. No noise, no random grinding—reactivate your instincts before online assessments.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => onSelectTab('patterns')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-900 bg-zinc-100 hover:bg-white transition-all flex items-center gap-2"
              >
                <span>Start Revision</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('quick-revision')}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 bg-[#18181c] hover:bg-[#222228] border border-[#2c2c36] transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-zinc-400" />
                <span>Quick Revision (2-3d)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('progress')}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-[#121215] hover:bg-[#1a1a1f] border border-[#24242c] transition-all"
              >
                View Analytics
              </button>
            </div>

            {/* Motivational Microcopy Rotator */}
            <div className="pt-3 text-xs text-zinc-500 flex items-center justify-center lg:justify-start gap-2 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
              <span>{MOTIVATIONAL_QUOTES[quoteIndex]}</span>
            </div>
          </div>

          {/* Clean Circular Progress Indicator */}
          <div className="relative shrink-0 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#1c1c22"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#52525b"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-white font-mono tabular-nums">
                  {overallPercentage}%
                </span>
                <span className="text-xs text-zinc-400 font-mono mt-0.5 tabular-nums">
                  {solvedCount} / 98
                </span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
                  Pattern Coverage
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Metric Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Overall Solved
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{solvedCount}</span>
            <span className="text-xs text-zinc-500 font-mono">/ 98</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            {remainingCount} questions left
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Pattern Coverage
          </span>
          <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
            {overallPercentage}%
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Across 18 topics
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Topics Completed
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
              {topicsCompletedCount}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 18</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            100% mastered
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Remaining
          </span>
          <div className="text-2xl font-bold text-zinc-200 font-mono tabular-nums">
            {remainingCount}
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Target: 0
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Current Streak
          </span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Flame className="w-5 h-5 text-zinc-400" />
            <span className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{streak.current}d</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Best: {streak.longest}d
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#202024] rounded-xl p-4">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
            Revision Pace
          </span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <TrendingUp className="w-5 h-5 text-zinc-400" />
            <span className="text-2xl font-bold font-mono tabular-nums">
              {solvedCount === 0 ? '0' : Math.min(98, Math.round(solvedCount * 1.2))}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Confidence momentum
          </div>
        </div>
      </section>

      {/* Empty State Banner if 0 problems solved */}
      {solvedCount === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-[#0d0d0f] p-6 text-center space-y-3">
          <h2 className="text-lg font-bold text-zinc-100">Your vault is ready.</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            You already solved 400+ problems in the past—your intuition is still there. Start with one pattern to wake it up.
          </p>
          <button
            type="button"
            onClick={() => onSelectTopic('arrays-hashing')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Start with Arrays + Hashing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two Column Layout: Weakest Focus & Recently Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weakest Topics / Needs Revision */}
        <section className="bg-[#0d0d0f] border border-[#1e1e22] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Flame className="w-4 h-4 text-zinc-300" />
              </div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Priority Revision Topics
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('revision-mode')}
              className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>Focus Mode</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Topics with the lowest completion rate where focused practice will yield maximum exam leverage.
          </p>

          <div className="space-y-2.5">
            {weakestTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="group p-3 rounded-lg bg-[#131316] border border-[#222227] hover:border-[#383842] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {topic.letter}.
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                      {topic.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {topic.solved} of {topic.total} solved ({topic.remaining} remaining)
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-zinc-300 tabular-nums">
                    {topic.percentage}%
                  </span>
                  <div className="w-20 h-1.5 bg-[#202027] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-zinc-500 rounded-full"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Completed */}
        <section className="bg-[#0d0d0f] border border-[#1e1e22] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-zinc-300" />
              </div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                Recently Completed
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('questions')}
              className="text-xs text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1 transition-colors"
            >
              <span>View All 98</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Latest solved problems reflecting your active revision momentum.
          </p>

          {recentSolvedQuestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No problems marked completed yet. Open any question and hit "Mark Solved" when done!
            </div>
          ) : (
            <div className="space-y-2">
              {recentSolvedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-lg bg-[#131316] border border-[#222227] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-zinc-500">#{q.number}</span>
                    <span className="font-medium text-zinc-100">{q.title}</span>
                    <span className="text-[11px] text-zinc-500 hidden sm:inline">
                      ({q.topic})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-300 font-mono font-semibold">
                      ✓ Done
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSolved(q.id)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono hover:underline"
                    >
                      Undo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Topic-Wise Progress Grid (All 18 Topics) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Topic-Wise Pattern Coverage
            </h2>
          </div>
          <span className="text-xs text-zinc-500">Click any topic to explore hierarchy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topicStats.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                topic.isComplete
                  ? 'bg-[#0f0f12] border-zinc-700 hover:border-zinc-500'
                  : 'bg-[#0f0f12] border-[#1e1e23] hover:border-[#303038] hover:bg-[#131317]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                    {topic.letter}
                  </span>
                  <span className="text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {topic.name}
                  </span>
                </div>
                {topic.isComplete && (
                  <span className="text-[10px] font-semibold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
                    COMPLETED
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="font-mono tabular-nums">
                  {topic.solved} / {topic.total} Solved
                </span>
                <span className="font-mono font-semibold text-zinc-200 tabular-nums">
                  {topic.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#1b1b22] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    topic.isComplete
                      ? 'bg-zinc-300'
                      : topic.percentage > 0
                      ? 'bg-zinc-500'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500">
                <span>{topic.remaining} remaining</span>
                <span className="text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all font-medium">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
