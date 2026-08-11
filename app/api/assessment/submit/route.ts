import { NextRequest, NextResponse } from 'next/server'
import { scoreAssessment, Answer } from '../../../../lib/assessment/scoring'
import { getResultCopy } from '../../../../lib/assessment/resultCopy'
import { saveLead } from '../../../../lib/assessment/leads'
import { sendLeadResultEmail, sendOwnerNotificationEmail } from '../../../../lib/assessment/email'

interface SubmitBody {
  answers: Answer[]
  intentAnswer: string
  contact: {
    name: string
    email: string
    whatsapp: string
    businessType: string
    businessStage: string
  }
  bottleneckChip: string
  bottleneckText: string
  honeypot: string
}

export async function POST(req: NextRequest) {
  let body: SubmitBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 })
  }

  // 1. Honeypot check — trip it and we write nothing, send nothing, but still
  //    return a fake success so the bot doesn't learn anything (MD1 §6 / MD2 §6).
  if (body.honeypot && body.honeypot.trim().length > 0) {
    const fakeScoreResult = scoreAssessment(body.answers || [], body.intentAnswer || 'cold')
    const fakeResultCopy = getResultCopy(fakeScoreResult)
    return NextResponse.json({
      scoreResult: fakeScoreResult,
      resultCopy: fakeResultCopy,
      links: { bookingLink: process.env.BOOKING_LINK || '#', whatsappLink: '#' },
    })
  }

  const contact = body.contact || { name: '', email: '', whatsapp: '', businessType: 'Other', businessStage: 'Getting some clients' }

  if (!contact.name || (!contact.email && !contact.whatsapp)) {
    return NextResponse.json({ error: 'Name and at least one of email or WhatsApp are required.' }, { status: 400 })
  }

  // 2. Score server-side — never trust a client-computed score.
  const scoreResult = scoreAssessment(body.answers || [], body.intentAnswer || 'cold')
  const resultCopy = getResultCopy(scoreResult)

  const bookingLink = process.env.BOOKING_LINK || '#'
  const ownerWhatsApp = (process.env.OWNER_WHATSAPP || '').replace(/[^0-9]/g, '')
  const whatsappMessage = `Hi, I just got my "${scoreResult.primaryResult}" result from the assessment`
  const whatsappLink = ownerWhatsApp ? `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(whatsappMessage)}` : '#'

  // 3. Dedupe + append via leads.ts.
  const { lead, isDuplicate } = await saveLead({
    name: contact.name,
    email: contact.email || '',
    whatsapp: contact.whatsapp || '',
    businessType: contact.businessType || 'Other',
    businessStage: contact.businessStage || 'Getting some clients',
    intent: scoreResult.intent,
    scores: scoreResult.scores,
    rawPoints: scoreResult.rawPoints,
    primaryResult: scoreResult.primaryResult,
    lowestQuestionId: scoreResult.lowestQuestionId,
    bottleneckChip: body.bottleneckChip || '',
    bottleneckText: body.bottleneckText || '',
  })

  // 4. Fire both emails, independently try/catch'd — an email outage never blocks
  //    the lead being saved or the results rendering.
  try {
    await sendLeadResultEmail(lead, resultCopy, { bookingLink, whatsappLink })
  } catch (err) {
    console.error('[assessment/submit] lead result email failed:', err)
  }

  if (!isDuplicate) {
    try {
      await sendOwnerNotificationEmail(lead, resultCopy)
    } catch (err) {
      console.error('[assessment/submit] owner notification email failed:', err)
    }
  }
  // On a duplicate within the dedupe window: owner already got one, so it's skipped
  // (MD1 §5 / MD2 §6) — lead result email still fires above in case their first
  // attempt didn't land.

  // 5. Return scoreResult + resultCopy in the same response — client never round-trips.
  return NextResponse.json({ scoreResult, resultCopy, links: { bookingLink, whatsappLink } })
}
