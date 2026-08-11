// Throwaway test script — not a permanent test suite (repo has no test framework,
// per MD1 §3 don't add one). Run with: npx tsx scripts/test-scoring.ts
// Exits non-zero if any of the 6 MD2 §9 test users produce the wrong result.

import { scoreAssessment, Answer, PrimaryResult } from '../lib/assessment/scoring'

let failures = 0

function run(label: string, answers: Answer[], intentAnswer: string, expected: PrimaryResult, expectTieBroken?: boolean) {
  const result = scoreAssessment(answers, intentAnswer)
  const pass = result.primaryResult === expected && (expectTieBroken === undefined || result.tieBroken === expectTieBroken)
  const status = pass ? 'PASS' : 'FAIL'
  console.log(
    `[${status}] ${label} → got "${result.primaryResult}" (tieBroken=${result.tieBroken}), expected "${expected}"${expectTieBroken !== undefined ? ` (tieBroken=${expectTieBroken})` : ''}`
  )
  console.log(`        scores: ${JSON.stringify(result.scores)}  raw: ${JSON.stringify(result.rawPoints)}  lowestQuestionId: ${result.lowestQuestionId}`)
  if (!pass) failures++
}

// ── User A — new event planner, no website, relies on Instagram → Build ────
run(
  'User A (Build)',
  [
    { questionId: 'q1', optionId: 'no' },
    { questionId: 'q2', optionId: 'social' },
    { questionId: 'q3', optionId: '0-5' },
    { questionId: 'q4', optionId: 'no_process' },
    { questionId: 'q5', optionId: 'most_disappear' },
    { questionId: 'q6', optionId: 'no_followup' },
    { questionId: 'q7', optionId: 'almost_everything' },
    { questionId: 'q8', optionId: 'getting_found' },
  ],
  'warm',
  'build'
)

// ── User B — established photographer, good following, few enquiries → Attract ──
run(
  'User B (Attract)',
  [
    { questionId: 'q1', optionId: 'complete' },
    { questionId: 'q2', optionId: 'social' },
    { questionId: 'q3', optionId: '0-5' },
    { questionId: 'q4', optionId: 'personal_fast' },
    { questionId: 'q5', optionId: 'some_convert' },
    { questionId: 'q6', optionId: 'manual_consistent' },
    { questionId: 'q7', optionId: 'about_half' },
    { questionId: 'q8', optionId: 'getting_found' },
  ],
  'warm',
  'attract'
)

// ── User C — established consultant, lots of enquiries, prospects vanish after proposal → Convert ──
run(
  'User C (Convert)',
  [
    { questionId: 'q1', optionId: 'complete' },
    { questionId: 'q2', optionId: 'consistent' },
    { questionId: 'q3', optionId: '40+' },
    { questionId: 'q4', optionId: 'personal_fast' },
    { questionId: 'q5', optionId: 'most_disappear' },
    { questionId: 'q6', optionId: 'automated_seq' },
    { questionId: 'q7', optionId: 'almost_none' },
    { questionId: 'q8', optionId: 'getting_people_to_say_yes' },
  ],
  'hot',
  'convert',
  false
)

// ── User D — agency, 50+ leads/month, all followed up manually → Automate ──
run(
  'User D (Automate)',
  [
    { questionId: 'q1', optionId: 'complete' },
    { questionId: 'q2', optionId: 'consistent' },
    { questionId: 'q3', optionId: '40+' },
    { questionId: 'q4', optionId: 'personal_fast' },
    { questionId: 'q5', optionId: 'some_convert' },
    { questionId: 'q6', optionId: 'manual_consistent' },
    { questionId: 'q7', optionId: 'almost_everything' },
    { questionId: 'q8', optionId: 'keeping_up_with_followup' },
  ],
  'hot',
  'automate',
  false
)

// ── User E — strong site, consistent leads, high conversion, mostly automated (all ≥70) → Scale ──
run(
  'User E (Scale)',
  [
    { questionId: 'q1', optionId: 'complete' },
    { questionId: 'q2', optionId: 'consistent' },
    { questionId: 'q3', optionId: '40+' },
    { questionId: 'q4', optionId: 'automated' },
    { questionId: 'q5', optionId: 'predictable' },
    { questionId: 'q6', optionId: 'automated_seq' },
    { questionId: 'q7', optionId: 'almost_none' },
    { questionId: 'q8', optionId: 'getting_people_to_say_yes' },
  ],
  'cold',
  'scale',
  false
)

// ── User F — two dimensions within 10 points, different raw totals → deterministic tie-break ──
run(
  'User F (Tie-break)',
  [
    { questionId: 'q1', optionId: 'complete' },
    { questionId: 'q2', optionId: 'consistent' },
    { questionId: 'q3', optionId: '16-40' },
    { questionId: 'q4', optionId: 'slow' },
    { questionId: 'q5', optionId: 'some_convert' },
    { questionId: 'q6', optionId: 'manual_consistent' },
    { questionId: 'q7', optionId: 'about_half' },
    { questionId: 'q8', optionId: 'getting_people_to_say_yes' },
  ],
  'warm',
  'convert',
  true
)

console.log('')
if (failures > 0) {
  console.error(`${failures} test(s) FAILED.`)
  process.exit(1)
} else {
  console.log('All 6 test users PASSED.')
  process.exit(0)
}
