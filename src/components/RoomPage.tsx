"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RoomRow, RoomChannelState, PlayerState, Question, Category } from "@/types";
import { allQuestions } from "@/data/questions";
import { useAuth } from "@/lib/supabase/provider";
import { createRoom, joinRoom, startGame, endGame, getRoomChannel } from "@/lib/rooms";
import { ArrowLeft, Copy, Check, Users, Timer, Zap } from "lucide-react";

type Phase = "lobby" | "waiting" | "countdown" | "playing" | "results";

interface Props {
  onBack: () => void;
}

function LobbyView({
  displayName,
  setDisplayName,
  joinCode,
  setJoinCode,
  selectedCats,
  toggleCat,
  timeLimit,
  setTimeLimit,
  penalty,
  setPenalty,
  error,
  onCreate,
  onJoin,
  onBack,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  joinCode: string;
  setJoinCode: (v: string) => void;
  selectedCats: Category[];
  toggleCat: (c: Category) => void;
  timeLimit: number;
  setTimeLimit: (v: number) => void;
  penalty: number;
  setPenalty: (v: number) => void;
  error: string;
  onCreate: () => void;
  onJoin: () => void;
  onBack: () => void;
}) {
  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-sm mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Play with Friends</h2>
        <p className="text-slate-500 text-sm mb-6">Create a room or join one with a code.</p>

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
        <input type="text" placeholder="Enter your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={20} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all" />

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Categories</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {(["Synonym", "Inverse", "Meaning", "Grammar"] as Category[]).map((cat) => (
            <button key={cat} onClick={() => toggleCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${selectedCats.includes(cat) ? "bg-indigo-100 border-indigo-300 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}>
              {cat}
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time Limit</label>
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[30, 60, 90, 120].map((t) => (
            <button key={t} onClick={() => setTimeLimit(t)} className={`py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${timeLimit === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {t}s
            </button>
          ))}
        </div>

        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Wrong Answer Penalty</label>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[0, 5, 10, 15].map((p) => (
            <button key={p} onClick={() => setPenalty(p)} className={`py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${penalty === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {p === 0 ? "None" : `${p}s`}
            </button>
          ))}
        </div>

        {error && <p className="text-rose-600 text-xs font-medium bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <button onClick={onCreate} disabled={!displayName.trim()} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-40 cursor-pointer mb-4">
          Create Room
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or join</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="flex gap-2">
          <input type="text" placeholder="Enter room code" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all uppercase" />
          <button onClick={onJoin} disabled={!displayName.trim() || joinCode.length < 6} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer">
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

function WaitingView({
  room,
  isCreator,
  creatorState,
  joinerState,
  timeLimit,
  penalty,
  copied,
  onCopy,
  onStart,
  onLeave,
}: {
  room: RoomRow;
  isCreator: boolean;
  creatorState: PlayerState | null;
  joinerState: PlayerState | null;
  timeLimit: number;
  penalty: number;
  copied: boolean;
  onCopy: () => void;
  onStart: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="w-full max-w-lg mx-auto text-center animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <button onClick={onLeave} className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-sm mb-6 transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Leave
        </button>
        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="text-indigo-600" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isCreator ? "Waiting for opponent..." : "You joined!"}
        </h2>

        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Share this code</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold tracking-[0.3em] text-slate-900">{room.code}</span>
            <button onClick={onCopy} className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center hover:bg-slate-300 transition-colors cursor-pointer">
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">{creatorState?.name}</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Host</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">{joinerState?.name || "Waiting..."}</span>
            {joinerState && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Joined</span>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mb-6">
          <span className="flex items-center gap-1"><Timer size={14} /> {timeLimit}s</span>
          <span className="flex items-center gap-1"><Zap size={14} /> {penalty}s penalty</span>
        </div>

        {isCreator && joinerState && (
          <button onClick={onStart} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 cursor-pointer">
            Start Match
          </button>
        )}
        {isCreator && !joinerState && (
          <p className="text-sm text-slate-400 animate-pulse">Share the code above with your friend...</p>
        )}
      </div>
    </div>
  );
}

function Countdown({ onComplete }: { onComplete: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) { onComplete(); return; }
    const t = setTimeout(() => setN((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [n, onComplete]);
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 flex items-center justify-center">
      <p key={n} className="text-[120px] font-bold text-white animate-in zoom-in-95 duration-300">
        {n === 0 ? "GO!" : n}
      </p>
    </div>
  );
}

function CompetitiveQuiz({
  questions,
  startedAt,
  timeLimit,
  penalty,
  myState,
  opponentState,
  opponentName,
  onStateChange,
  onTimeUp,
  onQuit,
}: {
  questions: Question[];
  startedAt: number;
  timeLimit: number;
  penalty: number;
  myState: PlayerState;
  opponentState: PlayerState | null;
  opponentName: string;
  onStateChange: (s: PlayerState) => void;
  onTimeUp: () => void;
  onQuit: () => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit * 1000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = questions[myState.currentIndex];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt - myState.timePenalty * 1000;
      const left = Math.max(0, timeLimit * 1000 - elapsed);
      setRemaining(left);
      if (left <= 0) onTimeUp();
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startedAt, timeLimit, myState.timePenalty, onTimeUp]);

  if (!currentQ) {
    onStateChange({ ...myState, finished: true });
    return null;
  }

  const seconds = Math.ceil(remaining / 1000);
  const progress = (myState.currentIndex / questions.length) * 100;
  const oppProgress = opponentState ? (opponentState.currentIndex / questions.length) * 100 : 0;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedIndex(index);
    setShowFeedback(true);
    const isCorrect = index === currentQ.correctIndex;
    const newPenalty = isCorrect ? myState.timePenalty : myState.timePenalty + penalty;
    const newIndex = myState.currentIndex + 1;
    const newScore = isCorrect ? myState.score + 1 : myState.score;
    const finished = newIndex >= questions.length;
    setTimeout(() => {
      onStateChange({ ...myState, score: newScore, currentIndex: newIndex, timePenalty: newPenalty, finished });
      setSelectedIndex(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) return selectedIndex === index ? "border-indigo-400 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50";
    if (index === currentQ.correctIndex) return "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200";
    if (index === selectedIndex && index !== currentQ.correctIndex) return "border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200";
    return "border-slate-200 bg-white opacity-40";
  };

  const timerColor = seconds > 20 ? "text-emerald-600" : seconds > 10 ? "text-amber-600" : "text-rose-600";

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onQuit} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-slate-500">{myState.currentIndex + (showFeedback ? 1 : 0)} / {questions.length}</span>
        </div>
        <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${timerColor}`}>
          <Timer size={20} />{seconds}s
        </div>
      </div>

      <div className="space-y-1.5 mb-8">
        <div>
          <p className="text-[11px] font-semibold text-indigo-600 mb-0.5">You ({myState.score} pts)</p>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">{opponentName} ({opponentState?.score ?? 0} pts)</p>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400 rounded-full transition-all duration-300" style={{ width: `${oppProgress}%` }} />
          </div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug mb-8">{currentQ.question}</h2>

      <div className="space-y-3">
        {currentQ.options.map((option, index) => (
          <button key={index} onClick={() => handleSelect(index)} disabled={showFeedback} className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default ${getOptionStyle(index)}`}>
            <span className="text-base font-medium">{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`mt-6 p-4 rounded-xl border animate-in fade-in duration-200 ${selectedIndex === currentQ.correctIndex ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
          <p className={`text-sm font-bold mb-1 ${selectedIndex === currentQ.correctIndex ? "text-emerald-800" : "text-rose-800"}`}>
            {selectedIndex === currentQ.correctIndex ? "Correct!" : `Wrong! -${penalty}s penalty`}
          </p>
          <p className="text-slate-700 text-sm">{currentQ.explanation}</p>
        </div>
      )}
    </div>
  );
}

function RoomResults({
  creatorState,
  joinerState,
  creatorName,
  joinerName,
  isCreator,
  onBack,
}: {
  creatorState: PlayerState | null;
  joinerState: PlayerState | null;
  creatorName: string;
  joinerName: string;
  isCreator: boolean;
  onBack: () => void;
}) {
  const me = isCreator ? creatorState : joinerState;
  const them = isCreator ? joinerState : creatorState;
  const myName = isCreator ? creatorName : joinerName;
  const theirName = isCreator ? joinerName : creatorName;
  const myScore = me?.score ?? 0;
  const theirScore = them?.score ?? 0;
  const result: "win" | "lose" | "draw" = myScore > theirScore ? "win" : myScore < theirScore ? "lose" : "draw";

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <p className="text-5xl mb-4">{result === "win" ? "🏆" : result === "draw" ? "🤝" : "💪"}</p>
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          {result === "win" ? "You Won!" : result === "draw" ? "Draw!" : "You Lost"}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-xl border-2 ${result === "win" ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{myName}</p>
            <p className="text-4xl font-bold text-slate-900">{myScore}</p>
            <p className="text-xs text-slate-500 mt-1">+{me?.timePenalty ?? 0}s penalty</p>
          </div>
          <div className={`p-5 rounded-xl border-2 ${result === "lose" ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{theirName}</p>
            <p className="text-4xl font-bold text-slate-900">{theirScore}</p>
            <p className="text-xs text-slate-500 mt-1">+{them?.timePenalty ?? 0}s penalty</p>
          </div>
        </div>
        <button onClick={onBack} className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer">
          Back to Menu
        </button>
      </div>
    </div>
  );
}

// ── Main Room Page ──

export default function RoomPage({ onBack }: Props) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [selectedCats, setSelectedCats] = useState<Category[]>(["Synonym"]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [penalty, setPenalty] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [creatorState, setCreatorState] = useState<PlayerState | null>(null);
  const [joinerState, setJoinerState] = useState<PlayerState | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isCreator = room?.creator_id === user?.id;

  const subscribeToRoom = useCallback((roomId: string) => {
    const channel = getRoomChannel(roomId);
    channelRef.current = channel;
    channel.on("broadcast", { event: "state" }, ({ payload }) => {
      const msg = payload as RoomChannelState;
      if (msg.type === "game_start" && msg.startedAt) {
        setStartedAt(msg.startedAt);
        setPhase("countdown");
        setTimeout(() => setPhase("playing"), 3000);
      }
      if (msg.type === "player_update" || msg.type === "player_finished") {
        if (msg.player === "creator") setCreatorState(msg.state);
        else setJoinerState(msg.state);
      }
      if (msg.type === "game_over") setPhase("results");
    }).subscribe();
    return channel;
  }, []);

  useEffect(() => () => { channelRef.current?.unsubscribe(); }, []);

  const toggleCat = (cat: Category) => {
    setSelectedCats((prev) => prev.includes(cat) ? (prev.length === 1 ? prev : prev.filter((c) => c !== cat)) : [...prev, cat]);
  };

  const loadQuestions = (ids: string[]) => {
    setQuestions(ids.map((id) => allQuestions.find((q) => q.id === id)).filter(Boolean) as Question[]);
  };

  const handleCreate = async () => {
    if (!user || !displayName.trim()) return;
    const r = await createRoom(user.id, displayName.trim(), selectedCats, timeLimit, penalty);
    if (!r) { setError("Failed to create room. Check your database setup."); return; }
    setRoom(r);
    setCreatorState({ name: displayName.trim(), score: 0, currentIndex: 0, timePenalty: 0, finished: false });
    subscribeToRoom(r.id);
    setPhase("waiting");
  };

  const handleJoin = async () => {
    if (!user || !displayName.trim() || !joinCode.trim()) return;
    const r = await joinRoom(joinCode.trim(), user.id, displayName.trim());
    if (!r) { setError("Room not found or already started."); return; }
    setRoom(r);
    setJoinerState({ name: displayName.trim(), score: 0, currentIndex: 0, timePenalty: 0, finished: false });
    loadQuestions(r.question_ids);
    subscribeToRoom(r.id);
    setPhase("waiting");
  };

  const handleStart = async () => {
    if (!room) return;
    const now = Date.now();
    await startGame(room.id);
    loadQuestions(room.question_ids);
    setStartedAt(now);
    channelRef.current?.send({ type: "broadcast", event: "state", payload: { type: "game_start", player: "creator", state: creatorState!, startedAt: now } });
    setPhase("countdown");
    setTimeout(() => setPhase("playing"), 3000);
  };

  const handlePlayerUpdate = (state: PlayerState) => {
    if (isCreator) setCreatorState(state);
    else setJoinerState(state);
    channelRef.current?.send({ type: "broadcast", event: "state", payload: { type: state.finished ? "player_finished" : "player_update", player: isCreator ? "creator" : "joiner", state } });
    const other = isCreator ? joinerState : creatorState;
    if (state.finished && other?.finished) {
      setPhase("results");
      channelRef.current?.send({ type: "broadcast", event: "state", payload: { type: "game_over", player: isCreator ? "creator" : "joiner", state } });
      if (room) endGame(room.id);
    }
  };

  const handleTimeUp = () => {
    setPhase("results");
    const finalState = isCreator ? creatorState : joinerState;
    if (finalState && !finalState.finished) {
      const updated = { ...finalState, finished: true };
      if (isCreator) setCreatorState(updated);
      else setJoinerState(updated);
      channelRef.current?.send({ type: "broadcast", event: "state", payload: { type: "game_over", player: isCreator ? "creator" : "joiner", state: updated } });
    }
    if (room) endGame(room.id);
  };

  if (phase === "waiting" && room) {
    return <WaitingView room={room} isCreator={!!isCreator} creatorState={creatorState} joinerState={joinerState} timeLimit={timeLimit} penalty={penalty} copied={copied} onCopy={() => { navigator.clipboard.writeText(room.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} onStart={handleStart} onLeave={onBack} />;
  }

  if (phase === "countdown") {
    return <Countdown onComplete={() => setPhase("playing")} />;
  }

  if (phase === "playing" && questions.length > 0) {
    const opponentState = isCreator ? joinerState : creatorState;
    const myState = isCreator ? creatorState : joinerState;
    return <CompetitiveQuiz questions={questions} startedAt={startedAt} timeLimit={timeLimit} penalty={penalty} myState={myState!} opponentState={opponentState} opponentName={isCreator ? joinerState?.name || "Opponent" : creatorState?.name || "Opponent"} onStateChange={handlePlayerUpdate} onTimeUp={handleTimeUp} onQuit={onBack} />;
  }

  if (phase === "results") {
    return <RoomResults creatorState={creatorState} joinerState={joinerState} creatorName={room?.creator_name || "Player 1"} joinerName={room?.joiner_name || "Player 2"} isCreator={!!isCreator} onBack={onBack} />;
  }

  if (!user) {
    return (
      <div className="w-full max-w-lg mx-auto text-center animate-in fade-in duration-500">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <p className="text-slate-500 mb-4">Sign in to play with friends.</p>
          <button onClick={onBack} className="text-indigo-600 font-semibold text-sm hover:underline cursor-pointer">Go back</button>
        </div>
      </div>
    );
  }

  return <LobbyView displayName={displayName} setDisplayName={setDisplayName} joinCode={joinCode} setJoinCode={setJoinCode} selectedCats={selectedCats} toggleCat={toggleCat} timeLimit={timeLimit} setTimeLimit={setTimeLimit} penalty={penalty} setPenalty={setPenalty} error={error} onCreate={handleCreate} onJoin={handleJoin} onBack={onBack} />;
}
