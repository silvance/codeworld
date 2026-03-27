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

// ─── SDR Quick Reference ─────────────────────────────────────────────────────

export interface SDRDevice {
  name: string
  type: string
  freqRange: string
  sampleRate: string
  dynamicRange: string
  txCapable: boolean
  primaryUse: string[]
  tscmUse: string[]
  notes: string
  software: string[]
}

export const sdrDevices: SDRDevice[] = [
  {
    name: 'RTL-SDR (RTL2832U)',
    type: 'Receive-only SDR',
    freqRange: '500 kHz – 1.75 GHz (varies by dongle)',
    sampleRate: 'Up to 3.2 MS/s (stable ~2.4 MS/s)',
    dynamicRange: '~50 dB',
    txCapable: false,
    primaryUse: ['Wide frequency coverage for price', 'FM/AM/NFM receive', 'ADS-B, AIS, ACARS', 'Initial site survey'],
    tscmUse: ['Low-cost sweep tool', 'Baseline spectrum capture', 'Detecting broadband transmitters', 'WiFi/BT anomaly spotting with 2.4 GHz capable variant'],
    notes: 'RTL-SDR V3/V4 adds direct sampling for HF below 30 MHz. Excellent starting point. Susceptible to overload near strong transmitters — use attenuator. No bias tee on cheap variants.',
    software: ['SDR#', 'GQRX', 'SDR++', 'Kismet (WiFi)', 'dump1090 (ADS-B)'],
  },
  {
    name: 'HackRF One',
    type: 'Half-duplex TX/RX SDR',
    freqRange: '1 MHz – 6 GHz',
    sampleRate: 'Up to 20 MS/s',
    dynamicRange: '~50–60 dB',
    txCapable: true,
    primaryUse: ['Full spectrum coverage', 'Signal replay/transmission', 'Protocol analysis', 'FHSS characterization'],
    tscmUse: ['Broadband sweep 1 MHz–6 GHz', 'Transmit test signals for link budget verification', 'Replay attacks in training', 'WiFi Pineapple companion for out-of-band analysis', 'PortaPack: standalone field use'],
    notes: 'PortaPack H2/H4 adds screen + controls for standalone operation. 8-bit ADC limits dynamic range vs higher-end SDRs. Excellent for TSCM training scenarios — can simulate threat devices.',
    software: ['GNU Radio', 'SDR#', 'GQRX', 'URH (Universal Radio Hacker)', 'PortaPack Mayhem firmware'],
  },
  {
    name: 'SDRplay RSP1A / RSPdx',
    type: 'Receive-only SDR',
    freqRange: '1 kHz – 2 GHz (RSP1A) / 1 kHz – 2 GHz + (RSPdx)',
    sampleRate: 'Up to 10 MS/s',
    dynamicRange: '~100 dB (14-bit ADC)',
    txCapable: false,
    primaryUse: ['High dynamic range receive', 'HF through VHF/UHF coverage', 'Professional-grade spectrum monitoring'],
    tscmUse: ['High-sensitivity sweep', 'Detecting low-power bugs near noise floor', 'HF carrier current analysis', 'Better strong-signal rejection than RTL-SDR near transmitter sites'],
    notes: 'RSP1A: ~$100. RSPdx adds enhanced HF and better selectivity. SDRuno software well-integrated. 14-bit ADC significantly improves weak signal detection vs 8-bit RTL-SDR. Best value for serious TSCM use.',
    software: ['SDRuno', 'HDSDR', 'SDR#', 'GQRX'],
  },
  {
    name: 'Airspy HF+ Discovery',
    type: 'Receive-only SDR (HF specialist)',
    freqRange: '0.5 kHz – 31 MHz / 60–260 MHz',
    sampleRate: 'Up to 36 MS/s IQ',
    dynamicRange: '~120 dB',
    txCapable: false,
    primaryUse: ['Best-in-class HF reception', 'Shortwave, mediumwave, LF', 'Carrier current / powerline analysis'],
    tscmUse: ['Powerline carrier bug detection (10–500 kHz)', 'Very low frequency bug detection', 'TEMPEST-adjacent low-frequency emissions'],
    notes: 'Exceptional HF performance. Not suited for UHF/microwave. Pair with a separate UHF SDR for complete coverage. Overkill for basic TSCM but best tool for powerline carrier analysis.',
    software: ['SDR#', 'HDSDR', 'Airspy SDR#'],
  },
  {
    name: 'TinySA Ultra',
    type: 'Spectrum analyzer (not SDR)',
    freqRange: '100 kHz – 5.3 GHz',
    sampleRate: 'N/A (swept analyzer)',
    dynamicRange: '~80–90 dB',
    txCapable: true,
    primaryUse: ['Handheld spectrum analysis', 'Signal level measurement', 'Filter characterization', 'Field-portable sweep'],
    tscmUse: ['Primary field sweep tool', 'Waterfall display for FHSS detection', 'Precise signal level measurement in dBm', 'In-room walk-around with antenna', 'Battery-powered: no laptop needed'],
    notes: 'Best portable sweep tool for TSCM work. Waterfall mode catches FHSS bursts. Touch screen. USB-C charging. ~$100. TinySA Basic covers to 960 MHz only — get Ultra for 5.3 GHz. tinySA-App on PC adds logging.',
    software: ['TinySA-App (Windows/Linux)', 'NanoVNA Saver (companion)'],
  },
  {
    name: 'Flipper Zero',
    type: 'Multi-protocol portable tool',
    freqRange: '300–928 MHz (CC1101 sub-GHz) + NFC + RFID + IR + iButton',
    sampleRate: 'Limited (protocol tool, not wideband SDR)',
    dynamicRange: 'N/A',
    txCapable: true,
    primaryUse: ['Sub-GHz signal capture/replay', 'RFID/NFC analysis', 'IR capture/replay', 'Key fob analysis'],
    tscmUse: ['Detecting and characterizing 315/433/868/915 MHz devices', 'Key fob replay in physical security assessments', 'RFID reader detection', 'Momentum firmware: WiFi DevBoard adds 2.4 GHz scanning'],
    notes: 'Not a spectrum analyzer — cannot do wideband sweep. Protocol-specific tool. Momentum/Unleashed firmware significantly expands capability. WiFi DevBoard required for 2.4 GHz. Good complement to TinySA for targeted protocol analysis.',
    software: ['Flipper Zero firmware', 'Momentum firmware', 'qFlipper (PC companion)'],
  },
]

// ─── Sweep Methodology ───────────────────────────────────────────────────────

export interface SweepStep {
  phase: string
  step: string
  actions: string[]
  notes: string
}

export const sweepMethodology: SweepStep[] = [
  {
    phase: 'Pre-sweep',
    step: 'Documentation and baseline',
    actions: [
      'Photograph entire space before touching anything',
      'Document all electronic devices present (serial numbers, location)',
      'Obtain floor plan — note power outlets, HVAC runs, false ceilings',
      'Identify all authorized APs, cameras, phones — build known-good list',
      'Check WiFi networks expected vs found (AP scan before team arrives)',
      'Note all utilities: power, phone, cable TV, alarm system entry points',
    ],
    notes: 'Never enter the space with the client until baseline is complete. Client presence during sweep can contaminate findings and create chain of custody issues.',
  },
  {
    phase: 'Pre-sweep',
    step: 'Establish RF baseline outside space',
    actions: [
      'Scan full spectrum (1 MHz – 6 GHz) from outside/hallway before entering',
      'Document ambient signals: cellular towers, WiFi, broadcast — mark as known',
      'Note signal levels in dBm for ambient sources',
      'Identify frequency ranges with elevated noise (HVAC motors, lighting, UPS)',
      'Run baseline with TinySA waterfall for 5 min to characterize environment',
    ],
    notes: 'This baseline is your reference. Any signal inside the space that does not appear outside, or appears at significantly higher level inside, is anomalous.',
  },
  {
    phase: 'RF Sweep',
    step: 'Systematic spectrum scan',
    actions: [
      'Divide spectrum into bands: <30 MHz, 30–300 MHz, 300–1000 MHz, 1–3 GHz, 3–6 GHz',
      'Sweep each band with appropriate antenna (rod for VHF, directional for UHF+)',
      'Set RBW narrow enough to resolve signals — 10 kHz for narrow band regions',
      'Walk grid pattern — stop and dwell at walls, furniture, fixtures',
      'Flag any unidentified carrier: note frequency, level, modulation, location',
      'Use directional antenna (yagi/log periodic) to bearing-find flagged signals',
      'Check ISM bands thoroughly: 433, 868, 915 MHz, 2.4 GHz, 5.8 GHz',
    ],
    notes: 'Slow down near power outlets, light switches, smoke detectors, clocks, picture frames, plants, books. Common hiding spots for passive or semi-passive devices.',
  },
  {
    phase: 'RF Sweep',
    step: 'FHSS/burst signal detection',
    actions: [
      'Set analyzer to max hold / waterfall mode for 5–10 minutes per band',
      'FHSS leaves characteristic "striped" waterfall pattern across hopping range',
      'Short-burst devices: check at different times — some transmit only when triggered',
      'GSM bugs: listen for 217 Hz flutter on AM mode near 850/1900 MHz',
      'Correlate transmissions with conversation — triggered bugs activate on sound',
      'Use correlation test: make noise, watch for burst activity on spectrum',
    ],
    notes: 'FHSS detection requires patience. Run waterfall for extended periods. HackRF + GNU Radio or SDR++ with waterfall is effective. TinySA Ultra waterfall mode works well for this.',
  },
  {
    phase: 'Physical Sweep',
    step: 'NLJD sweep',
    actions: [
      'NLJD detects semiconductor junctions regardless of RF emission',
      'Sweep at ~6 inches from all surfaces — walls, ceiling, floor, furniture',
      'Second harmonic (2f) indicates electronic device; third harmonic (3f) may indicate corrosion',
      'Flag any NLJD hit for physical inspection',
      'Common NLJD false positives: light switches, thermostats, smoke detectors (expected)',
      'Unexpected NLJD hits in walls, furniture, ceilings require physical investigation',
    ],
    notes: 'NLJD is the only tool that detects dormant (non-transmitting) devices. Critical for finding acoustic devices with scheduled or on-demand activation. Cannot be defeated by powering off the device.',
  },
  {
    phase: 'Physical Sweep',
    step: 'Physical inspection',
    actions: [
      'Inspect all power outlets, phone jacks, ethernet ports, cable TV ports',
      'Check outlet faceplates — bugs commonly installed behind them',
      'Examine smoke detectors, exit signs, clocks, picture frames',
      'Check under tables, chairs, desks — especially conference tables',
      'Inspect HVAC vents, duct tape on vents, ceiling tiles near meeting areas',
      'Check for recently patched drywall, fresh paint patches, new screws in existing hardware',
      'Examine all AC adapters — bug in wall wart is common technique',
      'Check plants — waterproof bugs are routinely placed in soil',
    ],
    notes: 'Look for disruption indicators: paint mismatch, fresh caulk, slight misalignment, new hardware among old, unusual weight in objects. Trust your instincts on things that "look wrong."',
  },
  {
    phase: 'Physical Sweep',
    step: 'Telephone and network infrastructure',
    actions: [
      'Test all phone lines with TALAN or equivalent — measure line voltage, detect parallel devices',
      'Check telephone junction boxes — common installation point',
      'Inspect ethernet patch panels and cable runs for unauthorized splices',
      'Identify all network devices — compare to documented inventory',
      'Check for unauthorized WiFi APs or cellular extenders',
      'Inspect power strips and UPS devices — bugs powered from these',
    ],
    notes: 'Telephone infrastructure is often overlooked. Series and parallel bugs on POTS lines have very different electrical signatures. TALAN (REI) is purpose-built for this analysis.',
  },
  {
    phase: 'Post-sweep',
    step: 'Documentation and reporting',
    actions: [
      'Photograph all findings with scale reference',
      'Document all flagged signals: frequency, level, modulation, bearing, location',
      'Note all items physically inspected and result',
      'Prepare chain of custody documentation for any recovered devices',
      'Issue verbal briefing to client before leaving — do not leave written report in swept space',
      'Recommend re-sweep interval based on threat level (30–90 days typical)',
    ],
    notes: 'Never discuss findings on any communication system that was in the swept space. Brief client verbally in a separate location. Written report delivered separately and securely.',
  },
]

// ─── Covert Device Physical Indicators ───────────────────────────────────────

export interface PhysicalIndicator {
  category: string
  indicator: string
  detail: string
  locations: string[]
  riskLevel: 'CRITICAL' | 'HIGH' | 'MED'
}

export const physicalIndicators: PhysicalIndicator[] = [
  // Hardware anomalies
  { category: 'Hardware anomalies', indicator: 'New screws in old hardware', detail: 'Fresh Phillips/torx screws with no paint wear, while adjacent screws show age. Indicates device was recently opened. Check outlet plates, switch covers, junction boxes.', locations: ['Power outlets', 'Light switches', 'Phone jacks', 'Ceiling fixtures'], riskLevel: 'HIGH' },
  { category: 'Hardware anomalies', indicator: 'Screw head mismatch', detail: 'Different screw head types on same device (e.g., slot + Phillips on same faceplate). Indicator of non-factory reassembly.', locations: ['Power outlets', 'Network jacks', 'Any screwed enclosure'], riskLevel: 'HIGH' },
  { category: 'Hardware anomalies', indicator: 'Extra weight in objects', detail: 'Clocks, books, picture frames, smoke detectors, or decorative items noticeably heavier than expected. Battery + electronics add significant mass.', locations: ['Wall clocks', 'Books', 'Picture frames', 'Decorative items'], riskLevel: 'HIGH' },
  { category: 'Hardware anomalies', indicator: 'Small hole in surface', detail: '1–3 mm pinhole in wall, ceiling tile, furniture, or object. Pinhole camera lens or microphone port. Check at eye level near meeting areas.', locations: ['Walls facing meeting areas', 'Ceiling tiles', 'Air purifiers', 'Bookshelves'], riskLevel: 'CRITICAL' },
  { category: 'Hardware anomalies', indicator: 'AC adapter anomaly', detail: 'Wall wart or USB charger that runs warm when nothing is plugged in, or has ventilation holes on a sealed device. Bug + transmitter draws ~100–500mA continuously.', locations: ['Power strips', 'USB chargers', 'Wall adapters'], riskLevel: 'HIGH' },
  // Surface anomalies
  { category: 'Surface anomalies', indicator: 'Fresh paint patch', detail: 'Small area of new paint on wall, ceiling, or surface. Bug installation requires access hole — often patched after installation. Look for texture/sheen mismatch.', locations: ['Walls near outlets', 'Ceiling near HVAC', 'Behind furniture'], riskLevel: 'HIGH' },
  { category: 'Surface anomalies', indicator: 'Fresh caulk or sealant', detail: 'New caulk in an otherwise aged environment. Common when closing access holes or re-sealing outlet boxes after installation.', locations: ['Baseboards', 'Window frames', 'Outlet surrounds', 'HVAC vents'], riskLevel: 'MED' },
  { category: 'Surface anomalies', indicator: 'Disturbed dust patterns', detail: 'Dust accumulation interrupted by recent access. Check tops of ceiling tiles, inside HVAC vents, back of bookshelves.', locations: ['Ceiling tiles', 'HVAC ducts', 'Shelving tops'], riskLevel: 'MED' },
  { category: 'Surface anomalies', indicator: 'Ceiling tile misalignment', detail: 'Tile slightly raised, offset, or with fingerprint marks on edge. Above-ceiling placement is extremely common for audio bugs.', locations: ['Dropped ceilings', 'Conference rooms', 'Executive offices'], riskLevel: 'HIGH' },
  // Power and wiring
  { category: 'Power and wiring', indicator: 'Unexpected wire or cable', detail: 'Cable entering conduit, outlet, or junction box that cannot be accounted for in building infrastructure. Extra wire in phone/ethernet run.', locations: ['Junction boxes', 'Outlet boxes', 'Cable bundles', 'Conduit'], riskLevel: 'CRITICAL' },
  { category: 'Power and wiring', indicator: 'Outlet with no circuit', detail: 'Power outlet not connected to any circuit on breaker panel. May be wired to separate power source feeding a device. Test with outlet tester.', locations: ['Unusual outlet locations', 'Outlets behind furniture'], riskLevel: 'HIGH' },
  { category: 'Power and wiring', indicator: 'Telephone line anomalies', detail: 'Voltage on unused phone lines, additional conductors in phone cable, series resistance change indicating parallel load. Measure with TALAN or multimeter.', locations: ['Telephone junction boxes', 'Wall jacks', 'Patch panels'], riskLevel: 'CRITICAL' },
  // Environmental
  { category: 'Environmental', indicator: 'Recently moved furniture', detail: 'Marks on carpet, floor, or wall indicating furniture was recently repositioned. May indicate installation access or device placement behind/under furniture.', locations: ['Large furniture items', 'Conference tables', 'Filing cabinets'], riskLevel: 'MED' },
  { category: 'Environmental', indicator: 'New item in established environment', detail: 'Object that does not match the age, style, or inventory of the space. Gift left after a meeting is a classic introduction vector.', locations: ['Conference tables', 'Desk surfaces', 'Bookshelves', 'Plants'], riskLevel: 'HIGH' },
  { category: 'Environmental', indicator: 'Smoke detector anomalies', detail: 'Smoke detector not on building inventory, different brand from others, mounted in unusual location, or with small lens visible. Most effective all-in-one bug concealment.', locations: ['Ceilings throughout', 'Especially conference rooms'], riskLevel: 'CRITICAL' },
]

// ─── Modulation Reference ────────────────────────────────────────────────────

export interface ModulationType {
  name: string
  fullName: string
  bandwidthTypical: string
  visualSignature: string
  audioSignature: string
  commonUses: string[]
  tscmRelevance: string
  detectionTips: string
}

export const modulations: ModulationType[] = [
  {
    name: 'AM',
    fullName: 'Amplitude Modulation',
    bandwidthTypical: '±5–10 kHz (10–20 kHz total)',
    visualSignature: 'Symmetric sidebands around carrier. Carrier always present. Width proportional to audio bandwidth.',
    audioSignature: 'Demodulates with any AM receiver. Carrier present even with no audio.',
    commonUses: ['Broadcast radio (AM band)', 'Older analog video carriers', 'NLJD reference signals', 'Cheap legacy bugs'],
    tscmRelevance: 'Older/cheap audio bugs often use wideband FM or AM. Continuous carrier makes AM bugs easy to spot — visible as constant peak on spectrum.',
    detectionTips: 'Look for unknown carriers with constant amplitude. Demodulate in AM mode and listen. GSM flutter (217 Hz) detectable in AM mode near GSM frequencies.',
  },
  {
    name: 'FM / NFM',
    fullName: 'Frequency Modulation / Narrow FM',
    bandwidthTypical: 'Broadcast FM: ±75 kHz (200 kHz total). NFM: ±2.5–5 kHz (5–12.5 kHz total)',
    visualSignature: 'Wideens under modulation. No carrier visible — energy spreads into sidebands. Carson\'s rule: BW = 2(Δf + fm).',
    audioSignature: 'Clear audio when demodulated in FM mode. Silence causes narrow signal. Voice causes it to widen visibly.',
    commonUses: ['Most analog audio bugs', 'Two-way radio (NFM)', 'Broadcast FM', 'Analog video subcarriers'],
    tscmRelevance: 'Dominant modulation type for room audio bugs. Bugs hiding in broadcast FM band use wideband FM. Outside broadcast band use NFM on arbitrary frequencies.',
    detectionTips: 'Scan for unknown NFM carriers across full spectrum. Width in NFM: 5–15 kHz typical for voice. Demodulate suspicious carriers in NFM mode and listen.',
  },
  {
    name: 'SSB',
    fullName: 'Single Sideband',
    bandwidthTypical: '±3 kHz (3 kHz total — half of AM)',
    visualSignature: 'One sideband only. No carrier. Appears as asymmetric lump next to nothing. Very narrow vs AM.',
    audioSignature: 'Sounds like "duck talk" if demodulated in AM or FM. Requires USB/LSB demodulation for intelligible audio.',
    commonUses: ['HF amateur radio', 'Military/government HF comms', 'Some maritime and aviation', 'Some upscale bugs'],
    tscmRelevance: 'Less common in bugs due to complexity, but used in higher-end devices. No carrier means harder to detect than AM.',
    detectionTips: 'Appears as asymmetric sideband. Try USB then LSB demodulation. SSB presence on unexpected HF frequencies warrants investigation.',
  },
  {
    name: 'FHSS',
    fullName: 'Frequency Hopping Spread Spectrum',
    bandwidthTypical: 'Instantaneous: 1–2 MHz per hop. Total hopping range: typically 25–83 MHz',
    visualSignature: 'Waterfall shows vertical stripes at random frequencies across hopping range. Max hold shows uniform noise floor elevation across range. Not visible on swept display.',
    audioSignature: 'Sounds like static/clicks on any single frequency. Cannot demodulate at single frequency.',
    commonUses: ['Bluetooth (2.402–2.480 GHz, 79 channels)', 'DECT phones (1.88–1.90 GHz)', 'Military radios (SINCGARS, HAVE QUICK)', 'High-end covert bugs', 'Some 900 MHz cordless phones'],
    tscmRelevance: 'High-end bugs use FHSS specifically to defeat swept spectrum analyzers. Requires waterfall mode or correlation techniques to detect.',
    detectionTips: 'Waterfall (time vs frequency): look for vertical stripes across wide range. Max hold: uniform noise elevation across hopping band. Correlate with audio: make noise, watch for increased hopping activity. Dwell time per hop: 1–10 ms for BT.',
  },
  {
    name: 'OFDM',
    fullName: 'Orthogonal Frequency Division Multiplexing',
    bandwidthTypical: '20 MHz (WiFi 2.4/5 GHz), 200 kHz (LTE subcarrier), variable',
    visualSignature: 'Very flat-topped wideband signal. Sharp edges. Looks like a "brick" on spectrum. Extremely flat spectrum density across bandwidth.',
    audioSignature: 'Digital data — no audio without full protocol decode.',
    commonUses: ['WiFi (802.11)', '4G LTE / 5G', 'Digital TV (DVB)', 'WiMAX', 'Modern IP-based covert devices'],
    tscmRelevance: 'All modern WiFi cameras and LTE bugs use OFDM. Distinguishable from noise by extremely flat top and sharp band edges.',
    detectionTips: 'Flat-topped brick shape on spectrum. 20 MHz wide on WiFi channels. Check channel/frequency against known AP inventory. Unknown OFDM signal = unknown device transmitting data.',
  },
  {
    name: 'DSSS',
    fullName: 'Direct Sequence Spread Spectrum',
    bandwidthTypical: '20–22 MHz (802.11b), varies',
    visualSignature: 'Appears as elevated noise floor across wide bandwidth. No visible carrier. Looks similar to OFDM but with raised-cosine spectrum shape (rounded edges vs flat).',
    audioSignature: 'Digital data.',
    commonUses: ['Legacy 802.11b WiFi', 'GPS signals (1.023 MHz chip rate)', 'Some military comms', 'CDMA cellular'],
    tscmRelevance: 'Older WiFi devices and some legacy covert equipment. Less common now. GPS-based trackers use DSSS for the L1 signal.',
    detectionTips: 'Elevated noise floor with rounded spectral edges. GPS L1 at 1575.42 MHz is a known DSSS signal — useful for calibration. Unknown DSSS signal on unexpected frequency warrants investigation.',
  },
  {
    name: 'OOK/ASK',
    fullName: 'On-Off Keying / Amplitude Shift Keying',
    bandwidthTypical: '±bandwidth of data rate, typically 1–10 kHz',
    visualSignature: 'Carrier appears and disappears with data. On spectrum: carrier present when transmitting "1", absent for "0". Very narrow bandwidth.',
    audioSignature: 'Sounds like Morse code or tones in AM mode.',
    commonUses: ['Key fobs (315/433/915 MHz)', 'Garage door openers', 'Tire pressure sensors', 'Simple ISM band sensors', 'IR remotes (infrared OOK)'],
    tscmRelevance: 'Short-range devices: key fobs, simple sensors. Intermittent carrier makes detection timing-dependent. Important for detecting active keying-type bugs.',
    detectionTips: 'Short bursts at ISM frequencies (315/433/868/915 MHz). Demodulate in AM mode — will hear data tones. Use Flipper Zero to capture and decode.',
  },
  {
    name: 'BFSK / GFSK',
    fullName: 'Binary FSK / Gaussian FSK',
    bandwidthTypical: '±deviation, typically 25–250 kHz total',
    visualSignature: 'Two discrete carriers visible when data transmits. Carrier jumps between two frequencies. Gaussian shaping (GFSK) softens transitions — harder to see discrete tones.',
    audioSignature: 'Two-tone warble in FM mode.',
    commonUses: ['Bluetooth (GFSK)', 'BLE (GFSK)', 'LoRa (chirp spread spectrum variant)', 'Z-Wave (GFSK)', 'Many IoT sensors'],
    tscmRelevance: 'BLE trackers (AirTag, Tile) use GFSK on advertising channels 37/38/39. Z-Wave home automation on 908 MHz. IoT-based covert devices.',
    detectionTips: 'BLE: GFSK at 2402/2426/2480 MHz. Demodulate in NFM — hear two-tone warble. Flipper Zero can capture and decode BLE advertising. Unknown GFSK at ISM frequencies = unknown IoT device.',
  },
]

// ─── Counter-Surveillance Indicators ─────────────────────────────────────────

export interface CounterSurvIndicator {
  category: string
  indicator: string
  detail: string
  action: string
  riskLevel: 'CRITICAL' | 'HIGH' | 'MED'
}

export const counterSurvIndicators: CounterSurvIndicator[] = [
  // Foot surveillance
  { category: 'Foot surveillance', indicator: 'Same individual seen twice in different locations', detail: 'Seeing the same person at your hotel, the meeting location, and a restaurant is not coincidence if the locations are not geographically connected. Surveillance teams rotate individuals — a 3rd sighting confirms surveillance.', action: 'Do not acknowledge. Vary route. Alert team. Document: description, time, location.', riskLevel: 'CRITICAL' },
  { category: 'Foot surveillance', indicator: 'Individual maintaining distance despite pace changes', detail: 'Speed up then slow down suddenly. Surveilling individual will adjust to maintain distance. Test: stop suddenly and check window reflection. Surveillance operative may over-shoot or stop unnaturally.', action: 'Conduct "dry cleaning" — route through areas forcing close proximity. Counter-surveillance team can confirm.', riskLevel: 'HIGH' },
  { category: 'Foot surveillance', indicator: 'Eye contact avoidance', detail: 'People naturally make brief eye contact then look away. Professional surveillance operatives avoid eye contact entirely — unnatural in social settings.', action: 'Note subject, do not stare. Brief direct look — surveillance operative will look away sharply.', riskLevel: 'MED' },
  { category: 'Foot surveillance', indicator: 'Inappropriate attire for environment', detail: 'Overdressed or underdressed for location. Business suit in a casual setting. Casual dress in a formal venue. Equipment concealment may limit wardrobe options.', action: 'Observe without reaction. Note for pattern building.', riskLevel: 'MED' },
  // Vehicle surveillance
  { category: 'Vehicle surveillance', indicator: 'Vehicle seen at multiple locations', detail: '3 sightings of same vehicle = confirmed surveillance. 2 sightings of same make/model/color at different locations = suspicious. Note partial plates.', action: 'Do not take evasive action prematurely. Confirm with route changes. Report to security team.', riskLevel: 'CRITICAL' },
  { category: 'Vehicle surveillance', indicator: 'Parked vehicle with occupied driver', detail: 'Vehicle parked with driver remaining inside for extended period, especially near your residence, office, or meeting location. Engine may run/stop periodically.', action: 'Note make, model, color, partial plate, time, location. Do not approach. Report.', riskLevel: 'HIGH' },
  { category: 'Vehicle surveillance', indicator: 'Vehicle maintaining follow distance through turns', detail: 'Most drivers behind you turn at different points. A vehicle making 3+ consecutive turns behind you — especially into low-traffic areas — is likely following. Test: take an unnecessary turn.', action: 'Conduct SDR (Surveillance Detection Route). Vary speed. Do not attempt aggressive evasion in most contexts.', riskLevel: 'CRITICAL' },
  { category: 'Vehicle surveillance', indicator: 'Unusual vehicles near facility', detail: 'Utility vehicles (phone, cable, electric) parked for extended periods without active work. Delivery vehicles that do not make deliveries. White vans with no markings.', action: 'Note details. If vehicle has been stationary >2 hours with no activity, report to facility security.', riskLevel: 'HIGH' },
  // Technical surveillance
  { category: 'Technical surveillance', indicator: 'Hotel room accessed during absence', detail: 'Items moved from original position. Laptop at different angle. Bag zips not in original orientation. Suitcase repositioned. Do-Not-Disturb ignored. Hair placed across items disturbed.', action: 'Document with photos before leaving room. Use commercially available travel security locks. Keep sensitive material encrypted and on your person.', riskLevel: 'CRITICAL' },
  { category: 'Technical surveillance', indicator: 'Unexpected wireless networks', detail: 'New WiFi SSID that did not exist on previous scan. Network mimicking hotel/venue name with slight difference. Strong signal from unexpected direction. Open network where only secured networks existed.', action: 'Do not connect. Run WiFi scan immediately on arrival and departure. Compare. Report any new networks.', riskLevel: 'HIGH' },
  { category: 'Technical surveillance', indicator: 'Phone/device battery draining unusually fast', detail: 'Spyware, stalkerware, and active cell-site simulators cause elevated battery drain. Location services active without permission. Background data usage elevated.', action: 'Check Settings → Battery → Background App Refresh. Check for unknown apps. Consider factory reset of device used in sensitive meetings. Use burner device for travel to high-risk locations.', riskLevel: 'HIGH' },
  { category: 'Technical surveillance', indicator: 'Unusual interference on communications', detail: 'Call quality degradation, dropped calls, background noise, or echo on calls that previously had none. May indicate active intercept or nearby cell-site simulator.', action: 'Cease sensitive discussion. Use end-to-end encrypted comms (Signal). Move location. Report.', riskLevel: 'HIGH' },
  // Physical access
  { category: 'Physical access', indicator: 'Evidence of surreptitious entry', detail: 'Lock pick scratches at keyway. Door frame gap marks. Window latch disturbed. Security seal broken or replaced. Motion sensor history accessed without authorization.', action: 'Do not disturb. Treat as crime scene. Photograph and report. Conduct full sweep before re-using space for sensitive discussions.', riskLevel: 'CRITICAL' },
  { category: 'Physical access', indicator: 'Unfamiliar service personnel', detail: 'Maintenance, cleaning, IT, or delivery personnel who cannot be verified against building roster or scheduled service calls. Particularly concerning after irregular hours.', action: 'Verify credentials with facility management directly (not via number given by the individual). Escort during any access to sensitive areas. Log entry/exit.', riskLevel: 'HIGH' },
]

// ─── Common Bug Frequencies ───────────────────────────────────────────────────

export interface BugFreqEntry {
  category: string
  freqRange: string
  modulation: string
  powerTypical: string
  rangeTypical: string
  activationType: string
  notes: string
}

export const bugFrequencies: BugFreqEntry[] = [
  // Audio bugs
  { category: 'Audio — VHF FM (broadcast hide)', freqRange: '88–108 MHz', modulation: 'Wideband FM', powerTypical: '1–10 mW', rangeTypical: '50–200 m', activationType: 'Continuous', notes: 'Hides in commercial broadcast band. Detectable as unknown carrier between stations. Cheap and widely available. Retrieve with any FM radio.' },
  { category: 'Audio — VHF FM (open)', freqRange: '108–174 MHz', modulation: 'NFM', powerTypical: '10–100 mW', rangeTypical: '100–500 m', activationType: 'Continuous or VOX', notes: 'Above broadcast band. Less competition. Detectable by standard VHF scan. NFM demodulation reveals voice.' },
  { category: 'Audio — UHF FM', freqRange: '300–512 MHz', modulation: 'NFM', powerTypical: '10–200 mW', rangeTypical: '100 m–1 km', activationType: 'Continuous, VOX, or scheduled', notes: 'Most common range for analog audio bugs. 433.92 MHz ISM particularly popular. NFM scan across this entire range is essential.' },
  { category: 'Audio — ISM 433 MHz', freqRange: '433.05–434.79 MHz', modulation: 'OOK/FSK/FM', powerTypical: '1–10 mW', rangeTypical: '10–200 m', activationType: 'Continuous or burst', notes: 'Heavily used ISM band. Legitimate devices (weather sensors, key fobs) complicate analysis. Look for unexpected carriers with voice modulation. LoRa/FSK bugs use this band in EU.' },
  { category: 'Audio — ISM 900 MHz', freqRange: '902–928 MHz', modulation: 'FHSS/FSK/FM', powerTypical: '10–100 mW', rangeTypical: '100 m–1 km', activationType: 'Continuous or burst', notes: 'US ISM band. Less congested than 2.4 GHz. FHSS bugs difficult to detect. Extended range possible with directional antenna at receiver.' },
  { category: 'Audio — GSM 850', freqRange: '869–894 MHz (downlink) / 824–849 MHz (uplink)', modulation: 'TDMA bursts (GMSK)', powerTypical: '0.8–2 W burst', rangeTypical: 'Cellular network range', activationType: 'On-demand dial-in or SMS trigger', notes: 'GSM bug: calls/texts audio back. Indefinite range. TDMA burst creates 217 Hz flutter detectable in AM mode near 850 MHz. IMSI catcher can detect actively transmitting GSM device.' },
  { category: 'Audio — GSM 1900', freqRange: '1930–1990 MHz (downlink)', modulation: 'TDMA bursts', powerTypical: '0.8–2 W burst', rangeTypical: 'Cellular network range', activationType: 'On-demand', notes: 'US PCS GSM band. Same detection method as 850 MHz. Less common than 850 in bug implementations but used where 850 is congested.' },
  { category: 'Audio — LTE/4G', freqRange: '700 MHz – 2.7 GHz (band dependent)', modulation: 'OFDM (LTE)', powerTypical: '0.2–0.6 W', rangeTypical: 'Cellular network range', activationType: 'Continuous data stream or on-demand', notes: 'Modern bugs. IP audio/video over LTE. Harder to detect than GSM — no characteristic flutter. NLJD critical for dormant detection. Unknown LTE device = serious threat.' },
  // Video bugs
  { category: 'Video — Analog 1.2 GHz', freqRange: '1.08–1.34 GHz', modulation: 'AM-VSB (analog video)', powerTypical: '10–500 mW', rangeTypical: '50–300 m', activationType: 'Continuous', notes: 'Older analog video TX. Continuous carrier — easy to detect on spectrum. Visible as AM carrier with wide bandwidth (~6 MHz). Popular in older surveillance equipment.' },
  { category: 'Video — Analog 2.4 GHz', freqRange: '2.400–2.483 GHz', modulation: 'FM or AM analog video', powerTypical: '10–200 mW', rangeTypical: '50–200 m', activationType: 'Continuous', notes: 'Nannycam/covert cam range. Competes with WiFi/BT. Detectable as non-802.11 carrier in 2.4 GHz band. Look for carriers that don\'t follow 802.11 channel spacing.' },
  { category: 'Video — Analog 5.8 GHz', freqRange: '5.725–5.850 GHz', modulation: 'FM analog video', powerTypical: '25–200 mW', rangeTypical: '50–150 m', activationType: 'Continuous', notes: 'FPV drone video TX, some surveillance cams. Upper end of standard WiFi 5 GHz. Analog carrier distinguishable from OFDM WiFi by spectral shape.' },
  { category: 'Video — WiFi Camera', freqRange: '2.4 / 5 GHz (802.11)', modulation: 'OFDM', powerTypical: '15–20 dBm', rangeTypical: 'WiFi range (30–100 m indoors)', activationType: 'Continuous streaming or motion-triggered', notes: 'Digital IP camera. RTSP stream or cloud upload. Detectable by unknown BSSID/SSID on WiFi scan. Strong RSSI from unexpected location is significant indicator.' },
  // Tracking
  { category: 'Tracking — BLE (AirTag/Tile)', freqRange: '2.402–2.480 GHz (advertising ch 37/38/39)', modulation: 'GFSK (BLE)', powerTypical: '0 dBm typical', rangeTypical: '10–30 m Bluetooth range, global via Find My', activationType: 'Periodic advertising (100 ms – few s)', notes: 'AirTag advertising interval ~2 s in motion. Unknown BLE MAC with consistent RSSI across locations = possible tracker. iOS/Android alerts after extended unknown tag following. Scan with nRF Connect or Bluetooth scanner.' },
  { category: 'Tracking — GPS/LTE', freqRange: 'GPS L1 receive (1575.42 MHz) + LTE uplink transmit', modulation: 'DSSS receive only (GPS) + LTE OFDM (report)', powerTypical: 'LTE transmit: 0.2 W burst', rangeTypical: 'Global', activationType: 'Periodic LTE burst (1 min – 1 hr interval)', notes: 'GPS receiver + LTE transmitter. Periodic LTE bursts difficult to catch without long dwell. Hidden magnetically under vehicle is most common placement. Check wheel wells, undercarriage, bumpers.' },
]

// ─── Tool Reference ───────────────────────────────────────────────────────────

export interface TSCMTool {
  name: string
  manufacturer: string
  category: string
  freqRange?: string
  primaryFunction: string
  keyFeatures: string[]
  limitations: string[]
  approxCost: string
  tscmRole: string
}

export const tscmTools: TSCMTool[] = [
  {
    name: 'TinySA Ultra',
    manufacturer: 'TinySA (open hardware)',
    category: 'Spectrum Analyzer',
    freqRange: '100 kHz – 5.3 GHz',
    primaryFunction: 'Portable swept spectrum analysis',
    keyFeatures: ['4-inch touchscreen', 'Waterfall display for FHSS', 'dBm level measurement', 'Battery powered', 'USB-C, ~$100', 'tinySA-App for PC logging'],
    limitations: ['No TX capability', 'Limited dynamic range vs lab equipment', 'Swept (not real-time) — may miss short bursts', '5.3 GHz ceiling misses 5.8 GHz band partially'],
    approxCost: '$100',
    tscmRole: 'Primary portable sweep tool. Best value for in-room walk-around sweeps. Waterfall catches FHSS better than swept display alone.',
  },
  {
    name: 'HackRF One + PortaPack',
    manufacturer: 'Great Scott Gadgets / PortaPack community',
    category: 'SDR Transceiver',
    freqRange: '1 MHz – 6 GHz',
    primaryFunction: 'Wideband software-defined radio TX/RX',
    keyFeatures: ['6 GHz ceiling covers 5.8 GHz video TX', 'TX capability for training scenarios', 'PortaPack: standalone without laptop', 'Open source hardware/firmware', 'Mayhem firmware: many built-in apps'],
    limitations: ['8-bit ADC limits sensitivity', 'Half-duplex only', 'No real-time wide bandwidth (20 MS/s max)', 'Requires laptop or PortaPack for use'],
    approxCost: '$340 (HackRF + PortaPack)',
    tscmRole: 'Wide coverage sweep companion. Training device simulation. PortaPack enables fully standalone field operation.',
  },
  {
    name: 'OSCOR Blue',
    manufacturer: 'REI (Research Electronics International)',
    category: 'Professional Spectrum Analyzer / TSCM',
    freqRange: '10 kHz – 24 GHz',
    primaryFunction: 'Professional TSCM spectrum analysis with correlation',
    keyFeatures: ['Real-time 24 GHz sweep', 'Built-in TSCM database of known signals', 'Automatic signal classification', 'GPS logging', 'Acoustic/RF correlation', 'REI-supported software'],
    limitations: ['Extremely expensive', 'Requires training for full capability', 'Overkill for basic TSCM'],
    approxCost: '$30,000+',
    tscmRole: 'Professional standard for thorough TSCM surveys. Automated signal classification and wide real-time bandwidth are primary advantages over SDR-based approaches.',
  },
  {
    name: 'REI TALAN',
    manufacturer: 'REI',
    category: 'Telephone Line Analyzer',
    freqRange: 'Audio and RF on telephone lines',
    primaryFunction: 'Telephone and line analysis for eavesdropping devices',
    keyFeatures: ['Detects series/parallel bugs', 'Measures line voltage and current', 'RF carrier detection on phone lines', 'Impedance analysis', 'Active/passive testing modes', 'DTMF and tone analysis'],
    limitations: ['POTS-specific — less relevant for VoIP', 'Cannot detect audio bugs not connected to line'],
    approxCost: '$6,000–8,000',
    tscmRole: 'Definitive tool for telephone infrastructure sweep. Essential for any facility with POTS lines. Detects bugs that RF sweep would miss entirely.',
  },
  {
    name: 'ORION 2.4 NLJD',
    manufacturer: 'REI',
    category: 'Non-Linear Junction Detector',
    freqRange: 'Transmits ~900 MHz or 2.4 GHz, detects 2f/3f harmonics',
    primaryFunction: 'Detection of electronic components regardless of RF emission',
    keyFeatures: ['Detects dormant (powered off) devices', 'Distinguishes device vs corrosion harmonics', 'Visual and audio indication', 'Adjustable sensitivity', 'Most sensitive NLJD available'],
    limitations: ['False positives from corrosion and semiconductor materials', 'Penetration limited by RF-absorbing materials', 'High cost'],
    approxCost: '$12,000–18,000',
    tscmRole: 'Only tool that reliably detects non-transmitting devices. Critical for finding dormant bugs, devices with scheduled activation, or devices currently powered off. Should be used on all surfaces in sensitive sweeps.',
  },
  {
    name: 'Fluke Networks IntelliTone Pro',
    manufacturer: 'Fluke Networks',
    category: 'Cable Tone/Probe',
    freqRange: 'Audio frequency toning',
    primaryFunction: 'Cable tracing and identification',
    keyFeatures: ['Tone generator + probe', 'Identifies unknown cables without disconnecting', 'Works through insulation', 'Affordable and widely available'],
    limitations: ['Not an RF tool', 'Limited to cable tracing function'],
    approxCost: '$200–350',
    tscmRole: 'Identifying unknown cable runs. Tracing cables to determine where they go without cutting. Essential for finding unauthorized cable additions in walls or ceilings.',
  },
  {
    name: 'Somfy/Generic RF Power Meter',
    manufacturer: 'Various',
    category: 'RF Power Detector',
    freqRange: '1 MHz – 8 GHz (varies)',
    primaryFunction: 'Wideband RF presence detection',
    keyFeatures: ['Simple go/no-go indicator', 'Wideband sensitivity', 'Battery powered', 'Very small and portable', 'No laptop required'],
    limitations: ['No frequency identification', 'No signal level measurement in dBm', 'High false positive rate near strong ambient signals', 'Cannot identify signal type'],
    approxCost: '$30–200',
    tscmRole: 'Walk-around screening tool. Not a replacement for spectrum analysis but useful for rapid area screening and directing more detailed analysis. Can be held near objects while walking.',
  },
  {
    name: 'nRF Sniffer + Wireshark',
    manufacturer: 'Nordic Semiconductor (hardware) / open source',
    category: 'BLE Protocol Analyzer',
    freqRange: '2.402–2.480 GHz (BLE channels)',
    primaryFunction: 'BLE packet capture and protocol analysis',
    keyFeatures: ['Captures BLE advertising on all channels', 'Decodes BLE protocol in Wireshark', 'Identifies device type from advertising data', 'Open source + low cost hardware (~$40 dongle)', 'Works with Raytac MDBT50Q-CX or similar'],
    limitations: ['BLE only — not wideband', 'Requires laptop', 'Nordic firmware flashing required'],
    approxCost: '$40 hardware + free software',
    tscmRole: 'BLE tracker detection and characterization. Identifies AirTags, Tile, and other BLE devices by advertising MAC and payload. Far more capable than phone-based scanning for professional use.',
  },
]

// ─── Antenna / Link Budget Reference ─────────────────────────────────────────

export interface AntennaType {
  name: string
  gainTypical: string
  pattern: string
  bestFor: string
  freqRange: string
  notes: string
}

export const antennaTypes: AntennaType[] = [
  { name: 'Whip / monopole (λ/4)', gainTypical: '0–2 dBi', pattern: 'Omnidirectional (doughnut)', bestFor: 'General scanning, handheld use', freqRange: 'Frequency-specific', notes: 'Length = 75/f(MHz) meters for λ/4. Portable, easy to use. No directionality — cannot bearing-find.' },
  { name: 'Rubber duck', gainTypical: '-3 to +2 dBi', pattern: 'Omnidirectional', bestFor: 'Portable/handheld scanning', freqRange: 'Varies by design', notes: 'Most convenient. Lowest sensitivity. Good for initial walk-around with TinySA/SDR. Upgrade to dedicated antenna for serious sweeps.' },
  { name: 'Dipole', gainTypical: '2.15 dBi', pattern: 'Omnidirectional (figure-8 in elevation)', bestFor: 'Reference antenna, known gain for calculations', freqRange: 'Narrow (frequency-specific)', notes: 'Classic reference antenna. Half-wave: length = 150/f(MHz) meters total. Good for known-gain measurements.' },
  { name: 'Log periodic (LPDA)', gainTypical: '5–10 dBi', pattern: 'Directional (forward lobe)', bestFor: 'Broadband directional sweep, bearing finding', freqRange: 'Wide (3:1 to 10:1 ratio)', notes: 'Best all-around TSCM directional antenna. Wide bandwidth + directionality. Use to bearing-find flagged signals. Point toward signal and rotate to find peak.' },
  { name: 'Yagi', gainTypical: '6–16 dBi', pattern: 'Highly directional (narrow beam)', bestFor: 'Long-range reception, precise bearing finding', freqRange: 'Narrow (2:1 ratio max)', notes: 'High gain but narrow frequency range. Best for known frequency bearing finding. 3-element: ~8 dBi. 8-element: ~12 dBi. Use once suspect frequency is identified.' },
  { name: 'Horn antenna', gainTypical: '10–20+ dBi', pattern: 'Highly directional', bestFor: 'Microwave frequencies (>1 GHz), precise location', freqRange: '1 GHz – 40 GHz', notes: 'Essential for 2.4/5/5.8 GHz video TX and WiFi camera direction finding. Waveguide-fed. Excellent directivity at microwave frequencies.' },
  { name: 'BiQuad', gainTypical: '10–12 dBi', pattern: 'Directional', bestFor: '2.4 GHz direction finding, DIY-buildable', freqRange: '2.4 GHz optimized', notes: 'DIY build from copper wire + sheet metal. Excellent for 2.4 GHz WiFi camera hunting. Build instructions widely available. Effective on-site build.' },
  { name: 'Rubber duck wideband', gainTypical: '-3 to +2 dBi', pattern: 'Omnidirectional', bestFor: 'SDR wideband scanning with HackRF/RTL-SDR', freqRange: '75 MHz – 6 GHz', notes: 'ANT500 (HackRF) or similar telescoping whips. Tune length to band of interest: 433 MHz = ~17 cm, 915 MHz = ~8 cm, 2.4 GHz = ~3 cm.' },
]

export const linkBudgetFormulas = [
  { name: 'FSPL (dB)', formula: 'FSPL = 20·log₁₀(d) + 20·log₁₀(f) − 147.55', variables: 'd = distance (meters), f = frequency (Hz)', example: 'At 433 MHz, 50 m: 20·log₁₀(50) + 20·log₁₀(433×10⁶) − 147.55 = 34 + 172.7 − 147.55 = 59.2 dB' },
  { name: 'EIRP (dBm)', formula: 'EIRP = P_TX + G_TX − L_cable', variables: 'P_TX = transmitter power (dBm), G_TX = TX antenna gain (dBi), L_cable = cable/connector loss (dB)', example: '100 mW TX (20 dBm) + 3 dBi antenna − 1 dB cable = 22 dBm EIRP' },
  { name: 'Received power (dBm)', formula: 'P_RX = EIRP − FSPL + G_RX', variables: 'G_RX = RX antenna gain (dBi)', example: '22 dBm EIRP − 59.2 dB FSPL + 2 dBi RX antenna = −35.2 dBm received' },
  { name: 'dBm to mW', formula: 'P(mW) = 10^(P(dBm)/10)', variables: '', example: '−70 dBm = 10^(−7) mW = 0.0000001 mW = 100 pW' },
  { name: 'mW to dBm', formula: 'P(dBm) = 10·log₁₀(P(mW))', variables: '', example: '1 mW = 0 dBm; 100 mW = 20 dBm; 1 W = 30 dBm' },
  { name: 'Antenna length (λ/4 monopole)', formula: 'L(m) = 75 / f(MHz)', variables: 'f = frequency in MHz', example: '433 MHz: 75/433 = 0.173 m = 17.3 cm | 915 MHz: 8.2 cm | 2450 MHz: 3.1 cm' },
  { name: 'Max detection range estimate', formula: 'd_max = 10^((EIRP − P_min − FSPL_fixed + G_RX) / 20) × (c / (4πf))', variables: 'Simplified: rearrange FSPL formula for d', example: 'If bug EIRP = 10 dBm, receiver sensitivity = −90 dBm, f = 433 MHz: solve FSPL ≤ 100 dB → d ≤ 10^((100−147.55+20·log₁₀(433e6))/20) ≈ 5 km. Practical range much less.' },
  { name: 'Noise floor estimate', formula: 'N(dBm) = −174 + 10·log₁₀(BW_Hz) + NF_dB', variables: 'BW = bandwidth in Hz, NF = receiver noise figure (dB)', example: 'RTL-SDR NF ≈ 6 dB, BW = 10 kHz: −174 + 40 + 6 = −128 dBm noise floor' },
]

// ─── Technical Device Taxonomy ───────────────────────────────────────────────

export interface ThreatDevice {
  name: string
  category: string
  subcategory: string
  powerSource: string
  range: string
  frequencies?: string
  detectionMethod: string[]
  indicators: string[]
  sophistication: 'LOW' | 'MED' | 'HIGH' | 'NATION-STATE'
  notes: string
}

export const threatDevices: ThreatDevice[] = [
  // Acoustic
  { name: 'Wired microphone (room mic)', category: 'Acoustic', subcategory: 'Wired', powerSource: 'Building power or battery', range: 'Unlimited (wired)', frequencies: 'N/A', detectionMethod: ['Physical inspection', 'NLJD', 'TDR on phone lines'], indicators: ['Unexpected wire runs', 'Extra conductors in cable', 'Unusual outlet box depth'], sophistication: 'LOW', notes: 'No RF emission — invisible to spectrum analysis. NLJD and physical inspection only. Extremely simple and reliable. Common in walls, furniture, phone handsets.' },
  { name: 'Analog FM audio bug', category: 'Acoustic', subcategory: 'RF transmitter', powerSource: 'Battery or mains tap', range: '50–500 m', frequencies: '88–108 MHz (broadcast hide) or 100–500 MHz', detectionMethod: ['RF spectrum scan', 'NLJD', 'Signal correlation test'], indicators: ['Carrier on spectrum', 'Continuous or VOX-activated transmission', 'FM demodulates to voice'], sophistication: 'LOW', notes: 'Simplest bug type. Battery life 6–72 hours typical. Continuous carrier very visible on spectrum. VOX-activated reduces battery drain but creates intermittent signal.' },
  { name: 'GSM / 4G audio bug', category: 'Acoustic', subcategory: 'Cellular', powerSource: 'Battery or mains', range: 'Unlimited (cellular)', frequencies: '700 MHz – 2.7 GHz (LTE band-dependent)', detectionMethod: ['GSM flutter (217 Hz on AM mode near 900 MHz)', 'NLJD', 'IMSI monitoring'], indicators: ['Periodic TDMA burst activity', 'Call-triggered activation', 'Unknown IMSI on IMSI catcher'], sophistication: 'MED', notes: 'Dial-in or SMS-triggered. Indefinite range. GSM burst creates audible 217 Hz buzz on AM receiver near 850/900 MHz band. LTE version has no characteristic flutter — harder to detect passively.' },
  { name: 'FHSS audio bug', category: 'Acoustic', subcategory: 'RF transmitter (spread spectrum)', powerSource: 'Battery', range: '100 m – 2 km', frequencies: '400–900 MHz (custom hopping range)', detectionMethod: ['Waterfall display (stripe pattern)', 'Correlation test', 'Wideband power detector'], indicators: ['Elevated noise floor across hopping band in waterfall', 'Vertical stripes at irregular frequencies', 'Activity correlates with conversation'], sophistication: 'HIGH', notes: 'Specifically designed to defeat swept spectrum analyzers. Requires waterfall capture over 5–10 min minimum. Correlation test: make noise, watch for burst activity pattern on SDR waterfall.' },
  { name: 'Laser/optical audio', category: 'Acoustic', subcategory: 'Optical', powerSource: 'External (attacker-side)', range: '10 m – 1 km (line of sight)', frequencies: 'N/A (optical, not RF)', detectionMethod: ['IR detector sweep', 'Window film', 'Physical window screening'], indicators: ['Window/glass vibration targeted from outside', 'No RF emission', 'External beam source'], sophistication: 'NATION-STATE', notes: 'Zero RF emission — completely invisible to spectrum analysis. Reads window glass vibration from outside. Countermeasure: anti-vibration window film, masking audio (white noise against glass), window screening. Used by intelligence services.' },
  { name: 'Acoustic "resonator" (passive)', category: 'Acoustic', subcategory: 'Passive', powerSource: 'None (passive)', range: 'Room size when illuminated', frequencies: 'Illuminated by external microwave beam', detectionMethod: ['NLJD (resonant cavity response)', 'Microwave illumination check', 'X-ray of objects'], indicators: ['No battery, no wires, no transmission', 'Resonant cavity in innocuous object', 'Returns signal only when illuminated externally'], sophistication: 'NATION-STATE', notes: 'The "Thing" / Leon Theremin design. Completely passive — no power, no transmission until illuminated by external microwave beam. Invisible to all passive detection. Classic example: great seal bug in the US ambassador\'s office. Counter: X-ray inspection of gifts/objects, NLJD with sensitivity maximized.' },
  // Video
  { name: 'Pinhole camera (wired)', category: 'Optical/Video', subcategory: 'Wired', powerSource: 'Building power', range: 'Unlimited (wired)', frequencies: 'N/A', detectionMethod: ['Physical inspection (1–3mm lens)', 'RF lens detector (infrared reflection)', 'NLJD'], indicators: ['Small hole in wall/object facing meeting area', 'Unusual cable runs', 'NLJD hit in unexpected location'], sophistication: 'MED', notes: 'Lens detector (IR reflection) most effective detection tool. Scan surfaces at eye level in meeting rooms and facing entry points. Modern pinhole lenses are 1–2mm — very difficult to spot visually.' },
  { name: 'WiFi IP camera', category: 'Optical/Video', subcategory: 'WiFi', powerSource: 'Battery or mains', range: 'WiFi range (30–100m)', frequencies: '2.4 / 5 GHz (802.11)', detectionMethod: ['WiFi scan (unknown BSSID/SSID)', 'RF spectrum (OFDM signal)', 'Network enumeration'], indicators: ['Unknown WiFi device in scan', 'Strong RSSI from unexpected direction', 'OFDM signal not matching known APs'], sophistication: 'LOW', notes: 'Easiest category to detect — appears as WiFi device in any wireless scan. Compare against inventory of known APs. Consumer "nanny cam" devices frequently used.' },
  { name: 'Analog video TX (2.4/5.8 GHz)', category: 'Optical/Video', subcategory: 'RF transmitter', powerSource: 'Battery or mains', range: '50–300m', frequencies: '2.400–2.483 GHz or 5.725–5.850 GHz', detectionMethod: ['RF spectrum scan', 'Non-802.11 carrier in 2.4/5.8 GHz band'], indicators: ['Continuous wideband carrier (~6 MHz wide)', 'AM-VSB modulation visible on spectrum', 'Not following 802.11 channel spacing'], sophistication: 'LOW', notes: 'Analog video carriers have different spectral shape than OFDM WiFi — visible as smooth AM-modulated carrier vs flat-topped 802.11 bricks. Horn antenna best for 2.4/5.8 GHz direction finding.' },
  // Carrier current
  { name: 'Powerline carrier bug', category: 'Carrier Current', subcategory: 'Powerline', powerSource: 'Mains (tapped from powerline)', range: 'Entire building on same electrical phase', frequencies: '10–500 kHz (conducted on AC powerline)', detectionMethod: ['Powerline spectrum analyzer (10–500 kHz)', 'Airspy HF+ or SDR with direct sampling', 'REI TALAN on power line'], indicators: ['Carrier on powerline in 10–500 kHz range', 'Signal amplitude varies with speech', 'Present on AC wiring, absent in air'], sophistication: 'MED', notes: 'Signal conducted on AC wiring — completely invisible to airborne RF scan. Requires direct connection to powerline or powerline spectrum analyzer. Range limited to building electrical circuit. Highly persistent — constant power source.' },
  { name: 'Telephone line bug (series)', category: 'Carrier Current', subcategory: 'Phone line', powerSource: 'Line-powered (draws from phone line voltage)', range: 'Distance to nearest telco junction', frequencies: 'Audio (0.3–3.4 kHz) on phone line', detectionMethod: ['REI TALAN (series device detection)', 'Line current measurement', 'TDR impedance analysis'], indicators: ['Increased line current draw', 'Slight impedance change detectable by TALAN', 'Voltage drop on line'], sophistication: 'LOW', notes: 'Series tap wired inline with phone line. Powers itself from line voltage (48V). Captures audio from handset. TALAN is definitive detection tool. Measure baseline line current then compare — series device draws additional current.' },
  { name: 'Telephone line bug (parallel)', category: 'Carrier Current', subcategory: 'Phone line', powerSource: 'Line-powered or battery', range: 'As above', frequencies: 'Audio on phone line', detectionMethod: ['TALAN', 'Impedance measurement', 'Capacitance test'], indicators: ['Additional capacitive load on line', 'Slightly reduced line voltage', 'TALAN detects parallel component'], sophistication: 'LOW', notes: 'Connected in parallel across phone line — picks up audio when line is in use. TALAN most effective. Parallel tap creates detectable impedance change. Check telephone junction boxes — most common installation point.' },
  // IoT / networked
  { name: 'Trojanized IoT device', category: 'IoT / Networked', subcategory: 'Networked sensor', powerSource: 'Mains', range: 'Network-dependent (unlimited via internet)', frequencies: 'WiFi/Ethernet', detectionMethod: ['Network inventory audit', 'Traffic analysis (unusual outbound)', 'Firmware integrity check'], indicators: ['Unknown device on network scan', 'Unexpected outbound connections', 'Device not in authorized inventory'], sophistication: 'MED', notes: 'Smart speakers, cameras, or sensors with compromised firmware. The Eero mesh finding pattern — devices that ingest and potentially report neighbor RF profiles. Focus: network traffic analysis and strict inventory control.' },
  { name: 'Rogue USB charging station', category: 'IoT / Networked', subcategory: 'Physical access', powerSource: 'Mains', range: 'Physical (USB connection)', frequencies: 'N/A', detectionMethod: ['Physical inspection', 'USB data blocker test'], indicators: ['Unknown USB charger in conference room or office', 'Charger runs warm when nothing connected', 'Non-standard USB pinout'], sophistication: 'MED', notes: 'Charges device while exfiltrating data or installing malware. Use USB data blockers (charge-only adapters) for any untrusted USB port. Physical inspection in visitor areas.' },
]

// ─── Threat Actor Profiles ────────────────────────────────────────────────────

export interface ThreatActorProfile {
  actor: string
  category: string
  motivation: string
  sophistication: string
  preferredDevices: string[]
  placementMethods: string[]
  operationalSecurity: string[]
  indicators: string[]
  targetedEnvironments: string[]
  notes: string
}

export const threatActors: ThreatActorProfile[] = [
  {
    actor: 'Nation-state intelligence service',
    category: 'Nation-State',
    motivation: 'Strategic intelligence collection — military, diplomatic, technical secrets',
    sophistication: 'Very High — purpose-built devices, custom frequencies, long-term operations',
    preferredDevices: ['Passive resonator (no RF emission)', 'Custom FHSS with non-standard hopping patterns', 'Optical/laser (zero RF)', 'Compromised supply chain devices', 'Powerline carrier (persistent, no battery)', 'Optical fiber tap on comms infrastructure'],
    placementMethods: ['Renovation access (construction crew)', 'Supply chain compromise (device before delivery)', 'Maintenance/service personnel', 'Long-term access agent in facility', 'Physical break-in during off-hours', 'Gift or diplomatic item placement'],
    operationalSecurity: ['Passive devices requiring external illumination — never transmit independently', 'Custom frequencies outside standard TSCM sweep ranges', 'Low/no power consumption to evade thermal detection', 'Devices indistinguishable from legitimate facility hardware', 'Operational only during scheduled windows (schedule-aware activation)', 'Multiple redundant devices placed simultaneously'],
    indicators: ['Access events: contractors, service personnel, deliveries shortly before use of space for sensitive discussions', 'Objects that cannot be fully accounted for in inventory', 'NLJD response in objects that should contain no electronics', 'Unusual resonance from objects when microwave-illuminated'],
    targetedEnvironments: ['Embassies and diplomatic facilities', 'Military command posts and SCIFs', 'Defense contractor facilities', 'Government executive spaces', 'Sensitive compartmented spaces'],
    notes: 'Most difficult threat class. Standard RF sweep may be completely ineffective against passive devices or custom-frequency FHSS. Require NLJD sweep of all objects, strict access control logging, and X-ray inspection of high-risk items (gifts, equipment deliveries). Assume any long-term access by unknown personnel has been exploited.',
  },
  {
    actor: 'Corporate espionage (competitor)',
    category: 'Corporate',
    motivation: 'Competitive intelligence — M&A targets, R&D, pricing, strategy',
    sophistication: 'Medium — commercial surveillance equipment, possibly hired professional',
    preferredDevices: ['Commercial GSM bugs (Amazon/AliExpress sourced)', 'WiFi cameras disguised as office equipment', 'Compromised IoT devices', 'Commercial LTE trackers', 'Audio bugs in common objects (clocks, chargers, smoke detectors)'],
    placementMethods: ['Visitor/client access to meeting rooms', 'Cleaning or maintenance contractor', 'Temporary employee or contractor', 'Targeted phishing for network access (virtual surveillance)', 'Delivery of "gift" containing device'],
    operationalSecurity: ['Commercial devices with limited anti-detection features', 'May use generic consumer electronics to appear legitimate', 'Cloud exfiltration — data leaves via cellular to overseas server', 'Target-specific activation (motion, sound, scheduled)'],
    indicators: ['New objects appearing in meeting rooms after visits', 'Competitors aware of internal discussions', 'Smoke detectors or clocks that differ from facility standard', 'Unauthorized personnel in sensitive areas', 'Unusual WiFi devices in pre-meeting AP scan'],
    targetedEnvironments: ['Corporate boardrooms and meeting spaces', 'Executive offices', 'R&D laboratories', 'Conference and trade show facilities'],
    notes: 'Commercial surveillance products widely available. Detection is achievable with standard TSCM. Focus on access control for visitor areas, pre-meeting WiFi and RF sweep, and inventory of all objects in sensitive spaces. Legal exposure for corporate espionage operators in US is substantial — deterrent factor.',
  },
  {
    actor: 'Insider threat (current employee)',
    category: 'Insider',
    motivation: 'Financial gain, grievance, ideology, coercion, or recruitment by foreign intelligence',
    sophistication: 'Variable — low (commercial devices) to high (if technically skilled)',
    preferredDevices: ['Personal mobile phone (most common — no dedicated device needed)', 'Commercial audio bugs placed in own work area', 'Screen/document photographing with phone', 'USB keyloggers on shared workstations', 'Network tap on accessible infrastructure'],
    placementMethods: ['Direct access to target space (no entry required)', 'Authorized presence in sensitive areas', 'After-hours access to spaces they have legitimate entry to', 'Social access to other employees\' spaces'],
    operationalSecurity: ['Phone recording is lowest-risk and hardest to detect', 'May use personal hotspot to bypass corporate network monitoring', 'Device removal before sweep (if sweep schedule is known)', 'May be technically sophisticated — knows facility weaknesses'],
    indicators: ['Behavioral: unusual hours, printing/downloading anomalies, resignation/departure planning', 'Device: personal phone at desk during sensitive meetings', 'Network: unusual outbound data, cloud sync activity', 'Physical: accessing areas not required for their role'],
    targetedEnvironments: ['Any facility the insider has authorized access to', 'Particularly effective against: SCIFs (cleared insider), R&D spaces, executive areas'],
    notes: 'Phone-in-pocket is the most common and hardest-to-prevent collection method. Policy and cultural controls (no-phone zones, device storage policy) are primary countermeasures. TSCM sweeps detect placed devices but not carried phones. Behavioral analytics and DLP are complementary controls.',
  },
  {
    actor: 'Criminal organization',
    category: 'Criminal',
    motivation: 'Financial — extortion, fraud, stolen IP for sale, targeted theft intelligence',
    sophistication: 'Low to Medium — commercial tools, hired specialists',
    preferredDevices: ['Commercial GSM/LTE bugs purchased online', 'GPS trackers (vehicle surveillance)', 'Commercial WiFi cameras', 'Simple analog FM transmitters'],
    placementMethods: ['Physical access during business hours (posing as customer/vendor)', 'Compromised contractor', 'Vehicle access in parking areas (GPS tracker)'],
    operationalSecurity: ['Minimal OPSEC — commercial devices with standard frequencies', 'Short operational periods (days to weeks)', 'Rapid extraction after collection', 'Cloud-based exfiltration to anonymous accounts'],
    indicators: ['Standard commercial device signatures on spectrum', 'Devices on known consumer frequencies (433 MHz, 2.4 GHz)', 'VT-detectable device firmware'],
    targetedEnvironments: ['Financial institutions', 'Legal firms (litigation intelligence)', 'Targeted executives (personal surveillance)', 'Retail or hospitality (payment intelligence)'],
    notes: 'Most detectable threat class. Commercial devices have standard signatures, detectable frequencies, and limited OPSEC. Standard TSCM sweep is effective. Primary vector is physical access — access control is the most effective countermeasure at this level.',
  },
  {
    actor: 'Law enforcement / legal authority',
    category: 'Authorized Intercept',
    motivation: 'Criminal investigation under court order',
    sophistication: 'High — access to professional equipment, legal authority for extended access',
    preferredDevices: ['Court-authorized intercept devices meeting legal standards', 'Professional TSCM-grade equipment installed with authorized access', 'Carrier-level intercept (CALEA compliance — no device placement)'],
    placementMethods: ['Legal authority with notice or covert court order', 'Carrier-level intercept (no physical device)', 'Search warrant execution'],
    operationalSecurity: ['Devices designed to be undetectable during authorized surveillance period', 'CALEA intercept at carrier = no device on premises at all'],
    indicators: ['Generally none — authorized and professional placement'],
    targetedEnvironments: ['Any environment under investigation'],
    notes: 'If you discover a device during a TSCM sweep that you believe may be a law enforcement intercept, stop the sweep, consult legal counsel immediately, and do not remove or disturb the device. Interference with authorized intercept is a federal crime. This is a distinct scenario from unauthorized surveillance.',
  },
]

// ─── RF Spectrum Baseline ─────────────────────────────────────────────────────

export interface SpectrumBaseline {
  environment: string
  band: string
  freqRange: string
  expectedSignals: string[]
  anomalousSignals: string[]
  noiseFloor: string
  notes: string
}

export const spectrumBaselines: SpectrumBaseline[] = [
  // Office / commercial building
  { environment: 'Office / Commercial', band: 'VHF FM broadcast', freqRange: '88–108 MHz', expectedSignals: ['Commercial FM broadcast stations (strong, stable)'], anomalousSignals: ['Unknown carrier between stations', 'Carrier with voice modulation (NFM)'], noiseFloor: '–90 to –100 dBm', notes: 'Well-defined channels. Any carrier not matching a licensed station is anomalous.' },
  { environment: 'Office / Commercial', band: 'VHF/UHF misc', freqRange: '136–174 MHz, 400–512 MHz', expectedSignals: ['Licensed two-way radio (business band)', 'NOAA weather (162.4–162.55 MHz)', 'Paging systems (152–158 MHz)'], anomalousSignals: ['Unknown NFM carrier', 'Carrier that activates with conversation', 'Signal present inside building but not outside'], noiseFloor: '–100 to –110 dBm', notes: 'Validate any carrier by demodulating in NFM mode. Voice content on unidentified carrier = anomalous.' },
  { environment: 'Office / Commercial', band: 'ISM 433 MHz', freqRange: '433.05–434.79 MHz', expectedSignals: ['Wireless temperature sensors', 'Key fobs', 'Remote controls'], anomalousSignals: ['Continuous carrier', 'Voice-modulated signal', 'Signal correlated with conversation'], noiseFloor: '–100 dBm', notes: 'Busy band. Short burst devices are normal. Continuous or voice-modulated carrier is not.' },
  { environment: 'Office / Commercial', band: 'Cellular', freqRange: '700–900 MHz, 1700–2700 MHz', expectedSignals: ['LTE/5G from macro towers (strong outside, attenuated inside)', 'DAS (distributed antenna system) in large buildings'], anomalousSignals: ['Unusually strong cellular signal from unexpected direction inside building', 'Unknown IMSI catcher (RSSI stronger than expected vs tower distance)', 'CDMA/GSM in LTE-only coverage area'], noiseFloor: '–100 to –120 dBm (indoors)', notes: 'Cellular signal should attenuate significantly indoors. Very strong cellular signal from within a room (not from outside) is suspicious.' },
  { environment: 'Office / Commercial', band: '2.4 GHz WiFi/BT', freqRange: '2.400–2.483 GHz', expectedSignals: ['802.11 b/g/n/ax on channels 1, 6, 11 (APs per inventory)', 'Bluetooth piconets (2 MHz wide)', 'Microwave oven harmonics (~2.45 GHz, intermittent)'], anomalousSignals: ['Unknown BSSID not in AP inventory', 'Non-802.11 continuous carrier', 'OFDM signal on non-standard channel', 'Analog video carrier (smooth AM shape, not flat-topped)'], noiseFloor: '–85 to –95 dBm', notes: 'Compare all detected BSSIDs against documented AP inventory. Any unknown OFDM = unknown device transmitting data.' },
  { environment: 'Office / Commercial', band: '5 GHz WiFi', freqRange: '5.150–5.850 GHz', expectedSignals: ['802.11 a/n/ac/ax on channels 36–165 (APs per inventory)', 'Weather radar secondary radar (DFS channels — intermittent)'], anomalousSignals: ['Unknown BSSID', 'Analog video TX (FPV drone range — 5.8 GHz)', 'Non-standard OFDM'], noiseFloor: '–90 to –100 dBm', notes: 'Less congested than 2.4 GHz. Unknown signals stand out more clearly. 5.8 GHz analog video TXs have distinctive spectral shape vs 802.11.' },
  // Military installation
  { environment: 'Military Installation', band: 'SINCGARS (VHF)', freqRange: '30–87.975 MHz', expectedSignals: ['SINCGARS FHSS (authorized nets — appears as broadband noise elevation across band during transmission)', 'AM aircraft comms (118–137 MHz — aviation band)'], anomalousSignals: ['Unknown FHSS activity outside authorized net schedules', 'Continuous carrier in this band', 'NFM voice not matching authorized nets'], noiseFloor: '–100 to –110 dBm', notes: 'SINCGARS FHSS is authorized — document it in baseline. Unknown FHSS not matching authorized net timing is anomalous.' },
  { environment: 'Military Installation', band: 'UHF SATCOM / MUOS', freqRange: '225–400 MHz', expectedSignals: ['UHF SATCOM terminals (burst, directional)', 'MUOS waveform (CDMA-based)'], anomalousSignals: ['Continuous UHF carrier', 'Unknown burst activity inside facility'], noiseFloor: '–110 dBm', notes: 'Most UHF activity should be directional (antenna pointed skyward). Isotropic UHF signal source inside a facility = very suspicious.' },
  { environment: 'Military Installation', band: 'ISM / commercial', freqRange: '900 MHz, 2.4 GHz, 5 GHz', expectedSignals: ['Authorized WiFi APs (documented, SSID-controlled)', 'Authorized Bluetooth devices'], anomalousSignals: ['Personal hotspot SSIDs', 'Unknown BSSIDs not in inventory', 'Consumer devices (Bluetooth headphones on unauthorized frequencies)', 'Any cellular device in RF-controlled area'], noiseFloor: 'Variable — RF shielding may lower floor significantly', notes: 'Military installations may have strict RF control policies. Baseline is tightly constrained — any deviation is anomalous.' },
  // Industrial / ICS environment
  { environment: 'Industrial / ICS', band: 'Legacy wireless', freqRange: '900 MHz ISM', expectedSignals: ['WirelessHART sensors (802.15.4 FHSS, 2.4 GHz)', 'ISA100.11a sensors', 'Legacy 900 MHz proprietary SCADA radios'], anomalousSignals: ['Unknown 900 MHz continuous carrier', 'New FHSS activity not matching authorized sensor schedule', 'Signal not present in previous baseline'], noiseFloor: '–80 to –100 dBm (industrial noise varies)', notes: 'Industrial environments have high RF noise from motors, VFDs, and arc welders. Baseline must be captured during normal operations to distinguish equipment noise from surveillance signals.' },
  { environment: 'Industrial / ICS', band: 'Powerline', freqRange: '10–500 kHz (conducted)', expectedSignals: ['PLC signals (power line communication for lighting/control)', 'Variable frequency drive (VFD) harmonics', 'Smart meter signals (PRIME/G3-PLC: 3–500 kHz)'], anomalousSignals: ['Voice-frequency carrier (300–3400 Hz) on powerline', 'Unknown narrowband carrier in 50–500 kHz range', 'Signal correlated with nearby conversation'], noiseFloor: 'High — VFDs create significant wideband noise', notes: 'Powerline surveillance is a real threat in industrial environments where workers discuss sensitive matters near energized equipment. Requires specialized powerline spectrum analyzer or SDR with direct coupling.' },
]

// ─── TEMPEST / Emanations Reference ──────────────────────────────────────────

export interface TempestEntry {
  category: string
  threat: string
  mechanism: string
  frequencies: string
  range: string
  countermeasures: string[]
  standards: string[]
  notes: string
}

export const tempestEntries: TempestEntry[] = [
  {
    category: 'Video emanations',
    threat: 'Van Eck phreaking (CRT/LCD monitor eavesdropping)',
    mechanism: 'CRT: horizontal sweep creates AM-modulated RF at video pixel clock frequency harmonics. LCD: differential signaling (TMDS/LVDS) leaks data at pixel clock harmonics. Video content reconstructable from RF.',
    frequencies: '25 MHz – 1+ GHz (harmonics of pixel clock, typically 65–165 MHz fundamental)',
    range: 'Tens of meters (practical), claimed hundreds of meters with directional antenna',
    countermeasures: ['Distance and shielding between monitor and external wall', 'TEMPEST-certified displays (NSA EPL listed)', 'Electromagnetic shielded room (Faraday cage)', 'Noise masking generators (classified)', 'Random video refresh patterns (mitigates CRT, limited effect on LCD)'],
    standards: ['NSTISSAM TEMPEST/1-92 (classified)', 'NATO SDIP-27 Level A/B/C', 'NSA/CSS EPL (Endorsed Products List)', 'CNSS No. 7000 (US government)'],
    notes: 'Van Eck demonstrated in 1985. Modern LCD displays still leak via HDMI cable emanations. Wired connections (HDMI, DisplayPort cable runs) are often more significant emanation sources than the display itself. Cable routing and shielding are critical.',
  },
  {
    category: 'Keyboard emanations',
    threat: 'Electromagnetic keyboard eavesdropping',
    mechanism: 'PS/2 and USB keyboards emit RF correlated with keystrokes via cable and ground plane coupling. Specific keystroke electromagnetic patterns are distinguishable at distance.',
    frequencies: '1–100 MHz (USB keystroke coupling)',
    range: 'Up to 20 meters (PS/2), 1–5 meters (USB) — varies significantly by hardware',
    countermeasures: ['TEMPEST-certified keyboards', 'Shielded keyboard cables', 'Distance from external walls', 'Faraday shielded room'],
    standards: ['NSA EPL for keyboards', 'NATO SDIP-27 compliance testing'],
    notes: 'PS/2 keyboards are significantly worse emitters than USB. Wireless keyboards (Bluetooth, RF) have obvious RF emissions but also secondary emanations from the key matrix electronics. For sensitive spaces: use TEMPEST-certified wired USB keyboard.',
  },
  {
    category: 'Network cable emanations',
    threat: 'Ethernet cable crosstalk and near-field coupling',
    mechanism: 'Ethernet differential signaling leaks near-field RF. Unshielded twisted pair (UTP) is a significant emitter at Ethernet clock frequencies. STP provides some reduction but imperfect.',
    frequencies: '100 MHz fundamental (FastEthernet), 125 MHz (GigE), 2.5 GHz (10GbE)',
    range: '1–3 meters practical (UTP), significantly reduced with STP and shielded conduit',
    countermeasures: ['Shielded twisted pair (STP Cat6A) with proper grounding', 'Shielded conduit (metallic)', 'Physical access control to cable plant', 'Fiber optic for any runs in sensitive areas (zero RF)'],
    standards: ['NSA cabling standards for classified facilities', 'BICSI 009 data center design (proximity rules)'],
    notes: 'Cable routing proximity to facility perimeter is the primary concern. Ethernet cables running parallel to exterior walls or through accessible ceiling voids are exfiltration risk. Fiber eliminates electromagnetic emanations entirely.',
  },
  {
    category: 'Power line conducted emissions',
    threat: 'Data exfiltration or eavesdropping via power line',
    mechanism: 'Electronic equipment modulates power line with data or compromised devices intentionally couple audio/data onto mains wiring. Conducted interference travels throughout building electrical circuit.',
    frequencies: '10 kHz – 1 MHz (powerline signaling range)',
    range: 'Entire electrical circuit on same phase — potentially entire building',
    countermeasures: ['In-line mains power conditioner / EMI filter on sensitive equipment', 'Uninterruptible power supply with isolation transformer', 'Dedicated electrical circuits for sensitive areas', 'Regular powerline spectrum monitoring'],
    standards: ['FCC Part 15 (unintentional conducted emissions limits)', 'MIL-STD-461 (conducted emissions — military equipment)'],
    notes: 'The TEMPEST threat from power lines works in both directions: equipment leaks data onto power lines (unintentional), or an implanted device uses the power line as a communication channel (intentional carrier current bug). The Eero mesh network finding is adjacent to this concern — devices that access and potentially transmit observed RF data.',
  },
  {
    category: 'Acoustic emanations',
    threat: 'Printer, hard drive, and fan acoustic side-channels',
    mechanism: 'Mechanical components (HDD actuator, CPU fan speed, printer carriage) produce acoustic emanations correlated with data processing. Air-gapped systems vulnerable.',
    frequencies: '0.1 Hz – 20 kHz (acoustic spectrum)',
    range: 'Several meters for equipment acoustics; ultrasonic exfil range varies',
    countermeasures: ['SSD (eliminates HDD actuator channel)', 'Acoustic noise masking in sensitive spaces', 'White noise generators covering 20 Hz – 20 kHz', 'Physical access control to prevent near-field acoustic sensor placement'],
    standards: ['TEMPEST/NONSTOP (acoustic TEMPEST — classified standard name)'],
    notes: 'Academic demonstrations exist for RSA key extraction via acoustic emanations from laptops. More practically relevant: ultrasonic covert channels between smartphones (NUIT attack — near-ultrasound inaudible trojan). Countermeasure: ban mobile devices in sensitive spaces.',
  },
  {
    category: 'RF covert channels',
    threat: 'COTTONMOUTH / air-gap bridging via RF',
    mechanism: 'Compromised USB devices or hardware implants generate controlled RF emissions encoding data. Air-gapped system can be exfiltrated without network connection. NSA ANT catalog documented commercial-grade implementations.',
    frequencies: 'Various — implant-dependent, often FM broadcast band or cellular',
    range: 'Depends on power; typically meters to tens of meters to a nearby receiver',
    countermeasures: ['TEMPEST-certified hardware (limits unintentional and intentional emissions)', 'RF shielded facility', 'Device control policy (no unknown USB devices)', 'Regular hardware inspection for implants'],
    standards: ['NSA ANT catalog (leaked, documents techniques)', 'NIST SP 800-115 (technical security testing)'],
    notes: 'NSA ANT catalog documented RAGEMASTER (monitor emanation implant) and COTTONMOUTH (USB implant with RF exfil). These are nation-state capabilities. For most environments: hardware supply chain integrity and device control policy are the practical countermeasures.',
  },
]

// ─── Countermeasures Reference ────────────────────────────────────────────────

export interface Countermeasure {
  name: string
  category: string
  effectiveAgainst: string[]
  ineffectiveAgainst: string[]
  implementation: string
  cost: string
  limitations: string
  legalNotes?: string
}

export const countermeasures: Countermeasure[] = [
  {
    name: 'White noise / acoustic masking',
    category: 'Acoustic',
    effectiveAgainst: ['Room microphone (wired and wireless)', 'Laser/optical audio (if white noise source is against glass)', 'Acoustic side-channel attacks', 'Casual eavesdropping through walls'],
    ineffectiveAgainst: ['Close-proximity recording (phone in pocket)', 'Vibration isolation already in place', 'Laser aimed at solid wall (not glass)'],
    implementation: 'Speakers placed at perimeter (walls, windows, vents) broadcasting white or pink noise at 65–75 dB. Masking must be at the surface being monitored, not in the center of the room. Qt (quorum) of masking speakers around the room perimeter. White noise machines specifically at windows for laser countermeasure.',
    cost: '$500–5,000 depending on room size and system quality',
    limitations: 'Does not prevent close-range recording. Masking must cover the specific attack surface. Continuous operation required — gaps in masking create vulnerability windows. Some systems can be partially defeated by adaptive noise cancellation if attacker has reference signal.',
    legalNotes: 'Legal in the US for protecting own space. Cannot be used to interfere with authorized court-ordered intercepts.',
  },
  {
    name: 'RF shielding (Faraday enclosure)',
    category: 'RF / TEMPEST',
    effectiveAgainst: ['All RF transmitting bugs (frequency-independent)', 'TEMPEST/Van Eck emanations', 'Cellular-based surveillance', 'WiFi cameras', 'GPS trackers (prevents satellite signal)'],
    ineffectiveAgainst: ['Wired exfiltration (anything that passes through shielded penetrations)', 'Acoustic collection outside the shielded space', 'Powerline-conducted emissions if power enters without filtering'],
    implementation: 'MIL-SPEC shielded rooms (RF shielding enclosures) provide 80–120 dB attenuation. Commercial options include RF-shielded window film (~20–40 dB), conductive paint, and prefabricated shielded modular rooms. All penetrations (power, HVAC, data, plumbing) require RF filters or waveguides to maintain shield integrity.',
    cost: 'Window film: $500–2,000 per room. Prefab shielded room: $50,000–500,000+. Custom built-in: $500,000+',
    limitations: 'Effectiveness is only as strong as weakest penetration. HVAC ducts, power lines, and cable entries must all be addressed. Improperly installed shielding can create resonant cavities that amplify certain frequencies.',
  },
  {
    name: 'Technical surveillance sweep (TSCM)',
    category: 'Detection / Assurance',
    effectiveAgainst: ['RF transmitting devices (spectrum analysis)', 'Electronic components regardless of emission state (NLJD)', 'Physical installation evidence', 'Phone line taps (TALAN)', 'Network-based surveillance (network scan)'],
    ineffectiveAgainst: ['Phone-in-pocket recording during sweep (carrier phone present)', 'Devices activated only outside sweep windows', 'Nation-state passive devices (resonator) — require specialized NLJD technique', 'Virtual surveillance (network eavesdropping from remote)'],
    implementation: 'Professional TSCM sweep per established methodology. Frequency: depends on threat level — sensitive facilities: before each significant meeting. Classified facilities: scheduled sweeps per program security plan. Always conduct before and after renovation, after maintenance access, and after any uncontrolled access event.',
    cost: '$2,000–15,000 per sweep (professional team)',
    limitations: 'Sweep provides assurance only at the time of sweep. Adversary with schedule knowledge can avoid detection. No sweep can provide absolute certainty against all threat types simultaneously.',
  },
  {
    name: 'Device control policy (phone-free zones)',
    category: 'Policy / Physical',
    effectiveAgainst: ['Insider phone recording (most common real-world threat)', 'Consumer surveillance devices carried in', 'USB-based attacks', 'Bluetooth/WiFi surreptitious recording'],
    ineffectiveAgainst: ['Externally placed devices', 'Nation-state implants pre-installed in facility hardware'],
    implementation: 'Phone storage policy: secure phone lockers outside sensitive space. Badge readers or Faraday pouches at entry. Visitor device policy: no phones, or escorted with phone in Faraday bag. Signs are insufficient — policy enforcement requires physical mechanism. RF detection at entry points alerts to unauthorized devices.',
    cost: '$500–5,000 for lockers/pouches. Enforcement cost is primarily procedural.',
    limitations: 'Enforceability depends on organizational culture and compliance. Senior personnel often exempt themselves. Does not address smart watches, IoT clothing/accessories. Insider with authorized exception remains a risk.',
  },
  {
    name: 'EMI power line filters',
    category: 'TEMPEST / Power',
    effectiveAgainst: ['Powerline carrier bugs (conducted RF on mains)', 'Equipment emanations conducted on power line', 'Data signals coupling onto mains from equipment'],
    ineffectiveAgainst: ['Air-borne RF emanations', 'Data already exfiltrated via other means'],
    implementation: 'In-line mains filter on all power entering sensitive space. TEMPEST-grade filters provide >80 dB conducted attenuation across relevant frequency range. UPS with isolation transformer provides significant additional attenuation. All power entering sensitive area should pass through filter.',
    cost: '$200–2,000 per circuit for commercial EMI filters. TEMPEST-grade: $2,000–10,000 per circuit',
    limitations: 'Only addresses conducted emissions on power lines. Does not address radiated emissions. Filter must be installed at entry point to sensitive space — not at individual equipment outlets.',
  },
  {
    name: 'TSCM-grade network monitoring',
    category: 'Network / Cyber',
    effectiveAgainst: ['WiFi cameras and IoT surveillance devices', 'Rogue APs', 'Networked surveillance tools', 'Cellular data exfiltration via WiFi-cellular bridge devices'],
    ineffectiveAgainst: ['Devices using personal cellular data (bypass network entirely)', 'Passive/wired devices with no network connection'],
    implementation: 'Continuous WiFi monitoring with SSID/BSSID inventory enforcement. 802.1X authentication on all network ports. Network access control (NAC) to block unauthorized device enrollment. WIDS (Wireless Intrusion Detection) with alerts on new BSSIDs. Regular Nmap/Nessus scans of wired network for unauthorized devices.',
    cost: '$0 (open source WIDS) to $50,000+ (enterprise wireless management)',
    limitations: 'Devices using personal cellular data or OOB communication channels are invisible to network monitoring. The Eero/WiFi Pineapple scenario is detectable via this approach — but requires active monitoring and inventory comparison.',
  },
  {
    name: 'Access control and visitor management',
    category: 'Physical Security',
    effectiveAgainst: ['Device placement by outsiders', 'Corporate espionage via visitor access', 'Service/maintenance exploitation'],
    ineffectiveAgainst: ['Insider threat (authorized access)', 'Supply chain compromise (pre-installed)'],
    implementation: 'Escort policy for all non-cleared visitors in sensitive areas. Pre/post visit sweep of meeting rooms. Maintenance access logging with before/after room inspection. Contractor access limited to necessary scope with escort. Inventory of all items in sensitive spaces before and after any uncontrolled access.',
    cost: 'Primarily procedural — personnel time for escort and inspection',
    limitations: 'Only effective when consistently enforced. Social engineering can defeat procedural controls.',
  },
  {
    name: 'Anti-vibration window film / laminate',
    category: 'Acoustic / Optical',
    effectiveAgainst: ['Laser audio surveillance (reading window vibrations)', 'Acoustic coupling through glass'],
    ineffectiveAgainst: ['Direct microphone in room', 'RF-based surveillance', 'Eavesdropping through walls (non-window)'],
    implementation: 'Anti-vibration window film applied to interior glass. Film damps high-frequency vibration that laser systems read. Supplement with white noise speaker positioned against glass surface. Heavier laminated glass provides inherently better vibration isolation than single-pane.',
    cost: '$15–50 per square foot installed',
    limitations: 'Reduces but may not eliminate laser audio. High-powered laser systems with advanced processing may partially compensate for damped vibration. Must be combined with white noise for high-threat environments.',
  },
]

// ─── Cellular Threat Analysis ─────────────────────────────────────────────────

export interface CellularThreat {
  name: string
  category: string
  mechanism: string
  detectionIndicators: string[]
  frequencies: string
  legality: string
  detectWith: string[]
  countermeasures: string[]
  notes: string
}

export const cellularThreats: CellularThreat[] = [
  {
    name: 'IMSI Catcher (Stingray / CSS)',
    category: 'Active intercept',
    mechanism: 'Broadcasts a stronger signal than legitimate cell towers, forcing nearby phones to downgrade to 2G (GSM) or register with the false base station. Device captures IMSI, location, and in some configurations intercepts calls/texts.',
    detectionIndicators: [
      'Unexpected 2G (GSM) signal where LTE should be dominant',
      'Sudden change from LTE to 2G/3G (downgrade attack)',
      'Cell tower with unusually strong signal that cannot be correlated to a known tower location',
      'RSSI significantly stronger than expected for given distance from known towers',
      'Phone battery drain spike (forced 2G/3G increases TX power)',
      'SnoopSnitch or AIMSICD app alerts on unexpected base station',
    ],
    frequencies: '850/1900 MHz (GSM US), 700/1700/1900/2100 MHz (LTE)',
    legality: 'Lawful use by law enforcement with court order. Unlawful use by unauthorized parties is a federal crime (18 USC 2511). Detection is not illegal.',
    detectWith: ['SnoopSnitch (Android)', 'AIMSICD (Android)', 'IMSI Catcher Catcher research tools', 'Software-defined radio monitoring for unexpected base station broadcasts', 'Commercial IMSI catcher detection appliances (Pwnie Express, Bastille)'],
    countermeasures: ['Use Signal or WhatsApp (E2E encrypted — intercept reveals nothing)', 'Avoid 2G — if phone allows, disable GSM fallback (iOS: Settings → Cellular → Enable LTE → Data Only)', 'VPN on all data traffic', 'Monitor for unexpected network downgrades', 'Use a Faraday pouch/cage in known-high-risk environments'],
    notes: 'Law enforcement IMSI catchers are legal within their authority. Detection by citizens is legal in the US — no law prohibits detecting RF signals. The 2G downgrade attack is the key signature. Devices that refuse 2G connections (some Android "LTE Only" settings) are resistant to this specific attack vector.',
  },
  {
    name: 'Rogue cellular base station (RBS)',
    category: 'Active attack',
    mechanism: 'Unauthorized base station transmitting on cellular frequencies to attract nearby devices. May be used for IMSI harvesting, traffic interception, denial of service, or as a relay for other attacks.',
    detectionIndicators: [
      'Cell tower on civilian map but no licensed installation nearby',
      'Cellular signal in area without expected coverage (remote/rural unexpected strong signal)',
      'Multiple devices in same area experiencing simultaneous connectivity issues',
      'Cellular signal from unexpected direction (elevation or azimuth inconsistent with tower location)',
      'FCC license database shows no authorized transmitter at apparent signal location',
    ],
    frequencies: 'All cellular bands: 700 MHz, 850 MHz, 1700 MHz, 1900 MHz, 2100 MHz, 2500 MHz, 3.5 GHz (CBRS)',
    legality: 'Unlicensed cellular transmission is a federal crime (FCC violation + potential 18 USC 1030). Reporting suspected rogue base stations: FCC Enforcement Bureau.',
    detectWith: ['OpenCelliD database (cross-reference tower location vs observed)', 'SnoopSnitch', 'Android Network Signal Guru', 'SDR monitoring — UMTS/LTE protocol analysis', 'Professional cellular monitoring equipment (Rohde & Schwarz TSMW)'],
    countermeasures: ['E2E encrypted communications for all sensitive content', 'Correlation of observed cell ID vs public tower database', 'Network-layer VPN for all data', 'Report to FCC if confident of unauthorized transmission'],
    notes: 'Distinguishing a legitimate small cell (femtocell, microcell) from a rogue base station requires cross-referencing with carrier network data. OpenCelliD provides community-sourced tower data. Carriers can also confirm whether a specific cell ID is part of their network.',
  },
  {
    name: 'Carrier current surveillance (building wiring)',
    category: 'Wired intercept',
    mechanism: 'Audio or data modulated onto building electrical wiring (10–500 kHz). Uses AC powerline as a transmission medium — signal travels throughout the building on the same electrical phase and can be received at any power outlet.',
    detectionIndicators: [
      'Carrier in 10–500 kHz range detectable with SDR in direct-sampling mode or powerline analyzer',
      'Signal amplitude varies with conversation near the transmitter',
      'Signal present on powerline wiring but not in air',
      'Signal disappears when circuit breaker to suspected room is tripped',
    ],
    frequencies: '10 kHz – 500 kHz (conducted, not radiated)',
    legality: 'Unauthorized surveillance is illegal under Wiretap Act (18 USC 2511) regardless of transmission medium.',
    detectWith: ['REI TALAN (powerline analysis mode)', 'Airspy HF+ Discovery (direct sampling 0.5 kHz – 31 MHz)', 'SDR with direct HF sampling and inductive coupling to powerline', 'Commercial powerline spectrum analyzers'],
    countermeasures: ['In-line mains EMI filter (attenuates conducted signals)', 'Isolation transformer on power entering sensitive area', 'Regular powerline spectrum monitoring as part of sweep protocol'],
    notes: 'The Eero mesh network incident is directly adjacent to this threat category. Mesh networking devices that passively observe RF environment (including WiFi probe requests, BLE advertising, and neighboring AP profiles) and sync this data to cloud infrastructure represent a new carrier current-analog threat where the communication channel is the internet rather than the powerline, but the information collection mechanism is similar in its passivity and persistence.',
  },
  {
    name: 'Cellular-based bug (GSM/LTE audio device)',
    category: 'Covert device',
    mechanism: 'Embedded SIM card in a covert device. Dials out or accepts incoming call to deliver audio. LTE version streams audio continuously or on schedule via data connection.',
    detectionIndicators: [
      'TDMA burst activity near 850/1900 MHz (GSM — characteristic 217 Hz "buzz" on AM receiver)',
      'Periodic LTE data burst from device inside facility',
      'IMSI not matching any authorized device appears on IMSI catcher or carrier monitoring',
      'NLJD response at unexpected location',
      'Device powered by building mains — persistent operation',
    ],
    frequencies: 'GSM: 850/1900 MHz uplink. LTE: 700 MHz – 2700 MHz (band-dependent)',
    legality: 'Placement without consent is illegal under Wiretap Act. Counterintelligence discovery and reporting is authorized.',
    detectWith: ['GSM flutter detection (AM receiver at 850/1900 MHz during active call)', 'IMSI catcher/monitor (captures device IMSI when it registers)', 'NLJD (detects electronics regardless of RF state)', 'Commercial cellular monitor (detects uplink transmission)'],
    countermeasures: ['Faraday shielding (prevents outbound cellular transmission)', 'Cellular jamming — ILLEGAL in the US regardless of context. Do not jam.', 'Detection and removal (TSCM sweep)', 'Mobile signal strength monitoring — anomalous uplink from inside facility'],
    notes: 'CRITICAL: Cellular jamming is a federal crime in the US under 47 USC 333, regardless of context or authorization level. There is no legal exception for facility security. The only lawful countermeasures are detection, removal, and Faraday shielding.',
  },
]

// ─── Training Scenario Builder ────────────────────────────────────────────────

export interface TrainingScenario {
  id: string
  name: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  objective: string
  timeRequired: string
  equipment: string[]
  planted: { device: string; location: string; detectionMethod: string; difficulty: string }[]
  redHerrings: string[]
  passConditions: string[]
  failConditions: string[]
  instructorNotes: string
  debriefPoints: string[]
}

export const trainingScenarios: TrainingScenario[] = [
  {
    id: 'SCEN-01',
    name: 'Basic RF sweep — single device',
    difficulty: 'BEGINNER',
    objective: 'Trainee successfully identifies and locates a single FM audio bug using spectrum analysis and physical inspection.',
    timeRequired: '30–45 minutes',
    equipment: ['TinySA Ultra or similar spectrum analyzer', 'Wideband antenna', 'FM receiver or SDR for demodulation', 'Planted device: simple FM transmitter (88–108 MHz or 300–500 MHz)'],
    planted: [
      { device: 'FM audio transmitter (~433 MHz)', location: 'Behind a power outlet faceplate', detectionMethod: 'Spectrum scan reveals unknown NFM carrier; demodulation reveals voice; direction-finding narrows to outlet', difficulty: 'Easy — continuous carrier, single device' },
    ],
    redHerrings: ['WiFi AP with normal activity', 'Bluetooth headset GFSK signal', 'Cordless phone base station on 5.8 GHz'],
    passConditions: ['Identify carrier frequency within 500 kHz', 'Correctly identify modulation type (NFM/FM)', 'Locate device to correct room and surface within 30 cm', 'Document finding with frequency, level, modulation, location'],
    failConditions: ['Miss the carrier during sweep', 'Identify a red herring as the threat device', 'Unable to physically locate the device after spectrum identification'],
    instructorNotes: 'Set transmitter to activate VOX if trainee is struggling — creates obvious audio-correlated transmission. Ensure baseline scan is conducted first so trainee has reference. Use correlation test: talk near the device and show trainee how signal level changes.',
    debriefPoints: ['Review sweep methodology — did they establish a baseline before entering?', 'Did they cover the full frequency range systematically?', 'Did they attempt demodulation to confirm it was audio?', 'Did they document frequency, level, and location per procedure?'],
  },
  {
    id: 'SCEN-02',
    name: 'Multi-device sweep — layered threats',
    difficulty: 'INTERMEDIATE',
    objective: 'Trainee identifies and locates three devices of different types: one RF, one requiring NLJD, one physical-only.',
    timeRequired: '60–90 minutes',
    equipment: ['TinySA Ultra', 'SDR (HackRF or RTL-SDR)', 'NLJD (ORION 2.4 or equivalent)', 'Directional antenna (log-periodic)', 'Planted devices: see below'],
    planted: [
      { device: 'GSM bug (SIM-based audio transmitter)', location: 'Inside a clock on the conference table', detectionMethod: 'GSM TDMA flutter on AM mode at 900 MHz; NLJD confirms electronics in clock; physical inspection', difficulty: 'Medium — intermittent transmission, requires AM demodulation knowledge' },
      { device: 'Wired microphone with no RF (hardwired to adjacent room)', location: 'Behind acoustic ceiling tile, wire runs to junction box', detectionMethod: 'NLJD detects mic capsule; physical inspection reveals wire run; no RF signature', difficulty: 'Hard — no RF, NLJD required' },
      { device: 'Power outlet bug (wired audio, hidden in outlet body)', location: 'Non-functional outlet behind desk', detectionMethod: 'Physical inspection reveals non-standard outlet depth; NLJD detects electronics; outlet cover has unusually new screw', difficulty: 'Medium — physical indicators' },
    ],
    redHerrings: ['UPnP device on WiFi (shows up in network scan)', 'Smoke detector with normal Bluetooth occupancy sensing', 'Cordless phone creating expected 2.4 GHz signal'],
    passConditions: ['Find all three devices', 'Correctly characterize each (RF vs wired vs physical)', 'Document using sweep report format', 'No false positives from red herrings declared as threats'],
    failConditions: ['Miss the wired device (no RF)', 'Declare any red herring as a threat without further investigation', 'Find less than 2 of 3 devices'],
    instructorNotes: 'The wired mic with no RF is the most important lesson — standard RF sweep is insufficient. Ensure trainee uses NLJD on all surfaces, not just where spectrum shows activity. The wired device teaches the critical lesson that NLJD is required for complete sweep.',
    debriefPoints: ['What would have happened if they skipped NLJD?', 'How did they handle the red herrings — did they investigate before excluding?', 'Was the sweep systematic or were they reacting to spectrum findings?', 'Did they document all three devices and the red herrings?'],
  },
  {
    id: 'SCEN-03',
    name: 'FHSS detection exercise',
    difficulty: 'ADVANCED',
    objective: 'Trainee detects and characterizes a frequency-hopping device that defeats standard swept spectrum analysis.',
    timeRequired: '45–60 minutes',
    equipment: ['SDR with waterfall capability (HackRF + SDR++ or GQRX)', 'TinySA Ultra in waterfall mode', 'Wideband antenna', 'Planted device: HackRF One with PortaPack transmitting FHSS bursts, or commercial DECT phone as FHSS example'],
    planted: [
      { device: 'HackRF with PortaPack transmitting FHSS pattern (300–500 MHz hopping range)', location: 'Concealed in plant or decorative object', detectionMethod: 'Waterfall mode on SDR shows characteristic vertical stripe pattern across hopping range; max hold shows elevated noise floor; correlation test (make noise → increased burst activity)', difficulty: 'Hard — invisible to swept display, requires waterfall knowledge' },
    ],
    redHerrings: ['WiFi activity (OFDM, brick-shaped)', 'BLE advertising (known GFSK on 2.4 GHz advertising channels)'],
    passConditions: ['Detect FHSS activity using waterfall display', 'Identify approximate hopping range', 'Perform and interpret correlation test correctly', 'Unable to initially locate — correctly escalate to NLJD for physical sweep'],
    failConditions: ['Complete sweep without detecting FHSS activity', 'Correctly see waterfall pattern but not recognize it as FHSS', 'Fail to attempt correlation test'],
    instructorNotes: 'This scenario teaches the most important TSCM lesson: standard swept analysis misses FHSS. Run the scenario in two phases: first let trainee sweep normally and find nothing, then demonstrate the waterfall approach. Use the correlation test — make noise near the device and show how burst activity increases. This is the key technique.',
    debriefPoints: ['Why did the standard sweep miss it?', 'What does the waterfall stripe pattern indicate?', 'How does the correlation test work and why is it necessary?', 'What would the NLJD have found even if RF detection failed?', 'What commercial devices use FHSS and should be in the baseline?'],
  },
  {
    id: 'SCEN-04',
    name: 'Network-based surveillance detection',
    difficulty: 'INTERMEDIATE',
    objective: 'Trainee detects unauthorized wireless surveillance devices through network analysis rather than RF spectrum analysis.',
    timeRequired: '30–45 minutes',
    equipment: ['WiFi scanner (Kismet or WiFi Pineapple Mark VII)', 'Laptop with Nmap', 'Known AP inventory list', 'Planted devices: Raspberry Pi zero W with webcam streaming to internet via WiFi, fake AP (ESP8266 captive portal)'],
    planted: [
      { device: 'Raspberry Pi Zero W running mjpeg-streamer (hidden WiFi camera)', location: 'Inside power strip or book on shelf', detectionMethod: 'Unknown BSSID/client in WiFi scan; Nmap of network finds unknown host; HTTP port 80 returns MJPEG stream', difficulty: 'Medium — requires network methodology, not just RF scan' },
      { device: 'ESP8266 rogue AP (same SSID as corporate WiFi with slightly different BSSID)', location: 'Plugged into outlet behind furniture', detectionMethod: 'WiFi scan shows duplicate SSID with different BSSID; signal strength analysis shows second SSID from different direction', difficulty: 'Medium — requires SSID/BSSID correlation check' },
    ],
    redHerrings: ['Bluetooth speaker (legitimate)', 'Authorized AP in adjacent room (detectable but expected)'],
    passConditions: ['Identify unknown WiFi client', 'Identify rogue AP (duplicate SSID)', 'Determine camera streaming via HTTP', 'Document both findings with BSSID, RSSI, location'],
    failConditions: ['Miss either device', 'Fail to correlate rogue AP BSSID against inventory'],
    instructorNotes: 'This scenario directly reflects the WiFi Pineapple / Eero finding from your real-world exercise. The ESP8266 rogue AP scenario tests BSSID inventory discipline. Emphasize that network methodology (Kismet, Nmap) is complementary to RF spectrum analysis — some devices are easier to detect via network than spectrum.',
    debriefPoints: ['What did the RF spectrum show for these devices vs what the network scan showed?', 'Why is BSSID inventory important?', 'What would happen if the Pi used a cellular connection instead of WiFi?', 'How does this connect to the Eero mesh network data sovereignty finding?'],
  },
  {
    id: 'SCEN-05',
    name: 'Full threat simulation — certification standard',
    difficulty: 'EXPERT',
    objective: 'Complete sweep of a conference room with 4 planted devices of varying types, 3 red herrings, time pressure, and documentation requirement. Mirrors real-world sweep conditions.',
    timeRequired: '90–120 minutes',
    equipment: ['Full TSCM kit: TinySA Ultra, SDR (HackRF/RTL-SDR), NLJD, directional antenna', 'Sweep documentation forms', 'Planted devices: see below'],
    planted: [
      { device: 'FM bug at 433 MHz (continuous)', location: 'Behind ceiling tile near HVAC vent', detectionMethod: 'Spectrum scan (continuous carrier); direction finding with log-periodic; physical inspection of ceiling tiles', difficulty: 'Medium' },
      { device: 'GSM bug (call-triggered)', location: 'Concealed in artificial plant on conference table', detectionMethod: 'NLJD detects electronics in plant; physical inspection; GSM flutter if call is initiated during sweep', difficulty: 'Hard — requires NLJD, may not be transmitting during RF scan' },
      { device: 'Wired mic (no RF, connected to room next door)', location: 'Behind wall socket near head of table', detectionMethod: 'NLJD detects microphone capsule behind outlet; new screw on faceplate; physical inspection', difficulty: 'Hard — no RF emission' },
      { device: 'WiFi camera (connected to corporate guest WiFi)', location: 'Inside a USB charger on side credenza', detectionMethod: 'Unknown BSSID in WiFi scan; strong RSSI from unexpected direction; physical inspection of charger', difficulty: 'Medium — network scan required' },
    ],
    redHerrings: ['Smoke detector with legitimate BLE occupancy sensor (newer Kidde model)', 'UPS on credenza with normal powerline signaling (PFC emissions)', 'Cordless conference phone on 5.8 GHz DECT'],
    passConditions: ['Find all 4 planted devices', 'Correctly characterize each device type', 'Correctly exclude all 3 red herrings with documentation rationale', 'Complete sweep documentation form', 'Finish within time limit'],
    failConditions: ['Miss any planted device', 'Flag any red herring as confirmed threat without further investigation note', 'Incomplete documentation', 'Exceed time limit by more than 15 minutes'],
    instructorNotes: 'Calibrate difficulty by deciding whether to trigger the GSM bug during the sweep (makes it easier) or leave it dormant (requires trainee to rely on NLJD). Vary time pressure to simulate real-world urgency. The DECT phone red herring is particularly important — DECT FHSS looks similar to a bug in waterfall mode. Trainee must identify it as a known authorized device via physical inspection and documentation.',
    debriefPoints: ['Which device was hardest to find and why?', 'What would have been missed with RF-only approach?', 'Were red herrings investigated before exclusion?', 'Review documentation completeness and accuracy', 'What would they do differently?'],
  },
]

// ─── Survey Report Template Data ─────────────────────────────────────────────

export interface SurveyReportData {
  zones: string[]
  findingCategories: string[]
  deviceCategories: string[]
  riskLevels: { level: string; description: string; action: string }[]
  reportFields: { section: string; fields: { name: string; type: string; placeholder: string }[] }[]
}

export const surveyReportTemplate: SurveyReportData = {
  zones: ['Lobby / Reception', 'Conference Room A', 'Conference Room B', 'Executive Suite', 'Server Room', 'Open Office Area', 'SCIF / Classified Area', 'Restrooms', 'Break Room', 'Storage / Utility', 'Exterior / Perimeter', 'Other (specify)'],
  findingCategories: ['RF anomaly — identified', 'RF anomaly — unresolved', 'NLJD hit — electronic device confirmed', 'NLJD hit — false positive (corrosion/metal)', 'Physical indicator — suspicious', 'Physical indicator — benign explanation', 'Network anomaly — unauthorized device', 'Phone line anomaly', 'Powerline anomaly', 'Device recovered', 'No findings'],
  deviceCategories: ['Audio bug — RF transmitting', 'Audio bug — wired (no RF)', 'Audio bug — cellular (GSM/LTE)', 'Video device — wired', 'Video device — wireless', 'Tracking device — GPS', 'Tracking device — cellular', 'Network device — unauthorized', 'Phone line tap — series', 'Phone line tap — parallel', 'Carrier current device', 'Unknown — submitted for analysis'],
  riskLevels: [
    { level: 'CRITICAL', description: 'Active surveillance device confirmed and recovered', action: 'Immediate notification of security officer. Preserve chain of custody. Do not discuss in facility. Brief in secure alternate location.' },
    { level: 'HIGH', description: 'Strong indicator of surveillance device — unresolved anomaly or suspected device not yet confirmed', action: 'Suspend sensitive discussions in affected space pending resolution. Escalate to senior TSCM. Schedule follow-up sweep within 48 hours.' },
    { level: 'MEDIUM', description: 'Physical indicators or anomaly requiring investigation — no device confirmed', action: 'Document and monitor. Schedule detailed inspection. Do not ignore.' },
    { level: 'LOW', description: 'Minor anomaly with plausible benign explanation — documented and resolved', action: 'Document explanation. No further action unless recurs.' },
    { level: 'NO FINDINGS', description: 'Sweep completed with no anomalies detected', action: 'Document sweep completion. Schedule next sweep per facility security plan.' },
  ],
  reportFields: [
    {
      section: 'Case Information',
      fields: [
        { name: 'Case Number', type: 'text', placeholder: 'TSCM-YYYY-NNNN' },
        { name: 'Facility / Location', type: 'text', placeholder: 'Building, Room, Address' },
        { name: 'Date of Survey', type: 'date', placeholder: '' },
        { name: 'Survey Start Time', type: 'time', placeholder: '' },
        { name: 'Survey End Time', type: 'time', placeholder: '' },
        { name: 'Lead Examiner', type: 'text', placeholder: 'Name, Certification' },
        { name: 'Team Members', type: 'textarea', placeholder: 'Name, Role' },
        { name: 'Requesting Authority', type: 'text', placeholder: 'Name, Organization, Authorization reference' },
        { name: 'Classification', type: 'select', placeholder: 'UNCLASSIFIED / CUI / CONFIDENTIAL / SECRET' },
      ],
    },
    {
      section: 'Equipment Used',
      fields: [
        { name: 'Spectrum Analyzers', type: 'textarea', placeholder: 'Make, model, serial, calibration date' },
        { name: 'NLJD', type: 'textarea', placeholder: 'Make, model, serial, last calibration' },
        { name: 'SDR Receivers', type: 'textarea', placeholder: 'Make, model, serial' },
        { name: 'Phone Line Analyzer', type: 'textarea', placeholder: 'Make, model, serial' },
        { name: 'Other Equipment', type: 'textarea', placeholder: 'List all other tools used' },
      ],
    },
    {
      section: 'Environmental Baseline',
      fields: [
        { name: 'Ambient Noise Floor (dBm)', type: 'text', placeholder: 'e.g. -95 dBm at 433 MHz' },
        { name: 'Known Authorized RF Sources', type: 'textarea', placeholder: 'List all authorized APs, phones, devices with frequency and level' },
        { name: 'Pre-sweep WiFi AP Inventory', type: 'textarea', placeholder: 'SSID, BSSID, channel, RSSI for each AP' },
        { name: 'Baseline Anomalies', type: 'textarea', placeholder: 'Any expected anomalies noted before sweep' },
      ],
    },
    {
      section: 'Zones Surveyed',
      fields: [
        { name: 'Zones Included', type: 'textarea', placeholder: 'List each zone swept with start/end time' },
        { name: 'Zones Excluded', type: 'textarea', placeholder: 'List any areas not swept with reason for exclusion' },
        { name: 'Access Limitations', type: 'textarea', placeholder: 'Any areas inaccessible during sweep' },
      ],
    },
    {
      section: 'Findings',
      fields: [
        { name: 'Finding #', type: 'text', placeholder: 'F-001, F-002...' },
        { name: 'Zone / Location', type: 'text', placeholder: 'Specific room, surface, object' },
        { name: 'Finding Category', type: 'select', placeholder: 'Select category' },
        { name: 'Description', type: 'textarea', placeholder: 'Detailed description of anomaly or device' },
        { name: 'Frequency / Level', type: 'text', placeholder: 'If RF: frequency in MHz, level in dBm' },
        { name: 'Modulation', type: 'text', placeholder: 'If RF: NFM / FM / FHSS / OFDM / etc.' },
        { name: 'Risk Level', type: 'select', placeholder: 'CRITICAL / HIGH / MEDIUM / LOW' },
        { name: 'Action Taken', type: 'textarea', placeholder: 'What was done with this finding' },
        { name: 'Evidence / Photos', type: 'text', placeholder: 'Reference to supporting documentation' },
      ],
    },
    {
      section: 'Conclusions and Recommendations',
      fields: [
        { name: 'Overall Assessment', type: 'textarea', placeholder: 'Summary assessment of sweep results' },
        { name: 'Immediate Actions Required', type: 'textarea', placeholder: 'Any actions required before space is used again' },
        { name: 'Long-term Recommendations', type: 'textarea', placeholder: 'Countermeasure recommendations, access control, re-sweep schedule' },
        { name: 'Next Sweep Recommended', type: 'date', placeholder: '' },
        { name: 'Examiner Certification', type: 'text', placeholder: 'Signature, certification number, date' },
      ],
    },
  ],
}

// ─── Rogue Base Station Reference ────────────────────────────────────────────

export interface RBSTechnique {
  name: string
  generation: '2G' | '3G' | '4G LTE' | '5G NR' | 'All'
  description: string
  protocolMechanism: string
  keyVulnerability: string
  indicators: string[]
  difficulty: 'LOW' | 'MED' | 'HIGH' | 'VERY HIGH'
  notes: string
}

export const rbsTechniques: RBSTechnique[] = [
  {
    name: '2G GSM downgrade + intercept',
    generation: '2G',
    description: 'The classic attack. A rogue BTS (Base Transceiver Station) broadcasts with higher RSSI than the legitimate tower. GSM devices automatically connect to the strongest signal. The rogue station then relays to the real network — acting as a man-in-the-middle — or simply drops the connection and captures IMSI/IMEI.',
    protocolMechanism: 'GSM has no mutual authentication — the network authenticates the handset but the handset cannot verify the network. The rogue BTS sends a Location Update Accept after the device connects. Can instruct the device to use A5/0 (no encryption) or A5/1 (weak — breakable in real time with rainbow tables). Voice and SMS in the clear.',
    keyVulnerability: 'Unilateral authentication. Handset trusts any BTS broadcasting on a GSM frequency with sufficient RSSI. No mechanism to verify legitimacy of network.',
    indicators: [
      'Sudden 4G→2G or 3G→2G downgrade on device',
      'Strong GSM signal (850/900/1800/1900 MHz) that cannot be correlated to a licensed tower in that location',
      'Cell ID (LAC/CID) not present in OpenCelliD or Mozilla Location Services database',
      'A5/0 encryption mode (no encryption) indicated by SnoopSnitch or protocol analyzer',
      'IMSI being sent in plaintext during Location Update before authentication',
      'TDMA burst pattern detectable on spectrum analyzer at 217 Hz intervals',
      'All devices in area simultaneously downgrading to 2G',
    ],
    difficulty: 'LOW',
    notes: 'GSM is fully broken from an authentication standpoint. The required hardware (USRP B200, BladeRF, HackRF) costs $300–$1500. Software (OpenBTS, OsmocomBB, YateBTS, Osmocom) is open source. This attack has been demonstrated publicly at DEF CON since 2010. The 2G downgrade is the defining indicator for IMSI catchers in the field.',
  },
  {
    name: '3G UMTS false base station',
    generation: '3G',
    description: '3G introduced mutual authentication via AKA (Authentication and Key Agreement) — the handset can verify the network. However, a rogue BTS can still force a downgrade to 2G by pretending to have no 3G coverage, then attacking via GSM. Pure 3G interception without downgrade is significantly harder but possible with nation-state resources.',
    protocolMechanism: 'UMTS uses USIM-based AKA — both the device and network authenticate each other using shared secret Ki. A rogue UMTS BTS cannot complete authentication without Ki. However: (1) devices can be forced to fall back to 2G if the rogue station indicates unavailability, (2) some UMTS configurations still allow unencrypted bearers, (3) RNC (Radio Network Controller) spoofing at protocol layer is possible with advanced equipment.',
    keyVulnerability: 'Downgrade path to 2G remains the primary attack vector. UMTS itself is significantly more resistant to direct impersonation than GSM.',
    indicators: [
      'Device showing 3G but RSSI much stronger than expected from nearest licensed 3G tower',
      'Repeated connection drops followed by 2G connection (forced downgrade)',
      'Cell ID not in MLS/OpenCelliD for 3G (UMTS) network',
      'RNC ID not matching any carrier record for that area',
    ],
    difficulty: 'HIGH',
    notes: '3G mutual authentication largely closes the pure impersonation path. Most real-world attacks against 3G-capable devices use the 2G fallback. Passive UMTS protocol analysis requires expensive equipment (R&S TSMW, Keysight) or modified commercial devices. For TSCM purposes, detection focus is on the downgrade attack rather than direct 3G intercept.',
  },
  {
    name: '4G LTE IMSI catcher (passive)',
    generation: '4G LTE',
    description: 'LTE has strong mutual authentication (EPS-AKA) making full MitM interception extremely difficult. However, passive IMSI collection remains possible via the Attach Request process — devices transmit IMSI (or GUTI that maps to IMSI) before authentication completes. Combined with a forced fallback, LTE IMSI catchers harvest identity without full session intercept.',
    protocolMechanism: 'LTE Attach procedure: (1) UE sends Attach Request with IMSI or GUTI to eNodeB, (2) eNodeB forwards to MME, (3) MME triggers Authentication. A rogue eNodeB can capture the Attach Request (containing IMSI/GUTI) before authentication begins. Cannot decrypt content without Kasumi/SNOW 3G keys. Forcing IMSI retransmission: sending Identity Request after receiving GUTI forces the device to send its actual IMSI.',
    keyVulnerability: 'IMSI transmitted before mutual authentication completes. Identity Request message (MME→UE) in LTE can force IMSI disclosure even when device would prefer to send GUTI.',
    indicators: [
      'eNodeB broadcasting LTE parameters (MCC/MNC/TAC/Cell ID) not in carrier database',
      'Strong LTE signal in area where coverage maps show weak or no signal',
      'Devices repeatedly cycling Attach/Detach (signature of failed auth or forced reassociation)',
      'LTE signal present but data connectivity fails (rogue station captures IMSI but cannot complete auth)',
      'TAC (Tracking Area Code) inconsistent with carrier\'s known TA layout for that geography',
    ],
    difficulty: 'HIGH',
    notes: 'Commercial-grade LTE IMSI catchers exist (Harris StingRay II, DRT Dirtbox, Rohde & Schwarz equipment) and are sold exclusively to law enforcement/government. Commodity SDR hardware cannot replicate full LTE eNodeB capability — this attack requires purpose-built or heavily modified commercial equipment. Detection is significantly harder than GSM because there is no obvious 2G downgrade indicator.',
  },
  {
    name: 'LTE-to-2G forced downgrade (downgrade attack)',
    generation: '4G LTE',
    description: 'The most practical LTE attack. An LTE-capable rogue station advertises an LTE network but instructs devices to redirect to 2G using RRC Connection Release with redirect information. The device then connects to a rogue GSM BTS on the redirected frequency where full interception is possible.',
    protocolMechanism: 'RRC (Radio Resource Control) Connection Release message in LTE includes optional redirectedCarrierInfo — instructs the UE to connect to another frequency, potentially another technology (GERAN = 2G, UTRAN = 3G). No authentication is required on this redirect message in the RRC layer. Device trusts the instruction from what it believes is the LTE network.',
    keyVulnerability: 'RRC Connection Release redirect is unauthenticated at the air interface layer. Device follows redirect to potentially adversarial 2G network.',
    indicators: [
      'Same as 2G downgrade indicators after redirect',
      'Unexpected LTE→2G drop in an area with confirmed LTE coverage',
      'Multiple devices dropping to 2G simultaneously in a small geographic area',
      'LTE signal briefly appears then disappears, followed by 2G connection',
    ],
    difficulty: 'MED',
    notes: 'This is the bridge between LTE capability and GSM interception capability. A sophisticated operator can run both: an LTE rogue eNodeB to capture the redirect, and a GSM rogue BTS to perform the actual intercept. Requires capability at both frequency ranges simultaneously. IMSI Catcher Catchers (Android apps) specifically detect this pattern.',
  },
  {
    name: '5G NR — current state',
    generation: '5G NR',
    description: '5G introduces SUPI (Subscriber Permanent Identifier) concealment using SUCI (Subscription Concealed Identifier) — the device encrypts its permanent identity with the home network\'s public key before transmission, preventing passive IMSI harvesting at the air interface. Additionally, 5G SA (Standalone) mode substantially increases authentication security.',
    protocolMechanism: 'SUCI concealment: IMSI (now called SUPI) is encrypted with the home network\'s ECIES public key before being sent over the air. A rogue gNB receives only an encrypted SUCI — useless without the home network\'s private key. 5G AKA and EAP-AKA\' provide enhanced mutual authentication. However: (1) many "5G" deployments are NSA (Non-Standalone) running on LTE core — all LTE vulnerabilities still apply, (2) downgrade to LTE/3G/2G remains possible in NSA mode, (3) 5G SA with SUCI is the future, not the present.',
    keyVulnerability: 'Most 5G deployments (NSA mode) still use LTE core — SUCI protection is only fully effective in 5G SA mode. Downgrade attacks to LTE or 2G remain viable. 5G SA coverage is limited (2024–2025 deployment still maturing).',
    indicators: [
      '5G NSA indicators are effectively the same as LTE — same vulnerabilities apply',
      'Check whether device is on SA (Standalone) or NSA (Non-Standalone) 5G — NSA devices are still vulnerable via LTE attacks',
    ],
    difficulty: 'VERY HIGH',
    notes: 'True 5G SA with SUCI effectively closes the passive IMSI harvesting vulnerability at the air interface. This is the first generation that provides genuine air-interface identity protection. However, widespread 5G SA deployment is years away from being the dominant mode in most markets. For current TSCM purposes: if a device shows 5G NSA, treat it as LTE for threat assessment. If 5G SA is confirmed, identity harvesting risk at air interface is substantially reduced — but the device remains vulnerable when moving between cells and during any 4G/3G/2G fallback.',
  },
  {
    name: 'Private LTE / CBRS as cover',
    generation: '4G LTE',
    description: 'Citizens Broadband Radio Service (CBRS) in the 3.5 GHz band allows private LTE network deployment without traditional carrier licensing. A sophisticated adversary can deploy a legitimate-appearing private LTE network in or near a target facility, using it as both a cover story for detected cellular signals and as an intelligence collection platform for devices that connect to it.',
    protocolMechanism: 'CBRS (3550–3700 MHz) is licensed-by-registration through a Spectrum Access System (SAS). An adversary could register a legitimate CBRS small cell, deploy it near or inside a facility, and configure it to collect device associations while appearing as a valid private LTE network. Devices configured to connect to "private 5G" or CBRS networks could be silently enrolled.',
    keyVulnerability: 'Legitimate spectrum access makes the signal harder to dismiss as unauthorized. Organizations implementing private LTE/5G for facility coverage create an expectation of local cellular infrastructure that adversaries can exploit.',
    indicators: [
      'CBRS signals (3.5 GHz) in areas where no private LTE deployment has been authorized',
      'Unknown eNodeB in CBRS band that cannot be correlated to a registered SAS entry',
      'Private LTE APN (Access Point Name) appearing on devices that should not be connecting to private networks',
      'Strong 3.5 GHz signal from within a facility with no documented CBRS deployment',
    ],
    difficulty: 'HIGH',
    notes: 'Verify CBRS deployments against FCC SAS records. Any CBRS eNodeB visible inside a facility should be documented in the facility\'s authorized equipment inventory. This attack vector becomes more relevant as private LTE/5G deployments proliferate in enterprise environments.',
  },
]

export interface RBSHardware {
  name: string
  type: 'Commercial / LE' | 'Research / SDR' | 'Software'
  generations: string[]
  description: string
  capabilities: string[]
  limitations: string[]
  availability: string
  detectionSignificance: string
}

export const rbsHardware: RBSHardware[] = [
  {
    name: 'Harris StingRay / KingFish / Hailstorm',
    type: 'Commercial / LE',
    generations: ['2G', '3G', '4G LTE'],
    description: 'The canonical law enforcement IMSI catcher family. Briefcase to vehicle-mounted form factors. KingFish is the handheld version, Hailstorm adds LTE capability.',
    capabilities: ['IMSI/IMEI harvesting across multiple generations', 'Call and SMS intercept on 2G', 'LTE IMSI collection', 'Location tracking via RSSI triangulation', 'Forced downgrade to 2G'],
    limitations: ['Requires warrant/court order in most US jurisdictions (though widely contested)', 'Sold exclusively to government agencies', 'Known cellular signal signatures', 'Dirtbox (airborne variant) has different characteristics'],
    availability: 'US government / law enforcement only. Harris Corporation (now L3Harris). Export controlled.',
    detectionSignificance: 'Presence indicates law enforcement or adversarial government operation. 2G downgrade is primary indicator. SnoopSnitch detection is reliable for GSM mode. LTE mode leaves fewer indicators.',
  },
  {
    name: 'DRT / "Dirtbox" (Digital Receiver Technology)',
    type: 'Commercial / LE',
    generations: ['2G', '3G', '4G LTE'],
    description: 'Boeing subsidiary DRT makes airborne IMSI catchers (hence "Dirtbox"). Deployed from Cessna aircraft — can sweep IMSIs from thousands of devices below. Ground-based versions also exist.',
    capabilities: ['High-altitude wide-area IMSI collection', 'Multiple generation support', 'High throughput — can process many devices simultaneously'],
    limitations: ['Airborne deployment is detectable (aircraft presence)', 'Ground mode similar signature to StingRay'],
    availability: 'DOJ, DEA, US Marshals documented use via FOIA disclosures.',
    detectionSignificance: 'Airborne IMSI catching creates a different detection profile — devices across a wide area simultaneously show downgrade indicators. No directional single-building source.',
  },
  {
    name: 'USRP + OpenBTS / srsRAN',
    type: 'Research / SDR',
    generations: ['2G', '4G LTE'],
    description: 'Software-defined radio platform (Ettus USRP B200/B210/N210) running open-source cellular stacks. OpenBTS implements GSM/GPRS. srsRAN (formerly srsLTE) implements full LTE eNodeB and EPC core.',
    capabilities: ['Full GSM BTS with voice/data/SMS', 'LTE eNodeB for IMSI collection and redirect', 'Configurable to any cellular band with appropriate RF frontend', 'Open source — fully auditable and modifiable'],
    limitations: ['GSM TX requires FCC Part 90 or Part 25 license for any transmission', 'LTE TX on carrier bands is illegal without authorization', 'Limited RF power compared to commercial equipment', 'Requires technical expertise to operate'],
    availability: 'USRP hardware commercially available ($700–$2000). Software freely downloadable. Combined capability is accessible to technically sophisticated actors.',
    detectionSignificance: 'Commodity SDR-based rogue BTS has same RF signature as commercial equipment at the protocol level. Power output may be lower — RSSI of rogue station may be weaker than expected for the apparent location. Protocol analysis more reliable than power-level analysis.',
  },
  {
    name: 'BladeRF / LimeSDR + OsmocomBB',
    type: 'Research / SDR',
    generations: ['2G'],
    description: 'Lower-cost SDR platforms capable of GSM BTS operation. OsmocomBB is the open-source GSM protocol stack running on modified Motorola phones or SDR hardware. More limited capability than USRP/srsRAN but very low cost.',
    capabilities: ['GSM BTS (2G only)', 'IMSI harvesting on GSM', 'SMS interception on A5/0 configured networks'],
    limitations: ['2G only — no LTE capability', 'Limited RF performance', 'Requires hardware modification for active TX in some configurations'],
    availability: 'BladeRF ~$400–$700. LimeSDR ~$250–$400. Software open source.',
    detectionSignificance: 'Lower power, potentially more errors in protocol implementation (detectable by protocol analyzers). Same conceptual threat as USRP-based systems.',
  },
  {
    name: 'Rohde & Schwarz TSMA / TSMU',
    type: 'Commercial / LE',
    generations: ['2G', '3G', '4G LTE', '5G NR'],
    description: 'Professional cellular network monitoring and analysis equipment. Designed for carrier network troubleshooting and regulatory enforcement. Can be repurposed for IMSI collection and network analysis.',
    capabilities: ['Multi-generation simultaneous monitoring', '5G NR monitoring', 'Protocol-level decode across all generations', 'High-accuracy geolocation', 'Drive test and stationary monitoring modes'],
    limitations: ['Very expensive (>$100K)', 'Designed for monitoring, not active attack — modifications required for active BTS spoofing'],
    availability: 'Commercial — network operators, regulators, government agencies. R&S Distributor network.',
    detectionSignificance: 'Equipment at this level can passively map all cellular activity in an area without transmitting — invisible to standard detection methods. Primary threat: intelligence collection without active transmission.',
  },
  {
    name: 'srsRAN / OpenLTE / LTE-Cell-Scanner',
    type: 'Software',
    generations: ['4G LTE'],
    description: 'Open-source LTE software stacks. srsRAN provides a complete LTE eNodeB, EPC, and UE implementation. LTE-Cell-Scanner is passive monitoring only. OpenLTE implements portions of the LTE stack for analysis.',
    capabilities: ['Full LTE eNodeB implementation (srsRAN)', 'LTE passive monitoring and cell scanning', 'Protocol-level analysis of live LTE traffic', 'Configurable for IMSI collection scenarios'],
    limitations: ['Active TX requires LTE-capable SDR (USRP B200+ recommended)', 'Computationally intensive', 'Requires licensed spectrum for any transmission'],
    availability: 'Open source (GitHub). Requires separate SDR hardware.',
    detectionSignificance: 'Combined with USRP, srsRAN enables a complete LTE rogue base station from commercially available hardware. The research and security testing use cases create significant dual-use concern.',
  },
]

export interface RBSDetectionMethod {
  method: string
  category: 'Passive RF' | 'Protocol analysis' | 'Database correlation' | 'App-based' | 'Commercial equipment'
  description: string
  capability: string[]
  limitations: string[]
  cost: string
  tools: string[]
  tscmWorkflow: string
}

export const rbsDetectionMethods: RBSDetectionMethod[] = [
  {
    method: 'RSSI anomaly monitoring',
    category: 'Passive RF',
    description: 'Establish baseline cellular RSSI for all observed cell towers in and around the facility. A rogue base station typically has RSSI significantly stronger than would be expected for its apparent location relative to licensed towers. Compare observed RSSI vs carrier coverage maps and tower distance calculations.',
    capability: [
      'Detects anomalously strong signals from unexpected directions',
      'Identifies new signals that appear without corresponding tower construction',
      'Works for all generations (2G–5G)',
      'Passive — no transmission required',
    ],
    limitations: [
      'Baseline must be established before the rogue station appears',
      'Femtocells and small cells from carriers create legitimate strong local signals',
      'Requires access to carrier coverage maps for comparison',
      'Indoor propagation makes direction analysis difficult',
    ],
    cost: 'Low — SDR or commercial spectrum analyzer already part of TSCM kit',
    tools: ['SDR + SDR++ or GQRX (passive cellular monitoring)', 'TinySA Ultra with wideband antenna', 'Commercial cellular scanner (R&S, Anritsu)', 'Nemo Handy drive test app'],
    tscmWorkflow: 'During pre-sweep baseline: scan all cellular bands (700, 850, 900, 1700, 1800, 1900, 2100, 2500 MHz) and record all observed cell IDs with RSSI. Note the direction of strong signals. Cross-reference with carrier maps. Flag any signal stronger than -70 dBm inside the facility without a documented carrier small cell or DAS.',
  },
  {
    method: 'Cell ID / tower database correlation',
    category: 'Database correlation',
    description: 'Every legitimate cellular base station has a unique Cell ID (for GSM: LAC + Cell ID; for LTE: PLMN + TAC + Cell ID / EARFCN). Cross-reference observed cell IDs against community databases (OpenCelliD, Mozilla Location Services) and FCC license records. A rogue base station typically uses either a spoofed legitimate cell ID or an unclaimed ID that doesn\'t appear in any database.',
    capability: [
      'Definitively identifies base stations not present in community databases',
      'Cross-references FCC licensee data for transmitter location',
      'Works across all generations',
      'Can be run passively from a phone or SDR',
    ],
    limitations: [
      'Community databases (OpenCelliD) are incomplete — especially for rural areas, new towers, and small cells',
      'Adversary may clone a legitimate cell ID from a real distant tower',
      'Private LTE (CBRS) may legitimately appear without carrier records',
      'Real towers added after last database update won\'t be present',
    ],
    cost: 'Free (OpenCelliD API is free for limited use, Mozilla Location Services is free)',
    tools: ['OpenCelliD (opencellid.org)', 'Mozilla Location Services (MLS)', 'FCC CDBS / LMS license database', 'SnoopSnitch (uses MLS internally)', 'CellMapper app (crowdsourced tower mapping)'],
    tscmWorkflow: 'Enumerate all visible cell IDs using SDR or Android phone (Network Signal Guru app shows full cell parameter list). Query each MCC/MNC/LAC/CID against OpenCelliD API. Flag any that return no result or whose reported location is inconsistent with the observed signal direction/strength. Rogue base stations often use MNC values not licensed to any carrier in the area.',
  },
  {
    method: '2G encryption mode monitoring',
    category: 'Protocol analysis',
    description: 'GSM encryption is negotiated during call setup — the BTS instructs the handset to use A5/0 (no encryption), A5/1 (weak 64-bit cipher), or A5/3 (stronger KASUMI cipher). Legitimate carriers universally use A5/1 or A5/3. A rogue BTS performing intercept will typically instruct A5/0 (no encryption) to capture cleartext. Monitoring for A5/0 assignments is one of the most reliable rogue BTS indicators on 2G.',
    capability: [
      'Direct indicator of active intercept attempt on 2G',
      'A5/0 from a legitimate carrier is essentially impossible — strong indicator',
      'Detectable with protocol-aware SDR tools',
    ],
    limitations: [
      '2G only — no equivalent indicator on 3G/4G (different crypto architecture)',
      'Some legacy carrier configurations may use A5/0 in areas with encryption off (rare)',
      'Requires GSM protocol decode capability',
    ],
    cost: 'Medium — requires GSM-capable SDR with protocol decode',
    tools: ['OsmocomBB (modified GSM phone for protocol monitoring)', 'Airprobe + Wireshark (GSM protocol decode from SDR)', 'SnoopSnitch (detects A5/0 mode on Android)', 'AIMSICD (detects encryption mode changes)'],
    tscmWorkflow: 'If protocol decode is available: monitor GSM channels (850/900/1800/1900 MHz) for Ciphering Mode Command messages. Flag any A5/0 assignments immediately. This requires OsmocomBB or equivalent — not possible with basic spectrum analysis. SnoopSnitch on Android will alert automatically.',
  },
  {
    method: 'Protocol downgrade detection (app-based)',
    category: 'App-based',
    description: 'Android apps using the QXDM diagnostic interface or standard TelephonyManager API can monitor network registration events, encryption modes, and base station parameters. SnoopSnitch specifically detects IMSI catcher signatures including: sudden 2G downgrade, A5/0 cipher mode, unexpected Identity Request messages, and suspicious LAC/Cell ID patterns.',
    capability: [
      'Continuous passive monitoring on Android device',
      'Automated alerting for known rogue BTS signatures',
      'No additional hardware required beyond Android phone',
      'Detects 2G downgrade, A5/0, Identity Request anomalies',
    ],
    limitations: [
      'Requires Android phone with diagnostic access (varies by device/carrier)',
      'SnoopSnitch works best on specific Qualcomm chipset devices',
      'Cannot detect passive 4G/LTE IMSI collection',
      'High false positive rate in some environments (legitimate tower changes trigger alerts)',
    ],
    cost: 'Free (app download)',
    tools: ['SnoopSnitch (Android — best overall IMSI catcher detection)', 'AIMSICD (Android IMSI Catcher Detector)', 'Network Signal Guru (cell parameter monitoring)', 'Cell Spy Catcher (commercial)'],
    tscmWorkflow: 'Deploy one or more Android devices running SnoopSnitch as continuous monitors within the facility. Review alerts at sweep time. SnoopSnitch logs all base station changes, downgrade events, and cipher mode changes — export and review the log rather than relying on real-time alerts alone. Place devices in different zones to correlate location of any detected anomaly.',
  },
  {
    method: 'Commercial cellular monitoring / IMSI catcher detection',
    category: 'Commercial equipment',
    description: 'Dedicated commercial appliances designed specifically for rogue base station detection. These provide multi-generation monitoring, protocol analysis, and automated alerting without requiring operator expertise in cellular protocol analysis. Typically used for facility perimeter monitoring rather than point-in-time sweeps.',
    capability: [
      'Multi-generation simultaneous monitoring (2G–5G)',
      'Automated cell ID database correlation',
      'Protocol anomaly detection',
      'Continuous perimeter monitoring capability',
      'Geolocation of detected rogue stations',
    ],
    limitations: [
      'Very high cost ($10,000–$100,000+)',
      'Requires ongoing database subscription for cell ID verification',
      'Cannot detect purely passive monitoring equipment (no active indicator)',
    ],
    cost: 'High — commercial product purchase',
    tools: ['Pwnie Express Pwn Pulse (now Pepper IoT)', 'Bastille Networks', 'Rohde & Schwarz TSMA-based solutions', 'ESD America GSMK CryptoPhone (built-in detection)', 'Cepia Technologies IMSI Catcher Detector'],
    tscmWorkflow: 'For high-risk facilities: deploy commercial detection appliance at perimeter with antenna positioned for exterior cellular monitoring. Set alert thresholds for new cell IDs, RSSI anomalies, and downgrade events. Review alerts as part of daily security operations. Supplement with point-in-time sweep protocol.',
  },
]

export const rbsLegalFramework = {
  transmission: [
    { rule: '47 USC 333', description: 'Prohibits intentional interference with cellular communications — operating a rogue BTS that interferes with carrier signals is a federal crime regardless of purpose' },
    { rule: '47 CFR Part 25 / Part 90', description: 'Cellular spectrum is licensed — unauthorized transmission on licensed bands is an FCC violation with civil and criminal penalties' },
    { rule: '18 USC 2511', description: 'Wiretap Act — intercepting wire, oral, or electronic communications without authorization is a federal felony' },
    { rule: '18 USC 1030', description: 'Computer Fraud and Abuse Act — accessing communications systems without authorization' },
  ],
  detection: [
    { rule: 'Detection is legal', description: 'No US law prohibits passive monitoring of cellular frequencies, detecting anomalous signals, or identifying rogue base stations. The Electronic Communications Privacy Act (ECPA) prohibits intercepting content, not detecting the presence of anomalous transmissions.' },
    { rule: 'Reporting to FCC', description: 'Suspected unauthorized cellular transmission should be reported to the FCC Enforcement Bureau. Provide frequency, location, signal characteristics, and observed protocol behavior.' },
    { rule: 'Law enforcement exception', description: 'Law enforcement IMSI catchers operated under court order or legal authority are lawful. Detection of such devices is not illegal, but active countermeasures (jamming) are.' },
  ],
  operationalNotes: 'For TSCM purposes at government/military facilities: unauthorized rogue base station activity is a CI threat requiring immediate reporting through appropriate channels. Do not attempt active countermeasures. Document all observables (frequency, cell ID, RSSI, location, time) and report. Carrier current legal framework applies similarly — detection and documentation, not jamming.',
}
