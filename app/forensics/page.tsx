import type { Metadata } from 'next'
import ForensicsPage from '@/components/forensics/ForensicsPage'

export const metadata: Metadata = {
  title: 'Digital Forensics Reference',
  description: 'Windows artifact locations, registry hives, Shellbags, Prefetch, LNK files, SRUM forensics, cloud storage artifacts, browser SQL queries, anti-forensics detection, Axiom artifact reference, memory forensics (Volatility 3), and KAPE/Velociraptor triage workflows.',
}

export default function ForensicsRoute() {
  return <ForensicsPage />
}
