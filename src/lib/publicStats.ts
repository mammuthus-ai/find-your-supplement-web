/**
 * Public stats counter — fetches and increments the server-side quiz
 * completion count via Supabase REST.
 *
 * Uses the Supabase anon key (safe to commit; RLS + RPC grants protect
 * mutations — only `increment_public_stat` can write, and only for a
 * whitelisted set of keys).
 *
 * Why direct fetch instead of @supabase/supabase-js:
 *  - Avoids ~70 KB bundle bloat for a 2-call feature
 *  - Static export build; SDK's dynamic code splitting adds complexity
 */

const SUPABASE_URL = 'https://gwxdvefljcsvrontftkh.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3eGR2ZWZsamNzdnJvbnRmdGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzM2MzUsImV4cCI6MjA4OTQ0OTYzNX0.LTWi0V6dl3Vq4w6gPj6jrnLh2BfAq-YdGejL3d0gnlI'

const BASE = `${SUPABASE_URL}/rest/v1`

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

/** Read a single public stat by key. Returns null on any failure. */
export async function getPublicStat(key: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE}/public_stats?key=eq.${encodeURIComponent(key)}&select=value`,
      { headers, cache: 'no-store' },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as Array<{ value: number }>
    return rows[0]?.value ?? null
  } catch {
    return null
  }
}

/** Atomically increment a whitelisted public stat. Returns the new value. */
export async function incrementPublicStat(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/rpc/increment_public_stat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ stat_key: key }),
    })
    if (!res.ok) return null
    return (await res.json()) as number
  } catch {
    return null
  }
}
