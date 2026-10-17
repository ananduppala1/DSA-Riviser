import React, { useState } from 'react';
import { PATTERNS_DETAIL, QUESTIONS } from '../data/curriculum.ts';
import { X, Copy, Check, ExternalLink, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

interface PatternDetailModalProps {
  patternId: string | null;
  onClose: () => void;
  solvedQuestions: string[];
  onToggleSolved: (id: string) => void;
}

// Syntax highlighter that implements the user's coding palette
const CodeHighlight: React.FC<{ code: string }> = ({ code }) => {
  const lines = code.split('\n');

  const highlightLine = (line: string) => {
    // If full line comment
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return <span style={{ color: '#8294A8' }}>{line}</span>;
    }

    // Split line into tokens preserving separators
    const regex = /(\/\/.*|#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:def|class|return|if|else|elif|while|for|in|let|const|var|function|new|import|from|null|None|True|False|int|bool|void|public|private|static)\b|\b\d+\b|\b[a-zA-Z_]\w*(?=\()|[+\-*/%=<>!&|^~]+|[{}()\[\],;]|\s+)/g;
    const parts = line.split(regex).filter(Boolean);

    return parts.map((part, idx) => {
      if (part.startsWith('//') || part.startsWith('#')) {
        return <span key={idx} style={{ color: '#8294A8' }}>{part}</span>;
      }
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        return <span key={idx} style={{ color: '#A6C98F' }}>{part}</span>;
      }
      if (/^(def|class|return|if|else|elif|while|for|in|let|const|var|function|new|import|from|null|None|True|False|int|bool|void|public|private|static)$/.test(part)) {
        return <span key={idx} style={{ color: '#C4A6E8', fontWeight: 600 }}>{part}</span>;
      }
      if (/^\d+$/.test(part)) {
        return <span key={idx} style={{ color: '#D9AD70' }}>{part}</span>;
      }
      return <span key={idx} style={{ color: '#D7DFEA' }}>{part}</span>;
    });
  };

  return (
    <pre className="p-4 rounded-xl bg-[#0E1522] border border-[#304055] text-xs font-mono overflow-x-auto leading-relaxed selection:bg-[#243E48]">
      <code>
        {lines.map((l, i) => (
          <div key={i} className="table-row">
            <span className="table-cell pr-4 text-[#7F90A6] select-none text-[11px] text-right font-mono opacity-50 w-6">
              {i + 1}
            </span>
            <span className="table-cell">{highlightLine(l)}</span>
          </div>
        ))}
      </code>
    </pre>
  );
};

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
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#121C2B] border border-[#304055] rounded-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#304055] bg-[#182436]">
          <div>
            <div className="text-xs font-semibold text-[#55B7A8] uppercase tracking-wider mb-0.5">
              Pattern Blueprint & Template
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#E7EDF5]">{detail.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#A6B3C5] hover:text-[#E7EDF5] p-1.5 rounded-lg hover:bg-[#202F43] transition-colors"
            aria-label="Close pattern detail"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#A6B3C5]">
          {/* Summary & When do I think of this? */}
          <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider block mb-1">
                Core Concept
              </span>
              <p className="text-[#E7EDF5] leading-relaxed">{detail.shortDesc}</p>
            </div>

            <div className="pt-2 border-t border-[#304055]">
              <div className="flex items-center gap-1.5 text-[#D9AD70] font-semibold text-xs uppercase tracking-wider mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#D9AD70]" />
                <span>When Do I Think Of This?</span>
              </div>
              <p className="text-[#E7BE88] italic font-medium leading-relaxed bg-[#3A3026] p-3 rounded-lg border border-[#5A4D35]">
                "{detail.whenToThink}"
              </p>
            </div>
          </div>

          {/* Common Variants */}
          <div>
            <h3 className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider mb-2.5">
              Common Sub-Patterns & Variants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detail.variants.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-[#182436] border border-[#304055] px-3.5 py-2 rounded-lg text-xs font-medium text-[#E7EDF5] flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55B7A8] shrink-0" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Code Template with Syntax Highlighting */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider">
                Language-Neutral Template
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#A6B3C5] hover:text-[#E7EDF5] bg-[#202F43] hover:bg-[#243E48] border border-[#304055] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-[#83C7A1]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <CodeHighlight code={detail.template} />
          </div>

          {/* Typical Mistakes */}
          <div>
            <div className="flex items-center gap-1.5 text-[#E3BC78] font-semibold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Typical Traps & Mistakes</span>
            </div>
            <ul className="space-y-1.5">
              {detail.typicalMistakes.map((m, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#E7EDF5] flex items-start gap-2 bg-[#3C3427] border border-[#5A4D35] p-2.5 rounded-lg"
                >
                  <span className="text-[#E3BC78] font-bold shrink-0">✕</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern Differentiation */}
          {detail.comparison && (
            <div className="bg-[#182436] border border-[#304055] rounded-xl p-4">
              <h4 className="text-xs font-semibold text-[#E7EDF5] uppercase tracking-wider mb-3">
                {detail.comparison.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#121C2B] p-3.5 rounded-lg border border-[#304055]">
                  <span className="font-semibold text-[#70C8B9] block mb-2">
                    {detail.comparison.topicA}
                  </span>
                  <ul className="space-y-1 text-[#A6B3C5]">
                    {detail.comparison.pointsA.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#55B7A8] shrink-0">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#121C2B] p-3.5 rounded-lg border border-[#304055]">
                  <span className="font-semibold text-[#D9AD70] block mb-2">
                    {detail.comparison.topicB}
                  </span>
                  <ul className="space-y-1 text-[#A6B3C5]">
                    {detail.comparison.pointsB.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#D9AD70] shrink-0">·</span>
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
            <h3 className="text-xs font-semibold text-[#7F90A6] uppercase tracking-wider mb-2.5">
              Curated Representative Problems ({patternQuestions.length})
            </h3>
            <div className="space-y-2">
              {patternQuestions.map((q) => {
                const isSolved = solvedQuestions.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-colors ${
                      isSolved
                        ? 'bg-[#121C2B] border-[#27354A] text-[#A6B3C5]'
                        : 'bg-[#182436] border-[#304055] text-[#E7EDF5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[#7F90A6] font-semibold">#{q.number}</span>
                      <span className="font-medium text-[#E7EDF5]">{q.title}</span>
                      <span
                        className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
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

                    <div className="flex items-center gap-3">
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A6B3C5] hover:text-[#55B7A8] flex items-center gap-1 font-medium transition-colors"
                      >
                        <span>LeetCode</span>
                        <ExternalLink className="w-3 h-3 text-[#7F90A6]" />
                      </a>

                      <button
                        type="button"
                        onClick={() => onToggleSolved(q.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          isSolved
                            ? 'bg-[#1D3A32] text-[#83C7A1] border border-[#2D5549]'
                            : 'bg-[#202F43] text-[#E7EDF5] border border-[#304055] hover:border-[#55B7A8]/50'
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
        <div className="px-6 py-3 border-t border-[#304055] bg-[#182436] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] rounded-lg transition-colors shadow-sm"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
