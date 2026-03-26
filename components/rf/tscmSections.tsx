'use client'

import { useState, useMemo } from 'react'
import {
  sdrDevices, sweepMethodology, physicalIndicators, modulations,
  counterSurvIndicators, bugFrequencies, tscmTools, antennaTypes, linkBudgetFormulas,
} from '@/lib/rf/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-6">
    <h2 className="text-base font-mono font-semibold text-zinc-100">{title}</h2>
    <p className="text-xs text-zinc-500 mt-1">{sub}</p>
  </div>
)

const Badge = ({ text, cls }: { text: string; cls: string }) => (
  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
)

const riskBadge = (level: 'CRITICAL' | 'HIGH' | 'MED') => {
  const map = {
    CRITICAL: 'bg-red-950 text-red-400',
    HIGH: 'bg-orange-950 text-orange-400',
    MED: 'bg-yellow-950 text-yellow-400',
  }
  return <Badge text={level} cls={map[level]} />
}

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

// ─── SDR Quick Reference ─────────────────────────────────────────────────────

export function SDRReference() {
  const [open, setOpen] = useState<string | null>('TinySA Ultra')

  return (
    <div>
      <SectionHeader title="SDR quick reference" sub="HackRF, RTL-SDR, SDRplay, TinySA, Flipper — frequency ranges, sample rates, and TSCM use cases" />
      <div className="space-y-2">
        {sdrDevices.map(d => (
          <div key={d.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === d.name ? null : d.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{d.name}</span>
                <Badge text={d.type} cls="bg-blue-950 text-blue-400" />
                {d.txCapable && <Badge text="TX capable" cls="bg-amber-950 text-amber-400" />}
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === d.name ? '▲' : '▼'}</span>
            </button>
            {open === d.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
                  <div><div className="text-zinc-600 mb-1">Freq range</div><div className="text-emerald-400">{d.freqRange}</div></div>
                  <div><div className="text-zinc-600 mb-1">Sample rate</div><div className="text-zinc-300">{d.sampleRate}</div></div>
                  <div><div className="text-zinc-600 mb-1">Dynamic range</div><div className="text-zinc-300">{d.dynamicRange}</div></div>
                  <div><div className="text-zinc-600 mb-1">TX</div><div className={d.txCapable ? 'text-amber-400' : 'text-zinc-600'}>{d.txCapable ? 'Yes' : 'No'}</div></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">General use</div>
                    <ul className="space-y-1">{d.primaryUse.map((u, i) => <li key={i} className="text-[11px] font-mono text-zinc-400 flex gap-2"><span className="text-zinc-700">→</span>{u}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">TSCM use</div>
                    <ul className="space-y-1">{d.tscmUse.map((u, i) => <li key={i} className="text-[11px] font-mono text-emerald-500 flex gap-2"><span className="text-zinc-700">→</span>{u}</li>)}</ul>
                  </div>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">{d.notes}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Software</div>
                  <div className="flex flex-wrap gap-1.5">{d.software.map(s => <Badge key={s} text={s} cls="bg-zinc-800 text-zinc-400" />)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sweep Methodology ────────────────────────────────────────────────────────

export function SweepMethodology() {
  const [open, setOpen] = useState<string | null>(sweepMethodology[0].step)
  const phases = [...new Set(sweepMethodology.map(s => s.phase))]
  const [phaseFilter, setPhaseFilter] = useState('All')

  const filtered = sweepMethodology.filter(s => phaseFilter === 'All' || s.phase === phaseFilter)

  return (
    <div>
      <SectionHeader title="Sweep methodology" sub="Systematic RF survey workflow from pre-sweep baseline through post-sweep documentation" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {['All', ...phases].map(p => (
          <button key={p} onClick={() => setPhaseFilter(p)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              phaseFilter === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((step, i) => (
          <div key={step.step} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === step.step ? null : step.step)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-bold text-zinc-600 w-5">{i + 1}</span>
                <Badge text={step.phase} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono text-zinc-100">{step.step}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === step.step ? '▲' : '▼'}</span>
            </button>
            {open === step.step && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <ul className="space-y-2">
                  {step.actions.map((a, j) => (
                    <li key={j} className="text-xs font-mono text-zinc-300 flex gap-2">
                      <span className="text-emerald-700 flex-shrink-0">✓</span>{a}
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-950/20 border border-amber-900/40 rounded p-3">
                  <p className="text-[11px] font-mono text-amber-400">{step.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Physical Indicators ─────────────────────────────────────────────────────

export function PhysicalIndicators() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MED'>('ALL')

  const cats = ['ALL', ...Array.from(new Set(physicalIndicators.map(p => p.category)))]

  const filtered = useMemo(() => physicalIndicators.filter(p => {
    if (catFilter !== 'ALL' && p.category !== catFilter) return false
    if (riskFilter !== 'ALL' && p.riskLevel !== riskFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return p.indicator.toLowerCase().includes(q) || p.detail.toLowerCase().includes(q)
  }), [search, catFilter, riskFilter])

  return (
    <div>
      <SectionHeader title="Covert device physical indicators" sub="Physical tells — paint, screws, weight, wiring, surface anomalies" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search indicators..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {(['ALL', 'CRITICAL', 'HIGH', 'MED'] as const).map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                riskFilter === r
                  ? r === 'ALL' ? 'bg-zinc-700 text-zinc-200'
                    : r === 'CRITICAL' ? 'bg-red-950 text-red-400'
                    : r === 'HIGH' ? 'bg-orange-950 text-orange-400'
                    : 'bg-yellow-950 text-yellow-400'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.indicator} className={`border rounded p-4 ${
            p.riskLevel === 'CRITICAL' ? 'border-red-900 bg-red-950/10' :
            p.riskLevel === 'HIGH' ? 'border-orange-900 bg-orange-950/10' :
            'border-zinc-800 bg-zinc-900/20'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {riskBadge(p.riskLevel)}
                <span className="text-xs font-mono font-semibold text-zinc-100">{p.indicator}</span>
              </div>
              <Badge text={p.category} cls="bg-zinc-800 text-zinc-500" />
            </div>
            <p className="text-xs font-mono text-zinc-400 mb-2">{p.detail}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.locations.map(l => <Badge key={l} text={l} cls="bg-zinc-900 text-zinc-600" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Modulation Reference ─────────────────────────────────────────────────────

export function ModulationRef() {
  const [open, setOpen] = useState<string | null>('FM / NFM')

  return (
    <div>
      <SectionHeader title="Modulation reference" sub="AM, FM/NFM, SSB, FHSS, OFDM, DSSS, OOK — visual and audio signatures on spectrum" />
      <div className="space-y-2">
        {modulations.map(m => (
          <div key={m.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === m.name ? null : m.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono font-bold text-emerald-400 w-16">{m.name}</span>
                <span className="text-xs font-mono text-zinc-400">{m.fullName}</span>
                <Badge text={m.bandwidthTypical} cls="bg-zinc-800 text-zinc-500" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === m.name ? '▲' : '▼'}</span>
            </button>
            {open === m.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Spectrum visual</div>
                    <p className="text-[11px] font-mono text-blue-400">{m.visualSignature}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Audio when demodulated</div>
                    <p className="text-[11px] font-mono text-amber-400">{m.audioSignature}</p>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Common uses</div>
                  <div className="flex flex-wrap gap-1.5">{m.commonUses.map(u => <Badge key={u} text={u} cls="bg-zinc-800 text-zinc-400" />)}</div>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">TSCM relevance</div>
                  <p className="text-[11px] font-mono text-zinc-300">{m.tscmRelevance}</p>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded p-3">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Detection tips</div>
                  <p className="text-[11px] font-mono text-emerald-400">{m.detectionTips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Counter-Surveillance Indicators ─────────────────────────────────────────

export function CounterSurv() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MED'>('ALL')

  const cats = ['ALL', ...Array.from(new Set(counterSurvIndicators.map(c => c.category)))]

  const filtered = useMemo(() => counterSurvIndicators.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false
    if (riskFilter !== 'ALL' && c.riskLevel !== riskFilter) return false
    return true
  }), [catFilter, riskFilter])

  return (
    <div>
      <SectionHeader title="Counter-surveillance indicators" sub="Foot surveillance, vehicle surveillance, technical surveillance, and physical access indicators" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {(['ALL', 'CRITICAL', 'HIGH', 'MED'] as const).map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                riskFilter === r
                  ? r === 'ALL' ? 'bg-zinc-700 text-zinc-200'
                    : r === 'CRITICAL' ? 'bg-red-950 text-red-400'
                    : r === 'HIGH' ? 'bg-orange-950 text-orange-400'
                    : 'bg-yellow-950 text-yellow-400'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{r}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.indicator} className={`border rounded p-4 ${
            c.riskLevel === 'CRITICAL' ? 'border-red-900 bg-red-950/10' :
            c.riskLevel === 'HIGH' ? 'border-orange-900 bg-orange-950/10' :
            'border-zinc-800 bg-zinc-900/20'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {riskBadge(c.riskLevel)}
                <span className="text-xs font-mono font-semibold text-zinc-100">{c.indicator}</span>
              </div>
              <Badge text={c.category} cls="bg-zinc-800 text-zinc-500" />
            </div>
            <p className="text-xs font-mono text-zinc-400 mb-2">{c.detail}</p>
            <div className="bg-blue-950/20 border border-blue-900/30 rounded p-2">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Action: </span>
              <span className="text-[11px] font-mono text-blue-400">{c.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Bug Frequencies ──────────────────────────────────────────────────────────

export function BugFrequencies() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('ALL')

  const cats = ['ALL', 'Audio', 'Video', 'Tracking']

  const filtered = useMemo(() => bugFrequencies.filter(b => {
    if (catFilter !== 'ALL' && !b.category.startsWith(catFilter)) return false
    if (!search) return true
    const q = search.toLowerCase()
    return b.category.toLowerCase().includes(q) || b.freqRange.toLowerCase().includes(q) || b.notes.toLowerCase().includes(q)
  }), [search, catFilter])

  return (
    <div>
      <SectionHeader title="Common bug frequencies" sub="Audio, video, GSM, FHSS, and cellular — frequencies, modulation, range, and detection" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <input placeholder="Search frequency, category..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <div className="flex gap-1">
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                catFilter === c ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.category} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <span className="text-xs font-mono font-semibold text-zinc-200">{b.category}</span>
              <Badge text={b.modulation} cls="bg-blue-950 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-[11px] font-mono mb-3">
              <div><span className="text-zinc-600">Freq: </span><span className="text-emerald-400">{b.freqRange}</span></div>
              <div><span className="text-zinc-600">Power: </span><span className="text-zinc-300">{b.powerTypical}</span></div>
              <div><span className="text-zinc-600">Range: </span><span className="text-zinc-300">{b.rangeTypical}</span></div>
              <div><span className="text-zinc-600">Activation: </span><span className="text-amber-400">{b.activationType}</span></div>
            </div>
            <p className="text-[11px] font-mono text-zinc-500">{b.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TSCM Tool Reference ──────────────────────────────────────────────────────

export function TSCMToolRef() {
  const [open, setOpen] = useState<string | null>('TinySA Ultra')
  const [catFilter, setCatFilter] = useState('ALL')

  const cats = ['ALL', ...Array.from(new Set(tscmTools.map(t => t.category)))]

  const filtered = tscmTools.filter(t => catFilter === 'ALL' || t.category === catFilter)

  return (
    <div>
      <SectionHeader title="TSCM tool reference" sub="TinySA, HackRF, OSCOR, REI TALAN, NLJD, Fluke, nRF Sniffer — what each does and when to use it" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{c}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(t => (
          <div key={t.name} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === t.name ? null : t.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                <Badge text={t.category} cls="bg-blue-950 text-blue-400" />
                <span className="text-xs font-mono text-zinc-500">{t.approxCost}</span>
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === t.name ? '▲' : '▼'}</span>
            </button>
            {open === t.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-3">
                <div className="text-xs font-mono">
                  <span className="text-zinc-600">Manufacturer: </span>
                  <span className="text-zinc-300">{t.manufacturer}</span>
                  {t.freqRange && <><span className="text-zinc-600 ml-4">Freq: </span><span className="text-emerald-400">{t.freqRange}</span></>}
                </div>
                <p className="text-xs font-mono text-zinc-300">{t.primaryFunction}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Key features</div>
                    <ul className="space-y-1">{t.keyFeatures.map((f, i) => <li key={i} className="text-[11px] font-mono text-emerald-400 flex gap-2"><span className="text-zinc-700">✓</span>{f}</li>)}</ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Limitations</div>
                    <ul className="space-y-1">{t.limitations.map((l, i) => <li key={i} className="text-[11px] font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">!</span>{l}</li>)}</ul>
                  </div>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">TSCM role</div>
                  <p className="text-[11px] font-mono text-blue-400">{t.tscmRole}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Antenna + Link Budget ────────────────────────────────────────────────────

export function AntennaLinkBudget() {
  const [tab, setTab] = useState<'antennas' | 'formulas'>('antennas')

  return (
    <div>
      <SectionHeader title="Antenna & link budget reference" sub="Antenna types, gain, patterns — plus field-usable FSPL, EIRP, and range formulas" />
      <div className="flex gap-2 mb-5">
        {(['antennas', 'formulas'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{t === 'antennas' ? 'Antenna types' : 'Link budget formulas'}</button>
        ))}
      </div>

      {tab === 'antennas' && (
        <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
          <table className="w-full text-xs font-mono min-w-[600px]">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Antenna</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal w-24">Gain</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal w-32">Pattern</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Best for</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal hidden md:table-cell">Freq range</th>
              </tr>
            </thead>
            <tbody>
              {antennaTypes.map((a, i) => (
                <tr key={a.name} className={`border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-900/20'}`} title={a.notes}>
                  <td className="px-3 py-2 text-zinc-200 font-semibold">{a.name}</td>
                  <td className="px-3 py-2 text-emerald-400">{a.gainTypical}</td>
                  <td className="px-3 py-2 text-zinc-400">{a.pattern}</td>
                  <td className="px-3 py-2 text-zinc-400">{a.bestFor}</td>
                  <td className="px-3 py-2 text-zinc-600 hidden md:table-cell">{a.freqRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 bg-zinc-900/30 text-[10px] font-mono text-zinc-600">Hover rows for additional notes on each antenna type</div>
        </div>
      )}

      {tab === 'formulas' && (
        <div className="space-y-3">
          {linkBudgetFormulas.map(f => (
            <div key={f.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
              <div className="text-xs font-mono font-semibold text-zinc-200 mb-2">{f.name}</div>
              <div className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 mb-2">
                <code className="text-sm font-mono text-emerald-400">{f.formula}</code>
              </div>
              {f.variables && <p className="text-[11px] font-mono text-zinc-500 mb-2">{f.variables}</p>}
              <div className="bg-blue-950/20 border border-blue-900/30 rounded px-3 py-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Example: </span>
                <span className="text-[11px] font-mono text-blue-400">{f.example}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
