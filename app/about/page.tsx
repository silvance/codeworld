import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About codeworld.codes — a reference platform for cyber operations, TSCM, and digital forensics practitioners.',
}

export default function AboutPage() {
  return (
    <div className="min-h-full text-zinc-300 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
          About codeworld
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          A reference platform for practitioners, not demos.
        </p>

        <section className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p>
            codeworld is a collection of browser-native reference tools and cheat
            sheets for cyber operations, TSCM, digital forensics, mobile
            forensics, network analysis, malware analysis, OSINT, and
            penetration testing.
          </p>
          <p>
            Every utility on this site runs locally in your browser. Nothing you
            paste — hashes, headers, payloads — is sent to a server.
          </p>
          <p>
            The site is open source on{' '}
            <a
              href="https://github.com/silvance/codeworld"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
            >
              GitHub
            </a>
            . Issues and pull requests are welcome.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-zinc-800">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            ← back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
