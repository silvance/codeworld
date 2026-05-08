'use client'

import { useEffect, useState } from 'react'

// Lets each subpage honor `?section=<id>` deep-links from the global search bar.
// Reads window.location.search once on mount and switches the active section if
// the requested id matches one of the page's known NAV ids.
export function useSectionParam<T extends string>(defaultId: T, validIds: readonly T[]) {
  const [active, setActive] = useState<T>(defaultId)
  // Read once on mount to honor ?section=<id> deep-links from the search bar.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('section')
    if (param && (validIds as readonly string[]).includes(param)) setActive(param as T)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [active, setActive] as const
}
