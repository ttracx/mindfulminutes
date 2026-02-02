'use client'

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { AmbientSounds } from '@/components/sounds/AmbientSounds'

export default function SoundsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Ambient Sounds</h1>
        <p className="text-white/60">Immerse yourself in calming soundscapes</p>
      </motion.div>

      {/* Sounds Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AmbientSounds />
      </motion.div>

      {/* Tips */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white font-medium mb-3">How to Use Ambient Sounds</h3>
        <ul className="space-y-2 text-white/60 text-sm">
          <li>• Play during meditation for deeper focus</li>
          <li>• Use while working to improve concentration</li>
          <li>• Listen before bed to improve sleep quality</li>
          <li>• Combine with breathing exercises for maximum relaxation</li>
        </ul>
      </motion.div>
    </div>
  )
}
