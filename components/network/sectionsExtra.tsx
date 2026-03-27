'use client'

import { useState, useMemo } from 'react'
import {
  cidrTable, specialRanges,
  tcpdumpCommands,
  ncCommands,
  firewallRules,
  dnsCommands,
  tlsCommands,
  pivotTechniques,
  wirelessCommands,
  ipv6Entries,
  scapyExamples,
} from '@/lib/network/data'

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

function CmdBlock({ cmd, lang = 'bash' }: { cmd: string; lang?: string }) {
  return (
    <div className="relative group">
      <pre className={`bg-zinc-950 border border-zinc-800 rounded p-3 text-[11px] font-mono overflow-x-auto leading-relaxed whitespace-pre ${lang === 'python' ? 'text-blue-400' : 'text-emerald-400'}`}>{cmd}</pre>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy text={cmd} />
      </div>
    </div>
  )
}

const inputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

// ─── 1. Subnet / CIDR Reference ──────────────────────────────────────────────

export function SubnetRef() {
  const [view, setView] = useState<'table' | 'special'>('table')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => cidrTable.filter(e =>
    !search || String(e.prefix).includes(search) || e.subnetMask.includes(search)
  ), [search])

  return (
    <div>
      <SH title="Subnet / CIDR quick reference" sub="Prefix lengths, masks, host counts, and special ranges" />
      <div className="flex gap-2 mb-5">
        {(['table', 'special'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${view === v ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
            {v === 'table' ? 'CIDR table' : 'Special ranges'}
          </button>
        ))}
      </div>

      {view === 'table' && (
        <>
          <input placeholder="Filter by prefix or mask..." value={search} onChange={e => setSearch(e.target.value)} className={`w-full mb-4 ${inputCls}`} />
          <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
            <table className="w-full text-xs font-mono min-w-[500px]">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">/Prefix</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Subnet mask</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Wildcard</th>
                  <th className="text-right px-3 py-2 text-zinc-500 font-normal">Addresses</th>
                  <th className="text-right px-3 py-2 text-zinc-500 font-normal">Usable hosts</th>
                  <th className="text-left px-3 py-2 text-zinc-500 font-normal">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.prefix} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-3 py-2 text-emerald-400 font-bold">/{e.prefix}</td>
                    <td className="px-3 py-2 text-zinc-200">{e.subnetMask}</td>
                    <td className="px-3 py-2 text-zinc-500">{e.wildcardMask}</td>
                    <td className="px-3 py-2 text-zinc-300 text-right">{e.totalAddresses.toLocaleString()}</td>
                    <td className="px-3 py-2 text-zinc-300 text-right">{e.usableHosts.toLocaleString()}</td>
                    <td className="px-3 py-2 text-zinc-600">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'special' && (
        <div className="border border-zinc-800 rounded overflow-hidden overflow-x-auto">
          <table className="w-full text-xs font-mono min-w-[400px]">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Range</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Purpose</th>
                <th className="text-left px-3 py-2 text-zinc-500 font-normal">Notes</th>
              </tr>
            </thead>
            <tbody>
              {specialRanges.map(r => (
                <tr key={r.range} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-3 py-2"><div className="flex items-center gap-1"><span className="text-emerald-400">{r.range}</span><Copy text={r.range} /></div></td>
                  <td className="px-3 py-2 text-blue-400">{r.purpose}</td>
                  <td className="px-3 py-2 text-zinc-500">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── 2. tcpdump ───────────────────────────────────────────────────────────────

export function TcpdumpRef() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const cats = ['ALL', ...Array.from(new Set(tcpdumpCommands.map(c => c.category)))]
  const filtered = useMemo(() => tcpdumpCommands.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false
    if (search) { const q = search.toLowerCase(); return c.cmd.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) }
    return true
  }), [catFilter, search])

  return (
    <div>
      <SH title="tcpdump cheat sheet" sub="Capture basics · output format · BPF capture filters · ring buffer · useful combos" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-40 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={c.category} cls="bg-blue-950 text-blue-400" />
                  <span className="text-[11px] font-mono text-zinc-400">{c.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Netcat / Ncat ────────────────────────────────────────────────────────

export function NetcatRef() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(ncCommands.map(c => c.category)))]
  const filtered = useMemo(() => ncCommands.filter(c => catFilter === 'ALL' || c.category === catFilter), [catFilter])

  return (
    <div>
      <SH title="Netcat / Ncat reference" sub="Listeners · connect · port scan · file transfer · reverse shells · shell upgrade" />
      <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ Reverse shells are offensive techniques. Use only on systems you are authorized to test.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={c.category} cls="bg-purple-950 text-purple-400" />
                  {c.variant && <Badge text={c.variant} cls="bg-zinc-800 text-zinc-500" />}
                  <span className="text-[11px] font-mono text-zinc-400">{c.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. Firewall Rules ────────────────────────────────────────────────────────

export function FirewallRef() {
  const [toolFilter, setToolFilter] = useState('ALL')
  const [catFilter, setCatFilter] = useState('ALL')
  const tools = ['ALL', 'iptables', 'nftables', 'Windows Firewall']
  const cats = ['ALL', ...Array.from(new Set(firewallRules.map(r => r.category)))]
  const filtered = useMemo(() => firewallRules.filter(r => {
    if (toolFilter !== 'ALL' && r.tool !== toolFilter) return false
    if (catFilter !== 'ALL' && r.category !== catFilter) return false
    return true
  }), [toolFilter, catFilter])

  return (
    <div>
      <SH title="Firewall rule reference" sub="iptables · nftables · Windows Firewall — view, allow, block, NAT, logging" />
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {tools.map(t => (
            <button key={t} onClick={() => setToolFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${toolFilter === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{t}</button>
          ))}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((r, i) => (
          <div key={i} className={`border rounded p-3 bg-zinc-900/20 ${r.category === 'Block' ? 'border-red-900/50' : 'border-zinc-800'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={r.tool} cls="bg-blue-950 text-blue-400" />
                  <Badge text={r.category} cls={r.category === 'Block' ? 'bg-red-950 text-red-400' : r.category === 'Allow' ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-800 text-zinc-500'} />
                  <span className="text-[11px] font-mono text-zinc-400">{r.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{r.cmd}</code>
                  <Copy text={r.cmd} />
                </div>
                {r.notes && <p className="text-[10px] font-mono text-zinc-600">{r.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 5. DNS Deep Dive ────────────────────────────────────────────────────────

export function DNSDeepDive() {
  const [toolFilter, setToolFilter] = useState('ALL')
  const [catFilter, setCatFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const tools = ['ALL', ...Array.from(new Set(dnsCommands.map(c => c.tool)))]
  const cats = ['ALL', ...Array.from(new Set(dnsCommands.map(c => c.category)))]
  const filtered = useMemo(() => dnsCommands.filter(c => {
    if (toolFilter !== 'ALL' && c.tool !== toolFilter) return false
    if (catFilter !== 'ALL' && c.category !== catFilter) return false
    if (search) { const q = search.toLowerCase(); return c.cmd.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) }
    return true
  }), [toolFilter, catFilter, search])

  return (
    <div>
      <SH title="DNS deep dive" sub="dig · nslookup · host · zone transfer · DoH · DoT · DMARC/SPF/DKIM enumeration" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-40 ${inputCls}`} />
        <div className="flex gap-1 flex-wrap">
          {tools.map(t => <button key={t} onClick={() => setToolFilter(t)} className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${toolFilter === t ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{t}</button>)}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={c.tool} cls="bg-teal-950 text-teal-400" />
                  <Badge text={c.category} cls="bg-zinc-800 text-zinc-500" />
                  <span className="text-[11px] font-mono text-zinc-400">{c.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. TLS/SSL Testing ──────────────────────────────────────────────────────

export function TLSRef() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const cats = ['ALL', ...Array.from(new Set(tlsCommands.map(c => c.category)))]
  const filtered = useMemo(() => tlsCommands.filter(c => {
    if (catFilter !== 'ALL' && c.category !== catFilter) return false
    if (search) { const q = search.toLowerCase(); return c.cmd.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) }
    return true
  }), [catFilter, search])

  return (
    <div>
      <SH title="TLS/SSL testing" sub="openssl s_client · certificate ops · testssl.sh · nmap TLS scripts" />
      <div className="flex gap-3 mb-4 flex-wrap">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`flex-1 min-w-40 ${inputCls}`} />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none">
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={c.category} cls="bg-amber-950 text-amber-400" />
                  <span className="text-[11px] font-mono text-zinc-400">{c.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 7. Pivoting / Tunneling ──────────────────────────────────────────────────

export function PivotRef() {
  const [active, setActive] = useState(pivotTechniques[0].name)
  const technique = pivotTechniques.find(t => t.name === active)!

  return (
    <div>
      <SH title="Network pivot & tunneling" sub="SSH tunnels · dynamic SOCKS · chisel · ligolo-ng · proxychains" />
      <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 mb-5 text-xs font-mono text-amber-400">
        ⚠ Pivoting techniques are offensive. Use only in authorized penetration tests or your own lab environment.
      </div>
      <div className="flex gap-4" style={{ minHeight: '500px' }}>
        <div className="w-44 flex-shrink-0 space-y-1">
          {pivotTechniques.map(t => (
            <button key={t.name} onClick={() => setActive(t.name)}
              className={`w-full text-left px-3 py-2.5 rounded transition-colors border-l-2 ${active === t.name ? 'border-emerald-600 bg-zinc-800 text-zinc-100' : 'border-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
              <div className="text-xs font-mono leading-tight">{t.name}</div>
              <div className="text-[10px] font-mono text-zinc-700 mt-0.5">{t.category}</div>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 space-y-4">
          <div className="border border-zinc-800 rounded p-4 bg-zinc-900/20">
            <Badge text={technique.category} cls="bg-blue-950 text-blue-400 mb-2 inline-block" />
            <p className="text-xs font-mono text-zinc-400 mt-2">{technique.description}</p>
          </div>
          <div className="space-y-2">
            {technique.commands.map((c, i) => (
              <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-900/20 space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{c.label}</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Use cases</div>
              <ul className="space-y-1">{technique.useCases.map((u, i) => <li key={i} className="text-xs font-mono text-zinc-400 flex gap-2"><span className="text-zinc-700">→</span>{u}</li>)}</ul>
            </div>
            <div>
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Detection indicators</div>
              <ul className="space-y-1">{technique.detectionIndicators.map((d, i) => <li key={i} className="text-xs font-mono text-amber-400 flex gap-2"><span className="text-zinc-700">⚑</span>{d}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 8. Wireless ─────────────────────────────────────────────────────────────

export function WirelessRef() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(wirelessCommands.map(c => c.category)))]
  const filtered = useMemo(() => wirelessCommands.filter(c => catFilter === 'ALL' || c.category === catFilter), [catFilter])

  return (
    <div>
      <SH title="Wireless reference" sub="Monitor mode · airodump-ng · WPA2 handshake capture · PMKID · rogue AP detection · kismet" />
      <div className="bg-red-950/20 border border-red-900/40 rounded p-3 mb-5 text-xs font-mono text-red-400">
        ⚠ Wireless attacks against networks you do not own or have explicit written authorization to test are illegal under 18 USC 1030 and equivalent statutes. Deauthentication attacks disrupt legitimate users — this is a federal crime on unauthorized networks.
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>)}
      </div>
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <div key={i} className={`border rounded p-3 bg-zinc-900/20 ${c.legalWarning ? 'border-red-900/50' : 'border-zinc-800'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge text={c.category} cls="bg-zinc-800 text-zinc-500" />
                  {c.legalWarning && <Badge text="⚠ auth required" cls="bg-red-950 text-red-400" />}
                  <span className="text-[11px] font-mono text-zinc-400">{c.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-emerald-400 flex-1 break-all">{c.cmd}</code>
                  <Copy text={c.cmd} />
                </div>
                {c.notes && <p className="text-[10px] font-mono text-zinc-600">{c.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 9. IPv6 Reference ───────────────────────────────────────────────────────

export function IPv6Ref() {
  const [catFilter, setCatFilter] = useState('ALL')
  const [open, setOpen] = useState<string | null>(null)
  const cats = ['ALL', ...Array.from(new Set(ipv6Entries.map(e => e.category)))]
  const filtered = useMemo(() => ipv6Entries.filter(e => catFilter === 'ALL' || e.category === catFilter), [catFilter])

  return (
    <div>
      <SH title="IPv6 reference" sub="Addressing · EUI-64/SLAAC · NDP vs ARP · Linux commands · attack vectors (rogue RA, cache poisoning)" />
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>)}
      </div>
      <div className="space-y-2">
        {filtered.map(e => (
          <div key={e.topic} className="border border-zinc-800 rounded overflow-hidden">
            <button onClick={() => setOpen(open === e.topic ? null : e.topic)}
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={e.category} cls="bg-blue-950 text-blue-400" />
                <span className="text-sm font-mono font-semibold text-zinc-100">{e.topic}</span>
              </div>
              <span className="text-zinc-600 text-xs">{open === e.topic ? '▲' : '▼'}</span>
            </button>
            {open === e.topic && (
              <div className="border-t border-zinc-800 p-4 space-y-3">
                <p className="text-xs font-mono text-zinc-400">{e.description}</p>
                <div>
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Examples</div>
                  <ul className="space-y-1">{e.examples.map((ex, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 flex-1">{ex}</span>
                      <Copy text={ex} />
                    </li>
                  ))}</ul>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2">
                  <p className="text-xs font-mono text-zinc-400">{e.notes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 10. Scapy / Packet Crafting ─────────────────────────────────────────────

export function ScapyRef() {
  const [catFilter, setCatFilter] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(scapyExamples.map(e => e.category)))]
  const filtered = useMemo(() => scapyExamples.filter(e => catFilter === 'ALL' || e.category === catFilter), [catFilter])

  return (
    <div>
      <SH title="Scapy packet crafting" sub="Build, send, sniff, and analyze packets in Python — ICMP, TCP, ARP, DNS, fuzzing, pcap" />
      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3 mb-5 text-xs font-mono text-blue-400">
        Install: pip install scapy — Run as root/sudo for raw socket access. Interactive: sudo scapy
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cats.map(c => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>)}
      </div>
      <div className="space-y-4">
        {filtered.map((e, i) => (
          <div key={i} className="border border-zinc-800 rounded p-4 bg-zinc-900/20 space-y-2">
            <div className="flex items-center gap-2">
              <Badge text={e.category} cls="bg-blue-950 text-blue-400" />
              <span className="text-xs font-mono text-zinc-300">{e.description}</span>
            </div>
            <CmdBlock cmd={e.code} lang="python" />
            {e.notes && <p className="text-[10px] font-mono text-zinc-600">{e.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
