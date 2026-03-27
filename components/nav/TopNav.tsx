'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS = [
  { href: '/tools',      label: 'Tools' },
  { href: '/playground', label: 'Playground' },
  { href: '/rf',         label: 'RF / TSCM' },
  { href: '/forensics',  label: 'Forensics' },
  { href: '/mobile',  label: 'Mobile' },
  { href: '/network', label: 'Network' },
  { href: '/malware', label: 'Malware' },
  { href: '/osint',   label: 'OSINT' },
]

export default function TopNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-4 py-0 h-10 bg-zinc-950 border-b border-zinc-800">
        <Link href="/" className="text-sm font-semibold text-zinc-100 tracking-tight hover:text-white transition-colors flex-shrink-0">
          codeworld
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1 flex-1">
          <div className="w-px h-4 bg-zinc-800 mr-2" />
          {LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="flex sm:hidden flex-1 justify-end">
          <button onClick={() => setMenuOpen(o => !o)}
            className="text-zinc-500 hover:text-zinc-200 px-2 py-1 text-sm">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Right side — version + GitHub */}
        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <span className="text-[10px] font-mono text-zinc-700">v1.4.0</span>
          <a
            href="https://github.com/silvance/codeworld"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 hover:text-zinc-400 transition-colors"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed top-10 left-0 right-0 z-40 bg-zinc-900 border-b border-zinc-800 sm:hidden">
          {LINKS.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm border-b border-zinc-800 last:border-0 transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-zinc-100 bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
