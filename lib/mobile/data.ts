// ─── Acquisition Methods ─────────────────────────────────────────────────────

export interface AcquisitionMethod {
  name: string
  level: 'LOGICAL' | 'FILESYSTEM' | 'PHYSICAL' | 'CHIP-OFF' | 'JTAG'
  platforms: string[]
  dataAccess: string[]
  limitations: string[]
  tools: string[]
  notes: string
}

export const acquisitionMethods: AcquisitionMethod[] = [
  {
    name: 'Logical acquisition',
    level: 'LOGICAL',
    platforms: ['Android', 'iOS'],
    dataAccess: [
      'Contacts, call logs, SMS/MMS',
      'Photos, videos (camera roll)',
      'App data (if exposed via backup API)',
      'Device info, IMEI, ICCID',
    ],
    limitations: [
      'No deleted data recovery',
      'Apps can opt out of backup (BackupAgent = false)',
      'iOS: encrypted backup required for keychain/health data',
      'Least data of all methods',
    ],
    tools: ['Cellebrite UFED', 'Magnet AXIOM', 'iTunes/Finder backup', 'ADB backup (Android)'],
    notes: 'Fastest and least invasive. Always attempt first. iOS logical via iTunes backup — enable encryption to get keychain, Health, HomeKit data.',
  },
  {
    name: 'File system acquisition',
    level: 'FILESYSTEM',
    platforms: ['Android', 'iOS'],
    dataAccess: [
      'Full /data partition (Android root required)',
      'All app sandboxes and databases',
      'System logs and configuration',
      'Deleted files in unallocated space (limited)',
      'iOS: AFC2 jailbreak or agent-based',
    ],
    limitations: [
      'Android: requires root or exploitable vulnerability',
      'iOS: requires jailbreak or forensic agent (checkm8 devices)',
      'Encryption may block access on locked devices',
      'Not all devices exploitable',
    ],
    tools: ['Cellebrite UFED', 'GrayKey', 'Magnet AXIOM', 'Oxygen Forensic Detective', 'checkra1n + AFC2'],
    notes: 'Gold standard for most investigations. Gets all app databases. iOS checkm8 exploit (A5–A11 chips) enables full FS on many older devices without passcode.',
  },
  {
    name: 'Physical acquisition (full image)',
    level: 'PHYSICAL',
    platforms: ['Android'],
    dataAccess: [
      'Bit-for-bit image of flash storage',
      'All partitions including system, recovery, cache',
      'Deleted data recovery from unallocated',
      'Encryption artifacts',
    ],
    limitations: [
      'Modern Android (7+) with FBE: per-file encryption blocks most data without PIN',
      'Requires root or bootloader unlock on most devices',
      'Physically invasive risk on some hardware',
      'iOS: physical via JTAG/chip-off only — no software physical for modern iOS',
    ],
    tools: ['Cellebrite UFED Physical Analyzer', 'Oxygen Forensic Detective', 'MSAB XRY'],
    notes: 'Older Android devices (pre-FBE, pre-7.0) can yield full plaintext physical images. FBE (File-Based Encryption) since Android 7 means physical ≠ plaintext without credentials.',
  },
  {
    name: 'JTAG acquisition',
    level: 'JTAG',
    platforms: ['Android', 'Feature phones', 'Some iOS'],
    dataAccess: [
      'Raw NAND flash dump',
      'All partitions',
      'Deleted data',
      'Pre-encryption data on older devices',
    ],
    limitations: [
      'Requires physical device disassembly',
      'Device-specific JTAG pinout required',
      'High skill requirement',
      'Risk of device damage',
      'Encrypted data still encrypted without key',
    ],
    tools: ['RIFF Box', 'JTAG Pro', 'Cellebrite UFED (some models)', 'Easy-JTAG'],
    notes: 'Used when software methods fail. Access via JTAG debug port (test points on PCB). Requires identifying correct test points — use GSM-Forum or JTAG pinout databases.',
  },
  {
    name: 'Chip-off',
    level: 'CHIP-OFF',
    platforms: ['Android', 'Feature phones', 'iOS (rare)'],
    dataAccess: [
      'Raw NAND/eMMC dump',
      'Complete storage contents',
      'Deleted data',
    ],
    limitations: [
      'Destructive — device non-functional after',
      'Encrypted data still encrypted',
      'Requires specialized equipment (hot air station, BGA reballing)',
      'High skill — chip damage risk',
      'eMMC vs UFS vs NVMe: different procedures',
    ],
    tools: ['UP-828P programmer', 'Cellebrite UFED (chip-off module)', 'Custom BGA adapter'],
    notes: 'Last resort for severely damaged devices. Modern devices use UFS or NVMe — harder than eMMC. iOS uses custom NVMe with Secure Enclave encryption — chip-off gets encrypted blob only.',
  },
  {
    name: 'Cloud acquisition',
    level: 'LOGICAL',
    platforms: ['Android (Google)', 'iOS (iCloud)'],
    dataAccess: [
      'iCloud: contacts, calendars, notes, Safari, iMessages (if enabled), photos, backups',
      'Google: contacts, Drive, Gmail, location history, Chrome sync, Android backups',
      'Often more data than device (cloud retention longer)',
    ],
    limitations: [
      'Requires credentials or legal process (warrant/subpoena)',
      'End-to-end encrypted data not available to provider (iMessage, Signal)',
      'Advanced Data Protection (iOS 16.2+) encrypts most iCloud data end-to-end',
      'Google Takeout ≠ forensic acquisition — use legal process for metadata',
    ],
    tools: ['Cellebrite UFED Cloud', 'Magnet AXIOM Cloud', 'Oxygen Cloud Extractor', 'Direct legal process to Apple/Google'],
    notes: 'iCloud legal process: Apple Law Enforcement Guidelines at apple.com/legal/privacy/law-enforcement-guidelines-us.pdf. Google: google.com/transparencyreport/userdatarequests/legalprocess/',
  },
]

// ─── Android Artifacts ───────────────────────────────────────────────────────

export interface MobileArtifact {
  category: string
  name: string
  path: string
  format: string
  provides: string
  notes: string
}

export const androidArtifacts: MobileArtifact[] = [
  // Core comms
  { category: 'SMS/MMS',    name: 'MMSSMS database',      path: '/data/data/com.android.providers.telephony/databases/mmssms.db',   format: 'SQLite', provides: 'All SMS/MMS: body, address, date, read status, thread_id', notes: 'Tables: sms, mms, threads. date field = epoch ms. address = phone number. type: 1=received, 2=sent' },
  { category: 'Calls',      name: 'Call log',              path: '/data/data/com.android.providers.contacts/databases/contacts2.db', format: 'SQLite', provides: 'Call history: number, type, date, duration, geocoded_location', notes: 'Table: calls. type: 1=incoming, 2=outgoing, 3=missed, 4=voicemail. date = epoch ms' },
  { category: 'Contacts',   name: 'Contacts database',     path: '/data/data/com.android.providers.contacts/databases/contacts2.db', format: 'SQLite', provides: 'Contacts, phone numbers, emails, accounts, raw_contacts', notes: 'Tables: contacts, raw_contacts, data, mimetypes. account_name shows sync source (Google, etc.)' },
  // Media
  { category: 'Media',      name: 'Media store',           path: '/data/data/com.android.providers.media/databases/external.db',    format: 'SQLite', provides: 'Metadata for all media files: path, size, date_added, date_modified, EXIF', notes: 'Tables: files, images, video, audio. date_added = when indexed, not created. _data = full path' },
  { category: 'Media',      name: 'Camera photos',         path: '/sdcard/DCIM/Camera/',                                            format: 'JPEG/MP4', provides: 'Photos and videos with EXIF: GPS coords, timestamp, device make/model', notes: 'EXIF GPS in DMS — convert to decimal for mapping. datetime_original vs datetime_digitized' },
  // Browser
  { category: 'Browser',    name: 'Chrome history',        path: '/data/data/com.android.chrome/app_chrome/Default/History',        format: 'SQLite', provides: 'URLs, visit count, last_visit_time, typed count', notes: 'Same schema as desktop Chrome. last_visit_time = WebKit epoch (microseconds since 1601-01-01)' },
  { category: 'Browser',    name: 'Chrome cookies',        path: '/data/data/com.android.chrome/app_chrome/Default/Cookies',        format: 'SQLite', provides: 'Session cookies, auth tokens', notes: 'Encrypted on Android 10+ with hardware-backed keystore' },
  // Location
  { category: 'Location',   name: 'Google location history', path: 'Google Takeout / com.google.android.gms cache',                 format: 'JSON/SQLite', provides: 'Timeline of locations, activity type, confidence', notes: 'Most complete via legal process to Google. On-device cache in com.google.android.gms/databases/herrevents.db' },
  { category: 'Location',   name: 'WiFi location cache',   path: '/data/misc/wifi/WifiConfigStore.xml',                             format: 'XML', provides: 'Known WiFi networks: SSID, BSSID, last connected time', notes: 'Proves device was in range of specific APs. WifiConfigStore.xml on Android 10+; wpa_supplicant.conf on older' },
  // System
  { category: 'System',     name: 'Accounts database',     path: '/data/system/accounts_ce.db',                                    format: 'SQLite', provides: 'Google/app accounts linked to device, auth tokens', notes: 'Requires file system access. Table: accounts — shows all linked accounts including third-party' },
  { category: 'System',     name: 'Package list',          path: '/data/system/packages.xml',                                      format: 'XML', provides: 'All installed apps: package name, install time, permissions, UID', notes: 'firstInstallTime and lastUpdateTime in epoch ms. Proves app was installed even if uninstalled (deleted entry)' },
  { category: 'System',     name: 'Usage stats',           path: '/data/system/usagestats/',                                       format: 'Binary', provides: 'App foreground/background usage: package, time, duration', notes: 'Parse with Andriller or ALEAPP. Proves app was actively used, not just installed' },
  { category: 'System',     name: 'Notification log',      path: '/data/system_ce/0/notification_log.db',                          format: 'SQLite', provides: 'Notification history: app, title, text, timestamp', notes: 'Android 11+. Recovers message content from notifications even if app data is encrypted/deleted' },
  { category: 'System',     name: 'Logcat / bugreport',    path: 'adb bugreport  /  /data/log/',                                   format: 'Text', provides: 'System and app log events, crash reports, permission checks', notes: 'adb bugreport exports full log ZIP. Contains tombstones (crash dumps) in /FS/data/tombstones/' },
]

// ─── iOS Artifacts ───────────────────────────────────────────────────────────

export const iosArtifacts: MobileArtifact[] = [
  // Comms
  { category: 'iMessage/SMS', name: 'Messages database',   path: '/private/var/mobile/Library/SMS/sms.db',                          format: 'SQLite', provides: 'iMessage and SMS: text, handle (address), date, is_read, is_sent, service (iMessage vs SMS)', notes: 'Tables: message, handle, chat, chat_message_join. date = Apple epoch (seconds since 2001-01-01). service = "iMessage" or "SMS"' },
  { category: 'Calls',        name: 'Call history',         path: '/private/var/mobile/Library/CallHistoryDB/CallHistory.storedata', format: 'SQLite/CoreData', provides: 'Calls: number, duration, date, call type, answered', notes: 'CoreData format. Table: ZCALLRECORD. ZDATE = Apple epoch. ZCALLTYPE: 1=phone, 8=FaceTime audio, 16=FaceTime video' },
  { category: 'Contacts',     name: 'Address book',         path: '/private/var/mobile/Library/AddressBook/AddressBook.sqlitedb',   format: 'SQLite', provides: 'All contacts: name, numbers, emails, addresses, creation/modification dates', notes: 'Tables: ABPerson, ABMultiValue. CreationDate/ModificationDate = Apple epoch' },
  { category: 'Voicemail',    name: 'Voicemail DB',         path: '/private/var/mobile/Library/Voicemail/voicemail.db',             format: 'SQLite', provides: 'Voicemail metadata: sender, duration, date, callback number', notes: 'Audio files in same directory as .amr files. EXPIRATION_DATE field important for retention' },
  // Media
  { category: 'Media',        name: 'Photos database',      path: '/private/var/mobile/Media/PhotoData/Photos.sqlite',              format: 'SQLite/CoreData', provides: 'All media metadata: filename, GPS, timestamp, album, faces, hidden/deleted status', notes: 'ZASSET table. ZLATITUDE/ZLONGITUDE for GPS. ZTRASHEDSTATE: 0=active, 1=deleted (30-day bin). ZVISIBILITYSTATE for hidden' },
  { category: 'Media',        name: 'Recently Deleted',     path: '/private/var/mobile/Media/PhotoData/Photos.sqlite (ZTRASHEDSTATE=1)', format: 'SQLite', provides: 'Photos/videos in 30-day deleted album with ZTRASHEDDATE', notes: 'Critical for investigations — deleted media retained 30 days. ZTRASHEDDATE = deletion timestamp' },
  // Browser
  { category: 'Browser',      name: 'Safari history',       path: '/private/var/mobile/Library/Safari/History.db',                  format: 'SQLite', provides: 'URLs, visit count, last_visit_time, title', notes: 'Tables: history_items, history_visits. visit_time = Apple epoch. Also check BrowserState.db for open tabs' },
  { category: 'Browser',      name: 'Safari cookies',       path: '/private/var/mobile/Library/Cookies/Cookies.binarycookies',      format: 'Binary', provides: 'Session cookies, auth tokens', notes: 'Proprietary binary format — parse with BinaryCookieReader or AXIOM/Cellebrite' },
  { category: 'Browser',      name: 'Safari open tabs',     path: '/private/var/mobile/Library/Safari/BrowserState.db',             format: 'SQLite', provides: 'Currently/recently open tabs with URLs and titles', notes: 'Persists across reboots. Can recover URLs of tabs open at time of seizure' },
  // Location
  { category: 'Location',     name: 'Significant locations', path: '/private/var/mobile/Library/Caches/com.apple.routined/',        format: 'SQLite/PLIST', provides: 'Frequently visited places with timestamps, visit counts, inferred home/work', notes: 'Local.sqlite and Cache.sqlite in routined directory. Requires file system access. Rich location semantics' },
  { category: 'Location',     name: 'WiFi geolocation cache', path: '/private/var/preferences/SystemConfiguration/com.apple.wifi.known-networks.plist', format: 'PLIST', provides: 'Known WiFi networks with last join time, BSSID, SSID', notes: 'LastJoined and AddedAt timestamps. Proves device connected to specific networks' },
  { category: 'Location',     name: 'Cell tower cache',     path: '/private/var/root/Library/Caches/locationd/consolidated.db',     format: 'SQLite', provides: 'Historical cell tower and WiFi location data', notes: 'iOS 4 "locationgate" database still present on some devices. MCC/MNC/LAC/CID for tower ID' },
  // System
  { category: 'System',       name: 'KnowledgeC',           path: '/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db',  format: 'SQLite', provides: 'App usage, device state, location, battery, screen on/off, audio, Siri queries', notes: 'THE most valuable iOS artifact. ZOBJECT table. domain_identifier = app bundle ID. start_date/end_date = Apple epoch. activity types: /app/inForeground, /device/locked, /location/visit' },
  { category: 'System',       name: 'DataUsage (WIFI/Cell)', path: '/private/var/wireless/Library/Databases/DataUsage.sqlite',     format: 'SQLite', provides: 'Per-app cellular/WiFi data usage with timestamps and bundle ID', notes: 'ZLIVEUSAGE and ZPROCESS tables. Proves app was actively transmitting data at specific times' },
  { category: 'System',       name: 'Biome',                path: '/private/var/mobile/Library/Biome/',                            format: 'Protobuf', provides: 'App activity, Siri suggestions, health, device usage patterns', notes: 'iOS 12+. Protobuf-encoded files. Parse with APOLLO or Cellebrite. Successor to CoreDuet for some data types' },
  { category: 'System',       name: 'Aggregate dictionary', path: '/private/var/mobile/Library/AggregateDictionary/',              format: 'Binary', provides: 'Device usage statistics, app launch counts, feature usage', notes: 'Diagnostic telemetry. Parse with ADParse or Cellebrite' },
  { category: 'System',       name: 'Installed apps (itunesmetadata)', path: '/private/var/mobile/Containers/Bundle/Application/<GUID>/iTunesMetadata.plist', format: 'PLIST', provides: 'App name, bundle ID, purchase date, Apple ID used, version history', notes: 'One plist per app GUID. Purchase date ≠ install date. Use AXIOM/Cellebrite to enumerate all GUIDs' },
]

// ─── iOS Backup Structure ────────────────────────────────────────────────────

export interface BackupType {
  name: string
  location: string
  encrypted: boolean
  contents: string[]
  limitations: string[]
  notes: string
}

export const iosBackupTypes: BackupType[] = [
  {
    name: 'iTunes / Finder backup (unencrypted)',
    location: 'Windows: %APPDATA%\\Apple Computer\\MobileSync\\Backup\\<UDID>\\ | macOS: ~/Library/Application Support/MobileSync/Backup/<UDID>/',
    encrypted: false,
    contents: [
      'SMS/iMessage, call history, contacts, calendar, notes',
      'App data (for apps that allow backup)',
      'Camera roll photos/videos',
      'WiFi passwords (NOT in unencrypted)',
      'Safari bookmarks and history',
      'Voicemail (audio files)',
    ],
    limitations: [
      'No keychain (passwords, auth tokens)',
      'No Health/HomeKit data',
      'No WiFi passwords',
      'Apps with BackupAgent disabled excluded',
    ],
    notes: 'Files stored as SHA1-named blobs in 256 subdirectories. Manifest.db maps SHA1 → original path. Always parse Manifest.db first. Info.plist contains IMEI, serial, backup date.',
  },
  {
    name: 'iTunes / Finder backup (encrypted)',
    location: 'Same as unencrypted — backup password set on device',
    encrypted: true,
    contents: [
      'Everything in unencrypted PLUS:',
      'Keychain (saved passwords, auth tokens, certificates)',
      'Health and HomeKit data',
      'WiFi passwords',
      'Screen time data',
    ],
    limitations: [
      'Requires backup password to decrypt',
      'Password set on device — cannot bypass without brute force',
      'iCloud Keychain not included (stays in iCloud)',
    ],
    notes: 'Always request encrypted backup if legally authorized. Keychain contains credential evidence. Brute force with iPhone Backup Extractor or hashcat ($itunes_backup$*9* hash type).',
  },
  {
    name: 'iCloud backup',
    location: 'Cloud — access via legal process or credentials + Cellebrite/AXIOM Cloud',
    encrypted: false,
    contents: [
      'Most device content (similar to encrypted iTunes)',
      'iMessages (if iCloud Messages enabled)',
      'App data, photos, device settings',
      'Last 5 iCloud backups retained',
    ],
    limitations: [
      'E2E encrypted content unavailable to Apple (if Advanced Data Protection enabled)',
      'Advanced Data Protection (iOS 16.2+) blocks Apple from providing most data',
      'Requires legal process or account credentials',
      'iCloud Photos ≠ iCloud Backup — separate request',
    ],
    notes: 'Apple preserves iCloud backups for 180 days after last backup. Check if target has Advanced Data Protection enabled — fundamentally changes what Apple can provide. Confirm in legal process.',
  },
  {
    name: 'GrayKey extraction',
    location: 'Local network appliance — outputs to case folder on connected system',
    encrypted: false,
    contents: [
      'Full file system image (on supported devices)',
      'Decrypted keychain',
      'All app databases',
      'KnowledgeC, Biome, significant locations',
      'Partial extraction on unsupported devices',
    ],
    limitations: [
      'Requires physical device access',
      'USB Restricted Mode blocks if device locked >1hr (disable in settings before seizure)',
      'Not all iOS versions/devices supported — check Grayshift compatibility matrix',
      'BFU (Before First Unlock) state severely limits access',
    ],
    notes: 'AFU (After First Unlock) state critical — device must have been unlocked at least once since boot. BFU = encryption keys not derived = minimal data. Airplane mode immediately on seizure to prevent remote wipe.',
  },
]

// ─── SQLite Databases of Interest ───────────────────────────────────────────

export interface SQLiteDB {
  platform: 'Android' | 'iOS' | 'Both'
  name: string
  path: string
  keyTables: { table: string; keyColumns: string; notes: string }[]
  forensicValue: string
}

export const sqliteDatabases: SQLiteDB[] = [
  {
    platform: 'iOS',
    name: 'sms.db',
    path: '/private/var/mobile/Library/SMS/sms.db',
    keyTables: [
      { table: 'message', keyColumns: 'ROWID, text, handle_id, date, is_sent, is_read, service', notes: 'date = Apple epoch (sec since 2001-01-01). service: "iMessage" or "SMS"' },
      { table: 'handle', keyColumns: 'ROWID, id, service, uncanonicalized_id', notes: 'id = phone number or email. JOIN message.handle_id = handle.ROWID' },
      { table: 'chat', keyColumns: 'ROWID, chat_identifier, display_name, group_id', notes: 'Group chats have display_name. chat_identifier = group ID or phone/email' },
      { table: 'attachment', keyColumns: 'ROWID, filename, mime_type, transfer_state', notes: 'filename = path to file in /var/mobile/Library/SMS/Attachments/' },
    ],
    forensicValue: 'Complete iMessage and SMS history including group chats, attachments, and read receipts',
  },
  {
    platform: 'iOS',
    name: 'knowledgeC.db',
    path: '/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db',
    keyTables: [
      { table: 'ZOBJECT', keyColumns: 'ZSTREAMNAME, ZVALUESTRING, ZSTARTDATE, ZENDDATE, ZSECONDSFROMGMT', notes: 'ZSTREAMNAME = activity type. ZSTARTDATE/ZENDDATE = Apple epoch. Convert: epoch + 978307200 = Unix time' },
    ],
    forensicValue: 'App foreground/background times, device lock/unlock, audio playback, location visits, Siri queries — most valuable iOS timeline artifact',
  },
  {
    platform: 'Android',
    name: 'mmssms.db',
    path: '/data/data/com.android.providers.telephony/databases/mmssms.db',
    keyTables: [
      { table: 'sms', keyColumns: 'address, date, body, type, read, thread_id', notes: 'date = epoch ms. type: 1=inbox, 2=sent, 3=draft, 4=outbox. address = phone number' },
      { table: 'threads', keyColumns: 'ROWID, date, message_count, recipient_ids, snippet', notes: 'thread_id links to sms/mms tables. recipient_ids space-separated' },
      { table: 'mms', keyColumns: 'ROWID, date, msg_box, thread_id, sub, read', notes: 'MMS metadata. JOIN with part table for media attachments' },
      { table: 'part', keyColumns: 'mid, seq, ct, name, _data', notes: '_data = path to attachment file. ct = MIME type. mid = mms ROWID' },
    ],
    forensicValue: 'All SMS/MMS messages with threading, timestamps, and attachment paths',
  },
  {
    platform: 'Android',
    name: 'contacts2.db',
    path: '/data/data/com.android.providers.contacts/databases/contacts2.db',
    keyTables: [
      { table: 'raw_contacts', keyColumns: 'ROWID, display_name, account_name, account_type, last_time_contacted', notes: 'account_name = source (Google account, phone, etc.). last_time_contacted = epoch ms' },
      { table: 'data', keyColumns: 'raw_contact_id, mimetype_id, data1, data2, data3', notes: 'Polymorphic table. data1 varies by mimetype: phone=number, email=address, name=display_name' },
      { table: 'calls', keyColumns: 'number, date, duration, type, geocoded_location', notes: 'Call log. type: 1=incoming, 2=outgoing, 3=missed. date = epoch ms. duration in seconds' },
    ],
    forensicValue: 'Contacts with account sources and complete call log with geolocation data',
  },
  {
    platform: 'Both',
    name: 'Chrome History (mobile)',
    path: 'Android: /data/data/com.android.chrome/app_chrome/Default/History | iOS: /private/var/mobile/Containers/Data/Application/<GUID>/Library/Application Support/Google/Chrome/Default/History',
    keyTables: [
      { table: 'urls', keyColumns: 'url, title, visit_count, last_visit_time, typed_count', notes: 'last_visit_time = WebKit epoch (µs since 1601-01-01). Convert: (t/1000000) - 11644473600 = Unix' },
      { table: 'visits', keyColumns: 'url, visit_time, from_visit, transition', notes: 'Each visit record. transition type reveals how page was reached (link, typed, redirect)' },
      { table: 'downloads', keyColumns: 'current_path, target_path, start_time, end_time, url_chain', notes: 'Download history with source URL and save path' },
    ],
    forensicValue: 'Full browsing history with visit frequency, typed URLs, and download history',
  },
  {
    platform: 'iOS',
    name: 'DataUsage.sqlite',
    path: '/private/var/wireless/Library/Databases/DataUsage.sqlite',
    keyTables: [
      { table: 'ZPROCESS', keyColumns: 'ZBUNDLENAME, ZPROCNAME, ZFIRSTTIMESTAMP, ZTIMESTAMP', notes: 'App identifiers. ZBUNDLENAME = bundle ID (e.g. com.apple.MobileSMS)' },
      { table: 'ZLIVEUSAGE', keyColumns: 'ZHASWIFI, ZHASCELLULAR, ZWIFIIN, ZWIFIOUT, ZCELLULARIN, ZCELLULAROUT, ZTIMESTAMP, ZPROCESS', notes: 'Data usage per app per session. Proves app was transmitting data at specific timestamp' },
    ],
    forensicValue: 'Proves specific apps were actively sending/receiving data — useful for proving app use when app data is encrypted',
  },
]

// ─── App Artifact Paths ──────────────────────────────────────────────────────

export interface AppArtifact {
  app: string
  platform: 'Android' | 'iOS' | 'Both'
  bundleId: string
  artifacts: { name: string; path: string; provides: string }[]
  notes: string
  encryptionStatus: 'PLAINTEXT' | 'ENCRYPTED' | 'PARTIAL'
}

export const appArtifacts: AppArtifact[] = [
  {
    app: 'WhatsApp',
    platform: 'Both',
    bundleId: 'com.whatsapp / net.whatsapp.WhatsApp',
    encryptionStatus: 'ENCRYPTED',
    artifacts: [
      { name: 'Messages DB (Android)', path: '/data/data/com.whatsapp/databases/msgstore.db', provides: 'All messages, group chats, media references, timestamps, read receipts' },
      { name: 'Messages DB (iOS)',     path: '/private/var/mobile/Containers/Shared/AppGroup/<GUID>/ChatStorage.sqlite', provides: 'Same as Android — ZWAMESSAGE table' },
      { name: 'Contacts (Android)',    path: '/data/data/com.whatsapp/databases/wa.db', provides: 'WhatsApp contacts with phone numbers and display names' },
      { name: 'Media (Android)',       path: '/sdcard/WhatsApp/Media/', provides: 'Received images, videos, voice notes, documents' },
      { name: 'Key file (Android)',    path: '/data/data/com.whatsapp/files/key', provides: 'Local encryption key for msgstore.db — required to decrypt backup' },
    ],
    notes: 'msgstore.db encrypted with locally stored key on Android. WhatsApp backups (.crypt15) encrypted — need key file from /data/data/com.whatsapp/files/key. Tool: WhatsApp Viewer or AXIOM. iOS via full FS or iTunes backup.',
  },
  {
    app: 'Signal',
    platform: 'Both',
    bundleId: 'org.thoughtcrime.securesms / org.whispersystems.signal',
    encryptionStatus: 'ENCRYPTED',
    artifacts: [
      { name: 'Messages DB (Android)', path: '/data/data/org.thoughtcrime.securesms/databases/signal.db', provides: 'Messages, threads, attachments — encrypted with SQLCipher' },
      { name: 'Messages DB (iOS)',     path: '/private/var/mobile/Containers/Data/Application/<GUID>/Documents/grdb/signal.sqlite', provides: 'SQLCipher encrypted database' },
      { name: 'Attachments (Android)',  path: '/data/data/org.thoughtcrime.securesms/app_parts/', provides: 'Encrypted attachment files' },
    ],
    notes: 'SQLCipher encrypted — key derived from PIN + hardware. Cannot decrypt without PIN unless Note to Self message or backup passphrase. iOS disappearing messages leave no trace. Android: check notification_log.db for content fragments.',
  },
  {
    app: 'Telegram',
    platform: 'Both',
    bundleId: 'org.telegram.messenger / ph.telegra.Telegraph',
    encryptionStatus: 'PARTIAL',
    artifacts: [
      { name: 'Messages DB (Android)', path: '/data/data/org.telegram.messenger/files/cache4.db', provides: 'Regular chat messages, group chats, channels (NOT secret chats)' },
      { name: 'Messages DB (iOS)',     path: '/private/var/mobile/Containers/Data/Application/<GUID>/Documents/postbox.db', provides: 'Same as Android — regular chats only' },
      { name: 'Media cache',           path: '/data/data/org.telegram.messenger/cache/', provides: 'Cached images and videos' },
    ],
    notes: 'Regular chats stored locally unencrypted (server-client encrypted in transit only). Secret chats: E2E encrypted, no server copy, device-only. Secret chat messages NOT in local DB. Check cache for media fragments.',
  },
  {
    app: 'Snapchat',
    platform: 'Both',
    bundleId: 'com.snapchat.android / com.toyopagroup.picaboo',
    encryptionStatus: 'ENCRYPTED',
    artifacts: [
      { name: 'Main DB (Android)',  path: '/data/data/com.snapchat.android/databases/main.db', provides: 'Friends list, story views, conversation metadata (NOT message content)' },
      { name: 'arroyo.db (Android)', path: '/data/data/com.snapchat.android/databases/arroyo.db', provides: 'Conversation history with timestamps — message content limited' },
      { name: 'Memories',          path: '/sdcard/Android/data/com.snapchat.android/files/', provides: 'Saved snaps and stories (if saved by user)' },
    ],
    notes: 'Snaps deleted from server after view by design. Saved to Memories = cloud copy retrievable via legal process. arroyo.db has conversation metadata. Check recents/notification DB for message content fragments.',
  },
  {
    app: 'Facebook Messenger',
    platform: 'Both',
    bundleId: 'com.facebook.orca / com.facebook.Messenger',
    encryptionStatus: 'PARTIAL',
    artifacts: [
      { name: 'Threads DB (Android)', path: '/data/data/com.facebook.orca/databases/threads_db2.db', provides: 'Message threads, contacts, group info' },
      { name: 'Messages (Android)',   path: '/data/data/com.facebook.orca/databases/prefs_db', provides: 'User preferences, account info' },
      { name: 'Cache (Android)',      path: '/data/data/com.facebook.orca/cache/', provides: 'Cached media, profile photos' },
    ],
    notes: 'Standard chats: plaintext in local DB. End-to-end encrypted chats (since 2023 default): limited local storage. Legal process to Meta more reliable than device extraction for full history.',
  },
  {
    app: 'Gmail',
    platform: 'Both',
    bundleId: 'com.google.android.gm / com.google.Gmail',
    encryptionStatus: 'PARTIAL',
    artifacts: [
      { name: 'Mail DB (Android)', path: '/data/data/com.google.android.gm/databases/mailstore.<account>@gmail.com.db', provides: 'Cached emails: subject, from, to, date, body snippet, attachment info' },
      { name: 'Attachments',      path: '/data/data/com.google.android.gm/cache/', provides: 'Locally cached attachment files' },
    ],
    notes: 'Only cached emails stored locally — not full mailbox. Full mailbox via Google legal process or account credentials + AXIOM Cloud. Cache size limited by app settings.',
  },
  {
    app: 'Google Maps / Location',
    platform: 'Android',
    bundleId: 'com.google.android.apps.maps',
    encryptionStatus: 'PARTIAL',
    artifacts: [
      { name: 'Search history',   path: '/data/data/com.google.android.apps.maps/databases/search_history.db', provides: 'Searched locations with timestamps' },
      { name: 'Destination cache', path: '/data/data/com.google.android.apps.maps/databases/', provides: 'Recent destinations, saved places' },
    ],
    notes: 'Most location data in Google account (Timeline) — request via legal process. On-device cache limited. Full timeline via Google Takeout or legal process to Google.',
  },
  {
    app: 'TikTok',
    platform: 'Both',
    bundleId: 'com.zhiliaoapp.musically / com.zhiliaoapp.musically',
    encryptionStatus: 'ENCRYPTED',
    artifacts: [
      { name: 'Main DB (Android)', path: '/data/data/com.zhiliaoapp.musically/databases/', provides: 'Account info, viewed content metadata, DM metadata' },
      { name: 'Cache', path: '/data/data/com.zhiliaoapp.musically/cache/', provides: 'Cached video fragments, thumbnails' },
    ],
    notes: 'Heavily encrypted local storage. Most evidence via legal process to ByteDance. DM content limited on-device. Check notification_log.db for message fragments.',
  },
]

// ─── ADB Command Reference ───────────────────────────────────────────────────

export interface ADBCommand {
  category: string
  cmd: string
  description: string
  notes?: string
}

export const adbCommands: ADBCommand[] = [
  // Setup
  { category: 'Setup', cmd: 'adb devices -l', description: 'List connected devices with transport ID and model', notes: 'Must show "device" state — "unauthorized" means accept prompt on device' },
  { category: 'Setup', cmd: 'adb -s <serial> shell', description: 'Open shell on specific device (use serial from adb devices)' },
  { category: 'Setup', cmd: 'adb kill-server && adb start-server', description: 'Restart ADB server — fixes most connection issues' },
  { category: 'Setup', cmd: 'adb usb', description: 'Switch to USB mode (if in TCP mode)' },
  { category: 'Setup', cmd: 'adb tcpip 5555', description: 'Enable ADB over WiFi (device must be unlocked, USB connected first)' },
  { category: 'Setup', cmd: 'adb connect <ip>:5555', description: 'Connect to device over WiFi after tcpip mode enabled' },
  // Device info
  { category: 'Device Info', cmd: 'adb shell getprop', description: 'Dump all device properties (model, Android version, build, IMEI)' },
  { category: 'Device Info', cmd: 'adb shell getprop ro.product.model', description: 'Device model' },
  { category: 'Device Info', cmd: 'adb shell getprop ro.build.version.release', description: 'Android version' },
  { category: 'Device Info', cmd: 'adb shell getprop gsm.imei', description: 'IMEI (may require root on newer Android)' },
  { category: 'Device Info', cmd: 'adb shell getprop ro.serialno', description: 'Device serial number' },
  { category: 'Device Info', cmd: 'adb shell settings get secure android_id', description: 'Android ID — unique per device/factory reset' },
  { category: 'Device Info', cmd: 'adb shell dumpsys battery', description: 'Battery level, charging state, temperature' },
  { category: 'Device Info', cmd: 'adb shell dumpsys telephony.registry', description: 'Cell network info: MCC, MNC, CID, LAC' },
  // File operations
  { category: 'File Ops', cmd: 'adb pull /sdcard/DCIM/ ./dcim_backup/', description: 'Pull camera photos to local directory' },
  { category: 'File Ops', cmd: 'adb pull /data/data/com.android.chrome/app_chrome/Default/History ./chrome_history.db', description: 'Pull Chrome history DB (requires root)' },
  { category: 'File Ops', cmd: 'adb shell ls /data/data/', description: 'List installed app data directories (requires root)' },
  { category: 'File Ops', cmd: 'adb shell ls -la /sdcard/', description: 'List external storage with permissions and timestamps' },
  { category: 'File Ops', cmd: 'adb shell find /sdcard -name "*.db" 2>/dev/null', description: 'Find all SQLite databases on external storage' },
  { category: 'File Ops', cmd: 'adb shell find /data -name "*.db" 2>/dev/null', description: 'Find all SQLite databases in app data (requires root)' },
  { category: 'File Ops', cmd: 'adb shell cat /proc/partitions', description: 'List storage partitions' },
  // App info
  { category: 'Apps', cmd: 'adb shell pm list packages -f', description: 'List all installed packages with APK paths' },
  { category: 'Apps', cmd: 'adb shell pm list packages -3', description: 'List third-party (user-installed) packages only' },
  { category: 'Apps', cmd: 'adb shell dumpsys package <package.name>', description: 'Detailed package info: version, install time, permissions, data path' },
  { category: 'Apps', cmd: 'adb shell dumpsys usagestats', description: 'App usage statistics — foreground/background times' },
  { category: 'Apps', cmd: 'adb shell pm path <package.name>', description: 'APK file path for a specific package' },
  { category: 'Apps', cmd: 'adb pull $(adb shell pm path <pkg> | cut -d: -f2) ./app.apk', description: 'Extract installed APK to local machine' },
  // Backup
  { category: 'Backup', cmd: 'adb backup -apk -shared -all -f backup.ab', description: 'Full ADB backup (limited on Android 12+ — many apps opt out)' },
  { category: 'Backup', cmd: 'adb backup -noapk -f backup.ab com.whatsapp', description: 'Backup specific app data without APK' },
  { category: 'Backup', cmd: 'java -jar abe.jar unpack backup.ab backup.tar', description: 'Unpack ADB backup to tar (Android Backup Extractor)' },
  // Logs / forensics
  { category: 'Forensics', cmd: 'adb logcat -d > logcat.txt', description: 'Dump current logcat buffer to file (-d = dump and exit)' },
  { category: 'Forensics', cmd: 'adb logcat -b all -d > logcat_all.txt', description: 'Dump all log buffers (main, system, crash, events, radio)' },
  { category: 'Forensics', cmd: 'adb bugreport bugreport.zip', description: 'Full bug report ZIP — includes logs, system state, tombstones' },
  { category: 'Forensics', cmd: 'adb shell dumpsys', description: 'Dump all system service states — huge output, pipe to grep' },
  { category: 'Forensics', cmd: 'adb shell dumpsys activity recents', description: 'Recent tasks / app switcher history' },
  { category: 'Forensics', cmd: 'adb shell dumpsys location', description: 'Location service state, recent location requests by app' },
  { category: 'Forensics', cmd: 'adb shell dumpsys wifi', description: 'WiFi state, scan results, known networks, connection history' },
  { category: 'Forensics', cmd: 'adb shell dumpsys bluetooth_manager', description: 'Bluetooth state and paired devices' },
  { category: 'Forensics', cmd: 'adb shell content query --uri content://sms/', description: 'Query SMS content provider (no root needed on unlocked devices)' },
  { category: 'Forensics', cmd: 'adb shell content query --uri content://call_log/calls/', description: 'Query call log content provider' },
  // Network
  { category: 'Network', cmd: 'adb shell netstat -an', description: 'Active network connections and listening ports' },
  { category: 'Network', cmd: 'adb shell ip addr', description: 'Network interface IP addresses (WiFi, cellular, loopback)' },
  { category: 'Network', cmd: 'adb shell ip route', description: 'Routing table' },
  { category: 'Network', cmd: 'adb shell cat /proc/net/arp', description: 'ARP cache — recently seen MAC/IP pairs' },
]
// ─── iOS Unified Log ─────────────────────────────────────────────────────────

export interface iOSLogQuery {
  category: string
  description: string
  command: string
  ciRelevance: string
  notes: string
}

export const iosLogQueries: iOSLogQuery[] = [
  // Acquisition
  { category: 'Acquisition', description: 'Trigger sysdiagnose on device (generates full log archive)', command: 'Hold Volume Up + Volume Down + Side button for 1.5s (iPhone)\nSettings → Privacy → Analytics → Analytics Data → sysdiagnose_*.gz', ciRelevance: 'Captures all Unified Log entries up to the moment of trigger. Critical to trigger immediately when device is seized — logs overwrite.', notes: 'sysdiagnose produces a .tar.gz containing system_logs.logarchive. Copy via iTunes file sharing or AFC. Do NOT reboot before triggering — reboot clears volatile log buffers.' },
  { category: 'Acquisition', description: 'Collect log archive via idevicesyslog (libimobiledevice)', command: 'idevicesyslog -u <UDID> > device_syslog.txt\nidevicebtlogger -u <UDID> > bt_log.txt', ciRelevance: 'Real-time log streaming — useful during active investigation or when sysdiagnose is not available.', notes: 'Requires device trust. Misses historical logs — only captures from connection time forward. Use sysdiagnose for historical.' },
  { category: 'Acquisition', description: 'Parse logarchive offline (macOS)', command: 'log show --archive /path/to/system_logs.logarchive --info --debug --start "2024-01-01" --end "2024-01-02"\nlog show --archive system_logs.logarchive --predicate \'subsystem == "com.apple.network"\' --info', ciRelevance: 'Offline analysis of seized device log archive without requiring the device.', notes: 'macOS log tool required. logarchive from iOS can be parsed on macOS. UnifiedLogReader (Yogesh Khatri) provides cross-platform parsing.' },
  // App execution
  { category: 'App Execution', description: 'App launches and terminations', command: 'log show --predicate \'process == "SpringBoard" AND (eventMessage CONTAINS "Launching" OR eventMessage CONTAINS "killing")\' --info', ciRelevance: 'Proves which apps were launched and when — equivalent of Windows Prefetch. Timestamps app execution with precision.', notes: 'SpringBoard is the iOS home screen process — manages app lifecycle. FrontBoard and BackBoard also log app state transitions.' },
  { category: 'App Execution', description: 'Process crashes (may reveal exploitation or suspicious tool activity)', command: 'log show --predicate \'process == "ReportCrash" OR subsystem == "com.apple.crashreporter"\' --info', ciRelevance: 'Crash logs identify apps that ran (even if uninstalled after). Crash of a spyware or exploit tool leaves trace.', notes: 'Crash logs also stored at /var/mobile/Library/Logs/CrashReporter/ — check both.' },
  // Network
  { category: 'Network', description: 'Network connections by app (kernel network events)', command: 'log show --predicate \'subsystem == "com.apple.network" AND eventMessage CONTAINS "connect"\' --info', ciRelevance: 'Proves which apps made outbound connections and to which IPs/domains — C2 detection, unauthorized data transmission.', notes: 'Network subsystem logs are verbose — filter by process name for specific app investigation.' },
  { category: 'Network', description: 'DNS resolutions', command: 'log show --predicate \'subsystem == "com.apple.dnssd"\' --info', ciRelevance: 'DNS lookups reveal domains contacted by all apps — useful for C2 domain detection and identifying cloud services used.', notes: 'DNS cache on iOS is per-app sandbox — Unified Log is the primary DNS resolution record.' },
  { category: 'Network', description: 'VPN and network interface changes', command: 'log show --predicate \'subsystem == "com.apple.networkextension"\' --info', ciRelevance: 'VPN connection/disconnection events — identifies use of privacy VPNs that may be hiding traffic.', notes: 'NetworkExtension subsystem logs VPN profile installation, connection state, and traffic routing changes.' },
  // Location
  { category: 'Location', description: 'Location services access by app', command: 'log show --predicate \'subsystem == "com.apple.locationd"\' --info', ciRelevance: 'Identifies which apps accessed location and when — establishes device location timeline corroborated by app activity.', notes: 'locationd logs include authorization changes — app granted/denied location access.' },
  // Security
  { category: 'Security', description: 'Passcode and biometric authentication events', command: 'log show --predicate \'subsystem == "com.apple.SpringBoard" AND eventMessage CONTAINS "passcode"\' --info', ciRelevance: 'Device unlock timestamps establish when device was in use — corroborates other timeline artifacts.', notes: 'Authentication logs also captured in KnowledgeC.db on iOS (mapped as device lock/unlock events).' },
  { category: 'Security', description: 'App permission changes (microphone, camera, contacts)', command: 'log show --predicate \'subsystem == "com.apple.TCC"\' --info', ciRelevance: 'TCC (Transparency Consent and Control) logs show when an app was granted or denied sensitive permissions — microphone/camera grant to unknown app is significant.', notes: 'TCC database also stored at /private/var/mobile/Library/TCC/TCC.db — correlate log events with database state.' },
  { category: 'Security', description: 'Jailbreak and code injection indicators', command: 'log show --predicate \'eventMessage CONTAINS "substrate" OR eventMessage CONTAINS "substitute" OR eventMessage CONTAINS "TweakInject"\' --info', ciRelevance: 'MobileSubstrate, Substitute, and TweakInject are jailbreak frameworks — their presence in logs indicates jailbreak. Relevant for both malware investigation and device integrity assessment.', notes: 'See Mobile Malware Indicators section for comprehensive jailbreak detection.' },
]

// ─── Android Logcat & Tombstones ──────────────────────────────────────────────

export interface AndroidLogEntry {
  category: string
  description: string
  command: string
  outputLocation: string
  ciRelevance: string
  notes: string
}

export const androidLogEntries: AndroidLogEntry[] = [
  { category: 'Logcat acquisition', description: 'Capture all logcat output to file', command: 'adb logcat -d > full_logcat.txt\nadb logcat -d -v long > logcat_verbose.txt\nadb logcat -d -b all > logcat_all_buffers.txt', outputLocation: 'Live capture — not stored persistently on device', ciRelevance: 'Primary real-time log source. Captures app execution, permission events, network activity, crashes.', notes: '-d dumps current buffer and exits. Buffers: main (app logs), system (OS), radio (cellular/WiFi), events (structured events), crash. Default buffer is main+system+crash.' },
  { category: 'Logcat acquisition', description: 'Filter logcat by app package', command: 'adb logcat --pid=$(adb shell pidof com.example.app)\nadb logcat -d | grep -i "com.suspicious.app"\nadb logcat -d *:E  # errors only', outputLocation: 'Live or buffered', ciRelevance: 'Isolate log output for specific suspicious application.', notes: 'Log priority levels: V=Verbose, D=Debug, I=Info, W=Warn, E=Error, F=Fatal, S=Silent. *:E captures all tags at Error level and above.' },
  { category: 'Tombstones', description: 'Pull crash tombstones from device', command: 'adb pull /data/tombstones/\nadb shell ls -la /data/tombstones/\nadb bugreport tombstone_report.zip', outputLocation: '/data/tombstones/tombstone_00 through tombstone_09 (rolling)', ciRelevance: 'Tombstones contain: process name, PID, signal that caused crash, full stack trace at crash time, memory maps, open file descriptors. Prove what was running when a process crashed.', notes: 'Requires root or ADB shell with elevated privileges. bugreport includes tombstones and is accessible without root on unlocked devices.' },
  { category: 'Tombstones', description: 'Analyze tombstone content', command: 'cat /data/tombstones/tombstone_00 | head -100\n# Key fields:\n# pid: <process ID>\n# signal: <crash signal>\n# Abort message: <crash reason>\n# backtrace: <stack frames>', outputLocation: '/data/tombstones/', ciRelevance: 'Stack trace reveals the exact code path that crashed — can identify exploit attempts, suspicious library injection, or malware behavior at time of crash.', notes: 'NDK crashes produce tombstones. Java crashes produce ANR traces. Check /data/anr/traces.txt for application-not-responding traces.' },
  { category: 'Dropbox logs', description: 'Android Dropbox event log (system events, crashes, ANRs)', command: 'adb shell dumpsys dropbox --print\nadb shell dumpsys dropbox --print SYSTEM_TOMBSTONE\nadb shell dumpsys dropbox --print data_app_crash', outputLocation: '/data/system/dropbox/', ciRelevance: 'Dropbox logs persist longer than logcat buffers. Contains historical crash events, system errors, and security events even after app removal.', notes: 'Android Dropbox (not the cloud service) stores system diagnostic events. Entries tagged: system_tombstone, data_app_crash, data_app_anr, system_app_anr, system_server_watchdog.' },
  { category: 'Package events', description: 'App install/uninstall history', command: 'adb logcat -d | grep -i "PackageManager"\nadb shell dumpsys package | grep -A5 "firstInstallTime"\nadb shell pm list packages -f -i  # show installer', outputLocation: 'PackageManager logs + /data/system/packages.xml', ciRelevance: 'firstInstallTime and lastUpdateTime in packages.xml prove when apps were installed. Installer field identifies if app was sideloaded (installer=null) vs Play Store.', notes: 'packages.xml survives factory reset on some devices. Uninstalled apps leave tombstone entries in package history.' },
  { category: 'Permission events', description: 'Runtime permission grants and denials', command: 'adb logcat -d | grep -i "PermissionManager\\|PERMISSION\\|grant"\nadb shell dumpsys package <package> | grep permission\nadb shell appops get <package>', outputLocation: 'Logcat + /data/system/appops.xml', ciRelevance: 'appops.xml records runtime permission operations per app including last access time for microphone, camera, location, contacts, SMS. Proves app accessed sensitive resources.', notes: 'appops (App Operations) is Android\'s permission audit log — more detailed than simple grant/deny. Records timestamps of last sensitive resource access per app.' },
  { category: 'Network events', description: 'Network activity logging', command: 'adb shell cat /proc/net/tcp\nadb shell cat /proc/net/tcp6  # IPv6 connections\nadb logcat -d | grep -i "NetworkMonitor\\|ConnectivityService"\nadb shell dumpsys connectivity', outputLocation: '/proc/net/tcp (live state only)', ciRelevance: '/proc/net/tcp shows live TCP connection state — useful on live device. Logcat ConnectivityService shows network transitions and DNS responses.', notes: '/proc/net/tcp is only current state — not historical. For historical network activity, rely on app-specific logs, DNS cache, and SRUM-equivalent (Android Traffic Stats via dumpsys netstats).' },
  { category: 'Network events', description: 'Per-app network usage statistics', command: 'adb shell dumpsys netstats\nadb shell dumpsys netstats | grep -A10 "iface=wlan0"\nadb shell cat /proc/net/xt_qtaguid/stats  # per-UID network stats', outputLocation: '/data/system/netstats/', ciRelevance: 'Android equivalent of Windows SRUM — per-UID (app) network bytes sent/received. Proves data volume transmitted by specific app over WiFi and cellular.', notes: 'UID maps to app package. Resolve UID: adb shell cat /data/system/packages.xml | grep "uid=<UID>". Persistent stats stored in /data/system/netstats/ — survives across reboots.' },
]

// ─── Cloud Extraction ─────────────────────────────────────────────────────────

export interface CloudExtraction {
  provider: string
  service: string
  whatYouGet: string[]
  whatYouDontGet: string[]
  legalProcess: string
  technicalMethod: string
  retentionPeriod: string
  tools: string[]
  notes: string
}

export const cloudExtractions: CloudExtraction[] = [
  {
    provider: 'Apple / iCloud',
    service: 'iCloud Backup',
    whatYouGet: ['Device backup content: SMS/iMessage, call logs, photos, app data, health data, notes, voicemail', 'Backup metadata: device model, iOS version, last backup date, backup encryption status', 'iCloud Drive files (if synced)', 'iCloud Photos (original resolution)'],
    whatYouDontGet: ['End-to-end encrypted data (Health, Keychain, Screen Time, Home, Siri, Messages with Advanced Data Protection enabled)', 'Data from apps that opted out of iCloud backup', 'Data from devices that never backed up to iCloud', 'Real-time content (only last backup state)'],
    legalProcess: '18 USC 2703 preservation + disclosure. Apple law enforcement guidelines at apple.com/legal/privacy/law-enforcement-guidelines.pdf. Emergency requests available for imminent threat.',
    technicalMethod: 'Legal process to Apple. Or with credentials: iCloud backup extraction via Cellebrite UFED Cloud, Elcomsoft Phone Breaker, MSAB XRY Cloud.',
    retentionPeriod: 'Last backup retained until account closed or backup deleted. Apple holds up to 180 days of deleted account data.',
    tools: ['Elcomsoft Phone Breaker (EPB) — most complete iCloud extraction', 'Cellebrite UFED Cloud', 'MSAB XRY Cloud', 'iMazing (with credentials)'],
    notes: 'Advanced Data Protection (ADP) in iOS 16.2+ encrypts additional iCloud data end-to-end — Apple cannot decrypt even with legal process. Check if ADP is enabled: Settings → [Name] → iCloud → Advanced Data Protection. If ADP enabled, physical device extraction is the only option for protected data categories.',
  },
  {
    provider: 'Apple / iCloud',
    service: 'iCloud Mail / iMessage',
    whatYouGet: ['iCloud Mail content and metadata (if iCloud Mail is used)', 'iMessage content IF device backup is not end-to-end encrypted', 'Message timestamps, participants, delivery status'],
    whatYouDontGet: ['iMessages with E2E encryption (Advanced Data Protection)', 'FaceTime call content (E2E encrypted by design)', 'iMessage content on devices with Messages in iCloud disabled'],
    legalProcess: 'Same 2703 process. iMessage content availability depends on backup encryption configuration.',
    technicalMethod: 'Legal process or credential-based extraction.',
    retentionPeriod: 'iCloud Mail: retained while account active. iMessages: only in device backup — not stored independently on Apple servers unless Messages in iCloud enabled.',
    tools: ['Elcomsoft Phone Breaker', 'Cellebrite Cloud'],
    notes: 'iMessage is E2E encrypted in transit — Apple cannot provide message content that was never backed up to iCloud. If target device is available, physical or logical extraction of the device is more reliable for iMessage recovery than iCloud.',
  },
  {
    provider: 'Google',
    service: 'Google Takeout / Account Data',
    whatYouGet: ['Gmail content and metadata', 'Google Drive files', 'Google Photos', 'Location History (Timeline — extremely detailed GPS with timestamps)', 'Search history', 'YouTube history', 'Android app backup data (selected apps)', 'Chrome history and bookmarks synced via Google account', 'Google Maps saved places and searches', 'Google Pay transaction metadata'],
    whatYouDontGet: ['Real-time location (only historical Timeline data)', 'SMS/MMS (not backed up to Google account by default — depends on default SMS app)', 'Content of Google Chat/Messages if client-side encryption enabled', 'WhatsApp (separate backup — not Google account data)'],
    legalProcess: 'Google law enforcement: google.com/transparencyreport/userdatarequests. ECPA 2703 for US requests. Emergency disclosure process available.',
    technicalMethod: 'Legal process. Or with credentials + account access: Google Takeout export, Cellebrite UFED Cloud, Elcomsoft Cloud eXplorer.',
    retentionPeriod: 'Google retains data as long as account is active. Location History retained per user\'s configured retention period (3 months, 18 months, or until deleted). Deleted account: 2 months typical retention.',
    tools: ['Google Takeout (with credentials)', 'Elcomsoft Cloud eXplorer', 'Cellebrite UFED Cloud', 'MSAB XRY Cloud'],
    notes: 'Google Location History (Timeline) is one of the most forensically valuable cloud artifacts — provides GPS coordinates with timestamps, inferred activity (walking, driving, stationary), and place visits. More accurate than cell tower data. Requires Google account credentials or legal process. Google Maps Timeline can be exported as JSON or KML for mapping.',
  },
  {
    provider: 'Google',
    service: 'Android Backup',
    whatYouGet: ['App data for apps that use Google Backup API', 'Device settings and WiFi passwords', 'SMS messages (if Google Messages used as default SMS app)', 'Call logs (selected backup)'],
    whatYouDontGet: ['App data from apps that opted out of Google Backup (WhatsApp, Signal, banking apps)', 'Photos (separate Google Photos backup)', 'Files not synced to Google Drive'],
    legalProcess: '18 USC 2703 to Google.',
    technicalMethod: 'Legal process or credential-based via Elcomsoft Cloud eXplorer.',
    retentionPeriod: '57 days after last backup.',
    tools: ['Elcomsoft Cloud eXplorer', 'Cellebrite UFED Cloud'],
    notes: 'Android backup completeness is highly variable — depends on which apps opted into Google Backup API. Less reliable than iOS iCloud backup for comprehensive device content. WhatsApp uses separate Google Drive backup — requires Google Drive access separately.',
  },
  {
    provider: 'Samsung',
    service: 'Samsung Cloud',
    whatYouGet: ['Contacts, calendar, memos', 'Samsung Gallery photos/videos', 'Samsung Health data', 'Samsung Internet bookmarks', 'Samsung device settings', 'Selected app data (Samsung apps only)'],
    whatYouDontGet: ['Third-party app data (WhatsApp, Instagram, etc.)', 'SMS/call logs (not included in Samsung Cloud backup by default)', 'Files stored in non-Samsung apps'],
    legalProcess: 'Samsung law enforcement portal. Samsung Cloud data held at regional data centers — jurisdiction depends on region.',
    technicalMethod: 'Legal process to Samsung. Credential-based via Cellebrite UFED Cloud.',
    retentionPeriod: 'Retained while account active. Samsung Cloud backup: deleted 30 days after account closure.',
    tools: ['Cellebrite UFED Cloud', 'MSAB XRY Cloud'],
    notes: 'Samsung Cloud is less complete than iCloud or Google backup. Primary value is Samsung Health data, gallery media, and contacts. For Samsung devices, Google backup typically more valuable. Samsung switched from Samsung Cloud to Microsoft OneDrive for file storage in 2021 — check both.',
  },
  {
    provider: 'WhatsApp',
    service: 'WhatsApp Cloud Backup',
    whatYouGet: ['Message history (if not end-to-end encrypted backup — E2E backup is opt-in)', 'Media files (photos, videos, voice messages)', 'Call logs within WhatsApp'],
    whatYouDontGet: ['Message content if E2E backup enabled (WhatsApp cannot decrypt)', 'Messages deleted before backup', 'Messages from other devices not covered by backup'],
    legalProcess: 'WhatsApp (Meta) legal process: facebook.com/safety/groups/law/guidelines. Limited cooperation — primarily metadata, not content.',
    technicalMethod: 'WhatsApp backups are stored on Google Drive (Android) or iCloud (iOS). Access via Google Drive legal process or iCloud legal process — not WhatsApp directly.',
    retentionPeriod: 'WhatsApp itself: 30 days on servers. Backup retention: determined by Google Drive / iCloud policies.',
    tools: ['Elcomsoft Phone Breaker (iCloud WhatsApp backup)', 'Elcomsoft Cloud eXplorer (Google Drive WhatsApp backup)', 'UFED Physical Analyzer (from device extraction)'],
    notes: 'CRITICAL: E2E encrypted backup (opt-in since 2021) means backup is encrypted with a key only the user holds — iCloud/Google cannot decrypt and legal process to them is useless. If E2E backup is enabled, device extraction is the only option. Check backup encryption status in WhatsApp → Settings → Chats → Chat Backup.',
  },
]

// ─── App-Specific Deep Dives ──────────────────────────────────────────────────

export interface AppDeepDive {
  app: string
  platform: string
  forensicValue: string
  databases: { name: string; path: string; description: string; keyTables: { table: string; columns: string; ciValue: string }[] }[]
  deletionRecovery: string
  encryptionNotes: string
  serverSideRetention: string
  tools: string[]
}

export const appDeepDives: AppDeepDive[] = [
  {
    app: 'WhatsApp',
    platform: 'Android + iOS',
    forensicValue: 'Complete message history, call logs, group membership, contact associations, deleted message recovery from WAL/unallocated space, media metadata.',
    databases: [
      {
        name: 'msgstore.db (Android)',
        path: '/data/data/com.whatsapp/databases/msgstore.db',
        description: 'Primary message database — all chats, groups, messages, and call logs',
        keyTables: [
          { table: 'messages', columns: 'key_id, key_remote_jid, key_from_me, status, data, timestamp, media_url, media_mime_type, media_name, media_size, latitude, longitude', ciValue: 'data column = message text. key_remote_jid = contact JID (phone@s.whatsapp.net). timestamp = Unix ms epoch. status: 0=received, 1=sent, 4=read. Deleted messages may remain in WAL.' },
          { table: 'chat_list', columns: 'key_remote_jid, message_table_id, subject, creation, sort_timestamp', ciValue: 'Lists all chats. subject = group name for group chats. creation = group creation timestamp.' },
          { table: 'group_participants', columns: 'gjid, jid, admin', ciValue: 'Group membership history — who was in which group. admin=1 indicates group admin.' },
          { table: 'call_log', columns: 'call_id, from_me, timestamp, video, duration, call_result', ciValue: 'WhatsApp call records. video=1 for video calls. call_result: 0=missed, 2=answered, 4=rejected.' },
        ],
      },
      {
        name: 'wa.db (Android)',
        path: '/data/data/com.whatsapp/databases/wa.db',
        description: 'Contact and account database',
        keyTables: [
          { table: 'wa_contacts', columns: 'jid, number, display_name, given_name, wa_name, status, is_whatsapp_user', ciValue: 'Maps JIDs to real phone numbers and names. is_whatsapp_user=1 confirms active WhatsApp account for contact.' },
        ],
      },
      {
        name: 'ChatStorage.sqlite (iOS)',
        path: '/var/mobile/Containers/Shared/AppGroup/<UUID>/ChatStorage.sqlite',
        description: 'iOS equivalent of msgstore.db',
        keyTables: [
          { table: 'ZWAMESSAGE', columns: 'ZTEXT, ZFROMJID, ZTOJID, ZMESSAGEDATE, ZISFROMME, ZMEDIAITEM, ZGROUPMEMBER', ciValue: 'ZMESSAGEDATE is Mac Absolute Time (seconds since 2001-01-01). ZTEXT = message content. Add 978307200 to convert to Unix timestamp.' },
          { table: 'ZWACHATSESSION', columns: 'ZCONTACTJID, ZPARTNERNAME, ZLASTMESSAGEDATE', ciValue: 'Chat sessions with contact names as stored in WhatsApp.' },
        ],
      },
    ],
    deletionRecovery: 'SQLite WAL (Write-Ahead Log) — messages deleted from msgstore.db may persist in -wal file until checkpoint. Unallocated SQLite pages may contain deleted message data recoverable with sqlite_dissect or Autopsy SQLite module. iOS: iCloud backup may contain pre-deletion state.',
    encryptionNotes: 'Database at rest is NOT encrypted on Android (accessible with root). iOS database is protected by iOS data protection (Class D — accessible after first unlock). Backup encryption is separate — see Cloud Extraction section.',
    serverSideRetention: 'Messages stored on WhatsApp servers only until delivered (max 30 days for undelivered). End-to-end encrypted — WhatsApp cannot read content. Metadata (who contacted whom, when) retained per Meta privacy policy.',
    tools: ['Cellebrite UFED Physical Analyzer', 'Oxygen Forensic Detective', 'SQLite3 / DB Browser (manual)', 'WhatsApp Viewer (open source)'],
  },
  {
    app: 'Signal',
    platform: 'Android + iOS',
    forensicValue: 'Strongly encrypted — primary forensic value is metadata (who contacted whom, when) rather than content. Device extraction with proper keys is required for content. Note-to-self messages and call logs recoverable.',
    databases: [
      {
        name: 'signal.db (Android)',
        path: '/data/data/org.thoughtcrime.securesms/databases/signal.db',
        description: 'Primary Signal database — encrypted with SQLCipher',
        keyTables: [
          { table: 'sms', columns: 'thread_id, address, body, date, date_sent, type, read, status', ciValue: 'body is PLAINTEXT if database is decrypted. type: 87=incoming, 23=outgoing. date/date_sent are Unix milliseconds.' },
          { table: 'mms', columns: 'thread_id, address, body, date, msg_box, ct_t', ciValue: 'Group messages and media messages. ct_t = content type.' },
          { table: 'thread', columns: 'recipient_id, date, snippet, snippet_type, archived', ciValue: 'Chat thread list. snippet shows preview of last message.' },
          { table: 'recipient', columns: 'id, e164, signal_profile_name, profile_given_name, registered', ciValue: 'Contact/recipient information. e164 = phone number in E.164 format.' },
        ],
      },
    ],
    deletionRecovery: 'Signal note-to-self and sealed sender make recovery harder. Disappearing messages leave no recoverable artifact after expiry. WAL recovery possible if message was deleted before WAL checkpoint. Signal desktop (Electron) stores messages in SQLite at ~/Library/Application Support/Signal/sql/db.sqlite (macOS) — key derivable from Local State file.',
    encryptionNotes: 'Android: SQLCipher encrypted database. Key derived from Signal passphrase or hardware-backed keystore. Root + Cellebrite/GrayKey required for key extraction. iOS: Signal uses iOS Data Protection Class 4 (Protected Until First User Authentication) — GrayKey or AFU (After First Unlock) attack required. Sealed sender metadata: Signal hides sender identity from server — limits server-side metadata collection.',
    serverSideRetention: 'Signal stores: phone number, account creation date, last connection date. No message content, no message metadata, no contact lists on Signal servers. Signal has repeatedly provided this limited data under legal process (see published responses to subpoenas).',
    tools: ['Cellebrite UFED (with key extraction support)', 'GrayKey (iOS physical extraction)', 'Signal Desktop SQLite (unencrypted in some versions)', 'MSAB XRY with chip-off'],
  },
  {
    app: 'Telegram',
    platform: 'Android + iOS',
    forensicValue: 'Regular chats are stored on Telegram servers and accessible to Telegram under legal process. Secret Chats are E2E encrypted device-only. Cloud chats may be recoverable from server with legal process or credential access.',
    databases: [
      {
        name: 'cache4.db (Android)',
        path: '/data/data/org.telegram.messenger/files/cache4.db',
        description: 'Telegram cached message database',
        keyTables: [
          { table: 'messages', columns: 'mid, uid, date, data, out, unread, flags, send_state, has_media', ciValue: 'data column contains serialized TLObject (Telegram MTProto binary) — requires Telegram schema to parse. mid = message ID, uid = dialog ID.' },
          { table: 'dialogs', columns: 'did, date, pts, unread_count, last_mid, folder_id', ciValue: 'Active dialogs list. did = dialog/chat ID. Folder_id: 0=main, 1=archived.' },
          { table: 'users', columns: 'uid, first_name, last_name, phone, access_hash, status', ciValue: 'Contact/user information. phone = verified phone number. access_hash required for API calls.' },
        ],
      },
    ],
    deletionRecovery: 'Cloud chats (non-secret): messages stored on Telegram servers — can be retrieved via account credential access or legal process. Secret Chats: E2E encrypted, device-local only — no server copy. Self-destruct timers leave no artifact. Telegram account can be accessed via credentials on any device — authentication via SMS OTP.',
    encryptionNotes: 'Regular/cloud chats: encrypted in transit and at rest on Telegram servers but Telegram holds the keys. Secret Chats: E2E encrypted (MTProto 2.0) — Telegram cannot decrypt. Database cache on device: Not strongly encrypted — accessible with root/physical extraction.',
    serverSideRetention: 'Telegram stores cloud chat content indefinitely (unless deleted). Regular chats: accessible to Telegram under legal process. Telegram cooperates with legal process for terrorism investigations per their policy; historically very limited cooperation for other cases. Legal process to Telegram B.V. (Netherlands / Dubai).',
    tools: ['Cellebrite UFED', 'Oxygen Forensic Detective', 'Telegram API (with credentials)', 'SQLite3 (manual cache4.db parsing)'],
  },
  {
    app: 'Snapchat',
    platform: 'Android + iOS',
    forensicValue: 'Snaps are designed to be ephemeral but leave significant forensic traces: received snaps cached before viewing, metadata about sender/receiver relationships, story views, Snap Map location data.',
    databases: [
      {
        name: 'main.db (Android)',
        path: '/data/data/com.snapchat.android/databases/main.db',
        description: 'Primary Snapchat database — conversations, stories, friend data',
        keyTables: [
          { table: 'Message_View', columns: 'clientMessageId, senderId, recipientId, contentType, sendTimestampMs, clientTimestamp, serverMessageId', ciValue: 'Message metadata persists even when content is "deleted". senderId/recipientId = Snapchat user IDs. contentType identifies snap type (CHAT, IMAGE, VIDEO).' },
          { table: 'FriendLinkType', columns: 'user_id, display_name, username, direction', ciValue: 'Friend relationships including blocked/deleted friends. direction: FRIEND=mutual, PENDING=not accepted.' },
          { table: 'SnapStore', columns: 'snap_id, sender_id, timestamp, state', ciValue: 'Snap metadata. state: DELIVERED, OPENED, SCREENSHOT. Screenshot detection is logged here.' },
        ],
      },
    ],
    deletionRecovery: 'Snaps cached before opening persist in /data/data/com.snapchat.android/cache/stories/ until viewed or expired. Received snaps may remain in unallocated space. Memories (saved snaps) stored in Snapchat cloud — accessible with credentials. Snap Map location history accessible via credentials.',
    encryptionNotes: 'Content encryption varies by Snapchat version. Older versions stored media with basic XOR or AES — tools like SnapExtract worked on older versions. Newer versions use Keystore-backed encryption on Android making content extraction device/version dependent.',
    serverSideRetention: 'Snapchat server retention: unopened snaps 30 days, group snaps 24 hours after all recipients open. Metadata retained longer. Snapchat responds to valid legal process — law enforcement portal at snap.com/en-US/safety/safety-and-law-enforcement.',
    tools: ['Cellebrite UFED Physical Analyzer', 'Oxygen Forensic Detective', 'SQLite3 (metadata)'],
  },
  {
    app: 'Instagram',
    platform: 'Android + iOS',
    forensicValue: 'Instagram Direct messages, story views, login locations, account activity. Meta legal process covers Instagram. Instagram on-device cache can reveal viewed content and message history.',
    databases: [
      {
        name: 'direct.db (Android)',
        path: '/data/data/com.instagram.android/databases/direct.db',
        description: 'Instagram Direct message database',
        keyTables: [
          { table: 'threads', columns: 'thread_id, thread_type, last_activity_at, has_unread', ciValue: 'Direct message thread list.' },
          { table: 'items', columns: 'item_id, thread_id, user_id, timestamp, item_type, text', ciValue: 'text column contains message content. timestamp is Unix microseconds. item_type: text, media, like, etc.' },
        ],
      },
      {
        name: 'ig_faceplace_db (Android)',
        path: '/data/data/com.instagram.android/databases/ig_faceplace_db',
        description: 'User and account data',
        keyTables: [
          { table: 'users', columns: 'pk, username, full_name, biography, profile_pic_url, follower_count', ciValue: 'Cached user profiles including blocked accounts — reveals who subject interacted with.' },
        ],
      },
    ],
    deletionRecovery: 'Instagram messages stored on Meta servers — accessible with credentials or legal process. On-device cache contains thumbnails and previews of viewed content. Meta provides data export (Settings → Your activity → Download your information) for account holders.',
    encryptionNotes: 'Instagram DMs are not end-to-end encrypted by default. Meta can access content under legal process. E2E encryption for DMs was in limited rollout as of 2023. On-device database accessible with root/physical extraction.',
    serverSideRetention: 'Meta retains Instagram data as long as account is active. Deactivated accounts: data retained 30 days before deletion. Legal process via Meta law enforcement portal: facebook.com/safety/groups/law.',
    tools: ['Cellebrite UFED', 'Oxygen Forensic Detective', 'Meta Account Data Download', 'SQLite3'],
  },
]

// ─── Location Forensics ───────────────────────────────────────────────────────

export interface LocationArtifact {
  name: string
  platform: string
  description: string
  path: string
  granularity: string
  retention: string
  ciRelevance: string
  queries?: { description: string; sql: string }[]
  parseWith: string
  notes: string
}

export const locationArtifacts: LocationArtifact[] = [
  {
    name: 'iOS Significant Locations',
    platform: 'iOS',
    description: 'Apple\'s machine learning-derived list of places the user frequents — home, work, and regularly visited locations. Stored in encrypted CoreData database with precise GPS coordinates, visit counts, arrival/departure times, and inferred location label.',
    path: '/private/var/mobile/Library/Caches/com.apple.routined/Local/Cache.sqlite (device)\n/private/var/mobile/Library/Caches/com.apple.routined/Cloud/CloudCache.sqlite (iCloud-synced)',
    granularity: 'GPS coordinates (lat/lon), arrival/departure timestamps, visit count, inferred label (home/work/gym/etc.)',
    retention: 'Indefinite — machine learning model persists until feature disabled. Typically shows 1–3 years of significant location history.',
    ciRelevance: 'Proves device (and likely owner) was at specific locations on specific dates. Home and work confirmed. Any location labeled as frequent proves habitual presence. Critical for establishing alibi or presence at meeting locations.',
    queries: [
      { description: 'All significant locations with visit times', sql: `SELECT
  ZRTLEARNEDLOCATIONOFINTERESTMO.ZLATITUDE,
  ZRTLEARNEDLOCATIONOFINTERESTMO.ZLONGITUDE,
  ZRTLEARNEDLOCATIONOFINTERESTMO.ZLOCATIONDESCRIPTIONLOCATION,
  datetime(ZRTVISITMO.ZARRIVALDATE + 978307200, 'unixepoch') as ArrivalTime,
  datetime(ZRTVISITMO.ZDEPARTUREDATE + 978307200, 'unixepoch') as DepartureTime
FROM ZRTVISITMO
JOIN ZRTLEARNEDLOCATIONOFINTERESTMO
  ON ZRTVISITMO.ZLOCATIONOFINTEREST = ZRTLEARNEDLOCATIONOFINTERESTMO.Z_PK
ORDER BY ZRTVISITMO.ZARRIVALDATE DESC;` },
    ],
    parseWith: 'iLEAPP (iOS Logs Events and Plists Parser), Cellebrite UFED Physical Analyzer, Buscador VM (OSINT), macOS Maps Significant Locations viewer (Settings → Privacy → Location Services → System Services → Significant Locations)',
    notes: 'Significant Locations data is encrypted on device but decrypted in physical/full-filesystem extraction. iLEAPP processes this automatically. The Cloud version syncs across Apple devices — may be present on iPad/Mac even if iPhone was reset.',
  },
  {
    name: 'iOS KnowledgeC (ZSTRUCTUREDACTIVITY)',
    platform: 'iOS',
    description: 'CoreData database recording app activity, device location at activity time, and activity classification. Contains structured location data embedded in activity records.',
    path: '/private/var/mobile/Library/CoreDuet/Knowledge/knowledgeC.db',
    granularity: 'GPS coordinates embedded in activity records, timestamp precision to seconds',
    retention: 'Rolling window — approximately 1 month of detailed activity data',
    ciRelevance: 'Links app activity to physical location — proves subject was at location X when they used app Y. Combined with message timestamps, places subject at location during communication.',
    queries: [
      { description: 'Location data from structured activity', sql: `SELECT
  datetime(ZOBJECT.ZSTARTDATE + 978307200, 'unixepoch') as StartTime,
  datetime(ZOBJECT.ZENDDATE + 978307200, 'unixepoch') as EndTime,
  ZOBJECT.ZSTREAMNAME,
  ZOBJECT.ZVALUESTRING
FROM ZOBJECT
WHERE ZOBJECT.ZSTREAMNAME = '/location/live'
ORDER BY ZOBJECT.ZSTARTDATE DESC;` },
    ],
    parseWith: 'iLEAPP, Cellebrite UFED, DB Browser for SQLite, KnowledgeCParser',
    notes: 'Timestamps use Apple/Mac Absolute Time (seconds since 2001-01-01). Add 978307200 to convert to Unix. ZSTREAMNAME values: /app/inForeground, /device/isLocked, /location/live, /activity/transportation.',
  },
  {
    name: 'Google Location History (Timeline)',
    platform: 'Android (+ all Google-signed-in devices)',
    description: 'Google\'s comprehensive location history service — records GPS position continuously from all signed-in devices. Includes inferred activities (walking, driving, cycling, on transit), place visits with venue identification, and route reconstruction.',
    path: 'Google Takeout: Takeout/Location History/Records.json\nTakeout/Location History/Semantic Location History/<year>/<year>_<month>.json',
    granularity: 'GPS coordinates every 1–5 minutes when moving, with accuracy radius. Semantic locations include place name and category.',
    retention: 'User-configurable: 3 months, 18 months, or indefinite. Historical data: Google has records dating back to 2009 for long-standing accounts.',
    ciRelevance: 'Most comprehensive location record available for Android users. Proves presence at specific addresses with timestamps and duration. Route reconstruction shows travel between locations. Can correlate with surveillance footage timestamps.',
    queries: [
      { description: 'Parse Timeline JSON with Python', sql: `import json
from datetime import datetime

with open('Records.json') as f:
    data = json.load(f)

for loc in data['locations']:
    ts = datetime.fromtimestamp(int(loc['timestampMs'])/1000)
    lat = loc['latitudeE7'] / 1e7
    lon = loc['longitudeE7'] / 1e7
    acc = loc.get('accuracy', 'N/A')
    print(f"{ts} | {lat:.6f}, {lon:.6f} | acc: {acc}m")` },
    ],
    parseWith: 'Google Takeout export, Elcomsoft Cloud eXplorer, Cellebrite UFED Cloud, Google Timeline viewer (maps.google.com/timeline with credentials), KML import to Google Earth',
    notes: 'latitudeE7/longitudeE7 are coordinates × 1e7 (integer). Semantic Location History JSON is more readable — provides placeVisit and activitySegment records. activitySegment includes transportation mode confidence scores. Legal process to Google produces this data; Google Takeout requires account credentials.',
  },
  {
    name: 'Cell Tower History (CDMA/GSM/LTE)',
    platform: 'Both',
    description: 'Mobile network registration records maintained by carrier — every tower the device registered with, call and SMS metadata, data session records. Obtained via legal process to carrier.',
    path: 'Carrier records (legal process) — not stored on device in accessible form',
    granularity: 'Cell sector level (hundreds of meters to kilometers depending on tower density). Not GPS-precise but establishes general area.',
    retention: 'Carrier-dependent. Typically: CPNI records 2 years, tower registration logs 1–2 years, call detail records (CDR) 1–7 years.',
    ciRelevance: 'Corroborates GPS data. Provides coverage for periods when GPS data is absent. Carrier records are third-party records obtained without device access — independent of what subject deleted from device.',
    queries: [
      { description: 'Cell tower location lookup (OpenCelliD)', sql: `# OpenCelliD API (requires free registration)
curl "https://opencellid.org/cell/get?key=<API_KEY>&mcc=310&mnc=260&lac=<LAC>&cellid=<CID>&format=json"

# Python lookup script
import requests
params = {'key': API_KEY, 'mcc': 310, 'mnc': 260, 'lac': lac, 'cellid': cell_id, 'format': 'json'}
r = requests.get('https://opencellid.org/cell/get', params=params)
data = r.json()
print(f"Tower at: {data['lat']}, {data['lon']} (±{data['range']}m)")` },
    ],
    parseWith: 'Carrier CDR export (Excel/CSV), OpenCelliD for tower location lookup, i2 Analyst\'s Notebook, Maltego, Google Earth KML import',
    notes: 'CDR (Call Detail Records) contain: tower ID (MCC/MNC/LAC/Cell-ID), call start/end times, call duration, number dialed/received. Map tower IDs to coordinates using OpenCelliD or vendor data. Sector/azimuth information narrows location further. Expert witness often required for CDR evidence in court.',
  },
  {
    name: 'WiFi Association History',
    platform: 'Both',
    description: 'Record of WiFi networks the device has connected to — network names (SSIDs), BSSIDs, connection timestamps. Geolocation of BSSIDs via WiGLE or similar provides device location history without GPS.',
    path: 'iOS: /private/var/preferences/SystemConfiguration/com.apple.wifi.plist\nAndroid: /data/misc/wifi/WifiConfigStore.xml (root) or /data/misc/wifi/wpa_supplicant.conf',
    granularity: 'Network-level — precision depends on BSSID geolocation database (typically building/block level)',
    retention: 'iOS: all known networks persisted until manually forgotten. Android: varies by version — up to hundreds of saved networks.',
    ciRelevance: 'Connects device to specific locations via known WiFi networks. A corporate WiFi BSSID in known_networks proves device was physically present in that building. Home/office/hotel networks establish routine location pattern.',
    queries: [
      { description: 'WiGLE BSSID location lookup', sql: `# WiGLE API (requires free account)
curl -u "API_KEY:API_TOKEN" \
  "https://api.wigle.net/api/v2/network/detail?netid=<BSSID>"

# Returns: lat/lon of first/last observation, altitude, country, city` },
    ],
    parseWith: 'iLEAPP (iOS WiFi plist), ALEAPP (Android), Cellebrite UFED, WiGLE API for BSSID geolocation',
    notes: 'iOS WiFi plist includes timestamps of last connection per SSID. Android WifiConfigStore.xml includes saved network credentials (WPA PSK) in addition to metadata. WiGLE has crowdsourced BSSID locations for hundreds of millions of networks — good coverage in urban areas. Wardriving datasets are supplementary source.',
  },
]

// ─── Communication Artifact Correlation ──────────────────────────────────────

export interface CommArtifact {
  type: string
  platform: string
  path: string
  keyFields: { field: string; meaning: string; ciValue: string }[]
  queries?: { description: string; sql: string }[]
  correlateWith: string[]
  notes: string
}

export const commArtifacts: CommArtifact[] = [
  {
    type: 'SMS / MMS (iOS)',
    platform: 'iOS',
    path: '/private/var/mobile/Library/SMS/sms.db',
    keyFields: [
      { field: 'message.text', meaning: 'Message body text', ciValue: 'Content of SMS/MMS. iMessages stored here too (type=3).' },
      { field: 'message.date', meaning: 'Mac Absolute Time (seconds since 2001-01-01)', ciValue: 'Add 978307200 for Unix timestamp. Subtract from 0 for pre-2001 (not applicable for modern devices).' },
      { field: 'message.is_from_me', meaning: '1=sent by device owner, 0=received', ciValue: 'Direction of message — critical for establishing who initiated communication.' },
      { field: 'message.service', meaning: '"SMS" or "iMessage"', ciValue: 'Distinguishes cellular SMS (carrier records exist) from iMessage (E2E encrypted, carrier has no record).' },
      { field: 'handle.id', meaning: 'Phone number or Apple ID of other party', ciValue: 'Links message to identity. Phone number enables cross-reference with call logs and carrier records.' },
    ],
    queries: [
      { description: 'All messages with contact info', sql: `SELECT
  datetime(m.date + 978307200, 'unixepoch') as MessageTime,
  h.id as Contact,
  m.is_from_me as Sent,
  m.service as Service,
  m.text as Content
FROM message m
JOIN handle h ON m.handle_id = h.rowid
ORDER BY m.date DESC;` },
    ],
    correlateWith: ['Call logs (same contact)', 'iMessage attachments (/var/mobile/Library/SMS/Attachments/)', 'Carrier CDR (SMS timestamps match carrier records)', 'iCloud backup (deleted message recovery)'],
    notes: 'sms.db stores both SMS and iMessage in same table — differentiate by service column. Deleted messages may be recoverable from SQLite WAL or unallocated space. iMessage read receipts and typing indicators also logged.',
  },
  {
    type: 'Call Logs (iOS)',
    platform: 'iOS',
    path: '/private/var/mobile/Library/CallHistoryDB/CallHistory.storedata',
    keyFields: [
      { field: 'ZCALLRECORD.ZADDRESS', meaning: 'Phone number of other party', ciValue: 'Contact identifier for cross-referencing with SMS, apps, carrier CDR.' },
      { field: 'ZCALLRECORD.ZDURATION', meaning: 'Call duration in seconds', ciValue: 'Non-zero duration proves call was answered. Zero = missed or declined.' },
      { field: 'ZCALLRECORD.ZDATE', meaning: 'Mac Absolute Time', ciValue: 'Call timestamp. Add 978307200 for Unix.' },
      { field: 'ZCALLRECORD.ZORIGINATED', meaning: '1=outgoing, 0=incoming', ciValue: 'Call direction.' },
      { field: 'ZCALLRECORD.ZCALLTYPE', meaning: '1=cellular, 8=FaceTime audio, 16=FaceTime video', ciValue: 'Identifies communication method — FaceTime calls E2E encrypted but metadata logged here.' },
    ],
    queries: [
      { description: 'All calls sorted by date', sql: `SELECT
  ZADDRESS as Number,
  datetime(ZDATE + 978307200, 'unixepoch') as CallTime,
  ZDURATION as DurationSec,
  ZORIGINATED as Outgoing,
  ZCALLTYPE as Type
FROM ZCALLRECORD
ORDER BY ZDATE DESC;` },
    ],
    correlateWith: ['SMS (same contact)', 'Carrier CDR (call duration/time cross-reference)', 'WhatsApp call_log table (VOIP calls vs cellular)'],
    notes: 'iOS CallHistory stores last 100 calls visible in UI but database may contain more. iCloud syncs call history across Apple devices — same calls may appear on iPad/Mac. FaceTime calls (type 8/16) are E2E encrypted but metadata logged.',
  },
  {
    type: 'Call Logs (Android)',
    platform: 'Android',
    path: '/data/data/com.android.providers.contacts/databases/calllog.db',
    keyFields: [
      { field: 'calls.number', meaning: 'Phone number or identifier', ciValue: 'Contact number. May be normalized — compare with carrier CDR.' },
      { field: 'calls.date', meaning: 'Unix milliseconds', ciValue: 'Call timestamp. Divide by 1000 for Unix seconds.' },
      { field: 'calls.duration', meaning: 'Duration in seconds', ciValue: 'Zero = unanswered. Non-zero = connected.' },
      { field: 'calls.type', meaning: '1=incoming, 2=outgoing, 3=missed, 4=voicemail, 5=rejected, 6=blocked', ciValue: 'Direction and outcome. type=3 missed calls prove the subject was called but did not answer.' },
    ],
    queries: [
      { description: 'Call log with readable timestamps', sql: `SELECT
  number,
  datetime(date/1000, 'unixepoch') as CallTime,
  duration as DurationSec,
  CASE type
    WHEN 1 THEN 'Incoming' WHEN 2 THEN 'Outgoing'
    WHEN 3 THEN 'Missed' WHEN 4 THEN 'Voicemail'
    WHEN 5 THEN 'Rejected' WHEN 6 THEN 'Blocked'
    ELSE 'Unknown' END as CallType
FROM calls
ORDER BY date DESC;` },
    ],
    correlateWith: ['SMS database', 'WhatsApp call_log', 'Carrier CDR'],
    notes: 'Android call log may be spread across multiple databases depending on OEM. Samsung devices use different paths. Some Android versions store call logs in contacts provider.',
  },
  {
    type: 'iMessage metadata (identity linking)',
    platform: 'iOS',
    path: '/private/var/mobile/Library/SMS/sms.db + AddressBook',
    keyFields: [
      { field: 'chat.guid', meaning: 'Unique chat identifier — includes phone number or Apple ID', ciValue: 'Format: SMS;-;<phone> or iMessage;-;<email/phone>. Reveals whether contact uses Apple ID (email) or phone for iMessage.' },
      { field: 'chat_message_join', meaning: 'Links messages to group chats', ciValue: 'Reconstructs group chat membership and participation timeline.' },
      { field: 'message.account_guid', meaning: 'The Apple ID account used to send from this device', ciValue: 'Identifies which Apple ID was active on device for outgoing iMessages.' },
    ],
    queries: [
      { description: 'Linked identities from iMessage chat GUIDs', sql: `SELECT DISTINCT
  c.guid as ChatIdentifier,
  c.display_name as GroupName,
  COUNT(m.rowid) as MessageCount
FROM chat c
LEFT JOIN chat_message_join cmj ON c.rowid = cmj.chat_id
LEFT JOIN message m ON cmj.message_id = m.rowid
GROUP BY c.guid
ORDER BY MessageCount DESC;` },
    ],
    correlateWith: ['handle.id (phone/email mapping)', 'AddressBook contacts', 'iCloud account metadata'],
    notes: 'chat.guid format reveals Apple ID used for iMessage — valuable for identity linking across accounts. A target using email@example.com as Apple ID reveals an alternate identity linkable to other accounts.',
  },
]

// ─── Mobile Malware Indicators ────────────────────────────────────────────────

export interface MobileIOC {
  name: string
  platform: string
  category: string
  indicators: string[]
  detectionCommands: string[]
  forensicArtifacts: string[]
  notes: string
}

export const mobileIOCs: MobileIOC[] = [
  {
    name: 'iOS Jailbreak indicators',
    platform: 'iOS',
    category: 'Device integrity',
    indicators: [
      'Cydia app present (/Applications/Cydia.app)',
      'Sileo, Zebra, or other alternative package managers installed',
      'SSH server running on device (port 22 accessible)',
      '/etc/apt/sources.list.d/ directory exists',
      '/Library/MobileSubstrate/ directory exists',
      '/usr/lib/libsubstrate.dylib present',
      '/usr/lib/substitute-inserter.dylib (Substitute framework)',
      'SBInjectGate or TweakInject in process list',
      'Cydia Substrate hooks visible in loaded dylibs (vmmap output)',
      '/private/var/db/stash/ directory (Cydia file system)',
      'APFS snapshot manipulation indicators in Unified Log',
      '/var/jb/ symlink (rootless jailbreaks like Dopamine/Palera1n)',
    ],
    detectionCommands: [
      'ls /Applications/Cydia.app 2>/dev/null && echo "Cydia found"',
      'ls /var/jb/ 2>/dev/null && echo "Rootless jailbreak path found"',
      'find / -name "*.dylib" | grep -i substrate',
      'ps aux | grep -i "substrate\\|substitute\\|inject"',
      'ls /private/var/lib/cydia 2>/dev/null',
      'cat /etc/fstab  # modified on jailbroken devices',
    ],
    forensicArtifacts: ['Cydia package database: /var/lib/dpkg/status', 'Installed tweaks log', 'Unified Log: MobileSubstrate injection events', 'Crash logs mentioning substrate/substitute', '/etc/hosts modifications (common jailbreak payload)'],
    notes: 'Rootless jailbreaks (iOS 15+) like Dopamine and Palera1n use /var/jb as root. Rootful jailbreaks mount a writable rootfs. Detection via Unified Log is more reliable than filesystem checks — jailbreaks can hide files but Unified Log is harder to sanitize. Jailbreak ≠ malware but significantly reduces security posture and enables stalkerware.',
  },
  {
    name: 'iOS stalkerware / commercial spyware',
    platform: 'iOS',
    category: 'Surveillance software',
    indicators: [
      'Unknown configuration profiles installed (Settings → General → VPN & Device Management)',
      'MDM profile from non-corporate source',
      'Unknown enterprise certificate trusted under Profiles',
      'Elevated battery drain with minimal screen use',
      'Background data usage spikes from unknown processes',
      'Unusual process names in Unified Log crash reports',
      'DNS queries to known spyware domains (Flexispy, mSpy, iKeyMonitor, Pegasus C2)',
      'OCSP stapling requests to unknown certificate authorities',
      'Cydia Impactor or sideloading indicators',
      'Pegasus indicators: unusual Safari/WebKit crash logs, NSO Group known process names',
    ],
    detectionCommands: [
      '# Amnesty International MVT (Mobile Verification Toolkit)',
      'pip install mvt-ios',
      'mvt-ios check-backup --iocs pegasus.stix2 <backup_path>',
      'mvt-ios check-fs --iocs pegasus.stix2 <filesystem_path>',
      '# Check installed profiles',
      'ideviceprovision list  # via libimobiledevice',
    ],
    forensicArtifacts: ['MDM enrollment records', 'Device configuration profile plist', 'Crash logs with spyware process names', 'DataUsage.sqlite (network usage per process)', 'Unified Log with suspicious process activity', 'MVT IOC matches'],
    notes: 'Amnesty International\'s MVT (Mobile Verification Toolkit) is the primary tool for Pegasus and other commercial spyware detection on iOS. Run against backup, filesystem, or sysdiagnose archive. IOC files for Pegasus available from Amnesty GitHub. Commercial stalkerware (mSpy, FlexiSpy) typically requires physical device access or MDM profile installation.',
  },
  {
    name: 'Android root indicators',
    platform: 'Android',
    category: 'Device integrity',
    indicators: [
      'Magisk or SuperSU installed (com.topjohnwu.magisk, eu.chainfire.supersu)',
      '/sbin/.magisk directory present',
      '/data/adb/magisk directory present',
      'su binary present at /system/bin/su, /system/xbin/su, or /sbin/su',
      'Custom recovery (TWRP): /recovery/ partition evidence',
      'ro.build.tags = "test-keys" (custom ROM indicator)',
      'ro.debuggable = 1 (debug builds only)',
      'adb shell id returns uid=0 (root)',
      'SafetyNet/Play Integrity fails (proves device attestation broken)',
      'Xposed Framework: /system/lib/libxposed_art.so, XposedBridge.jar',
    ],
    detectionCommands: [
      'adb shell su -c id  # prompts for root if available',
      'adb shell getprop ro.build.tags',
      'adb shell getprop ro.debuggable',
      'adb shell ls /data/adb/magisk 2>/dev/null',
      'adb shell ls /sbin/.magisk 2>/dev/null',
      'adb shell pm list packages | grep -i "magisk\\|supersu\\|xposed"',
    ],
    forensicArtifacts: ['ro.build.tags in device properties', '/data/adb/magisk modules directory', 'Magisk Manager app database', 'Xposed installer logs', 'ADB root access events in logcat'],
    notes: 'Magisk "hides" root from some detection methods (MagiskHide/Shamiko). Physical extraction bypasses these hiding techniques. ro.build.tags="test-keys" on a consumer device is a strong root/custom ROM indicator. Some Samsung devices with Magisk trip Knox warranty bit (0x1) — Knox counter preserved in /efs/FactoryApp/fused.',
  },
  {
    name: 'Android stalkerware / malicious APK',
    platform: 'Android',
    category: 'Surveillance software',
    indicators: [
      'Apps with RECORD_AUDIO, READ_SMS, ACCESS_FINE_LOCATION, READ_CONTACTS all granted to non-obvious app',
      'App running as device admin (Settings → Device Admin Apps)',
      'Hidden apps (no launcher icon, no app drawer entry)',
      'High background data usage from unknown package',
      'Accessibility service enabled for unknown app',
      'Unknown APK in /data/local/tmp/ (common malware staging path)',
      'Package installed from unknown source (installer=null in packages.xml)',
      'Known stalkerware package names: com.spy.agent, com.flexispy, com.mspy',
      'Certificate pinning bypass (Frida gadget, LSPosed module) in app list',
      'Unusual /proc/<pid>/net/tcp connections from background service',
    ],
    detectionCommands: [
      'adb shell dumpsys devicepolicy  # device admin apps',
      'adb shell settings get secure enabled_accessibility_services',
      'adb shell dumpsys appops | grep -i "RECORD_AUDIO\\|FINE_LOCATION" | grep "ACCESS"',
      'adb shell pm list packages -f -i | grep -v "installer=com.android.vending\\|installer=com.google"',
      'adb shell dumpsys netstats | grep -v "com.google\\|com.android" | head -50',
    ],
    forensicArtifacts: ['packages.xml — sideloaded apps have null installer', 'appops.xml — permission access timestamps', 'Device admin enrollment records', 'Accessibility service database', 'APK file for static analysis'],
    notes: 'Sideloaded apps (installer=null) warrant examination. Static analysis of suspicious APK: extract with apktool, analyze with MobSF. MVT also covers Android: mvt-android check-adb --iocs stalkerware.stix2. Common stalkerware IOCs available from Echap (Coalition Against Stalkerware).',
  },
]

// ─── Anti-Forensics on Mobile ─────────────────────────────────────────────────

export interface MobileAntiForensic {
  technique: string
  platform: string
  description: string
  residualArtifacts: string[]
  detectionMethods: string[]
  notes: string
}

export const mobileAntiForensics: MobileAntiForensic[] = [
  {
    technique: 'Factory reset (Android)',
    platform: 'Android',
    description: 'User-initiated factory reset — wipes user data partition (/data) and sometimes SD card. Does not typically wipe /system. On some devices, does not cryptographic-wipe flash — prior data recoverable from NAND.',
    residualArtifacts: [
      'Google account association still present in activation records (FRP lock)',
      'IMEI/serial number permanently stored in baseband/EFS partition',
      'Some OEMs preserve /efs partition (Samsung: Knox warranty bit, IMEI)',
      'Unwiped NAND pages may contain prior data (requires chip-off)',
      'Prior Google account visible via FRP bypass or Google server records',
      '/persist partition retains some device data across resets (LG, some Qualcomm devices)',
      'Knox security event log survives reset on Samsung devices',
      'Baseband logs may survive in /efs or modem partition',
    ],
    detectionMethods: [
      'FRP (Factory Reset Protection): lock screen asks for previously associated Google account — proves a Google account was tied to device',
      'adb shell getprop ro.serialno — device serial preserved',
      'Chip-off NAND analysis: raw NAND dump may contain prior filesystem data in unallocated blocks',
      'Samsung Knox: adb shell cat /sys/class/sec/sec_nad_balancer/nad_stat — Knox status log',
      'Google legal process: account history shows device association even after reset',
    ],
    notes: 'Android Full Disk Encryption (FDE) or File-Based Encryption (FBE) + factory reset is much more effective anti-forensics — encrypted key is wiped, making prior data irrecoverable without chip-off + known plaintext attack. Modern Android 10+ with FBE makes factory reset forensically effective for user data. Check encryption status: adb shell getprop ro.crypto.state.',
  },
  {
    technique: 'Factory reset (iOS)',
    platform: 'iOS',
    description: 'iOS "Erase All Content and Settings" — cryptographically wipes the per-device encryption key (Effaceable Storage), making all user data irrecoverable. Most forensically complete consumer wipe available.',
    residualArtifacts: [
      'IMEI/UDID preserved in hardware — device identity known',
      'Activation record may show Apple ID that was signed in',
      'iCloud account association visible via Apple legal process (device tied to Apple ID)',
      'MDM enrollment data may survive on supervised devices',
      'Carrier records remain (calls, SMS, data — unaffected by device wipe)',
      'iCloud backup (if exists) preserves prior state — check iCloud before device wipe',
    ],
    detectionMethods: [
      'Activation Lock state: if locked, Apple ID was signed in before wipe',
      'Apple legal process: account history shows device-to-Apple-ID association',
      'Serial number/IMEI lookup: Apple activation server records — shows when device was activated and with which account',
      'Carrier records: completely independent of device state',
    ],
    notes: 'iOS Secure Enclave key destruction is cryptographically sound — user data is genuinely irrecoverable after iOS factory reset on modern devices without a known key. This is why iCloud backup preservation is critical — serve a preservation hold BEFORE the device is wiped. FaceID/TouchID enrollment data also wiped, but enrollment history not forensically recoverable.',
  },
  {
    technique: 'Secure messaging app data wipe',
    platform: 'Both',
    description: 'In-app deletion of message history, disappearing messages, and "delete for everyone" features in messaging apps. Also includes remote wipe via MDM.',
    residualArtifacts: [
      'SQLite WAL/unallocated space: deleted rows may persist until SQLite checkpoint/vacuum',
      'Thumbnails and previews cached separately from main database',
      'Notification remnants in notification database',
      'Metadata in app usage logs (message sent/received timestamp even if content deleted)',
      'iCloud or Google backup made before deletion may contain messages',
      'Signal: note-to-self message may not have disappearing timer — check',
      'WhatsApp: "delete for everyone" leaves tombstone in database with deleted_type flag',
    ],
    detectionMethods: [
      'SQLite WAL analysis: identify -wal file with uncommitted deleted row data',
      'Unallocated space carving: sqlite_dissect or Autopsy SQLite module',
      'AXIOM: automated deleted message recovery from SQLite databases',
      'WhatsApp: SELECT * FROM messages WHERE deleted_type != 0 — tombstones remain',
      'Backup analysis: iCloud/Google backup predating deletion event',
    ],
    notes: 'SQLite WAL (Write-Ahead Log) is the single most valuable anti-forensics countermeasure detection technique on mobile. Apps that delete message rows but have a WAL file leave the deleted content readable until VACUUM is run or WAL is checkpointed. WhatsApp deleted-for-everyone messages leave a tombstone row with message type 0 but deleted_type=5 — proves a message existed and was deleted.',
  },
  {
    technique: 'Screen time / digital wellbeing manipulation',
    platform: 'Both',
    description: 'Use of Screen Time (iOS) or Digital Wellbeing (Android) to hide app usage, or deliberate use of restrictions to prevent forensic tools from working.',
    residualArtifacts: [
      'Screen Time database retains app usage data even if display is restricted',
      'Screen Time passcode history in keychain',
      'Digital Wellbeing database (/data/system/users/0/digitalwellbeing.db) retains all usage',
    ],
    detectionMethods: [
      'iOS: Screen Time data at /private/var/mobile/Library/Application Support/com.apple.ScreenTime/',
      'Android: adb shell dumpsys usagestats',
    ],
    notes: 'Screen Time restriction passcode does not prevent forensic extraction — it only limits what the device user can do. Physical extraction bypasses Screen Time entirely.',
  },
]

// ─── JTAG / Chip-off Workflow ─────────────────────────────────────────────────

export interface JTAGStep {
  phase: string
  step: string
  detail: string
  tools: string[]
  notes: string
  risk: 'LOW' | 'MED' | 'HIGH' | 'DESTRUCTIVE'
}

export const jtagWorkflow: JTAGStep[] = [
  { phase: 'Pre-examination', step: 'Device assessment', detail: 'Document device model, condition, damage. Check for water damage indicators (LCI). Photograph all sides. Verify device is off. Check for encryption status if possible.', tools: ['Camera', 'Device database (GSMArena)', 'Magnification'], risk: 'LOW', notes: 'Document everything before touching. Model-specific JTAG/eMMC port locations vary — consult RIFF Box, Medusa Pro, or JTAG Community wiki for pinouts.' },
  { phase: 'Pre-examination', step: 'Identify access method', detail: 'Determine best extraction method based on device and state: (1) JTAG if JTAG test points accessible, (2) ISP/eMMC if NAND is eMMC type and accessible, (3) Chip-off if device is damaged or other methods fail.', tools: ['JTAG Community database', 'Pinout lookups (riffbox.org)', 'Multimeter'], risk: 'LOW', notes: 'JTAG and ISP/eMMC are non-destructive (preferred). Chip-off is destructive — irreversible. Only proceed to chip-off if device is already non-functional or JTAG/ISP fails.' },
  { phase: 'JTAG', step: 'Locate and prepare JTAG test points', detail: 'Identify JTAG/UART test points (TCK, TMS, TDI, TDO, TRST, GND) from device schematic or community database. Clean oxidation from test points. Solder thin wire (30AWG) to test points.', tools: ['Schematic / JTAG pinout database', 'Soldering station (fine tip, 300°C)', '30AWG wire', 'Flux', 'Microscope'], risk: 'MED', notes: 'Test points are typically 0.3–0.8mm pads. Use flux and fine-tip soldering iron. Bridging adjacent pads will damage the board. For RIFF Box / JTAG PRO: consult supported device list for pre-mapped cables.' },
  { phase: 'JTAG', step: 'Connect JTAG interface', detail: 'Connect soldered wires to JTAG box (RIFF Box, Medusa Pro, Octoplus JTAG). Power device via external bench supply at correct voltage (typically 3.8V for Li-Ion nominal).', tools: ['RIFF Box 2 / Medusa Pro / Octoplus JTAG', 'Bench power supply (0–5V adjustable)', 'Multimeter (verify voltage)'], risk: 'MED', notes: 'Never power device from its own battery during JTAG — battery voltage instability can cause connection drop. Bench supply at 3.7–3.85V for most smartphones. Verify correct voltage before connecting.' },
  { phase: 'JTAG', step: 'Run JTAG extraction', detail: 'Launch JTAG software (RIFF Box JTAG Manager, Medusa Pro Suite). Select device profile. Run memory read — select full eMMC/NAND dump. This produces a raw binary dump.', tools: ['JTAG Manager software', 'Large capacity drive for output'], risk: 'LOW', notes: 'Full extraction may take 2–8 hours depending on storage size. Do not interrupt. Verify dump size matches expected storage. Compute SHA-256 hash immediately after completion.' },
  { phase: 'ISP / eMMC', step: 'ISP (In-System Programming) access', detail: 'ISP bypasses the processor and accesses the eMMC/UFS storage directly via the eMMC command interface. Requires soldering to eMMC pads (CLK, CMD, DAT0-7, VCC, VCCQ, GND).', tools: ['eMMC pads pinout for target device', 'ISP connector / ISP Easy Box / UFI Box', 'Soldering station', 'BGA rework station (for some devices)'], risk: 'MED', notes: 'ISP is faster than JTAG and more reliable. eMMC pads are typically under the battery or on the back of PCB near the eMMC chip. ISP adapters available for common chipsets. UFI Box and Easy-JTAG Plus support ISP for hundreds of chipset combinations.' },
  { phase: 'Chip-off', step: 'Remove NAND chip (DESTRUCTIVE)', detail: 'Heat the PCB with hot air rework station to reflow the BGA solder balls. Remove eMMC/UFS chip. This is irreversible — the chip cannot be resoldered to original board. Perform only on already-damaged devices or as last resort.', tools: ['BGA rework station (hot air)', 'BGA reballing kit', 'Chip clip / vacuum pen', 'Anti-static workspace'], risk: 'DESTRUCTIVE', notes: 'DESTRUCTIVE — only perform if device already non-functional or all other methods exhausted. Chip removal temperature: 200–240°C depending on solder type. Residual solder must be cleaned and chip reballed before reading. Consider sending to specialist lab.' },
  { phase: 'Chip-off', step: 'Reball and read NAND chip', detail: 'Clean residual solder from chip pads. Apply new solder balls (reballing). Mount chip in eMMC reader (Medusa Pro, UFI Box, EASY-JTAG reader). Read raw dump.', tools: ['eMMC reader socket (correct footprint)', 'Reballing stencil for chip package', 'Lead-free solder paste', 'Microscope'], risk: 'HIGH', notes: 'eMMC chip footprints: BGA-153, BGA-169, BGA-221. Match socket to chip. UFS chips require different reader. Raw dump includes entire NAND including firmware, userdata, and any unallocated space.' },
  { phase: 'Post-acquisition', step: 'Parse NAND dump', detail: 'Import raw NAND dump into UFED Physical Analyzer or MSAB XRY. Tools reconstruct filesystem from raw NAND. For Android: identify userdata partition, extract ext4 filesystem. Hash and document all outputs.', tools: ['Cellebrite UFED Physical Analyzer', 'MSAB XRY', 'Oxygen Forensic Detective', 'binwalk (partition identification)', 'dd (partition extraction)'], risk: 'LOW', notes: 'NAND dump may require ECC (Error Correction Code) processing — some NAND controllers use proprietary ECC. Medusa Pro and UFI Box handle ECC for most common chips. Encrypted devices: dump contains encrypted data — decryption key in Secure Enclave (iOS) or KeyMaster (Android) which was NOT extracted.' },
]

// ─── Cellebrite / UFED Reference ─────────────────────────────────────────────

export interface UFEDExtractionType {
  type: string
  description: string
  requiresUnlock: boolean
  dataAccess: string[]
  doesNotAccess: string[]
  toolsRequired: string
  applicableTo: string
  notes: string
}

export const ufedExtractionTypes: UFEDExtractionType[] = [
  {
    type: 'Logical Extraction',
    description: 'Uses the device\'s own data sharing APIs (iTunes backup protocol for iOS, ADB backup/MTP for Android). Device must be unlocked or trusted. Fastest method, least invasive.',
    requiresUnlock: true,
    dataAccess: ['Contacts, SMS, call logs', 'Photos and videos', 'App data for apps that participate in backup', 'Device information', 'Some installed app databases (varies by app)'],
    doesNotAccess: ['Deleted data', 'System files', 'Apps that opt out of backup (Signal, banking apps)', 'Encrypted app databases (keychain-protected)', 'Third-party app data on iOS (most apps)'],
    toolsRequired: 'Cellebrite UFED Touch2 or UFED 4PC, USB cable, device trusted',
    applicableTo: 'Both iOS and Android. Best for: quick triage on unlocked device.',
    notes: 'iOS logical extraction is limited compared to what was possible pre-iOS 10. Most app data now requires iTunes backup (encrypted) or filesystem access. Logical is appropriate when: time is critical, device will be returned, or more invasive methods are not authorized.',
  },
  {
    type: 'Advanced Logical (iTunes Backup)',
    description: 'Creates an iTunes-compatible backup via Apple\'s backup protocol. With encrypted backup (UFED sets backup password), captures keychain data including saved passwords and authentication tokens.',
    requiresUnlock: true,
    dataAccess: ['All logical data PLUS:', 'Keychain items (with encrypted backup)', 'Health data', 'Third-party app databases that participate in backup', 'iCloud accounts and authentication tokens', 'WiFi passwords'],
    doesNotAccess: ['Files/apps excluded from backup', 'Full filesystem', 'Deleted data', 'Data from apps using NSFileProtectionComplete without backup flag'],
    toolsRequired: 'UFED Touch2 / 4PC. Device must be trusted (unlocked, trust dialog accepted).',
    applicableTo: 'iOS primarily. The keychain extraction via encrypted backup is the key differentiator from basic logical.',
    notes: 'Encrypted iTunes backup is significantly more valuable than unencrypted — captures keychain with account credentials and auth tokens. UFED automatically sets and records the backup password. This is typically the first extraction performed on an unlocked iPhone before attempting more invasive methods.',
  },
  {
    type: 'File System Extraction',
    description: 'Direct filesystem access — extracts all accessible files without going through backup API. On iOS, requires agent installation or jailbreak. On Android, requires ADB root or physical access.',
    requiresUnlock: true,
    dataAccess: ['Complete file system accessible to extraction agent', 'All app databases and files', 'System logs and configuration', 'Deleted files in unallocated space (limited)', 'Media files in original format with metadata', 'App sandbox data for all apps'],
    doesNotAccess: ['Files protected by Secure Enclave (iOS) without key', 'Data encrypted at rest below agent privilege level', 'Kernel memory'],
    toolsRequired: 'iOS: UFED with iOS agent (Cellebrite Agent or checkm8-based). Android: UFED with ADB root or rooted device.',
    applicableTo: 'iOS (if Cellebrite agent supported for device/OS version) and Android (rooted). GrayKey also produces filesystem-level extractions.',
    notes: 'iOS filesystem extraction coverage depends on UFED agent support for the specific iOS version. Cellebrite regularly updates for new iOS versions. Check UFED release notes for supported iOS versions. Filesystem extraction is the gold standard for iOS — provides everything backup provides plus more.',
  },
  {
    type: 'Physical Extraction',
    description: 'Raw image of the device storage — bit-for-bit copy of the NAND flash including unallocated space, deleted files, and all partitions. Requires device to be unlocked AND encryption key accessible, or via JTAG/chip-off.',
    requiresUnlock: true,
    dataAccess: ['Everything in filesystem extraction PLUS:', 'Deleted data in unallocated space', 'Database WAL files', 'All device partitions (system, userdata, cache)', 'Cryptographic material if device unlocked', 'Prior SQLite entries in unallocated space'],
    doesNotAccess: ['Data encrypted without key (always encrypted on modern devices)', 'Secure Enclave contents', 'Data wiped with cryptographic erase'],
    toolsRequired: 'UFED Touch2 with physical extraction support, OR JTAG/ISP/chip-off method, OR GrayKey (iOS).',
    applicableTo: 'Older/unlocked Android devices (ADB dd method). iOS: rarely available via UFED for modern devices without checkm8. Primarily via JTAG/chip-off or GrayKey.',
    notes: 'Modern encrypted devices (Android 10+ FBE, iOS 8+) — physical extraction without unlock provides only encrypted data. Physical extraction value = encrypted data unless device was seized in AFU (After First Unlock) state with working exploitation. Physical extraction on older unencrypted Android devices is still very valuable.',
  },
  {
    type: 'Cloud Extraction (UFED Cloud Analyzer)',
    description: 'Extraction of cloud-synced data using credentials, tokens, or legal process integration. Acquires iCloud, Google, Samsung Cloud, and social media content.',
    requiresUnlock: false,
    dataAccess: ['iCloud backup content', 'Google account data (Drive, Gmail, Photos, Location History)', 'Social media content (Facebook, Instagram, Twitter)', 'Samsung Cloud content', 'Cloud-synced contacts and calendars'],
    doesNotAccess: ['End-to-end encrypted cloud data (Signal, WhatsApp E2E backup)', 'Content deleted before extraction', 'Data from accounts not identified/credentialed'],
    toolsRequired: 'UFED Cloud Analyzer (separate license). Credentials or legal process required per provider.',
    applicableTo: 'Any device — cloud extraction is device-independent. Particularly valuable when physical device is unavailable.',
    notes: 'Cloud extraction does not require the physical device — can be performed from any forensic workstation with internet access. Authentication: can use account credentials, SMS/email OTP (with target\'s phone number known), or legal process tokens. Cellebrite Cloud Analyzer supports 70+ services including social media, cloud storage, and email providers.',
  },
]

export const ufedWorkflow = [
  { step: 'Case setup', detail: 'Create new case in UFED Physical Analyzer. Enter case number, examiner name, device description. All extractions link to this case.', cmd: 'UFED PA: File → New Case → enter metadata' },
  { step: 'Connect and identify device', detail: 'Connect via USB. UFED identifies device make/model/OS. Review supported extraction types for this specific device/iOS version combination.', cmd: 'UFED: Extraction → Advanced → identify device → review extraction options' },
  { step: 'Select extraction method', detail: 'Choose extraction type based on device state and authorization. Prefer least invasive that meets investigative needs. Always start with logical/advanced logical.', cmd: 'Order of preference: Physical → File System → Advanced Logical → Logical' },
  { step: 'Run extraction', detail: 'UFED runs extraction — time varies: logical 5–30 min, filesystem 30–120 min, physical 2–8 hours. Do not disconnect during extraction.', cmd: 'Monitor progress bar. Record start/end times for documentation.' },
  { step: 'Hash verification', detail: 'UFED automatically generates MD5 and SHA-256 hashes of extraction. Verify hash is recorded in case file — this is your evidence integrity anchor.', cmd: 'UFED PA: Extraction Details → Hash Values → record both hashes' },
  { step: 'Generate report', detail: 'UFED PA: select artifacts to include. Generate HTML, Excel, or PDF report. Include hash values, examiner info, and extraction parameters.', cmd: 'UFED PA: Report → Select Artifacts → Include Hash → Generate' },
  { step: 'Timeline analysis', detail: 'UFED PA Timeline view correlates all artifact timestamps. Filter by date range for incident window. Export as CSV for further analysis.', cmd: 'UFED PA: Timeline → Date Filter → Export CSV' },
  { step: 'SQLite direct query', detail: 'For artifacts not decoded by UFED: UFED PA → File System → navigate to database → right-click → Open with SQLite Viewer, or extract and query with DB Browser.', cmd: 'Or: extract .tar.gz from UFED, mount filesystem, query with sqlite3' },
]
// ─── Smartwatch Forensics ─────────────────────────────────────────────────────

export interface SmartwatchPlatform {
  name: string
  devices: string
  os: string
  acquisitionMethods: { method: string; description: string; toolSupport: string; notes: string }[]
  artifacts: { category: string; path: string; description: string; ciRelevance: string; format: string }[]
  databases: { name: string; path: string; description: string; keyTables: { table: string; columns: string; ciValue: string }[] }[]
  syncRelationship: string
  encryptionNotes: string
  legalProcess: string
  tools: string[]
  notes: string
}

export const smartwatchPlatforms: SmartwatchPlatform[] = [
  {
    name: 'Apple Watch (watchOS)',
    devices: 'Apple Watch Series 1–9, Ultra, SE — all generations',
    os: 'watchOS 1–10',
    acquisitionMethods: [
      {
        method: 'Paired iPhone extraction',
        description: 'Apple Watch data syncs to paired iPhone and is included in iTunes/iCloud backups. Most Watch data accessible via iPhone backup without touching the Watch.',
        toolSupport: 'Cellebrite UFED, Elcomsoft Phone Breaker, iMazing — any tool that handles iTunes/iCloud backups',
        notes: 'Most forensically practical method. Health data, activity, location, and app data from Watch appear in iPhone backup. Watch must be/have been paired with the iPhone being extracted.',
      },
      {
        method: 'Filesystem extraction via paired iPhone',
        description: 'Full filesystem extraction of iPhone includes Watch-synced data in dedicated Watch backup directories.',
        toolSupport: 'Cellebrite UFED with filesystem extraction, GrayKey',
        notes: 'iPhone filesystem at /private/var/mobile/Library/Backup/ contains Watch-specific backup. More complete than logical backup.',
      },
      {
        method: 'Direct Watch extraction (limited)',
        description: 'Apple Watch itself can be extracted via Cellebrite with the Watch connected directly. Requires watchOS version support and Watch to be unlocked.',
        toolSupport: 'Cellebrite UFED (limited watchOS version support — check current release notes)',
        notes: 'Direct Watch extraction is limited — Cellebrite support for watchOS versions lags behind iOS. Check UFED PA release notes for current supported watchOS versions. Watch must be unlocked (passcode entered or wrist detection active).',
      },
      {
        method: 'iCloud backup (Watch-specific)',
        description: 'Apple Watch has its own iCloud backup separate from iPhone backup. Contains Watch app data, settings, and configuration.',
        toolSupport: 'Elcomsoft Phone Breaker, Cellebrite UFED Cloud',
        notes: 'Separate from iPhone iCloud backup. Check Apple ID account for Watch-specific backup — visible in iCloud settings under Manage Storage. May contain Watch data not in iPhone backup.',
      },
    ],
    artifacts: [
      {
        category: 'Health & Fitness',
        path: 'iPhone backup: Health/ (CoreData + SQLite)',
        description: 'Heart rate readings, step counts, calories, workout sessions, sleep analysis, blood oxygen, ECG results, crash detection events',
        ciRelevance: 'Establishes physical presence and activity level at specific times. Heart rate spike + location data + workout session = subject was physically active at location X. Sedentary period + out-of-range HR = potential medical event or stress indicator. Crash detection activations log time and location.',
        format: 'CoreData (healthdb.sqlite + healthdb_secure.sqlite)',
      },
      {
        category: 'Location',
        path: 'iPhone backup: Library/Caches/GeoServices/',
        description: 'Location data collected via Watch GPS (standalone GPS in Series 2+). Route workouts contain GPS track logs.',
        ciRelevance: 'Workout GPS tracks prove subject was at specific locations during exercise. Route maps reconstruct exact path taken. Timestamps correlate with other artifact timelines.',
        format: 'SQLite, CoreData',
      },
      {
        category: 'Activity & Workouts',
        path: 'iPhone backup: Library/Application Support/com.apple.Workout.healthext/',
        description: 'Detailed workout records with start/end time, route (GPS), heart rate during workout, calorie burn, workout type',
        ciRelevance: 'Workout sessions establish alibi or presence — subject was running in park X between 07:15 and 08:02 on date Y. GPS route in workout proves physical location independently of cell tower data.',
        format: 'CoreData/SQLite',
      },
      {
        category: 'Sleep',
        path: 'healthdb.sqlite — sleep analysis samples',
        description: 'Sleep start/end times, sleep stages (awake, REM, core, deep), heart rate during sleep',
        ciRelevance: 'Establishes when subject was asleep vs awake. Useful for alibi assessment — subject\'s Watch shows they were in deep sleep during the alleged activity window. Also establishes routine sleep patterns that can corroborate or contradict claimed schedules.',
        format: 'SQLite (ZSAMPLE table in healthdb.sqlite)',
      },
      {
        category: 'Notifications & Comms',
        path: 'Watch mirrors iPhone notifications — no independent storage',
        description: 'Apple Watch mirrors iPhone notifications and does not independently store message content. Communications evidence comes from iPhone.',
        ciRelevance: 'Watch notification delivery timestamps can corroborate iPhone message timestamps — Watch shows notification was delivered even if iPhone message was deleted.',
        format: 'Mirror of iPhone data',
      },
      {
        category: 'App Data',
        path: 'iPhone backup: Watch/Applications/<UUID>/Documents/',
        description: 'Third-party Watch app data (fitness apps, navigation, communication apps with Watch extensions)',
        ciRelevance: 'Third-party fitness/navigation apps may store independent location and activity data supplementing Apple Health data.',
        format: 'App-dependent',
      },
      {
        category: 'Crash Detection',
        path: 'healthdb.sqlite — Fall/Crash detection events',
        description: 'Automatic fall detection alerts, crash detection (vehicle collision) events with timestamp and location',
        ciRelevance: 'Crash detection events are timestamped and geolocated — can place subject at scene of vehicle accident. Fall detection calls to emergency services creates carrier record corroborating event.',
        format: 'SQLite',
      },
    ],
    databases: [
      {
        name: 'healthdb.sqlite',
        path: 'iPhone backup: Health/healthdb.sqlite',
        description: 'Primary Apple Health database — all health samples from Watch and iPhone',
        keyTables: [
          { table: 'ZSAMPLE', columns: 'ZTYPE, ZSTARTDATE, ZENDDATE, ZVALUE, ZSOURCE, ZDEVICE', ciValue: 'ZSTARTDATE/ZENDDATE in Mac Absolute Time (add 978307200). ZTYPE maps to health data type (see ZSAMPLETYPE). Heart rate, steps, calories all stored here. ZDEVICE links to Watch vs iPhone source.' },
          { table: 'ZSAMPLETYPE', columns: 'ZIDENTIFIER, ZDISPLAYNAME', ciValue: 'Maps ZTYPE integers to human-readable names: 9=HeartRate, 7=StepCount, 63=ActiveEnergyBurned, 72=SleepAnalysis, 133=HeartRateVariability.' },
          { table: 'ZWORKOUTEVENT', columns: 'ZTYPE, ZDATE, ZDURATION, ZWORKOUT', ciValue: 'Workout sub-events (pause, resume, lap). Timestamps prove activity pattern within a workout session.' },
          { table: 'ZWORKOUT', columns: 'ZWORKOUTACTIVITYTYPE, ZTOTALENERGYBURNEDQUANTITY, ZTOTALDISTANCEQUANTITY, ZSTARTDATE, ZENDDATE', ciValue: 'Each completed workout. ZWORKOUTACTIVITYTYPE: 37=Running, 13=Cycling, 3000=Walking. GPS routes in separate table.' },
        ],
      },
    ],
    syncRelationship: 'Apple Watch requires paired iPhone for setup and syncs all health and activity data to iPhone. Watch data appears in iPhone iTunes backup and iCloud backup. Watch maintains local storage of recent data (~7 days) before requiring iPhone sync. Unpaired Watch retains its local health database.',
    encryptionNotes: 'Health data is encrypted with iOS Data Protection. healthdb_secure.sqlite requires full filesystem or physical extraction with decryption. Standard encrypted iTunes backup decrypts Health data with backup password. iCloud Health data uses end-to-end encryption (not accessible to Apple under legal process if Advanced Data Protection is enabled).',
    legalProcess: 'Apple Watch data obtained via iPhone legal process (same as iPhone). Watch-specific iCloud backup via Apple legal process. Health data with Advanced Data Protection: Apple cannot decrypt — device extraction required.',
    tools: ['Cellebrite UFED Physical Analyzer', 'Elcomsoft Phone Breaker (EPB)', 'iMazing', 'DB Browser for SQLite (healthdb.sqlite)', 'iLEAPP (Health module)', 'APOLLO (Apple Pattern of Life Lazy Output\'er) — healthdb.sqlite analysis'],
    notes: 'APOLLO (by Sarah Edwards) is the most comprehensive free tool for Apple Health/Watch data analysis — generates timeline of all health events with human-readable output. Run against healthdb.sqlite extracted from iPhone backup or filesystem. Health data is among the most forensically valuable Watch artifacts — provides continuous biometric timeline that is very difficult to fabricate or delete selectively.',
  },
  {
    name: 'Samsung Galaxy Watch (Wear OS / Tizen)',
    devices: 'Galaxy Watch 4–6, Watch Active, Gear series (older Tizen)',
    os: 'Wear OS 3/4 (Watch 4+), Tizen OS (older Gear series)',
    acquisitionMethods: [
      {
        method: 'Samsung Health app extraction (Android)',
        description: 'Samsung Galaxy Watch syncs data to Samsung Health app on paired Android phone. Extract Samsung Health databases from paired phone.',
        toolSupport: 'Cellebrite UFED, Oxygen Forensic Detective, manual ADB (rooted)',
        notes: 'Primary method. Samsung Health data on the phone includes all Watch-synced health and activity data. Path on Android: /data/data/com.samsung.android.app.health/',
      },
      {
        method: 'Samsung Cloud extraction',
        description: 'Samsung Health data syncs to Samsung Cloud. Accessible via legal process or with credentials.',
        toolSupport: 'Cellebrite UFED Cloud, MSAB XRY Cloud',
        notes: 'Samsung Health cloud data retained per Samsung privacy policy. Includes historical health data beyond what is on device.',
      },
      {
        method: 'Direct Watch extraction (Wear OS)',
        description: 'Wear OS watches can be accessed via ADB over Bluetooth or WiFi if developer mode is enabled.',
        toolSupport: 'ADB (adb connect <watch_ip>:5555), Cellebrite UFED (limited)',
        notes: 'Requires developer mode enabled on Watch. Most forensic targets will not have developer mode active. Wear OS 3+ has stricter ADB restrictions.',
      },
      {
        method: 'Tizen Watch extraction (older Gear)',
        description: 'Older Samsung Gear watches (Gear S3, Sport, etc.) running Tizen OS. Limited direct extraction options.',
        toolSupport: 'Cellebrite UFED (limited Tizen support), MSAB XRY',
        notes: 'Tizen-based Gear watches have limited forensic tool support. Primary method is still Samsung Health app on paired phone.',
      },
    ],
    artifacts: [
      {
        category: 'Health & Activity',
        path: '/data/data/com.samsung.android.app.health/databases/health.db (Android)',
        description: 'Heart rate, steps, calories, sleep, stress level, blood oxygen, ECG, body composition (body fat %, muscle mass)',
        ciRelevance: 'Samsung Health body composition data (from newer Watches with BIA sensor) provides biometric profile. Continuous heart rate and GPS activity data establishes presence and activity timeline.',
        format: 'SQLite',
      },
      {
        category: 'Location / GPS',
        path: 'Samsung Health database location tables',
        description: 'GPS track data from outdoor workouts, location-based activity tracking',
        ciRelevance: 'GPS routes from Watch workouts provide independent location evidence. Samsung Health route data includes waypoints with timestamps.',
        format: 'SQLite',
      },
      {
        category: 'Sleep Analysis',
        path: 'Samsung Health — sleep tables',
        description: 'Sleep start/end, sleep stages, blood oxygen during sleep, snoring detection',
        ciRelevance: 'Sleep timestamps establish awake/asleep status for alibi assessment.',
        format: 'SQLite',
      },
      {
        category: 'Notifications',
        path: 'Galaxy Watch notification log — /data/data/com.samsung.android.app.watchmanager/',
        description: 'Notification delivery log to Watch — message previews, app notifications',
        ciRelevance: 'Notification timestamps and content previews on Watch can corroborate or contradict deleted phone message evidence.',
        format: 'SQLite/SharedPreferences',
      },
    ],
    databases: [
      {
        name: 'health.db (Samsung Health)',
        path: '/data/data/com.samsung.android.app.health/databases/health.db',
        description: 'Samsung Health primary database on paired Android phone',
        keyTables: [
          { table: 'health_data_heart_rate', columns: 'start_time, end_time, heart_rate, min, max, comment', ciValue: 'start_time/end_time in Unix milliseconds. Continuous heart rate log. High HR spikes during otherwise sedentary period = elevated stress/activity.' },
          { table: 'health_data_pedometer_day_summary', columns: 'day_time, step_count, calorie, distance', ciValue: 'Daily step summary with Unix day timestamp. Proves device (and likely wearer) was physically active on given date.' },
          { table: 'health_data_sleep', columns: 'start_time, end_time, time_offset, stage', ciValue: 'Sleep sessions with stages. stage: 40001=awake, 40002=light, 40003=deep, 40004=REM.' },
          { table: 'health_data_location', columns: 'start_time, latitude, longitude, altitude, accuracy', ciValue: 'GPS waypoints during tracked activities. Timestamps in Unix milliseconds.' },
        ],
      },
    ],
    syncRelationship: 'Galaxy Watch requires Galaxy smartphone for initial setup. Syncs to Samsung Health app on phone. Data also uploaded to Samsung Health cloud. Watch retains local data buffer — exact retention varies by Watch model and storage capacity.',
    encryptionNotes: 'Samsung Health database on Android is protected by Android app sandbox — requires root or physical extraction for direct access. Samsung Health data encrypted at rest on newer Android devices with FBE. Samsung Cloud health data encrypted in transit and at rest.',
    legalProcess: 'Samsung Health data via legal process to Samsung. Korean company — international legal process via MLAT. US law enforcement: Samsung Electronics America (San Jose, CA). Faster: extract from paired Android phone via carrier/Google account legal process.',
    tools: ['Cellebrite UFED Physical Analyzer', 'Oxygen Forensic Detective', 'MSAB XRY', 'DB Browser for SQLite', 'ADB (developer mode only)'],
    notes: 'Samsung Health stress level data (0–100 score based on HRV) is unique to Samsung — provides continuous stress timeline not available from Apple Watch. Body composition data from BIA sensor (Galaxy Watch 4+) provides biometric profile. Samsung Health PC sync backup (samsung.com/health) may provide additional extraction path with account credentials.',
  },
  {
    name: 'Fitbit (Google Wear OS / Fitbit OS)',
    devices: 'Fitbit Sense 2, Versa 4, Charge 6, Inspire 3, Pixel Watch (Google)',
    os: 'Fitbit OS / Google Wear OS (Pixel Watch)',
    acquisitionMethods: [
      {
        method: 'Fitbit app database extraction (Android/iOS)',
        description: 'Fitbit syncs data to companion app on paired smartphone. Extract Fitbit app databases.',
        toolSupport: 'Cellebrite UFED, Oxygen Forensic Detective, manual (rooted Android)',
        notes: 'Android path: /data/data/com.fitbit.FitbitMobile/. iOS: within app container via backup or filesystem extraction.',
      },
      {
        method: 'Google Fit / Fitbit cloud extraction',
        description: 'Fitbit data syncs to Fitbit servers (owned by Google since 2021). Accessible via Google account legal process as part of Google health data.',
        toolSupport: 'Google Takeout (with credentials), legal process to Google',
        notes: 'Since Google acquisition, Fitbit data may be accessible via Google account data export alongside Google Fit data. Google Takeout: Takeout/Fitbit/ directory.',
      },
    ],
    artifacts: [
      {
        category: 'Activity',
        path: 'Fitbit app database / cloud export',
        description: 'Steps, distance, floors climbed, calories, active minutes, heart rate, SpO2',
        ciRelevance: 'Continuous activity data establishes presence and mobility. Sedentary vs active periods establish routine.',
        format: 'SQLite (app) / JSON (cloud export)',
      },
      {
        category: 'Sleep',
        path: 'Fitbit app database — sleep table',
        description: 'Sleep start/end, sleep stages, heart rate during sleep, restlessness',
        ciRelevance: 'Sleep timeline for alibi and routine assessment.',
        format: 'SQLite / JSON',
      },
      {
        category: 'GPS / Location',
        path: 'Fitbit app / Google account location',
        description: 'GPS available on higher-end Fitbits (Sense, Versa). Route data stored per workout.',
        ciRelevance: 'Exercise route GPS proves location during workout.',
        format: 'SQLite / GPX/JSON',
      },
      {
        category: 'Google cloud export',
        path: 'Google Takeout: Takeout/Fitbit/',
        description: 'Complete Fitbit history export: activities, body measurements, food log, heart rate, sleep, weight',
        ciRelevance: 'Historical data potentially years back. JSON format, easily parsed. Body weight history over time.',
        format: 'JSON (per data type)',
      },
    ],
    databases: [
      {
        name: 'Google Takeout Fitbit JSON',
        path: 'Google Takeout → Takeout/Fitbit/Physical Activity/',
        description: 'Complete Fitbit data export from Google account',
        keyTables: [
          { table: 'heart_rate-<date>.json', columns: 'time, value.bpm, value.confidence', ciValue: 'Per-second heart rate samples during active periods. Timestamps in ISO 8601.' },
          { table: 'activities-<type>-<date>.json', columns: 'dateTime, value (steps/distance/calories)', ciValue: 'Activity summaries per day. dateTime in YYYY-MM-DD format.' },
          { table: 'sleep-<date>.json', columns: 'dateOfSleep, startTime, endTime, duration, levels.data', ciValue: 'Sleep sessions with stage-by-stage breakdown. startTime/endTime in ISO 8601.' },
        ],
      },
    ],
    syncRelationship: 'Fitbit requires Fitbit/Google account and companion app on smartphone. Data syncs via Bluetooth to phone then to cloud. Since Google acquisition (2021), Fitbit data integrates with Google account.',
    encryptionNotes: 'Fitbit app database on Android accessible with root. iOS app data via filesystem/backup extraction. Cloud data: Google account standard encryption. No end-to-end encryption for Fitbit data — Google can access under legal process.',
    legalProcess: 'Fitbit data via Google legal process (post-2021 acquisition). Google law enforcement: google.com/transparencyreport. Pre-acquisition Fitbit data: Fitbit/Google (same process). Historical data potentially available from Google account.',
    tools: ['Cellebrite UFED', 'Oxygen Forensic Detective', 'Google Takeout (with credentials)', 'DB Browser for SQLite', 'Python (JSON parsing of Takeout data)'],
    notes: 'Google Takeout is the most complete Fitbit data source when credentials are available — provides years of historical data in clean JSON format. Parse heart rate JSON with Python for timeline analysis. Correlate with Google Location History for combined activity + location picture.',
  },
  {
    name: 'Garmin',
    devices: 'Fenix 7, Forerunner 9xx/2xx, Venu, Vivoactive, Instinct series',
    os: 'Garmin OS (proprietary)',
    acquisitionMethods: [
      {
        method: 'Garmin Connect app extraction',
        description: 'Garmin syncs to Garmin Connect app on paired smartphone and to Garmin Connect cloud.',
        toolSupport: 'Cellebrite UFED (Garmin Connect app data), manual (rooted Android)',
        notes: 'Android: /data/data/com.garmin.android.apps.connectmobile/. Activity FIT files stored in app cache.',
      },
      {
        method: 'Direct USB/mass storage access',
        description: 'Garmin watches appear as USB mass storage when connected to computer. Activity files accessible directly as .FIT files.',
        toolSupport: 'Direct file access, FIT SDK (Garmin open source), GPSBabel',
        notes: 'Most forensically accessible method for Garmin. No root required. Connect Watch via USB — appears as drive. Activity files in /Garmin/Activities/ as .FIT format.',
      },
      {
        method: 'Garmin Connect cloud',
        description: 'All activity and health data syncs to Garmin Connect cloud (connect.garmin.com).',
        toolSupport: 'Garmin Connect web export (with credentials), legal process to Garmin',
        notes: 'Garmin (US company, Olathe, Kansas) responds to valid US legal process. Garmin Connect stores historical activity data. Data export available: connect.garmin.com/modern/account/billing → Export Your Data.',
      },
    ],
    artifacts: [
      {
        category: 'Activity FIT files',
        path: 'USB: /Garmin/Activities/*.fit — or Garmin Connect app cache',
        description: 'Binary FIT (Flexible and Interoperable Data Transfer) files containing complete activity records: GPS track, heart rate, pace, elevation, temperature, power (cycling)',
        ciRelevance: 'FIT files are the gold standard of fitness forensics — contain complete GPS track with sub-second timestamps, heart rate at each GPS point, and device serial number. Prove exact route taken, pace, and biometrics at every point.',
        format: 'Binary FIT format (Garmin open spec)',
      },
      {
        category: 'GPS track data',
        path: 'Within FIT files — also in /Garmin/GPX/ on some devices',
        description: 'Full GPS track for every outdoor activity — latitude, longitude, altitude, timestamp, accuracy',
        ciRelevance: 'Most precise location evidence available from wearables. Sub-second GPS sampling. Can reconstruct exact path including stops, pace changes, and points of interest.',
        format: 'FIT binary / GPX XML',
      },
      {
        category: 'Device configuration',
        path: 'USB: /Garmin/Settings.fit and /Garmin/Prefs.fit',
        description: 'Device name, paired sensors, user profile (height, weight, birthdate, gender)',
        ciRelevance: 'User profile confirms device owner identity. Device serial number in FIT files links activities to specific hardware.',
        format: 'FIT binary',
      },
      {
        category: 'Health snapshots',
        path: '/Garmin/Health/ on USB mount',
        description: 'Daily health summaries, stress scores, Body Battery (Garmin energy metric), sleep data, HRV status',
        ciRelevance: 'Continuous health timeline. Body Battery depletion indicates physical exertion. Stress score elevation without physical activity indicates psychological stress event.',
        format: 'FIT binary',
      },
    ],
    databases: [
      {
        name: 'FIT file parsing',
        path: '/Garmin/Activities/<timestamp>.fit',
        description: 'Garmin FIT format is binary but well-documented with open-source SDK',
        keyTables: [
          { table: 'record messages', columns: 'timestamp, position_lat, position_long, heart_rate, speed, altitude', ciValue: 'One record per second during activity. position_lat/long in semicircles (multiply by 180/2^31 for degrees). timestamp in Garmin epoch (seconds since 1989-12-31) — add 631065600 for Unix.' },
          { table: 'session messages', columns: 'start_time, total_elapsed_time, total_distance, avg_heart_rate, sport', ciValue: 'Summary of entire activity. start_time is Garmin epoch. sport field identifies activity type.' },
          { table: 'device_info messages', columns: 'manufacturer, product, serial_number, software_version', ciValue: 'Device serial number links FIT file to specific Garmin unit. Can tie file to seized hardware.' },
        ],
      },
    ],
    syncRelationship: 'Garmin watches sync via USB (primary for activities) and via Garmin Connect app Bluetooth sync. USB connection provides direct access to FIT files without any tool. Cloud sync to Garmin Connect for long-term storage and social features.',
    encryptionNotes: 'FIT files on USB are not encrypted — accessible directly. Garmin Connect app database on Android has standard Android app protection. FIT file format is documented and open — parse with fitparse (Python), Garmin FIT SDK (Java/C++), or GoldenCheetah.',
    legalProcess: 'Garmin International (US company, Olathe, KS). US legal process via standard ECPA/SCA framework. Garmin publishes law enforcement guidelines. Historical activity data retained while account is active.',
    tools: ['fitparse (Python library — pip install fitparse)', 'GPSBabel (FIT → GPX conversion)', 'GoldenCheetah (open source FIT analysis)', 'Garmin FIT SDK (official)', 'Cellebrite UFED (Garmin Connect app)', 'Basecamp (Garmin desktop app — opens FIT files)'],
    notes: 'Garmin FIT files via USB are the simplest high-value extraction in wearable forensics — no root, no tool license required, just connect USB cable and copy files. fitparse Python library parses FIT files in seconds. Device serial number in every FIT file is a critical evidence link. Garmin watches used by military/law enforcement/athletes may have years of detailed GPS activity data.',
  },
]

export const smartwatchQueries = [
  {
    platform: 'Apple Watch (healthdb.sqlite)',
    description: 'All heart rate samples with timestamps',
    sql: `SELECT
  datetime(ZSTARTDATE + 978307200, 'unixepoch') as SampleTime,
  ZVALUE as HeartRate,
  ZDEVICE as DeviceID
FROM ZSAMPLE
WHERE ZTYPE = 9  -- 9 = HKQuantityTypeIdentifierHeartRate
ORDER BY ZSTARTDATE DESC;`,
  },
  {
    platform: 'Apple Watch (healthdb.sqlite)',
    description: 'All workout sessions with type, duration, and distance',
    sql: `SELECT
  CASE ZWORKOUTACTIVITYTYPE
    WHEN 37 THEN 'Running' WHEN 13 THEN 'Cycling'
    WHEN 3000 THEN 'Walking' WHEN 20 THEN 'Functional Strength'
    WHEN 46 THEN 'Swimming' ELSE CAST(ZWORKOUTACTIVITYTYPE AS TEXT)
  END as WorkoutType,
  datetime(ZSTARTDATE + 978307200, 'unixepoch') as StartTime,
  datetime(ZENDDATE + 978307200, 'unixepoch') as EndTime,
  ROUND((ZENDDATE - ZSTARTDATE) / 60.0, 1) as DurationMin,
  ROUND(ZTOTALDISTANCEQUANTITY / 1000.0, 2) as DistanceKm
FROM ZWORKOUT
ORDER BY ZSTARTDATE DESC;`,
  },
  {
    platform: 'Apple Watch (healthdb.sqlite)',
    description: 'Sleep sessions with duration',
    sql: `SELECT
  datetime(ZSTARTDATE + 978307200, 'unixepoch') as SleepStart,
  datetime(ZENDDATE + 978307200, 'unixepoch') as SleepEnd,
  ROUND((ZENDDATE - ZSTARTDATE) / 3600.0, 2) as DurationHours,
  ZVALUE as SleepStage  -- 0=InBed, 1=Asleep, 2=Awake, 3=Core, 4=Deep, 5=REM
FROM ZSAMPLE
WHERE ZTYPE = 72  -- HKCategoryTypeIdentifierSleepAnalysis
ORDER BY ZSTARTDATE DESC;`,
  },
  {
    platform: 'Samsung Health (health.db)',
    description: 'Heart rate timeline',
    sql: `SELECT
  datetime(start_time/1000, 'unixepoch') as SampleTime,
  heart_rate as BPM,
  min as MinBPM,
  max as MaxBPM
FROM health_data_heart_rate
ORDER BY start_time DESC
LIMIT 500;`,
  },
  {
    platform: 'Samsung Health (health.db)',
    description: 'GPS location samples during activities',
    sql: `SELECT
  datetime(start_time/1000, 'unixepoch') as SampleTime,
  latitude, longitude, altitude,
  accuracy
FROM health_data_location
ORDER BY start_time DESC;`,
  },
  {
    platform: 'Garmin FIT (Python)',
    description: 'Parse FIT file GPS track to CSV',
    sql: `import fitparse

fit = fitparse.FitFile('activity.fit')
print("timestamp,lat,lon,heart_rate,speed,altitude")
for record in fit.get_messages('record'):
    data = {f.name: f.value for f in record}
    ts = data.get('timestamp', '')
    # position in semicircles -> degrees
    lat = data.get('position_lat', 0)
    lon = data.get('position_long', 0)
    if lat: lat = lat * (180 / 2**31)
    if lon: lon = lon * (180 / 2**31)
    print(f"{ts},{lat:.6f},{lon:.6f},{data.get('heart_rate','')},{data.get('speed','')},{data.get('altitude','')}")`,
  },
  {
    platform: 'Garmin FIT (Python)',
    description: 'Extract device serial number from FIT file',
    sql: `import fitparse

fit = fitparse.FitFile('activity.fit')
for msg in fit.get_messages('device_info'):
    for f in msg:
        if f.name in ('manufacturer','product','serial_number','software_version'):
            print(f"{f.name}: {f.value}")`,
  },
  {
    platform: 'Fitbit (Google Takeout JSON)',
    description: 'Parse heart rate JSON to timeline',
    sql: `import json, glob
from datetime import datetime

for filepath in glob.glob('Fitbit/Physical Activity/heart_rate-*.json'):
    with open(filepath) as f:
        data = json.load(f)
    for entry in data:
        ts = datetime.strptime(entry['dateTime'], '%m/%d/%y %H:%M:%S')
        bpm = entry['value']['bpm']
        conf = entry['value']['confidence']
        print(f"{ts.isoformat()},{bpm},{conf}")`,
  },
]

export const smartwatchCIConsiderations = [
  {
    scenario: 'Alibi assessment',
    description: 'Subject claims to have been at home asleep during the incident window.',
    artifacts: ['Apple Health sleep analysis (was Watch worn? was sleep recorded?)', 'Heart rate continuity (sedentary HR during alleged sleep, or awake-level HR?)', 'Step count (zero steps during sleep = consistent; steps during sleep window = inconsistent)', 'GPS workout data (any outdoor activity recorded?)'],
    notes: 'Absence of sleep data when Watch is normally worn is itself suspicious — subject may have removed Watch. Check Watch wear patterns across multiple nights to establish baseline.',
  },
  {
    scenario: 'Physical presence at location',
    description: 'Proving subject was at a specific location on a specific date.',
    artifacts: ['Garmin FIT GPS track (most precise — sub-second waypoints)', 'Apple Watch workout GPS route', 'Samsung Health GPS location table', 'Heart rate elevation correlated with GPS location (active at location)'],
    notes: 'FIT GPS tracks are exceptionally hard to fabricate — GPS waypoints include satellite signal data, accuracy values, and continuous HR correlation. Cross-reference with cell tower data and surveillance footage timestamps.',
  },
  {
    scenario: 'Physical exertion / stress evidence',
    description: 'Establishing physical condition around time of incident.',
    artifacts: ['Heart rate data around incident time (elevated = physical exertion or stress)', 'HRV (Heart Rate Variability) — low HRV indicates high stress or poor recovery', 'Samsung Body Battery depletion', 'Garmin stress score', 'Activity data immediately before/after incident'],
    notes: 'HR data can corroborate or contradict claims about physical capability at time of incident. Very high HR without GPS movement = stress response without physical activity.',
  },
  {
    scenario: 'Identity of wearer',
    description: 'Confirming the Watch was worn by the subject specifically.',
    artifacts: ['User profile in device (height, weight, birthdate) — matches subject biometrics', 'Heart rate baseline and patterns consistent with subject\'s medical records', 'Sleep patterns consistent with subject\'s known schedule', 'Activity type (running pace, cycling power) consistent with subject\'s known fitness level'],
    notes: 'Health biometrics in the Watch user profile are typically self-reported but corroborate identity. Persistent HR patterns across months of data develop a characteristic "fingerprint" that can be compared to medical records.',
  },
  {
    scenario: 'Timeline reconstruction',
    description: 'Building a minute-by-minute timeline of subject\'s activity.',
    artifacts: ['Heart rate every second during activity', 'Step count every minute', 'Sleep staging throughout the night', 'Workout sessions with GPS routes', 'Notification delivery timestamps'],
    notes: 'Wearable data provides the most continuous biometric timeline available in consumer forensics. Combine with phone location data, browser history, and SRUM for complete picture.',
  },
]
