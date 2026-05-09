/* codeworld service worker
 *
 * Caching strategy:
 *   - Static assets (Next build output, fonts, OG PNGs): cache-first, long-lived.
 *   - HTML navigations: network-first with cache fallback so users can come back
 *     to recently-visited pages while offline.
 *   - Anything else (Pyodide CDN, Vercel analytics, etc.): pass through.
 *
 * Bumping CACHE_VERSION evicts old caches on the next activation.
 */

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `codeworld-static-${CACHE_VERSION}`
const PAGES_CACHE  = `codeworld-pages-${CACHE_VERSION}`

self.addEventListener('install', () => {
  // Skip waiting so a new SW takes over on next reload.
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(
      keys
        .filter(k => k !== STATIC_CACHE && k !== PAGES_CACHE)
        .map(k => caches.delete(k))
    )
    await self.clients.claim()
  })())
})

const STATIC_PREFIXES = ['/_next/static/', '/_next/image/']
const STATIC_HOSTS = new Set([
  'fonts.gstatic.com',
])

function isStaticRequest(url) {
  if (url.origin !== self.location.origin) {
    return STATIC_HOSTS.has(url.host)
  }
  if (STATIC_PREFIXES.some(p => url.pathname.startsWith(p))) return true
  return /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|css)$/.test(url.pathname)
}

function isHtmlRequest(req) {
  if (req.method !== 'GET') return false
  const accept = req.headers.get('accept') || ''
  return req.mode === 'navigate' || accept.includes('text/html')
}

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  // Don't intercept Pyodide / jsdelivr / analytics — let them pass straight through.
  if (url.host !== self.location.host && !STATIC_HOSTS.has(url.host)) return

  if (isStaticRequest(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE))
    return
  }

  if (isHtmlRequest(req)) {
    event.respondWith(networkFirst(req, PAGES_CACHE))
    return
  }
})

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
    return res
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
    return res
  } catch (err) {
    const cached = await cache.match(req)
    if (cached) return cached
    // Last resort: serve the cached homepage so the SPA shell at least loads.
    const home = await cache.match('/')
    if (home) return home
    throw err
  }
}
