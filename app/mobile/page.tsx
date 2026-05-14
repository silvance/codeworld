import type { Metadata } from 'next'
import { Suspense } from 'react'
import MobilePage from '@/components/mobile/MobilePage'

export const metadata: Metadata = {
  title: 'Mobile Forensics Reference',
  description: 'iOS and Android artifact paths, acquisition methods (logical, filesystem, physical, JTAG, chip-off), iOS Unified Log, cloud extraction (iCloud, Google Takeout), WhatsApp/Signal/Telegram deep dives, location forensics, Cellebrite UFED reference, and smartwatch forensics.',
}

export default function MobileRoute() {
  return <Suspense><MobilePage /></Suspense>
}
