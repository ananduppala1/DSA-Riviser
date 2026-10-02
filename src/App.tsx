import React, { useState, useEffect } from 'react';
import { ViewTab, Question } from './types.ts';
import { useProgress } from './hooks/useProgress.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { PatternsView } from './components/PatternsView.tsx';
import { QuestionsView } from './components/QuestionsView.tsx';
import { QuickRevisionView } from './components/QuickRevisionView.tsx';
import { RevisionModeView } from './components/RevisionModeView.tsx';
import { ProgressAnalyticsView } from './components/ProgressAnalyticsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { PatternDetailModal } from './components/PatternDetailModal.tsx';
import { ResetModal } from './components/ResetModal.tsx';
import { ToastContainer } from './components/Toast.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [activePatternDetailId, setActivePatternDetailId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const {
    progress,
    toasts,
    removeToast,
    toggleSolved,
    toggleDifficult,
    saveNote,
    resetAll,
    exportProgress,
    importProgress,
  } = useProgress();

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTopicFromDashboard = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCurrentTab('patterns');
  };

  const handleSelectQuestionFromSearch = (question: Question) => {
    // Jump to questions tab
    setCurrentTab('questions');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col lg:flex-row antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        solvedCount={progress.solvedQuestions.length}
        streakCount={progress.streak.current}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          searchQuery=""
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              solvedQuestions={progress.solvedQuestions}
              completionDates={progress.completionDates}
              streak={progress.streak}
              onSelectTab={setCurrentTab}
              onSelectTopic={handleSelectTopicFromDashboard}
              onToggleSolved={toggleSolved}
            />
          )}

          {currentTab === 'patterns' && (
            <PatternsView
              solvedQuestions={progress.solvedQuestions}
              difficultQuestions={progress.difficultQuestions}
              personalNotes={progress.personalNotes}
              onToggleSolved={toggleSolved}
              onToggleDifficult={toggleDifficult}
              onSaveNote={saveNote}
              onOpenPatternDetail={setActivePatternDetailId}
              initialTopicId={selectedTopicId}
            />
          )}

          {currentTab === 'questions' && (
            <QuestionsView
              solvedQuestions={progress.solvedQuestions}
              difficultQuestions={progress.difficultQuestions}
              personalNotes={progress.personalNotes}
              onToggleSolved={toggleSolved}
              onToggleDifficult={toggleDifficult}
              onSaveNote={saveNote}
              onOpenPatternDetail={setActivePatternDetailId}
            />
          )}

          {currentTab === 'quick-revision' && (
            <QuickRevisionView
              solvedQuestions={progress.solvedQuestions}
              difficultQuestions={progress.difficultQuestions}
              personalNotes={progress.personalNotes}
              onToggleSolved={toggleSolved}
              onToggleDifficult={toggleDifficult}
              onSaveNote={saveNote}
              onOpenPatternDetail={setActivePatternDetailId}
            />
          )}

          {currentTab === 'revision-mode' && (
            <RevisionModeView
              solvedQuestions={progress.solvedQuestions}
              difficultQuestions={progress.difficultQuestions}
              personalNotes={progress.personalNotes}
              onToggleSolved={toggleSolved}
              onToggleDifficult={toggleDifficult}
              onSaveNote={saveNote}
              onOpenPatternDetail={setActivePatternDetailId}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressAnalyticsView
              solvedQuestions={progress.solvedQuestions}
              completionDates={progress.completionDates}
              streak={progress.streak}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              progress={progress}
              onExport={exportProgress}
              onImport={importProgress}
              onOpenResetModal={() => setIsResetModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        solvedQuestions={progress.solvedQuestions}
        onToggleSolved={toggleSolved}
        onSelectQuestion={handleSelectQuestionFromSearch}
      />

      {/* Pattern Blueprint & Template Modal */}
      <PatternDetailModal
        patternId={activePatternDetailId}
        onClose={() => setActivePatternDetailId(null)}
        solvedQuestions={progress.solvedQuestions}
        onToggleSolved={toggleSolved}
      />

      {/* Global Reset Confirmation Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetAll}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
