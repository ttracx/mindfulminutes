import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const PLANS = {
  premium: {
    name: 'MindfulMinutes Premium',
    price: '$7.99/month',
    priceId: process.env.STRIPE_PRICE_ID!,
    features: [
      'Unlimited meditation sessions',
      'All breathing exercises',
      'Mood tracking & insights',
      'Daily AI affirmations',
      'Session history & analytics',
      'Ambient sound library',
      'Streak tracking & achievements',
    ],
  },
}
