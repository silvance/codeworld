'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SearchBar from './SearchBar'

const LINKS = [
  { href: '/tools',      label: 'Tools' },
  { href: '/playground', label: 'Playground' },
  { href: '/osint',      label: 'OSINT' },
  { href: '/pentest',    label: 'Pentest' },
  { href: '/malware',    label: 'Malware' },
  { href: '/network',    label: 'Network' },
  { href: '/forensics',  label: 'Forensics' },
  { href: '/cloud',      label: 'Cloud' },
  { href: '/mobile',     label: 'Mobile' },
  { href: '/rf',         label: 'RF / TSCM' },
]

export default function TopNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-4 py-0 h-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
        <Link href="/" className="text-sm font-semibold tracking-tight transition-colors flex-shrink-0 flex items-baseline gap-px">
          <span className="bg-gradient-to-r from-emerald-300 via-zinc-100 to-zinc-100 bg-clip-text text-transparent hover:from-emerald-200 hover:to-white">
            codeworld
          </span>
          <span aria-hidden="true" className="text-emerald-400 cursor-blink">_</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          <div className="w-px h-4 bg-zinc-800 mr-2" />
          {LINKS.map(link => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link key={link.href} href={link.href}
                className={`relative px-3 py-1 text-sm rounded transition-colors ${
                  isActive
                    ? 'text-zinc-100 bg-zinc-800'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
                }`}>
                {link.label}
                {isActive && (
                  <span aria-hidden="true" className="absolute left-2 right-2 -bottom-px h-px overflow-hidden">
                    <span className="block h-full w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent scanner-sweep" />
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side — search + GitHub + (mobile) hamburger */}
        <div className="flex items-center gap-2 ml-auto">
          <SearchBar />
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="lg:hidden text-zinc-500 hover:text-zinc-200 px-2 py-1 text-sm flex-shrink-0"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <a
            href="https://github.com/silvance/codeworld"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="codeworld on GitHub"
            className="hidden lg:block text-zinc-600 hover:text-zinc-300 transition-colors"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile / narrow-desktop dropdown */}
      {menuOpen && (
        <div className="fixed top-10 left-0 right-0 z-40 bg-zinc-900 border-b border-zinc-800 lg:hidden">
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
