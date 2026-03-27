'use client';

import { useState, useEffect } from 'react';
import { subscribeToConvertKit } from '@/lib/convertkit';

const DISMISS_KEY = 'fys_leadmagnet_dismissed';
const DISMISS_DAYS = 7;

export default function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 86400000) return;
    }

    // Show popup after scrolling 50%
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrolled / docHeight > 0.5) {
        setVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const ok = await subscribeToConvertKit({ email, formType: 'leadMagnet' });
    setStatus(ok ? 'success' : 'error');
    if (ok) {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 animate-slide-up">
      <div className="bg-surface border border-teal/30 rounded-xl shadow-2xl shadow-black/40 p-5">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-500 hover:text-text text-lg leading-none"
          aria-label="Close"
        >
          &#10005;
        </button>

        {status === 'success' ? (
          <div className="text-center py-2">
            <div className="text-2xl mb-2">&#10003;</div>
            <p className="text-text font-semibold text-sm">Check your inbox!</p>
            <p className="text-text-secondary text-xs mt-1">Your free guide is on its way.</p>
          </div>
        ) : (
          <>
            <div className="text-2xl mb-2">&#128218;</div>
            <h3 className="text-text font-semibold text-sm mb-1">
              Free Guide: The 10 Most Overhyped Supplements
            </h3>
            <p className="text-text-secondary text-xs mb-3 leading-relaxed">
              Find out which popular supplements are backed by science — and which are just marketing hype. Based on 2,000+ PubMed studies.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-sm text-text placeholder:text-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-teal hover:bg-teal-light text-background font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Get Free Guide'}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-1">Something went wrong. Try again.</p>
            )}
            <p className="text-gray-600 text-[10px] mt-2 text-center">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
