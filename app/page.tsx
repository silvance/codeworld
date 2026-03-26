'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — system check...', delay: 0 },
  { text: 'CPU: cyber/TSCM operations module [OK]', delay: 120 },
  { text: 'MEM: toolset loaded — 6 modules detected [OK]', delay: 240 },
  { text: 'NET: RF subsystem online [OK]', delay: 360 },
  { text: 'FS:  forensics engine mounted [OK]', delay: 480 },
  { text: 'SYS: all checks passed — booting...', delay: 640 },
  { text: '', delay: 800 },
  { text: '> codeworld v0.1.0', delay: 900 },
]

const TOOLS = [
  {
    href:    '/playground',
    label:   'code playground',
    cmd:     'cd /playground',
    desc:    'Live Python, JavaScript, and Bash execution environment. Pre-loaded with cyber-relevant snippets — hash identification, entropy analysis, XOR cipher, JWT decoding, subnet math, WiGLE parsing.',
    tags:    ['python', 'javascript', 'bash sim'],
    color:   'emerald',
  },
  {
    href:    '/rf',
    label:   'rf / tscm tools',
    cmd:     'cd /rf',
    desc:    'Frequency reference tables, free-space path loss calculator, WiFi and BLE channel maps, dBm↔mW converter, TSCM threat device database, and rogue AP / evil twin detection indicators.',
    tags:    ['freq ref', 'fspl calc', 'channel maps', 'signal math', 'tscm devices', 'rogue ap'],
    color:   'blue',
  },
  {
    href:    '/forensics',
    label:   'forensics reference',
    cmd:     'cd /forensics',
    desc:    'Windows and Linux artifact locations, timeline analysis guides, memory forensics quick-ref, and tool cheat sheets. Built from FOR508/FOR585 field knowledge.',
    tags:    ['windows artifacts', 'linux artifacts', 'memory', 'timeline'],
    color:   'purple',

  },
]

const colorMap: Record<string, { border: string; bg: string; text: string; tag: string; tagText: string; cmd: string }> = {
  emerald: {
    border:  'border-emerald-900 hover:border-emerald-700',
    bg:      'hover:bg-emerald-950/20',
    text:    'text-emerald-400',
    tag:     'bg-emerald-950/60',
    tagText: 'text-emerald-600',
    cmd:     'text-emerald-400',
  },
  blue: {
    border:  'border-blue-900 hover:border-blue-700',
    bg:      'hover:bg-blue-950/20',
    text:    'text-blue-400',
    tag:     'bg-blue-950/60',
    tagText: 'text-blue-700',
    cmd:     'text-blue-400',
  },
  purple: {
    border:  'border-purple-900 hover:border-purple-700',
    bg:      'hover:bg-purple-950/20',
    text:    'text-purple-400',
    tag:     'bg-purple-950/60',
    tagText: 'text-purple-700',
    cmd:     'text-purple-400',
  },
}

export default function HomePage() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showTools, setShowTools]       = useState(false)
  const [typed, setTyped]               = useState('')
  const [cursorOn, setCursorOn]         = useState(true)

  // Boot sequence
  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1)
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setShowTools(true), 300)
        }
      }, line.delay)
    })
  }, [])

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn(c => !c), 530)
    return () => clearInterval(id)
  }, [])

  // Typewriter for the prompt line
  const PROMPT = 'operator@codeworld:~$ '
  useEffect(() => {
    if (!showTools) return
    let i = 0
    const id = setInterval(() => {
      setTyped(PROMPT.slice(0, i + 1))
      i++
      if (i >= PROMPT.length) clearInterval(id)
    }, 38)
    return () => clearInterval(id)
  }, [showTools])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-mono">

      {/* Top padding for fixed nav */}


      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Boot sequence */}
        <div className="mb-8 text-xs leading-6">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`${
              line.text.startsWith('>')      ? 'text-emerald-400 font-semibold text-sm' :
              line.text.includes('[OK]')     ? 'text-zinc-400' :
              line.text === ''              ? '' :
              'text-zinc-600'
            }`}>
              {line.text}
            </div>
          ))}
        </div>

        {/* Prompt line */}
        {showTools && (
          <div className="text-xs mb-10 text-zinc-500">
            {typed}
            <span className={`inline-block w-2 h-3.5 bg-zinc-400 align-middle ml-px transition-opacity ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}

        {/* Tool cards */}
        {showTools && (
          <div className="space-y-4">
            {TOOLS.map(tool => {
              const c = colorMap[tool.color]
              return (
                <Link key={tool.href} href={tool.href} className="block">
                  <div className={`border rounded-lg p-5 transition-all duration-200 cursor-pointer ${c.border} ${c.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${c.text}`}>{tool.label}</span>
                      <span className={`text-[11px] ${c.cmd}`}>{tool.cmd}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-3">{tool.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tool.tags.map(tag => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded ${c.tag} ${c.tagText}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Footer */}
        {showTools && (
          <div className="mt-12 text-[11px] text-zinc-700 border-t border-zinc-900 pt-4">
            tools for cyber · tscm · digital forensics — built for ops, not demos
          </div>
        )}

      </div>
    </div>
  )
}
