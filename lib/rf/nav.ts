export type SectionId =
  | 'freq' | 'fspl' | 'channels' | 'math' | 'tscm' | 'rogue' | 'rbs'
  | 'sdr' | 'sweep' | 'physical' | 'modulation' | 'countersurv' | 'bugfreq' | 'tools' | 'antenna'
  | 'taxonomy' | 'actors' | 'baseline' | 'tempest' | 'cellular' | 'countermeasures' | 'training' | 'report'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  // RF Tools
  { id: 'freq',           label: 'Frequency reference',  sub: 'ISM · cellular · gov · ham',                 icon: '📡', group: 'RF Tools' },
  { id: 'fspl',           label: 'Path loss calc',       sub: 'FSPL · EIRP · link budget',                  icon: '📉', group: 'RF Tools' },
  { id: 'channels',       label: 'Channel maps',         sub: '2.4 GHz · 5 GHz · BLE',                      icon: '🗺', group: 'RF Tools' },
  { id: 'math',           label: 'Signal math',          sub: 'dBm ↔ mW · EIRP · ref table',                icon: '🔢', group: 'RF Tools' },
  { id: 'antenna',        label: 'Antenna & link budget', sub: 'Gain · patterns · formulas',                icon: '📶', group: 'RF Tools' },
  { id: 'modulation',     label: 'Modulation reference', sub: 'AM · FM · FHSS · OFDM · OOK',                icon: '〜', group: 'RF Tools' },
  // TSCM — Operations
  { id: 'sweep',          label: 'Sweep methodology',    sub: 'Pre-sweep · RF · physical · docs',           icon: '🔄', group: 'TSCM' },
  { id: 'tscm',           label: 'TSCM devices',         sub: 'Threat freqs · detection',                   icon: '🔍', group: 'TSCM' },
  { id: 'bugfreq',        label: 'Bug frequencies',      sub: 'Audio · video · GSM · cellular',             icon: '🐛', group: 'TSCM' },
  { id: 'physical',       label: 'Physical indicators',  sub: 'Screws · paint · wiring · weight',           icon: '👁', group: 'TSCM' },
  { id: 'countersurv',    label: 'Counter-surv',         sub: 'Foot · vehicle · technical',                 icon: '🕵', group: 'TSCM' },
  { id: 'rogue',          label: 'Rogue AP reference',   sub: 'Evil twin · indicators · tools',             icon: '⚠', group: 'TSCM' },
  { id: 'rbs',            label: 'Rogue base stations',  sub: '2G/LTE attacks · SDR platforms · detection', icon: '📡', group: 'TSCM' },
  // TSCM — Threat Intel
  { id: 'taxonomy',       label: 'Device taxonomy',      sub: 'Acoustic · optical · RF · IoT',              icon: '🎯', group: 'Threat Intel' },
  { id: 'actors',         label: 'Threat actors',        sub: 'Nation-state · insider · criminal',          icon: '🎭', group: 'Threat Intel' },
  { id: 'baseline',       label: 'Spectrum baseline',    sub: 'Office · mil · industrial',                  icon: '📊', group: 'Threat Intel' },
  { id: 'tempest',        label: 'TEMPEST / emanations', sub: 'Van Eck · keyboard · powerline',             icon: '⚡', group: 'Threat Intel' },
  { id: 'cellular',       label: 'Cellular threats',     sub: 'IMSI · rogue cell · carrier current',        icon: '📶', group: 'Threat Intel' },
  { id: 'countermeasures',label: 'Countermeasures',      sub: 'Shielding · masking · policy',               icon: '🛡', group: 'Threat Intel' },
  // Training & Docs
  { id: 'training',       label: 'Training scenarios',   sub: 'Beginner → expert · 5 scenarios',            icon: '🎓', group: 'Training & Docs' },
  { id: 'report',         label: 'Survey report',        sub: 'Sweep documentation · export',               icon: '📋', group: 'Training & Docs' },
  // Equipment
  { id: 'sdr',            label: 'SDR quick reference',  sub: 'HackRF · RTL · TinySA · Flipper',            icon: '📻', group: 'Equipment' },
  { id: 'tools',          label: 'TSCM tool reference',  sub: 'OSCOR · TALAN · NLJD · TinySA',              icon: '🛠', group: 'Equipment' },
]

export const GROUPS = ['RF Tools', 'TSCM', 'Threat Intel', 'Training & Docs', 'Equipment']
