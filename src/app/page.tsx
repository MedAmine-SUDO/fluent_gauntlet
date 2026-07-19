"use client";

import { useState } from "react";
import CategoryPicker from "@/components/CategoryPicker";
import QuizEngine from "@/components/QuizEngine";
import { Category } from "@/data/questions";
import { Zap } from "lucide-react";

type Screen = "landing" | "quiz";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [quizConfig, setQuizConfig] = useState<{
    categories: Category[];
    count: number;
  } | null>(null);

  const handleStart = (categories: Category[], count: number) => {
    setQuizConfig({ categories, count });
    setScreen("quiz");
  };

  const handleBackToPicker = () => {
    setQuizConfig(null);
    setScreen("landing");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {screen === "landing" ? (
        <>
          {!quizConfig && (
            <div className="w-full max-w-lg">
              {/* Logo + Title */}
              <div className="text-center mb-8 animate-in fade-in duration-500">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
                  <Zap className="text-white" size={28} fill="white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                  English Gauntlet
                </h1>
                <p className="text-slate-500">
                  Master words, grammar, and nuance.
                </p>
              </div>

              <CategoryPicker onStart={handleStart} />
            </div>
          )}
        </>
      ) : (
        quizConfig && (
          <QuizEngine
            categories={quizConfig.categories}
            count={quizConfig.count}
            onBackToPicker={handleBackToPicker}
          />
        )
      )}
    </main>
  );
}
