'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smile, TrendingUp, Calendar } from 'lucide-react'
import { MoodTracker } from '@/components/mood/MoodTracker'
import { format } from 'date-fns'

interface MoodEntry {
  id: string
  mood: number
  energy: number
  notes?: string
  createdAt: string
}

const MOOD_LABELS = ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great']
const MOOD_EMOJIS = ['', '😔', '😕', '😐', '🙂', '😊']

export default function MoodPage() {
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMoods()
  }, [])

  const fetchMoods = async () => {
    try {
      const response = await fetch('/api/mood')
      if (response.ok) {
        const data = await response.json()
        setRecentMoods(data.moods)
      }
    } catch (error) {
      console.error('Failed to fetch moods:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoodSubmit = (data: { mood: number; energy: number; notes: string }) => {
    setRecentMoods((prev) => [
      {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  // Calculate average mood
  const averageMood = recentMoods.length > 0
    ? (recentMoods.reduce((acc, m) => acc + m.mood, 0) / recentMoods.length).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-4">
          <Smile className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Mood Tracker</h1>
        <p className="text-white/60">Track your emotional journey</p>
      </motion.div>

      {/* Mood Input */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-white mb-6">How are you feeling right now?</h2>
        <MoodTracker onSubmit={handleMoodSubmit} />
      </motion.div>

      {/* Stats */}
      {averageMood && (
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white/60 text-sm">Average Mood</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{averageMood}</span>
              <span className="text-2xl">{MOOD_EMOJIS[Math.round(parseFloat(averageMood))]}</span>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span className="text-white/60 text-sm">Entries</span>
            </div>
            <span className="text-3xl font-bold text-white">{recentMoods.length}</span>
          </div>
        </motion.div>
      )}

      {/* Recent Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Recent Entries</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : recentMoods.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            No mood entries yet. Start tracking above!
          </div>
        ) : (
          <div className="space-y-3">
            {recentMoods.slice(0, 7).map((entry) => (
              <motion.div
                key={entry.id}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                    <div>
                      <p className="text-white font-medium">{MOOD_LABELS[entry.mood]}</p>
                      <p className="text-white/40 text-sm">
                        {format(new Date(entry.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white/60 text-sm">Energy: {entry.energy}/5</span>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-white/60 text-sm mt-2 pl-10">{entry.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
