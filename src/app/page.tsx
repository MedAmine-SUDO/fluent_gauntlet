"use client";

import { useState } from "react";
import CategoryPicker from "@/components/CategoryPicker";
import QuizEngine from "@/components/QuizEngine";
import { Category } from "@/data/questions";
import { useAuth } from "@/lib/supabase/provider";
import { signInWithGoogle } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { Zap, User, LogIn } from "lucide-react";

type Screen = "landing" | "quiz";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
      {/* Top-right user area */}
      {!loading && (
        <div className="fixed top-5 right-5 z-50">
          {user ? (
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1.5 pr-3 py-1.5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">
                    {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                {user.user_metadata?.full_name?.split(" ")[0] || "Profile"}
              </span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 hover:border-slate-300 hover:shadow-sm transition-all text-sm font-medium text-slate-700 cursor-pointer"
            >
              <LogIn size={16} />
              Sign in
            </button>
          )}
        </div>
      )}

      {screen === "landing" ? (
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 animate-in fade-in duration-500">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
              <Zap className="text-white" size={28} fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
              English Gauntlet
            </h1>
            <p className="text-slate-500">Master words, grammar, and nuance.</p>
          </div>

          <CategoryPicker onStart={handleStart} />
        </div>
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
