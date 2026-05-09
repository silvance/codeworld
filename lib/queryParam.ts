// Tiny client-only helpers for reading and clearing single query params.
// Used for the global search bar's ?q= flow: search results that are
// individual entries deep-link to /<page>?section=<id>&q=<query> so that
// the section's local filter input shows up pre-populated.

export function readInitialQueryParam(name: string): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get(name) ?? ''
}

export function clearQueryParam(name: string): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (url.searchParams.has(name)) {
    url.searchParams.delete(name)
    window.history.replaceState(null, '', url)
  }
}
