# Daily English Gauntlet

An elegant, minimalist web app for mastering English through 10-minute daily micro-drills. Designed for TOEIC and IELTS preparation, it tests users on high-yield exam concepts: **Synonyms, Inverses (Antonyms/Grammatical Inversion), Nuance (Meaning), and Exam Tricks.**

## Features (V1)

- **Micro-Learning Loop:** 5 questions per session, completable in under 15 minutes
- **4 Learning Pillars + Boss Battle:**
  - **Tips:** Memorizable grammar hacks
  - **Synonyms:** Contextual vocabulary building
  - **Inverses:** Antonyms and grammatical inversion
  - **Meaning:** Destroying "false friend" distractors
  - **Boss:** Advanced multi-concept challenges
- **Instant Feedback:** Immediate, clear explanations for every answer
- **Score Estimation:** Mock TOEIC and IELTS band calculations
- **Elegant UI:** Distraction-free, minimalist design with smooth micro-interactions

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Home page with start screen + quiz launcher
│   └── globals.css       # Global styles & Tailwind animations
├── components/
│   ├── QuestionCard.tsx  # Renders question, options, feedback
│   ├── QuizEngine.tsx    # Manages quiz state and flow
│   └── ResultsScreen.tsx # Score display and restart
├── data/
│   └── questions.ts      # Question interface + V1 mock data
└── lib/
    └── utils.ts          # Tailwind class merge utility
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/med-amine/fluent-gauntlet.git
cd fluent-gauntlet
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## V2 Roadmap (AI Integration)

V1 uses hardcoded questions in `src/data/questions.ts`. The UI is fully decoupled from the data source, so upgrading to AI-generated content requires zero UI changes:

1. Create an API route at `src/app/api/generate-quiz/route.ts`
2. Integrate OpenAI / Anthropic to generate questions dynamically
3. Fetch from the API in `page.tsx` instead of the local data file
4. Add a database (Supabase/PostgreSQL) for user accounts, streaks, and adaptive difficulty

## License

MIT
