export type PaperStatus =
  | 'Draft'
  | 'Under Review'
  | 'Awaiting Disclosure'
  | 'Disclosed'
  | 'Published'

export type PaperCategory =
  | 'TSCM'
  | 'Wireless Security'
  | 'Digital Forensics'
  | 'Network Security'
  | 'Mobile Security'

export interface TimelineEvent {
  date: string
  event: string
  detail?: string
  type: 'discovery' | 'documentation' | 'disclosure' | 'response' | 'publication' | 'pending'
}

export interface Paper {
  id: string
  title: string
  shortTitle: string
  status: PaperStatus
  category: PaperCategory[]
  tags: string[]
  date: string
  lastUpdated: string
  abstract: string
  keyFindings: string[]
  methodology?: string
  tldr: string
  pdfUrl?: string
  timeline?: TimelineEvent[]
  bibtex?: string
  affectedVendors?: string[]
  disclosureNotes?: string
}

export const papers: Paper[] = [
  {
    id: 'eero-rf-neighbor-persistence',
    title: 'RF Neighbor Profile Persistence in Eero Mesh Networks: A TSCM Observation',
    shortTitle: 'Eero Mesh RF Neighbor Persistence',
    status: 'Awaiting Disclosure',
    category: ['TSCM', 'Wireless Security'],
    tags: ['WiFi', 'Mesh Networking', 'BSSID', 'RF Survey', 'TSCM', 'WiFi Pineapple', 'Eero', 'Amazon'],
    date: '2026-01-15',
    lastUpdated: '2026-03-26',
    tldr: 'A rogue BSSID introduced via WiFi Pineapple Mark VII was detected in internal network scans 12+ hours after the device was powered off and removed — appearing simultaneously from two geographically separated Eero mesh nodes, suggesting the mesh system ingests and propagates complete RF neighbor profiles.',
    abstract: `During an authorized TSCM training exercise using a WiFi Pineapple Mark VII to simulate rogue access point scenarios, an unexpected persistence anomaly was observed within an Eero mesh network environment. After the WiFi Pineapple was powered off and physically removed from the area, its BSSID continued to appear in internal RF neighbor scans sourced from Eero mesh nodes. The anomaly persisted for more than 12 hours post-removal and, critically, the rogue BSSID was simultaneously reported by two Eero nodes at geographically separated locations — nodes which had no direct RF contact with the original device location given the intervening distance and building structure.

This observation is consistent with Eero mesh nodes collecting and sharing complete RF neighbor profiles across the mesh fabric, and potentially synchronizing this data to Amazon's cloud infrastructure. If confirmed, this behavior has significant implications for TSCM sweep methodology in environments where Eero or similar mesh systems are deployed: a prior unauthorized RF device may leave a persistent trace in the mesh neighbor database that survives device removal and is detectable via the host network's own scan data.

This paper documents the observed behavior, proposes a mechanism, outlines controlled replication methodology, and discusses implications for TSCM practitioners. Responsible disclosure to Amazon/Eero is currently in progress.`,
    keyFindings: [
      'Rogue BSSID (WiFi Pineapple Mark VII) remained detectable in Eero mesh internal scans 12+ hours after device power-off and physical removal from the facility',
      'The persisted BSSID appeared simultaneously from two geographically separated Eero nodes, ruling out residual RF propagation as the explanation',
      'Eero mesh nodes appear to collect and propagate RF neighbor profiles beyond their immediate radio environment — consistent with mesh fabric synchronization or cloud backend sync',
      'Standard post-sweep RF spectrum analysis would not detect this persistence — the rogue device is no longer transmitting but its profile remains in the mesh data layer',
      'TSCM sweeps in Eero-equipped environments may require active inspection of the mesh neighbor database in addition to standard RF spectrum analysis',
      'Historical RF presence data may be accessible via the Eero admin interface or Amazon cloud records — potentially useful for forensic timeline reconstruction',
    ],
    methodology: `The observation occurred during an authorized TSCM training exercise at a controlled facility. A WiFi Pineapple Mark VII was deployed as a simulated rogue AP broadcasting a non-standard SSID on 2.4 GHz. Following the exercise, the device was powered off and removed. Subsequent internal WiFi scans detected the Pineapple's BSSID in scan results attributed to Eero mesh nodes.

The finding was initially reviewed as a potential scanning artifact. A second scan 12+ hours later reproduced the finding. Cross-referencing the reporting source nodes revealed the BSSID was attributed to two Eero nodes at separate physical locations — both lacking any plausible RF path to the original device location given the distance and building structure.

Controlled replication requires: (1) documented baseline scan showing only known BSSIDs, (2) introduction of WiFi Pineapple in one zone with known Eero node coverage, (3) device removal and power-off, (4) time-series scanning of Eero-reported neighbor data, (5) comparison of reporting nodes against RF coverage model to identify cross-propagation. Access to Eero admin credentials is required to clear the neighbor table for a clean baseline.`,
    timeline: [
      {
        date: '2025-Q4',
        event: 'Initial discovery',
        detail: 'Anomaly first observed during authorized TSCM training exercise. WiFi Pineapple BSSID detected in Eero mesh scan data 12+ hours post-removal.',
        type: 'discovery',
      },
      {
        date: '2026-01',
        event: 'Documentation and analysis',
        detail: 'Formal documentation drafted. Two documents prepared: TSCM white paper and responsible disclosure letter to Eero/Amazon.',
        type: 'documentation',
      },
      {
        date: '2026-02',
        event: 'Legal consultation initiated',
        detail: 'Consulting legal counsel prior to submission of responsible disclosure letter to Eero/Amazon via HackerOne.',
        type: 'disclosure',
      },
      {
        date: '2026-03',
        event: 'Disclosure letter prepared',
        detail: 'Draft disclosure letter completed. 90-day disclosure window to be initiated upon legal clearance.',
        type: 'pending',
      },
      {
        date: 'Pending',
        event: 'Controlled replication',
        detail: 'Requires Eero admin credentials to clear neighbor table for clean baseline. Methodology documented and ready.',
        type: 'pending',
      },
      {
        date: 'Pending',
        event: 'HackerOne submission',
        detail: 'Responsible disclosure to Amazon/Eero security team pending legal clearance.',
        type: 'pending',
      },
      {
        date: 'Pending',
        event: 'Full publication',
        detail: 'Complete paper publication pending disclosure window completion or vendor acknowledgment.',
        type: 'pending',
      },
    ],
    affectedVendors: ['Amazon (Eero)'],
    disclosureNotes: 'Responsible disclosure to Amazon/Eero is planned via HackerOne with a 90-day disclosure window. Full technical details will be withheld pending vendor response. This paper presents the observation and proposed mechanism only.',
    bibtex: `@techreport{silva2026eero,
  title        = {RF Neighbor Profile Persistence in Eero Mesh Networks: A TSCM Observation},
  author       = {Silva, J.},
  year         = {2026},
  month        = {March},
  institution  = {Independent TSCM Research},
  note         = {Awaiting responsible disclosure. https://codeworld.codes/papers/eero-rf-neighbor-persistence},
}`,
  },
]
