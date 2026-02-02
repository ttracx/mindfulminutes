'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Timer, Wind, Sparkles, Volume2, ChevronRight } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface Session {
  id: string
  type: string
  duration: number
  completedAt: string
  notes?: string
}

const TYPE_ICONS = {
  timer: Timer,
  breathing: Wind,
  guided: Sparkles,
  ambient: Volume2,
}

const TYPE_COLORS = {
  timer: 'from-indigo-500 to-purple-600',
  breathing: 'from-blue-500 to-cyan-500',
  guided: 'from-purple-500 to-pink-500',
  ambient: 'from-emerald-500 to-teal-500',
}

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs}s`
    if (secs === 0) return `${mins}m`
    return `${mins}m ${secs}s`
  }

  const filteredSessions = filter
    ? sessions.filter((s) => s.type === filter)
    : sessions

  // Group sessions by date
  const groupedSessions = filteredSessions.reduce((acc, session) => {
    const date = format(new Date(session.completedAt), 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = []
    acc[date].push(session)
    return acc
  }, {} as Record<string, Session[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/60">No sessions yet</p>
        <p className="text-white/40 text-sm">Start meditating to see your history</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            filter === null
              ? 'bg-white/20 text-white'
              : 'text-white/60 hover:text-white'
          }`}
        >
          All
        </button>
        {Object.entries(TYPE_ICONS).map(([type, Icon]) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              filter === type
                ? `bg-gradient-to-r ${TYPE_COLORS[type as keyof typeof TYPE_COLORS]} text-white`
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      {/* Sessions list */}
      <div className="space-y-6">
        {Object.entries(groupedSessions).map(([date, daySessions]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            
            <div className="space-y-2">
              {daySessions.map((session, index) => {
                const Icon = TYPE_ICONS[session.type as keyof typeof TYPE_ICONS] || Clock
                const color = TYPE_COLORS[session.type as keyof typeof TYPE_COLORS] || 'from-gray-500 to-gray-600'
                
                return (
                  <motion.div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white font-medium capitalize">{session.type} Session</p>
                      <p className="text-white/60 text-sm">
                        {formatDuration(session.duration)} • {formatDistanceToNow(new Date(session.completedAt), { addSuffix: true })}
                      </p>
                      {session.notes && (
                        <p className="text-white/40 text-sm mt-1 line-clamp-1">{session.notes}</p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Stats summary */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <p className="text-white/60 text-sm">
          Total: {filteredSessions.length} sessions •{' '}
          {formatDuration(filteredSessions.reduce((acc, s) => acc + s.duration, 0))} of mindfulness
        </p>
      </div>
    </div>
  )
}
