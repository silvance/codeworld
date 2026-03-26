import type { Metadata } from 'next'
import NetworkPage from '@/components/network/NetworkPage'

export const metadata: Metadata = {
  title: 'Network Utilities',
  description: 'Common ports reference, Wireshark display filters, Nmap scan reference, protocol quick-ref, and network attack signatures',
}

export default function NetworkRoute() {
  return <NetworkPage />
}
