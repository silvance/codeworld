import type { Metadata } from 'next'
import NetworkPage from '@/components/network/NetworkPage'

export const metadata: Metadata = {
  title: 'Network Utilities Reference',
  description: 'Common ports, Wireshark display filters, Nmap cheat sheet, tcpdump capture filters, DNS deep dive, TLS/SSL testing with openssl and testssl.sh, firewall rules (iptables/nftables), pivoting and tunneling (SSH, chisel, ligolo-ng), IPv6 reference, and Scapy packet crafting.',
}

export default function NetworkRoute() {
  return <NetworkPage />
}
