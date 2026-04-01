'use client'

import { useState, useRef } from 'react'

// ─── Language list ────────────────────────────────────────────────────────────

const LANGUAGES = [
  'Auto-detect',
  'Python', 'JavaScript', 'TypeScript', 'Bash / Shell', 'PowerShell',
  'C', 'C++', 'C#', 'Go', 'Rust', 'Java', 'Kotlin', 'Swift',
  'PHP', 'Ruby', 'Perl', 'Lua', 'R',
  'SQL', 'PL/pgSQL', 'T-SQL',
  'HTML', 'CSS', 'SCSS',
  'YAML', 'JSON', 'Dockerfile', 'Makefile',
  'Assembly (x86)', 'Assembly (ARM)',
  'Terraform (HCL)', 'Ansible', 'Nix',
]

// ─── Analysis mode ────────────────────────────────────────────────────────────

type Mode = 'bugs' | 'security' | 'full'

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: 'bugs',     label: 'Bug detection',    description: 'Logic errors, null refs, unhandled exceptions, off-by-one, race conditions' },
  { id: 'security', label: 'Security review',  description: 'Injection vulns, hardcoded secrets, insecure crypto, input validation, auth issues' },
  { id: 'full',     label: 'Full review',      description: 'Bugs + security + code quality, dead code, inefficiencies, and suggested fixes' },
]

// ─── Finding types ────────────────────────────────────────────────────────────

interface Finding {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  type: string
  line?: string
  description: string
  fix?: string
}

interface AnalysisResult {
  language: string
  summary: string
  findings: Finding[]
  fixedCode?: string
  noIssuesFound: boolean
}

// ─── Severity config ──────────────────────────────────────────────────────────

const SEV_CONFIG: Record<string, { cls: string; dot: string; label: string }> = {
  CRITICAL: { cls: 'border-red-900 bg-red-950/20',    dot: 'bg-red-500',    label: 'CRITICAL' },
  HIGH:     { cls: 'border-orange-900 bg-orange-950/20', dot: 'bg-orange-500', label: 'HIGH' },
  MEDIUM:   { cls: 'border-amber-900 bg-amber-950/20', dot: 'bg-amber-500',  label: 'MED' },
  LOW:      { cls: 'border-zinc-700 bg-zinc-900/20',   dot: 'bg-zinc-500',   label: 'LOW' },
  INFO:     { cls: 'border-blue-900 bg-blue-950/10',   dot: 'bg-blue-500',   label: 'INFO' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CodeOptimizer() {
  const [code, setCode]           = useState('')
  const [language, setLanguage]   = useState('Auto-detect')
  const [mode, setMode]           = useState<Mode>('full')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<AnalysisResult | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [showFixed, setShowFixed] = useState(false)
  const abortRef                  = useRef<AbortController | null>(null)

  function Copy({ text }: { text: string }) {
    const [c, setC] = useState(false)
    return (
      <button onClick={() => navigator.clipboard.writeText(text)
        .then(() => { setC(true); setTimeout(() => setC(false), 1500) }).catch(() => {})}
        className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1"
      >{c ? '✓ copied' : 'copy'}</button>
    )
  }

  async function analyze() {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    setShowFixed(false)

    abortRef.current = new AbortController()

    const modeInstructions: Record<Mode, string> = {
      bugs: `Focus exclusively on correctness issues: logic errors, null/undefined dereferences, off-by-one errors, unhandled exceptions, race conditions, incorrect type usage, resource leaks, and similar bugs that would cause incorrect behavior or crashes.`,
      security: `Focus exclusively on security vulnerabilities: SQL/command/code injection, hardcoded credentials or secrets, insecure cryptography (weak algorithms, ECB mode, static IVs, predictable seeds), missing input validation, authentication/authorization flaws, path traversal, SSRF, XXE, insecure deserialization, and similar security issues.`,
      full: `Perform a comprehensive review covering: (1) bugs and correctness issues, (2) security vulnerabilities, (3) code quality issues such as dead code, inefficiencies, poor error handling, and maintainability concerns. Also provide a corrected version of the code.`,
    }

    const langNote = language === 'Auto-detect' ? '' : ` The language is ${language}.`

    const systemPrompt = `You are an expert code reviewer specializing in security and correctness analysis. You analyze code for bugs, vulnerabilities, and issues.${langNote}

${modeInstructions[mode]}

Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble. Use this exact structure:
{
  "language": "detected or specified language name",
  "summary": "1-2 sentence overall assessment",
  "noIssuesFound": false,
  "findings": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "type": "short category name e.g. SQL Injection, Null Dereference, Hardcoded Secret",
      "line": "line number or range e.g. '12' or '12-15' or 'multiple' — omit if not applicable",
      "description": "clear explanation of the issue and why it matters",
      "fix": "specific actionable fix suggestion — concrete, not generic"
    }
  ]${mode === 'full' ? `,\n  "fixedCode": "the complete corrected version of the code with all issues addressed"` : ''}
}

If no issues are found, set noIssuesFound to true and findings to an empty array.
Order findings by severity (CRITICAL first, INFO last).
Be specific about line numbers when possible.
The fix field should be a concrete code snippet or specific change, not generic advice.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Analyze this code:\n\n${code}` }],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message ?? `API error ${response.status}`)
      }

      const data = await response.json()
      const raw = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const clean = raw.replace(/^```[a-z]*\n?/i, '').replace(/```$/m, '').trim()
      const parsed: AnalysisResult = JSON.parse(clean)
      setResult(parsed)
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return
      setError(e instanceof Error ? e.message : 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function cancel() {
    abortRef.current?.abort()
    setLoading(false)
  }

  const criticalCount = result?.findings.filter(f => f.severity === 'CRITICAL').length ?? 0
  const highCount     = result?.findings.filter(f => f.severity === 'HIGH').length ?? 0
  const totalCount    = result?.findings.length ?? 0

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-base font-mono font-semibold text-zinc-100">Code optimizer</h2>
        <p className="text-xs text-zinc-500 mt-1">AI-powered bug detection and security review.</p>
      </div>

      {/* Privacy disclosure — prominent */}
      <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 flex items-start gap-2.5">
        <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠</span>
        <div className="text-xs font-mono text-amber-400 leading-relaxed">
          <span className="font-bold">Code leaves the browser.</span> Unlike the other tools on this page, code submitted here is sent to the Anthropic API for analysis.
          Do not paste classified, CUI, sensitive case material, or proprietary code.
          Use only for training, research, or code you own and are authorized to share.
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Mode */}
        <div className="flex gap-2 flex-wrap">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors text-left ${mode === m.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
              <div className="font-semibold">{m.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{m.description}</div>
            </button>
          ))}
        </div>

        {/* Language */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider flex-shrink-0">Language</span>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-500">
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Code input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Code</span>
            {code && <button onClick={() => { setCode(''); setResult(null); setError(null) }}
              className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">clear</button>}
          </div>
          <textarea
            rows={14}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={`Paste your code here...\n\n# Example:\ndef get_user(user_id):\n    query = "SELECT * FROM users WHERE id = " + user_id\n    return db.execute(query)`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-y leading-relaxed"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-700">{code.length.toLocaleString()} chars · {code.split('\n').length} lines</span>
            {code.trim() && !loading && (
              <button onClick={analyze}
                className="px-4 py-1.5 text-xs font-mono font-semibold bg-emerald-900 hover:bg-emerald-800 text-emerald-100 rounded transition-colors">
                Analyze →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="border border-zinc-800 rounded-lg p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-400">Analyzing code — sending to Anthropic API...</span>
          </div>
          <button onClick={cancel} className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">cancel</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-red-900 bg-red-950/20 rounded-lg p-4 text-xs font-mono text-red-400">
          <span className="font-bold">Error: </span>{error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">

          {/* Summary banner */}
          <div className={`border rounded-lg p-4 ${criticalCount > 0 ? 'border-red-900 bg-red-950/20' : highCount > 0 ? 'border-orange-900 bg-orange-950/20' : result.noIssuesFound ? 'border-emerald-900 bg-emerald-950/20' : 'border-amber-900 bg-amber-950/20'}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className={`text-sm font-mono font-bold mb-1 ${criticalCount > 0 ? 'text-red-400' : highCount > 0 ? 'text-orange-400' : result.noIssuesFound ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.noIssuesFound ? '✓ No issues found' : `${totalCount} issue${totalCount !== 1 ? 's' : ''} found${criticalCount > 0 ? ` — ${criticalCount} CRITICAL` : highCount > 0 ? ` — ${highCount} HIGH` : ''}`}
                </div>
                <div className="text-xs font-mono text-zinc-400">{result.summary}</div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 flex-shrink-0">
                <span className="bg-zinc-800 px-1.5 py-0.5 rounded">{result.language}</span>
                <span className="bg-zinc-800 px-1.5 py-0.5 rounded">{MODES.find(m => m.id === mode)?.label}</span>
              </div>
            </div>

            {/* Severity breakdown */}
            {!result.noIssuesFound && totalCount > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {(['CRITICAL','HIGH','MEDIUM','LOW','INFO'] as const).map(sev => {
                  const count = result.findings.filter(f => f.severity === sev).length
                  if (count === 0) return null
                  const sc = SEV_CONFIG[sev]
                  return (
                    <span key={sev} className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${sc.cls}`}>
                      {sc.label}: {count}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* Findings */}
          {result.findings.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Findings</div>
              {result.findings.map((f, i) => {
                const sc = SEV_CONFIG[f.severity]
                return (
                  <div key={i} className={`border rounded-lg p-4 space-y-2 ${sc.cls}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-2 h-2 rounded-full ${sc.dot} flex-shrink-0`} />
                      <span className="text-[10px] font-mono font-bold text-zinc-400">{sc.label}</span>
                      <span className="text-xs font-mono font-semibold text-zinc-200">{f.type}</span>
                      {f.line && <span className="text-[10px] font-mono text-zinc-600">line {f.line}</span>}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 leading-relaxed">{f.description}</p>
                    {f.fix && (
                      <div className="bg-zinc-950/60 rounded p-2.5 space-y-1">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Fix</div>
                        <p className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">{f.fix}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Fixed code */}
          {result.fixedCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Fixed code</div>
                <div className="flex gap-2">
                  <button onClick={() => setShowFixed(s => !s)}
                    className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors">
                    {showFixed ? 'hide' : 'show'}
                  </button>
                  {showFixed && <Copy text={result.fixedCode} />}
                </div>
              </div>
              {showFixed && (
                <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre">
                  {result.fixedCode}
                </pre>
              )}
            </div>
          )}

          {/* Re-analyze */}
          <button onClick={analyze}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
            ↻ Re-analyze
          </button>
        </div>
      )}
    </div>
  )
}
