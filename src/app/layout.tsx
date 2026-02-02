import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindfulMinutes - Meditation & Mindfulness App',
  description: 'Find peace and clarity with guided meditation, breathing exercises, mood tracking, and AI-powered affirmations.',
  keywords: ['meditation', 'mindfulness', 'breathing exercises', 'mood tracking', 'mental health', 'relaxation'],
  openGraph: {
    title: 'MindfulMinutes - Your Daily Mindfulness Companion',
    description: 'Transform your well-being with guided meditations, breathing exercises, and personalized affirmations.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
