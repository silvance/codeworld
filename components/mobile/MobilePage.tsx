'use client'

import { useState } from 'react'
import { AcquisitionRef, DeviceArtifacts, BackupStructure, SQLiteDatabases, AppArtifactPaths, ADBReference } from './sections'
import {
  iOSUnifiedLog, AndroidLogs, CloudExtractionSection, AppDeepDivesSection,
  LocationForensics, CommCorrelation, MobileMalware, MobileAntiForensicsSection,
  JTAGWorkflow, UFEDReference,
} from './sectionsAdvanced'

type SectionId =
  | 'acquisition' | 'artifacts' | 'backups' | 'sqlite' | 'apps' | 'adb'
  | 'ioslog' | 'androidlog' | 'cloud' | 'appdeep' | 'location'
  | 'comms' | 'malware' | 'antiforensics' | 'jtag' | 'ufed'

interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

const NAV: NavItem[] = [
  { id: 'acquisition',   label: 'Acquisition methods',  sub: 'Logical · FS · physical · JTAG',      icon: '📲', group: 'Foundations' },
  { id: 'artifacts',     label: 'Device artifacts',     sub: 'Android + iOS paths and value',       icon: '🗂', group: 'Foundations' },
  { id: 'backups',       label: 'iOS backup structure', sub: 'iTunes · iCloud · GrayKey',           icon: '☁', group: 'Foundations' },
  { id: 'sqlite',        label: 'SQLite databases',     sub: 'Key tables, columns, epoch notes',    icon: '🗄', group: 'Foundations' },
  { id: 'apps',          label: 'App artifact paths',   sub: 'WhatsApp · Signal · Telegram',        icon: '📱', group: 'Foundations' },
  { id: 'adb',           label: 'ADB reference',        sub: 'Device info · extraction · forensics', icon: '🔌', group: 'Foundations' },
  { id: 'ioslog',        label: 'iOS Unified Log',      sub: 'sysdiagnose · execution · network',   icon: '🍎', group: 'Advanced' },
  { id: 'androidlog',    label: 'Android logs',         sub: 'Logcat · tombstones · Dropbox · netstats', icon: '🤖', group: 'Advanced' },
  { id: 'cloud',         label: 'Cloud extraction',     sub: 'iCloud · Google · WhatsApp backup',   icon: '☁', group: 'Advanced' },
  { id: 'appdeep',       label: 'App deep dives',       sub: 'WhatsApp · Signal · Telegram · Snap', icon: '🔬', group: 'Advanced' },
  { id: 'location',      label: 'Location forensics',   sub: 'Sig Locations · Timeline · towers',   icon: '📍', group: 'Advanced' },
  { id: 'comms',         label: 'Comms correlation',    sub: 'SMS · calls · iMessage identity',     icon: '💬', group: 'Advanced' },
  { id: 'malware',       label: 'Malware indicators',   sub: 'Jailbreak · stalkerware · root',      icon: '🦠', group: 'Advanced' },
  { id: 'antiforensics', label: 'Anti-forensics',       sub: 'Factory reset · wipe · encryption',   icon: '🕵', group: 'Advanced' },
  { id: 'jtag',          label: 'JTAG / chip-off',      sub: 'Hardware extraction workflow',        icon: '🔧', group: 'Hardware' },
  { id: 'ufed',          label: 'Cellebrite / UFED',    sub: 'Extraction types · PA workflow',      icon: '🏛', group: 'Hardware' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  acquisition:   <AcquisitionRef />,
  artifacts:     <DeviceArtifacts />,
  backups:       <BackupStructure />,
  sqlite:        <SQLiteDatabases />,
  apps:          <AppArtifactPaths />,
  adb:           <ADBReference />,
  ioslog:        <iOSUnifiedLog />,
  androidlog:    <AndroidLogs />,
  cloud:         <CloudExtractionSection />,
  appdeep:       <AppDeepDivesSection />,
  location:      <LocationForensics />,
  comms:         <CommCorrelation />,
  malware:       <MobileMalware />,
  antiforensics: <MobileAntiForensicsSection />,
  jtag:          <JTAGWorkflow />,
  ufed:          <UFEDReference />,
}

const groups = ['Foundations', 'Advanced', 'Hardware']

export default function MobilePage() {
  const [active, setActive] = useState<SectionId>('acquisition')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Mobile forensics</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">iOS · Android · cloud · hardware</div>
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
          <div className="text-[9px] font-mono text-zinc-700 leading-relaxed">FOR585 methodology</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button onClick={() => setMobileNavOpen(o => !o)} className="text-zinc-400 text-xs font-mono">☰</button>
          <span className="text-xs font-mono text-zinc-300">{NAV.find(n => n.id === active)?.label}</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full">{SECTIONS[active]}</main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
    </div>
  )
}
