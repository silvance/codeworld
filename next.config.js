/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [

          // ── Content Security Policy ────────────────────────────────────────
          // 'unsafe-inline' is required for Next.js App Router (inline styles
          // and hydration scripts). 'unsafe-eval' is NOT included — avoids the
          // most dangerous vector while keeping the app functional.
          // Tailwind and shadcn/ui both require inline styles.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net", // Next.js hydration + Pyodide CDN
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Tailwind + Google Fonts CSS
              "img-src 'self' data: blob:",                // data: for base64 images, blob: for canvas
              "font-src 'self' https://fonts.gstatic.com", // Google Fonts (JetBrains Mono)
              "connect-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com", // Pyodide packages + fonts
              "worker-src 'self' blob: https://cdn.jsdelivr.net", // Pyodide web workers
              "frame-ancestors 'none'",                    // Prevent embedding in iframes (clickjacking)
              "object-src 'none'",                         // Block Flash/ActiveX
              "base-uri 'self'",                           // Prevent base tag injection
              "form-action 'self'",                        // Forms submit to same origin only
              "upgrade-insecure-requests",                 // Force HTTPS for subresources
            ].join('; '),
          },

          // ── Strict Transport Security ──────────────────────────────────────
          // Tells browsers to only use HTTPS for this domain for 1 year.
          // includeSubDomains covers *.codeworld.codes.
          // preload allows submission to browser HSTS preload lists.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },

          // ── X-Frame-Options ────────────────────────────────────────────────
          // Prevents site from being embedded in iframes — clickjacking protection.
          // Redundant with CSP frame-ancestors but kept for older browser compat.
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // ── X-Content-Type-Options ─────────────────────────────────────────
          // Prevents browsers from MIME-sniffing — forces declared Content-Type.
          // Stops browsers from treating a text file as executable script.
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // ── Referrer-Policy ────────────────────────────────────────────────
          // Controls what referrer info is sent when navigating away from site.
          // strict-origin-when-cross-origin: sends full URL within same origin,
          // only the origin (no path) on cross-origin HTTPS, nothing on downgrade.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ── Permissions-Policy ─────────────────────────────────────────────
          // Explicitly disables browser features the site doesn't need.
          // Reduces attack surface and satisfies hardened browser policies.
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',           // No camera access
              'microphone=()',       // No microphone access
              'geolocation=()',      // No location access
              'payment=()',          // No payment APIs
              'usb=()',              // No USB device access
              'magnetometer=()',     // No magnetometer
              'gyroscope=()',        // No gyroscope
              'accelerometer=()',    // No accelerometer
              'interest-cohort=()',  // Opt out of FLoC/Topics API
            ].join(', '),
          },

          // ── X-DNS-Prefetch-Control ─────────────────────────────────────────
          // Controls DNS prefetching. 'off' prevents the browser from resolving
          // domains from external links before the user clicks them.
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },

          // ── X-XSS-Protection ──────────────────────────────────────────────
          // Legacy header for older IE/Chrome XSS filter. Still included for
          // compatibility with older proxies and security scanners.
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // ── Cross-Origin headers ───────────────────────────────────────────
          // COEP + COOP enable cross-origin isolation (required for SharedArrayBuffer
          // and high-precision timers). Also hardens against Spectre-class attacks.
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',   // 'require-corp' would be stricter but breaks Google Fonts
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },

        ],
      },
    ]
  },

  // ── Other Next.js config ───────────────────────────────────────────────────

  // Disable powered-by header — minor but removes fingerprinting vector
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Strict mode for React — catches potential issues in development
  reactStrictMode: true,
}

module.exports = nextConfig
