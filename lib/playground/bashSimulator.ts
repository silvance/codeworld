type FS = Record<string, string>

const FILES: FS = {
  '/etc/passwd': [
    'root:x:0:0:root:/root:/bin/bash',
    'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
    'sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin',
    'operator:x:1000:1000:Operator,,,:/home/operator:/bin/bash',
  ].join('\n'),

  '/etc/shadow': [
    'root:$6$rounds=656000$salt$longhashvaluehere:19000:0:99999:7:::',
    'operator:$6$rounds=656000$salt$anotherhashhere:19000:0:99999:7:::',
  ].join('\n'),

  '/etc/hostname': 'playground',

  '/etc/os-release': [
    'NAME="Kali GNU/Linux"',
    'VERSION="2024.2"',
    'ID=kali',
    'PRETTY_NAME="Kali GNU/Linux 2024.2"',
  ].join('\n'),

  '/home/operator/.bash_history': [
    'nmap -sV 192.168.1.0/24',
    'wireshark &',
    'tshark -i eth0 -w capture.pcap',
    'kismet --no-ncurses',
    'python3 tscm_scan.py',
    'airmon-ng start wlan0',
  ].join('\n'),
}

const LS: Record<string, string[]> = {
  '/':                    ['bin','boot','dev','etc','home','lib','media','mnt','opt','proc','root','run','sbin','sys','tmp','usr','var'],
  '/etc':                 ['passwd','shadow','hostname','os-release','ssh','hosts','resolv.conf','crontab'],
  '/home':                ['operator'],
  '/home/operator':       ['.bash_history','.bashrc','tools','captures'],
  '/home/operator/tools': ['tscm_scan.py','wifi_parser.py','ble_scan.sh','deaddrop.py'],
  '/tmp':                 ['systemd-private-abc','snap-private-tmp'],
}

const SUID_FILES = [
  '/usr/bin/sudo', '/usr/bin/passwd', '/usr/bin/newgrp',
  '/usr/bin/chsh', '/usr/bin/chfn',  '/usr/sbin/pppd',
  '/bin/su',       '/bin/ping',      '/bin/mount', '/bin/umount',
]

const SGID_FILES = [
  '/usr/bin/crontab', '/usr/bin/write', '/usr/sbin/unix_chkpwd',
  '/usr/bin/wall',    '/usr/bin/ssh-agent',
]

const WORLD_WRITABLE = ['/tmp', '/var/tmp', '/dev/shm', '/run/lock']

const PS_OUTPUT = `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  22540  5308 ?        Ss   08:00   0:01 /sbin/init
root       312  0.0  0.2  55268 10240 ?        Ss   08:00   0:00 /usr/sbin/sshd
root       412  0.0  0.1  14456  4096 ?        Ss   08:00   0:00 /usr/sbin/cron
operator  1024  0.1  0.5 112400 20480 pts/0    Ss   10:00   0:02 bash
operator  1337  0.2  0.6 148500 24576 pts/0    S    10:01   0:04 python3 tscm_scan.py`

const NETSTAT_OUTPUT = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address        Foreign Address      State       PID/Program
tcp        0      0 0.0.0.0:22           0.0.0.0:*            LISTEN      312/sshd
tcp        0      0 127.0.0.1:5000       0.0.0.0:*            LISTEN      1337/python3
tcp6       0      0 :::22                :::*                 LISTEN      312/sshd`

const IP_ADDR_OUTPUT = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
    link/ether 08:00:27:1a:2b:3c brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
3: wlan0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN
    link/ether de:ad:be:ef:ca:fe brd ff:ff:ff:ff:ff:ff`

function tokenize(cmd: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuote = ''
  for (const ch of cmd) {
    if (inQuote) {
      if (ch === inQuote) inQuote = ''
      else current += ch
    } else if (ch === '"' || ch === "'") {
      inQuote = ch
    } else if (ch === ' ') {
      if (current) { tokens.push(current); current = '' }
    } else {
      current += ch
    }
  }
  if (current) tokens.push(current)
  return tokens
}

function resolvePath(path: string): string {
  if (!path || path === '.' || path === '~') return '/home/operator'
  if (path.startsWith('/')) return path.replace(/\/$/, '') || '/'
  if (path.startsWith('~/')) return '/home/operator/' + path.slice(2)
  return '/home/operator/' + path
}

function hexDump(input: string): string {
  const bytes = Array.from(input).map(c => c.charCodeAt(0))
  const lines: string[] = []
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk  = bytes.slice(i, i + 16)
    const addr   = i.toString(16).padStart(8, '0')
    const left   = chunk.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join(' ')
    const right  = chunk.slice(8).map(b => b.toString(16).padStart(2, '0')).join(' ')
    const ascii  = chunk.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('')
    lines.push(`${addr}: ${left.padEnd(23)}  ${right.padEnd(23)}  ${ascii}`)
  }
  return lines.join('\n')
}

function runPipedCommand(cmd: string, input: string): string {
  const args = tokenize(cmd)
  if (!args.length) return input

  switch (args[0]) {
    case 'grep': {
      const nonFlags = args.filter((a, i) => i > 0 && !a.startsWith('-'))
      if (!nonFlags.length) return input
      const pattern = nonFlags[0]
      const flags   = args.filter(a => a.startsWith('-')).join('')
      const re      = new RegExp(pattern, flags.includes('i') ? 'i' : '')
      return input.split('\n').filter(l => re.test(l)).join('\n')
    }
    case 'base64': {
      if (args.includes('-d') || args.includes('--decode')) {
        try { return atob(input.trim()) } catch { return 'base64: invalid input' }
      }
      return btoa(input)
    }
    case 'xxd': {
      if (args.includes('-r')) {
        const hex = input.replace(/\s/g, '')
        try {
          return (hex.match(/.{2}/g) || [])
            .map(b => String.fromCharCode(parseInt(b, 16)))
            .join('')
        } catch { return 'xxd: invalid hex input' }
      }
      return hexDump(input)
    }
    case 'wc': {
      if (args.includes('-l')) return String(input.split('\n').filter(Boolean).length)
      if (args.includes('-w')) return String(input.split(/\s+/).filter(Boolean).length)
      if (args.includes('-c')) return String(input.length)
      const l = input.split('\n').length
      const w = input.split(/\s+/).filter(Boolean).length
      return `${l}\t${w}\t${input.length}`
    }
    case 'sort':   return input.split('\n').sort().join('\n')
    case 'uniq':   return [...new Set(input.split('\n'))].join('\n')
    case 'head': { const n = parseInt(args[args.indexOf('-n')+1] ?? '10'); return input.split('\n').slice(0, isNaN(n)?10:n).join('\n') }
    case 'tail': { const n = parseInt(args[args.indexOf('-n')+1] ?? '10'); const c = isNaN(n)?10:n; return input.split('\n').slice(-c).join('\n') }
    default: return input
  }
}

function runSingleCommand(cmd: string): string[] {
  // Strip redirection tokens (2>/dev/null etc.)
  const cleanCmd = cmd.replace(/\d*[<>]\/\S+/g, '').trim()
  const args = tokenize(cleanCmd)
  if (!args.length) return []

  switch (args[0]) {
    case 'whoami':   return ['operator']
    case 'id':       return ['uid=1000(operator) gid=1000(operator) groups=1000(operator),27(sudo)']
    case 'hostname': return ['playground']
    case 'pwd':      return ['/home/operator']
    case 'uname':    return ['Linux playground 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 x86_64 GNU/Linux']
    case 'ps':       return PS_OUTPUT.split('\n')
    case 'netstat':  return NETSTAT_OUTPUT.split('\n')
    case 'ip':       return args[1] === 'addr' || args[1] === 'a' ? IP_ADDR_OUTPUT.split('\n') : ['ip: simulated — try: ip addr']

    case 'echo': {
      const offset = args[1] === '-n' ? 2 : 1
      const text = args.slice(offset).join(' ')
      return [text]
    }

    case 'ls': {
      const path = resolvePath(args.find((a, i) => i > 0 && !a.startsWith('-')) || '.')
      const entries = LS[path]
      if (!entries) return [`ls: cannot access '${args[1] || '.'}': No such file or directory`]
      if (args.some(a => a.includes('l'))) {
        return entries.map(e => `drwxr-xr-x 2 operator operator 4096 Jan 01 10:00 ${e}`)
      }
      return [entries.join('  ')]
    }

    case 'cat': {
      const path = resolvePath(args[1] || '')
      if (!args[1]) return ['cat: missing operand']
      return FILES[path] !== undefined
        ? FILES[path].split('\n')
        : [`cat: ${args[1]}: No such file or directory`]
    }

    case 'find': {
      const permIdx = args.indexOf('-perm')
      if (permIdx >= 0) {
        const perm = args[permIdx + 1]
        if (perm === '-4000') return SUID_FILES
        if (perm === '-2000') return SGID_FILES
        if (perm === '-0002') return WORLD_WRITABLE
      }
      const nameIdx = args.indexOf('-name')
      if (nameIdx >= 0) return [`find: simulated — try -perm -4000 or -perm -2000`]
      return ['find: simulated — supported flags: -perm -4000, -perm -2000, -perm -0002']
    }

    case 'grep': {
      const nonFlags = args.filter((a, i) => i > 0 && !a.startsWith('-'))
      if (nonFlags.length < 2) return ['grep: requires pattern and file (or use pipe)']
      const [pattern, filePath] = nonFlags
      const resolved = resolvePath(filePath)
      const content = FILES[resolved]
      if (!content) return [`grep: ${filePath}: No such file or directory`]
      const matches = content.split('\n').filter(l => l.includes(pattern))
      return matches.length ? matches : []
    }

    case 'base64': return ['(no input — pipe something to base64)']
    case 'xxd':    return ['(no input — pipe something to xxd)']
    case 'which':  return args[1] ? [`/usr/bin/${args[1]}`] : ['which: missing argument']
    case 'clear':  return ['(clear not supported in simulation)']
    case 'sudo':   return [`[sudo] password for operator: `, 'Sorry, try again.']

    default:
      return [`bash: ${args[0]}: command not found (simulated environment)`]
  }
}

export function simulateBash(script: string): string {
  const output: string[] = []

  for (const line of script.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    if (trimmed.includes('|')) {
      const parts = trimmed.split('|').map(s => s.trim())
      let result = runSingleCommand(parts[0]).join('\n')
      for (let i = 1; i < parts.length; i++) {
        result = runPipedCommand(parts[i], result)
      }
      output.push(...result.split('\n'))
    } else {
      output.push(...runSingleCommand(trimmed))
    }
  }

  return output.join('\n')
}
