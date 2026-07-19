"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Question, Category } from "@/types";
import { allQuestions } from "@/data/questions";
import { useAuth } from "@/lib/supabase/provider";
import { recordAnswer, getStats } from "@/lib/stats";
import QuestionCard from "./QuestionCard";
import ResultsScreen from "./ResultsScreen";

interface Props {
  categories: Category[];
  count: number;
  onBackToPicker: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizEngine({
  categories,
  count,
  onBackToPicker,
}: Props) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const questionStartTime = useRef<number>(Date.now());

  const filteredPool = useMemo(() => {
    const pool = allQuestions.filter((q) => categories.includes(q.category));
    if (user && !reviewMode) {
      const stats = getStats(user.id);
      const seen = new Set(stats.seenQuestionIds);
      return shuffle(pool.filter((q) => !seen.has(q.id)));
    }
    return shuffle(pool);
  }, [categories, sessionKey, user, reviewMode]);

  const isInfinite = count === -1;

  if (filteredPool.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto text-center animate-in fade-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            All caught up!
          </h2>
          <p className="text-slate-500 mb-8">
            You&apos;ve seen every question in these categories.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setReviewMode(true);
                setSessionKey((p) => p + 1);
                setCurrentIndex(0);
                setScore(0);
              }}
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
            >
              Review All Again
            </button>
            <button
              onClick={onBackToPicker}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer"
            >
              Change Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayQuestions = useMemo(() => {
    if (isInfinite) {
      const result: Question[] = [];
      while (result.length < 500) {
        result.push(...shuffle(filteredPool));
      }
      return result;
    }
    return filteredPool.slice(0, Math.min(count, filteredPool.length));
  }, [filteredPool, count, isInfinite]);

  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  const handleAnswer = (isCorrect: boolean) => {
    const timeSpent = Date.now() - questionStartTime.current;

    if (isCorrect) setScore((prev) => prev + 1);

    if (user) {
      recordAnswer(
        user.id,
        displayQuestions[currentIndex].id,
        displayQuestions[currentIndex].category,
        isCorrect,
        timeSpent
      );
    }

    if (!isInfinite && currentIndex + 1 >= displayQuestions.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSessionKey((prev) => prev + 1);
    questionStartTime.current = Date.now();
  };

  if (isFinished) {
    return (
      <ResultsScreen
        score={score}
        total={displayQuestions.length}
        onRestart={handleRestart}
        onBackToPicker={onBackToPicker}
      />
    );
  }

  return (
    <QuestionCard
      question={displayQuestions[currentIndex]}
      onAnswer={handleAnswer}
      onQuit={onBackToPicker}
      currentIndex={currentIndex}
      totalQuestions={displayQuestions.length}
      isInfinite={isInfinite}
    />
  );
}
