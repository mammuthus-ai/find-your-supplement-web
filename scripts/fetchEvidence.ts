#!/usr/bin/env npx tsx
/**
 * Evidence Cache Builder
 * Queries 6 free APIs to build an evidence cache for the recommendation engine.
 * Run: npx tsx scripts/fetchEvidence.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// ─── Config ──────────────────────────────────────────────────────────────────

const SUPPLEMENTS = [
  'Vitamin D3', 'Magnesium', 'Omega-3', 'Zinc', 'Vitamin B12',
  'Methylfolate', 'Vitamin C', 'CoQ10', 'Ashwagandha', 'Creatine',
  'Melatonin', 'NAC', 'Probiotics', 'Collagen', 'Iron',
]

const CONDITIONS = [
  'energy', 'sleep', 'muscle strength', 'cognitive function', 'focus',
  'longevity', 'immune function', 'immunity', 'mood', 'anxiety',
  'depression', 'weight loss', 'fatigue', 'joint pain', 'hair loss',
  'digestive health', 'bone health', 'heart health', 'inflammation',
]

// Map supplement names to PubMed-friendly search terms
const PUBMED_NAMES: Record<string, string> = {
  'Omega-3': 'omega-3 fatty acids',
  'CoQ10': 'coenzyme Q10',
  'Ashwagandha': 'Withania somnifera',
  'Creatine': 'creatine monohydrate',
  'NAC': 'N-acetylcysteine',
  'Collagen': 'collagen peptides',
  'Methylfolate': 'methylfolate OR 5-MTHF',
}

// Map supplement names to OpenFDA search terms
const FDA_NAMES: Record<string, string> = {
  'Vitamin D3': 'cholecalciferol',
  'Omega-3': 'fish oil',
  'CoQ10': 'coenzyme q10',
  'Ashwagandha': 'ashwagandha',
  'NAC': 'acetylcysteine',
  'Methylfolate': 'methylfolate',
}

// Relevant condition pairs per supplement (skip irrelevant combos)
const SUPPLEMENT_CONDITIONS: Record<string, string[]> = {
  'Vitamin D3': ['bone health', 'immune function', 'mood', 'depression', 'sleep', 'fatigue', 'muscle strength'],
  'Magnesium': ['sleep', 'anxiety', 'muscle strength', 'heart health', 'fatigue', 'bone health', 'mood'],
  'Omega-3': ['heart health', 'inflammation', 'cognitive function', 'mood', 'depression', 'joint pain', 'immune function'],
  'Zinc': ['immune function', 'immunity', 'hair loss', 'cognitive function', 'mood', 'digestive health'],
  'Vitamin B12': ['energy', 'fatigue', 'cognitive function', 'mood', 'depression', 'immune function'],
  'Methylfolate': ['mood', 'depression', 'cognitive function', 'energy', 'heart health'],
  'Vitamin C': ['immune function', 'immunity', 'inflammation', 'heart health', 'energy', 'fatigue'],
  'CoQ10': ['heart health', 'energy', 'fatigue', 'cognitive function', 'muscle strength'],
  'Ashwagandha': ['anxiety', 'mood', 'sleep', 'muscle strength', 'cognitive function', 'fatigue', 'energy'],
  'Creatine': ['muscle strength', 'cognitive function', 'energy', 'fatigue'],
  'Melatonin': ['sleep', 'immune function', 'mood'],
  'NAC': ['mood', 'depression', 'immune function', 'inflammation', 'digestive health', 'cognitive function'],
  'Probiotics': ['digestive health', 'immune function', 'mood', 'inflammation', 'weight loss'],
  'Collagen': ['joint pain', 'bone health', 'hair loss', 'digestive health'],
  'Iron': ['energy', 'fatigue', 'cognitive function', 'immune function', 'hair loss'],
}

interface EvidenceEntry {
  supplement: string
  condition: string
  pubmedCount: number
  rctCount: number
  metaAnalysisCount: number
  citationScore: number
  trialData: { completed: number; positive: number; phase3Plus: number }
  safety: { safeUpperLimit: string; adverseEventCount: number; interactionWarnings: string[] }
  productCount: number
  lastUpdated: string
}

// ─── Rate limiting ──────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return await res.json()
      if (res.status === 429) {
        console.log(`  Rate limited, waiting 5s...`)
        await sleep(5000)
        continue
      }
      return null
    } catch {
      if (i < retries) await sleep(2000)
    }
  }
  return null
}

// ─── API Fetchers ────────────────────────────────────────────────────────────

async function fetchPubMed(supplement: string, condition: string) {
  const name = PUBMED_NAMES[supplement] || supplement
  const base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'

  // Total count
  const totalUrl = `${base}?db=pubmed&term="${encodeURIComponent(name)}"[Title/Abstract]+AND+"${encodeURIComponent(condition)}"[Title/Abstract]&rettype=count&retmode=json`
  const total = await fetchWithRetry(totalUrl)
  await sleep(350) // 3 req/sec limit

  // RCT count
  const rctUrl = `${base}?db=pubmed&term="${encodeURIComponent(name)}"[Title/Abstract]+AND+"${encodeURIComponent(condition)}"[Title/Abstract]+AND+"randomized+controlled+trial"[pt]&rettype=count&retmode=json`
  const rct = await fetchWithRetry(rctUrl)
  await sleep(350)

  // Meta-analysis count
  const maUrl = `${base}?db=pubmed&term="${encodeURIComponent(name)}"[Title/Abstract]+AND+"${encodeURIComponent(condition)}"[Title/Abstract]+AND+("meta-analysis"[pt]+OR+"systematic+review"[pt])&rettype=count&retmode=json`
  const ma = await fetchWithRetry(maUrl)
  await sleep(350)

  return {
    pubmedCount: parseInt(total?.esearchresult?.count || '0', 10),
    rctCount: parseInt(rct?.esearchresult?.count || '0', 10),
    metaAnalysisCount: parseInt(ma?.esearchresult?.count || '0', 10),
  }
}

async function fetchSemanticScholar(supplement: string, condition: string) {
  const query = encodeURIComponent(`${supplement} ${condition} supplement`)
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=10&fields=citationCount`
  const data = await fetchWithRetry(url)
  await sleep(3100) // 100 req/5min = 1 req/3sec

  if (!data?.data?.length) return { citationScore: 0 }

  const citations = data.data
    .map((p: any) => p.citationCount || 0)
    .filter((c: number) => c > 0)

  const avg = citations.length > 0
    ? Math.round(citations.reduce((a: number, b: number) => a + b, 0) / citations.length)
    : 0

  return { citationScore: avg }
}

async function fetchClinicalTrials(supplement: string, condition: string) {
  const query = encodeURIComponent(supplement)
  const cond = encodeURIComponent(condition)
  const url = `https://clinicaltrials.gov/api/v2/studies?query.intr=${query}&query.cond=${cond}&pageSize=50&format=json`
  const data = await fetchWithRetry(url)

  if (!data?.studies?.length) {
    return { completed: 0, positive: 0, phase3Plus: 0 }
  }

  let completed = 0
  let positive = 0
  let phase3Plus = 0

  for (const study of data.studies) {
    const status = study.protocolSection?.statusModule?.overallStatus
    const phase = study.protocolSection?.designModule?.phases?.[0] || ''

    if (status === 'COMPLETED') completed++
    if (phase.includes('PHASE3') || phase.includes('PHASE4')) phase3Plus++

    // Check for positive results in primary outcomes
    const results = study.resultsSection
    if (results) positive++ // Having results at all is a positive signal
  }

  return { completed, positive, phase3Plus }
}

async function fetchOpenFDA(supplement: string) {
  const name = FDA_NAMES[supplement] || supplement.toLowerCase()
  const url = `https://api.fda.gov/drug/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(name)}"&count=receivedate`
  const data = await fetchWithRetry(url)

  if (!data?.results) return { adverseEventCount: 0 }

  const total = data.results.reduce((sum: number, r: any) => sum + (r.count || 0), 0)
  return { adverseEventCount: total }
}

async function fetchDSLD(supplement: string) {
  const name = encodeURIComponent(supplement)
  const url = `https://api.ods.od.nih.gov/dsld/v9/browse-ingredients?q=${name}&max=1`

  try {
    const data = await fetchWithRetry(url)
    const count = data?.total || data?.resultCount || 0
    return { productCount: typeof count === 'number' ? count : 0 }
  } catch {
    return { productCount: 0 }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Evidence Cache Builder ===')
  console.log(`Supplements: ${SUPPLEMENTS.length}`)

  const entries: Record<string, EvidenceEntry[]> = {}
  const today = new Date().toISOString().split('T')[0]

  // Fetch safety data once per supplement (not per condition)
  const safetyCache: Record<string, { adverseEventCount: number }> = {}
  const productCache: Record<string, { productCount: number }> = {}

  console.log('\n[1/3] Fetching safety + product data per supplement...')
  for (const supp of SUPPLEMENTS) {
    console.log(`  ${supp}...`)
    safetyCache[supp] = await fetchOpenFDA(supp)
    await sleep(300)
    productCache[supp] = await fetchDSLD(supp)
    await sleep(300)
    console.log(`    FDA adverse events: ${safetyCache[supp].adverseEventCount}, DSLD products: ${productCache[supp].productCount}`)
  }

  console.log('\n[2/3] Fetching evidence per supplement-condition pair...')
  let pairCount = 0
  const totalPairs = Object.values(SUPPLEMENT_CONDITIONS).reduce((a, b) => a + b.length, 0)

  for (const supp of SUPPLEMENTS) {
    const conditions = SUPPLEMENT_CONDITIONS[supp] || []
    entries[supp] = []

    for (const condition of conditions) {
      pairCount++
      process.stdout.write(`  [${pairCount}/${totalPairs}] ${supp} × ${condition}...`)

      const pubmed = await fetchPubMed(supp, condition)
      const scholar = await fetchSemanticScholar(supp, condition)
      const trials = await fetchClinicalTrials(supp, condition)

      const entry: EvidenceEntry = {
        supplement: supp,
        condition,
        pubmedCount: pubmed.pubmedCount,
        rctCount: pubmed.rctCount,
        metaAnalysisCount: pubmed.metaAnalysisCount,
        citationScore: scholar.citationScore,
        trialData: trials,
        safety: {
          safeUpperLimit: '', // populated from existing supplement data
          adverseEventCount: safetyCache[supp]?.adverseEventCount || 0,
          interactionWarnings: [],
        },
        productCount: productCache[supp]?.productCount || 0,
        lastUpdated: today,
      }

      entries[supp].push(entry)
      console.log(` PubMed: ${pubmed.pubmedCount}, RCTs: ${pubmed.rctCount}, MAs: ${pubmed.metaAnalysisCount}, Citations: ${scholar.citationScore}, Trials: ${trials.completed}`)
    }
  }

  console.log('\n[3/3] Writing evidence cache...')
  const cache = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    entries,
  }

  const outPath = path.join(__dirname, '..', 'src', 'data', 'evidenceCache.json')
  fs.writeFileSync(outPath, JSON.stringify(cache, null, 2))
  console.log(`\nWritten to ${outPath}`)
  console.log(`Total pairs: ${pairCount}`)
  console.log('Done!')
}

main().catch(console.error)
