import type { Metadata } from 'next'
import OSINTPage from '@/components/osint/OSINTPage'

export const metadata: Metadata = {
  title: 'OSINT Reference',
  description: 'Open source intelligence reference including Google and Bing search operators, people search sources, username enumeration, reverse image search, social media OSINT, domain and IP infrastructure analysis, phone OSINT, dark web research, corporate intelligence, and sock puppet OPSEC.',
}

export default function OSINTRoute() {
  return <OSINTPage />
}
