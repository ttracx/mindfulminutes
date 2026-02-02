'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Timer, 
  Wind, 
  Volume2, 
  Sparkles, 
  BarChart3, 
  Smile,
  Settings,
  Crown
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/meditate', label: 'Meditate', icon: Timer },
  { href: '/breathe', label: 'Breathe', icon: Wind },
  { href: '/sounds', label: 'Sounds', icon: Volume2 },
  { href: '/affirmations', label: 'Affirm', icon: Sparkles },
  { href: '/mood', label: 'Mood', icon: Smile },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-xl" />
      
      <div className="relative flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center p-2"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/50'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-white/50'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 p-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-white">MindfulMinutes</span>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Premium badge */}
      <div className="mt-auto">
        <Link
          href="/subscription"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
        >
          <Crown className="w-5 h-5" />
          <span>Upgrade to Premium</span>
        </Link>
        
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}
