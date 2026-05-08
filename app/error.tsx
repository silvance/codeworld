'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-300 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-xs font-mono text-zinc-600 mb-3">HTTP 500</p>
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-3">
          Something broke
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed mb-2">
          An unexpected error was thrown while rendering this page.
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono text-zinc-700 mb-8">
            digest: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="text-sm px-4 py-2 rounded border border-emerald-900 text-emerald-400 hover:border-emerald-700 hover:bg-emerald-950/30 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
