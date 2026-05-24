// Shape that each lib/<area>/data.ts uses to expose its entries to the
// global search bar. The lib/search module wraps these with the page name,
// color, and href.

export interface RawSearchEntry {
  /** Primary identifier the user is most likely to search for (port number, filter expression, command, event ID, etc.). */
  title: string
  /** Optional short context shown alongside the title (service name, tool, category). */
  aka?: string
  /** Description; what it does or why it matters. */
  subtitle: string
  /** The page section id this entry belongs to — must match a NAV item id on the destination page. */
  section: string
}
