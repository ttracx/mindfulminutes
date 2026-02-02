'use client'

import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'

const DURATION_OPTIONS = [
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
  { label: '20 min', value: 1200 },
  { label: '30 min', value: 1800 },
]

export function MeditationTimer({ onComplete }: { onComplete?: () => void }) {
  const {
    timer,
    setDuration,
    setTimeRemaining,
    startTimer,
    pauseTimer,
    stopTimer,
    setShowCompletionModal,
  } = useAppStore()
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((timer.selectedDuration - timer.timeRemaining) / timer.selectedDuration) * 100

  const handleComplete = useCallback(() => {
    stopTimer()
    setShowCompletionModal(true)
    
    // Play completion sound
    if (audioRef.current) {
      audioRef.current.play().catch(() => {})
    }
    
    onComplete?.()
  }, [stopTimer, setShowCompletionModal, onComplete])

  useEffect(() => {
    if (timer.isRunning && timer.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(timer.timeRemaining - 1)
      }, 1000)
    } else if (timer.timeRemaining === 0 && timer.isRunning) {
      handleComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timer.isRunning, timer.timeRemaining, setTimeRemaining, handleComplete])

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Timer Circle */}
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            initial={false}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl md:text-6xl font-light text-white tracking-wider"
            key={timer.timeRemaining}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime(timer.timeRemaining)}
          </motion.span>
          <span className="text-white/60 text-sm mt-2">
            {timer.isRunning ? 'Focus on your breath...' : timer.isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>

        {/* Breathing animation overlay */}
        <AnimatePresence>
          {timer.isRunning && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.85, 1, 0.85],
                opacity: [0.3, 0.6, 0.3],
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Duration selector */}
      {!timer.isRunning && !timer.isPaused && (
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setDuration(option.value)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                timer.selectedDuration === option.value
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {timer.isRunning ? (
          <Button onClick={pauseTimer} size="lg" variant="secondary">
            <Pause className="w-6 h-6 mr-2" />
            Pause
          </Button>
        ) : (
          <Button onClick={startTimer} size="lg">
            <Play className="w-6 h-6 mr-2" />
            {timer.isPaused ? 'Resume' : 'Start'}
          </Button>
        )}
        
        {(timer.isRunning || timer.isPaused) && (
          <Button onClick={stopTimer} variant="ghost" size="lg">
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Hidden audio element for completion sound */}
      <audio ref={audioRef} src="/sounds/bowl.mp3" preload="auto" />
    </div>
  )
}
