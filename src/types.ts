export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Priority = 'Core' | 'Extended';

export interface Question {
  id: string; // e.g. "lc-1"
  number: number;
  title: string;
  difficulty: Difficulty;
  topic: string;
  topicId: string;
  pattern: string;
  patternId: string;
  subPattern: string;
  recognition: string;
  technique: string;
  whyImportant: string;
  url: string;
  core: boolean;
  revisionDay: 1 | 2 | 3; // for 3-Day Revision sequence
}

export interface PatternComparison {
  title: string;
  topicA: string;
  topicB: string;
  pointsA: string[];
  pointsB: string[];
}

export interface PatternDetail {
  id: string;
  topicId: string;
  name: string;
  shortDesc: string;
  whenToThink: string;
  variants: string[];
  template: string;
  typicalMistakes: string[];
  comparison?: PatternComparison;
}

export interface TopicMeta {
  id: string;
  letter: string;
  name: string;
  shortName: string;
  description: string;
  revisionDay: 1 | 2 | 3;
}

export interface UserProgress {
  solvedQuestions: string[];
  completionDates: Record<string, string>; // questionId -> ISO date string
  streak: {
    current: number;
    longest: number;
  };
  lastActiveDate: string | null;
  difficultQuestions: string[];
  personalNotes: Record<string, string>;
}

export type ViewTab = 
  | 'dashboard'
  | 'patterns'
  | 'questions'
  | 'quick-revision'
  | 'revision-mode'
  | 'progress'
  | 'settings';
