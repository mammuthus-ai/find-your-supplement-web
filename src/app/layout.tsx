import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Find Your Supplement | Free Personalized Supplement Quiz',
    template: '%s | Find Your Supplement',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  description:
    'Take our free 2-minute quiz to discover which supplements your body actually needs. Evidence-based, personalized recommendations for energy, sleep, focus, immunity, and more.',
  keywords: [
    'supplement recommendations',
    'personalized supplements',
    'vitamin quiz',
    'health supplements',
    'best supplements',
    'supplement guide',
    'vitamin deficiency',
    'nutrition recommendations',
    'supplement quiz',
    'what supplements should I take',
  ],
  authors: [{ name: 'Find Your Supplement' }],
  creator: 'Find Your Supplement',
  publisher: 'Find Your Supplement',
  metadataBase: new URL('https://findyoursupplement.shop'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Find Your Supplement | Free Personalized Supplement Quiz',
    description:
      'Get personalized, evidence-based supplement recommendations in 2 minutes. Based on your health goals, diet, lifestyle, and symptoms.',
    url: 'https://findyoursupplement.shop',
    siteName: 'Find Your Supplement',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Supplement | Free Personalized Supplement Quiz',
    description:
      'Get personalized, evidence-based supplement recommendations in 2 minutes. Based on your health goals, diet, lifestyle, and symptoms.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Find Your Supplement',
  url: 'https://findyoursupplement.shop',
  description:
    'Free personalized supplement recommendations based on your health goals, diet, lifestyle, and symptoms.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://findyoursupplement.shop/blog/',
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Find Your Supplement',
  url: 'https://findyoursupplement.shop',
  description: 'Evidence-based personalized supplement recommendation platform.',
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-Z0VTGTBB6R'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-bg">
      <head>
        {GA_ID !== 'G-XXXXXXXXXX' && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
