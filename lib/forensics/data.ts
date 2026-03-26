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
]
