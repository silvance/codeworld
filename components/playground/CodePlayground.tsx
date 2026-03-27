'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { categories, Language, Snippet } from '@/lib/playground/snippets'
import { simulateBash } from '@/lib/playground/bashSimulator'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-600 text-xs font-mono">
      loading editor...
    </div>
  ),
})

type PyStatus = 'idle' | 'loading' | 'ready' | 'error'

const MONACO_LANG: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  bash: 'shell',
  go: 'go',
  ruby: 'ruby',
}

const LANG_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  bash: 'Bash (sim)',
  go: 'Go',
  ruby: 'Ruby',
}

const LANG_TAB: Record<Language, string> = {
  python: 'PY',
  javascript: 'JS',
  bash: 'SH',
  go: 'GO',
  ruby: 'RB',
}

// Hard limits
const MAX_CODE_BYTES  = 64_000        // ~64 KB — well above any legitimate snippet
const MAX_OUTPUT_CHARS = 100_000      // ~100 KB — prevents OOM from infinite-print loops
const PISTON_TIMEOUT_MS = 15_000      // 15 s — Piston cold start can be slow

const truncate = (s: string, max: number) =>
  s.length > max ? s.slice(0, max) + `\n…(truncated at ${max} chars)` : s

export default function CodePlayground() {
  const defaultCat     = categories[0]
  const defaultSnippet = defaultCat.snippets[0]

  const [language, setLanguage]       = useState<Language>(defaultCat.id)
  const [code, setCode]               = useState(defaultSnippet.code)
  const [output, setOutput]           = useState('')
  const [isError, setIsError]         = useState(false)
  const [isRunning, setIsRunning]     = useState(false)
  const [pyStatus, setPyStatus]       = useState<PyStatus>('idle')
  const [activeId, setActiveId]       = useState(defaultSnippet.id)
  const [execMs, setExecMs]           = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile]       = useState(false)

  const pyodideRef  = useRef<any>(null)
  const runCodeRef  = useRef<() => void>(() => {})
  const abortRef    = useRef<AbortController | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const selectSnippet = (snippet: Snippet) => {
    setLanguage(snippet.language)
    setCode(snippet.code)
    setActiveId(snippet.id)
    setOutput('')
    setIsError(false)
    setExecMs(null)
    if (isMobile) setSidebarOpen(false)
  }

  const handleLangTab = (lang: Language) => {
    const cat = categories.find(c => c.id === lang)
    if (cat?.snippets[0]) selectSnippet(cat.snippets[0])
  }

  // ── Python (Pyodide) ──────────────────────────────────────────────────────
  const loadPyodide = async (): Promise<any> => {
    if (pyodideRef.current) return pyodideRef.current
    setPyStatus('loading')
    try {
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
          script.onload  = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Pyodide script'))
          document.head.appendChild(script)
        })
      }
      const py = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
      })
      pyodideRef.current = py
      setPyStatus('ready')
      return py
    } catch (e) {
      setPyStatus('error')
      throw e
    }
  }

  const runPython = async (src: string): Promise<{ out: string; err: boolean }> => {
    let out = ''
    let hasError = false
    try {
      const py = await loadPyodide()
      py.setStdout({ batched: (s: string) => { out = truncate(out + s + '\n', MAX_OUTPUT_CHARS) } })
      py.setStderr({ batched: (s: string) => { out = truncate(out + s + '\n', MAX_OUTPUT_CHARS); hasError = true } })
      await py.runPythonAsync(src)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      out += (out ? '\n' : '') + msg
      hasError = true
    }
    return { out, err: hasError }
  }

  // ── JavaScript (browser sandbox) ─────────────────────────────────────────
  // Note: new Function still has access to window/document. This is intentional
  // for a developer tool — the user is running their own code in their own browser.
  const runJS = (src: string): { out: string; err: boolean } => {
    const lines: string[] = []
    let hasError = false
    const stringify = (a: unknown) =>
      typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
    const consoleMock = {
      log:   (...args: unknown[]) => lines.push(args.map(stringify).join(' ')),
      error: (...args: unknown[]) => { lines.push('Error: ' + args.map(stringify).join(' ')); hasError = true },
      warn:  (...args: unknown[]) => lines.push('Warning: ' + args.map(stringify).join(' ')),
      info:  (...args: unknown[]) => lines.push(args.map(stringify).join(' ')),
      table: (data: unknown)      => lines.push(stringify(data)),
    }
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', src)
      fn(consoleMock)
    } catch (e: unknown) {
      lines.push(e instanceof Error ? e.message : String(e))
      hasError = true
    }
    const out = lines.join('\n')
    return { out: truncate(out, MAX_OUTPUT_CHARS), err: hasError }
  }

  // ── Piston API (Go + Ruby) ────────────────────────────────────────────────
  const runPiston = async (lang: 'go' | 'ruby', src: string): Promise<{ out: string; err: boolean }> => {
    const PISTON = 'https://emkc.org/api/v2/piston/execute'
    const versions:  Record<string, string> = { go: '1.21.0', ruby: '3.3.0' }
    const filenames: Record<string, string> = { go: 'main.go', ruby: 'main.rb' }

    if (new TextEncoder().encode(src).length > MAX_CODE_BYTES) {
      return { out: `Error: code exceeds ${MAX_CODE_BYTES / 1000} KB limit`, err: true }
    }

    setOutput(`Running ${LANG_LABELS[lang]} via Piston API...`)

    // Cancel any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const timer = setTimeout(() => controller.abort(), PISTON_TIMEOUT_MS)

    try {
      const res = await fetch(PISTON, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          version: versions[lang],
          files: [{ name: filenames[lang], content: src }],
        }),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!res.ok) return { out: `Piston API error: HTTP ${res.status}`, err: true }

      const data = await res.json() as { run?: { stdout?: string; stderr?: string; code?: number } }
      const run = data.run ?? {}
      const out = truncate(((run.stdout ?? '') + (run.stderr ?? '')).trim() || '(no output)', MAX_OUTPUT_CHARS)
      return { out, err: (run.code ?? 0) !== 0 }
    } catch (e: unknown) {
      clearTimeout(timer)
      if (e instanceof Error && e.name === 'AbortError') {
        return { out: `Timed out after ${PISTON_TIMEOUT_MS / 1000}s — Piston may be unavailable`, err: true }
      }
      return { out: e instanceof Error ? e.message : String(e), err: true }
    } finally {
      abortRef.current = null
    }
  }

  const runCode = useCallback(async () => {
    if (isRunning) return   // guard against double-click races
    setIsRunning(true)
    setIsError(false)
    if (language === 'python' && !pyodideRef.current) {
      setOutput('Loading Python runtime (Pyodide ~10 MB)...\nFirst load takes a few seconds.\n')
    } else {
      setOutput('')
    }
    const t0 = performance.now()
    try {
      let result: { out: string; err: boolean }
      if (language === 'bash') {
        result = { out: simulateBash(code), err: false }
      } else if (language === 'javascript') {
        result = runJS(code)
      } else if (language === 'go' || language === 'ruby') {
        result = await runPiston(language, code)
      } else {
        result = await runPython(code)
      }
      setOutput(result.out.trim() || '(no output)')
      setIsError(result.err)
    } catch (e: unknown) {
      setOutput(e instanceof Error ? e.message : String(e))
      setIsError(true)
    }
    setExecMs(Math.round(performance.now() - t0))
    setIsRunning(false)
  // runJS and runPiston are defined inline — stable, no deps needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, code, isRunning])

  useEffect(() => { runCodeRef.current = runCode }, [runCode])

  const handleEditorMount = (editor: any, monaco: any) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => runCodeRef.current(),
    )
  }

  // ── Mobile layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors px-1 font-mono text-xs"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className="text-xs font-mono text-zinc-400 flex-1">
            {categories.flatMap(c => c.snippets).find(s => s.id === activeId)?.title ?? 'playground'}
          </span>
          <div className="flex gap-1">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleLangTab(cat.id)}
                className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                  language === cat.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500'
                }`}>
                {LANG_TAB[cat.id]}
              </button>
            ))}
          </div>
          <button onClick={runCode} disabled={isRunning}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded ${
              isRunning ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-800 text-emerald-100'
            }`}>
            {isRunning ? '...' : '▶'}
          </button>
        </div>

        {sidebarOpen && (
          <div className="absolute inset-0 top-[calc(2.5rem+2.5rem)] z-40 bg-zinc-900 overflow-y-auto">
            {categories.map(cat => (
              <div key={cat.id}>
                <div className="px-3 pt-3 pb-1 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">
                  {cat.name}
                </div>
                {cat.snippets.map(snippet => (
                  <button key={snippet.id} onClick={() => selectSnippet(snippet)}
                    className={`w-full text-left px-3 py-3 transition-colors border-l-2 ${
                      activeId === snippet.id
                        ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                        : 'border-transparent text-zinc-400'
                    }`}>
                    <div className="text-sm font-mono">{snippet.title}</div>
                    <div className="text-xs text-zinc-600 mt-0.5">{snippet.description}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="flex-1 bg-zinc-950 text-emerald-400 font-mono text-xs p-3 resize-none focus:outline-none border-0"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>

        <div className="h-40 flex flex-col border-t border-zinc-800 flex-shrink-0">
          <div className="flex items-center px-3 py-1 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">output</span>
            {execMs !== null && (
              <span className="ml-3 text-[10px] font-mono text-zinc-700">
                {execMs < 1000 ? `${execMs}ms` : `${(execMs / 1000).toFixed(1)}s`}
              </span>
            )}
          </div>
          <pre className={`flex-1 overflow-auto px-3 py-2 text-xs font-mono leading-relaxed bg-zinc-950 ${
            isError ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {output || <span className="text-zinc-700">tap ▶ to run</span>}
          </pre>
        </div>
      </div>
    )
  }

  // ── Desktop layout ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
        <button onClick={() => setSidebarOpen(o => !o)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors px-1 font-mono text-xs"
          title="Toggle snippets">
          {sidebarOpen ? '◂' : '▸'}
        </button>
        <span className="text-xs font-mono text-zinc-400 font-medium tracking-tight">code playground</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 bg-zinc-950 rounded px-1 py-0.5">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleLangTab(cat.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                language === cat.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              {LANG_TAB[cat.id]}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-zinc-800" />
        <button onClick={() => { setOutput(''); setExecMs(null) }}
          className="px-2 py-1 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors">
          clear
        </button>
        <button onClick={runCode} disabled={isRunning}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
            isRunning
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
          }`}>
          {isRunning ? <><span className="animate-pulse">●</span> running</> : <>▶ run</>}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-52 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1">
              {categories.map(cat => (
                <div key={cat.id}>
                  <div className="px-3 pt-3 pb-1 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">
                    {cat.name}
                  </div>
                  {cat.snippets.map(snippet => (
                    <button key={snippet.id} onClick={() => selectSnippet(snippet)}
                      className={`w-full text-left px-3 py-2 transition-colors border-l-2 ${
                        activeId === snippet.id
                          ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                          : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                      }`}>
                      <div className="text-xs font-mono leading-tight">{snippet.title}</div>
                      <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{snippet.description}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={MONACO_LANG[language]}
              value={code}
              onChange={val => setCode(val ?? '')}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: '"JetBrains Mono", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'line',
                padding: { top: 12, bottom: 12 },
                wordWrap: 'on',
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="h-44 flex flex-col border-t border-zinc-800 flex-shrink-0">
            <div className="flex items-center px-3 py-1 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">output</span>
              {execMs !== null && (
                <span className="ml-3 text-[10px] font-mono text-zinc-700">
                  {execMs < 1000 ? `${execMs}ms` : `${(execMs / 1000).toFixed(1)}s`}
                </span>
              )}
              <div className="flex-1" />
              {language === 'python' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  pyStatus === 'ready'   ? 'text-emerald-400 bg-emerald-950' :
                  pyStatus === 'loading' ? 'text-amber-400 bg-amber-950 animate-pulse' :
                  pyStatus === 'error'   ? 'text-red-400 bg-red-950' : 'text-zinc-600'
                }`}>
                  pyodide {pyStatus}
                </span>
              )}
              {language === 'javascript' && <span className="text-[10px] font-mono text-zinc-700">browser JS</span>}
              {language === 'bash'       && <span className="text-[10px] font-mono text-zinc-700">simulated</span>}
              {language === 'go'         && <span className="text-[10px] font-mono text-zinc-700">piston · go 1.21</span>}
              {language === 'ruby'       && <span className="text-[10px] font-mono text-zinc-700">piston · ruby 3.3</span>}
            </div>
            <pre className={`flex-1 overflow-auto px-3 py-2 text-xs font-mono leading-relaxed bg-zinc-950 ${
              isError ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {output
                ? output
                : <span className="text-zinc-700">press ▶ run  or  Ctrl+Enter</span>
              }
            </pre>
          </div>
        </div>
      </div>

      <div className="flex items-center px-3 py-0.5 border-t border-zinc-800 bg-zinc-900 flex-shrink-0">
        <span className="text-[10px] font-mono text-zinc-700">{LANG_LABELS[language]}</span>
        <span className="mx-2 text-zinc-800">·</span>
        <span className="text-[10px] font-mono text-zinc-700">{code.split('\n').length} lines</span>
        {language === 'bash' && (
          <>
            <span className="mx-2 text-zinc-800">·</span>
            <span className="text-[10px] font-mono text-zinc-700">simulated env</span>
          </>
        )}
      </div>
    </div>
  )
}
