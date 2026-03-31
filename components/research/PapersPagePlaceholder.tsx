'use client'

export default function PapersPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 flex items-center justify-center p-8">
      <div className="max-w-lg w-full">

        <div className="border border-zinc-800 rounded-lg p-8 bg-zinc-900/20 text-center">
          <div className="text-3xl mb-4">📄</div>
          <h1 className="text-lg font-mono font-semibold text-zinc-100 mb-3">
            Research & White Papers
          </h1>
          <p className="text-sm font-mono text-zinc-500 leading-relaxed mb-6">
            Original security research and technical findings are forthcoming.
            Current work is undergoing responsible disclosure and legal review
            prior to publication.
          </p>
          <div className="bg-amber-950/20 border border-amber-900/30 rounded p-3 text-left">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Status</div>
            <p className="text-xs font-mono text-amber-400">
              Responsible disclosure in progress. Papers will be published
              upon completion of the disclosure window.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
