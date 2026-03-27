'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ─── MD5 (pure JS — Web Crypto API doesn't include it) ────────────────────────
// Based on RSA Data Security RFC 1321 reference implementation
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  function strToBlocks(str: string): number[] {
    const blocks: number[] = []
    for (let i = 0; i < str.length * 8; i += 8) {
      blocks[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << i % 32
    }
    blocks[str.length >> 2] |= 0x80 << str.length % 4 * 8
    blocks[(((str.length + 8) >> 6) + 1) * 16 - 2] = str.length * 8
    return blocks
  }
  function binl2hex(binarray: number[]): string {
    const hexChars = '0123456789abcdef'
    let str = ''
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hexChars.charAt((binarray[i >> 2] >> i % 4 * 8 + 4) & 0xf)
             + hexChars.charAt((binarray[i >> 2] >> i % 4 * 8) & 0xf)
    }
    return str
  }

  // Encode UTF-8
  const utf8 = unescape(encodeURIComponent(input))
  const x = strToBlocks(utf8)
  let a =  1732584193
  let b = -271733879
  let c = -1732584194
  let d =  271733878

  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d
    a = md5ff(a, b, c, d, x[i],       7, -680876936)
    d = md5ff(d, a, b, c, x[i +  1], 12, -389564586)
    c = md5ff(c, d, a, b, x[i +  2], 17,  606105819)
    b = md5ff(b, c, d, a, x[i +  3], 22, -1044525330)
    a = md5ff(a, b, c, d, x[i +  4],  7, -176418897)
    d = md5ff(d, a, b, c, x[i +  5], 12,  1200080426)
    c = md5ff(c, d, a, b, x[i +  6], 17, -1473231341)
    b = md5ff(b, c, d, a, x[i +  7], 22, -45705983)
    a = md5ff(a, b, c, d, x[i +  8],  7,  1770035416)
    d = md5ff(d, a, b, c, x[i +  9], 12, -1958414417)
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = md5ff(a, b, c, d, x[i + 12],  7,  1804603682)
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = md5ff(b, c, d, a, x[i + 15], 22,  1236535329)
    a = md5gg(a, b, c, d, x[i +  1],  5, -165796510)
    d = md5gg(d, a, b, c, x[i +  6],  9, -1069501632)
    c = md5gg(c, d, a, b, x[i + 11], 14,  643717713)
    b = md5gg(b, c, d, a, x[i],      20, -373897302)
    a = md5gg(a, b, c, d, x[i +  5],  5, -701558691)
    d = md5gg(d, a, b, c, x[i + 10],  9,  38016083)
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = md5gg(b, c, d, a, x[i +  4], 20, -405537848)
    a = md5gg(a, b, c, d, x[i +  9],  5,  568446438)
    d = md5gg(d, a, b, c, x[i + 14],  9, -1019803690)
    c = md5gg(c, d, a, b, x[i +  3], 14, -187363961)
    b = md5gg(b, c, d, a, x[i +  8], 20,  1163531501)
    a = md5gg(a, b, c, d, x[i + 13],  5, -1444681467)
    d = md5gg(d, a, b, c, x[i +  2],  9, -51403784)
    c = md5gg(c, d, a, b, x[i +  7], 14,  1735328473)
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)
    a = md5hh(a, b, c, d, x[i +  5],  4, -378558)
    d = md5hh(d, a, b, c, x[i +  8], 11, -2022574463)
    c = md5hh(c, d, a, b, x[i + 11], 16,  1839030562)
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = md5hh(a, b, c, d, x[i +  1],  4, -1530992060)
    d = md5hh(d, a, b, c, x[i +  4], 11,  1272893353)
    c = md5hh(c, d, a, b, x[i +  7], 16, -155497632)
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = md5hh(a, b, c, d, x[i + 13],  4,  681279174)
    d = md5hh(d, a, b, c, x[i],      11, -358537222)
    c = md5hh(c, d, a, b, x[i +  3], 16, -722521979)
    b = md5hh(b, c, d, a, x[i +  6], 23,  76029189)
    a = md5hh(a, b, c, d, x[i +  9],  4, -640364487)
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = md5hh(c, d, a, b, x[i + 15], 16,  530742520)
    b = md5hh(b, c, d, a, x[i +  2], 23, -995338651)
    a = md5ii(a, b, c, d, x[i],       6, -198630844)
    d = md5ii(d, a, b, c, x[i +  7], 10,  1126891415)
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = md5ii(b, c, d, a, x[i +  5], 21, -57434055)
    a = md5ii(a, b, c, d, x[i + 12],  6,  1700485571)
    d = md5ii(d, a, b, c, x[i +  3], 10, -1894986606)
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = md5ii(b, c, d, a, x[i +  1], 21, -2054922799)
    a = md5ii(a, b, c, d, x[i +  8],  6,  1873313359)
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = md5ii(c, d, a, b, x[i +  6], 15, -1560198380)
    b = md5ii(b, c, d, a, x[i + 13], 21,  1309151649)
    a = md5ii(a, b, c, d, x[i +  4],  6, -145523070)
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = md5ii(c, d, a, b, x[i +  2], 15,  718787259)
    b = md5ii(b, c, d, a, x[i +  9], 21, -343485551)
    a = safeAdd(a, olda)
    b = safeAdd(b, oldb)
    c = safeAdd(c, oldc)
    d = safeAdd(d, oldd)
  }
  return binl2hex([a, b, c, d])
}

// ─── Web Crypto helpers ───────────────────────────────────────────────────────
async function webCryptoHash(algo: string, text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algo, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Encoding helpers ─────────────────────────────────────────────────────────
function toHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ')
}

function fromHex(hex: string): string {
  try {
    const bytes = hex.replace(/\s+/g, '').match(/.{1,2}/g)
    if (!bytes) return ''
    return new TextDecoder().decode(new Uint8Array(bytes.map(b => parseInt(b, 16))))
  } catch {
    return '(invalid hex)'
  }
}

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

function toBase64(text: string): string {
  try { return btoa(unescape(encodeURIComponent(text))) } catch { return '(encoding error)' }
}

function fromBase64(b64: string): string {
  try { return decodeURIComponent(escape(atob(b64.trim()))) } catch { return '(invalid base64)' }
}

function htmlEncode(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function htmlDecode(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'",
  }
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-zA-Z0-9#]+;/g, m => map[m] ?? m)
}

function numberConvert(value: string, fromBase: number): { bin: string; oct: string; dec: string; hex: string } | null {
  try {
    const n = parseInt(value.replace(/\s/g, ''), fromBase)
    if (isNaN(n)) return null
    return {
      bin: '0b' + n.toString(2),
      oct: '0o' + n.toString(8),
      dec: n.toString(10),
      hex: '0x' + n.toString(16).toUpperCase(),
    }
  } catch {
    return null
  }
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
          .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
          .catch(() => {})
      }}
      className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1 flex-shrink-0"
    >{copied ? '✓ copied' : 'copy'}</button>
  )
}

// ─── Result row ───────────────────────────────────────────────────────────────
function Row({ label, value, mono = true, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`flex-1 text-xs break-all ${mono ? 'font-mono' : ''} ${warn ? 'text-amber-400' : 'text-zinc-200'}`}>
        {value}
      </span>
      <CopyBtn text={value} />
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="px-4 bg-zinc-950/40">
        {children}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
type InputMode = 'text' | 'hex'

export default function HashTools() {
  const [input, setInput]         = useState('')
  const [inputMode, setInputMode] = useState<InputMode>('text')
  const [numInput, setNumInput]   = useState('')
  const [numBase, setNumBase]     = useState<2 | 8 | 10 | 16>(16)

  // Hash state
  const [hashMD5,    setHashMD5]    = useState('')
  const [hashSHA1,   setHashSHA1]   = useState('')
  const [hashSHA256, setHashSHA256] = useState('')
  const [hashSHA512, setHashSHA512] = useState('')

  // Encoding state — computed synchronously
  const textValue = inputMode === 'hex' ? fromHex(input) : input
  const b64Enc    = textValue ? toBase64(textValue)                    : ''
  const b64Dec    = input     ? (() => { try { return fromBase64(input) } catch { return '' } })() : ''
  const hexEnc    = textValue ? toHex(textValue)                       : ''
  const urlEnc    = textValue ? encodeURIComponent(textValue)          : ''
  const urlDec    = input     ? (() => { try { return decodeURIComponent(input) } catch { return '(invalid URI encoding)' } })() : ''
  const rot13Out  = textValue ? rot13(textValue)                       : ''
  const htmlEnc_  = textValue ? htmlEncode(textValue)                  : ''
  const htmlDec_  = input     ? htmlDecode(input)                      : ''

  const numResult = numInput ? numberConvert(numInput, numBase) : null

  // Input stats
  const byteLen  = new TextEncoder().encode(textValue).length
  const charLen  = textValue.length

  // Hash computation (async — Web Crypto + MD5)
  const computeRef = useRef(0)
  const computeHashes = useCallback(async (text: string) => {
    const id = ++computeRef.current
    if (!text) {
      setHashMD5(''); setHashSHA1(''); setHashSHA256(''); setHashSHA512('')
      return
    }
    setHashMD5(md5(text))
    const [s1, s256, s512] = await Promise.all([
      webCryptoHash('SHA-1', text),
      webCryptoHash('SHA-256', text),
      webCryptoHash('SHA-512', text),
    ])
    if (computeRef.current !== id) return  // stale — newer input arrived
    setHashSHA1(s1)
    setHashSHA256(s256)
    setHashSHA512(s512)
  }, [])

  useEffect(() => { void computeHashes(textValue) }, [textValue, computeHashes])

  const inputCls = 'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed'

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Header */}
        <div className="pb-5 border-b border-zinc-800">
          <h1 className="text-base font-mono font-semibold text-zinc-100 mb-1">Hash &amp; encoding tools</h1>
          <p className="text-xs text-zinc-500">All computation is local — nothing leaves the browser.</p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Input</span>
            <div className="flex gap-1">
              {(['text', 'hex'] as const).map(m => (
                <button key={m} onClick={() => setInputMode(m)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
                    inputMode === m ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}>{m}</button>
              ))}
            </div>
            {textValue && (
              <span className="text-[10px] font-mono text-zinc-700 ml-auto">
                {charLen} chars · {byteLen} bytes
              </span>
            )}
          </div>
          <textarea
            rows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={inputMode === 'text'
              ? 'Type or paste anything — hashes and encodings update live'
              : 'Paste hex bytes e.g. 48 65 6c 6c 6f'}
            className={inputCls}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
          {input && (
            <div className="flex justify-end">
              <button onClick={() => { setInput(''); setNumInput('') }}
                className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">
                clear
              </button>
            </div>
          )}
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Hashes */}
          <Section title="Hashes">
            <Row label="MD5"     value={hashMD5} />
            <Row label="SHA-1"   value={hashSHA1} />
            <Row label="SHA-256" value={hashSHA256} />
            <Row label="SHA-512" value={hashSHA512} />
          </Section>

          {/* Base64 */}
          <Section title="Base64">
            <Row label="Encode →" value={b64Enc} />
            <Row label="Decode →" value={b64Dec !== input ? b64Dec : ''} />
          </Section>

          {/* Hex */}
          <Section title="Hex">
            <Row label="Encode →" value={hexEnc} />
            <Row label="Decode →" value={inputMode === 'hex' ? textValue : ''} />
          </Section>

          {/* URL */}
          <Section title="URL encoding">
            <Row label="Encode →" value={urlEnc !== textValue ? urlEnc : ''} />
            <Row label="Decode →" value={urlDec !== input ? urlDec : ''} />
          </Section>

          {/* HTML entities */}
          <Section title="HTML entities">
            <Row label="Encode →" value={htmlEnc_ !== textValue ? htmlEnc_ : ''} />
            <Row label="Decode →" value={htmlDec_ !== input ? htmlDec_ : ''} />
          </Section>

          {/* ROT13 */}
          <Section title="ROT13">
            <Row label="Output" value={rot13Out} />
          </Section>

        </div>

        {/* Number converter — full width */}
        <Section title="Number base converter">
          <div className="py-3 space-y-3">
            <div className="flex gap-3 flex-wrap items-center">
              <input
                value={numInput}
                onChange={e => setNumInput(e.target.value)}
                placeholder={numBase === 16 ? 'e.g. ff0a or 0xff0a' : numBase === 2 ? 'e.g. 11001010' : 'e.g. 255'}
                className="flex-1 min-w-48 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500"
                spellCheck={false}
              />
              <div className="flex gap-1">
                {([16, 10, 8, 2] as const).map(b => (
                  <button key={b} onClick={() => setNumBase(b)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded transition-colors ${
                      numBase === b ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                    }`}>
                    {b === 16 ? 'hex' : b === 10 ? 'dec' : b === 8 ? 'oct' : 'bin'}
                  </button>
                ))}
              </div>
            </div>
            {numResult ? (
              <div>
                <Row label="Binary"  value={numResult.bin} />
                <Row label="Octal"   value={numResult.oct} />
                <Row label="Decimal" value={numResult.dec} />
                <Row label="Hex"     value={numResult.hex} />
              </div>
            ) : numInput ? (
              <p className="text-[11px] font-mono text-amber-500 pb-2">Invalid {numBase === 16 ? 'hex' : numBase === 10 ? 'decimal' : numBase === 8 ? 'octal' : 'binary'} value</p>
            ) : null}
          </div>
        </Section>

        {/* Hash identifier */}
        {input && !textValue.includes(' ') && /^[0-9a-fA-F]+$/.test(input.trim()) && (
          <Section title="Hash identifier">
            <div className="py-3">
              {(() => {
                const len = input.trim().length
                const id: Record<number, string> = {
                  32:  'MD5 (128-bit)',
                  40:  'SHA-1 (160-bit)',
                  56:  'SHA-224 (224-bit)',
                  64:  'SHA-256 (256-bit)',
                  96:  'SHA-384 (384-bit)',
                  128: 'SHA-512 (512-bit)',
                  16:  'Half-MD5 / LM hash segment',
                  48:  'Tiger-192',
                }
                const match = id[len]
                return match
                  ? <p className="text-xs font-mono text-emerald-400 pb-1">Likely: <strong>{match}</strong> ({len} hex chars = {len / 2} bytes)</p>
                  : <p className="text-xs font-mono text-zinc-500 pb-1">Unrecognised length ({len} hex chars). Common: MD5=32, SHA-1=40, SHA-256=64, SHA-512=128</p>
              })()}
            </div>
          </Section>
        )}

        <p className="text-[10px] font-mono text-zinc-800 text-center pb-4">
          MD5 · SHA-1 · SHA-256 · SHA-512 · Base64 · Hex · URL · HTML · ROT13 · Number base conversion
        </p>
      </div>
    </div>
  )
}
