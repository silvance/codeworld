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
