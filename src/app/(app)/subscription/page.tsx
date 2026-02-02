'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/stripe'

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Upgrade to Premium</h1>
        <p className="text-white/60">Unlock the full MindfulMinutes experience</p>
      </motion.div>

      {/* Pricing Card */}
      <motion.div
        className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Decorative */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium">
            Most Popular
          </span>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">{PLANS.premium.name}</h3>
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-white">$7.99</span>
            <span className="text-white/60">/month</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {PLANS.premium.features.map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white/80">{feature}</span>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Subscribe Now
            </>
          )}
        </Button>

        <p className="text-center text-white/40 text-sm mt-4">
          7-day free trial • Cancel anytime • Secure payment via Stripe
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
        
        {[
          {
            q: 'Can I cancel anytime?',
            a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
          },
          {
            q: 'Is there a free trial?',
            a: 'Yes! All new subscribers get a 7-day free trial. You won\'t be charged until the trial ends.',
          },
          {
            q: 'What payment methods do you accept?',
            a: 'We accept all major credit cards and debit cards through our secure payment processor, Stripe.',
          },
        ].map((faq, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white font-medium mb-2">{faq.q}</p>
            <p className="text-white/60 text-sm">{faq.a}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
