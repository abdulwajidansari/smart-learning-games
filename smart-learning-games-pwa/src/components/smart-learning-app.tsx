"use client";

import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpenText,
  BrainCircuit,
  Calculator,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Coins,
  Download,
  FileQuestion,
  FlaskConical,
  Flame,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Lightbulb,
  MapPinned,
  Moon,
  Pencil,
  Play,
  Plus,
  Printer,
  Save,
  Settings,
  Sparkles,
  Star,
  Sun,
  Target,
  Trash2,
  Trophy,
  Upload,
  UserRoundPlus,
  UsersRound,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameSession from "@/components/game-session";
import {
  avatarChoices,
  createEmptyAppData,
  createEmptyStats,
  createLearner,
} from "@/lib/app-types";
import type {
  AppData,
  BadgeId,
  ClassGroup,
  CustomQuestion,
  GameSessionResult,
  LearnerProfile,
  LearnerStats,
  PracticeAssignment,
} from "@/lib/app-types";
import { getQuestions, modes, validateQuestionBank } from "@/lib/learning-content";
import type { Difficulty, GameMode } from "@/lib/learning-content";
import { languageNames, t } from "@/lib/translations";
import { localizeTopic } from "@/lib/topic-labels";
import type { CopyKey, Language } from "@/lib/translations";

const STORAGE_KEY = "smart-learning-games-v1";
const modeMetadata: Record<GameMode, { title: CopyKey; description: CopyKey; icon: LucideIcon; emoji: string; color: string }> = {
  math: { title: "modeMath", description: "modeMathDesc", icon: Calculator, emoji: "🧮", color: "blue" },
  words: { title: "modeWords", description: "modeWordsDesc", icon: BookOpenText, emoji: "🪄", color: "pink" },
  science: { title: "modeScience", description: "modeScienceDesc", icon: FlaskConical, emoji: "🔭", color: "green" },
  brain: { title: "modeBrain", description: "modeBrainDesc", icon: BrainCircuit, emoji: "🧩", color: "purple" },
  india: { title: "modeIndia", description: "modeIndiaDesc", icon: MapPinned, emoji: "🗺️", color: "orange" },
};
const badgeTitles: Record<BadgeId, CopyKey> = {
  "first-game": "badgeFirst",
  "math-star": "badgeMath",
  "word-wizard": "badgeWords",
  "science-explorer": "badgeScience",
  "brain-champion": "badgeBrain",
  "india-explorer": "badgeIndia",
  "careful-thinker": "badgeAccuracy",
  "seven-day-learner": "badgeStreak",
};
const badgeEmojis: Record<BadgeId, string> = {
  "first-game": "🎈",
  "math-star": "🔢",
  "word-wizard": "📚",
  "science-explorer": "🔬",
  "brain-champion": "🧠",
  "india-explorer": "🪷",
  "careful-thinker": "🎯",
  "seven-day-learner": "🌈",
};
const allowedDifficulties: Difficulty[] = ["easy", "medium", "hard"];
const allowedLanguages: Language[] = ["en", "hi", "mr", "ur"];

interface ProfileDraft {
  name: string;
  classLevel: number;
  language: Language;
  avatar: (typeof avatarChoices)[number];
  dailyTargetMinutes: number;
}
interface QuestionDraft {
  mode: GameMode;
  language: Language;
  classLevel: number;
  topic: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
  difficulty: Difficulty;
}
interface GameLaunch {
  mode: GameMode;
  key: number;
  reviewIds?: string[];
  assignment?: PracticeAssignment;
}
interface DeferredInstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

type Screen = "home" | "games" | "progress" | "teacher" | "settings" | "game";

type UnknownRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is UnknownRecord => typeof value === "object" && value !== null && !Array.isArray(value);
const isMode = (value: unknown): value is GameMode => typeof value === "string" && (modes as string[]).includes(value);
const isLanguage = (value: unknown): value is Language => typeof value === "string" && allowedLanguages.includes(value as Language);
const isDifficulty = (value: unknown): value is Difficulty => typeof value === "string" && allowedDifficulties.includes(value as Difficulty);
const safeInteger = (value: unknown, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.floor(parsed))) : fallback;
};
const safeText = (value: unknown, fallback: string, maxLength = 300) => typeof value === "string" ? value.slice(0, maxLength) : fallback;
const makeId = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const dayDistance = (older: string, newer: string) => {
  if (!older || !newer) return Infinity;
  return Math.round((new Date(`${newer}T00:00:00`).getTime() - new Date(`${older}T00:00:00`).getTime()) / 86_400_000);
};
const modeTitle = (mode: GameMode, language: Language) => t(language, modeMetadata[mode].title);
const accuracyPercent = (correct: number, attempted: number) => attempted > 0 ? Math.round((correct / attempted) * 100) : null;
const escapeCsv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

function normalizeStats(value: unknown): LearnerStats {
  const base = createEmptyStats();
  if (!isRecord(value)) return base;
  const badges = Array.isArray(value.badges)
    ? value.badges.filter((badge): badge is BadgeId => typeof badge === "string" && badge in badgeTitles)
    : [];
  const topicStats: LearnerStats["topicStats"] = {};
  if (isRecord(value.topicStats)) {
    for (const [key, record] of Object.entries(value.topicStats)) {
      if (isRecord(record)) topicStats[key.slice(0, 160)] = {
        attempted: safeInteger(record.attempted, 0),
        correct: safeInteger(record.correct, 0),
      };
    }
  }
  const modeGames = { ...base.modeGames };
  if (isRecord(value.modeGames)) {
    for (const mode of modes) modeGames[mode] = safeInteger(value.modeGames[mode], 0);
  }
  const bestScores: LearnerStats["bestScores"] = {};
  if (isRecord(value.bestScores)) {
    for (const mode of modes) if (typeof value.bestScores[mode] === "number") bestScores[mode] = safeInteger(value.bestScores[mode], 0);
  }
  const missedQuestions = { ...base.missedQuestions };
  if (isRecord(value.missedQuestions)) {
    for (const mode of modes) {
      const ids = value.missedQuestions[mode];
      if (Array.isArray(ids)) missedQuestions[mode] = [...new Set(ids.filter((id): id is string => typeof id === "string").map((id) => id.slice(0, 120)))].slice(0, 100);
    }
  }
  const practiceByDay: Record<string, number> = {};
  if (isRecord(value.practiceByDay)) {
    for (const [date, seconds] of Object.entries(value.practiceByDay)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) practiceByDay[date] = safeInteger(seconds, 0);
    }
  }
  const recentSessions = Array.isArray(value.recentSessions) ? value.recentSessions.filter((item) => isRecord(item) && isMode(item.mode)).slice(0, 20).map((item) => ({
    id: safeText(item.id, makeId(), 120),
    mode: item.mode as GameMode,
    score: safeInteger(item.score, 0),
    attempted: safeInteger(item.attempted, 0),
    correct: safeInteger(item.correct, 0),
    durationSeconds: safeInteger(item.durationSeconds, 0),
    completedAt: safeText(item.completedAt, "", 40),
    ...(typeof item.assignmentId === "string" ? { assignmentId: item.assignmentId.slice(0, 120) } : {}),
    ...(typeof item.assignmentTitle === "string" ? { assignmentTitle: item.assignmentTitle.slice(0, 120) } : {}),
  })) : [];
  return {
    stars: safeInteger(value.stars, 0),
    coins: safeInteger(value.coins, 0),
    gamesPlayed: safeInteger(value.gamesPlayed, 0),
    questionsAttempted: safeInteger(value.questionsAttempted, 0),
    correctAnswers: safeInteger(value.correctAnswers, 0),
    practiceSeconds: safeInteger(value.practiceSeconds, 0),
    streak: safeInteger(value.streak, 0),
    lastPracticeDate: safeText(value.lastPracticeDate, "", 20),
    dailyDate: safeText(value.dailyDate, "", 20),
    dailyPracticeSeconds: safeInteger(value.dailyPracticeSeconds, 0),
    dailyCorrectAnswers: safeInteger(value.dailyCorrectAnswers, 0),
    practiceByDay,
    badges: [...new Set(badges)],
    bestScores,
    modeGames,
    recentSessions,
    topicStats,
    missedQuestions,
  };
}

function normalizeAppData(value: unknown): AppData {
  const empty = createEmptyAppData();
  if (!isRecord(value)) return empty;
  const learners = Array.isArray(value.learners) ? value.learners.filter(isRecord).slice(0, 50).map((row) => {
    const id = safeText(row.id, makeId(), 120);
    const learner = createLearner(id, safeText(row.name, "Learner", 32));
    return {
      ...learner,
      name: safeText(row.name, learner.name, 32).trim() || learner.name,
      classLevel: safeInteger(row.classLevel, 3, 1, 7),
      language: isLanguage(row.language) ? row.language : "en",
      avatar: avatarChoices.includes(row.avatar as (typeof avatarChoices)[number]) ? row.avatar as (typeof avatarChoices)[number] : learner.avatar,
      dailyTargetMinutes: safeInteger(row.dailyTargetMinutes, 10, 1, 60),
      darkTheme: row.darkTheme === true,
      soundEffects: row.soundEffects === true,
      reducedMotion: row.reducedMotion === true,
      completedAssignmentIds: Array.isArray(row.completedAssignmentIds) ? row.completedAssignmentIds.filter((id): id is string => typeof id === "string").slice(0, 500) : [],
      stats: normalizeStats(row.stats),
    };
  }) : [];
  const safeLearners = learners.length ? learners : empty.learners;
  const assignments: PracticeAssignment[] = Array.isArray(value.assignments) ? value.assignments.filter((item) => isRecord(item) && isMode(item.mode)).slice(0, 500).map((item) => ({
    id: safeText(item.id, makeId(), 120),
    title: safeText(item.title, "Practice", 80),
    mode: item.mode as GameMode,
    classLevel: safeInteger(item.classLevel, 1, 1, 7),
    questionCount: safeInteger(item.questionCount, 5, 1, 30),
    difficulty: isDifficulty(item.difficulty) ? item.difficulty : "easy",
    createdAt: safeText(item.createdAt, "", 40),
  })) : [];
  const classGroups: ClassGroup[] = Array.isArray(value.classGroups) ? value.classGroups.filter((item) => isRecord(item) && typeof item.name === "string").slice(0, 100).map((item) => ({
    id: safeText(item.id, makeId(), 120),
    name: safeText(item.name, "Class group", 60),
    classLevel: safeInteger(item.classLevel, 1, 1, 7),
    createdAt: safeText(item.createdAt, "", 40),
  })) : [];
  const customQuestions: CustomQuestion[] = Array.isArray(value.customQuestions) ? value.customQuestions.filter((item) => isRecord(item) && isMode(item.mode)).slice(0, 1000).flatMap((item) => {
    if (!isLanguage(item.language) || !Array.isArray(item.options) || item.options.length !== 4 || !item.options.every((option: unknown) => typeof option === "string" && option.trim()) || !Number.isInteger(item.answerIndex) || (item.answerIndex as number) < 0 || (item.answerIndex as number) > 3 || typeof item.question !== "string" || typeof item.explanation !== "string") return [];
    return [{
      id: safeText(item.id, makeId(), 120),
      mode: item.mode as GameMode,
      language: item.language,
      classLevel: safeInteger(item.classLevel, 1, 1, 7),
      topic: safeText(item.topic, "Teacher questions", 80),
      question: item.question.slice(0, 500),
      options: item.options.map((option: unknown) => (option as string).slice(0, 160)) as [string, string, string, string],
      answerIndex: item.answerIndex as number,
      explanation: item.explanation.slice(0, 700),
      difficulty: isDifficulty(item.difficulty) ? item.difficulty : "easy",
      createdAt: safeText(item.createdAt, "", 40),
    }];
  }) : [];
  const activeCandidate = typeof value.activeLearnerId === "string" ? value.activeLearnerId : "";
  return {
    activeLearnerId: safeLearners.some((learner) => learner.id === activeCandidate) ? activeCandidate : safeLearners[0].id,
    learners: safeLearners,
    assignments,
    classGroups,
    customQuestions,
  };
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') { field += '"'; index += 1; }
      else inQuotes = !inQuotes;
    } else if (character === "," && !inQuotes) {
      row.push(field.trim()); field = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = []; field = "";
    } else field += character;
  }
  row.push(field.trim());
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

function freshQuestionDraft(language: Language): QuestionDraft {
  return { mode: "math", language, classLevel: 3, topic: "Teacher questions", question: "", options: ["", "", "", ""], answerIndex: 0, explanation: "", difficulty: "easy" };
}

function getWeekSeconds(stats: LearnerStats, today: Date) {
  let total = 0;
  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    total += stats.practiceByDay[localDateKey(day)] ?? 0;
  }
  return total;
}

function ModeCard({
  mode,
  language,
  played,
  attempted,
  correct,
  onPlay,
  compact = false,
}: {
  mode: GameMode;
  language: Language;
  played: number;
  attempted: number;
  correct: number;
  onPlay: (mode: GameMode) => void;
  compact?: boolean;
}) {
  const meta = modeMetadata[mode];
  const Icon = meta.icon;
  return (
    <article className={`mode-card mode-${meta.color} ${compact ? "mode-card-compact" : ""}`}>
      <div className="mode-card-top">
        <div className="mode-icon-wrap" aria-hidden="true"><Icon size={24} strokeWidth={2.15} /></div>
        <span className="mode-emoji" aria-hidden="true">{meta.emoji}</span>
      </div>
      <h3>{modeTitle(mode, language)}</h3>
      <p>{t(language, meta.description)}</p>
      <div className="mode-card-foot">
        <span>{played} {t(language, "gamesPlayed")} <span className="metric-dot">·</span> {attempted} {t(language, "questionsAttempted")}</span>
        <button className="mode-play-button" type="button" onClick={() => onPlay(mode)} aria-label={`${t(language, "playNow")}: ${modeTitle(mode, language)}`}>
          <span>{t(language, compact ? "play" : "playNow")}</span><ArrowUpRight size={16} />
        </button>
      </div>
      {attempted > 0 && (
        <div className="mode-progress-track" aria-label={`${t(language, "accuracy")}: ${accuracyPercent(correct, attempted)}%`}>
          <div style={{ width: `${accuracyPercent(correct, attempted)}%` }} />
        </div>
      )}
    </article>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`nav-button ${active ? "active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>
      <Icon size={19} strokeWidth={active ? 2.25 : 1.9} /><span>{label}</span>{active && <span className="nav-active-dot" />}
    </button>
  );
}

export default function SmartLearningApp() {
  const [data, setData] = useState<AppData>(() => createEmptyAppData());
  const [hydrated, setHydrated] = useState(false);
  const [storageStatus, setStorageStatus] = useState<"loading" | "saving" | "saved" | "error">("loading");
  const [screen, setScreen] = useState<Screen>("home");
  const [gameLaunch, setGameLaunch] = useState<GameLaunch | null>(null);
  const [modal, setModal] = useState<"edit-profile" | "add-learner" | "clear-data" | null>(null);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft | null>(null);
  const [profileError, setProfileError] = useState("");
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft>(() => freshQuestionDraft("en"));
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [questionNotice, setQuestionNotice] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentMode, setAssignmentMode] = useState<GameMode>("math");
  const [assignmentClass, setAssignmentClass] = useState(3);
  const [assignmentCount, setAssignmentCount] = useState(5);
  const [assignmentDifficulty, setAssignmentDifficulty] = useState<Difficulty>("easy");
  const [assignmentError, setAssignmentError] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupClass, setGroupClass] = useState(3);
  const [groupError, setGroupError] = useState("");
  const [importNotice, setImportNotice] = useState("");
  const [online, setOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<DeferredInstallEvent | null>(null);
  const [toast, setToast] = useState("");
  const [csvBusy, setCsvBusy] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const language: Language = useMemo(() => data.learners.find((learner) => learner.id === data.activeLearnerId)?.language ?? "en", [data.learners, data.activeLearnerId]);
  const learner = data.learners.find((profile) => profile.id === data.activeLearnerId) ?? data.learners[0] ?? createLearner("learner-default");
  const stats = learner.stats;
  const todayKey = localDateKey();
  const todaySeconds = stats.dailyDate === todayKey ? stats.dailyPracticeSeconds : 0;
  const todayCorrect = stats.dailyDate === todayKey ? stats.dailyCorrectAnswers : 0;
  const weekSeconds = getWeekSeconds(stats, new Date());
  const weekGoalSeconds = learner.dailyTargetMinutes * 5 * 60;
  const bankValidationErrors = useMemo(() => validateQuestionBank(), []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setData(normalizeAppData(JSON.parse(saved) as unknown));
      setStorageStatus(saved ? "saved" : "saving");
    } catch {
      setStorageStatus("error");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageStatus("saved");
    } catch {
      setStorageStatus("error");
    }
  }, [data, hydrated]);

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as DeferredInstallEvent);
    };
    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("beforeinstallprompt", handleInstall);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    }
  }, [language]);

  useEffect(() => () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
  }, []);

  const updateAppData = useCallback((updater: (current: AppData) => AppData) => {
    setStorageStatus("saving");
    setData((current) => updater(current));
  }, []);

  const updateLearner = useCallback((learnerId: string, updater: (current: LearnerProfile) => LearnerProfile) => {
    updateAppData((current) => ({
      ...current,
      learners: current.learners.map((profile) => profile.id === learnerId ? updater(profile) : profile),
    }));
  }, [updateAppData]);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(""), 3400);
  }, []);

  const setCurrentPreference = <K extends "language" | "classLevel" | "darkTheme" | "soundEffects" | "reducedMotion">(key: K, value: LearnerProfile[K]) => {
    updateLearner(learner.id, (current) => ({ ...current, [key]: value }));
  };

  const openGame = (mode: GameMode, options?: { reviewIds?: string[]; assignment?: PracticeAssignment }) => {
    setGameLaunch({ mode, key: Date.now() + Math.random(), ...options });
    setScreen("game");
  };

  const reopenCurrentGame = () => {
    setGameLaunch((current) => current ? { ...current, key: Date.now() + Math.random() } : current);
  };

  const finishGame = useCallback((result: GameSessionResult) => {
    const now = new Date();
    const today = localDateKey(now);
    const completedAt = now.toISOString();
    updateAppData((current) => ({
      ...current,
      learners: current.learners.map((profile) => {
        if (profile.id !== current.activeLearnerId) return profile;
        const previous = profile.stats;
        const dailyPracticeSeconds = previous.dailyDate === today ? previous.dailyPracticeSeconds + result.durationSeconds : result.durationSeconds;
        const dailyCorrectAnswers = previous.dailyDate === today ? previous.dailyCorrectAnswers + result.correct : result.correct;
        const distance = dayDistance(previous.lastPracticeDate, today);
        const streak = distance === 0 ? Math.max(1, previous.streak) : distance === 1 ? previous.streak + 1 : 1;
        const gamesPlayed = previous.gamesPlayed + 1;
        const questionsAttempted = previous.questionsAttempted + result.attempted;
        const correctAnswers = previous.correctAnswers + result.correct;
        const badges = new Set(previous.badges);
        if (gamesPlayed >= 1) badges.add("first-game");
        if (result.mode === "math") badges.add("math-star");
        if (result.mode === "words") badges.add("word-wizard");
        if (result.mode === "science") badges.add("science-explorer");
        if (result.mode === "brain") badges.add("brain-champion");
        if (result.mode === "india") badges.add("india-explorer");
        if (questionsAttempted >= 10 && correctAnswers / questionsAttempted >= 0.9) badges.add("careful-thinker");
        if (streak >= 7) badges.add("seven-day-learner");
        const topicStats = { ...previous.topicStats };
        for (const outcome of result.outcomes) {
          const key = `${result.mode}:${outcome.topic}`;
          const topic = topicStats[key] ?? { attempted: 0, correct: 0 };
          topicStats[key] = { attempted: topic.attempted + 1, correct: topic.correct + (outcome.correct ? 1 : 0) };
        }
        const missedQuestions = { ...previous.missedQuestions, [result.mode]: [...(previous.missedQuestions[result.mode] ?? [])] };
        for (const outcome of result.outcomes) {
          const remembered = missedQuestions[result.mode];
          if (outcome.correct) missedQuestions[result.mode] = remembered.filter((id) => id !== outcome.id);
          else if (!remembered.includes(outcome.id)) remembered.push(outcome.id);
        }
        const practiceByDay = { ...previous.practiceByDay, [today]: (previous.practiceByDay[today] ?? 0) + result.durationSeconds };
        for (const date of Object.keys(practiceByDay)) if (dayDistance(date, today) > 35) delete practiceByDay[date];
        const bestScores = { ...previous.bestScores, [result.mode]: Math.max(previous.bestScores[result.mode] ?? 0, result.score) };
        const historyRecord = {
          id: makeId(),
          mode: result.mode,
          score: result.score,
          attempted: result.attempted,
          correct: result.correct,
          durationSeconds: result.durationSeconds,
          completedAt,
          ...(result.assignmentId ? { assignmentId: result.assignmentId } : {}),
          ...(result.assignmentTitle ? { assignmentTitle: result.assignmentTitle } : {}),
        };
        const nextStats: LearnerStats = {
          ...previous,
          stars: previous.stars + Math.floor(result.score / 10),
          coins: previous.coins + Math.floor(result.score / 5),
          gamesPlayed,
          questionsAttempted,
          correctAnswers,
          practiceSeconds: previous.practiceSeconds + result.durationSeconds,
          streak,
          lastPracticeDate: today,
          dailyDate: today,
          dailyPracticeSeconds,
          dailyCorrectAnswers,
          practiceByDay,
          badges: [...badges],
          bestScores,
          modeGames: { ...previous.modeGames, [result.mode]: (previous.modeGames[result.mode] ?? 0) + 1 },
          recentSessions: [historyRecord, ...previous.recentSessions].slice(0, 20),
          topicStats,
          missedQuestions,
        };
        return {
          ...profile,
          stats: nextStats,
          completedAssignmentIds: result.assignmentId && !profile.completedAssignmentIds.includes(result.assignmentId)
            ? [...profile.completedAssignmentIds, result.assignmentId]
            : profile.completedAssignmentIds,
        };
      }),
    }));
  }, [updateAppData]);

  const beginProfileModal = (kind: "edit-profile" | "add-learner") => {
    setProfileError("");
    if (kind === "edit-profile") {
      setProfileDraft({ name: learner.name, classLevel: learner.classLevel, language: learner.language, avatar: learner.avatar, dailyTargetMinutes: learner.dailyTargetMinutes });
    } else {
      setProfileDraft({ name: "", classLevel: 3, language: learner.language, avatar: learner.avatar, dailyTargetMinutes: learner.dailyTargetMinutes });
    }
    setModal(kind);
  };

  const saveProfileDraft = () => {
    if (!profileDraft?.name.trim()) { setProfileError(t(language, "nameRequired")); return; }
    if (modal === "add-learner") {
      const newLearner = {
        ...createLearner(makeId(), profileDraft.name.trim()),
        classLevel: safeInteger(profileDraft.classLevel, 3, 1, 7),
        language: profileDraft.language,
        avatar: profileDraft.avatar,
        dailyTargetMinutes: safeInteger(profileDraft.dailyTargetMinutes, 10, 1, 60),
      };
      updateAppData((current) => ({ ...current, activeLearnerId: newLearner.id, learners: [...current.learners, newLearner] }));
      notify(t(language, "learnerAdded"));
    } else if (modal === "edit-profile") {
      updateLearner(learner.id, (current) => ({
        ...current,
        name: profileDraft.name.trim(),
        classLevel: safeInteger(profileDraft.classLevel, 3, 1, 7),
        language: profileDraft.language,
        avatar: profileDraft.avatar,
        dailyTargetMinutes: safeInteger(profileDraft.dailyTargetMinutes, 10, 1, 60),
      }));
      notify(t(profileDraft.language, "savedLocally"));
    }
    setModal(null);
    setProfileDraft(null);
  };

  const clearAllLocalData = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setStorageStatus("saving");
      setData(createEmptyAppData());
      setModal(null);
      setScreen("home");
      setGameLaunch(null);
      notify(t(language, "dataCleared"));
    } catch {
      setStorageStatus("error");
      setModal(null);
      notify(t(language, "dataError"));
    }
  };

  const todayChallengeMode = modes[(Math.floor(Date.now() / 86_400_000) + learner.classLevel) % modes.length];
  const reviewMode = modes.find((mode) => (stats.missedQuestions[mode] ?? []).length > 0);
  const activeAssignments = data.assignments.filter((assignment) => assignment.classLevel === learner.classLevel).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pendingAssignments = activeAssignments.filter((assignment) => !learner.completedAssignmentIds.includes(assignment.id));
  const assignmentQuestionLimit = getQuestions(assignmentMode, assignmentClass, language).length + data.customQuestions.filter((question) => question.mode === assignmentMode && question.classLevel <= assignmentClass && question.language === language).length;
  const assignmentCountOptions = [...new Set([Math.min(5, assignmentQuestionLimit), assignmentQuestionLimit])].filter((count) => count > 0);
  const topicBreakdown = Object.entries(stats.topicStats).map(([key, value]) => {
    const separator = key.indexOf(":");
    return { mode: separator < 0 ? "math" as GameMode : key.slice(0, separator) as GameMode, topic: separator < 0 ? key : key.slice(separator + 1), ...value };
  });
  const needsPractice = topicBreakdown.filter((topic) => topic.attempted >= 3).sort((a, b) => a.correct / a.attempted - b.correct / b.attempted)[0];
  const growingStrength = topicBreakdown.filter((topic) => topic.attempted >= 3).sort((a, b) => b.correct / b.attempted - a.correct / a.attempted)[0];

  const addAssignment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignmentTitle.trim()) { setAssignmentError(t(language, "nameRequired")); return; }
    const assignment: PracticeAssignment = {
      id: makeId(),
      title: assignmentTitle.trim().slice(0, 80),
      mode: assignmentMode,
      classLevel: assignmentClass,
      questionCount: Math.min(assignmentCount, assignmentQuestionLimit),
      difficulty: assignmentDifficulty,
      createdAt: new Date().toISOString(),
    };
    updateAppData((current) => ({ ...current, assignments: [assignment, ...current.assignments] }));
    setAssignmentTitle("");
    setAssignmentError("");
    notify(t(language, "assignmentCreated"));
  };

  const addClassGroup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!groupName.trim()) { setGroupError(t(language, "nameRequired")); return; }
    const group: ClassGroup = { id: makeId(), name: groupName.trim().slice(0, 60), classLevel: groupClass, createdAt: new Date().toISOString() };
    updateAppData((current) => ({ ...current, classGroups: [group, ...current.classGroups] }));
    setGroupName("");
    setGroupError("");
    notify(t(language, "classGroupCreated"));
  };

  const updateDraftOption = (index: number, value: string) => {
    setQuestionDraft((current) => ({ ...current, options: current.options.map((option, optionIndex) => optionIndex === index ? value : option) as [string, string, string, string] }));
  };

  const saveCustomQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!questionDraft.question.trim() || !questionDraft.explanation.trim() || questionDraft.options.some((option) => !option.trim())) {
      setQuestionError(t(language, "questionRequired"));
      return;
    }
    const custom: CustomQuestion = {
      ...questionDraft,
      id: editingQuestionId ?? makeId(),
      topic: questionDraft.topic.trim().slice(0, 80) || "Teacher questions",
      question: questionDraft.question.trim().slice(0, 500),
      options: questionDraft.options.map((option) => option.trim().slice(0, 160)) as [string, string, string, string],
      explanation: questionDraft.explanation.trim().slice(0, 700),
      classLevel: safeInteger(questionDraft.classLevel, 1, 1, 7),
      createdAt: new Date().toISOString(),
    };
    updateAppData((current) => ({
      ...current,
      customQuestions: editingQuestionId
        ? current.customQuestions.map((item) => item.id === editingQuestionId ? custom : item)
        : [custom, ...current.customQuestions],
    }));
    setQuestionError("");
    setQuestionNotice(t(language, "customAdded"));
    setQuestionDraft(freshQuestionDraft(language));
    setEditingQuestionId(null);
  };

  const editCustomQuestion = (item: CustomQuestion) => {
    setQuestionDraft({ mode: item.mode, language: item.language, classLevel: item.classLevel, topic: item.topic, question: item.question, options: [...item.options], answerIndex: item.answerIndex, explanation: item.explanation, difficulty: item.difficulty });
    setEditingQuestionId(item.id);
    setQuestionError("");
    setQuestionNotice("");
    window.scrollTo({ top: 0, behavior: learner.reducedMotion ? "instant" : "smooth" });
  };

  const importQuestions = async (file: File | undefined) => {
    if (!file) return;
    setCsvBusy(true);
    setImportNotice("");
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) throw new Error("empty CSV");
      const headers = rows[0].map((header) => header.toLowerCase().trim());
      const required = ["mode", "question", "option1", "option2", "option3", "option4", "answer", "explanation"];
      if (required.some((header) => !headers.includes(header))) throw new Error("missing CSV column");
      const column = (row: string[], name: string) => row[headers.indexOf(name)] ?? "";
      const parsed: CustomQuestion[] = [];
      for (const row of rows.slice(1)) {
        const mode = column(row, "mode").toLowerCase() as GameMode;
        const langValue = column(row, "language").toLowerCase();
        const selectedLanguage = langValue ? langValue as Language : language;
        const classLevel = Number(column(row, "classlevel") || "1");
        const answerNumber = Number(column(row, "answer"));
        const options = [column(row, "option1"), column(row, "option2"), column(row, "option3"), column(row, "option4")];
        const question = column(row, "question").trim();
        const explanation = column(row, "explanation").trim();
        const difficultyValue = column(row, "difficulty").toLowerCase();
        if (!isMode(mode) || !isLanguage(selectedLanguage) || !Number.isInteger(classLevel) || classLevel < 1 || classLevel > 7 || !question || !explanation || options.some((option) => !option.trim()) || !Number.isInteger(answerNumber) || answerNumber < 1 || answerNumber > 4) continue;
        parsed.push({
          id: makeId(), mode, language: selectedLanguage, classLevel,
          topic: safeText(column(row, "topic"), "Teacher questions", 80) || "Teacher questions",
          question: question.slice(0, 500),
          options: options.map((option) => option.slice(0, 160)) as [string, string, string, string],
          answerIndex: answerNumber - 1,
          explanation: explanation.slice(0, 700),
          difficulty: isDifficulty(difficultyValue) ? difficultyValue : "medium",
          createdAt: new Date().toISOString(),
        });
      }
      if (!parsed.length) throw new Error("no valid rows");
      updateAppData((current) => ({ ...current, customQuestions: [...parsed, ...current.customQuestions].slice(0, 1000) }));
      setImportNotice(`${parsed.length} ${t(language, "imported")}. ${t(language, "importedOk")}`);
    } catch {
      setImportNotice(t(language, "importError"));
    } finally {
      setCsvBusy(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const downloadCsv = (fileName: string, rows: string[][]) => {
    if (rows.length <= 1) { notify(t(language, "exportEmpty")); return; }
    const content = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportQuestionCsv = () => {
    const rows = [["mode", "language", "classLevel", "topic", "question", "option1", "option2", "option3", "option4", "answer", "explanation", "difficulty"]];
    for (const item of data.customQuestions) rows.push([item.mode, item.language, String(item.classLevel), item.topic, item.question, ...item.options, String(item.answerIndex + 1), item.explanation, item.difficulty]);
    downloadCsv("smart-learning-questions.csv", rows);
  };

  const exportProgressCsv = () => {
    const rows = [["nickname", "class", "gamesPlayed", "questionsAttempted", "correctAnswers", "accuracyPercent", "practiceMinutes", "streakDays"]];
    for (const profile of data.learners) rows.push([
      profile.name,
      String(profile.classLevel),
      String(profile.stats.gamesPlayed),
      String(profile.stats.questionsAttempted),
      String(profile.stats.correctAnswers),
      String(accuracyPercent(profile.stats.correctAnswers, profile.stats.questionsAttempted) ?? ""),
      String(Math.floor(profile.stats.practiceSeconds / 60)),
      String(profile.stats.streak),
    ]);
    downloadCsv("smart-learning-progress.csv", rows);
  };

  const installApp = async () => {
    if (!installPrompt) { notify(t(language, "installHint")); return; }
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") notify(t(language, "appInstall"));
    setInstallPrompt(null);
  };

  const navItems: { screen: Screen; label: CopyKey; icon: LucideIcon }[] = [
    { screen: "home", label: "home", icon: Home },
    { screen: "games", label: "games", icon: Gamepad2 },
    { screen: "progress", label: "progress", icon: ChartNoAxesColumnIncreasing },
    { screen: "teacher", label: "teacher", icon: GraduationCap },
    { screen: "settings", label: "settings", icon: Settings },
  ];

  if (!hydrated) {
    return <div className="app-loading"><div className="loading-mark"><Sparkles size={26} /></div><span>{t(language, "appName")}</span><div className="loading-dots" aria-label="Loading"><i /><i /><i /></div></div>;
  }

  const appDir = language === "ur" ? "rtl" : "ltr";
  const sectionTitle = screen === "home" ? t(language, "home") : screen === "games" || screen === "game" ? t(language, "games") : screen === "progress" ? t(language, "progress") : screen === "teacher" ? t(language, "teacherTitle") : t(language, "settings");

  return (
    <div className={`app-shell ${learner.darkTheme ? "theme-dark" : ""} ${learner.reducedMotion ? "reduce-motion" : ""}`} dir={appDir} lang={language}>
      <aside className="sidebar no-print">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={23} strokeWidth={2.5} /></div>
          <div><span className="brand-name">Smart Learning</span><span className="brand-subname">GAMES · GROW · GLOW</span></div>
        </div>
        <div className="sidebar-learning-card">
          <span className="sidebar-card-sparkle" aria-hidden="true">✦</span>
          <div className="sidebar-avatar">{learner.avatar}</div>
          <div className="sidebar-learner-name">{learner.name}</div>
          <div className="sidebar-learner-class">{t(language, "class")} {learner.classLevel}</div>
          <div className="sidebar-streak"><Flame size={14} fill="currentColor" /> {stats.streak} {t(language, "streak")}</div>
        </div>
        <span className="sidebar-section-label">{t(language, "learnPlayGrow")}</span>
        <nav className="sidebar-nav" aria-label={t(language, "home")}>
          {navItems.map((item) => <NavButton key={item.screen} label={t(language, item.label)} icon={item.icon} active={screen === item.screen || (item.screen === "games" && screen === "game")} onClick={() => setScreen(item.screen)} />)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-goal-card">
          <div className="sidebar-goal-heading"><Target size={16} /><span>{t(language, "dailyGoal")}</span></div>
          <div className="sidebar-goal-count"><strong>{Math.floor(todaySeconds / 60)}</strong><span>/ {learner.dailyTargetMinutes} {t(language, "minutes")}</span></div>
          <div className="goal-progress-track"><div style={{ width: `${Math.min(100, (todaySeconds / (learner.dailyTargetMinutes * 60)) * 100)}%` }} /></div>
        </div>
        <button className="sidebar-profile-button" type="button" onClick={() => beginProfileModal("edit-profile")}>
          <span className="mini-avatar">{learner.avatar}</span><span className="sidebar-profile-copy"><strong>{learner.name}</strong><small>{t(language, "editProfile")}</small></span><Pencil size={15} />
        </button>
      </aside>

      <div className="app-main-column">
        <header className="topbar no-print">
          <div className="topbar-section">
            <div className="mobile-brand-mark"><Sparkles size={21} /></div>
            <div><span className="topbar-kicker">{t(language, "learnPlayGrow")}</span><strong>{sectionTitle}</strong></div>
          </div>
          <div className="topbar-controls">
            <div className={`connection-pill ${online ? "connection-online" : "connection-offline"}`} title={online ? t(language, "online") : t(language, "offline")}>
              {online ? <Wifi size={15} /> : <WifiOff size={15} />}<span>{online ? t(language, "online") : t(language, "offline")}</span>
            </div>
            <label className="topbar-select-label">
              <span className="sr-only">{t(language, "class")}</span>
              <select className="topbar-select" value={learner.classLevel} onChange={(event) => setCurrentPreference("classLevel", Number(event.target.value))}>
                {Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}
              </select>
            </label>
            <label className="topbar-select-label language-select-label">
              <span className="sr-only">{t(language, "language")}</span>
              <select className="topbar-select" value={language} onChange={(event) => setCurrentPreference("language", event.target.value as Language)}>
                {allowedLanguages.map((item) => <option value={item} key={item}>{languageNames[item]}</option>)}
              </select>
            </label>
            {data.learners.length > 1 && (
              <label className="profile-switch-label"><span className="sr-only">{t(language, "switchLearner")}</span><select value={learner.id} onChange={(event) => updateAppData((current) => ({ ...current, activeLearnerId: event.target.value }))}>
                {data.learners.map((profile) => <option value={profile.id} key={profile.id}>{profile.avatar} {profile.name}</option>)}
              </select></label>
            )}
            <button className="topbar-add-learner" type="button" onClick={() => beginProfileModal("add-learner")} aria-label={t(language, "addLearner")} title={t(language, "addLearner")}><UserRoundPlus size={18} /></button>
          </div>
        </header>

        {storageStatus === "error" && (
          <div className="storage-warning no-print" role="status"><CircleAlert size={17} /><span>{t(language, "dataError")}</span></div>
        )}
        {!online && (
          <div className="offline-note no-print" role="status"><WifiOff size={16} /><span>{t(language, "offlineSupported")}</span></div>
        )}

        <main className={`main-content ${screen === "game" ? "game-content" : ""}`}>
          {screen === "home" && (
            <div className="dashboard-view">
              <section className="hero-panel">
                <div className="hero-copy">
                  <span className="hero-eyebrow"><Sparkles size={14} /> {t(language, "learnPlayGrow")}</span>
                  <p className="hero-greeting">{t(language, "welcomeBack")}, {learner.name}!</p>
                  <h1>{t(language, "welcome")}</h1>
                  <p className="hero-description">{t(language, "welcomeSubtitle")}</p>
                  <div className="hero-actions">
                    <button className="button button-primary hero-primary" type="button" onClick={() => openGame(stats.recentSessions[0]?.mode ?? "math")}>
                      <Play size={17} fill="currentColor" /> {stats.gamesPlayed > 0 ? t(language, "continuePlaying") : t(language, "playNow")}
                    </button>
                    <span className="hero-small-note"><Heart size={14} /> {t(language, "supportHelp")}</span>
                  </div>
                </div>
                <div className="hero-art" aria-label="A cheerful panda mascot cheering you on" role="img">
                  <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
                  <span className="hero-star hero-star-one">✦</span><span className="hero-star hero-star-two">✧</span><span className="hero-star hero-star-three">★</span>
                  <div className="hero-mascot"><span>🐼</span></div>
                  <div className="mascot-speech"><span>{t(language, "oneMoreTry")}</span><Heart size={13} fill="currentColor" /></div>
                </div>
              </section>

              <section className="stats-grid" aria-label={t(language, "progressSnapshot")}>
                <div className="stat-tile stat-stars"><span className="stat-icon"><Star size={18} fill="currentColor" /></span><span className="stat-label">{t(language, "totalStars")}</span><strong>{stats.stars}</strong><small>{stats.gamesPlayed} {t(language, "gamesPlayed")}</small></div>
                <div className="stat-tile stat-coins"><span className="stat-icon"><Coins size={18} /></span><span className="stat-label">{t(language, "coins")}</span><strong>{stats.coins}</strong><small>{stats.questionsAttempted} {t(language, "questionsAttempted")}</small></div>
                <div className="stat-tile stat-streak"><span className="stat-icon"><Flame size={18} fill="currentColor" /></span><span className="stat-label">{t(language, "streak")}</span><strong>{stats.streak}<small className="stat-unit">{t(language, "streak")}</small></strong><small>{t(language, "gamesPlayed")}: {stats.gamesPlayed}</small></div>
                <div className="stat-tile stat-time"><span className="stat-icon"><Clock3 size={18} /></span><span className="stat-label">{t(language, "todaysPractice")}</span><strong>{Math.floor(todaySeconds / 60)}<small className="stat-unit">{t(language, "minutes")}</small></strong><small>{Math.floor(todaySeconds % 60)}s / {learner.dailyTargetMinutes} {t(language, "minutes")}</small></div>
              </section>

              <section className="challenge-panel">
                <div className="challenge-decoration" aria-hidden="true"><span>⭐</span><span>✦</span></div>
                <div className="challenge-icon"><Target size={24} /></div>
                <div className="challenge-copy">
                  <span className="eyebrow">{t(language, "todayChallengeTag")}</span>
                  <h2>{todayCorrect >= 5 ? t(language, "challengeDone") : t(language, "dailyChallenge")}</h2>
                  <p>{todayCorrect >= 5 ? t(language, "goalReached") : t(language, "dailyChallengeDesc")}</p>
                  <div className="challenge-progress-row"><div className="challenge-progress-track"><div style={{ width: `${Math.min(100, (todayCorrect / 5) * 100)}%` }} /></div><span>{todayCorrect}/5</span></div>
                </div>
                <button className="button button-dark" type="button" onClick={() => openGame(todayChallengeMode)}>
                  {todayCorrect >= 5 ? t(language, "replay") : t(language, "startChallenge")} <ArrowRight size={17} />
                </button>
              </section>

              {pendingAssignments.length > 0 && (
                <section className="assignment-home-panel">
                  <div className="section-title-row">
                    <div><span className="eyebrow">{t(language, "assignedWork")}</span><h2>{t(language, "assignments")}</h2></div>
                    <span className="assignment-count-pill">{pendingAssignments.length}</span>
                  </div>
                  <div className="assignment-home-list">
                    {pendingAssignments.slice(0, 2).map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} language={language} done={false} onPlay={() => openGame(assignment.mode, { assignment })} />)}
                  </div>
                </section>
              )}

              <section className="section-block games-section">
                <div className="section-title-row">
                  <div><span className="eyebrow">{t(language, "learnPlayGrow")}</span><h2>{t(language, "exploreGames")}</h2><p>{t(language, "exploreSubtitle")}</p></div>
                  <button className="text-link-button" type="button" onClick={() => setScreen("games")}>{t(language, "viewAllGames")} <ChevronRight size={17} /></button>
                </div>
                <div className="mode-grid">
                  {modes.map((mode) => <ModeCard key={mode} mode={mode} language={language} played={stats.modeGames[mode] ?? 0} attempted={topicBreakdown.filter((item) => item.mode === mode).reduce((sum, item) => sum + item.attempted, 0)} correct={topicBreakdown.filter((item) => item.mode === mode).reduce((sum, item) => sum + item.correct, 0)} onPlay={openGame} />)}
                </div>
              </section>

              <section className="dashboard-lower-grid">
                <div className="content-card weekly-card">
                  <div className="card-heading-row"><div className="round-icon round-icon-purple"><CalendarDays size={19} /></div><span className="eyebrow">{t(language, "weeklyGoal")}</span></div>
                  <h3>{t(language, "weeklyGoalDesc")}</h3>
                  <div className="weekly-number"><strong>{Math.floor(weekSeconds / 60)}</strong><span>/ {learner.dailyTargetMinutes * 5} {t(language, "minutes")}</span></div>
                  <div className="weekly-progress-track"><div style={{ width: `${Math.min(100, (weekSeconds / weekGoalSeconds) * 100)}%` }} /></div>
                  <p className="muted-small">{t(language, "practiceTime")}: {Math.floor(stats.practiceSeconds / 60)} {t(language, "minutes")}</p>
                </div>
                <div className="content-card recent-card">
                  <div className="card-title-line"><h3>{t(language, "recentGames")}</h3><button className="text-link-button" type="button" onClick={() => setScreen("progress")}>{t(language, "seeAll")} <ChevronRight size={16} /></button></div>
                  {stats.recentSessions.length === 0 ? <div className="empty-state-small"><span>🪁</span><p>{t(language, "noRecent")}</p></div> : (
                    <ul className="recent-list">
                      {stats.recentSessions.slice(0, 3).map((session) => (
                        <li key={session.id}><span className={`recent-icon mode-icon-${modeMetadata[session.mode].color}`}>{modeMetadata[session.mode].emoji}</span><span className="recent-copy"><strong>{session.assignmentTitle ?? modeTitle(session.mode, language)}</strong><small>{formatDate(session.completedAt, language)} · {session.correct}/{session.attempted} {t(language, "questionsCorrect")}</small></span><span className="recent-score"><Sparkles size={14} /> {session.score}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="home-footer-row">
                <div className="earned-badges-card">
                  <div className="card-title-line"><h3>{t(language, "yourBadges")}</h3><span className="badge-count">{stats.badges.length}</span></div>
                  {stats.badges.length === 0 ? <p className="empty-badges-note"><Award size={17} /> {t(language, "noBadges")}</p> : <div className="badge-chips">{stats.badges.map((badge) => <span className="badge-chip" key={badge} title={t(language, badgeTitles[badge])}><span>{badgeEmojis[badge]}</span>{t(language, badgeTitles[badge])}</span>)}</div>}
                </div>
                {reviewMode && (
                  <div className="review-prompt-card"><div className="review-icon"><Lightbulb size={20} /></div><div><h3>{t(language, "missedPractice")}</h3><p>{t(language, "missedPracticeDesc")}</p></div><button className="button button-secondary" type="button" onClick={() => openGame(reviewMode, { reviewIds: stats.missedQuestions[reviewMode] })}>{t(language, "practiceMissed")} <ArrowRight size={16} /></button></div>
                )}
              </section>
            </div>
          )}

          {screen === "games" && (
            <div className="page-view">
              <section className="page-heading"><div><span className="eyebrow">{t(language, "learnPlayGrow")}</span><h1>{t(language, "exploreGames")}</h1><p>{t(language, "exploreSubtitle")}</p></div><div className="page-heading-art" aria-hidden="true">🎮</div></section>
              <div className="mode-grid mode-grid-full">{modes.map((mode) => <ModeCard key={mode} mode={mode} language={language} played={stats.modeGames[mode] ?? 0} attempted={topicBreakdown.filter((item) => item.mode === mode).reduce((sum, item) => sum + item.attempted, 0)} correct={topicBreakdown.filter((item) => item.mode === mode).reduce((sum, item) => sum + item.correct, 0)} onPlay={openGame} />)}</div>
              <div className="content-card brain-feature-card"><div className="brain-feature-icon">🧠</div><div><span className="eyebrow">{t(language, "memoryMatch")}</span><h2>{t(language, "memoryMatchDesc")}</h2><p>{t(language, "memoryInstruction")}</p></div><button className="button button-primary" type="button" onClick={() => openGame("brain")}>{t(language, "startMemory")} <ArrowRight size={16} /></button></div>
            </div>
          )}

          {screen === "progress" && (
            <div className="page-view progress-view">
              <section className="page-heading"><div><span className="eyebrow">{t(language, "progressSnapshot")}</span><h1>{t(language, "studentProgress")}</h1><p>{t(language, "progressIntro")}</p></div><div className="page-heading-art" aria-hidden="true">🌱</div></section>
              <section className="progress-stat-grid">
                <ProgressStat icon={Gamepad2} label={t(language, "gamesPlayed")} value={stats.gamesPlayed} color="purple" />
                <ProgressStat icon={CircleCheck} label={t(language, "questionsAttempted")} value={stats.questionsAttempted} color="blue" />
                <ProgressStat icon={Target} label={t(language, "accuracy")} value={`${accuracyPercent(stats.correctAnswers, stats.questionsAttempted) ?? 0}%`} color="green" />
                <ProgressStat icon={Clock3} label={t(language, "practiceTime")} value={`${Math.floor(stats.practiceSeconds / 60)} ${t(language, "minutes")}`} color="orange" />
              </section>
              <section className="content-card progress-game-card"><div className="card-title-line"><div><span className="eyebrow">{t(language, "studentProgress")}</span><h2>{t(language, "exploreGames")}</h2></div><span className="quiet-tag">{t(language, "localStorageNotice")}</span></div>
                <div className="progress-game-list">
                  {modes.map((mode) => {
                    const group = topicBreakdown.filter((topic) => topic.mode === mode);
                    const attempted = group.reduce((sum, topic) => sum + topic.attempted, 0);
                    const correct = group.reduce((sum, topic) => sum + topic.correct, 0);
                    const pct = accuracyPercent(correct, attempted);
                    const best = stats.bestScores[mode];
                    return <button type="button" className="progress-game-row" key={mode} onClick={() => openGame(mode)}><span className={`progress-game-icon mode-icon-${modeMetadata[mode].color}`}>{modeMetadata[mode].emoji}</span><span className="progress-game-copy"><strong>{modeTitle(mode, language)}</strong><small>{stats.modeGames[mode] ?? 0} {t(language, "gamesPlayed")} · {attempted} {t(language, "questionsAttempted")}</small><span className="progress-row-track"><i style={{ width: `${pct ?? 0}%` }} /></span></span><span className="progress-game-values"><strong>{pct === null ? "—" : `${pct}%`}</strong><small>{best === undefined ? `${t(language, "personalBest")}: —` : `${t(language, "personalBest")}: ${best}`}</small></span><ChevronRight size={17} /></button>;
                  })}
                </div>
              </section>
              <section className="progress-detail-grid">
                <div className="content-card topic-insight-card"><div className="card-title-line"><h3>{t(language, "topicToPractice")}</h3><Lightbulb size={18} /></div>{needsPractice ? <><p className="topic-insight-title">{localizeTopic(needsPractice.topic, language)}</p><p>{modeTitle(needsPractice.mode, language)} · {needsPractice.correct}/{needsPractice.attempted} {t(language, "questionsCorrect")}</p><button className="text-link-button" type="button" onClick={() => openGame(needsPractice.mode)}>{t(language, "playNow")} <ArrowRight size={16} /></button></> : <p className="muted-copy">{t(language, "noWeakTopics")}</p>}</div>
                <div className="content-card topic-insight-card strength-card"><div className="card-title-line"><h3>{t(language, "topicStrength")}</h3><Star size={18} /></div>{growingStrength ? <><p className="topic-insight-title">{localizeTopic(growingStrength.topic, language)}</p><p>{modeTitle(growingStrength.mode, language)} · {growingStrength.correct}/{growingStrength.attempted} {t(language, "questionsCorrect")}</p></> : <p className="muted-copy">{t(language, "noProgressYet")}</p>}</div>
              </section>
              {reviewMode && <section className="review-prompt-card progress-review-card"><div className="review-icon"><Lightbulb size={20} /></div><div><h3>{t(language, "missedPractice")}</h3><p>{t(language, "missedPracticeDesc")}</p></div><button className="button button-secondary" type="button" onClick={() => openGame(reviewMode, { reviewIds: stats.missedQuestions[reviewMode] })}>{t(language, "practiceMissed")} <ArrowRight size={16} /></button></section>}
              <section className="content-card history-card"><div className="card-title-line"><div><span className="eyebrow">{t(language, "recentGames")}</span><h2>{t(language, "progressIntro")}</h2></div></div>{stats.recentSessions.length === 0 ? <p className="muted-copy">{t(language, "noProgressYet")}</p> : <div className="history-table-wrap"><table className="history-table"><thead><tr><th>{t(language, "games")}</th><th>{t(language, "result")}</th><th>{t(language, "accuracy")}</th><th>{t(language, "practiceTime")}</th><th>{t(language, "topic")}</th></tr></thead><tbody>{stats.recentSessions.map((session) => <tr key={session.id}><td><span className={`table-mode-dot mode-icon-${modeMetadata[session.mode].color}`}>{modeMetadata[session.mode].emoji}</span>{session.assignmentTitle ?? modeTitle(session.mode, language)}<small>{formatDate(session.completedAt, language)}</small></td><td><Sparkles size={14} /> {session.score}</td><td>{accuracyPercent(session.correct, session.attempted) === null ? "—" : `${accuracyPercent(session.correct, session.attempted)}%`}</td><td>{Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s</td><td>{session.attempted ? `${session.correct}/${session.attempted}` : "—"}</td></tr>)}</tbody></table></div>}</section>
            </div>
          )}

          {screen === "teacher" && (
            <div className="page-view teacher-view">
              <section className="page-heading"><div><span className="eyebrow">{t(language, "localDemo")}</span><h1>{t(language, "teacherTitle")}</h1><p>{t(language, "teacherIntro")}</p></div><div className="page-heading-art" aria-hidden="true">🧑‍🏫</div></section>
              <div className="teacher-local-notice"><ShieldCheckIcon /><div><strong>{t(language, "localDemo")}</strong><p>{t(language, "teacherNotice")}</p></div></div>
              <section className="teacher-grid">
                <div className="content-card teacher-card assignment-builder-card"><div className="card-title-line"><div className="round-icon round-icon-blue"><Target size={19} /></div><div><h2>{t(language, "createAssignment")}</h2><p>{t(language, "assignedWork")}</p></div></div>
                  <form className="teacher-form" onSubmit={addAssignment}>
                    <label className="field-label">{t(language, "assignmentName")}<input maxLength={80} value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder={t(language, "assignmentName")} required /></label>
                    <div className="form-two-columns"><label className="field-label">{t(language, "subject")}<select value={assignmentMode} onChange={(event) => setAssignmentMode(event.target.value as GameMode)}>{modes.map((mode) => <option value={mode} key={mode}>{modeTitle(mode, language)}</option>)}</select></label><label className="field-label">{t(language, "targetClass")}<select value={assignmentClass} onChange={(event) => setAssignmentClass(Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}</select></label></div>
                    <div className="form-two-columns"><label className="field-label">{t(language, "questionCount")}<select value={Math.min(assignmentCount, assignmentQuestionLimit)} onChange={(event) => setAssignmentCount(Number(event.target.value))}>{assignmentCountOptions.map((count) => <option value={count} key={count}>{count === assignmentQuestionLimit && count !== 5 ? `${t(language, "allQuestions")} (${count})` : `${count} ${t(language, "selectedQuestions")}`}</option>)}</select></label><label className="field-label">{t(language, "difficulty")}<select value={assignmentDifficulty} onChange={(event) => setAssignmentDifficulty(event.target.value as Difficulty)}><option value="easy">{t(language, "easy")}</option><option value="medium">{t(language, "medium")}</option><option value="hard">{t(language, "hard")}</option></select></label></div>
                    {assignmentError && <p className="form-error" role="alert">{assignmentError}</p>}
                    <button className="button button-primary" type="submit"><Plus size={17} /> {t(language, "createAssignment")}</button>
                  </form>
                </div>
                <div className="content-card class-group-card"><div className="card-title-line"><div className="round-icon round-icon-purple"><UsersRound size={19} /></div><div><h2>{t(language, "classGroups")}</h2><p>{t(language, "savedLocally")}</p></div></div>
                  <form className="group-form" onSubmit={addClassGroup}><label className="field-label">{t(language, "classGroupName")}<input maxLength={60} value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder={t(language, "classGroupName")} required /></label><label className="field-label">{t(language, "class")}<select value={groupClass} onChange={(event) => setGroupClass(Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}</select></label>{groupError && <p className="form-error" role="alert">{groupError}</p>}<button className="button button-secondary" type="submit"><Plus size={17} /> {t(language, "createGroup")}</button></form>
                  {data.classGroups.length === 0 ? <p className="muted-copy group-empty">{t(language, "noClassGroups")}</p> : <ul className="group-list">{data.classGroups.map((group) => <li key={group.id}><span><strong>{group.name}</strong><small>{t(language, "class")} {group.classLevel}</small></span><button className="icon-button danger-icon" type="button" onClick={() => updateAppData((current) => ({ ...current, classGroups: current.classGroups.filter((item) => item.id !== group.id) }))} aria-label={`${t(language, "delete")}: ${group.name}`}><Trash2 size={16} /></button></li>)}</ul>}
                </div>
              </section>

              <section className="content-card teacher-roster-card"><div className="card-title-line"><div className="round-icon round-icon-green"><GraduationCap size={19} /></div><div><h2>{t(language, "learnerList")}</h2><p>{data.learners.length} · {t(language, "localStorageNotice")}</p></div><button className="button button-secondary button-small" type="button" onClick={() => beginProfileModal("add-learner")}><UserRoundPlus size={16} /> {t(language, "addLearner")}</button></div>
                <div className="roster-grid">{data.learners.map((profile) => <div className="roster-learner" key={profile.id}><span className="roster-avatar">{profile.avatar}</span><span className="roster-copy"><strong>{profile.name}</strong><small>{t(language, "class")} {profile.classLevel} · {profile.stats.gamesPlayed} {t(language, "gamesPlayed")}</small></span><span className="roster-accuracy">{accuracyPercent(profile.stats.correctAnswers, profile.stats.questionsAttempted) === null ? "—" : `${accuracyPercent(profile.stats.correctAnswers, profile.stats.questionsAttempted)}%`}<small>{t(language, "accuracy")}</small></span><button className="icon-button" type="button" onClick={() => { updateAppData((current) => ({ ...current, activeLearnerId: profile.id })); setProfileDraft({ name: profile.name, classLevel: profile.classLevel, language: profile.language, avatar: profile.avatar, dailyTargetMinutes: profile.dailyTargetMinutes }); setProfileError(""); setModal("edit-profile"); }} aria-label={`${t(language, "editProfile")}: ${profile.name}`}><Pencil size={16} /></button></div>)}</div>
              </section>

              <section className="content-card assignment-list-card"><div className="card-title-line"><div className="round-icon round-icon-orange"><FileQuestion size={19} /></div><div><h2>{t(language, "assignments")}</h2><p>{t(language, "savedLocally")}</p></div></div>{data.assignments.length === 0 ? <p className="muted-copy">{t(language, "noAssignments")}</p> : <div className="teacher-assignment-list">{data.assignments.map((assignment) => {
                const recipients = data.learners.filter((profile) => profile.classLevel === assignment.classLevel);
                const completeCount = recipients.filter((profile) => profile.completedAssignmentIds.includes(assignment.id)).length;
                return <div className="teacher-assignment-row" key={assignment.id}><span className="assignment-status-icon"><Target size={17} /></span><span className="teacher-assignment-copy"><strong>{assignment.title}</strong><small>{modeTitle(assignment.mode, language)} · {t(language, "class")} {assignment.classLevel} · {assignment.questionCount} {t(language, "selectedQuestions")}</small></span><span className="assignment-completion-count">{completeCount}/{recipients.length} {t(language, "assignmentDone")}</span><button className="icon-button danger-icon" type="button" onClick={() => updateAppData((current) => ({ ...current, assignments: current.assignments.filter((item) => item.id !== assignment.id) }))} aria-label={`${t(language, "delete")}: ${assignment.title}`}><Trash2 size={16} /></button></div>;
              })}</div>}</section>

              <section className="content-card question-studio-card"><div className="card-title-line"><div className="round-icon round-icon-pink"><Pencil size={19} /></div><div><h2>{editingQuestionId ? t(language, "editQuestion") : t(language, "customQuestions")}</h2><p>{t(language, "customQuestionsDesc")}</p></div></div>
                <form className="teacher-form question-form" onSubmit={saveCustomQuestion}>
                  <div className="form-three-columns"><label className="field-label">{t(language, "subject")}<select value={questionDraft.mode} onChange={(event) => setQuestionDraft((current) => ({ ...current, mode: event.target.value as GameMode }))}>{modes.map((mode) => <option value={mode} key={mode}>{modeTitle(mode, language)}</option>)}</select></label><label className="field-label">{t(language, "language")}<select value={questionDraft.language} onChange={(event) => setQuestionDraft((current) => ({ ...current, language: event.target.value as Language }))}>{allowedLanguages.map((item) => <option value={item} key={item}>{languageNames[item]}</option>)}</select></label><label className="field-label">{t(language, "targetClass")}<select value={questionDraft.classLevel} onChange={(event) => setQuestionDraft((current) => ({ ...current, classLevel: Number(event.target.value) }))}>{Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}</select></label></div>
                  <div className="form-three-columns"><label className="field-label">{t(language, "topic")}<input maxLength={80} value={questionDraft.topic} onChange={(event) => setQuestionDraft((current) => ({ ...current, topic: event.target.value }))} /></label><label className="field-label">{t(language, "difficulty")}<select value={questionDraft.difficulty} onChange={(event) => setQuestionDraft((current) => ({ ...current, difficulty: event.target.value as Difficulty }))}><option value="easy">{t(language, "easy")}</option><option value="medium">{t(language, "medium")}</option><option value="hard">{t(language, "hard")}</option></select></label></div>
                  <label className="field-label">{t(language, "customQuestion")}<textarea maxLength={500} rows={3} value={questionDraft.question} onChange={(event) => setQuestionDraft((current) => ({ ...current, question: event.target.value }))} required /></label>
                  <div className="teacher-options-grid">{questionDraft.options.map((option, index) => <label className="field-label" key={index}>{[t(language, "optionOne"), t(language, "optionTwo"), t(language, "optionThree"), t(language, "optionFour")][index]}<input maxLength={160} value={option} onChange={(event) => updateDraftOption(index, event.target.value)} required /></label>)}</div>
                  <div className="form-two-columns"><label className="field-label">{t(language, "correctAnswer")}<select value={questionDraft.answerIndex} onChange={(event) => setQuestionDraft((current) => ({ ...current, answerIndex: Number(event.target.value) }))}>{questionDraft.options.map((_, index) => <option key={index} value={index}>{[t(language, "optionOne"), t(language, "optionTwo"), t(language, "optionThree"), t(language, "optionFour")][index]}</option>)}</select></label><label className="field-label">{t(language, "explanation")}<textarea maxLength={700} rows={2} value={questionDraft.explanation} onChange={(event) => setQuestionDraft((current) => ({ ...current, explanation: event.target.value }))} required /></label></div>
                  {questionError && <p className="form-error" role="alert">{questionError}</p>}{questionNotice && <p className="form-success" role="status"><CheckCircle2 size={15} /> {questionNotice}</p>}
                  <div className="teacher-form-actions"><button className="button button-primary" type="submit"><Save size={16} /> {t(language, "addQuestion")}</button>{editingQuestionId && <button className="button button-quiet" type="button" onClick={() => { setEditingQuestionId(null); setQuestionDraft(freshQuestionDraft(language)); }}>{t(language, "cancel")}</button>}</div>
                </form>
                <div className="csv-tools-row"><div><strong>{t(language, "questionBank")}</strong><p>{t(language, "csvHint")}</p></div><div className="csv-buttons"><input ref={importInputRef} className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => void importQuestions(event.target.files?.[0])} aria-label={t(language, "importCsv")} /><button className="button button-secondary button-small" type="button" disabled={csvBusy} onClick={() => importInputRef.current?.click()}><Upload size={15} /> {csvBusy ? "…" : t(language, "importCsv")}</button><button className="button button-quiet button-small" type="button" onClick={exportQuestionCsv}><Download size={15} /> {t(language, "exportCsv")}</button></div></div>
                {importNotice && <p className={importNotice.includes(t(language, "importError")) ? "form-error" : "form-success"} role="status">{importNotice}</p>}
                {data.customQuestions.length === 0 ? <p className="muted-copy custom-empty">{t(language, "noCustomQuestions")}</p> : <div className="custom-question-list">{data.customQuestions.slice(0, 30).map((item) => <div className="custom-question-row" key={item.id}><span className="question-row-icon">{modeMetadata[item.mode].emoji}</span><span className="custom-question-copy"><strong>{item.question}</strong><small>{modeTitle(item.mode, language)} · {languageNames[item.language]} · {t(language, "class")} {item.classLevel}</small></span><button className="icon-button" type="button" onClick={() => editCustomQuestion(item)} aria-label={`${t(language, "editQuestion")}: ${item.question}`}><Pencil size={15} /></button><button className="icon-button danger-icon" type="button" onClick={() => updateAppData((current) => ({ ...current, customQuestions: current.customQuestions.filter((question) => question.id !== item.id) }))} aria-label={`${t(language, "deleteQuestion")}: ${item.question}`}><Trash2 size={15} /></button></div>)}</div>}
              </section>
              {bankValidationErrors.length > 0 && <div className="validation-warning" role="alert"><CircleAlert size={18} /><div><strong>{t(language, "questionBank")}</strong><ul>{bankValidationErrors.map((error) => <li key={error}>{error}</li>)}</ul></div></div>}
              <section className="content-card reports-card"><div className="card-title-line"><div className="round-icon round-icon-blue"><ChartNoAxesColumnIncreasing size={19} /></div><div><h2>{t(language, "reportTitle")}</h2><p>{t(language, "savedLocally")}</p></div></div><p className="muted-copy">{t(language, "teacherNotice")}</p><div className="report-actions"><button className="button button-secondary" type="button" onClick={exportProgressCsv}><Download size={16} /> {t(language, "exportProgress")}</button><button className="button button-quiet" type="button" onClick={() => window.print()}><Printer size={16} /> {t(language, "printReport")}</button></div></section>
            </div>
          )}

          {screen === "settings" && (
            <div className="page-view settings-view">
              <section className="page-heading"><div><span className="eyebrow">{t(language, "localStorageNotice")}</span><h1>{t(language, "settings")}</h1><p>{t(language, "settingsSaved")}</p></div><div className="page-heading-art" aria-hidden="true">⚙️</div></section>
              <section className="content-card settings-profile-card"><div className="settings-profile-hero"><span className="settings-avatar">{learner.avatar}</span><div><span className="eyebrow">{t(language, "profile")}</span><h2>{learner.name}</h2><p>{t(language, "class")} {learner.classLevel} · {languageNames[language]}</p></div><button className="button button-secondary" type="button" onClick={() => beginProfileModal("edit-profile")}><Pencil size={16} /> {t(language, "editProfile")}</button></div></section>
              <section className="settings-grid">
                <div className="content-card setting-card"><div className="setting-card-icon setting-icon-blue"><LanguagesIcon /><span><strong>{t(language, "language")}</strong><small>{t(language, "languageChanged")}</small></span></div><label className="field-label sr-only" htmlFor="settings-language">{t(language, "language")}</label><select id="settings-language" value={language} onChange={(event) => setCurrentPreference("language", event.target.value as Language)}>{allowedLanguages.map((item) => <option value={item} key={item}>{languageNames[item]}</option>)}</select></div>
                <div className="content-card setting-card"><div className="setting-card-icon setting-icon-purple"><GraduationCap size={20} /><span><strong>{t(language, "class")}</strong><small>{t(language, "classChanged")}</small></span></div><label className="field-label sr-only" htmlFor="settings-class">{t(language, "class")}</label><select id="settings-class" value={learner.classLevel} onChange={(event) => setCurrentPreference("classLevel", Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}</select></div>
              </section>
              <section className="content-card accessibility-card"><div className="card-title-line"><div className="round-icon round-icon-purple"><Accessibility size={19} /></div><div><h2>{t(language, "accessibility")}</h2><p>{t(language, "settingsUnavailable")}</p></div></div>
                <SettingToggle icon={learner.darkTheme ? Moon : Sun} label={t(language, "darkTheme")} enabled={learner.darkTheme} onToggle={() => setCurrentPreference("darkTheme", !learner.darkTheme)} />
                <SettingToggle icon={learner.soundEffects ? Volume2 : VolumeX} label={t(language, "soundEffects")} enabled={learner.soundEffects} onToggle={() => setCurrentPreference("soundEffects", !learner.soundEffects)} />
                <SettingToggle icon={Accessibility} label={t(language, "reducedMotion")} enabled={learner.reducedMotion} onToggle={() => setCurrentPreference("reducedMotion", !learner.reducedMotion)} />
              </section>
              <section className="content-card daily-settings-card"><div className="card-title-line"><div className="round-icon round-icon-orange"><Target size={19} /></div><div><h2>{t(language, "dailyGoal")}</h2><p>{t(language, "weeklyGoalDesc")}</p></div></div><div className="goal-setting-row"><label className="field-label" htmlFor="daily-goal-setting">{t(language, "dailyTarget")}</label><select id="daily-goal-setting" value={learner.dailyTargetMinutes} onChange={(event) => updateLearner(learner.id, (current) => ({ ...current, dailyTargetMinutes: Number(event.target.value) }))}>{[5, 10, 15, 20, 30].map((minutes) => <option value={minutes} key={minutes}>{minutes} {t(language, "minutes")}</option>)}</select></div></section>
              <section className="content-card local-data-card"><div className="local-data-icon"><ShieldCheckIcon /></div><div><h2>{t(language, "localStorageNotice")}</h2><p>{t(language, "localStorageDetail")}</p><p className="muted-small">{!online ? t(language, "offlineSupported") : t(language, "onlineFeaturesNote")}</p>{storageStatus === "saved" && <span className="save-state"><CheckCircle2 size={14} /> {t(language, "savedLocally")}</span>}{storageStatus === "error" && <span className="storage-error-text"><CircleAlert size={14} /> {t(language, "dataError")}</span>}{installPrompt && <button className="button button-secondary install-button" type="button" onClick={() => void installApp()}><Download size={16} /> {t(language, "appInstall")}</button>}</div></section>
              <section className="content-card clear-data-card"><div><h3>{t(language, "clearLocalData")}</h3><p>{t(language, "clearConfirmDesc")}</p></div><button className="button button-danger" type="button" onClick={() => setModal("clear-data")}><Trash2 size={16} /> {t(language, "clearLocalData")}</button></section>
            </div>
          )}

          {screen === "game" && gameLaunch && (
            <GameSession
              key={gameLaunch.key}
              mode={gameLaunch.mode}
              classLevel={learner.classLevel}
              language={language}
              customQuestions={data.customQuestions}
              soundEnabled={learner.soundEffects}
              reducedMotion={learner.reducedMotion}
              storageStatus={storageStatus === "saved" ? "saved" : storageStatus === "error" ? "error" : "saving"}
              reviewQuestionIds={gameLaunch.reviewIds}
              assignment={gameLaunch.assignment ? { id: gameLaunch.assignment.id, title: gameLaunch.assignment.title, count: gameLaunch.assignment.questionCount, difficulty: gameLaunch.assignment.difficulty } : undefined}
              onFinish={finishGame}
              onExit={() => { setScreen("home"); setGameLaunch(null); }}
              onReplay={reopenCurrentGame}
            />
          )}
        </main>

        <footer className="app-footer no-print"><span>Smart Learning Games</span><span>{t(language, "localStorageNotice")} · {t(language, "supportHelp")}</span><button className="footer-profile-link" type="button" onClick={() => beginProfileModal("edit-profile")}>{t(language, "profile")} <ArrowUpRight size={13} /></button></footer>
      </div>

      <nav className="mobile-bottom-nav no-print" aria-label={t(language, "home")}>
        {navItems.map((item) => <NavButton key={item.screen} label={t(language, item.label)} icon={item.icon} active={screen === item.screen || (item.screen === "games" && screen === "game")} onClick={() => setScreen(item.screen)} />)}
      </nav>

      {modal && (
        <div className="modal-backdrop no-print" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setModal(null); setProfileDraft(null); } }}>
          {modal !== "clear-data" ? (
            <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
              <button className="icon-button modal-close" type="button" onClick={() => { setModal(null); setProfileDraft(null); }} aria-label={t(language, "close")}><X size={18} /></button>
              <div className="modal-heading-icon">{modal === "add-learner" ? <UserRoundPlus size={22} /> : <Pencil size={21} />}</div>
              <span className="eyebrow">{t(language, "localStorageNotice")}</span>
              <h2 id="profile-modal-title">{modal === "add-learner" ? t(language, "addLearner") : t(language, "editProfile")}</h2>
              <p>{t(language, "localStorageDetail")}</p>
              {profileDraft && <div className="modal-form">
                <label className="field-label">{t(language, "learnerName")}<input maxLength={32} value={profileDraft.name} onChange={(event) => setProfileDraft((current) => current ? { ...current, name: event.target.value } : current)} autoFocus /></label>
                <fieldset className="avatar-fieldset"><legend>{t(language, "avatar")}</legend><div className="avatar-picker">{avatarChoices.map((avatar) => <button type="button" key={avatar} className={`avatar-choice ${profileDraft.avatar === avatar ? "selected" : ""}`} onClick={() => setProfileDraft((current) => current ? { ...current, avatar } : current)} aria-pressed={profileDraft.avatar === avatar}>{avatar}</button>)}</div></fieldset>
                <div className="form-two-columns"><label className="field-label">{t(language, "class")}<select value={profileDraft.classLevel} onChange={(event) => setProfileDraft((current) => current ? { ...current, classLevel: Number(event.target.value) } : current)}>{Array.from({ length: 7 }, (_, index) => index + 1).map((grade) => <option value={grade} key={grade}>{t(language, "class")} {grade}</option>)}</select></label><label className="field-label">{t(language, "language")}<select value={profileDraft.language} onChange={(event) => setProfileDraft((current) => current ? { ...current, language: event.target.value as Language } : current)}>{allowedLanguages.map((item) => <option value={item} key={item}>{languageNames[item]}</option>)}</select></label></div>
                <label className="field-label">{t(language, "dailyTarget")}<select value={profileDraft.dailyTargetMinutes} onChange={(event) => setProfileDraft((current) => current ? { ...current, dailyTargetMinutes: Number(event.target.value) } : current)}>{[5, 10, 15, 20, 30].map((minutes) => <option value={minutes} key={minutes}>{minutes} {t(language, "minutes")}</option>)}</select></label>
                {profileError && <p className="form-error" role="alert">{profileError}</p>}
                <div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => { setModal(null); setProfileDraft(null); }}>{t(language, "cancel")}</button><button className="button button-primary" type="button" onClick={saveProfileDraft}><Save size={16} /> {t(language, "saveChanges")}</button></div>
              </div>}
            </div>
          ) : (
            <div className="profile-modal clear-modal" role="dialog" aria-modal="true" aria-labelledby="clear-modal-title">
              <button className="icon-button modal-close" type="button" onClick={() => setModal(null)} aria-label={t(language, "close")}><X size={18} /></button>
              <div className="clear-modal-icon"><Trash2 size={24} /></div><h2 id="clear-modal-title">{t(language, "clearConfirmTitle")}</h2><p>{t(language, "clearConfirmDesc")}</p><div className="modal-actions"><button className="button button-quiet" type="button" onClick={() => setModal(null)}>{t(language, "cancel")}</button><button className="button button-danger" type="button" onClick={clearAllLocalData}><Trash2 size={16} /> {t(language, "clearEverything")}</button></div>
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast-message no-print" role="status"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}

function ProgressStat({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string | number; color: string }) {
  return <div className={`progress-stat progress-stat-${color}`}><span><Icon size={19} /></span><small>{label}</small><strong>{value}</strong></div>;
}

function AssignmentCard({ assignment, language, done, onPlay }: { assignment: PracticeAssignment; language: Language; done: boolean; onPlay: () => void }) {
  return <div className={`assignment-home-card ${done ? "assignment-complete" : ""}`}><span className="assignment-emoji">{modeMetadata[assignment.mode].emoji}</span><span className="assignment-home-copy"><strong>{assignment.title}</strong><small>{modeTitle(assignment.mode, language)} · {assignment.questionCount} {t(language, "selectedQuestions")}</small></span><button className={done ? "assignment-done-button" : "button button-secondary button-small"} type="button" onClick={onPlay}>{done ? <><Check size={15} /> {t(language, "assignmentDone")}</> : <>{t(language, "playNow")} <Play size={14} /></>}</button></div>;
}

function SettingToggle({ icon: Icon, label, enabled, onToggle }: { icon: LucideIcon; label: string; enabled: boolean; onToggle: () => void }) {
  return <div className="setting-toggle-row"><span className="setting-toggle-icon"><Icon size={18} /></span><span className="setting-toggle-label">{label}</span><button className={`toggle-switch ${enabled ? "enabled" : ""}`} type="button" role="switch" aria-checked={enabled} aria-label={label} onClick={onToggle}><span /></button></div>;
}

function ShieldCheckIcon() {
  return <div className="shield-check-icon"><CheckCircle2 size={18} /></div>;
}

function LanguagesIcon() {
  return <span className="languages-glyph" aria-hidden="true">文</span>;
}

function formatDate(value: string, language: Language) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return "—";
  return new Intl.DateTimeFormat(language === "en" ? "en-IN" : language === "ur" ? "ur-PK" : `${language}-IN`, { day: "numeric", month: "short" }).format(parsed);
}
