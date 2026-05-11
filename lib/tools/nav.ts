export type ToolId =
  | 'hash' | 'subnet' | 'timestamp' | 'packet' | 'regex' | 'jwt' | 'cert' | 'email'
  | 'entropy' | 'mac' | 'uuid' | 'chars' | 'codeopt' | 'explain' | 'jsonyaml' | 'urlparser' | 'cron'
  | 'pushtoken'

export interface NavItem { id: ToolId; label: string; sub: string; icon: string; script?: string }

export const NAV: NavItem[] = [
  { id: 'hash',      label: 'Hash & encoding',     sub: 'MD5 · SHA · Base64 · hex · URL',          icon: '#️⃣', script: '/hash_tool.py' },
  { id: 'subnet',    label: 'Subnet calculator',   sub: 'CIDR · hosts · mask · binary',            icon: '🌐', script: '/subnet.py' },
  { id: 'timestamp', label: 'Timestamp converter', sub: 'Unix · FILETIME · Chrome · Mac',          icon: '🕐', script: '/timestamp.py' },
  { id: 'packet',    label: 'Packet decoder',      sub: 'Ethernet · IP · TCP · UDP · DNS',         icon: '📦', script: '/packet_decoder.py' },
  { id: 'regex',     label: 'Regex tester',        sub: 'Live match · groups · highlight',         icon: '🔍' },
  { id: 'jwt',       label: 'JWT decoder',         sub: 'Header · payload · expiry check',         icon: '🔑' },
  { id: 'cert',      label: 'Certificate decoder', sub: 'PEM · fields · SHA-256 fingerprint',      icon: '📜' },
  { id: 'email',     label: 'Email headers',       sub: 'SPF · DKIM · DMARC · routing · phishing', icon: '✉️', script: '/email_header_analyzer.py' },
  { id: 'entropy',   label: 'Entropy calculator',  sub: 'Shannon · classification · histogram',    icon: '📊', script: '/entropy.py' },
  { id: 'mac',       label: 'MAC address lookup', sub: 'OUI vendor · UAA/LAA · EUI-64',            icon: '🔌', script: '/mac_lookup.py' },
  { id: 'uuid',      label: 'UUID / GUID decoder', sub: 'Version · v1 timestamp · MAC',            icon: '🆔', script: '/uuid_decoder.py' },
  { id: 'chars',     label: 'Char inspector',     sub: 'Codepoint · UTF-8 · non-print',            icon: '🔎' },
  { id: 'codeopt',   label: 'Code optimizer',     sub: 'Bug detection · security · AI',            icon: '🤖' },
  { id: 'explain',   label: 'Code explainer',     sub: 'Plain English · technical · security lens', icon: '💡' },
  { id: 'jsonyaml',  label: 'JSON ↔ YAML',        sub: 'Convert between formats — local',          icon: '⇄'  },
  { id: 'urlparser', label: 'URL parser',         sub: 'Scheme · host · params · fragment',        icon: '🔗' },
  { id: 'cron',      label: 'Cron visualizer',    sub: 'Schedule → plain English + next runs',     icon: '🕒' },
  { id: 'pushtoken', label: 'Push token ID',      sub: 'APNs · FCM · WNS · SNS · Expo · OneSignal', icon: '📲', script: '/push_token_id.py' },
]

export const VALID_TOOL_IDS: ToolId[] = NAV.map(n => n.id)
