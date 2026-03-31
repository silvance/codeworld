import type { Metadata } from 'next'
import PapersPage from '@/components/papers/PapersPagePlaceholder'

export const metadata: Metadata = {
  title: 'Research & White Papers',
  description: 'Original security research and technical findings. Currently undergoing responsible disclosure prior to publication.',
  robots: { index: false, follow: false },
}

export default function PapersRoute() {
  return <PapersPage />
}
