'use client'

import { useState } from 'react'
import {
  SearchOperators, PeopleSearch, SockPuppet, UsernameEnum,
  ImageOSINT, SocialMedia, InfraOSINT, PhoneOSINT, DarkWebOSINT, CorpIntel,
} from './sections'

type SectionId = 'search' | 'people' | 'persona' | 'username' | 'image' | 'social' | 'infra' | 'phone' | 'darkweb' | 'corp'

const NAV = [
  { id: 'search'   as SectionId, label: 'Search operators',    sub: 'Google · Bing · dorks',          icon: '🔎' },
  { id: 'people'   as SectionId, label: 'People search',       sub: 'Spokeo · Pipl · PACER',          icon: '👤' },
  { id: 'username' as SectionId, label: 'Username enum',       sub: 'Sherlock · Maigret · breaches',  icon: '🏷' },
  { id: 'image'    as SectionId, label: 'Image OSINT',         sub: 'Reverse · EXIF · geolocation',   icon: '🖼' },
  { id: 'social'   as SectionId, label: 'Social media',        sub: 'LinkedIn · Twitter · Facebook',  icon: '📱' },
  { id: 'infra'    as SectionId, label: 'Domain / IP / infra', sub: 'Shodan · crt.sh · DNS history',  icon: '🌐' },
  { id: 'phone'    as SectionId, label: 'Phone OSINT',         sub: 'Truecaller · Phoneinfoga',       icon: '📞' },
  { id: 'darkweb'  as SectionId, label: 'Dark web OSINT',      sub: 'Breaches · Tor · ransomware',    icon: '🕸' },
  { id: 'corp'     as SectionId, label: 'Corporate intel',     sub: 'SEC · SAM.gov · patents',        icon: '🏢' },
  { id: 'persona'  as SectionId, label: 'Sock puppet OPSEC',   sub: 'Infrastructure · identity · ops',icon: '🎭' },
]

const SECTIONS: Record<SectionId, React.ReactNode> = {
  search:   <SearchOperators />,
  people:   <PeopleSearch />,
  persona:  <SockPuppet />,
  username: <UsernameEnum />,
  image:    <ImageOSINT />,
  social:   <SocialMedia />,
  infra:    <InfraOSINT />,
  phone:    <PhoneOSINT />,
  darkweb:  <DarkWebOSINT />,
  corp:     <CorpIntel />,
}

export default function OSINTPage() {
  const [active, setActive]           = useState<SectionId>('search')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">OSINT reference</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">cyber / counterintelligence focus</div>
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
            For authorized investigative use. Verify legal authority before collection.
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
