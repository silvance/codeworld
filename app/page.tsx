import Link from 'next/link'

const TOOLS = [
  {
    href: '/tools', label: 'Hash & Encoding', cmd: 'cd /tools',
    desc: 'MD5, SHA-1, SHA-256, SHA-512, Base64, hex, URL encoding, HTML entities, ROT13, and number base conversion. All local — nothing leaves the browser.',
    tags: ['MD5', 'SHA-256', 'Base64', 'Hex', 'URL encode', 'ROT13'],
    stat: { label: 'Functions', value: '11' }, color: 'zinc',
  },
  {
    href: '/playground', label: 'Code Playground', cmd: 'cd /playground',
    desc: 'Live Python, JavaScript, Go, Ruby, and Bash execution. Pre-loaded with cyber-relevant snippets for hash analysis, encoding, subnet math, and more.',
    tags: ['Python', 'JavaScript', 'Go', 'Ruby', 'Bash'],
    stat: { label: 'Languages', value: '5' }, color: 'emerald',
  },
  {
    href: '/rf', label: 'RF / TSCM', cmd: 'cd /rf',
    desc: 'Frequency reference, path loss calculator, sweep methodology, bug frequencies, physical indicators, counter-surveillance, SDR reference, and TSCM tool guide.',
    tags: ['Freq Ref', 'Sweep', 'Bug Freq', 'SDR', 'Counter-Surv'],
    stat: { label: 'Sections', value: '14' }, color: 'blue',
  },
  {
    href: '/forensics', label: 'Digital Forensics', cmd: 'cd /forensics',
    desc: 'Windows, Linux, and macOS artifact locations, registry hives, execution artifacts, memory analysis workflow, and tool cheat sheets.',
    tags: ['Windows', 'Linux', 'macOS', 'Memory', 'X-Ways'],
    stat: { label: 'Sections', value: '5' }, color: 'purple',
  },
  {
    href: '/mobile', label: 'Mobile Forensics', cmd: 'cd /mobile',
    desc: 'Android and iOS artifact paths, acquisition methods, key SQLite databases, app artifact locations, and ADB command reference.',
    tags: ['Android', 'iOS', 'ADB', 'SQLite'],
    stat: { label: 'Sections', value: '6' }, color: 'amber',
  },
  {
    href: '/network', label: 'Network Utilities', cmd: 'cd /network',
    desc: 'Common ports with security notes, Wireshark display filters, Nmap scan reference, protocol quick-ref (DNS, HTTP, TLS, ICMP, ARP, SMB), and attack signatures.',
    tags: ['Ports', 'Wireshark', 'Nmap', 'Protocols', 'Attack Sigs'],
    stat: { label: 'Sections', value: '5' }, color: 'teal',
  },
  {
    href: '/malware', label: 'Malware Analysis', cmd: 'cd /malware',
    desc: 'PE structure, static analysis workflow, packer signatures, YARA rule writing, C2 beacon patterns, sandbox evasion, anti-analysis techniques, and malware families.',
    tags: ['PE Structure', 'YARA', 'Packers', 'C2', 'Evasion'],
    stat: { label: 'Sections', value: '8' }, color: 'rose',
  },
  {
    href: '/osint', label: 'OSINT Reference', cmd: 'cd /osint',
    desc: 'Search operators, people search sources, sock puppet OPSEC, username enumeration, image OSINT, social media, infrastructure, dark web, and corporate intel.',
    tags: ['Search Ops', 'People Search', 'Sock Puppet', 'Infra', 'Dark Web'],
    stat: { label: 'Sections', value: '10' }, color: 'coral',
  },
]

const STATS = [
  { label: 'Tools',            value: '8'   },
  { label: 'Sections',         value: '60+' },
  { label: 'Nmap Commands',    value: '35+' },
  { label: 'Wireshark Filters', value: '55+' },
]

const colorMap: Record<string, { border: string; bg: string; text: string; tag: string; tagText: string }> = {
  zinc:    { border: 'border-zinc-700 hover:border-zinc-500',         bg: 'hover:bg-zinc-900/60',    text: 'text-zinc-300',    tag: 'bg-zinc-800',       tagText: 'text-zinc-500'    },
  emerald: { border: 'border-emerald-900 hover:border-emerald-700',   bg: 'hover:bg-emerald-950/20', text: 'text-emerald-400', tag: 'bg-emerald-950/60', tagText: 'text-emerald-700' },
  blue:    { border: 'border-blue-900 hover:border-blue-700',         bg: 'hover:bg-blue-950/20',    text: 'text-blue-400',    tag: 'bg-blue-950/60',    tagText: 'text-blue-700'    },
  purple:  { border: 'border-purple-900 hover:border-purple-700',     bg: 'hover:bg-purple-950/20',  text: 'text-purple-400',  tag: 'bg-purple-950/60',  tagText: 'text-purple-700'  },
  amber:   { border: 'border-amber-900 hover:border-amber-700',       bg: 'hover:bg-amber-950/20',   text: 'text-amber-400',   tag: 'bg-amber-950/60',   tagText: 'text-amber-700'   },
  teal:    { border: 'border-teal-900 hover:border-teal-700',         bg: 'hover:bg-teal-950/20',    text: 'text-teal-400',    tag: 'bg-teal-950/60',    tagText: 'text-teal-700'    },
  rose:    { border: 'border-rose-900 hover:border-rose-700',         bg: 'hover:bg-rose-950/20',    text: 'text-rose-400',    tag: 'bg-rose-950/60',    tagText: 'text-rose-700'    },
  coral:   { border: 'border-red-900 hover:border-red-700',           bg: 'hover:bg-red-950/20',     text: 'text-red-400',     tag: 'bg-red-950/60',     tagText: 'text-red-700'     },
}

export default function HomePage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-300">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10 pb-8 border-b border-zinc-800">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">codeworld</h1>
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
          {TOOLS.map(tool => {
            const c = colorMap[tool.color]
            return (
              <Link key={tool.href} href={tool.href} className="group block">
                <div className={`h-full border rounded-lg p-5 transition-all duration-150 ${c.border} ${c.bg}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className={`text-sm font-semibold group-hover:text-white transition-colors ${c.text}`}>{tool.label}</span>
                    </div>
                    <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      {tool.stat.value} {tool.stat.label} →
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">{tool.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags.map(tag => (
                      <span key={tag} className={`text-[10px] px-2 py-0.5 rounded border border-zinc-700/50 ${c.tag} ${c.tagText}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-zinc-700">Cyber · TSCM · Forensics · Network · Malware · OSINT</p>
          <p className="text-xs text-zinc-700">codeworld.codes</p>
        </div>

      </div>
    </div>
  )
}
