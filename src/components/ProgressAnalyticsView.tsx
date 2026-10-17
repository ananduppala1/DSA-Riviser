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
      <div className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#E7EDF5] tracking-tight">
          Progress & Pattern Coverage Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#A6B3C5] mt-1">
          Objective evaluation of algorithmic pattern readiness before company online assessments.
        </p>
      </div>

      {/* Primary 4-Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#55B7A8]/50">
          <span className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider block mb-1">
            Overall Completion
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#E7EDF5] font-mono tabular-nums">
              {solvedCount}
            </span>
            <span className="text-xs text-[#7F90A6] font-mono">/ 98</span>
          </div>
          <div className="mt-2 text-xs font-mono font-bold text-[#55B7A8] tabular-nums">
            {overallPercentage}% vault coverage
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#91B8DF]/50">
          <span className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider block mb-1">
            Solved Today
          </span>
          <div className="text-3xl font-extrabold text-[#91B8DF] font-mono tabular-nums">
            {solvedTodayCount}
          </div>
          <div className="mt-2 text-xs text-[#A6B3C5]">
            {solvedWeekCount} in last 7 days
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#D9AD70]/50">
          <span className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider block mb-1">
            Active Streak
          </span>
          <div className="flex items-center gap-1.5 text-[#D9AD70]">
            <Flame className="w-6 h-6 fill-[#D9AD70]/20" />
            <span className="text-3xl font-extrabold font-mono tabular-nums">{streak.current}d</span>
          </div>
          <div className="mt-2 text-xs text-[#A6B3C5] font-mono">
            Longest streak: {streak.longest}d
          </div>
        </div>

        <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 transition-colors hover:border-[#70C8B9]/50">
          <span className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider block mb-1">
            Topics Mastered
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#70C8B9] font-mono tabular-nums">
              {topicBreakdowns.filter((t) => t.isComplete).length}
            </span>
            <span className="text-xs text-[#7F90A6] font-mono">/ 18</span>
          </div>
          <div className="mt-2 text-xs text-[#A6B3C5]">
            {18 - topicBreakdowns.filter((t) => t.isComplete).length} topics in progress
          </div>
        </div>
      </div>

      {/* Difficulty Distribution Cards */}
      <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-[#E7EDF5] uppercase tracking-wide">
          Completion by Difficulty Tier
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Easy */}
          <div className="bg-[#182436] border border-[#304055] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#83C7A1] uppercase tracking-wider">
                Easy Archetypes
              </span>
              <span className="font-mono text-xs font-bold text-[#E7EDF5] tabular-nums">
                {easySolved} / {easyQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#202F43] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#83C7A1] rounded-full transition-all duration-300"
                style={{ width: `${easyPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[#A6B3C5] flex justify-between font-mono">
              <span className="text-[#83C7A1]">{easyPercentage}% complete</span>
              <span>{easyQuestions.length - easySolved} remaining</span>
            </div>
          </div>

          {/* Medium */}
          <div className="bg-[#182436] border border-[#304055] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E3BC78] uppercase tracking-wider">
                Medium Archetypes
              </span>
              <span className="font-mono text-xs font-bold text-[#E7EDF5] tabular-nums">
                {mediumSolved} / {mediumQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#202F43] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E3BC78] rounded-full transition-all duration-300"
                style={{ width: `${mediumPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[#A6B3C5] flex justify-between font-mono">
              <span className="text-[#E3BC78]">{mediumPercentage}% complete</span>
              <span>{mediumQuestions.length - mediumSolved} remaining</span>
            </div>
          </div>

          {/* Hard */}
          <div className="bg-[#182436] border border-[#304055] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E18B91] uppercase tracking-wider">
                Hard Reinforcement
              </span>
              <span className="font-mono text-xs font-bold text-[#E7EDF5] tabular-nums">
                {hardSolved} / {hardQuestions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-[#202F43] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E18B91] rounded-full transition-all duration-300"
                style={{ width: `${hardPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[#A6B3C5] flex justify-between font-mono">
              <span className="text-[#E18B91]">{hardPercentage}% complete</span>
              <span>{hardQuestions.length - hardSolved} remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Topic Progress Bars (All 18 Topics) */}
      <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#E7EDF5] uppercase tracking-wide">
            Detailed Topic Breakdown (All 18 Topics)
          </h2>
          <span className="text-xs text-[#7F90A6] font-mono">Total Questions: 98</span>
        </div>

        <div className="space-y-3.5">
          {topicBreakdowns.map((t) => (
            <div key={t.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#70C8B9] bg-[#203D41] border border-[#55B7A8]/30 px-1.5 py-0.2 rounded w-6 text-center">
                    {t.letter}
                  </span>
                  <span className="font-semibold text-[#E7EDF5]">{t.name}</span>
                  {t.isComplete && (
                    <span className="text-[10px] font-mono text-[#83C7A1] font-bold bg-[#1D3A32] border border-[#2D5549] px-1.5 py-0.5 rounded">
                      ✓ DONE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#7F90A6] font-mono text-[11px]">
                    {t.solved}/{t.total} solved
                  </span>
                  <span className="font-mono font-bold text-[#E7EDF5] w-10 text-right tabular-nums">
                    {t.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-[#202F43] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    t.isComplete
                      ? 'bg-[#83C7A1]'
                      : t.percentage > 0
                      ? 'bg-[#55B7A8]'
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
