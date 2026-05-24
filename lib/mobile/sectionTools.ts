import type { SectionId } from './nav'
import type { SectionTool } from '@/lib/sectionTools'

export const sectionTools: Partial<Record<SectionId, SectionTool[]>> = {
  artifacts: [
    {
      name: 'ALEAPP / iLEAPP / RLEAPP',
      description: 'Open-source Android / iOS / "Returns" parsing toolkits by Alexis Brignoni. Take a logical extraction, output a navigable HTML report of dozens of artifact types. The community-standard free tool for mobile artifact triage.',
      url: 'https://github.com/abrignoni/iLEAPP',
      notes: 'Active development. Plugins are Python; analysts can write their own. RLEAPP handles Returns (Google Takeout, Facebook archives) and similar dumps.',
    },
    {
      name: 'Magnet AXIOM Mobile',
      description: 'Commercial mobile forensics platform — acquires from iOS, Android, and cloud accounts, then normalizes artifacts into a single timeline. Strongest commercial cloud-extraction capability.',
      url: 'https://www.magnetforensics.com/products/magnet-axiom',
      notes: 'Per-license cost is substantial. Worth it for shops handling routine mobile cases; overkill for occasional one-offs.',
    },
  ],
  backups: [
    {
      name: 'libimobiledevice (idevicebackup2)',
      description: 'Open-source iOS protocol library — perform iTunes-style backups from Linux/macOS without iTunes. Standard for headless / scripted iOS acquisition.',
      url: 'https://libimobiledevice.org',
      notes: 'idevicebackup2 backup /dest. Encrypted backups require the password; once set on a device, it cannot be removed without device reset.',
    },
    {
      name: 'iMazing',
      description: 'Commercial iOS management app that doubles as a forensic-friendly backup tool — encrypted iTunes-format backups with a usable browse / extract UI. Often the fastest way to grab a usable backup.',
      url: 'https://imazing.com',
      notes: 'macOS / Windows. Free trial; full features are paid. Backups land in standard iTunes format so other tools can ingest.',
    },
    {
      name: 'iBackup Viewer',
      description: 'Free Mac / Windows viewer for iTunes / iCloud backups — reads SMS, photos, contacts, notes, and Safari history without ingesting into a full forensic tool.',
      url: 'https://www.imactools.com/iphonebackupviewer/',
      notes: 'Good for quick "is the data I need actually in this backup?" checks before spending licensed-tool time.',
    },
  ],
  sqlite: [
    {
      name: 'DB Browser for SQLite',
      description: 'GUI for inspecting and querying SQLite databases. Use when you want to explore an artifact .db file interactively — schema browser, query runner, hex inspection of BLOBs.',
      url: 'https://sqlitebrowser.org',
      notes: 'Free, cross-platform. Won\'t deal with deleted rows / freelist recovery — for that use one of the forensic-grade alternatives below.',
    },
    {
      name: 'sqlite3 CLI',
      description: 'Standard SQLite command-line shell — present on virtually every system. Use for scripted queries and pipeline integration.',
      url: 'https://sqlite.org/cli.html',
      notes: 'sqlite3 db.sqlite ".dump" for full text export. .mode column / .headers on for human-readable output.',
    },
    {
      name: 'sqlite-utils',
      description: 'Python CLI + library for ergonomic SQLite work — bulk inserts, CSV/JSON conversion, schema introspection. Great for analysis pipelines.',
      url: 'https://sqlite-utils.datasette.io',
      notes: 'pip install sqlite-utils. Pairs naturally with Datasette for browsing.',
    },
    {
      name: 'SQLite Forensic Recovery (Cellebrite / undark / sqlparse)',
      description: 'Specialized tools that recover deleted rows from SQLite freelist pages and WAL/journal files — critical for mobile evidence where "deleted" content is often still present.',
      url: 'https://github.com/inflex/undark',
      notes: 'undark is the open option; commercial tools (Cellebrite, AXIOM) do this automatically and more thoroughly.',
    },
  ],
  apps: [
    {
      name: 'AppData parsers in ALEAPP / iLEAPP',
      description: 'For specific apps (WhatsApp, Signal, Telegram, Snap, etc.), iLEAPP / ALEAPP ship dedicated parsers that walk the app\'s SQLite + plist / shared-preferences structure and render readable reports.',
      url: 'https://github.com/abrignoni/iLEAPP',
      notes: 'Parser coverage varies by app and version. Plugin contributions are accepted — write your own if a target app isn\'t covered.',
    },
    {
      name: 'AXIOM / UFED Physical Analyzer',
      description: 'Commercial tools that include hundreds of app parsers with version-specific schema handling. Best coverage for messaging apps, with built-in deleted-content recovery.',
      url: 'https://cellebrite.com/en/physical-analyzer/',
      notes: 'Cellebrite PA reads from UFED dumps; AXIOM\'s app parsers work on AXIOM-acquired data. Both expensive but accurate.',
    },
    {
      name: 'WhatsApp-Key-DB-Extractor (Android)',
      description: 'Open-source toolkit for extracting the WhatsApp msgstore.db.crypt14 key from a rooted or backed-up Android device. Required to decrypt the local message store.',
      url: 'https://github.com/EliteAndroidApps/WhatsApp-Key-DB-Extractor',
      notes: 'Requires root or specific backup conditions. Method changes as WhatsApp evolves their crypto — check version compatibility.',
    },
  ],
  adb: [
    {
      name: 'ADB (Android Debug Bridge)',
      description: 'Android\'s reference tool for shell access, file transfer, package manipulation, and logcat capture over USB or TCP. The first thing you install for any Android work.',
      url: 'https://developer.android.com/tools/adb',
      notes: 'Part of the Android SDK Platform Tools. adb devices to list, adb shell for interactive shell, adb logcat for logs.',
    },
    {
      name: 'scrcpy',
      description: 'Display + control an Android device from a desktop over ADB. Useful for visual workflow / triage when the device is in your possession but you want a keyboard.',
      url: 'https://github.com/Genymobile/scrcpy',
      notes: 'No app install needed on device — uses ADB. Read-only mode available for forensic-safe viewing.',
    },
    {
      name: 'Android Studio / DDMS',
      description: 'Google\'s official IDE. For forensic use the value is Device File Explorer and a richer logcat. Heavy install but the data views are the most app-aware.',
      url: 'https://developer.android.com/studio',
      notes: 'Overkill if you just need ADB. Worth installing when you\'re reverse-engineering an app rather than just extracting one.',
    },
  ],
  ioslog: [
    {
      name: 'sysdiagnose',
      description: 'Apple\'s built-in diagnostic bundle generator — captures unified logs, crash reports, system state, and network configuration. The canonical way to get iOS Unified Log data forensically.',
      url: 'https://support.apple.com/guide/security/about-sysdiagnose-secf78d3aebe/web',
      notes: 'Trigger via Apple Configurator 2, MDM, or button combo on the device. Output is a .tar.gz; logs are in system_logs.logarchive.',
    },
    {
      name: 'log show (macOS)',
      description: 'macOS\'s built-in CLI for parsing the Unified Log format — used for both macOS analysis and iOS-via-sysdiagnose. Filter by process, time, and predicate.',
      url: 'https://developer.apple.com/documentation/os/logging',
      notes: 'log show --predicate \'process == "MobileBackup"\' --info --debug --last 7d. Predicate syntax is NSPredicate.',
    },
    {
      name: 'unifiedlogs (mandiant)',
      description: 'Rust-based parser for Apple Unified Log files — works on Linux/Windows without macOS. Useful when your analyst workstation isn\'t a Mac.',
      url: 'https://github.com/mandiant/macos-UnifiedLogs',
      notes: 'Outputs CSV/JSON for ingestion into other tools. Much faster than running `log show` over large archives.',
    },
  ],
  androidlog: [
    {
      name: 'adb logcat',
      description: 'Reference Android log viewer / dumper — reads from the in-memory kernel + framework log buffers. Live or post-hoc capture; multiple buffers (main, system, radio, events).',
      url: 'https://developer.android.com/tools/logcat',
      notes: 'adb logcat -d -b all > all-buffers.txt for a one-shot dump. Logs evict in seconds-to-minutes; capture early.',
    },
    {
      name: 'pidcat',
      description: 'Colorized, per-app filtered logcat viewer. Filters by package name so you can watch a single app\'s logs without the noise of the rest of the system.',
      url: 'https://github.com/JakeWharton/pidcat',
      notes: 'pidcat com.example.app. Single Python script. Newer maintained forks exist if the original feels stale.',
    },
    {
      name: 'ALEAPP (logs module)',
      description: 'For post-incident: ALEAPP\'s log-parsing plugins normalize logcat + tombstones into a readable HTML report alongside other Android artifacts.',
      url: 'https://github.com/abrignoni/ALEAPP',
      notes: 'Feed it the contents of /data/anr, /data/tombstones, and logcat captures.',
    },
  ],
  cloud: [
    {
      name: 'Elcomsoft Phone Breaker',
      description: 'Commercial cloud-extraction suite — pulls iCloud backups, photos, keychain, and Google account data when given account credentials or tokens. Strongest commercial option for cloud-side mobile evidence.',
      url: 'https://www.elcomsoft.com/eppb.html',
      notes: 'Per-token / per-credential workflow. Apple aggressively breaks third-party access; check feature compatibility against current iOS / iCloud versions.',
    },
    {
      name: 'Cellebrite UFED Cloud',
      description: 'Cellebrite\'s cloud-acquisition module — supports iCloud, Google, social-media account extraction with documented legal-process workflows.',
      url: 'https://cellebrite.com/en/ufed-cloud/',
      notes: 'Tightly integrated with UFED extraction reports. Requires lawful basis (warrant, consent) per Cellebrite\'s usage terms.',
    },
    {
      name: 'Magnet AXIOM Cloud',
      description: 'AXIOM\'s cloud module — competes with Cellebrite UFED Cloud. Strong on Microsoft 365, Google Workspace, and OAuth-token-based account access.',
      url: 'https://www.magnetforensics.com/products/magnet-axiom-cloud/',
      notes: 'Account-keyword search and timeline views work across cloud + on-device artifacts after both are ingested.',
    },
  ],
  appdeep: [
    {
      name: 'WhatsApp Viewer',
      description: 'Specialist tool for decoding WhatsApp msgstore.db (Android) and ChatStorage.sqlite (iOS) — renders chats, media references, contacts in a chat-like UI.',
      url: 'https://github.com/andreas-mausch/whatsapp-viewer',
      notes: 'Open source. Pairs with WhatsApp-Key-DB-Extractor (Android) or an unencrypted iOS backup.',
    },
    {
      name: 'signal-backup-tools',
      description: 'CLI for decrypting and extracting Signal Android backup archives. Required to access Signal\'s encrypted local store.',
      url: 'https://github.com/bepaald/signalbackup-tools',
      notes: 'You need the 30-digit Signal backup passphrase. Without it the backup is effectively inaccessible.',
    },
    {
      name: 'AXIOM / Cellebrite app parsers',
      description: 'Commercial tools have the broadest coverage of app-specific schemas (Telegram, Snap, Discord, Wickr, etc.) including version-aware parsing and deletion recovery.',
      url: 'https://www.magnetforensics.com/products/magnet-axiom/',
      notes: 'Open-source parser coverage trails the commercial tools by ~6–12 months for new app versions.',
    },
  ],
  location: [
    {
      name: 'iLEAPP location modules',
      description: 'Parses iOS Significant Locations, Frequent Locations, Routine, Maps Search History, Find My, and cell-tower caches into readable reports.',
      url: 'https://github.com/abrignoni/iLEAPP',
      notes: 'Coverage updates as iOS schema changes. Cross-reference output against Cellebrite / AXIOM for confirmation on high-stakes cases.',
    },
    {
      name: 'ALEAPP location modules',
      description: 'Android counterpart — parses Google Maps location history, network location cache, and app-specific location data (Uber, Lyft, etc.).',
      url: 'https://github.com/abrignoni/ALEAPP',
      notes: 'Google account-level Maps Timeline data lives in cloud, not on device — request via Takeout or legal process.',
    },
    {
      name: 'AXIOM Magnet AI Insights (Location)',
      description: 'Commercial visual timeline + map view for combined on-device, cloud, and cell-tower location data. Strongest "see all the places this device went" view.',
      url: 'https://www.magnetforensics.com/products/magnet-axiom',
      notes: 'Combines location sources into a single timeline. Useful in reports; verify each plotted point against the raw artifact.',
    },
  ],
  comms: [
    {
      name: 'iMessage parsers (iLEAPP, AXIOM, Cellebrite)',
      description: 'Multiple tools parse iOS SMS/iMessage from sms.db. iLEAPP is free; AXIOM and Cellebrite Physical Analyzer add deletion recovery and richer attachment handling.',
      url: 'https://github.com/abrignoni/iLEAPP',
      notes: 'Schema is well-documented. Manual SQL works too: SELECT * FROM message JOIN handle ON message.handle_id = handle.ROWID.',
    },
    {
      name: 'Android call/SMS parsers',
      description: 'ALEAPP\'s telephony plugins parse Android SMS, MMS, and call logs from mmssms.db and calllog.db. Same content, different schema across Android versions.',
      url: 'https://github.com/abrignoni/ALEAPP',
      notes: 'Telephony tables differ across OEMs (Samsung, Xiaomi modify the schema). Check the OEM-specific column set if a parse looks incomplete.',
    },
    {
      name: 'CDR analysis (i2 Analyst\'s Notebook / NodeXL / Maltego)',
      description: 'For call-detail-record (carrier) data: link-analysis tools that visualize who called whom, when, and how often. Often paired with on-device artifacts to corroborate.',
      url: 'https://www.ibm.com/products/i2-analysts-notebook',
      notes: 'i2 is the law-enforcement standard. NodeXL (free, Excel) is a lighter alternative for small datasets.',
    },
  ],
  malware: [
    {
      name: 'MVT (Mobile Verification Toolkit)',
      description: 'Amnesty International\'s open-source tool for detecting Pegasus, Predator, and other commercial mobile spyware on iOS and Android. The reference free tool for nation-state spyware triage.',
      url: 'https://github.com/mvt-project/mvt',
      notes: 'Requires an iOS backup or Android ADB acquisition. STIX2-formatted IOC files drive detection; Amnesty publishes new IOCs after each Pegasus campaign.',
    },
    {
      name: 'Apple Lockdown Mode + Threat Notifications',
      description: 'Apple\'s native mitigations: Lockdown Mode hardens iOS against targeted attack, and Apple ships Threat Notifications when state-sponsored compromise is detected. Out-of-band signal worth checking.',
      url: 'https://support.apple.com/en-us/105120',
      notes: 'Threat notifications appear in iCloud account settings. Combine with MVT scan for corroboration.',
    },
    {
      name: 'Stalkerware indicators (DCRF / Stalkerware-Indicators)',
      description: 'Curated lists of installed-package indicators for stalkerware on Android. Compare against a target device\'s installed packages list.',
      url: 'https://github.com/AssoEchap/stalkerware-indicators',
      notes: 'Maintained by Coalition Against Stalkerware. Updated periodically as new stalkerware families emerge.',
    },
  ],
}
