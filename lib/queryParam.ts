'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Reactive hook for the global search bar's ?q= flow: search results that are
// individual entries deep-link to /<page>?section=<id>&q=<query>, and any
// in-page <Link> with ?q=<new> (e.g. workflow steps jumping to a tool) needs
// the destination section's filter input to update — even though Next.js
// doesn't remount the page on same-route navigation.
//
// Replaces the older readInitialQueryParam() helper, which only read once on
// mount and missed in-page navigations.
export function useUrlSyncedQueryParam(name: string): [string, (next: string) => void] {
  const searchParams = useSearchParams()
  const [value, setValue] = useState<string>(() => searchParams.get(name) ?? '')

  // Sync from URL → state when URL changes (initial mount AND in-page <Link>
  // navigations that update the query string without remounting). setState
  // inside the effect is intentional — this is the external-source sync case.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(searchParams.get(name) ?? '')
  }, [searchParams, name])

  return [value, setValue]
}

export function clearQueryParam(name: string): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (url.searchParams.has(name)) {
    url.searchParams.delete(name)
    window.history.replaceState(null, '', url)
  }
}
