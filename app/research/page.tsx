import type { Metadata } from 'next'
import ResearchPage from '@/components/research/ResearchPage'

export const metadata: Metadata = {
  title: 'Research & Whitepapers',
  description: 'Original security research and technical whitepapers covering TSCM findings, wireless security, digital forensics, and responsible disclosure. Includes the Eero mesh network RF neighbor persistence finding.',
}

export default function ResearchRoute() {
  return <ResearchPage />
}
