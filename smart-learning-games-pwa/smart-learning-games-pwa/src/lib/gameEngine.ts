import type { Question, GameState, GameMode, Language, ClassLevel, Difficulty } from "@/types";
import { getQuestions, getQuestionsByTopic } from "@/data/questions";
import { getStudentProfile, updateStudentProfile, updateProgress, getGameSettings, updateGameSettings, awardStarsAndCoins, checkAndAwardBadges, updateStreak, saveGameSession } from "@/lib/utils";
import type { GameSession } from "@/types";

// Game configuration
export const GAME_CONFIG = {
  POINTS_PER_CORRECT: 10,
  HINT_PENALTY: 2,
  FIRST_ATTEMPT_BONUS: 5,
  PERFECT_SCORE_BONUS: 10,
  MAX_HINTS: 3,
  DEFAULT_QUESTIONS: 10,
  TIME_PER_QUESTION: 30, // seconds
} as const;

// Create a new game state
export function createGameState(
  gameMode: GameMode,
  options: {
    classLevel?: ClassLevel;
    language?: Language;
    difficulty?: Difficulty;
    topic?: string;
    numQuestions?: number;
    timerEnabled?: boolean;
  } = {}
): GameState {
  const settings = getGameSettings();
  const profile = getStudentProfile();
  
  const classLevel = options.classLevel || settings.classLevel || profile.classLevel;
  const language = options.language || settings.language || profile.preferredLanguage;
  const difficulty = options.difficulty || settings.difficulty || "medium";
  const numQuestions = options.numQuestions || GAME_CONFIG.DEFAULT_QUESTIONS;
  const timerEnabled = options.timerEnabled ?? settings.timerEnabled ?? false;
  
  // Get questions
  let questions: Question[];
  if (options.topic) {
    questions = getQuestionsByTopic(gameMode, options.topic, classLevel, language, numQuestions);
  } else {
    questions = getQuestions(gameMode, classLevel, language, numQuestions);
  }
  
  // If not enough questions, repeat some
  if (questions.length < numQuestions) {
    const needed = numQuestions - questions.length;
    const repeated = [...questions].sort(() => Math.random() - 0.5).slice(0, needed);
    questions = [...questions, ...repeated];
  }
  
  // Shuffle questions
  questions = [...questions].sort(() => Math.random() - 0.5);
  
  return {
    id: crypto.randomUUID(),
    gameMode,
    topic: options.topic,
    classLevel,
    language,
    difficulty,
    currentQuestionIndex: 0,
    questions,
    score: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    hintsUsed: 0,
    timeSpent: 0,
    startedAt: Date.now(),
    isPaused: false,
    isCompleted: false,
    selectedAnswers: {},
  };
}

// Get current question
export function getCurrentQuestion(state: GameState): Question | null {
  if (state.currentQuestionIndex >= 0 && state.currentQuestionIndex < state.questions.length) {
    return state.questions[state.currentQuestionIndex];
  }
  return null;
}

// Submit answer
export function submitAnswer(
  state: GameState,
  answer: string | string[],
  useHint: boolean = false
): { isCorrect: boolean; pointsEarned: number; gameState: GameState } {
  const question = getCurrentQuestion(state);
  if (!question) {
    return { isCorrect: false, pointsEarned: 0, gameState: state };
  }
  
  // Check if already answered
  if (state.selectedAnswers[state.currentQuestionIndex] !== undefined) {
    return { isCorrect: false, pointsEarned: 0, gameState: state };
  }
  
  const isCorrect = checkAnswer(question, answer);
  let pointsEarned = 0;
  
  if (isCorrect) {
    pointsEarned = GAME_CONFIG.POINTS_PER_CORRECT;
    // First attempt bonus
    if (!useHint) {
      pointsEarned += GAME_CONFIG.FIRST_ATTEMPT_BONUS;
    }
  } else {
    // Hint penalty
    if (useHint) {
      pointsEarned = -GAME_CONFIG.HINT_PENALTY;
    }
  }
  
  // Update state
  const updatedState = { ...state };
  
  if (useHint) {
    updatedState.hintsUsed += 1;
  }
  
  if (isCorrect) {
    updatedState.correctAnswers += 1;
    updatedState.score += pointsEarned;
  } else {
    updatedState.incorrectAnswers += 1;
    updatedState.score += pointsEarned;
  }
  
  updatedState.selectedAnswers[state.currentQuestionIndex] = answer;
  
  return { isCorrect, pointsEarned, gameState: updatedState };
}

// Check if answer is correct
export function checkAnswer(question: Question, answer: string | string[]): boolean {
  if (Array.isArray(answer)) {
    // For array answers, check if they match
    if (Array.isArray(question.correctAnswer)) {
      return JSON.stringify(answer.sort()) === JSON.stringify(question.correctAnswer.sort());
    }
    return false;
  }
  
  // For single answer
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.includes(answer);
  }
  
  return answer === question.correctAnswer;
}

// Use a hint
export function useHint(state: GameState): { hint: string; gameState: GameState } {
  const question = getCurrentQuestion(state);
  if (!question) {
    return { hint: "", gameState: state };
  }
  
  // Generate hint based on question type
  let hint = "";
  
  if (question.questionType === "multiple_choice") {
    // Eliminate one wrong option
    const correct = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer[0] 
      : question.correctAnswer;
    const wrongOptions = (question.options || []).filter(o => o.id !== correct);
    if (wrongOptions.length > 0) {
      const optionToRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      hint = `Hint: Option "${optionToRemove.text}" is incorrect.`;
    }
  } else if (question.questionType === "true_false") {
    hint = "Hint: Think carefully about the statement.";
  } else {
    hint = question.explanation || "Hint: Review the lesson material.";
  }
  
  // Update state
  const updatedState = { ...state };
  if (state.hintsUsed < GAME_CONFIG.MAX_HINTS) {
    updatedState.hintsUsed += 1;
    updatedState.score -= GAME_CONFIG.HINT_PENALTY;
  }
  
  return { hint, gameState: updatedState };
}

// Move to next question
export function nextQuestion(state: GameState): GameState {
  const updatedState = { ...state };
  updatedState.currentQuestionIndex += 1;
  
  if (updatedState.currentQuestionIndex >= updatedState.questions.length) {
    updatedState.isCompleted = true;
  }
  
  return updatedState;
}

// Skip question
export function skipQuestion(state: GameState): GameState {
  const updatedState = { ...state };
  const currentIndex = updatedState.currentQuestionIndex;
  
  // Mark as incorrect
  updatedState.incorrectAnswers += 1;
  updatedState.selectedAnswers[currentIndex] = "skipped";
  
  // Move to next
  return nextQuestion(updatedState);
}

// Pause game
export function pauseGame(state: GameState): GameState {
  return { ...state, isPaused: true };
}

// Resume game
export function resumeGame(state: GameState): GameState {
  return { ...state, isPaused: false };
}

// Restart game
export function restartGame(state: GameState): GameState {
  return createGameState(
    state.gameMode,
    {
      classLevel: state.classLevel,
      language: state.language,
      difficulty: state.difficulty,
      topic: state.topic,
    }
  );
}

// End game and save results
export function endGame(state: GameState): { summary: GameSummary; gameState: GameState } {
  const updatedState = { ...state, isCompleted: true };
  
  // Calculate final score
  const totalQuestions = updatedState.questions.length;
  const accuracy = totalQuestions > 0 
    ? Math.round((updatedState.correctAnswers / totalQuestions) * 100) 
    : 0;
  
  const isPerfect = updatedState.correctAnswers === totalQuestions && totalQuestions > 0;
  
  // Award stars and coins
  const { stars, coins } = awardStarsAndCoins(
    updatedState.correctAnswers,
    totalQuestions,
    updatedState.hintsUsed
  );
  
  // Check and award badges
  const awardedBadges = checkAndAwardBadges(
    updatedState.gameMode,
    updatedState.score,
    totalQuestions,
    isPerfect
  );
  
  // Update streak
  updateStreak();
  
  // Update progress
  const topic = updatedState.topic || updatedState.gameMode;
  updateProgress(
    updatedState.gameMode,
    topic,
    updatedState.classLevel,
    totalQuestions,
    updatedState.correctAnswers
  );
  
  // Save game session
  const session: GameSession = {
    id: crypto.randomUUID(),
    gameMode: updatedState.gameMode,
    topic,
    classLevel: updatedState.classLevel,
    language: updatedState.language,
    score: updatedState.score,
    correctAnswers: updatedState.correctAnswers,
    totalQuestions,
    timeSpent: updatedState.timeSpent,
    completed: true,
    timestamp: new Date().toISOString(),
  };
  saveGameSession(session);
  
  const summary: GameSummary = {
    gameMode: updatedState.gameMode,
    topic,
    totalQuestions,
    correctAnswers: updatedState.correctAnswers,
    incorrectAnswers: updatedState.incorrectAnswers,
    score: updatedState.score,
    accuracy,
    timeSpent: updatedState.timeSpent,
    hintsUsed: updatedState.hintsUsed,
    starsEarned: stars,
    coinsEarned: coins,
    isPerfect,
    awardedBadges,
  };
  
  return { summary, gameState: updatedState };
}

// Update game timer
export function updateTimer(state: GameState, deltaTime: number): GameState {
  const updatedState = { ...state };
  updatedState.timeSpent += deltaTime;
  return updatedState;
}

// Get game summary without ending
export function getCurrentSummary(state: GameState): GameSummary {
  const totalQuestions = state.questions.length;
  const accuracy = totalQuestions > 0 
    ? Math.round((state.correctAnswers / totalQuestions) * 100) 
    : 0;
  
  return {
    gameMode: state.gameMode,
    topic: state.topic || state.gameMode,
    totalQuestions,
    correctAnswers: state.correctAnswers,
    incorrectAnswers: state.incorrectAnswers,
    score: state.score,
    accuracy,
    timeSpent: state.timeSpent,
    hintsUsed: state.hintsUsed,
    starsEarned: 0,
    coinsEarned: 0,
    isPerfect: false,
    awardedBadges: [],
  };
}

// Game summary type
export interface GameSummary {
  gameMode: GameMode;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  hintsUsed: number;
  starsEarned: number;
  coinsEarned: number;
  isPerfect: boolean;
  awardedBadges: string[];
}

// Get time remaining for current question
export function getTimeRemaining(state: GameState): number {
  if (!getGameSettings().timerEnabled) return 0;
  
  const questionStartTime = state.startedAt + (state.currentQuestionIndex * GAME_CONFIG.TIME_PER_QUESTION * 1000);
  const elapsed = Date.now() - questionStartTime;
  const timeRemaining = Math.max(0, GAME_CONFIG.TIME_PER_QUESTION * 1000 - elapsed);
  
  return Math.floor(timeRemaining / 1000);
}

// Check if time is up for current question
export function isTimeUp(state: GameState): boolean {
  return getTimeRemaining(state) <= 0;
}

// Auto-advance on time up
export function handleTimeUp(state: GameState): GameState {
  if (isTimeUp(state)) {
    // Mark as incorrect
    const updatedState = { ...state };
    updatedState.incorrectAnswers += 1;
    updatedState.selectedAnswers[state.currentQuestionIndex] = "timeout";
    return nextQuestion(updatedState);
  }
  return state;
}
