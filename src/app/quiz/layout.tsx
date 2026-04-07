import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Supplement Quiz — Personalized Recommendations in 2 Minutes',
  description:
    'Take our free 2-minute quiz to find out which supplements your body actually needs. Evidence-based recommendations for energy, sleep, focus, immunity, and more.',
  alternates: {
    canonical: 'https://findyoursupplement.shop/quiz/',
  },
  openGraph: {
    title: 'Free Supplement Quiz — Find Your Supplements in 2 Minutes',
    description:
      'Answer a short quiz about your health goals, diet, and lifestyle. Get personalized, science-backed supplement recommendations instantly.',
    url: 'https://findyoursupplement.shop/quiz/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Supplement Quiz — Personalized Recommendations',
    description:
      'Take our free 2-minute quiz to find out which supplements your body actually needs. Evidence-based, personalized to you.',
  },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
