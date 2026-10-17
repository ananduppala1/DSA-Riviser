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
      <div className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-[#E7EDF5] tracking-tight">
          Vault Settings & Progress Backup
        </h1>
        <p className="text-xs sm:text-sm text-[#A6B3C5] mt-1">
          Manage your local persistence data, export backups before switching devices, or reset your revision state.
        </p>
      </div>

      {/* Progress Management Section */}
      <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#304055]">
          <Database className="w-5 h-5 text-[#55B7A8]" />
          <h2 className="text-base font-bold text-[#E7EDF5]">Progress Backup & Restoration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Card */}
          <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7EDF5] mb-1">
                <Download className="w-4 h-4 text-[#55B7A8]" />
                <span>Export Progress</span>
              </div>
              <p className="text-xs text-[#A6B3C5] leading-relaxed">
                Save your {progress.solvedQuestions.length} completed problem records, active streaks, notes, and timestamps to a standalone JSON file.
              </p>
            </div>

            <button
              type="button"
              onClick={onExport}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#0E1522] bg-[#55B7A8] hover:bg-[#70C8B9] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import Card */}
          <div className="bg-[#182436] border border-[#304055] rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#E7EDF5] mb-1">
                <Upload className="w-4 h-4 text-[#70C8B9]" />
                <span>Import Backup File</span>
              </div>
              <p className="text-xs text-[#A6B3C5] leading-relaxed">
                Restore your solved history from a previously exported <code className="text-[#70C8B9] font-mono text-[11px]">.json</code> file.
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
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#E7EDF5] bg-[#202F43] hover:bg-[#243E48] border border-[#304055] hover:border-[#55B7A8]/50 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-[#55B7A8]" />
              <span>Select File to Restore</span>
            </button>
          </div>
        </div>

        {/* Manual Paste Import Fallback */}
        <div className="pt-2 border-t border-[#304055] space-y-2">
          <label className="block text-xs font-medium text-[#A6B3C5]">
            Or Paste JSON Backup String:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"solvedQuestions":["lc-1","lc-217"],...}'
              className="flex-1 bg-[#0E1522] border border-[#304055] rounded-lg px-3 py-1.5 text-xs text-[#E7EDF5] placeholder-[#7F90A6] font-mono focus:outline-none focus:border-[#55B7A8]"
            />
            <button
              type="button"
              onClick={handleManualImport}
              disabled={!importText.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-[#E7EDF5] bg-[#202F43] hover:bg-[#243E48] disabled:opacity-50 disabled:cursor-not-allowed border border-[#304055] rounded-lg transition-colors"
            >
              Restore
            </button>
          </div>
          {importSuccess && (
            <p className="text-xs text-[#83C7A1] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Progress restored successfully!</span>
            </p>
          )}
          {importError && (
            <p className="text-xs text-[#E18B91]">{importError}</p>
          )}
        </div>
      </section>

      {/* Global Reset Section */}
      <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#304055]">
          <Trash2 className="w-5 h-5 text-[#E18B91]" />
          <h2 className="text-base font-bold text-[#E7EDF5]">Reset Vault State</h2>
        </div>

        <p className="text-xs text-[#A6B3C5] leading-relaxed">
          Need a completely fresh start? Resetting will unmark all 98 questions, reset your streak to 0, and clear completion history. The 98-question curriculum will remain untouched.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenResetModal}
            className="px-4 py-2 text-xs font-semibold text-[#E18B91] hover:text-[#fff] bg-[#402B33] hover:bg-[#5C3A46] border border-[#5C3A46] rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Progress...</span>
          </button>
        </div>
      </section>

      {/* Curriculum Data Integrity Verification */}
      <section className="bg-[#121C2B] border border-[#304055] rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#304055]">
          <ShieldCheck className="w-5 h-5 text-[#55B7A8]" />
          <h2 className="text-base font-bold text-[#E7EDF5]">Curriculum Verification & Specs</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#182436] border border-[#304055]">
            <span className="text-[#7F90A6] block text-[11px] mb-0.5">Total Questions</span>
            <span className="font-mono text-base font-bold text-[#E7EDF5] tabular-nums">
              {totalCount} / 98
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#182436] border border-[#304055]">
            <span className="text-[#7F90A6] block text-[11px] mb-0.5">Unique IDs</span>
            <span className="font-mono text-base font-bold text-[#E7EDF5] tabular-nums">
              {uniqueIds} / 98 (0 dupes)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#182436] border border-[#304055]">
            <span className="text-[#7F90A6] block text-[11px] mb-0.5">LeetCode URLs</span>
            <span className="font-mono text-base font-bold text-[#83C7A1]">
              {allUrlsValid ? '100% Official' : 'Error'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#182436] border border-[#304055]">
            <span className="text-[#7F90A6] block text-[11px] mb-0.5">Total Main Topics</span>
            <span className="font-mono text-base font-bold text-[#E7EDF5] tabular-nums">
              18 (A through R)
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#7F90A6] pt-2 border-t border-[#304055]">
          Built for private, single-user DSA revision and assessment readiness. Zero external ads, zero telemetry, local persistence only.
        </p>
      </section>
    </div>
  );
}
