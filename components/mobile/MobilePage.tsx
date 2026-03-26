'use client'

import { useState } from 'react'
import { AcquisitionRef, DeviceArtifacts, BackupStructure, SQLiteDatabases, AppArtifactPaths, ADBReference } from './sections'

type SectionId = 'acquisition' | 'artifacts' | 'backups' | 'sqlite' | 'apps' | 'adb'

const NAV = [
  { id: 'acquisition' as SectionId, label: 'Acquisition methods',  sub: 'Logical · FS · physical · JTAG · chip-off', icon: '📲' },
  { id: 'artifacts'   as SectionId, label: 'Device artifacts',     sub: 'Android + iOS paths, formats, value',       icon: '🗂' },
  { id: 'backups'     as SectionId, label: 'iOS backup structure',  sub: 'iTunes · iCloud · GrayKey',                 icon: '☁' },
  { id: 'sqlite'      as SectionId, label: 'SQLite databases',      sub: 'Key tables, columns, epoch notes',          icon: '🗄' },
  { id: 'apps'        as SectionId, label: 'App artifact paths',    sub: 'WhatsApp · Signal · Telegram · more',       icon: '📱' },
  { id: 'adb'         as SectionId, label: 'ADB reference',         sub: 'Device info · extraction · forensics',      icon: '🔌' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  acquisition: <AcquisitionRef />,
  artifacts:   <DeviceArtifacts />,
  backups:     <BackupStructure />,
  sqlite:      <SQLiteDatabases />,
  apps:        <AppArtifactPaths />,
  adb:         <ADBReference />,
}

export default function MobilePage() {
  const [active, setActive]           = useState<SectionId>('acquisition')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Mobile forensics</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">Android · iOS · FOR585</div>
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
            Based on SANS FOR585 methodology. Paths may vary by Android version and OEM skin.
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button onClick={() => setMobileNavOpen(o => !o)} className="text-zinc-400 text-xs font-mono">☰</button>
          <span className="text-xs font-mono text-zinc-300">{NAV.find(n => n.id === active)?.label}</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl w-full">
          {SECTIONS[active]}
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
    </div>
  )
}
