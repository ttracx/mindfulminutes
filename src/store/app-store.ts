import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TimerState {
  duration: number
  timeRemaining: number
  isRunning: boolean
  isPaused: boolean
  selectedDuration: number
  meditationType: 'timer' | 'breathing' | 'guided' | 'ambient'
}

interface BreathingState {
  pattern: 'box' | '478' | 'relaxing' | 'energizing'
  phase: 'inhale' | 'hold' | 'exhale' | 'rest'
  cycleCount: number
}

interface SoundState {
  activeSound: string | null
  volume: number
  isPlaying: boolean
}

interface AppState {
  // Timer
  timer: TimerState
  setDuration: (duration: number) => void
  setTimeRemaining: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  stopTimer: () => void
  setMeditationType: (type: TimerState['meditationType']) => void

  // Breathing
  breathing: BreathingState
  setBreathingPattern: (pattern: BreathingState['pattern']) => void
  setBreathingPhase: (phase: BreathingState['phase']) => void
  incrementCycle: () => void
  resetBreathing: () => void

  // Sounds
  sound: SoundState
  setActiveSound: (sound: string | null) => void
  setVolume: (volume: number) => void
  toggleSound: () => void

  // UI
  showCompletionModal: boolean
  setShowCompletionModal: (show: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Timer initial state
      timer: {
        duration: 600,
        timeRemaining: 600,
        isRunning: false,
        isPaused: false,
        selectedDuration: 600,
        meditationType: 'timer',
      },
      setDuration: (duration) =>
        set((state) => ({
          timer: { ...state.timer, duration, timeRemaining: duration, selectedDuration: duration },
        })),
      setTimeRemaining: (time) =>
        set((state) => ({ timer: { ...state.timer, timeRemaining: time } })),
      startTimer: () =>
        set((state) => ({ timer: { ...state.timer, isRunning: true, isPaused: false } })),
      pauseTimer: () =>
        set((state) => ({ timer: { ...state.timer, isRunning: false, isPaused: true } })),
      stopTimer: () =>
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
            isPaused: false,
            timeRemaining: state.timer.selectedDuration,
          },
        })),
      setMeditationType: (type) =>
        set((state) => ({ timer: { ...state.timer, meditationType: type } })),

      // Breathing initial state
      breathing: {
        pattern: 'box',
        phase: 'inhale',
        cycleCount: 0,
      },
      setBreathingPattern: (pattern) =>
        set((state) => ({ breathing: { ...state.breathing, pattern } })),
      setBreathingPhase: (phase) =>
        set((state) => ({ breathing: { ...state.breathing, phase } })),
      incrementCycle: () =>
        set((state) => ({
          breathing: { ...state.breathing, cycleCount: state.breathing.cycleCount + 1 },
        })),
      resetBreathing: () =>
        set((state) => ({
          breathing: { ...state.breathing, phase: 'inhale', cycleCount: 0 },
        })),

      // Sound initial state
      sound: {
        activeSound: null,
        volume: 0.5,
        isPlaying: false,
      },
      setActiveSound: (activeSound) =>
        set((state) => ({ sound: { ...state.sound, activeSound, isPlaying: !!activeSound } })),
      setVolume: (volume) =>
        set((state) => ({ sound: { ...state.sound, volume } })),
      toggleSound: () =>
        set((state) => ({ sound: { ...state.sound, isPlaying: !state.sound.isPlaying } })),

      // UI
      showCompletionModal: false,
      setShowCompletionModal: (show) => set({ showCompletionModal: show }),
    }),
    {
      name: 'mindfulminutes-storage',
      partialize: (state) => ({
        timer: { selectedDuration: state.timer.selectedDuration },
        breathing: { pattern: state.breathing.pattern },
        sound: { volume: state.sound.volume },
      }),
    }
  )
)
