import React, { useState, useEffect } from 'react';
import { ViewTab, Question } from '../types.ts';
import { TOPICS, QUESTIONS, MOTIVATIONAL_QUOTES } from '../data/curriculum.ts';
import {
  Zap,
  Flame,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
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

  // Weakest topics
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
      <section className="relative overflow-hidden rounded-2xl bg-[#121C2B] border border-[#304055] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#203D41] border border-[#55B7A8]/40 text-xs font-semibold text-[#70C8B9]">
              <Sparkles className="w-3.5 h-3.5 text-[#55B7A8]" />
              <span>Assessment Revision Cockpit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E7EDF5] tracking-tight">
              DSA Pattern Vault
            </h1>

            <p className="text-base sm:text-lg font-medium text-[#70C8B9]">
              “Recognize the pattern. Solve the problem. Repeat.”
            </p>

            <p className="text-xs sm:text-sm text-[#A6B3C5] leading-relaxed">
              98 representative problems across all major algorithmic paradigms. No noise, no random grinding—reactivate your instincts before online assessments.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                type="button"
                onClick={() => onSelectTab('patterns')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Start Revision</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('quick-revision')}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#70C8B9] bg-[#203D41] hover:bg-[#243E48] border border-[#55B7A8]/40 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-[#55B7A8]" />
                <span>Quick Revision (2-3d)</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('progress')}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#182436] hover:bg-[#202F43] border border-[#304055] transition-all"
              >
                View Analytics
              </button>
            </div>

            {/* Motivational Microcopy Rotator */}
            <div className="pt-3 text-xs text-[#7F90A6] flex items-center justify-center lg:justify-start gap-2 italic">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55B7A8] shrink-0" />
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
                  stroke="#202F43"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#55B7A8"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-[#E7EDF5] font-mono tabular-nums">
                  {overallPercentage}%
                </span>
                <span className="text-xs text-[#70C8B9] font-mono mt-0.5 tabular-nums">
                  {solvedCount} / 98
                </span>
                <span className="text-[10px] text-[#7F90A6] font-medium uppercase tracking-wider mt-1">
                  Pattern Coverage
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Metric Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#475B73]">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Overall Solved
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#E7EDF5] font-mono tabular-nums">{solvedCount}</span>
            <span className="text-xs text-[#7F90A6] font-mono">/ 98</span>
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            {remainingCount} questions left
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#55B7A8]/50">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Pattern Coverage
          </span>
          <div className="text-2xl font-bold text-[#55B7A8] font-mono tabular-nums">
            {overallPercentage}%
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            Across 18 topics
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#475B73]">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Topics Mastered
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-[#70C8B9] font-mono tabular-nums">
              {topicsCompletedCount}
            </span>
            <span className="text-xs text-[#7F90A6] font-mono">/ 18</span>
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            100% completed
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#475B73]">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Remaining
          </span>
          <div className="text-2xl font-bold text-[#E7EDF5] font-mono tabular-nums">
            {remainingCount}
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            Target: 0
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#D9AD70]/50">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Current Streak
          </span>
          <div className="flex items-center gap-1.5 text-[#D9AD70]">
            <Flame className="w-5 h-5 fill-[#D9AD70]/20" />
            <span className="text-2xl font-bold font-mono tabular-nums text-[#D9AD70]">{streak.current}d</span>
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            Best: {streak.longest}d
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#91B8DF]/50">
          <span className="text-[11px] font-medium text-[#7F90A6] uppercase tracking-wider block mb-1">
            Revision Pace
          </span>
          <div className="flex items-center gap-1.5 text-[#91B8DF]">
            <TrendingUp className="w-5 h-5 text-[#91B8DF]" />
            <span className="text-2xl font-bold font-mono tabular-nums text-[#E7EDF5]">
              {solvedCount === 0 ? '0' : Math.min(98, Math.round(solvedCount * 1.2))}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#A6B3C5]">
            Confidence momentum
          </div>
        </div>
      </section>

      {/* Empty State Banner if 0 problems solved */}
      {solvedCount === 0 && (
        <div className="rounded-xl border border-[#304055] bg-[#121C2B] p-6 text-center space-y-3">
          <h2 className="text-lg font-bold text-[#E7EDF5]">Your vault is ready.</h2>
          <p className="text-xs sm:text-sm text-[#A6B3C5] max-w-md mx-auto">
            You already solved 400+ problems in the past—your intuition is still there. Start with one pattern to wake it up.
          </p>
          <button
            type="button"
            onClick={() => onSelectTopic('arrays-hashing')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <span>Start with Arrays + Hashing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two Column Layout: Weakest Focus & Recently Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weakest Topics / Needs Revision */}
        <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#3A3026] text-[#D9AD70] border border-[#5A4D35]">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#E7EDF5] uppercase tracking-wide">
                Priority Revision Topics
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('revision-mode')}
              className="text-xs text-[#70C8B9] hover:underline font-medium flex items-center gap-1 transition-colors"
            >
              <span>Focus Mode</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-[#A6B3C5]">
            Topics with the lowest completion rate where focused practice will yield maximum exam leverage.
          </p>

          <div className="space-y-2.5">
            {weakestTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="group p-3 rounded-lg bg-[#182436] border border-[#304055] hover:border-[#55B7A8]/60 hover:bg-[#202F43] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#70C8B9] bg-[#203D41] px-1.5 py-0.5 rounded border border-[#55B7A8]/30">
                      {topic.letter}.
                    </span>
                    <span className="text-xs font-semibold text-[#E7EDF5] group-hover:text-[#70C8B9] transition-colors">
                      {topic.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7F90A6]">
                    {topic.solved} of {topic.total} solved ({topic.remaining} remaining)
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#E7EDF5] tabular-nums">
                    {topic.percentage}%
                  </span>
                  <div className="w-20 h-1.5 bg-[#202F43] rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#55B7A8] rounded-full transition-all duration-300"
                      style={{ width: `${topic.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Completed */}
        <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-[#1D3A32] text-[#83C7A1] border border-[#2D5549]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#E7EDF5] uppercase tracking-wide">
                Recently Completed
              </h2>
            </div>
            <button
              onClick={() => onSelectTab('questions')}
              className="text-xs text-[#70C8B9] hover:underline font-medium flex items-center gap-1 transition-colors"
            >
              <span>View All 98</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-[#A6B3C5]">
            Latest solved problems reflecting your active revision momentum.
          </p>

          {recentSolvedQuestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7F90A6]">
              No problems marked completed yet. Open any question and hit "Mark Solved" when done!
            </div>
          ) : (
            <div className="space-y-2">
              {recentSolvedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-lg bg-[#182436] border border-[#304055] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[#7F90A6]">#{q.number}</span>
                    <span className="font-medium text-[#E7EDF5]">{q.title}</span>
                    <span className="text-[11px] text-[#7F90A6] hidden sm:inline">
                      ({q.topic})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#83C7A1] bg-[#1D3A32] border border-[#2D5549] px-1.5 py-0.5 rounded font-mono font-semibold">
                      ✓ Done
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSolved(q.id)}
                      className="text-[10px] text-[#7F90A6] hover:text-[#E7EDF5] font-mono hover:underline"
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
            <Layers className="w-4 h-4 text-[#55B7A8]" />
            <h2 className="text-sm font-bold text-[#E7EDF5] uppercase tracking-wide">
              Topic-Wise Pattern Coverage
            </h2>
          </div>
          <span className="text-xs text-[#7F90A6]">Click any topic to explore hierarchy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topicStats.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                topic.isComplete
                  ? 'bg-[#142323] border-[#2D5549] hover:border-[#55B7A8]'
                  : 'bg-[#182436] border-[#304055] hover:border-[#55B7A8]/60 hover:bg-[#1C2C40]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#70C8B9] bg-[#203D41] px-1.5 py-0.5 rounded border border-[#55B7A8]/30">
                    {topic.letter}
                  </span>
                  <span className="text-xs font-semibold text-[#E7EDF5] group-hover:text-[#70C8B9] transition-colors">
                    {topic.name}
                  </span>
                </div>
                {topic.isComplete && (
                  <span className="text-[10px] font-semibold text-[#83C7A1] bg-[#1D3A32] border border-[#2D5549] px-1.5 py-0.5 rounded font-mono">
                    COMPLETED
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-[#A6B3C5] mb-2">
                <span className="font-mono tabular-nums">
                  {topic.solved} / {topic.total} Solved
                </span>
                <span className="font-mono font-semibold text-[#E7EDF5] tabular-nums">
                  {topic.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#202F43] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    topic.isComplete
                      ? 'bg-[#83C7A1]'
                      : topic.percentage > 0
                      ? 'bg-[#55B7A8]'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#7F90A6]">
                <span>{topic.remaining} remaining</span>
                <span className="text-[#55B7A8] group-hover:text-[#70C8B9] group-hover:translate-x-0.5 transition-all font-medium">
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
