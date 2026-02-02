'use client'

import { motion } from 'framer-motion'
import { Flame, Trophy, Clock, Calendar } from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalSessions: number
  totalMinutes: number
}

export function StreakDisplay({ data }: { data: StreakData }) {
  const stats = [
    {
      label: 'Current Streak',
      value: data.currentStreak,
      unit: 'days',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      highlight: true,
    },
    {
      label: 'Best Streak',
      value: data.longestStreak,
      unit: 'days',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-500',
    },
    {
      label: 'Total Sessions',
      value: data.totalSessions,
      unit: '',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Time',
      value: Math.round(data.totalMinutes / 60),
      unit: 'hours',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.label}
            className={`relative p-5 rounded-2xl overflow-hidden ${
              stat.highlight
                ? `bg-gradient-to-br ${stat.color}`
                : 'bg-white/10'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Background decoration */}
            {stat.highlight && (
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            )}
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${stat.highlight ? 'text-white' : 'text-white/60'}`} />
                <span className={`text-xs font-medium ${stat.highlight ? 'text-white/90' : 'text-white/60'}`}>
                  {stat.label}
                </span>
              </div>
              
              <div className="flex items-baseline gap-1">
                <motion.span
                  className={`text-3xl font-bold ${stat.highlight ? 'text-white' : 'text-white'}`}
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {stat.value}
                </motion.span>
                {stat.unit && (
                  <span className={`text-sm ${stat.highlight ? 'text-white/80' : 'text-white/60'}`}>
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Streak calendar component
interface CalendarDay {
  date: string
  day: number
  completed: boolean
  isToday: boolean
}

export function StreakCalendar({ sessions }: { sessions: { date: string; completed: boolean }[] }) {
  const today = new Date()
  const days: CalendarDay[] = []
  
  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const session = sessions.find(s => s.date === dateStr)
    
    days.push({
      date: dateStr,
      day: date.getDate(),
      completed: session?.completed ?? false,
      isToday: i === 0,
    })
  }

  return (
    <div className="space-y-3">
      <h3 className="text-white/80 text-sm font-medium">Last 30 Days</h3>
      
      <div className="flex flex-wrap gap-1">
        {days.map((day) => (
          <motion.div
            key={day.date}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
              day.completed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                : day.isToday
                ? 'bg-white/20 text-white ring-2 ring-indigo-500'
                : 'bg-white/5 text-white/40'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (30 - days.indexOf(day)) * 0.02 }}
            title={day.date}
          >
            {day.completed ? '✓' : day.day}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
