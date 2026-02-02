'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { SideNav, BottomNav } from '@/components/layout/Navigation'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <SideNav />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
