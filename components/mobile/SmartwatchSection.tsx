'use client'

import { useState, useMemo } from 'react'
import { smartwatchPlatforms, smartwatchQueries, smartwatchCIConsiderations } from '@/lib/mobile/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

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

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
}

function CmdBlock({ cmd }: { cmd: string }) {
  return (
    <div className="relative group">
      <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">{cmd}</pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy text={cmd} />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SmartwatchForensics() {
  const [tab, setTab] = useState<'platforms' | 'queries' | 'ci'>('platforms')
  const [activePlatform, setActivePlatform] = useState(0)
  const [platformTab, setPlatformTab] = useState<'acquisition' | 'artifacts' | 'databases' | 'legal'>('acquisition')
  const [queryFilter, setQueryFilter] = useState('ALL')
  const [openCI, setOpenCI] = useState<string | null>(null)

  const platform = smartwatchPlatforms[activePlatform]

  const queryPlatforms = ['ALL', ...Array.from(new Set(smartwatchQueries.map(q => q.platform.split(' (')[0])))]
  const filteredQueries = useMemo(() =>
    smartwatchQueries.filter(q => queryFilter === 'ALL' || q.platform.startsWith(queryFilter))
  , [queryFilter])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-mono font-semibold text-zinc-100">Smartwatch forensics</h2>
        <p className="text-xs text-zinc-500 mt-1">Apple Watch · Samsung Galaxy Watch · Fitbit · Garmin — acquisition, health databases, GPS evidence, CI considerations</p>
      </div>

      {/* Top-level tabs */}
      <div className="flex gap-2 mb-6">
        {(['platforms', 'queries', 'ci'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t === 'platforms' ? 'Platform reference' : t === 'queries' ? 'SQL & parse queries' : 'CI considerations'}
          </button>
        ))}
      </div>

      {/* ── Platform reference ── */}
      {tab === 'platforms' && (
        <div className="flex gap-4" style={{ minHeight: '600px' }}>
          {/* Platform list */}
          <div className="w-44 flex-shrink-0 space-y-1">
            {smartwatchPlatforms.map((p, i) => (
              <button key={p.name} onClick={() => { setActivePlatform(i); setPlatformTab('acquisition') }}
                className={`w-full text-left px-3 py-2.5 rounded transition-colors border-l-2 ${
                  activePlatform === i
                    ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                    : 'border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                }`}>
                <div className="text-xs font-mono leading-tight">{p.name}</div>
                <div className="text-[10px] font-mono text-zinc-700 mt-0.5 leading-tight">{p.devices.split(',')[0]}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Header */}
            <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="text-sm font-mono font-bold text-zinc-100 mb-1">{platform.name}</div>
              <div className="text-xs font-mono text-zinc-500">{platform.devices}</div>
              <div className="text-xs font-mono text-zinc-600 mt-0.5">OS: {platform.os}</div>
            </div>

            {/* Sub-tabs */}
            <div className="flex flex-wrap gap-1.5">
              {(['acquisition', 'artifacts', 'databases', 'legal'] as const).map(t => (
                <button key={t} onClick={() => setPlatformTab(t)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${platformTab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Acquisition */}
            {platformTab === 'acquisition' && (
              <div className="space-y-3">
                {platform.acquisitionMethods.map((m, i) => (
                  <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-zinc-600">{i + 1}.</span>
                      <span className="text-xs font-mono font-semibold text-zinc-100">{m.method}</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{m.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Tools:</span>
                      <span className="text-xs font-mono text-blue-400">{m.toolSupport}</span>
                    </div>
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                      <p className="text-xs font-mono text-amber-400">{m.notes}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Sync relationship</div>
                  <p className="text-xs font-mono text-blue-400">{platform.syncRelationship}</p>
                </div>
              </div>
            )}

            {/* Artifacts */}
            {platformTab === 'artifacts' && (
              <div className="space-y-2">
                {platform.artifacts.map((a, i) => (
                  <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge text={a.category} cls="bg-zinc-800 text-zinc-400" />
                      <Badge text={a.format} cls="bg-blue-950 text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-mono text-emerald-400 flex-1 break-all">{a.path}</code>
                      <Copy text={a.path} />
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{a.description}</p>
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
                      <span className="text-xs font-mono text-amber-400">{a.ciRelevance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Databases */}
            {platformTab === 'databases' && (
              <div className="space-y-4">
                {platform.databases.map((db, i) => (
                  <div key={i} className="space-y-3">
                    <div className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
                      <div className="text-xs font-mono font-semibold text-zinc-100 mb-1">{db.name}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-[11px] font-mono text-emerald-400 flex-1 break-all">{db.path}</code>
                        <Copy text={db.path} />
                      </div>
                      <p className="text-xs font-mono text-zinc-500">{db.description}</p>
                    </div>
                    {db.keyTables.map((t, j) => (
                      <div key={j} className="border border-zinc-800 rounded p-3 bg-zinc-900/20 ml-4">
                        <code className="text-[11px] font-mono text-emerald-400 block mb-1">{t.table}</code>
                        <code className="text-[10px] font-mono text-zinc-600 block mb-2 break-all">{t.columns}</code>
                        <p className="text-xs font-mono text-amber-400">⚑ {t.ciValue}</p>
                      </div>
                    ))}
                  </div>
                ))}
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Parse with</div>
                  <div className="flex flex-wrap gap-1.5">
                    {platform.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}
                  </div>
                </div>
              </div>
            )}

            {/* Legal / encryption */}
            {platformTab === 'legal' && (
              <div className="space-y-3">
                <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Encryption</div>
                  <p className="text-xs font-mono text-zinc-400">{platform.encryptionNotes}</p>
                </div>
                <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Legal process</div>
                  <p className="text-xs font-mono text-zinc-400">{platform.legalProcess}</p>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                  <p className="text-xs font-mono text-blue-400">{platform.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SQL & parse queries ── */}
      {tab === 'queries' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {queryPlatforms.map(p => (
              <button key={p} onClick={() => setQueryFilter(p)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${queryFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{p}</button>
            ))}
          </div>
          {filteredQueries.map((q, i) => (
            <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={q.platform.split(' (')[0]} cls="bg-blue-950 text-blue-400" />
                <span className="text-xs font-mono text-zinc-300">{q.description}</span>
              </div>
              <CmdBlock cmd={q.sql} />
            </div>
          ))}
        </div>
      )}

      {/* ── CI considerations ── */}
      {tab === 'ci' && (
        <div className="space-y-3">
          <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 text-xs font-mono text-amber-400 mb-5">
            Wearable health data provides the most continuous biometric timeline available in consumer forensics. Heart rate, GPS, and sleep data are extremely difficult to fabricate or selectively delete — making them high-value CI artifacts.
          </div>
          {smartwatchCIConsiderations.map(c => (
            <div key={c.scenario} className="border border-zinc-800 rounded overflow-hidden">
              <button onClick={() => setOpenCI(openCI === c.scenario ? null : c.scenario)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                <span className="text-sm font-mono font-semibold text-zinc-100">{c.scenario}</span>
                <span className="text-zinc-600 text-xs">{openCI === c.scenario ? '▲' : '▼'}</span>
              </button>
              {openCI === c.scenario && (
                <div className="border-t border-zinc-800 p-4 space-y-3">
                  <p className="text-xs font-mono text-zinc-400">{c.description}</p>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Key artifacts</div>
                    <ul className="space-y-1">
                      {c.artifacts.map((a, i) => (
                        <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2">
                          <span className="text-zinc-700 flex-shrink-0">→</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-950/20 border border-blue-900/30 rounded px-3 py-2">
                    <p className="text-xs font-mono text-blue-400">{c.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
