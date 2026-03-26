'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS = [
  { href: '/playground', label: 'Playground' },
  { href: '/rf',         label: 'RF / TSCM' },
  { href: '/forensics',  label: 'Forensics' },
  { href: '/mobile',  label: 'Mobile' },
  { href: '/network', label: 'Network' },
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
