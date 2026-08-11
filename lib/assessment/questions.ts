// Data only — no logic. scoring.ts pulls dimension points from here and never
// hardcodes point values (MD1 §3 rule 1).

export type DimensionKey = 'foundation' | 'leadGen' | 'conversion' | 'automation'

export interface QuestionOption {
  id: string
  label: string
  // Points this option contributes per dimension. Omitted dimension = 0.
  points?: Partial<Record<DimensionKey, number>>
}

export interface Question {
  id: string // 'q1'..'q8' | 'intent'
  prompt: string
  helper?: string
  options: QuestionOption[]
  scored: boolean // false for q8 (bottleneck) and intent — never touches scoring.ts
  allowFreeText?: boolean // true only for q8
  freeTextPlaceholder?: string
}

// ─── The 8 scored diagnostic questions (MD2 §3) ────────────────────────────
export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    prompt: 'Do you currently have a professional website or landing page?',
    scored: true,
    options: [
      { id: 'complete', label: 'Yes, complete', points: { foundation: 3 } },
      { id: 'outdated', label: 'Yes, outdated/incomplete', points: { foundation: 1 } },
      { id: 'building', label: 'Building one', points: { foundation: 1 } },
      { id: 'no', label: 'No', points: { foundation: 0 } },
    ],
  },
  {
    id: 'q2',
    prompt: 'How do people typically discover your business?',
    scored: true,
    options: [
      { id: 'consistent', label: 'Consistent channel — referrals/SEO/ads', points: { leadGen: 3 } },
      { id: 'social', label: 'Mostly social media, organic', points: { leadGen: 2 } },
      { id: 'word_of_mouth', label: 'Mostly word of mouth, unpredictable', points: { leadGen: 1 } },
      { id: 'no_source', label: 'No consistent source', points: { leadGen: 0 } },
    ],
  },
  {
    id: 'q3',
    prompt: 'Roughly how many enquiries do you get per month?',
    scored: true,
    options: [
      { id: '0-5', label: '0–5', points: { leadGen: 0 } },
      { id: '6-15', label: '6–15', points: { leadGen: 1 } },
      { id: '16-40', label: '16–40', points: { leadGen: 2 } },
      { id: '40+', label: '40+', points: { leadGen: 3 } },
    ],
  },
  {
    id: 'q4',
    prompt: 'When someone shows interest, what usually happens next?',
    scored: true,
    options: [
      { id: 'automated', label: 'Automated response/booking', points: { conversion: 3, automation: 2 } },
      { id: 'personal_fast', label: 'I respond personally within hours', points: { conversion: 2 } },
      { id: 'slow', label: "I respond but it's slow/inconsistent", points: { conversion: 1 } },
      { id: 'no_process', label: 'No real process', points: { conversion: 0 } },
    ],
  },
  {
    id: 'q5',
    prompt: 'What happens most often after someone asks about pricing?',
    helper: 'they say no / go quiet',
    scored: true,
    options: [
      { id: 'predictable', label: 'They convert at a predictable rate', points: { conversion: 3 } },
      { id: 'some_convert', label: 'Some convert, some go quiet', points: { conversion: 1 } },
      { id: 'most_disappear', label: 'Most disappear after asking price', points: { conversion: 0 } },
    ],
  },
  {
    id: 'q6',
    prompt: "How do you follow up with leads who don't convert immediately?",
    helper: 'you run out of hours',
    scored: true,
    options: [
      { id: 'automated_seq', label: 'Automated sequence / CRM', points: { automation: 3 } },
      { id: 'manual_consistent', label: 'I follow up manually but consistently', points: { automation: 2 } },
      { id: 'occasionally', label: 'I follow up occasionally', points: { automation: 1 } },
      { id: 'no_followup', label: "I don't follow up", points: { automation: 0 } },
    ],
  },
  {
    id: 'q7',
    prompt: 'How much of your day-to-day lead handling is manual?',
    scored: true,
    options: [
      { id: 'almost_none', label: 'Almost nothing — mostly automated', points: { automation: 3 } },
      { id: 'about_half', label: 'About half', points: { automation: 1 } },
      { id: 'almost_everything', label: 'Almost everything', points: { automation: 0 } },
    ],
  },
  {
    id: 'q8',
    prompt: "What's the single biggest bottleneck right now?",
    scored: false, // personalization only — never scored, never used for tie-break
    allowFreeText: true,
    freeTextPlaceholder: 'Optional — tell us more in your own words',
    options: [
      { id: 'looking_professional', label: 'Looking professional' },
      { id: 'getting_found', label: 'Getting found' },
      { id: 'getting_people_to_say_yes', label: 'Getting people to say yes' },
      { id: 'keeping_up_with_followup', label: 'Keeping up with follow-up' },
    ],
  },
]

// ─── Tag question — after Q8, before reveal. Does not score. (MD2 §3) ──────
export const INTENT_QUESTION: Question = {
  id: 'intent',
  prompt: 'Are you looking to fix this in the next 30 days?',
  scored: false,
  options: [
    { id: 'hot', label: 'Yes, ready now' },
    { id: 'warm', label: 'Exploring, maybe this quarter' },
    { id: 'cold', label: 'Just researching for now' },
  ],
}

export type IntentKey = 'hot' | 'warm' | 'cold'
