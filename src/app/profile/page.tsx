"use client";

import { useAuth } from "@/lib/supabase/provider";
import { signInWithGoogle, signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getStats,
  getTodayStats,
  formatTime,
  formatMinutes,
  UserStats,
} from "@/lib/stats";
import {
  LogOut,
  ArrowLeft,
  Flame,
  Trophy,
  Target,
  Clock,
  BookOpen,
  ArrowRightLeft,
  GraduationCap,
  Zap,
  BarChart3,
} from "lucide-react";
import { Category } from "@/types";

const categoryMeta: Record<
  Category,
  { label: string; icon: React.ElementType; color: string }
> = {
  Synonym: { label: "Synonyms", icon: BookOpen, color: "text-sky-600" },
  Inverse: { label: "Inverses", icon: ArrowRightLeft, color: "text-violet-600" },
  Meaning: { label: "Meaning", icon: Target, color: "text-rose-600" },
  Grammar: { label: "Grammar", icon: GraduationCap, color: "text-amber-600" },
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [todayStats, setTodayStats] = useState({
    count: 0,
    correct: 0,
    timeSpent: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setStats(getStats(user.id));
      setTodayStats(getTodayStats(user.id));
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!user || !stats) return null;

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const todayAccuracy =
    todayStats.count > 0
      ? Math.round((todayStats.correct / todayStats.count) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-lg mx-auto animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-14 h-14 rounded-full ring-2 ring-slate-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {user.user_metadata?.full_name || "Learner"}
              </p>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="bg-slate-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Today
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {todayStats.count}
                </p>
                <p className="text-xs text-slate-500">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {todayAccuracy}%
                </p>
                <p className="text-xs text-slate-500">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {formatMinutes(todayStats.timeSpent)}
                </p>
                <p className="text-xs text-slate-500">Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* All-Time Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            icon={<Target size={20} className="text-indigo-600" />}
            label="Total Answered"
            value={stats.totalAnswered.toString()}
          />
          <StatCard
            icon={<BarChart3 size={20} className="text-emerald-600" />}
            label="Accuracy"
            value={`${accuracy}%`}
          />
          <StatCard
            icon={<Flame size={20} className="text-orange-500" />}
            label="Current Streak"
            value={`${stats.streak} day${stats.streak !== 1 ? "s" : ""}`}
          />
          <StatCard
            icon={<Trophy size={20} className="text-amber-500" />}
            label="Best Streak"
            value={`${stats.longestStreak} day${stats.longestStreak !== 1 ? "s" : ""}`}
          />
          <StatCard
            icon={<Zap size={20} className="text-rose-500" />}
            label="Words Learned"
            value={stats.totalCorrect.toString()}
          />
          <StatCard
            icon={<Clock size={20} className="text-slate-500" />}
            label="Total Time"
            value={formatMinutes(stats.totalTimeSpent)}
          />
        </div>

        {/* Category Breakdown */}
        {(Object.keys(stats.categoryStats) as Category[]).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              By Category
            </p>
            <div className="space-y-4">
              {(Object.entries(stats.categoryStats) as [Category, { answered: number; correct: number }][]).map(
                ([cat, data]) => {
                  const meta = categoryMeta[cat];
                  const Icon = meta.icon;
                  const catAccuracy =
                    data.answered > 0
                      ? Math.round((data.correct / data.answered) * 100)
                      : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={meta.color} />
                          <span className="text-sm font-medium text-slate-700">
                            {meta.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {data.answered} answered · {catAccuracy}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${catAccuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
