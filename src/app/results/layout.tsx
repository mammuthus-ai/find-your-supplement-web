import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Supplement Recommendations — Personalized Results',
  description:
    'Your personalized supplement recommendations based on your health goals, diet, lifestyle, and symptoms. Evidence-graded and ranked by relevance.',
  alternates: {
    canonical: 'https://findyoursupplement.co/results/',
  },
  openGraph: {
    title: 'Your Personalized Supplement Recommendations',
    description:
      'Evidence-based supplement recommendations tailored to your health profile. Each supplement tagged by research tier (Strong, Good, Limited, Weak) based on PubMed evidence.',
    url: 'https://findyoursupplement.co/results/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Personalized Supplement Recommendations',
    description:
      'Evidence-based supplement recommendations tailored to your health profile.',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
