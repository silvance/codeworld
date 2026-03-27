'use client'

import { useState } from 'react'
import { PortsReference, WiresharkFilters, NmapReference, ProtocolRef, AttackSigs } from './sections'
import {
  SubnetRef, TcpdumpRef, NetcatRef, FirewallRef,
  DNSDeepDive, TLSRef, PivotRef, WirelessRef, IPv6Ref, ScapyRef,
} from './sectionsExtra'

type SectionId =
  | 'ports' | 'wireshark' | 'nmap' | 'protocols' | 'attacks'
  | 'subnet' | 'tcpdump' | 'netcat' | 'firewall' | 'dns' | 'tls' | 'pivot' | 'wireless' | 'ipv6' | 'scapy'

const NAV = [
  // Reference
  { id: 'ports'    as SectionId, label: 'Common ports',      sub: '60+ ports with security notes',    icon: '🔌', group: 'Reference' },
  { id: 'wireshark'as SectionId, label: 'Wireshark filters', sub: 'Display filters by category',      icon: '🦈', group: 'Reference' },
  { id: 'nmap'     as SectionId, label: 'Nmap reference',    sub: 'Scans · scripts · combos',         icon: '🗺', group: 'Reference' },
  { id: 'protocols'as SectionId, label: 'Protocol quick-ref',sub: 'DNS · HTTP · TLS · ICMP · ARP',   icon: '📡', group: 'Reference' },
  { id: 'subnet'   as SectionId, label: 'Subnet / CIDR',     sub: 'Masks · host counts · ranges',     icon: '🌐', group: 'Reference' },
  { id: 'attacks'  as SectionId, label: 'Attack signatures', sub: 'Indicators · filters · mitigations',icon: '⚔', group: 'Reference' },
  // Tools
  { id: 'tcpdump'  as SectionId, label: 'tcpdump',           sub: 'Capture · filters · ring buffer',  icon: '📦', group: 'Tools' },
  { id: 'netcat'   as SectionId, label: 'Netcat / Ncat',     sub: 'Listeners · shells · file transfer',icon: '🐱', group: 'Tools' },
  { id: 'firewall' as SectionId, label: 'Firewall rules',    sub: 'iptables · nftables · WinFW',      icon: '🛡', group: 'Tools' },
  { id: 'dns'      as SectionId, label: 'DNS deep dive',     sub: 'dig · zone transfer · DoH · DoT',  icon: '🔍', group: 'Tools' },
  { id: 'tls'      as SectionId, label: 'TLS/SSL testing',   sub: 'openssl · testssl.sh · nmap',      icon: '🔒', group: 'Tools' },
  { id: 'scapy'    as SectionId, label: 'Scapy / crafting',  sub: 'Build · send · sniff · fuzz',      icon: '🐍', group: 'Tools' },
  // Advanced
  { id: 'pivot'    as SectionId, label: 'Pivoting / tunnels',sub: 'SSH · chisel · ligolo · proxychains',icon: '🕳', group: 'Advanced' },
  { id: 'wireless' as SectionId, label: 'Wireless',          sub: 'Monitor · WPA2 · PMKID · kismet',  icon: '📶', group: 'Advanced' },
  { id: 'ipv6'     as SectionId, label: 'IPv6 reference',    sub: 'Addressing · NDP · attack vectors', icon: '6️⃣', group: 'Advanced' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  ports:    <PortsReference />,
  wireshark:<WiresharkFilters />,
  nmap:     <NmapReference />,
  protocols:<ProtocolRef />,
  attacks:  <AttackSigs />,
  subnet:   <SubnetRef />,
  tcpdump:  <TcpdumpRef />,
  netcat:   <NetcatRef />,
  firewall: <FirewallRef />,
  dns:      <DNSDeepDive />,
  tls:      <TLSRef />,
  pivot:    <PivotRef />,
  wireless: <WirelessRef />,
  ipv6:     <IPv6Ref />,
  scapy:    <ScapyRef />,
}

const groups = ['Reference', 'Tools', 'Advanced']

export default function NetworkPage() {
  const [active, setActive] = useState<SectionId>('ports')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Network utilities</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">ports · tools · pivoting · wireless</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map(group => (
            <div key={group}>
              <div className="px-4 pt-3 pb-1 text-[9px] font-mono font-semibold text-zinc-700 uppercase tracking-widest">{group}</div>
              {NAV.filter(n => n.group === group).map(item => (
                <button key={item.id} onClick={() => { setActive(item.id); setMobileNavOpen(false) }}
                  className={`w-full text-left px-4 py-2 transition-colors border-l-2 ${
                    active === item.id
                      ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                      : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{item.icon}</span>
                    <div>
                      <div className="text-xs font-mono leading-tight">{item.label}</div>
                      <div className="text-[9px] text-zinc-600 mt-0.5 leading-tight">{item.sub}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="text-[9px] font-mono text-zinc-700">Authorized use only.</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button onClick={() => setMobileNavOpen(o => !o)} className="text-zinc-400 text-xs font-mono">☰</button>
          <span className="text-xs font-mono text-zinc-300">{NAV.find(n => n.id === active)?.label}</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
          {SECTIONS[active]}
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
    </div>
  )
}
