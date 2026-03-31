'use client'

import { useState } from 'react'
import { papers, Paper, PaperStatus } from '@/lib/papers/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
}

function Copy({ text, label = 'copy' }: { text: string; label?: string }) {
  const [c, setC] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setC(true); setTimeout(() => setC(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1"
    >{c ? '✓ copied' : label}</button>
  )
}

const statusConfig: Record<PaperStatus, { cls: string; icon: string }> = {
  'Draft':              { cls: 'bg-zinc-800 text-zinc-400',       icon: '✏' },
  'Under Review':       { cls: 'bg-blue-950 text-blue-400',       icon: '👁' },
  'Awaiting Disclosure':{ cls: 'bg-amber-950 text-amber-400',     icon: '⏳' },
  'Disclosed':          { cls: 'bg-orange-950 text-orange-400',   icon: '📤' },
  'Published':          { cls: 'bg-emerald-950 text-emerald-400', icon: '✓' },
}

const timelineTypeConfig = {
  discovery:     { cls: 'bg-blue-500',    label: 'Discovery' },
  documentation: { cls: 'bg-zinc-500',    label: 'Documentation' },
  disclosure:    { cls: 'bg-amber-500',   label: 'Disclosure' },
  response:      { cls: 'bg-emerald-500', label: 'Response' },
  publication:   { cls: 'bg-purple-500',  label: 'Published' },
  pending:       { cls: 'bg-zinc-700',    label: 'Pending' },
}

// ─── Paper detail view ────────────────────────────────────────────────────────

function PaperDetail({ paper, onBack }: { paper: Paper; onBack: () => void }) {
  const [tab, setTab] = useState<'abstract' | 'findings' | 'methodology' | 'timeline' | 'cite'>('abstract')
  const sc = statusConfig[paper.status]

  const tabs = [
    { id: 'abstract',    label: 'Abstract' },
    { id: 'findings',    label: `Key findings (${paper.keyFindings.length})` },
    ...(paper.methodology ? [{ id: 'methodology', label: 'Methodology' }] : []),
    ...(paper.timeline   ? [{ id: 'timeline',    label: 'Timeline' }] : []),
    { id: 'cite',        label: 'Cite' },
  ] as const

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-300 transition-colors mb-8">
        ← All papers
      </button>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${sc.cls} border-current/20`}>
            {sc.icon} {paper.status}
          </span>
          {paper.category.map(c => <Badge key={c} text={c} cls="bg-zinc-800 text-zinc-400" />)}
        </div>

        <h1 className="text-xl font-mono font-bold text-zinc-100 mb-3 leading-snug">{paper.title}</h1>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-600 mb-4">
          <span>Published: {paper.date}</span>
          <span>Updated: {paper.lastUpdated}</span>
          {paper.affectedVendors && (
            <span>Affected: {paper.affectedVendors.join(', ')}</span>
          )}
        </div>

        {/* TL;DR */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4">
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1.5">TL;DR</div>
          <p className="text-sm font-mono text-blue-300 leading-relaxed">{paper.tldr}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {paper.tags.map(t => <Badge key={t} text={t} cls="bg-zinc-900 text-zinc-500 border border-zinc-800" />)}
      </div>

      {/* Disclosure notice */}
      {paper.disclosureNotes && (paper.status === 'Awaiting Disclosure' || paper.status === 'Disclosed') && (
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-4 mb-6 flex gap-3">
          <span className="text-amber-400 text-lg flex-shrink-0">⚠</span>
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 mb-1">Responsible Disclosure in Progress</div>
            <p className="text-xs font-mono text-amber-400/80">{paper.disclosureNotes}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-800 flex gap-1 flex-wrap mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'border-emerald-600 text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}>
            {t.label}
          </button>
        ))}
        {paper.pdfUrl && (
          <a href={paper.pdfUrl} download className="ml-auto px-3 py-1.5 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-700 rounded hover:border-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1.5 mb-1">
            <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current"><path d="M8 12L3 7h3V1h4v6h3L8 12zM1 14h14v1H1z"/></svg>
            PDF
          </a>
        )}
      </div>

      {/* Abstract */}
      {tab === 'abstract' && (
        <div className="prose prose-invert prose-sm max-w-none">
          {paper.abstract.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm font-mono text-zinc-400 leading-relaxed mb-4">{para}</p>
          ))}
        </div>
      )}

      {/* Key findings */}
      {tab === 'findings' && (
        <div className="space-y-3">
          {paper.keyFindings.map((f, i) => (
            <div key={i} className="flex gap-4 border border-zinc-800 rounded-lg p-4 bg-zinc-900/20">
              <span className="text-lg font-mono font-bold text-zinc-700 flex-shrink-0 leading-tight">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm font-mono text-zinc-300 leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
      )}

      {/* Methodology */}
      {tab === 'methodology' && paper.methodology && (
        <div className="space-y-4">
          {paper.methodology.split('\n\n').map((para, i) => (
            <p key={i} className="text-sm font-mono text-zinc-400 leading-relaxed">{para}</p>
          ))}
        </div>
      )}

      {/* Timeline */}
      {tab === 'timeline' && paper.timeline && (
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-zinc-800" />
          <div className="space-y-6 pl-12">
            {paper.timeline.map((e, i) => {
              const tc = timelineTypeConfig[e.type]
              return (
                <div key={i} className="relative">
                  <div className={`absolute -left-8 mt-1 w-3 h-3 rounded-full ${tc.cls} flex-shrink-0`} />
                  <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/20">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-bold text-zinc-200">{e.event}</span>
                      <Badge text={e.date} cls={`${e.type === 'pending' ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-800 text-zinc-400'}`} />
                      <Badge text={tc.label} cls={`bg-zinc-900 text-zinc-500`} />
                    </div>
                    {e.detail && <p className="text-xs font-mono text-zinc-500">{e.detail}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Cite */}
      {tab === 'cite' && paper.bibtex && (
        <div className="space-y-4">
          <div className="relative group">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {paper.bibtex}
            </pre>
            <div className="absolute top-3 right-3">
              <Copy text={paper.bibtex} label="copy BibTeX" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-zinc-700">
            Cite as: Silva, J. (2026). {paper.title}. Independent TSCM Research.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Papers list view ─────────────────────────────────────────────────────────

function PaperCard({ paper, onClick }: { paper: Paper; onClick: () => void }) {
  const sc = statusConfig[paper.status]
  return (
    <button onClick={onClick} className="w-full text-left border border-zinc-800 rounded-lg p-6 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sc.cls}`}>
            {sc.icon} {paper.status}
          </span>
          {paper.category.map(c => <Badge key={c} text={c} cls="bg-zinc-800 text-zinc-500" />)}
        </div>
        <span className="text-[10px] font-mono text-zinc-700 flex-shrink-0">{paper.date}</span>
      </div>

      <h2 className="text-base font-mono font-semibold text-zinc-100 mb-2 leading-snug group-hover:text-white transition-colors">
        {paper.title}
      </h2>

      <p className="text-xs font-mono text-zinc-500 mb-4 leading-relaxed line-clamp-2">{paper.tldr}</p>

      {/* Key findings preview */}
      <div className="space-y-1.5 mb-4">
        {paper.keyFindings.slice(0, 2).map((f, i) => (
          <div key={i} className="flex gap-2 text-xs font-mono text-zinc-600">
            <span className="text-zinc-700 flex-shrink-0">→</span>
            <span className="line-clamp-1">{f}</span>
          </div>
        ))}
        {paper.keyFindings.length > 2 && (
          <div className="text-[10px] font-mono text-zinc-700">+{paper.keyFindings.length - 2} more findings</div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {paper.tags.slice(0, 4).map(t => <Badge key={t} text={t} cls="bg-zinc-900 text-zinc-600 border border-zinc-800" />)}
        </div>
        <span className="text-xs font-mono text-zinc-600 group-hover:text-emerald-400 transition-colors">Read →</span>
      </div>
    </button>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PapersPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const paper = selected ? papers.find(p => p.id === selected) : null

  if (paper) {
    return (
      <div className="min-h-full bg-zinc-950 text-zinc-100 overflow-y-auto">
        <PaperDetail paper={paper} onBack={() => setSelected(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <h1 className="text-xl font-mono font-bold text-zinc-100 mb-2">Research & White Papers</h1>
          <p className="text-sm font-mono text-zinc-500 leading-relaxed">
            Original technical findings and security research from TSCM operations, digital forensics, and network security work.
            Papers in <span className="text-amber-400">Awaiting Disclosure</span> status contain observed findings only —
            full technical details are withheld pending responsible disclosure.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-6 mb-8 text-xs font-mono">
          {Object.entries(statusConfig).map(([status, cfg]) => {
            const count = papers.filter(p => p.status === status).length
            if (count === 0) return null
            return (
              <div key={status}>
                <span className={`font-bold ${cfg.cls.split(' ').find(c => c.startsWith('text-'))}`}>{count}</span>
                <span className="text-zinc-600 ml-1">{status}</span>
              </div>
            )
          })}
          <div className="ml-auto">
            <span className="font-bold text-zinc-300">{papers.length}</span>
            <span className="text-zinc-600 ml-1">total</span>
          </div>
        </div>

        {/* Papers list */}
        <div className="space-y-4">
          {papers.map(p => (
            <PaperCard key={p.id} paper={p} onClick={() => setSelected(p.id)} />
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-8 border border-dashed border-zinc-800 rounded-lg p-6 text-center">
          <p className="text-xs font-mono text-zinc-700">Additional findings in preparation.</p>
        </div>

      </div>
    </div>
  )
}
