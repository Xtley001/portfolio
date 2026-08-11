// Pure arithmetic. No React, no fetch, no hardcoded point values — all points
// come from questions.ts. Unit-testable with plain function calls (see
// scripts/test-scoring.ts).

import { QUESTIONS, DimensionKey, IntentKey, Question, QuestionOption } from './questions'

export interface Answer {
  questionId: string // 'q1'..'q8'
  optionId: string
}

export type PrimaryResult = 'build' | 'attract' | 'convert' | 'automate' | 'scale'

export interface ScoreResult {
  scores: Record<DimensionKey, number> // normalized 0–100
  rawPoints: Record<DimensionKey, number>
  primaryResult: PrimaryResult
  tieBroken: boolean
  lowestQuestionId: string // single string — feeds resultCopy.ts lookup
  intent: IntentKey
}

const DIM_ORDER: DimensionKey[] = ['foundation', 'leadGen', 'conversion', 'automation']

const DIVISORS: Record<DimensionKey, number> = {
  foundation: 3,
  leadGen: 6,
  conversion: 6,
  automation: 8,
}

const RESULT_BY_DIMENSION: Record<DimensionKey, PrimaryResult> = {
  foundation: 'build',
  leadGen: 'attract',
  conversion: 'convert',
  automation: 'automate',
}

function findQuestion(questionId: string): Question | undefined {
  return QUESTIONS.find(q => q.id === questionId)
}

function findOption(questionId: string, optionId: string): QuestionOption {
  const question = findQuestion(questionId)
  if (!question) throw new Error(`scoreAssessment: unknown question "${questionId}"`)
  const option = question.options.find(o => o.id === optionId)
  if (!option) throw new Error(`scoreAssessment: unknown option "${optionId}" for question "${questionId}"`)
  return option
}

// Points a specific question contributed to a specific dimension, given the answers array.
function pointsContributedBy(answers: Answer[], questionId: string, dimension: DimensionKey): number {
  const answer = answers.find(a => a.questionId === questionId)
  if (!answer) return 0
  const option = findOption(questionId, answer.optionId)
  return option.points?.[dimension] ?? 0
}

export function scoreAssessment(answers: Answer[], intentAnswer: string): ScoreResult {
  const rawPoints: Record<DimensionKey, number> = {
    foundation: 0,
    leadGen: 0,
    conversion: 0,
    automation: 0,
  }

  for (const answer of answers) {
    const option = findOption(answer.questionId, answer.optionId)
    for (const dim of DIM_ORDER) {
      const pts = option.points?.[dim]
      if (pts) rawPoints[dim] += pts
    }
  }

  const scores: Record<DimensionKey, number> = {
    foundation: Math.round((rawPoints.foundation / DIVISORS.foundation) * 100),
    leadGen: Math.round((rawPoints.leadGen / DIVISORS.leadGen) * 100),
    conversion: Math.round((rawPoints.conversion / DIVISORS.conversion) * 100),
    automation: Math.round((rawPoints.automation / DIVISORS.automation) * 100),
  }

  const intent: IntentKey =
    intentAnswer === 'hot' || intentAnswer === 'warm' || intentAnswer === 'cold' ? intentAnswer : 'cold'

  // ── Scale override: all four ≥ 70 → 'scale' regardless of everything else ──
  const allHigh = DIM_ORDER.every(d => scores[d] >= 70)
  if (allHigh) {
    return {
      scores,
      rawPoints,
      primaryResult: 'scale',
      tieBroken: false,
      lowestQuestionId: 'scale',
      intent,
    }
  }

  // ── Lowest dimension wins. Tie-break is raw-point comparison within a 10-point
  // window of the two lowest-scoring dimensions (MD2 §4 rule 4). No NLP, ever. ──
  const sorted = DIM_ORDER.slice().sort((a, b) => {
    if (scores[a] !== scores[b]) return scores[a] - scores[b]
    return DIM_ORDER.indexOf(a) - DIM_ORDER.indexOf(b) // fixed priority fallback
  })
  const lowest = sorted[0]
  const secondLowest = sorted[1]

  let winningDim: DimensionKey
  let tieBroken = false

  if (Math.abs(scores[lowest] - scores[secondLowest]) <= 10) {
    tieBroken = true
    if (rawPoints[lowest] < rawPoints[secondLowest]) {
      winningDim = lowest
    } else if (rawPoints[secondLowest] < rawPoints[lowest]) {
      winningDim = secondLowest
    } else {
      // Raw points also tie → fixed priority: Foundation > LeadGen > Conversion > Automation
      winningDim = DIM_ORDER.indexOf(lowest) < DIM_ORDER.indexOf(secondLowest) ? lowest : secondLowest
    }
  } else {
    winningDim = lowest
  }

  // ── lowestQuestionId: single ID within the winning dimension, feeds resultCopy.ts ──
  let lowestQuestionId: string

  if (winningDim === 'foundation') {
    // Foundation has only Q1 — pick reflection variant by the answer itself, not a second question.
    const q1Answer = answers.find(a => a.questionId === 'q1')
    lowestQuestionId = q1Answer?.optionId === 'no' ? 'q1_no' : 'q1_partial'
  } else if (winningDim === 'leadGen') {
    const q2 = pointsContributedBy(answers, 'q2', 'leadGen')
    const q3 = pointsContributedBy(answers, 'q3', 'leadGen')
    lowestQuestionId = q2 <= q3 ? 'q2' : 'q3'
  } else if (winningDim === 'conversion') {
    const q4 = pointsContributedBy(answers, 'q4', 'conversion')
    const q5 = pointsContributedBy(answers, 'q5', 'conversion')
    lowestQuestionId = q4 <= q5 ? 'q4' : 'q5'
  } else {
    // automation — reflection compares Q6 vs Q7 only (not Q4's automation contribution)
    const q6 = pointsContributedBy(answers, 'q6', 'automation')
    const q7 = pointsContributedBy(answers, 'q7', 'automation')
    lowestQuestionId = q6 <= q7 ? 'q6' : 'q7'
  }

  return {
    scores,
    rawPoints,
    primaryResult: RESULT_BY_DIMENSION[winningDim],
    tieBroken,
    lowestQuestionId,
    intent,
  }
}
