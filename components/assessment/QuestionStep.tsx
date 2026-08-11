'use client'
import { useState } from 'react'
import type { Question } from '../../lib/assessment/questions'

interface QuestionStepProps {
  question: Question
  selectedOptionId?: string
  freeText?: string
  onSelect: (optionId: string) => void
  onFreeTextChange?: (text: string) => void
  onContinue?: () => void // only used when question.allowFreeText (q8) — chip select doesn't auto-advance
  onBack?: () => void
  showBack: boolean
  stepLabel?: string // e.g. "Question 3 of 8"; omitted for the intent tag screen
}

export default function QuestionStep({
  question,
  selectedOptionId,
  freeText,
  onSelect,
  onFreeTextChange,
  onContinue,
  onBack,
  showBack,
  stepLabel,
}: QuestionStepProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="reveal visible" style={{ width: '100%', maxWidth: '560px' }}>
      {showBack && (
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '12px',
            letterSpacing: '0.06em',
            padding: 0,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← back
        </button>
      )}

      {stepLabel && (
        <div
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent-dim)',
            marginBottom: '12px',
          }}
        >
          {stepLabel}
        </div>
      )}

      <h2
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(20px, 4vw, 28px)',
          color: 'var(--text)',
          lineHeight: 1.3,
          marginBottom: question.helper ? '6px' : '28px',
        }}
      >
        {question.prompt}
      </h2>

      {question.helper && (
        <p
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '13px',
            fontStyle: 'italic',
            color: 'var(--text-faint)',
            marginBottom: '28px',
          }}
        >
          ({question.helper})
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map(option => {
          const selected = selectedOptionId === option.id
          const hovered = hoveredId === option.id
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '16px 20px',
                minHeight: '44px',
                background: selected ? 'var(--surface-2)' : 'var(--surface)',
                border: `1px solid ${selected || hovered ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '4px',
                color: selected ? 'var(--text)' : 'var(--text-dim)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {question.allowFreeText && (
        <div style={{ marginTop: '20px' }}>
          <textarea
            value={freeText || ''}
            onChange={e => onFreeTextChange?.(e.target.value)}
            placeholder={question.freeTextPlaceholder}
            style={{
              width: '100%',
              minHeight: '80px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '13px',
              padding: '14px 16px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          {selectedOptionId && (
            <button
              onClick={onContinue}
              style={{
                marginTop: '16px',
                width: '100%',
                background: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: '2px',
                padding: '15px 20px',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
