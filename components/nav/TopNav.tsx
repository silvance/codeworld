'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/playground', label: 'Playground' },
  { href: '/rf',         label: 'RF / TSCM' },
  { href: '/forensics',  label: 'Forensics' },
  { href: '/mobile',     label: 'Mobile' },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-6 px-6 py-0 h-10 bg-zinc-950 border-b border-zinc-800">
      <Link href="/" className="text-sm font-semibold text-zinc-100 tracking-tight hover:text-white transition-colors">
        codeworld
      </Link>
      <div className="w-px h-4 bg-zinc-800" />
      <div className="flex items-center gap-1">
        {LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              pathname.startsWith(link.href)
                ? 'text-zinc-100 bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
