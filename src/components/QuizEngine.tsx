"use client";

import { useState } from "react";
import { Question } from "@/data/questions";
import QuestionCard from "./QuestionCard";
import ResultsScreen from "./ResultsScreen";

interface Props {
  questions: Question[];
}

export default function QuizEngine({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <ResultsScreen
        score={score}
        total={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <QuestionCard
      question={questions[currentIndex]}
      onAnswer={handleAnswer}
      currentIndex={currentIndex}
      totalQuestions={questions.length}
    />
  );
}
