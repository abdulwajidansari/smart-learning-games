"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Star, Flame, Medal, BookOpen, Calculator, 
  Brain, Globe, Trophy, ArrowLeft, Settings, 
  ChevronRight, Home
} from "lucide-react";
import { 
  getStudentProfile, updateStudentProfile, 
  loadFromStorage, clearAllStorage
} from "@/lib/utils";
import type { StudentProfile, ProgressTracking, GameSession, Language } from "@/types";
import { GAME_MODE_LABELS, CLASS_LABELS, LANGUAGE_LABELS, AVATARS } from "@/types";
import { BADGES } from "@/lib/utils";

// Progress card component
function ProgressCard({ 
  gameMode,
  progressList,
  language
}: { 
  gameMode: string;
  progressList: ProgressTracking[];
  language: Language;
}) {
  const gameLabel = GAME_MODE_LABELS[gameMode as keyof typeof GAME_MODE_LABELS]?.[language] || gameMode;
  const totalQuestions = progressList.reduce((sum, p) => sum + p.questionsAttempted, 0);
  const totalCorrect = progressList.reduce((sum, p) => sum + p.correctAnswers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {gameMode === "math_master" && <Calculator className="w-5 h-5 text-purple-600" />}
          {gameMode === "word_wizard" && <BookOpen className="w-5 h-5 text-green-600" />}
          {gameMode === "science_explorer" && <Globe className="w-5 h-5 text-orange-600" />}
          {gameMode === "brain_battle" && <Brain className="w-5 h-5 text-pink-600" />}
          {gameMode === "india_knowledge_quest" && <Trophy className="w-5 h-5 text-indigo-600" />}
          <span className="font-medium text-gray-800">{gameLabel}</span>
        </div>
        <span className="text-sm text-gray-500">{progressList.length} sessions</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-gray-800">{totalQuestions}</div>
          <div className="text-xs text-gray-500">
            {language === "hindi" ? "कुल प्रश्न" : 
             language === "marathi" ? "एकूण प्रश्न" :
             language === "urdu" ? "کل سوال" : "Questions"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{totalCorrect}</div>
          <div className="text-xs text-gray-500">
            {language === "hindi" ? "सही" : 
             language === "marathi" ? "बरोबर" :
             language === "urdu" ? "درست" : "Correct"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-600">{accuracy}%</div>
          <div className="text-xs text-gray-500">
            {language === "hindi" ? "सटीकता" : 
             language === "marathi" ? "अचूकता" :
             language === "urdu" ? "درستی" : "Accuracy"}
          </div>
        </div>
      </div>
      
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          style={{ width: `${Math.min(accuracy, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Badge display component
function BadgeDisplay({ 
  badges,
  language 
}: { 
  badges: any[];
  language: Language;
}) {
  const studentBadges = loadFromStorage<string[]>("smart_learning_badges", []);
  const earnedBadges = (badges as any[]).filter((b: any) => studentBadges.includes(b.id));
  
  if (earnedBadges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <Medal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">
          {language === "hindi" ? "अभी तक कोई बैज नहीं" : 
           language === "marathi" ? "आतापर्यंत कोणतेही बॅज नाहीत" :
           language === "urdu" ? "اب تک کوئی بیج نہیں" : "No badges earned yet"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {language === "hindi" ? "गेम खेलकर बैज अर्जित करें" : 
           language === "marathi" ? "खेळ खेळून बॅज मिळवा" :
           language === "urdu" ? "گیمز کھیلا کر بیج حاصل کریں" : "Play games to earn badges"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "अर्जित बैज" : 
         language === "marathi" ? "मिळालेले बॅज" :
         language === "urdu" ? "حاصل شدہ بیج" : "Earned Badges"}
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {earnedBadges.map((badge: any) => (
          <div 
            key={badge.id}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200"
          >
            <span className="text-3xl">{badge.icon}</span>
            <div className="text-center">
              <div className="font-medium text-sm text-gray-800">{badge.name}</div>
              <div className="text-xs text-gray-500">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Recent sessions component
function RecentSessions({ 
  sessions,
  language 
}: { 
  sessions: GameSession[];
  language: Language;
}) {
  if (sessions.length === 0) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "हाल के सत्र" : 
         language === "marathi" ? "अलीकडील सत्र" :
         language === "urdu" ? "حالیہ سیشن" : "Recent Sessions"}
      </h3>
      
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => {
          const gameLabel = GAME_MODE_LABELS[session.gameMode as keyof typeof GAME_MODE_LABELS]?.[language] || session.gameMode;
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
                  {new Date(session.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <div>
                  <div className="font-medium text-gray-800">{gameLabel}</div>
                  <div className="text-xs text-gray-500">
                    {session.correctAnswers}/{session.totalQuestions} correct
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
    </div>
  );
}

// Statistics component
function Statistics({ 
  profile,
  progress,
  sessions,
  language 
}: { 
  profile: StudentProfile;
  progress: ProgressTracking[];
  sessions: GameSession[];
  language: Language;
}) {
  const totalQuestions = progress.reduce((sum, p) => sum + p.questionsAttempted, 0);
  const totalCorrect = progress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
  const avgTimePerSession = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {language === "hindi" ? "आंकड़े" : 
         language === "marathi" ? "आकडेवारी" :
         language === "urdu" ? "اعداد و شمار" : "Statistics"}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">{totalSessions}</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "कुल सत्र" : 
             language === "marathi" ? "एकूण सत्र" :
             language === "urdu" ? "کل سیشن" : "Total Sessions"}
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{totalQuestions}</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "कुल प्रश्न" : 
             language === "marathi" ? "एकूण प्रश्न" :
             language === "urdu" ? "کل سوال" : "Total Questions"}
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">{totalCorrect}</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "सही" : 
             language === "marathi" ? "बरोबर" :
             language === "urdu" ? "درست" : "Correct"}
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{overallAccuracy}%</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "सटीकता" : 
             language === "marathi" ? "अचूकता" :
             language === "urdu" ? "درستی" : "Accuracy"}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">{profile.streak}</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "लगातार दिन" : 
             language === "marathi" ? "सलग दिवस" :
             language === "urdu" ? "لسانی دن" : "Day Streak"}
          </div>
        </div>
        <div className="text-center p-3 bg-pink-50 rounded-lg">
          <div className="text-xl font-bold text-pink-600">{avgTimePerSession}s</div>
          <div className="text-sm text-gray-500">
            {language === "hindi" ? "औसत समय" : 
             language === "marathi" ? "सरासरी वेळ" :
             language === "urdu" ? "اوسط وقت" : "Avg Time"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<ProgressTracking[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [language, setLanguage] = useState<Language>("english");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  useEffect(() => {
    const loadedProfile = getStudentProfile();
    const loadedProgress = loadFromStorage<ProgressTracking[]>("smart_learning_progress", []);
    const loadedSessions = loadFromStorage<GameSession[]>("smart_learning_sessions", []);
    
    setProfile(loadedProfile);
    setProgress(loadedProgress);
    setSessions(loadedSessions);
    setLanguage(loadedProfile.preferredLanguage);
    setIsLoading(false);
  }, []);
  
  const handleBack = () => {
    router.push("/");
  };
  
  const handleEditProfile = () => {
    setShowEditModal(true);
  };
  
  const handleClearData = () => {
    setShowConfirmClear(true);
  };
  
  const confirmClearData = () => {
    clearAllStorage();
    setShowConfirmClear(false);
    // Refresh page to show empty state
    router.refresh();
  };
  
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500" />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No Profile Found</h2>
          <p className="text-gray-600 mt-2">Please create a profile to start using the app</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }
  
  // Group progress by game mode
  const progressByGame: Record<string, ProgressTracking[]> = {};
  progress.forEach(p => {
    if (!progressByGame[p.gameMode]) {
      progressByGame[p.gameMode] = [];
    }
    progressByGame[p.gameMode].push(p);
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === "hindi" ? "पिछला" : 
               language === "marathi" ? "मागे" :
               language === "urdu" ? "پیچھے" : "Back"}
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">
              {language === "hindi" ? "प्रोफाइल" : 
               language === "marathi" ? "प्रोफाइल" :
               language === "urdu" ? "پروفائل" : "Profile"}
            </h1>
            
            <button 
              onClick={() => router.push("/")}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-4 border-white/30">
              {profile.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span>{formatNumber(profile.totalStars)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🪙</span>
                  <span>{formatNumber(profile.totalCoins)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">🔥</span>
                  <span>{profile.streak} {language === "hindi" ? "दिन" : language === "marathi" ? "दिवस" : language === "urdu" ? "دن" : "days"}</span>
                </div>
              </div>
              <div className="mt-2 text-sm opacity-80">
                {CLASS_LABELS[profile.classLevel]} • {LANGUAGE_LABELS[profile.preferredLanguage]}
              </div>
            </div>
            <button 
              onClick={handleEditProfile}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="mb-6">
          <Statistics 
            profile={profile} 
            progress={progress} 
            sessions={sessions} 
            language={language}
          />
        </div>
        
        {/* Game Progress */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === "hindi" ? "गेम प्रगति" : 
             language === "marathi" ? "खेळ प्रगती" :
             language === "urdu" ? "گیم ترقی" : "Game Progress"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["math_master", "word_wizard", "science_explorer", "brain_battle", "india_knowledge_quest"] as string[]).map(gameMode => (
              <ProgressCard 
                key={gameMode}
                gameMode={gameMode}
                progressList={progressByGame[gameMode] || []}
                language={language}
              />
            ))}
          </div>
        </div>
        
        {/* Badges */}
        <div className="mb-6">
          <BadgeDisplay badges={BADGES as unknown as any[]} language={language} />
        </div>
        
        {/* Recent Sessions */}
        <div className="mb-6">
          <RecentSessions sessions={sessions} language={language} />
        </div>
        
        {/* Clear Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
          >
            <span className="text-xl">🗑️</span>
            {language === "hindi" ? "सभी डेटा हटाएं" : 
             language === "marathi" ? "सर्व डेटा काढून टाका" :
             language === "urdu" ? "تمام ڈیٹا حذف کریں" : "Clear All Data"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            {language === "hindi" ? "यह क्रिया पूर्ववत नहीं की जा सकती" : 
             language === "marathi" ? "ही क्रिया मागे घेता येत नाही" :
             language === "urdu" ? "یہ عمل واپس نہیں لیا جا سکتا" : "This action cannot be undone"}
          </p>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => router.push("/games")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Calculator className="w-6 h-6" />
            <span className="text-xs">Games</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 py-2 px-4 text-purple-600"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
          <button 
            onClick={() => router.push("/settings")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
      
      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setShowEditModal(false)}
          onSave={(updatedProfile) => {
            setProfile(updatedProfile);
            setLanguage(updatedProfile.preferredLanguage);
          }}
          language={language}
        />
      )}
      
      {/* Clear Data Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {language === "hindi" ? "सभी डेटा हटाएं?" : 
                 language === "marathi" ? "सर्व डेटा काढून टाका?" :
                 language === "urdu" ? "تمام ڈیٹا حذف کریں؟" : "Clear All Data?"}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {language === "hindi" ? "यह क्रिया पूर्ववत नहीं की जा सकती। सभी प्रगति, सत्र और बैज हटा दिए जाएंगे।" : 
                 language === "marathi" ? "ही क्रिया मागे घेता येत नाही. सर्व प्रगती, सत्र आणि बॅज काढून टाकले जातील." :
                 language === "urdu" ? "یہ عمل واپس نہیں لیا جا سکتا۔ تمام ترقی، سیشن اور بیج حذف کر دیے جائیں گے۔" : "This action cannot be undone. All progress, sessions, and badges will be deleted."}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {language === "hindi" ? "रद्द करें" : 
                   language === "marathi" ? "रद्द करा" :
                   language === "urdu" ? "منسوخ کریں" : "Cancel"}
                </button>
                <button 
                  onClick={confirmClearData}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  {language === "hindi" ? "हटाएं" : 
                   language === "marathi" ? "काढून टाका" :
                   language === "urdu" ? "حذف کریں" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Profile Modal
function EditProfileModal({ 
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
  const [classLevel, setClassLevel] = useState<number>(profile.classLevel);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(profile.preferredLanguage);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      name,
      avatar,
      classLevel: classLevel as any,
      dailyGoal,
      preferredLanguage,
    };
    updateStudentProfile(updatedProfile);
    onSave(updatedProfile);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {language === "hindi" ? "प्रोफाइल संपादित करें" : 
               language === "marathi" ? "प्रोफाइल संपादित करा" :
               language === "urdu" ? "پروفائل میں ترمیم کریں" : "Edit Profile"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
          
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
          </div>
          
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
                placeholder="Enter your name"
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
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(cls => (
                  <option key={cls} value={cls}>
                    {CLASS_LABELS[cls as keyof typeof CLASS_LABELS]}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "hindi" ? "भाषा" : 
                 language === "marathi" ? "भाषा" :
                 language === "urdu" ? "زبان" : "Language"}
              </label>
              <select 
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {(["english", "hindi", "marathi", "urdu"] as Language[]).map(lang => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang as keyof typeof LANGUAGE_LABELS]}
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
