'use client'

import { useState, useMemo } from 'react'
import {
  freqReference, tscmDevices, wifi24Channels, wifi5Channels, bleChannels,
  rogueAPIndicators, rogueAPTools,
} from '@/lib/rf/data'

// ─── Shared primitives ───────────────────────────────────────────────────────

const badge = (text: string, color: string) => (
  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${color}`}>
    {text}
  </span>
)

const riskBadge = (level: 'HIGH' | 'MED' | 'LOW' | 'CRITICAL') => {
  const map = {
    CRITICAL: 'bg-red-950 text-red-400',
    HIGH:     'bg-orange-950 text-orange-400',
    MED:      'bg-yellow-950 text-yellow-400',
    LOW:      'bg-zinc-800 text-zinc-400',
  }
  return badge(level, map[level])
}

const SectionHeader = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-6">
    <h2 className="text-base font-mono font-semibold text-zinc-100">{title}</h2>
    <p className="text-xs text-zinc-500 mt-1">{sub}</p>
  </div>
)

// ─── 1. Frequency Reference ──────────────────────────────────────────────────

export function FreqReference() {
  const [search, setSearch] = useState('')
  const [showThreat, setShowThreat] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return freqReference.map(cat => ({
      ...cat,
      bands: cat.bands.filter(b => {
        if (showThreat && !b.threat) return false
        if (!q) return true
        return (
          b.name.toLowerCase().includes(q) ||
          b.notes.toLowerCase().includes(q) ||
          b.start.toLowerCase().includes(q) ||
          b.end.toLowerCase().includes(q)
        )
      }),
    })).filter(cat => cat.bands.length > 0)
  }, [search, showThreat])

  return (
    <div>
      <SectionHeader
        title="Frequency reference"
        sub="ISM, cellular, government, amateur — with TSCM threat flags"
      />

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search frequency, name, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={() => setShowThreat(t => !t)}
          className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
            showThreat
              ? 'bg-orange-950 border-orange-800 text-orange-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ⚠ threats only
        </button>
      </div>

      <div className="space-y-6">
        {filtered.map(cat => (
          <div key={cat.category}>
            <div className="text-[10px] font-mono font-semibold text-zinc-600 uppercase tracking-widest mb-2">
              {cat.category}
            </div>
            <div className="border border-zinc-800 rounded overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900">
                    <th className="text-left px-3 py-2 text-zinc-500 font-normal w-40">Name</th>
                    <th className="text-left px-3 py-2 text-zinc-500 font-normal w-28">Start</th>
                    <th className="text-left px-3 py-2 text-zinc-500 font-normal w-28">End</th>
                    <th className="text-left px-3 py-2 text-zinc-500 font-normal">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.bands.map((b, i) => (
                    <tr
                      key={b.name}
                      className={`border-b border-zinc-800/50 last:border-0 ${
                        b.threat ? 'bg-orange-950/10' : i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/30'
                      }`}
                    >
                      <td className="px-3 py-2 text-zinc-200 flex items-center gap-2">
                        {b.threat && <span className="text-orange-500 text-[10px]">⚠</span>}
                        {b.name}
                      </td>
                      <td className="px-3 py-2 text-emerald-400">{b.start}</td>
                      <td className="px-3 py-2 text-emerald-400">{b.end}</td>
                      <td className="px-3 py-2 text-zinc-400">{b.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Free-Space Path Loss Calculator ─────────────────────────────────────

export function PathLossCalc() {
  const [freqMHz, setFreqMHz] = useState('2437')
  const [distM,   setDistM]   = useState('10')
  const [txPower, setTxPower] = useState('20')
  const [txGain,  setTxGain]  = useState('2')
  const [rxGain,  setRxGain]  = useState('2')
  const [cableLoss, setCableLoss] = useState('0')

  const results = useMemo(() => {
    const f = parseFloat(freqMHz)
    const d = parseFloat(distM)
    if (!f || !d || f <= 0 || d <= 0) return null

    const fspl = 20 * Math.log10(d) + 20 * Math.log10(f * 1e6) - 147.55
    const eirp = parseFloat(txPower) + parseFloat(txGain) - parseFloat(cableLoss)
    const rxPower = eirp - fspl + parseFloat(rxGain)

    return {
      fspl:    fspl.toFixed(2),
      eirp:    eirp.toFixed(2),
      rxPower: rxPower.toFixed(2),
      rxPowerMw: (Math.pow(10, rxPower / 10) / 1000).toExponential(2),
    }
  }, [freqMHz, distM, txPower, txGain, rxGain, cableLoss])

  const inputCls = 'w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500'
  const labelCls = 'text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1 block'

  const presets = [
    { label: 'BLE adv',     freq: '2402', dist: '5'   },
    { label: 'WiFi 2.4 ch6',freq: '2437', dist: '10'  },
    { label: 'WiFi 5 ch149',freq: '5745', dist: '10'  },
    { label: '433 MHz ISM', freq: '433',  dist: '100' },
    { label: '900 MHz ISM', freq: '915',  dist: '50'  },
    { label: 'GPS L1',      freq: '1575', dist: '20200000' },
  ]

  return (
    <div>
      <SectionHeader
        title="Free-space path loss"
        sub="FSPL = 20·log₁₀(d) + 20·log₁₀(f) − 147.55  |  distances in meters, frequency in MHz"
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-5">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => { setFreqMHz(p.freq); setDistM(p.dist) }}
            className="px-2.5 py-1 text-[10px] font-mono bg-zinc-900 border border-zinc-700 rounded text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3">
        <div>
          <label className={labelCls}>Frequency (MHz)</label>
          <input className={inputCls} value={freqMHz} onChange={e => setFreqMHz(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Distance (m)</label>
          <input className={inputCls} value={distM} onChange={e => setDistM(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>TX Power (dBm)</label>
          <input className={inputCls} value={txPower} onChange={e => setTxPower(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>TX Antenna Gain (dBi)</label>
          <input className={inputCls} value={txGain} onChange={e => setTxGain(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>RX Antenna Gain (dBi)</label>
          <input className={inputCls} value={rxGain} onChange={e => setRxGain(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Cable Loss (dB)</label>
          <input className={inputCls} value={cableLoss} onChange={e => setCableLoss(e.target.value)} />
        </div>
      </div>

      {results ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'FSPL',      value: `${results.fspl} dB`,    color: 'text-amber-400' },
            { label: 'EIRP',      value: `${results.eirp} dBm`,   color: 'text-blue-400'  },
            { label: 'RX Power',  value: `${results.rxPower} dBm`,color: parseFloat(results.rxPower) > -80 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'RX (mW)',   value: results.rxPowerMw,        color: 'text-zinc-300'  },
          ].map(r => (
            <div key={r.label} className="bg-zinc-900 border border-zinc-800 rounded p-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{r.label}</div>
              <div className={`text-xl font-mono font-semibold ${r.color}`}>{r.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4 text-xs font-mono text-zinc-600">
          Enter valid frequency and distance to calculate
        </div>
      )}

      <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded p-3 text-[11px] font-mono text-zinc-500 space-y-1">
        <div>EIRP = TX Power + TX Antenna Gain − Cable Loss</div>
        <div>Received Power = EIRP − FSPL + RX Antenna Gain</div>
        <div>Typical sensitivity: WiFi −80 dBm · BLE −93 dBm · GSM −100 dBm</div>
      </div>
    </div>
  )
}

// ─── 3. Channel Maps ─────────────────────────────────────────────────────────

export function ChannelMaps() {
  const [tab, setTab] = useState<'24' | '5' | 'ble'>('24')
  const [hover24, setHover24] = useState<number | null>(null)

  const nonOverlapping = [1, 6, 11]

  return (
    <div>
      <SectionHeader
        title="Channel maps"
        sub="WiFi 2.4 GHz, WiFi 5 GHz, and BLE channel allocations"
      />

      <div className="flex gap-2 mb-5">
        {(['24', '5', 'ble'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              tab === t
                ? 'bg-zinc-700 text-zinc-100'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t === '24' ? '2.4 GHz' : t === '5' ? '5 GHz' : 'BLE'}
          </button>
        ))}
      </div>

      {tab === '24' && (
        <div>
          <div className="mb-3 flex gap-4 text-[10px] font-mono text-zinc-500">
            <span><span className="inline-block w-3 h-3 rounded-sm bg-emerald-800 mr-1 align-middle" />Non-overlapping (1/6/11)</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-blue-900 mr-1 align-middle" />Overlapping</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-zinc-700 mr-1 align-middle" />Restricted / regional</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-4">
            {wifi24Channels.map(ch => {
              const isNonOverlap = nonOverlapping.includes(ch.channel)
              const isHovered    = hover24 === ch.channel
              const overlapsHovered = hover24 !== null && (wifi24Channels.find(c => c.channel === hover24)?.overlap ?? []).includes(ch.channel)
              const isRestricted = ch.channel >= 12

              return (
                <div
                  key={ch.channel}
                  onMouseEnter={() => setHover24(ch.channel)}
                  onMouseLeave={() => setHover24(null)}
                  className={`border rounded p-2 text-center cursor-default transition-colors ${
                    isHovered        ? 'border-zinc-400 bg-zinc-700' :
                    overlapsHovered  ? 'border-orange-800 bg-orange-950/40' :
                    isRestricted     ? 'border-zinc-700 bg-zinc-800/50' :
                    isNonOverlap     ? 'border-emerald-800 bg-emerald-950/40' :
                                       'border-zinc-800 bg-blue-950/20'
                  }`}
                >
                  <div className="text-xs font-mono font-semibold text-zinc-200">{ch.channel}</div>
                  <div className="text-[9px] font-mono text-zinc-500 mt-0.5">{ch.centerMHz}</div>
                </div>
              )
            })}
          </div>

          {hover24 !== null && (() => {
            const ch = wifi24Channels.find(c => c.channel === hover24)!
            return (
              <div className="bg-zinc-900 border border-zinc-700 rounded p-3 text-xs font-mono">
                <span className="text-zinc-200 font-semibold">Channel {ch.channel}</span>
                <span className="text-zinc-500 mx-2">·</span>
                <span className="text-emerald-400">{ch.startMHz}–{ch.endMHz} MHz</span>
                <span className="text-zinc-500 mx-2">·</span>
                <span className="text-zinc-400">center {ch.centerMHz} MHz</span>
                {ch.notes && <><span className="text-zinc-500 mx-2">·</span><span className="text-amber-400">{ch.notes}</span></>}
                {ch.overlap && ch.overlap.length > 0 && (
                  <div className="text-zinc-600 mt-1">Overlaps with: {ch.overlap.join(', ')}</div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {tab === '5' && (
        <div>
          <div className="mb-3 flex gap-4 text-[10px] font-mono text-zinc-500">
            <span><span className="inline-block w-3 h-3 rounded-sm bg-emerald-800 mr-1 align-middle" />No DFS required</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-amber-950 mr-1 align-middle" />DFS required (radar detect)</span>
          </div>
          {['UNII-1', 'UNII-2A', 'UNII-2C', 'UNII-3'].map(band => (
            <div key={band} className="mb-4">
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">{band}</div>
              <div className="flex flex-wrap gap-1.5">
                {wifi5Channels.filter(c => c.band === band).map(ch => (
                  <div
                    key={ch.channel}
                    className={`border rounded px-2.5 py-1.5 text-center ${
                      ch.dfs
                        ? 'border-amber-900 bg-amber-950/30'
                        : 'border-emerald-900 bg-emerald-950/30'
                    }`}
                  >
                    <div className="text-xs font-mono font-semibold text-zinc-200">{ch.channel}</div>
                    <div className="text-[9px] font-mono text-zinc-500">{ch.centerMHz}</div>
                    {ch.dfs && <div className="text-[8px] text-amber-600 mt-0.5">DFS</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 text-[11px] font-mono text-zinc-600">
            All 5 GHz channels are 20 MHz wide. 40/80/160 MHz bonds use contiguous channel groups. UNII-2 channels require DFS — AP must listen for radar before transmitting.
          </div>
        </div>
      )}

      {tab === 'ble' && (
        <div>
          <div className="mb-3 flex gap-4 text-[10px] font-mono text-zinc-500">
            <span><span className="inline-block w-3 h-3 rounded-sm bg-orange-900 mr-1 align-middle" />Advertising channels (37/38/39)</span>
            <span><span className="inline-block w-3 h-3 rounded-sm bg-blue-950 mr-1 align-middle" />Data channels (0–36)</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {bleChannels.map(ch => (
              <div
                key={ch.channel}
                className={`border rounded p-1.5 text-center min-w-[38px] ${
                  ch.isAdvertising
                    ? 'border-orange-700 bg-orange-950/50'
                    : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                <div className={`text-[10px] font-mono font-semibold ${ch.isAdvertising ? 'text-orange-300' : 'text-zinc-400'}`}>
                  {ch.channel}
                </div>
                <div className="text-[8px] font-mono text-zinc-600">{ch.freqMHz}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded p-3 text-[11px] font-mono text-zinc-500 space-y-1">
            <div>Advertising channels: 37 (2402 MHz), 38 (2426 MHz), 39 (2480 MHz) — spaced to avoid WiFi ch 1/6/11</div>
            <div>Data channels 0–36 used for FHSS connections after pairing</div>
            <div>BLE 5.x adds 2 Mbit/s PHY and coded PHY (125/500 kbit/s long range)</div>
            <div>Advertising interval: 20 ms–10.24 s (trackers typically 100 ms–2 s)</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 4. Signal Math ──────────────────────────────────────────────────────────

export function SignalMath() {
  const [dbm, setDbm]       = useState('-70')
  const [mw, setMw]         = useState('')
  const [lastEdit, setLastEdit] = useState<'dbm' | 'mw'>('dbm')

  const [eirpTx, setEirpTx] = useState('20')
  const [eirpGain, setEirpGain] = useState('2')
  const [eirpCable, setEirpCable] = useState('0')

  const dbmToMw = (d: number) => Math.pow(10, d / 10)
  const mwToDbm = (m: number) => 10 * Math.log10(m)

  const handleDbmChange = (val: string) => {
    setDbm(val)
    setLastEdit('dbm')
    const n = parseFloat(val)
    if (!isNaN(n)) setMw(dbmToMw(n).toFixed(6))
  }

  const handleMwChange = (val: string) => {
    setMw(val)
    setLastEdit('mw')
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0) setDbm(mwToDbm(n).toFixed(2))
  }

  const eirpResult = useMemo(() => {
    const tx = parseFloat(eirpTx)
    const g  = parseFloat(eirpGain)
    const c  = parseFloat(eirpCable)
    if (isNaN(tx) || isNaN(g) || isNaN(c)) return null
    return (tx + g - c).toFixed(2)
  }, [eirpTx, eirpGain, eirpCable])

  const refPoints = [
    { dbm: 30,   label: '1 W TX (legal limit some bands)' },
    { dbm: 27,   label: '500 mW' },
    { dbm: 23,   label: '200 mW (BLE max)' },
    { dbm: 20,   label: '100 mW (typical WiFi AP)' },
    { dbm: 0,    label: '1 mW' },
    { dbm: -30,  label: '1 µW' },
    { dbm: -70,  label: 'Typical WiFi client RSSI' },
    { dbm: -80,  label: 'WiFi sensitivity floor (~54 Mbit/s)' },
    { dbm: -90,  label: 'WiFi sensitivity floor (1 Mbit/s)' },
    { dbm: -93,  label: 'BLE sensitivity' },
    { dbm: -100, label: 'GSM sensitivity' },
    { dbm: -110, label: 'Noise floor (typical)' },
  ]

  const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 w-full'
  const labelCls = 'text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1 block'

  return (
    <div>
      <SectionHeader
        title="Signal math"
        sub="dBm ↔ mW converter, EIRP calculator, and reference points"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* dBm ↔ mW */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">dBm ↔ mW converter</div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>dBm</label>
              <input className={inputCls} value={dbm} onChange={e => handleDbmChange(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>milliwatts (mW)</label>
              <input className={inputCls} value={mw} onChange={e => handleMwChange(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-zinc-600 space-y-0.5">
            <div>dBm = 10 · log₁₀(mW)</div>
            <div>mW = 10^(dBm/10)</div>
          </div>
        </div>

        {/* EIRP */}
        <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">EIRP calculator</div>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>TX Power (dBm)</label>
              <input className={inputCls} value={eirpTx} onChange={e => setEirpTx(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Antenna Gain (dBi)</label>
              <input className={inputCls} value={eirpGain} onChange={e => setEirpGain(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cable / Connector Loss (dB)</label>
              <input className={inputCls} value={eirpCable} onChange={e => setEirpCable(e.target.value)} />
            </div>
          </div>
          {eirpResult !== null && (
            <div className="mt-3 bg-zinc-950 border border-zinc-700 rounded p-2 text-center">
              <div className="text-[10px] font-mono text-zinc-500">EIRP</div>
              <div className="text-2xl font-mono font-semibold text-blue-400">{eirpResult} <span className="text-sm">dBm</span></div>
            </div>
          )}
          <div className="mt-2 text-[11px] font-mono text-zinc-600">EIRP = TX − Cable Loss + Antenna Gain</div>
        </div>
      </div>

      {/* Reference table */}
      <div className="mt-6">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Reference points</div>
        <div className="border border-zinc-800 rounded overflow-hidden">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="text-left px-3 py-2 text-zinc-500 font-normal w-20">dBm</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal w-24">mW</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Notes</th>
              </tr>
            </thead>
            <tbody>
              {refPoints.map((r, i) => (
                <tr key={r.dbm} className={`border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-900/30'}`}>
                  <td className={`px-3 py-1.5 font-semibold ${r.dbm >= 0 ? 'text-amber-400' : r.dbm >= -80 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.dbm}
                  </td>
                  <td className="px-3 py-1.5 text-zinc-400">
                    {dbmToMw(r.dbm) >= 1
                      ? dbmToMw(r.dbm).toFixed(0) + ' mW'
                      : dbmToMw(r.dbm) >= 0.001
                      ? (dbmToMw(r.dbm) * 1000).toFixed(2) + ' µW'
                      : dbmToMw(r.dbm).toExponential(1) + ' mW'}
                  </td>
                  <td className="px-3 py-1.5 text-zinc-400">{r.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── 5. TSCM Device Frequencies ─────────────────────────────────────────────

export function TSCMFreqs() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL')

  const filtered = useMemo(() => tscmDevices.filter(d => {
    if (riskFilter !== 'ALL' && d.riskLevel !== riskFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return d.name.toLowerCase().includes(q) || d.freqRange.toLowerCase().includes(q) || d.notes.toLowerCase().includes(q)
  }), [riskFilter, search])

  return (
    <div>
      <SectionHeader
        title="TSCM device frequencies"
        sub="Common threat devices, frequency ranges, modulation types, and detection hints"
      />

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search device, frequency, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
        <div className="flex gap-1">
          {(['ALL', 'HIGH', 'MED', 'LOW'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                riskFilter === r
                  ? r === 'ALL' ? 'bg-zinc-700 text-zinc-200'
                    : r === 'HIGH' ? 'bg-orange-950 text-orange-400'
                    : r === 'MED'  ? 'bg-yellow-950 text-yellow-400'
                    : 'bg-zinc-800 text-zinc-400'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(d => (
          <div key={d.name} className="border border-zinc-800 rounded p-4 bg-zinc-900/30">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-xs font-mono font-semibold text-zinc-100">{d.name}</span>
                <span className="ml-3 text-xs font-mono text-emerald-400">{d.freqRange}</span>
                <span className="ml-3 text-[10px] font-mono text-zinc-500">{d.modulation}</span>
              </div>
              {riskBadge(d.riskLevel)}
            </div>
            <p className="text-xs text-zinc-400 mb-2">{d.notes}</p>
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-mono text-zinc-600 flex-shrink-0 mt-0.5">DETECT</span>
              <span className="text-[11px] font-mono text-blue-400">{d.detectionHint}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Rogue AP / Evil Twin ─────────────────────────────────────────────────

export function RogueAP() {
  const [tab, setTab] = useState<'indicators' | 'tools'>('indicators')

  return (
    <div>
      <SectionHeader
        title="Rogue AP / evil twin reference"
        sub="Detection indicators, known attack tools, and BSSID analysis notes"
      />

      <div className="flex gap-2 mb-5">
        {(['indicators', 'tools'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              tab === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t === 'indicators' ? 'Detection indicators' : 'Attack tools'}
          </button>
        ))}
      </div>

      {tab === 'indicators' && (
        <div className="space-y-3">
          {rogueAPIndicators.map(ind => (
            <div key={ind.indicator} className={`border rounded p-4 ${
              ind.severity === 'CRITICAL' ? 'border-red-900 bg-red-950/10' :
              ind.severity === 'HIGH'     ? 'border-orange-900 bg-orange-950/10' :
                                            'border-zinc-800 bg-zinc-900/30'
            }`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-mono font-semibold text-zinc-100">{ind.indicator}</span>
                {riskBadge(ind.severity)}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{ind.detail}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'tools' && (
        <div className="space-y-3">
          {rogueAPTools.map(tool => (
            <div key={tool.tool} className="border border-zinc-800 rounded p-4 bg-zinc-900/30">
              <div className="flex items-start gap-3 mb-1.5">
                <span className="text-xs font-mono font-semibold text-zinc-100 min-w-[160px]">{tool.tool}</span>
                {badge(tool.platform, 'bg-blue-950 text-blue-400')}
              </div>
              <div className="text-[11px] font-mono text-amber-400 mb-1.5">{tool.primaryUse}</div>
              <p className="text-xs text-zinc-400">{tool.notes}</p>
            </div>
          ))}

          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded p-3 text-[11px] font-mono text-zinc-500 space-y-1">
            <div className="text-zinc-400 font-semibold mb-1">OUI lookup tips</div>
            <div>Pineapple Mark VII → 94:83:C4 (GL.iNet / GL Technologies)</div>
            <div>Alfa AWUS036 in AP mode → 00:C0:CA</div>
            <div>Cross-reference any unknown BSSID at wireshark.org/tools/oui-lookup</div>
          </div>
        </div>
      )}
    </div>
  )
}
