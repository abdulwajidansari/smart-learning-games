"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Heart,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CustomQuestion, GameSessionResult } from "@/lib/app-types";
import type { Difficulty, GameMode, LearningQuestion, LocalizedQuestion } from "@/lib/learning-content";
import { getQuestions } from "@/lib/learning-content";
import type { Language } from "@/lib/translations";
import { t } from "@/lib/translations";
import { localizeTopic } from "@/lib/topic-labels";

interface GameSessionProps {
  mode: GameMode;
  classLevel: number;
  language: Language;
  customQuestions: CustomQuestion[];
  soundEnabled: boolean;
  reducedMotion: boolean;
  storageStatus: "saving" | "saved" | "error";
  reviewQuestionIds?: string[];
  assignment?: { id: string; title: string; count: number; difficulty: Difficulty };
  onFinish: (result: GameSessionResult) => void;
  onExit: () => void;
  onReplay: () => void;
}

type Activity = "quiz" | "memory" | "tables";
type RoundPhase = "intro" | "playing" | "summary";
type RoundSummary = GameSessionResult;

interface MemoryCard {
  id: string;
  pair: string;
  emoji: string;
  matched: boolean;
}

const speechLocale: Record<Language, string> = { en: "en", hi: "hi", mr: "mr", ur: "ur" };
const tablePhrases: Record<Language, (table: number, step: number, answer: number) => string> = {
  en: (table, step, answer) => `${table} times ${step} is ${answer}`,
  hi: (table, step, answer) => `${table} गुणा ${step} बराबर ${answer}`,
  mr: (table, step, answer) => `${table} गुणिले ${step} म्हणजे ${answer}`,
  ur: (table, step, answer) => `${table} ضرب ${step} برابر ${answer}`,
};

const makeCustomQuestion = (item: CustomQuestion): LearningQuestion => {
  const localized: LocalizedQuestion = {
    prompt: item.question,
    options: item.options,
    explanation: item.explanation,
    hint: item.options[item.answerIndex] ? `${item.options[item.answerIndex].slice(0, 1)}…` : "",
  };
  return {
    id: item.id,
    mode: item.mode,
    topic: item.topic || "Teacher questions",
    minClass: item.classLevel,
    difficulty: item.difficulty,
    correctIndex: item.answerIndex,
    content: { [item.language]: localized } as Record<Language, LocalizedQuestion>,
    custom: true,
  };
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function playFeedbackSound(enabled: boolean, correct: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = correct ? 660 : 330;
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.15);
    oscillator.onended = () => void context.close();
  } catch {
    // Audio is optional; blocked or unavailable sound must never interrupt a game.
  }
}

export default function GameSession({
  mode,
  classLevel,
  language,
  customQuestions,
  soundEnabled,
  reducedMotion,
  storageStatus,
  reviewQuestionIds,
  assignment,
  onFinish,
  onExit,
  onReplay,
}: GameSessionProps) {
  const [activity, setActivity] = useState<Activity>("quiz");
  const [phase, setPhase] = useState<RoundPhase>("intro");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(assignment?.difficulty ?? "easy");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [questionCount, setQuestionCount] = useState(assignment?.count ?? 5);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [roundQuestions, setRoundQuestions] = useState<LearningQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [outcomes, setOutcomes] = useState<GameSessionResult["outcomes"]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [summary, setSummary] = useState<RoundSummary | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedMemoryCards, setSelectedMemoryCards] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryPairsFound, setMemoryPairsFound] = useState(0);
  const [memoryLocked, setMemoryLocked] = useState(false);
  const [memoryMessage, setMemoryMessage] = useState("");
  const [memoryPairCount, setMemoryPairCount] = useState(3);
  const [tableNumber, setTableNumber] = useState(2);
  const [activeTableStep, setActiveTableStep] = useState(1);
  const [tableReading, setTableReading] = useState(false);
  const [tableVoiceStyle, setTableVoiceStyle] = useState<"teacher" | "student">("teacher");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [matchingVoices, setMatchingVoices] = useState<SpeechSynthesisVoice[]>([]);
  const finishReported = useRef(false);
  const answerSubmitted = useRef(false);
  const readerRunId = useRef(0);
  const mismatchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechStep = useRef<(step: number, rate: number, runId: number, stopAfterOne?: boolean) => void>(() => {});

  const customForThisGame = useMemo(
    () => customQuestions
      .filter((item) => item.mode === mode && item.classLevel <= classLevel && item.language === language)
      .map(makeCustomQuestion),
    [customQuestions, mode, classLevel, language],
  );
  const availableQuestions = useMemo(() => {
    const bank = [...getQuestions(mode, classLevel, language), ...customForThisGame];
    if (reviewQuestionIds?.length) return bank.filter((item) => reviewQuestionIds.includes(item.id));
    return bank;
  }, [mode, classLevel, language, customForThisGame, reviewQuestionIds]);
  const availableTopics = useMemo(() => [...new Set(availableQuestions.map((item) => item.topic))], [availableQuestions]);
  const topicQuestions = useMemo(
    () => selectedTopic === "all" ? availableQuestions : availableQuestions.filter((item) => item.topic === selectedTopic),
    [availableQuestions, selectedTopic],
  );
  const currentQuestion = roundQuestions[questionIndex];
  const localizedQuestion = currentQuestion?.content[language];
  const memoryEmojis = ["🌙", "⭐", "🌈", "🌻", "🐢", "🍓", "🦋", "🚀", "🐠", "🍉", "🌼", "🪁"];

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(speechLocale[language]));
      setMatchingVoices(matching);
      setSpeechSupported(matching.length > 0);
    };
    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
  }, [language]);

  useEffect(() => {
    return () => {
      readerRunId.current += 1;
      if (mismatchTimeout.current) clearTimeout(mismatchTimeout.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing" || paused || summary) return;
    const timerId = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
      setSecondsRemaining((previous) => previous === null ? null : Math.max(0, previous - 1));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [phase, paused, summary]);

  const completeQuiz = useCallback(() => {
    if (summary) return;
    setSummary({
      mode,
      score,
      attempted: attemptedCount,
      correct: correctCount,
      durationSeconds: elapsedSeconds,
      outcomes,
      assignmentId: assignment?.id,
      assignmentTitle: assignment?.title,
    });
    setPhase("summary");
    setPaused(false);
  }, [summary, mode, score, attemptedCount, correctCount, elapsedSeconds, outcomes, assignment]);

  useEffect(() => {
    if (phase === "playing" && !paused && secondsRemaining === 0 && activity === "quiz") completeQuiz();
  }, [phase, paused, secondsRemaining, activity, completeQuiz]);

  useEffect(() => {
    if (phase === "summary" && summary && !finishReported.current) {
      finishReported.current = true;
      onFinish(summary);
    }
  }, [phase, summary, onFinish]);

  const speakText = useCallback((text: string) => {
    if (!speechSupported || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = `${speechLocale[language]}-${language === "en" ? "US" : language === "ur" ? "PK" : "IN"}`;
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith(speechLocale[language]));
    if (voices[0]) utterance.voice = voices[0];
    window.speechSynthesis.speak(utterance);
  }, [speechSupported, language]);

  speechStep.current = (step, rate, runId, stopAfterOne = false) => {
    if (runId !== readerRunId.current || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const answer = tableNumber * step;
    const utterance = new SpeechSynthesisUtterance(tablePhrases[language](tableNumber, step, answer));
    utterance.lang = `${speechLocale[language]}-${language === "en" ? "US" : language === "ur" ? "PK" : "IN"}`;
    utterance.rate = rate;
    utterance.pitch = tableVoiceStyle === "teacher" ? 0.88 : 1.12;
    const preferredVoices = matchingVoices;
    if (preferredVoices.length) utterance.voice = tableVoiceStyle === "student" ? preferredVoices[preferredVoices.length - 1] : preferredVoices[0];
    utterance.onstart = () => setActiveTableStep(step);
    utterance.onend = () => {
      if (runId !== readerRunId.current) return;
      if (stopAfterOne || step >= 10) {
        setTableReading(false);
        return;
      }
      window.setTimeout(() => speechStep.current(step + 1, rate, runId), 140);
    };
    utterance.onerror = () => setTableReading(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopTableReading = () => {
    readerRunId.current += 1;
    setTableReading(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const readTable = (rate: number, startAt = 1, justOne = false) => {
    if (!speechSupported || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const nextRunId = readerRunId.current + 1;
    readerRunId.current = nextRunId;
    setTableReading(!justOne);
    speechStep.current(startAt, rate, nextRunId, justOne);
  };

  const startQuiz = () => {
    const preferred = shuffle(topicQuestions.filter((question) => question.difficulty === selectedDifficulty));
    const other = shuffle(topicQuestions.filter((question) => question.difficulty !== selectedDifficulty));
    const count = Math.max(0, Math.min(questionCount, topicQuestions.length));
    setRoundQuestions([...preferred, ...other].slice(0, count));
    setQuestionIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setHintVisible(false);
    setHintUsed(false);
    setScore(0);
    setCorrectCount(0);
    setAttemptedCount(0);
    setOutcomes([]);
    setElapsedSeconds(0);
    setSecondsRemaining(timerEnabled ? 60 : null);
    setPaused(false);
    setSummary(null);
    finishReported.current = false;
    answerSubmitted.current = false;
    setPhase("playing");
  };

  const startTables = () => {
    setElapsedSeconds(0);
    setSecondsRemaining(null);
    setSummary(null);
    finishReported.current = false;
    setActiveTableStep(1);
    setPhase("playing");
  };

  const startMemory = () => {
    const count = classLevel < 3 ? 3 : classLevel < 5 ? 4 : 6;
    setMemoryPairCount(count);
    const selectedEmojis = shuffle(memoryEmojis).slice(0, count);
    const deck = shuffle(selectedEmojis.flatMap((emoji, index) => [
      { id: `pair-${index}-a-${Math.random().toString(36).slice(2, 7)}`, pair: `pair-${index}`, emoji, matched: false },
      { id: `pair-${index}-b-${Math.random().toString(36).slice(2, 7)}`, pair: `pair-${index}`, emoji, matched: false },
    ]));
    setMemoryCards(deck);
    setSelectedMemoryCards([]);
    setMemoryMoves(0);
    setMemoryPairsFound(0);
    setMemoryLocked(false);
    setMemoryMessage("");
    setElapsedSeconds(0);
    setSecondsRemaining(null);
    setSummary(null);
    finishReported.current = false;
    setPhase("playing");
  };

  const finishTables = () => {
    setSummary({
      mode,
      score: 0,
      attempted: 0,
      correct: 0,
      durationSeconds: elapsedSeconds,
      outcomes: [],
      assignmentId: assignment?.id,
      assignmentTitle: assignment?.title,
    });
    setPhase("summary");
  };

  const flipMemoryCard = (card: MemoryCard) => {
    if (memoryLocked || card.matched || selectedMemoryCards.includes(card.id) || paused || phase !== "playing") return;
    setMemoryMessage("");
    if (selectedMemoryCards.length === 0) {
      setSelectedMemoryCards([card.id]);
      return;
    }
    const firstId = selectedMemoryCards[0];
    const first = memoryCards.find((item) => item.id === firstId);
    const nextMoves = memoryMoves + 1;
    setMemoryMoves(nextMoves);
    setSelectedMemoryCards([firstId, card.id]);
    if (first?.pair === card.pair) {
      const nextPairsFound = memoryPairsFound + 1;
      setMemoryCards((previous) => previous.map((item) => item.pair === card.pair ? { ...item, matched: true } : item));
      setMemoryPairsFound(nextPairsFound);
      setSelectedMemoryCards([]);
      setMemoryMessage(t(language, "matched"));
      playFeedbackSound(soundEnabled, true);
      if (nextPairsFound === memoryPairCount) {
        window.setTimeout(() => {
          setSummary({
            mode,
            score: nextPairsFound * 10,
            attempted: nextMoves,
            correct: nextPairsFound,
            durationSeconds: elapsedSeconds,
            outcomes: [],
            assignmentId: assignment?.id,
            assignmentTitle: assignment?.title,
          });
          setPhase("summary");
        }, reducedMotion ? 0 : 250);
      }
      return;
    }
    setMemoryLocked(true);
    setMemoryMessage(t(language, "tryAgainCards"));
    playFeedbackSound(soundEnabled, false);
    mismatchTimeout.current = setTimeout(() => {
      setSelectedMemoryCards([]);
      setMemoryLocked(false);
      setMemoryMessage("");
    }, reducedMotion ? 450 : 850);
  };

  const checkAnswer = () => {
    if (!currentQuestion || selectedOption === null || feedback !== null || answerSubmitted.current) return;
    answerSubmitted.current = true;
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setAttemptedCount((previous) => previous + 1);
    setOutcomes((previous) => [...previous, { id: currentQuestion.id, topic: currentQuestion.topic, correct: isCorrect }]);
    setFeedback(isCorrect ? "correct" : "incorrect");
    playFeedbackSound(soundEnabled, isCorrect);
    if (isCorrect) {
      const nextCorrect = correctCount + 1;
      const firstTryBonus = hintUsed ? 0 : 5;
      setScore((previous) => previous + 10 + firstTryBonus);
      setCorrectCount(nextCorrect);
    }
  };

  const nextQuestion = () => {
    if (feedback === null) return;
    if (questionIndex + 1 >= roundQuestions.length) {
      completeQuiz();
      return;
    }
    setQuestionIndex((previous) => previous + 1);
    answerSubmitted.current = false;
    setSelectedOption(null);
    setFeedback(null);
    setHintVisible(false);
    setHintUsed(false);
  };

  const togglePause = () => {
    if (activity === "tables" && !paused) stopTableReading();
    setPaused((previous) => !previous);
  };

  const requestExit = () => {
    if (phase === "playing") setShowExitConfirmation(true);
    else onExit();
  };

  const roundedAccuracy = summary?.attempted ? Math.round((summary.correct / summary.attempted) * 100) : 0;
  const currentVisible = currentQuestion && localizedQuestion;
  const selectedCount = Math.min(questionCount, topicQuestions.length);
  const modeTitleKey = mode === "math" ? "modeMath" : mode === "words" ? "modeWords" : mode === "science" ? "modeScience" : mode === "brain" ? "modeBrain" : "modeIndia";

  return (
    <div className={`game-session ${reducedMotion ? "reduce-motion" : ""}`}>
      <div className="game-topline">
        <button className="icon-button game-back" type="button" onClick={requestExit} aria-label={t(language, "exit")}>
          <ArrowLeft size={19} />
        </button>
        <div className="game-top-title">
          <span className="eyebrow">{t(language, "class")} {classLevel} · {t(language, modeTitleKey)}</span>
          <h1>{assignment?.title ?? t(language, modeTitleKey)}</h1>
        </div>
        {phase === "playing" && activity !== "tables" && (
          <div className="score-chip"><Sparkles size={15} /> {score} <span>{t(language, "score")}</span></div>
        )}
        <button className="icon-button game-exit" type="button" onClick={requestExit} aria-label={t(language, "exit")}>
          <X size={18} />
        </button>
      </div>

      {phase === "intro" && (
        <section className="game-intro-panel">
          <div className="game-intro-illustration" aria-hidden="true">
            {mode === "math" ? "🧮" : mode === "words" ? "🪄" : mode === "science" ? "🔭" : mode === "brain" ? "🧩" : "🗺️"}
          </div>
          <p className="eyebrow">{t(language, "getReady")}</p>
          <h2>{reviewQuestionIds?.length ? t(language, "practiceMissed") : mode === "math" && activity === "tables" ? t(language, "tableRhythm") : mode === "brain" && activity === "memory" ? t(language, "memoryMatch") : t(language, mode === "math" ? "modeMathDesc" : mode === "words" ? "modeWordsDesc" : mode === "science" ? "modeScienceDesc" : mode === "brain" ? "modeBrainDesc" : "modeIndiaDesc")}</h2>
          {assignment && <p className="assignment-ribbon"><CheckCircle2 size={16} /> {t(language, "assignment")}: {assignment.title}</p>}

          {(mode === "math" || mode === "brain") && !assignment && !reviewQuestionIds?.length && (
            <div className="activity-tabs" role="group" aria-label={t(language, "choose")}>
              <button type="button" className={activity === "quiz" ? "activity-tab active" : "activity-tab"} onClick={() => setActivity("quiz")}>
                <CircleHelp size={17} /> {t(language, "quizMode")}
              </button>
              {mode === "math" ? (
                <button type="button" className={activity === "tables" ? "activity-tab active" : "activity-tab"} onClick={() => setActivity("tables")}>
                  <Sparkles size={17} /> {t(language, "tableRhythm")}
                </button>
              ) : (
                <button type="button" className={activity === "memory" ? "activity-tab active" : "activity-tab"} onClick={() => setActivity("memory")}>
                  <Heart size={17} /> {t(language, "memoryMatch")}
                </button>
              )}
            </div>
          )}

          <div className="game-rules-box">
            <strong>{t(language, "rulesTitle")}</strong>
            <p>{t(language, "rulesDesc")}</p>
            <p>{t(language, "kindWords")}</p>
          </div>

          {activity === "quiz" && (
            <div className="game-options-grid">
              {availableTopics.length > 1 && (
                <label className="field-label">
                  {t(language, "topicFilter")}
                  <select value={selectedTopic} onChange={(event) => { setSelectedTopic(event.target.value); setQuestionCount(5); }}>
                    <option value="all">{t(language, "allTopics")}</option>
                    {availableTopics.map((topic) => <option value={topic} key={topic}>{localizeTopic(topic, language)}</option>)}
                  </select>
                </label>
              )}
              <label className="field-label">
                {t(language, "chooseLevel")}
                <select value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value as Difficulty)}>
                  <option value="easy">{t(language, "easy")}</option>
                  <option value="medium">{t(language, "medium")}</option>
                  <option value="hard">{t(language, "hard")}</option>
                </select>
              </label>
              <label className="field-label">
                {t(language, "questionCount")}
                <select value={selectedCount} onChange={(event) => setQuestionCount(Number(event.target.value))}>
                  {[...new Set([Math.min(5, topicQuestions.length), topicQuestions.length, selectedCount])].filter((count) => count > 0).map((count) => (
                    <option value={count} key={count}>{count === topicQuestions.length && count !== 5 ? `${t(language, "allQuestions")} (${count})` : `${count} ${t(language, "selectedQuestions")}`}</option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                {t(language, "optionalTimer")}
                <select value={timerEnabled ? "timed" : "none"} onChange={(event) => setTimerEnabled(event.target.value === "timed")}>
                  <option value="none">{t(language, "noTimer")}</option>
                  <option value="timed">{t(language, "timed")}</option>
                </select>
              </label>
            </div>
          )}

          {activity === "memory" && <p className="memory-instruction"><Heart size={17} /> {t(language, "memoryInstruction")}</p>}
          {activity === "tables" && <p className="memory-instruction"><Volume2 size={17} /> {t(language, "supportHelp")}</p>}
          {availableQuestions.length === 0 && activity === "quiz" && <p className="form-error" role="status">{t(language, "noQuestions")}</p>}
          {assignment && availableQuestions.length === 0 && <p className="form-error" role="status">{t(language, "noQuestions")}</p>}

          <div className="game-intro-actions">
            <button className="button button-primary button-large" type="button" onClick={activity === "memory" ? startMemory : activity === "tables" ? startTables : startQuiz} disabled={activity === "quiz" && availableQuestions.length === 0}>
              <Play size={18} fill="currentColor" /> {activity === "memory" ? t(language, "startMemory") : activity === "tables" ? t(language, "start") : t(language, "start")}
            </button>
            <button className="button button-quiet" type="button" onClick={onExit}>{t(language, "backHome")}</button>
          </div>
        </section>
      )}

      {phase === "playing" && activity === "quiz" && currentVisible && (
        <section className="quiz-panel">
          <div className="quiz-progress-row">
            <span>{t(language, "question")} <strong>{questionIndex + 1}</strong> {t(language, "of")} {roundQuestions.length}</span>
            <div className="quiz-tools">
              {secondsRemaining !== null && <span className="timer-pill"><Clock3 size={15} /> {secondsRemaining}s</span>}
              <span className="score-chip score-chip-small"><Sparkles size={14} /> {score}</span>
              <button className="icon-button" type="button" onClick={togglePause} aria-label={t(language, "pause")}><Pause size={17} /></button>
              <button className="icon-button" type="button" onClick={() => { setPhase("intro"); setPaused(false); setSecondsRemaining(null); }} aria-label={t(language, "restart")}><RotateCcw size={16} /></button>
            </div>
          </div>
          <div className="quiz-progress-track"><div style={{ width: `${Math.max(5, ((questionIndex + (feedback ? 1 : 0)) / roundQuestions.length) * 100)}%` }} /></div>
          <div className="quiz-question-heading">
            <div>
              <span className="topic-pill">{localizeTopic(currentQuestion.topic, language)}</span>
              <h2 dir={language === "ur" ? "rtl" : "auto"}>{localizedQuestion.prompt}</h2>
            </div>
            <button className="listen-button" type="button" onClick={() => speakText(localizedQuestion.prompt)} disabled={!speechSupported} title={!speechSupported ? t(language, "voiceUnavailable") : t(language, "hearQuestion")}>
              <Volume2 size={17} /> <span>{t(language, "hearQuestion")}</span>
            </button>
          </div>
          {!speechSupported && <p className="speech-fallback">{t(language, "voiceUnavailable")}</p>}
          <div className="answer-grid" role="group" aria-label={t(language, "answer")}>
            {localizedQuestion.options.map((option, index) => {
              const selected = selectedOption === index;
              const isCorrectOption = feedback !== null && index === currentQuestion.correctIndex;
              const isWrongSelected = feedback === "incorrect" && selected;
              return (
                <button
                  className={`answer-option ${selected ? "selected" : ""} ${isCorrectOption ? "answer-correct" : ""} ${isWrongSelected ? "answer-wrong" : ""}`}
                  type="button"
                  key={`${currentQuestion.id}-${index}`}
                  onClick={() => { if (feedback === null) setSelectedOption(index); }}
                  disabled={feedback !== null}
                  aria-pressed={selected}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span dir={language === "ur" ? "rtl" : "auto"}>{option}</span>
                  {isCorrectOption && <CheckCircle2 size={18} className="answer-mark" aria-label={t(language, "correctAnswerLabel")} />}
                </button>
              );
            })}
          </div>
          {feedback ? (
            <div className={`answer-feedback ${feedback === "correct" ? "feedback-correct" : "feedback-gentle"}`} role="status" aria-live="polite">
              <div className="feedback-title">{feedback === "correct" ? <CheckCircle2 size={20} /> : <Heart size={19} />} {feedback === "correct" ? t(language, "correct") : t(language, "notQuite")}</div>
              {feedback === "incorrect" && <p><strong>{t(language, "correctAnswerLabel")}:</strong> {localizedQuestion.options[currentQuestion.correctIndex]}</p>}
              <p><strong>{t(language, "explanationLabel")}:</strong> {localizedQuestion.explanation}</p>
            </div>
          ) : (
            <div className="quiz-action-row">
              <button className="button button-quiet hint-button" type="button" onClick={() => { if (!hintVisible) setHintUsed(true); setHintVisible((previous) => !previous); }}>
                <Lightbulb size={17} /> {hintVisible ? t(language, "hideHint") : t(language, "showHint")}
              </button>
              <button className="button button-primary" type="button" onClick={checkAnswer} disabled={selectedOption === null}>
                <Check size={17} /> {t(language, "checkAnswer")}
              </button>
            </div>
          )}
          {hintVisible && feedback === null && <p className="hint-callout" role="note"><Lightbulb size={16} /> {localizedQuestion.hint}</p>}
          {feedback && (
            <div className="quiz-action-row feedback-actions">
              <span className="points-note">{feedback === "correct" ? `+${hintUsed ? 10 : 15}` : "0"} {t(language, "score")}</span>
              <button className="button button-primary" type="button" onClick={nextQuestion}>
                {questionIndex + 1 >= roundQuestions.length ? t(language, "finishGame") : t(language, "nextQuestion")} <ChevronRight size={17} />
              </button>
            </div>
          )}
          <p className="patient-note"><Heart size={14} /> {t(language, "supportHelp")}</p>
        </section>
      )}

      {phase === "playing" && activity === "tables" && (
        <section className="table-practice-panel">
          <div className="quiz-progress-row">
            <span>{t(language, "tableRhythm")}</span>
            <div className="quiz-tools">
              <span className="timer-pill"><Clock3 size={15} /> {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, "0")}</span>
              <button className="icon-button" type="button" onClick={togglePause} aria-label={t(language, "pause")}><Pause size={17} /></button>
              <button className="icon-button" type="button" onClick={() => { stopTableReading(); setPhase("intro"); }} aria-label={t(language, "restart")}><RotateCcw size={16} /></button>
            </div>
          </div>
          <div className="table-controls">
            <label className="field-label">
              {t(language, "selectTable")}
              <select value={tableNumber} onChange={(event) => { setTableNumber(Number(event.target.value)); stopTableReading(); setActiveTableStep(1); }}>
                {Array.from({ length: 19 }, (_, index) => index + 2).map((number) => <option value={number} key={number}>{number}</option>)}
              </select>
            </label>
            <label className="field-label">
              {t(language, "chooseLevel")}
              <select value={tableVoiceStyle} onChange={(event) => setTableVoiceStyle(event.target.value as "teacher" | "student")}>
                <option value="teacher">{t(language, "teacherVoice")}</option>
                <option value="student">{t(language, "studentVoice")}</option>
              </select>
            </label>
          </div>
          <div className="table-rhythm-heading">
            <div className="table-number-bubble">{tableNumber}</div>
            <div><span className="eyebrow">{t(language, "timesTable")}</span><h2>{tableNumber} × 1–10</h2></div>
          </div>
          <div className="times-table-list" aria-live="polite">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((step) => (
              <div className={`times-table-row ${activeTableStep === step ? "active" : ""}`} key={step}>
                <span>{tableNumber} × {step}</span><span>=</span><strong>{tableNumber * step}</strong>
              </div>
            ))}
          </div>
          <div className="table-action-row">
            <button className="button button-primary" type="button" onClick={() => readTable(1)} disabled={!speechSupported || tableReading || paused} title={!speechSupported ? t(language, "voiceUnavailable") : undefined}>
              <Volume2 size={17} /> {t(language, "readAloud")}
            </button>
            <button className="button button-secondary" type="button" onClick={() => readTable(0.72)} disabled={!speechSupported || tableReading || paused}>
              <Volume2 size={17} /> {t(language, "slow")}
            </button>
            <button className="button button-quiet" type="button" onClick={() => readTable(0.9, activeTableStep, true)} disabled={!speechSupported || paused}>
              <RotateCcw size={16} /> {t(language, "repeat")}
            </button>
            {tableReading && <button className="button button-quiet" type="button" onClick={stopTableReading}><Pause size={16} /> {t(language, "pause")}</button>}
          </div>
          {!speechSupported && <p className="speech-fallback"><Volume2 size={15} /> {t(language, "voiceUnavailable")}</p>}
          <div className="table-finish-row"><span>{t(language, "supportHelp")}</span><button className="button button-quiet" type="button" onClick={finishTables}>{t(language, "finishPractice")}</button></div>
        </section>
      )}

      {phase === "playing" && activity === "memory" && (
        <section className="memory-panel">
          <div className="quiz-progress-row">
            <span>{t(language, "memoryInstruction")}</span>
            <div className="quiz-tools">
              <span className="memory-counter">{t(language, "moves")}: <strong>{memoryMoves}</strong></span>
              <span className="memory-counter">{t(language, "pairsFound")}: <strong>{memoryPairsFound}/{memoryPairCount}</strong></span>
              <button className="icon-button" type="button" onClick={togglePause} aria-label={t(language, "pause")} disabled={memoryLocked}><Pause size={17} /></button>
              <button className="icon-button" type="button" onClick={startMemory} aria-label={t(language, "restart")}><RotateCcw size={16} /></button>
            </div>
          </div>
          <div className="memory-progress-track"><div style={{ width: `${(memoryPairsFound / memoryPairCount) * 100}%` }} /></div>
          <div className={`memory-card-grid pairs-${memoryPairCount}`}>
            {memoryCards.map((card, index) => {
              const revealed = card.matched || selectedMemoryCards.includes(card.id);
              return (
                <button
                  type="button"
                  className={`memory-card ${revealed ? "revealed" : ""} ${card.matched ? "matched" : ""}`}
                  key={card.id}
                  onClick={() => flipMemoryCard(card)}
                  aria-label={revealed ? `${t(language, "memoryMatch")} ${card.emoji}` : `${t(language, "memoryMatch")} ${index + 1}`}
                  aria-pressed={revealed}
                  disabled={paused || memoryLocked || card.matched || revealed}
                >
                  {revealed ? <span aria-hidden="true">{card.emoji}</span> : <span aria-hidden="true">✦</span>}
                </button>
              );
            })}
          </div>
          <div className="memory-status-row" aria-live="polite">
            <p>{memoryMessage || t(language, "supportHelp")}</p>
            <button className="button button-quiet" type="button" onClick={() => { setPhase("intro"); setElapsedSeconds(0); }}>{t(language, "restart")}</button>
          </div>
        </section>
      )}

      {phase === "summary" && summary && (
        <section className="round-summary-panel">
          <div className="summary-confetti" aria-hidden="true">✨ 🎉 ⭐</div>
          <div className="summary-emblem"><Sparkles size={32} /></div>
          <p className="eyebrow">{t(language, "roundSummary")}</p>
          <h2>{t(language, "gameComplete")}</h2>
          <p className="summary-encouragement">{summary.attempted === 0 ? t(language, "supportHelp") : summary.correct === summary.attempted ? t(language, "correct") : t(language, "keepTrying")}</p>
          <div className="summary-stats-grid">
            <div className="summary-stat"><Sparkles size={20} /><strong>{summary.score}</strong><span>{t(language, "pointsEarned")}</span></div>
            <div className="summary-stat"><CheckCircle2 size={20} /><strong>{summary.attempted ? `${roundedAccuracy}%` : "—"}</strong><span>{t(language, "accuracyThisRound")}</span></div>
            <div className="summary-stat"><Clock3 size={20} /><strong>{Math.floor(summary.durationSeconds / 60)}:{String(summary.durationSeconds % 60).padStart(2, "0")}</strong><span>{t(language, "timeThisRound")}</span></div>
            <div className="summary-stat"><Sparkles size={20} /><strong>{Math.floor(summary.score / 10)}</strong><span>{t(language, "starsEarned")}</span></div>
          </div>
          <p className="score-explainer">{t(language, "rulesDesc")}</p>
          <div className="summary-actions">
            <button className="button button-primary button-large" type="button" onClick={onReplay}><RotateCcw size={18} /> {t(language, "replay")}</button>
            <button className="button button-quiet" type="button" onClick={onExit}>{t(language, "backHome")}</button>
          </div>
          <p className={`save-caption ${storageStatus === "error" ? "save-caption-error" : ""}`} role="status"><CheckCircle2 size={14} /> {storageStatus === "saved" ? t(language, "localStorageNotice") : storageStatus === "saving" ? t(language, "savingLocal") : t(language, "dataError")}</p>
        </section>
      )}

      {phase === "playing" && paused && (
        <div className="game-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <div className="game-dialog-card">
            <div className="summary-emblem"><Pause size={28} /></div>
            <h2 id="pause-title">{t(language, "paused")}</h2>
            <p>{t(language, "supportHelp")}</p>
            <button className="button button-primary button-large" type="button" onClick={togglePause}><Play size={17} fill="currentColor" /> {t(language, "resume")}</button>
          </div>
        </div>
      )}

      {showExitConfirmation && (
        <div className="game-overlay" role="dialog" aria-modal="true" aria-labelledby="exit-title">
          <div className="game-dialog-card">
            <button className="icon-button dialog-close" type="button" onClick={() => setShowExitConfirmation(false)} aria-label={t(language, "close")}><X size={17} /></button>
            <div className="summary-emblem"><ArrowLeft size={26} /></div>
            <h2 id="exit-title">{t(language, "exit")}?</h2>
            <p>{t(language, "supportHelp")}</p>
            <div className="dialog-actions">
              <button className="button button-quiet" type="button" onClick={() => setShowExitConfirmation(false)}>{t(language, "cancel")}</button>
              <button className="button button-primary" type="button" onClick={onExit}>{t(language, "exit")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
