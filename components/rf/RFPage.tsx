'use client'

import { useState } from 'react'
import {
  FreqReference,
  PathLossCalc,
  ChannelMaps,
  SignalMath,
  TSCMFreqs,
  RogueAP,
} from './sections'

type SectionId = 'freq' | 'fspl' | 'channels' | 'math' | 'tscm' | 'rogue'

interface NavItem {
  id: SectionId
  label: string
  sub: string
  icon: string
}

const NAV: NavItem[] = [
  { id: 'freq',     label: 'Frequency reference', sub: 'ISM · cellular · gov · ham',   icon: '📡' },
  { id: 'fspl',     label: 'Path loss calc',       sub: 'FSPL · EIRP · link budget',    icon: '📉' },
  { id: 'channels', label: 'Channel maps',         sub: '2.4 GHz · 5 GHz · BLE',       icon: '🗺' },
  { id: 'math',     label: 'Signal math',          sub: 'dBm ↔ mW · EIRP · ref table', icon: '🔢' },
  { id: 'tscm',     label: 'TSCM devices',         sub: 'Threat freqs · detection',     icon: '🔍' },
  { id: 'rogue',    label: 'Rogue AP reference',   sub: 'Evil twin · indicators · tools', icon: '⚠' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  freq:     <FreqReference />,
  fspl:     <PathLossCalc />,
  channels: <ChannelMaps />,
  math:     <SignalMath />,
  tscm:     <TSCMFreqs />,
  rogue:    <RogueAP />,
}

export default function RFPage() {
  const [active, setActive] = useState<SectionId>('freq')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800
        flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">RF / TSCM tools</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">signal analysis reference</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setMobileNavOpen(false) }}
              className={`
                w-full text-left px-4 py-2.5 transition-colors border-l-2
                ${active === item.id
                  ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{item.icon}</span>
                <div>
                  <div className="text-xs font-mono leading-tight">{item.label}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{item.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="text-[9px] font-mono text-zinc-700 leading-relaxed">
            All calculations assume free-space propagation. Real-world path loss will be higher.
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button
            onClick={() => setMobileNavOpen(o => !o)}
            className="text-zinc-400 text-xs font-mono"
          >
            ☰
          </button>
          <span className="text-xs font-mono text-zinc-300">
            {NAV.find(n => n.id === active)?.label}
          </span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full">
          {SECTIONS[active]}
        </main>
      </div>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  )
}
