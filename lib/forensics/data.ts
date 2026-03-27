// ─── Windows Event Log IDs ──────────────────────────────────────────────────

export interface EventID {
  id: string
  log: string
  description: string
  notes: string
  category: string
}

export const windowsEventIDs: EventID[] = [
  // Account / Auth
  { id: '4624', log: 'Security', description: 'Successful logon', notes: 'Logon Type field critical: 2=interactive, 3=network, 4=batch, 5=service, 7=unlock, 10=remote interactive, 11=cached', category: 'Auth' },
  { id: '4625', log: 'Security', description: 'Failed logon', notes: 'Check SubStatus: 0xC000006A=wrong password, 0xC0000064=bad username, 0xC000006F=outside hours', category: 'Auth' },
  { id: '4634', log: 'Security', description: 'Logoff', notes: 'Paired with 4624. Type 3 logoffs often immediate — not reliable for session duration', category: 'Auth' },
  { id: '4648', log: 'Security', description: 'Logon with explicit credentials (RunAs)', notes: 'Lateral movement indicator. Subject = source account, Account = target account', category: 'Auth' },
  { id: '4672', log: 'Security', description: 'Special privileges assigned to new logon', notes: 'Indicates admin/privileged account logon. Always follows 4624 for admin accounts', category: 'Auth' },
  { id: '4776', log: 'Security', description: 'NTLM credential validation attempt', notes: 'Generated on DC for domain accounts. Error code 0xC000006A = wrong password', category: 'Auth' },
  { id: '4768', log: 'Security', description: 'Kerberos TGT requested', notes: 'Result code 0x6 = bad username, 0x12 = disabled/expired, 0x17 = expired password', category: 'Auth' },
  { id: '4769', log: 'Security', description: 'Kerberos service ticket requested', notes: 'Kerberoasting generates many 4769s with encryption type 0x17 (RC4)', category: 'Auth' },
  // Account Management
  { id: '4720', log: 'Security', description: 'User account created', notes: 'Check creator account — lateral movement often creates local accounts', category: 'Account Mgmt' },
  { id: '4722', log: 'Security', description: 'User account enabled', notes: 'Enabling dormant admin accounts is a persistence technique', category: 'Account Mgmt' },
  { id: '4728', log: 'Security', description: 'Member added to security-enabled global group', notes: 'Adding to Domain Admins (group 512) is high priority', category: 'Account Mgmt' },
  { id: '4732', log: 'Security', description: 'Member added to security-enabled local group', notes: 'Adding to Administrators, Remote Desktop Users — lateral movement indicator', category: 'Account Mgmt' },
  { id: '4756', log: 'Security', description: 'Member added to universal security group', notes: 'Enterprise Admins membership changes', category: 'Account Mgmt' },
  // Process / Execution
  { id: '4688', log: 'Security', description: 'New process created', notes: 'Requires audit policy. New Process Name + Creator Process. Enable command-line logging for full visibility', category: 'Execution' },
  { id: '4689', log: 'Security', description: 'Process exited', notes: 'Paired with 4688. Exit code 0=clean, non-zero=error/crash', category: 'Execution' },
  { id: '1',    log: 'Sysmon',   description: 'Process created (Sysmon)', notes: 'Richer than 4688: includes hash, parent cmdline, current directory. Gold standard', category: 'Execution' },
  { id: '3',    log: 'Sysmon',   description: 'Network connection (Sysmon)', notes: 'Process-to-IP mapping. Catches C2 beaconing. Pairs with 4688/1', category: 'Execution' },
  // Logon / Remote
  { id: '4778', log: 'Security', description: 'RDP session reconnected', notes: 'ClientAddress shows source IP. Pairs with 4624 Type 10', category: 'Remote Access' },
  { id: '4779', log: 'Security', description: 'RDP session disconnected', notes: 'Not logoff — session persists in disconnected state', category: 'Remote Access' },
  { id: '21',   log: 'TerminalServices-LocalSessionManager', description: 'RDP logon success', notes: 'Source IP in event. More reliable than 4624 for RDP tracking', category: 'Remote Access' },
  { id: '25',   log: 'TerminalServices-LocalSessionManager', description: 'RDP session reconnect', notes: 'User reconnected to existing disconnected session', category: 'Remote Access' },
  // Object Access
  { id: '4663', log: 'Security', description: 'Object access attempt', notes: 'Requires SACL on object. File/reg read/write/delete. High volume — filter on sensitive paths', category: 'Object Access' },
  { id: '4656', log: 'Security', description: 'Handle to object requested', notes: 'Precedes 4663. Access Mask field: 0x80=read, 0x2=write, 0x10000=delete', category: 'Object Access' },
  // Services / Persistence
  { id: '7045', log: 'System', description: 'New service installed', notes: 'Service Name + Image Path. Malware installs services as persistence. Check unusual paths', category: 'Persistence' },
  { id: '7036', log: 'System', description: 'Service started/stopped', notes: 'Operational record of service state changes', category: 'Persistence' },
  { id: '4697', log: 'Security', description: 'Service installed (security audit)', notes: 'Complement to 7045. Requires audit policy. Includes account that installed', category: 'Persistence' },
  // Scheduled Tasks
  { id: '4698', log: 'Security', description: 'Scheduled task created', notes: 'Task name + XML definition. Fileless malware often uses schtasks for persistence', category: 'Persistence' },
  { id: '4702', log: 'Security', description: 'Scheduled task updated', notes: 'Modification of existing task — may indicate tampering', category: 'Persistence' },
  { id: '106',  log: 'TaskScheduler/Operational', description: 'Task registered', notes: 'More detail than 4698. Includes full task XML', category: 'Persistence' },
  // PowerShell
  { id: '4103', log: 'PowerShell/Operational', description: 'PowerShell pipeline execution', notes: 'Module logging. Captures cmdlets and output. Enable via GPO', category: 'Execution' },
  { id: '4104', log: 'PowerShell/Operational', description: 'PowerShell script block logged', notes: 'Script block logging — most verbose PS logging. Captures deobfuscated code', category: 'Execution' },
  { id: '400',  log: 'PowerShell', description: 'PowerShell engine started', notes: 'HostApplication field shows invocation method. Downgrade to v2 bypasses 4104', category: 'Execution' },
  // Shares / Network
  { id: '5140', log: 'Security', description: 'Network share accessed', notes: 'Share name + source IP. C$ or ADMIN$ access = lateral movement indicator', category: 'Lateral Movement' },
  { id: '5145', log: 'Security', description: 'Network share object access check', notes: 'Detailed file access on shares. High volume', category: 'Lateral Movement' },
  // Clearing
  { id: '1102', log: 'Security', description: 'Security audit log cleared', notes: 'Always investigate. Subject shows who cleared. Timestamp = clearing time not incident time', category: 'Anti-Forensics' },
  { id: '104',  log: 'System',   description: 'System log cleared', notes: 'Same significance as 1102 for System log', category: 'Anti-Forensics' },
  { id: '517',  log: 'Security', description: 'Audit log cleared (legacy)', notes: 'Pre-Vista equivalent of 1102', category: 'Anti-Forensics' },
]

// ─── Registry Hives ─────────────────────────────────────────────────────────

export interface RegHive {
  hive: string
  path: string
  forensicValue: string
  keyArtifacts: string[]
}

export const registryHives: RegHive[] = [
  {
    hive: 'SAM',
    path: 'C:\\Windows\\System32\\config\\SAM',
    forensicValue: 'Local user accounts, password hashes (NTLMv1), last logon timestamps, login counts',
    keyArtifacts: [
      'SAM\\Domains\\Account\\Users — account list + metadata',
      'Requires SYSTEM privileges or offline access to read',
    ],
  },
  {
    hive: 'SECURITY',
    path: 'C:\\Windows\\System32\\config\\SECURITY',
    forensicValue: 'LSA secrets, cached domain credentials (DCC2), service account passwords',
    keyArtifacts: [
      'SECURITY\\Policy\\Secrets — LSA secrets (service passwords, autologon)',
      'SECURITY\\Cache — DCC2 hashes for last 10 domain logons',
    ],
  },
  {
    hive: 'SYSTEM',
    path: 'C:\\Windows\\System32\\config\\SYSTEM',
    forensicValue: 'System configuration, services, USB history, network interfaces, timezone',
    keyArtifacts: [
      'SYSTEM\\CurrentControlSet\\Services — installed services',
      'SYSTEM\\CurrentControlSet\\Enum\\USBSTOR — USB device history',
      'SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation',
      'SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces — NIC config',
    ],
  },
  {
    hive: 'SOFTWARE',
    path: 'C:\\Windows\\System32\\config\\SOFTWARE',
    forensicValue: 'Installed software, OS metadata, autorun entries, network history',
    keyArtifacts: [
      'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion — OS build info',
      'SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run — autorun (all users)',
      'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkList\\Profiles — known networks',
      'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\NetworkList\\Signatures\\Unmanaged — network GUIDs',
    ],
  },
  {
    hive: 'NTUSER.DAT',
    path: 'C:\\Users\\<username>\\NTUSER.DAT',
    forensicValue: 'Per-user activity: recent files, typed paths, search history, autorun, shellbags',
    keyArtifacts: [
      'NTUSER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run — user autorun',
      'NTUSER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs — MRU files',
      'NTUSER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\TypedPaths — typed URL bar paths',
      'NTUSER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RunMRU — Run dialog history',
      'NTUSER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\ComDlg32\\OpenSavePidlMRU — open/save dialogs',
    ],
  },
  {
    hive: 'UsrClass.dat',
    path: 'C:\\Users\\<username>\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat',
    forensicValue: 'Shellbags — folder access history including deleted/network/USB folders',
    keyArtifacts: [
      'UsrClass.dat\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU — shellbag tree',
      'UsrClass.dat\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags — view settings per folder',
      'Critical for proving folder access even after deletion',
    ],
  },
  {
    hive: 'Amcache.hve',
    path: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve',
    forensicValue: 'Program execution: SHA1 hash, full path, first execution time, publisher',
    keyArtifacts: [
      'Amcache\\Root\\InventoryApplicationFile — file entries with SHA1',
      'SHA1 hash survives file deletion — can match against known malware',
      'First execution timestamp is reliable',
    ],
  },
]

// ─── Prefetch / Shimcache / Amcache ─────────────────────────────────────────

export interface ExecArtifact {
  name: string
  location: string
  os: string
  provides: string[]
  limitations: string[]
  tooling: string
}

export const execArtifacts: ExecArtifact[] = [
  {
    name: 'Prefetch',
    location: 'C:\\Windows\\Prefetch\\*.pf',
    os: 'XP–11 (disabled on SSDs by default pre-Win10)',
    provides: [
      'Program name and path',
      'Run count (XP–7: 1 count; Win8+: 8 timestamps)',
      'Last run time (up to 8 on Win8+)',
      'Files and directories loaded during execution',
      'Existence proves program ran — even if deleted',
    ],
    limitations: [
      'Max 128 entries (XP/7), 1024 (Win8+) — older entries purged',
      'Disabled by default on server SKUs',
      'Enable via HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\\PrefetchParameters\\EnablePrefetcher = 3',
    ],
    tooling: 'PECmd (Eric Zimmermann), WinPrefetchView, Autopsy',
  },
  {
    name: 'Shimcache (AppCompatCache)',
    location: 'SYSTEM hive: SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache',
    os: 'XP–11',
    provides: [
      'File path and last modified time',
      'File size (XP/2003 only)',
      'Execution flag (unreliable — not always set on execute)',
      'Order of entries indicates relative execution order (approx)',
    ],
    limitations: [
      'Only written to registry at shutdown — live system data may be incomplete',
      'Does NOT reliably confirm execution (shimcache ≠ ran)',
      'Entry present means file existed on system (at minimum)',
    ],
    tooling: 'AppCompatCacheParser (Eric Zimmermann), ShimCacheParser',
  },
  {
    name: 'Amcache',
    location: 'C:\\Windows\\AppCompat\\Programs\\Amcache.hve',
    os: 'Win8–11',
    provides: [
      'SHA1 hash of executable',
      'Full path',
      'First execution timestamp',
      'Publisher / version info',
      'Install date',
    ],
    limitations: [
      'SHA1 only — no MD5/SHA256 natively',
      'Can be cleared; Amcache.hve deletions are detectable',
      'Not all executions recorded — background processes may be missed',
    ],
    tooling: 'AmcacheParser (Eric Zimmermann)',
  },
  {
    name: 'BAM / DAM',
    location: 'SYSTEM\\CurrentControlSet\\Services\\bam\\State\\UserSettings\\<SID>',
    os: 'Win10 1709+',
    provides: [
      'Last execution time per executable per user',
      'Full path to executable',
      'Survives reboots for ~7 days',
    ],
    limitations: [
      'Background Activity Moderator — may miss foreground-only apps',
      '7-day rolling window',
    ],
    tooling: 'Registry Explorer, manual parse',
  },
  {
    name: 'UserAssist',
    location: 'NTUSER.DAT\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\\{GUID}\\Count',
    os: 'XP–11',
    provides: [
      'GUI program execution via Explorer',
      'Run count',
      'Last execution time',
      'Focus time and count (Win7+)',
    ],
    limitations: [
      'ROT13 encoded — decode key names',
      'Only captures GUI execution via Explorer shell (not cmd/PS launches)',
      'Can be cleared by user',
    ],
    tooling: 'UserAssist (NirSoft), Registry Explorer',
  },
]

// ─── USB Artifacts ───────────────────────────────────────────────────────────

export interface USBArtifact {
  source: string
  location: string
  provides: string
  notes: string
}

export const usbArtifacts: USBArtifact[] = [
  {
    source: 'USBSTOR Registry',
    location: 'SYSTEM\\CurrentControlSet\\Enum\\USBSTOR',
    provides: 'Device type, manufacturer, product, serial number, driver date',
    notes: 'Serial number format: if ends in &0 = no unique serial, & = unique serial. Key last write = last connection time',
  },
  {
    source: 'USB Registry',
    location: 'SYSTEM\\CurrentControlSet\\Enum\\USB',
    provides: 'VID/PID (vendor/product IDs), class, subclass',
    notes: 'Pairs with USBSTOR. VID/PID lookup at the-sz.com/usb or devicehunt.com',
  },
  {
    source: 'Mounted Devices',
    location: 'SYSTEM\\MountedDevices',
    provides: 'Drive letter assigned to device (DosDevices\\E:)',
    notes: 'Links serial number to drive letter. Binary data — parse with RegRipper or Registry Explorer',
  },
  {
    source: 'Drive Letter & Volume Name',
    location: 'SOFTWARE\\Microsoft\\Windows Portable Devices\\Devices',
    provides: 'Friendly name and volume name of USB storage',
    notes: 'Correlate with USBSTOR serial to get human-readable device name',
  },
  {
    source: 'Volume GUID',
    location: 'SYSTEM\\MountedDevices\\??\\Volume{GUID}',
    provides: 'GUID assigned to volume — persistent across drive letter changes',
    notes: 'GUID appears in LNK files, shellbags, and event logs — allows cross-artifact correlation',
  },
  {
    source: 'First/Last Connection',
    location: 'SYSTEM hive key last write times + setupapi.dev.log',
    provides: 'First install time (setupapi log), last connection (USBSTOR key last write)',
    notes: 'C:\\Windows\\INF\\setupapi.dev.log — search for device serial. Contains first-ever connection timestamp',
  },
  {
    source: 'User who mounted',
    location: 'NTUSER.DAT\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MountPoints2',
    provides: 'Volume GUIDs mounted by specific user',
    notes: 'Per-user hive — links user account to device mount. Critical for attributing USB use to an account',
  },
  {
    source: 'Event Logs',
    location: 'System log: Event IDs 20001, 20003 / Security: 6416',
    provides: '6416: new external device recognized (Win8+). 20001: driver installed',
    notes: '6416 includes Device Instance ID matching USBSTOR serial. Enable via audit policy',
  },
]

// ─── LNK / Jump Lists ────────────────────────────────────────────────────────

export interface LNKArtifact {
  name: string
  location: string
  provides: string[]
  notes: string
}

export const lnkArtifacts: LNKArtifact[] = [
  {
    name: 'LNK files (shell links)',
    location: 'C:\\Users\\<user>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk',
    provides: [
      'Target file path (local and UNC)',
      'Target MAC times at time of access',
      'Target file size at time of access',
      'Volume serial number and drive type',
      'NetBIOS name of remote system (if network target)',
      'Host MAC address (embedded in some LNKs)',
    ],
    notes: 'Created automatically when file opened via Explorer. Timestamps = first and last open. Target MAC times ≠ current file times — provides historical timestamps. Critical for proving file access.',
  },
  {
    name: 'AutomaticDestinations (Jump Lists)',
    location: 'C:\\Users\\<user>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations\\*.automaticDestinations-ms',
    provides: [
      'MRU list of recently accessed files per application',
      'AppID maps to specific application (e.g., 1b4dd67f29cb1962 = Windows Explorer)',
      'Each entry is an embedded LNK file — same data as standalone LNK',
      'Access timestamps per file',
    ],
    notes: 'OLE compound document format. Parse with JLECmd (Zimmermann). AppID lookup: github.com/EricZimmermann/JLECmd',
  },
  {
    name: 'CustomDestinations (Jump Lists)',
    location: 'C:\\Users\\<user>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\CustomDestinations\\*.customDestinations-ms',
    provides: [
      'Pinned and frequent items set by application',
      'Same LNK data as automatic destinations',
    ],
    notes: 'Application-controlled entries. Less reliable than AutomaticDestinations for forensic timeline but useful for pinned items.',
  },
]

// ─── Browser Artifacts ───────────────────────────────────────────────────────

export interface BrowserArtifact {
  browser: string
  artifact: string
  path: string
  format: string
  provides: string
}

export const browserArtifacts: BrowserArtifact[] = [
  // Chrome
  { browser: 'Chrome', artifact: 'History',          path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\History',                   format: 'SQLite', provides: 'URLs visited, visit count, last visit time, typed vs linked' },
  { browser: 'Chrome', artifact: 'Downloads',        path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\History (downloads table)', format: 'SQLite', provides: 'Downloaded file paths, source URL, start/end time, file size' },
  { browser: 'Chrome', artifact: 'Login Data',       path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data',                format: 'SQLite', provides: 'Saved credentials (DPAPI encrypted on Windows)' },
  { browser: 'Chrome', artifact: 'Cookies',          path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Network\\Cookies',          format: 'SQLite', provides: 'Session cookies, auth tokens (encrypted Win10+)' },
  { browser: 'Chrome', artifact: 'Cache',            path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache\\Cache_Data\\',       format: 'Binary', provides: 'Cached web content — may contain downloaded files, images, pages' },
  { browser: 'Chrome', artifact: 'Web Data',         path: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Web Data',                  format: 'SQLite', provides: 'Autofill data, search terms, form data' },
  // Firefox
  { browser: 'Firefox', artifact: 'Places',          path: '%APPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\places.sqlite',              format: 'SQLite', provides: 'History + bookmarks in moz_places and moz_historyvisits tables' },
  { browser: 'Firefox', artifact: 'Downloads',       path: '%APPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\places.sqlite',              format: 'SQLite', provides: 'Download history in moz_annos table (anno_attribute_id=3)' },
  { browser: 'Firefox', artifact: 'Form History',    path: '%APPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\formhistory.sqlite',         format: 'SQLite', provides: 'Form field values, search queries' },
  { browser: 'Firefox', artifact: 'Cookies',         path: '%APPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\cookies.sqlite',             format: 'SQLite', provides: 'Cookie values, creation/last access/expiry times' },
  { browser: 'Firefox', artifact: 'Cache',           path: '%LOCALAPPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\cache2\\',              format: 'Binary', provides: 'Cached content, may include files downloaded via browser' },
  // Edge
  { browser: 'Edge',   artifact: 'History',          path: '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\History',                 format: 'SQLite', provides: 'Same schema as Chrome (Chromium-based)' },
  { browser: 'Edge',   artifact: 'Login Data',       path: '%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Login Data',              format: 'SQLite', provides: 'Saved credentials (DPAPI encrypted)' },
  // IE/Edge Legacy
  { browser: 'IE/Edge Legacy', artifact: 'History', path: '%LOCALAPPDATA%\\Microsoft\\Windows\\History\\',                                 format: 'ESE/WebCacheV01.dat', provides: 'URL history in ESE database — use ESEDatabaseView or Hindsight' },
  { browser: 'IE/Edge Legacy', artifact: 'Typed URLs', path: 'NTUSER.DAT\\Software\\Microsoft\\Internet Explorer\\TypedURLs',             format: 'Registry', provides: 'URLs manually typed in IE address bar, up to 25 entries' },
]

// ─── Linux Artifacts ─────────────────────────────────────────────────────────

export interface LinuxArtifact {
  category: string
  path: string
  provides: string
  notes: string
}

export const linuxArtifacts: LinuxArtifact[] = [
  // Auth / Logon
  { category: 'Auth', path: '/var/log/auth.log',                     provides: 'SSH logons, sudo usage, PAM events, su attempts',                    notes: 'Debian/Ubuntu. RHEL/CentOS uses /var/log/secure' },
  { category: 'Auth', path: '/var/log/secure',                       provides: 'Auth events on RHEL/CentOS/Fedora',                                  notes: 'Equivalent to auth.log on RPM-based distros' },
  { category: 'Auth', path: '/var/log/wtmp',                         provides: 'All logon/logoff/reboot records (binary)',                           notes: 'Parse with "last" command. Persistent across sessions' },
  { category: 'Auth', path: '/var/log/btmp',                         provides: 'Failed login attempts (binary)',                                     notes: 'Parse with "lastb". Requires root. Tracks brute force' },
  { category: 'Auth', path: '/var/log/lastlog',                      provides: 'Last login per user (binary)',                                       notes: 'Parse with "lastlog". Shows never-logged-in accounts' },
  { category: 'Auth', path: '/var/run/utmp',                         provides: 'Currently logged-in users (binary)',                                 notes: 'Parse with "who" or "w". Volatile — lost on reboot' },
  // Shell History
  { category: 'Shell History', path: '~/.bash_history',              provides: 'Bash command history',                                              notes: 'Size limited by HISTSIZE/HISTFILESIZE. Check HISTFILE env var for non-default path. Attacker may: unset HISTFILE, set HISTSIZE=0, or rm ~/.bash_history' },
  { category: 'Shell History', path: '~/.zsh_history',               provides: 'Zsh history with timestamps if EXTENDED_HISTORY set',               notes: 'Format: ": <epoch>:<duration>;<command>". Kali default shell is zsh' },
  { category: 'Shell History', path: '~/.python_history',            provides: 'Python REPL commands',                                              notes: 'Often overlooked. Interactive Python sessions logged here' },
  { category: 'Shell History', path: '~/.mysql_history',             provides: 'MySQL client commands',                                             notes: 'Credentials sometimes typed directly — search for passwords' },
  // System Logs
  { category: 'System Logs', path: '/var/log/syslog',                provides: 'General system messages, daemon activity',                          notes: 'Debian/Ubuntu. RHEL uses /var/log/messages' },
  { category: 'System Logs', path: '/var/log/kern.log',              provides: 'Kernel messages — USB events, driver loads, OOM',                   notes: 'USB connect/disconnect: search "usb" or "sd " for storage' },
  { category: 'System Logs', path: '/var/log/dmesg',                 provides: 'Boot-time kernel ring buffer',                                      notes: 'Also read live with "dmesg". Hardware changes, module loads' },
  { category: 'System Logs', path: '/var/log/cron',                  provides: 'Cron job execution log',                                            notes: 'Persistence via crontab. Check /etc/cron*, /var/spool/cron/crontabs' },
  { category: 'System Logs', path: '/var/log/dpkg.log',              provides: 'Package installs/removals (Debian)',                                notes: 'Timestamps of software installation. RHEL: /var/log/dnf.log or yum.log' },
  // Persistence Locations
  { category: 'Persistence', path: '/etc/crontab',                   provides: 'System-wide cron jobs',                                             notes: 'Check all of: /etc/cron.d/, /etc/cron.hourly/, /etc/cron.daily/' },
  { category: 'Persistence', path: '/var/spool/cron/crontabs/<user>',provides: 'Per-user crontab',                                                  notes: 'Edit with "crontab -l". Raw files in /var/spool/cron/crontabs/' },
  { category: 'Persistence', path: '/etc/rc.local',                  provides: 'Commands run at boot (legacy)',                                     notes: 'Deprecated but still functional on many distros' },
  { category: 'Persistence', path: '/etc/systemd/system/*.service',  provides: 'Systemd service units (system-wide)',                               notes: 'New persistence method. Check Enable= and ExecStart= fields. User services: ~/.config/systemd/user/' },
  { category: 'Persistence', path: '~/.bashrc / ~/.bash_profile',    provides: 'Commands run on shell init',                                        notes: 'Classic persistence location. Also check /etc/profile.d/*.sh' },
  { category: 'Persistence', path: '/etc/ld.so.preload',             provides: 'Shared libraries preloaded before all others',                      notes: 'Rootkit technique — forces malicious .so before libc. Empty on clean systems' },
  // User / Account
  { category: 'Accounts', path: '/etc/passwd',                       provides: 'All accounts: username, UID, GID, home, shell',                     notes: 'UID 0 = root. Check for unexpected UID 0 accounts. Shell /bin/false or /sbin/nologin = no login' },
  { category: 'Accounts', path: '/etc/shadow',                       provides: 'Password hashes, expiry, last change',                              notes: 'Hash format: $id$salt$hash. id: 1=MD5, 5=SHA256, 6=SHA512, y=yescrypt. ! or * = locked' },
  { category: 'Accounts', path: '/etc/sudoers',                      provides: 'Sudo privilege assignments',                                        notes: 'Also check /etc/sudoers.d/. NOPASSWD entries are high-value targets' },
  { category: 'Accounts', path: '~/.ssh/authorized_keys',            provides: 'SSH public keys allowed to authenticate as this user',              notes: 'Backdoor persistence: attacker adds their pubkey. Check all user homes' },
  { category: 'Accounts', path: '~/.ssh/known_hosts',                provides: 'Remote systems this user has SSH\'d to',                           notes: 'Hashed by default (HashKnownHosts yes). Unhash with ssh-keygen -F' },
  // File System
  { category: 'File System', path: '/tmp and /var/tmp',              provides: 'World-writable temp dirs — common staging areas',                   notes: '/var/tmp persists across reboots. Check for executables, scripts, archives' },
  { category: 'File System', path: '/proc/<pid>/',                   provides: 'Live process info: cmdline, maps, fd, environ',                     notes: 'Volatile. /proc/<pid>/exe symlink to executable. /proc/<pid>/cmdline = full command' },
  { category: 'File System', path: '~/.recently-used.xbel',          provides: 'GTK recently used files (GUI apps)',                               notes: 'XML format. Timestamps + file:// URIs' },
]

// ─── Memory Forensics ────────────────────────────────────────────────────────

export interface VolPlugin {
  plugin: string
  os: string
  purpose: string
  keyOutputFields: string
  triage: boolean
}

export const volatilityPlugins: VolPlugin[] = [
  // Triage
  { plugin: 'windows.pslist',      os: 'Windows', purpose: 'List running processes via EPROCESS doubly linked list',       keyOutputFields: 'PID, PPID, Name, Create Time, Exit Time',        triage: true },
  { plugin: 'windows.pstree',      os: 'Windows', purpose: 'Display process tree showing parent/child relationships',      keyOutputFields: 'Indented tree of PID/Name',                       triage: true },
  { plugin: 'windows.psscan',      os: 'Windows', purpose: 'Scan physical memory for EPROCESS structures (finds unlinked)', keyOutputFields: 'Same as pslist — compare output to detect hiding', triage: true },
  { plugin: 'windows.cmdline',     os: 'Windows', purpose: 'Display command-line arguments for each process',              keyOutputFields: 'PID, Process, Args',                              triage: true },
  { plugin: 'windows.netscan',     os: 'Windows', purpose: 'Scan for network connections and sockets',                    keyOutputFields: 'Proto, LocalAddr:Port, ForeignAddr:Port, State, PID', triage: true },
  { plugin: 'windows.netstat',     os: 'Windows', purpose: 'Network connections from tcpip structures',                   keyOutputFields: 'Connections with owning process',                 triage: false },
  { plugin: 'windows.dlllist',     os: 'Windows', purpose: 'List loaded DLLs per process',                               keyOutputFields: 'Base, Size, Name, Path per DLL',                  triage: false },
  { plugin: 'windows.malfind',     os: 'Windows', purpose: 'Find injected code: RWX VADs with PE headers or shellcode',  keyOutputFields: 'PID, Address, VadTag, Protection, Hexdump',       triage: true },
  { plugin: 'windows.handles',     os: 'Windows', purpose: 'List open handles per process (files, reg keys, events)',    keyOutputFields: 'HandleValue, Type, Name',                         triage: false },
  { plugin: 'windows.filescan',    os: 'Windows', purpose: 'Scan for FILE_OBJECT structures in memory',                  keyOutputFields: 'Offset, Name — finds files open at time of capture', triage: false },
  { plugin: 'windows.dumpfiles',   os: 'Windows', purpose: 'Extract files from memory (cached in pagecache)',            keyOutputFields: 'Extracted file with original name',               triage: false },
  { plugin: 'windows.procdump',    os: 'Windows', purpose: 'Dump process executable from memory',                        keyOutputFields: 'Reconstructed PE file per PID',                   triage: false },
  { plugin: 'windows.memdump',     os: 'Windows', purpose: 'Dump all addressable memory for a process',                  keyOutputFields: 'Raw memory dump per PID',                         triage: false },
  { plugin: 'windows.hashdump',    os: 'Windows', purpose: 'Extract NTLM hashes from SAM/SYSTEM hives in memory',        keyOutputFields: 'Username, RID, LM hash, NTLM hash',              triage: false },
  { plugin: 'windows.registry.hivelist', os: 'Windows', purpose: 'List registry hives loaded in memory',                 keyOutputFields: 'Offset, FileFullPath',                           triage: false },
  { plugin: 'windows.registry.printkey', os: 'Windows', purpose: 'Print registry key and subkeys from memory',           keyOutputFields: 'Key contents',                                   triage: false },
  { plugin: 'windows.svcscan',     os: 'Windows', purpose: 'Scan for SERVICE_RECORD structures',                         keyOutputFields: 'Offset, PID, ServiceName, BinaryPath, State',    triage: true },
  { plugin: 'windows.ssdt',        os: 'Windows', purpose: 'Display System Service Descriptor Table — detect hooks',     keyOutputFields: 'Index, Function, Module — unhooked = ntoskrnl',  triage: false },
  { plugin: 'windows.callbacks',   os: 'Windows', purpose: 'List kernel callbacks — rootkit indicator',                  keyOutputFields: 'Type, Callback, Module',                          triage: false },
  { plugin: 'linux.pslist',        os: 'Linux',   purpose: 'List processes from task_struct list',                        keyOutputFields: 'PID, PPID, COMM, Start Time',                    triage: true },
  { plugin: 'linux.psscan',        os: 'Linux',   purpose: 'Scan for task_struct (finds hidden processes)',               keyOutputFields: 'Compare with pslist to find hidden PIDs',        triage: true },
  { plugin: 'linux.bash',          os: 'Linux',   purpose: 'Recover bash history from memory',                           keyOutputFields: 'Commands from in-memory history buffer',          triage: true },
  { plugin: 'linux.netfilter',     os: 'Linux',   purpose: 'List netfilter hooks (firewall/rootkit indicator)',           keyOutputFields: 'Hook function + module',                          triage: false },
]

export const memoryTriage = [
  { step: '1', action: 'Identify OS/profile', cmd: 'vol -f mem.raw windows.info', notes: 'Confirms symbol table and OS version before running plugins' },
  { step: '2', action: 'Process list + tree', cmd: 'vol -f mem.raw windows.pslist\nvol -f mem.raw windows.pstree', notes: 'Get baseline; note PIDs, PPIDs, create times' },
  { step: '3', action: 'Hunt unlinked procs', cmd: 'vol -f mem.raw windows.psscan', notes: 'Compare to pslist — processes in psscan but not pslist = DKOM hidden' },
  { step: '4', action: 'Network connections', cmd: 'vol -f mem.raw windows.netscan', notes: 'Look for established connections to external IPs, listening on unexpected ports' },
  { step: '5', action: 'Command lines',       cmd: 'vol -f mem.raw windows.cmdline', notes: 'Reveals full arguments — obfuscated PS, encoded payloads visible here' },
  { step: '6', action: 'Injected code',       cmd: 'vol -f mem.raw windows.malfind', notes: 'RWX + PE header in non-image VAD = likely injection. High false positive rate' },
  { step: '7', action: 'Services',            cmd: 'vol -f mem.raw windows.svcscan', notes: 'Look for services with unusual binary paths or missing names' },
  { step: '8', action: 'Dump suspicious PID', cmd: 'vol -f mem.raw windows.procdump --pid <PID>', notes: 'Extract PE for static analysis / hash lookup' },
]

// ─── Tool Cheat Sheets ───────────────────────────────────────────────────────

export interface ToolCommand {
  cmd: string
  description: string
}

export interface ToolSheet {
  tool: string
  version: string
  purpose: string
  install: string
  commands: ToolCommand[]
}

export const toolSheets: ToolSheet[] = [
  {
    tool: 'Volatility 3',
    version: '2.x',
    purpose: 'Memory forensics framework',
    install: 'pip install volatility3  OR  git clone + python vol.py',
    commands: [
      { cmd: 'vol -f mem.raw windows.info',                             description: 'Identify OS / symbol table' },
      { cmd: 'vol -f mem.raw windows.pslist',                           description: 'List processes (EPROCESS list)' },
      { cmd: 'vol -f mem.raw windows.psscan',                           description: 'Scan for EPROCESS (finds hidden)' },
      { cmd: 'vol -f mem.raw windows.pstree',                           description: 'Process tree with hierarchy' },
      { cmd: 'vol -f mem.raw windows.cmdline',                          description: 'Process command-line arguments' },
      { cmd: 'vol -f mem.raw windows.netscan',                          description: 'Network connections + sockets' },
      { cmd: 'vol -f mem.raw windows.malfind',                          description: 'Find injected code (RWX VADs)' },
      { cmd: 'vol -f mem.raw windows.dlllist --pid <PID>',              description: 'Loaded DLLs for specific process' },
      { cmd: 'vol -f mem.raw windows.handles --pid <PID>',              description: 'Open handles for process' },
      { cmd: 'vol -f mem.raw windows.filescan',                         description: 'Scan for FILE_OBJECT structures' },
      { cmd: 'vol -f mem.raw windows.dumpfiles --virtaddr <addr>',      description: 'Extract file from memory by address' },
      { cmd: 'vol -f mem.raw windows.procdump --pid <PID>',             description: 'Dump process PE to disk' },
      { cmd: 'vol -f mem.raw windows.hashdump',                         description: 'Extract NTLM hashes from SAM' },
      { cmd: 'vol -f mem.raw windows.svcscan',                          description: 'Scan for service records' },
      { cmd: 'vol -f mem.raw windows.registry.hivelist',                description: 'List loaded registry hives' },
      { cmd: 'vol -f mem.raw windows.registry.printkey --key "Software\\Microsoft\\Windows\\CurrentVersion\\Run"', description: 'Print registry key from memory' },
    ],
  },
  {
    tool: 'Eric Zimmermann Tools',
    version: 'EZ Tools suite',
    purpose: 'Windows artifact parsing (best-in-class for DFIR)',
    install: 'https://ericzimmermann.github.io — download individual tools or Get-ZimmermanTools.ps1',
    commands: [
      { cmd: 'PECmd.exe -f C:\\Windows\\Prefetch\\NOTEPAD.EXE-12345678.pf',         description: 'Parse single prefetch file' },
      { cmd: 'PECmd.exe -d C:\\Windows\\Prefetch --csv C:\\out',                     description: 'Parse all prefetch to CSV' },
      { cmd: 'AppCompatCacheParser.exe -f SYSTEM --csv C:\\out',                     description: 'Parse Shimcache from SYSTEM hive' },
      { cmd: 'AmcacheParser.exe -f Amcache.hve --csv C:\\out',                       description: 'Parse Amcache' },
      { cmd: 'JLECmd.exe -d "%APPDATA%\\Microsoft\\Windows\\Recent" --csv C:\\out',  description: 'Parse all Jump Lists' },
      { cmd: 'LECmd.exe -d "%APPDATA%\\Microsoft\\Windows\\Recent" --csv C:\\out',   description: 'Parse all LNK files' },
      { cmd: 'SBECmd.exe -d C:\\Users\\user --csv C:\\out',                          description: 'Parse shellbags from UsrClass.dat' },
      { cmd: 'MFTECmd.exe -f $MFT --csv C:\\out',                                   description: 'Parse Master File Table' },
      { cmd: 'MFTECmd.exe -f $MFT --body C:\\out --blf',                             description: 'Output MFT as bodyfile for timeline' },
      { cmd: 'EvtxECmd.exe -d C:\\Windows\\System32\\winevt\\Logs --csv C:\\out',   description: 'Parse all event logs to CSV' },
      { cmd: 'RECmd.exe -d C:\\RegHives --csv C:\\out',                              description: 'Batch parse registry hives' },
      { cmd: 'Timeline Explorer: load CSV output for filtering/sorting',             description: 'EZ Tools GUI for CSV analysis' },
    ],
  },
  {
    tool: 'Autopsy',
    version: '4.x',
    purpose: 'GUI digital forensics platform — disk image analysis',
    install: 'https://www.autopsy.com/download/ — Windows installer',
    commands: [
      { cmd: 'New Case → Add Data Source → Disk Image (.E01/.dd/.img)',  description: 'Load forensic image' },
      { cmd: 'Ingest Modules: Run All (or select)',                       description: 'Hash lookup, keyword search, web artifacts, recent activity, EXIF' },
      { cmd: 'Keyword Search → regex: (\\b25[0-5]|...)  for IPs',        description: 'Regex IP extraction from unallocated' },
      { cmd: 'Timeline → Event Types filter',                             description: 'GUI timeline with file/log/web activity' },
      { cmd: 'File Types → by Extension vs Signature',                   description: 'Detect renamed files (sig≠ext mismatch)' },
      { cmd: 'Tools → Run Ingest Modules on selected file',              description: 'Targeted analysis on suspicious file' },
      { cmd: 'Reports → Generate Report → HTML/Excel',                   description: 'Export findings for reporting' },
    ],
  },
  {
    tool: 'KAPE',
    version: '1.x (Kroll Artifact Parser and Extractor)',
    purpose: 'Triage collection and processing — fastest artifact acquisition',
    install: 'https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape',
    commands: [
      { cmd: 'kape.exe --tsource C: --tdest D:\\triage --target !BasicCollection',           description: 'Collect basic triage artifacts from live C: to D:\\triage' },
      { cmd: 'kape.exe --tsource C: --tdest D:\\triage --target WindowsEventLogs',           description: 'Collect Windows event logs only' },
      { cmd: 'kape.exe --tsource C: --tdest D:\\triage --target Prefetch,Amcache,Shimcache', description: 'Collect execution artifacts' },
      { cmd: 'kape.exe --msource D:\\triage --mdest D:\\processed --module EZParser',        description: 'Process collected artifacts with EZ Tools' },
      { cmd: 'kape.exe --msource D:\\triage --mdest D:\\processed --module !EZParser --mef csv', description: 'EZ Tools output as CSV' },
      { cmd: 'kape.exe --sync',                                                              description: 'Update target/module definitions from GitHub' },
    ],
  },
  {
    tool: 'Plaso / log2timeline',
    version: '20230717+',
    purpose: 'Supertimeline generation from disk images',
    install: 'pip install plaso  OR  docker pull log2timeline/plaso',
    commands: [
      { cmd: 'log2timeline.py --storage-file output.plaso image.E01',        description: 'Parse image into Plaso storage file' },
      { cmd: 'log2timeline.py --storage-file output.plaso --parsers win7 image.E01', description: 'Parse with Windows 7 parser preset' },
      { cmd: 'psort.py -o l2tcsv output.plaso > timeline.csv',              description: 'Export to CSV (l2t format)' },
      { cmd: 'psort.py -o json output.plaso > timeline.jsonl',              description: 'Export to JSONL for Timesketch' },
      { cmd: 'psort.py output.plaso "timestamp > \\"2024-01-01 00:00:00\\""', description: 'Filter by date range' },
      { cmd: 'pinfo.py output.plaso',                                        description: 'Show storage file metadata and stats' },
    ],
  },
  {
    tool: 'Velociraptor',
    version: '0.7.x',
    purpose: 'Enterprise DFIR — live response, hunting, artifact collection at scale',
    install: 'https://docs.velociraptor.app — single binary, no dependencies',
    commands: [
      { cmd: 'velociraptor.exe gui',                                                    description: 'Start single-user GUI mode (local investigation)' },
      { cmd: 'velociraptor.exe artifacts collect Windows.KapeFiles.Targets --output triage.zip', description: 'KAPE-style collection via VQL' },
      { cmd: 'VQL: SELECT * FROM pslist()',                                             description: 'List processes via VQL' },
      { cmd: 'VQL: SELECT * FROM artifact_definitions()',                               description: 'List available artifact definitions' },
      { cmd: 'Artifact: Windows.EventLogs.Evtx',                                       description: 'Parse Windows event logs' },
      { cmd: 'Artifact: Windows.Forensics.Prefetch',                                   description: 'Parse prefetch files' },
      { cmd: 'Artifact: Windows.Detection.Yara.Process',                               description: 'YARA scan running processes' },
    ],
  },
  {
    tool: 'X-Ways Forensics',
    version: '20.7',
    purpose: 'Disk/image forensics — highly efficient, minimal overhead, extremely feature-dense. Steepest learning curve of any major DFIR tool.',
    install: 'https://x-ways.net — extract ZIP to directory of choice, no installer needed. Portable — runs from USB. Download viewer component separately (\\viewer subdirectory).',
    commands: [
      // ── Case setup ────────────────────────────────────────────────────────
      { cmd: 'File → New Case → set case folder, investigator name, case number',            description: 'Case metadata goes into all reports. Fill out before adding evidence. Case saved as .xfc file + same-named folder.' },
      { cmd: 'Case Properties → enable Activity Log (case logging)',                         description: 'Logs every menu command, dialog setting, and operation with timestamp. Essential for court documentation.' },
      { cmd: 'Case Properties → set time zone',                                              description: 'Sets display timezone globally for all evidence. Critical — all timestamps shown relative to this.' },
      // ── Adding evidence ───────────────────────────────────────────────────
      { cmd: 'Case Data window → File → Add Evidence Object → Image File',                   description: 'Add .E01, .dd, .vmdk, .vhd, .vdi, raw. XWF reads E01 natively including hash verification.' },
      { cmd: 'Case Data window → File → Add Evidence Object → Physical Disk',               description: 'Add attached physical drive. Always via hardware write blocker.' },
      { cmd: 'Case Data window → File → Add Evidence Object → Directory',                   description: 'Add a folder as logical evidence — useful for triage of specific directories.' },
      { cmd: 'Right-click evidence → Properties → verify hash',                             description: 'Re-hash evidence to verify integrity. Hash embedded in .E01 is auto-checked on add.' },
      { cmd: 'Right-click partition → Open (double-click) to explore',                       description: 'Opens the volume in directory browser. Do this before RVS.' },
      // ── Navigation — the navigation nightmare addressed ────────────────────
      { cmd: 'Right-click root directory in case tree → recursively list all files',         description: 'THE most important navigation step. Lists EVERY file in the volume in directory browser. Do this before filtering.' },
      { cmd: 'F8 — toggle between case tree and directory browser focus',                    description: 'Case tree on left, file list on right. F8 moves focus between panes.' },
      { cmd: 'Three dots (···) left of mode buttons → click once → split view side-by-side', description: 'Moves preview/details below directory browser → click again to detach → useful on widescreen monitors.' },
      { cmd: 'Right-click directory in case tree → explore recursively',                     description: 'Alternative to right-clicking root. Use on any subdirectory for scoped recursive view.' },
      { cmd: 'Mode buttons (top of data window): File / Preview / Gallery / Details / Calendar', description: 'Switch view modes. File = hex editor. Preview = viewer component. Gallery = thumbnail grid. Details = full metadata. Calendar = timeline heatmap.' },
      { cmd: 'Preview mode → Shift+click Raw button',                                        description: 'Persistent raw text preview — shows HTML source, full .eml headers, etc. Useful for search hit context.' },
      { cmd: 'Details mode (blue book icon)',                                                 description: 'Full extracted metadata for selected file: all 4 NTFS timestamps, hash, path, internal metadata, generator signature.' },
      { cmd: 'Gallery mode → sort by skin color % (Analysis column, descending)',            description: 'Most likely skin-tone-heavy images at top. Key for CSAM investigations.' },
      { cmd: 'Calendar mode → filter by file type → shows timestamp heatmap',               description: 'Example: filter to JPEG then enable calendar to see peak camera activity periods.' },
      // ── Directory browser configuration (do this once per case) ───────────
      { cmd: 'View → Directory Browser Options → add columns: Type Status, Hash, Hash Set, Category, 1st Sector, Attr.', description: 'Default columns are minimal. Type Status (confirmed/mismatch/newly identified) and Hash Set are essential. Save as .settings file.' },
      { cmd: 'Click column header to sort; Shift+click for secondary sort',                  description: 'Sort by Type Status to group known/unknown/mismatch. Sort by Hash to find duplicates.' },
      { cmd: 'Type Status column: mismatch detected = extension does not match signature',   description: 'Critical: renamed executables, hidden malware. Filter for mismatch to focus on these.' },
      { cmd: 'View → Directory Browser Options → Show files in subdirectories (recursive)', description: 'Enables flat view. Combined with filters this is extremely powerful.' },
      { cmd: 'Options → Directory Browser → turn on "Offset" instead of "1st sector"',     description: 'Shows precise byte offset instead of sector number — more useful for analysis.' },
      // ── Filtering ─────────────────────────────────────────────────────────
      { cmd: 'Click filter icon in column header (funnel icon)',                              description: 'Per-column filter. Available for: Name, Path, Type, Size, timestamps, Hash, Category, Labels, and more.' },
      { cmd: 'Name column filter: *.exe;*.dll;*.bat',                                        description: 'Semicolon-separated wildcards. Substring match — no wildcards needed for path filter.' },
      { cmd: 'Size filter → ≤ -1',                                                           description: 'Special syntax: finds files with unknown size. Useful for carved files.' },
      { cmd: 'Attr. column filter → E (encrypted) or e! (application-level encryption)',    description: 'Find encrypted files. Sort by Attr. to push interesting attributes to top.' },
      { cmd: 'Category filter → Notable',                                                    description: 'Show only files matching known-bad hash sets.' },
      { cmd: 'Multiple filters combine as AND — clear all with View → Reset All Filters',   description: 'All active filters shown with orange funnel icons in column headers.' },
      { cmd: 'Labels filter → supports AND/NOT/OR operators',                                description: 'Example: show files labeled "malware" AND "persistence" — powerful for large cases.' },
      // ── RVS (Refine Volume Snapshot) — the main processing step ───────────
      { cmd: 'Specialist → Refine Volume Snapshot (RVS)',                                    description: 'THE central processing operation. All analysis modules run here. Run on fresh volume snapshot before analysis.' },
      { cmd: 'RVS → File System Data Structure Search → Volume Shadow Copies',              description: 'Parses VSS. Previous file versions appear with "SC #" in Attr. column. Forensic license only.' },
      { cmd: 'RVS → File Header Signature Search → select relevant file types',             description: 'Carves deleted/unallocated files by signature. Select only types needed to save time.' },
      { cmd: 'RVS → File Level → File Type Verification (check true type vs extension)',    description: 'Populates Type Status column. Finds renamed executables. Run before filtering by type.' },
      { cmd: 'RVS → File Level → Extraction of Internal Metadata',                          description: 'Extracts author, creation date, GPS, camera model, sender/recipient, document text. Populates Metadata, Author, Sender, Content Created columns.' },
      { cmd: 'RVS → File Level → Hash Calculation → match against hash database',           description: 'Computes MD5/SHA1/SHA256. Match against NSRL (known-good) or custom known-bad sets. Populates Hash, Hash Set, Category columns.' },
      { cmd: 'RVS → File Level → Archive Exploration (ZIP, RAR, 7Z, GZ, TAR, ARJ)',       description: 'Adds archive contents to volume snapshot as child objects. Recursively processes nested archives.' },
      { cmd: 'RVS → File Level → E-mail Extraction (PST, OST, DBX, MBOX, MSG)',            description: 'Extracts individual .eml files from mail archives. Populates Sender/Recipient columns. Child objects in volume snapshot.' },
      { cmd: 'RVS → File Level → Uncover Embedded Data',                                   description: 'Carves embedded files from within other files (JPEG in PDF, LNK in Jump Lists, Chrome cache, etc.).' },
      { cmd: 'RVS → File Level → Index Text',                                               description: 'Full-text index for instant search. Run before simultaneous search for best results. Slow on large images.' },
      { cmd: 'RVS → File Level → Pictures Analysis → Skin Color Detection',               description: 'Computes % skin tone per image. Sort Analysis column descending for CSAM investigations.' },
      { cmd: 'RVS → File Level → Capture Still Images from Videos (requires MPlayer)',     description: 'Extracts frames at interval. Results viewable in gallery. Set interval per video length.' },
      { cmd: 'RVS → "Already done?" checkbox — uncheck to reprocess evidence',             description: 'X-Ways skips already-processed files by default. Uncheck to force reprocessing.' },
      // ── Search ────────────────────────────────────────────────────────────
      { cmd: 'Search → Simultaneous Search (Ctrl+F in directory browser)',                  description: 'Main search. Enter multiple terms, one per line. Searches all code pages simultaneously. Results in search hit list.' },
      { cmd: 'Simultaneous Search → select code pages: ANSI + UTF-16 LE + UTF-16 BE',     description: 'Catches both ASCII and Unicode variants in single pass. Add UTF-8 for web/log data.' },
      { cmd: 'Simultaneous Search → GREP checkbox → use regex',                            description: 'Full regex support. Use for IP addresses, email addresses, SSNs, dates, credit card patterns.' },
      { cmd: 'Simultaneous Search → "Logical" radio button → decode text',                 description: 'Decodes PDF/Office/HTML before searching. Catches obfuscated or encoded search terms in documents.' },
      { cmd: 'Simultaneous Search → "1 hit per file" option',                              description: 'Returns list of unique files containing any hit. Use to identify relevant files before detailed review.' },
      { cmd: 'Search term list (Case Data window) → select terms → Enter → view hits',    description: 'Filter search hit list by term. Use + key to force AND, - key to exclude a term.' },
      { cmd: 'Search term list → select 2 terms → NEAR option → set byte distance',       description: 'Proximity search: finds files where both terms appear within N bytes of each other.' },
      { cmd: 'Binoculars button (mode bar) → switches to search hit list mode',            description: 'Directory browser shows search hits instead of files. Extra columns: offset, description, context.' },
      { cmd: 'Space bar in search hit list → mark hit as notable (yellow flag)',           description: 'Incremental filtering: mark notable hits, then filter for notable only.' },
      { cmd: 'Event list (clock icon, next to binoculars) → sort by timestamp',            description: 'Unified timeline: browser history, event logs, registry, LNK, prefetch, email, file system timestamps in one chronological view.' },
      // ── Labels (bookmarking for reports) ──────────────────────────────────
      { cmd: 'Right-click file → Labels → create/assign label name',                        description: 'Labels are report tables. Name them by category: "Execution Evidence", "C2 Communications", "Exfiltration".' },
      { cmd: 'Ctrl+1 through Ctrl+9 — apply label shortcut in directory browser',          description: 'First 9 labels get keyboard shortcuts. Assign in Labels dialog. Numpad 1-9 also works (Num Lock on).' },
      { cmd: 'Ctrl+0 — remove all labels from selected file(s)',                            description: 'WARNING: removes all labels. Use Alt+1–9 to remove specific label only.' },
      { cmd: 'Labels dialog → half-check "advance to next item"',                          description: 'Auto-advances to next file after labeling. Speeds up bulk review.' },
      { cmd: 'Labels filter → show files with label "X" AND label "Y"',                    description: 'AND/OR/NOT combination. Also shows siblings option — includes files in same directory as labeled file.' },
      // ── Report generation ─────────────────────────────────────────────────
      { cmd: 'Case Data window → File → Report',                                            description: 'Generates HTML report. Opens in browser or Word. Includes: case metadata, evidence details, labeled files, search hits, activity log.' },
      { cmd: 'Report → Report Tables → select labels to include',                           description: 'Each label name becomes a report table. Check which tables to include.' },
      { cmd: 'Report → Copy files to report subdirectory → yes',                           description: 'Copies labeled files alongside HTML report. Thumbnails embedded directly in HTML.' },
      { cmd: 'Report → Name output files after Unique ID',                                  description: 'Ensures unique, traceable filenames. Prevents duplicates if same file in multiple tables.' },
      { cmd: 'Report → Include Case Log → yes',                                             description: 'Appends full activity log to report. Every operation documented for court.' },
      { cmd: 'Report → Convert HTML to PDF',                                                description: 'Fully checked = PDF only. Half checked = both HTML and PDF.' },
      // ── Hash database management ───────────────────────────────────────────
      { cmd: 'Tools → Hash Database → Initialize → select hash type (MD5/SHA1/SHA256)',   description: 'Create new hash database. Stored as 257 .xhd files in selected folder. One-time setup.' },
      { cmd: 'Tools → Hash Database → Import → select NSRL RDS 2.x hash set file',        description: 'Import NSRL as "irrelevant" category. Hash values marked malicious/special are filtered correctly.' },
      { cmd: 'Tools → Hash Database → Import → custom notable hash set (.txt, one hash per line)', description: 'Simple format: first line = hash type (MD5), remaining lines = hex hash values.' },
      { cmd: 'Right-click file in directory browser → Include in Hash Database',           description: 'Add selected files hash to database. Creates custom hash set from evidence.' },
      { cmd: 'Category column → Notable = known-bad match; Irrelevant = known-good (NSRL)', description: 'After RVS hash matching. Filter Category = Notable to focus on flagged files.' },
      // ── Evidence file containers ───────────────────────────────────────────
      { cmd: 'Specialist → New Evidence File Container → set output path',                  description: 'Creates shareable .xwf container. Recipients can open in XWF or X-Ways Investigator.' },
      { cmd: 'Right-click labeled files → Copy to Evidence File Container',                description: 'Copy selected files into open container. Preserves all metadata, timestamps, path.' },
      { cmd: 'Close container → option to compress, encrypt, split',                       description: 'Encrypt for secure handoff. Split for large containers on removable media.' },
      // ── Key recovery operations ────────────────────────────────────────────
      { cmd: 'Right-click file → Recover/Copy (F5) → set output path',                    description: 'Export file(s) preserving timestamps and directory structure. Logged in copylog.html.' },
      { cmd: 'Recover/Copy → "With path and dates" — always use this',                    description: 'Preserves original MAC times on export. Without this, timestamps reflect copy time.' },
      { cmd: 'Recover/Copy → select "All tagged files" → export in one operation',        description: 'Batch export all files with specific tags. Tags set with middle-click or T key.' },
      // ── Keyboard shortcuts reference ───────────────────────────────────────
      { cmd: 'ESC — abort current operation; clear block; dismiss dialog',                  description: 'Universal abort. Also clears active filter in directory browser.' },
      { cmd: 'PAUSE — pause/resume current operation',                                      description: 'Pauses any running operation (RVS, search, hash calc). Click again to resume.' },
      { cmd: 'ENTER — display Start Center (when edit window active)',                      description: 'Quick access to open files, disks, cases.' },
      { cmd: 'Ctrl+S — save current case',                                                  description: 'Cases auto-save but manual save recommended before risky operations.' },
      { cmd: 'Ctrl+C in directory browser — copies selected rows as text',                  description: 'Copies file metadata as TSV. Useful for notes and documentation.' },
      { cmd: 'Ctrl+C in message box — copies message text to clipboard',                   description: 'Copies error/warning text. Always do this instead of screenshotting message boxes.' },
      { cmd: 'Ins key — bookmark selected file in directory browser',                       description: 'Opens label dialog. Fastest way to bookmark a file.' },
      { cmd: 'Space bar — mark search hit as notable',                                      description: 'In search hit list mode. Yellow flag. Also works to un-mark.' },
      { cmd: 'Middle-click directory in case tree — tag it',                                description: 'Tags directory for batch operations (search, export, hash).' },
      { cmd: 'F11 — repeat last Go To Offset command',                                      description: 'In hex editor / File mode. Ctrl+F11 goes in opposite direction.' },
      { cmd: 'Alt+Left / Alt+Right — navigate between template records',                   description: 'In template view. Alt+Home / Alt+End for first/last record.' },
      { cmd: 'Ctrl+Shift+M — open evidence object annotations',                            description: 'Position manager for the current evidence object.' },
      { cmd: '* (numpad asterisk) on selected tree node — expand entire subtree',          description: 'Fully expand all subdirectories. Useful before exporting case tree to text.' },
      { cmd: 'Tab — switch between hex and text column in editor',                         description: 'In File mode / disk editor hex view.' },
      { cmd: 'Ctrl+F9 — open Access button menu (disk edit windows)',                      description: 'Quick access to access controls in disk mode.' },
      // ── Attribute column flags (from manual section 2.8) ──────────────────
      { cmd: 'Attr. column: e? = high entropy, possibly fully encrypted',                  description: 'Entropy test on files >255 bytes. Not applied to known-compressed types (ZIP, JPEG, MP4). Good indicator of TrueCrypt/VeraCrypt containers' },
      { cmd: 'Attr. column: e! = format-confirmed encrypted (MS Office DRM, PDF, ZIP)',    description: 'Format-specific check. XWF auto-tries case password collection against these files' },
      { cmd: 'Attr. column: (ADS) = NTFS alternate data stream',                          description: 'Hidden data stream attached to a file. Filter Attr. for "(ADS)" to find all streams in the volume' },
      { cmd: 'Attr. column: (SC #) = found in volume shadow copy #N',                     description: 'Files from shadow copies. Sort by ID to see current + previous versions adjacent' },
      { cmd: 'Attr. column: e = encrypted in archive; c = compressed in archive',         description: 'Per-file flags inside archives. e = cannot be extracted without password' },
      // ── Virtual objects in directory browser ──────────────────────────────
      { cmd: 'Directory browser bottom group: Free Space, Volume Slack, File System Areas', description: 'Virtual files covering special disk regions. "Free Space" = unallocated clusters. Search these specifically for carved file fragments' },
      { cmd: 'Path Unknown directory → Carved files subdirectory',                         description: 'All file-header-signature carved files land here. Also: files whose original path cannot be determined (orphaned objects)' },
      // ── Filter save/load (.settings files) ────────────────────────────────
      { cmd: 'Directory browser caption → save icon → save filter+sort as .settings file', description: 'Reusable filter configurations. Load during any future case to instantly apply same filter set' },
      { cmd: 'Load multiple .settings files simultaneously → auto-AND/OR combining',        description: 'Complex nested filters: files of type A in path X + files of type B not deleted + names containing Y. Labels auto-assigned to results' },
      // ── FuzZyDoc — fuzzy document matching ────────────────────────────────
      { cmd: 'RVS → FuzZyDoc database matching (requires FuzZyDoc hash DB)',               description: 'Fuzzy hash matching for documents. Finds modified versions: different file format, metadata changes, minor text edits. Useful for IP theft / classified document leakage cases' },
      { cmd: 'Tools → Hash Database → switch to FuzZyDoc database → create hash set from selected docs', description: 'Build FuzZyDoc DB from known documents. One hash set per document for percentage-match display. Up to 65,535 hash sets supported' },
      // ── Block-wise hashing ────────────────────────────────────────────────
      { cmd: 'RVS → Block-wise hashing and matching (separate from file hash DB)',          description: 'Hashes evidence in 512-byte blocks against a block hash database. Finds partial remnants of known files in free space even if fragmented. High value for large compressed files (Office, JPEG, video)' },
      { cmd: 'Right-click file → Include in Hash Database → Block hash values',            description: 'Creates block hash set from selected file. Use on known notable files. Multiple contiguous matching blocks = high evidentiary value' },
      // ── Email extraction details ──────────────────────────────────────────
      { cmd: 'RVS → Email extraction → PST files processed WITHOUT password',              description: 'PST password bypass built in — no need to crack PST password. Supports PST, OST, DBX, MBOX, MSG, AOL PFC, Thunderbird, generic mbox, winmail.dat (TNEF)' },
      { cmd: 'After email extraction → filter Attr. = e-mail to show all extracted messages', description: 'More reliable than Type or Category filter for finding extracted email. Sender and Recipient columns now populated' },
      // ── Event list and EVTX field extraction ──────────────────────────────
      { cmd: 'Event list → type filter → select: File system, Registry, Browser, Email, Communications', description: 'Unified timeline across all artifact types. Export as TSV for Plaso ingestion or Excel pivot analysis. Sort by timestamp for chronological review' },
      { cmd: 'Edit Event Log Events.txt in install dir to define field extraction per EventID', description: 'Format: EventID [tab] provider [tab] fields [tab] comment. Fields extracted directly into event list. Add custom entries for your investigation-specific event IDs' },
      { cmd: 'Details mode → select .evtx file → view extracted field table',              description: 'Username, IP address, task name, service name, PowerShell cmdline extracted from payload fields. Much faster than manual event log review' },
      // ── Logical vs physical search ────────────────────────────────────────
      { cmd: 'Simultaneous Search → Logical radio button (preferred over Physical)',        description: 'Logical: searches file by file, handles fragmentation, decompresses NTFS-compressed files, searches inside archives and emails if extracted. Physical: sector-by-sector, misses fragmented data' },
      { cmd: 'Logical Search → "Decode text" → file mask *.pdf;*.docx;*.pptx;*.xlsx;*.odt;*.eml', description: 'Decodes document formats before searching. Catches hits encoded as RTF markup, Base64, HTML entities. Requires viewer component active' },
      { cmd: 'Logical Search → "1 hit per file only" checkbox',                           description: 'Returns list of files containing any hit — not every hit. 3-5x faster. Use to build file list for manual review. Cannot do AND combinations on results' },
      // ── Manual-sourced: navigation shortcuts ────────────────────────────────
      { cmd: 'Sort by column, then type first characters → "jump as you type"',           description: 'If sorted by Type column, type "z" to jump to first zip file. Type "do" then "c" to jump to .docx. Works on whichever column is primary sort. Essential for large datasets.' },
      { cmd: 'Back button (Position menu) or Alt+Left → undo navigation step',           description: 'Returns to previous directory browser state including explored path, sort criteria, filter settings. Like browser back button for directory tree.' },
      { cmd: 'Backspace key in directory browser → navigate to parent',                   description: 'Go up one level. Shift+Backspace → navigate to related object (symbolic link target, shadow copy host, etc.).' },
      { cmd: 'Directory browser caption → click path component to navigate there',        description: 'Breadcrumb navigation. E.g. click "Windows" in "C:\\Windows\\System32\\drivers" to jump to \\Windows.' },
      // ── Manual-sourced: directory browser columns ────────────────────────────
      { cmd: 'Content Created column → internal timestamp from file metadata',            description: 'Timestamp embedded in file format itself (not NTFS). Less volatile than file system timestamps — harder to manipulate. JPEG: Exif DateTimeOriginal. PDF: CreationDate. Office: creation date in document properties.' },
      { cmd: 'Type Description column → full application name for file type',             description: 'e.g. ".pm could be Perl module, PageMaker document, or Pegasus file". Useful when Type column shows ambiguous extension.' },
      { cmd: 'Relevance column → auto-computed importance score (sort descending for triage)', description: 'Based on file type, generator signature, creation date, hash database status, metadata richness, image content. Most relevant files first without manual filtering.' },
      { cmd: 'Generator Signature column → identifies creating device/application',       description: 'JPEG/PDF/Video subtypes. "607AE169 = IJG Library / Paint". Identifies scanner-generated images, specific camera models. Sort to group files from same device.' },
      { cmd: 'Attr. column: partial initialization flag → file has uninitialized tail',   description: 'NTFS valid data length < logical file size. Tail contains older data from different files. Highlighted in different color in hex view. High forensic value.' },
      // ── Manual-sourced: filtering advanced ─────────────────────────────────
      { cmd: 'Description filter → "previously existing" → shows deleted files only',     description: 'Most important filter for deleted file review. Also: "existing", "tagged", "already viewed", "excluded", "carved" — all filterable via Description column.' },
      { cmd: 'Description filter → "copied" → files with creation date newer than modification', description: 'Files that were copied (new creation timestamp). XWF marks these as "copied" in Description. Sort to identify original vs copied files.' },
      { cmd: 'Right-click hash value in Hash column → Filter by',                         description: 'Instantly filters for all duplicates of that exact file without copying the hash. Fastest way to find duplicate files.' },
      { cmd: 'Load multiple .settings files at once → complex nested AND/OR filters',    description: 'Each .settings file can target different files. Results labeled automatically. Example: (type=JPEG in \\Users) OR (type=DOC not deleted) OR (name contains "password").' },
      // ── Manual-sourced: RVS advanced ────────────────────────────────────────
      { cmd: 'RVS → File System Data Structure → NTFS → $LogFile exploitation',          description: 'Reconstructs deleted file contents from NTFS journal. Also finds previous names/paths of renamed/moved files. Highly valuable — run before carving.' },
      { cmd: 'RVS → File System Data Structure → NTFS → FILE records outside $MFT',     description: 'Finds FILE records in free space after partition resize/reformat/defrag. Time-consuming on large volumes but recovers otherwise-lost files.' },
      { cmd: 'RVS → Backup volume snapshot before risky operation',                       description: 'Case Data context menu → Back up/Restore. Saves current VS state. Restore if you accidentally lose tags, labels, or search hits.' },
      // ── Manual-sourced: registry report ──────────────────────────────────────
      { cmd: 'View .reg hive file → right-click Registry Viewer → Create Registry Report', description: 'Auto-generates HTML report from registry hives. Uses "Reg Report *.txt" definition files. Edit these to customize which keys appear in your reports.' },
      { cmd: 'Registry Report → "Reg Report Devices.txt" → External Memory Devices table', description: 'Lists external media from SOFTWARE hive (Vista+): access timestamps, hardware serial, volume label, volume serial, volume size. Better than manual USBSTOR parsing.' },
      { cmd: 'Registry Viewer → click value → cursor auto-jumps to raw value in hex editor', description: 'When data window is in File mode for that hive. Allows direct hex inspection of selected registry value.' },
      // ── Manual-sourced: mount as drive letter ────────────────────────────────
      { cmd: 'Specialist → Mount As Drive Letter → accessible from any Windows application', description: 'Mounts volume snapshot as read-only drive letter. Run virus scanner against mounted volume. Right-click partition or directory in case tree for scoped mount.' },
      { cmd: 'Mount As Drive Letter → "Apply recursively" → flat listing of all files',  description: 'Presents all subdirectory files in a flat list. Useful for batch processing with external tools that cannot navigate directory trees.' },
      // ── Manual-sourced: conditional cell coloring ────────────────────────────
      { cmd: 'Directory Browser Options → Conditional Cell Coloring → set per column',   description: 'Color entire rows or specific cells based on substring match. Example: color "Program started" events red and logon events yellow in event list. Up to 255 conditions.' },
      // ── Manual-sourced: technical details report ─────────────────────────────
      { cmd: 'Specialist → Technical Details Report → run on physical disk before imaging', description: 'Reports: HPA/DCO hidden areas, SMART status, partition table, sector size, disk serial. Auto-runs when you start disk imaging. Save this report with case.' },
    ],
  },
  {
    tool: 'Magnet AXIOM',
    version: '7.x',
    purpose: 'All-in-one acquisition + processing + analysis — strongest cloud and mobile artifact support',
    install: 'https://www.magnetforensics.com/products/magnet-axiom — license required',
    commands: [
      // AXIOM Process (acquisition + processing)
      { cmd: 'AXIOM Process → New Case → set case path and number',                           description: 'Process handles acquisition and processing; Examine handles analysis — two separate apps' },
      { cmd: 'AXIOM Process → Evidence Sources → Computer → Image/Drive',                    description: 'Load .E01, .dd, L01, AD1 — supports most formats' },
      { cmd: 'Evidence Sources → Computer → Windows → check all artifact categories',         description: 'Select artifact families to parse — uncheck irrelevant ones to reduce processing time' },
      { cmd: 'Evidence Sources → Mobile → Android/iOS backup or image',                      description: 'Strongest mobile parser — handles GrayKey, Cellebrite, iTunes backups, UFED' },
      { cmd: 'Evidence Sources → Cloud → connect account (Google, iCloud, Facebook, etc.)',   description: 'Direct cloud acquisition via OAuth — no device needed if credentials available' },
      { cmd: 'Artifact Details → select custom artifact profiles',                            description: 'Save artifact selection as profile for recurring case types (e.g. "IP theft", "CSAM")' },
      { cmd: 'Processing Details → enable: Keyword search, Hash lookup, Skin tone analysis',  description: 'Set before processing starts — cannot add these after without reprocessing' },
      { cmd: 'Processing Details → Keyword List → import .txt wordlist',                      description: 'Pre-processing keyword list — hits flagged during artifact parsing' },
      { cmd: 'Processing Details → Hash Sets → import Project VIC / CAID / custom',          description: 'Import known-bad hash sets before processing for auto-flagging' },
      { cmd: 'Go → Process Evidence',                                                         description: 'Start processing — can take hours for large images. Runs in background' },
      // AXIOM Examine (analysis)
      { cmd: 'Open AXIOM Examine → load .mfdb case file',                                     description: 'Examine opens the processed case database. .mfdb = AXIOM case file' },
      { cmd: 'Artifacts pane (left) → expand category → click artifact type',                 description: 'Main navigation — left pane is artifact tree, center is artifact list, right is detail' },
      { cmd: 'Case Dashboard → Overview tab',                                                 description: 'High-level summary: artifact counts, timeline heatmap, keyword hit count' },
      { cmd: 'Artifacts → Communication → Web Related → Browser History',                    description: 'All browser history normalized across Chrome/Firefox/Edge/IE into single view' },
      { cmd: 'Artifacts → Communication → Email → select mail client',                       description: 'Parses Outlook PST/OST, Thunderbird, webmail artifacts' },
      { cmd: 'Artifacts → Device Activity → Recently Accessed Files',                        description: 'Aggregates LNK, Jump Lists, MRU, shellbags into unified recent files view' },
      { cmd: 'Artifacts → Device Activity → Program Execution',                              description: 'Prefetch, Shimcache, Amcache, UserAssist combined in one view' },
      { cmd: 'Artifacts → Device Activity → Connected Devices',                              description: 'USB history from registry — normalized view of USBSTOR + MountedDevices' },
      { cmd: 'Artifacts → Operating System → Windows Event Logs',                            description: 'Parsed event log artifacts grouped by event type' },
      // Timeline
      { cmd: 'Case Dashboard → Timeline tab',                                                 description: 'Unified timeline across all artifact timestamps — zoom to incident window' },
      { cmd: 'Timeline → filter by artifact type checkboxes',                                 description: 'Reduce noise — show only relevant artifact types in window' },
      { cmd: 'Timeline → date range picker → set to ±24h around known event',                description: 'Narrow to incident window before exporting or reviewing' },
      // Search
      { cmd: 'Global Search bar (top) → enter keyword',                                      description: 'Searches all artifact text fields. Use quotes for exact phrase' },
      { cmd: 'Search → Advanced → regex checkbox → enter pattern',                           description: 'Regex search across all artifact content' },
      { cmd: 'Artifacts list → right-click column header → Add filter',                      description: 'Per-column filtering on any artifact list — filter by value, date range, etc.' },
      // Connections (link analysis)
      { cmd: 'Connections tab → select artifact → View Connections',                         description: 'Visual link chart between artifacts sharing identifiers (email, IP, username)' },
      { cmd: 'Connections → right-click node → Find in Artifacts',                           description: 'Jump from connection chart back to the underlying artifact' },
      // Tagging / Export
      { cmd: 'Right-click artifact → Tag → set tag color and label',                         description: 'Tag artifacts for report inclusion. Use consistent tag names across case' },
      { cmd: 'File → Export → Tagged Artifacts → PDF/Excel/CSV',                             description: 'Export only tagged items to report. Choose format based on recipient' },
      { cmd: 'File → Export → Full Report → HTML',                                           description: 'Full case report with all artifact categories, thumbnails, timeline' },
      { cmd: 'Tools → Verify Evidence → re-hash source image',                               description: 'Verify evidence integrity — re-hash original image against stored hash' },
    ],
  },
]

// ─── macOS Artifacts ──────────────────────────────────────────────────────────

export interface MacArtifact {
  category: string
  path: string
  title: string
  description: string
  notes: string
  parseWith?: string
}

export const macArtifacts: MacArtifact[] = [
  // ── User activity ──────────────────────────────────────────────────────────
  { category: 'Shell History',   path: '~/.bash_history',                   title: 'Bash history',              description: 'Bash command history. Appended on session close.', notes: 'HISTFILESIZE / HISTSIZE control size. Attacker may: unset HISTFILE, set HISTSIZE=0, rm ~/.bash_history, or use "history -c".', parseWith: 'cat, strings' },
  { category: 'Shell History',   path: '~/.zsh_history',                    title: 'Zsh history (default shell since Catalina)', description: 'Zsh command history with timestamps if EXTENDED_HISTORY is set.', notes: 'Default shell since macOS Catalina (10.15). Format: ": timestamp:elapsed;command". Check /etc/shells for all installed shells.', parseWith: 'cat, strings' },
  { category: 'Shell History',   path: '~/.local/share/fish/fish_history',  title: 'Fish shell history',        description: 'Fish shell YAML-format history with timestamps.', notes: 'Fish stores timestamps by default — more forensically valuable than bash/zsh.', parseWith: 'cat' },

  // ── Browser artifacts ──────────────────────────────────────────────────────
  { category: 'Browser',  path: '~/Library/Application Support/Google/Chrome/Default/History',                 title: 'Chrome history (SQLite)',        description: 'URLs, visit counts, typed URLs, download history.', notes: 'Tables: urls, visits, downloads. Lock file present while Chrome is open — copy before parsing.', parseWith: 'sqlite3, DB Browser' },
  { category: 'Browser',  path: '~/Library/Application Support/Google/Chrome/Default/Cookies',                 title: 'Chrome cookies (SQLite)',        description: 'Session cookies, auth tokens, persistent cookies.', notes: 'Encrypted with macOS Keychain (AES-256). Chrome cookie decryption requires Keychain access or user password.', parseWith: 'sqlite3, hindsight' },
  { category: 'Browser',  path: '~/Library/Safari/History.db',                                                  title: 'Safari history (SQLite)',        description: 'Visit history, search terms, webpage titles.', notes: 'Tables: history_items, history_visits. iCloud Safari history syncs across Apple devices.', parseWith: 'sqlite3, DB Browser' },
  { category: 'Browser',  path: '~/Library/Safari/Downloads.plist',                                             title: 'Safari downloads (plist)',       description: 'Files downloaded via Safari — path, URL, date, size.', notes: 'Binary or XML plist. plutil -convert xml1 to convert.', parseWith: 'plutil, plistutil' },
  { category: 'Browser',  path: '~/Library/Application Support/Firefox/Profiles/*.default/places.sqlite',       title: 'Firefox history (SQLite)',       description: 'moz_places and moz_historyvisits tables.', notes: 'Profile directory name is random. find ~/Library -name "places.sqlite" to locate.', parseWith: 'sqlite3, DB Browser' },

  // ── System logs ───────────────────────────────────────────────────────────
  { category: 'System Logs',  path: '/var/log/system.log',                  title: 'System log',                description: 'General system events (older macOS). Replaced by Unified Log in macOS 10.12+.', notes: 'Present on older systems. Sierra+ uses Unified Log (log show command) instead.', parseWith: 'cat, grep' },
  { category: 'System Logs',  path: '/private/var/log/asl/',                 title: 'Apple System Log (ASL)',    description: 'Binary ASL log files — auth, crashes, kernel messages.', notes: 'Binary format. Parse with: syslog -f /var/log/asl/*.asl or use Console.app.', parseWith: 'syslog, Console.app' },
  { category: 'System Logs',  path: '/var/db/diagnostics/',                  title: 'Unified Log store (tracev3)', description: 'macOS Unified Logging — most comprehensive log source since Sierra.', notes: 'Binary tracev3 format. Parse: log show --predicate \'eventMessage contains "sudo"\' --info. Time range: log show --start "2024-01-01" --end "2024-01-02". Export: log collect --output /tmp/logarchive.logarchive', parseWith: 'log show, Heimdall, UnifiedLogReader' },
  { category: 'System Logs',  path: '/var/log/install.log',                  title: 'Install log',               description: 'Software installation events — packages, apps, updates.', notes: 'Shows what was installed and when. Look for unexpected installs or installers run from /tmp.', parseWith: 'cat, grep' },
  { category: 'System Logs',  path: '/Library/Logs/DiagnosticReports/',      title: 'Crash reports',             description: 'Application and system crash reports (.ips files).', notes: 'Contains process names, binary paths, exception types, stack traces. Useful for identifying malware crashes.', parseWith: 'cat, plutil' },

  // ── Authentication / Users ────────────────────────────────────────────────
  { category: 'Auth / Users',  path: '/var/log/auth.log',                    title: 'Auth log (older macOS)',    description: 'sudo, ssh, login events on pre-Sierra systems.', notes: 'On modern macOS query Unified Log: log show --predicate \'subsystem == "com.apple.securityd"\'', parseWith: 'cat, grep' },
  { category: 'Auth / Users',  path: '/Library/Preferences/com.apple.loginwindow.plist', title: 'Login window plist', description: 'Last logged-in user, auto-login settings.', notes: 'lastUserName key shows last interactive login. AutoLoginUser = auto-login configured.', parseWith: 'plutil, defaults read' },
  { category: 'Auth / Users',  path: '/private/var/db/dslocal/nodes/Default/users/', title: 'Local user database', description: 'plist per local user account — UID, GID, shell, password hash (ShadowHash).', notes: 'Password hash in ShadowHashData key (PBKDF2-HMAC-SHA512). Requires root. Each file = one user. Usernames: ls /private/var/db/dslocal/nodes/Default/users/', parseWith: 'plutil (root required)' },
  { category: 'Auth / Users',  path: '/private/etc/passwd, /private/etc/group', title: '/etc/passwd and group', description: 'User and group list (symlinks to /private).', notes: 'macOS still maintains these for compatibility. Actual auth via OpenDirectory/dslocal.', parseWith: 'cat' },

  // ── Persistence ───────────────────────────────────────────────────────────
  { category: 'Persistence',  path: '~/Library/LaunchAgents/',               title: 'User LaunchAgents',         description: 'Per-user launch agents — run as the user on login.', notes: 'Most common persistence location for user-level malware. plist format. Key fields: Label, ProgramArguments, RunAtLoad, StartInterval.', parseWith: 'plutil, cat' },
  { category: 'Persistence',  path: '/Library/LaunchAgents/',                 title: 'System LaunchAgents',       description: 'System-wide launch agents — run for all users on login.', notes: 'Requires admin to write. Legitimate: Adobe, Google Update. Suspicious: random strings, /tmp paths, encoded commands.', parseWith: 'plutil, cat' },
  { category: 'Persistence',  path: '/Library/LaunchDaemons/',                title: 'LaunchDaemons',             description: 'System services — run as root at boot, no user session needed.', notes: 'Highest-privilege persistence. Requires root. Look for ProgramArguments pointing to unusual paths or scripts.', parseWith: 'plutil, cat' },
  { category: 'Persistence',  path: '~/Library/Application Support/com.apple.backgroundtaskmanagementagent/', title: 'Background Task Management', description: 'macOS 13+ (Ventura) background task registration database.', notes: 'BTM tracks all login items and launch agents. Query: sfltool dumpbtm. Shows when persistence was registered.', parseWith: 'sfltool dumpbtm' },
  { category: 'Persistence',  path: '~/Library/Preferences/com.apple.loginitems.plist', title: 'Login items (older)', description: 'Apps and scripts set to launch at login (pre-Ventura).', notes: 'Ventura+ uses SMAppService. GUI: System Settings → General → Login Items. Key: SessionItems array.', parseWith: 'plutil' },
  { category: 'Persistence',  path: '/Library/StartupItems/ (deprecated)',    title: 'Startup items (legacy)',    description: 'Pre-launchd startup scripts. Deprecated since Tiger but occasionally seen.', notes: 'No longer runs on modern macOS. Presence = legacy malware or very old system.', parseWith: 'ls, cat' },
  { category: 'Persistence',  path: '~/.config/autostart/ (XDG, via Wine/Linux compat)', title: 'Cron jobs', description: 'User crontab entries.', notes: 'crontab -l (current user). System: /etc/cron* and /private/var/at/tabs/. launchd has mostly replaced cron on macOS.', parseWith: 'crontab -l, cat' },

  // ── File system / MRU ─────────────────────────────────────────────────────
  { category: 'File System / MRU',  path: '~/Library/Preferences/com.apple.finder.plist', title: 'Finder preferences', description: 'Recent folders, sidebar items, view settings, FXRecentFolders key.', notes: 'FXRecentFolders array shows recently accessed directories. RecentMoveAndCopyDestinations shows copy/move destinations.', parseWith: 'plutil, defaults read' },
  { category: 'File System / MRU',  path: '~/Library/Application Support/com.apple.sharedfilelist/', title: 'Shared file lists (SFL2)', description: 'Recent documents and servers per application. Modern replacement for MRU plists.', notes: 'Binary SFL2 format. Parse with: python3 ccl_sfl2_parser.py or sfl2parser. Files: com.apple.LSSharedFileList.RecentDocuments.sfl2, etc.', parseWith: 'sfl2parser, ccl_sfl2_parser' },
  { category: 'File System / MRU',  path: '~/.Trash/',                        title: 'Trash',                     description: 'Deleted files pending permanent deletion. Metadata preserved.', notes: 'Each user has ~/.Trash/. External drives: /Volumes/DriveName/.Trashes/UID/. Deleted file metadata in .DS_Store within Trash.', parseWith: 'ls -la, strings' },
  { category: 'File System / MRU',  path: '/var/folders/*/*/T/',               title: 'Temp files',                description: 'Per-user temporary directory (TMPDIR). Location varies per user session.', notes: 'TMPDIR env var points to actual path. Files deleted on reboot. Malware staging area. Find: echo $TMPDIR', parseWith: 'ls, find' },
  { category: 'File System / MRU',  path: '/.Spotlight-V100/',                 title: 'Spotlight index',           description: 'Full-text search index. Metadata for every indexed file including deleted ones.', notes: 'Records can survive file deletion. mdls <file> shows Spotlight metadata. mdfind -name searches index. Critical for timeline analysis.', parseWith: 'mdls, mdfind, spotlight_parser' },

  // ── Network ───────────────────────────────────────────────────────────────
  { category: 'Network',  path: '/Library/Preferences/SystemConfiguration/com.apple.airport.preferences.plist', title: 'WiFi network history', description: 'All Wi-Fi networks ever joined — SSIDs, BSSIDs, last join time, security type.', notes: 'KnownNetworks dictionary. LastAutoJoinAt timestamp per network. Shows location history indirectly.', parseWith: 'plutil, defaults read' },
  { category: 'Network',  path: '/private/var/db/dhcpclient/leases/',           title: 'DHCP leases',              description: 'DHCP lease history per interface — assigned IPs, server IPs, lease times.', notes: 'One plist per interface. Shows network interfaces active on the system and their IP history.', parseWith: 'plutil' },
  { category: 'Network',  path: '/etc/hosts',                                   title: '/etc/hosts',               description: 'Static host overrides.', notes: 'Malware may modify to redirect domains. Legitimate entries: localhost, broadcasthost. Compare against baseline.', parseWith: 'cat' },

  // ── Execution evidence ────────────────────────────────────────────────────
  { category: 'Execution',  path: '/private/var/folders/*/*/com.apple.dock.iconcache', title: 'Dock icon cache', description: 'Icons for apps that have appeared in the Dock — evidence of execution.', notes: 'Shows apps used by user even if app is deleted. Encoded icon data not human-readable but file presence is meaningful.', parseWith: 'ls, strings' },
  { category: 'Execution',  path: '~/Library/Application Support/Knowledge/',   title: 'KnowledgeC database',      description: 'CoreData database tracking app usage, screen time, device activity.', notes: 'ZOBJECT table in knowledgeC.db. Tracks: app foreground/background, device locked/unlocked, user activity. Timestamps in Apple/Mac Absolute Time (seconds since 2001-01-01). Parse with: KnowledgeCParser or ileapp.', parseWith: 'sqlite3, KnowledgeCParser' },
  { category: 'Execution',  path: '~/Library/Preferences/com.apple.recentitems.plist', title: 'Recent items',    description: 'Recently opened applications, documents, and servers.', notes: 'Bookmark data format. Convert bookmarks: python3 mac_alias.py. Applications array shows recently run apps.', parseWith: 'plutil, mac_alias' },
  { category: 'Execution',  path: '/private/var/db/launchd.db/',                title: 'launchd database',         description: 'launchd job tracking database — registered services and their state.', notes: 'Binary format. Shows what launchd has loaded. Useful for identifying injected or unexpected launch jobs.', parseWith: 'strings, launchctl list' },

  // ── Security features ──────────────────────────────────────────────────────
  { category: 'Security',  path: '/Library/Preferences/com.apple.alf.plist',   title: 'Application Firewall config', description: 'macOS Application Firewall settings — enabled/disabled, allowed apps.', notes: 'globalstate: 0=off, 1=on, 2=block all. allowdownloadsignedenabled allows signed app exceptions.', parseWith: 'plutil' },
  { category: 'Security',  path: '/private/var/db/auth.db',                     title: 'Authorization database',   description: 'Security policy rules for privileged operations.', notes: 'SQLite. Malware may modify to escalate privileges. Baseline: compare against clean macOS install.', parseWith: 'sqlite3' },
  { category: 'Security',  path: '/Library/Apple/System/Library/CoreServices/XProtect.bundle/Contents/Resources/', title: 'XProtect signatures', description: 'Apple built-in malware signatures (Yara-like format).', notes: 'XProtect.yara (Ventura+) contains YARA rules. XProtect.plist (older) has basic signatures. Version in XProtect.meta.plist.', parseWith: 'cat, plutil' },
  { category: 'Security',  path: '/Library/Preferences/com.apple.security.plist', title: 'Gatekeeper config',     description: 'Gatekeeper settings — allow apps from App Store only, App Store + identified developers, or anywhere.', notes: 'assess_key: 0=disabled (anywhere). Disabled Gatekeeper = unsigned code allowed. Common malware pre-req.', parseWith: 'plutil, spctl --status' },
  { category: 'Security',  path: '/Library/Preferences/com.apple.SoftwareUpdate.plist', title: 'Software update history', description: 'Last update check, installed updates, deferred updates.', notes: 'LastSuccessfulDate shows last update. RecommendedUpdates shows pending patches. Useful for patch state assessment.', parseWith: 'plutil' },

  // ── Quarantine / GateKeeper ────────────────────────────────────────────────
  { category: 'Quarantine',  path: '~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV2', title: 'Quarantine events database', description: 'Every file downloaded from internet — URL, date, app that downloaded it.', notes: 'SQLite: LSQuarantineEvent table. Columns: LSQuarantineEventIdentifier, LSQuarantine TimeStamp, LSQuarantineAgentBundleIdentifier, LSQuarantineDataURLString, LSQuarantineOriginURLString. Critical for download history. Survives file deletion.', parseWith: 'sqlite3, quarantine_parser' },

  // ── Cloud / iCloud ────────────────────────────────────────────────────────
  { category: 'Cloud / iCloud',  path: '~/Library/Mobile Documents/',          title: 'iCloud Drive files',        description: 'User iCloud Drive contents synced locally.', notes: 'Subdirectories per app: com~apple~CloudDocs, com~apple~Pages, etc. Files not fully downloaded may show as .icloud stubs.', parseWith: 'ls, find' },
  { category: 'Cloud / iCloud',  path: '~/Library/Application Support/CloudDocs/session/db/', title: 'iCloud session database', description: 'iCloud sync state, file metadata, account info.', notes: 'SQLite databases tracking iCloud sync state. server_items table shows cloud-side file metadata.', parseWith: 'sqlite3' },

  // ── Time Machine ─────────────────────────────────────────────────────────
  { category: 'Time Machine',  path: '/private/var/db/com.apple.TimeMachineStatus.plist', title: 'Time Machine status', description: 'Last backup time, backup destination, backup state.', notes: 'SnapshotDates array shows all local snapshot timestamps. ClientID identifies the machine. Check if backups stopped (possible indicator of attacker disabling TM).', parseWith: 'plutil' },
  { category: 'Time Machine',  path: '/.MobileBackups/ (local snapshots)',      title: 'Time Machine local snapshots', description: 'Local Time Machine snapshots stored on-disk (APFS).', notes: 'List: tmutil listlocalsnapshots /. Mount: tmutil mount <snapshot>. Invaluable for recovering deleted files or prior system state.', parseWith: 'tmutil, mount' },
]

export const macUnifiedLogQueries = [
  { description: 'All sudo usage',           query: 'log show --predicate \'eventMessage contains "sudo"\' --info --last 24h' },
  { description: 'SSH connections',          query: 'log show --predicate \'process == "sshd"\' --info --last 7d' },
  { description: 'Launch agent activity',    query: 'log show --predicate \'subsystem == "com.apple.launchd"\' --info --last 24h' },
  { description: 'Gatekeeper assessments',   query: 'log show --predicate \'subsystem == "com.apple.security.assessment"\' --info' },
  { description: 'XProtect detections',      query: 'log show --predicate \'subsystem == "com.apple.XProtect"\' --info' },
  { description: 'Network connections (kernel)', query: 'log show --predicate \'process == "kernel" and eventMessage contains "ALLOW"\' --info' },
  { description: 'User login/logout',        query: 'log show --predicate \'eventMessage contains "logind"\' --info --last 7d' },
  { description: 'USB device attach',        query: 'log show --predicate \'eventMessage contains "USB" and eventMessage contains "attached"\' --info' },
  { description: 'App launches (Spotlight)', query: 'log show --predicate \'process == "lsd" and eventMessage contains "launch"\' --info --last 24h' },
  { description: 'TCC (privacy) decisions',  query: 'log show --predicate \'subsystem == "com.apple.TCC"\' --info' },
  { description: 'Sandbox violations',       query: 'log show --predicate \'subsystem == "com.apple.sandbox"\' --info --last 24h' },
  { description: 'Crash events',             query: 'log show --predicate \'process == "ReportCrash"\' --info --last 7d' },
  { description: 'Time range query',         query: 'log show --start "2024-01-15 09:00:00" --end "2024-01-15 18:00:00" --info' },
  { description: 'Export to archive',        query: 'log collect --last 7d --output /tmp/case.logarchive' },
]

export const macToolCommands = [
  { tool: 'plutil',          cmd: 'plutil -convert xml1 -o - file.plist',        description: 'Convert binary plist to readable XML' },
  { tool: 'plutil',          cmd: 'plutil -p file.plist',                         description: 'Pretty-print plist contents' },
  { tool: 'defaults',        cmd: 'defaults read com.apple.finder',               description: 'Read plist via defaults domain' },
  { tool: 'mdls',            cmd: 'mdls /path/to/file',                           description: 'Show Spotlight metadata for file' },
  { tool: 'mdfind',          cmd: 'mdfind -name "malware.app" -onlyin ~/',        description: 'Spotlight search — finds files even in unusual locations' },
  { tool: 'log',             cmd: 'log show --predicate \'...\' --info --last 1h',description: 'Query Unified Log (see queries above)' },
  { tool: 'log',             cmd: 'log collect --last 7d --output case.logarchive', description: 'Export full log archive for offline analysis' },
  { tool: 'sqlite3',         cmd: 'sqlite3 knowledgeC.db ".tables"',              description: 'List tables in SQLite artifact' },
  { tool: 'sqlite3',         cmd: 'sqlite3 -csv -header db.sqlite "SELECT * FROM table;"', description: 'Export table to CSV' },
  { tool: 'launchctl',       cmd: 'launchctl list',                               description: 'List all loaded launchd jobs' },
  { tool: 'launchctl',       cmd: 'launchctl print-disabled user/$(id -u)',        description: 'Show disabled launch agents for user' },
  { tool: 'sfltool',         cmd: 'sfltool dumpbtm',                              description: 'Dump Background Task Management (Ventura+) — persistence' },
  { tool: 'codesign',        cmd: 'codesign -dvv /Applications/App.app',          description: 'Verify code signature and entitlements' },
  { tool: 'spctl',           cmd: 'spctl -a -vv /Applications/App.app',           description: 'Assess Gatekeeper policy for app' },
  { tool: 'tmutil',          cmd: 'tmutil listlocalsnapshots /',                  description: 'List local Time Machine snapshots' },
  { tool: 'xattr',           cmd: 'xattr -l file.app',                            description: 'Show extended attributes — com.apple.quarantine reveals download source' },
  { tool: 'xattr',           cmd: 'xattr -p com.apple.quarantine file',           description: 'Read quarantine attribute: 0083;timestamp;app;UUID' },
  { tool: 'find',            cmd: 'find / -name "*.plist" -newer /tmp/ref -mtime -1 2>/dev/null', description: 'Find recently modified plists' },
  { tool: 'fs_usage',        cmd: 'sudo fs_usage -f filesystem -w proc_name',     description: 'Live filesystem events for a process (root)' },
  { tool: 'opensnoop',       cmd: 'sudo opensnoop -p PID',                        description: 'Files opened by process (DTrace-based)' },
]
