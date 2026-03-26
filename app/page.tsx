import type { Metadata } from 'next'
import RFPage from '@/components/rf/RFPage'

export const metadata: Metadata = {
  title: 'RF / TSCM Tools',
  description: 'Frequency reference, path loss calculator, channel maps, signal math, and TSCM threat device reference',
}

export default function RFToolsPage() {
  return <RFPage />
}
