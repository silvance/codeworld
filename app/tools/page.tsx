import type { Metadata } from 'next'
import ToolsPage from '@/components/tools/ToolsPage'

export const metadata: Metadata = {
  title: 'Browser-Native Security Tools',
  description: 'Browser-native security tools: MD5/SHA hash calculator, Base64/hex encoding, subnet CIDR calculator, timestamp converter (Unix/FILETIME/Chrome/Mac epoch), hex packet decoder, regex tester, JWT decoder, PEM certificate decoder, Shannon entropy calculator, MAC address OUI lookup, UUID/GUID decoder, and character inspector. Nothing leaves the browser.',
}

export default function ToolsRoute() {
  return <ToolsPage />
}
