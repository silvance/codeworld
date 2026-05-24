'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Lets each subpage honor `?section=<id>` deep-links from the global search
// bar AND from same-page <Link> clicks (e.g. workflow steps that jump to a
// different section on the same /osint page).
//
// Uses Next.js's useSearchParams so that client-side navigations on the same
// route — which don't remount the component — still flip the active section.
// The returned setActive is wrapped: when called by the sidebar (i.e. user
// initiated), it clears ?q= from the URL so the new section starts with a
// clean filter input.
export function useSectionParam<T extends string>(defaultId: T, validIds: readonly T[]) {
  const searchParams = useSearchParams()
  const [active, _setActive] = useState<T>(defaultId)

  // React to ?section=<id> changes — covers initial load AND in-page <Link>
  // navigations that update the search params without remounting. The
  // setState inside the effect is intentional (external-source sync).
  useEffect(() => {
    const param = searchParams.get('section')
    if (param && (validIds as readonly string[]).includes(param) && param !== active) {
      _setActive(param as T)
    }
    // validIds is stable per page; active is intentionally excluded so this
    // only fires when the URL actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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
