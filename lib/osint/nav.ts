export type SectionId = 'search' | 'people' | 'persona' | 'username' | 'image' | 'social' | 'infra' | 'phone' | 'darkweb' | 'corp'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string }

export const NAV: NavItem[] = [
  { id: 'search',   label: 'Search operators',    sub: 'Google · Bing · dorks',          icon: '🔎' },
  { id: 'people',   label: 'People search',       sub: 'Spokeo · Pipl · PACER',          icon: '👤' },
  { id: 'username', label: 'Username enum',       sub: 'Sherlock · Maigret · breaches',  icon: '🏷' },
  { id: 'image',    label: 'Image OSINT',         sub: 'Reverse · EXIF · geolocation',   icon: '🖼' },
  { id: 'social',   label: 'Social media',        sub: 'LinkedIn · Twitter · Facebook',  icon: '📱' },
  { id: 'infra',    label: 'Domain / IP / infra', sub: 'Shodan · crt.sh · DNS history',  icon: '🌐' },
  { id: 'phone',    label: 'Phone OSINT',         sub: 'Truecaller · Phoneinfoga',       icon: '📞' },
  { id: 'darkweb',  label: 'Dark web OSINT',      sub: 'Breaches · Tor · ransomware',    icon: '🕸' },
  { id: 'corp',     label: 'Corporate intel',     sub: 'SEC · SAM.gov · patents',        icon: '🏢' },
  { id: 'persona',  label: 'Sock puppet OPSEC',   sub: 'Infrastructure · identity · ops',icon: '🎭' },
]
