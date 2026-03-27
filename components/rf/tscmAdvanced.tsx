'use client'

import { useState, useMemo } from 'react'
import {
  threatDevices, threatActors, spectrumBaselines, tempestEntries,
  countermeasures, cellularThreats, trainingScenarios, surveyReportTemplate,
} from '@/lib/rf/data'

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

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

const sophBadge = (s: string) => {
  const map: Record<string, string> = {
    'LOW': 'bg-zinc-800 text-zinc-400',
    'MED': 'bg-amber-950 text-amber-400',
    'HIGH': 'bg-orange-950 text-orange-400',
    'NATION-STATE': 'bg-red-950 text-red-400',
  }
  return <Badge text={s} cls={map[s] ?? 'bg-zinc-800 text-zinc-400'} />
}

const diffBadge = (d: string) => {
  const map: Record<string, string> = {
    BEGINNER: 'bg-emerald-950 text-emerald-400',
    INTERMEDIATE: 'bg-blue-950 text-blue-400',
    ADVANCED: 'bg-orange-950 text-orange-400',
    EXPERT: 'bg-red-950 text-red-400',
  }
  return <Badge text={d} cls={map[d] ?? 'bg-zinc-800 text-zinc-400'} />
}

// ─── 1. Technical Device Taxonomy ─────────────────────────────────────────────

export function DeviceTaxonomy() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const [sophFilter, setSophFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const cats = ['ALL', ...Array.from(new Set(threatDevices.map(d => d.category)))]

  const filtered = useMemo(() => threatDevices.filter(d => {
    if (catFilter !== 'ALL' && d.category !== catFilter) return false
    if (sophFilter !== 'ALL' && d.sophistication !== sophFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return d.name.toLowerCase().includes(q) || d.notes.toLowerCase().includes(q)
  }), [catFilter, sophFilter, search])

  return (
    <div>
      <SH title="Technical device taxonomy" sub="Acoustic · optical · RF · carrier current · IoT — detection methods, indicators, and sophistication" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-40 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {['ALL', 'LOW', 'MED', 'HIGH', 'NATION-STATE'].map(s => (
            <button key={s} onClick={() => setSophFilter(s)}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${sophFilter === s ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map(d => (
          <div key={d.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === d.name ? null : d.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                {sophBadge(d.sophistication)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{d.name}</span>
                <Badge text={d.category} cls="bg-zinc-800 text-zinc-500" />
                {d.frequencies && <Badge text={d.frequencies} cls="bg-blue-950 text-blue-400" />}
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === d.name ? '▲' : '▼'}</span>
            </button>
            {open === d.name && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
                  <div><span className="text-zinc-600">Power: </span><span className="text-zinc-300">{d.powerSource}</span></div>
                  <div><span className="text-zinc-600">Range: </span><span className="text-zinc-300">{d.range}</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection methods</div>
                  <div className="flex flex-wrap gap-1.5">{d.detectionMethod.map(m => <Badge key={m} text={m} cls="bg-emerald-950 text-emerald-400" />)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Physical / spectral indicators</div>
                  <ul className="space-y-1">{d.indicators.map((ind, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">→</span>{ind}</li>)}</ul>
                </div>
                <p className="text-xs font-mono text-zinc-500">{d.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Threat Actor Profiles ─────────────────────────────────────────────────

export function ThreatActors() {
  const [active, setActive] = useState(threatActors[0].actor)
  const actor = threatActors.find(a => a.actor === active)!

  const catColor = (c: string) => {
    if (c === 'Nation-State')       return 'bg-red-950 text-red-400'
    if (c === 'Corporate')          return 'bg-orange-950 text-orange-400'
    if (c === 'Insider')            return 'bg-amber-950 text-amber-400'
    if (c === 'Criminal')           return 'bg-purple-950 text-purple-400'
    if (c === 'Authorized Intercept') return 'bg-blue-950 text-blue-400'
    return 'bg-zinc-800 text-zinc-400'
  }

  return (
    <div>
      <SH title="Threat actor profiles" sub="Nation-state · corporate · insider · criminal — devices, placement methods, OPSEC, and indicators" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {threatActors.map(a => (
          <button key={a.actor} onClick={() => setActive(a.actor)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${active === a.actor ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {a.category}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm font-mono font-bold text-zinc-100">{actor.actor}</span>
            <Badge text={actor.category} cls={catColor(actor.category)} />
          </div>
          <p className="text-xs font-mono text-zinc-400 mb-2">{actor.motivation}</p>
          <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Sophistication: </span>
            <span className="text-xs font-mono text-amber-400">{actor.sophistication}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Preferred devices</div>
            <ul className="space-y-1">{actor.preferredDevices.map((d, i) => <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2"><span className="text-red-700">→</span>{d}</li>)}</ul>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Placement methods</div>
            <ul className="space-y-1">{actor.placementMethods.map((m, i) => <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2"><span className="text-amber-700">→</span>{m}</li>)}</ul>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">OPSEC characteristics</div>
          <ul className="space-y-1">{actor.operationalSecurity.map((o, i) => <li key={i} className="text-xs font-mono text-zinc-400 flex gap-2"><span className="text-zinc-700">→</span>{o}</li>)}</ul>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Indicators</div>
          <ul className="space-y-1">{actor.indicators.map((ind, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">⚑</span>{ind}</li>)}</ul>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-full mb-1">Targeted environments</div>
          {actor.targetedEnvironments.map(e => <Badge key={e} text={e} cls="bg-zinc-800 text-zinc-400" />)}
        </div>
        <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
          <p className="text-xs font-mono text-blue-400">{actor.notes}</p>
        </div>
      </div>
    </div>
  )
}

// ─── 3. RF Spectrum Baseline ──────────────────────────────────────────────────

export function SpectrumBaseline() {
  const [envFilter, setEnvFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const envs = ['ALL', ...Array.from(new Set(spectrumBaselines.map(s => s.environment)))]
  const filtered = useMemo(() => spectrumBaselines.filter(s => envFilter === 'ALL' || s.environment === envFilter), [envFilter])

  return (
    <div>
      <SH title="RF spectrum baseline" sub="Expected vs anomalous signals by environment — office, military installation, industrial/ICS" />
      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3 mb-5 text-xs font-mono text-blue-400">
        Baseline must be captured before entering the space and before any sweep activity begins. Document expected signals with frequency and level — anything not in your baseline warrants investigation.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {envs.map(e => (
          <button key={e} onClick={() => setEnvFilter(e)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${envFilter === e ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{e}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.band + s.environment} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === s.band + s.environment ? null : s.band + s.environment)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={s.environment} cls="bg-zinc-800 text-zinc-500" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.band}</span>
                <Badge text={s.freqRange} cls="bg-emerald-950 text-emerald-400" />
                <span className="text-[10px] font-mono text-zinc-600">floor: {s.noiseFloor}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === s.band + s.environment ? '▲' : '▼'}</span>
            </button>
            {open === s.band + s.environment && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Expected (baseline)</div>
                    <ul className="space-y-1">{s.expectedSignals.map((sig, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{sig}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Anomalous — investigate</div>
                    <ul className="space-y-1">{s.anomalousSignals.map((sig, i) => <li key={i} className="text-xs font-mono text-red-400 flex gap-2"><span className="text-zinc-700">⚠</span>{sig}</li>)}</ul>
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-500">{s.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. TEMPEST / Emanations ──────────────────────────────────────────────────

export function TempestRef() {
  const [open, setOpen] = useState<string | null>(tempestEntries[0].threat)

  return (
    <div>
      <SH title="TEMPEST / emanations reference" sub="Van Eck · keyboard · network cable · powerline · acoustic · RF covert channels — mechanisms and countermeasures" />
      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ TEMPEST information is controlled. Active exploitation of these techniques against US government systems is a federal crime. This reference is for defensive awareness only.
      </div>
      <div className="space-y-2">
        {tempestEntries.map(e => (
          <div key={e.threat} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === e.threat ? null : e.threat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={e.category} cls="bg-purple-950 text-purple-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{e.threat}</span>
                <Badge text={e.frequencies} cls="bg-blue-950 text-blue-400" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === e.threat ? '▲' : '▼'}</span>
            </button>
            {open === e.threat && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
                  <div><span className="text-zinc-600">Range: </span><span className="text-zinc-300">{e.range}</span></div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Mechanism</div>
                  <p className="text-xs font-mono text-zinc-400">{e.mechanism}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Countermeasures</div>
                  <ul className="space-y-1">{e.countermeasures.map((cm, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{cm}</li>)}</ul>
                </div>
                {e.standards.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-full mb-1">Standards</div>
                    {e.standards.map(s => <Badge key={s} text={s} cls="bg-zinc-800 text-zinc-500" />)}
                  </div>
                )}
                <p className="text-xs font-mono text-zinc-500">{e.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 5. Cellular Threat Analysis ─────────────────────────────────────────────

export function CellularThreats() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <SH title="Cellular threat analysis" sub="IMSI catchers · rogue base stations · carrier current · GSM/LTE bugs — detection, legal notes, and countermeasures" />
      <div className="bg-amber-950/20 border border-amber-900/40 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ Cellular jamming is a federal crime in the US (47 USC 333) with no legal exception for facility security. Detection and passive countermeasures only.
      </div>
      <div className="space-y-2">
        {cellularThreats.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === t.name ? null : t.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={t.category} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <Badge text={t.frequencies} cls="bg-emerald-950 text-emerald-400" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === t.name ? '▲' : '▼'}</span>
            </button>
            {open === t.name && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Mechanism</div>
                  <p className="text-xs font-mono text-zinc-400">{t.mechanism}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection indicators</div>
                  <ul className="space-y-1">{t.detectionIndicators.map((d, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">→</span>{d}</li>)}</ul>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detect with</div>
                    <div className="flex flex-wrap gap-1.5">{t.detectWith.map(d => <Badge key={d} text={d} cls="bg-zinc-800 text-zinc-400" />)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Countermeasures</div>
                    <ul className="space-y-1">{t.countermeasures.map((cm, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{cm}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-red-950/20 border border-red-900/30 rounded px-3 py-2">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Legal: </span>
                  <span className="text-xs font-mono text-red-400">{t.legality}</span>
                </div>
                <p className="text-xs font-mono text-zinc-500">{t.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Countermeasures Reference ────────────────────────────────────────────

export function Countermeasures() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const cats = ['ALL', ...Array.from(new Set(countermeasures.map(c => c.category)))]
  const filtered = useMemo(() => countermeasures.filter(c => catFilter === 'ALL' || c.category === catFilter), [catFilter])

  return (
    <div>
      <SH title="Countermeasures reference" sub="White noise · RF shielding · TSCM sweeps · device control · power filtering — what works against what" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(cm => (
          <div key={cm.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === cm.name ? null : cm.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={cm.category} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{cm.name}</span>
                <Badge text={cm.cost} cls="bg-zinc-800 text-zinc-500" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === cm.name ? '▲' : '▼'}</span>
            </button>
            {open === cm.name && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Effective against</div>
                    <ul className="space-y-1">{cm.effectiveAgainst.map((e, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{e}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Ineffective against</div>
                    <ul className="space-y-1">{cm.ineffectiveAgainst.map((e, i) => <li key={i} className="text-xs font-mono text-red-400 flex gap-2"><span className="text-zinc-700">✗</span>{e}</li>)}</ul>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Implementation</div>
                  <p className="text-xs font-mono text-zinc-400">{cm.implementation}</p>
                </div>
                <p className="text-xs font-mono text-zinc-500">{cm.limitations}</p>
                {cm.legalNotes && (
                  <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Legal: </span>
                    <span className="text-xs font-mono text-amber-400">{cm.legalNotes}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 7. Training Scenario Builder ────────────────────────────────────────────

export function TrainingScenarios() {
  const [active, setActive] = useState(trainingScenarios[0].id)
  const [view, setView] = useState<'setup' | 'devices' | 'debrief'>('setup')
  const scen = trainingScenarios.find(s => s.id === active)!

  return (
    <div>
      <SH title="Training scenario builder" sub="5 layered scenarios from beginner to expert — equipment, planted devices, red herrings, pass/fail conditions, debrief points" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {trainingScenarios.map(s => (
          <button key={s.id} onClick={() => { setActive(s.id); setView('setup') }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded transition-colors ${active === s.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {s.id} {diffBadge(s.difficulty)}
          </button>
        ))}
      </div>

      <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20 mb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {diffBadge(scen.difficulty)}
          <span className="text-sm font-mono font-bold text-zinc-100">{scen.name}</span>
        </div>
        <p className="text-xs font-mono text-zinc-400 mb-2">{scen.objective}</p>
        <div className="flex flex-wrap gap-3 text-xs font-mono">
          <span className="text-zinc-600">Time: <span className="text-zinc-300">{scen.timeRequired}</span></span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['setup', 'devices', 'debrief'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${view === v ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {v === 'setup' ? 'Setup & equipment' : v === 'devices' ? 'Planted devices & red herrings' : 'Debrief guide'}
          </button>
        ))}
      </div>

      {view === 'setup' && (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Required equipment</div>
            <div className="flex flex-wrap gap-1.5">{scen.equipment.map(e => <Badge key={e} text={e} cls="bg-zinc-800 text-zinc-400" />)}</div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Pass conditions</div>
              <ul className="space-y-1">{scen.passConditions.map((p, i) => <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{p}</li>)}</ul>
            </div>
            <div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Fail conditions</div>
              <ul className="space-y-1">{scen.failConditions.map((f, i) => <li key={i} className="text-xs font-mono text-red-400 flex gap-2"><span className="text-zinc-700">✗</span>{f}</li>)}</ul>
            </div>
          </div>
          <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Instructor notes</div>
            <p className="text-xs font-mono text-blue-400">{scen.instructorNotes}</p>
          </div>
        </div>
      )}

      {view === 'devices' && (
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Planted devices</div>
            <div className="space-y-2">
              {scen.planted.map((d, i) => (
                <div key={i} className="border border-amber-900/40 bg-amber-950/10 rounded p-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono font-bold text-zinc-600">{i + 1}</span>
                    <span className="text-xs font-mono font-semibold text-zinc-100">{d.device}</span>
                    <Badge text={d.difficulty} cls="bg-zinc-800 text-zinc-500" />
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mb-1"><span className="text-zinc-600">Location: </span>{d.location}</p>
                  <p className="text-xs font-mono text-emerald-400"><span className="text-zinc-600">Detection: </span>{d.detectionMethod}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Red herrings</div>
            <ul className="space-y-1">{scen.redHerrings.map((r, i) => <li key={i} className="text-xs font-mono text-zinc-400 flex gap-2"><span className="text-zinc-700">~</span>{r}</li>)}</ul>
          </div>
        </div>
      )}

      {view === 'debrief' && (
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Debrief discussion points</div>
          <div className="space-y-2">
            {scen.debriefPoints.map((p, i) => (
              <div key={i} className="flex gap-2 border border-zinc-800 rounded px-3 py-2 bg-zinc-900/20">
                <span className="text-xs font-mono font-bold text-zinc-600 flex-shrink-0">{i + 1}.</span>
                <p className="text-xs font-mono text-zinc-300">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 8. Survey Report Template ────────────────────────────────────────────────

export function SurveyReport() {
  const tmpl = surveyReportTemplate
  const [activeSection, setActiveSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [findings, setFindings] = useState<{ id: number; data: Record<string, string> }[]>([])
  const [findingCount, setFindingCount] = useState(1)

  const update = (key: string, val: string) => setFormData(prev => ({ ...prev, [key]: val }))

  const addFinding = () => {
    setFindings(prev => [...prev, { id: findingCount, data: {} }])
    setFindingCount(n => n + 1)
  }

  const updateFinding = (id: number, key: string, val: string) =>
    setFindings(prev => prev.map(f => f.id === id ? { ...f, data: { ...f.data, [key]: val } } : f))

  const exportReport = () => {
    const lines: string[] = [
      'TSCM SURVEY REPORT', '═'.repeat(60), '',
      ...tmpl.reportFields.flatMap(sec => [
        `── ${sec.section} ──`,
        ...sec.fields.map(f => `${f.name}: ${formData[f.name] ?? ''}`),
        '',
      ]),
      '── Findings ──',
      ...findings.flatMap(f => [
        `Finding F-${String(f.id).padStart(3, '0')}:`,
        ...tmpl.reportFields.find(s => s.section === 'Findings')!.fields.map(
          field => `  ${field.name}: ${f.data[field.name] ?? ''}`
        ), '',
      ]),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `TSCM_Report_${formData['Case Number'] ?? 'draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sections = tmpl.reportFields

  return (
    <div>
      <SH title="Survey report template" sub="Structured sweep documentation — case info, equipment, baseline, zones, findings, conclusions" />
      <div className="bg-amber-950/20 border border-amber-900/40 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ This tool generates unclassified report templates. Do not enter classified information into this interface. For classified sweeps, use appropriate classified systems per your facility's SSP.
      </div>

      {/* Risk level reference */}
      <div className="border border-zinc-800 rounded mb-5 overflow-hidden">
        <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Finding risk levels</span>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {tmpl.riskLevels.map(r => (
            <div key={r.level} className="px-4 py-2.5 flex items-start gap-3">
              <Badge text={r.level} cls={
                r.level === 'CRITICAL' ? 'bg-red-950 text-red-400 flex-shrink-0' :
                r.level === 'HIGH' ? 'bg-orange-950 text-orange-400 flex-shrink-0' :
                r.level === 'MEDIUM' ? 'bg-amber-950 text-amber-400 flex-shrink-0' :
                r.level === 'LOW' ? 'bg-zinc-800 text-zinc-400 flex-shrink-0' :
                'bg-emerald-950 text-emerald-400 flex-shrink-0'
              } />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-zinc-400">{r.description}</p>
                <p className="text-[11px] font-mono text-zinc-600 mt-0.5">{r.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section nav */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {sections.map((sec, i) => (
          <button key={sec.section} onClick={() => setActiveSection(i)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${activeSection === i ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {sec.section}
          </button>
        ))}
        <button onClick={() => setActiveSection(sections.length)}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${activeSection === sections.length ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
          Findings log
        </button>
      </div>

      {/* Regular section fields */}
      {activeSection < sections.length && (
        <div className="space-y-3 border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="text-xs font-mono font-semibold text-zinc-400 mb-3">{sections[activeSection].section}</div>
          {sections[activeSection].fields.map(field => (
            <div key={field.name}>
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1 block">{field.name}</label>
              {field.type === 'textarea' ? (
                <textarea rows={3}
                  value={formData[field.name] ?? ''}
                  onChange={e => update(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full resize-none ${inputCls}`} />
              ) : field.type === 'select' ? (
                <select value={formData[field.name] ?? ''}
                  onChange={e => update(field.name, e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none">
                  <option value="">— select —</option>
                  {field.name === 'Classification' && ['UNCLASSIFIED', 'CUI', 'CONFIDENTIAL', 'SECRET'].map(o => <option key={o} value={o}>{o}</option>)}
                  {field.name === 'Risk Level' && tmpl.riskLevels.map(r => <option key={r.level} value={r.level}>{r.level}</option>)}
                  {field.name === 'Finding Category' && tmpl.findingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input type={field.type}
                  value={formData[field.name] ?? ''}
                  onChange={e => update(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full ${inputCls}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Findings log */}
      {activeSection === sections.length && (
        <div className="space-y-4">
          {findings.map(finding => (
            <div key={finding.id} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="text-xs font-mono font-semibold text-zinc-400 mb-3">Finding F-{String(finding.id).padStart(3, '0')}</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sections.find(s => s.section === 'Findings')!.fields.map(field => (
                  <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1 block">{field.name}</label>
                    {field.type === 'textarea' ? (
                      <textarea rows={2}
                        value={finding.data[field.name] ?? ''}
                        onChange={e => updateFinding(finding.id, field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full resize-none ${inputCls}`} />
                    ) : field.type === 'select' ? (
                      <select value={finding.data[field.name] ?? ''}
                        onChange={e => updateFinding(finding.id, field.name, e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none">
                        <option value="">— select —</option>
                        {field.name === 'Risk Level' && tmpl.riskLevels.map(r => <option key={r.level} value={r.level}>{r.level}</option>)}
                        {field.name === 'Finding Category' && tmpl.findingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input type="text"
                        value={finding.data[field.name] ?? ''}
                        onChange={e => updateFinding(finding.id, field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full ${inputCls}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addFinding}
            className="w-full border border-dashed border-zinc-700 rounded py-2.5 text-xs font-mono text-zinc-600 hover:text-zinc-300 hover:border-zinc-500 transition-colors">
            + Add finding
          </button>
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button onClick={exportReport}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-mono rounded transition-colors">
          Export report (.txt)
        </button>
      </div>
    </div>
  )
}
