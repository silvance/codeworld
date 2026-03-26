'use client'

import { useState, useMemo } from 'react'
import {
  windowsEventIDs, registryHives, execArtifacts, usbArtifacts,
  lnkArtifacts, browserArtifacts, linuxArtifacts, volatilityPlugins,
  memoryTriage, toolSheets,
} from '@/lib/forensics/data'

// ─── Shared primitives ───────────────────────────────────────────────────────

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
  <code className="font-mono text-[11px] bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded whitespace-pre-wrap break-all">
    {children}
  </code>
)

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

// ─── 1. Windows Artifacts ────────────────────────────────────────────────────

export function WindowsArtifacts() {
  const [tab, setTab] = useState<'eventids' | 'registry' | 'execution' | 'usb' | 'lnk' | 'browser'>('eventids')

  const tabs = [
    { id: 'eventids',  label: 'Event IDs' },
    { id: 'registry',  label: 'Registry hives' },
    { id: 'execution', label: 'Execution' },
    { id: 'usb',       label: 'USB artifacts' },
    { id: 'lnk',       label: 'LNK / Jump Lists' },
    { id: 'browser',   label: 'Browser artifacts' },
  ] as const

  return (
    <div>
      <SectionHeader title="Windows artifacts" sub="Event IDs, registry hives, execution artifacts, USB, LNK, and browser paths" />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              tab === t.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'eventids' && <EventIDs />}
      {tab === 'registry' && <RegistryHives />}
      {tab === 'execution' && <ExecutionArtifacts />}
      {tab === 'usb' && <USBArtifacts />}
      {tab === 'lnk' && <LNKArtifacts />}
      {tab === 'browser' && <BrowserArtifacts />}
    </div>
  )
}

function EventIDs() {
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const categories = ['ALL', ...Array.from(new Set(windowsEventIDs.map(e => e.category)))]

  const filtered = useMemo(() => windowsEventIDs.filter(e => {
    if (catFilter !== 'ALL' && e.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return e.id.includes(q) || e.description.toLowerCase().includes(q) || e.notes.toLowerCase().includes(q)
  }), [search, catFilter])

  const catColors: Record<string, string> = {
    'Auth':             'bg-blue-950 text-blue-400',
    'Account Mgmt':     'bg-purple-950 text-purple-400',
    'Execution':        'bg-emerald-950 text-emerald-400',
    'Remote Access':    'bg-amber-950 text-amber-400',
    'Object Access':    'bg-zinc-800 text-zinc-400',
    'Persistence':      'bg-red-950 text-red-400',
    'Lateral Movement': 'bg-orange-950 text-orange-400',
    'Anti-Forensics':   'bg-red-950 text-red-500',
  }

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Search ID, description, notes..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map(e => (
          <div key={e.id} className="border border-zinc-800 rounded p-3 bg-zinc-900/30">
            <div className="flex items-start gap-3 mb-1.5 flex-wrap">
              <span className="text-sm font-mono font-bold text-amber-400 min-w-[3rem]">{e.id}</span>
              <span className="text-xs font-mono text-zinc-200 flex-1">{e.description}</span>
              <div className="flex gap-2 flex-wrap">
                <Badge text={e.log} cls="bg-zinc-800 text-zinc-400" />
                <Badge text={e.category} cls={catColors[e.category] ?? 'bg-zinc-800 text-zinc-400'} />
              </div>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">{e.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegistryHives() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="space-y-2">
      {registryHives.map(h => (
        <div key={h.hive} className="border border-zinc-800 rounded overflow-hidden">
          <button onClick={() => setOpen(open === h.hive ? null : h.hive)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-emerald-400">{h.hive}</span>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:block">{h.path}</span>
            </div>
            <span className="text-zinc-600 text-xs">{open === h.hive ? '▲' : '▼'}</span>
          </button>
          {open === h.hive && (
            <div className="px-4 py-3 border-t border-zinc-800 space-y-3">
              <div className="sm:hidden mb-2"><Code>{h.path}</Code></div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Forensic value</div>
                <p className="text-xs font-mono text-zinc-300">{h.forensicValue}</p>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Key artifacts</div>
                <ul className="space-y-1.5">
                  {h.keyArtifacts.map((a, i) => (
                    <li key={i} className="text-[11px] font-mono text-zinc-400 flex gap-2">
                      <span className="text-zinc-700 flex-shrink-0">→</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ExecutionArtifacts() {
  const [open, setOpen] = useState<string | null>('Prefetch')
  return (
    <div className="space-y-2">
      {execArtifacts.map(a => (
        <div key={a.name} className="border border-zinc-800 rounded overflow-hidden">
          <button onClick={() => setOpen(open === a.name ? null : a.name)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-purple-400">{a.name}</span>
              <span className="text-[11px] font-mono text-zinc-600">{a.os}</span>
            </div>
            <span className="text-zinc-600 text-xs">{open === a.name ? '▲' : '▼'}</span>
          </button>
          {open === a.name && (
            <div className="px-4 py-3 border-t border-zinc-800 space-y-3">
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Location</div>
                <Code>{a.location}</Code>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Provides</div>
                  <ul className="space-y-1">
                    {a.provides.map((p, i) => <li key={i} className="text-[11px] font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Limitations</div>
                  <ul className="space-y-1">
                    {a.limitations.map((l, i) => <li key={i} className="text-[11px] font-mono text-amber-500 flex gap-2"><span className="text-zinc-700">!</span>{l}</li>)}
                  </ul>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Tooling</div>
                <p className="text-[11px] font-mono text-blue-400">{a.tooling}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function USBArtifacts() {
  return (
    <div className="space-y-3">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-3 text-[11px] font-mono text-zinc-500 mb-4">
        USB correlation workflow: USBSTOR serial → MountedDevices drive letter → MountPoints2 user attribution → setupapi.dev.log first connection time → Event ID 6416
      </div>
      {usbArtifacts.map(a => (
        <div key={a.source} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="flex items-start gap-3 mb-2 flex-wrap">
            <span className="text-xs font-mono font-semibold text-amber-400">{a.source}</span>
          </div>
          <div className="mb-2"><Code>{a.location}</Code></div>
          <p className="text-xs font-mono text-zinc-300 mb-1.5">{a.provides}</p>
          <p className="text-[11px] font-mono text-zinc-500">{a.notes}</p>
        </div>
      ))}
    </div>
  )
}

function LNKArtifacts() {
  return (
    <div className="space-y-4">
      {lnkArtifacts.map(a => (
        <div key={a.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="text-sm font-mono font-semibold text-blue-400 mb-2">{a.name}</div>
          <div className="mb-3"><Code>{a.location}</Code></div>
          <div className="mb-3">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Provides</div>
            <ul className="space-y-1">
              {a.provides.map((p, i) => (
                <li key={i} className="text-[11px] font-mono text-zinc-300 flex gap-2">
                  <span className="text-zinc-700 flex-shrink-0">→</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] font-mono text-zinc-500">{a.notes}</p>
        </div>
      ))}
    </div>
  )
}

function BrowserArtifacts() {
  const [browserFilter, setBrowserFilter] = useState('All')
  const browsers = ['All', 'Chrome', 'Firefox', 'Edge', 'IE/Edge Legacy']

  const filtered = useMemo(() =>
    browserArtifacts.filter(a => browserFilter === 'All' || a.browser === browserFilter),
    [browserFilter])

  const browserColors: Record<string, string> = {
    'Chrome':          'bg-blue-950 text-blue-400',
    'Firefox':         'bg-orange-950 text-orange-400',
    'Edge':            'bg-blue-950 text-blue-300',
    'IE/Edge Legacy':  'bg-zinc-800 text-zinc-400',
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {browsers.map(b => (
          <button key={b} onClick={() => setBrowserFilter(b)}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              browserFilter === b ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{b}</button>
        ))}
      </div>
      <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-xs font-mono min-w-[600px]">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-24">Browser</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-28">Artifact</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal">Path</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-16 hidden sm:table-cell">Format</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={`${a.browser}-${a.artifact}`}
                className={`border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-900/20'}`}
                title={a.provides}>
                <td className="px-3 py-2">
                  <Badge text={a.browser} cls={browserColors[a.browser] ?? 'bg-zinc-800 text-zinc-400'} />
                </td>
                <td className="px-3 py-2 text-zinc-300">{a.artifact}</td>
                <td className="px-3 py-2 text-emerald-400 text-[10px] break-all">{a.path}</td>
                <td className="px-3 py-2 text-zinc-600 hidden sm:table-cell">{a.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] font-mono text-zinc-600 mt-2">Hover rows to see what each artifact provides</p>
    </div>
  )
}

// ─── 2. Linux Artifacts ──────────────────────────────────────────────────────

export function LinuxArtifacts() {
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('ALL')

  const categories = ['ALL', ...Array.from(new Set(linuxArtifacts.map(a => a.category)))]

  const filtered = useMemo(() => linuxArtifacts.filter(a => {
    if (catFilter !== 'ALL' && a.category !== catFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return a.path.toLowerCase().includes(q) || a.provides.toLowerCase().includes(q) || a.notes.toLowerCase().includes(q)
  }), [search, catFilter])

  const catColors: Record<string, string> = {
    'Auth':         'bg-blue-950 text-blue-400',
    'Shell History':'bg-emerald-950 text-emerald-400',
    'System Logs':  'bg-zinc-800 text-zinc-400',
    'Persistence':  'bg-red-950 text-red-400',
    'Accounts':     'bg-purple-950 text-purple-400',
    'File System':  'bg-amber-950 text-amber-400',
  }

  return (
    <div>
      <SectionHeader title="Linux artifacts" sub="Auth logs, shell history, persistence locations, user accounts, and file system artifacts" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search path, description..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map(a => (
          <div key={`${a.category}-${a.path}`} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3 mb-2 flex-wrap">
              <Badge text={a.category} cls={catColors[a.category] ?? 'bg-zinc-800 text-zinc-400'} />
            </div>
            <div className="mb-1.5"><Code>{a.path}</Code></div>
            <p className="text-xs font-mono text-zinc-300 mb-1">{a.provides}</p>
            <p className="text-[11px] font-mono text-zinc-500">{a.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Memory Forensics ─────────────────────────────────────────────────────

export function MemoryForensics() {
  const [tab, setTab]       = useState<'triage' | 'plugins'>('triage')
  const [osFilter, setOsFilter] = useState<'All' | 'Windows' | 'Linux'>('All')
  const [triageOnly, setTriageOnly] = useState(false)
  const [search, setSearch] = useState('')

  const filteredPlugins = useMemo(() => volatilityPlugins.filter(p => {
    if (osFilter !== 'All' && p.os !== osFilter) return false
    if (triageOnly && !p.triage) return false
    if (!search) return true
    const q = search.toLowerCase()
    return p.plugin.includes(q) || p.purpose.toLowerCase().includes(q)
  }), [osFilter, triageOnly, search])

  return (
    <div>
      <SectionHeader title="Memory forensics" sub="Volatility 3 triage workflow and plugin reference" />

      <div className="flex gap-2 mb-5">
        {(['triage', 'plugins'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{t === 'triage' ? 'Triage workflow' : 'Plugin reference'}</button>
        ))}
      </div>

      {tab === 'triage' && (
        <div className="space-y-3">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded p-3 text-[11px] font-mono text-zinc-500 mb-4">
            Assumes Volatility 3 with symbol tables installed. Run on a copy — never on the original capture file.
          </div>
          {memoryTriage.map(step => (
            <div key={step.step} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 flex gap-4">
              <span className="text-xl font-mono font-bold text-zinc-700 flex-shrink-0 w-6">{step.step}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-semibold text-zinc-200 mb-2">{step.action}</div>
                <div className="mb-2">
                  {step.cmd.split('\n').map((c, i) => (
                    <div key={i} className="mb-1"><Code>{c}</Code></div>
                  ))}
                </div>
                <p className="text-[11px] font-mono text-zinc-500">{step.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'plugins' && (
        <div>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input placeholder="Search plugin or purpose..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
            <div className="flex gap-1">
              {(['All', 'Windows', 'Linux'] as const).map(o => (
                <button key={o} onClick={() => setOsFilter(o)}
                  className={`px-2.5 py-1 text-xs font-mono rounded ${osFilter === o ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'}`}>{o}</button>
              ))}
            </div>
            <button onClick={() => setTriageOnly(t => !t)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${triageOnly ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
              triage only
            </button>
          </div>
          <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[500px]">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal w-8"></th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Plugin</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal hidden md:table-cell">Purpose</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal hidden lg:table-cell">Key output</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlugins.map((p, i) => (
                  <tr key={p.plugin} className={`border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-900/20'}`}>
                    <td className="px-3 py-2 text-center">
                      {p.triage && <span title="Triage" className="text-emerald-500 text-[10px]">●</span>}
                    </td>
                    <td className="px-3 py-2 text-emerald-400">{p.plugin}</td>
                    <td className="px-3 py-2 text-zinc-400 hidden md:table-cell">{p.purpose}</td>
                    <td className="px-3 py-2 text-zinc-600 hidden lg:table-cell text-[10px]">{p.keyOutputFields}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] font-mono text-zinc-700 mt-2">● = include in initial triage run</p>
        </div>
      )}
    </div>
  )
}

// ─── 4. Tool Cheat Sheets ────────────────────────────────────────────────────

export function ToolCheatSheets() {
  const [activeTool, setActiveTool] = useState(toolSheets[0].tool)
  const tool = toolSheets.find(t => t.tool === activeTool)!
  const [search, setSearch] = useState('')

  const filteredCmds = useMemo(() =>
    tool.commands.filter(c =>
      !search || c.cmd.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
    ), [tool, search])

  return (
    <div>
      <SectionHeader title="Tool cheat sheets" sub="Volatility 3, EZ Tools, Autopsy, KAPE, Plaso, Velociraptor, X-Ways, Axiom" />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {toolSheets.map(t => (
          <button key={t.tool} onClick={() => { setActiveTool(t.tool); setSearch('') }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              activeTool === t.tool ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{t.tool.split(' ')[0]}</button>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-sm font-mono font-semibold text-zinc-100">{tool.tool}</div>
            <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{tool.purpose}</div>
          </div>
          <Badge text={`v${tool.version}`} cls="bg-zinc-800 text-zinc-500" />
        </div>
        <div className="mt-2">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Install: </span>
          <span className="text-[11px] font-mono text-blue-400">{tool.install}</span>
        </div>
      </div>

      <input
        placeholder="Filter commands..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={`w-full mb-4 ${inputCls}`}
      />

      <div className="space-y-2">
        {filteredCmds.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="mb-1.5"><Code>{c.cmd}</Code></div>
            <p className="text-[11px] font-mono text-zinc-500">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
