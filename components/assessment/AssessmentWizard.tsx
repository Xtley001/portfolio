'use client'
import { useEffect, useReducer, useRef } from 'react'
import { QUESTIONS, INTENT_QUESTION } from '../../lib/assessment/questions'
import type { Answer, ScoreResult } from '../../lib/assessment/scoring'
import type { ResultCopy } from '../../lib/assessment/resultCopy'
import WelcomeScreen from './WelcomeScreen'
import ProgressBar from './ProgressBar'
import QuestionStep from './QuestionStep'
import RevealGateStep, { ContactForm } from './RevealGateStep'
import ResultsScreen from './ResultsScreen'

// sessionStorage is used ONLY in this file, per MD1 §13 / MD4 Stage 8 audit item.
const STORAGE_KEY = 'bga_assessment_state_v1'

const STEP_ORDER = ['welcome', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'intent', 'reveal', 'results'] as const
type Step = (typeof STEP_ORDER)[number]

interface SubmitResult {
  scoreResult: ScoreResult
  resultCopy: ResultCopy
  links: { bookingLink: string; whatsappLink: string }
}

interface WizardState {
  step: Step
  answers: Answer[]
  q8FreeText: string
  intentAnswer: string
  contact: ContactForm
  honeypot: string
  submitting: boolean
  error: string
  result: SubmitResult | null
}

const initialState: WizardState = {
  step: 'welcome',
  answers: [],
  q8FreeText: '',
  intentAnswer: '',
  contact: { name: '', email: '', whatsapp: '', businessType: 'Other', businessStage: 'Getting some clients' },
  honeypot: '',
  submitting: false,
  error: '',
  result: null,
}

type Action =
  | { type: 'RESTORE'; state: WizardState }
  | { type: 'START' }
  | { type: 'ANSWER'; questionId: string; optionId: string }
  | { type: 'SET_Q8_FREETEXT'; text: string }
  | { type: 'CONTINUE_FROM_Q8' }
  | { type: 'ANSWER_INTENT'; optionId: string }
  | { type: 'BACK' }
  | { type: 'SET_CONTACT_FIELD'; field: keyof ContactForm; value: string }
  | { type: 'SET_HONEYPOT'; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; result: SubmitResult }
  | { type: 'SUBMIT_ERROR'; error: string }

function nextStep(step: Step): Step {
  const idx = STEP_ORDER.indexOf(step)
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]
}

function prevStep(step: Step): Step {
  const idx = STEP_ORDER.indexOf(step)
  return STEP_ORDER[Math.max(idx - 1, 0)]
}

function upsertAnswer(answers: Answer[], questionId: string, optionId: string): Answer[] {
  const next = answers.filter(a => a.questionId !== questionId)
  next.push({ questionId, optionId })
  return next
}

// Pure, testable reducer function.
function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case 'RESTORE':
      return { ...action.state, submitting: false, error: '' }
    case 'START':
      return { ...state, step: 'q1' }
    case 'ANSWER': {
      const answers = upsertAnswer(state.answers, action.questionId, action.optionId)
      // q8 doesn't auto-advance (allows optional free text) — everything else does.
      const shouldAdvance = action.questionId !== 'q8'
      return { ...state, answers, step: shouldAdvance ? nextStep(state.step) : state.step }
    }
    case 'SET_Q8_FREETEXT':
      return { ...state, q8FreeText: action.text }
    case 'CONTINUE_FROM_Q8':
      return { ...state, step: nextStep('q8') }
    case 'ANSWER_INTENT':
      return { ...state, intentAnswer: action.optionId, step: 'reveal' }
    case 'BACK':
      return { ...state, step: prevStep(state.step) }
    case 'SET_CONTACT_FIELD':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } }
    case 'SET_HONEYPOT':
      return { ...state, honeypot: action.value }
    case 'SUBMIT_START':
      return { ...state, submitting: true, error: '' }
    case 'SUBMIT_SUCCESS':
      return { ...state, submitting: false, result: action.result, step: 'results' }
    case 'SUBMIT_ERROR':
      return { ...state, submitting: false, error: action.error }
    default:
      return state
  }
}

export default function AssessmentWizard() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const restored = useRef(false)

  // Restore from sessionStorage on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as WizardState
        // Never resume mid-network-request or straight onto a stale results screen state
        // without its data — only restore if it looks well-formed.
        if (parsed && parsed.step && parsed.step !== 'results') {
          dispatch({ type: 'RESTORE', state: parsed })
        }
      }
    } catch {
      /* corrupt/blocked storage — start fresh */
    }
    restored.current = true
  }, [])

  // Persist on every change (after initial restore attempt to avoid clobbering).
  useEffect(() => {
    if (!restored.current) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — non-fatal, assessment still works in-memory */
    }
  }, [state])

  const submit = async () => {
    dispatch({ type: 'SUBMIT_START' })
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: state.answers,
          intentAnswer: state.intentAnswer,
          contact: state.contact,
          bottleneckChip: state.answers.find(a => a.questionId === 'q8')?.optionId || '',
          bottleneckText: state.q8FreeText,
          honeypot: state.honeypot,
        }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      const data = (await res.json()) as SubmitResult
      dispatch({ type: 'SUBMIT_SUCCESS', result: data })
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* non-fatal */
      }
    } catch {
      dispatch({ type: 'SUBMIT_ERROR', error: 'Something went wrong sending your results. Please try again.' })
    }
  }

  const wrapperStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(24px, 6vw, 40px) clamp(16px, 4vw, 24px) 60px',
    background: 'var(--bg)',
  }

  if (state.step === 'welcome') {
    return (
      <div style={wrapperStyle}>
        <WelcomeScreen onStart={() => dispatch({ type: 'START' })} />
      </div>
    )
  }

  const scoredIdx = QUESTIONS.findIndex(q => q.id === state.step)
  if (scoredIdx !== -1) {
    const question = QUESTIONS[scoredIdx]
    const answer = state.answers.find(a => a.questionId === question.id)
    return (
      <div style={wrapperStyle}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <ProgressBar current={scoredIdx + 1} total={QUESTIONS.length} />
          <QuestionStep
            question={question}
            selectedOptionId={answer?.optionId}
            freeText={state.q8FreeText}
            onSelect={optionId => dispatch({ type: 'ANSWER', questionId: question.id, optionId })}
            onFreeTextChange={text => dispatch({ type: 'SET_Q8_FREETEXT', text })}
            onContinue={() => dispatch({ type: 'CONTINUE_FROM_Q8' })}
            onBack={() => dispatch({ type: 'BACK' })}
            showBack={scoredIdx > 0}
            stepLabel={undefined}
          />
        </div>
      </div>
    )
  }

  if (state.step === 'intent') {
    return (
      <div style={wrapperStyle}>
        <QuestionStep
          question={INTENT_QUESTION}
          selectedOptionId={state.intentAnswer || undefined}
          onSelect={optionId => dispatch({ type: 'ANSWER_INTENT', optionId })}
          onBack={() => dispatch({ type: 'BACK' })}
          showBack
        />
      </div>
    )
  }

  if (state.step === 'reveal') {
    return (
      <div style={wrapperStyle}>
        <RevealGateStep
          contact={state.contact}
          honeypot={state.honeypot}
          submitting={state.submitting}
          error={state.error}
          onChange={(field, value) => dispatch({ type: 'SET_CONTACT_FIELD', field, value })}
          onHoneypotChange={value => dispatch({ type: 'SET_HONEYPOT', value })}
          onSubmit={submit}
          onBack={() => dispatch({ type: 'BACK' })}
        />
      </div>
    )
  }

  if (state.step === 'results' && state.result) {
    return (
      <div style={wrapperStyle}>
        <ResultsScreen
          name={state.contact.name}
          resultCopy={state.result.resultCopy}
          bookingLink={state.result.links.bookingLink}
          whatsappLink={state.result.links.whatsappLink}
        />
      </div>
    )
  }

  return <div style={wrapperStyle} />
}
