'use client'

import { useCallback, useEffect, useState } from 'react'

// Lets each subpage honor `?section=<id>` deep-links from the global search bar.
// Reads window.location.search once on mount and switches the active section if
// the requested id matches one of the page's known NAV ids.
//
// The returned setActive is wrapped: when called by the sidebar (i.e. user
// initiated), it clears ?q= from the URL so the new section starts with a
// clean filter input. The initial URL-driven setState happens through the
// internal _setActive and does NOT clear q=, so deep-links land with the
// section's local search input pre-populated.
export function useSectionParam<T extends string>(defaultId: T, validIds: readonly T[]) {
  const [active, _setActive] = useState<T>(defaultId)

  // Read once on mount to honor ?section=<id> deep-links from the search bar.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('section')
    if (param && (validIds as readonly string[]).includes(param)) _setActive(param as T)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setActive = useCallback((next: T) => {
    _setActive(next)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (url.searchParams.has('q')) {
      url.searchParams.delete('q')
      window.history.replaceState(null, '', url)
    }
  }, [])

  return [active, setActive] as const
}
