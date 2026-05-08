'use client'

import { useState, useMemo } from 'react'
import {
  awsServices, azureServices, gcpServices,
  auditEvents, misconfigs, iamPaths, storageAttacks,
  k8sChain, irRunbook, cloudTools,
  type CloudService,
} from '@/lib/cloud/data'

// ─── Shared primitives ────────────────────────────────────────────────────────

const SH = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-6">
    <h2 className="text-base font-mono font-semibold text-zinc-100">{title}</h2>
    <p className="text-xs text-zinc-500 mt-1">{sub}</p>
  </div>
)

const Badge = ({ text, cls }: { text: string; cls: string }) => (
  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded ${cls}`}>{text}</span>
)

const inputCls =
  'bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500'

const cloudBadge = (c: 'AWS' | 'Azure' | 'GCP' | 'All') => {
  const map = {
    AWS:   'bg-orange-950 text-orange-400',
    Azure: 'bg-sky-950 text-sky-400',
    GCP:   'bg-violet-950 text-violet-400',
    All:   'bg-zinc-800 text-zinc-400',
  }
  return <Badge text={c} cls={map[c]} />
}

const categoryBadge = (c: string) => (
  <Badge text={c} cls="bg-zinc-800 text-zinc-500" />
)

// ─── Provider service tables (shared) ─────────────────────────────────────────

function ProviderRef({
  title, sub, badge, services,
}: {
  title: string
  sub: string
  badge: 'AWS' | 'Azure' | 'GCP'
  services: CloudService[]
}) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('ALL')
  const cats = ['ALL', ...Array.from(new Set(services.map(s => s.category)))]

  const filtered = useMemo(() => services.filter(s => {
    if (cat !== 'ALL' && s.category !== cat) return false
    if (!search) return true
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.notable.toLowerCase().includes(q)
  }), [search, cat, services])

  return (
    <div>
      <SH title={title} sub={sub} />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search service or note…" className={`${inputCls} flex-1 min-w-[12rem]`} />
        <select value={cat} onChange={e => setCat(e.target.value)} className={inputCls}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-[10px] font-mono text-zinc-600">{filtered.length} / {services.length}</span>
      </div>

      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.name} className="border border-zinc-800 rounded p-3 bg-zinc-950/40">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <div className="flex items-center gap-2">
                {cloudBadge(badge)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{s.name}</span>
                {categoryBadge(s.category)}
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
            <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed"><span className="text-zinc-600">↳ </span>{s.notable}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-xs text-zinc-600 font-mono">No matches.</p>}
      </div>
    </div>
  )
}

export const AWSReference   = () => <ProviderRef title="AWS reference"   sub="Critical services, gotchas, and where logs live" badge="AWS"   services={awsServices}   />
export const AzureReference = () => <ProviderRef title="Azure reference" sub="Critical services, gotchas, and where logs live" badge="Azure" services={azureServices} />
export const GCPReference   = () => <ProviderRef title="GCP reference"   sub="Critical services, gotchas, and where logs live" badge="GCP"   services={gcpServices}   />

// ─── IAM attack paths ─────────────────────────────────────────────────────────

export function IAMAttacks() {
  const [search, setSearch] = useState('')
  const [cloud, setCloud] = useState<'ALL' | 'AWS' | 'Azure' | 'GCP'>('ALL')
  const filtered = iamPaths.filter(p => {
    if (cloud !== 'ALL' && p.cloud !== cloud) return false
    if (!search) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.trigger.toLowerCase().includes(q) || p.steps.join(' ').toLowerCase().includes(q)
  })

  return (
    <div>
      <SH title="IAM attack patterns" sub="Privilege escalation paths across AWS, Azure, and GCP — with detection guidance" />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter…" className={`${inputCls} flex-1 min-w-[12rem]`} />
        <select value={cloud} onChange={e => setCloud(e.target.value as 'ALL' | 'AWS' | 'Azure' | 'GCP')} className={inputCls}>
          <option value="ALL">All clouds</option>
          <option value="AWS">AWS</option>
          <option value="Azure">Azure</option>
          <option value="GCP">GCP</option>
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.cloud + p.name} className="border border-zinc-800 rounded p-4 bg-zinc-950/40">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                {cloudBadge(p.cloud)}
                <span className="text-sm font-mono font-semibold text-zinc-100">{p.name}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600">trigger: {p.trigger}</span>
            </div>
            <ol className="space-y-1.5 mt-2 list-decimal list-inside marker:text-zinc-700">
              {p.steps.map((s, i) => (
                <li key={i} className="text-[11px] font-mono text-zinc-400 leading-relaxed break-all">{s}</li>
              ))}
            </ol>
            <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">Detect</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">{p.detection}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Containers & Kubernetes ──────────────────────────────────────────────────

export function ContainersK8s() {
  const stages = Array.from(new Set(k8sChain.map(s => s.stage)))
  return (
    <div>
      <SH title="Containers & Kubernetes" sub="Common attack chain stages with concrete commands and detections — assume compromised pod" />
      <div className="space-y-5">
        {stages.map(stage => (
          <div key={stage}>
            <h3 className="text-xs font-mono font-semibold text-violet-400 uppercase tracking-wider mb-2">{stage}</h3>
            <div className="space-y-2">
              {k8sChain.filter(s => s.stage === stage).map((s, i) => (
                <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-950/40">
                  <div className="text-sm font-mono text-zinc-100 mb-1.5">{s.technique}</div>
                  <pre className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 mb-2 whitespace-pre-wrap break-all">{s.command}</pre>
                  <p className="text-[11px] text-zinc-500 leading-relaxed"><span className="text-zinc-600 uppercase tracking-wide mr-1.5">detect:</span>{s.detect}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Storage attacks ──────────────────────────────────────────────────────────

export function StorageAttacks() {
  return (
    <div>
      <SH title="Storage attacks" sub="S3, Azure Blob, and GCS misconfiguration patterns and how to surface them in audit logs" />
      <div className="space-y-2">
        {storageAttacks.map((a, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-1.5">
              {cloudBadge(a.cloud)}
              <span className="text-sm font-mono font-semibold text-zinc-100">{a.pattern}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{a.description}</p>
            <p className="text-[11px] text-zinc-500 mt-1.5"><span className="text-zinc-600 uppercase tracking-wide mr-1.5">detect:</span>{a.detect}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-2">High-signal audit events</h3>
        <div className="space-y-1.5">
          {auditEvents.map((e, i) => (
            <div key={i} className="border border-zinc-800 rounded px-3 py-2 bg-zinc-950/40">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  {cloudBadge(e.cloud)}
                  <code className="text-[11px] font-mono text-zinc-100 truncate">{e.event}</code>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{e.description}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5"><span className="text-zinc-600 uppercase tracking-wide mr-1.5">why:</span>{e.why}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Cloud forensics & IR ─────────────────────────────────────────────────────

export function CloudForensicsIR() {
  const phases = ['Identification', 'Containment', 'Eradication', 'Recovery', 'Lessons'] as const

  return (
    <div>
      <SH title="Cloud forensics & IR" sub="An incident response runbook tuned for cloud — preserve evidence without breaking the chain" />

      <div className="border border-amber-900/60 bg-amber-950/20 rounded p-3 mb-6">
        <p className="text-[11px] font-mono text-amber-400 mb-1 uppercase tracking-wide">First 15 minutes</p>
        <ul className="text-xs text-zinc-300 leading-relaxed list-disc list-inside marker:text-amber-700 space-y-0.5">
          <li>Pin a 14-day pre-window for log queries — long enough to catch staging, short enough to be queryable.</li>
          <li>Prefer disable over delete on identities and resources. Evidence first.</li>
          <li>Treat compromised compute as evidence, not as something to repair. Replace from IaC.</li>
          <li>Rotate every secret the principal touched, including refresh tokens and OAuth grants.</li>
        </ul>
      </div>

      <div className="space-y-5">
        {phases.map(phase => (
          <div key={phase}>
            <h3 className="text-xs font-mono font-semibold text-violet-400 uppercase tracking-wider mb-2">{phase}</h3>
            <div className="space-y-2">
              {irRunbook.filter(r => r.phase === phase).map((r, i) => (
                <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-950/40">
                  <div className="text-sm font-mono text-zinc-100 mb-1">{r.step}</div>
                  <pre className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 mb-2 whitespace-pre-wrap break-all">{r.command}</pre>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{r.notes}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Misconfig catalog (small one shown alongside Storage) — exposed if needed ─

export function MisconfigCatalog() {
  return (
    <div>
      <SH title="Common misconfigurations" sub="Patterns that show up in nearly every cloud assessment, with the fix" />
      <div className="space-y-2">
        {misconfigs.map((m, i) => (
          <div key={i} className="border border-zinc-800 rounded p-3 bg-zinc-950/40">
            <div className="flex items-center gap-2 mb-1.5">
              {cloudBadge(m.cloud)}
              {categoryBadge(m.area)}
              <span className="text-sm font-mono font-semibold text-zinc-100">{m.pattern}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-zinc-600">impact:</span> {m.impact}</p>
            <p className="text-[11px] text-zinc-500 mt-1"><span className="text-zinc-600">fix:</span> {m.fix}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Cloud security tools ─────────────────────────────────────────────────────

export function CloudToolsRef() {
  const cats = Array.from(new Set(cloudTools.map(t => t.category)))
  return (
    <div>
      <SH title="Cloud security tools" sub="Open-source tooling for assessment, offensive testing, and detection" />
      <div className="space-y-5">
        {cats.map(c => (
          <div key={c}>
            <h3 className="text-xs font-mono font-semibold text-violet-400 uppercase tracking-wider mb-2">{c}</h3>
            <div className="space-y-1.5">
              {cloudTools.filter(t => t.category === c).map(t => (
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
                   className="block border border-zinc-800 rounded p-3 bg-zinc-950/40 hover:border-zinc-600 transition-colors">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-mono font-semibold text-zinc-100">{t.name}</span>
                    <span className="text-[10px] font-mono text-zinc-600 truncate">{t.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t.description}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t.notes}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
