'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wind } from 'lucide-react'
import { BreathingExercise } from '@/components/meditation/BreathingExercise'

export default function BreathePage() {
  const handleComplete = async (cycles: number) => {
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: cycles * 60, // Approximate duration
          type: 'breathing',
        }),
      })
    } catch (error) {
      console.error('Failed to save session:', error)
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
          <Wind className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Breathing Exercises</h1>
        <p className="text-white/60">Calm your mind with guided breathing</p>
      </motion.div>

      {/* Breathing Exercise */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="py-8"
      >
        <BreathingExercise onComplete={handleComplete} />
      </motion.div>

      {/* Benefits */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-medium mb-3">Benefits of Breathing Exercises</h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li>• Reduces stress and anxiety</li>
          <li>• Improves focus and concentration</li>
          <li>• Lowers blood pressure and heart rate</li>
          <li>• Enhances emotional well-being</li>
          <li>• Promotes better sleep</li>
        </ul>
      </motion.div>
    </div>
  )
}
