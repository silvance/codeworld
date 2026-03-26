import type { Metadata } from 'next'
import MobilePage from '@/components/mobile/MobilePage'

export const metadata: Metadata = {
  title: 'Mobile Forensics',
  description: 'Android and iOS artifact locations, acquisition methods, SQLite databases, app paths, and ADB reference',
}

export default function MobileRoute() {
  return <MobilePage />
}
