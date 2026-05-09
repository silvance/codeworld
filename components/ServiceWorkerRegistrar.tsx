'use client'

import { useEffect } from 'react'

// Registers /sw.js on first load. The SW caches Next static assets
// (cache-first) and HTML navigations (network-first), so the site
// keeps working offline after a first visit.
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // No-op: SW registration is best-effort. Site works fine without it.
      })
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])
  return null
}
