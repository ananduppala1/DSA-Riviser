import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '../types.ts';
import { QUESTIONS, TOPICS } from '../data/curriculum.ts';

const STORAGE_KEY = 'dsa_pattern_vault_progress_v1';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

const DEFAULT_PROGRESS: UserProgress = {
  solvedQuestions: [],
  completionDates: {},
  streak: {
    current: 0,
    longest: 0,
  },
  lastActiveDate: null,
  difficultQuestions: [],
  personalNotes: {},
};

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          streak: parsed.streak || DEFAULT_PROGRESS.streak,
          difficultQuestions: parsed.difficultQuestions || [],
          personalNotes: parsed.personalNotes || {},
        };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to persist progress to localStorage', e);
    }
  }, [progress]);

  const addToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSolved = useCallback((questionId: string) => {
    const targetQ = QUESTIONS.find((q) => q.id === questionId);
    const qTitle = targetQ ? targetQ.title : 'Problem';

    setProgress((prev) => {
      const isAlreadySolved = prev.solvedQuestions.includes(questionId);
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      if (isAlreadySolved) {
        // Mark as unsolved
        const newSolved = prev.solvedQuestions.filter((id) => id !== questionId);
        const newDates = { ...prev.completionDates };
        delete newDates[questionId];

        addToast(`${qTitle} moved back to unsolved`, 'info');

        return {
          ...prev,
          solvedQuestions: newSolved,
          completionDates: newDates,
        };
      } else {
        // Mark as solved
        const newSolved = [...prev.solvedQuestions, questionId];
        const newDates = {
          ...prev.completionDates,
          [questionId]: new Date().toISOString(),
        };

        // Calculate streak
        let currentStreak = prev.streak.current;
        let longestStreak = prev.streak.longest;

        if (prev.lastActiveDate === today) {
          // Already solved something today; streak stays same
        } else if (prev.lastActiveDate === yesterday) {
          // Solved yesterday, increment streak
          currentStreak += 1;
        } else {
          // Streak restart
          currentStreak = 1;
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        addToast(`✓ ${qTitle} completed`, 'success');

        // Check if this action completed an entire topic
        if (targetQ) {
          const topicQuestions = QUESTIONS.filter((q) => q.topicId === targetQ.topicId);
          const allSolvedNow = topicQuestions.every(
            (q) => q.id === questionId || prev.solvedQuestions.includes(q.id)
          );
          if (allSolvedNow) {
            const topicMeta = TOPICS.find((t) => t.id === targetQ.topicId);
            setTimeout(() => {
              addToast(`🔥 ${topicMeta ? topicMeta.name : targetQ.topic} complete!`, 'success');
            }, 600);
          }
        }

        return {
          ...prev,
          solvedQuestions: newSolved,
          completionDates: newDates,
          streak: {
            current: currentStreak,
            longest: longestStreak,
          },
          lastActiveDate: today,
        };
      }
    });
  }, [addToast]);

  const toggleDifficult = useCallback((questionId: string) => {
    setProgress((prev) => {
      const isDiff = prev.difficultQuestions.includes(questionId);
      const targetQ = QUESTIONS.find((q) => q.id === questionId);
      const title = targetQ?.title || 'Problem';

      if (isDiff) {
        addToast(`Removed ${title} from priority review`, 'info');
        return {
          ...prev,
          difficultQuestions: prev.difficultQuestions.filter((id) => id !== questionId),
        };
      } else {
        addToast(`Marked ${title} as difficult (surfaced in Revision Mode)`, 'warning');
        return {
          ...prev,
          difficultQuestions: [...prev.difficultQuestions, questionId],
        };
      }
    });
  }, [addToast]);

  const saveNote = useCallback((questionId: string, noteText: string) => {
    setProgress((prev) => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [questionId]: noteText,
      },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setProgress({
      ...DEFAULT_PROGRESS,
    });
    addToast('Progress reset successfully', 'info');
  }, [addToast]);

  const exportProgress = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa-pattern-vault-progress-${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Progress exported as JSON file', 'success');
  }, [progress, addToast]);

  const importProgress = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON format');
      }

      const importedSolved = Array.isArray(parsed.solvedQuestions)
        ? parsed.solvedQuestions.filter((id: string) => QUESTIONS.some((q) => q.id === id))
        : [];

      const newProgress: UserProgress = {
        solvedQuestions: importedSolved,
        completionDates: parsed.completionDates || {},
        streak: {
          current: typeof parsed.streak?.current === 'number' ? parsed.streak.current : 0,
          longest: typeof parsed.streak?.longest === 'number' ? parsed.streak.longest : 0,
        },
        lastActiveDate: parsed.lastActiveDate || null,
        difficultQuestions: Array.isArray(parsed.difficultQuestions) ? parsed.difficultQuestions : [],
        personalNotes: parsed.personalNotes || {},
      };

      setProgress(newProgress);
      addToast(`Restored ${importedSolved.length} solved problems from backup!`, 'success');
      return true;
    } catch (err) {
      console.error('Failed to import progress', err);
      addToast('Failed to import file. Please check JSON format.', 'warning');
      return false;
    }
  }, [addToast]);

  return {
    progress,
    toasts,
    removeToast,
    toggleSolved,
    toggleDifficult,
    saveNote,
    resetAll,
    exportProgress,
    importProgress,
  };
}
