"use client";

import { useState } from "react";
import { Question, Category } from "@/data/questions";
import { CheckCircle2, XCircle, ChevronRight, ArrowRight } from "lucide-react";

const categoryColors: Record<
  Category,
  { bg: string; text: string; border: string; fill: string }
> = {
  Synonym: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    fill: "bg-sky-500",
  },
  Inverse: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    fill: "bg-violet-500",
  },
  Meaning: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    fill: "bg-rose-500",
  },
  Grammar: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    fill: "bg-amber-500",
  },
};

interface Props {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  currentIndex: number;
  totalQuestions: number;
  isInfinite: boolean;
}

export default function QuestionCard({
  question,
  onAnswer,
  currentIndex,
  totalQuestions,
  isInfinite,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const colors = categoryColors[question.category];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedIndex(index);
    setShowFeedback(true);
  };

  const handleNext = () => {
    onAnswer(selectedIndex === question.correctIndex);
    setSelectedIndex(null);
    setShowFeedback(false);
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return selectedIndex === index
        ? "border-indigo-400 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200"
        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50";
    }

    if (index === question.correctIndex)
      return "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200";
    if (index === selectedIndex && index !== question.correctIndex)
      return "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200";
    return "border-slate-200 bg-white opacity-40";
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span
          className={`text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
        >
          {question.category}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {isInfinite ? (
            `${currentIndex + 1}`
          ) : (
            `${currentIndex + 1} / ${totalQuestions}`
          )}
        </span>
      </div>

      {/* Progress Bar */}
      {!isInfinite && (
        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-10 overflow-hidden">
          <div
            className={`h-full ${colors.fill} rounded-full transition-all duration-700 ease-out`}
            style={{
              width: `${((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Difficulty Badge */}
      <span
        className={`inline-block text-[11px] font-bold uppercase tracking-wider mb-4 px-2 py-1 rounded ${
          question.difficulty === "Easy"
            ? "bg-emerald-100 text-emerald-700"
            : question.difficulty === "Medium"
              ? "bg-amber-100 text-amber-700"
              : question.difficulty === "Hard"
                ? "bg-orange-100 text-orange-700"
                : "bg-rose-100 text-rose-700"
        }`}
      >
        {question.difficulty}
      </span>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug mb-10">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={showFeedback}
            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group cursor-pointer disabled:cursor-default ${getOptionStyle(index)}`}
          >
            <span className="text-base font-medium pr-4">{option}</span>
            {showFeedback && index === question.correctIndex && (
              <CheckCircle2
                className="text-emerald-600 shrink-0"
                size={22}
              />
            )}
            {showFeedback &&
              index === selectedIndex &&
              index !== question.correctIndex && (
                <XCircle className="text-rose-600 shrink-0" size={22} />
              )}
            {!showFeedback && (
              <ChevronRight
                className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0"
                size={20}
              />
            )}
          </button>
        ))}
      </div>

      {/* Feedback + Next Button */}
      {showFeedback && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={`p-5 rounded-xl border ${
              selectedIndex === question.correctIndex
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <p
              className={`text-sm font-bold mb-1 ${
                selectedIndex === question.correctIndex
                  ? "text-emerald-800"
                  : "text-rose-800"
              }`}
            >
              {selectedIndex === question.correctIndex
                ? "Correct!"
                : "Not quite."}
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              {question.explanation}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="mt-4 w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Next Question
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
