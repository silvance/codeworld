'use client'

import { useState, useMemo } from 'react'
import { papers, allCategories, allTags, statusConfig, type Paper, type PaperTag } from '@/lib/research/data'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
}

function Copy({ text }: { text: string }) {
  const [c, setCopied] = useState(false)
  return (
    <button onClick={() => navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }).catch(() => {})}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1"
    >{c ? '✓ copied' : 'copy'}</button>
  )
}

const tagColors: Partial<Record<PaperTag, string>> = {
  'TSCM':                 'bg-blue-950 text-blue-400',
  'WiFi':                 'bg-emerald-950 text-emerald-400',
  'Mesh networking':      'bg-purple-950 text-purple-400',
  'Rogue AP':             'bg-red-950 text-red-400',
  'IoT':                  'bg-amber-950 text-amber-400',
  'Digital forensics':    'bg-blue-950 text-blue-400',
  'Network forensics':    'bg-teal-950 text-teal-400',
  'RF':                   'bg-zinc-800 text-zinc-400',
  'Cellular':             'bg-zinc-800 text-zinc-400',
  'Responsible disclosure': 'bg-orange-950 text-orange-400',
  'Privacy':              'bg-zinc-800 text-zinc-400',
  'Android':              'bg-emerald-950 text-emerald-400',
  'iOS':                  'bg-blue-950 text-blue-400',
}

// Render body text — paragraphs, simple code blocks
function PaperBody({ text }: { text: string }) {
  const parts = text.split('\n\n')
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        // Bold text
        if (part.startsWith('**') && !part.includes('\n')) {
          const inner = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          return <p key={i} className="text-xs font-mono text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: inner }} />
        }
        // Bullet list
        if (part.includes('\n- ') || part.startsWith('- ')) {
          const lines = part.split('\n')
          return (
            <ul key={i} className="space-y-1.5">
              {lines.map((line, j) => {
                const isBullet = line.startsWith('- ')
                const inner = (isBullet ? line.slice(2) : line).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                return isBullet
                  ? <li key={j} className="flex gap-2 text-xs font-mono text-zinc-400"><span className="text-zinc-700 flex-shrink-0">→</span><span dangerouslySetInnerHTML={{ __html: inner }} /></li>
                  : inner ? <p key={j} className="text-xs font-mono text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: inner }} /> : null
              })}
            </ul>
          )
        }
        // Numbered list
        if (part.match(/^\d+\./m)) {
          const lines = part.split('\n')
          return (
            <ol key={i} className="space-y-1.5">
              {lines.map((line, j) => {
                const numMatch = line.match(/^(\d+)\.\s*(.*)/)
                if (numMatch) {
                  const inner = numMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  return (
                    <li key={j} className="flex gap-3 text-xs font-mono text-zinc-400">
                      <span className="text-zinc-600 flex-shrink-0 w-4">{numMatch[1]}.</span>
                      <span dangerouslySetInnerHTML={{ __html: inner }} />
                    </li>
                  )
                }
                return line ? <p key={j} className="text-xs font-mono text-zinc-400" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /> : null
              })}
            </ol>
          )
        }
        // Normal paragraph
        const inner = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <p key={i} className="text-xs font-mono text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: inner }} />
      })}
    </div>
  )
}

// ─── Paper detail view ────────────────────────────────────────────────────────

function PaperDetail({ paper, onBack }: { paper: Paper; onBack: () => void }) {
  const [activeSection, setActiveSection] = useState(0)
  const status = statusConfig[paper.status]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-300 transition-colors mb-6">
        ← Back to research
      </button>

      {/* Header */}
      <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/20 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <Badge text={paper.category} cls="bg-blue-950 text-blue-400" />
          <Badge text={status.label} cls={status.cls} />
        </div>
        <h1 className="text-lg font-mono font-bold text-zinc-100 leading-tight mb-2">{paper.title}</h1>
        {paper.subtitle && <p className="text-sm font-mono text-zinc-500 mb-4">{paper.subtitle}</p>}
        <div className="flex flex-wrap gap-3 text-[11px] font-mono text-zinc-600 mb-4">
          <span>By {paper.authors.join(', ')}</span>
          <span>·</span>
          <span>{new Date(paper.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {paper.publishedDate && <><span>·</span><span>Published {new Date(paper.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span></>}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {paper.tags.map(tag => (
            <Badge key={tag} text={tag} cls={tagColors[tag] ?? 'bg-zinc-800 text-zinc-500'} />
          ))}
        </div>

        {/* PDF download */}
        {paper.pdfPath ? (
          <a href={paper.pdfPath} download
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 rounded hover:border-zinc-500 hover:text-zinc-100 transition-colors">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><path d="M8 12L3 7h3V1h4v6h3L8 12zM1 14h14v1H1z"/></svg>
            Download PDF
          </a>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-zinc-900 text-zinc-600 border border-zinc-800 rounded">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current"><path d="M8 12L3 7h3V1h4v6h3L8 12zM1 14h14v1H1z"/></svg>
            PDF pending legal review
          </div>
        )}
      </div>

      {/* Status warning for pending disclosure */}
      {paper.status === 'pending-disclosure' && (
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-4 mb-6">
          <p className="text-xs font-mono text-amber-400">
            ⚠ This paper is pending responsible disclosure. Full technical details are published here as an observation report. Formal disclosure to the affected vendor is in progress. Do not contact the vendor independently regarding this finding.
          </p>
        </div>
      )}

      {/* Abstract */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Abstract</span>
        </div>
        <div className="p-5">
          <p className="text-sm font-mono text-zinc-300 leading-relaxed">{paper.abstract}</p>
        </div>
      </div>

      {/* Key findings */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Key findings</span>
        </div>
        <div className="p-5 space-y-2">
          {paper.keyFindings.map((f, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-emerald-600 font-mono text-xs flex-shrink-0 font-bold">{i + 1}.</span>
              <p className="text-xs font-mono text-emerald-400 leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclosure timeline */}
      {paper.disclosureTimeline && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Disclosure timeline</span>
          </div>
          <div className="p-5 space-y-3">
            {paper.disclosureTimeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <code className="text-[11px] font-mono text-zinc-600 w-24 flex-shrink-0 pt-0.5">{t.date}</code>
                <p className="text-xs font-mono text-zinc-400">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paper body — section nav + content */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
          <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Full paper</span>
        </div>
        {/* Section tabs */}
        <div className="flex flex-wrap gap-1 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
          {paper.sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
              className={`px-3 py-1 text-[11px] font-mono rounded transition-colors ${activeSection === i ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}>
              {s.heading}
            </button>
          ))}
        </div>
        <div className="p-5 space-y-4">
          <h3 className="text-sm font-mono font-semibold text-zinc-200">{paper.sections[activeSection].heading}</h3>
          <PaperBody text={paper.sections[activeSection].body} />
        </div>
      </div>

      {/* References */}
      {paper.references && paper.references.length > 0 && (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800">
            <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">References</span>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {paper.references.map((r, i) => (
              <div key={i} className="flex gap-4 px-5 py-3">
                <span className="text-[11px] font-mono text-zinc-600 w-4 flex-shrink-0 pt-0.5">[{i + 1}]</span>
                <div className="flex-1 min-w-0">
                  {r.url
                    ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-400 hover:underline break-all">{r.label}</a>
                    : <span className="text-xs font-mono text-zinc-300">{r.label}</span>
                  }
                  <p className="text-[11px] font-mono text-zinc-600 mt-0.5">{r.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Paper card ───────────────────────────────────────────────────────────────

function PaperCard({ paper, onClick }: { paper: Paper; onClick: () => void }) {
  const status = statusConfig[paper.status]
  return (
    <button onClick={onClick}
      className="w-full text-left border border-zinc-800 rounded-lg p-5 bg-zinc-900/20 hover:bg-zinc-900/50 hover:border-zinc-700 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge text={paper.category} cls="bg-blue-950 text-blue-400" />
          <Badge text={status.label} cls={status.cls} />
        </div>
        <span className="text-[11px] font-mono text-zinc-700">
          {new Date(paper.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </span>
      </div>
      <h3 className="text-sm font-mono font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug mb-2">
        {paper.title}
      </h3>
      {paper.subtitle && (
        <p className="text-[11px] font-mono text-zinc-600 mb-3 leading-snug">{paper.subtitle}</p>
      )}
      <p className="text-xs font-mono text-zinc-500 leading-relaxed line-clamp-3 mb-3">
        {paper.abstract.split('\n\n')[0]}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {paper.tags.slice(0, 5).map(tag => (
          <Badge key={tag} text={tag} cls={tagColors[tag] ?? 'bg-zinc-800 text-zinc-500'} />
        ))}
        {paper.tags.length > 5 && <Badge text={`+${paper.tags.length - 5}`} cls="bg-zinc-800 text-zinc-600" />}
      </div>
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState('ALL')
  const [tagFilter, setTagFilter] = useState<PaperTag | 'ALL'>('ALL')

  const openPaper = papers.find(p => p.id === selectedPaper)

  const filtered = useMemo(() => papers.filter(p => {
    if (catFilter !== 'ALL' && p.category !== catFilter) return false
    if (tagFilter !== 'ALL' && !p.tags.includes(tagFilter as PaperTag)) return false
    return true
  }), [catFilter, tagFilter])

  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, Paper[]> = {}
    for (const p of filtered) {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    }
    return map
  }, [filtered])

  if (openPaper) {
    return (
      <div className="min-h-full bg-zinc-950 text-zinc-100 px-6 py-8">
        <PaperDetail paper={openPaper} onBack={() => setSelectedPaper(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100 px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <h1 className="text-xl font-mono font-bold text-zinc-100 mb-2">Research & Whitepapers</h1>
          <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-2xl">
            Original security research, TSCM findings, and technical whitepapers. Papers in pending-disclosure status are published as observation reports while formal vendor notification is in progress.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] font-mono text-zinc-700 self-center mr-1 uppercase tracking-wider">Category:</span>
            {['ALL', ...allCategories].map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${catFilter === c ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-8 text-xs font-mono">
          <div><span className="text-zinc-600">Papers: </span><span className="text-zinc-300">{papers.length}</span></div>
          <div><span className="text-zinc-600">Published: </span><span className="text-emerald-400">{papers.filter(p => p.status === 'published' || p.status === 'disclosed').length}</span></div>
          <div><span className="text-zinc-600">In progress: </span><span className="text-amber-400">{papers.filter(p => p.status === 'draft' || p.status === 'review' || p.status === 'pending-disclosure').length}</span></div>
        </div>

        {/* Papers grouped by category */}
        {Object.entries(grouped).map(([category, categoryPapers]) => (
          <div key={category} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest">{category}</h2>
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] font-mono text-zinc-700">{categoryPapers.length} paper{categoryPapers.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3">
              {categoryPapers.map(paper => (
                <PaperCard key={paper.id} paper={paper} onClick={() => setSelectedPaper(paper.id)} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xs font-mono text-zinc-700">No papers match the current filter.</p>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-zinc-800">
          <p className="text-[11px] font-mono text-zinc-700 leading-relaxed">
            All research is conducted in authorized environments. Pending-disclosure papers are published as observation reports only — vendor notification is handled through appropriate responsible disclosure channels before technical details that could enable exploitation are released. If you have questions or have observed similar findings, contact information is available via the GitHub repository.
          </p>
        </div>
      </div>
    </div>
  )
}
