# MindfulMinutes 🧘

A beautiful meditation and mindfulness app built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Guided Meditation Timer** - Customizable sessions with beautiful visualizations
- **Breathing Exercises** - Box breathing, 4-7-8, and more patterns
- **Daily Streaks** - Track your consistency and build habits
- **Mood Tracking** - Monitor your emotional journey
- **Session History** - Review past meditation sessions
- **Ambient Sounds** - Rain, ocean, forest, and more
- **AI Affirmations** - Personalized daily affirmations powered by OpenAI

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Payments:** Stripe ($7.99/month subscription)
- **Animations:** Framer Motion
- **State:** Zustand

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables (copy `.env.example` to `.env`)

4. Push database schema:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This app is configured for Vercel deployment. Simply connect your repository and add the environment variables.

## License

MIT
