// Unified search index for the global search bar.
// Page entries link to the route; section entries link to the route with
// ?section=<id> (or ?tool=<id> for /tools). Each subpage reads that param on
// mount and selects the matching section.
//
// Sections are derived from each page's NAV array, imported from
// lib/<area>/nav.ts. Concrete entries come from lib/<area>/data.ts.

import { networkSearchEntries }     from '@/lib/network/data'
import { forensicsSearchEntries }   from '@/lib/forensics/data'
import { malwareSearchEntries }     from '@/lib/malware/data'
import { osintSearchEntries }       from '@/lib/osint/data'
import { pentestSearchEntries }     from '@/lib/pentest/data'
import { pentestAdvancedSearchEntries } from '@/lib/pentest/dataAdvanced'
import { mobileSearchEntries }      from '@/lib/mobile/data'
import { rfSearchEntries }          from '@/lib/rf/data'
import { cloudSearchEntries }       from '@/lib/cloud/data'

import { NAV as forensicsNav } from '@/lib/forensics/nav'
import { NAV as networkNav }   from '@/lib/network/nav'
import { NAV as malwareNav }   from '@/lib/malware/nav'
import { NAV as osintNav }     from '@/lib/osint/nav'
import { NAV as pentestNav }   from '@/lib/pentest/nav'
import { NAV as mobileNav }    from '@/lib/mobile/nav'
import { NAV as rfNav }        from '@/lib/rf/nav'
import { NAV as cloudNav }     from '@/lib/cloud/nav'
import { NAV as toolsNav }     from '@/lib/tools/nav'

import type { RawSearchEntry } from './types'

export type SearchEntry = {
  kind: 'page' | 'section' | 'tool' | 'entry'
  title: string
  subtitle: string
  href: string
  page: string
  color: string
}

const PAGES: SearchEntry[] = [
  { kind: 'page', title: 'Tools',              subtitle: 'Hash · subnet · JWT · email headers · regex · cert · cron',         href: '/tools',      page: 'Tools',           color: 'zinc'    },
  { kind: 'page', title: 'Code Playground',    subtitle: 'Live Python, JavaScript, Go, Ruby, Bash execution',                  href: '/playground', page: 'Playground',      color: 'emerald' },
  { kind: 'page', title: 'OSINT Reference',    subtitle: 'Search operators · sock puppets · username enum · infra · darkweb', href: '/osint',      page: 'OSINT',           color: 'coral'   },
  { kind: 'page', title: 'Pentesting',         subtitle: 'Recon · scanning · Metasploit · webapp · AD · post-exploit',         href: '/pentest',    page: 'Pentest',         color: 'rose'    },
  { kind: 'page', title: 'Malware Analysis',   subtitle: 'PE · YARA · packers · C2 · evasion · families',                      href: '/malware',    page: 'Malware',         color: 'amber'   },
  { kind: 'page', title: 'Network Utilities',  subtitle: 'Ports · Wireshark · Nmap · protocols · attack signatures',           href: '/network',    page: 'Network',         color: 'teal'    },
  { kind: 'page', title: 'Digital Forensics',  subtitle: 'Windows · Linux · macOS artifacts · memory · triage',                href: '/forensics',  page: 'Forensics',       color: 'purple'  },
  { kind: 'page', title: 'Mobile Forensics',   subtitle: 'Android · iOS · ADB · SQLite · cloud extraction',                    href: '/mobile',     page: 'Mobile',          color: 'sky'     },
  { kind: 'page', title: 'Cloud Security',     subtitle: 'AWS · Azure · GCP · IAM · containers · cloud IR',                    href: '/cloud',      page: 'Cloud',           color: 'violet'  },
  { kind: 'page', title: 'RF / TSCM',          subtitle: 'Frequency · path loss · sweep · bug frequencies · SDR · TEMPEST',    href: '/rf',         page: 'RF / TSCM',       color: 'blue'    },
]

type SectionLike = { id: string; label: string; sub: string }

function expand(sections: readonly SectionLike[], page: string, route: string, color: string, paramName = 'section'): SearchEntry[] {
  return sections.map(s => ({
    kind: paramName === 'tool' ? 'tool' : 'section',
    title: s.label,
    subtitle: `${page} · ${s.sub}`,
    href: `${route}?${paramName}=${s.id}`,
    page,
    color,
  }))
}

function flatten(raw: RawSearchEntry[], page: string, route: string, color: string): SearchEntry[] {
  return raw.map(r => ({
    kind: 'entry' as const,
    title: r.title,
    subtitle: r.aka ? `${r.aka} · ${r.subtitle}` : r.subtitle,
    href: `${route}?section=${r.section}`,
    page,
    color,
  }))
}

export const SEARCH_INDEX: SearchEntry[] = [
  ...PAGES,
  ...expand(toolsNav,     'Tools',     '/tools',     'zinc',    'tool'),
  ...expand(osintNav,     'OSINT',     '/osint',     'coral'),
  ...expand(pentestNav,   'Pentest',   '/pentest',   'rose'),
  ...expand(malwareNav,   'Malware',   '/malware',   'amber'),
  ...expand(networkNav,   'Network',   '/network',   'teal'),
  ...expand(forensicsNav, 'Forensics', '/forensics', 'purple'),
  ...expand(cloudNav,     'Cloud',     '/cloud',     'violet'),
  ...expand(mobileNav,    'Mobile',    '/mobile',    'sky'),
  ...expand(rfNav,        'RF / TSCM', '/rf',        'blue'),
  // Entry-level: every concrete data row across the lib/* files.
  ...flatten(networkSearchEntries,        'Network',   '/network',   'teal'),
  ...flatten(forensicsSearchEntries,      'Forensics', '/forensics', 'purple'),
  ...flatten(malwareSearchEntries,        'Malware',   '/malware',   'amber'),
  ...flatten(osintSearchEntries,          'OSINT',     '/osint',     'coral'),
  ...flatten(pentestSearchEntries,        'Pentest',   '/pentest',   'rose'),
  ...flatten(pentestAdvancedSearchEntries,'Pentest',   '/pentest',   'rose'),
  ...flatten(mobileSearchEntries,         'Mobile',    '/mobile',    'sky'),
  ...flatten(rfSearchEntries,             'RF / TSCM', '/rf',        'blue'),
  ...flatten(cloudSearchEntries,          'Cloud',     '/cloud',     'violet'),
]

// Pages float to the top, sections next, then concrete entries.
const KIND_RANK: Record<SearchEntry['kind'], number> = { page: 0, section: 1, tool: 1, entry: 2 }

// Substring + acronym scoring. Higher = better match.
export function searchEntries(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: { entry: SearchEntry; score: number }[] = []
  for (const entry of SEARCH_INDEX) {
    const title = entry.title.toLowerCase()
    const subtitle = entry.subtitle.toLowerCase()
    let score = 0

    if (title === q) score = 1000
    else if (title.startsWith(q)) score = 500
    else if (title.includes(q)) score = 250
    else if (subtitle.includes(q)) score = 100

    // Acronym match (e.g., "wf" → "Wireshark filters")
    if (score === 0) {
      const initials = title.split(/\s+/).map(w => w[0]).join('')
      if (initials.startsWith(q)) score = 80
    }

    if (score > 0) {
      // Prefer pages over sections when scores tie
      score -= KIND_RANK[entry.kind]
      scored.push({ entry, score })
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry)
}

export const COLOR_DOT: Record<string, string> = {
  zinc:    'bg-zinc-500',
  emerald: 'bg-emerald-400',
  blue:    'bg-blue-400',
  purple:  'bg-purple-400',
  amber:   'bg-amber-400',
  teal:    'bg-teal-400',
  rose:    'bg-rose-400',
  coral:   'bg-red-400',
  violet:  'bg-violet-400',
  sky:     'bg-sky-400',
}
