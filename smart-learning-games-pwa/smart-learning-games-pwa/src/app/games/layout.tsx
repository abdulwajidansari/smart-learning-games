"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Settings, User, Sparkles } from "lucide-react";
import { getStudentProfile, getGameSettings, updateGameSettings, loadFromStorage } from "@/lib/utils";
import type { StudentProfile, GameSettings, Language, ClassLevel } from "@/types";
import { CLASS_LABELS, LANGUAGE_LABELS } from "@/types";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    setProfile(getStudentProfile());
    setSettings(getGameSettings());
  }, []);
  
  const handleBack = () => {
    router.push("/");
  };
  
  const handleSettings = () => {
    setShowSettings(true);
  };
  
  const handleProfile = () => {
    router.push("/profile");
  };
  
  const handleHome = () => {
    router.push("/");
  };
  
  if (!profile || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBack}
                className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-purple-600" />
              </button>
              <button 
                onClick={handleHome}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleProfile}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleSettings}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={handleHome}
            className="flex flex-col items-center gap-1 py-2 px-4 text-purple-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => router.push("/games")}
            className="flex flex-col items-center gap-1 py-2 px-4 text-purple-600"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">Games</span>
          </button>
          <button 
            onClick={handleProfile}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
          <button 
            onClick={handleSettings}
            className="flex flex-col items-center gap-1 py-2 px-4 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
      
      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal 
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(updatedSettings) => setSettings(updatedSettings)}
          language={profile.preferredLanguage}
        />
      )}
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
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-800">
                  {language === "hindi" ? "ध्वनि" : 
                   language === "marathi" ? "आवाज" :
                   language === "urdu" ? "آواز" : "Sound"}
                </h3>
                <p className="text-sm text-gray-500">Sound effects</p>
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
                <p className="text-sm text-gray-500">Question timer</p>
              </div>
              <button 
                onClick={() => handleChange("timerEnabled", !settings.timerEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.timerEnabled ? "bg-purple-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.timerEnabled ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-800 mb-3">Difficulty</h3>
              <div className="flex gap-2">
                {["easy", "medium", "hard"].map(diff => (
                  <button 
                    key={diff}
                    onClick={() => handleChange("difficulty", diff)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${settings.difficulty === diff 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "bg-white text-gray-600 border border-gray-300"}`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
