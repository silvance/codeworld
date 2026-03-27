'use client'

import { useState, useMemo } from 'react'
import {
  iosLogQueries, androidLogEntries, cloudExtractions,
  appDeepDives, locationArtifacts, commArtifacts,
  mobileIOCs, mobileAntiForensics, jtagWorkflow,
  ufedExtractionTypes, ufedWorkflow,
} from '@/lib/mobile/data'

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
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
      .catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0 px-1"
    >{copied ? '✓' : 'copy'}</button>
  )
}

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

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

const platBadge = (p: string) => {
  const cls = p === 'iOS' ? 'bg-blue-950 text-blue-400'
    : p === 'Android' ? 'bg-emerald-950 text-emerald-400'
    : 'bg-zinc-800 text-zinc-400'
  return <Badge text={p} cls={cls} />
}

// ─── 1. iOS Unified Log ───────────────────────────────────────────────────────

export function iOSUnifiedLog() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)
  const cats = ['ALL', ...Array.from(new Set(iosLogQueries.map(q => q.category)))]
  const filtered = useMemo(() => iosLogQueries.filter(q =>
    catFilter === 'ALL' || q.category === catFilter
  ), [catFilter])

  return (
    <div>
      <SH title="iOS Unified Log forensics"
        sub="sysdiagnose acquisition · app execution · network activity · security events · jailbreak indicators" />
      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3 mb-5 text-xs font-mono text-blue-400">
        Trigger sysdiagnose immediately on seizure — log buffers are volatile and overwrite. Hold Volume Up + Volume Down + Side button for 1.5s. Collect from Settings → Privacy → Analytics before rebooting.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(q => (
          <div key={q.command} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge text={q.category} cls="bg-blue-950 text-blue-400" />
              <span className="text-xs font-mono font-semibold text-zinc-100">{q.description}</span>
            </div>
            <CmdBlock cmd={q.command} />
            <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
              <span className="text-xs font-mono text-amber-400">{q.ciRelevance}</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-600">{q.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Android Logcat & Tombstones ──────────────────────────────────────────

export function AndroidLogs() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(androidLogEntries.map(e => e.category)))]
  const filtered = useMemo(() => androidLogEntries.filter(e =>
    catFilter === 'ALL' || e.category === catFilter
  ), [catFilter])

  return (
    <div>
      <SH title="Android logcat & tombstones"
        sub="Logcat buffers · crash tombstones · Dropbox events · package history · permission audit · network stats" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((e, i) => (
          <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge text={e.category} cls="bg-emerald-950 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-zinc-100">{e.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-[11px] font-mono text-zinc-500 flex-1 break-all">{e.outputLocation}</code>
            </div>
            <CmdBlock cmd={e.command} />
            <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
              <span className="text-xs font-mono text-amber-400">{e.ciRelevance}</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-600">{e.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Cloud Extraction ─────────────────────────────────────────────────────

export function CloudExtractionSection() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <SH title="Cloud extraction reference"
        sub="iCloud · Google · Samsung Cloud · WhatsApp backup — what you get, legal process, retention, and tools" />
      <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ Send preservation holds to providers BEFORE device is seized or wiped — providers auto-delete data on account closure. iCloud Advanced Data Protection (iOS 16.2+) and WhatsApp E2E backup fundamentally limit server-side collection.
      </div>
      <div className="space-y-2">
        {cloudExtractions.map(c => (
          <div key={c.provider + c.service} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === c.provider + c.service ? null : c.provider + c.service)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={c.provider} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{c.service}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === c.provider + c.service ? '▲' : '▼'}</span>
            </button>
            {open === c.provider + c.service && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">What you get</div>
                    <ul className="space-y-1">{c.whatYouGet.map((w, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{w}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">What you don't get</div>
                    <ul className="space-y-1">{c.whatYouDontGet.map((w, i) => <li key={i} className="text-xs font-mono text-red-400 flex gap-2"><span className="text-zinc-700">✗</span>{w}</li>)}</ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
                  <div><span className="text-zinc-600">Retention: </span><span className="text-zinc-300">{c.retentionPeriod}</span></div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Legal process</div>
                  <p className="text-xs font-mono text-zinc-400">{c.legalProcess}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools</div>
                  <div className="flex flex-wrap gap-1.5">{c.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}</div>
                </div>
                <p className="text-xs font-mono text-zinc-600">{c.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. App Deep Dives ───────────────────────────────────────────────────────

export function AppDeepDivesSection() {
  const [active, setActive] = useState(appDeepDives[0].app)
  const [dbIndex, setDbIndex] = useState(0)
  const app = appDeepDives.find(a => a.app === active)!

  return (
    <div>
      <SH title="App-specific deep dives"
        sub="WhatsApp · Signal · Telegram · Snapchat · Instagram — schemas, deleted recovery, encryption, server retention" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {appDeepDives.map(a => (
          <button key={a.app} onClick={() => { setActive(a.app); setDbIndex(0) }}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${active === a.app ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{a.app}</button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {platBadge(app.platform)}
            <span className="text-sm font-mono font-bold text-zinc-100">{app.app}</span>
          </div>
          <p className="text-xs font-mono text-zinc-400">{app.forensicValue}</p>
        </div>

        {app.databases.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {app.databases.map((db, i) => (
              <button key={i} onClick={() => setDbIndex(i)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${dbIndex === i ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{db.name.split(' ')[0]}</button>
            ))}
          </div>
        )}

        {(() => {
          const db = app.databases[dbIndex]
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="text-[11px] font-mono text-emerald-400 flex-1 break-all">{db.path}</code>
                <Copy text={db.path} />
              </div>
              <p className="text-xs font-mono text-zinc-500">{db.description}</p>
              <div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key tables</div>
                <div className="space-y-2">
                  {db.keyTables.map(t => (
                    <div key={t.table} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
                      <div className="font-mono text-xs font-semibold text-emerald-400 mb-1">{t.table}</div>
                      <code className="text-[11px] font-mono text-zinc-500 block mb-2 break-all">{t.columns}</code>
                      <div className="bg-amber-950/20 border border-amber-900/30 rounded px-2 py-1.5">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
                        <span className="text-xs font-mono text-amber-400">{t.ciValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Deleted message recovery</div>
            <p className="text-xs font-mono text-zinc-400">{app.deletionRecovery}</p>
          </div>
          <div className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Encryption</div>
            <p className="text-xs font-mono text-zinc-400">{app.encryptionNotes}</p>
          </div>
        </div>

        <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Server retention</div>
          <p className="text-xs font-mono text-blue-400">{app.serverSideRetention}</p>
        </div>

        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools</div>
          <div className="flex flex-wrap gap-1.5">{app.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}</div>
        </div>
      </div>
    </div>
  )
}

// ─── 5. Location Forensics ────────────────────────────────────────────────────

export function LocationForensics() {
  const [open, setOpen] = useState<string | null>(locationArtifacts[0].name)

  return (
    <div>
      <SH title="Location forensics"
        sub="iOS Significant Locations · KnowledgeC · Google Timeline · cell towers · WiFi geolocation" />
      <div className="space-y-2">
        {locationArtifacts.map(a => (
          <div key={a.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === a.name ? null : a.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                {platBadge(a.platform)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{a.name}</span>
                <Badge text={a.granularity.split(',')[0]} cls="bg-zinc-800 text-zinc-500" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === a.name ? '▲' : '▼'}</span>
            </button>
            {open === a.name && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <code className="text-[11px] font-mono text-emerald-400 flex-1 break-all whitespace-pre-wrap">{a.path}</code>
                  <Copy text={a.path.split('\n')[0]} />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs font-mono">
                  <div><span className="text-zinc-600">Granularity: </span><span className="text-zinc-300">{a.granularity}</span></div>
                  <div><span className="text-zinc-600">Retention: </span><span className="text-zinc-300">{a.retention}</span></div>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">CI: </span>
                  <span className="text-xs font-mono text-amber-400">{a.ciRelevance}</span>
                </div>
                {a.queries?.map((q, i) => (
                  <div key={i}>
                    <p className="text-xs font-mono text-zinc-500 mb-1.5">{q.description}</p>
                    <CmdBlock cmd={q.sql} />
                  </div>
                ))}
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Parse with</div>
                  <div className="flex flex-wrap gap-1.5">
                    {a.parseWith.split(', ').map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}
                  </div>
                </div>
                <p className="text-[11px] font-mono text-zinc-600">{a.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Communication Correlation ────────────────────────────────────────────

export function CommCorrelation() {
  const [active, setActive] = useState(commArtifacts[0].type)
  const art = commArtifacts.find(a => a.type === active)!

  return (
    <div>
      <SH title="Communication artifact correlation"
        sub="SMS/iMessage · call logs (iOS + Android) · iMessage identity linking — schemas, queries, cross-artifact chains" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {commArtifacts.map(a => (
          <button key={a.type} onClick={() => setActive(a.type)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${active === a.type ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {a.type.split(' (')[0]}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {platBadge(art.platform)}
          <code className="text-[11px] font-mono text-emerald-400 flex-1 break-all whitespace-pre-wrap">{art.path}</code>
          <Copy text={art.path.split('\n')[0]} />
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key fields</div>
          <div className="space-y-2">
            {art.keyFields.map(f => (
              <div key={f.field} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
                <code className="text-[11px] font-mono text-emerald-400">{f.field}</code>
                <p className="text-xs font-mono text-zinc-400 mt-1">{f.meaning}</p>
                <p className="text-xs font-mono text-amber-400 mt-1">⚑ {f.ciValue}</p>
              </div>
            ))}
          </div>
        </div>
        {art.queries?.map((q, i) => (
          <div key={i}>
            <p className="text-xs font-mono text-zinc-500 mb-1.5">{q.description}</p>
            <CmdBlock cmd={q.sql} />
          </div>
        ))}
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Correlate with</div>
          <div className="flex flex-wrap gap-1.5">
            {art.correlateWith.map(c => <Badge key={c} text={c} cls="bg-zinc-800 text-zinc-400" />)}
          </div>
        </div>
        <p className="text-[11px] font-mono text-zinc-600">{art.notes}</p>
      </div>
    </div>
  )
}

// ─── 7. Mobile Malware Indicators ────────────────────────────────────────────

export function MobileMalware() {
  const [platFilter, setPlatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(() => mobileIOCs.filter(m =>
    platFilter === 'ALL' || m.platform === platFilter
  ), [platFilter])

  return (
    <div>
      <SH title="Mobile malware & integrity indicators"
        sub="iOS jailbreak · iOS stalkerware · Android root · Android stalkerware/malicious APK — IOCs and detection" />
      <div className="flex gap-2 mb-5">
        {['ALL', 'iOS', 'Android'].map(p => (
          <button key={p} onClick={() => setPlatFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${platFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{p}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(m => (
          <div key={m.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === m.name ? null : m.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                {platBadge(m.platform)}
                <Badge text={m.category} cls="bg-red-950 text-red-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{m.name}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === m.name ? '▲' : '▼'}</span>
            </button>
            {open === m.name && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Indicators</div>
                  <ul className="space-y-1">{m.indicators.map((ind, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">→</span>{ind}</li>)}</ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Detection commands</div>
                  <CmdBlock cmd={m.detectionCommands.join('\n')} />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Forensic artifacts</div>
                  <div className="flex flex-wrap gap-1.5">{m.forensicArtifacts.map(a => <Badge key={a} text={a} cls="bg-zinc-800 text-zinc-400" />)}</div>
                </div>
                <p className="text-[11px] font-mono text-zinc-600">{m.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 8. Anti-Forensics on Mobile ─────────────────────────────────────────────

export function MobileAntiForensicsSection() {
  const [platFilter, setPlatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(() => mobileAntiForensics.filter(m =>
    platFilter === 'ALL' || m.platform === platFilter || m.platform === 'Both'
  ), [platFilter])

  return (
    <div>
      <SH title="Anti-forensics on mobile"
        sub="Factory reset artifacts · secure messaging wipe · encryption containers — residual evidence and detection" />
      <div className="flex gap-2 mb-5">
        {['ALL', 'iOS', 'Android'].map(p => (
          <button key={p} onClick={() => setPlatFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${platFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{p}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(m => (
          <div key={m.technique} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === m.technique ? null : m.technique)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                {platBadge(m.platform)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{m.technique}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === m.technique ? '▲' : '▼'}</span>
            </button>
            {open === m.technique && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <p className="text-xs font-mono text-zinc-400">{m.description}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Residual artifacts</div>
                  <ul className="space-y-1">{m.residualArtifacts.map((a, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">→</span>{a}</li>)}</ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection methods</div>
                  <ul className="space-y-1">{m.detectionMethods.map((d, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">⚑</span>{d}</li>)}</ul>
                </div>
                <p className="text-[11px] font-mono text-zinc-600">{m.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 9. JTAG / Chip-off ──────────────────────────────────────────────────────

export function JTAGWorkflow() {
  const [open, setOpen] = useState<string | null>('Pre-examination')
  const riskColor = (r: string) => {
    if (r === 'LOW') return 'bg-zinc-800 text-zinc-400'
    if (r === 'MED') return 'bg-amber-950 text-amber-400'
    if (r === 'HIGH') return 'bg-orange-950 text-orange-400'
    return 'bg-red-950 text-red-400'
  }

  return (
    <div>
      <SH title="JTAG / ISP / chip-off workflow"
        sub="Pre-examination · JTAG soldering · ISP eMMC · chip-off NAND removal · post-acquisition parsing" />
      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ JTAG and chip-off are hardware-level procedures. Errors can permanently destroy evidence. Chip-off is irreversible. Only proceed if trained and authorized. Consider sending to specialist lab (MSAB, Cellebrite Labs, Berla) for critical evidence.
      </div>
      <div className="space-y-2">
        {jtagWorkflow.map(s => (
          <div key={s.step} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === s.step ? null : s.step)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={s.risk} cls={riskColor(s.risk)} />
                <Badge text={s.phase} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.step}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === s.step ? '▲' : '▼'}</span>
            </button>
            {open === s.step && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <p className="text-xs font-mono text-zinc-400">{s.detail}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Tools required</div>
                  <div className="flex flex-wrap gap-1.5">{s.tools.map(t => <Badge key={t} text={t} cls="bg-zinc-800 text-zinc-400" />)}</div>
                </div>
                <p className="text-[11px] font-mono text-zinc-600">{s.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 10. Cellebrite / UFED Reference ─────────────────────────────────────────

export function UFEDReference() {
  const [tab, setTab] = useState<'types' | 'workflow'>('types')
  const [active, setActive] = useState(0)

  return (
    <div>
      <SH title="Cellebrite UFED reference"
        sub="Extraction types · what each produces · PA workflow · timeline analysis · SQLite direct query" />
      <div className="flex gap-2 mb-5">
        {(['types', 'workflow'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {t === 'types' ? 'Extraction types' : 'PA workflow'}
          </button>
        ))}
      </div>

      {tab === 'types' && (
        <div className="flex gap-4" style={{ minHeight: '500px' }}>
          <div className="w-44 flex-shrink-0 space-y-1">
            {ufedExtractionTypes.map((e, i) => (
              <button key={e.type} onClick={() => setActive(i)}
                className={`w-full text-left px-3 py-2.5 rounded transition-colors border-l-2 text-xs font-mono leading-tight ${active === i ? 'border-emerald-600 bg-zinc-800 text-zinc-100' : 'border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
                {e.type}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            {(() => {
              const e = ufedExtractionTypes[active]
              return (
                <>
                  <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono font-bold text-zinc-100">{e.type}</span>
                      <Badge text={e.requiresUnlock ? 'Requires unlock' : 'No unlock needed'} cls={e.requiresUnlock ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'} />
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{e.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Data access</div>
                      <ul className="space-y-1">{e.dataAccess.map((d, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{d}</li>)}</ul>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Does not access</div>
                      <ul className="space-y-1">{e.doesNotAccess.map((d, i) => <li key={i} className="text-xs font-mono text-red-400 flex gap-2"><span className="text-zinc-700">✗</span>{d}</li>)}</ul>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-zinc-400"><span className="text-zinc-600">Applicable to: </span>{e.applicableTo}</div>
                  <p className="text-[11px] font-mono text-zinc-600">{e.notes}</p>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {tab === 'workflow' && (
        <div className="space-y-2">
          {ufedWorkflow.map((s, i) => (
            <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-zinc-600 w-5 flex-shrink-0 pt-0.5">{i + 1}</span>
                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-mono font-semibold text-zinc-100">{s.step}</div>
                  <p className="text-xs font-mono text-zinc-400">{s.detail}</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] font-mono text-emerald-400 bg-zinc-950 px-2 py-1 rounded break-all">{s.cmd}</code>
                    <Copy text={s.cmd} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
