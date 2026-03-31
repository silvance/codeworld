'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedHop {
  hop: number
  from?: string
  by?: string
  via?: string
  with?: string
  ips?: string[]
  timestamp_raw?: string
  timestamp_parsed?: string
  raw: string
  delaySeconds?: number
}

interface SecurityFlag {
  severity: 'HIGH' | 'MED' | 'LOW'
  flag: string
  detail: string
}

interface AnalysisResult {
  summary: {
    from: string
    to: string
    subject: string
    date: string
    messageId: string
    returnPath: string
    replyTo: string
    xMailer: string
    xOriginatingIP: string
    externalIPs: string[]
    contentType: string
    mimeVersion: string
  }
  authentication: {
    spf: string
    dkim: string
    dmarc: string
    dkimDomain: string
    fromDomain: string
    authResultsRaw: string
    alignmentIssues: string[]
  }
  routing: ParsedHop[]
  timing: {
    hopCount: number
    totalTransitSeconds: number | null
  }
  flags: SecurityFlag[]
  allHeaders: { name: string; value: string }[]
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseHeaders(raw: string): Map<string, string[]> {
  const map = new Map<string, string[]>()
  // Unfold (join continuation lines)
  const unfolded = raw.replace(/\r\n([ \t])/g, ' $1').replace(/\n([ \t])/g, ' $1')
  const lines = unfolded.split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/)
    if (m) {
      const key = m[1].toLowerCase()
      const val = m[2].trim()
      const existing = map.get(key) || []
      existing.push(val)
      map.set(key, existing)
    }
  }
  return map
}

function get(map: Map<string, string[]>, key: string): string {
  return (map.get(key.toLowerCase()) || [])[0] || ''
}

function getAll(map: Map<string, string[]>, key: string): string[] {
  return map.get(key.toLowerCase()) || []
}

function extractDomain(email: string): string {
  const m = email.match(/@([\w.-]+)/)
  return m ? m[1].toLowerCase() : ''
}

function isPrivateIP(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number)
  return a === 10 || a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
}

function parseReceivedHop(raw: string, index: number): ParsedHop {
  const hop: ParsedHop = { hop: index + 1, raw }

  const fromM = raw.match(/from\s+(\S+(?:\s+\([^)]+\))?)/i)
  if (fromM) hop.from = fromM[1].trim()

  const byM = raw.match(/by\s+(\S+)/i)
  if (byM) hop.by = byM[1].trim()

  const viaM = raw.match(/via\s+(\S+)/i)
  if (viaM) hop.via = viaM[1].trim()

  const withM = raw.match(/with\s+(\S+)/i)
  if (withM) hop.with = withM[1].trim()

  const ips = [...raw.matchAll(/\[(\d{1,3}(?:\.\d{1,3}){3})\]/g)].map(m => m[1])
  if (ips.length) hop.ips = ips

  // Timestamp after final semicolon
  const tsM = raw.match(/;\s*(.+)$/)
  if (tsM) {
    hop.timestamp_raw = tsM[1].trim()
    try {
      const d = new Date(hop.timestamp_raw)
      if (!isNaN(d.getTime())) hop.timestamp_parsed = d.toISOString()
    } catch { /* ignore */ }
  }

  return hop
}

function authValue(authResults: string, key: string): string {
  const m = authResults.match(new RegExp(`${key}=(\\w+)`, 'i'))
  return m ? m[1].toUpperCase() : 'NOT FOUND'
}

function analyze(raw: string): AnalysisResult {
  const map = parseHeaders(raw)

  const fromAddr    = get(map, 'from')
  const toAddr      = get(map, 'to')
  const subject     = get(map, 'subject')
  const date        = get(map, 'date')
  const messageId   = get(map, 'message-id')
  const returnPath  = get(map, 'return-path')
  const replyTo     = get(map, 'reply-to')
  const xMailer     = get(map, 'x-mailer') || get(map, 'user-agent')
  const xOrigIP     = get(map, 'x-originating-ip') || get(map, 'x-source-ip')
  const authResults = get(map, 'authentication-results')
  const contentType = get(map, 'content-type')
  const mimeVersion = get(map, 'mime-version')

  const spf  = authValue(authResults, 'spf')
  const dkim = authValue(authResults, 'dkim')
  const dmarc = authValue(authResults, 'dmarc')

  const dkimDomM = authResults.match(/dkim=\w+[^;]*d=([\w.-]+)/i)
  const dkimDomain = dkimDomM ? dkimDomM[1].toLowerCase() : ''
  const fromDomain = extractDomain(fromAddr)

  // Alignment checks
  const alignmentIssues: string[] = []
  const rpDomain = extractDomain(returnPath)
  if (rpDomain && fromDomain && rpDomain !== fromDomain &&
      !fromDomain.endsWith('.' + rpDomain) && !rpDomain.endsWith('.' + fromDomain)) {
    alignmentIssues.push(`SPF misalignment: From domain (${fromDomain}) ≠ Return-Path domain (${rpDomain})`)
  }
  if (dkimDomain && fromDomain && dkimDomain !== fromDomain &&
      !fromDomain.endsWith('.' + dkimDomain) && !dkimDomain.endsWith('.' + fromDomain)) {
    alignmentIssues.push(`DKIM misalignment: From domain (${fromDomain}) ≠ DKIM d= (${dkimDomain})`)
  }

  // Routing
  const receivedRaw = getAll(map, 'received').reverse()
  const routing = receivedRaw.map((r, i) => parseReceivedHop(r, i))

  // Compute inter-hop delays
  for (let i = 1; i < routing.length; i++) {
    const prev = routing[i - 1].timestamp_parsed
    const curr = routing[i].timestamp_parsed
    if (prev && curr) {
      const diff = Math.round((new Date(curr).getTime() - new Date(prev).getTime()) / 1000)
      routing[i].delaySeconds = diff
    }
  }

  // Total transit
  const timestamps = routing.filter(h => h.timestamp_parsed).map(h => new Date(h.timestamp_parsed!).getTime())
  const totalTransitSeconds = timestamps.length >= 2
    ? Math.round((timestamps[timestamps.length - 1] - timestamps[0]) / 1000) : null

  // External IPs from routing
  const externalIPs = [...new Set(
    routing.flatMap(h => h.ips || []).filter(ip => !isPrivateIP(ip))
  )]

  // Security flags
  const flags: SecurityFlag[] = []

  const failStates = ['FAIL', 'SOFTFAIL', 'NONE', 'PERMERROR', 'TEMPERROR']
  for (const [check, name] of [[spf,'SPF'],[dkim,'DKIM'],[dmarc,'DMARC']]) {
    if (failStates.includes(check as string)) {
      flags.push({ severity: 'HIGH', flag: `${name} ${check}`, detail: `Authentication failure: ${name} returned ${check}` })
    } else if (check === 'NOT FOUND') {
      flags.push({ severity: 'MED', flag: `${name} not present`, detail: `No ${name} result in Authentication-Results header` })
    }
  }

  for (const issue of alignmentIssues) {
    flags.push({ severity: 'HIGH', flag: 'Domain misalignment', detail: issue })
  }

  // Reply-To mismatch
  if (replyTo) {
    const rtDomain = extractDomain(replyTo)
    if (fromDomain && rtDomain && fromDomain !== rtDomain) {
      flags.push({ severity: 'HIGH', flag: 'Reply-To mismatch',
        detail: `Reply-To domain (${rtDomain}) differs from From domain (${fromDomain}) — possible phishing redirect` })
    }
  }

  // Message-ID domain check
  const midDomM = messageId.match(/@([\w.-]+)>/)
  if (midDomM) {
    const midDomain = midDomM[1].toLowerCase()
    if (fromDomain && midDomain !== fromDomain && !fromDomain.endsWith('.' + midDomain)) {
      flags.push({ severity: 'MED', flag: 'Message-ID domain mismatch',
        detail: `Message-ID domain (${midDomain}) differs from From domain (${fromDomain})` })
    }
  }

  // X-Mailer
  if (xMailer && /phpmailer|mass.?mail|bulk|sendgrid|mailchimp/i.test(xMailer)) {
    flags.push({ severity: 'LOW', flag: 'Bulk/marketing mailer detected',
      detail: `X-Mailer: ${xMailer}` })
  }

  // Suspicious routing (too many hops)
  if (routing.length > 8) {
    flags.push({ severity: 'MED', flag: 'Excessive routing hops',
      detail: `${routing.length} hops is unusual — may indicate obfuscation or mail loop` })
  }

  // All headers for raw view
  const allHeaders: { name: string; value: string }[] = []
  for (const [key, vals] of map.entries()) {
    for (const v of vals) allHeaders.push({ name: key, value: v })
  }

  return {
    summary: { from: fromAddr, to: toAddr, subject, date, messageId, returnPath, replyTo, xMailer, xOriginatingIP: xOrigIP, externalIPs, contentType, mimeVersion },
    authentication: { spf, dkim, dmarc, dkimDomain, fromDomain, authResultsRaw: authResults, alignmentIssues },
    routing,
    timing: { hopCount: routing.length, totalTransitSeconds },
    flags,
    allHeaders,
  }
}

// ─── UI components ────────────────────────────────────────────────────────────

function AuthBadge({ value }: { value: string }) {
  const cls = value === 'PASS'
    ? 'bg-emerald-950 text-emerald-400 border-emerald-900'
    : ['FAIL', 'SOFTFAIL'].includes(value)
    ? 'bg-red-950 text-red-400 border-red-900'
    : value === 'NOT FOUND'
    ? 'bg-zinc-800 text-zinc-500 border-zinc-700'
    : 'bg-amber-950 text-amber-400 border-amber-900'
  const icon = value === 'PASS' ? '✓' : ['FAIL','SOFTFAIL'].includes(value) ? '✗' : '?'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-bold rounded border ${cls}`}>
      {icon} {value}
    </span>
  )
}

function SevBadge({ sev }: { sev: string }) {
  const map: Record<string,string> = {
    HIGH: 'bg-red-950 text-red-400',
    MED:  'bg-amber-950 text-amber-400',
    LOW:  'bg-zinc-800 text-zinc-400',
  }
  return <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${map[sev]}`}>{sev}</span>
}

function Copy({ text }: { text: string }) {
  const [c, setC] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setC(true); setTimeout(() => setC(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1 flex-shrink-0"
    >{c ? '✓' : 'copy'}</button>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const EXAMPLE = `Received: from mail-oa1-f41.google.com (mail-oa1-f41.google.com [209.85.160.41])
        by mx.example.com with ESMTPS id abc123
        for <recipient@example.com>;
        Mon, 15 Jan 2024 10:23:45 -0500
Received: from [192.168.1.5] (unknown [10.0.0.1])
        by smtp.gmail.com with ESMTPSA id xyz789;
        Mon, 15 Jan 2024 07:23:44 -0800
Authentication-Results: mx.example.com;
    spf=pass (google.com: domain of sender@gmail.com designates 209.85.160.41 as permitted sender) smtp.mailfrom=sender@gmail.com;
    dkim=pass header.i=@gmail.com header.s=20230601 header.b=abcDEFg;
    dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com
From: "John Doe" <sender@gmail.com>
To: recipient@example.com
Subject: Test email for header analysis
Date: Mon, 15 Jan 2024 10:23:44 -0500
Message-ID: <CAabc123@mail.gmail.com>
MIME-Version: 1.0
Content-Type: text/plain; charset="UTF-8"
X-Mailer: Gmail`

// ─── How to use instructions ──────────────────────────────────────────────────

const clients = [
  {
    name: 'Gmail (web)',
    icon: '📧',
    steps: [
      'Open the email in Gmail',
      'Click the three-dot menu (⋮) at the top-right of the message',
      'Select "Show original"',
      'A new tab opens showing the full raw message',
      'Click "Copy to clipboard" at the top of that page',
      'Paste into the analyzer below',
    ],
    note: 'The "Copy to clipboard" button in Gmail copies only the headers — perfect for this tool.',
  },
  {
    name: 'Outlook (web)',
    icon: '📬',
    steps: [
      'Open the email in Outlook on the web (outlook.com or Microsoft 365)',
      'Click the three-dot menu (…) at the top of the message',
      'Select "View" → "View message source" (or "View email source")',
      'A dialog appears with the full raw source',
      'Select all text (Ctrl+A / Cmd+A) and copy',
      'Paste into the analyzer — it will find and parse the headers automatically',
    ],
    note: 'If you only need headers (not the body), paste the full source anyway — the analyzer extracts just the headers.',
  },
  {
    name: 'Outlook (desktop)',
    icon: '🖥',
    steps: [
      'Open the email in Outlook desktop',
      'Go to File → Properties (or press Alt+Enter)',
      'The "Internet headers" box at the bottom shows the raw headers',
      'Click inside the box, select all (Ctrl+A), and copy',
      'Paste into the analyzer below',
    ],
    note: 'Windows only. On Mac, open the message in a separate window, then go to View → Message → All Headers.',
  },
  {
    name: 'Apple Mail (Mac)',
    icon: '🍎',
    steps: [
      'Open the email in Apple Mail',
      'From the menu bar: View → Message → All Headers (or press Shift+Cmd+H)',
      'The headers appear above the message body',
      'Go to View → Message → Raw Source to see the full raw text',
      'Select all, copy, and paste into the analyzer',
    ],
    note: 'Alternatively: with the message selected, hold Option and click View menu to reveal "Raw Source".',
  },
  {
    name: 'Thunderbird',
    icon: '🦅',
    steps: [
      'Open the email in Thunderbird',
      'From the menu: View → Message Source (or Ctrl+U / Cmd+U)',
      'A new window opens with the full raw message',
      'Select all (Ctrl+A) and copy',
      'Paste into the analyzer — headers are at the top before the blank line',
    ],
  },
  {
    name: 'Python script (offline)',
    icon: '🐍',
    steps: [
      'Download the Python script using the button in the header above',
      'Requires Python 3.6+ — check with: python3 --version (Mac/Linux) or python --version (Windows)',
      'Save the raw email headers to a .txt file (use the steps above to copy them first)',
      'Run: python3 email_header_analyzer.py headers.txt',
      'On Windows: open Command Prompt or PowerShell, navigate to the folder, run: python email_header_analyzer.py headers.txt',
      'Results print to the terminal — add > output.txt to save to a file',
    ],
    note: 'The Python script is useful for batch analysis or when you cannot use a browser. No internet connection required — fully offline.',
    windowsNote: 'Windows users: if "python" is not recognized, try "python3" or "py". If Python is not installed, download it from python.org — check "Add Python to PATH" during install.',
  },
]

function HowToUse() {
  const [open, setOpen] = useState(false)
  const [activeClient, setActiveClient] = useState(clients[0].name)
  const client = clients.find(c => c.name === activeClient)!

  return (
    <div className="mb-6 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">💡</span>
          <span className="text-xs font-mono font-semibold text-zinc-300">How to get email headers</span>
          <span className="text-[10px] font-mono text-zinc-600">Gmail · Outlook · Apple Mail · Thunderbird · Python script</span>
        </div>
        <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-zinc-800 p-4">
          {/* Client tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {clients.map(c => (
              <button
                key={c.name}
                onClick={() => setActiveClient(c.name)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors flex items-center gap-1.5 ${
                  activeClient === c.name ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>{c.icon}</span>{c.name}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {client.steps.map((step, i) => (
              <div key={i} className="flex gap-3 text-xs font-mono">
                <span className="text-zinc-700 flex-shrink-0 w-4 text-right">{i + 1}.</span>
                <span className="text-zinc-400">{step}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {client.note && (
            <div className="mt-3 bg-blue-950/20 border border-blue-900/30 rounded p-3 text-xs font-mono text-blue-400">
              {client.note}
            </div>
          )}
          {client.windowsNote && (
            <div className="mt-2 bg-amber-950/20 border border-amber-900/30 rounded p-3 text-xs font-mono text-amber-400">
              <span className="font-bold">Windows note: </span>{client.windowsNote}
            </div>
          )}

          <p className="mt-4 text-[10px] font-mono text-zinc-700">
            Once you have the headers copied, paste them into the box below. The analyzer will detect and parse them automatically.
          </p>
        </div>
      )}
    </div>
  )
}

export default function EmailAnalyzer() {
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<'summary' | 'auth' | 'routing' | 'flags' | 'raw'>('summary')
  const [showRaw, setShowRaw] = useState<number | null>(null)

  const result = useMemo<AnalysisResult | null>(() => {
    if (!input.trim() || input.trim().split('\n').length < 3) return null
    try { return analyze(input) } catch { return null }
  }, [input])

  const flagCount = result?.flags.length ?? 0
  const highCount = result?.flags.filter(f => f.severity === 'HIGH').length ?? 0

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6 pb-5 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-mono font-semibold text-zinc-100 mb-1">Email header analyzer</h1>
              <p className="text-xs font-mono text-zinc-500">
                Paste raw email headers — SPF/DKIM/DMARC, routing chain, domain alignment, phishing indicators.
                All analysis is local — nothing leaves the browser.
              </p>
            </div>
            <a
              href="/email_header_analyzer.py"
              download="email_header_analyzer.py"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-700 rounded hover:border-zinc-500 hover:text-zinc-200 transition-colors flex-shrink-0"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M8 12L3 7h3V1h4v6h3L8 12zM1 14h14v1H1z"/>
              </svg>
              Download Python script
            </a>
          </div>
        </div>

        {/* How to use */}
        <HowToUse />

        {/* Input */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Raw email headers</span>
            <div className="flex gap-2">
              {input && (
                <button onClick={() => setInput('')} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">clear</button>
              )}
              <button onClick={() => setInput(EXAMPLE)} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">load example</button>
            </div>
          </div>
          <textarea
            rows={10}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Paste raw email headers here...\n\nReceived: from mail.example.com ([203.0.113.1])\n        by mx.destination.com with ESMTP\nAuthentication-Results: mx.destination.com;\n    spf=pass smtp.mailfrom=sender@example.com;\n    dkim=pass header.i=@example.com;\nFrom: sender@example.com\nTo: recipient@example.com\nSubject: Your subject here\nDate: Mon, 15 Jan 2024 10:00:00 +0000\nMessage-ID: <unique-id@example.com>`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
          {input && !result && (
            <p className="text-xs font-mono text-amber-500">Paste at least 3 header lines to begin analysis.</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Flags banner */}
            {flagCount > 0 && (
              <div className={`border rounded-lg p-4 flex items-start gap-3 ${highCount > 0 ? 'bg-red-950/20 border-red-900' : 'bg-amber-950/20 border-amber-900'}`}>
                <span className="text-lg">{highCount > 0 ? '🚨' : '⚠️'}</span>
                <div>
                  <div className={`text-sm font-mono font-bold mb-1 ${highCount > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                    {flagCount} security flag{flagCount !== 1 ? 's' : ''} detected
                    {highCount > 0 && ` — ${highCount} HIGH severity`}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.flags.map((f, i) => (
                      <span key={i} className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        f.severity === 'HIGH' ? 'bg-red-950 text-red-400 border-red-900' : 'bg-amber-950 text-amber-400 border-amber-900'
                      }`}>{f.flag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {flagCount === 0 && (
              <div className="border border-emerald-900 bg-emerald-950/20 rounded-lg p-3 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-xs font-mono text-emerald-400">No security flags raised — SPF/DKIM/DMARC pass, no misalignment detected</span>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-zinc-800 flex gap-1 flex-wrap">
              {(['summary','auth','routing','flags','raw'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 -mb-px ${
                    tab === t ? 'border-emerald-600 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}>
                  {t === 'auth' ? 'Authentication' : t === 'routing' ? `Routing (${result.routing.length})` : t === 'flags' ? `Flags (${flagCount})` : t === 'raw' ? 'All headers' : 'Summary'}
                </button>
              ))}
            </div>

            {/* Summary tab */}
            {tab === 'summary' && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="border border-zinc-800 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Envelope</span>
                  </div>
                  <div className="px-4 divide-y divide-zinc-800/50">
                    {[
                      ['From', result.summary.from],
                      ['To', result.summary.to],
                      ['Subject', result.summary.subject],
                      ['Date', result.summary.date],
                      ['Message-ID', result.summary.messageId],
                      ['Return-Path', result.summary.returnPath],
                      ['Reply-To', result.summary.replyTo],
                      ['X-Mailer', result.summary.xMailer],
                      ['Orig IP', result.summary.xOriginatingIP],
                      ['Content-Type', result.summary.contentType],
                    ].filter(([,v]) => v).map(([label, value]) => (
                      <div key={label} className="flex items-start gap-3 py-2.5">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
                        <span className="text-xs font-mono text-zinc-200 flex-1 break-all">{value}</span>
                        <Copy text={value} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-3">Quick auth</div>
                    {[['SPF', result.authentication.spf], ['DKIM', result.authentication.dkim], ['DMARC', result.authentication.dmarc]].map(([name, val]) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-500 w-16">{name}</span>
                        <AuthBadge value={val} />
                      </div>
                    ))}
                  </div>
                  {result.summary.externalIPs.length > 0 && (
                    <div className="border border-zinc-800 rounded-lg p-4">
                      <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-2">External IPs in routing</div>
                      {result.summary.externalIPs.map(ip => (
                        <div key={ip} className="flex items-center gap-2 py-1">
                          <code className="text-xs font-mono text-blue-400 flex-1">{ip}</code>
                          <Copy text={ip} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border border-zinc-800 rounded-lg p-4">
                    <div className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-2">Routing summary</div>
                    <div className="text-xs font-mono text-zinc-400">
                      {result.timing.hopCount} hop{result.timing.hopCount !== 1 ? 's' : ''}
                      {result.timing.totalTransitSeconds !== null && (
                        <> · {result.timing.totalTransitSeconds}s total transit
                          {result.timing.totalTransitSeconds > 300 && <span className="text-amber-400"> (slow)</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auth tab */}
            {tab === 'auth' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { name: 'SPF', value: result.authentication.spf, desc: 'Sender Policy Framework — validates sending server IP against domain DNS records' },
                    { name: 'DKIM', value: result.authentication.dkim, desc: `DomainKeys Identified Mail — cryptographic signature (domain: ${result.authentication.dkimDomain || 'n/a'})` },
                    { name: 'DMARC', value: result.authentication.dmarc, desc: 'Domain-based Message Auth — policy enforcement on SPF/DKIM alignment' },
                  ].map(item => (
                    <div key={item.name} className="border border-zinc-800 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono font-bold text-zinc-200">{item.name}</span>
                        <AuthBadge value={item.value} />
                      </div>
                      <p className="text-[11px] font-mono text-zinc-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {result.authentication.alignmentIssues.length > 0 && (
                  <div className="border border-red-900 bg-red-950/20 rounded-lg p-4 space-y-2">
                    <div className="text-xs font-mono font-bold text-red-400 mb-2">Domain alignment issues</div>
                    {result.authentication.alignmentIssues.map((issue, i) => (
                      <div key={i} className="flex gap-2 text-xs font-mono text-red-400">
                        <span>⚠</span>{issue}
                      </div>
                    ))}
                  </div>
                )}

                {result.authentication.authResultsRaw && (
                  <div className="border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                      <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Raw Authentication-Results</span>
                    </div>
                    <pre className="px-4 py-3 text-[11px] font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all">{result.authentication.authResultsRaw}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Routing tab */}
            {tab === 'routing' && (
              <div className="space-y-3">
                <p className="text-[11px] font-mono text-zinc-600">Received headers reversed to show true delivery path: originating server → final destination.</p>
                {result.routing.map((hop, i) => (
                  <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-zinc-500">HOP {hop.hop}</span>
                      {hop.timestamp_parsed && (
                        <span className="text-[11px] font-mono text-zinc-600">{new Date(hop.timestamp_parsed).toUTCString()}</span>
                      )}
                      {hop.delaySeconds !== undefined && (
                        <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${hop.delaySeconds > 60 ? 'bg-amber-950 text-amber-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          +{hop.delaySeconds}s
                        </span>
                      )}
                    </div>
                    <div className="px-4 py-3 space-y-1.5">
                      {hop.from && (
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-zinc-600 w-8 flex-shrink-0">from</span>
                          <span className="text-zinc-300 flex-1 break-all">{hop.from}</span>
                        </div>
                      )}
                      {hop.by && (
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-zinc-600 w-8 flex-shrink-0">by</span>
                          <span className="text-zinc-300 flex-1 break-all">{hop.by}</span>
                        </div>
                      )}
                      {hop.with && (
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-zinc-600 w-8 flex-shrink-0">with</span>
                          <span className="text-zinc-300">{hop.with}</span>
                        </div>
                      )}
                      {hop.ips && (
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-zinc-600 w-8 flex-shrink-0">IPs</span>
                          <div className="flex flex-wrap gap-2">
                            {hop.ips.map(ip => (
                              <span key={ip} className={`px-1.5 py-0.5 rounded text-[11px] ${isPrivateIP(ip) ? 'bg-zinc-800 text-zinc-500' : 'bg-blue-950 text-blue-400'}`}>{ip}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <button onClick={() => setShowRaw(showRaw === i ? null : i)}
                        className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors mt-1">
                        {showRaw === i ? '▲ hide raw' : '▼ show raw'}
                      </button>
                      {showRaw === i && (
                        <pre className="mt-2 bg-zinc-950 rounded p-3 text-[11px] font-mono text-zinc-500 overflow-x-auto whitespace-pre-wrap break-all">{hop.raw}</pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Flags tab */}
            {tab === 'flags' && (
              <div className="space-y-3">
                {flagCount === 0 && (
                  <div className="text-xs font-mono text-zinc-500 py-4 text-center">No security flags raised.</div>
                )}
                {result.flags.map((f, i) => (
                  <div key={i} className={`border rounded-lg p-4 space-y-1.5 ${f.severity === 'HIGH' ? 'border-red-900 bg-red-950/15' : f.severity === 'MED' ? 'border-amber-900 bg-amber-950/15' : 'border-zinc-700'}`}>
                    <div className="flex items-center gap-2">
                      <SevBadge sev={f.severity} />
                      <span className="text-xs font-mono font-semibold text-zinc-100">{f.flag}</span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400">{f.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Raw tab */}
            {tab === 'raw' && (
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="divide-y divide-zinc-800/40">
                  {result.allHeaders.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-2 hover:bg-zinc-900/30 transition-colors">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider w-36 flex-shrink-0 pt-0.5 break-all">{h.name}</span>
                      <span className="text-xs font-mono text-zinc-300 flex-1 break-all">{h.value}</span>
                      <Copy text={h.value} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
