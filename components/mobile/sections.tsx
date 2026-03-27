'use client'

import { useState, useMemo } from 'react'
import {
  acquisitionMethods, androidArtifacts, iosArtifacts, iosBackupTypes,
  sqliteDatabases, appArtifacts, adbCommands,
} from '@/lib/mobile/data'

// ─── Shared ──────────────────────────────────────────────────────────────────

const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
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

const levelColors: Record<string, string> = {
  'LOGICAL':    'bg-blue-950 text-blue-400',
  'FILESYSTEM': 'bg-emerald-950 text-emerald-400',
  'PHYSICAL':   'bg-amber-950 text-amber-400',
  'JTAG':       'bg-orange-950 text-orange-400',
  'CHIP-OFF':   'bg-red-950 text-red-400',
}

const encColors: Record<string, string> = {
  'PLAINTEXT': 'bg-emerald-950 text-emerald-400',
  'ENCRYPTED': 'bg-red-950 text-red-400',
  'PARTIAL':   'bg-amber-950 text-amber-400',
}

// ─── 1. Acquisition Methods ──────────────────────────────────────────────────

export function AcquisitionRef() {
  const [open, setOpen] = useState<string | null>('File system acquisition')
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Android' | 'iOS'>('All')

  const filtered = acquisitionMethods.filter(m =>
    platformFilter === 'All' || m.platforms.includes(platformFilter)
  )

  return (
    <div>
      <SectionHeader title="Acquisition methods" sub="Logical → file system → physical → JTAG → chip-off — ordered by invasiveness" />

      <div className="flex gap-2 mb-5">
        {(['All', 'Android', 'iOS'] as const).map(p => (
          <button key={p} onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              platformFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(m => (
          <div key={m.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === m.name ? null : m.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-semibold text-zinc-100">{m.name}</span>
                <Badge text={m.level} cls={levelColors[m.level]} />
                {m.platforms.map(p => (
                  <Badge key={p} text={p} cls={p === 'Android' ? 'bg-green-950 text-green-400' : 'bg-blue-950 text-blue-300'} />
                ))}
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === m.name ? '▲' : '▼'}</span>
            </button>
            {open === m.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-4">
                <p className="text-xs font-mono text-zinc-300">{m.notes}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Data access</div>
                    <ul className="space-y-1">
                      {m.dataAccess.map((d, i) => (
                        <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2">
                          <span className="text-zinc-700 flex-shrink-0">✓</span>{d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Limitations</div>
                    <ul className="space-y-1">
                      {m.limitations.map((l, i) => (
                        <li key={i} className="text-xs font-mono text-amber-400 flex gap-2">
                          <span className="text-zinc-700 flex-shrink-0">!</span>{l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Tools</div>
                  <p className="text-xs font-mono text-blue-400">{m.tools.join(' · ')}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Android / iOS Artifacts ──────────────────────────────────────────────

export function DeviceArtifacts() {
  const [platform, setPlatform] = useState<'Android' | 'iOS'>('Android')
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('ALL')

  const artifacts = platform === 'Android' ? androidArtifacts : iosArtifacts
  const categories = ['ALL', ...Array.from(new Set(artifacts.map(a => a.category)))]

  const filtered = useMemo(() => artifacts.filter(a => {
    if (catFilter !== 'ALL' && a.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q) ||
      a.provides.toLowerCase().includes(q) || a.notes.toLowerCase().includes(q)
  }), [artifacts, catFilter, search])

  return (
    <div>
      <SectionHeader title="Device artifacts" sub="Android and iOS artifact paths, formats, and forensic value" />

      <div className="flex gap-2 mb-4">
        {(['Android', 'iOS'] as const).map(p => (
          <button key={p} onClick={() => { setPlatform(p); setCatFilter('ALL'); setSearch('') }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              platform === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p}</button>
        ))}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search path, artifact, notes..." value={search}
          onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map(a => (
          <div key={`${a.category}-${a.name}`} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3 mb-2 flex-wrap">
              <Badge text={a.category} cls="bg-zinc-800 text-zinc-400" />
              <span className="text-xs font-mono font-semibold text-zinc-200">{a.name}</span>
              <Badge text={a.format} cls="bg-blue-950 text-blue-400" />
            </div>
            <div className="mb-2"><Code>{a.path}</Code></div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{a.provides}</p>
            <p className="text-xs font-mono text-zinc-500">{a.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. iOS Backup Structure ─────────────────────────────────────────────────

export function BackupStructure() {
  const [open, setOpen] = useState<string | null>(iosBackupTypes[0].name)

  return (
    <div>
      <SectionHeader title="iOS backup structure" sub="iTunes, encrypted iTunes, iCloud, and GrayKey — what each contains and limitations" />

      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono text-zinc-500 space-y-1">
        <div className="text-zinc-400 font-semibold mb-1">Seizure priority</div>
        <div>1. Airplane mode immediately — prevent remote wipe</div>
        <div>2. Keep plugged in — prevent BFU state on reboot</div>
        <div>3. Faraday bag if transport required</div>
        <div>4. Document: iOS version, last unlock time, battery %</div>
        <div>5. AFU (After First Unlock) state = keys in memory = maximum access</div>
      </div>

      <div className="space-y-2">
        {iosBackupTypes.map(b => (
          <div key={b.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === b.name ? null : b.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-semibold text-zinc-100">{b.name}</span>
                <Badge text={b.encrypted ? 'ENCRYPTED' : 'UNENCRYPTED'} cls={b.encrypted ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'} />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === b.name ? '▲' : '▼'}</span>
            </button>
            {open === b.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Location</div>
                  <Code>{b.location}</Code>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Contents</div>
                    <ul className="space-y-1">
                      {b.contents.map((c, i) => (
                        <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2">
                          <span className="text-zinc-700 flex-shrink-0">✓</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Limitations</div>
                    <ul className="space-y-1">
                      {b.limitations.map((l, i) => (
                        <li key={i} className="text-xs font-mono text-amber-400 flex gap-2">
                          <span className="text-zinc-700 flex-shrink-0">!</span>{l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-500">{b.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. SQLite Databases ─────────────────────────────────────────────────────

export function SQLiteDatabases() {
  const [open, setOpen]           = useState<string | null>(sqliteDatabases[0].name)
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Android' | 'iOS' | 'Both'>('All')

  const filtered = sqliteDatabases.filter(db =>
    platformFilter === 'All' || db.platform === platformFilter || db.platform === 'Both'
  )

  return (
    <div>
      <SectionHeader title="SQLite databases" sub="Key databases, tables, columns, and epoch conversion notes" />

      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono space-y-1 text-zinc-500">
        <div className="text-zinc-400 font-semibold mb-1">Epoch conversions</div>
        <div>Unix epoch (Android):  seconds or ms since <span className="text-emerald-400">1970-01-01</span></div>
        <div>Apple/Mac epoch (iOS): seconds since <span className="text-blue-400">2001-01-01</span> → add 978307200 for Unix</div>
        <div>WebKit epoch (Chrome): microseconds since <span className="text-amber-400">1601-01-01</span> → (t/1000000) - 11644473600</div>
        <div>Android ms epoch:      divide by 1000 for Unix seconds</div>
      </div>

      <div className="flex gap-2 mb-5">
        {(['All', 'Android', 'iOS', 'Both'] as const).map(p => (
          <button key={p} onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              platformFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(db => (
          <div key={db.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === db.name ? null : db.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-semibold text-emerald-400">{db.name}</span>
                <Badge text={db.platform} cls={db.platform === 'Android' ? 'bg-green-950 text-green-400' : db.platform === 'iOS' ? 'bg-blue-950 text-blue-300' : 'bg-purple-950 text-purple-400'} />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === db.name ? '▲' : '▼'}</span>
            </button>
            {open === db.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <div><Code>{db.path}</Code></div>
                <p className="text-xs font-mono text-zinc-300">{db.forensicValue}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key tables</div>
                  <div className="space-y-3">
                    {db.keyTables.map((t, i) => (
                      <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3">
                        <div className="text-xs font-mono font-semibold text-amber-400 mb-1">{t.table}</div>
                        <div className="text-xs font-mono text-zinc-300 mb-1">{t.keyColumns}</div>
                        <div className="text-[10px] font-mono text-zinc-500">{t.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 5. App Artifact Paths ───────────────────────────────────────────────────

export function AppArtifactPaths() {
  const [search, setSearch]           = useState('')
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Android' | 'iOS' | 'Both'>('All')
  const [open, setOpen]               = useState<string | null>(null)

  const filtered = useMemo(() => appArtifacts.filter(a => {
    if (platformFilter !== 'All' && a.platform !== platformFilter && a.platform !== 'Both') return false
    if (!search) return true
    const q = search.toLowerCase()
    return a.app.toLowerCase().includes(q) || a.bundleId.toLowerCase().includes(q)
  }), [platformFilter, search])

  return (
    <div>
      <SectionHeader title="App artifact paths" sub="WhatsApp, Signal, Telegram, Snapchat, and more — database locations and encryption status" />

      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search app name or bundle ID..." value={search}
          onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex gap-1">
          {(['All', 'Android', 'iOS', 'Both'] as const).map(p => (
            <button key={p} onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                platformFilter === p ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(a => (
          <div key={a.app} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === a.app ? null : a.app)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{a.app}</span>
                <Badge text={a.platform} cls={a.platform === 'Android' ? 'bg-green-950 text-green-400' : a.platform === 'iOS' ? 'bg-blue-950 text-blue-300' : 'bg-purple-950 text-purple-400'} />
                <Badge text={a.encryptionStatus} cls={encColors[a.encryptionStatus]} />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === a.app ? '▲' : '▼'}</span>
            </button>
            {open === a.app && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <div className="text-xs font-mono text-zinc-500">Bundle ID: <span className="text-zinc-400">{a.bundleId}</span></div>
                <div className="space-y-2">
                  {a.artifacts.map((art, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3">
                      <div className="text-xs font-mono text-zinc-300 font-semibold mb-1">{art.name}</div>
                      <div className="mb-1"><Code>{art.path}</Code></div>
                      <div className="text-xs font-mono text-zinc-500">{art.provides}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-mono text-zinc-500 border-t border-zinc-800 pt-3">{a.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. ADB Commands ─────────────────────────────────────────────────────────

export function ADBReference() {
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('ALL')

  const categories = ['ALL', ...Array.from(new Set(adbCommands.map(c => c.category)))]

  const filtered = useMemo(() => adbCommands.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return c.cmd.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  }), [catFilter, search])

  return (
    <div>
      <SectionHeader title="ADB command reference" sub="Setup, device info, file ops, app enumeration, logs, and forensic data extraction" />

      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 mb-5 text-xs font-mono text-zinc-500 space-y-1">
        <div className="text-zinc-400 font-semibold mb-1">Prerequisites</div>
        <div>USB debugging must be enabled: Settings → Developer Options → USB Debugging</div>
        <div>Developer Options: tap Build Number 7 times in Settings → About Phone</div>
        <div>Accept RSA fingerprint prompt on device when connecting</div>
        <div>Most /data/data/ commands require root — use on rooted device or after exploitation</div>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search commands..." value={search}
          onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="mb-1.5"><Code>{c.cmd}</Code></div>
            <p className="text-xs font-mono text-zinc-400">{c.description}</p>
            {c.notes && <p className="text-xs font-mono text-zinc-600 mt-1">{c.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
