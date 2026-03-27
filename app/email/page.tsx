import type { Metadata } from 'next'
import EmailAnalyzer from '@/components/email/EmailAnalyzer'

export const metadata: Metadata = {
  title: 'Email Header Analyzer',
  description: 'Analyze email headers for SPF, DKIM, DMARC authentication, routing chain, domain alignment, and phishing indicators. All analysis runs locally in the browser.',
}

export default function EmailPage() {
  return <EmailAnalyzer />
}
