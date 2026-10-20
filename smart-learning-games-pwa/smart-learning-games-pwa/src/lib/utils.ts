import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language, GameMode, ClassLevel, Difficulty, GameSettings, StudentProfile, ProgressTracking, GameSession, Question } from "@/types";

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// LocalStorage keys
export const STORAGE_KEYS = {
  STUDENT_PROFILE: "smart_learning_student_profile",
  GAME_SETTINGS: "smart_learning_game_settings",
  PROGRESS: "smart_learning_progress",
  SESSIONS: "smart_learning_sessions",
  BADGES: "smart_learning_badges",
  LAST_ACTIVE: "smart_learning_last_active",
  SELECTED_LANGUAGE: "smart_learning_selected_language",
} as const;

// Default student profile
export const DEFAULT_STUDENT: StudentProfile = {
  id: crypto.randomUUID(),
  name: "Student",
  avatar: "👦",
  classLevel: 1,
  preferredLanguage: "english",
  dailyGoal: 10,
  totalStars: 0,
  totalCoins: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString(),
  badges: [],
  createdAt: new Date().toISOString(),
};

// Default game settings
export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  timerEnabled: false,
  difficulty: "medium",
  language: "english",
  classLevel: 1,
  theme: "light",
};

// Badge definitions
export const BADGES = [
  {
    id: "first_game",
    name: "First Game Completed",
    description: "Completed your first game",
    icon: "🏅",
    category: "beginner",
  },
  {
    id: "math_star",
    name: "Math Star",
    description: "Score 100% in Math Master",
    icon: "✨",
    category: "math",
  },
  {
    id: "word_wizard_badge",
    name: "Word Wizard",
    description: "Score 100% in Word Wizard",
    icon: "📖",
    category: "word",
  },
  {
    id: "science_explorer_badge",
    name: "Science Explorer",
    description: "Score 100% in Science Explorer",
    icon: "🔬",
    category: "science",
  },
  {
    id: "brain_champion",
    name: "Brain Champion",
    description: "Score 100% in Brain Battle",
    icon: "🧠",
    category: "brain",
  },
  {
    id: "india_expert",
    name: "India Expert",
    description: "Score 100% in India Knowledge Quest",
    icon: "🇮🇳",
    category: "india",
  },
  {
    id: "seven_day_learner",
    name: "Seven-Day Learner",
    description: "Practice for 7 consecutive days",
    icon: "📅",
    category: "streak",
  },
  {
    id: "accuracy_champion",
    name: "Accuracy Champion",
    description: "Achieve 95% accuracy in any game mode",
    icon: "🎯",
    category: "accuracy",
  },
  {
    id: "games_master",
    name: "Games Master",
    description: "Play all 5 game modes",
    icon: "🎮",
    category: "completion",
  },
  {
    id: "daily_goal_achiever",
    name: "Daily Goal Achiever",
    description: "Complete daily learning goal",
    icon: "⭐",
    category: "daily",
  },
] as const;

// ============================================
// LocalStorage Utilities
// ============================================

// Save to localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, serialized);
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Load from localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

// Remove from localStorage
export function removeFromStorage(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// Clear all localStorage
export function clearAllStorage(): void {
  try {
    if (typeof window !== "undefined") {
      Object.keys(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// ============================================
// Student Profile Utilities
// ============================================

// Get current student profile
export function getStudentProfile(): StudentProfile {
  return loadFromStorage(STORAGE_KEYS.STUDENT_PROFILE, DEFAULT_STUDENT);
}

// Save student profile
export function saveStudentProfile(profile: StudentProfile): void {
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILE, profile);
}

// Update student profile
export function updateStudentProfile(updates: Partial<StudentProfile>): StudentProfile {
  const current = getStudentProfile();
  const updated = { ...current, ...updates };
  saveStudentProfile(updated);
  return updated;
}

// Create new student profile
export function createStudentProfile(name: string, classLevel: ClassLevel, language: Language, avatar: string): StudentProfile {
  const profile: StudentProfile = {
    id: crypto.randomUUID(),
    name,
    avatar,
    classLevel,
    preferredLanguage: language,
    dailyGoal: 10,
    totalStars: 0,
    totalCoins: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    badges: [],
    createdAt: new Date().toISOString(),
  };
  saveStudentProfile(profile);
  return profile;
}

// ============================================
// Game Settings Utilities
// ============================================

// Get game settings
export function getGameSettings(): GameSettings {
  return loadFromStorage(STORAGE_KEYS.GAME_SETTINGS, DEFAULT_SETTINGS);
}

// Save game settings
export function saveGameSettings(settings: GameSettings): void {
  saveToStorage(STORAGE_KEYS.GAME_SETTINGS, settings);
}

// Update game settings
export function updateGameSettings(updates: Partial<GameSettings>): GameSettings {
  const current = getGameSettings();
  const updated = { ...current, ...updates };
  saveGameSettings(updated);
  return updated;
}

// ============================================
// Progress Tracking Utilities
// ============================================

// Get all progress
export function getAllProgress(): ProgressTracking[] {
  return loadFromStorage(STORAGE_KEYS.PROGRESS, []);
}

// Save all progress
export function saveAllProgress(progress: ProgressTracking[]): void {
  saveToStorage(STORAGE_KEYS.PROGRESS, progress);
}

// Get progress for a specific game mode and topic
export function getProgress(gameMode: GameMode, topic: string): ProgressTracking | null {
  const allProgress = getAllProgress();
  return allProgress.find(
    p => p.gameMode === gameMode && p.topic === topic
  ) || null;
}

// Update or create progress
export function updateProgress(
  gameMode: GameMode,
  topic: string,
  classLevel: ClassLevel,
  questionsAttempted: number = 0,
  correctAnswers: number = 0
): ProgressTracking {
  const allProgress = getAllProgress();
  
  const existingIndex = allProgress.findIndex(
    p => p.gameMode === gameMode && p.topic === topic
  );
  
  const newProgress: ProgressTracking = {
    gameMode,
    topic,
    classLevel,
    questionsAttempted,
    correctAnswers,
    accuracy: questionsAttempted > 0 ? Math.round((correctAnswers / questionsAttempted) * 100) : 0,
    lastPlayed: new Date().toISOString(),
    completed: questionsAttempted >= 10 && correctAnswers >= 8,
  };
  
  if (existingIndex >= 0) {
    const existing = allProgress[existingIndex];
    allProgress[existingIndex] = {
      ...existing,
      ...newProgress,
      questionsAttempted: existing.questionsAttempted + questionsAttempted,
      correctAnswers: existing.correctAnswers + correctAnswers,
      accuracy: existing.questionsAttempted + questionsAttempted > 0
        ? Math.round(((existing.correctAnswers + correctAnswers) / (existing.questionsAttempted + questionsAttempted)) * 100)
        : 0,
    };
  } else {
    allProgress.push(newProgress);
  }
  
  saveAllProgress(allProgress);
  return allProgress.find(p => p.gameMode === gameMode && p.topic === topic) || newProgress;
}

// ============================================
// Game Session Utilities
// ============================================

// Get all sessions
export function getAllSessions(): GameSession[] {
  return loadFromStorage(STORAGE_KEYS.SESSIONS, []);
}

// Save all sessions
export function saveAllSessions(sessions: GameSession[]): void {
  saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
}

// Save a game session
export function saveGameSession(session: GameSession): void {
  const allSessions = getAllSessions();
  allSessions.push(session);
  saveAllSessions(allSessions);
}

// Get recent sessions
export function getRecentSessions(limit: number = 5): GameSession[] {
  const allSessions = getAllSessions();
  return allSessions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// ============================================
// Reward System Utilities
// ============================================

// Get student badges
export function getStudentBadges(): string[] {
  return loadFromStorage(STORAGE_KEYS.BADGES, []);
}

// Save student badges
export function saveStudentBadges(badges: string[]): void {
  saveToStorage(STORAGE_KEYS.BADGES, badges);
}

// Add a badge if not already earned
export function addBadge(badgeId: string): boolean {
  const badges = getStudentBadges();
  if (!badges.includes(badgeId)) {
    badges.push(badgeId);
    saveStudentBadges(badges);
    return true;
  }
  return false;
}

// Check and award badges based on achievements
export function checkAndAwardBadges(
  gameMode: GameMode,
  score: number,
  totalQuestions: number,
  isPerfect: boolean
): string[] {
  const profile = getStudentProfile();
  const badges = getStudentBadges();
  const awarded: string[] = [];
  
  // First game completed
  if (!badges.includes("first_game") && totalQuestions > 0) {
    addBadge("first_game");
    awarded.push("first_game");
  }
  
  // Perfect score badges
  if (isPerfect) {
    const badgeMap: Record<GameMode, string> = {
      math_master: "math_star",
      word_wizard: "word_wizard_badge",
      science_explorer: "science_explorer_badge",
      brain_battle: "brain_champion",
      india_knowledge_quest: "india_expert",
    };
    const badgeId = badgeMap[gameMode];
    if (badgeId && !badges.includes(badgeId)) {
      addBadge(badgeId);
      awarded.push(badgeId);
    }
  }
  
  // Accuracy champion (95%+)
  if (totalQuestions > 0 && score / totalQuestions >= 0.95 && !badges.includes("accuracy_champion")) {
    addBadge("accuracy_champion");
    awarded.push("accuracy_champion");
  }
  
  // Daily goal achiever
  const today = new Date().toDateString();
  const lastActive = new Date(profile.lastActiveDate).toDateString();
  if (today === lastActive && score >= profile.dailyGoal * 10 && !badges.includes("daily_goal_achiever")) {
    addBadge("daily_goal_achiever");
    awarded.push("daily_goal_achiever");
  }
  
  return awarded;
}

// ============================================
// Streak Utilities
// ============================================

// Update streak
export function updateStreak(): void {
  const profile = getStudentProfile();
  const today = new Date().toDateString();
  const lastActive = new Date(profile.lastActiveDate).toDateString();
  
  let newStreak = profile.streak;
  
  if (today !== lastActive) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastActive === yesterdayStr) {
      newStreak = profile.streak + 1;
    } else if (lastActive !== today) {
      newStreak = 1;
    }
  }
  
  updateStudentProfile({
    streak: newStreak,
    lastActiveDate: new Date().toISOString(),
  });
}

// ============================================
// Star and Coin System
// ============================================

// Award stars and coins based on game results
export function awardStarsAndCoins(
  correctAnswers: number,
  totalQuestions: number,
  hintsUsed: number = 0
): { stars: number; coins: number } {
  const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
  
  let stars = 0;
  let coins = 0;
  
  if (accuracy >= 0.9) {
    stars = 3;
  } else if (accuracy >= 0.7) {
    stars = 2;
  } else if (accuracy >= 0.5) {
    stars = 1;
  }
  
  coins = correctAnswers * 10 - hintsUsed * 2;
  coins = Math.max(0, coins);
  
  const profile = getStudentProfile();
  updateStudentProfile({
    totalStars: profile.totalStars + stars,
    totalCoins: profile.totalCoins + coins,
  });
  
  return { stars, coins };
}

// ============================================
// Game Utilities
// ============================================

// Calculate score
export function calculateScore(
  correctAnswers: number,
  totalQuestions: number,
  hintsUsed: number = 0
): number {
  const basePoints = correctAnswers * 10;
  const hintPenalty = hintsUsed * 2;
  return Math.max(0, basePoints - hintPenalty);
}

// Format time
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get difficulty color
export function getDifficultyColor(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    easy: "text-green-600 bg-green-100",
    medium: "text-yellow-600 bg-yellow-100",
    hard: "text-red-600 bg-red-100",
  };
  return colors[difficulty];
}

// Get RTL direction for language
export function isRTL(language: Language): boolean {
  return language === "urdu";
}

// Get text alignment for language
export function getTextAlign(language: Language): string {
  return isRTL(language) ? "text-right" : "text-left";
}

// Get direction class for language
export function getDirClass(language: Language): string {
  return isRTL(language) ? "rtl" : "ltr";
}

// ============================================
// Translation Utilities
// ============================================

// Simple translation dictionary
export const translations: Record<Language, Record<string, string>> = {
  english: {
    home: "Home",
    games: "Games",
    profile: "Profile",
    settings: "Settings",
    teacher: "Teacher",
    play: "Play",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    restart: "Restart",
    exit: "Exit",
    next: "Next",
    submit: "Submit",
    correct: "Correct!",
    incorrect: "Incorrect",
    well_done: "Well done!",
    try_again: "Try again",
    score: "Score",
    time: "Time",
    level: "Level",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    select_class: "Select Class",
    select_language: "Select Language",
    select_difficulty: "Select Difficulty",
    daily_goal: "Daily Goal",
    total_stars: "Total Stars",
    streak: "Streak",
    badges: "Badges",
    progress: "Progress",
    history: "History",
    achievements: "Achievements",
    continue_playing: "Continue Playing",
    recent_games: "Recent Games",
    learning_summary: "Learning Summary",
    save: "Save",
    cancel: "Cancel",
    yes: "Yes",
    no: "No",
    back: "Back",
    loading: "Loading...",
    no_data: "No data available",
    offline: "Offline",
    online: "Online",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    sound_on: "Sound On",
    sound_off: "Sound Off",
    timer_on: "Timer On",
    timer_off: "Timer Off",
    help: "Help",
    about: "About",
    version: "Version",
    welcome: "Welcome",
    select_student: "Select Student",
    create_profile: "Create Profile",
    edit_profile: "Edit Profile",
    delete_profile: "Delete Profile",
    confirm_delete: "Are you sure you want to delete this profile?",
    name: "Name",
    avatar: "Avatar",
    class: "Class",
    language: "Language",
    daily_target: "Daily Target",
    total_questions: "Total Questions",
    accuracy: "Accuracy",
    game_over: "Game Over",
    summary: "Summary",
    play_again: "Play Again",
    choose_topic: "Choose Topic",
    all_topics: "All Topics",
    hint: "Hint",
    hints_remaining: "Hints remaining",
    skip: "Skip",
    finish: "Finish",
    congratulations: "Congratulations!",
    you_won: "You won!",
    new_record: "New Record!",
    share: "Share",
    print: "Print",
    export_data: "Export",
    import_data: "Import",
    manage_questions: "Manage Questions",
    add_question: "Add Question",
    edit_question: "Edit Question",
    delete_question: "Delete Question",
    question_bank: "Question Bank",
    reports: "Reports",
    class_progress: "Class Progress",
    student_progress: "Student Progress",
    assign_game: "Assign Game",
    view_results: "View Results",
    login: "Login",
    logout: "Logout",
    username: "Username",
    password: "Password",
    teacher_dashboard: "Teacher Dashboard",
    my_classes: "My Classes",
    add_class: "Add Class",
    add_student: "Add Student",
    manage_students: "Manage Students",
  },
  hindi: {
    home: "होम",
    games: "गेम",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    teacher: "टीचर",
    play: "खेलें",
    start: "शुरू करें",
    pause: "रोकें",
    resume: "जारी रखें",
    restart: "दोबारा शुरू करें",
    exit: "बाहर जाएं",
    next: "अगला",
    submit: "जमा करें",
    correct: "सही!",
    incorrect: "गलत",
    well_done: "बहुत अच्छा!",
    try_again: "दोबारा कोशिश करें",
    score: "स्कोर",
    time: "समय",
    level: "स्तर",
    difficulty: "कठिनाई",
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",
    select_class: "कक्षा चुनें",
    select_language: "भाषा चुनें",
    select_difficulty: "कठिनाई चुनें",
    daily_goal: "दैनिक लक्ष्य",
    total_stars: "कुल स्टार",
    streak: "लगातार दिन",
    badges: "बैज",
    progress: "प्रगति",
    history: "इतिहास",
    achievements: "उपलब्धियाँ",
    continue_playing: "खेलना जारी रखें",
    recent_games: "हाल के गेम",
    learning_summary: "सीखने का सारांश",
    save: "सहेज",
    cancel: "रद्द करें",
    yes: "हाँ",
    no: "नहीं",
    back: "पिछला",
    loading: "लोड हो रहा है...",
    no_data: "डेटा उपलब्ध नहीं",
    offline: "ऑफलाइन",
    online: "ऑनलाइन",
    dark_mode: "डार्क मोड",
    light_mode: "लाइट मोड",
    sound_on: "आवाज चालू",
    sound_off: "आवाज बंद",
    timer_on: "टाइमर चालू",
    timer_off: "टाइमर बंद",
    help: "मदद",
    about: "बारे में",
    version: "संस्करण",
    welcome: "स्वागत है",
    select_student: "विद्यार्थी चुनें",
    create_profile: "प्रोफाइल बनाएं",
    edit_profile: "प्रोफाइल संपादित करें",
    delete_profile: "प्रोफाइल हटाएं",
    confirm_delete: "क्या आप वाकई इस प्रोफाइल को हटाना चाहते हैं?",
    name: "नाम",
    avatar: "अवतार",
    class: "कक्षा",
    language: "भाषा",
    daily_target: "दैनिक लक्ष्य",
    total_questions: "कुल प्रश्न",
    accuracy: "सटीकता",
    game_over: "गेम खत्म",
    summary: "सारांश",
    play_again: "दोबारा खेलें",
    choose_topic: "विषय चुनें",
    all_topics: "सभी विषय",
    hint: "संकेत",
    hints_remaining: "संकेत शेष",
    skip: "छोड़ें",
    finish: "खत्म करें",
    congratulations: "बधाई हो!",
    you_won: "आप जीत गए!",
    new_record: "नया रिकॉर्ड!",
    share: "साझा करें",
    print: "प्रिंट करें",
    export_data: "निर्यात करें",
    import_data: "आयात करें",
    manage_questions: "प्रश्न प्रबंधित करें",
    add_question: "प्रश्न जोड़ें",
    edit_question: "प्रश्न संपादित करें",
    delete_question: "प्रश्न हटाएं",
    question_bank: "प्रश्न बैंक",
    reports: "रिपोर्ट",
    class_progress: "कक्षा प्रगति",
    student_progress: "विद्यार्थी प्रगति",
    assign_game: "गेम असाइन करें",
    view_results: "परिणाम देखें",
    login: "लॉगिन",
    logout: "लॉगआउट",
    username: "यूजरनेम",
    password: "पासवर्ड",
    teacher_dashboard: "टीचर डैशबोर्ड",
    my_classes: "मेरी कक्षाएं",
    add_class: "कक्षा जोड़ें",
    add_student: "विद्यार्थी जोड़ें",
    manage_students: "विद्यार्थी प्रबंधित करें",
  },
  marathi: {
    home: "होम",
    games: "खेळ",
    profile: "प्रोफाइल",
    settings: "सेटिंग्ज",
    teacher: "शिक्षक",
    play: "खेळा",
    start: "सुरू करा",
    pause: "थांबवा",
    resume: "पुन्हा सुरू करा",
    restart: "पुन्हा सुरू करा",
    exit: "बाहेर पडा",
    next: "पुढे",
    submit: "सबमिट करा",
    correct: "बरोबर!",
    incorrect: "चूक",
    well_done: "चांगले केले!",
    try_again: "पुन्हा प्रयत्न करा",
    score: "गुण",
    time: "वेळ",
    level: "पातळी",
    difficulty: "अवघडपणा",
    easy: "सोपे",
    medium: "मध्यम",
    hard: "अवघड",
    select_class: "इयत्ता निवडा",
    select_language: "भाषा निवडा",
    select_difficulty: "अवघडपणा निवडा",
    daily_goal: "दैनिक लक्ष्य",
    total_stars: "एकूण स्टार",
    streak: "सलग दिवस",
    badges: "बॅज",
    progress: "प्रगती",
    history: "इतिहास",
    achievements: "साधने",
    continue_playing: "खेळ खेळत रहा",
    recent_games: "अलीकडील खेळ",
    learning_summary: "शिकण्याचा सारांश",
    save: "जतन करा",
    cancel: "रद्द करा",
    yes: "होय",
    no: "नाही",
    back: "मागे",
    loading: "लोड होत आहे...",
    no_data: "डेटा उपलब्ध नाही",
    offline: "ऑफलाइन",
    online: "ऑनलाइन",
    dark_mode: "डार्क मोड",
    light_mode: "लाइट मोड",
    sound_on: "आवाज चालू",
    sound_off: "आवाज बंद",
    timer_on: "टायमर चालू",
    timer_off: "टायमर बंद",
    help: "मदत",
    about: "विषयी",
    version: "आवृत्ती",
    welcome: "स्वागत आहे",
    select_student: "विद्यार्थी निवडा",
    create_profile: "प्रोफाइल तयार करा",
    edit_profile: "प्रोफाइल संपादित करा",
    delete_profile: "प्रोफाइल काढून टाका",
    confirm_delete: "तुम्ही खरोखर हा प्रोफाइल काढून टाकू इच्छिता का?",
    name: "नाव",
    avatar: "अवतार",
    class: "इयत्ता",
    language: "भाषा",
    daily_target: "दैनिक लक्ष्य",
    total_questions: "एकूण प्रश्न",
    accuracy: "अचूकता",
    game_over: "खेळ संपला",
    summary: "सारांश",
    play_again: "पुन्हा खेळा",
    choose_topic: "विषय निवडा",
    all_topics: "सर्व विषय",
    hint: "सूचना",
    hints_remaining: "सूचना शिल्लक",
    skip: "वगळा",
    finish: "संपादा",
    congratulations: "अभिनंदन!",
    you_won: "तुम्ही जिंकला!",
    new_record: "नवीन विक्रम!",
    share: "शेअर करा",
    print: "प्रिंट करा",
    export_data: "निर्यात करा",
    import_data: "आयात करा",
    manage_questions: "प्रश्न व्यवस्थापित करा",
    add_question: "प्रश्न जोडा",
    edit_question: "प्रश्न संपादित करा",
    delete_question: "प्रश्न काढून टाका",
    question_bank: "प्रश्न बँक",
    reports: "अहवाल",
    class_progress: "इयत्तेची प्रगती",
    student_progress: "विद्यार्थी प्रगती",
    assign_game: "खेळ नियुक्त करा",
    view_results: "निकाल पहा",
    login: "लॉगिन",
    logout: "लॉगआउट",
    username: "युझरनेम",
    password: "पासवर्ड",
    teacher_dashboard: "शिक्षक डॅशबोर्ड",
    my_classes: "माझ्या इयत्ता",
    add_class: "इयत्ता जोडा",
    add_student: "विद्यार्थी जोडा",
    manage_students: "विद्यार्थी व्यवस्थापित करा",
  },
  urdu: {
    home: "ہوم",
    games: "گیمز",
    profile: "پروفائل",
    settings: "سیٹنگز",
    teacher: "استاد",
    play: "کھیلیں",
    start: "شروع کریں",
    pause: "روکیں",
    resume: "دوبارہ شروع کریں",
    restart: "دوبارہ شروع کریں",
    exit: "نکل جائیں",
    next: "اگلا",
    submit: "جمع کرائیں",
    correct: "درست!",
    incorrect: "غلط",
    well_done: "بہت اچھی!",
    try_again: "دوبارہ کوشش کریں",
    score: "اسکور",
    time: "وقت",
    level: "لیول",
    difficulty: "مشکل",
    easy: "آسان",
    medium: "درمیانی",
    hard: "مشق",
    select_class: "کلاس منتخب کریں",
    select_language: "زبان منتخب کریں",
    select_difficulty: "مشکل منتخب کریں",
    daily_goal: "روزانہ ہدف",
    total_stars: "کل ستارے",
    streak: "لسانی دن",
    badges: "بیج",
    progress: "ترقی",
    history: "تاریخ",
    achievements: "کامیابیاں",
    continue_playing: "کھیلنا جاری رکھیں",
    recent_games: "حالیہ گیمز",
    learning_summary: "سیکھنے کا خلاصہ",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    yes: "ہاں",
    no: "نہیں",
    back: "پیچھے",
    loading: "لوڈ ہو رہا ہے...",
    no_data: "ڈیٹا دستیاب نہیں",
    offline: "آفلائن",
    online: "آن لائن",
    dark_mode: "ڈارک موڈ",
    light_mode: "لائٹ موڈ",
    sound_on: "آواز آن",
    sound_off: "آواز آف",
    timer_on: "ٹائمر آن",
    timer_off: "ٹائمر آف",
    help: "مدد",
    about: "بارے میں",
    version: "ورژن",
    welcome: "خوش آمدید",
    select_student: "طالب علم منتخب کریں",
    create_profile: "پروفائل بنائیں",
    edit_profile: "پروفائل میں ترمیم کریں",
    delete_profile: "پروفائل حذف کریں",
    confirm_delete: "کیا آپ واقعی اس پروفائل کو حذف کرنا چاہتے ہیں؟",
    name: "نام",
    avatar: "اوٹار",
    class: "کلاس",
    language: "زبان",
    daily_target: "روزانہ ہدف",
    total_questions: "کل سوال",
    accuracy: "درستی",
    game_over: "گیم ختم",
    summary: "خلاصہ",
    play_again: "دوبارہ کھیلیں",
    choose_topic: "موضوع منتخب کریں",
    all_topics: "تمام موضوعات",
    hint: "اشارہ",
    hints_remaining: "اشارے باقی",
    skip: "چھوڑ دیں",
    finish: "ختم کریں",
    congratulations: "مبارک ہو!",
    you_won: "آپ جیت گئے!",
    new_record: "نیا ریکارڈ!",
    share: "شئیر کریں",
    print: "پرنٹ کریں",
    export_data: "برآمد کریں",
    import_data: "درآمد کریں",
    manage_questions: "سوالات کا انتظام کریں",
    add_question: "سوال شامل کریں",
    edit_question: "سوال میں ترمیم کریں",
    delete_question: "سوال حذف کریں",
    question_bank: "سوال بنک",
    reports: "رپورٹس",
    class_progress: "کلاس کی ترقی",
    student_progress: "طالب علم کی ترقی",
    assign_game: "گیم تفویض کریں",
    view_results: "نتائج دیکھیں",
    login: "لاگ ان",
    logout: "لاگ آؤٹ",
    username: "صارف نام",
    password: "پاس ورڈ",
    teacher_dashboard: "استاد ڈیش بورڈ",
    my_classes: "میری کلاسز",
    add_class: "کلاس شامل کریں",
    add_student: "طالب علم شامل کریں",
    manage_students: "طالب علم کا انتظام کریں",
  },
};

// Translate function
export function t(key: string, language: Language): string {
  const lang = translations[language] || translations.english;
  return lang[key] || key;
}

// Get translation for current language
export function useTranslation(language: Language) {
  return (key: string): string => t(key, language);
}

// ============================================
// Speech Synthesis Utilities
// ============================================

// Speak text using browser's speech synthesis
export function speak(text: string, language: Language, rate: number = 1): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const langMap: Record<Language, string> = {
      english: "en-US",
      hindi: "hi-IN",
      marathi: "mr-IN",
      urdu: "ur-PK",
    };
    
    utterance.lang = langMap[language] || "en-US";
    utterance.rate = rate;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(langMap[language] || "en")
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
}

// Stop speech
export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// ============================================
// Validation Utilities
// ============================================

// Validate name
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 20;
}

// Validate question
export function isValidQuestion(question: Partial<Question>): string[] {
  const errors: string[] = [];
  
  if (!question.questionText || question.questionText.trim().length === 0) {
    errors.push("Question text is required");
  }
  
  if (!question.correctAnswer || question.correctAnswer.toString().trim().length === 0) {
    errors.push("Correct answer is required");
  }
  
  if (question.questionType === "multiple_choice" && (!question.options || question.options.length < 2)) {
    errors.push("At least 2 options are required for multiple choice");
  }
  
  if (question.estimatedTime && (question.estimatedTime < 5 || question.estimatedTime > 300)) {
    errors.push("Estimated time should be between 5 and 300 seconds");
  }
  
  return errors;
}
