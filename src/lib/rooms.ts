import { getSupabase } from "@/lib/supabase/client";
import { RoomRow } from "@/types";
import { allQuestions } from "@/data/questions";
import { Category } from "@/types";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const ANON_ID_KEY = "eg_anon_id";

export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function createRoom(
  creatorId: string,
  creatorName: string,
  categories: Category[],
  timeLimit: number,
  penalty: number
): Promise<RoomRow | null> {
  const supabase = getSupabase();
  const pool = shuffle(allQuestions.filter((q) => categories.includes(q.category)));
  const questionIds = pool.map((q) => q.id);
  const code = generateCode();

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      code,
      status: "waiting",
      creator_id: creatorId,
      creator_name: creatorName,
      question_ids: questionIds,
      time_limit: timeLimit,
      penalty,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create room:", error.message);
    return null;
  }
  return data as RoomRow;
}

export async function joinRoom(
  code: string,
  joinerId: string,
  joinerName: string
): Promise<RoomRow | null> {
  const supabase = getSupabase();
  const { data: existing, error: fetchError } = await supabase
    .from("rooms")
    .select()
    .eq("code", code.toUpperCase())
    .eq("status", "waiting")
    .single();

  if (fetchError || !existing) return null;

  const { data, error } = await supabase
    .from("rooms")
    .update({ joiner_id: joinerId, joiner_name: joinerName, status: "starting" })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to join room:", error.message);
    return null;
  }
  return data as RoomRow;
}

export async function startGame(roomId: string): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from("rooms")
    .update({ status: "active", started_at: new Date().toISOString() })
    .eq("id", roomId);
}

export async function endGame(roomId: string): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from("rooms")
    .update({ status: "finished" })
    .eq("id", roomId);
}

export async function getRoomByCode(code: string): Promise<RoomRow | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("rooms")
    .select()
    .eq("code", code.toUpperCase())
    .single();
  return (data as RoomRow) ?? null;
}

export async function getRoomById(id: string): Promise<RoomRow | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("rooms")
    .select()
    .eq("id", id)
    .single();
  return (data as RoomRow) ?? null;
}

export function getRoomChannel(roomId: string) {
  return getSupabase().channel(`room:${roomId}`);
}

export function pickQuestions(categories: Category[]): string[] {
  const pool = shuffle(allQuestions.filter((q) => categories.includes(q.category)));
  return pool.map((q) => q.id);
}
