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
        else {
          // handled by parent or opened
        }
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
      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[#272727] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#222222] bg-[#141414]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, pattern, number (#560), title, or technique..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#202020] text-zinc-400 border border-[#303030]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
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
                      ? 'bg-[#0d1310] border-emerald-950/40 hover:border-emerald-800/60'
                      : 'bg-[#121212] border-[#1f1f1f] hover:border-[#333333]'
                  }`}
                >
                  <div
                    className="flex-1 cursor-pointer pr-3"
                    onClick={() => {
                      onSelectQuestion(q);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-zinc-400 font-semibold">
                        #{q.number}
                      </span>
                      <span className="text-zinc-600 text-xs">·</span>
                      <span className="text-sm font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors">
                        {q.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          q.difficulty === 'Easy'
                            ? 'text-emerald-400 bg-emerald-950/40'
                            : q.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-950/40'
                            : 'text-rose-400 bg-rose-950/40'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="text-zinc-300">{q.topic}</span>
                      <span className="text-zinc-600">→</span>
                      <span>{q.pattern}</span>
                      <span className="text-zinc-600">→</span>
                      <span className="text-zinc-400 italic font-mono text-[11px]">{q.subPattern}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-[#202020] transition-colors"
                      title="Open LeetCode"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onToggleSolved(q.id)}
                      className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isSolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#1e1e1e] text-zinc-300 border border-[#2e2e2e] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      {isSolved && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{isSolved ? 'Solved' : 'Mark'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-[#202020] bg-[#121212] flex items-center justify-between text-[11px] text-zinc-500">
          <span>Total Curated Questions: 98</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
