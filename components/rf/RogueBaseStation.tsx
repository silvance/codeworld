'use client'

import { useState, useMemo } from 'react'
import { rbsTechniques, rbsHardware, rbsDetectionMethods, rbsLegalFramework } from '@/lib/rf/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
}

function Copy({ text }: { text: string }) {
  const [c, setCopied] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1"
    >{c ? '✓' : 'copy'}</button>
  )
}

const diffColors: Record<string, string> = {
  LOW:       'bg-emerald-950 text-emerald-400',
  MED:       'bg-amber-950 text-amber-400',
  HIGH:      'bg-orange-950 text-orange-400',
  'VERY HIGH': 'bg-red-950 text-red-400',
}

const genColors: Record<string, string> = {
  '2G':      'bg-zinc-800 text-zinc-500',
  '3G':      'bg-blue-950 text-blue-400',
  '4G LTE':  'bg-emerald-950 text-emerald-400',
  '5G NR':   'bg-purple-950 text-purple-400',
  'All':     'bg-zinc-700 text-zinc-300',
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RogueBaseStation() {
  const [tab, setTab] = useState<'techniques' | 'hardware' | 'detection' | 'legal'>('techniques')
  const [open, setOpen] = useState<string | null>(null)
  const [genFilter, setGenFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('ALL')

  const generations = ['All', '2G', '3G', '4G LTE', '5G NR']

  const filteredTechniques = useMemo(() => rbsTechniques.filter(t =>
    genFilter === 'All' || t.generation === genFilter
  ), [genFilter])

  const hwTypes = ['ALL', 'Commercial / LE', 'Research / SDR', 'Software']
  const filteredHardware = useMemo(() => rbsHardware.filter(h =>
    catFilter === 'ALL' || h.type === catFilter
  ), [catFilter])

  const detCategories = ['ALL', ...Array.from(new Set(rbsDetectionMethods.map(d => d.category)))]
  const filteredDetection = useMemo(() => rbsDetectionMethods.filter(d =>
    catFilter === 'ALL' || d.category === catFilter
  ), [catFilter])

  const tabs = [
    { id: 'techniques', label: 'Attack techniques' },
    { id: 'hardware',   label: 'Hardware / platforms' },
    { id: 'detection',  label: 'Detection methods' },
    { id: 'legal',      label: 'Legal framework' },
  ] as const

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-mono font-semibold text-zinc-100">Rogue base station reference</h2>
        <p className="text-xs text-zinc-500 mt-1">
          2G downgrade attacks · LTE IMSI collection · 5G SUCI protection · SDR platforms · detection workflow · legal framework
        </p>
      </div>

      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ Unauthorized transmission on licensed cellular bands is a federal crime (47 USC 333, 47 CFR Part 25/90). Unauthorized interception is a federal felony (18 USC 2511). Detection and documentation are legal — jamming and active countermeasures are not.
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setOpen(null); setCatFilter('ALL'); setGenFilter('All') }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Attack techniques ── */}
      {tab === 'techniques' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {generations.map(g => (
              <button key={g} onClick={() => setGenFilter(g)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${genFilter === g ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{g}</button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredTechniques.map(t => (
              <div key={t.name} className="border border-zinc-800 rounded overflow-hidden">
                <button onClick={() => setOpen(open === t.name ? null : t.name)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge text={t.generation} cls={genColors[t.generation] ?? 'bg-zinc-800 text-zinc-400'} />
                    <Badge text={`Difficulty: ${t.difficulty}`} cls={diffColors[t.difficulty]} />
                    <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                  </div>
                  <span className="text-zinc-600 text-xs ml-2">{open === t.name ? '▲' : '▼'}</span>
                </button>
                {open === t.name && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    <p className="text-xs font-mono text-zinc-400">{t.description}</p>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Protocol mechanism</div>
                      <p className="text-xs font-mono text-blue-400">{t.protocolMechanism}</p>
                    </div>
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Key vulnerability</div>
                      <p className="text-xs font-mono text-amber-400">{t.keyVulnerability}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection indicators</div>
                      <ul className="space-y-1">
                        {t.indicators.map((ind, i) => (
                          <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2">
                            <span className="text-zinc-700 flex-shrink-0">→</span>{ind}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-600">{t.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hardware ── */}
      {tab === 'hardware' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {hwTypes.map(t => (
              <button key={t} onClick={() => setCatFilter(t)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{t}</button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredHardware.map(h => (
              <div key={h.name} className="border border-zinc-800 rounded overflow-hidden">
                <button onClick={() => setOpen(open === h.name ? null : h.name)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge text={h.type} cls={h.type === 'Commercial / LE' ? 'bg-red-950 text-red-400' : h.type === 'Software' ? 'bg-blue-950 text-blue-400' : 'bg-amber-950 text-amber-400'} />
                    <span className="text-sm font-mono font-semibold text-zinc-100">{h.name}</span>
                    <div className="flex gap-1">
                      {h.generations.map(g => <Badge key={g} text={g} cls={genColors[g] ?? 'bg-zinc-800 text-zinc-400'} />)}
                    </div>
                  </div>
                  <span className="text-zinc-600 text-xs ml-2">{open === h.name ? '▲' : '▼'}</span>
                </button>
                {open === h.name && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    <p className="text-xs font-mono text-zinc-400">{h.description}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Capabilities</div>
                        <ul className="space-y-1">{h.capabilities.map((c, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{c}</li>)}</ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Limitations</div>
                        <ul className="space-y-1">{h.limitations.map((l, i) => <li key={i} className="text-xs font-mono text-zinc-500 flex gap-2"><span className="text-zinc-700">—</span>{l}</li>)}</ul>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs font-mono">
                      <span className="text-zinc-600">Availability:</span>
                      <span className="text-zinc-300">{h.availability}</span>
                    </div>
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">TSCM detection significance</div>
                      <p className="text-xs font-mono text-amber-400">{h.detectionSignificance}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Detection methods ── */}
      {tab === 'detection' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {detCategories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredDetection.map(d => (
              <div key={d.method} className="border border-zinc-800 rounded overflow-hidden">
                <button onClick={() => setOpen(open === d.method ? null : d.method)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge text={d.category} cls="bg-blue-950 text-blue-400" />
                    <Badge text={d.cost} cls="bg-zinc-800 text-zinc-500" />
                    <span className="text-sm font-mono font-semibold text-zinc-100">{d.method}</span>
                  </div>
                  <span className="text-zinc-600 text-xs ml-2">{open === d.method ? '▲' : '▼'}</span>
                </button>
                {open === d.method && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    <p className="text-xs font-mono text-zinc-400">{d.description}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Capability</div>
                        <ul className="space-y-1">{d.capability.map((c, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{c}</li>)}</ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Limitations</div>
                        <ul className="space-y-1">{d.limitations.map((l, i) => <li key={i} className="text-xs font-mono text-zinc-500 flex gap-2"><span className="text-zinc-700">—</span>{l}</li>)}</ul>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools</div>
                      <div className="flex flex-wrap gap-1.5">
                        {d.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}
                      </div>
                    </div>
                    <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">TSCM workflow integration</div>
                      <p className="text-xs font-mono text-blue-400">{d.tscmWorkflow}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Legal framework ── */}
      {tab === 'legal' && (
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded overflow-hidden">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-xs font-mono font-semibold text-zinc-300">Transmission — federal prohibitions</span>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {rbsLegalFramework.transmission.map(r => (
                <div key={r.rule} className="flex gap-4 px-4 py-3">
                  <code className="text-[11px] font-mono text-red-400 w-32 flex-shrink-0 pt-0.5">{r.rule}</code>
                  <span className="text-xs font-mono text-zinc-400">{r.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-zinc-800 rounded overflow-hidden">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="text-xs font-mono font-semibold text-zinc-300">Detection — what is permitted</span>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {rbsLegalFramework.detection.map(r => (
                <div key={r.rule} className="flex gap-4 px-4 py-3">
                  <code className="text-[11px] font-mono text-emerald-400 w-32 flex-shrink-0 pt-0.5">{r.rule}</code>
                  <span className="text-xs font-mono text-zinc-400">{r.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-950/20 border border-amber-900/30 rounded p-4">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Operational notes</div>
            <p className="text-xs font-mono text-amber-400">{rbsLegalFramework.operationalNotes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
