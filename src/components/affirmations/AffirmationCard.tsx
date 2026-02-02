'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, Heart, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'stress', label: 'Stress Relief', emoji: '🧘' },
  { id: 'confidence', label: 'Confidence', emoji: '💪' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙' },
]

// Fallback affirmations when API is not available
const FALLBACK_AFFIRMATIONS: Record<string, string[]> = {
  morning: [
    "Today is a new beginning filled with endless possibilities.",
    "I wake up grateful for this beautiful day ahead.",
    "I am energized and ready to embrace whatever comes my way.",
    "This morning, I choose joy, peace, and positivity.",
  ],
  stress: [
    "I release all tension and welcome peace into my mind.",
    "I am calm, centered, and in control of my thoughts.",
    "With each breath, I let go of stress and anxiety.",
    "I trust in my ability to handle any challenge that comes my way.",
  ],
  confidence: [
    "I believe in myself and my unique abilities.",
    "I am worthy of success and happiness.",
    "My confidence grows stronger with each passing day.",
    "I embrace my strengths and accept my imperfections.",
  ],
  gratitude: [
    "I am grateful for the abundance that flows into my life.",
    "I appreciate the small moments that bring me joy.",
    "My heart is full of gratitude for all that I have.",
    "I find reasons to be thankful in every situation.",
  ],
  sleep: [
    "I release the day and welcome peaceful rest.",
    "My mind is calm, my body is relaxed, and sleep comes easily.",
    "I am safe and at peace as I drift into restful sleep.",
    "Tonight I sleep deeply and wake refreshed.",
  ],
}

export function AffirmationCard() {
  const [category, setCategory] = useState('morning')
  const [affirmation, setAffirmation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateAffirmation = async () => {
    setIsLoading(true)
    setIsFavorite(false)
    
    try {
      const response = await fetch('/api/affirmations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAffirmation(data.affirmation)
      } else {
        // Use fallback
        const fallbacks = FALLBACK_AFFIRMATIONS[category] || FALLBACK_AFFIRMATIONS.morning
        setAffirmation(fallbacks[Math.floor(Math.random() * fallbacks.length)])
      }
    } catch (error) {
      // Use fallback
      const fallbacks = FALLBACK_AFFIRMATIONS[category] || FALLBACK_AFFIRMATIONS.morning
      setAffirmation(fallbacks[Math.floor(Math.random() * fallbacks.length)])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(affirmation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite)
    
    try {
      await fetch('/api/affirmations/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: affirmation, category, isFavorite: !isFavorite }),
      })
    } catch (error) {
      console.error('Failed to save favorite:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              category === cat.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Affirmation display */}
      <motion.div
        className="relative min-h-[200px] p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center"
        layout
      >
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
              <span className="text-white/60">Generating affirmation...</span>
            </motion.div>
          ) : affirmation ? (
            <motion.div
              key="affirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic">
                "{affirmation}"
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-all ${
                    isFavorite ? 'bg-pink-500/20 text-pink-400' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full text-white/60 hover:text-white transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/40 text-center"
            >
              Click generate to receive your personalized affirmation
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Generate button */}
      <div className="flex justify-center">
        <Button onClick={generateAffirmation} disabled={isLoading} size="lg">
          <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {affirmation ? 'New Affirmation' : 'Generate Affirmation'}
        </Button>
      </div>
    </div>
  )
}
