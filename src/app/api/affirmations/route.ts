import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const CATEGORY_PROMPTS: Record<string, string> = {
  morning: 'Generate a single uplifting morning affirmation to start the day with positivity and energy.',
  stress: 'Generate a single calming affirmation for stress relief and inner peace.',
  confidence: 'Generate a single empowering affirmation to boost self-confidence and self-worth.',
  gratitude: 'Generate a single heartfelt gratitude affirmation to appreciate life.',
  sleep: 'Generate a single soothing affirmation for peaceful sleep and relaxation.',
}

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json()
    
    const prompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS.morning
    
    // Try OpenAI API
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a mindfulness and meditation expert. Generate short, powerful affirmations that are personal (using "I" statements), present tense, positive, and emotionally resonant. Keep responses to a single sentence.',
              },
              { role: 'user', content: prompt },
            ],
            max_tokens: 100,
            temperature: 0.8,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const affirmation = data.choices[0]?.message?.content?.trim()
          
          if (affirmation) {
            // Save to database if user is logged in
            const session = await getServerSession(authOptions)
            if (session?.user?.email) {
              const user = await prisma.user.findUnique({
                where: { email: session.user.email },
              })
              
              if (user) {
                await prisma.affirmation.create({
                  data: {
                    userId: user.id,
                    text: affirmation,
                    category,
                  },
                })
              }
            }
            
            return NextResponse.json({ affirmation })
          }
        }
      } catch (error) {
        console.error('OpenAI API error:', error)
      }
    }

    // Fallback affirmations
    const fallbacks: Record<string, string[]> = {
      morning: [
        "Today is a new beginning filled with endless possibilities.",
        "I wake up grateful for this beautiful day ahead.",
        "I am energized and ready to embrace whatever comes my way.",
      ],
      stress: [
        "I release all tension and welcome peace into my mind.",
        "I am calm, centered, and in control of my thoughts.",
        "With each breath, I let go of stress and anxiety.",
      ],
      confidence: [
        "I believe in myself and my unique abilities.",
        "I am worthy of success and happiness.",
        "My confidence grows stronger with each passing day.",
      ],
      gratitude: [
        "I am grateful for the abundance that flows into my life.",
        "I appreciate the small moments that bring me joy.",
        "My heart is full of gratitude for all that I have.",
      ],
      sleep: [
        "I release the day and welcome peaceful rest.",
        "My mind is calm, my body is relaxed, and sleep comes easily.",
        "I am safe and at peace as I drift into restful sleep.",
      ],
    }

    const categoryFallbacks = fallbacks[category] || fallbacks.morning
    const affirmation = categoryFallbacks[Math.floor(Math.random() * categoryFallbacks.length)]

    return NextResponse.json({ affirmation })
  } catch (error) {
    console.error('Error generating affirmation:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

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

    const affirmations = await prisma.affirmation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ affirmations })
  } catch (error) {
    console.error('Error fetching affirmations:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
