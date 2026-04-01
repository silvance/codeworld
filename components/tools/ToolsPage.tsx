'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  SubnetCalculator, TimestampConverter, PacketDecoder,
  RegexTester, JWTDecoder, CertDecoder,
  EntropyCalc, MACLookup, UUIDDecoder, CharInspector,
} from './ToolsExtra'
import { CodeOptimizer } from './CodeOptimizer'

// ─── Hash tool (inlined here for the sidebar layout) ─────────────────────────

function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw=(x&0xffff)+(y&0xffff); const msw=(x>>16)+(y>>16)+(lsw>>16); return(msw<<16)|(lsw&0xffff) }
  function bitRot(n: number, c: number) { return(n<<c)|(n>>>(32-c)) }
  function cmn(q:number,a:number,b:number,x:number,s:number,t:number){return safeAdd(bitRot(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b)}
  function ff(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn((b&c)|(~b&d),a,b,x,s,t)}
  function gg(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn((b&d)|(c&~d),a,b,x,s,t)}
  function hh(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn(b^c^d,a,b,x,s,t)}
  function ii(a:number,b:number,c:number,d:number,x:number,s:number,t:number){return cmn(c^(b|~d),a,b,x,s,t)}
  const utf8=unescape(encodeURIComponent(input))
  const blk:number[]=[]
  for(let i=0;i<utf8.length*8;i+=8)blk[i>>5]|=(utf8.charCodeAt(i/8)&0xff)<<(i%32)
  blk[utf8.length>>2]|=0x80<<(utf8.length%4*8)
  blk[(((utf8.length+8)>>6)+1)*16-2]=utf8.length*8
  let a=1732584193,b=-271733879,c=-1732584194,d=271733878
  for(let i=0;i<blk.length;i+=16){
    const [oa,ob,oc,od]=[a,b,c,d]
    a=ff(a,b,c,d,blk[i],7,-680876936);d=ff(d,a,b,c,blk[i+1],12,-389564586);c=ff(c,d,a,b,blk[i+2],17,606105819);b=ff(b,c,d,a,blk[i+3],22,-1044525330)
    a=ff(a,b,c,d,blk[i+4],7,-176418897);d=ff(d,a,b,c,blk[i+5],12,1200080426);c=ff(c,d,a,b,blk[i+6],17,-1473231341);b=ff(b,c,d,a,blk[i+7],22,-45705983)
    a=ff(a,b,c,d,blk[i+8],7,1770035416);d=ff(d,a,b,c,blk[i+9],12,-1958414417);c=ff(c,d,a,b,blk[i+10],17,-42063);b=ff(b,c,d,a,blk[i+11],22,-1990404162)
    a=ff(a,b,c,d,blk[i+12],7,1804603682);d=ff(d,a,b,c,blk[i+13],12,-40341101);c=ff(c,d,a,b,blk[i+14],17,-1502002290);b=ff(b,c,d,a,blk[i+15],22,1236535329)
    a=gg(a,b,c,d,blk[i+1],5,-165796510);d=gg(d,a,b,c,blk[i+6],9,-1069501632);c=gg(c,d,a,b,blk[i+11],14,643717713);b=gg(b,c,d,a,blk[i],20,-373897302)
    a=gg(a,b,c,d,blk[i+5],5,-701558691);d=gg(d,a,b,c,blk[i+10],9,38016083);c=gg(c,d,a,b,blk[i+15],14,-660478335);b=gg(b,c,d,a,blk[i+4],20,-405537848)
    a=gg(a,b,c,d,blk[i+9],5,568446438);d=gg(d,a,b,c,blk[i+14],9,-1019803690);c=gg(c,d,a,b,blk[i+3],14,-187363961);b=gg(b,c,d,a,blk[i+8],20,1163531501)
    a=gg(a,b,c,d,blk[i+13],5,-1444681467);d=gg(d,a,b,c,blk[i+2],9,-51403784);c=gg(c,d,a,b,blk[i+7],14,1735328473);b=gg(b,c,d,a,blk[i+12],20,-1926607734)
    a=hh(a,b,c,d,blk[i+5],4,-378558);d=hh(d,a,b,c,blk[i+8],11,-2022574463);c=hh(c,d,a,b,blk[i+11],16,1839030562);b=hh(b,c,d,a,blk[i+14],23,-35309556)
    a=hh(a,b,c,d,blk[i+1],4,-1530992060);d=hh(d,a,b,c,blk[i+4],11,1272893353);c=hh(c,d,a,b,blk[i+7],16,-155497632);b=hh(b,c,d,a,blk[i+10],23,-1094730640)
    a=hh(a,b,c,d,blk[i+13],4,681279174);d=hh(d,a,b,c,blk[i],11,-358537222);c=hh(c,d,a,b,blk[i+3],16,-722521979);b=hh(b,c,d,a,blk[i+6],23,76029189)
    a=hh(a,b,c,d,blk[i+9],4,-640364487);d=hh(d,a,b,c,blk[i+12],11,-421815835);c=hh(c,d,a,b,blk[i+15],16,530742520);b=hh(b,c,d,a,blk[i+2],23,-995338651)
    a=ii(a,b,c,d,blk[i],6,-198630844);d=ii(d,a,b,c,blk[i+7],10,1126891415);c=ii(c,d,a,b,blk[i+14],15,-1416354905);b=ii(b,c,d,a,blk[i+5],21,-57434055)
    a=ii(a,b,c,d,blk[i+12],6,1700485571);d=ii(d,a,b,c,blk[i+3],10,-1894986606);c=ii(c,d,a,b,blk[i+10],15,-1051523);b=ii(b,c,d,a,blk[i+1],21,-2054922799)
    a=ii(a,b,c,d,blk[i+8],6,1873313359);d=ii(d,a,b,c,blk[i+15],10,-30611744);c=ii(c,d,a,b,blk[i+6],15,-1560198380);b=ii(b,c,d,a,blk[i+13],21,1309151649)
    a=ii(a,b,c,d,blk[i+4],6,-145523070);d=ii(d,a,b,c,blk[i+11],10,-1120210379);c=ii(c,d,a,b,blk[i+2],15,718787259);b=ii(b,c,d,a,blk[i+9],21,-343485551)
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od)
  }
  return [a,b,c,d].map(n=>[(n&0xff),(n>>8&0xff),(n>>16&0xff),(n>>24&0xff)].map(b=>b.toString(16).padStart(2,'0')).join('')).join('')
}

async function webHash(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

function rot13(s: string) { return s.replace(/[a-zA-Z]/g,c=>{const b=c<='Z'?65:97;return String.fromCharCode(((c.charCodeAt(0)-b+13)%26)+b)}) }
function toB64(s: string) { try{return btoa(unescape(encodeURIComponent(s)))}catch{return '(error)'} }
function fromB64(s: string) { try{return decodeURIComponent(escape(atob(s.trim())))}catch{return '(invalid)'} }
function htmlEnc(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;') }
function htmlDec(s: string) { const m:Record<string,string>={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#x27;':"'",'&#39;':"'"}; return s.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/&[a-zA-Z0-9#]+;/g,k=>m[k]??k) }
function toHex(s: string) { return Array.from(new TextEncoder().encode(s)).map(b=>b.toString(16).padStart(2,'0')).join(' ') }
function numConv(v: string, base: number) { const n=parseInt(v.replace(/\s/g,''),base); if(isNaN(n))return null; return{bin:'0b'+n.toString(2),oct:'0o'+n.toString(8),dec:n.toString(10),hex:'0x'+n.toString(16).toUpperCase()} }

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false)
  return <button onClick={()=>navigator.clipboard.writeText(text).then(()=>{setC(true);setTimeout(()=>setC(false),1500)}).catch(()=>{})} className="text-[10px] font-mono text-zinc-600 hover:text-zinc-300 transition-colors px-1 flex-shrink-0">{c?'✓ copied':'copy'}</button>
}

function RowH({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="flex-1 text-xs font-mono text-zinc-200 break-all">{value}</span>
      <CopyBtn text={value} />
    </div>
  )
}

function SectionH({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="px-4 bg-zinc-950/30">{children}</div>
    </div>
  )
}

function HashTool() {
  const [input, setInput]       = useState('')
  const [inputMode, setInputMode] = useState<'text'|'hex'>('text')
  const [numInput, setNumInput] = useState('')
  const [numBase, setNumBase]   = useState<2|8|10|16>(16)
  const [hMD5, setHMD5]   = useState('')
  const [hSHA1, setHSHA1] = useState('')
  const [hSHA256, setHSHA256] = useState('')
  const [hSHA512, setHSHA512] = useState('')
  const computeRef = useRef(0)

  const textVal = inputMode === 'hex'
    ? (() => { try { const b=(input.replace(/\s+/g,'')).match(/.{1,2}/g); return b?new TextDecoder().decode(new Uint8Array(b.map(x=>parseInt(x,16)))):'' } catch { return '' } })()
    : input

  const b64enc = textVal ? toB64(textVal) : ''
  const hexenc = textVal ? toHex(textVal) : ''
  const urlenc = textVal ? (() => { try{return encodeURIComponent(textVal)}catch{return ''} })() : ''
  const urldec = input  ? (() => { try{return decodeURIComponent(input)}catch{return '(invalid)'} })() : ''
  const rot13o = textVal ? rot13(textVal) : ''
  const htmle  = textVal ? htmlEnc(textVal) : ''
  const htmld  = input  ? htmlDec(input) : ''
  const numR   = numInput ? numConv(numInput, numBase) : null
  const byteLen = new TextEncoder().encode(textVal).length

  const computeHashes = useCallback(async (text: string) => {
    const id = ++computeRef.current
    if (!text) { setHMD5(''); setHSHA1(''); setHSHA256(''); setHSHA512(''); return }
    setHMD5(md5(text))
    const [s1,s256,s512] = await Promise.all([webHash('SHA-1',text),webHash('SHA-256',text),webHash('SHA-512',text)])
    if (computeRef.current !== id) return
    setHSHA1(s1); setHSHA256(s256); setHSHA512(s512)
  }, [])

  useEffect(() => { void computeHashes(textVal) }, [textVal, computeHashes])

  const inputCls2 = 'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 resize-none leading-relaxed'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {(['text','hex'] as const).map(m=>(
              <button key={m} onClick={()=>setInputMode(m)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${inputMode===m?'bg-zinc-700 text-zinc-100':'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>{m}</button>
            ))}
          </div>
          {textVal && <span className="text-[10px] font-mono text-zinc-700 ml-auto">{textVal.length} chars · {byteLen} bytes</span>}
        </div>
        <textarea rows={4} value={input} onChange={e=>setInput(e.target.value)}
          placeholder={inputMode==='text'?'Type or paste — all outputs update live':'Hex bytes e.g. 48 65 6c 6c 6f'}
          className={inputCls2} spellCheck={false} autoCapitalize="none" autoCorrect="off" />
        {input && <div className="flex justify-end"><button onClick={()=>setInput('')} className="text-[10px] font-mono text-zinc-700 hover:text-zinc-400 transition-colors">clear</button></div>}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionH title="Hashes">
          <RowH label="MD5" value={hMD5} />
          <RowH label="SHA-1" value={hSHA1} />
          <RowH label="SHA-256" value={hSHA256} />
          <RowH label="SHA-512" value={hSHA512} />
        </SectionH>
        <SectionH title="Base64">
          <RowH label="Encode →" value={b64enc} />
          <RowH label="Decode →" value={input ? (() => { try{return fromB64(input)}catch{return ''} })() : ''} />
        </SectionH>
        <SectionH title="Hex">
          <RowH label="Encode →" value={hexenc} />
          <RowH label="Decode →" value={inputMode==='hex'?textVal:''} />
        </SectionH>
        <SectionH title="URL encoding">
          <RowH label="Encode →" value={urlenc !== textVal ? urlenc : ''} />
          <RowH label="Decode →" value={urldec !== input ? urldec : ''} />
        </SectionH>
        <SectionH title="HTML entities">
          <RowH label="Encode →" value={htmle !== textVal ? htmle : ''} />
          <RowH label="Decode →" value={htmld !== input ? htmld : ''} />
        </SectionH>
        <SectionH title="ROT13">
          <RowH label="Output" value={rot13o} />
        </SectionH>
      </div>
      <SectionH title="Number base converter">
        <div className="py-3 space-y-3">
          <div className="flex gap-3 flex-wrap items-center">
            <input value={numInput} onChange={e=>setNumInput(e.target.value)}
              placeholder={numBase===16?'ff0a':numBase===2?'11001010':'255'}
              className="flex-1 min-w-40 bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500" />
            <div className="flex gap-1">
              {([16,10,8,2] as const).map(b=>(
                <button key={b} onClick={()=>setNumBase(b)}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded transition-colors ${numBase===b?'bg-zinc-700 text-zinc-100':'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>
                  {b===16?'hex':b===10?'dec':b===8?'oct':'bin'}
                </button>
              ))}
            </div>
          </div>
          {numR ? (
            <div>
              <RowH label="Binary" value={numR.bin} />
              <RowH label="Octal" value={numR.oct} />
              <RowH label="Decimal" value={numR.dec} />
              <RowH label="Hex" value={numR.hex} />
            </div>
          ) : numInput ? <p className="text-[11px] font-mono text-amber-500 pb-2">Invalid value</p> : null}
        </div>
      </SectionH>
      {input && !textVal.includes(' ') && /^[0-9a-fA-F]+$/.test(input.trim()) && (() => {
        const len = input.trim().length
        const id: Record<number,string> = {32:'MD5 (128-bit)',40:'SHA-1 (160-bit)',56:'SHA-224',64:'SHA-256 (256-bit)',96:'SHA-384',128:'SHA-512 (512-bit)',16:'Half-MD5 / LM segment',48:'Tiger-192'}
        return (
          <SectionH title="Hash identifier">
            <p className={`text-xs font-mono py-3 ${id[len]?'text-emerald-400':'text-zinc-500'}`}>
              {id[len] ? `Likely: ${id[len]} (${len} hex chars = ${len/2} bytes)` : `Unrecognised length (${len} hex chars). Common: MD5=32, SHA-1=40, SHA-256=64, SHA-512=128`}
            </p>
          </SectionH>
        )
      })()}
    </div>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

type ToolId = 'hash' | 'subnet' | 'timestamp' | 'packet' | 'regex' | 'jwt' | 'cert' | 'entropy' | 'mac' | 'uuid' | 'chars' | 'codeopt'

const NAV: { id: ToolId; label: string; sub: string; icon: string }[] = [
  { id: 'hash',      label: 'Hash & encoding',     sub: 'MD5 · SHA · Base64 · hex · URL', icon: '#️⃣' },
  { id: 'subnet',    label: 'Subnet calculator',    sub: 'CIDR · hosts · mask · binary',   icon: '🌐' },
  { id: 'timestamp', label: 'Timestamp converter',  sub: 'Unix · FILETIME · Chrome · Mac', icon: '🕐' },
  { id: 'packet',    label: 'Packet decoder',       sub: 'Ethernet · IP · TCP · UDP · DNS',icon: '📦' },
  { id: 'regex',     label: 'Regex tester',         sub: 'Live match · groups · highlight', icon: '🔍' },
  { id: 'jwt',       label: 'JWT decoder',          sub: 'Header · payload · expiry check', icon: '🔑' },
  { id: 'cert',      label: 'Certificate decoder',  sub: 'PEM · fields · SHA-256 fingerprint', icon: '📜' },
  { id: 'entropy',   label: 'Entropy calculator',   sub: 'Shannon · classification · histogram', icon: '📊' },
  { id: 'mac',       label: 'MAC address lookup',   sub: 'OUI vendor · UAA/LAA · EUI-64',  icon: '🔌' },
  { id: 'uuid',      label: 'UUID / GUID decoder',  sub: 'Version · v1 timestamp · MAC',   icon: '🆔' },
  { id: 'chars',     label: 'Char inspector',       sub: 'Codepoint · UTF-8 · non-print',  icon: '🔎' },
  { id: 'codeopt',   label: 'Code optimizer',       sub: 'Bug detection · security · AI',   icon: '🤖' },
]

const TOOLS: Record<ToolId, React.ReactNode> = {
  hash:      <HashTool />,
  subnet:    <SubnetCalculator />,
  timestamp: <TimestampConverter />,
  packet:    <PacketDecoder />,
  regex:     <RegexTester />,
  jwt:       <JWTDecoder />,
  cert:      <CertDecoder />,
  entropy:   <EntropyCalc />,
  mac:       <MACLookup />,
  uuid:      <UUIDDecoder />,
  chars:     <CharInspector />,
  codeopt:   <CodeOptimizer />,
}

export default function ToolsPage() {
  const [active, setActive] = useState<ToolId>('hash')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const current = NAV.find(n => n.id === active)!

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      <aside className={`
        flex-shrink-0 w-52 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden
        ${mobileNavOpen ? 'fixed inset-y-0 left-0 z-50 top-10' : 'hidden md:flex'}
      `}>
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="text-xs font-mono font-semibold text-zinc-300 tracking-tight">Tools</div>
          <div className="text-[10px] font-mono text-zinc-600 mt-0.5">all computation is local</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setMobileNavOpen(false) }}
              className={`w-full text-left px-4 py-2 transition-colors border-l-2 ${
                active === item.id
                  ? 'border-emerald-600 bg-zinc-800 text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}>
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{item.icon}</span>
                <div>
                  <div className="text-xs font-mono leading-tight">{item.label}</div>
                  <div className="text-[9px] text-zinc-600 mt-0.5 leading-tight">{item.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="text-[9px] font-mono text-zinc-700">Nothing leaves the browser.</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <button onClick={() => setMobileNavOpen(o => !o)} className="text-zinc-400 text-xs font-mono">☰</button>
          <span className="text-xs font-mono text-zinc-300">{current.label}</span>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-5 pb-4 border-b border-zinc-800">
              <h1 className="text-sm font-mono font-semibold text-zinc-100 mb-0.5">{current.label}</h1>
              <p className="text-[11px] font-mono text-zinc-600">{current.sub}</p>
            </div>
            {TOOLS[active]}
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
    </div>
  )
}
