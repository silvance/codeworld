import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact codeworld.codes — open issues, propose changes, or report findings via GitHub.',
}

export default function ContactPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-300 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
          Contact
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          The fastest way to reach the project is through GitHub.
        </p>

        <div className="space-y-4">
          <a
            href="https://github.com/silvance/codeworld/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 transition-colors"
          >
            <div className="text-sm font-semibold text-zinc-100 mb-1">
              Open an issue
            </div>
            <div className="text-xs text-zinc-500">
              Bug reports, missing references, broken links, or feature
              requests.
            </div>
          </a>

          <a
            href="https://github.com/silvance/codeworld/pulls"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 transition-colors"
          >
            <div className="text-sm font-semibold text-zinc-100 mb-1">
              Send a pull request
            </div>
            <div className="text-xs text-zinc-500">
              Add a tool, correct a reference, or improve a section.
            </div>
          </a>

          <a
            href="https://github.com/silvance/codeworld/security/advisories/new"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-zinc-800 hover:border-zinc-600 rounded-lg p-5 transition-colors"
          >
            <div className="text-sm font-semibold text-zinc-100 mb-1">
              Report a vulnerability
            </div>
            <div className="text-xs text-zinc-500">
              Use GitHub&apos;s private security advisory flow for responsible
              disclosure.
            </div>
          </a>
        </div>

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
