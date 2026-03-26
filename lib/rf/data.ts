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
