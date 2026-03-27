const STORAGE_KEY = 'fys_quiz_count';
const BASE_COUNT = 12847;

export function getQuizCount(): number {
  if (typeof window === 'undefined') return BASE_COUNT;
  const stored = localStorage.getItem(STORAGE_KEY);
  return BASE_COUNT + (stored ? parseInt(stored, 10) : 0);
}

export function incrementQuizCount(): number {
  if (typeof window === 'undefined') return BASE_COUNT;
  const stored = localStorage.getItem(STORAGE_KEY);
  const current = stored ? parseInt(stored, 10) : 0;
  const next = current + 1;
  localStorage.setItem(STORAGE_KEY, String(next));
  return BASE_COUNT + next;
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}
