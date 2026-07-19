export type Category = "Synonym" | "Inverse" | "Meaning" | "Grammar";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ── Multiplayer Room Types ──

export type RoomStatus = "waiting" | "starting" | "active" | "finished";

export interface RoomRow {
  id: string;
  code: string;
  status: RoomStatus;
  creator_id: string;
  joiner_id: string | null;
  creator_name: string;
  joiner_name: string | null;
  question_ids: string[];
  time_limit: number;
  penalty: number;
  started_at: string | null;
  created_at: string;
}

export interface PlayerState {
  name: string;
  score: number;
  currentIndex: number;
  timePenalty: number;
  finished: boolean;
}

export interface RoomChannelState {
  type: "player_update" | "game_start" | "player_finished" | "game_over";
  player: "creator" | "joiner";
  state: PlayerState;
  startedAt?: number;
}
