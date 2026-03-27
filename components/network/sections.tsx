'use client'

import { useState, useMemo } from 'react'
import { ports, wiresharkFilters, nmapCommands, protocols, attackSignatures } from '@/lib/network/data'

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

const Copy = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => { setCopied(false) }) }}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
    >{copied ? '✓' : 'copy'}</button>
  )
}

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

const severityBadge = (s: 'CRITICAL' | 'HIGH' | 'MED') => {
  const map = { CRITICAL: 'bg-red-950 text-red-400', HIGH: 'bg-orange-950 text-orange-400', MED: 'bg-yellow-950 text-yellow-400' }
  return <Badge text={s} cls={map[s]} />
}

const protoBadge = (p: string) => {
  const map: Record<string, string> = { TCP: 'bg-blue-950 text-blue-400', UDP: 'bg-purple-950 text-purple-400', 'TCP/UDP': 'bg-zinc-800 text-zinc-400' }
  return <Badge text={p} cls={map[p] ?? 'bg-zinc-800 text-zinc-400'} />
}

// ─── 1. Common Ports ─────────────────────────────────────────────────────────

export function PortsReference() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('ALL')
  const [proto, setProto] = useState('ALL')

  const cats = ['ALL', ...Array.from(new Set(ports.map(p => p.category)))]

  const filtered = useMemo(() => ports.filter(p => {
    if (cat !== 'ALL' && p.category !== cat) return false
    if (proto !== 'ALL' && !p.proto.includes(proto)) return false
    if (!search) return true
    const q = search.toLowerCase()
    return String(p.port).includes(q) || p.service.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  }), [search, cat, proto])

  return (
    <div>
      <SH title="Common ports reference" sub="Port number, protocol, service, and security notes for 60+ commonly encountered ports" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Port, service, description..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={cat} onChange={e => setCat(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {['ALL', 'TCP', 'UDP'].map(p => (
            <button key={p} onClick={() => setProto(p)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                proto === p ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
        <table className="w-full text-xs font-mono min-w-[600px]">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-16">Port</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-20">Proto</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal w-28">Service</th>
              <th className="text-left px-3 py-2 text-zinc-500 font-normal">Description / Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.port + p.service} className={`border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? '' : 'bg-zinc-900/20'} ${p.notable ? 'hover:bg-amber-950/10' : 'hover:bg-zinc-900/40'} transition-colors`}>
                <td className="px-3 py-2 text-emerald-400 font-bold">{p.port}</td>
                <td className="px-3 py-2">{protoBadge(p.proto)}</td>
                <td className="px-3 py-2 text-zinc-200">{p.service}</td>
                <td className="px-3 py-2">
                  <span className="text-zinc-400">{p.description}</span>
                  {p.notable && (
                    <div className="text-amber-500 mt-0.5 text-[10px]">⚠ {p.notable}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-3 py-1.5 bg-zinc-900/30 text-[10px] font-mono text-zinc-700">
          {filtered.length} / {ports.length} ports · amber rows have security notes
        </div>
      </div>
    </div>
  )
}

// ─── 2. Wireshark Filters ─────────────────────────────────────────────────────

export function WiresharkFilters() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('ALL')

  const cats = ['ALL', ...Array.from(new Set(wiresharkFilters.map(f => f.category)))]

  const filtered = useMemo(() => wiresharkFilters.filter(f => {
    if (cat !== 'ALL' && f.category !== cat) return false
    if (!search) return true
    const q = search.toLowerCase()
    return f.filter.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
  }), [search, cat])

  return (
    <div>
      <SH title="Wireshark display filters" sub="IP/host, ports, TCP, HTTP, DNS, TLS, ICMP, ARP, credentials, and threat hunting filters" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Filter syntax, description..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={cat} onChange={e => setCat(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge text={f.category} cls={
                    f.category === 'Threat Hunting' ? 'bg-red-950 text-red-400' :
                    f.category === 'Credentials' ? 'bg-orange-950 text-orange-400' :
                    'bg-zinc-800 text-zinc-500'
                  } />
                  <p className="text-xs text-zinc-500">{f.description}</p>
                </div>
                <code className="text-xs font-mono text-emerald-400 break-all">{f.filter}</code>
                {f.notes && <p className="text-[10px] font-mono text-zinc-600 mt-1">{f.notes}</p>}
              </div>
              <Copy text={f.filter} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] font-mono text-zinc-700">{filtered.length} / {wiresharkFilters.length} filters</div>
    </div>
  )
}

// ─── 3. Nmap Reference ───────────────────────────────────────────────────────

export function NmapReference() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('ALL')

  const cats = ['ALL', ...Array.from(new Set(nmapCommands.map(c => c.category)))]

  const filtered = useMemo(() => nmapCommands.filter(c => {
    if (cat !== 'ALL' && c.category !== cat) return false
    if (!search) return true
    const q = search.toLowerCase()
    return c.cmd.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  }), [search, cat])

  return (
    <div>
      <SH title="Nmap scan reference" sub="Host discovery, port scanning, service detection, NSE scripts, timing, evasion, output, and common combos" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Flag, description..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-48 ${inputCls}`} />
        <select value={cat} onChange={e => setCat(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge text={c.category} cls="bg-blue-950 text-blue-400" />
                  <p className="text-xs text-zinc-400">{c.description}</p>
                </div>
                <code className="text-xs font-mono text-emerald-400 break-all">{c.cmd}</code>
                {c.notes && (
                  <p className="text-[10px] font-mono text-zinc-600 mt-1">{c.notes}</p>
                )}
              </div>
              <Copy text={c.cmd} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] font-mono text-zinc-700">{filtered.length} / {nmapCommands.length} commands</div>
    </div>
  )
}

// ─── 4. Protocol Quick Ref ───────────────────────────────────────────────────

export function ProtocolRef() {
  const [active, setActive] = useState(protocols[0].protocol)
  const p = protocols.find(x => x.protocol === active)!

  return (
    <div>
      <SH title="Protocol quick reference" sub="DNS, HTTP/HTTPS, TLS, ICMP, ARP, SMB — structure, key facts, and security notes" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {protocols.map(p => (
          <button key={p.protocol} onClick={() => setActive(p.protocol)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
              active === p.protocol ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}>{p.protocol}</button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-sm font-mono font-bold text-zinc-100">{p.protocol}</span>
            <Badge text={p.ports} cls="bg-emerald-950 text-emerald-400" />
          </div>
          <p className="text-xs font-mono text-zinc-400">{p.overview}</p>
        </div>

        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Key facts</div>
          <ul className="space-y-1.5">
            {p.keyFacts.map((f, i) => (
              <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2">
                <span className="text-zinc-700 flex-shrink-0">→</span>{f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Security notes</div>
          <div className="space-y-1.5">
            {p.securityNotes.map((n, i) => (
              <div key={i} className="flex gap-2 text-xs font-mono text-amber-400">
                <span className="text-zinc-700 flex-shrink-0">⚠</span>{n}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Wireshark</div>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{p.wiresharkTip}</code>
            <Copy text={p.wiresharkTip} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 5. Attack Signatures ────────────────────────────────────────────────────

export function AttackSigs() {
  const [cat, setCat] = useState('ALL')
  const [sev, setSev] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MED'>('ALL')
  const [open, setOpen] = useState<string | null>(null)

  const cats = ['ALL', ...Array.from(new Set(attackSignatures.map(a => a.category)))]

  const filtered = useMemo(() => attackSignatures.filter(a => {
    if (cat !== 'ALL' && a.category !== cat) return false
    if (sev !== 'ALL' && a.severity !== sev) return false
    return true
  }), [cat, sev])

  return (
    <div>
      <SH title="Network attack signatures" sub="Reconnaissance, credential attacks, exploitation, DoS, covert channels, C2 beaconing — indicators and mitigations" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <select value={cat} onChange={e => setCat(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {(['ALL', 'CRITICAL', 'HIGH', 'MED'] as const).map(s => (
            <button key={s} onClick={() => setSev(s)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                sev === s
                  ? s === 'ALL' ? 'bg-zinc-700 text-zinc-200'
                    : s === 'CRITICAL' ? 'bg-red-950 text-red-400'
                    : s === 'HIGH' ? 'bg-orange-950 text-orange-400'
                    : 'bg-yellow-950 text-yellow-400'
                  : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(a => (
          <div key={a.name} className={`border rounded overflow-hidden ${
            a.severity === 'CRITICAL' ? 'border-red-900' :
            a.severity === 'HIGH' ? 'border-orange-900' : 'border-zinc-800'
          }`}>
            <button onClick={() => setOpen(open === a.name ? null : a.name)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-3 flex-wrap">
                {severityBadge(a.severity)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{a.name}</span>
                <Badge text={a.category} cls="bg-zinc-800 text-zinc-500" />
              </div>
              <span className="text-zinc-600 text-xs ml-2">{open === a.name ? '▲' : '▼'}</span>
            </button>

            {open === a.name && (
              <div className="px-4 py-4 border-t border-zinc-800 space-y-4">
                <p className="text-xs font-mono text-zinc-400">{a.description}</p>

                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Network indicators</div>
                  <ul className="space-y-1.5">
                    {a.networkIndicators.map((ind, i) => (
                      <li key={i} className="text-xs font-mono text-zinc-300 flex gap-2">
                        <span className="text-red-700 flex-shrink-0">→</span>{ind}
                      </li>
                    ))}
                  </ul>
                </div>

                {(a.wiresharkFilter || a.nmapDetect) && (
                  <div className="space-y-2">
                    {a.wiresharkFilter && (
                      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Wireshark filter</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{a.wiresharkFilter}</code>
                          <Copy text={a.wiresharkFilter} />
                        </div>
                      </div>
                    )}
                    {a.nmapDetect && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded p-3">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Nmap detection</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{a.nmapDetect}</code>
                          <Copy text={a.nmapDetect} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-2">Mitigations</div>
                  <ul className="space-y-1.5">
                    {a.mitigations.map((m, i) => (
                      <li key={i} className="text-xs font-mono text-emerald-400 flex gap-2">
                        <span className="text-zinc-700 flex-shrink-0">✓</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
