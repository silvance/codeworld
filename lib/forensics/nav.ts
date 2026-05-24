export type SectionId =
  | 'windows' | 'linux' | 'macos' | 'keyartifacts' | 'memory' | 'tools'
  | 'srum' | 'cloud' | 'antiforensics' | 'axiom' | 'browsersql' | 'triage'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  { id: 'windows',      label: 'Windows artifacts',  sub: 'Event IDs · registry · execution · USB',  icon: '🪟', group: 'OS Artifacts' },
  { id: 'linux',        label: 'Linux artifacts',     sub: 'Auth · history · persistence',            icon: '🐧', group: 'OS Artifacts' },
  { id: 'macos',        label: 'macOS artifacts',     sub: 'Unified Log · LaunchAgents · KnowledgeC', icon: '🍎', group: 'OS Artifacts' },
  { id: 'keyartifacts', label: 'Key artifacts (CI)',  sub: 'Shellbags · LNK · Prefetch · VSS',        icon: '🔑', group: 'CI Analysis' },
  { id: 'srum',         label: 'SRUM',                sub: 'Network bytes per process · exfil volume', icon: '📊', group: 'CI Analysis' },
  { id: 'cloud',        label: 'Cloud storage',       sub: 'OneDrive · Dropbox · Google Drive · Box',  icon: '☁', group: 'CI Analysis' },
  { id: 'antiforensics',label: 'Anti-forensics',      sub: 'Timestomping · wiping · log clearing',    icon: '🕵', group: 'CI Analysis' },
  { id: 'axiom',        label: 'AXIOM artifacts',      sub: 'MRU · USN · PS history · tasks · creds',  icon: '🧲', group: 'CI Analysis' },
  { id: 'browsersql',   label: 'Browser SQL',         sub: 'Chrome · Firefox · Edge · Safari queries', icon: '🌐', group: 'Reference' },
  { id: 'memory',       label: 'Memory forensics',    sub: 'Volatility 3 · triage · plugins',         icon: '🧠', group: 'Reference' },
  { id: 'triage',       label: 'Triage & acquisition',sub: 'KAPE · Velociraptor · imaging · memory',   icon: '🚑', group: 'Reference' },
  { id: 'tools',        label: 'Tool cheat sheets',   sub: 'EZ Tools · KAPE · X-Ways · Axiom',        icon: '🛠', group: 'Reference' },
]

export const GROUPS = ['OS Artifacts', 'CI Analysis', 'Reference']
