'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Timer, 
  Wind, 
  Volume2, 
  Sparkles, 
  Smile, 
  ArrowRight,
  Sun,
  Moon,
  Sunrise
} from 'lucide-react'
import { StreakDisplay } from '@/components/stats/StreakDisplay'
import { Button } from '@/components/ui/button'

const QUICK_ACTIONS = [
  { href: '/meditate', label: 'Meditate', icon: Timer, color: 'from-indigo-500 to-purple-600' },
  { href: '/breathe', label: 'Breathe', icon: Wind, color: 'from-blue-500 to-cyan-500' },
  { href: '/sounds', label: 'Sounds', icon: Volume2, color: 'from-emerald-500 to-teal-500' },
  { href: '/affirmations', label: 'Affirm', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { href: '/mood', label: 'Mood', icon: Smile, color: 'from-yellow-500 to-orange-500' },
]

interface Stats {
  streaks: {
    currentStreak: number
    longestStreak: number
    totalSessions: number
    totalMinutes: number
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise }
    if (hour < 18) return { text: 'Good Afternoon', icon: Sun }
    return { text: 'Good Evening', icon: Moon }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon
  const firstName = session?.user?.name?.split(' ')[0] || 'Friend'

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <GreetingIcon className="w-6 h-6 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">
            {greeting.text}, {firstName}
          </h1>
        </div>
        <p className="text-white/60">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StreakDisplay data={stats.streaks} />
        </motion.div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <motion.div
                  className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} hover:scale-105 transition-transform cursor-pointer`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Icon className="w-8 h-8 text-white mb-3" />
                  <span className="text-white font-medium">{action.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Featured Session */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-indigo-400 text-sm font-medium">Daily Recommendation</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-2">5-Minute Calm</h3>
            <p className="text-white/60 max-w-md">
              A quick mindfulness session to center yourself and find peace in your busy day.
            </p>
          </div>
          <div className="hidden md:block w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Timer className="w-12 h-12 text-white" />
          </div>
        </div>
        <Link href="/meditate">
          <Button className="mt-4">
            Start Session
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>

      {/* Daily Affirmation Preview */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-white/80 font-medium">Daily Affirmation</span>
        </div>
        <p className="text-xl text-white/90 italic">
          "Today I choose peace. I release what I cannot control and focus on what brings me joy."
        </p>
        <Link href="/affirmations">
          <Button variant="ghost" className="mt-4 text-purple-400">
            Get New Affirmation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
