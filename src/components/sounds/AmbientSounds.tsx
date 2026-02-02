'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, CloudRain, Wind, Waves, Bird, Coffee, Flame, Trees, Moon } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const SOUNDS = [
  { id: 'rain', name: 'Rain', icon: CloudRain, color: 'from-blue-500 to-cyan-500' },
  { id: 'ocean', name: 'Ocean', icon: Waves, color: 'from-teal-500 to-blue-500' },
  { id: 'forest', name: 'Forest', icon: Trees, color: 'from-green-500 to-emerald-500' },
  { id: 'birds', name: 'Birds', icon: Bird, color: 'from-yellow-500 to-orange-500' },
  { id: 'wind', name: 'Wind', icon: Wind, color: 'from-gray-400 to-slate-500' },
  { id: 'fire', name: 'Fireplace', icon: Flame, color: 'from-orange-500 to-red-500' },
  { id: 'cafe', name: 'Café', icon: Coffee, color: 'from-amber-600 to-yellow-700' },
  { id: 'night', name: 'Night', icon: Moon, color: 'from-indigo-600 to-purple-700' },
]

// Sound URLs (using free ambient sounds from a CDN)
const SOUND_URLS: Record<string, string> = {
  rain: 'https://cdn.pixabay.com/audio/2022/05/16/audio_379156e38f.mp3',
  ocean: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d1f8f8f825.mp3',
  forest: 'https://cdn.pixabay.com/audio/2021/09/06/audio_0f3b8a1f1c.mp3',
  birds: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630e7a1c.mp3',
  wind: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3',
  fire: 'https://cdn.pixabay.com/audio/2022/03/15/audio_58cb52f2de.mp3',
  cafe: 'https://cdn.pixabay.com/audio/2022/10/30/audio_7b8f8f1e24.mp3',
  night: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1c7d.mp3',
}

export function AmbientSounds() {
  const { sound, setActiveSound, setVolume, toggleSound } = useAppStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sound.activeSound && sound.isPlaying) {
      setIsLoading(true)
      
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio(SOUND_URLS[sound.activeSound])
      audio.loop = true
      audio.volume = sound.volume
      audioRef.current = audio

      audio.addEventListener('canplaythrough', () => {
        setIsLoading(false)
        audio.play().catch(console.error)
      })

      audio.addEventListener('error', () => {
        setIsLoading(false)
        console.error('Failed to load audio')
      })
    } else if (audioRef.current) {
      audioRef.current.pause()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [sound.activeSound, sound.isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = sound.volume
    }
  }, [sound.volume])

  const handleSoundSelect = (soundId: string) => {
    if (sound.activeSound === soundId) {
      toggleSound()
    } else {
      setActiveSound(soundId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sound grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SOUNDS.map((s) => {
          const Icon = s.icon
          const isActive = sound.activeSound === s.id && sound.isPlaying
          
          return (
            <motion.button
              key={s.id}
              onClick={() => handleSoundSelect(s.id)}
              className={`relative p-6 rounded-2xl transition-all ${
                isActive
                  ? `bg-gradient-to-br ${s.color} shadow-xl`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated waves for active sound */}
              {isActive && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-2xl border border-white/20"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ 
                        scale: [1, 1.5, 2],
                        opacity: [0.3, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Icon className={`w-10 h-10 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <span className={`mt-3 text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                  {s.name}
                </span>
                {isActive && isLoading && (
                  <span className="text-xs text-white/60 mt-1">Loading...</span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Volume control */}
      {sound.activeSound && (
        <motion.div
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={toggleSound} className="p-2 hover:bg-white/10 rounded-full">
            {sound.isPlaying ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white/60" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sound.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          
          <span className="text-white/60 text-sm w-12 text-right">
            {Math.round(sound.volume * 100)}%
          </span>
        </motion.div>
      )}
    </div>
  )
}
