"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, Brain, Globe, Calculator, Sparkles, 
  Star, Coins, Flame, Medal, Play, Clock, 
  Settings, User, TrendingUp, Home, 
  ChevronRight, Calendar, Target, Trophy
} from "lucide-react";
import { cn, getStudentProfile, getAllProgress, getRecentSessions, getStudentBadges, updateStudentProfile, getGameSettings, updateGameSettings, loadFromStorage, saveToStorage } from "@/lib/utils";
import type { StudentProfile, GameMode, Language, ClassLevel, ProgressTracking, GameSession } from "@/types";
import { GAME_MODE_LABELS, CLASS_LABELS, LANGUAGE_LABELS, AVATARS } from "@/types";
import { getTopicsForGameMode, getQuestions } from "@/data/questions";

// Game card component
function GameCard({ 
  gameMode, 
  language, 
  onPlay 
}: { 
  gameMode: GameMode; 
  language: Language; 
  onPlay: (gameMode: GameMode) => void 
}) {
  const topics = getTopicsForGameMode(gameMode);
  const progress = loadFromStorage<ProgressTracking[]>("smart_learning_progress", []);
  const gameProgress = progress.filter(p => p.gameMode === gameMode);
  const avgAccuracy = gameProgress.length > 0 
    ? Math.round(gameProgress.reduce((sum, p) => sum + p.accuracy, 0) / gameProgress.length)
    : 0;
  
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
  
  const gameDescriptions: Record<GameMode, Record<Language, string>> = {
    math_master: {
      english: "Practice math skills with fun challenges",
      hindi: "गणित कौशल का अभ्यास करें",
      marathi: "गणित कौशल्ये अभ्यास करा",
      urdu: "ریاضی مہارتوں کا مشق کریں",
    },
    word_wizard: {
      english: "Improve vocabulary and language skills",
      hindi: "शब्दावली और भाषा कौशल में सुधार करें",
      marathi: "शब्दसंग्रह आणि भाषा कौशल्य वाढवा",
      urdu: "لفظی اور زبان کی مہارت کو بہتر بنائیں",
    },
    science_explorer: {
      english: "Explore science through interactive learning",
      hindi: "इंटरैक्टिव सीखने के माध्यम से विज्ञान का अन्वेषण करें",
      marathi: "संवादात्मक शिकण्याद्वारे विज्ञान शोधा",
      urdu: "متفاعل سیکھنے کے ذریعے سائنس کی کھوج کریں",
    },
    brain_battle: {
      english: "Develop reasoning and problem-solving skills",
      hindi: "तर्क और समस्या-समाधान कौशल विकसित करें",
      marathi: "तर्क आणि समस्यासोडवण कौशल्य वाढवा",
      urdu: "logic اور مسأله حل کرنے کی مہارت کو ترقی دیں",
    },
    india_knowledge_quest: {
      english: "Learn about India's geography, history, and culture",
      hindi: "भारत के भूगोल, इतिहास और संस्कृति के बारे में जानें",
      marathi: "भारताचे भूगोल, इतिहास आणि संस्कृती शिका",
      urdu: "بھارت کے جغرافیہ، تاریخ اور ثقافت کے بارے میں جانیں",
    },
  };
  
  return (
    <div 
      className="game-card bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={() => onPlay(gameMode)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gameColors[gameMode]} flex items-center justify-center text-white shadow-lg`}>
          {gameIcons[gameMode]}
        </div>
        <span className="bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full">
          {topics.length} topics
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {GAME_MODE_LABELS[gameMode][language] || GAME_MODE_LABELS[gameMode].english}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        {gameDescriptions[gameMode][language] || gameDescriptions[gameMode].english}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span className="text-sm font-medium">{avgAccuracy}%</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{gameProgress.length} played</span>
          </div>
        </div>
        
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 hover:shadow-md transition-all">
          <Play className="w-4 h-4" />
          Play
        </button>
      </div>
    </div>
  );
}

// Progress summary component
function ProgressSummary({ 
  progress, 
  language 
}: { 
  progress: ProgressTracking[]; 
  language: Language 
}) {
  const totalQuestions = progress.reduce((sum, p) => sum + p.questionsAttempted, 0);
  const totalCorrect = progress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "प्रगति सारांश" : 
         language === "marathi" ? "प्रगती सारांश" :
         language === "urdu" ? "ترقی کا خلاصہ" : "Progress Summary"}
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalQuestions}</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "hindi" ? "कुल प्रश्न" : 
             language === "marathi" ? "एकूण प्रश्न" :
             language === "urdu" ? "کل سوال" : "Total Questions"}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalCorrect}</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "hindi" ? "सही" : 
             language === "marathi" ? "बरोबर" :
             language === "urdu" ? "درست" : "Correct"}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{overallAccuracy}%</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "hindi" ? "सटीकता" : 
             language === "marathi" ? "अचूकता" :
             language === "urdu" ? "درستی" : "Accuracy"}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === "hindi" ? "गेम प्रगति" : 
             language === "marathi" ? "खेळ प्रगती" :
             language === "urdu" ? "گیم ترقی" : "Game Progress"}
          </span>
          <span className="text-sm text-gray-500">{progress.length} games</span>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(overallAccuracy, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Daily challenge component
function DailyChallenge({ 
  language, 
  profile 
}: { 
  language: Language; 
  profile: StudentProfile 
}) {
  const today = new Date().toDateString();
  const sessions = loadFromStorage<GameSession[]>("smart_learning_sessions", []);
  const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === today);
  const todayScore = todaySessions.reduce((sum, s) => sum + s.score, 0);
  const progress = (todayScore / (profile.dailyGoal * 10)) * 100;
  
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">
            {language === "hindi" ? "दैनिक चैलेंज" : 
             language === "marathi" ? "दैनिक आव्हान" :
             language === "urdu" ? "روزانہ چیلنج" : "Daily Challenge"}
          </h3>
          <p className="text-purple-100 text-sm">
            {language === "hindi" ? "आज का लक्ष्य" : 
             language === "marathi" ? "आजचे लक्ष्य" :
             language === "urdu" ? "آج کا ہدف" : "Today's Goal"}: {profile.dailyGoal} questions
          </p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Target className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>
            {language === "hindi" ? "प्राप्त अंक" : 
             language === "marathi" ? "मिळालेले गुण" :
             language === "urdu" ? "حاصل شدہ پوئنٹس" : "Points Earned"}
          </span>
          <span className="font-bold">{todayScore} / {profile.dailyGoal * 10}</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-yellow-400" />
          <span>{profile.streak} {language === "hindi" ? "दिन" : language === "marathi" ? "दिवस" : language === "urdu" ? "دن" : "days"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-200" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}

// Recent games component
function RecentGames({ 
  sessions, 
  language 
}: { 
  sessions: GameSession[]; 
  language: Language 
}) {
  if (sessions.length === 0) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "हाल के गेम" : 
         language === "marathi" ? "अलीकडील खेळ" :
         language === "urdu" ? "حالیہ گیمز" : "Recent Games"}
      </h3>
      
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session, index) => {
          const gameLabel = GAME_MODE_LABELS[session.gameMode as GameMode][language] || 
                           GAME_MODE_LABELS[session.gameMode as GameMode].english;
          const accuracy = session.totalQuestions > 0 
            ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
            : 0;
          
          return (
            <div 
              key={session.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-800">{gameLabel}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold text-purple-600">{session.score}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{accuracy}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {sessions.length > 5 && (
        <button className="w-full mt-4 py-2 text-purple-600 font-medium flex items-center justify-center gap-2 hover:bg-purple-50 rounded-lg transition-colors">
          {language === "hindi" ? "और देखें" : 
           language === "marathi" ? "अजून पहा" :
           language === "urdu" ? "مزيد دیکھیں" : "View More"}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Badges component
function BadgesDisplay({ 
  badges, 
  language 
}: { 
  badges: any[]; 
  language: Language 
}) {
  const studentBadges = loadFromStorage<string[]>("smart_learning_badges", []);
  const earnedBadges = badges.filter(b => studentBadges.includes(b.id));
  
  if (earnedBadges.length === 0) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "अर्जित बैज" : 
         language === "marathi" ? "मिळालेले बॅज" :
         language === "urdu" ? "حاصل شدہ بیج" : "Earned Badges"}
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {earnedBadges.slice(0, 6).map((badge) => (
          <div 
            key={badge.id} 
            className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200"
          >
            <span className="text-2xl">{badge.icon}</span>
            <div className="text-center">
              <div className="font-medium text-sm text-gray-800">{badge.name}</div>
              <div className="text-xs text-gray-500">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {earnedBadges.length > 6 && (
        <button className="w-full mt-4 py-2 text-purple-600 font-medium flex items-center justify-center gap-2 hover:bg-purple-50 rounded-lg transition-colors">
          {language === "hindi" ? "और बैज" : 
           language === "marathi" ? "अजून बॅज" :
           language === "urdu" ? "مزيد بیج" : "More Badges"}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Main Home Page Component
export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<ProgressTracking[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("english");
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Load data on mount
  useEffect(() => {
    const loadedProfile = getStudentProfile();
    const loadedProgress = loadFromStorage<ProgressTracking[]>("smart_learning_progress", []);
    const loadedSessions = loadFromStorage<GameSession[]>("smart_learning_sessions", []);
    const loadedSettings = getGameSettings();
    
    setProfile(loadedProfile);
    setProgress(loadedProgress);
    setSessions(loadedSessions);
    setSettings(loadedSettings);
    setLanguage(loadedProfile.preferredLanguage);
    setIsLoading(false);
  }, []);
  
  // Update streak on mount
  useEffect(() => {
    if (profile) {
      const today = new Date().toDateString();
      const lastActive = new Date(profile.lastActiveDate).toDateString();
      if (today !== lastActive) {
        updateStudentProfile({ 
          streak: profile.streak + 1, 
          lastActiveDate: new Date().toISOString() 
        });
      }
    }
  }, [profile]);
  
  // Handle language change
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    if (profile) {
      updateStudentProfile({ preferredLanguage: lang });
    }
    updateGameSettings({ language: lang });
  }, [profile]);
  
  // Handle class change
  const handleClassChange = useCallback((classLevel: ClassLevel) => {
    if (profile) {
      updateStudentProfile({ classLevel });
    }
    updateGameSettings({ classLevel });
  }, [profile]);
  
  // Handle play game
  const handlePlayGame = useCallback((gameMode: GameMode) => {
    // Save current settings
    updateGameSettings({ 
      language: profile?.preferredLanguage || language,
      classLevel: profile?.classLevel || 1
    });
    
    // Navigate to game
    router.push(`/games/${gameMode}`);
  }, [profile, language, router]);
  
  // Handle continue playing
  const handleContinuePlaying = useCallback(() => {
    const lastSession = sessions[0];
    if (lastSession) {
      router.push(`/games/${lastSession.gameMode}`);
    } else {
      // If no sessions, go to first game
      router.push("/games/math_master");
    }
  }, [sessions, router]);
  
  // Format number for display
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Learning Games</h1>
            <p className="text-gray-600 mt-2">Create your profile to start learning!</p>
          </div>
          
          <button 
            onClick={() => setShowProfileModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-lg hover:shadow-lg transition-all"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 p-2 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {profile.avatar}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-gray-800">{profile.name}</div>
                  <div className="text-sm text-gray-500">
                    {CLASS_LABELS[profile.classLevel]} • {LANGUAGE_LABELS[profile.preferredLanguage]}
                  </div>
                </div>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{formatNumber(profile.totalStars)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">{formatNumber(profile.totalCoins)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{profile.streak}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {language === "hindi" ? "स्वागत है" : 
                 language === "marathi" ? "स्वागत आहे" :
                 language === "urdu" ? "خوش آمدید" : "Welcome back"}, {profile.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {language === "hindi" ? "आज क्या सीखेंगे?" : 
                 language === "marathi" ? "आज काय शिकणार?" :
                 language === "urdu" ? "آج کیا سیکھیں گے؟" : "What would you like to learn today?"}
              </p>
            </div>
            
            <button 
              onClick={handleContinuePlaying}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Play className="w-5 h-5" />
              {language === "hindi" ? "जारी रखें" : 
               language === "marathi" ? "सुरू ठेवा" :
               language === "urdu" ? "جاری رکھیں" : "Continue Playing"}
            </button>
          </div>
        </div>
        
        {/* Daily Challenge */}
        <div className="mb-8">
          <DailyChallenge language={language} profile={profile} />
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatNumber(profile.totalStars)}</div>
            <div className="text-sm text-gray-500">
              {language === "hindi" ? "कुल स्टार" : 
               language === "marathi" ? "एकूण स्टार" :
               language === "urdu" ? "کل ستارے" : "Total Stars"}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Coins className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatNumber(profile.totalCoins)}</div>
            <div className="text-sm text-gray-500">
              {language === "hindi" ? "कुल सिक्के" : 
               language === "marathi" ? "एकूण नाणी" :
               language === "urdu" ? "کل سکے" : "Total Coins"}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">{profile.streak}</div>
            <div className="text-sm text-gray-500">
              {language === "hindi" ? "लगातार दिन" : 
               language === "marathi" ? "सलग दिवस" :
               language === "urdu" ? "لسانی دن" : "Day Streak"}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Medal className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {loadFromStorage<string[]>("smart_learning_badges", []).length}
            </div>
            <div className="text-sm text-gray-500">
              {language === "hindi" ? "बैज" : 
               language === "marathi" ? "बॅज" :
               language === "urdu" ? "بیج" : "Badges"}
            </div>
          </div>
        </div>
        
        {/* Game Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {language === "hindi" ? "गेम" : 
               language === "marathi" ? "खेळ" :
               language === "urdu" ? "گیمز" : "Games"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {language === "hindi" ? "कक्षा चुनें" : 
                 language === "marathi" ? "इयत्ता निवडा" :
                 language === "urdu" ? "کلاس منتخب کریں" : "Select Class"}
              </span>
              <select 
                value={profile.classLevel}
                onChange={(e) => handleClassChange(Number(e.target.value) as ClassLevel)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(cls => (
                  <option key={cls} value={cls}>
                    {CLASS_LABELS[cls as ClassLevel]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(["math_master", "word_wizard", "science_explorer", "brain_battle", "india_knowledge_quest"] as GameMode[]).map(gameMode => (
              <GameCard 
                key={gameMode} 
                gameMode={gameMode} 
                language={language}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        </div>
        
        {/* Progress and Recent Games */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressSummary progress={progress} language={language} />
          </div>
          <div>
            <RecentGames sessions={sessions} language={language} />
          </div>
        </div>
        
        {/* Badges */}
        <div className="mb-8">
          <BadgesDisplay badges={Array.from({ length: 9 }, (_, i) => ({ 
            id: `badge_${i}`,
            name: `Badge ${i + 1}`,
            description: "Achievement",
            icon: "🏅"
          }))} language={language} />
        </div>
      </main>
      
      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-purple-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => router.push("/games")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">Games</span>
          </button>
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          profile={profile} 
          onClose={() => setShowProfileModal(false)}
          onSave={(updatedProfile) => setProfile(updatedProfile)}
          language={language}
        />
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          settings={settings}
          onClose={() => setShowSettingsModal(false)}
          onSave={(updatedSettings) => setSettings(updatedSettings)}
          language={language}
        />
      )}
    </div>
  );
}

// Profile Modal Component
function ProfileModal({ 
  profile, 
  onClose, 
  onSave,
  language 
}: { 
  profile: StudentProfile; 
  onClose: () => void; 
  onSave: (profile: StudentProfile) => void;
  language: Language;
}) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [classLevel, setClassLevel] = useState<ClassLevel>(profile.classLevel);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      name,
      avatar,
      classLevel,
      dailyGoal,
    };
    updateStudentProfile(updatedProfile);
    onSave(updatedProfile);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {language === "hindi" ? "प्रोफाइल" : 
               language === "marathi" ? "प्रोफाइल" :
               language === "urdu" ? "پروفائل" : "Profile"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          
          {/* Avatar */}
          <div className="text-center mb-6">
            <div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-4 text-4xl cursor-pointer relative"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {avatar}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                <Settings className="w-3 h-3" />
              </div>
            </div>
            
            {showEmojiPicker && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-8 gap-2">
                  {AVATARS.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => {
                        setAvatar(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl p-1 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-gray-600">
              {language === "hindi" ? "अवतार चुनें" : 
               language === "marathi" ? "अवतार निवडा" :
               language === "urdu" ? "اوٹار منتخب کریں" : "Choose Avatar"}
            </p>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "hindi" ? "नाम" : 
                 language === "marathi" ? "नाव" :
                 language === "urdu" ? "نام" : "Name"}
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={language === "hindi" ? "अपना नाम दर्ज करें" : 
                           language === "marathi" ? "तुमचे नाव प्रविष्ट करा" :
                           language === "urdu" ? "اپنا نام درج کریں" : "Enter your name"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "hindi" ? "कक्षा" : 
                 language === "marathi" ? "इयत्ता" :
                 language === "urdu" ? "کلاس" : "Class"}
              </label>
              <select 
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value) as ClassLevel)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(cls => (
                  <option key={cls} value={cls}>
                    {CLASS_LABELS[cls as ClassLevel]}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "hindi" ? "दैनिक लक्ष्य" : 
                 language === "marathi" ? "दैनिक लक्ष्य" :
                 language === "urdu" ? "روزانہ ہدف" : "Daily Goal"}
              </label>
              <select 
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[5, 10, 15, 20, 25, 30].map(goal => (
                  <option key={goal} value={goal}>{goal} questions</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-medium text-gray-800 mb-3">
              {language === "hindi" ? "आंकड़े" : 
               language === "marathi" ? "आकडेवारी" :
               language === "urdu" ? "اعداد و شمار" : "Statistics"}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xl font-bold text-purple-600">{profile.totalStars}</div>
                <div className="text-xs text-gray-500">Stars</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600">{profile.totalCoins}</div>
                <div className="text-xs text-gray-500">Coins</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">{profile.streak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {language === "hindi" ? "रद्द करें" : 
               language === "marathi" ? "रद्द करा" :
               language === "urdu" ? "منسوخ کریں" : "Cancel"}
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {language === "hindi" ? "सहेज" : 
               language === "marathi" ? "जतन करा" :
               language === "urdu" ? "محفوظ کریں" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ 
  settings: initialSettings, 
  onClose, 
  onSave,
  language 
}: { 
  settings: any; 
  onClose: () => void; 
  onSave: (settings: any) => void;
  language: Language;
}) {
  const [settings, setSettings] = useState(initialSettings || {
    soundEnabled: true,
    timerEnabled: false,
    difficulty: "medium",
    theme: "light",
  });
  
  const handleSave = () => {
    updateGameSettings(settings);
    onSave(settings);
    onClose();
  };
  
  const handleChange = (key: string, value: boolean | string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {language === "hindi" ? "सेटिंग्स" : 
               language === "marathi" ? "सेटिंग्ज" :
               language === "urdu" ? "سیٹنگز" : "Settings"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          
          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-800">
                  {language === "hindi" ? "ध्वनि" : 
                   language === "marathi" ? "आवाज" :
                   language === "urdu" ? "آواز" : "Sound"}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === "hindi" ? "ध्वनि चालू/बंद" : 
                   language === "marathi" ? "आवाज चालू/बंद" :
                   language === "urdu" ? "آواز آن/آف" : "Sound effects"}
                </p>
              </div>
              <button 
                onClick={() => handleChange("soundEnabled", !settings.soundEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.soundEnabled ? "bg-purple-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-800">
                  {language === "hindi" ? "टाइमर" : 
                   language === "marathi" ? "टायमर" :
                   language === "urdu" ? "ٹائمر" : "Timer"}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === "hindi" ? "टाइमर चालू/बंद" : 
                   language === "marathi" ? "टायमर चालू/बंद" :
                   language === "urdu" ? "ٹائمر آن/آف" : "Question timer"}
                </p>
              </div>
              <button 
                onClick={() => handleChange("timerEnabled", !settings.timerEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.timerEnabled ? "bg-purple-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.timerEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3">
                {language === "hindi" ? "कठिनाई" : 
                 language === "marathi" ? "अवघडपणा" :
                 language === "urdu" ? "مشکل" : "Difficulty"}
              </h3>
              <div className="flex gap-2">
                {["easy", "medium", "hard"].map(diff => (
                  <button 
                    key={diff}
                    onClick={() => handleChange("difficulty", diff)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${settings.difficulty === diff 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "bg-white text-gray-600 border border-gray-300 hover:border-purple-300"}`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3">
                {language === "hindi" ? "थीम" : 
                 language === "marathi" ? "थीम" :
                 language === "urdu" ? "ٹھیم" : "Theme"}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleChange("theme", "light")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${settings.theme === "light" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-white text-gray-600 border border-gray-300 hover:border-purple-300"}`}
                >
                  {language === "hindi" ? "लाइट" : 
                   language === "marathi" ? "लाइट" :
                   language === "urdu" ? "لائٹ" : "Light"}
                </button>
                <button 
                  onClick={() => handleChange("theme", "dark")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${settings.theme === "dark" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "bg-white text-gray-600 border border-gray-300 hover:border-purple-300"}`}
                >
                  {language === "hindi" ? "डार्क" : 
                   language === "marathi" ? "डार्क" :
                   language === "urdu" ? "ڈارک" : "Dark"}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3">
                {language === "hindi" ? "भाषा" : 
                 language === "marathi" ? "भाषा" :
                 language === "urdu" ? "زبان" : "Language"}
              </h3>
              <select 
                value={language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {(["english", "hindi", "marathi", "urdu"] as Language[]).map(lang => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {language === "hindi" ? "रद्द करें" : 
               language === "marathi" ? "रद्द करा" :
               language === "urdu" ? "منسوخ کریں" : "Cancel"}
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {language === "hindi" ? "सहेज" : 
               language === "marathi" ? "जतन करा" :
               language === "urdu" ? "محفوظ کریں" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
