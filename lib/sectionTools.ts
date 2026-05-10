// Shared shape for "Tools used here" intro cards across every page.
// Each subpage's lib/<area>/sectionTools.ts produces a Partial<Record<SectionId, SectionTool[]>>
// keyed by its own SectionId type.

export interface SectionTool {
  name: string
  /** What the tool is and when to use it, in 2-3 sentences. */
  description: string
  url?: string
  /** Optional gotcha or runtime note shown in muted text below the description. */
  notes?: string
}
