// ─── Frequency reference tables ────────────────────────────────────────────

export interface FreqBand {
  name: string
  start: string
  end: string
  notes: string
  threat?: boolean
}

export interface FreqCategory {
  category: string
  bands: FreqBand[]
}

export const freqReference: FreqCategory[] = [
  {
    category: 'ISM / Unlicensed',
    bands: [
      { name: 'Low ISM',        start: '433.05 MHz', end: '434.79 MHz', notes: 'Key fobs, temp sensors, cheap RF bugs, LoRa (EU)', threat: true },
      { name: 'ISM 868',        start: '868.0 MHz',  end: '868.6 MHz',  notes: 'LoRa EU, Z-Wave EU, smart meters', threat: true },
      { name: 'ISM 915',        start: '902.0 MHz',  end: '928.0 MHz',  notes: 'LoRa US, FHSS devices, ZigBee, some covert cams', threat: true },
      { name: 'Bluetooth/WiFi', start: '2.400 GHz',  end: '2.4835 GHz', notes: 'BT, BLE, 802.11b/g/n, ZigBee, covert WiFi cams', threat: true },
      { name: 'WiFi 5 GHz',     start: '5.150 GHz',  end: '5.850 GHz',  notes: '802.11a/n/ac/ax, less congested', threat: true },
      { name: 'WiFi 6 GHz',     start: '5.925 GHz',  end: '7.125 GHz',  notes: '802.11ax (Wi-Fi 6E), newer APs' },
      { name: 'Analog AV 1.2',  start: '1.080 GHz',  end: '1.300 GHz',  notes: 'Older analog video TX (covert cams)', threat: true },
      { name: 'Analog AV 2.4',  start: '2.400 GHz',  end: '2.483 GHz',  notes: 'Analog video TX, nannycams', threat: true },
      { name: 'Analog AV 5.8',  start: '5.725 GHz',  end: '5.850 GHz',  notes: 'Analog video TX, FPV drones', threat: true },
    ],
  },
  {
    category: 'Cellular',
    bands: [
      { name: 'GSM 850',    start: '824 MHz',   end: '894 MHz',   notes: 'US GSM uplink/downlink, GSM bugs common here', threat: true },
      { name: 'GSM 1900',   start: '1850 MHz',  end: '1990 MHz',  notes: 'US PCS GSM, some GSM bugs' },
      { name: 'LTE B12/17', start: '699 MHz',   end: '716 MHz',   notes: 'US LTE low-band (AT&T/T-Mobile)' },
      { name: 'LTE B13',    start: '777 MHz',   end: '787 MHz',   notes: 'Verizon LTE uplink' },
      { name: '3G UMTS',    start: '1710 MHz',  end: '2170 MHz',  notes: 'AWS, PCS bands; older IoT devices' },
      { name: '4G LTE',     start: '700 MHz',   end: '2700 MHz',  notes: 'Wide range; GPS trackers, cellular bugs', threat: true },
      { name: '5G Sub-6',   start: '617 MHz',   end: '6000 MHz',  notes: 'Broad range; newer IoT/trackers' },
    ],
  },
  {
    category: 'Public Safety / Government',
    bands: [
      { name: 'VHF Low',      start: '25 MHz',    end: '50 MHz',    notes: 'NOAA, military, some fixed/mobile' },
      { name: 'VHF High',     start: '136 MHz',   end: '174 MHz',   notes: 'Aircraft, public safety, amateur (2m)' },
      { name: 'UHF Public Safety', start: '380 MHz', end: '512 MHz', notes: 'P25, TETRA, federal agencies', threat: true },
      { name: 'FirstNet',     start: '758 MHz',   end: '769 MHz',   notes: 'First Responder Network Authority (AT&T)' },
      { name: 'SINCGARS',     start: '30 MHz',    end: '87.975 MHz',notes: 'US Army tactical radio (FHSS)' },
      { name: 'HAVE QUICK',   start: '225 MHz',   end: '400 MHz',   notes: 'USAF ATC/tactical (FHSS, anti-jam)' },
      { name: 'GPS L1',       start: '1575.42 MHz', end: '1575.42 MHz', notes: 'GPS civilian, jammer target' },
      { name: 'GPS L2',       start: '1227.60 MHz', end: '1227.60 MHz', notes: 'GPS P(Y) code military' },
    ],
  },
  {
    category: 'Amateur Radio',
    bands: [
      { name: '160m', start: '1.800 MHz',  end: '2.000 MHz',  notes: 'Top band, ground wave propagation' },
      { name: '80m',  start: '3.500 MHz',  end: '4.000 MHz',  notes: 'Night skip, regional comms' },
      { name: '40m',  start: '7.000 MHz',  end: '7.300 MHz',  notes: 'Day/night, medium range' },
      { name: '20m',  start: '14.000 MHz', end: '14.350 MHz', notes: 'DX workhorse, HF' },
      { name: '2m',   start: '144.0 MHz',  end: '148.0 MHz',  notes: 'Local VHF, FM voice, APRS' },
      { name: '70cm', start: '420.0 MHz',  end: '450.0 MHz',  notes: 'UHF, ATV, linking, satellites' },
    ],
  },
]

// ─── TSCM threat devices ────────────────────────────────────────────────────

export interface TSCMDevice {
  name: string
  freqRange: string
  modulation: string
  notes: string
  detectionHint: string
  riskLevel: 'HIGH' | 'MED' | 'LOW'
}

export const tscmDevices: TSCMDevice[] = [
  {
    name: 'RF Audio Bug (VHF)',
    freqRange: '88–108 MHz',
    modulation: 'FM',
    notes: 'Hides in commercial FM broadcast band. Cheap, widely available.',
    detectionHint: 'Scan FM band with SDR; look for non-broadcast carriers',
    riskLevel: 'HIGH',
  },
  {
    name: 'RF Audio Bug (UHF)',
    freqRange: '300–500 MHz',
    modulation: 'FM / NFM',
    notes: 'Common bug range. ISM 433 MHz particularly active.',
    detectionHint: 'Wideband UHF scan; NLJD for dormant devices',
    riskLevel: 'HIGH',
  },
  {
    name: 'GSM Bug',
    freqRange: '850 / 1900 MHz',
    modulation: 'TDMA bursts',
    notes: 'Calls or texts audio back. TDMA burst signature on spectrum analyzer.',
    detectionHint: 'Look for periodic GSM bursts (217 Hz flutter on AM); IMSI catcher',
    riskLevel: 'HIGH',
  },
  {
    name: '4G LTE Bug / Tracker',
    freqRange: '700–2700 MHz',
    modulation: 'OFDM',
    notes: 'Data exfil via LTE. Harder to detect than GSM. GPS trackers use same bands.',
    detectionHint: 'Look for LTE bands not matching known devices; NLJD sweep',
    riskLevel: 'HIGH',
  },
  {
    name: 'WiFi Hidden Camera',
    freqRange: '2.4 / 5 GHz',
    modulation: '802.11',
    notes: 'RTSP stream or cloud upload. SSID may be hidden. Often uses WPS.',
    detectionHint: 'Active WiFi scan; look for hidden SSIDs, unknown BSSIDs, strong RSSI from unexpected location',
    riskLevel: 'HIGH',
  },
  {
    name: 'Analog Video TX (1.2 GHz)',
    freqRange: '1.08–1.30 GHz',
    modulation: 'AM (VSB)',
    notes: 'Older covert cams. Continuous carrier. Easy to spot on spectrum.',
    detectionHint: 'Continuous carrier sweep 1–1.3 GHz; signal strength peaks near device',
    riskLevel: 'MED',
  },
  {
    name: 'Analog Video TX (2.4 GHz)',
    freqRange: '2.40–2.48 GHz',
    modulation: 'FM / AM',
    notes: 'Nannycam/covert cam. Competes with WiFi/BT band.',
    detectionHint: 'Look for non-802.11 carriers in 2.4 GHz; SDR sweep',
    riskLevel: 'HIGH',
  },
  {
    name: 'BLE Tracker (AirTag/Tile)',
    freqRange: '2.402–2.480 GHz',
    modulation: 'BLE (GFSK)',
    notes: 'Advertising on channels 37/38/39. 100 ms–few second intervals.',
    detectionHint: 'BLE scanner; look for unknown MACs with strong RSSI persisting across locations',
    riskLevel: 'MED',
  },
  {
    name: 'Laser Microphone',
    freqRange: 'Optical (IR/Visible)',
    modulation: 'Optical AM',
    notes: 'Reflects laser off window glass. Passive from attacker side.',
    detectionHint: 'Window film; vibration dampening; TSCM optical sweep (retroreflection)',
    riskLevel: 'HIGH',
  },
  {
    name: 'FHSS Bug',
    freqRange: '900 MHz / 2.4 GHz',
    modulation: 'FHSS',
    notes: 'Frequency hopping makes it hard to identify on swept displays.',
    detectionHint: 'Triggered scan; look for wideband intermittent energy; correlate with activity',
    riskLevel: 'HIGH',
  },
  {
    name: 'Mains Carrier Bug',
    freqRange: '10–500 kHz (powerline)',
    modulation: 'FSK / OFDM',
    notes: 'Transmits over AC mains wiring. No RF emission above floor.',
    detectionHint: 'Powerline carrier analyzer; conducted sweep on mains circuits',
    riskLevel: 'MED',
  },
  {
    name: 'IR Remote / Covert IR',
    freqRange: '850–950 nm (optical)',
    modulation: 'OOK / PWM',
    notes: 'Low-rate data or trigger signals. Invisible to naked eye.',
    detectionHint: 'Phone camera (most see IR); IR photodetector scan',
    riskLevel: 'LOW',
  },
]

// ─── WiFi channel map data ──────────────────────────────────────────────────

export interface WiFiChannel {
  channel: number
  centerMHz: number
  startMHz: number
  endMHz: number
  notes?: string
  overlap?: number[]
}

export const wifi24Channels: WiFiChannel[] = [
  { channel: 1,  centerMHz: 2412, startMHz: 2401, endMHz: 2423, notes: 'Non-overlapping', overlap: [2,3,4,5] },
  { channel: 2,  centerMHz: 2417, startMHz: 2406, endMHz: 2428, overlap: [1,3,4,5,6] },
  { channel: 3,  centerMHz: 2422, startMHz: 2411, endMHz: 2433, overlap: [1,2,4,5,6,7] },
  { channel: 4,  centerMHz: 2427, startMHz: 2416, endMHz: 2438, overlap: [1,2,3,5,6,7,8] },
  { channel: 5,  centerMHz: 2432, startMHz: 2421, endMHz: 2443, overlap: [1,2,3,4,6,7,8,9] },
  { channel: 6,  centerMHz: 2437, startMHz: 2426, endMHz: 2448, notes: 'Non-overlapping', overlap: [2,3,4,5,7,8,9,10] },
  { channel: 7,  centerMHz: 2442, startMHz: 2431, endMHz: 2453, overlap: [3,4,5,6,8,9,10,11] },
  { channel: 8,  centerMHz: 2447, startMHz: 2436, endMHz: 2458, overlap: [4,5,6,7,9,10,11] },
  { channel: 9,  centerMHz: 2452, startMHz: 2441, endMHz: 2463, overlap: [5,6,7,8,10,11] },
  { channel: 10, centerMHz: 2457, startMHz: 2446, endMHz: 2468, overlap: [6,7,8,9,11] },
  { channel: 11, centerMHz: 2462, startMHz: 2451, endMHz: 2473, notes: 'Non-overlapping (US max)', overlap: [7,8,9,10] },
  { channel: 12, centerMHz: 2467, startMHz: 2456, endMHz: 2478, notes: 'Restricted in US', overlap: [8,9,10,11] },
  { channel: 13, centerMHz: 2472, startMHz: 2461, endMHz: 2483, notes: 'EU/JP only', overlap: [9,10,11,12] },
  { channel: 14, centerMHz: 2484, startMHz: 2473, endMHz: 2495, notes: 'Japan only (802.11b)', overlap: [12,13] },
]

export const wifi5Channels = [
  { channel: 36,  centerMHz: 5180, band: 'UNII-1', dfs: false },
  { channel: 40,  centerMHz: 5200, band: 'UNII-1', dfs: false },
  { channel: 44,  centerMHz: 5220, band: 'UNII-1', dfs: false },
  { channel: 48,  centerMHz: 5240, band: 'UNII-1', dfs: false },
  { channel: 52,  centerMHz: 5260, band: 'UNII-2A', dfs: true },
  { channel: 56,  centerMHz: 5280, band: 'UNII-2A', dfs: true },
  { channel: 60,  centerMHz: 5300, band: 'UNII-2A', dfs: true },
  { channel: 64,  centerMHz: 5320, band: 'UNII-2A', dfs: true },
  { channel: 100, centerMHz: 5500, band: 'UNII-2C', dfs: true },
  { channel: 104, centerMHz: 5520, band: 'UNII-2C', dfs: true },
  { channel: 108, centerMHz: 5540, band: 'UNII-2C', dfs: true },
  { channel: 112, centerMHz: 5560, band: 'UNII-2C', dfs: true },
  { channel: 116, centerMHz: 5580, band: 'UNII-2C', dfs: true },
  { channel: 120, centerMHz: 5600, band: 'UNII-2C', dfs: true },
  { channel: 124, centerMHz: 5620, band: 'UNII-2C', dfs: true },
  { channel: 128, centerMHz: 5640, band: 'UNII-2C', dfs: true },
  { channel: 132, centerMHz: 5660, band: 'UNII-2C', dfs: true },
  { channel: 136, centerMHz: 5680, band: 'UNII-2C', dfs: true },
  { channel: 140, centerMHz: 5700, band: 'UNII-2C', dfs: true },
  { channel: 144, centerMHz: 5720, band: 'UNII-2C', dfs: true },
  { channel: 149, centerMHz: 5745, band: 'UNII-3', dfs: false },
  { channel: 153, centerMHz: 5765, band: 'UNII-3', dfs: false },
  { channel: 157, centerMHz: 5785, band: 'UNII-3', dfs: false },
  { channel: 161, centerMHz: 5805, band: 'UNII-3', dfs: false },
  { channel: 165, centerMHz: 5825, band: 'UNII-3', dfs: false },
]

// BLE channels: 0-39, advertising on 37/38/39
export const bleChannels = Array.from({ length: 40 }, (_, i) => ({
  channel: i,
  freqMHz: i < 11 ? 2402 + i * 2 : 2404 + i * 2,
  isAdvertising: i === 37 || i === 38 || i === 39,
  dataChannel: i < 37,
}))

// ─── Rogue AP / Evil Twin reference ────────────────────────────────────────

export interface RogueAPIndicator {
  indicator: string
  detail: string
  severity: 'CRITICAL' | 'HIGH' | 'MED'
}

export const rogueAPIndicators: RogueAPIndicator[] = [
  {
    indicator: 'Duplicate SSID, different BSSID',
    detail: 'Evil twin mirrors legitimate SSID. BSSID will differ from known AP. Check with saved networks or Wireshark.',
    severity: 'CRITICAL',
  },
  {
    indicator: 'Unusually strong RSSI',
    detail: 'Rogue placed close to target out-powers legitimate AP. Client will prefer it. Stronger ≠ legitimate.',
    severity: 'HIGH',
  },
  {
    indicator: 'Open auth on normally protected SSID',
    detail: 'Evil twin often drops WPA2 to capture plaintext. Compare AuthMode to known AP profile.',
    severity: 'CRITICAL',
  },
  {
    indicator: 'Downgraded encryption',
    detail: 'WPA3→WPA2 or WPA2→WEP/OPEN. PMKID/EAPOL capture doesn\'t need downgrade, but deauth+captive portal does.',
    severity: 'HIGH',
  },
  {
    indicator: 'Unknown OUI in BSSID',
    detail: 'First 3 octets identify manufacturer. Pineapple Mark VII uses GL.iNet OUI (94:83:C4). Lookup: wireshark.org/tools/oui-lookup',
    severity: 'HIGH',
  },
  {
    indicator: 'Deauth frames preceding association',
    detail: 'Attacker sends spoofed deauth (802.11 reason 7) to force client off legitimate AP. Captured in Wireshark as Type=0 Subtype=12.',
    severity: 'HIGH',
  },
  {
    indicator: 'Beacon interval anomaly',
    detail: 'Default 100 TU (102.4 ms). Pineapple/hostapd defaults differ. Significant deviation from known AP warrants investigation.',
    severity: 'MED',
  },
  {
    indicator: 'Captive portal on known SSID',
    detail: 'Unexpected redirect to login page on a network that never had one. Common Pineapple/hostapd-wpe pattern.',
    severity: 'CRITICAL',
  },
  {
    indicator: 'BSSID persistence after AP power-off',
    detail: 'Mesh networks (Eero, Orbi) may cache and re-advertise neighbor BSSIDs even after rogue device is removed. Verify physical device presence.',
    severity: 'HIGH',
  },
  {
    indicator: 'Non-standard channel for SSID',
    detail: 'If known AP is on ch 6, rogue on ch 11 with same SSID is suspicious. Some clients will still associate.',
    severity: 'MED',
  },
]

export interface RogueAPTool {
  tool: string
  platform: string
  primaryUse: string
  notes: string
}

export const rogueAPTools: RogueAPTool[] = [
  { tool: 'WiFi Pineapple Mark VII', platform: 'Dedicated HW', primaryUse: 'Evil twin, KARMA, PineAP recon', notes: 'Firmware 2.1.3. OUI: 94:83:C4. Broadcasts SSID list from PineAP pool.' },
  { tool: 'hostapd-wpe',            platform: 'Linux',         primaryUse: 'WPA-Enterprise credential capture', notes: 'PEAP/TTLS MitM. Captures MSCHAPv2 hashes for offline crack.' },
  { tool: 'airbase-ng',             platform: 'Linux',         primaryUse: 'Soft AP / fake AP flood',          notes: 'Part of aircrack-ng. Can flood thousands of fake BSSIDs.' },
  { tool: 'eaphammer',              platform: 'Linux',         primaryUse: 'WPA-Enterprise attacks',          notes: 'Successor to hostapd-wpe. GTC downgrade, PMKID capture.' },
  { tool: 'Bettercap',              platform: 'Linux/macOS',   primaryUse: 'WiFi MitM + HTTP interception',   notes: 'wifi.ap module + arp.spoof for full layer 2/3 intercept.' },
]
