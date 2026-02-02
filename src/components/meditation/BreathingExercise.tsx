'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BREATHING_PATTERNS = {
  box: {
    name: 'Box Breathing',
    description: '4-4-4-4 pattern for calm focus',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  '478': {
    name: '4-7-8 Relaxing',
    description: 'Deep relaxation technique',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
    color: 'from-purple-500 to-pink-500',
  },
  relaxing: {
    name: 'Calming Breath',
    description: 'Simple relaxation',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 6 },
    ],
    color: 'from-emerald-500 to-teal-500',
  },
  energizing: {
    name: 'Energizing',
    description: 'Quick energizing breaths',
    phases: [
      { name: 'Inhale', duration: 2 },
      { name: 'Exhale', duration: 2 },
    ],
    color: 'from-orange-500 to-yellow-500',
  },
}

type PatternKey = keyof typeof BREATHING_PATTERNS

export function BreathingExercise({ onComplete }: { onComplete?: (cycles: number) => void }) {
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('box')
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [targetCycles, setTargetCycles] = useState(5)

  const pattern = BREATHING_PATTERNS[selectedPattern]
  const currentPhase = pattern.phases[currentPhaseIndex]

  const reset = useCallback(() => {
    setIsRunning(false)
    setCurrentPhaseIndex(0)
    setPhaseProgress(0)
    setCycles(0)
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setPhaseProgress((prev) => {
        const newProgress = prev + (100 / (currentPhase.duration * 10))
        
        if (newProgress >= 100) {
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length
          setCurrentPhaseIndex(nextPhaseIndex)
          
          // Check if we completed a cycle
          if (nextPhaseIndex === 0) {
            setCycles((prev) => {
              const newCycles = prev + 1
              if (newCycles >= targetCycles) {
                setIsRunning(false)
                onComplete?.(newCycles)
              }
              return newCycles
            })
          }
          
          return 0
        }
        
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, currentPhaseIndex, currentPhase.duration, pattern.phases.length, targetCycles, onComplete])

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    const phaseName = currentPhase.name.toLowerCase()
    const progress = phaseProgress / 100
    
    if (phaseName === 'inhale') {
      return 0.6 + (0.4 * progress) // 0.6 -> 1.0
    } else if (phaseName === 'exhale') {
      return 1.0 - (0.4 * progress) // 1.0 -> 0.6
    }
    return phaseName === 'hold' && currentPhaseIndex > 0 ? 1.0 : 0.6 // Hold at current size
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Pattern selector */}
      {!isRunning && (
        <motion.div
          className="grid grid-cols-2 gap-3 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {(Object.entries(BREATHING_PATTERNS) as [PatternKey, typeof BREATHING_PATTERNS.box][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setSelectedPattern(key)}
              className={`p-4 rounded-2xl text-left transition-all ${
                selectedPattern === key
                  ? `bg-gradient-to-br ${p.color} shadow-lg`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5" />
                <span className="font-medium">{p.name}</span>
              </div>
              <p className="text-xs text-white/70 mt-1">{p.description}</p>
            </button>
          ))}
        </motion.div>
      )}

      {/* Breathing circle */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        
        {/* Animated breathing circle */}
        <motion.div
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${pattern.color} shadow-2xl flex items-center justify-center`}
          animate={{
            scale: isRunning ? getCircleScale() : 0.8,
          }}
          transition={{
            duration: 0.1,
            ease: 'linear',
          }}
        >
          <div className="text-center">
            <motion.p
              className="text-2xl font-light text-white"
              key={currentPhase.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isRunning ? currentPhase.name : 'Ready'}
            </motion.p>
            {isRunning && (
              <p className="text-white/70 text-sm mt-1">
                {Math.ceil(currentPhase.duration - (phaseProgress / 100) * currentPhase.duration)}s
              </p>
            )}
          </div>
        </motion.div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            stroke="url(#breathGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 48}` }}
            animate={{
              strokeDashoffset: `${2 * Math.PI * 48 * (1 - phaseProgress / 100)}`,
            }}
            transition={{ duration: 0.1 }}
          />
          <defs>
            <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cycle counter */}
      <div className="text-center">
        <p className="text-white/60 text-sm">
          Cycle {cycles} of {targetCycles}
        </p>
        {!isRunning && cycles === 0 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setTargetCycles(num)}
                className={`px-3 py-1 rounded-full text-sm ${
                  targetCycles === num
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {num} cycles
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {isRunning ? (
          <Button onClick={() => setIsRunning(false)} size="lg" variant="secondary">
            <Pause className="w-6 h-6 mr-2" />
            Pause
          </Button>
        ) : (
          <Button onClick={() => setIsRunning(true)} size="lg">
            <Play className="w-6 h-6 mr-2" />
            {cycles > 0 ? 'Resume' : 'Start'}
          </Button>
        )}
        
        {cycles > 0 && (
          <Button onClick={reset} variant="ghost" size="lg">
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
