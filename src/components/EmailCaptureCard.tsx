'use client';

import { useState } from 'react';
import { subscribeToConvertKit } from '@/lib/convertkit';

interface EmailCaptureCardProps {
  quizGoals?: string[];
  dietType?: string;
}

export default function EmailCaptureCard({ quizGoals, dietType }: EmailCaptureCardProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const ok = await subscribeToConvertKit({
      email,
      formType: 'quizResults',
      fields: {
        ...(quizGoals ? { goals: quizGoals.join(', ') } : {}),
        ...(dietType ? { diet_type: dietType } : {}),
      },
    });
    setStatus(ok ? 'success' : 'error');
  };

  if (status === 'success') {
    return (
      <div className="bg-teal-900/30 border border-teal/30 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">&#10003;</div>
        <h3 className="text-lg font-semibold text-text mb-1">Check your inbox!</h3>
        <p className="text-text-secondary text-sm">
          We&apos;ve sent your personalized supplement plan. Look for an email from Find Your Supplement.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-teal/20 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">&#9993;</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text mb-1">
            Email me my personalized plan
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Get your supplement recommendations delivered to your inbox with dosage details, timing guidance, and links to trusted brands.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-background border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-teal hover:bg-teal-light text-background font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Sending...' : 'Send My Plan'}
            </button>
          </form>
          {status === 'error' && (
            <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
          )}
          <p className="text-gray-600 text-xs mt-2">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}
