import type { Metadata } from 'next'
import ToolsPage from '@/components/tools/ToolsPage'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Hash & encoding, subnet calculator, timestamp converter, packet decoder, regex tester, JWT decoder, certificate decoder, entropy calculator, MAC lookup, UUID decoder, character inspector — all browser-native.',
}

export default function ToolsRoute() {
  return <ToolsPage />
}
