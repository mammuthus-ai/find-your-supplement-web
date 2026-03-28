declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// ─── Page views (automatic via GA4 config, but can be called manually for SPAs)

export function trackPageView(url: string) {
  gtag('event', 'page_view', { page_path: url })
}

// ─── Quiz funnel events

export function trackQuizStart() {
  gtag('event', 'quiz_start', { event_category: 'quiz' })
}

export function trackQuizStepComplete(step: number, stepName: string) {
  gtag('event', 'quiz_step_complete', {
    event_category: 'quiz',
    step_number: step,
    step_name: stepName,
  })
}

export function trackQuizComplete(goals: string[], dietType: string) {
  gtag('event', 'quiz_complete', {
    event_category: 'quiz',
    goals: goals.join(','),
    diet_type: dietType,
  })
}

// ─── Results page events

export function trackResultsView(supplementCount: number) {
  gtag('event', 'results_view', {
    event_category: 'results',
    supplement_count: supplementCount,
  })
}

export function trackSupplementExpand(supplementName: string, rank: number) {
  gtag('event', 'supplement_expand', {
    event_category: 'results',
    supplement_name: supplementName,
    rank,
  })
}

export function trackAmazonClick(supplementName: string, rank: number) {
  gtag('event', 'amazon_click', {
    event_category: 'conversion',
    supplement_name: supplementName,
    rank,
  })
}

// ─── Email capture events

export function trackEmailCapture(formType: 'quiz_results' | 'lead_magnet') {
  gtag('event', 'email_capture', {
    event_category: 'conversion',
    form_type: formType,
  })
}

// ─── Blog events

export function trackBlogView(slug: string, category: string) {
  gtag('event', 'blog_view', {
    event_category: 'content',
    blog_slug: slug,
    blog_category: category,
  })
}

export function trackBlogCTAClick(slug: string) {
  gtag('event', 'blog_cta_click', {
    event_category: 'conversion',
    blog_slug: slug,
  })
}

// ─── Retake quiz

export function trackRetakeQuiz() {
  gtag('event', 'retake_quiz', { event_category: 'quiz' })
}
