// Static lookup table, keyed by (primaryResult, lowestQuestionId). Copied
// verbatim from MD2 §5. No sentence generation, no template engine beyond a
// simple map + string swap (MD1 §4).

import { PrimaryResult, ScoreResult } from './scoring'

export interface ResultCopyEntry {
  emoji: string
  headline: string
  reflections: Record<string, string> // lowestQuestionId -> reflection sentence, plus 'default'
  primaryOffer: string
  secondaryOffers: string[]
  ctaLabel: string
  emailSubject: string // MD3 §1 subject line for this outcome
}

export const RESULT_COPY: Record<PrimaryResult, ResultCopyEntry> = {
  build: {
    emoji: '🏗️',
    headline: 'Your Priority Right Now: A Stronger Digital Foundation',
    reflections: {
      q1_no: "Right now there's no professional home for your business online — that's usually the first thing worth fixing before spending more on ads or outreach.",
      q1_partial: "Your online presence doesn't yet match the quality of what you actually deliver — that gap is costing you trust before a conversation even starts.",
      default: "Your online presence doesn't yet match the quality of what you actually deliver — that gap is costing you trust before a conversation even starts.",
    },
    primaryOffer: 'Website / Landing Page Design',
    secondaryOffers: ['Lead Magnet Design', 'WhatsApp Integration', 'Basic Email Capture'],
    ctaLabel: 'Build My Digital Foundation →',
    emailSubject: 'Your assessment result: your foundation needs attention first',
  },
  attract: {
    emoji: '🎯',
    headline: 'Your Priority Right Now: A Predictable Lead Flow',
    reflections: {
      q2: 'Your lead flow currently depends on word of mouth, which makes it unpredictable month to month.',
      q3: 'You have a source that works, but the volume is too low to build a business on consistently.',
      default: 'You have a source that works, but the volume is too low to build a business on consistently.',
    },
    primaryOffer: 'Lead Generation Funnel + Lead Magnet',
    secondaryOffers: ['Landing Page', 'Email Capture & Follow-Up'],
    ctaLabel: 'Build My Lead Generation System →',
    emailSubject: 'Your assessment result: your lead flow is the leak',
  },
  convert: {
    emoji: '💰',
    headline: 'Your Priority Right Now: A Real Conversion System',
    reflections: {
      q4: "People are reaching out, but there's no real process once they do — that inconsistency is where they're slipping away.",
      q5: "Most people disappear right after asking about price — that's a conversion leak, not a lead problem.",
      default: "Most people disappear right after asking about price — that's a conversion leak, not a lead problem.",
    },
    primaryOffer: 'Sales Funnel / Conversion System',
    secondaryOffers: ['Follow-Up Sequences', 'Offer Design/Repositioning'],
    ctaLabel: 'Fix My Conversion System →',
    emailSubject: "Your assessment result: you're losing people at the price conversation",
  },
  automate: {
    emoji: '⚙️',
    headline: 'Your Priority Right Now: Automated Follow-Up',
    reflections: {
      q6: "You're not following up consistently with people who don't convert immediately — and that's where most of the lost revenue is hiding.",
      q7: "Almost everything is manual right now. That's a time ceiling, not a marketing problem, and it's usually the fastest win to fix.",
      default: "Almost everything is manual right now. That's a time ceiling, not a marketing problem, and it's usually the fastest win to fix.",
    },
    primaryOffer: 'Marketing Automation / CRM / AI Automation',
    secondaryOffers: ['Email Automation', 'Appointment Workflows', 'Lead Nurturing'],
    ctaLabel: 'Explore My Automation Opportunities →',
    emailSubject: 'Your assessment result: manual follow-up is your ceiling',
  },
  scale: {
    emoji: '🚀',
    headline: "You're Ready To Scale",
    reflections: {
      default: 'Across the board — presence, leads, conversion, and follow-up — your systems are already working. The opportunity now is compounding what\'s working, not fixing what\'s broken.',
    },
    primaryOffer: 'Growth Optimization + Advanced Automation',
    secondaryOffers: ['Conversion Rate Optimization', 'AI Automation'],
    ctaLabel: 'Explore Advanced Growth Options →',
    emailSubject: "Your assessment result: you're ready to optimize, not fix",
  },
}

export interface ResultCopy extends ResultCopyEntry {
  reflection: string
  score: number // scores[dimension matching primaryResult]
}

const DIMENSION_BY_RESULT: Record<PrimaryResult, keyof ScoreResult['scores']> = {
  build: 'foundation',
  attract: 'leadGen',
  convert: 'conversion',
  automate: 'automation',
  scale: 'foundation', // scale = all four ≥70, doesn't matter which we surface — pick lowest for honesty
}

export function getResultCopy(result: ScoreResult): ResultCopy {
  const entry = RESULT_COPY[result.primaryResult]
  const reflection = entry.reflections[result.lowestQuestionId] ?? entry.reflections.default

  let score: number
  if (result.primaryResult === 'scale') {
    // All four ≥70 — show the lowest of the four so the number is still honest.
    score = Math.min(result.scores.foundation, result.scores.leadGen, result.scores.conversion, result.scores.automation)
  } else {
    score = result.scores[DIMENSION_BY_RESULT[result.primaryResult]]
  }

  return { ...entry, reflection, score }
}
