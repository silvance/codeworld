import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Privacy policy for codeworld.codes — what is and is not collected when you use the site.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-full text-zinc-300 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
          Privacy
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          What this site collects, and what it doesn&apos;t.
        </p>

        <section className="space-y-6 text-sm text-zinc-400 leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Tool input stays local
            </h2>
            <p>
              Every utility on codeworld — hash calculator, encoder, subnet
              math, JWT decoder, email header analyzer, code playground — runs
              entirely in your browser. Anything you paste or type into a tool
              is processed client-side. It is not transmitted to a server, not
              stored, and not logged.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Aggregate analytics
            </h2>
            <p>
              The site uses{' '}
              <a
                href="https://vercel.com/docs/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
              >
                Vercel Web Analytics
              </a>{' '}
              to count page views and referrers. Vercel&apos;s analytics is
              cookie-free and does not use cross-site tracking. No personally
              identifiable information is collected.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Server logs
            </h2>
            <p>
              The hosting platform records standard request logs (IP,
              user-agent, path, timestamp) for operational purposes such as
              abuse prevention. These logs are retained for a short period and
              are not correlated with analytics events.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Third-party assets
            </h2>
            <p>
              Fonts are self-hosted: although they originate from Google Fonts,
              Next.js downloads the files at build time and serves them from
              this domain, so your browser never makes a request to Google
              when rendering pages.
            </p>
            <p className="mt-3">
              The Python runtime in the code playground (Pyodide) is fetched
              from the jsDelivr CDN the first time you open the playground.
              jsDelivr will receive your IP and user-agent on that fetch.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Offline mode
            </h2>
            <p>
              The site registers a service worker that caches pages and assets
              locally, so it can keep working when you&apos;re offline. The
              cache is stored in your browser only — nothing is synced or
              uploaded. You can clear it from your browser&apos;s site
              settings.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-2">
              Contact
            </h2>
            <p>
              For privacy questions, open an issue on{' '}
              <Link
                href="/contact"
                className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline"
              >
                GitHub
              </Link>
              .
            </p>
          </div>
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
