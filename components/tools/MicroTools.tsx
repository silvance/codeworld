'use client'

import { useState, useMemo } from 'react'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Copy({ text }: { text: string }) {
  const [c, setC] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setC(true); setTimeout(() => setC(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1.5 py-0.5 border border-zinc-800 rounded"
    >{c ? '✓ copied' : 'copy'}</button>
  )
}

function SH({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-mono font-semibold text-zinc-100">{title}</h2>
      <p className="text-xs text-zinc-500 mt-1">{sub}</p>
    </div>
  )
}

const areaCls = 'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-y leading-relaxed'

// ═══════════════════════════════════════════════════════════════════════════════
// 1. JSON ↔ YAML CONVERTER
// ═══════════════════════════════════════════════════════════════════════════════

// ── Minimal YAML serializer (no external deps) ────────────────────────────────

function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)

  if (obj === null)              return 'null'
  if (typeof obj === 'boolean')  return String(obj)
  if (typeof obj === 'number')   return String(obj)
  if (typeof obj === 'string') {
    // Quote if contains special chars, starts with special, or is reserved word
    const needsQuote = /[:#\[\]{}&*!|>'"%@`,]/.test(obj) ||
      /^\s|\s$/.test(obj) ||
      obj === '' ||
      ['true','false','null','yes','no','on','off'].includes(obj.toLowerCase()) ||
      /^\d/.test(obj)
    return needsQuote ? `"${obj.replace(/"/g, '\\"')}"` : obj
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return obj.map(item => {
      const val = jsonToYaml(item, indent + 1)
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const lines = val.split('\n')
        return `${pad}- ${lines[0].trimStart()}\n${lines.slice(1).join('\n')}`
      }
      return `${pad}- ${val}`
    }).join('\n')
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    return entries.map(([k, v]) => {
      const key = /[:#\[\]{}&*!|>'"%@`,\s]/.test(k) ? `"${k}"` : k
      if (v === null || typeof v !== 'object') {
        return `${pad}${key}: ${jsonToYaml(v, indent + 1)}`
      }
      const val = jsonToYaml(v, indent + 1)
      return `${pad}${key}:\n${val}`
    }).join('\n')
  }

  return String(obj)
}

// ── Minimal YAML parser ───────────────────────────────────────────────────────

function yamlToJson(yaml: string): unknown {
  // Strip comments and parse into a JSON-able structure using a simple approach:
  // tokenize indented YAML into a recursive structure
  const lines = yaml.split('\n')
    .map(l => l.replace(/#.*$/, '')) // strip comments
    .filter(l => l.trim() !== '')

  function parseValue(raw: string): unknown {
    const v = raw.trim()
    if (v === 'null' || v === '~')   return null
    if (v === 'true' || v === 'yes' || v === 'on')  return true
    if (v === 'false' || v === 'no' || v === 'off') return false
    if (v === '') return null
    // Quoted string
    if ((v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1)
    }
    // Number
    if (!isNaN(Number(v)) && v !== '') return Number(v)
    // Inline array
    if (v.startsWith('[') && v.endsWith(']')) {
      try { return JSON.parse(v) } catch { return v }
    }
    // Inline object
    if (v.startsWith('{') && v.endsWith('}')) {
      try { return JSON.parse(v) } catch { return v }
    }
    return v
  }

  function getIndent(line: string) {
    return line.match(/^(\s*)/)?.[1].length ?? 0
  }

  function parseBlock(startIdx: number, baseIndent: number): [unknown, number] {
    const firstLine = lines[startIdx]
    const isListItem = firstLine.trim().startsWith('- ')

    // Detect if this block is a list
    let i = startIdx
    const blockLines: string[] = []
    while (i < lines.length) {
      const ind = getIndent(lines[i])
      if (ind < baseIndent && i !== startIdx) break
      blockLines.push(lines[i])
      i++
    }

    // List block
    if (blockLines.every(l => l.trim().startsWith('- ') || getIndent(l) > baseIndent)) {
      const result: unknown[] = []
      let j = 0
      while (j < blockLines.length) {
        const l = blockLines[j]
        if (l.trim().startsWith('- ')) {
          const rest = l.trim().slice(2)
          if (rest.includes(': ') || (rest === '' && j + 1 < blockLines.length)) {
            // nested object item
            const subLines = rest ? [' '.repeat(baseIndent) + rest] : []
            let k = j + 1
            while (k < blockLines.length && !blockLines[k].trim().startsWith('- ')) {
              subLines.push(blockLines[k])
              k++
            }
            const sub = parseLines(subLines, baseIndent)
            result.push(sub)
            j = k
          } else {
            result.push(parseValue(rest))
            j++
          }
        } else { j++ }
      }
      return [result, startIdx + blockLines.length]
    }

    return [parseLines(blockLines, baseIndent), startIdx + blockLines.length]
  }

  function parseLines(ls: string[], baseIndent: number): unknown {
    const result: Record<string, unknown> = {}
    let i = 0
    while (i < ls.length) {
      const line = ls[i]
      if (!line.trim()) { i++; continue }
      const ind = getIndent(line)
      if (ind < baseIndent && i !== 0) break
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        // pure list at this level
        const arr: unknown[] = []
        while (i < ls.length && ls[i].trim().startsWith('- ')) {
          arr.push(parseValue(ls[i].trim().slice(2)))
          i++
        }
        return arr
      }
      const colonIdx = trimmed.indexOf(': ')
      const endsWithColon = trimmed.endsWith(':')
      if (colonIdx !== -1 || endsWithColon) {
        const key = colonIdx !== -1 ? trimmed.slice(0, colonIdx) : trimmed.slice(0, -1)
        const valRaw = colonIdx !== -1 ? trimmed.slice(colonIdx + 2) : ''
        if (valRaw && !valRaw.startsWith('\n')) {
          result[key] = parseValue(valRaw)
          i++
        } else {
          // nested block
          const childIndent = i + 1 < ls.length ? getIndent(ls[i + 1]) : ind + 2
          const childLines: string[] = []
          let j = i + 1
          while (j < ls.length && (getIndent(ls[j]) >= childIndent || ls[j].trim() === '')) {
            childLines.push(ls[j])
            j++
          }
          result[key] = parseLines(childLines, childIndent)
          i = j
        }
      } else {
        i++
      }
    }
    // If result is empty and we got here with list-like content, return array
    return Object.keys(result).length ? result : null
  }

  try {
    const parsed = parseLines(lines, 0)
    return parsed
  } catch (e) {
    throw new Error(`YAML parse error: ${e instanceof Error ? e.message : 'invalid YAML'}`)
  }
}

export function JSONYAMLConverter() {
  const [input, setInput]     = useState('')
  const [direction, setDir]   = useState<'json2yaml' | 'yaml2json'>('json2yaml')
  const [indent, setIndent]   = useState(2)

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      if (direction === 'json2yaml') {
        const parsed = JSON.parse(input)
        return { ok: true, output: jsonToYaml(parsed) }
      } else {
        const parsed = yamlToJson(input)
        return { ok: true, output: JSON.stringify(parsed, null, indent) }
      }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Parse error' }
    }
  }, [input, direction, indent])

  const EXAMPLES = {
    json2yaml: `{\n  "name": "codeworld",\n  "version": "1.4.0",\n  "tags": ["TSCM", "forensics", "pentest"],\n  "config": {\n    "debug": false,\n    "port": 3000\n  }\n}`,
    yaml2json: `name: codeworld\nversion: 1.4.0\ntags:\n  - TSCM\n  - forensics\n  - pentest\nconfig:\n  debug: false\n  port: 3000`,
  }

  return (
    <div>
      <SH title="JSON ↔ YAML converter" sub="Convert between JSON and YAML — fully local, nothing leaves the browser" />
      <div className="space-y-4">
        {/* Direction + options */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex rounded overflow-hidden border border-zinc-700">
            {(['json2yaml', 'yaml2json'] as const).map(d => (
              <button key={d} onClick={() => { setDir(d); setInput('') }}
                className={`px-4 py-1.5 text-xs font-mono transition-colors ${direction === d ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
                {d === 'json2yaml' ? 'JSON → YAML' : 'YAML → JSON'}
              </button>
            ))}
          </div>
          {direction === 'yaml2json' && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>Indent</span>
              {[2, 4].map(n => (
                <button key={n} onClick={() => setIndent(n)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${indent === n ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{n}</button>
              ))}
            </div>
          )}
          <button onClick={() => setInput(EXAMPLES[direction])}
            className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">load example</button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                {direction === 'json2yaml' ? 'JSON input' : 'YAML input'}
              </span>
              {input && <button onClick={() => setInput('')} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">clear</button>}
            </div>
            <textarea rows={16} value={input} onChange={e => setInput(e.target.value)}
              placeholder={direction === 'json2yaml' ? '{\n  "key": "value"\n}' : 'key: value\nlist:\n  - item1\n  - item2'}
              className={areaCls} spellCheck={false} autoCapitalize="none" autoCorrect="off" />
          </div>

          {/* Output */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                {direction === 'json2yaml' ? 'YAML output' : 'JSON output'}
              </span>
              {result?.ok && result.output && <Copy text={result.output} />}
            </div>
            {result?.ok ? (
              <pre className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs font-mono text-emerald-400 overflow-auto leading-relaxed min-h-[16rem] whitespace-pre">
                {result.output}
              </pre>
            ) : result?.error ? (
              <div className="w-full bg-zinc-950 border border-red-900 rounded-lg px-4 py-3 text-xs font-mono text-red-400 min-h-[16rem]">
                <span className="text-zinc-600">Error: </span>{result.error}
              </div>
            ) : (
              <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs font-mono text-zinc-700 min-h-[16rem]">
                Output will appear here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. URL PARSER
// ═══════════════════════════════════════════════════════════════════════════════

export function URLParser() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      // Try to parse — if no scheme, prepend https:// to help
      let raw = input.trim()
      if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(raw)) raw = 'https://' + raw
      const u = new URL(raw)

      const params: { key: string; value: string }[] = []
      u.searchParams.forEach((v, k) => params.push({ key: k, value: v }))

      // Fragment params (common in SPA apps)
      const hashParams: { key: string; value: string }[] = []
      if (u.hash.startsWith('#?') || u.hash.includes('=')) {
        try {
          const hp = new URLSearchParams(u.hash.replace(/^#\??/, ''))
          hp.forEach((v, k) => hashParams.push({ key: k, value: v }))
        } catch { /* ignore */ }
      }

      // Path segments
      const segments = u.pathname.split('/').filter(Boolean)

      return {
        ok: true,
        scheme:    u.protocol.replace(':', ''),
        username:  u.username,
        password:  u.password,
        host:      u.hostname,
        port:      u.port || (u.protocol === 'https:' ? '443' : u.protocol === 'http:' ? '80' : ''),
        portExplicit: u.port,
        path:      u.pathname,
        segments,
        query:     u.search,
        params,
        fragment:  u.hash,
        hashParams,
        origin:    u.origin,
        full:      u.href,
        isDefaultPort: (u.protocol === 'https:' && (!u.port || u.port === '443')) ||
                       (u.protocol === 'http:' && (!u.port || u.port === '80')),
      }
    } catch {
      return { ok: false, error: 'Invalid URL — check syntax and try again' }
    }
  }, [input])

  const EXAMPLES = [
    'https://api.example.com:8443/v2/users/search?query=admin&limit=50&sort=desc#results',
    'https://user:p@ssw0rd@internal.corp/admin/panel?debug=true',
    'ftp://files.example.com/pub/malware/dropper.exe',
    'http://192.168.1.100:8080/cgi-bin/shell.cgi?cmd=whoami',
  ]

  function Row({ label, value, mono = true, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
    if (!value) return null
    return (
      <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/50 last:border-0">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-28 flex-shrink-0 pt-0.5">{label}</span>
        <span className={`flex-1 text-xs break-all ${mono ? 'font-mono' : ''} ${highlight ? 'text-amber-400' : 'text-zinc-300'}`}>{value}</span>
        <Copy text={value} />
      </div>
    )
  }

  return (
    <div>
      <SH title="URL parser" sub="Decompose any URL into its components — scheme, host, path, query params, fragment" />
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">URL</span>
            {input && <button onClick={() => setInput('')} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">clear</button>}
          </div>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="https://example.com/path?query=value#fragment"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-500"
            spellCheck={false} autoCapitalize="none" autoCorrect="off" />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setInput(ex)}
                className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors truncate max-w-xs">
                {ex.slice(0, 50)}{ex.length > 50 ? '…' : ''}
              </button>
            ))}
          </div>
        </div>

        {result?.ok && result.scheme && (
          <div className="space-y-4">
            {/* Core fields */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Components</span>
              </div>
              <div className="px-4">
                <Row label="Scheme"   value={result.scheme} />
                <Row label="Host"     value={result.host} />
                <Row label="Port"     value={result.portExplicit ? result.portExplicit : `${result.port} (default)`} highlight={!!result.portExplicit} />
                <Row label="Origin"   value={result.origin} />
                <Row label="Path"     value={result.path} />
                <Row label="Query"    value={result.query} />
                <Row label="Fragment" value={result.fragment} />
                {result.username && <Row label="Username" value={result.username} highlight />}
                {result.password && <Row label="Password" value={result.password} highlight />}
              </div>
            </div>

            {/* Path segments */}
            {result.segments.length > 0 && (
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Path segments</span>
                </div>
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {result.segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs font-mono">
                      <span className="text-zinc-700">/</span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{seg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Query params */}
            {result.params.length > 0 && (
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Query parameters ({result.params.length})</span>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {result.params.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <code className="text-xs font-mono text-emerald-400 w-32 flex-shrink-0">{p.key}</code>
                      <span className="text-zinc-600 flex-shrink-0">=</span>
                      <code className="text-xs font-mono text-zinc-300 flex-1 break-all">{decodeURIComponent(p.value)}</code>
                      {p.value !== decodeURIComponent(p.value) && (
                        <code className="text-[10px] font-mono text-zinc-600">(raw: {p.value})</code>
                      )}
                      <Copy text={p.value} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Credentials warning */}
            {(result.username || result.password) && (
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 text-xs font-mono text-amber-400">
                ⚠ Credentials embedded in URL — username and/or password are in plaintext in the URL. These will appear in server access logs, browser history, and referrer headers.
              </div>
            )}

            {/* Non-standard port note */}
            {result.portExplicit && (
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-3 text-xs font-mono text-blue-400">
                Non-standard port {result.portExplicit} — may indicate a dev/test server, proxy, or non-standard service. Default for {result.scheme} is {result.scheme === 'https' ? '443' : result.scheme === 'http' ? '80' : 'scheme-dependent'}.
              </div>
            )}
          </div>
        )}

        {result && !result.ok && (
          <div className="border border-red-900 bg-red-950/20 rounded-lg p-4 text-xs font-mono text-red-400">
            {result.error}
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CRON EXPRESSION VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════

function parseCron(expr: string): { valid: boolean; error?: string; parts?: string[]; human?: string; next?: Date[] } {
  const trimmed = expr.trim()
  const parts = trimmed.split(/\s+/)

  if (parts.length < 5 || parts.length > 6) {
    return { valid: false, error: `Expected 5 fields (min hour dom month dow) or 6 with seconds. Got ${parts.length}.` }
  }

  // Use 5-field standard cron (strip optional seconds)
  const [min, hour, dom, month, dow] = parts.length === 6 ? parts.slice(1) : parts

  function describeField(val: string, unit: string, names?: string[]): string {
    if (val === '*') return `every ${unit}`
    if (val.startsWith('*/')) {
      const step = val.slice(2)
      return `every ${step} ${unit}s`
    }
    if (val.includes('-') && val.includes('/')) {
      const [range, step] = val.split('/')
      const [start, end] = range.split('-')
      const s = names ? (names[+start] ?? start) : start
      const e = names ? (names[+end] ?? end) : end
      return `every ${step} ${unit}s from ${s} to ${e}`
    }
    if (val.includes('-')) {
      const [start, end] = val.split('-')
      const s = names ? (names[+start] ?? start) : start
      const e = names ? (names[+end] ?? end) : end
      return `from ${s} to ${e}`
    }
    if (val.includes(',')) {
      const items = val.split(',').map(v => names ? (names[+v] ?? v) : v)
      return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1]
    }
    // Single value
    if (names && !isNaN(+val)) return names[+val] ?? val
    return val
  }

  const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  const parts_desc = {
    min:   describeField(min,   'minute'),
    hour:  describeField(hour,  'hour'),
    dom:   describeField(dom,   'day of month'),
    month: describeField(month, 'month', MONTHS),
    dow:   describeField(dow,   'day of week', DAYS),
  }

  // Build human readable
  let human = 'Runs '

  if (min === '0' && hour === '0' && dom === '*' && month === '*' && dow === '*') {
    human = 'Runs at midnight every day'
  } else if (min === '0' && hour === '0' && dom === '1' && month === '*' && dow === '*') {
    human = 'Runs at midnight on the first of every month'
  } else if (min === '0' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    human = 'Runs at the start of every hour'
  } else if (min === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    human = 'Runs every minute'
  } else {
    const timePart = (() => {
      if (min === '0' && !hour.includes('*') && !hour.includes('/') && !hour.includes(',') && !hour.includes('-')) {
        const h = +hour
        const ampm = h < 12 ? 'AM' : 'PM'
        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
        return `at ${h12}:00 ${ampm}`
      }
      if (!min.includes('*') && !hour.includes('*') && !min.includes('/') && !hour.includes('/')) {
        const h = +hour, m = +min
        if (!isNaN(h) && !isNaN(m)) {
          const ampm = h < 12 ? 'AM' : 'PM'
          const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
          return `at ${h12}:${String(m).padStart(2,'0')} ${ampm}`
        }
      }
      return `at minute ${parts_desc.min} of hour ${parts_desc.hour}`
    })()

    const datePart = (() => {
      if (dom === '*' && dow === '*') return month === '*' ? 'every day' : `in ${parts_desc.month}`
      if (dom !== '*' && dow === '*') return `on day ${dom} of ${month === '*' ? 'every month' : parts_desc.month}`
      if (dom === '*' && dow !== '*') return `on ${parts_desc.dow}${month !== '*' ? ` in ${parts_desc.month}` : ''}`
      return `on day ${dom} and on ${parts_desc.dow}${month !== '*' ? ` in ${parts_desc.month}` : ''}`
    })()

    human = `Runs ${timePart}, ${datePart}`
  }

  // Generate next 5 run times (approximate — no external lib)
  function getNextRuns(count = 5): Date[] {
    const results: Date[] = []
    const now = new Date()
    const limit = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // search up to 1 year ahead
    const d = new Date(now)
    d.setSeconds(0, 0)
    d.setMinutes(d.getMinutes() + 1) // start from next minute

    function matches(d: Date): boolean {
      const m = d.getMonth() + 1
      const dom_ = d.getDate()
      const dow_ = d.getDay()
      const h = d.getHours()
      const min_ = d.getMinutes()

      function matchField(val: string, actual: number): boolean {
        if (val === '*') return true
        if (val.startsWith('*/')) return actual % +val.slice(2) === 0
        if (val.includes(',')) return val.split(',').some(v => +v === actual)
        if (val.includes('-') && !val.includes('/')) {
          const [lo, hi] = val.split('-').map(Number)
          return actual >= lo && actual <= hi
        }
        if (val.includes('/')) {
          const [range, step] = val.split('/')
          const [lo, hi] = range.includes('-') ? range.split('-').map(Number) : [0, 59]
          return actual >= lo && actual <= hi && (actual - lo) % +step === 0
        }
        return +val === actual
      }

      return matchField(min, min_) && matchField(hour, h) &&
             matchField(dom, dom_) && matchField(month, m) && matchField(dow, dow_)
    }

    while (results.length < count && d < limit) {
      if (matches(d)) results.push(new Date(d))
      d.setMinutes(d.getMinutes() + 1)
    }
    return results
  }

  let next: Date[] = []
  try { next = getNextRuns(5) } catch { /* ignore */ }

  return { valid: true, parts: [min, hour, dom, month, dow], human, next }
}

const CRON_EXAMPLES = [
  { label: 'Every minute',       expr: '* * * * *' },
  { label: 'Every hour',         expr: '0 * * * *' },
  { label: 'Every day midnight', expr: '0 0 * * *' },
  { label: 'Every Monday 9am',   expr: '0 9 * * 1' },
  { label: 'Every 15 minutes',   expr: '*/15 * * * *' },
  { label: 'Weekdays 8am-5pm',   expr: '0 8-17 * * 1-5' },
  { label: '1st of month',       expr: '0 0 1 * *' },
  { label: 'Twice daily',        expr: '0 6,18 * * *' },
]

const FIELD_LABELS = ['Minute', 'Hour', 'Day (month)', 'Month', 'Day (week)']
const FIELD_RANGES = ['0-59', '0-23', '1-31', '1-12', '0-6 (Sun=0)']

export function CronVisualizer() {
  const [input, setInput] = useState('0 9 * * 1-5')

  const result = useMemo(() => parseCron(input), [input])

  return (
    <div>
      <SH title="Cron expression visualizer" sub="Translate cron schedules into plain English and preview next run times" />
      <div className="space-y-4">
        {/* Input */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Cron expression</span>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="* * * * *"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-lg font-mono text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 tracking-widest"
            spellCheck={false} autoCapitalize="none" autoCorrect="off" />
          {/* Field labels */}
          <div className="grid grid-cols-5 gap-1 px-4">
            {FIELD_LABELS.map((label, i) => (
              <div key={i} className="text-center">
                <div className="text-[9px] font-mono text-zinc-600">{label}</div>
                <div className="text-[9px] font-mono text-zinc-700">{FIELD_RANGES[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="flex flex-wrap gap-1.5">
          {CRON_EXAMPLES.map(ex => (
            <button key={ex.expr} onClick={() => setInput(ex.expr)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${input === ex.expr ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
              {ex.label}
            </button>
          ))}
        </div>

        {/* Result */}
        {input.trim() && (
          result.valid ? (
            <div className="space-y-3">
              {/* Human readable */}
              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-4">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">Plain English</div>
                <p className="text-sm font-mono text-emerald-300 leading-relaxed">{result.human}</p>
              </div>

              {/* Field breakdown */}
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Field breakdown</span>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {result.parts!.map((part, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-[10px] font-mono text-zinc-600 w-24 flex-shrink-0">{FIELD_LABELS[i]}</span>
                      <code className={`text-sm font-mono font-bold w-16 flex-shrink-0 ${part === '*' ? 'text-zinc-600' : 'text-amber-400'}`}>{part}</code>
                      <span className="text-xs font-mono text-zinc-400">{FIELD_RANGES[i]}</span>
                      <span className="text-xs font-mono text-zinc-500 flex-1 text-right">{
                        part === '*' ? 'any' :
                        part.startsWith('*/') ? `every ${part.slice(2)}` :
                        part.includes(',') ? part.split(',').join(', ') :
                        part.includes('-') ? `${part.split('-')[0]} through ${part.split('-')[1]}` :
                        part
                      }</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next runs */}
              {result.next && result.next.length > 0 && (
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Next {result.next.length} runs (local time)</span>
                  </div>
                  <div className="divide-y divide-zinc-800/50">
                    {result.next.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                        <span className="text-[10px] font-mono text-zinc-700 w-4">{i + 1}</span>
                        <span className="text-xs font-mono text-zinc-300">
                          {d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 ml-auto">
                          {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Forensic note for suspicious crons */}
              {(input.includes('*/1') || input === '* * * * *') && (
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 text-xs font-mono text-amber-400">
                  ⚠ Every-minute schedule — high frequency cron jobs are a common malware persistence technique. If encountered during forensic review, verify the associated command/script.
                </div>
              )}
            </div>
          ) : (
            <div className="border border-red-900 bg-red-950/20 rounded-lg p-4 text-xs font-mono text-red-400">
              <span className="font-bold">Invalid: </span>{result.error}
            </div>
          )
        )}

        {/* Quick reference */}
        <details className="border border-zinc-800 rounded-lg overflow-hidden">
          <summary className="px-4 py-2.5 bg-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors">
            Cron syntax reference
          </summary>
          <div className="px-4 py-3 space-y-1.5 text-xs font-mono">
            {[
              ['*',     'Any value (wildcard)'],
              ['*/n',   'Every n units (step value)'],
              ['n-m',   'Range from n to m'],
              ['n,m',   'List — n and m'],
              ['n-m/s', 'Range n to m, every s steps'],
            ].map(([syntax, desc]) => (
              <div key={syntax} className="flex gap-3">
                <code className="text-emerald-400 w-16 flex-shrink-0">{syntax}</code>
                <span className="text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}
