// Unified search index for the global search bar.
// Page entries link to the route; section entries link to the route with
// ?section=<id> (or ?tool=<id> for /tools). Each subpage reads that param on
// mount and selects the matching section.
//
// Keep in sync with each page's NAV array. There's no shared module to import
// from yet; the cost of the duplication is one entry per new section, but it
// keeps subpages simple.

import { networkSearchEntries }     from '@/lib/network/data'
import { forensicsSearchEntries }   from '@/lib/forensics/data'
import { malwareSearchEntries }     from '@/lib/malware/data'
import { osintSearchEntries }       from '@/lib/osint/data'
import { pentestSearchEntries }     from '@/lib/pentest/data'
import { pentestAdvancedSearchEntries } from '@/lib/pentest/dataAdvanced'
import { mobileSearchEntries }      from '@/lib/mobile/data'
import { rfSearchEntries }          from '@/lib/rf/data'
import { cloudSearchEntries }       from '@/lib/cloud/data'
import type { RawSearchEntry }      from './types'

export type SearchEntry = {
  kind: 'page' | 'section' | 'tool' | 'entry'
  title: string
  subtitle: string
  href: string
  page: string
  color: string
}

const PAGES: SearchEntry[] = [
  { kind: 'page', title: 'Tools',              subtitle: 'Hash · subnet · JWT · email headers · regex · cert · cron',         href: '/tools',      page: 'Tools',           color: 'zinc'    },
  { kind: 'page', title: 'Code Playground',    subtitle: 'Live Python, JavaScript, Go, Ruby, Bash execution',                  href: '/playground', page: 'Playground',      color: 'emerald' },
  { kind: 'page', title: 'OSINT Reference',    subtitle: 'Search operators · sock puppets · username enum · infra · darkweb', href: '/osint',      page: 'OSINT',           color: 'coral'   },
  { kind: 'page', title: 'Pentesting',         subtitle: 'Recon · scanning · Metasploit · webapp · AD · post-exploit',         href: '/pentest',    page: 'Pentest',         color: 'rose'    },
  { kind: 'page', title: 'Malware Analysis',   subtitle: 'PE · YARA · packers · C2 · evasion · families',                      href: '/malware',    page: 'Malware',         color: 'amber'   },
  { kind: 'page', title: 'Network Utilities',  subtitle: 'Ports · Wireshark · Nmap · protocols · attack signatures',           href: '/network',    page: 'Network',         color: 'teal'    },
  { kind: 'page', title: 'Digital Forensics',  subtitle: 'Windows · Linux · macOS artifacts · memory · triage',                href: '/forensics',  page: 'Forensics',       color: 'purple'  },
  { kind: 'page', title: 'Mobile Forensics',   subtitle: 'Android · iOS · ADB · SQLite · cloud extraction',                    href: '/mobile',     page: 'Mobile',          color: 'sky'     },
  { kind: 'page', title: 'Cloud Security',     subtitle: 'AWS · Azure · GCP · IAM · containers · cloud IR',                    href: '/cloud',      page: 'Cloud',           color: 'violet'  },
  { kind: 'page', title: 'RF / TSCM',          subtitle: 'Frequency · path loss · sweep · bug frequencies · SDR · TEMPEST',    href: '/rf',         page: 'RF / TSCM',       color: 'blue'    },
]

type SectionDef = { id: string; label: string; sub: string }

const FORENSICS_SECTIONS: SectionDef[] = [
  { id: 'windows',       label: 'Windows artifacts',     sub: 'Event IDs · registry · execution · USB' },
  { id: 'linux',         label: 'Linux artifacts',       sub: 'Auth · history · persistence' },
  { id: 'macos',         label: 'macOS artifacts',       sub: 'Unified Log · LaunchAgents · KnowledgeC' },
  { id: 'keyartifacts',  label: 'Key artifacts (CI)',    sub: 'Shellbags · LNK · Prefetch · VSS' },
  { id: 'srum',          label: 'SRUM',                  sub: 'Network bytes per process · exfil volume' },
  { id: 'cloud',         label: 'Cloud storage',         sub: 'OneDrive · Dropbox · Google Drive · Box' },
  { id: 'antiforensics', label: 'Anti-forensics',        sub: 'Timestomping · wiping · log clearing' },
  { id: 'axiom',         label: 'AXIOM artifacts',       sub: 'MRU · USN · PS history · tasks · creds' },
  { id: 'browsersql',    label: 'Browser SQL',           sub: 'Chrome · Firefox · Edge · Safari queries' },
  { id: 'memory',        label: 'Memory forensics',      sub: 'Volatility 3 · triage · plugins' },
  { id: 'triage',        label: 'Triage & acquisition',  sub: 'KAPE · Velociraptor · imaging · memory' },
  { id: 'tools',         label: 'Tool cheat sheets',     sub: 'EZ Tools · KAPE · X-Ways · Axiom' },
]

const NETWORK_SECTIONS: SectionDef[] = [
  { id: 'ports',     label: 'Common ports',       sub: '60+ ports with security notes' },
  { id: 'wireshark', label: 'Wireshark filters',  sub: 'Display filters by category' },
  { id: 'nmap',      label: 'Nmap reference',     sub: 'Scans · scripts · combos' },
  { id: 'protocols', label: 'Protocol quick-ref', sub: 'DNS · HTTP · TLS · ICMP · ARP' },
  { id: 'subnet',    label: 'Subnet / CIDR',      sub: 'Masks · host counts · ranges' },
  { id: 'attacks',   label: 'Attack signatures',  sub: 'Indicators · filters · mitigations' },
  { id: 'tcpdump',   label: 'tcpdump',            sub: 'Capture · filters · ring buffer' },
  { id: 'netcat',    label: 'Netcat / Ncat',      sub: 'Listeners · shells · file transfer' },
  { id: 'firewall',  label: 'Firewall rules',     sub: 'iptables · nftables · WinFW' },
  { id: 'dns',       label: 'DNS deep dive',      sub: 'dig · zone transfer · DoH · DoT' },
  { id: 'tls',       label: 'TLS/SSL testing',    sub: 'openssl · testssl.sh · nmap' },
  { id: 'scapy',     label: 'Scapy / crafting',   sub: 'Build · send · sniff · fuzz' },
  { id: 'pivot',     label: 'Pivoting / tunnels', sub: 'SSH · chisel · ligolo · proxychains' },
  { id: 'wireless',  label: 'Wireless',           sub: 'Monitor · WPA2 · PMKID · kismet' },
  { id: 'ipv6',      label: 'IPv6 reference',     sub: 'Addressing · NDP · attack vectors' },
]

const MALWARE_SECTIONS: SectionDef[] = [
  { id: 'workflow',     label: 'Static analysis workflow', sub: 'Triage → strings → PE → YARA' },
  { id: 'pe',           label: 'PE file structure',        sub: 'Headers · sections · imports' },
  { id: 'packers',      label: 'Packer signatures',        sub: 'UPX · Themida · VMProtect · CS' },
  { id: 'yara',         label: 'YARA rule writing',        sub: 'Syntax · modifiers · patterns' },
  { id: 'c2',           label: 'C2 beacon patterns',       sub: 'Cobalt Strike · Sliver · Meterpreter' },
  { id: 'evasion',      label: 'Sandbox evasion',          sub: 'Time · env · VM detection' },
  { id: 'antianalysis', label: 'Anti-analysis',            sub: 'Anti-debug · anti-EDR/AV' },
  { id: 'families',     label: 'Malware families',         sub: 'RATs · stealers · loaders · ransomware' },
]

const OSINT_SECTIONS: SectionDef[] = [
  { id: 'search',   label: 'Search operators',    sub: 'Google · Bing · dorks' },
  { id: 'people',   label: 'People search',       sub: 'Spokeo · Pipl · PACER' },
  { id: 'username', label: 'Username enum',       sub: 'Sherlock · Maigret · breaches' },
  { id: 'image',    label: 'Image OSINT',         sub: 'Reverse · EXIF · geolocation' },
  { id: 'social',   label: 'Social media',        sub: 'LinkedIn · Twitter · Facebook' },
  { id: 'infra',    label: 'Domain / IP / infra', sub: 'Shodan · crt.sh · DNS history' },
  { id: 'phone',    label: 'Phone OSINT',         sub: 'Truecaller · Phoneinfoga' },
  { id: 'darkweb',  label: 'Dark web OSINT',      sub: 'Breaches · Tor · ransomware leak sites' },
  { id: 'corp',     label: 'Corporate intel',     sub: 'SEC · SAM.gov · patents' },
  { id: 'persona',  label: 'Sock puppet OPSEC',   sub: 'Infrastructure · identity · ops' },
]

const PENTEST_SECTIONS: SectionDef[] = [
  { id: 'recon',        label: 'Recon & enum',         sub: 'whois · Shodan · dorks · LDAP' },
  { id: 'scan',         label: 'Discovery & scanning', sub: 'Nmap · masscan · NSE scripts' },
  { id: 'service',      label: 'Service enumeration',  sub: 'SMB · SSH · RDP · HTTP · SNMP' },
  { id: 'vulnscan',     label: 'Vuln scanning',        sub: 'Nessus · Nikto · Nuclei' },
  { id: 'metasploit',   label: 'Metasploit',           sub: 'search · sessions · Meterpreter' },
  { id: 'webapp',       label: 'Web app testing',      sub: 'SQLi · XSS · LFI · upload bypass' },
  { id: 'passwords',    label: 'Password attacks',     sub: 'Hydra · hashcat · CME · John' },
  { id: 'postexploit',  label: 'Post-exploitation',    sub: 'PrivEsc · enum · creds · loot' },
  { id: 'ad',           label: 'Active Directory',     sub: 'BloodHound · Kerberoast · DCSync' },
  { id: 'cves',         label: 'Common CVEs',          sub: 'EternalBlue · Log4Shell · Zerologon' },
  { id: 'lateral',      label: 'Lateral movement',     sub: 'PsExec · WMI · Chisel · Ligolo-ng' },
  { id: 'linprivesc',   label: 'Linux PrivEsc',        sub: 'sudo · SUID · cron · capabilities' },
  { id: 'winprivesc',   label: 'Windows PrivEsc',      sub: 'Potato · services · UAC · DLL' },
  { id: 'shells',       label: 'Shells & payloads',    sub: 'Reverse shells · TTY · msfvenom' },
  { id: 'filetransfer', label: 'File transfer',        sub: 'wget · certutil · SMB · base64' },
  { id: 'bof',          label: 'Buffer overflow',      sub: 'Stack BOF · Immunity · Mona · JMP' },
  { id: 'reporting',    label: 'Reporting & evidence', sub: 'CVSS · findings · checklist' },
]

const MOBILE_SECTIONS: SectionDef[] = [
  { id: 'acquisition',  label: 'Acquisition methods',   sub: 'Logical · FS · physical · JTAG' },
  { id: 'artifacts',    label: 'Device artifacts',      sub: 'Android + iOS paths and value' },
  { id: 'backups',      label: 'iOS backup structure',  sub: 'iTunes · iCloud · GrayKey' },
  { id: 'sqlite',       label: 'SQLite databases',      sub: 'Key tables, columns, epoch notes' },
  { id: 'apps',         label: 'App artifact paths',    sub: 'WhatsApp · Signal · Telegram' },
  { id: 'adb',          label: 'ADB reference',         sub: 'Device info · extraction · forensics' },
  { id: 'ioslog',       label: 'iOS Unified Log',       sub: 'sysdiagnose · execution · network' },
  { id: 'androidlog',   label: 'Android logs',          sub: 'Logcat · tombstones · Dropbox · netstats' },
  { id: 'cloud',        label: 'Cloud extraction',      sub: 'iCloud · Google · WhatsApp backup' },
  { id: 'appdeep',      label: 'App deep dives',        sub: 'WhatsApp · Signal · Telegram · Snap' },
  { id: 'location',     label: 'Location forensics',    sub: 'Significant Locations · Timeline · towers' },
  { id: 'comms',        label: 'Comms correlation',     sub: 'SMS · calls · iMessage identity' },
  { id: 'malware',      label: 'Malware indicators',    sub: 'Jailbreak · stalkerware · root' },
  { id: 'antiforensics',label: 'Anti-forensics',        sub: 'Factory reset · wipe · encryption' },
  { id: 'smartwatch',   label: 'Smartwatch forensics',  sub: 'Apple Watch · Samsung · Fitbit · Garmin' },
  { id: 'jtag',         label: 'JTAG / chip-off',       sub: 'Hardware extraction workflow' },
  { id: 'ufed',         label: 'Cellebrite / UFED',     sub: 'Extraction types · PA workflow' },
]

const RF_SECTIONS: SectionDef[] = [
  { id: 'freq',           label: 'Frequency reference',   sub: 'ISM · cellular · gov · ham' },
  { id: 'fspl',           label: 'Path loss calc',        sub: 'FSPL · EIRP · link budget' },
  { id: 'channels',       label: 'Channel maps',          sub: '2.4 GHz · 5 GHz · BLE' },
  { id: 'math',           label: 'Signal math',           sub: 'dBm ↔ mW · EIRP · ref table' },
  { id: 'antenna',        label: 'Antenna & link budget', sub: 'Gain · patterns · formulas' },
  { id: 'modulation',     label: 'Modulation reference',  sub: 'AM · FM · FHSS · OFDM · OOK' },
  { id: 'sweep',          label: 'Sweep methodology',     sub: 'Pre-sweep · RF · physical · docs' },
  { id: 'tscm',           label: 'TSCM devices',          sub: 'Threat freqs · detection' },
  { id: 'bugfreq',        label: 'Bug frequencies',       sub: 'Audio · video · GSM · cellular' },
  { id: 'physical',       label: 'Physical indicators',   sub: 'Screws · paint · wiring · weight' },
  { id: 'countersurv',    label: 'Counter-surv',          sub: 'Foot · vehicle · technical' },
  { id: 'rogue',          label: 'Rogue AP reference',    sub: 'Evil twin · indicators · tools' },
  { id: 'taxonomy',       label: 'Device taxonomy',       sub: 'Acoustic · optical · RF · IoT' },
  { id: 'actors',         label: 'Threat actors',         sub: 'Nation-state · insider · criminal' },
  { id: 'baseline',       label: 'Spectrum baseline',     sub: 'Office · mil · industrial' },
  { id: 'tempest',        label: 'TEMPEST / emanations',  sub: 'Van Eck · keyboard · powerline' },
  { id: 'rbs',            label: 'Rogue base stations',   sub: '2G/LTE attacks · SDR · detection' },
  { id: 'cellular',       label: 'Cellular threats',      sub: 'IMSI · rogue cell · carrier current' },
  { id: 'countermeasures',label: 'Countermeasures',       sub: 'Shielding · masking · policy' },
  { id: 'training',       label: 'Training scenarios',    sub: 'Beginner → expert · 5 scenarios' },
  { id: 'report',         label: 'Survey report',         sub: 'Sweep documentation · export' },
  { id: 'sdr',            label: 'SDR quick reference',   sub: 'HackRF · RTL · TinySA · Flipper' },
  { id: 'tools',          label: 'TSCM tool reference',   sub: 'OSCOR · TALAN · NLJD · TinySA' },
]

const CLOUD_SECTIONS: SectionDef[] = [
  { id: 'aws',       label: 'AWS reference',       sub: 'Services · CloudTrail · IAM gotchas' },
  { id: 'azure',     label: 'Azure reference',     sub: 'Services · Activity Log · Entra ID' },
  { id: 'gcp',       label: 'GCP reference',       sub: 'Services · Audit Logs · IAM' },
  { id: 'iam',       label: 'IAM attacks',         sub: 'Privesc paths across all three clouds' },
  { id: 'k8s',       label: 'Containers & Kubernetes', sub: 'RBAC · pod escape · runtime' },
  { id: 'storage',   label: 'Storage attacks',     sub: 'S3 · Blob · GCS misconfigs + audit events' },
  { id: 'forensics', label: 'Cloud forensics & IR', sub: 'Runbook · evidence · containment' },
  { id: 'tools',     label: 'Cloud security tools', sub: 'Prowler · CloudFox · Pacu · kube-bench' },
]

const TOOLS_SECTIONS: SectionDef[] = [
  { id: 'hash',      label: 'Hash & encoding',     sub: 'MD5 · SHA · Base64 · hex · URL' },
  { id: 'subnet',    label: 'Subnet calculator',   sub: 'CIDR · hosts · mask · binary' },
  { id: 'timestamp', label: 'Timestamp converter', sub: 'Unix · FILETIME · Chrome · Mac' },
  { id: 'packet',    label: 'Packet decoder',      sub: 'Ethernet · IP · TCP · UDP · DNS' },
  { id: 'regex',     label: 'Regex tester',        sub: 'Live match · groups · highlight' },
  { id: 'jwt',       label: 'JWT decoder',         sub: 'Header · payload · expiry check' },
  { id: 'cert',      label: 'Certificate decoder', sub: 'PEM · fields · SHA-256 fingerprint' },
  { id: 'email',     label: 'Email headers',       sub: 'SPF · DKIM · DMARC · routing · phishing' },
  { id: 'entropy',   label: 'Entropy calculator',  sub: 'Shannon · classification · histogram' },
  { id: 'mac',       label: 'MAC address lookup',  sub: 'OUI vendor · UAA/LAA · EUI-64' },
  { id: 'uuid',      label: 'UUID / GUID decoder', sub: 'Version · v1 timestamp · MAC' },
  { id: 'chars',     label: 'Char inspector',      sub: 'Codepoint · UTF-8 · non-print' },
  { id: 'codeopt',   label: 'Code optimizer',      sub: 'Bug detection · security · AI' },
  { id: 'explain',   label: 'Code explainer',      sub: 'Plain English · technical · security lens' },
  { id: 'jsonyaml',  label: 'JSON ↔ YAML',         sub: 'Convert between formats' },
  { id: 'urlparser', label: 'URL parser',          sub: 'Scheme · host · params · fragment' },
  { id: 'cron',      label: 'Cron visualizer',     sub: 'Schedule → plain English + next runs' },
]

function expand(sections: SectionDef[], page: string, route: string, color: string, paramName = 'section'): SearchEntry[] {
  return sections.map(s => ({
    kind: paramName === 'tool' ? 'tool' : 'section',
    title: s.label,
    subtitle: `${page} · ${s.sub}`,
    href: `${route}?${paramName}=${s.id}`,
    page,
    color,
  }))
}

function flatten(raw: RawSearchEntry[], page: string, route: string, color: string): SearchEntry[] {
  return raw.map(r => ({
    kind: 'entry' as const,
    title: r.title,
    subtitle: r.aka ? `${r.aka} · ${r.subtitle}` : r.subtitle,
    href: `${route}?section=${r.section}`,
    page,
    color,
  }))
}

export const SEARCH_INDEX: SearchEntry[] = [
  ...PAGES,
  ...expand(TOOLS_SECTIONS,     'Tools',     '/tools',     'zinc',    'tool'),
  ...expand(OSINT_SECTIONS,     'OSINT',     '/osint',     'coral'),
  ...expand(PENTEST_SECTIONS,   'Pentest',   '/pentest',   'rose'),
  ...expand(MALWARE_SECTIONS,   'Malware',   '/malware',   'amber'),
  ...expand(NETWORK_SECTIONS,   'Network',   '/network',   'teal'),
  ...expand(FORENSICS_SECTIONS, 'Forensics', '/forensics', 'purple'),
  ...expand(CLOUD_SECTIONS,     'Cloud',     '/cloud',     'violet'),
  ...expand(MOBILE_SECTIONS,    'Mobile',    '/mobile',    'sky'),
  ...expand(RF_SECTIONS,        'RF / TSCM', '/rf',        'blue'),
  // Entry-level: every concrete data row across the lib/* files.
  ...flatten(networkSearchEntries,        'Network',   '/network',   'teal'),
  ...flatten(forensicsSearchEntries,      'Forensics', '/forensics', 'purple'),
  ...flatten(malwareSearchEntries,        'Malware',   '/malware',   'amber'),
  ...flatten(osintSearchEntries,          'OSINT',     '/osint',     'coral'),
  ...flatten(pentestSearchEntries,        'Pentest',   '/pentest',   'rose'),
  ...flatten(pentestAdvancedSearchEntries,'Pentest',   '/pentest',   'rose'),
  ...flatten(mobileSearchEntries,         'Mobile',    '/mobile',    'sky'),
  ...flatten(rfSearchEntries,             'RF / TSCM', '/rf',        'blue'),
  ...flatten(cloudSearchEntries,          'Cloud',     '/cloud',     'violet'),
]

// Pages float to the top, sections next, then concrete entries.
const KIND_RANK: Record<SearchEntry['kind'], number> = { page: 0, section: 1, tool: 1, entry: 2 }

// Substring + acronym scoring. Higher = better match.
export function searchEntries(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const scored: { entry: SearchEntry; score: number }[] = []
  for (const entry of SEARCH_INDEX) {
    const title = entry.title.toLowerCase()
    const subtitle = entry.subtitle.toLowerCase()
    let score = 0

    if (title === q) score = 1000
    else if (title.startsWith(q)) score = 500
    else if (title.includes(q)) score = 250
    else if (subtitle.includes(q)) score = 100

    // Acronym match (e.g., "wf" → "Wireshark filters")
    if (score === 0) {
      const initials = title.split(/\s+/).map(w => w[0]).join('')
      if (initials.startsWith(q)) score = 80
    }

    if (score > 0) {
      // Prefer pages over sections when scores tie
      score -= KIND_RANK[entry.kind]
      scored.push({ entry, score })
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry)
}

export const COLOR_DOT: Record<string, string> = {
  zinc:    'bg-zinc-500',
  emerald: 'bg-emerald-400',
  blue:    'bg-blue-400',
  purple:  'bg-purple-400',
  amber:   'bg-amber-400',
  teal:    'bg-teal-400',
  rose:    'bg-rose-400',
  coral:   'bg-red-400',
  violet:  'bg-violet-400',
  sky:     'bg-sky-400',
}
