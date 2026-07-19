"use client";

import { useState } from "react";
import { Category } from "@/types";
import {
  BookOpen,
  ArrowRightLeft,
  Target,
  GraduationCap,
  Infinity,
} from "lucide-react";

const categories: {
  id: Category;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  activeColor: string;
}[] = [
  {
    id: "Synonym",
    label: "Synonyms",
    description: "Words with similar meanings",
    icon: BookOpen,
    color: "border-sky-200 text-sky-700 bg-sky-50",
    activeColor: "border-sky-500 bg-sky-100 text-sky-800 ring-2 ring-sky-300",
  },
  {
    id: "Inverse",
    label: "Inverses",
    description: "Antonyms and opposite meanings",
    icon: ArrowRightLeft,
    color: "border-violet-200 text-violet-700 bg-violet-50",
    activeColor:
      "border-violet-500 bg-violet-100 text-violet-800 ring-2 ring-violet-300",
  },
  {
    id: "Meaning",
    label: "Meaning & Nuance",
    description: "True definitions and word traps",
    icon: Target,
    color: "border-rose-200 text-rose-700 bg-rose-50",
    activeColor: "border-rose-500 bg-rose-100 text-rose-800 ring-2 ring-rose-300",
  },
  {
    id: "Grammar",
    label: "Grammar",
    description: "Tenses, structure, and rules",
    icon: GraduationCap,
    color: "border-amber-200 text-amber-700 bg-amber-50",
    activeColor:
      "border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-300",
  },
];

const counts = [10, 20, 50, -1] as const;

interface Props {
  onStart: (categories: Category[], count: number) => void;
}

export default function CategoryPicker({ onStart }: Props) {
  const [selected, setSelected] = useState<Category[]>(["Synonym"]);
  const [count, setCount] = useState<number>(10);

  const toggleCategory = (cat: Category) => {
    setSelected((prev) =>
      prev.includes(cat)
        ? prev.length === 1
          ? prev
          : prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          Choose Your Drill
        </h2>
        <p className="text-slate-500 mb-8">
          Pick one or more categories and how many questions you want.
        </p>

        {/* Category Selection */}
        <div className="space-y-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
                  isActive ? cat.activeColor : `${cat.color} hover:opacity-80`
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? "bg-white/70" : "bg-white"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{cat.label}</p>
                  <p className="text-xs opacity-70">{cat.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "border-current bg-current/20" : "border-slate-300"
                  }`}
                >
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Question Count */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Number of questions
        </p>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {counts.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                count === c
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c === -1 ? (
                <span className="flex items-center justify-center gap-1">
                  <Infinity size={16} />
                </span>
              ) : (
                c
              )}
            </button>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(selected, count)}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Start Drill
        </button>
      </div>
    </div>
  );
}
