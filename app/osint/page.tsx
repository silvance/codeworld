import type { Metadata } from 'next'
import OSINTPage from '@/components/osint/OSINTPage'

export const metadata: Metadata = {
  title: 'OSINT Reference',
  description: 'Search operators, people search, sock puppet OPSEC, username enumeration, image OSINT, social media, infrastructure, phone, dark web, and corporate intelligence',
}

export default function OSINTRoute() {
  return <OSINTPage />
}
