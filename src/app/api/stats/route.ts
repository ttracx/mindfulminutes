import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        streaks: true,
        meditationSessions: {
          orderBy: { completedAt: 'desc' },
          take: 30,
        },
        moodEntries: {
          orderBy: { createdAt: 'desc' },
          take: 30,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate session calendar for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const sessionCalendar = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const hasSession = user.meditationSessions.some((s) => {
        const sessionDate = new Date(s.completedAt).toISOString().split('T')[0]
        return sessionDate === dateStr
      })
      
      sessionCalendar.push({ date: dateStr, completed: hasSession })
    }

    // Calculate mood trends
    const moodTrend = user.moodEntries.slice(0, 7).map((m) => ({
      date: m.createdAt.toISOString().split('T')[0],
      mood: m.mood,
      energy: m.energy,
    }))

    // Calculate session breakdown by type
    const sessionsByType = user.meditationSessions.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      streaks: user.streaks || {
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
      },
      sessionCalendar,
      moodTrend,
      sessionsByType,
      recentSessions: user.meditationSessions.slice(0, 5),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
