"use client";

import { useState } from "react";
import QuizEngine from "@/components/QuizEngine";
import { dailyQuestions } from "@/data/questions";
import { Zap, BookOpen, Brain, ArrowRightLeft, Lightbulb, Target } from "lucide-react";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {!hasStarted ? (
        <div className="text-center max-w-lg animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Zap className="text-white" size={32} fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Daily English Gauntlet
          </h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Master synonyms, inverses, and exam tricks in just 10 minutes a day.
            Ready for your daily drill?
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { icon: Lightbulb, label: "Tips & Tricks", color: "text-amber-600 bg-amber-50 border-amber-200" },
              { icon: BookOpen, label: "Synonyms", color: "text-sky-600 bg-sky-50 border-sky-200" },
              { icon: ArrowRightLeft, label: "Inverses", color: "text-violet-600 bg-violet-50 border-violet-200" },
              { icon: Target, label: "Meaning & Nuance", color: "text-rose-600 bg-rose-50 border-rose-200" },
              { icon: Brain, label: "Boss Battles", color: "text-slate-700 bg-slate-100 border-slate-300" },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}
              >
                <Icon size={14} />
                {label}
              </span>
            ))}
          </div>

          <button
            onClick={() => setHasStarted(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
          >
            Start Today&apos;s Drill
          </button>
        </div>
      ) : (
        <QuizEngine questions={dailyQuestions} />
      )}
    </main>
  );
}
