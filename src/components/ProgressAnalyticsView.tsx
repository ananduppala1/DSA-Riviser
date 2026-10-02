import React from 'react';
import { TOPICS, QUESTIONS } from '../data/curriculum.ts';
import { BarChart3, CheckCircle2, Flame, Award, TrendingUp, Calendar } from 'lucide-react';

interface ProgressAnalyticsViewProps {
  solvedQuestions: string[];
  completionDates: Record<string, string>;
  streak: { current: number; longest: number };
}

export function ProgressAnalyticsView({
  solvedQuestions,
  completionDates,
  streak,
}: ProgressAnalyticsViewProps) {
  const totalQuestions = 98;
  const solvedCount = solvedQuestions.length;
  const overallPercentage = Math.round((solvedCount / totalQuestions) * 100);

  // Difficulty breakdown
  const easyQuestions = QUESTIONS.filter((q) => q.difficulty === 'Easy');
  const mediumQuestions = QUESTIONS.filter((q) => q.difficulty === 'Medium');
  const hardQuestions = QUESTIONS.filter((q) => q.difficulty === 'Hard');

  const easySolved = easyQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
  const mediumSolved = mediumQuestions.filter((q) => solvedQuestions.includes(q.id)).length;
  const hardSolved = hardQuestions.filter((q) => solvedQuestions.includes(q.id)).length;

  const easyPercentage = Math.round((easySolved / easyQuestions.length) * 100);
  const mediumPercentage = Math.round((mediumSolved / mediumQuestions.length) * 100);
  const hardPercentage = Math.round((hardSolved / hardQuestions.length) * 100);

  // Solved today
  const todayStr = new Date().toISOString().slice(0, 10);
  const solvedTodayCount = Object.values(completionDates).filter((d) => d.startsWith(todayStr)).length;

  // Solved this week (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const solvedWeekCount = Object.values(completionDates).filter((d) => new Date(d) >= oneWeekAgo).length;

  // Topic metrics
  const topicBreakdowns = TOPICS.map((topic) => {
    const qList = QUESTIONS.filter((q) => q.topicId === topic.id);
    const solved = qList.filter((q) => solvedQuestions.includes(q.id)).length;
    const percentage = qList.length > 0 ? Math.round((solved / qList.length) * 100) : 0;
    return {
      ...topic,
      total: qList.length,
      solved,
      remaining: qList.length - solved,
      percentage,
      isComplete: solved === qList.length && qList.length > 0,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Progress & Pattern Coverage Analytics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Objective evaluation of algorithmic pattern readiness before company online assessments.
        </p>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f0f12] border border-[#202026] rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Overall Completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {solvedCount}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 98</span>
          </div>
          <div className="mt-2 text-xs font-mono font-bold text-violet-400 tabular-nums">
            {overallPercentage}% vault coverage
          </div>
        </div>

        <div className="bg-[#0f0f12] border border-[#202026] rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Solved Today
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {solvedTodayCount}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {solvedWeekCount} in last 7 days
          </div>
        </div>

        <div className="bg-[#0f0f12] border border-[#202026] rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Active Streak
          </span>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400/20" />
            <span className="text-3xl font-extrabold font-mono tabular-nums">{streak.current}d</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            Longest streak: {streak.longest}d
          </div>
        </div>

        <div className="bg-[#0f0f12] border border-[#202026] rounded-xl p-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Topics Mastered
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {topicBreakdowns.filter((t) => t.isComplete).length}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 18</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {18 - topicBreakdowns.filter((t) => t.isComplete).length} topics in progress
          </div>
        </div>
      </div>

      {/* Difficulty Distribution Cards */}
      <section className="bg-[#0d0d10] border border-[#1e1e23] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
          Completion by Difficulty Tier
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Easy */}
          <div className="bg-[#121216] border border-[#22222a] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Easy Archetypes
              </span>
              <span className="font-mono text-xs font-bold text-zinc-200 tabular-nums">
                {easySolved} / {easyQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#1d1d26] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${easyPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 flex justify-between font-mono">
              <span>{easyPercentage}% complete</span>
              <span>{easyQuestions.length - easySolved} remaining</span>
            </div>
          </div>

          {/* Medium */}
          <div className="bg-[#121216] border border-[#22222a] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Medium Archetypes
              </span>
              <span className="font-mono text-xs font-bold text-zinc-200 tabular-nums">
                {mediumSolved} / {mediumQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#1d1d26] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${mediumPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 flex justify-between font-mono">
              <span>{mediumPercentage}% complete</span>
              <span>{mediumQuestions.length - mediumSolved} remaining</span>
            </div>
          </div>

          {/* Hard */}
          <div className="bg-[#121216] border border-[#22222a] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Hard Reinforcement
              </span>
              <span className="font-mono text-xs font-bold text-zinc-200 tabular-nums">
                {hardSolved} / {hardQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#1d1d26] rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-300"
                style={{ width: `${hardPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 flex justify-between font-mono">
              <span>{hardPercentage}% complete</span>
              <span>{hardQuestions.length - hardSolved} remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Topic Progress Bars (All 18 Topics) */}
      <section className="bg-[#0d0d10] border border-[#1e1e23] rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
            Detailed Topic Breakdown (All 18 Topics)
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Total Questions: 98</span>
        </div>

        <div className="space-y-3.5">
          {topicBreakdowns.map((t) => (
            <div key={t.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-violet-400 w-5">
                    {t.letter}.
                  </span>
                  <span className="font-semibold text-zinc-200">{t.name}</span>
                  {t.isComplete && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-1 rounded">
                      ✓ DONE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {t.solved}/{t.total} solved
                  </span>
                  <span className="font-mono font-bold text-zinc-100 w-10 text-right tabular-nums">
                    {t.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-[#17171e] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    t.isComplete
                      ? 'bg-emerald-400'
                      : t.percentage > 50
                      ? 'bg-violet-500'
                      : t.percentage > 0
                      ? 'bg-violet-600/70'
                      : 'bg-transparent'
                  }`}
                  style={{ width: `${t.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
