'use client'

import { useState } from 'react'
import { WindowsArtifacts, LinuxArtifacts, MemoryForensics, ToolCheatSheets, MacOSArtifacts, KeyArtifactsCI } from './sections'

type SectionId = 'windows' | 'linux' | 'macos' | 'memory' | 'tools' | 'keyartifacts'

interface NavItem {
  id: SectionId
  label: string
  sub: string
  icon: string
}

const NAV: NavItem[] = [
  { id: 'windows',     label: 'Windows artifacts',  sub: 'Event IDs · registry · execution · USB · LNK · browser', icon: '🪟' },
  { id: 'linux',       label: 'Linux artifacts',    sub: 'Auth · history · persistence · accounts',               icon: '🐧' },
  { id: 'macos',       label: 'macOS artifacts',    sub: 'Unified Log · LaunchAgents · KnowledgeC · plist',       icon: '🍎' },
  { id: 'keyartifacts',label: 'Key artifacts (CI)',  sub: 'Shellbags · LNK · Prefetch · VSS · chains',            icon: '🔑' },
  { id: 'memory',      label: 'Memory forensics',   sub: 'Volatility 3 · triage workflow · plugins',             icon: '🧠' },
  { id: 'tools',       label: 'Tool cheat sheets',  sub: 'EZ Tools · KAPE · X-Ways · Axiom · Plaso',             icon: '🛠' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  windows:     <WindowsArtifacts />,
  linux:       <LinuxArtifacts />,
  macos:       <MacOSArtifacts />,
  keyartifacts:<KeyArtifactsCI />,
  memory:      <MemoryForensics />,
  tools:       <ToolCheatSheets />,
}

export default function ForensicsPage() {
  const [active, setActive]         = useState<SectionId>('windows')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Forensics reference</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">artifacts · memory · tooling</div>
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
            Reference material based on SANS FOR508 / FOR585 methodology.
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
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
