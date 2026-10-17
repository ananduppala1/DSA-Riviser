import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types.ts';
import { QUESTIONS } from '../data/curriculum.ts';
import { Search, X, ExternalLink, Check, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  solvedQuestions: string[];
  onToggleSolved: (id: string) => void;
  onSelectQuestion: (question: Question) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  solvedQuestions,
  onToggleSolved,
  onSelectQuestion,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.trim().toLowerCase();

  const filtered = query
    ? QUESTIONS.filter((q) => {
        return (
          q.title.toLowerCase().includes(normalized) ||
          q.number.toString().includes(normalized) ||
          q.topic.toLowerCase().includes(normalized) ||
          q.pattern.toLowerCase().includes(normalized) ||
          q.subPattern.toLowerCase().includes(normalized) ||
          q.technique.toLowerCase().includes(normalized)
        );
      })
    : QUESTIONS.slice(0, 8); // show initial popular set when empty

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#121C2B] border border-[#304055] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#304055] bg-[#182436]">
          <Search className="w-4 h-4 text-[#7F90A6] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, pattern, number (#560), title, or technique..."
            className="flex-1 bg-transparent text-sm text-[#E7EDF5] placeholder-[#7F90A6] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#7F90A6] hover:text-[#E7EDF5] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#202F43] text-[#A6B3C5] border border-[#304055]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#7F90A6] text-xs">
              No matching problems or patterns found for "{query}".
            </div>
          ) : (
            filtered.map((q) => {
              const isSolved = solvedQuestions.includes(q.id);
              return (
                <div
                  key={q.id}
                  className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isSolved
                      ? 'bg-[#121C2B] border-[#27354A]'
                      : 'bg-[#182436] border-[#304055] hover:border-[#55B7A8]/60 hover:bg-[#1E2E42]'
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer pr-3"
                    onClick={() => {
                      onSelectQuestion(q);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-[#7F90A6] font-semibold">
                        #{q.number}
                      </span>
                      <span className="text-[#304055] text-xs">·</span>
                      <span className="text-sm font-semibold text-[#E7EDF5] group-hover:text-[#70C8B9] transition-colors">
                        {q.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold border ${
                          q.difficulty === 'Easy'
                            ? 'text-[#83C7A1] bg-[#1D3A32] border-[#2D5549]'
                            : q.difficulty === 'Medium'
                            ? 'text-[#E3BC78] bg-[#3C3427] border-[#5A4D35]'
                            : 'text-[#E18B91] bg-[#402B33] border-[#5C3A46]'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#A6B3C5]">
                      <span className="text-[#70C8B9] font-medium">{q.topic}</span>
                      <span className="text-[#304055]">→</span>
                      <span>{q.pattern}</span>
                      <span className="text-[#304055]">→</span>
                      <span className="text-[#7F90A6] italic font-mono text-[11px]">{q.subPattern}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#7F90A6] hover:text-[#55B7A8] rounded hover:bg-[#202F43] transition-colors"
                      title="Open LeetCode"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onToggleSolved(q.id)}
                      className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isSolved
                          ? 'bg-[#1D3A32] text-[#83C7A1] border border-[#2D5549]'
                          : 'bg-[#202F43] text-[#A6B3C5] border border-[#304055] hover:text-[#E7EDF5] hover:border-[#55B7A8]/50'
                      }`}
                    >
                      {isSolved && <Check className="w-3 h-3 text-[#83C7A1]" />}
                      <span>{isSolved ? 'Solved' : 'Mark'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-[#304055] bg-[#182436] flex items-center justify-between text-[11px] text-[#7F90A6]">
          <span>Total Curated Questions: 98</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
