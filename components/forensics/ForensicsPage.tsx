'use client'

import { useState } from 'react'
import { WindowsArtifacts, LinuxArtifacts, MemoryForensics, ToolCheatSheets, MacOSArtifacts, KeyArtifactsCI } from './sections'
import { SRUMSection, CloudForensics, BrowserSQLSection, AntiForensicsSection, TriageSection } from './sectionsExtra'
import { AxiomArtifactsSection } from './AxiomSection'

type SectionId =
  | 'windows' | 'linux' | 'macos' | 'keyartifacts' | 'memory' | 'tools'
  | 'srum' | 'cloud' | 'antiforensics' | 'axiom' | 'browsersql' | 'triage'

interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

const NAV: NavItem[] = [
  { id: 'windows',      label: 'Windows artifacts',  sub: 'Event IDs · registry · execution · USB',  icon: '🪟', group: 'OS Artifacts' },
  { id: 'linux',        label: 'Linux artifacts',     sub: 'Auth · history · persistence',            icon: '🐧', group: 'OS Artifacts' },
  { id: 'macos',        label: 'macOS artifacts',     sub: 'Unified Log · LaunchAgents · KnowledgeC', icon: '🍎', group: 'OS Artifacts' },
  { id: 'keyartifacts', label: 'Key artifacts (CI)',  sub: 'Shellbags · LNK · Prefetch · VSS',        icon: '🔑', group: 'CI Analysis' },
  { id: 'srum',         label: 'SRUM',                sub: 'Network bytes per process · exfil volume', icon: '📊', group: 'CI Analysis' },
  { id: 'cloud',        label: 'Cloud storage',       sub: 'OneDrive · Dropbox · Google Drive · Box',  icon: '☁', group: 'CI Analysis' },
  { id: 'antiforensics',label: 'Anti-forensics',      sub: 'Timestomping · wiping · log clearing',    icon: '🕵', group: 'CI Analysis' },
  { id: 'axiom',        label: 'AXIOM artifacts',      sub: 'MRU · USN · PS history · tasks · creds',  icon: '🧲', group: 'CI Analysis' },
  { id: 'browsersql',   label: 'Browser SQL',         sub: 'Chrome · Firefox · Edge · Safari queries', icon: '🌐', group: 'Reference' },
  { id: 'memory',       label: 'Memory forensics',    sub: 'Volatility 3 · triage · plugins',         icon: '🧠', group: 'Reference' },
  { id: 'triage',       label: 'Triage & acquisition',sub: 'KAPE · Velociraptor · imaging · memory',   icon: '🚑', group: 'Reference' },
  { id: 'tools',        label: 'Tool cheat sheets',   sub: 'EZ Tools · KAPE · X-Ways · Axiom',        icon: '🛠', group: 'Reference' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  windows:      <WindowsArtifacts />,
  linux:        <LinuxArtifacts />,
  macos:        <MacOSArtifacts />,
  keyartifacts: <KeyArtifactsCI />,
  srum:         <SRUMSection />,
  cloud:        <CloudForensics />,
  antiforensics:<AntiForensicsSection />,
  axiom:         <AxiomArtifactsSection />,
  browsersql:   <BrowserSQLSection />,
  memory:       <MemoryForensics />,
  triage:       <TriageSection />,
  tools:        <ToolCheatSheets />,
}

const groups = ['OS Artifacts', 'CI Analysis', 'Reference']

export default function ForensicsPage() {
  const [active, setActive]           = useState<SectionId>('windows')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Forensics reference</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">artifacts · CI analysis · triage</div>
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
            Digital forensics reference.
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
