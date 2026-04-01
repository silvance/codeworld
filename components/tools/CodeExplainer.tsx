'use client'

import { useState, useRef } from 'react'

const LANGUAGES = [
  'Auto-detect',
  'Python', 'JavaScript', 'TypeScript', 'Bash / Shell', 'PowerShell',
  'C', 'C++', 'C#', 'Go', 'Rust', 'Java', 'Kotlin', 'Swift',
  'PHP', 'Ruby', 'Perl', 'Lua', 'R',
  'SQL', 'PL/pgSQL', 'T-SQL',
  'HTML', 'CSS', 'SCSS',
  'YAML', 'JSON', 'Dockerfile', 'Makefile',
  'Assembly (x86)', 'Assembly (ARM)',
  'Terraform (HCL)', 'Ansible', 'Regex',
]

type Depth = 'simple' | 'detailed' | 'security'

const DEPTHS: { id: Depth; label: string; description: string }[] = [
  { id: 'simple',   label: 'Plain English',   description: 'What does this do — no jargon, suitable for non-developers' },
  { id: 'detailed', label: 'Technical',        description: 'Line-by-line breakdown with logic, data flow, and edge cases' },
  { id: 'security', label: 'Security lens',    description: 'What does this do, and what security implications does it have' },
]

interface ExplanationResult {
  language: string
  oneLiner: string
  explanation: string
  keyPoints: string[]
  securityNotes?: string[]
  exampleOutput?: string
}

function Copy({ text }: { text: string }) {
  const [c, setC] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setC(true); setTimeout(() => setC(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1"
    >{c ? '✓ copied' : 'copy'}</button>
  )
}

export function CodeExplainer() {
  const [code, setCode]       = useState('')
  const [language, setLanguage] = useState('Auto-detect')
  const [depth, setDepth]     = useState<Depth>('detailed')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<ExplanationResult | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const abortRef              = useRef<AbortController | null>(null)

  async function explain() {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    abortRef.current = new AbortController()

    const depthInstructions: Record<Depth, string> = {
      simple: `Explain what this code does in plain, jargon-free English that a non-developer could understand. Focus on the purpose and effect, not the technical mechanics. Avoid terms like "function", "variable", "loop" where possible — instead say what actually happens.`,
      detailed: `Give a thorough technical explanation. Cover: what the code does overall, how it works step by step (key logic, control flow, data transformations), any important edge cases or assumptions, and what the inputs and outputs are. Be precise and technical.`,
      security: `Explain what the code does, then analyze it from a security perspective. What does it accomplish, what resources does it access, what could it be used for maliciously, and what would a defender or analyst need to know about it? This is for security practitioners analyzing unfamiliar code.`,
    }

    const langNote = language === 'Auto-detect' ? '' : ` The language is ${language}.`

    const systemPrompt = `You are an expert programmer and security analyst who excels at explaining code clearly.${langNote}

${depthInstructions[depth]}

Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble. Use this exact structure:
{
  "language": "detected or specified language",
  "oneLiner": "one sentence summary of what this code does",
  "explanation": "the main explanation — 2-6 paragraphs depending on complexity. Use newlines between paragraphs.",
  "keyPoints": ["array of 3-6 key takeaways or important things to know about this code"],
  "securityNotes": ["array of security observations — include even for non-malicious code, omit key if not applicable"],
  "exampleOutput": "example of what this code would produce if run — omit key if not applicable or too complex to show"
}

Be honest if code appears malicious or suspicious — say so clearly in the security lens mode.
Keep the oneLiner genuinely one sentence.
keyPoints should be punchy and specific, not generic.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Explain this code:\n\n${code}` }],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error?.message ?? `API error ${response.status}`)
      }

      const data = await response.json()
      const raw = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const clean = raw.replace(/^```[a-z]*\n?/i, '').replace(/```$/m, '').trim()
      setResult(JSON.parse(clean))
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return
      setError(e instanceof Error ? e.message : 'Explanation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function cancel() {
    abortRef.current?.abort()
    setLoading(false)
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-base font-mono font-semibold text-zinc-100">Code explainer</h2>
        <p className="text-xs text-zinc-500 mt-1">Paste code to get a plain-English explanation — useful for unfamiliar scripts, obfuscated code, or quick review.</p>
      </div>

      {/* Privacy disclosure */}
      <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 flex items-start gap-2.5">
        <span className="text-amber-400 text-sm flex-shrink-0 mt-0.5">⚠</span>
        <div className="text-xs font-mono text-amber-400 leading-relaxed">
          <span className="font-bold">Code leaves the browser.</span> Code submitted here is sent to the Anthropic API for analysis.
          Do not paste classified, CUI, sensitive case material, or proprietary code.
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">

        {/* Depth */}
        <div className="flex gap-2 flex-wrap">
          {DEPTHS.map(d => (
            <button key={d.id} onClick={() => setDepth(d.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors text-left ${depth === d.id ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
              <div className="font-semibold">{d.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5">{d.description}</div>
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
            rows={12}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder={`Paste any code here...\n\nWorks well for:\n• Unfamiliar scripts found during forensic review\n• Obfuscated or minified code\n• Regex patterns\n• Shell one-liners\n• Config files you want explained`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-y leading-relaxed"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-700">{code.length.toLocaleString()} chars · {code.split('\n').length} lines</span>
            {code.trim() && !loading && (
              <button onClick={explain}
                className="px-4 py-1.5 text-xs font-mono font-semibold bg-blue-900 hover:bg-blue-800 text-blue-100 rounded transition-colors">
                Explain →
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
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-400">Explaining code — sending to Anthropic API...</span>
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

      {/* Result */}
      {result && (
        <div className="space-y-4">

          {/* One-liner */}
          <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">In one sentence</div>
            <p className="text-sm font-mono text-blue-300 leading-relaxed">{result.oneLiner}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{result.language}</span>
              <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{DEPTHS.find(d => d.id === depth)?.label}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Explanation</span>
              <Copy text={result.explanation} />
            </div>
            <div className="px-4 py-4 space-y-3">
              {result.explanation.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-xs font-mono text-zinc-400 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          {/* Key points */}
          {result.keyPoints?.length > 0 && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Key points</span>
              </div>
              <div className="px-4 py-3 space-y-2">
                {result.keyPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 text-xs font-mono">
                    <span className="text-zinc-700 flex-shrink-0">→</span>
                    <span className="text-zinc-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security notes */}
          {result.securityNotes && result.securityNotes.length > 0 && (
            <div className="border border-amber-900/40 bg-amber-950/10 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-zinc-900 border-b border-amber-900/40">
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider">Security notes</span>
              </div>
              <div className="px-4 py-3 space-y-2">
                {result.securityNotes.map((note, i) => (
                  <div key={i} className="flex gap-3 text-xs font-mono">
                    <span className="text-amber-700 flex-shrink-0">⚠</span>
                    <span className="text-amber-400">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example output */}
          {result.exampleOutput && (
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Example output</span>
                <Copy text={result.exampleOutput} />
              </div>
              <pre className="px-4 py-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                {result.exampleOutput}
              </pre>
            </div>
          )}

          {/* Re-explain */}
          <button onClick={explain}
            className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
            ↻ Re-explain
          </button>
        </div>
      )}
    </div>
  )
}
