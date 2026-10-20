"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  BookOpen, Brain, Globe, Calculator, Trophy, 
  Play, Pause, Lightbulb, RotateCcw, Check, X, 
  ArrowLeft, Clock, Star as StarIcon, Flame, Home
} from "lucide-react";
import { 
  createGameState, getCurrentQuestion, submitAnswer, 
  useHint, nextQuestion, skipQuestion, endGame, 
  GAME_CONFIG
} from "@/lib/gameEngine";
import { 
  getStudentProfile, getGameSettings, updateGameSettings, 
  loadFromStorage, formatTime
} from "@/lib/utils";
import type { GameState, GameMode, Language, ClassLevel, Difficulty, StudentProfile } from "@/types";
import { getTopicsForGameMode, getQuestionsByTopic } from "@/data/questions";
import { GAME_MODE_LABELS, CLASS_LABELS, LANGUAGE_LABELS } from "@/types";

// Game icons map
const GAME_ICONS: Record<GameMode, React.ReactNode> = {
  math_master: <Calculator className="w-7 h-7 text-purple-600" />,
  word_wizard: <BookOpen className="w-7 h-7 text-green-600" />,
  science_explorer: <Globe className="w-7 h-7 text-orange-600" />,
  brain_battle: <Brain className="w-7 h-7 text-pink-600" />,
  india_knowledge_quest: <Trophy className="w-7 h-7 text-indigo-600" />,
};

// Game color map
const GAME_COLORS: Record<GameMode, string> = {
  math_master: "purple",
  word_wizard: "green",
  science_explorer: "orange",
  brain_battle: "pink",
  india_knowledge_quest: "indigo",
};

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameMode = params.gameMode as GameMode;
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [gameSummary, setGameSummary] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("english");
  const [showTopicSelection, setShowTopicSelection] = useState(true);
  
  useEffect(() => {
    const loadedProfile = getStudentProfile();
    const loadedSettings = getGameSettings();
    
    setProfile(loadedProfile);
    setSettings(loadedSettings);
    setLanguage(loadedProfile.preferredLanguage);
  }, []);
  
  // Start game
  const startGame = useCallback((topic: string | null = null) => {
    const classLevel = profile?.classLevel || 1;
    const lang = profile?.preferredLanguage || language;
    const diff = settings?.difficulty || "medium";
    
    const state = createGameState(gameMode, {
      classLevel: classLevel as ClassLevel,
      language: lang,
      difficulty: diff as Difficulty,
      topic: topic || undefined,
      numQuestions: 10,
      timerEnabled: settings?.timerEnabled || false,
    });
    
    setGameState(state);
    setShowTopicSelection(false);
  }, [gameMode, profile, language, settings]);
  
  // Handle answer submission
  const handleSubmitAnswer = useCallback((answer: string | string[]) => {
    if (!gameState) return;
    
    const result = submitAnswer(gameState, answer);
    setGameState(result.gameState);
  }, [gameState]);
  
  // Handle hint
  const handleUseHint = useCallback(() => {
    if (!gameState) return;
    
    const result = useHint(gameState);
    setGameState(result.gameState);
  }, [gameState]);
  
  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (!gameState) return;
    
    const newState = nextQuestion(gameState);
    setGameState(newState);
  }, [gameState]);
  
  // Handle skip
  const handleSkipQuestion = useCallback(() => {
    if (!gameState) return;
    
    const newState = skipQuestion(gameState);
    setGameState(newState);
  }, [gameState]);
  
  // Handle end game
  const handleEndGame = useCallback(() => {
    if (!gameState) return;
    
    const result = endGame(gameState);
    setGameSummary(result.summary);
    setGameState(null);
    setShowTopicSelection(false);
  }, [gameState]);
  
  // Handle play again
  const handlePlayAgain = useCallback(() => {
    startGame(selectedTopic);
    setGameSummary(null);
  }, [startGame, selectedTopic]);
  
  // Handle exit
  const handleExit = useCallback(() => {
    router.push("/games");
  }, [router]);
  
  // Handle back to topics
  const handleBackToTopics = useCallback(() => {
    setGameState(null);
    setGameSummary(null);
    setShowTopicSelection(true);
  }, []);
  
  if (!profile || !gameMode) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500" />
      </div>
    );
  }
  
  // Check if game mode is valid
  const validGameModes: GameMode[] = [
    "math_master", "word_wizard", "science_explorer", "brain_battle", "india_knowledge_quest"
  ];
  
  if (!validGameModes.includes(gameMode)) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Game Not Found</h2>
          <p className="text-gray-600 mt-2">This game mode doesn't exist</p>
          <button 
            onClick={handleExit}
            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }
  
  // Show topic selection
  if (!gameState && !gameSummary && showTopicSelection) {
    const topics = getTopicsForGameMode(gameMode);
    const gameLabel = GAME_MODE_LABELS[gameMode][language] || GAME_MODE_LABELS[gameMode].english;
    const color = GAME_COLORS[gameMode];
    
    return (
      <div className="min-h-[500px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {GAME_ICONS[gameMode]}
            {gameLabel}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === "hindi" ? "विषय चुनें" : 
             language === "marathi" ? "विषय निवडा" :
             language === "urdu" ? "موضوع منتخب کریں" : "Select a topic"}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button 
            onClick={() => startGame(null)}
            className={`p-4 rounded-xl border-2 hover:shadow-lg transition-all text-left ${
              `bg-${color}-50 border-${color}-200 hover:bg-${color}-100`
            }`}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-gray-800">
              {language === "hindi" ? "सभी विषय" : 
               language === "marathi" ? "सर्व विषय" :
               language === "urdu" ? "تمام موضوعات" : "All Topics"}
            </div>
            <div className="text-sm text-gray-500">Mixed questions</div>
          </button>
          
          {topics.slice(0, 5).map(topic => {
            // Extract emoji or use default
            const topicEmojis: Record<string, string> = {
              number_recognition: "123",
              number_ordering: "🔢",
              comparisons: "⚖️",
              place_value: "📊",
              addition: "➕",
              subtraction: "➖",
              multiplication: "✖️",
              division: "➗",
              tables: "📋",
              fractions: "½",
              decimals: "0.5",
              solar_system: "🪐",
              human_body: "🧠",
              plants: "🌱",
              animals: "🐘",
              food_nutrition: "🍎",
              memory_match: "🧩",
              pattern_master: "🔄",
              sequence_solver: "📈",
              logic_detective: "🔍",
              visual_focus: "👁️",
              indian_geography: "🗺️",
              maharashtra_explorer: "🏯",
              indian_history: "🏛️",
              civics_constitution: "📜",
              general_knowledge: "💡",
            };
            
            const emoji = topicEmojis[topic] || "📚";
            const displayName = topic.replace(/_/g, " ");
            
            return (
              <button 
                key={topic}
                onClick={() => startGame(topic)}
                className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:bg-gray-100 hover:border-purple-200 transition-colors text-left"
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="font-medium text-gray-800 capitalize">{displayName}</div>
                <div className="text-sm text-gray-500">{topic}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  // Show game
  if (gameState && !gameSummary) {
    const question = getCurrentQuestion(gameState);
    const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
    const [showFeedback, setShowFeedback] = useState<{ isCorrect: boolean } | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.TIME_PER_QUESTION);
    
    useEffect(() => {
      if (settings?.timerEnabled && !gameState.isPaused) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              handleSkipQuestion();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }, [settings?.timerEnabled, gameState.isPaused, handleSkipQuestion]);
    
    useEffect(() => {
      if (question) {
        setSelectedAnswer(null);
        setShowFeedback(null);
        setTimeLeft(GAME_CONFIG.TIME_PER_QUESTION);
      }
    }, [question, gameState.currentQuestionIndex]);
    
    const handleSelectAnswer = (answer: string | string[]) => {
      setSelectedAnswer(answer);
    };
    
    const handleConfirmAnswer = () => {
      if (selectedAnswer !== null) {
        handleSubmitAnswer(selectedAnswer);
        setShowFeedback({ isCorrect: true });
      }
    };
    
    if (!question) {
      return (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="text-center bg-white rounded-xl shadow-lg p-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Over!</h2>
            <p className="text-gray-600">No more questions</p>
            <button 
              onClick={handleEndGame}
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              Finish Game
            </button>
          </div>
        </div>
      );
    }
    
    const isMultipleChoice = question.questionType === "multiple_choice" || question.questionType === "true_false";
    const isSequence = question.questionType === "sequence";
    const isJumbled = question.questionType === "jumbled";
    const isMemoryMatch = question.questionType === "memory_match";
    
    return (
      <div className="min-h-[500px]">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToTopics}
              className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-bold text-purple-600">{gameState.score}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{gameState.currentQuestionIndex + 1}/{gameState.questions.length}</div>
                <div className="text-xs text-gray-500">questions</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timer */}
        {settings?.timerEnabled && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl mb-4">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-xl">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}
        
        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Question {gameState.currentQuestionIndex + 1}
            </h2>
            <p className="text-lg text-gray-700 whitespace-pre-wrap">
              {question.questionText}
            </p>
          </div>
          
          {/* Options */}
          {isMultipleChoice && question.options && (
            <div className="space-y-3 mb-4">
              {question.options.map(option => {
                const isSelected = selectedAnswer === option.id;
                
                return (
                  <button 
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${isSelected ? "text-purple-600" : "text-gray-600"}`}>
                        {option.id.toUpperCase()}
                      </span>
                      <span className={`flex-1 ${isSelected ? "text-purple-600" : "text-gray-700"}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {isSequence && question.options && (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600 mb-3">Arrange in correct order:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {question.options.map(option => {
                  const isSelected = (selectedAnswer as string[] || []).includes(option.id);
                  
                  return (
                    <button 
                      key={option.id}
                      onClick={() => {
                        const current = (selectedAnswer as string[] || []);
                        if (isSelected) {
                          handleSelectAnswer(current.filter(id => id !== option.id));
                        } else {
                          handleSelectAnswer([...current, option.id]);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {isJumbled && question.options && (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600 mb-3">Select the correct answer:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {question.options.map(option => {
                  const isSelected = selectedAnswer === option.id;
                  
                  return (
                    <button 
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={selectedAnswer !== null}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {isMemoryMatch && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Find matching pairs:</p>
              <p className="text-gray-500">Memory match game interface</p>
            </div>
          )}
          
          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-xl mb-4 ${showFeedback.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2">
                {showFeedback.isCorrect ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${showFeedback.isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {showFeedback.isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              {question.explanation && (
                <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleUseHint()}
              disabled={gameState.hintsUsed >= GAME_CONFIG.MAX_HINTS || selectedAnswer !== null}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-yellow-100 text-yellow-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-5 h-5" />
              Hint ({GAME_CONFIG.MAX_HINTS - gameState.hintsUsed})
            </button>
            
            <button 
              onClick={handleSkipQuestion}
              disabled={selectedAnswer !== null}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              Skip
            </button>
            
            <button 
              onClick={handleConfirmAnswer}
              disabled={selectedAnswer === null}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Submit
            </button>
          </div>
          
          {/* Next button */}
          {selectedAnswer !== null && gameState.currentQuestionIndex < gameState.questions.length - 1 && (
            <button 
              onClick={handleNextQuestion}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              Next Question
              <ArrowLeft className="w-5 h-5 transform -rotate-180" />
            </button>
          )}
          
          {/* Finish button */}
          {selectedAnswer !== null && gameState.currentQuestionIndex === gameState.questions.length - 1 && (
            <button 
              onClick={handleEndGame}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Finish Game
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Show summary
  if (gameSummary) {
    const stars = Array(Math.min(gameSummary.starsEarned, 3)).fill(0);
    const emptyStars = Array(3 - stars.length).fill(0);
    
    return (
      <div className="min-h-[500px]">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {GAME_ICONS[gameMode]}
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {gameSummary.isPerfect ? (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Perfect!
              </span>
            ) : "Game Over!"}
          </h2>
          
          {gameSummary.isPerfect && (
            <p className="text-yellow-600 font-medium mb-6">You got all questions correct!</p>
          )}
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{gameSummary.score}</div>
              <div className="text-sm text-gray-500">Points</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{gameSummary.correctAnswers}/{gameSummary.totalQuestions}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-600">{gameSummary.accuracy}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-1 mb-6">
            {stars.map((_, i) => (
              <StarIcon key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            ))}
            {emptyStars.map((_, i) => (
              <StarIcon key={i + stars.length} className="w-8 h-8 text-gray-300" />
            ))}
          </div>
          
          {gameSummary.coinsEarned > 0 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-yellow-600">{gameSummary.coinsEarned} coins earned!</span>
              </div>
            </div>
          )}
          
          {gameSummary.awardedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">New Badges Earned!</h3>
              <div className="flex justify-center gap-3">
                {gameSummary.awardedBadges.map((badgeId: string) => {
                  const badge = { id: badgeId, name: "New Badge", icon: "🏅" };
                  return (
                    <div key={badgeId} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 animate-bounce">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium">{badge.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button 
              onClick={handleExit}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Exit
            </button>
            <button 
              onClick={handlePlayAgain}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Play className="w-5 h-5 inline-block" />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
