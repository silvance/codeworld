'use client'

import { useState, useMemo } from 'react'
import {
  srumTables, srumWorkflow,
  cloudArtifacts,
  browserQueries,
  antiForensicIndicators,
  acquisitionMethods, triageChecklist,
} from '@/lib/forensics/data'

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

function Copy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
        .catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0 px-1"
    >{copied ? '✓' : 'copy'}</button>
  )
}

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

function SqlBlock({ sql }: { sql: string }) {
  return (
    <div className="relative group">
      <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">{sql}</pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy text={sql} />
      </div>
    </div>
  )
}

// ─── SRUM ─────────────────────────────────────────────────────────────────────

export function SRUMSection() {
  const [tab, setTab] = useState<'tables' | 'workflow'>('workflow')
  const [activeTable, setActiveTable] = useState(0)
  const [colOpen, setColOpen] = useState<string | null>(null)

  return (
    <div>
      <SH title="SRUM — System Resource Usage Monitor"
        sub="Per-process network bytes, CPU time, and energy usage — proves data exfiltration volume" />

      <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        SRUM is the single most powerful artifact for quantifying data exfiltration. If Prefetch proves a tool ran,
        SRUM proves how many bytes it sent. Entries persist 30–60 days in C:\Windows\System32\sru\SRUDB.dat (ESE format).
      </div>

      <div className="flex gap-2 mb-5">
        {(['workflow', 'tables'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t === 'workflow' ? 'Parse workflow' : 'Table reference'}
          </button>
        ))}
      </div>

      {tab === 'workflow' && (
        <div className="space-y-3">
          {srumWorkflow.map((s, i) => (
            <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-zinc-600 w-5 flex-shrink-0 pt-0.5">{i + 1}</span>
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-mono font-semibold text-zinc-100">{s.step}</div>
                  <p className="text-xs font-mono text-zinc-400">{s.detail}</p>
                  {s.cmd && (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-[11px] font-mono text-emerald-400 bg-zinc-950 px-2 py-1.5 rounded break-all">{s.cmd}</code>
                      <Copy text={s.cmd} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tables' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {srumTables.map((t, i) => (
              <button key={i} onClick={() => setActiveTable(i)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${activeTable === i ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
                {i === 0 ? 'Network Usage' : i === 1 ? 'App Timeline' : 'Energy Usage'}
              </button>
            ))}
          </div>

          {(() => {
            const t = srumTables[activeTable]
            return (
              <div className="space-y-4">
                <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
                  <p className="text-xs font-mono text-zinc-400 mb-2">{t.description}</p>
                  <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI relevance: </span>
                    <span className="text-xs font-mono text-amber-400">{t.ciRelevance}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key columns</div>
                  <div className="space-y-2">
                    {t.keyColumns.map(col => (
                      <div key={col.column} className="border border-zinc-800 rounded overflow-hidden">
                        <button onClick={() => setColOpen(colOpen === col.column ? null : col.column)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                          <div className="flex items-center gap-2">
                            <code className="text-[11px] font-mono text-emerald-400">{col.column}</code>
                            <Badge text={col.type} cls="bg-zinc-800 text-zinc-500" />
                          </div>
                          <span className="text-zinc-600 text-xs">{colOpen === col.column ? '▲' : '▼'}</span>
                        </button>
                        {colOpen === col.column && (
                          <div className="border-t border-zinc-800 px-3 py-2.5 space-y-1.5">
                            <p className="text-xs font-mono text-zinc-400">{col.meaning}</p>
                            <p className="text-xs font-mono text-amber-400">⚑ {col.ciValue}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Queries</div>
                  <div className="space-y-3">
                    {t.queries.map((q, i) => (
                      <div key={i}>
                        <p className="text-xs font-mono text-zinc-400 mb-1.5">{q.description}</p>
                        <SqlBlock sql={q.sql} />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-mono text-zinc-600">{t.notes}</p>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

// ─── Cloud Storage Forensics ──────────────────────────────────────────────────

export function CloudForensics() {
  const [providerFilter, setProviderFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const providers = ['ALL', ...Array.from(new Set(cloudArtifacts.map(a => a.provider)))]
  const filtered = useMemo(() => cloudArtifacts.filter(a =>
    providerFilter === 'ALL' || a.provider === providerFilter
  ), [providerFilter])

  return (
    <div>
      <SH title="Cloud storage forensics"
        sub="OneDrive · SharePoint/Teams · Dropbox · Google Drive · Box · iCloud — artifacts, databases, and SQL queries" />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {providers.map(p => (
          <button key={p} onClick={() => setProviderFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${providerFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{p}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((a, i) => (
          <div key={i} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === a.path ? null : a.path)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={a.provider} cls="bg-blue-950 text-blue-400" />
                <Badge text={a.artifactType} cls="bg-zinc-800 text-zinc-500" />
                <Badge text={a.platform} cls="bg-zinc-800 text-zinc-600" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === a.path ? '▲' : '▼'}</span>
            </button>
            {open === a.path && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{a.path}</code>
                  <Copy text={a.path} />
                </div>
                <p className="text-xs font-mono text-zinc-400">{a.description}</p>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI relevance: </span>
                  <span className="text-xs font-mono text-amber-400">{a.ciRelevance}</span>
                </div>
                {a.queries && a.queries.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">SQL queries</div>
                    <div className="space-y-3">
                      {a.queries.map((q, j) => (
                        <div key={j}>
                          <p className="text-xs font-mono text-zinc-500 mb-1.5">{q.description}</p>
                          <SqlBlock sql={q.sql} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Parse with:</span>
                  {a.parseWith.split(', ').map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}
                </div>
                <p className="text-xs font-mono text-zinc-600">{a.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Browser SQL Queries ──────────────────────────────────────────────────────

export function BrowserSQLSection() {
  const [browserFilter, setBrowserFilter] = useState('ALL')
  const [catFilter, setCatFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const browsers = ['ALL', ...Array.from(new Set(browserQueries.map(q => q.browser)))]
  const cats = ['ALL', ...Array.from(new Set(browserQueries.map(q => q.category)))]

  const filtered = useMemo(() => browserQueries.filter(q => {
    if (browserFilter !== 'ALL' && q.browser !== browserFilter) return false
    if (catFilter !== 'ALL' && q.category !== catFilter) return false
    if (search) {
      const s = search.toLowerCase()
      return q.description.toLowerCase().includes(s) || q.sql.toLowerCase().includes(s)
    }
    return true
  }), [browserFilter, catFilter, search])

  return (
    <div>
      <SH title="Browser SQLite queries"
        sub="Chrome · Firefox · Edge · Safari — history, downloads, cloud visits, passwords, autofill" />

      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search queries..." value={search} onChange={e => setSearch(e.target.value)}
          className={`flex-1 min-w-40 ${inputCls}`} />
        <div className="flex flex-wrap gap-1">
          {browsers.map(b => (
            <button key={b} onClick={() => setBrowserFilter(b)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${browserFilter === b ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{b}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-blue-900 text-blue-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q, i) => (
          <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge text={q.browser} cls="bg-blue-950 text-blue-400" />
              <Badge text={q.category} cls="bg-zinc-800 text-zinc-500" />
              <span className="text-xs font-mono text-zinc-300">{q.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[11px] font-mono text-zinc-500 flex-1 break-all">{q.dbPath}</code>
              <Copy text={q.dbPath} />
            </div>
            <SqlBlock sql={q.sql} />
            <p className="text-[11px] font-mono text-zinc-600">{q.notes}</p>
          </div>
        ))}
        <div className="text-[10px] font-mono text-zinc-700">{filtered.length} / {browserQueries.length} queries</div>
      </div>
    </div>
  )
}

// ─── Anti-Forensics Detection ─────────────────────────────────────────────────

export function AntiForensicsSection() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const cats = ['ALL', ...Array.from(new Set(antiForensicIndicators.map(a => a.category)))]
  const filtered = useMemo(() => antiForensicIndicators.filter(a =>
    catFilter === 'ALL' || a.category === catFilter
  ), [catFilter])

  return (
    <div>
      <SH title="Anti-forensics detection"
        sub="Timestomping · secure delete · log clearing · file hiding · encryption — indicators and detection methods" />

      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(a => (
          <div key={a.technique} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === a.technique ? null : a.technique)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={a.category} cls="bg-red-950 text-red-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{a.technique}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === a.technique ? '▲' : '▼'}</span>
            </button>
            {open === a.technique && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <p className="text-xs font-mono text-zinc-400">{a.description}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection indicators</div>
                  <ul className="space-y-1.5">
                    {a.detection.map((d, i) => (
                      <li key={i} className="text-xs font-mono text-amber-400 flex gap-2">
                        <span className="text-zinc-700 flex-shrink-0">→</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Relevant artifacts</div>
                    <div className="flex flex-wrap gap-1.5">
                      {a.artifacts.map(art => <Badge key={art} text={art} cls="bg-zinc-800 text-zinc-400" />)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools</div>
                    <div className="flex flex-wrap gap-1.5">
                      {a.tools.map(t => <Badge key={t} text={t} cls="bg-blue-950 text-blue-400" />)}
                    </div>
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-600">{a.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Triage & Acquisition ─────────────────────────────────────────────────────

export function TriageSection() {
  const [tab, setTab] = useState<'methods' | 'checklist'>('methods')
  const [activeMethod, setActiveMethod] = useState(0)

  const priorityBadge = (p: string) => {
    const map: Record<string, string> = {
      FIRST: 'bg-emerald-950 text-emerald-400',
      SECOND: 'bg-blue-950 text-blue-400',
      THIRD: 'bg-zinc-800 text-zinc-400',
    }
    return <Badge text={p} cls={map[p] ?? 'bg-zinc-800 text-zinc-400'} />
  }

  return (
    <div>
      <SH title="Triage & acquisition workflows"
        sub="Live response (KAPE · Velociraptor) · dead-box imaging · memory · cloud — step-by-step with commands" />

      <div className="flex gap-2 mb-5">
        {(['methods', 'checklist'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t === 'methods' ? 'Acquisition methods' : 'Field checklist'}
          </button>
        ))}
      </div>

      {tab === 'methods' && (
        <div className="flex gap-4" style={{ minHeight: '500px' }}>
          <div className="w-44 flex-shrink-0 space-y-1">
            {acquisitionMethods.map((m, i) => (
              <button key={m.name} onClick={() => setActiveMethod(i)}
                className={`w-full text-left px-3 py-2.5 rounded transition-colors border-l-2 ${activeMethod === i ? 'border-emerald-600 bg-zinc-800 text-zinc-100' : 'border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
                <div className="text-xs font-mono leading-tight mb-1">{m.name}</div>
                {priorityBadge(m.priority)}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {(() => {
              const m = acquisitionMethods[activeMethod]
              return (
                <>
                  <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {priorityBadge(m.priority)}
                      <Badge text={m.category} cls="bg-blue-950 text-blue-400" />
                      <span className="text-sm font-mono font-bold text-zinc-100">{m.name}</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{m.useCase}</p>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Steps</div>
                    <div className="space-y-2">
                      {m.steps.map((s, i) => (
                        <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
                          <div className="flex items-start gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold text-zinc-600 flex-shrink-0">{i + 1}.</span>
                            <span className="text-xs font-mono font-semibold text-zinc-200">{s.step}</span>
                          </div>
                          <p className="text-xs font-mono text-zinc-500 mb-1.5 pl-4">{s.detail}</p>
                          {s.cmd && (
                            <div className="flex items-center gap-2 pl-4">
                              <code className="flex-1 text-[11px] font-mono text-emerald-400 bg-zinc-950 px-2 py-1 rounded break-all">{s.cmd}</code>
                              <Copy text={s.cmd} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools</div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Hash verification</div>
                      <p className="text-xs font-mono text-zinc-400">{m.hashVerification}</p>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-zinc-600">{m.notes}</p>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-4">
          {triageChecklist.map(phase => (
            <div key={phase.phase} className="border border-zinc-800 rounded overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <span className="text-xs font-mono font-semibold text-zinc-300">{phase.phase}</span>
              </div>
              <div className="p-4 space-y-2">
                {phase.items.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 flex-shrink-0 accent-emerald-500" />
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[10px] font-mono text-zinc-700">Checkboxes are not persistent — use as a live reference during acquisition</p>
        </div>
      )}
    </div>
  )
}
