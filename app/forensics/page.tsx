import type { Metadata } from 'next'
import ForensicsPage from '@/components/forensics/ForensicsPage'

export const metadata: Metadata = {
  title: 'Forensics Reference',
  description: 'Windows and Linux artifact locations, memory forensics quick-ref, and tool cheat sheets',
}

export default function ForensicsRoute() {
  return <ForensicsPage />
}
