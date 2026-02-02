'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smile, Meh, Frown, Zap, Moon, Sun, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MOODS = [
  { value: 1, label: 'Struggling', icon: Frown, color: 'from-red-500 to-orange-500' },
  { value: 2, label: 'Low', icon: Frown, color: 'from-orange-500 to-yellow-500' },
  { value: 3, label: 'Okay', icon: Meh, color: 'from-yellow-500 to-green-500' },
  { value: 4, label: 'Good', icon: Smile, color: 'from-green-500 to-emerald-500' },
  { value: 5, label: 'Great', icon: Sparkles, color: 'from-emerald-500 to-cyan-500' },
]

const ENERGY_LEVELS = [
  { value: 1, label: 'Exhausted', icon: Moon },
  { value: 2, label: 'Tired', icon: Moon },
  { value: 3, label: 'Moderate', icon: Sun },
  { value: 4, label: 'Energized', icon: Zap },
  { value: 5, label: 'Supercharged', icon: Zap },
]

interface MoodTrackerProps {
  onSubmit?: (data: { mood: number; energy: number; notes: string }) => void
}

export function MoodTracker({ onSubmit }: MoodTrackerProps) {
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (mood === null || energy === null) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, energy, notes }),
      })
      
      if (response.ok) {
        setIsSubmitted(true)
        onSubmit?.({ mood, energy, notes })
        
        // Reset after animation
        setTimeout(() => {
          setMood(null)
          setEnergy(null)
          setNotes('')
          setIsSubmitted(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to save mood:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        <p className="text-white text-xl mt-4">Mood logged!</p>
        <p className="text-white/60 text-sm">Keep tracking for insights</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Mood Selection */}
      <div>
        <h3 className="text-white/80 text-sm font-medium mb-4">How are you feeling?</h3>
        <div className="flex justify-between gap-2">
          {MOODS.map((m) => {
            const Icon = m.icon
            const isSelected = mood === m.value
            return (
              <motion.button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 p-4 rounded-2xl transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${m.color} shadow-lg`
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-8 h-8 mx-auto ${isSelected ? 'text-white' : 'text-white/60'}`} />
                <p className={`text-xs mt-2 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                  {m.label}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Energy Level */}
      <AnimatePresence>
        {mood !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-white/80 text-sm font-medium mb-4">Energy level?</h3>
            <div className="flex justify-between gap-2">
              {ENERGY_LEVELS.map((e) => {
                const Icon = e.icon
                const isSelected = energy === e.value
                return (
                  <motion.button
                    key={e.value}
                    onClick={() => setEnergy(e.value)}
                    className={`flex-1 p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`w-6 h-6 mx-auto ${isSelected ? 'text-white' : 'text-white/60'}`} />
                    <p className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                      {e.label}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes */}
      <AnimatePresence>
        {energy !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-white/80 text-sm font-medium mb-4">Any thoughts? (optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How's your day going?"
              className="w-full p-4 rounded-2xl bg-white/10 text-white placeholder-white/40 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <AnimatePresence>
        {energy !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : 'Log Mood'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
