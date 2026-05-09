'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchEntries, COLOR_DOT, type SearchEntry } from '@/lib/search'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const results: SearchEntry[] = query.trim() ? searchEntries(query, 8) : []

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [])

  // Reset highlight whenever the query text changes — derived from query.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setHighlight(0) }, [query])

  function go(entry: SearchEntry) {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    router.push(entry.href)
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => Math.min(h + 1, Math.max(0, results.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => Math.max(0, h - 1))
    } else if (e.key === 'Enter' && results[highlight]) {
      e.preventDefault()
      go(results[highlight])
    }
  }

  const showDropdown = open && results.length > 0

  return (
    <div ref={wrapRef} className="relative w-44 md:w-64">
      <div className="relative">
        <span aria-hidden="true" className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
            <path fillRule="evenodd" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKey}
          placeholder="Search…"
          aria-label="Search the site"
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded pl-7 pr-12 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        <kbd
          aria-hidden="true"
          className="hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-mono text-zinc-600 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 leading-none"
        >
          ⌘K
        </kbd>
      </div>

      {showDropdown && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-80 max-w-[90vw] bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-md shadow-2xl shadow-black/40 overflow-hidden fade-up"
        >
          <ul className="max-h-96 overflow-y-auto py-1">
            {results.map((r, i) => (
              <li key={r.href + r.title}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => go(r)}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors ${
                    i === highlight ? 'bg-zinc-800/80' : 'hover:bg-zinc-900'
                  }`}
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${COLOR_DOT[r.color] ?? 'bg-zinc-500'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-xs text-zinc-100 truncate ${r.kind === 'entry' || r.kind === 'tool' ? 'font-mono' : 'font-medium'}`}>{r.title}</span>
                      <span className="text-[10px] font-mono text-zinc-600 flex-shrink-0">{r.kind === 'page' ? 'page' : r.page}</span>
                    </span>
                    <span className="block text-[11px] text-zinc-500 truncate">{r.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-3 py-1.5 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-600 flex items-center justify-between">
            <span>↑↓ to navigate · ↵ to open</span>
            <span>esc</span>
          </div>
        </div>
      )}
    </div>
  )
}
