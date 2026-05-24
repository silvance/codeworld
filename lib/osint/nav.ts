export type SectionId =
  | 'workflows'
  | 'search' | 'people' | 'persona' | 'username' | 'email'
  | 'image' | 'social' | 'infra' | 'archive' | 'code' | 'crypto'
  | 'phone' | 'darkweb' | 'corp' | 'geo' | 'vehicle' | 'document' | 'verify'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  // Start here
  { id: 'workflows', label: 'Investigation workflows', sub: 'Step-by-step playbooks for common types', icon: '🧭', group: 'Start here' },
  // Identity & people
  { id: 'search',   label: 'Search operators',    sub: 'Google · Bing · dorks',                icon: '🔎', group: 'Identity & people' },
  { id: 'people',   label: 'People search',       sub: 'Spokeo · Pipl · PACER',                icon: '👤', group: 'Identity & people' },
  { id: 'username', label: 'Username enum',       sub: 'Sherlock · Maigret · breaches',        icon: '🏷', group: 'Identity & people' },
  { id: 'email',    label: 'Email OSINT',         sub: 'Hunter · EpieOS · Holehe · h8mail',    icon: '✉️', group: 'Identity & people' },
  { id: 'phone',    label: 'Phone OSINT',         sub: 'Truecaller · Phoneinfoga',             icon: '📞', group: 'Identity & people' },
  { id: 'image',    label: 'Image OSINT',         sub: 'Reverse · EXIF · geolocation',         icon: '🖼', group: 'Identity & people' },
  { id: 'social',   label: 'Social media',        sub: 'LinkedIn · Twitter · TikTok · Discord · Telegram', icon: '📱', group: 'Identity & people' },

  // Infrastructure & code
  { id: 'infra',    label: 'Domain / IP / infra', sub: 'Shodan · crt.sh · DNS history',        icon: '🌐', group: 'Infrastructure & code' },
  { id: 'archive',  label: 'Archive & wayback',   sub: 'Wayback · archive.today · CommonCrawl', icon: '📚', group: 'Infrastructure & code' },
  { id: 'code',     label: 'Code & repos',        sub: 'TruffleHog · Gitleaks · GitHub dorks', icon: '💻', group: 'Infrastructure & code' },
  { id: 'crypto',   label: 'Crypto / blockchain', sub: 'Etherscan · WalletExplorer · Arkham',  icon: '⛓', group: 'Infrastructure & code' },

  // Place & object
  { id: 'geo',      label: 'Geospatial / map',    sub: 'Flight · maritime · satellite · sun',  icon: '🗺', group: 'Place & object' },
  { id: 'vehicle',  label: 'Vehicle / transport', sub: 'VIN · aircraft · vessels',             icon: '🚗', group: 'Place & object' },
  { id: 'document', label: 'Documents & metadata', sub: 'ExifTool · FOCA · oletools',          icon: '📄', group: 'Place & object' },

  // Adversary & operations
  { id: 'darkweb',  label: 'Dark web OSINT',      sub: 'Breaches · Tor · ransomware leaks',    icon: '🕸', group: 'Adversary & operations' },
  { id: 'corp',     label: 'Corporate intel',     sub: 'SEC · SAM.gov · patents',              icon: '🏢', group: 'Adversary & operations' },
  { id: 'verify',   label: 'Verification toolkit', sub: 'Bellingcat · InVID · ELA · sun-shadow', icon: '✓',  group: 'Adversary & operations' },
  { id: 'persona',  label: 'Sock puppet OPSEC',   sub: 'Infrastructure · identity · ops',      icon: '🎭', group: 'Adversary & operations' },
]

export const GROUPS = ['Start here', 'Identity & people', 'Infrastructure & code', 'Place & object', 'Adversary & operations']
