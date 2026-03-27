'use client'

import { useState, useMemo } from 'react'
import { axiomArtifacts, axiomWorkflowNotes } from '@/lib/forensics/data'

function Copy({ text }: { text: string }) {
  const [c, setCopied] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0 px-1"
    >{c ? '✓' : 'copy'}</button>
  )
}

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
}

const catColors: Record<string, string> = {
  'MRU / Recent':      'bg-blue-950 text-blue-400',
  'NTFS':              'bg-emerald-950 text-emerald-400',
  'Execution':         'bg-purple-950 text-purple-400',
  'Persistence':       'bg-red-950 text-red-400',
  'Credentials':       'bg-amber-950 text-amber-400',
  'System':            'bg-zinc-800 text-zinc-400',
  'Anti-forensics':    'bg-red-950 text-red-400',
  'Execution / Recent':'bg-blue-950 text-blue-400',
}

export function AxiomArtifactsSection() {
  const [tab, setTab] = useState<'artifacts' | 'workflow'>('artifacts')
  const [catFilter, setCatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)
  const [attrOpen, setAttrOpen] = useState<string | null>(null)

  const cats = ['ALL', ...Array.from(new Set(axiomArtifacts.map(a => a.category)))]
  const filtered = useMemo(() => axiomArtifacts.filter(a =>
    catFilter === 'ALL' || a.category === catFilter
  ), [catFilter])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-mono font-semibold text-zinc-100">AXIOM artifact reference</h2>
        <p className="text-xs text-zinc-500 mt-1">
          MRU artifacts · USN Journal fields · PowerShell history · Scheduled Tasks · Stored Credentials · OS info — sourced from Magnet AXIOM Artifact Reference 6.8.0
        </p>
      </div>

      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3 mb-5 text-xs font-mono text-blue-400">
        These artifacts complement the Key Artifacts (CI) section with AXIOM-specific field breakdowns, detection logic, and forensic notes from the official Magnet Forensics reference document.
      </div>

      <div className="flex gap-2 mb-5">
        {(['artifacts', 'workflow'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t === 'artifacts' ? 'Artifact reference' : 'AXIOM workflow'}
          </button>
        ))}
      </div>

      {tab === 'artifacts' && (
        <>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {cats.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(a => (
              <div key={a.name} className="border border-zinc-800 rounded overflow-hidden">
                <button onClick={() => setOpen(open === a.name ? null : a.name)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge text={a.category} cls={catColors[a.category] ?? 'bg-zinc-800 text-zinc-400'} />
                    <span className="text-sm font-mono font-semibold text-zinc-100">{a.name}</span>
                  </div>
                  <span className="text-zinc-600 text-xs ml-2">{open === a.name ? '▲' : '▼'}</span>
                </button>

                {open === a.name && (
                  <div className="border-t border-zinc-800 p-4 space-y-4">
                    {/* Description */}
                    <p className="text-xs font-mono text-zinc-400">{a.description}</p>

                    {/* Paths */}
                    {(a.registryPath || a.filePath) && (
                      <div className="space-y-2">
                        {a.registryPath && (
                          <div>
                            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Registry path</div>
                            <div className="flex items-start gap-2">
                              <pre className="text-[11px] font-mono text-emerald-400 flex-1 whitespace-pre-wrap break-all bg-zinc-950 rounded p-2">{a.registryPath}</pre>
                              <Copy text={a.registryPath.split('\n')[0]} />
                            </div>
                          </div>
                        )}
                        {a.filePath && (
                          <div>
                            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">File path</div>
                            <div className="flex items-start gap-2">
                              <pre className="text-[11px] font-mono text-emerald-400 flex-1 whitespace-pre-wrap break-all bg-zinc-950 rounded p-2">{a.filePath}</pre>
                              <Copy text={a.filePath.split('\n')[0]} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attributes */}
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key fields</div>
                      <div className="space-y-1.5">
                        {a.attributes.map(attr => (
                          <div key={attr.field} className="border border-zinc-800 rounded overflow-hidden">
                            <button onClick={() => setAttrOpen(attrOpen === a.name + attr.field ? null : a.name + attr.field)}
                              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900/30 hover:bg-zinc-900 transition-colors text-left">
                              <code className="text-[11px] font-mono text-emerald-400">{attr.field}</code>
                              <span className="text-zinc-700 text-[10px]">{attrOpen === a.name + attr.field ? '▲' : '▼'}</span>
                            </button>
                            {attrOpen === a.name + attr.field && (
                              <div className="border-t border-zinc-800 px-3 py-2.5 space-y-1.5">
                                <p className="text-xs font-mono text-zinc-400">{attr.description}</p>
                                <div className="bg-amber-950/20 border border-amber-900/30 rounded px-2 py-1.5">
                                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI value: </span>
                                  <span className="text-xs font-mono text-amber-400">{attr.ciValue}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CI Relevance */}
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">CI relevance</div>
                      <p className="text-xs font-mono text-amber-400">{a.ciRelevance}</p>
                    </div>

                    {/* AXIOM notes */}
                    <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">AXIOM notes</div>
                      <p className="text-xs font-mono text-blue-400">{a.axiomNotes}</p>
                    </div>

                    {/* Parse with */}
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Parse with</div>
                      <div className="flex flex-wrap gap-1.5">
                        {a.parseWith.split(', ').map(t => (
                          <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'workflow' && (
        <div className="space-y-4">
          {axiomWorkflowNotes.map(w => (
            <div key={w.topic} className="border border-zinc-800 rounded overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                <span className="text-xs font-mono font-semibold text-zinc-300">{w.topic}</span>
              </div>
              <div className="p-4 space-y-2">
                {w.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[10px] font-mono text-zinc-600 w-5 flex-shrink-0 pt-0.5">{i + 1}</span>
                    <p className="text-xs font-mono text-zinc-400">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
