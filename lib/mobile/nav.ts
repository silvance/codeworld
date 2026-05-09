export type SectionId =
  | 'acquisition' | 'artifacts' | 'backups' | 'sqlite' | 'apps' | 'adb'
  | 'ioslog' | 'androidlog' | 'cloud' | 'appdeep' | 'location'
  | 'comms' | 'malware' | 'antiforensics' | 'smartwatch' | 'jtag' | 'ufed'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  { id: 'acquisition',   label: 'Acquisition methods',  sub: 'Logical · FS · physical · JTAG',      icon: '📲', group: 'Foundations' },
  { id: 'artifacts',     label: 'Device artifacts',     sub: 'Android + iOS paths and value',       icon: '🗂', group: 'Foundations' },
  { id: 'backups',       label: 'iOS backup structure', sub: 'iTunes · iCloud · GrayKey',           icon: '☁', group: 'Foundations' },
  { id: 'sqlite',        label: 'SQLite databases',     sub: 'Key tables, columns, epoch notes',    icon: '🗄', group: 'Foundations' },
  { id: 'apps',          label: 'App artifact paths',   sub: 'WhatsApp · Signal · Telegram',        icon: '📱', group: 'Foundations' },
  { id: 'adb',           label: 'ADB reference',        sub: 'Device info · extraction · forensics', icon: '🔌', group: 'Foundations' },
  { id: 'ioslog',        label: 'iOS Unified Log',      sub: 'sysdiagnose · execution · network',   icon: '🍎', group: 'Advanced' },
  { id: 'androidlog',    label: 'Android logs',         sub: 'Logcat · tombstones · Dropbox · netstats', icon: '🤖', group: 'Advanced' },
  { id: 'cloud',         label: 'Cloud extraction',     sub: 'iCloud · Google · WhatsApp backup',   icon: '☁', group: 'Advanced' },
  { id: 'appdeep',       label: 'App deep dives',       sub: 'WhatsApp · Signal · Telegram · Snap', icon: '🔬', group: 'Advanced' },
  { id: 'location',      label: 'Location forensics',   sub: 'Sig Locations · Timeline · towers',   icon: '📍', group: 'Advanced' },
  { id: 'comms',         label: 'Comms correlation',    sub: 'SMS · calls · iMessage identity',     icon: '💬', group: 'Advanced' },
  { id: 'malware',       label: 'Malware indicators',   sub: 'Jailbreak · stalkerware · root',      icon: '🦠', group: 'Advanced' },
  { id: 'antiforensics', label: 'Anti-forensics',       sub: 'Factory reset · wipe · encryption',   icon: '🕵', group: 'Advanced' },
  { id: 'smartwatch',    label: 'Smartwatch forensics', sub: 'Apple Watch · Samsung · Fitbit · Garmin', icon: '⌚', group: 'Advanced' },
  { id: 'jtag',          label: 'JTAG / chip-off',      sub: 'Hardware extraction workflow',        icon: '🔧', group: 'Hardware' },
  { id: 'ufed',          label: 'Cellebrite / UFED',    sub: 'Extraction types · PA workflow',      icon: '🏛', group: 'Hardware' },
]

export const GROUPS = ['Foundations', 'Advanced', 'Hardware']
