'use client';

import { useState, useEffect } from 'react';
import { getQuizCount, formatCount } from '@/lib/quizCounter';

interface QuizCounterProps {
  className?: string;
}

export default function QuizCounter({ className = '' }: QuizCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getQuizCount());
  }, []);

  if (count === null) return null; // SSR: render nothing until hydrated

  return (
    <p className={`text-text-secondary text-sm ${className}`}>
      <span className="text-teal font-semibold">{formatCount(count)}+</span> people have found their supplements
    </p>
  );
}
