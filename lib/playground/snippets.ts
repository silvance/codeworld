export type Language = 'python' | 'javascript' | 'bash'

export interface Snippet {
  id: string
  title: string
  description: string
  language: Language
  code: string
}

export interface SnippetCategory {
  id: Language
  name: string
  snippets: Snippet[]
}

const pythonSnippets: Snippet[] = [
  {
    id: 'py-hash-id',
    title: 'Hash identifier',
    description: 'Identify algorithm by digest length',
    language: 'python',
    code: `def identify_hash(digest: str) -> str:
    digest = digest.strip()
    sizes = {
        32:  "MD5",
        40:  "SHA-1",
        56:  "SHA-224",
        64:  "SHA-256 / SHA3-256",
        96:  "SHA-384",
        128: "SHA-512 / SHA3-512",
    }
    return sizes.get(len(digest), f"Unknown ({len(digest)} hex chars)")

samples = [
    "5f4dcc3b5aa765d61d8327deb882cf99",
    "a665a45920422f9d417e4867efdc4fb8a04a1f3f",
    "a665a45920422f9d417e4867efdc4fb8a04a1f3f3f2f1f2f3f4f5f6f7f8f9f0",
]

for h in samples:
    print(f"{h[:24]}...  →  {identify_hash(h)}")
`,
  },
  {
    id: 'py-b64',
    title: 'Base64 encode/decode',
    description: 'Encode and decode base64 strings',
    language: 'python',
    code: `import base64

def enc(s: str) -> str:
    return base64.b64encode(s.encode()).decode()

def dec(s: str) -> str:
    return base64.b64decode(s.encode()).decode()

samples = [
    "THM{flag_goes_here}",
    "sensitive_data_example",
]

print("=== Encoding ===")
for s in samples:
    print(f"{s!r}\\n  → {enc(s)}")

print("\\n=== Decoding ===")
encoded = ["VEhNe2ZsYWdfZ29lc19oZXJlfQ==", "c2Vuc2l0aXZlX2RhdGFfZXhhbXBsZQ=="]
for s in encoded:
    print(f"{s}\\n  → {dec(s)!r}")
`,
  },
  {
    id: 'py-entropy',
    title: 'Shannon entropy',
    description: 'Detect encrypted/packed data by entropy',
    language: 'python',
    code: `import math
from collections import Counter

def entropy(data: str) -> float:
    if not data:
        return 0.0
    freq = Counter(data)
    n = len(data)
    return -sum((c / n) * math.log2(c / n) for c in freq.values())

samples = {
    "Normal English":    "The quick brown fox jumps over the lazy dog",
    "Base64 encoded":    "aGVsbG8gd29ybGQ=aGVsbG8gd29ybGQ=aGVsbG8=",
    "Hex key material":  "4a5d8f2c91b3e670ad14c82f5b039e17dead",
    "Low entropy":       "aaaaaaaaaaaaaaaaaaaaaaaaa",
}

header = f"{'Sample':<22} {'Entropy':>8}  Assessment"
print(header)
print("-" * 50)
for label, s in samples.items():
    e = entropy(s)
    flag = "⚠  High — likely encoded/encrypted" if e > 5.5 else (
           "✓  Normal"                           if e > 3.0 else
           "↓  Low — repetitive data")
    print(f"{label:<22} {e:>8.4f}  {flag}")
`,
  },
  {
    id: 'py-xor',
    title: 'XOR cipher',
    description: 'XOR encrypt/decrypt with multi-byte key',
    language: 'python',
    code: `def xor_bytes(data: bytes, key: bytes) -> bytes:
    key_len = len(key)
    return bytes(b ^ key[i % key_len] for i, b in enumerate(data))

def hex_dump(data: bytes, width: int = 16) -> str:
    lines = []
    for i in range(0, len(data), width):
        chunk = data[i:i + width]
        hex_part  = ' '.join(f'{b:02x}' for b in chunk)
        ascii_part = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
        lines.append(f"{i:04x}  {hex_part:<{width * 3}}  {ascii_part}")
    return '\\n'.join(lines)

plaintext = b"TSCM payload example"
key       = b"\\xde\\xad\\xbe\\xef"

encrypted = xor_bytes(plaintext, key)
decrypted = xor_bytes(encrypted, key)

print(f"Plaintext : {plaintext}")
print(f"Key       : {key.hex()}")
print(f"\\nEncrypted hex dump:")
print(hex_dump(encrypted))
print(f"\\nDecrypted : {decrypted}")
assert decrypted == plaintext, "Round-trip failed"
print("\\n✓ Round-trip verified")
`,
  },
  {
    id: 'py-wiggle',
    title: 'WiGLE CSV parser',
    description: 'Flag suspicious networks from WiGLE export',
    language: 'python',
    code: `import csv, io

# Simulated WiGLE CSV (subset of real format)
DATA = """MAC,SSID,AuthMode,FirstSeen,Channel,RSSI,CurrentLatitude,CurrentLongitude,AltitudeMeters,AccuracyMeters,Type
AA:BB:CC:DD:EE:FF,CorpNet,[WPA2][ESS],2024-01-01 10:00,6,-70,34.7,-86.6,5.0,10.0,WIFI
11:22:33:44:55:66,,[WEP][ESS],2024-01-01 10:01,1,-85,34.7,-86.6,5.0,10.0,WIFI
DE:AD:BE:EF:CA:FE,CorpNet,[WPA2][ESS],2024-01-01 10:02,6,-65,34.7,-86.6,5.0,10.0,WIFI
AA:BB:CC:11:22:33,xfinitywifi,[OPEN][ESS],2024-01-01 10:03,11,-90,34.7,-86.6,5.0,10.0,WIFI
FF:EE:DD:CC:BB:AA,NETGEAR,[WPA2][ESS],2024-01-01 10:04,11,-72,34.7,-86.6,5.0,10.0,WIFI"""

SUSPICIOUS = {'xfinitywifi', 'linksys', 'netgear', 'default', 'att uverse', ''}

reader = csv.DictReader(io.StringIO(DATA))
flags = []

for row in reader:
    ssid = row.get('SSID', '').strip()
    auth = row.get('AuthMode', '')
    reasons = []

    if ssid.lower() in SUSPICIOUS or ssid == '':
        reasons.append('Hidden or default SSID')
    if '[WEP]' in auth:
        reasons.append('Weak encryption (WEP)')
    if '[OPEN]' in auth:
        reasons.append('Open / unencrypted')

    if reasons:
        flags.append({'mac': row['MAC'], 'ssid': ssid or '<hidden>', 'reasons': reasons})

print(f"Flagged {len(flags)} of {DATA.count('WIFI')} networks:\\n")
for f in flags:
    print(f"  {f['mac']}  SSID: {f['ssid']!r}")
    for r in f['reasons']:
        print(f"    ⚠  {r}")
    print()
`,
  },
]

const jsSnippets: Snippet[] = [
  {
    id: 'js-jwt',
    title: 'JWT decoder',
    description: 'Decode JWT header and payload without verification',
    language: 'javascript',
    code: `function decodeJWT(token) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Expected 3 parts')

  const decode = b64 => {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/') +
      '=='.slice((b64.length + 3) % 4)
    return JSON.parse(atob(padded))
  }

  return {
    header:    decode(parts[0]),
    payload:   decode(parts[1]),
    signature: parts[2].slice(0, 16) + '...',
  }
}

// Demo JWT — safe test token
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbWVzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

const { header, payload, signature } = decodeJWT(token)
console.log('Header:')
console.log(JSON.stringify(header, null, 2))
console.log('\\nPayload:')
console.log(JSON.stringify(payload, null, 2))
console.log('\\nSignature (truncated):', signature)

// Check for common misconfigurations
if (header.alg === 'none') console.warn('\\n⚠  alg=none — signature not verified!')
if (payload.role)          console.log('\\n⚠  Sensitive claim "role" in payload — visible without verification')
`,
  },
  {
    id: 'js-subnet',
    title: 'Subnet calculator',
    description: 'Network address, broadcast, host range from CIDR',
    language: 'javascript',
    code: `function subnetCalc(cidr) {
  const [ipStr, prefixStr] = cidr.split('/')
  const prefix = parseInt(prefixStr)

  const ipToInt = ip => ip.split('.').reduce((n, o) => (n << 8) + parseInt(o), 0) >>> 0
  const intToIp = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join('.')

  const ip      = ipToInt(ipStr)
  const mask    = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ip & mask) >>> 0
  const bcast   = (network | ~mask) >>> 0
  const hosts   = Math.max(0, bcast - network - 1)

  return {
    network:     intToIp(network) + '/' + prefix,
    netmask:     intToIp(mask),
    broadcast:   intToIp(bcast),
    firstHost:   intToIp(network + 1),
    lastHost:    intToIp(bcast - 1),
    usableHosts: hosts.toLocaleString(),
  }
}

const ranges = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '192.168.10.50/28']

ranges.forEach(r => {
  const s = subnetCalc(r)
  console.log(\`=== \${r} ===\`)
  Object.entries(s).forEach(([k, v]) => console.log(\`  \${k.padEnd(14)}: \${v}\`))
  console.log()
})
`,
  },
  {
    id: 'js-hex',
    title: 'Hex / ASCII tools',
    description: 'Hex encode, decode, and dump arbitrary strings',
    language: 'javascript',
    code: `const hex = {
  encode: str => Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' '),

  decode: h => (h.replace(/\\s/g, '').match(/.{2}/g) || [])
    .map(b => String.fromCharCode(parseInt(b, 16)))
    .join(''),

  dump: (str, width = 16) => {
    const bytes = Array.from(str).map(c => c.charCodeAt(0))
    return bytes.reduce((lines, _, i) => {
      if (i % width !== 0) return lines
      const chunk  = bytes.slice(i, i + width)
      const addr   = i.toString(16).padStart(8, '0')
      const hexStr = chunk.map(b => b.toString(16).padStart(2,'0')).join(' ').padEnd(width * 3 - 1)
      const ascii  = chunk.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('')
      return [...lines, \`\${addr}  \${hexStr}  \${ascii}\`]
    }, []).join('\\n')
  },
}

const input = "TSCM{sample_artifact}"

console.log("Input:  ", input)
console.log("Hex:    ", hex.encode(input))
console.log("Verify: ", hex.decode(hex.encode(input)))
console.log("\\nHex dump:")
console.log(hex.dump(input))
`,
  },
  {
    id: 'js-caesar',
    title: 'Caesar / ROT13 brute-force',
    description: 'Rotation cipher with all 26 shifts',
    language: 'javascript',
    code: `const caesar = (text, shift) =>
  text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base)
  })

const rot13 = text => caesar(text, 13)

const ciphertext = "Gur dhvpx oebja sbk whzcf bire gur ynml qbt"
console.log("Ciphertext:", ciphertext)
console.log("ROT13:     ", rot13(ciphertext))
console.log()

// Brute-force all shifts — look for English words
console.log("--- All 26 shifts ---")
for (let i = 1; i <= 25; i++) {
  const decoded = caesar(ciphertext, i)
  // Highlight the correct shift
  const marker = i === 13 ? "  ◄" : ""
  console.log(\`Shift \${String(i).padStart(2)}: \${decoded}\${marker}\`)
}
`,
  },
]

const bashSnippets: Snippet[] = [
  {
    id: 'bash-recon',
    title: 'Basic host recon',
    description: 'System info and network enumeration',
    language: 'bash',
    code: `#!/bin/bash
# Basic host recon
whoami
id
uname -a
hostname

echo ""
echo "=== Network interfaces ==="
ip addr

echo ""
echo "=== Listening ports ==="
netstat -tlnp

echo ""
echo "=== Running processes ==="
ps aux`,
  },
  {
    id: 'bash-suid',
    title: 'Find SUID/SGID binaries',
    description: 'Locate elevated-permission files',
    language: 'bash',
    code: `#!/bin/bash
echo "=== SUID binaries ==="
find / -perm -4000 -type f 2>/dev/null

echo ""
echo "=== SGID binaries ==="
find / -perm -2000 -type f 2>/dev/null

echo ""
echo "=== World-writable directories ==="
find / -perm -0002 -type d 2>/dev/null`,
  },
  {
    id: 'bash-creds',
    title: 'Credential hunting',
    description: 'Search common locations for passwords',
    language: 'bash',
    code: `#!/bin/bash
echo "=== /etc/passwd ==="
cat /etc/passwd

echo ""
echo "=== /etc/shadow ==="
cat /etc/shadow

echo ""
echo "=== Shell history ==="
cat /home/operator/.bash_history`,
  },
  {
    id: 'bash-b64',
    title: 'Base64 encode/decode',
    description: 'Pipe to/from base64',
    language: 'bash',
    code: `#!/bin/bash
echo "=== Encoding ==="
echo "hello world" | base64
echo "THM{flag_example}" | base64

echo ""
echo "=== Decoding ==="
echo "aGVsbG8gd29ybGQ=" | base64 -d
echo ""
echo "VEhNe2ZsYWdfZXhhbXBsZX0=" | base64 -d
echo ""`,
  },
  {
    id: 'bash-xxd',
    title: 'Hex dump',
    description: 'xxd on strings and files',
    language: 'bash',
    code: `#!/bin/bash
echo "=== Hex dump of string ==="
echo -n "TSCM payload" | xxd

echo ""
echo "=== Hex dump of /etc/hostname ==="
cat /etc/hostname | xxd

echo ""
echo "=== Reverse hex ==="
echo "5453434d207061796c6f6164" | xxd -r -p
echo ""`,
  },
]

export const categories: SnippetCategory[] = [
  { id: 'python',     name: 'Python',     snippets: pythonSnippets },
  { id: 'javascript', name: 'JavaScript', snippets: jsSnippets },
  { id: 'bash',       name: 'Bash',       snippets: bashSnippets },
]
