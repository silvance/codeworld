import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-full text-zinc-300 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-xs font-mono text-zinc-600 mb-3">HTTP 404</p>
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          The path you requested isn&apos;t mapped to a tool or reference page.
          It may have moved, or never existed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded border border-emerald-900 text-emerald-400 hover:border-emerald-700 hover:bg-emerald-950/30 transition-colors"
          >
            Return home
          </Link>
          <Link
            href="/tools"
            className="text-sm px-4 py-2 rounded border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  )
}
