"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, Brain, Globe, Calculator, Trophy, 
  Play, Clock, TrendingUp, Star, Flame
} from "lucide-react";
import { getStudentProfile, getAllProgress, getGameSettings, loadFromStorage } from "@/lib/utils";
import type { StudentProfile, ProgressTracking, GameMode, Language } from "@/types";
import { GAME_MODE_LABELS, LANGUAGE_LABELS } from "@/types";
import { getTopicsForGameMode, getQuestions } from "@/data/questions";

// Game card for games listing
function GameCard({ 
  gameMode, 
  profile,
  progress,
  language,
  onPlay 
}: { 
  gameMode: GameMode; 
  profile: StudentProfile; 
  progress: ProgressTracking[]; 
  language: Language;
  onPlay: (gameMode: GameMode) => void 
}) {
  const topics = getTopicsForGameMode(gameMode);
  const gameProgress = progress.filter(p => p.gameMode === gameMode);
  const avgAccuracy = gameProgress.length > 0 
    ? Math.round(gameProgress.reduce((sum, p) => sum + p.accuracy, 0) / gameProgress.length)
    : 0;
  const totalPlayed = gameProgress.reduce((sum, p) => sum + p.questionsAttempted, 0);
  
  const gameIcons: Record<GameMode, React.ReactNode> = {
    math_master: <Calculator className="w-8 h-8" />,
    word_wizard: <BookOpen className="w-8 h-8" />,
    science_explorer: <Globe className="w-8 h-8" />,
    brain_battle: <Brain className="w-8 h-8" />,
    india_knowledge_quest: <Trophy className="w-8 h-8" />,
  };
  
  const gameColors: Record<GameMode, string> = {
    math_master: "from-purple-500 to-blue-500",
    word_wizard: "from-green-500 to-teal-500",
    science_explorer: "from-orange-500 to-yellow-500",
    brain_battle: "from-pink-500 to-rose-500",
    india_knowledge_quest: "from-indigo-500 to-purple-500",
  };
  
  const gameDescriptions: Record<GameMode, string> = {
    math_master: "Practice math skills with fun challenges",
    word_wizard: "Improve vocabulary and language skills",
    science_explorer: "Explore science through interactive learning",
    brain_battle: "Develop reasoning and problem-solving skills",
    india_knowledge_quest: "Learn about India's geography, history, and culture",
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={() => onPlay(gameMode)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gameColors[gameMode]} flex items-center justify-center text-white shadow-lg`}>
          {gameIcons[gameMode]}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full">
            {topics.length} topics
          </span>
          <span className="text-sm text-gray-500">{totalPlayed} played</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {GAME_MODE_LABELS[gameMode][language] || GAME_MODE_LABELS[gameMode].english}
      </h3>
      
      <p className="text-gray-600 text-sm mb-6">{gameDescriptions[gameMode]}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm font-medium">{avgAccuracy}%</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{gameProgress.length} sessions</span>
          </div>
        </div>
        
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-all">
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>
    </div>
  );
}

// Stats card
function StatsCard({ 
  title,
  value,
  icon,
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

export default function GamesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<ProgressTracking[]>([]);
  const [language, setLanguage] = useState<Language>("english");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadedProfile = getStudentProfile();
    const loadedProgress = loadFromStorage<ProgressTracking[]>("smart_learning_progress", []);
    
    setProfile(loadedProfile);
    setProgress(loadedProgress);
    setLanguage(loadedProfile.preferredLanguage);
    setIsLoading(false);
  }, []);
  
  const handlePlayGame = useCallback((gameMode: GameMode) => {
    router.push(`/games/${gameMode}`);
  }, [router]);
  
  const totalQuestions = progress.reduce((sum, p) => sum + p.questionsAttempted, 0);
  const totalCorrect = progress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Please create a profile first</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-[500px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {language === "hindi" ? "गेम" : 
           language === "marathi" ? "खेळ" :
           language === "urdu" ? "گیمز" : "Games"}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === "hindi" ? "अपना पसंदीदा गेम चुनें" : 
           language === "marathi" ? "तुमचा आवडता खेळ निवडा" :
           language === "urdu" ? "اپنا پسندیدہ گیم منتخب کریں" : "Choose your favorite game"}
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatsCard 
          title={language === "hindi" ? "कुल प्रश्न" : language === "marathi" ? "एकूण प्रश्न" : language === "urdu" ? "کل سوال" : "Total Questions"}
          value={totalQuestions}
          icon={<span className="text-purple-600">📝</span>}
          color="bg-purple-100"
        />
        <StatsCard 
          title={language === "hindi" ? "सही" : language === "marathi" ? "बरोबर" : language === "urdu" ? "درست" : "Correct"}
          value={totalCorrect}
          icon={<span className="text-green-600">✓</span>}
          color="bg-green-100"
        />
        <StatsCard 
          title={language === "hindi" ? "सटीकता" : language === "marathi" ? "अचूकता" : language === "urdu" ? "درستی" : "Accuracy"}
          value={`${overallAccuracy}%`}
          icon={<span className="text-yellow-600">🎯</span>}
          color="bg-yellow-100"
        />
        <StatsCard 
          title={language === "hindi" ? "सत्र" : language === "marathi" ? "सत्र" : language === "urdu" ? "سیشن" : "Sessions"}
          value={progress.length}
          icon={<span className="text-blue-600">📊</span>}
          color="bg-blue-100"
        />
      </div>
      
      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(["math_master", "word_wizard", "science_explorer", "brain_battle", "india_knowledge_quest"] as GameMode[]).map(gameMode => (
          <GameCard 
            key={gameMode} 
            gameMode={gameMode} 
            profile={profile}
            progress={progress}
            language={language}
            onPlay={handlePlayGame}
          />
        ))}
      </div>
    </div>
  );
}
