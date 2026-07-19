# English Gauntlet

An elegant, minimalist web app for mastering English through daily MCQ drills. Built for TOEIC and IELTS preparation, it tests users on **Synonyms, Inverses (Antonyms), Meaning & Nuance, and Grammar** — ranging from Easy to Very Hard.

## Features

### Quiz System
- **Category Picker** — choose one or more categories: Synonyms, Inverses, Meaning & Nuance, Grammar
- **Flexible question count** — 10, 20, 50, or infinite mode
- **Word-focused MCQs** — most questions test a single word (synonym, antonym, definition) rather than full sentences
- **Manual "Next" button** — answer, read the explanation, then proceed at your own pace
- **Quit anytime** — X button in the top-right returns to the category picker
- **Shuffled questions** — every session is randomized
- **Score estimation** — mock TOEIC and IELTS band calculations on the results screen

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
- **Auth & Backend:** [Supabase](https://supabase.com/) (Google OAuth + email/password)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, AuthProvider
│   ├── page.tsx                # Home: category picker, auth button, quiz launcher
│   ├── globals.css             # Global styles & Tailwind animations
│   └── profile/
│       └── page.tsx            # User profile & stats dashboard
├── components/
│   ├── AuthModal.tsx           # Sign in / Sign up modal (Google + email)
│   ├── CategoryPicker.tsx      # Category & question count selection
│   ├── QuestionCard.tsx        # Renders question, options, feedback, next button
│   ├── QuizEngine.tsx          # Manages quiz state, timing, stats recording
│   └── ResultsScreen.tsx       # Score display, estimates, restart
├── data/
│   └── questions.ts            # 64+ word-focused MCQs across 4 categories
└── lib/
    ├── stats.ts                # localStorage-based stats tracking
    ├── utils.ts                # Tailwind class merge utility
    └── supabase/
        ├── auth.ts             # Sign in, sign up, sign out functions
        ├── client.ts           # Lazy-initialized Supabase browser client
        └── provider.tsx        # Auth context provider
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
