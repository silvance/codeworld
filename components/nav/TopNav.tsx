'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/',            label: '~' },
  { href: '/playground',  label: 'playground' },
  { href: '/rf',          label: 'rf/tscm' },
  { href: '/forensics',   label: 'forensics' },
  { href: '/mobile',      label: 'mobile' },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-1 px-4 py-2 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <span className="text-zinc-600 font-mono text-xs mr-2">codeworld</span>
      <span className="text-zinc-700 font-mono text-xs mr-2">/</span>
      {LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
            pathname === link.href
              ? 'text-emerald-400 bg-emerald-950/40'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
