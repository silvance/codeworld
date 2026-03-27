'use client'

import { useState, useMemo, useCallback } from 'react'

// ─── Shared ───────────────────────────────────────────────────────────────────

function CopyBtn({ text, label = 'copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
        .catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1 flex-shrink-0"
    >{copied ? '✓ copied' : label}</button>
  )
}

function Row({ label, value, mono = true, dim }: { label: string; value: string; mono?: boolean; dim?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2 border-b border-zinc-800/50 last:border-0">
      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`flex-1 text-xs break-all ${mono ? 'font-mono' : ''} ${dim ? 'text-zinc-500' : 'text-zinc-200'}`}>{value}</span>
      {!dim && <CopyBtn text={value} />}
    </div>
  )
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/30">{children}</div>
}

function BoxHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
      <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
    </div>
  )
}

const inputCls = 'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500'
const smallInputCls = 'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

// ─── 1. Subnet Calculator ─────────────────────────────────────────────────────

function calcSubnet(cidr: string) {
  const match = cidr.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/)
  if (!match) return null
  const [, a, b, c, d, prefix] = match.map(Number)
  if ([a, b, c, d].some(n => n > 255) || prefix > 32) return null

  const ip = (a << 24 | b << 16 | c << 8 | d) >>> 0
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ip & mask) >>> 0
  const broadcast = (network | ~mask) >>> 0
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0
  const hostCount = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2

  const toOctets = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
  const toBin = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map(o => o.toString(2).padStart(8, '0')).join('.')
  const toHexIP = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map(o => o.toString(16).padStart(2, '0')).join(':')

  // Wildcard = inverse of mask
  const wildcard = (~mask) >>> 0

  // Class detection
  const classMap = a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (Multicast)' : 'E (Reserved)'
  const isPrivate = (a === 10) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  const isLoopback = a === 127
  const isLink = a === 169 && b === 254

  return {
    inputIP: toOctets(ip),
    network: toOctets(network) + `/${prefix}`,
    broadcast: toOctets(broadcast),
    firstHost: toOctets(firstHost),
    lastHost: toOctets(lastHost),
    subnetMask: toOctets(mask),
    wildcardMask: toOctets(wildcard),
    hostCount: hostCount.toLocaleString(),
    ipBinary: toBin(ip),
    maskBinary: toBin(mask),
    networkBinary: toBin(network),
    hexIP: '0x' + toHexIP(ip).replace(/:/g, ''),
    ipClass: classMap,
    type: isLoopback ? 'Loopback' : isLink ? 'Link-local (APIPA)' : isPrivate ? 'Private (RFC 1918)' : 'Public',
    totalAddresses: Math.pow(2, 32 - prefix).toLocaleString(),
  }
}

export function SubnetCalculator() {
  const [input, setInput] = useState('192.168.1.0/24')
  const result = useMemo(() => calcSubnet(input), [input])

  // Quick examples
  const examples = ['10.0.0.0/8', '172.16.0.0/12', '192.168.1.0/24', '192.168.1.100/28', '10.10.5.0/30']

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="192.168.1.0/24" className={inputCls} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {examples.map(ex => (
            <button key={ex} onClick={() => setInput(ex)}
              className="px-2 py-0.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-300 bg-zinc-900 rounded transition-colors">{ex}</button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Box>
            <BoxHeader title="Network" />
            <div className="px-4">
              <Row label="Input IP" value={result.inputIP} />
              <Row label="Network" value={result.network} />
              <Row label="Broadcast" value={result.broadcast} />
              <Row label="First host" value={result.firstHost} />
              <Row label="Last host" value={result.lastHost} />
              <Row label="Host count" value={result.hostCount} />
              <Row label="Total addrs" value={result.totalAddresses} />
            </div>
          </Box>
          <Box>
            <BoxHeader title="Masks & info" />
            <div className="px-4">
              <Row label="Subnet mask" value={result.subnetMask} />
              <Row label="Wildcard" value={result.wildcardMask} />
              <Row label="IP (hex)" value={result.hexIP} />
              <Row label="Class" value={result.ipClass ?? ''} />
              <Row label="Type" value={result.type ?? ''} />
            </div>
          </Box>
          <Box>
            <BoxHeader title="Binary representation" />
            <div className="px-4">
              <Row label="IP" value={result.ipBinary} />
              <Row label="Mask" value={result.maskBinary} />
              <Row label="Network" value={result.networkBinary} />
            </div>
          </Box>
        </div>
      )}
      {input && !result && (
        <p className="text-xs font-mono text-amber-500">Invalid CIDR — expected format: x.x.x.x/prefix (e.g. 192.168.1.0/24)</p>
      )}
    </div>
  )
}

// ─── 2. Timestamp Converter ───────────────────────────────────────────────────

export function TimestampConverter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'auto' | 'unix_s' | 'unix_ms' | 'unix_us' | 'filetime' | 'chrome' | 'mac' | 'hfs' | 'iso'>('auto')

  const now = () => {
    const n = Date.now()
    setInput(String(Math.floor(n / 1000)))
    setMode('unix_s')
  }

  const result = useMemo(() => {
    const raw = input.trim()
    if (!raw) return null

    let ms: number | null = null
    let detectedMode = mode

    if (mode === 'auto') {
      const n = Number(raw)
      if (raw.match(/^\d{4}-/)) detectedMode = 'iso'
      else if (n > 1e17) detectedMode = 'filetime'
      else if (n > 1e15) detectedMode = 'unix_us'
      else if (n > 1e12) { detectedMode = raw.length >= 17 ? 'chrome' : 'unix_ms' }
      else if (n > 1e9) detectedMode = 'unix_s'
      else if (n > 0) detectedMode = 'hfs'
    }

    try {
      if (detectedMode === 'iso') {
        ms = new Date(raw).getTime()
      } else if (detectedMode === 'unix_s') {
        ms = Number(raw) * 1000
      } else if (detectedMode === 'unix_ms') {
        ms = Number(raw)
      } else if (detectedMode === 'unix_us') {
        ms = Number(raw) / 1000
      } else if (detectedMode === 'filetime') {
        // Windows FILETIME: 100-nanosecond intervals since 1601-01-01
        ms = (Number(raw) / 10000) - 11644473600000
      } else if (detectedMode === 'chrome') {
        // Chrome: microseconds since 1601-01-01
        ms = (Number(raw) / 1000) - 11644473600000
      } else if (detectedMode === 'mac') {
        // Mac Absolute Time: seconds since 2001-01-01
        ms = (Number(raw) + 978307200) * 1000
      } else if (detectedMode === 'hfs') {
        // HFS+: seconds since 1904-01-01
        ms = (Number(raw) - 2082844800) * 1000
      }
    } catch { return null }

    if (ms === null || isNaN(ms)) return null
    const d = new Date(ms)
    if (isNaN(d.getTime())) return null

    const unix_s = Math.floor(ms / 1000)
    const filetimeBase = Math.floor(ms + 11644473600000)
    const filetime = String(filetimeBase) + "0000"
    const chrome = String(filetimeBase) + "000"
    const mac = Math.floor(ms / 1000) - 978307200

    return {
      detected: detectedMode,
      iso: d.toISOString(),
      local: d.toLocaleString('en-US', { timeZoneName: 'short' }),
      utc: d.toUTCString(),
      unix_s: String(unix_s),
      unix_ms: String(ms),
      unix_us: String(ms * 1000),
      filetime: filetime,
      chrome: chrome,
      mac: String(mac),
      hfs: String(unix_s + 2082844800),
      dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'long' }),
      daysAgo: Math.floor((Date.now() - ms) / 86400000),
    }
  }, [input, mode])

  const modeLabels: Record<string, string> = {
    auto: 'Auto', unix_s: 'Unix (s)', unix_ms: 'Unix (ms)', unix_us: 'Unix (µs)',
    filetime: 'FILETIME', chrome: 'Chrome', mac: 'Mac Abs', hfs: 'HFS+', iso: 'ISO 8601',
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Paste any timestamp..." className={`flex-1 ${inputCls}`} />
          <button onClick={now} className="px-3 py-2 text-xs font-mono bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors flex-shrink-0">now</button>
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(modeLabels).map(([k, v]) => (
            <button key={k} onClick={() => setMode(k as typeof mode)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${mode === k ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-600 hover:text-zinc-300'}`}>{v}</button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Box>
            <BoxHeader title={`Human readable ${result.detected !== 'auto' ? '— detected: ' + modeLabels[result.detected] : ''}`} />
            <div className="px-4">
              <Row label="ISO 8601" value={result.iso} />
              <Row label="UTC" value={result.utc} />
              <Row label="Local" value={result.local} />
              <Row label="Day" value={result.dayOfWeek} />
              <Row label="Relative" value={result.daysAgo >= 0 ? `${result.daysAgo.toLocaleString()} days ago` : `${Math.abs(result.daysAgo).toLocaleString()} days from now`} dim />
            </div>
          </Box>
          <Box>
            <BoxHeader title="All formats" />
            <div className="px-4">
              <Row label="Unix (s)" value={result.unix_s} />
              <Row label="Unix (ms)" value={result.unix_ms} />
              <Row label="Unix (µs)" value={result.unix_us} />
              <Row label="FILETIME" value={result.filetime} />
              <Row label="Chrome" value={result.chrome} />
              <Row label="Mac Abs" value={result.mac} />
              <Row label="HFS+" value={result.hfs} />
            </div>
          </Box>
        </div>
      )}
      {input && !result && (
        <p className="text-xs font-mono text-amber-500">Could not parse timestamp. Try selecting a specific format above.</p>
      )}
      <Box>
        <BoxHeader title="Format reference" />
        <div className="px-4 py-1">
          {[
            ['Unix (s)',    'Seconds since 1970-01-01. e.g. 1700000000',                        '~10 digits'],
            ['Unix (ms)',   'Milliseconds since 1970-01-01. JavaScript Date.now()',               '~13 digits'],
            ['Unix (µs)',   'Microseconds since 1970-01-01',                                     '~16 digits'],
            ['FILETIME',    '100-nanosecond intervals since 1601-01-01. Windows/NTFS.',           '~18 digits'],
            ['Chrome',      'Microseconds since 1601-01-01. Chrome history.db, LNK files.',      '~17 digits'],
            ['Mac Abs',     'Seconds since 2001-01-01. iOS KnowledgeC, CoreData, HFS+ catalog.', 'Add 978307200'],
            ['HFS+',        'Seconds since 1904-01-01. Legacy Apple HFS.',                       'Add 2082844800'],
          ].map(([fmt, desc, hint]) => (
            <div key={fmt} className="flex gap-3 py-1.5 border-b border-zinc-800/40 last:border-0 text-xs font-mono">
              <span className="text-emerald-400 w-20 flex-shrink-0">{fmt}</span>
              <span className="text-zinc-500 flex-1">{desc}</span>
              <span className="text-zinc-700 flex-shrink-0">{hint}</span>
            </div>
          ))}
        </div>
      </Box>
    </div>
  )
}

// ─── 3. Hex Packet Decoder ────────────────────────────────────────────────────

function parseHexBytes(raw: string): Uint8Array | null {
  const clean = raw.replace(/\s+|0x|\\x|%/g, '').replace(/[^0-9a-fA-F]/g, '')
  if (clean.length < 2 || clean.length % 2 !== 0) return null
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < clean.length; i += 2) bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16)
  return bytes
}

function u16be(b: Uint8Array, o: number) { return (b[o] << 8 | b[o + 1]) >>> 0 }
function u32be(b: Uint8Array, o: number) { return ((b[o] << 24 | b[o + 1] << 16 | b[o + 2] << 8 | b[o + 3]) >>> 0) }
function ipStr(b: Uint8Array, o: number) { return `${b[o]}.${b[o+1]}.${b[o+2]}.${b[o+3]}` }
function macStr(b: Uint8Array, o: number) { return Array.from(b.slice(o, o+6)).map(x => x.toString(16).padStart(2,'0')).join(':') }

function decodePacket(bytes: Uint8Array): { layer: string; fields: { name: string; value: string }[] }[] {
  const layers: { layer: string; fields: { name: string; value: string }[] }[] = []
  let offset = 0

  // Try Ethernet frame (>=14 bytes, valid ethertype)
  if (bytes.length >= 14) {
    const ethertype = u16be(bytes, 12)
    if (ethertype === 0x0800 || ethertype === 0x0806 || ethertype === 0x86DD || ethertype === 0x8100) {
      layers.push({ layer: 'Ethernet II', fields: [
        { name: 'Dst MAC', value: macStr(bytes, 0) },
        { name: 'Src MAC', value: macStr(bytes, 6) },
        { name: 'EtherType', value: `0x${ethertype.toString(16).toUpperCase()} (${ethertype === 0x0800 ? 'IPv4' : ethertype === 0x0806 ? 'ARP' : ethertype === 0x86DD ? 'IPv6' : '802.1Q VLAN'})` },
      ]})
      offset = 14
      if (ethertype === 0x8100 && bytes.length > 18) offset = 18 // VLAN tag
    }
  }

  // IPv4
  if (offset + 20 <= bytes.length && (bytes[offset] >> 4) === 4) {
    const ihl = (bytes[offset] & 0x0f) * 4
    const proto = bytes[offset + 9]
    const protoName: Record<number, string> = { 1: 'ICMP', 6: 'TCP', 17: 'UDP', 41: 'IPv6-in-IPv4', 47: 'GRE', 50: 'ESP', 51: 'AH' }
    const flags = bytes[offset + 6] >> 5
    const ttl = bytes[offset + 8]
    const totalLen = u16be(bytes, offset + 2)
    const fragOffset = ((u16be(bytes, offset + 6) & 0x1fff) * 8)
    layers.push({ layer: 'IPv4', fields: [
      { name: 'Version', value: '4' },
      { name: 'IHL', value: `${ihl} bytes` },
      { name: 'Total length', value: `${totalLen} bytes` },
      { name: 'TTL', value: `${ttl}${ttl <= 1 ? ' ⚠ expiring' : ''}` },
      { name: 'Protocol', value: `${proto} (${protoName[proto] ?? 'unknown'})` },
      { name: 'Flags', value: `${flags & 2 ? 'DF ' : ''}${flags & 1 ? 'MF' : ''}${fragOffset ? `frag offset ${fragOffset}` : ''}`.trim() || 'none' },
      { name: 'Src IP', value: ipStr(bytes, offset + 12) },
      { name: 'Dst IP', value: ipStr(bytes, offset + 16) },
      { name: 'Checksum', value: `0x${u16be(bytes, offset + 10).toString(16).padStart(4, '0')}` },
    ]})
    const ipPayloadOffset = offset + ihl
    offset = ipPayloadOffset

    // TCP
    if (proto === 6 && offset + 20 <= bytes.length) {
      const dataOffset = (bytes[offset + 12] >> 4) * 4
      const flagsByte = bytes[offset + 13]
      const flagStr = ['FIN','SYN','RST','PSH','ACK','URG','ECE','CWR']
        .filter((_, i) => flagsByte & (1 << i)).join(' ')
      layers.push({ layer: 'TCP', fields: [
        { name: 'Src port', value: String(u16be(bytes, offset)) },
        { name: 'Dst port', value: String(u16be(bytes, offset + 2)) },
        { name: 'Seq number', value: String(u32be(bytes, offset + 4)) },
        { name: 'Ack number', value: String(u32be(bytes, offset + 8)) },
        { name: 'Data offset', value: `${dataOffset} bytes` },
        { name: 'Flags', value: flagStr || 'none' },
        { name: 'Window', value: String(u16be(bytes, offset + 14)) },
        { name: 'Checksum', value: `0x${u16be(bytes, offset + 16).toString(16).padStart(4, '0')}` },
      ]})
      const payload = bytes.slice(offset + dataOffset)
      if (payload.length > 0) {
        const ascii = Array.from(payload.slice(0, 64)).map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('')
        if (payload.some(b => b >= 32 && b < 127))
          layers.push({ layer: 'TCP Payload', fields: [
            { name: 'Length', value: `${payload.length} bytes` },
            { name: 'ASCII (64)', value: ascii },
          ]})
      }
    }

    // UDP
    if (proto === 17 && offset + 8 <= bytes.length) {
      const srcPort = u16be(bytes, offset)
      const dstPort = u16be(bytes, offset + 2)
      const udpLen = u16be(bytes, offset + 4)
      layers.push({ layer: 'UDP', fields: [
        { name: 'Src port', value: String(srcPort) },
        { name: 'Dst port', value: String(dstPort) },
        { name: 'Length', value: `${udpLen} bytes` },
        { name: 'Checksum', value: `0x${u16be(bytes, offset + 6).toString(16).padStart(4, '0')}` },
      ]})
      // DNS (port 53)
      const dnsOffset = offset + 8
      if ((srcPort === 53 || dstPort === 53) && dnsOffset + 12 <= bytes.length) {
        const flags = u16be(bytes, dnsOffset + 2)
        const isResponse = (flags >> 15) & 1
        const opcode = (flags >> 11) & 0xf
        const rcode = flags & 0xf
        const qdcount = u16be(bytes, dnsOffset + 4)
        const ancount = u16be(bytes, dnsOffset + 6)
        const rcodeMap: Record<number, string> = { 0: 'NOERROR', 1: 'FORMERR', 2: 'SERVFAIL', 3: 'NXDOMAIN', 5: 'REFUSED' }
        layers.push({ layer: 'DNS', fields: [
          { name: 'ID', value: `0x${u16be(bytes, dnsOffset).toString(16).padStart(4,'0')}` },
          { name: 'Type', value: isResponse ? 'Response' : 'Query' },
          { name: 'Opcode', value: String(opcode) },
          { name: 'Rcode', value: `${rcode} (${rcodeMap[rcode] ?? 'unknown'})` },
          { name: 'Questions', value: String(qdcount) },
          { name: 'Answers', value: String(ancount) },
        ]})
      }
    }

    // ICMP
    if (proto === 1 && offset + 4 <= bytes.length) {
      const icmpType = bytes[offset]
      const icmpCode = bytes[offset + 1]
      const typeMap: Record<number, string> = { 0: 'Echo Reply', 3: 'Dest Unreachable', 5: 'Redirect', 8: 'Echo Request', 11: 'Time Exceeded', 12: 'Param Problem' }
      layers.push({ layer: 'ICMP', fields: [
        { name: 'Type', value: `${icmpType} (${typeMap[icmpType] ?? 'unknown'})` },
        { name: 'Code', value: String(icmpCode) },
        { name: 'Checksum', value: `0x${u16be(bytes, offset + 2).toString(16).padStart(4, '0')}` },
      ]})
    }
  }

  // ARP
  if (offset + 28 <= bytes.length && u16be(bytes, offset) === 1 && u16be(bytes, offset + 2) === 0x0800) {
    const op = u16be(bytes, offset + 6)
    layers.push({ layer: 'ARP', fields: [
      { name: 'Operation', value: op === 1 ? '1 (Request)' : op === 2 ? '2 (Reply)' : String(op) },
      { name: 'Sender MAC', value: macStr(bytes, offset + 8) },
      { name: 'Sender IP', value: ipStr(bytes, offset + 14) },
      { name: 'Target MAC', value: macStr(bytes, offset + 18) },
      { name: 'Target IP', value: ipStr(bytes, offset + 24) },
    ]})
  }

  if (layers.length === 0) {
    // Raw bytes summary
    layers.push({ layer: 'Raw bytes', fields: [
      { name: 'Length', value: `${bytes.length} bytes` },
      { name: 'Hex', value: Array.from(bytes.slice(0, 32)).map(b => b.toString(16).padStart(2,'0')).join(' ') + (bytes.length > 32 ? ' ...' : '') },
      { name: 'ASCII', value: Array.from(bytes.slice(0, 64)).map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('') },
    ]})
  }

  return layers
}

export function PacketDecoder() {
  const [input, setInput] = useState('')
  const examples = {
    'ARP request': 'ff ff ff ff ff ff 00 1a 2b 3c 4d 5e 08 06 00 01 08 00 06 04 00 01 00 1a 2b 3c 4d 5e c0 a8 01 01 00 00 00 00 00 00 c0 a8 01 02',
    'ICMP ping': '45 00 00 3c 1c 46 40 00 40 01 3f 43 c0 a8 01 64 c0 a8 01 01 08 00 4d 5a 00 01 00 01',
    'TCP SYN': '45 00 00 3c 00 00 40 00 40 06 00 00 c0 a8 01 64 c0 a8 01 01 c4 d2 00 50 00 00 00 00 00 00 00 00 a0 02 fa f0 00 00 00 00',
  }

  const bytes = useMemo(() => parseHexBytes(input), [input])
  const layers = useMemo(() => bytes ? decodePacket(bytes) : null, [bytes])

  const layerColors: Record<string, string> = {
    'Ethernet II': 'text-blue-400', 'IPv4': 'text-emerald-400', 'TCP': 'text-purple-400',
    'UDP': 'text-amber-400', 'DNS': 'text-teal-400', 'ICMP': 'text-orange-400',
    'ARP': 'text-pink-400', 'TCP Payload': 'text-zinc-400', 'Raw bytes': 'text-zinc-400',
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea rows={4} value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste hex bytes: 45 00 00 3c ... or 45000028... or \x45\x00..."
          className={`${inputCls} resize-none`} spellCheck={false} />
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(examples).map(([label, hex]) => (
            <button key={label} onClick={() => setInput(hex)}
              className="px-2 py-0.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-300 bg-zinc-900 rounded transition-colors">{label}</button>
          ))}
        </div>
      </div>

      {bytes && (
        <div className="text-[10px] font-mono text-zinc-700">{bytes.length} bytes parsed</div>
      )}

      {layers && (
        <div className="space-y-3">
          {layers.map((layer, i) => (
            <Box key={i}>
              <BoxHeader title={layer.layer} />
              <div className="px-4">
                {layer.fields.map(f => (
                  <div key={f.name} className="flex gap-3 py-1.5 border-b border-zinc-800/40 last:border-0">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{f.name}</span>
                    <span className={`text-xs font-mono flex-1 break-all ${layerColors[layer.layer] ?? 'text-zinc-300'}`}>{f.value}</span>
                    <CopyBtn text={f.value} />
                  </div>
                ))}
              </div>
            </Box>
          ))}
        </div>
      )}
      {input && !bytes && (
        <p className="text-xs font-mono text-amber-500">Could not parse hex — ensure even number of hex digits.</p>
      )}
    </div>
  )
}

// ─── 4. Regex Tester ─────────────────────────────────────────────────────────

export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')

  const result = useMemo(() => {
    if (!pattern || !testStr) return null
    try {
      const re = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups: string[] }[] = []
      let m: RegExpExecArray | null
      const r = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      while ((m = r.exec(testStr)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
        if (!flags.includes('g')) break
      }
      return { matches, valid: true }
    } catch (e: unknown) {
      return { matches: [], valid: false, error: e instanceof Error ? e.message : String(e) }
    }
  }, [pattern, flags, testStr])

  // Highlight matches in test string
  const highlighted = useMemo(() => {
    if (!result?.valid || !result.matches.length || !testStr) return null
    const parts: { text: string; isMatch: boolean }[] = []
    let last = 0
    for (const m of result.matches) {
      if (m.index > last) parts.push({ text: testStr.slice(last, m.index), isMatch: false })
      parts.push({ text: m.match, isMatch: true })
      last = m.index + m.match.length
    }
    if (last < testStr.length) parts.push({ text: testStr.slice(last), isMatch: false })
    return parts
  }, [result, testStr])

  const allFlags = ['g', 'i', 'm', 's', 'u']

  const quickPatterns = [
    ['IPv4', '(\\d{1,3}\\.){3}\\d{1,3}'],
    ['MAC addr', '([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}'],
    ['SHA-256', '[0-9a-fA-F]{64}'],
    ['URL', 'https?://[^\\s/$.?#][^\\s]*'],
    ['Email', '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}'],
    ['Base64', '[A-Za-z0-9+/]{4,}={0,2}'],
    ['Windows path', '[A-Za-z]:\\\\[^\\n]*'],
    ['Unix path', '/[\\w./\\-]+'],
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">/</span>
            <input value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder="pattern" spellCheck={false}
              className={`w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-6 pr-4 py-2.5 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 ${result?.error ? 'border-red-700' : ''}`} />
          </div>
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3">
            {allFlags.map(f => (
              <button key={f} onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)}
                className={`w-6 h-6 text-xs font-mono rounded transition-colors ${flags.includes(f) ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}>{f}</button>
            ))}
          </div>
        </div>
        {result?.error && <p className="text-xs font-mono text-red-400">{result.error}</p>}
        <textarea rows={5} value={testStr} onChange={e => setTestStr(e.target.value)}
          placeholder="Paste test string here..."
          className={`${inputCls} resize-none`} spellCheck={false} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {quickPatterns.map(([label, pat]) => (
          <button key={label} onClick={() => setPattern(pat)}
            className="px-2 py-0.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-300 bg-zinc-900 rounded transition-colors">{label}</button>
        ))}
      </div>

      {highlighted && (
        <Box>
          <BoxHeader title={`Match preview — ${result!.matches.length} match${result!.matches.length !== 1 ? 'es' : ''}`} />
          <div className="px-4 py-3 font-mono text-xs break-all leading-relaxed">
            {highlighted.map((p, i) => (
              <span key={i} className={p.isMatch ? 'bg-emerald-900/50 text-emerald-300 rounded px-0.5' : 'text-zinc-400'}>{p.text}</span>
            ))}
          </div>
        </Box>
      )}

      {result?.valid && result.matches.length > 0 && (
        <Box>
          <BoxHeader title="Captures" />
          <div className="px-4">
            {result.matches.map((m, i) => (
              <div key={i} className="py-2 border-b border-zinc-800/40 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-600 w-16 flex-shrink-0">Match {i + 1}</span>
                  <span className="text-xs font-mono text-emerald-400 flex-1">{JSON.stringify(m.match)}</span>
                  <span className="text-[10px] font-mono text-zinc-700">@ {m.index}</span>
                  <CopyBtn text={m.match} />
                </div>
                {m.groups.map((g, j) => g !== undefined && (
                  <div key={j} className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-mono text-zinc-700 w-16 flex-shrink-0">Group {j + 1}</span>
                    <span className="text-xs font-mono text-blue-400">{JSON.stringify(g)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Box>
      )}
      {result?.valid && result.matches.length === 0 && testStr && pattern && (
        <p className="text-xs font-mono text-zinc-600">No matches.</p>
      )}
    </div>
  )
}

// ─── 5. JWT Decoder ───────────────────────────────────────────────────────────

export function JWTDecoder() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const token = input.trim()
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return { error: `Expected 3 parts (header.payload.signature), got ${parts.length}` }

    const decode = (s: string) => {
      try {
        const pad = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')
        return JSON.parse(atob(pad))
      } catch { return null }
    }

    const header = decode(parts[0])
    const payload = decode(parts[1])
    if (!header || !payload) return { error: 'Invalid base64url encoding in header or payload' }

    const now = Math.floor(Date.now() / 1000)
    const exp = payload.exp ? new Date(payload.exp * 1000).toISOString() : null
    const iat = payload.iat ? new Date(payload.iat * 1000).toISOString() : null
    const nbf = payload.nbf ? new Date(payload.nbf * 1000).toISOString() : null
    const expired = payload.exp ? payload.exp < now : null
    const notYetValid = payload.nbf ? payload.nbf > now : null

    return { header, payload, signature: parts[2], exp, iat, nbf, expired, notYetValid }
  }, [input])

  const example = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea rows={4} value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste JWT token..."
          className={`${inputCls} resize-none`} spellCheck={false} autoCapitalize="none" />
        <button onClick={() => setInput(example)}
          className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors">load example</button>
      </div>

      {result?.error && <p className="text-xs font-mono text-red-400">{result.error}</p>}

      {result && !('error' in result) && (
        <div className="space-y-4">
          {result.expired !== null && (
            <div className={`text-xs font-mono px-3 py-2 rounded border ${result.expired ? 'bg-red-950/30 border-red-900 text-red-400' : result.notYetValid ? 'bg-amber-950/30 border-amber-900 text-amber-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}`}>
              {result.expired ? '⚠ Token is expired' : result.notYetValid ? '⚠ Token not yet valid (nbf)' : '✓ Token is currently valid'}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Box>
              <BoxHeader title="Header" />
              <div className="px-4 py-3">
                <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap break-all">{JSON.stringify(result.header, null, 2)}</pre>
              </div>
            </Box>
            <Box>
              <BoxHeader title="Payload" />
              <div className="px-4 py-3">
                <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all">{JSON.stringify(result.payload, null, 2)}</pre>
              </div>
            </Box>
          </div>
          <Box>
            <BoxHeader title="Claims" />
            <div className="px-4">
              {result.iat && <Row label="iat (issued)" value={result.iat} />}
              {result.exp && <Row label="exp (expires)" value={`${result.exp}${result.expired ? ' (EXPIRED)' : ''}`} />}
              {result.nbf && <Row label="nbf (not before)" value={result.nbf} />}
              {result.payload.sub && <Row label="sub (subject)" value={String(result.payload.sub)} />}
              {result.payload.iss && <Row label="iss (issuer)" value={String(result.payload.iss)} />}
              {result.payload.aud && <Row label="aud (audience)" value={String(result.payload.aud)} />}
            </div>
          </Box>
          <Box>
            <BoxHeader title="Signature (base64url)" />
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 break-all flex-1">{result.signature}</span>
                <CopyBtn text={result.signature ?? ''} />
              </div>
              <p className="text-[10px] font-mono text-zinc-700 mt-2">Signature is not verified — no secret key. Do not treat as trusted.</p>
            </div>
          </Box>
        </div>
      )}
    </div>
  )
}

// ─── 6. Certificate Decoder ───────────────────────────────────────────────────

export function CertDecoder() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const pem = input.trim()
    if (!pem) return null
    try {
      // Extract base64 from PEM
      const b64 = pem
        .replace(/-----BEGIN [^-]+-----/g, '')
        .replace(/-----END [^-]+-----/g, '')
        .replace(/\s/g, '')
      if (!b64) return { error: 'No PEM data found' }

      // Decode DER
      const der = Uint8Array.from(atob(b64), c => c.charCodeAt(0))

      // Simple ASN.1 parser for X.509 fields we care about
      // We'll use a basic heuristic approach to find printable strings
      const allStrings: string[] = []
      for (let i = 0; i < der.length - 1; i++) {
        // PrintableString (0x13), UTF8String (0x0C), IA5String (0x16), BMPString (0x1E)
        if ([0x13, 0x0c, 0x16].includes(der[i])) {
          const len = der[i + 1]
          if (len < 200 && i + 2 + len <= der.length) {
            const str = Array.from(der.slice(i + 2, i + 2 + len)).map(b => String.fromCharCode(b)).join('')
            if (str.length > 1 && /^[\x20-\x7E]+$/.test(str)) allStrings.push(str)
          }
        }
      }

      // Extract fingerprints
      const sha256 = async () => {
        const hash = await crypto.subtle.digest('SHA-256', der)
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(':').toUpperCase()
      }

      // OID patterns we might find in the string array
      const keyFields = allStrings.filter((s, i, arr) => arr.indexOf(s) === i)

      return { raw: b64.slice(0, 40) + '...', fields: keyFields, der, sha256 }
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Failed to decode certificate' }
    }
  }, [input])

  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const computeFingerprint = useCallback(async () => {
    if (!result || 'error' in result || !result.der) return
    const hash = await crypto.subtle.digest('SHA-256', result.der)
    setFingerprint(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(':').toUpperCase())
  }, [result])

  const examplePem = `-----BEGIN CERTIFICATE-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2a2rwplBQLF29amygykE
MmYz0+Kcj3bKBp29L2rjDxIGOYCxhcSzoTXGrFqiDlwHoJMCCxUEUANpFCRRjXm
lCKT0BsAqJJNSJKBQ5MdPOLFMijCkJxZiWoQq+UGS2aBbH6z2r7j7F2dXVbzNvg
4DRkMnFIDQVcHBqYFxN8H4r1dE7vFkFj6ZJBMF/IlScmDp+p0R/lOcVkCmk8HXG
qlDfBo8xBdXCYfTdlwl3dEhIrTrZUHiTL55rQf6mEFq5wj7SJHIiAqRAP0DFCN7
JMmK8qhBqTRFwj2YqQIDAQAB
-----END CERTIFICATE-----`

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea rows={8} value={input} onChange={e => { setInput(e.target.value); setFingerprint(null) }}
          placeholder="Paste PEM certificate (-----BEGIN CERTIFICATE-----...)"
          className={`${inputCls} resize-none`} spellCheck={false} autoCapitalize="none" />
        <button onClick={() => { setInput(examplePem); setFingerprint(null) }}
          className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors">load example</button>
      </div>

      {result && 'error' in result && <p className="text-xs font-mono text-red-400">{result.error}</p>}

      {result && !('error' in result) && (
        <div className="space-y-4">
          <Box>
            <BoxHeader title="Decoded strings (subjects, issuers, SANs)" />
            <div className="px-4 py-3 space-y-1">
              {result.fields.length === 0 && <p className="text-xs font-mono text-zinc-600">No printable string fields found.</p>}
              {result.fields.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-300 flex-1 break-all">{f}</span>
                  <CopyBtn text={f} />
                </div>
              ))}
            </div>
          </Box>
          <Box>
            <BoxHeader title="Fingerprints" />
            <div className="px-4 py-3">
              {fingerprint
                ? <div className="flex items-center gap-2"><span className="text-xs font-mono text-emerald-400 break-all flex-1">{fingerprint}</span><CopyBtn text={fingerprint} /></div>
                : <button onClick={computeFingerprint} className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">Compute SHA-256 fingerprint</button>
              }
            </div>
          </Box>
          <p className="text-[10px] font-mono text-zinc-700">For full X.509 field decoding use openssl x509 -text -noout -in cert.pem</p>
        </div>
      )}
    </div>
  )
}

// ─── 7. Entropy Calculator ────────────────────────────────────────────────────

export function EntropyCalc() {
  const [input, setInput] = useState('')
  const [inputMode, setInputMode] = useState<'text' | 'hex'>('text')

  const result = useMemo(() => {
    let bytes: Uint8Array
    if (inputMode === 'hex') {
      const parsed = input.replace(/\s+/g, '')
      if (parsed.length === 0) return null
      if (parsed.length % 2 !== 0) return null
      try {
        bytes = Uint8Array.from({ length: parsed.length / 2 }, (_, i) => parseInt(parsed.slice(i*2, i*2+2), 16))
      } catch { return null }
    } else {
      bytes = new TextEncoder().encode(input)
    }
    if (bytes.length === 0) return null

    // Shannon entropy
    const freq = new Array(256).fill(0)
    for (const b of bytes) freq[b]++
    let entropy = 0
    for (const f of freq) {
      if (f > 0) {
        const p = f / bytes.length
        entropy -= p * Math.log2(p)
      }
    }

    // Byte distribution stats
    const nonZero = freq.filter(f => f > 0).length
    const printable = Array.from(bytes).filter(b => b >= 32 && b < 127).length
    const nullBytes = freq[0]
    const highBytes = Array.from(bytes).filter(b => b > 127).length

    // Classification
    let classification = ''
    let classColor = ''
    if (entropy < 3.5) { classification = 'Low — likely plain text or structured data'; classColor = 'text-emerald-400' }
    else if (entropy < 5.5) { classification = 'Medium — compressed text, code, or mixed data'; classColor = 'text-blue-400' }
    else if (entropy < 7.0) { classification = 'High — possibly compressed or lightly encrypted'; classColor = 'text-amber-400' }
    else if (entropy < 7.5) { classification = 'Very high — likely compressed (ZIP/GZIP) or encrypted'; classColor = 'text-orange-400' }
    else { classification = 'Near-maximum — encrypted, compressed, or random data'; classColor = 'text-red-400' }

    // Histogram (16 buckets of 16 bytes)
    const buckets = Array(16).fill(0)
    for (const b of bytes) buckets[Math.floor(b / 16)]++
    const maxBucket = Math.max(...buckets)

    return {
      entropy: entropy.toFixed(4),
      entropyPct: ((entropy / 8) * 100).toFixed(1),
      byteCount: bytes.length,
      uniqueBytes: nonZero,
      printablePct: ((printable / bytes.length) * 100).toFixed(1),
      nullBytes,
      highBytes,
      classification,
      classColor,
      buckets,
      maxBucket,
    }
  }, [input, inputMode])

  const thresholds = [
    { label: 'Plain text', range: '0–3.5', color: 'bg-emerald-600' },
    { label: 'Mixed/code', range: '3.5–5.5', color: 'bg-blue-600' },
    { label: 'Compressed', range: '5.5–7.5', color: 'bg-amber-600' },
    { label: 'Encrypted/random', range: '7.5–8.0', color: 'bg-red-600' },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2 mb-2">
          {(['text', 'hex'] as const).map(m => (
            <button key={m} onClick={() => setInputMode(m)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${inputMode === m ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{m}</button>
          ))}
        </div>
        <textarea rows={5} value={input} onChange={e => setInput(e.target.value)}
          placeholder={inputMode === 'hex' ? 'Paste hex bytes...' : 'Paste text or binary content...'}
          className={`${inputCls} resize-none`} spellCheck={false} />
      </div>

      {result && (
        <div className="space-y-4">
          {/* Entropy meter */}
          <Box>
            <BoxHeader title="Entropy" />
            <div className="px-4 py-4">
              <div className="flex items-end gap-3 mb-3">
                <span className="text-3xl font-mono font-bold text-zinc-100">{result.entropy}</span>
                <span className="text-sm font-mono text-zinc-500 pb-1">bits/byte ({result.entropyPct}% of max)</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full transition-all ${
                  Number(result.entropy) < 3.5 ? 'bg-emerald-600' :
                  Number(result.entropy) < 5.5 ? 'bg-blue-600' :
                  Number(result.entropy) < 7.0 ? 'bg-amber-600' :
                  Number(result.entropy) < 7.5 ? 'bg-orange-600' : 'bg-red-600'
                }`} style={{ width: `${result.entropyPct}%` }} />
              </div>
              <p className={`text-xs font-mono font-semibold ${result.classColor}`}>{result.classification}</p>
            </div>
          </Box>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Box>
              <BoxHeader title="Statistics" />
              <div className="px-4">
                <Row label="Bytes" value={result.byteCount.toLocaleString()} />
                <Row label="Unique bytes" value={`${result.uniqueBytes} / 256`} />
                <Row label="Printable" value={`${result.printablePct}%`} />
                <Row label="Null bytes" value={String(result.nullBytes)} dim={result.nullBytes === 0} />
                <Row label="High (>0x7F)" value={String(result.highBytes)} dim={result.highBytes === 0} />
              </div>
            </Box>
            <Box>
              <BoxHeader title="Byte distribution (histogram)" />
              <div className="px-4 py-3">
                <div className="flex items-end gap-0.5 h-16">
                  {result.buckets.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div className="bg-emerald-800 rounded-t"
                        style={{ height: `${result.maxBucket > 0 ? (count / result.maxBucket) * 56 : 0}px` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-700 mt-1">
                  <span>0x00</span><span>0x80</span><span>0xFF</span>
                </div>
              </div>
            </Box>
          </div>

          <Box>
            <BoxHeader title="Classification reference" />
            <div className="px-4 py-2">
              {thresholds.map(t => (
                <div key={t.label} className="flex items-center gap-3 py-1.5 border-b border-zinc-800/40 last:border-0">
                  <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${t.color}`} />
                  <span className="text-xs font-mono text-zinc-300 flex-1">{t.label}</span>
                  <span className="text-xs font-mono text-zinc-600">{t.range} bits/byte</span>
                </div>
              ))}
            </div>
          </Box>
        </div>
      )}
    </div>
  )
}

// ─── 8. MAC Address Lookup ────────────────────────────────────────────────────

// Embedded OUI prefix table (abbreviated — top vendors)
const OUI_TABLE: Record<string, string> = {
  '00:00:0C': 'Cisco Systems', '00:1A:11': 'Google', '00:1B:63': 'Apple',
  'AC:DE:48': 'Apple', 'F4:5C:89': 'Apple', '3C:22:FB': 'Apple',
  '00:50:56': 'VMware', '00:0C:29': 'VMware', '00:05:69': 'VMware',
  '08:00:27': 'VirtualBox', '52:54:00': 'QEMU/KVM',
  '00:1C:42': 'Parallels', 'CC:88:C7': 'Huawei',
  'DC:F5:05': 'Cisco', '00:E0:4C': 'Realtek', '00:23:54': 'Intel',
  'A4:C3:F0': 'Intel', '8C:8D:28': 'Intel',
  'FC:F8:AE': 'Samsung', '00:15:5D': 'Microsoft (Hyper-V)',
  '00:03:FF': 'Microsoft', 'B8:AC:6F': 'Dell', '14:18:77': 'Dell',
  '00:14:22': 'Dell', '00:1E:C9': 'Dell', '00:26:B9': 'Dell',
  'A0:36:9F': 'Intel', '00:1A:A0': 'Dell', '18:66:DA': 'Dell',
  'D4:BE:D9': 'Dell', '98:90:96': 'Dell', '00:22:19': 'Belkin',
  '00:90:4B': 'Gemtek (Netgear)', '00:1F:33': 'Netgear',
  '20:E5:2A': 'Netgear', 'C0:FF:D4': 'Netgear',
  '00:14:BF': 'Linksys', '00:18:39': 'Cisco-Linksys',
  '00:1C:10': 'Cisco-Linksys', '00:50:F2': 'Microsoft',
  'CC:46:D6': 'Cisco', '00:1B:0D': 'Cisco',
  'CC:7F:76': 'Ralink Technology', '00:26:5A': 'Hewlett Packard',
  '3C:D9:2B': 'Hewlett Packard', '9C:B6:D0': 'Hewlett Packard',
}

export function MACLookup() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const raw = input.trim()
    if (!raw) return null

    // Normalize
    const clean = raw.replace(/[:\-\s.]/g, '').toUpperCase()
    if (!/^[0-9A-F]{12}$/.test(clean)) return { error: 'Invalid MAC — expected 12 hex chars (e.g. AA:BB:CC:DD:EE:FF)' }

    const colon = clean.match(/.{2}/g)!.join(':')
    const dash   = clean.match(/.{2}/g)!.join('-')
    const dot    = clean.match(/.{4}/g)!.join('.')
    const noSep  = clean

    const firstByte = parseInt(clean.slice(0, 2), 16)
    const isMulticast = (firstByte & 1) === 1
    const isLocallyAdmin = (firstByte & 2) === 2
    const isUniversal = !isLocallyAdmin
    const isUnicast = !isMulticast

    // OUI lookup (first 3 bytes)
    const oui3 = colon.slice(0, 8).toUpperCase()
    const vendor = OUI_TABLE[oui3] ?? 'Unknown (check wireshark OUI database or maclookup.app)'

    // EUI-64 (for IPv6 link-local)
    const eui64 = `${clean.slice(0,2)}:${clean.slice(2,4)}:${clean.slice(4,6)}:FF:FE:${clean.slice(6,8)}:${clean.slice(8,10)}:${clean.slice(10,12)}`
    const toggledByte = (firstByte ^ 0x02).toString(16).padStart(2,'0').toUpperCase()
    const modEui64 = `${toggledByte}:${clean.slice(2,4)}:${clean.slice(4,6)}:FF:FE:${clean.slice(6,8)}:${clean.slice(8,10)}:${clean.slice(10,12)}`
    const linkLocal = `fe80::${modEui64.replace(/:/g,':').split(':').map((s,i) => i%2===0 ? s : '').join('')}${modEui64.replace(/:/g,':').split(':').map((s,i) => i%2!==0 ? s : '').join('')}`

    return {
      colon, dash, dot, noSep,
      oui: oui3,
      vendor,
      isMulticast, isLocallyAdmin, isUniversal, isUnicast,
      eui64, modEui64,
      firstByteBin: firstByte.toString(2).padStart(8, '0'),
    }
  }, [input])

  return (
    <div className="space-y-4">
      <input value={input} onChange={e => setInput(e.target.value)}
        placeholder="AA:BB:CC:DD:EE:FF or AABBCCDDEEFF or AA-BB-CC-DD-EE-FF"
        className={inputCls} spellCheck={false} autoCapitalize="none" />

      {result?.error && <p className="text-xs font-mono text-amber-500">{result.error}</p>}

      {result && !('error' in result) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Box>
            <BoxHeader title="Formats" />
            <div className="px-4">
              <Row label="Colon" value={result.colon ?? ''} />
              <Row label="Dash" value={result.dash ?? ''} />
              <Row label="Dot" value={result.dot ?? ''} />
              <Row label="No separator" value={result.noSep ?? ''} />
            </div>
          </Box>
          <Box>
            <BoxHeader title="Vendor & type" />
            <div className="px-4">
              <Row label="OUI" value={result.oui ?? ''} />
              <Row label="Vendor" value={result.vendor ?? ''} />
              <Row label="Type" value={`${result.isUnicast ? 'Unicast' : 'Multicast'} / ${result.isUniversal ? 'Globally unique (UAA)' : 'Locally administered (LAA)'}`} />
              <Row label="Bit 0 (I/G)" value={`${result.firstByteBin[7]} — ${result.isMulticast ? 'multicast/broadcast' : 'unicast'}`} dim />
              <Row label="Bit 1 (U/L)" value={`${result.firstByteBin[6]} — ${result.isLocallyAdmin ? 'locally administered' : 'globally unique'}`} dim />
            </div>
          </Box>
          <Box>
            <BoxHeader title="IPv6 derived" />
            <div className="px-4">
              <Row label="EUI-64" value={result.eui64 ?? ''} />
              <Row label="Modified EUI-64" value={result.modEui64 ?? ''} />
            </div>
          </Box>
        </div>
      )}
    </div>
  )
}

// ─── 9. UUID / GUID Decoder ───────────────────────────────────────────────────

export function UUIDDecoder() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    const raw = input.trim().toLowerCase().replace(/[{}]/g, '')
    if (!raw) return null

    // Normalize to 32 hex chars
    const hex = raw.replace(/-/g, '')
    if (!/^[0-9a-f]{32}$/.test(hex)) return { error: 'Invalid UUID/GUID — expected 32 hex chars with optional dashes' }

    const std = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
    const ms  = `{${std.toUpperCase()}}`
    const noSep = hex.toUpperCase()

    const version = parseInt(hex[12], 16)
    const variantBits = parseInt(hex[16], 16)
    const variant = variantBits >= 0xc ? 'Microsoft/Reserved' : variantBits >= 0x8 ? 'RFC 4122 (standard)' : variantBits >= 0x4 ? 'NCS backward compat' : 'Reserved (NCS)'

    let timestamp: string | null = null
    let clockSeq: string | null = null
    let node: string | null = null

    if (version === 1) {
      // v1: time-based
      // Time = 60-bit value, 100ns intervals since 1582-10-15
      // Avoid BigInt literals — decompose into float64 arithmetic
      // ts (100ns) = timeHigh * 2^48 + timeMid * 2^32 + timeLow
      // Convert to ms: divide each component by 10000 using precomputed factors
      // 2^48 / 10000 = 28147497671.0656,  2^32 / 10000 = 429496.7296
      const timeLow   = parseInt(hex.slice(0, 8),  16)
      const timeMid   = parseInt(hex.slice(8, 12), 16)
      const timeHigh  = parseInt(hex.slice(13, 16), 16) // skip version nibble
      const tsMs = timeHigh * 28147497671.0656 + timeMid * 429496.7296 + timeLow / 10000
      // Offset: ms from 1582-10-15 to 1970-01-01 = 122192928000000000 / 10000
      const unixMs = tsMs - 12219292800000
      timestamp = new Date(unixMs).toISOString()

      clockSeq = parseInt(hex.slice(16, 20), 16).toString()
      node = hex.slice(20).match(/.{2}/g)!.join(':').toUpperCase()
    }

    const versionNames: Record<number, string> = {
      1: 'v1 — Time-based (MAC address + timestamp)',
      2: 'v2 — DCE Security',
      3: 'v3 — Name-based MD5',
      4: 'v4 — Random',
      5: 'v5 — Name-based SHA-1',
    }

    // Detect Apple device UDIDs (40 hex chars without dashes) — different format
    const isAppleUDID = raw.replace(/-/g, '').length === 40 && /^[0-9a-f]{40}$/.test(raw.replace(/-/g, ''))

    return {
      std, ms, noSep,
      version, versionName: versionNames[version] ?? `v${version} — Unknown`,
      variant, timestamp, clockSeq, node,
      isAppleUDID: false,
    }
  }, [input])

  const examples = [
    { label: 'v1 (time)', val: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
    { label: 'v4 (random)', val: '550e8400-e29b-41d4-a716-446655440000' },
    { label: 'GUID (MS)', val: '{6BA7B810-9DAD-11D1-80B4-00C04FD430C8}' },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          placeholder="6ba7b810-9dad-11d1-80b4-00c04fd430c8 or {GUID} or no-dashes"
          className={inputCls} spellCheck={false} autoCapitalize="none" />
        <div className="flex flex-wrap gap-1.5">
          {examples.map(ex => (
            <button key={ex.label} onClick={() => setInput(ex.val)}
              className="px-2 py-0.5 text-[10px] font-mono text-zinc-600 hover:text-zinc-300 bg-zinc-900 rounded transition-colors">{ex.label}</button>
          ))}
        </div>
      </div>

      {result?.error && <p className="text-xs font-mono text-amber-500">{result.error}</p>}

      {result && !('error' in result) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Box>
            <BoxHeader title="Formats" />
            <div className="px-4">
              <Row label="Standard" value={result.std ?? ''} />
              <Row label="Microsoft" value={result.ms ?? ''} />
              <Row label="No dashes" value={result.noSep ?? ''} />
            </div>
          </Box>
          <Box>
            <BoxHeader title="Version & variant" />
            <div className="px-4">
              <Row label="Version" value={result.versionName ?? ''} />
              <Row label="Variant" value={result.variant ?? ''} />
              {result.timestamp && <Row label="Timestamp" value={result.timestamp} />}
              {result.clockSeq && <Row label="Clock seq" value={result.clockSeq} dim />}
              {result.node && <Row label="Node (MAC)" value={result.node} />}
            </div>
          </Box>
        </div>
      )}

      <Box>
        <BoxHeader title="Version reference" />
        <div className="px-4 py-2">
          {[
            ['v1', 'Time-based. Contains MAC address + 100ns timestamp since 1582-10-15. Reveals host MAC and creation time.'],
            ['v2', 'DCE Security. Rare. Contains POSIX UID/GID + timestamp.'],
            ['v3', 'Name-based MD5. Deterministic — same name + namespace = same UUID.'],
            ['v4', 'Random. 122 bits of randomness. Most common. No decodable info.'],
            ['v5', 'Name-based SHA-1. Like v3 but SHA-1. Preferred over v3.'],
          ].map(([v, desc]) => (
            <div key={v} className="flex gap-3 py-1.5 border-b border-zinc-800/40 last:border-0 text-xs font-mono">
              <span className="text-emerald-400 w-6 flex-shrink-0">{v}</span>
              <span className="text-zinc-500">{desc}</span>
            </div>
          ))}
        </div>
      </Box>
    </div>
  )
}

// ─── 10. Character / Encoding Inspector ──────────────────────────────────────

export function CharInspector() {
  const [input, setInput] = useState('')
  const MAX = 512

  const chars = useMemo(() => {
    if (!input) return []
    return Array.from(input.slice(0, MAX)).map(ch => {
      const cp = ch.codePointAt(0)!
      const hex = cp.toString(16).toUpperCase().padStart(4, '0')
      const dec = cp
      const printable = cp >= 32 && cp < 127
      const name = cp < 32 ? ['NUL','SOH','STX','ETX','EOT','ENQ','ACK','BEL','BS','HT','LF','VT','FF','CR','SO','SI','DLE','DC1','DC2','DC3','DC4','NAK','SYN','ETB','CAN','EM','SUB','ESC','FS','GS','RS','US'][cp] : cp === 127 ? 'DEL' : cp === 160 ? 'NBSP' : ''
      const utf8 = Array.from(new TextEncoder().encode(ch)).map(b => b.toString(16).toUpperCase().padStart(2,'0')).join(' ')
      return { ch, cp, hex, dec, printable, name, utf8 }
    })
  }, [input])

  const stats = useMemo(() => {
    if (!chars.length) return null
    const nulls = chars.filter(c => c.cp === 0).length
    const nonPrint = chars.filter(c => !c.printable).length
    const high = chars.filter(c => c.cp > 127).length
    const unique = new Set(chars.map(c => c.cp)).size
    return { total: chars.length, nulls, nonPrint, high, unique }
  }, [chars])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea rows={4} value={input} onChange={e => setInput(e.target.value)}
          placeholder="Paste any string — see each character as codepoint, hex, UTF-8 bytes..."
          className={`${inputCls} resize-none`} spellCheck={false} />
        {input.length > MAX && <p className="text-[10px] font-mono text-zinc-600">Showing first {MAX} chars</p>}
      </div>

      {stats && (
        <div className="flex flex-wrap gap-4 text-xs font-mono">
          {[
            ['Characters', stats.total],
            ['Unique', stats.unique],
            ['Non-printable', stats.nonPrint],
            ['Null bytes', stats.nulls],
            ['High (>127)', stats.high],
          ].map(([label, val]) => (
            <div key={String(label)}>
              <span className="text-zinc-600">{label}: </span>
              <span className={val > 0 && label !== 'Characters' && label !== 'Unique' ? 'text-amber-400' : 'text-zinc-300'}>{val}</span>
            </div>
          ))}
        </div>
      )}

      {chars.length > 0 && (
        <div className="border border-zinc-800 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono min-w-[500px]">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal w-8">#</th>
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal w-16">Char</th>
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal w-16">Decimal</th>
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal w-20">U+Hex</th>
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal">UTF-8 bytes</th>
                  <th className="text-left px-3 py-2 text-zinc-600 font-normal">Notes</th>
                </tr>
              </thead>
              <tbody>
                {chars.map((c, i) => (
                  <tr key={i} className={`border-b border-zinc-800/40 last:border-0 ${!c.printable ? 'bg-amber-950/10' : i % 2 === 0 ? '' : 'bg-zinc-900/20'}`}>
                    <td className="px-3 py-1.5 text-zinc-700">{i}</td>
                    <td className="px-3 py-1.5">
                      <span className={c.printable ? 'text-zinc-100' : 'text-amber-500'}>
                        {c.printable ? c.ch : c.name || `<${c.hex}>`}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-zinc-400">{c.dec}</td>
                    <td className="px-3 py-1.5 text-emerald-400">U+{c.hex}</td>
                    <td className="px-3 py-1.5 text-blue-400">{c.utf8}</td>
                    <td className="px-3 py-1.5 text-zinc-600">
                      {c.cp === 0 ? '⚠ null byte' : c.cp === 160 ? 'non-breaking space' : c.cp > 127 && c.cp < 160 ? '⚠ C1 control' : c.name || (c.cp > 127 ? 'extended' : '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
