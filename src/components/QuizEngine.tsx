"use client";

import { useState, useMemo } from "react";
import { Question, Category, allQuestions } from "@/data/questions";
import QuestionCard from "./QuestionCard";
import ResultsScreen from "./ResultsScreen";

interface Props {
  categories: Category[];
  count: number; // 10, 20, 50, or -1 for infinite
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

export default function QuizEngine({ categories, count, onBackToPicker }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const filteredPool = useMemo(() => {
    const pool = allQuestions.filter((q) => categories.includes(q.category));
    return shuffle(pool);
  }, [categories, sessionKey]);

  const isInfinite = count === -1;
  const displayQuestions = useMemo(() => {
    if (isInfinite) {
      // For infinite, cycle through the pool
      const result: Question[] = [];
      while (result.length < 500) {
        result.push(...shuffle(filteredPool));
      }
      return result;
    }
    return filteredPool.slice(0, Math.min(count, filteredPool.length));
  }, [filteredPool, count, isInfinite]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);

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
