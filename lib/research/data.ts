// ─── Research & Whitepapers data ─────────────────────────────────────────────

export type PaperStatus = 'draft' | 'review' | 'published' | 'disclosed' | 'pending-disclosure'

export type PaperTag =
  | 'TSCM' | 'WiFi' | 'Mesh networking' | 'Rogue AP' | 'IoT'
  | 'Digital forensics' | 'Network forensics' | 'RF' | 'Cellular'
  | 'Responsible disclosure' | 'Privacy' | 'Android' | 'iOS'

export interface PaperSection {
  heading: string
  body: string // markdown-lite: paragraphs separated by \n\n, code blocks with ```
}

export interface Paper {
  id: string
  title: string
  subtitle?: string
  authors: string[]
  date: string           // ISO date of last significant update
  publishedDate?: string // ISO date of public release
  status: PaperStatus
  category: string
  tags: PaperTag[]
  abstract: string
  keyFindings: string[]
  pdfPath?: string       // path under /public/
  sections: PaperSection[]
  disclosureTimeline?: { date: string; event: string }[]
  references?: { label: string; url?: string; note: string }[]
  citationKey?: string   // for BibTeX if added later
}

export const papers: Paper[] = [
  {
    id: 'eero-rf-neighbor-persistence',
    title: 'Persistent RF Neighbor Data in Eero Mesh Networks Following Rogue AP Removal',
    subtitle: 'A TSCM Finding: WiFi Pineapple Mark VII BSSID Persistence After Power-Off',
    authors: ['codeworld.codes'],
    date: '2026-03-30',
    status: 'pending-disclosure',
    category: 'TSCM / Wireless',
    tags: ['TSCM', 'WiFi', 'Mesh networking', 'Rogue AP', 'IoT', 'Responsible disclosure', 'Privacy'],
    abstract: `During a controlled WiFi Pineapple Mark VII training exercise conducted at a facility with an Eero mesh network, an anomalous and potentially significant finding was observed: the BSSID of the WiFi Pineapple rogue access point persisted in internal wireless scans more than 12 hours after the device was powered off and physically removed from the premises.

More notably, the rogue BSSID appeared simultaneously from two geographically separate Eero mesh nodes — nodes that had no direct line-of-sight to the location where the Pineapple had been operating. This behavior is inconsistent with normal RF propagation and standard BSSID caching behavior, and suggests that the Eero mesh system may be collecting, distributing, and potentially syncing complete RF neighbor profiles — including BSSIDs of nearby devices — across mesh nodes and potentially to Amazon's cloud backend infrastructure.

If confirmed through controlled replication, this behavior has significant implications for TSCM sweep methodology, particularly in facilities using consumer mesh networking equipment, and raises questions about the data collection practices of mesh networking vendors.`,
    keyFindings: [
      'WiFi Pineapple BSSID persisted in Eero internal scans 12+ hours after device was powered off and removed',
      'Rogue BSSID appeared simultaneously from two geographically separate Eero mesh nodes',
      'Spatial distribution of the BSSID signal is inconsistent with standard RF propagation or local BSSID caching',
      'Behavior suggests Eero mesh nodes share complete RF neighbor profiles — including non-associated BSSIDs — across the mesh and potentially to cloud infrastructure',
      'Standard TSCM RF sweep methodology may not detect removal of a rogue AP if BSSID data is retained and redistributed by mesh infrastructure',
      'Consumer mesh networking equipment in sensitive facilities may constitute an uncontrolled RF data collection and exfiltration pathway',
    ],
    disclosureTimeline: [
      { date: '2026-03', event: 'Finding observed during training exercise' },
      { date: '2026-03', event: 'Initial documentation and white paper draft completed' },
      { date: '2026-03', event: 'Legal counsel consultation initiated prior to external disclosure' },
      { date: 'TBD',     event: 'Responsible disclosure submission to Amazon/Eero via HackerOne (90-day window)' },
      { date: 'TBD',     event: 'Controlled replication attempt — pending Eero admin credential access to clear neighbor table' },
      { date: 'TBD',     event: 'Public release — pending legal review and disclosure window' },
    ],
    pdfPath: undefined, // PDF not yet available — pending legal review
    sections: [
      {
        heading: 'Background',
        body: `WiFi Pineapple devices (Hak5 Mark VII) are commonly used in TSCM training exercises to simulate rogue access point threats. The Mark VII creates one or more rogue BSSIDs and broadcasts SSIDs to lure client devices into associating with the attacker-controlled AP.

The exercise described in this paper was conducted at a facility equipped with an Eero Pro 6 mesh network (multiple nodes). The Pineapple was deployed for a controlled exercise duration and subsequently powered off and physically removed from the facility. Standard post-exercise RF sweep methodology was followed.

Eero is Amazon's consumer mesh networking product line. Eero mesh nodes communicate with each other and with Amazon's cloud infrastructure to manage mesh coordination, firmware updates, and — relevant to this finding — network awareness features including neighboring device detection.`,
      },
      {
        heading: 'Observation',
        body: `Approximately 12 hours after the WiFi Pineapple was powered off and removed from the facility, a routine internal WiFi scan was conducted. The scan revealed the WiFi Pineapple's BSSID present in the visible network list, despite the device being confirmed powered off and off-premises.

Further investigation revealed the BSSID was appearing as a visible signal from two separate Eero mesh nodes located in different areas of the facility. The two nodes are physically separated and neither had direct RF line-of-sight to the location where the Pineapple had been operating during the exercise.

Key observations:
- BSSID match: the MAC address visible in scans matched the WiFi Pineapple exactly
- Signal persistence: 12+ hours after physical removal of the source device
- Multi-node appearance: identical BSSID simultaneously detectable via two Eero nodes at separate locations
- No other known devices with that BSSID were present or accounted for`,
      },
      {
        heading: 'Hypothesis',
        body: `The most consistent explanation for the observed behavior is that the Eero mesh system maintains and distributes RF neighbor profiles — a list of all BSSIDs observed by each node, regardless of association — across mesh nodes and potentially syncs this data to Amazon's cloud backend.

Under this hypothesis:
1. During the exercise, each Eero node within RF range of the Pineapple recorded the Pineapple's BSSID as a neighboring device
2. This RF neighbor data was propagated to other Eero nodes on the mesh (explaining the multi-node appearance)
3. The data was retained in the Eero system after the source device was removed
4. Subsequent WiFi scans detected the Eero nodes reporting the cached BSSID rather than the Pineapple itself

This behavior would be consistent with Amazon's location services infrastructure, which uses observed WiFi BSSIDs to contribute to and query a geolocation database. Eero nodes may be participating in this data collection as part of their normal operation, potentially uploading observed RF environment data to Amazon's servers.

Alternative hypotheses considered and assessed as less likely:
- Standard client-side BSSID cache persistence: does not account for multi-node simultaneous appearance or 12+ hour retention
- Passive scan cache on scanning device: controlled for — multiple devices and methods used to confirm
- MAC address collision: probability negligible given full 48-bit MAC match`,
      },
      {
        heading: 'TSCM Implications',
        body: `If the hypothesis is confirmed, this finding has significant implications for TSCM sweep methodology in facilities using mesh networking equipment:

**False negatives in post-exercise sweeps**: If a mesh network retains and redistributes the BSSID of a removed device, a sweep conducted after the device's removal may still detect the BSSID — potentially masking a clean sweep result or, conversely, creating ambiguity about whether a threat device has actually been removed.

**Mesh networks as passive RF collection infrastructure**: Consumer mesh networking devices may be silently recording all BSSIDs observed by their nodes, including BSSIDs of surveillance devices, personal phones, and other RF-emitting equipment in the facility. This data may be leaving the facility via the mesh network's cloud sync.

**Sweep baseline contamination**: Facilities relying on WiFi scanning for TSCM baseline establishment must account for the possibility that the scan results reflect mesh-cached RF data rather than real-time RF environment state.

**Vendor-specific behavior**: This observation was made on Eero hardware. Whether similar behavior occurs on other mesh platforms (Google Nest WiFi, Orbi, Velop, etc.) is unknown and warrants investigation.`,
      },
      {
        heading: 'Recommended Actions',
        body: `Pending controlled replication and vendor response, the following interim recommendations apply to TSCM practitioners operating in facilities with mesh networking equipment:

1. **Document mesh network infrastructure** as part of pre-sweep baseline. Note all mesh node locations and vendor/model.

2. **Verify BSSID source before concluding detection**: When a suspicious BSSID is detected, attempt to determine whether the signal is emanating directly from the suspected device or from a mesh node. Directional antenna work and signal strength mapping can help distinguish.

3. **Clear mesh RF neighbor cache if possible**: Administrator access to the mesh platform may allow clearing of cached neighbor data. This should be done before a definitive post-sweep confirmation scan.

4. **Treat consumer mesh equipment as a potential RF data collection point**: In sensitive facilities, consumer mesh networking equipment with cloud sync capabilities represents an uncontrolled data pathway for RF environment data. Facility security policy should address this.

5. **Establish mesh node reboot as part of sweep protocol**: Rebooting mesh nodes may clear cached neighbor data and reset the RF state, though this is unconfirmed pending controlled testing.`,
      },
      {
        heading: 'Limitations and Future Work',
        body: `This report documents a single observed instance. Controlled replication has not yet been completed due to the need to access Eero administrator credentials to clear the neighbor table between test runs and establish a clean baseline.

Planned follow-up work:
- Controlled replication: deploy WiFi Pineapple in known RF environment → confirm BSSID capture by Eero → remove Pineapple → clear Eero neighbor cache → confirm BSSID disappears → redeploy → power off → monitor persistence duration
- Network traffic analysis: capture traffic between Eero nodes and Amazon cloud infrastructure during and after exercise to determine what RF data is being transmitted
- Cross-vendor testing: repeat observation with Google Nest WiFi, Netgear Orbi, and Linksys Velop to determine scope
- Legal review: responsible disclosure to Amazon/Eero via HackerOne is pending legal consultation

This finding is presented in its current preliminary form because the core observation is documented and reproducible in the original environment, and because the TSCM methodology implications are immediately actionable regardless of the precise technical mechanism.`,
      },
    ],
    references: [
      { label: 'Hak5 WiFi Pineapple Mark VII', url: 'https://hak5.org/products/wifi-pineapple', note: 'Hardware platform used in exercise' },
      { label: 'Amazon Eero', url: 'https://eero.com', note: 'Mesh networking platform exhibiting observed behavior' },
      { label: 'HackerOne — Amazon VDP', url: 'https://hackerone.com/amazonvdp', note: 'Planned responsible disclosure target' },
      { label: 'OpenCelliD / WiGLE', url: 'https://wigle.net', note: 'Context for BSSID-based location services infrastructure' },
      { label: 'FTC — Consumer IoT Security', note: 'Regulatory context for consumer device data collection' },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const allCategories = [...new Set(papers.map(p => p.category))]
export const allTags = [...new Set(papers.flatMap(p => p.tags))]

export const statusConfig: Record<PaperStatus, { label: string; cls: string }> = {
  'draft':               { label: 'Draft',              cls: 'bg-zinc-800 text-zinc-500' },
  'review':              { label: 'Under review',        cls: 'bg-blue-950 text-blue-400' },
  'published':           { label: 'Published',           cls: 'bg-emerald-950 text-emerald-400' },
  'disclosed':           { label: 'Disclosed',           cls: 'bg-purple-950 text-purple-400' },
  'pending-disclosure':  { label: 'Pending disclosure',  cls: 'bg-amber-950 text-amber-400' },
}
