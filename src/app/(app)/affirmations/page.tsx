'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { AffirmationCard } from '@/components/affirmations/AffirmationCard'

export default function AffirmationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Daily Affirmations</h1>
        <p className="text-white/60">Empower your mind with positive thoughts</p>
      </motion.div>

      {/* Affirmation Generator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AffirmationCard />
      </motion.div>

      {/* Tips */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-medium mb-3">Tips for Using Affirmations</h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li>• Repeat affirmations aloud for greater impact</li>
          <li>• Practice in front of a mirror</li>
          <li>• Say them first thing in the morning</li>
          <li>• Write them in a journal</li>
          <li>• Believe in what you're saying</li>
        </ul>
      </motion.div>
    </div>
  )
}
