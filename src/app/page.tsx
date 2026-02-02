'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  Sparkles, 
  Timer, 
  Wind, 
  Volume2, 
  Smile, 
  BarChart3, 
  Star,
  ArrowRight,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/stripe'

const FEATURES = [
  {
    icon: Timer,
    title: 'Guided Meditation Timer',
    description: 'Customizable sessions with gentle reminders and beautiful visualizations',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Wind,
    title: 'Breathing Exercises',
    description: 'Box breathing, 4-7-8, and more patterns to calm your mind',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Volume2,
    title: 'Ambient Sounds',
    description: 'Rain, ocean, forest, and more to enhance your practice',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'AI Affirmations',
    description: 'Personalized daily affirmations powered by AI',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Smile,
    title: 'Mood Tracking',
    description: 'Track your emotional journey and discover patterns',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Progress & Streaks',
    description: 'Stay motivated with streaks and detailed insights',
    color: 'from-red-500 to-pink-500',
  },
]

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Logo */}
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">MindfulMinutes</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find Your{' '}
            <span className="gradient-text">Inner Peace</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Transform your wellbeing with guided meditations, breathing exercises, 
            mood tracking, and AI-powered affirmations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href={session ? '/dashboard' : '/auth/signin'}>
              <Button size="lg" className="px-8">
                {session ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="secondary">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '500K+', label: 'Sessions Completed' },
              { value: '4.9', label: 'App Rating', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  {stat.icon && <stat.icon className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                </div>
                <span className="text-white/60 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Mindfulness
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              A complete toolkit to support your meditation journey and mental wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/60">
              One plan with everything you need
            </p>
          </div>

          <motion.div
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{PLANS.premium.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-white">$7.99</span>
                <span className="text-white/60">/month</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {PLANS.premium.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href={session ? '/subscription' : '/auth/signin'}>
                <Button size="lg" className="px-12">
                  Get Started
                </Button>
              </Link>
              <p className="text-white/40 text-sm mt-4">
                7-day free trial • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">MindfulMinutes</span>
          </div>
          
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} MindfulMinutes. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
