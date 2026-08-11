// Sends the two v1 emails (MD3) via Brevo's transactional email API.
// NOTE — deviation from MD1 §7 / MD3 §3, which specify Resend: the user
// explicitly requested Brevo instead. Same contract (two HTML emails, two
// independent try/catch'd sends, console-log fallback when unconfigured),
// different provider. See CHANGELOG.md.

import type { LeadRecord } from './leads'
import type { ResultCopy } from './resultCopy'

// ─── Templates — HTML copied verbatim from 03-email-templates.md, do not paraphrase ──

const LEAD_RESULT_TEMPLATE = `<body style="margin:0;padding:0;background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- header -->
        <tr><td style="padding-bottom:32px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#7a6e5f;">
            Business Growth Assessment
          </span>
        </td></tr>

        <!-- result badge -->
        <tr><td style="padding-bottom:8px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:13px;color:#888888;">
            {{emoji}} Your primary opportunity
          </span>
        </td></tr>

        <!-- headline -->
        <tr><td style="padding-bottom:4px;">
          <span style="font-family:'Syne',Helvetica,Arial,sans-serif;font-weight:700;font-size:26px;letter-spacing:0.01em;color:#e8e8e8;line-height:1.3;">
            {{headline}}
          </span>
        </td></tr>

        <!-- score -->
        <tr><td style="padding:4px 0 24px;">
          <span style="font-family:'Syne',Helvetica,Arial,sans-serif;font-weight:800;font-size:40px;color:#c8b89a;">{{score}}</span>
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:13px;color:#444444;">/100</span>
        </td></tr>

        <!-- divider -->
        <tr><td style="padding-bottom:24px;"><div style="height:1px;background-color:#2a2a2a;"></div></td></tr>

        <!-- reflection -->
        <tr><td style="padding-bottom:28px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:14px;line-height:1.9;color:#888888;">
            {{name}}, {{reflectionSentence}}
          </span>
        </td></tr>

        <!-- offers -->
        <tr><td style="padding-bottom:6px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#c8b89a;">Recommended</span>
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:15px;color:#e8e8e8;">{{primaryOffer}}</span>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:13px;color:#444444;">Also consider: {{secondaryOffers}}</span>
        </td></tr>

        <!-- primary CTA -->
        <tr><td style="padding-bottom:14px;">
          <a href="{{bookingLink}}" style="display:inline-block;background-color:#c8b89a;color:#0a0a0a;font-family:'DM Mono',Consolas,monospace;font-size:13px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:2px;">
            {{ctaLabel}}
          </a>
        </td></tr>

        <!-- secondary CTA -->
        <tr><td style="padding-bottom:40px;">
          <a href="{{whatsappLink}}" style="display:inline-block;background-color:transparent;color:#c8b89a;font-family:'DM Mono',Consolas,monospace;font-size:13px;letter-spacing:0.02em;text-decoration:none;padding:13px 27px;border:1px solid #3a3a3a;border-radius:2px;">
            Message me on WhatsApp
          </a>
        </td></tr>

        <!-- footer -->
        <tr><td style="padding-top:8px;border-top:1px solid #2a2a2a;padding-top:20px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:11px;color:#444444;line-height:1.7;">
            You got this because you completed the Business Growth Assessment.<br>
            No spam, no list — just this result and one follow-up.
          </span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>`

const OWNER_NOTIFICATION_TEMPLATE = `<body style="margin:0;padding:0;background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:32px 20px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

        <tr><td style="padding-bottom:20px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#7a6e5f;">
            New Assessment Lead
          </span>
        </td></tr>

        <!-- intent badge -->
        <tr><td style="padding-bottom:16px;">
          <span style="display:inline-block;background-color:{{intentColor}};color:#0a0a0a;font-family:'DM Mono',Consolas,monospace;font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;padding:4px 10px;border-radius:2px;">
            {{intent}}
          </span>
        </td></tr>

        <tr><td style="padding-bottom:20px;border:1px solid #2a2a2a;border-radius:4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:'DM Mono',Consolas,monospace;font-size:13px;color:#e8e8e8;">
            <tr><td style="padding:16px 18px 6px;color:#444444;width:110px;">Name</td><td style="padding:16px 18px 6px;">{{name}}</td></tr>
            <tr><td style="padding:0 18px 6px;color:#444444;">Email</td><td style="padding:0 18px 6px;">{{email}}</td></tr>
            <tr><td style="padding:0 18px 6px;color:#444444;">WhatsApp</td><td style="padding:0 18px 6px;">{{whatsapp}}</td></tr>
            <tr><td style="padding:0 18px 6px;color:#444444;">Business</td><td style="padding:0 18px 6px;">{{businessType}} · {{businessStage}}</td></tr>
            <tr><td style="padding:0 18px 16px;color:#444444;">Result</td><td style="padding:0 18px 16px;color:#c8b89a;">{{primaryResult}} — {{score}}/100</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:6px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#c8b89a;">Bottleneck (their words)</span>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <span style="font-family:'DM Mono',Consolas,monospace;font-size:13px;color:#888888;">{{bottleneckChip}} — "{{bottleneckText}}"</span>
        </td></tr>

        <tr><td>
          <a href="https://wa.me/{{leadWhatsApp}}" style="display:inline-block;background-color:#c8b89a;color:#0a0a0a;font-family:'DM Mono',Consolas,monospace;font-size:13px;font-weight:500;text-decoration:none;padding:12px 22px;border-radius:2px;">
            Message on WhatsApp
          </a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>`

function fillTemplate(template: string, vars: Record<string, string>): string {
  let out = template
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value ?? '')
  }
  return out
}

const INTENT_COLOR: Record<string, string> = {
  hot: '#c8b89a',
  warm: '#7a6e5f',
  cold: '#444444',
}

interface BrevoSendArgs {
  toEmail: string
  toName?: string
  subject: string
  html: string
}

async function sendViaBrevo({ toEmail, toName, subject, html }: BrevoSendArgs): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME || 'Business Growth Assessment'

  if (!apiKey || !fromEmail) {
    console.warn(
      `[assessment/email] BREVO_API_KEY/BREVO_FROM_EMAIL not set — logging would-be email instead of sending.\n` +
        `  To: ${toEmail} (${toName || ''})\n  Subject: ${subject}\n  --- HTML below ---\n${html}\n  --- end HTML ---`
    )
    return
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: toEmail, name: toName || undefined }],
      subject,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Brevo send failed (${res.status}): ${errText}`)
  }
}

export async function sendLeadResultEmail(
  lead: LeadRecord,
  resultCopy: ResultCopy,
  links: { bookingLink: string; whatsappLink: string }
): Promise<void> {
  if (!lead.email) {
    console.warn('[assessment/email] No email on lead (WhatsApp-only submission) — skipping lead result email.')
    return
  }
  const html = fillTemplate(LEAD_RESULT_TEMPLATE, {
    emoji: resultCopy.emoji,
    headline: resultCopy.headline,
    score: String(resultCopy.score),
    reflectionSentence: resultCopy.reflection,
    primaryOffer: resultCopy.primaryOffer,
    secondaryOffers: resultCopy.secondaryOffers.join(' · '),
    ctaLabel: resultCopy.ctaLabel,
    name: lead.name || 'there',
    bookingLink: links.bookingLink,
    whatsappLink: links.whatsappLink,
  })
  await sendViaBrevo({ toEmail: lead.email, toName: lead.name, subject: resultCopy.emailSubject, html })
}

export async function sendOwnerNotificationEmail(lead: LeadRecord, resultCopy: ResultCopy): Promise<void> {
  const ownerEmail = process.env.LEAD_NOTIFY_EMAIL
  if (!ownerEmail) {
    console.warn('[assessment/email] LEAD_NOTIFY_EMAIL not set — skipping owner notification email.')
    return
  }
  const html = fillTemplate(OWNER_NOTIFICATION_TEMPLATE, {
    intentColor: INTENT_COLOR[lead.intent] || INTENT_COLOR.cold,
    intent: lead.intent,
    name: lead.name,
    email: lead.email || '—',
    whatsapp: lead.whatsapp || '—',
    businessType: lead.businessType,
    businessStage: lead.businessStage,
    primaryResult: lead.primaryResult,
    score: String(resultCopy.score),
    bottleneckChip: lead.bottleneckChip || '—',
    bottleneckText: lead.bottleneckText || '',
    leadWhatsApp: (lead.whatsapp || '').replace(/[^0-9]/g, ''),
  })
  const subject = `New lead: ${lead.name} — ${lead.primaryResult} (${lead.intent})`
  await sendViaBrevo({ toEmail: ownerEmail, subject, html })
}
