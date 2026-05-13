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
        <p className="text-sm text-zinc-500 mb-10 font-mono">
          What this is and why it exists.
        </p>

        <section className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p>
            codeworld started as a test: a cheap domain, Claude Code, and a
            question of how much useful tooling I could build for CI cyber and
            TSCM work. It was originally just for my own programs and
            references, but it ended up becoming something people around me
            actually use.
          </p>
          <p>
            Most additions land here because somebody — me or a colleague —
            hit a real gap on a real case and we needed it. The Push Token
            Identifier and the modern-artifacts sections in{' '}
            <Link href="/mobile" className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline">/mobile</Link>{' '}
            are recent examples: AXIOM and Cellebrite extract the underlying
            artifacts but don&apos;t identify or attribute them, so the lookup
            kept falling on the analyst. Now it doesn&apos;t.
          </p>
          <p>
            Every utility on this site runs locally in your browser. Nothing
            you paste — hashes, headers, payloads, push tokens — is sent to a
            server. Several tools also ship a single-file Python version you
            can download and run on an air-gapped workstation.
          </p>
          <p>
            Source is on{' '}
            <a
              href="https://github.com/silvance/codeworld"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
            >
              GitHub
            </a>
            . Open an issue if something&apos;s wrong or missing, and PRs are
            welcome — especially for content gaps where you&apos;ve been the
            one re-Googling the same path or command.
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
