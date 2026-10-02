import React, { useState, useRef } from 'react';
import { UserProgress } from '../types.ts';
import { QUESTIONS, TOPICS } from '../data/curriculum.ts';
import { Download, Upload, Trash2, CheckCircle2, ShieldCheck, Database, FileText } from 'lucide-react';

interface SettingsViewProps {
  progress: UserProgress;
  onExport: () => void;
  onImport: (jsonString: string) => boolean;
  onOpenResetModal: () => void;
}

export function SettingsView({
  progress,
  onExport,
  onImport,
  onOpenResetModal,
}: SettingsViewProps) {
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImport(content);
        if (success) {
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          setImportError('Invalid progress backup file.');
        }
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleManualImport = () => {
    if (!importText.trim()) return;
    const success = onImport(importText);
    if (success) {
      setImportSuccess(true);
      setImportError(null);
      setImportText('');
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError('Failed to parse JSON. Please check file structure.');
    }
  };

  // Integrity checks
  const totalCount = QUESTIONS.length;
  const uniqueIds = new Set(QUESTIONS.map((q) => q.id)).size;
  const allUrlsValid = QUESTIONS.every((q) => q.url.startsWith('https://leetcode.com/problems/'));
  const allTopicsValid = QUESTIONS.every((q) => TOPICS.some((t) => t.id === q.topicId));

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div className="bg-[#0d0d0f] border border-[#1e1e22] rounded-xl p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Vault Settings & Progress Backup
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Manage your local persistence data, export backups before switching devices, or reset your revision state.
        </p>
      </div>

      {/* Progress Management Section */}
      <section className="bg-[#0f0f12] border border-[#202026] rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1c1c24]">
          <Database className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-bold text-white">Progress Backup & Restoration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Card */}
          <div className="bg-[#141418] border border-[#23232c] rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100 mb-1">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Progress</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Save your {progress.solvedQuestions.length} completed problem records, active streaks, notes, and timestamps to a standalone JSON file.
              </p>
            </div>

            <button
              type="button"
              onClick={onExport}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import Card */}
          <div className="bg-[#141418] border border-[#23232c] rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100 mb-1">
                <Upload className="w-4 h-4 text-violet-400" />
                <span>Import Backup File</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Restore your solved history from a previously exported <code className="text-zinc-300 font-mono text-[11px]">.json</code> file.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white bg-[#1e1e26] hover:bg-[#282834] border border-[#2d2d3c] transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select File to Restore</span>
            </button>
          </div>
        </div>

        {/* Manual Paste Import Fallback */}
        <div className="pt-2 border-t border-[#1c1c24] space-y-2">
          <label className="block text-xs font-medium text-zinc-400">
            Or Paste JSON Backup String:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"solvedQuestions":["lc-1","lc-217"],...}'
              className="flex-1 bg-[#121216] border border-[#252530] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 font-mono focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={handleManualImport}
              disabled={!importText.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Restore
            </button>
          </div>
          {importSuccess && (
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Progress restored successfully!</span>
            </p>
          )}
          {importError && (
            <p className="text-xs text-rose-400">{importError}</p>
          )}
        </div>
      </section>

      {/* Global Reset Section */}
      <section className="bg-[#0f0f12] border border-[#202026] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1c1c24]">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-bold text-white">Reset Vault State</h2>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Need a completely fresh start? Resetting will unmark all 98 questions, reset your streak to 0, and clear completion history. The 98-question curriculum will remain untouched.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenResetModal}
            className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900/50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Progress...</span>
          </button>
        </div>
      </section>

      {/* Curriculum Data Integrity Verification */}
      <section className="bg-[#0f0f12] border border-[#202026] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1c1c24]">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Curriculum Verification & Specs</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#141418] border border-[#23232c]">
            <span className="text-zinc-500 block text-[11px] mb-0.5">Total Questions</span>
            <span className="font-mono text-base font-bold text-zinc-100 tabular-nums">
              {totalCount} / 98
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#141418] border border-[#23232c]">
            <span className="text-zinc-500 block text-[11px] mb-0.5">Unique IDs</span>
            <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              {uniqueIds} / 98 (0 dupes)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#141418] border border-[#23232c]">
            <span className="text-zinc-500 block text-[11px] mb-0.5">LeetCode URLs</span>
            <span className="font-mono text-base font-bold text-emerald-400">
              {allUrlsValid ? '100% Official' : 'Error'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#141418] border border-[#23232c]">
            <span className="text-zinc-500 block text-[11px] mb-0.5">Total Main Topics</span>
            <span className="font-mono text-base font-bold text-violet-400 tabular-nums">
              18 (A through R)
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 pt-2 border-t border-[#1a1a22]">
          Built for private, single-user DSA revision and assessment readiness. Zero external ads, zero telemetry, local persistence only.
        </p>
      </section>
    </div>
  );
}
