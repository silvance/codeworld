export type SectionId =
  | 'ports' | 'wireshark' | 'nmap' | 'protocols' | 'attacks'
  | 'subnet' | 'tcpdump' | 'netcat' | 'firewall' | 'dns' | 'tls' | 'pivot' | 'wireless' | 'ipv6' | 'scapy'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  // Reference
  { id: 'ports',     label: 'Common ports',      sub: '60+ ports with security notes',    icon: '🔌', group: 'Reference' },
  { id: 'wireshark', label: 'Wireshark filters', sub: 'Display filters by category',      icon: '🦈', group: 'Reference' },
  { id: 'nmap',      label: 'Nmap reference',    sub: 'Scans · scripts · combos',         icon: '🗺', group: 'Reference' },
  { id: 'protocols', label: 'Protocol quick-ref',sub: 'DNS · HTTP · TLS · ICMP · ARP',     icon: '📡', group: 'Reference' },
  { id: 'subnet',    label: 'Subnet / CIDR',     sub: 'Masks · host counts · ranges',     icon: '🌐', group: 'Reference' },
  { id: 'attacks',   label: 'Attack signatures', sub: 'Indicators · filters · mitigations',icon: '⚔', group: 'Reference' },
  // Tools
  { id: 'tcpdump',   label: 'tcpdump',           sub: 'Capture · filters · ring buffer',  icon: '📦', group: 'Tools' },
  { id: 'netcat',    label: 'Netcat / Ncat',     sub: 'Listeners · shells · file transfer',icon: '🐱', group: 'Tools' },
  { id: 'firewall',  label: 'Firewall rules',    sub: 'iptables · nftables · WinFW',      icon: '🛡', group: 'Tools' },
  { id: 'dns',       label: 'DNS deep dive',     sub: 'dig · zone transfer · DoH · DoT',  icon: '🔍', group: 'Tools' },
  { id: 'tls',       label: 'TLS/SSL testing',   sub: 'openssl · testssl.sh · nmap',      icon: '🔒', group: 'Tools' },
  { id: 'scapy',     label: 'Scapy / crafting',  sub: 'Build · send · sniff · fuzz',      icon: '🐍', group: 'Tools' },
  // Advanced
  { id: 'pivot',     label: 'Pivoting / tunnels',sub: 'SSH · chisel · ligolo · proxychains',icon: '🕳', group: 'Advanced' },
  { id: 'wireless',  label: 'Wireless',          sub: 'Monitor · WPA2 · PMKID · kismet',  icon: '📶', group: 'Advanced' },
  { id: 'ipv6',      label: 'IPv6 reference',    sub: 'Addressing · NDP · attack vectors', icon: '6️⃣', group: 'Advanced' },
]

export const GROUPS = ['Reference', 'Tools', 'Advanced']
