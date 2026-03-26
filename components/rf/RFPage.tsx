'use client'

import { useState } from 'react'
import {
  FreqReference, PathLossCalc, ChannelMaps, SignalMath, TSCMFreqs, RogueAP,
} from './sections'
import {
  SDRReference, SweepMethodology, PhysicalIndicators, ModulationRef,
  CounterSurv, BugFrequencies, TSCMToolRef, AntennaLinkBudget,
} from './tscmSections'

type SectionId =
  | 'freq' | 'fspl' | 'channels' | 'math' | 'tscm' | 'rogue'
  | 'sdr' | 'sweep' | 'physical' | 'modulation' | 'countersurv' | 'bugfreq' | 'tools' | 'antenna'

const NAV = [
  { id: 'freq' as SectionId,        label: 'Frequency reference', sub: 'ISM · cellular · gov · ham',       icon: '📡', group: 'RF Tools' },
  { id: 'fspl' as SectionId,        label: 'Path loss calc',       sub: 'FSPL · EIRP · link budget',        icon: '📉', group: 'RF Tools' },
  { id: 'channels' as SectionId,    label: 'Channel maps',         sub: '2.4 GHz · 5 GHz · BLE',           icon: '🗺', group: 'RF Tools' },
  { id: 'math' as SectionId,        label: 'Signal math',          sub: 'dBm ↔ mW · EIRP · ref table',     icon: '🔢', group: 'RF Tools' },
  { id: 'antenna' as SectionId,     label: 'Antenna & link budget', sub: 'Gain · patterns · formulas',     icon: '📶', group: 'RF Tools' },
  { id: 'modulation' as SectionId,  label: 'Modulation reference', sub: 'AM · FM · FHSS · OFDM · OOK',     icon: '〜', group: 'RF Tools' },
  { id: 'sweep' as SectionId,       label: 'Sweep methodology',    sub: 'Pre-sweep · RF · physical · docs', icon: '🔄', group: 'TSCM' },
  { id: 'tscm' as SectionId,        label: 'TSCM devices',         sub: 'Threat freqs · detection',         icon: '🔍', group: 'TSCM' },
  { id: 'bugfreq' as SectionId,     label: 'Bug frequencies',      sub: 'Audio · video · GSM · cellular',   icon: '🐛', group: 'TSCM' },
  { id: 'physical' as SectionId,    label: 'Physical indicators',  sub: 'Screws · paint · wiring · weight', icon: '👁', group: 'TSCM' },
  { id: 'countersurv' as SectionId, label: 'Counter-surv',         sub: 'Foot · vehicle · technical',       icon: '🕵', group: 'TSCM' },
  { id: 'rogue' as SectionId,       label: 'Rogue AP reference',   sub: 'Evil twin · indicators · tools',   icon: '⚠', group: 'TSCM' },
  { id: 'sdr' as SectionId,         label: 'SDR quick reference',  sub: 'HackRF · RTL · TinySA · Flipper',  icon: '📻', group: 'Equipment' },
  { id: 'tools' as SectionId,       label: 'TSCM tool reference',  sub: 'OSCOR · TALAN · NLJD · TinySA',   icon: '🛠', group: 'Equipment' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  freq:        <FreqReference />,
  fspl:        <PathLossCalc />,
  channels:    <ChannelMaps />,
  math:        <SignalMath />,
  tscm:        <TSCMFreqs />,
  rogue:       <RogueAP />,
  sdr:         <SDRReference />,
  sweep:       <SweepMethodology />,
  physical:    <PhysicalIndicators />,
  modulation:  <ModulationRef />,
  countersurv: <CounterSurv />,
  bugfreq:     <BugFrequencies />,
  tools:       <TSCMToolRef />,
  antenna:     <AntennaLinkBudget />,
}

const groups = ['RF Tools', 'TSCM', 'Equipment']

export default function RFPage() {
  const [active, setActive] = useState<SectionId>('freq')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">RF / TSCM tools</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">signal · sweep · counter-surv · equipment</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map(group => (
            <div key={group}>
              <div className="px-4 pt-3 pb-1 text-[9px] font-mono font-semibold text-zinc-700 uppercase tracking-widest">
                {group}
              </div>
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
          <div className="text-[9px] font-mono text-zinc-700 leading-relaxed">
            All calculations assume free-space propagation.
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
