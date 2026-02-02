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
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const sessions = await prisma.meditationSession.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { streaks: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { duration, type, notes } = await req.json()

    // Create session
    const meditationSession = await prisma.meditationSession.create({
      data: {
        userId: user.id,
        duration,
        type,
        notes,
      },
    })

    // Update streaks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const lastSession = user.streaks?.lastSessionDate
    const lastSessionDate = lastSession ? new Date(lastSession) : null
    lastSessionDate?.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let newStreak = 1
    if (lastSessionDate) {
      if (lastSessionDate.getTime() === today.getTime()) {
        // Same day, keep current streak
        newStreak = user.streaks?.currentStreak || 1
      } else if (lastSessionDate.getTime() === yesterday.getTime()) {
        // Consecutive day, increment streak
        newStreak = (user.streaks?.currentStreak || 0) + 1
      }
    }

    const longestStreak = Math.max(newStreak, user.streaks?.longestStreak || 0)

    await prisma.streak.upsert({
      where: { userId: user.id },
      update: {
        currentStreak: newStreak,
        longestStreak,
        lastSessionDate: new Date(),
        totalSessions: { increment: 1 },
        totalMinutes: { increment: Math.ceil(duration / 60) },
      },
      create: {
        userId: user.id,
        currentStreak: 1,
        longestStreak: 1,
        lastSessionDate: new Date(),
        totalSessions: 1,
        totalMinutes: Math.ceil(duration / 60),
      },
    })

    return NextResponse.json({ session: meditationSession })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
