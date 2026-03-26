'use client'

import { useState } from 'react'
import { PortsReference, WiresharkFilters, NmapReference, ProtocolRef, AttackSigs } from './sections'

type SectionId = 'ports' | 'wireshark' | 'nmap' | 'protocols' | 'attacks'

const NAV = [
  { id: 'ports'     as SectionId, label: 'Common ports',      sub: '60+ ports with security notes',  icon: '🔌' },
  { id: 'wireshark' as SectionId, label: 'Wireshark filters',  sub: 'Display filters by category',    icon: '🦈' },
  { id: 'nmap'      as SectionId, label: 'Nmap reference',     sub: 'Scans · scripts · combos',       icon: '🗺' },
  { id: 'protocols' as SectionId, label: 'Protocol quick-ref', sub: 'DNS · HTTP · TLS · ICMP · ARP', icon: '📡' },
  { id: 'attacks'   as SectionId, label: 'Attack signatures',  sub: 'Indicators · filters · mitigations', icon: '⚔' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  ports:     <PortsReference />,
  wireshark: <WiresharkFilters />,
  nmap:      <NmapReference />,
  protocols: <ProtocolRef />,
  attacks:   <AttackSigs />,
}

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
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">ports · wireshark · nmap · protocols</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setMobileNavOpen(false) }}
              className={`w-full text-left px-4 py-2.5 transition-colors border-l-2 ${
                active === item.id
                  ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}>
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{item.icon}</span>
                <div>
                  <div className="text-xs font-mono leading-tight">{item.label}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{item.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="text-[9px] font-mono text-zinc-700 leading-relaxed">
            Filters and commands are copy-on-click.
          </div>
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
