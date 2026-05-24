export type ToolId =
  | 'hash' | 'subnet' | 'timestamp' | 'packet' | 'regex' | 'jwt' | 'cert' | 'email'
  | 'entropy' | 'mac' | 'uuid' | 'chars' | 'codeopt' | 'explain' | 'jsonyaml' | 'urlparser' | 'cron'
  | 'pushtoken'

export interface NavItem { id: ToolId; label: string; sub: string; icon: string; script?: string; cliExamples?: string[] }

export const NAV: NavItem[] = [
  { id: 'hash',      label: 'Hash & encoding',     sub: 'MD5 · SHA · Base64 · hex · URL',          icon: '#️⃣', script: '/hash_tool.py',
    cliExamples: ['python3 hash_tool.py "hello world"', 'python3 hash_tool.py --file binary.bin', 'echo -n hello | python3 hash_tool.py --json', 'python3 hash_tool.py --identify 5eb63bbbe01eeed093cb22bb8f5acdc3'] },
  { id: 'subnet',    label: 'Subnet calculator',   sub: 'CIDR · hosts · mask · binary',            icon: '🌐', script: '/subnet.py',
    cliExamples: ['python3 subnet.py 192.168.1.0/24', 'python3 subnet.py 10.0.0.0/8 --json', 'python3 subnet.py 2001:db8::/32'] },
  { id: 'timestamp', label: 'Timestamp converter', sub: 'Unix · FILETIME · Chrome · Mac',          icon: '🕐', script: '/timestamp.py',
    cliExamples: ['python3 timestamp.py 1717000000', 'python3 timestamp.py --format filetime 133614736000000000', 'python3 timestamp.py --now'] },
  { id: 'packet',    label: 'Packet decoder',      sub: 'Ethernet · IP · TCP · UDP · DNS',         icon: '📦', script: '/packet_decoder.py',
    cliExamples: ['python3 packet_decoder.py "ff ff ff ff ff ff 00 1a 2b ..."', 'python3 packet_decoder.py --file packet.hex', 'cat packet.hex | python3 packet_decoder.py --json'] },
  { id: 'regex',     label: 'Regex tester',        sub: 'Live match · groups · highlight',         icon: '🔍' },
  { id: 'jwt',       label: 'JWT decoder',         sub: 'Header · payload · expiry check',         icon: '🔑' },
  { id: 'cert',      label: 'Certificate decoder', sub: 'PEM · fields · SHA-256 fingerprint',      icon: '📜' },
  { id: 'email',     label: 'Email headers',       sub: 'SPF · DKIM · DMARC · routing · phishing', icon: '✉️', script: '/email_header_analyzer.py' },
  { id: 'entropy',   label: 'Entropy calculator',  sub: 'Shannon · classification · histogram',    icon: '📊', script: '/entropy.py',
    cliExamples: ['python3 entropy.py "the quick brown fox"', 'python3 entropy.py --file packed.exe', 'python3 entropy.py --hex 48656c6c6f --json'] },
  { id: 'mac',       label: 'MAC address lookup', sub: 'OUI vendor · UAA/LAA · EUI-64',            icon: '🔌', script: '/mac_lookup.py',
    cliExamples: ['python3 mac_lookup.py b8:27:eb:11:22:33', 'python3 mac_lookup.py --eui64 aa:bb:cc:dd:ee:ff'] },
  { id: 'uuid',      label: 'UUID / GUID decoder', sub: 'Version · v1 timestamp · MAC',            icon: '🆔', script: '/uuid_decoder.py',
    cliExamples: ['python3 uuid_decoder.py 550e8400-e29b-41d4-a716-446655440000', 'python3 uuid_decoder.py --json <uuid>'] },
  { id: 'chars',     label: 'Char inspector',     sub: 'Codepoint · UTF-8 · non-print',            icon: '🔎' },
  { id: 'codeopt',   label: 'Code optimizer',     sub: 'Bug detection · security · AI',            icon: '🤖' },
  { id: 'explain',   label: 'Code explainer',     sub: 'Plain English · technical · security lens', icon: '💡' },
  { id: 'jsonyaml',  label: 'JSON ↔ YAML',        sub: 'Convert between formats — local',          icon: '⇄'  },
  { id: 'urlparser', label: 'URL parser',         sub: 'Scheme · host · params · fragment',        icon: '🔗' },
  { id: 'cron',      label: 'Cron visualizer',    sub: 'Schedule → plain English + next runs',     icon: '🕒' },
  { id: 'pushtoken', label: 'Push token ID',      sub: 'APNs · FCM · WNS · SNS · Expo · OneSignal', icon: '📲', script: '/push_token_id.py',
    cliExamples: ['python3 push_token_id.py <token>', 'cat tokens.txt | python3 push_token_id.py', 'python3 push_token_id.py --json <token>'] },
]

export const VALID_TOOL_IDS: ToolId[] = NAV.map(n => n.id)
