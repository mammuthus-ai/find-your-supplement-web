import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Find Your Supplement — Personalized Supplement Recommendations',
  description:
    'Take our free quiz to get science-backed, personalized supplement recommendations based on your health goals, diet, lifestyle, and symptoms.',
  keywords: 'supplement recommendations, personalized supplements, vitamin quiz, health supplements',
  openGraph: {
    title: 'Find Your Supplement',
    description: 'Get personalized, evidence-based supplement recommendations in 2 minutes.',
    url: 'https://findyoursupplement.shop',
    siteName: 'Find Your Supplement',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-bg">
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
