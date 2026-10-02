import React, { useState } from 'react';
import { PATTERNS_DETAIL, QUESTIONS } from '../data/curriculum.ts';
import { X, Copy, Check, ExternalLink, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

interface PatternDetailModalProps {
  patternId: string | null;
  onClose: () => void;
  solvedQuestions: string[];
  onToggleSolved: (id: string) => void;
}

export const PatternDetailModal: React.FC<PatternDetailModalProps> = ({
  patternId,
  onClose,
  solvedQuestions,
  onToggleSolved,
}) => {
  const [copied, setCopied] = useState(false);

  if (!patternId) return null;

  const detail = PATTERNS_DETAIL[patternId];
  if (!detail) return null;

  const patternQuestions = QUESTIONS.filter(
    (q) => q.patternId === patternId || q.pattern.toLowerCase().includes(detail.name.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(detail.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#101010] border border-[#272727] rounded-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#141414]">
          <div>
            <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-0.5">
              Pattern Blueprint
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100">{detail.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close pattern detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Summary & When do I think of this? */}
          <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Core Concept
              </span>
              <p className="text-zinc-200 leading-relaxed">{detail.shortDesc}</p>
            </div>

            <div className="pt-2 border-t border-[#222222]">
              <div className="flex items-center gap-1.5 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>When Do I Think Of This?</span>
              </div>
              <p className="text-zinc-300 italic font-medium leading-relaxed bg-[#101010] p-3 rounded-lg border border-[#202020]">
                "{detail.whenToThink}"
              </p>
            </div>
          </div>

          {/* Common Variants */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              Common Sub-Patterns & Variants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detail.variants.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-[#222222] px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Code Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Language-Neutral Template
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-zinc-400 hover:text-white bg-[#1c1c1c] hover:bg-[#252525] border border-[#292929] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#090909] border border-[#222222] text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
              <code>{detail.template}</code>
            </pre>
          </div>

          {/* Typical Mistakes */}
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Typical Traps & Mistakes</span>
            </div>
            <ul className="space-y-1.5">
              {detail.typicalMistakes.map((m, idx) => (
                <li
                  key={idx}
                  className="text-xs text-zinc-300 flex items-start gap-2 bg-[#171410] border border-amber-950/40 p-2.5 rounded-lg"
                >
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern Differentiation (e.g. Sliding Window vs Prefix Sum, Two Pointers vs Sliding Window, etc.) */}
          {detail.comparison && (
            <div className="bg-[#121417] border border-[#1f2733] rounded-xl p-4">
              <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3">
                {detail.comparison.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0b0e12] p-3 rounded-lg border border-[#1a222c]">
                  <span className="font-semibold text-zinc-100 block mb-2">
                    {detail.comparison.topicA}
                  </span>
                  <ul className="space-y-1 text-zinc-400">
                    {detail.comparison.pointsA.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-400 shrink-0">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0b0e12] p-3 rounded-lg border border-[#1a222c]">
                  <span className="font-semibold text-zinc-100 block mb-2">
                    {detail.comparison.topicB}
                  </span>
                  <ul className="space-y-1 text-zinc-400">
                    {detail.comparison.pointsB.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-violet-400 shrink-0">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Representative Questions in this Pattern */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              Curated Representative Problems ({patternQuestions.length})
            </h3>
            <div className="space-y-2">
              {patternQuestions.map((q) => {
                const isSolved = solvedQuestions.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                      isSolved
                        ? 'bg-[#0d120f] border-emerald-900/40 text-zinc-200'
                        : 'bg-[#141414] border-[#222222] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-zinc-500 font-semibold">#{q.number}</span>
                      <span className="font-medium text-zinc-100">{q.title}</span>
                      <span
                        className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          q.difficulty === 'Easy'
                            ? 'text-emerald-400 bg-emerald-950/30'
                            : q.difficulty === 'Medium'
                            ? 'text-amber-400 bg-amber-950/30'
                            : 'text-rose-400 bg-rose-950/30'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => onToggleSolved(q.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                          isSolved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-[#1c1c1c] text-zinc-300 border border-[#2b2b2b] hover:bg-[#282828]'
                        }`}
                      >
                        {isSolved ? '✓ Solved' : 'Mark Solved'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#222222] bg-[#141414] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-[#1e1e1e] hover:bg-[#282828] rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
