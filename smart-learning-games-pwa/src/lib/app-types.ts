import type { Difficulty, GameMode } from "./learning-content";
import type { Language } from "./translations";

export const avatarChoices = ["🐻", "🦊", "🐼", "🐰", "🦉", "🐸", "🦄", "🐯"] as const;
export type Avatar = (typeof avatarChoices)[number];
export type BadgeId = "first-game" | "math-star" | "word-wizard" | "science-explorer" | "brain-champion" | "india-explorer" | "careful-thinker" | "seven-day-learner";

export interface SessionRecord {
  id: string;
  mode: GameMode;
  score: number;
  attempted: number;
  correct: number;
  durationSeconds: number;
  completedAt: string;
  assignmentId?: string;
  assignmentTitle?: string;
}

export interface TopicProgress {
  attempted: number;
  correct: number;
}

export interface LearnerStats {
  stars: number;
  coins: number;
  gamesPlayed: number;
  questionsAttempted: number;
  correctAnswers: number;
  practiceSeconds: number;
  streak: number;
  lastPracticeDate: string;
  dailyDate: string;
  dailyPracticeSeconds: number;
  dailyCorrectAnswers: number;
  practiceByDay: Record<string, number>;
  badges: BadgeId[];
  bestScores: Partial<Record<GameMode, number>>;
  modeGames: Record<GameMode, number>;
  recentSessions: SessionRecord[];
  topicStats: Record<string, TopicProgress>;
  missedQuestions: Record<GameMode, string[]>;
}

export interface LearnerProfile {
  id: string;
  name: string;
  classLevel: number;
  language: Language;
  avatar: Avatar;
  dailyTargetMinutes: number;
  darkTheme: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  completedAssignmentIds: string[];
  stats: LearnerStats;
}

export interface CustomQuestion {
  id: string;
  mode: GameMode;
  language: Language;
  classLevel: number;
  topic: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  difficulty: Difficulty;
  createdAt: string;
}

export interface PracticeAssignment {
  id: string;
  title: string;
  mode: GameMode;
  classLevel: number;
  questionCount: number;
  difficulty: Difficulty;
  createdAt: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  classLevel: number;
  createdAt: string;
}

export interface AppData {
  activeLearnerId: string;
  learners: LearnerProfile[];
  assignments: PracticeAssignment[];
  classGroups: ClassGroup[];
  customQuestions: CustomQuestion[];
}

export interface AnswerOutcome {
  id: string;
  topic: string;
  correct: boolean;
}

export interface GameSessionResult {
  mode: GameMode;
  score: number;
  attempted: number;
  correct: number;
  durationSeconds: number;
  outcomes: AnswerOutcome[];
  assignmentId?: string;
  assignmentTitle?: string;
}

export function createEmptyStats(): LearnerStats {
  return {
    stars: 0,
    coins: 0,
    gamesPlayed: 0,
    questionsAttempted: 0,
    correctAnswers: 0,
    practiceSeconds: 0,
    streak: 0,
    lastPracticeDate: "",
    dailyDate: "",
    dailyPracticeSeconds: 0,
    dailyCorrectAnswers: 0,
    practiceByDay: {},
    badges: [],
    bestScores: {},
    modeGames: { math: 0, words: 0, science: 0, brain: 0, india: 0 },
    recentSessions: [],
    topicStats: {},
    missedQuestions: { math: [], words: [], science: [], brain: [], india: [] },
  };
}

export function createLearner(id: string, name = "Learner"): LearnerProfile {
  return {
    id,
    name,
    classLevel: 3,
    language: "en",
    avatar: "🐻",
    dailyTargetMinutes: 10,
    darkTheme: false,
    soundEffects: false,
    reducedMotion: false,
    completedAssignmentIds: [],
    stats: createEmptyStats(),
  };
}

export function createEmptyAppData(): AppData {
  const learner = createLearner("learner-default");
  return {
    activeLearnerId: learner.id,
    learners: [learner],
    assignments: [],
    classGroups: [],
    customQuestions: [],
  };
}
