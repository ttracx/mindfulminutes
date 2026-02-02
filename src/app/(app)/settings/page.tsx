'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, LogOut, Moon, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Customize your experience</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-2xl text-white">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{session?.user?.name || 'User'}</p>
            <p className="text-white/60 text-sm">{session?.user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
        </div>
        
        <div className="space-y-4">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white">Notifications</p>
                <p className="text-white/40 text-sm">Daily reminders to meditate</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-indigo-500' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: notifications ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white">Dark Mode</p>
                <p className="text-white/40 text-sm">Easier on the eyes</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-indigo-500' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: darkMode ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-white">Sound Effects</p>
                <p className="text-white/40 text-sm">Completion sounds & UI feedback</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEffects ? 'bg-indigo-500' : 'bg-white/20'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: soundEffects ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-white/60" />
          <h2 className="text-lg font-semibold text-white">Account</h2>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={() => window.location.href = '/subscription'}
          >
            Manage Subscription
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-white/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>MindfulMinutes v1.0.0</p>
        <p className="mt-1">Made with ❤️ for your wellbeing</p>
      </motion.div>
    </div>
  )
}
