import Link from 'next/link'

const TOOLS = [
  {
    href:    '/playground',
    label:   'Code Playground',
    status:  'operational',
    desc:    'Live Python, JavaScript, and Bash execution. Pre-loaded with cyber-relevant snippets for hash analysis, encoding, subnet math, and more.',
    tags:    ['Python', 'JavaScript', 'Bash'],
    stat:    { label: 'Languages', value: '3' },
  },
  {
    href:    '/rf',
    label:   'RF / TSCM',
    status:  'operational',
    desc:    'Frequency reference tables, free-space path loss calculator, WiFi and BLE channel maps, signal math, TSCM threat device database, and rogue AP detection indicators.',
    tags:    ['Frequency Ref', 'Path Loss', 'Channel Maps', 'Signal Math', 'TSCM Devices'],
    stat:    { label: 'Tools', value: '6' },
  },
  {
    href:    '/forensics',
    label:   'Digital Forensics',
    status:  'operational',
    desc:    'Windows and Linux artifact locations, registry hives, execution artifacts, browser and USB forensics, memory analysis workflow, and tool cheat sheets.',
    tags:    ['Windows', 'Linux', 'Memory', 'Volatility', 'X-Ways', 'Axiom'],
    stat:    { label: 'Sections', value: '4' },
  },
  {
    href:    '/mobile',
    label:   'Mobile Forensics',
    status:  'operational',
    desc:    'Android and iOS artifact paths, acquisition method reference, key SQLite databases, app artifact locations, ADB command reference, and iOS backup structure.',
    tags:    ['Android', 'iOS', 'ADB', 'SQLite', 'FOR585'],
    stat:    { label: 'Sections', value: '6' },
  },
]

const STATS = [
  { label: 'Tools',        value: '4' },
  { label: 'Sections',     value: '20+' },
  { label: 'Event IDs',    value: '30+' },
  { label: 'ADB Commands', value: '40+' },
]

export default function HomePage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-300">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10 pb-8 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">
                codeworld
              </h1>
              <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
                A collection of reference tools and interactive utilities for cyber operations, TSCM, and digital forensics. Built for practitioners, not demos.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              All systems operational
            </div>
          </div>

          <div className="flex gap-6 mt-6 flex-wrap">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-lg font-semibold text-zinc-100">{s.value}</div>
                <div className="text-xs text-zinc-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href} className="group block">
              <div className="h-full border border-zinc-800 rounded-lg p-5 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-150">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {tool.label}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {tool.stat.value} {tool.stat.label} →
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">{tool.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded border border-zinc-700/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-zinc-700">Cyber · TSCM · Digital Forensics</p>
          <p className="text-xs text-zinc-700">codeworld.codes</p>
        </div>

      </div>
    </div>
  )
}
