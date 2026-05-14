'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useUrlSyncedQueryParam } from "@/lib/queryParam"
import { externalHref } from '@/lib/url'
import { playbooks } from '@/lib/osint/workflows'
import {
  searchOperators, peopleSources, personaSteps, usernameSources,
  imageTools, socialPlatforms, infraTools, phoneTools,
  darkWebSources, corpSources,
  emailOSINT, geoTools, cryptoOSINT, codeOSINT, archiveOSINT,
  vehicleOSINT, documentOSINT, verificationToolkit,
  cryptoConcepts, cryptoWalletArtifacts, cryptoObfuscation,
  cryptoOfframps, cryptoCasePatterns,
} from '@/lib/osint/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

const SH = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-6">
    <h2 className="text-base font-mono font-semibold text-zinc-100">{title}</h2>
    <p className="text-xs text-zinc-500 mt-1">{sub}</p>
  </div>
)

const Badge = ({ text, cls }: { text: string; cls: string }) => (
  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
)

const Code = ({ children }: { children: string }) => (
  <code className="font-mono text-xs bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded whitespace-pre-wrap break-all">{children}</code>
)

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

// ─── 1. Search Operators ─────────────────────────────────────────────────────

export function SearchOperators() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [engineFilter, setEngineFilter] = useState('ALL')

  const filtered = useMemo(() => searchOperators.filter(op => {
    if (engineFilter !== 'ALL' && !op.engine.includes(engineFilter)) return false
    if (!search) return true
    const q = search.toLowerCase()
    return op.operator.toLowerCase().includes(q) || op.example.toLowerCase().includes(q) || op.description.toLowerCase().includes(q)
  }), [search, engineFilter])

  return (
    <div>
      <SH title="Search operators" sub="Google, Bing, and DuckDuckGo dorks — operators, syntax, and compound dorks" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search operators..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex gap-1">
          {['ALL', 'Google', 'Bing', 'DuckDuckGo'].map(e => (
            <button key={e} onClick={() => setEngineFilter(e)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                engineFilter === e ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{e}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(op => (
          <div key={op.operator} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <code className="text-sm font-mono font-bold text-emerald-400">{op.operator}</code>
              <div className="flex gap-1">{op.engine.map(e => <Badge key={e} text={e} cls="bg-blue-950 text-blue-400" />)}</div>
            </div>
            <div className="mb-2"><Code>{op.example}</Code></div>
            <p className="text-xs font-mono text-zinc-400">{op.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. People Search ─────────────────────────────────────────────────────────

export function PeopleSearch() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <SH title="People search sources" sub="Spokeo, Intelius, Pipl, PACER — what each covers and opt-out availability" />
      <div className="bg-amber-950/20 border border-amber-900/40 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ CI focus: use these sources with a clean investigation account not tied to your identity. Many log search queries. Legal authorization required for law enforcement use.
      </div>
      <div className="space-y-2">
        {peopleSources.map(s => (
          <div key={s.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === s.name ? null : s.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.name}</span>
                <a href={externalHref(s.url)} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{s.url}</a>
                <Badge text={s.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === s.name ? '▲' : '▼'}</span>
            </button>
            {open === s.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Data types</div>
                    <div className="flex flex-wrap gap-1.5">{s.dataTypes.map(d => <Badge key={d} text={d} cls="bg-zinc-800 text-zinc-400" />)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Strengths</div>
                    <ul className="space-y-1">{s.strengths.map((st, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{st}</li>)}</ul>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Limitations</div>
                  <ul className="space-y-1">{s.limitations.map((l, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">!</span>{l}</li>)}</ul>
                </div>
                <p className="text-xs font-mono text-zinc-400">{s.notes}</p>
                {s.optOutUrl && (
                  <div className="text-xs font-mono text-zinc-600">Opt-out: <a href={externalHref(s.optOutUrl)} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 hover:underline">{s.optOutUrl}</a></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Sock Puppet OPSEC ─────────────────────────────────────────────────────

export function SockPuppet() {
  const [open, setOpen] = useState<string | null>(personaSteps[0].step)

  return (
    <div>
      <SH title="Sock puppet / persona OPSEC" sub="Infrastructure, identity creation, account building, and engagement hygiene — CI-focused" />
      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ Legal context: persona use for law enforcement/CI investigations must comply with agency policy, applicable law, and terms of service. Consult legal counsel. This reference is for authorized use only.
      </div>
      <div className="space-y-2">
        {personaSteps.map((step, i) => (
          <div key={step.step} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === step.step ? null : step.step)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-bold text-zinc-600 w-5">{i + 1}</span>
                <Badge text={step.phase} cls="bg-purple-950 text-purple-400" />
                <span className="text-sm font-mono text-zinc-100">{step.step}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === step.step ? '▲' : '▼'}</span>
            </button>
            {open === step.step && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <ul className="space-y-2">
                  {step.actions.map((a, j) => (
                    <li key={j} className="text-xs font-mono text-zinc-300 flex gap-2">
                      <span className="text-emerald-700 flex-shrink-0">→</span>{a}
                    </li>
                  ))}
                </ul>
                <div className="space-y-1.5">
                  {step.warnings.map((w, j) => (
                    <div key={j} className="bg-red-950/20 border border-red-900/30 rounded px-3 py-2 text-xs font-mono text-red-400 flex gap-2">
                      <span className="flex-shrink-0">⚠</span>{w}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. Username Enumeration ──────────────────────────────────────────────────

export function UsernameEnum() {
  return (
    <div>
      <SH title="Username / handle enumeration" sub="Sherlock, Maigret, WhatsMyName, and breach correlation — handle to identity pipeline" />
      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono text-zinc-500 space-y-1">
        <div className="text-zinc-400 font-semibold mb-1">Enumeration pipeline</div>
        <div>1. Collect known usernames/handles from all known platforms</div>
        <div>2. Run Sherlock + Maigret for broad platform coverage</div>
        <div>3. Cross-reference found profiles for additional usernames</div>
        <div>4. Run Dehashed: username → email → password hash</div>
        <div>5. PeekYou: username → real identity correlation</div>
        <div>6. HIBP: email → breach exposure history</div>
      </div>
      <div className="space-y-3">
        {usernameSources.map(s => (
          <div key={s.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.name}</span>
                <a href={externalHref(s.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{s.url}</a>
              </div>
              <div className="flex gap-2">
                <Badge text={s.method} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={s.coverage} cls="bg-emerald-950 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-500">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 5. Image OSINT ───────────────────────────────────────────────────────────

export function ImageOSINT() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', 'Reverse image', 'Facial recognition', 'EXIF / metadata', 'Geolocation', 'Forensics']

  const catMap: Record<string, string> = {
    'Google Reverse Image': 'Reverse image', 'Bing Visual Search': 'Reverse image',
    'Yandex Image Search': 'Reverse image', 'TinEye': 'Reverse image',
    'PimEyes': 'Facial recognition', 'FaceCheck.ID': 'Facial recognition',
    'ExifTool': 'EXIF / metadata', 'Jeffrey\'s Exif Viewer': 'EXIF / metadata',
    'Google Maps / Earth': 'Geolocation', 'SunCalc': 'Geolocation',
    'Forensically': 'Forensics', 'FotoForensics': 'Forensics',
  }

  const filtered = useMemo(() => imageTools.filter(t => catFilter === 'ALL' || catMap[t.name] === catFilter), [catFilter])

  return (
    <div>
      <SH title="Image OSINT" sub="Reverse image, facial recognition, EXIF extraction, geolocation, and manipulation detection" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <Badge text={t.method} cls="bg-zinc-800 text-zinc-400" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{t.bestFor}</p>
            <p className="text-xs font-mono text-zinc-500">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Social Media ─────────────────────────────────────────────────────────

export function SocialMedia() {
  const [active, setActive] = useState(socialPlatforms[0].platform)
  const platform = socialPlatforms.find(p => p.platform === active)!

  return (
    <div>
      <SH title="Social media investigation" sub="LinkedIn, Twitter/X, Facebook, Instagram, Reddit — techniques, tools, and OPSEC" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {socialPlatforms.map(p => (
          <button key={p.platform} onClick={() => setActive(p.platform)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              active === p.platform ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p.platform}</button>
        ))}
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key techniques</div>
          <ul className="space-y-2">
            {platform.keyTechniques.map((t, i) => (
              <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2">
                <span className="text-emerald-700 flex-shrink-0">→</span>{t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Tools</div>
          <div className="space-y-2">
            {platform.tools.map((t, i) => (
              <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-zinc-200">{t.name}</span>
                  <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
                </div>
                <p className="text-xs font-mono text-zinc-500">{t.notes}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">OPSEC notes</div>
          <div className="space-y-1.5">
            {platform.opsecNotes.map((n, i) => (
              <div key={i} className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2 text-xs font-mono text-amber-400 flex gap-2">
                <span className="flex-shrink-0">⚠</span>{n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 7. Domain / IP / Infrastructure ─────────────────────────────────────────

export function InfraOSINT() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')

  const catMap: Record<string, string> = {
    'WHOIS (ICANN)': 'WHOIS', 'DomainTools': 'WHOIS', 'ViewDNS.info': 'WHOIS',
    'crt.sh': 'Certificates', 'Censys': 'Certificates',
    'Shodan': 'Scanning', 'Shodan CVE search': 'Scanning',
    'DNSDumpster': 'DNS', 'SecurityTrails': 'DNS', 'Amass (CLI)': 'DNS',
    'BGP.he.net (Hurricane Electric)': 'ASN/IP', 'ARIN / RIPE / APNIC': 'ASN/IP',
    'Hunter.io': 'Email', 'EmailRep': 'Email',
  }

  const cats = ['ALL', 'WHOIS', 'Certificates', 'Scanning', 'DNS', 'ASN/IP', 'Email']

  const filtered = useMemo(() => infraTools.filter(t => {
    if (catFilter !== 'ALL' && catMap[t.name] !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Domain / IP / infrastructure OSINT" sub="WHOIS, Shodan, certificate transparency, DNS history, ASN mapping, and email enumeration" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              {catMap[t.name] && <Badge text={catMap[t.name]} cls="bg-zinc-800 text-zinc-400" />}
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-2">{t.what}</p>
            {t.commands && (
              <ul className="mb-2 space-y-1">
                {t.commands.map((c, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">$</span>{c}</li>)}
              </ul>
            )}
            <p className="text-xs font-mono text-zinc-500">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 8. Phone OSINT ──────────────────────────────────────────────────────────

export function PhoneOSINT() {
  return (
    <div>
      <SH title="Phone number OSINT" sub="Truecaller, carrier lookup, Phoneinfoga, reverse lookup, and breach correlation" />
      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono text-zinc-500 space-y-1">
        <div className="text-zinc-400 font-semibold mb-1">Phone investigation workflow</div>
        <div>1. NumLookup → carrier + line type (mobile/landline/VoIP)</div>
        <div>2. Truecaller + CallerSmart → crowdsourced identity</div>
        <div>3. Whitepages reverse → name/address (best for landlines)</div>
        <div>4. Google/Bing all format variants: &quot;555-867-5309&quot; &quot;5558675309&quot; &quot;+15558675309&quot;</div>
        <div>5. Social media: Facebook search, WhatsApp contact check</div>
        <div>6. Phoneinfoga → aggregates multiple sources in one run</div>
        <div>7. Dehashed → if number appears in breach data</div>
      </div>
      <div className="space-y-3">
        {phoneTools.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{t.what}</p>
            <p className="text-xs font-mono text-zinc-500">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 9. Dark Web OSINT ───────────────────────────────────────────────────────

export function DarkWebOSINT() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', 'Breach data', 'Paste sites', 'Dark web search', 'Ransomware', 'Cryptocurrency']

  const catMap: Record<string, string> = {
    'Have I Been Pwned': 'Breach data', 'Dehashed': 'Breach data', 'IntelligenceX': 'Breach data', 'Leaked Source (archived)': 'Breach data',
    'Pastebin / Ghostbin / Hastebin': 'Paste sites', 'psbdmp.ws': 'Paste sites',
    'Ahmia': 'Dark web search', 'OnionSearch': 'Dark web search',
    'Ransomware leak site monitoring': 'Ransomware', 'DarkOwl': 'Ransomware',
    'Blockchain.com / Blockchair': 'Cryptocurrency', 'Etherscan': 'Cryptocurrency',
  }

  const filtered = useMemo(() => darkWebSources.filter(s => catFilter === 'ALL' || catMap[s.name] === catFilter), [catFilter])

  return (
    <div>
      <SH title="Dark web OSINT" sub="Breach databases, paste sites, Tor search, ransomware monitoring, and blockchain analysis" />
      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ Operational security: Tor access should be from a dedicated device on a network not tied to your identity. Dark web sites are inherently hostile environments. Never execute files obtained from dark web sources.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.name}</span>
                <Badge text={s.type} cls="bg-zinc-800 text-zinc-400" />
              </div>
              <Badge text={s.access} cls="bg-blue-950 text-blue-400" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{s.what}</p>
            <p className="text-xs font-mono text-zinc-500">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 10. Corporate / Business Intelligence ────────────────────────────────────

export function CorpIntel() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')

  const filtered = useMemo(() => corpSources.filter(s => {
    if (!search) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.what.toLowerCase().includes(q) || s.notes.toLowerCase().includes(q)
  }), [search])

  return (
    <div>
      <SH title="Corporate / business intelligence" sub="SEC EDGAR, USASpending, SAM.gov, PACER, OpenCorporates, Glassdoor, patents" />
      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono text-zinc-500 space-y-1">
        <div className="text-zinc-400 font-semibold mb-1">CI-relevant corporate OSINT pipeline</div>
        <div>1. SAM.gov → confirm federal contractor status, CAGE code, NAICS codes</div>
        <div>2. USASpending + FPDS → contract history, agency relationships, contract descriptions</div>
        <div>3. SEC EDGAR → insider transactions, beneficial ownership, financial filings</div>
        <div>4. OpenCorporates + State SOS → corporate structure, subsidiaries, officers</div>
        <div>5. LinkedIn → org chart, key personnel, hiring trends, technology stack (job postings)</div>
        <div>6. Patents → R&D focus areas, inventor names, technology relationships</div>
        <div>7. Glassdoor → internal culture indicators, real working conditions</div>
      </div>
      <input placeholder="Search sources..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full mb-5 ${inputCls}`} />
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.name}</span>
                <a href={externalHref(s.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{s.url}</a>
              </div>
              <Badge text={s.cost} cls="bg-zinc-800 text-zinc-500" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{s.what}</p>
            <p className="text-xs font-mono text-zinc-500">{s.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Email OSINT ──────────────────────────────────────────────────────────────

export function EmailOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(emailOSINT.map(t => t.category)))]

  const filtered = useMemo(() => emailOSINT.filter(t => {
    if (catFilter !== 'ALL' && t.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Email OSINT" sub="Pattern enumeration, account-presence checks, breach hunting, reputation scoring" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <div className="flex gap-1.5">
                <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Geospatial / Map OSINT ───────────────────────────────────────────────────

export function GeoOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(geoTools.map(t => t.category)))]

  const filtered = useMemo(() => geoTools.filter(t => {
    if (catFilter !== 'ALL' && t.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Geospatial / map OSINT" sub="Aviation, maritime, satellite imagery, mapping, chronolocation by sun and weather" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Crypto / Blockchain OSINT ────────────────────────────────────────────────

export function CryptoOSINTSection() {
  const [tab, setTab] = useState<'concepts' | 'tools' | 'wallets' | 'obfuscation' | 'offramps' | 'patterns'>('concepts')

  const TABS = [
    { id: 'concepts',    label: 'Concepts',           count: cryptoConcepts.length },
    { id: 'tools',       label: 'Tools',              count: cryptoOSINT.length },
    { id: 'wallets',     label: 'Wallet artifacts',   count: cryptoWalletArtifacts.length },
    { id: 'obfuscation', label: 'Mixers / bridges',   count: cryptoObfuscation.length },
    { id: 'offramps',    label: 'Off-ramps · freeze', count: cryptoOfframps.length },
    { id: 'patterns',    label: 'Case patterns',      count: cryptoCasePatterns.length },
  ] as const

  return (
    <div>
      <SH title="Crypto / blockchain investigations" sub="Concepts · tools · wallet artifacts · obfuscation · off-ramps · case patterns" />
      <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 mb-5 text-xs font-mono text-amber-400 leading-relaxed">
        Reference material for analysts who don&apos;t work crypto cases regularly. Start with <strong>Concepts</strong> if you&apos;re new — the terms in case files all show up there. Then <strong>Case patterns</strong> for the shapes you&apos;ll most likely encounter.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t.label} <span className="text-zinc-600">· {t.count}</span>
          </button>
        ))}
      </div>

      {tab === 'concepts' && (
        <div className="space-y-3">
          {cryptoConcepts.map(c => (
            <div key={c.term} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="text-sm font-mono font-semibold text-zinc-100">{c.term}</div>
              <p className="text-xs font-mono text-zinc-300 italic">{c.oneLiner}</p>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">{c.detail}</p>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Why it matters: </span>
                <span className="text-xs font-mono text-amber-400">{c.whyItMatters}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tools' && (
        <div className="space-y-3">
          {cryptoOSINT.map(t => (
            <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                  <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
                </div>
                <div className="flex gap-1.5">
                  <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                  <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
                </div>
              </div>
              <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'wallets' && (
        <div className="space-y-3">
          {cryptoWalletArtifacts.map(w => (
            <div key={w.wallet} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{w.wallet}</span>
                <Badge text={w.type} cls="bg-purple-950 text-purple-400" />
                <Badge text={w.platform} cls="bg-zinc-800 text-zinc-400" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Paths</div>
                <ul className="space-y-1">
                  {w.paths.map((p, i) => <li key={i}><code className="text-[11px] font-mono text-emerald-400 break-all">{p}</code></li>)}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Artifacts</div>
                <ul className="space-y-1">
                  {w.artifacts.map((a, i) => <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2"><span className="text-zinc-700">·</span>{a}</li>)}
                </ul>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{w.notes}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'obfuscation' && (
        <div className="space-y-3">
          {cryptoObfuscation.map(o => (
            <div key={o.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{o.name}</span>
                <Badge text={o.type} cls="bg-rose-950 text-rose-400" />
                <Badge text={o.chains} cls="bg-zinc-800 text-zinc-400" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Indicators</div>
                <ul className="space-y-1">
                  {o.indicators.map((ind, i) => <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2"><span className="text-zinc-700">·</span>{ind}</li>)}
                </ul>
              </div>
              <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
                <span className="text-xs font-mono text-amber-400">{o.ciValue}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{o.notes}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'offramps' && (
        <div className="space-y-3">
          {cryptoOfframps.map(o => (
            <div key={o.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{o.name}</span>
                <Badge text={o.type} cls="bg-teal-950 text-teal-400" />
                <Badge text={o.kyc} cls={o.kyc.startsWith('Full KYC') && !o.kyc.includes('variable') ? 'bg-emerald-950 text-emerald-400' : o.kyc.startsWith('No KYC') || o.kyc.startsWith('None') ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'} />
                <Badge text={`Cooperation: ${o.cooperation}`} cls={o.cooperation.startsWith('High') ? 'bg-emerald-950 text-emerald-400' : o.cooperation.startsWith('Mixed') ? 'bg-amber-950 text-amber-400' : 'bg-red-950 text-red-400'} />
              </div>
              <div className="text-xs font-mono text-zinc-400"><span className="text-zinc-600">Jurisdiction: </span>{o.jurisdiction}</div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Legal process</div>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">{o.legalProcess}</p>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{o.notes}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'patterns' && (
        <div className="space-y-3">
          {cryptoCasePatterns.map(p => (
            <div key={p.pattern} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{p.pattern}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div><span className="text-zinc-600">Chain: </span><span className="text-zinc-300">{p.typicalChain}</span></div>
                <div><span className="text-zinc-600">Amount: </span><span className="text-zinc-300">{p.typicalAmount}</span></div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Typical flow</div>
                <ul className="space-y-1">
                  {p.flow.map((step, i) => <li key={i} className="text-xs font-mono text-zinc-300">{step}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Investigative pivots</div>
                <ul className="space-y-1">
                  {p.pivots.map((piv, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">→</span>{piv}</li>)}
                </ul>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{p.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Code & Repo OSINT ────────────────────────────────────────────────────────

export function CodeOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(codeOSINT.map(t => t.category)))]

  const filtered = useMemo(() => codeOSINT.filter(t => {
    if (catFilter !== 'ALL' && t.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Code & repository OSINT" sub="GitHub dorking, secret scanning, code search, supply-chain investigation" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <div className="flex gap-1.5">
                <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Archive & Wayback ────────────────────────────────────────────────────────

export function ArchiveOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const filtered = useMemo(() => archiveOSINT.filter(t => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [search])

  return (
    <div>
      <SH title="Archive & wayback" sub="Historical web pages, deleted Reddit, on-demand archiving, investigation-grade capture" />
      <input placeholder="Search archive tools..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full mb-5 ${inputCls}`} />
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <div className="flex gap-1.5">
                <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Vehicle / Transport OSINT ────────────────────────────────────────────────

export function VehicleOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const filtered = useMemo(() => vehicleOSINT.filter(t => {
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q) || t.jurisdiction.toLowerCase().includes(q)
  }), [search])

  return (
    <div>
      <SH title="Vehicle / transport OSINT" sub="VIN history, aircraft and vessel registries, license-plate OCR — jurisdictional caveats apply" />
      <div className="border border-amber-900/40 bg-amber-950/20 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ License-plate-to-owner lookups are restricted by law in most jurisdictions for non-LE. The tools listed here are decoders, registries, and OCR — not commercial lookup services for plate-to-PII. Know your local law.
      </div>
      <input placeholder="Search vehicle tools..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full mb-5 ${inputCls}`} />
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={t.jurisdiction} cls="bg-zinc-800 text-zinc-500" />
                <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Document & Metadata ──────────────────────────────────────────────────────

export function DocumentOSINTSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(documentOSINT.map(t => t.category)))]

  const filtered = useMemo(() => documentOSINT.filter(t => {
    if (catFilter !== 'ALL' && t.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Documents & metadata" sub="EXIF, FOCA, Office macro analysis, PDF tooling, journalist document archives" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <div className="flex gap-1.5">
                <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={t.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Verification Toolkit ─────────────────────────────────────────────────────

export function VerificationSection() {
  const [search, setSearch] = useUrlSyncedQueryParam('q')
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(verificationToolkit.map(t => t.category)))]

  const filtered = useMemo(() => verificationToolkit.filter(t => {
    if (catFilter !== 'ALL' && t.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.what.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SH title="Verification toolkit" sub="Image and video forensics, chronolocation, Bellingcat-style verification methods" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <a href={externalHref(t.url)} target="_blank" rel="noopener noreferrer" className="ml-3 text-xs font-mono text-blue-400 hover:text-blue-300 hover:underline">{t.url}</a>
              </div>
              <Badge text={t.category} cls="bg-zinc-800 text-zinc-400" />
            </div>
            <p className="text-xs font-mono text-zinc-300 mb-1.5">{t.what}</p>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{t.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Investigation Workflows ──────────────────────────────────────────────────

export function WorkflowsSection() {
  const [open, setOpen] = useState<string | null>(playbooks[0].id)

  return (
    <div>
      <SH title="Investigation workflows" sub="Step-by-step playbooks tying tools together — start here if you're new to OSINT" />

      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded p-3 mb-5 text-xs font-mono text-emerald-300 leading-relaxed">
        Each playbook is one common investigation type — what you start with, what you end up with, and the exact tool to use at each step. Click any step’s tool to jump to its entry on this site.
      </div>

      <div className="space-y-3">
        {playbooks.map(pb => {
          const isOpen = open === pb.id
          return (
            <div key={pb.id} className="border border-zinc-800 rounded overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : pb.id)}
                className="w-full px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left flex items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-mono font-semibold text-zinc-100">{pb.title}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{pb.goal}</div>
                </div>
                <span className="text-zinc-600 text-xs ml-2 flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-zinc-800 p-4 space-y-4 bg-zinc-900/20">
                  {/* Inputs / Outputs */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Inputs</div>
                      <ul className="space-y-1">
                        {pb.inputs.map((i, idx) => (
                          <li key={idx} className="text-[11px] font-mono text-zinc-300 flex gap-2">
                            <span className="text-zinc-700 flex-shrink-0">→</span>{i}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Outputs</div>
                      <ul className="space-y-1">
                        {pb.outputs.map((o, idx) => (
                          <li key={idx} className="text-[11px] font-mono text-emerald-400 flex gap-2">
                            <span className="text-zinc-700 flex-shrink-0">✓</span>{o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Steps</div>
                    <ol className="space-y-3">
                      {pb.steps.map(step => (
                        <li key={step.num} className="border border-zinc-800 rounded p-3 bg-zinc-950/30">
                          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-emerald-500 flex-shrink-0">{String(step.num).padStart(2, '0')}</span>
                            {step.href ? (
                              <Link
                                href={step.href}
                                className="text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                {step.tool} ↗
                              </Link>
                            ) : (
                              <span className="text-xs font-mono font-semibold text-zinc-300">{step.tool}</span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-zinc-300 leading-relaxed mb-1">{step.action}</p>
                          <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                            <span className="text-zinc-600 uppercase tracking-wide mr-1">why:</span>{step.why}
                          </p>
                          {step.notes && (
                            <p className="text-[11px] font-mono text-zinc-600 leading-relaxed mt-1">
                              <span className="text-zinc-700 uppercase tracking-wide mr-1">note:</span>{step.notes}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Pitfalls */}
                  <div className="bg-amber-950/20 border border-amber-900/40 rounded p-3">
                    <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1.5">Pitfalls & opsec</div>
                    <ul className="space-y-1">
                      {pb.pitfalls.map((p, idx) => (
                        <li key={idx} className="text-[11px] font-mono text-amber-300 flex gap-2 leading-relaxed">
                          <span className="text-amber-700 flex-shrink-0">!</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
