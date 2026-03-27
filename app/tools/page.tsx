import type { Metadata } from 'next'
import HashTools from '@/components/tools/HashTools'

export const metadata: Metadata = {
  title: 'Hash & Encoding Tools',
  description: 'MD5, SHA-1, SHA-256, SHA-512, Base64, hex, URL encoding, HTML entities, ROT13, and number base conversion — all local, nothing leaves the browser.',
}

export default function ToolsRoute() {
  return <HashTools />
}
