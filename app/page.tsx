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
  {
    href: '/pentest', label: 'Pentesting', cmd: 'cd /pentest',
    desc: 'Recon, scanning, service enumeration, Metasploit, web app testing, password attacks, post-exploitation, Active Directory attacks, and reporting workflows — all in one reference.',
    tags: ['Metasploit', 'BloodHound', 'SQLi', 'PrivEsc', 'AD'],
    stat: { label: 'Sections', value: '10' }, color: 'rose',
  },
  {
    href: '/email', label: 'Email Header Analyzer', cmd: 'cd /email',
    desc: 'Paste raw email headers — instant SPF, DKIM, DMARC analysis, hop-by-hop routing chain, domain alignment check, and phishing flag detection. All local, nothing sent anywhere.',
    tags: ['SPF', 'DKIM', 'DMARC', 'Routing', 'Phishing'],
    stat: { label: 'Analysis', value: 'Local' }, color: 'sky',
  },
]

const STATS = [
  { label: 'Tools',            value: '10'  },
  { label: 'Sections',         value: '60+' },
  { label: 'Nmap Commands',    value: '35+' },
  { label: 'Wireshark Filters', value: '55+' },
]

const colorMap: Record<string, { border: string; bg: string; text: string; tag: string; tagText: string; glow: string }> = {
  zinc:    { border: 'border-zinc-700 hover:border-zinc-500',         bg: 'hover:bg-zinc-900/60',    text: 'text-zinc-300',    tag: 'bg-zinc-800',       tagText: 'text-zinc-500',    glow: 'hover:shadow-zinc-500/20'    },
  emerald: { border: 'border-emerald-900 hover:border-emerald-700',   bg: 'hover:bg-emerald-950/20', text: 'text-emerald-400', tag: 'bg-emerald-950/60', tagText: 'text-emerald-700', glow: 'hover:shadow-emerald-500/30' },
  blue:    { border: 'border-blue-900 hover:border-blue-700',         bg: 'hover:bg-blue-950/20',    text: 'text-blue-400',    tag: 'bg-blue-950/60',    tagText: 'text-blue-700',    glow: 'hover:shadow-blue-500/30'    },
  purple:  { border: 'border-purple-900 hover:border-purple-700',     bg: 'hover:bg-purple-950/20',  text: 'text-purple-400',  tag: 'bg-purple-950/60',  tagText: 'text-purple-700',  glow: 'hover:shadow-purple-500/30'  },
  amber:   { border: 'border-amber-900 hover:border-amber-700',       bg: 'hover:bg-amber-950/20',   text: 'text-amber-400',   tag: 'bg-amber-950/60',   tagText: 'text-amber-700',   glow: 'hover:shadow-amber-500/30'   },
  teal:    { border: 'border-teal-900 hover:border-teal-700',         bg: 'hover:bg-teal-950/20',    text: 'text-teal-400',    tag: 'bg-teal-950/60',    tagText: 'text-teal-700',    glow: 'hover:shadow-teal-500/30'    },
  rose:    { border: 'border-rose-900 hover:border-rose-700',         bg: 'hover:bg-rose-950/20',    text: 'text-rose-400',    tag: 'bg-rose-950/60',    tagText: 'text-rose-700',    glow: 'hover:shadow-rose-500/30'    },
  coral:   { border: 'border-red-900 hover:border-red-700',           bg: 'hover:bg-red-950/20',     text: 'text-red-400',     tag: 'bg-red-950/60',     tagText: 'text-red-700',     glow: 'hover:shadow-red-500/30'     },
  violet:  { border: 'border-violet-900 hover:border-violet-700',     bg: 'hover:bg-violet-950/20',  text: 'text-violet-400',  tag: 'bg-violet-950/60',  tagText: 'text-violet-700',  glow: 'hover:shadow-violet-500/30'  },
  sky:     { border: 'border-sky-900 hover:border-sky-700',           bg: 'hover:bg-sky-950/20',     text: 'text-sky-400',     tag: 'bg-sky-950/60',     tagText: 'text-sky-700',     glow: 'hover:shadow-sky-500/30'     },
}

export default function HomePage() {
  return (
    <div className="min-h-full text-zinc-300 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12 relative">

        <div className="relative mb-10 pb-8 border-b border-zinc-800">
          {/* Hero glow backdrop */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-12 -top-16 -bottom-4 -z-10">
            <div className="absolute left-[10%] top-0 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl hero-pulse" />
            <div className="absolute right-[5%] top-8 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl hero-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute left-[40%] top-20 h-56 w-56 rounded-full bg-rose-500/8 blur-3xl hero-pulse" style={{ animationDelay: '4s' }} />
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                codeworld
              </h1>
              <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
                A collection of reference tools and interactive utilities for cyber operations, TSCM, and digital forensics. Built for practitioners, not demos.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900 rounded px-3 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
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
          {TOOLS.map((tool, i) => {
            const c = colorMap[tool.color]
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block card-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`h-full border rounded-lg p-5 bg-zinc-950/40 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${c.border} ${c.bg} ${c.glow}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className={`text-sm font-semibold group-hover:text-white transition-colors ${c.text}`}>{tool.label}</span>
                    </div>
                    <span className="text-xs text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all">
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

        <footer className="mt-10 pt-6 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-700 flex-wrap">
            <span>Cyber · TSCM · Forensics · Network · Malware · OSINT</span>
            <span className="text-zinc-800">·</span>
            <span>v1.4.0</span>
            <span className="text-zinc-800">·</span>
            <span>Updated 2026-03-26</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-700 flex-wrap">
            <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <a
              href="https://github.com/silvance/codeworld"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="codeworld on GitHub"
              className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              github
            </a>
          </div>
        </footer>

      </div>
    </div>
  )
}
