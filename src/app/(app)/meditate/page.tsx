'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Check, X } from 'lucide-react'
import { MeditationTimer } from '@/components/meditation/MeditationTimer'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app-store'

export default function MeditatePage() {
  const { timer, showCompletionModal, setShowCompletionModal } = useAppStore()
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleComplete = async () => {
    // Session is completed, modal will show
  }

  const handleSaveSession = async () => {
    setIsSaving(true)
    
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: timer.selectedDuration,
          type: 'timer',
          notes: notes || undefined,
        }),
      })
      
      setShowCompletionModal(false)
      setNotes('')
    } catch (error) {
      console.error('Failed to save session:', error)
    } finally {
      setIsSaving(false)
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
          <Timer className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Meditation Timer</h1>
        <p className="text-white/60">Find your center with guided meditation</p>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="py-8"
      >
        <MeditationTimer onComplete={handleComplete} />
      </motion.div>

      {/* Tips */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-medium mb-3">Meditation Tips</h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li>• Find a comfortable seated position</li>
          <li>• Close your eyes and focus on your breath</li>
          <li>• When your mind wanders, gently bring it back</li>
          <li>• Don't judge yourself - wandering is natural</li>
        </ul>
      </motion.div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border border-white/10 backdrop-blur-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowCompletionModal(false)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Well Done!</h2>
                <p className="text-white/60">
                  You completed a {Math.floor(timer.selectedDuration / 60)} minute session
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-white/80 mb-2">
                  How was your session? (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any thoughts or reflections..."
                  className="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/10 focus:border-indigo-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSaveSession}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? 'Saving...' : 'Save Session'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
