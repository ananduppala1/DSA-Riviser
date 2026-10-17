import React, { useState, useMemo } from 'react';
import { Question, Difficulty, Priority } from '../types.ts';
import { QUESTIONS, TOPICS } from '../data/curriculum.ts';
import { QuestionCard } from './QuestionCard.tsx';
import { QuestionListHeader } from './QuestionListHeader.tsx';
import { Search, Filter, ArrowUpDown, X, CheckCircle2 } from 'lucide-react';

interface QuestionsViewProps {
  solvedQuestions: string[];
  difficultQuestions: string[];
  personalNotes: Record<string, string>;
  onToggleSolved: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  onSaveNote: (id: string, note: string) => void;
  onOpenPatternDetail: (patternId: string) => void;
}

type SortOption = 'unsolved-first' | 'solved-first' | 'number-asc' | 'number-desc' | 'difficulty' | 'topic';

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  solvedQuestions,
  difficultQuestions,
  personalNotes,
  onToggleSolved,
  onToggleDifficult,
  onSaveNote,
  onOpenPatternDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('unsolved-first');

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter((q) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matches =
          q.title.toLowerCase().includes(query) ||
          q.number.toString().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          q.pattern.toLowerCase().includes(query) ||
          q.subPattern.toLowerCase().includes(query) ||
          q.technique.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Topic filter
      if (selectedTopic !== 'all' && q.topicId !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      const isSolved = solvedQuestions.includes(q.id);
      if (selectedStatus === 'solved' && !isSolved) return false;
      if (selectedStatus === 'unsolved' && isSolved) return false;

      // Priority filter
      if (selectedPriority === 'core' && !q.core) return false;
      if (selectedPriority === 'extended' && q.core) return false;

      return true;
    }).sort((a, b) => {
      const aSolved = solvedQuestions.includes(a.id);
      const bSolved = solvedQuestions.includes(b.id);

      switch (sortBy) {
        case 'unsolved-first':
          if (aSolved !== bSolved) return aSolved ? 1 : -1;
          return a.number - b.number;
        case 'solved-first':
          if (aSolved !== bSolved) return aSolved ? -1 : 1;
          return a.number - b.number;
        case 'number-asc':
          return a.number - b.number;
        case 'number-desc':
          return b.number - a.number;
        case 'difficulty': {
          const rank = { Easy: 1, Medium: 2, Hard: 3 };
          return rank[a.difficulty] - rank[b.difficulty];
        }
        case 'topic':
          return a.topic.localeCompare(b.topic);
        default:
          return 0;
      }
    });
  }, [
    searchQuery,
    selectedTopic,
    selectedDifficulty,
    selectedStatus,
    selectedPriority,
    sortBy,
    solvedQuestions,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortBy('unsolved-first');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedTopic !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all' ||
    sortBy !== 'unsolved-first';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121C2B] border border-[#304055] rounded-xl p-4 sm:p-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#E7EDF5] tracking-tight">
            Curated Problem Bank
          </h1>
          <p className="text-xs sm:text-sm text-[#A6B3C5] mt-1">
            Exactly 98 LeetCode archetypes filtered by topic, difficulty, and completion state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-[#A6B3C5] font-mono">
            Showing <span className="font-bold text-[#70C8B9]">{filteredQuestions.length}</span> of 98
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#55B7A8] hover:text-[#70C8B9] font-medium flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#7F90A6] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, problem number (#15), topic, pattern, or technique clue..."
            className="w-full bg-[#0E1522] border border-[#304055] rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-[#E7EDF5] placeholder-[#7F90A6] focus:outline-none focus:border-[#55B7A8] font-sans transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7F90A6] hover:text-[#E7EDF5] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
          {/* Topic Select */}
          <div>
            <label className="block text-[11px] font-medium text-[#A6B3C5] mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-[#121C2B] border border-[#304055] rounded-lg px-2.5 py-1.5 text-[#E7EDF5] focus:outline-none focus:border-[#55B7A8] transition-colors"
            >
              <option value="all">All Topics (18)</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.letter}. {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div>
            <label className="block text-[11px] font-medium text-[#A6B3C5] mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-[#121C2B] border border-[#304055] rounded-lg px-2.5 py-1.5 text-[#E7EDF5] focus:outline-none focus:border-[#55B7A8] transition-colors"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-[11px] font-medium text-[#A6B3C5] mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#121C2B] border border-[#304055] rounded-lg px-2.5 py-1.5 text-[#E7EDF5] focus:outline-none focus:border-[#55B7A8] transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="unsolved">Unsolved</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <label className="block text-[11px] font-medium text-[#A6B3C5] mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full bg-[#121C2B] border border-[#304055] rounded-lg px-2.5 py-1.5 text-[#E7EDF5] focus:outline-none focus:border-[#55B7A8] transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="core">Core Archetypes</option>
              <option value="extended">Extended Reinforcement</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-medium text-[#A6B3C5] mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#7F90A6]" />
              <span>Sort Order</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full bg-[#121C2B] border border-[#304055] rounded-lg px-2.5 py-1.5 text-[#E7EDF5] focus:outline-none focus:border-[#55B7A8] font-medium transition-colors"
            >
              <option value="unsolved-first">Unsolved First (Default)</option>
              <option value="solved-first">Solved First</option>
              <option value="number-asc">Problem # (Ascending)</option>
              <option value="number-desc">Problem # (Descending)</option>
              <option value="difficulty">Difficulty (Easy → Hard)</option>
              <option value="topic">Topic Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Vertical List */}
      {filteredQuestions.length === 0 ? (
        <div className="py-16 text-center bg-[#121C2B] border border-[#304055] rounded-xl p-8 space-y-3">
          <p className="text-[#A6B3C5] text-sm">
            No questions match your current filter settings.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <QuestionListHeader />
          <div className="space-y-2">
            {filteredQuestions.map((question) => (
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
        </div>
      )}
    </div>
  );
};
