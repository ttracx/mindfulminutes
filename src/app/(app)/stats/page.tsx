'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Clock, Calendar, Flame } from 'lucide-react'
import { StreakDisplay, StreakCalendar } from '@/components/stats/StreakDisplay'
import { SessionHistory } from '@/components/history/SessionHistory'

interface Stats {
  streaks: {
    currentStreak: number
    longestStreak: number
    totalSessions: number
    totalMinutes: number
  }
  sessionCalendar: { date: string; completed: boolean }[]
  sessionsByType: Record<string, number>
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-white/60">Track your mindfulness journey</p>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-white/10">
          {['overview', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'overview' | 'history')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      ) : activeTab === 'overview' ? (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Streak Stats */}
          {stats && <StreakDisplay data={stats.streaks} />}

          {/* Calendar */}
          {stats && (
            <motion.div
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StreakCalendar sessions={stats.sessionCalendar} />
            </motion.div>
          )}

          {/* Session Types */}
          {stats && stats.sessionsByType && Object.keys(stats.sessionsByType).length > 0 && (
            <motion.div
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white font-medium mb-4">Sessions by Type</h3>
              <div className="space-y-3">
                {Object.entries(stats.sessionsByType).map(([type, count]) => {
                  const total = Object.values(stats.sessionsByType).reduce((a, b) => a + b, 0)
                  const percentage = Math.round((count / total) * 100)
                  
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80 capitalize">{type}</span>
                        <span className="text-white/60">{count} sessions ({percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {!stats || stats.streaks.totalSessions === 0 ? (
            <div className="text-center py-12">
              <Flame className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No sessions yet</p>
              <p className="text-white/40 text-sm">Complete your first meditation to start tracking</p>
            </div>
          ) : null}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SessionHistory />
        </motion.div>
      )}
    </div>
  )
}
