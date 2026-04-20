interface QuizCounterProps {
  className?: string;
}

/**
 * Honest social-proof widget. Prior version used a fake "12,847 + your
 * localStorage" number; we don't have a real queryable live user count
 * from this static Next.js export. Instead we surface a real, verifiable
 * stat that differentiates us from competitors: the actual PubMed article
 * count backing our evidence cache.
 *
 * To update: bump PUBMED_ARTICLES after each weekly scraper run. A future
 * enhancement can generate this from Supabase + ship via the same
 * /version.json-style static file.
 */
export default function QuizCounter({ className = '' }: QuizCounterProps) {
  const PUBMED_ARTICLES = 2278; // Real count in Supabase as of 2026-04-19

  return (
    <p className={`text-text-secondary text-sm ${className}`}>
      Backed by{' '}
      <span className="text-teal font-semibold">
        {PUBMED_ARTICLES.toLocaleString('en-US')}+
      </span>{' '}
      PubMed studies
    </p>
  );
}
