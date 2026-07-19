"use client";

import { RotateCcw, Trophy } from "lucide-react";

interface Props {
  score: number;
  total: number;
  onRestart: () => void;
}

export default function ResultsScreen({ score, total, onRestart }: Props) {
  const percentage = Math.round((score / total) * 100);

  const estimatedToiec = 450 + Math.round((percentage / 100) * 450);
  const estimatedIelts = (4.0 + (percentage / 100) * 4.0).toFixed(1);

  const getMessage = () => {
    if (percentage === 100) return "Flawless victory!";
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 60) return "Good effort!";
    if (percentage >= 40) return "Keep practicing!";
    return "Don't give up!";
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-indigo-600" size={40} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-1">
          Drill Complete!
        </h2>
        <p className="text-indigo-600 font-semibold mb-2">{getMessage()}</p>
        <p className="text-slate-500 mb-8">
          You scored {score} out of {total} ({percentage}%)
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">
              Est. TOEIC
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {estimatedToiec}
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-medium">
              Est. IELTS
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {estimatedIelts}
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Practice Again
        </button>
      </div>
    </div>
  );
}
