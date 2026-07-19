# English Gauntlet

An elegant, minimalist web app for mastering English through daily MCQ drills. Built for TOEIC and IELTS preparation, it tests users on **Synonyms, Inverses (Antonyms), Meaning & Nuance, and Grammar** — ranging from Easy to Very Hard.

## Features

### Quiz System
- **Category Picker** — choose one or more categories: Synonyms, Inverses, Meaning & Nuance, Grammar
- **Flexible question count** — 10, 20, 50, or infinite mode
- **Word-focused MCQs** — most questions test a single word (synonym, antonym, definition) rather than full sentences
- **Shuffled answer options** — correct answer position is randomized every question
- **Manual "Next" button** — answer, read the explanation, then proceed at your own pace
- **Quit anytime** — X button in the top-right returns to the category picker
- **Shuffled questions** — every session is randomized
- **No repeats** — answered questions are tracked and won't reappear
- **Score estimation** — mock TOEIC and IELTS band calculations on the results screen

### Play with Friends (No Sign-in Required)
- **Create or join rooms** — host creates a room, shares a 6-character code
- **Anonymous play** — no account needed, each browser gets a random ID stored locally
- **Real-time sync** — Supabase Realtime broadcasts keep both players in sync
- **Competitive quiz** — both players race through the same shuffled questions
- **Shared timer** — wall-clock countdown, game ends when first player finishes
- **Instant quit** — quitting broadcasts to the opponent so both see results
- **Try Again** — host can replay with new shuffled questions from the same categories
- **No repeat questions** — played questions are tracked and excluded from future games

### Authentication
- **Google OAuth** — one-click sign-in via Supabase
- **Email/Password** — sign up or sign in with a simple modal (min 6 character password, email confirmation)
- Sign in is optional — the quiz works without an account

### User Profiles & Stats
- **Today's dashboard** — questions answered, accuracy %, time spent today
- **All-time stats** — total questions, accuracy, current/best streak, words learned, total time
- **Category breakdown** — per-category accuracy with progress bars
- Stats are stored in localStorage, keyed to the user's Supabase ID

### Design
- Clean, distraction-free UI with soft shadows and smooth micro-interactions
- Mobile-responsive layout
- Category-colored badges and difficulty indicators
- Animated feedback for correct/incorrect answers

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Auth & Backend:** [Supabase](https://supabase.com/) (Google OAuth + email/password + Realtime)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, AuthProvider
│   ├── page.tsx                # Home: category picker, auth, quiz, room launcher
│   ├── globals.css             # Global styles & Tailwind animations
│   └── profile/
│       └── page.tsx            # User profile & stats dashboard
├── components/
│   ├── AuthModal.tsx           # Sign in / Sign up modal (Google + email)
│   ├── CategoryPicker.tsx      # Category & question count selection
│   ├── QuestionCard.tsx        # Renders question, options, feedback, next button
│   ├── QuizEngine.tsx          # Manages quiz state, timing, stats recording
│   ├── ResultsScreen.tsx       # Score display, estimates, restart
│   └── RoomPage.tsx            # Multiplayer rooms: lobby, waiting, quiz, results
├── data/
│   └── questions.ts            # 64+ word-focused MCQs across 4 categories
├── lib/
│   ├── rooms.ts                # Room CRUD, Realtime channels, question shuffling
│   ├── stats.ts                # localStorage-based stats tracking
│   └── supabase/
│       ├── auth.ts             # Sign in, sign up, sign out functions
│       ├── client.ts           # Lazy-initialized Supabase browser client
│       └── provider.tsx        # Auth context provider
├── types/
│   └── ts                      # Shared types (Question, RoomRow, PlayerState, etc.)
└── supabase/
    └── migrations/
        └── 001_create_rooms_table.sql  # Rooms table + RLS policies
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A [Supabase](https://supabase.com) project (free tier works)

### Installation

```bash
git clone https://github.com/med-amine/fluent-gauntlet.git
cd fluent-gauntlet
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

Find both values in **Supabase Dashboard → Project Settings → API**.

### Enable Authentication

1. In Supabase Dashboard, go to **Authentication → Providers**
2. **Google:** Toggle ON → add Client ID + Client Secret from [Google Cloud Console](https://console.cloud.google.com)
3. **Email:** Toggle ON (default) — enable/disable email confirmation as needed

### Set Up Multiplayer Rooms

In Supabase Dashboard, go to **SQL Editor** and run the migration:

```sql
CREATE TABLE rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'waiting',
  creator_id   UUID NOT NULL,
  creator_name TEXT NOT NULL,
  joiner_id    UUID,
  joiner_name  TEXT,
  question_ids JSONB NOT NULL,
  time_limit   INTEGER NOT NULL DEFAULT 60,
  penalty      INTEGER NOT NULL DEFAULT 10,
  started_at   TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rooms_code ON rooms (code);
CREATE INDEX idx_rooms_status ON rooms (status);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON rooms FOR UPDATE USING (true);
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard before deploying
4. Add your Vercel domain to Supabase **Authentication → Providers → Google → Redirect URLs**

## License

MIT
