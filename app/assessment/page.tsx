import type { Metadata } from 'next'
import AssessmentWizard from '../../components/assessment/AssessmentWizard'

export const metadata: Metadata = {
  title: 'Business Growth Assessment',
  description: "Answer 8 quick questions and get a personalized breakdown of where your business is strong, where it's leaking opportunity, and what to fix first.",
  robots: { index: true, follow: true },
}

export default function AssessmentPage() {
  return <AssessmentWizard />
}
