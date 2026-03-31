import type { Metadata } from 'next'
import PapersPage from '@/components/papers/PapersPage'

export const metadata: Metadata = {
  title: 'Research & White Papers',
  description: 'Original security research and technical findings from TSCM operations, digital forensics, and network security work. Includes the Eero mesh network RF neighbor persistence finding.',
}

export default function PapersRoute() {
  return <PapersPage />
}
