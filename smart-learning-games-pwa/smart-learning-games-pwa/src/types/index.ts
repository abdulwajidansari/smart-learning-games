// Game modes
export type GameMode = 
  | "math_master"
  | "word_wizard"
  | "science_explorer"
  | "brain_battle"
  | "india_knowledge_quest";

// Languages
export type Language = "urdu" | "hindi" | "marathi" | "english";

// Class levels
export type ClassLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Difficulty levels
export type Difficulty = "easy" | "medium" | "hard";

// Subject types
export type Subject = 
  | "math"
  | "english"
  | "hindi"
  | "marathi"
  | "urdu"
  | "science"
  | "social_studies"
  | "general_knowledge";

// Question types
export type QuestionType = 
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "drag_drop"
  | "fill_blank"
  | "jumbled"
  | "sequence"
  | "memory_match";

// Answer option
export interface AnswerOption {
  id: string;
  text: string;
  image?: string;
  audio?: string;
}

// Question interface
export interface Question {
  id: string;
  gameMode: GameMode;
  subject: Subject;
  classLevel: ClassLevel;
  topic: string;
  language: Language;
  questionType: QuestionType;
  questionText: string;
  image?: string;
  audio?: string;
  options?: AnswerOption[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: Difficulty;
  estimatedTime: number; // seconds
  metadata?: Record<string, unknown>;
}

// Game state
export interface GameState {
  id: string;
  gameMode: GameMode;
  topic?: string;
  classLevel: ClassLevel;
  language: Language;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  timeSpent: number; // seconds
  startedAt: number; // timestamp
  isPaused: boolean;
  isCompleted: boolean;
  selectedAnswers: Record<number, string | string[]>;
}

// Student profile
export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  classLevel: ClassLevel;
  preferredLanguage: Language;
  dailyGoal: number;
  totalStars: number;
  totalCoins: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  createdAt: string;
}

// Progress tracking
export interface ProgressTracking {
  gameMode: GameMode;
  topic: string;
  classLevel: ClassLevel;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  lastPlayed: string;
  completed: boolean;
}

// Game session
export interface GameSession {
  id: string;
  gameMode: GameMode;
  topic?: string;
  classLevel: ClassLevel;
  language: Language;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completed: boolean;
  timestamp: string;
}

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt?: string;
}

// Achievement conditions
export type AchievementCondition = {
  type: "games_played" | "questions_answered" | "correct_streak" | "daily_goal" | "topic_completed" | "accuracy_rate" | "time_spent";
  target: number;
  gameMode?: GameMode;
  topic?: string;
  threshold?: number;
};

// Math Master specific types
export type MathTopic = 
  | "number_recognition"
  | "number_ordering"
  | "comparisons"
  | "place_value"
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "tables"
  | "fractions"
  | "decimals"
  | "factors_multiples"
  | "hcf_lcm"
  | "geometry"
  | "measurements"
  | "square_numbers"
  | "word_problems"
  | "percentages"
  | "ratios";

// Word Wizard specific types
export type WordTopic = 
  | "picture_to_word"
  | "word_meaning"
  | "missing_letter"
  | "jumbled_word"
  | "spelling"
  | "synonyms"
  | "antonyms"
  | "sentence_construction"
  | "grammar"
  | "reading_comprehension";

// Science Explorer specific types
export type ScienceTopic = 
  | "solar_system"
  | "human_body"
  | "plants"
  | "animals"
  | "food_nutrition"
  | "water_cycle"
  | "states_of_matter"
  | "weather_seasons"
  | "environment"
  | "energy"
  | "force_motion"
  | "light"
  | "discoveries";

// Brain Battle specific types
export type BrainTopic = 
  | "memory_match"
  | "pattern_master"
  | "sequence_solver"
  | "logic_detective"
  | "visual_focus";

// India Knowledge Quest specific types
export type IndiaTopic = 
  | "indian_geography"
  | "maharashtra_explorer"
  | "indian_history"
  | "civics_constitution"
  | "general_knowledge";

// All topics union
export type Topic = MathTopic | WordTopic | ScienceTopic | BrainTopic | IndiaTopic;

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  difficulty: Difficulty;
  language: Language;
  classLevel: ClassLevel;
  theme: "light" | "dark";
}

// Navigation items
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

// Chart data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

// Notification
export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: number;
}

// Avatar options
export const AVATARS: string[] = [
  "👦", "👧", "👨‍🏫", "👩‍🏫", "🧑‍🎓", "👨‍🎓", "🤓", "😊",
  "🐶", "🐱", "🐻", "🦁", "🐯", "🐰", "🐸", "🐼", "🦒", "🦓",
  "✨", "🌟", "🎮", "📚", "🧠", "🎯", "🏆", "💡",
];

// Language labels
export const LANGUAGE_LABELS: Record<Language, string> = {
  english: "English",
  hindi: "हिंदी",
  marathi: "मराठी",
  urdu: "اردو",
};

// Class labels
export const CLASS_LABELS: Record<ClassLevel, string> = {
  1: "Class 1",
  2: "Class 2",
  3: "Class 3",
  4: "Class 4",
  5: "Class 5",
  6: "Class 6",
  7: "Class 7",
};

// Game mode labels
export const GAME_MODE_LABELS: Record<GameMode, Record<Language, string>> = {
  math_master: {
    english: "Math Master",
    hindi: "गणित मास्टर",
    marathi: "गणित तज्ज्ञ",
    urdu: "ریاضی ماہر",
  },
  word_wizard: {
    english: "Word Wizard",
    hindi: "शब्द जादूगर",
    marathi: "शब्द जादूगर",
    urdu: "لفظ جادوگر",
  },
  science_explorer: {
    english: "Science Explorer",
    hindi: "विज्ञान अन्वेषक",
    marathi: "विज्ञान शोधक",
    urdu: "سائنس مہم جو",
  },
  brain_battle: {
    english: "Brain Battle",
    hindi: "दिमाग की लड़ाई",
    marathi: "मेळाव",
    urdu: "دماغی جنگ",
  },
  india_knowledge_quest: {
    english: "India Knowledge Quest",
    hindi: "भारत ज्ञान खोज",
    marathi: "भारत ज्ञान शोध",
    urdu: "بھارت علم کی تلاش",
  },
};

// Difficulty labels
export const DIFFICULTY_LABELS: Record<Difficulty, Record<Language, string>> = {
  easy: {
    english: "Easy",
    hindi: "आसान",
    marathi: "सोपे",
    urdu: "آسان",
  },
  medium: {
    english: "Medium",
    hindi: "मध्यम",
    marathi: "मध्यम",
    urdu: "درمیانی",
  },
  hard: {
    english: "Hard",
    hindi: "कठिन",
    marathi: "कठीण",
    urdu: "مشق",
  },
};
