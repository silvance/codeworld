import type { Metadata } from 'next'
import RFPage from '@/components/rf/RFPage'

export const metadata: Metadata = {
  title: 'RF / TSCM Reference',
  description: 'RF frequency reference, TSCM sweep methodology, rogue AP detection, bug frequencies, NLJD usage, spectrum baseline, TEMPEST/emanations, and threat device taxonomy for technical surveillance countermeasures professionals.',
}

export default function RFToolsPage() {
  return <RFPage />
}
