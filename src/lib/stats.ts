import { Category } from "@/data/questions";

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  dailyStats: Record<string, { count: number; correct: number; timeSpent: number }>;
  categoryStats: Record<Category, { answered: number; correct: number }>;
  totalTimeSpent: number;
}

const STORAGE_KEY = "gauntlet_stats";

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getStats(userId: string): UserStats {
  if (typeof window === "undefined") return defaultStats();
  const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
  if (!raw) return defaultStats();
  try {
    return JSON.parse(raw) as UserStats;
  } catch {
    return defaultStats();
  }
}

export function saveStats(userId: string, stats: UserStats) {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(stats));
}

export function recordAnswer(
  userId: string,
  category: Category,
  isCorrect: boolean,
  timeSpentMs: number
): UserStats {
  const stats = getStats(userId);
  const today = todayKey();

  stats.totalAnswered += 1;
  if (isCorrect) stats.totalCorrect += 1;
  stats.totalTimeSpent += timeSpentMs;

  // Daily stats
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = { count: 0, correct: 0, timeSpent: 0 };
  }
  stats.dailyStats[today].count += 1;
  if (isCorrect) stats.dailyStats[today].correct += 1;
  stats.dailyStats[today].timeSpent += timeSpentMs;

  // Category stats
  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = { answered: 0, correct: 0 };
  }
  stats.categoryStats[category].answered += 1;
  if (isCorrect) stats.categoryStats[category].correct += 1;

  // Streak logic
  if (stats.lastPracticeDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    if (stats.lastPracticeDate === yesterdayKey) {
      stats.streak += 1;
    } else if (stats.lastPracticeDate !== today) {
      stats.streak = 1;
    }
    stats.lastPracticeDate = today;
  }

  if (stats.streak > stats.longestStreak) {
    stats.longestStreak = stats.streak;
  }

  saveStats(userId, stats);
  return stats;
}

export function getTodayStats(userId: string): {
  count: number;
  correct: number;
  timeSpent: number;
} {
  const stats = getStats(userId);
  const today = todayKey();
  return stats.dailyStats[today] || { count: 0, correct: 0, timeSpent: 0 };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function formatMinutes(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "<1 min";
  return `${minutes} min`;
}

function defaultStats(): UserStats {
  return {
    totalAnswered: 0,
    totalCorrect: 0,
    streak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    dailyStats: {},
    categoryStats: {} as Record<Category, { answered: number; correct: number }>,
    totalTimeSpent: 0,
  };
}
