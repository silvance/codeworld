import type { Metadata } from 'next'
import EmailAnalyzer from '@/components/email/EmailAnalyzer'

export const metadata: Metadata = {
  title: 'Email Header Analyzer',
  description: 'Free online email header analyzer. Paste raw email headers to analyze SPF, DKIM, and DMARC authentication, inspect hop-by-hop routing chain, detect domain misalignment, Reply-To phishing indicators, and Message-ID anomalies. All analysis runs locally — nothing is sent to any server.',
}

export default function EmailPage() {
  return <EmailAnalyzer />
}
