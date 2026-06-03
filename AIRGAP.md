# Air-gapped deployment

How to build codeworld for use on an internet-isolated workstation.

The site is fully static (every page is prerendered HTML), so the air-gap path is
**static export → serve with any HTTP server**. Node is only needed at build
time. The air-gapped machine just needs a static file server.

## Build-time flag

The repo ships an `AIRGAP` build mode. Enable it with the `build:airgap` npm
script:

```bash
npm run build:airgap
```

What this changes vs. a normal `npm run build`:

| | Normal build | `build:airgap` |
| :--- | :--- | :--- |
| Output | `.next/` (needs `next start`) | `out/` (flat HTML/JS/CSS, any static server) |
| `/playground` Pyodide source | jsDelivr CDN | local `/pyodide/` (you provide) |
| `/tools` Code Optimizer + Code Explainer | Visible (calls Anthropic API) | Hidden from nav (no outbound network) |
| Vercel Analytics | Loaded | Skipped |
| Security headers (`Content-Security-Policy`, HSTS, etc.) | Set by Next.js at the edge | Static export can't set headers — set them in your reverse proxy (Caddy/nginx/IIS) |

The flag is `NEXT_PUBLIC_AIRGAP=1`, set via the `build:airgap` script using
`cross-env` so it works on Windows / macOS / Linux without shell tricks.

## Windows walkthrough

Tested on Windows 11. PowerShell, no admin required.

### One-time downloads (on an internet-connected machine)

| File | URL | Notes |
| :--- | :--- | :--- |
| Node.js 22.x LTS (.msi) | https://nodejs.org/dist/latest-v22.x/ — `node-vXX.X.X-x64.msi` | Install, accept defaults |
| Git for Windows | https://git-scm.com/download/win | Or download the codeworld repo as ZIP from GitHub |
| 7-Zip | https://7-zip.org | Pyodide ships as `.tar.bz2` — Windows Explorer can't open it |
| Caddy server | https://github.com/caddyserver/caddy/releases — `caddy_X.X.X_windows_amd64.zip` | Single `caddy.exe` for serving the build |
| Pyodide v0.26.2 | https://github.com/pyodide/pyodide/releases/tag/0.26.2 — `pyodide-0.26.2.tar.bz2` | ~50 MB |

### Build

```powershell
git clone https://github.com/silvance/codeworld
cd codeworld
npm ci                                # ~700 MB node_modules, takes a few minutes

# Drop Pyodide into public\pyodide\
#   Right-click pyodide-0.26.2.tar.bz2 → 7-Zip → Extract here
#   Extract the resulting .tar the same way
#   Inside is a `pyodide\` folder. Move it to:
#     codeworld\public\pyodide\
#   The file codeworld\public\pyodide\pyodide.js should exist.

npm run build:airgap                  # produces .\out\ — ~5 MB without Pyodide,
                                      # ~80 MB with Pyodide files included
```

### Run on the air-gapped machine

Copy `.\out\` and `caddy.exe` to e.g. `C:\codeworld\`. In PowerShell:

```powershell
cd C:\codeworld
.\caddy.exe file-server --root .\out --listen :8080
```

Open a browser to **http://localhost:8080**.

### Make it survive reboots

Either register Caddy as a Windows service via [NSSM](https://nssm.cc/) or
create a Scheduled Task that runs the command above at user logon.

## Practical notes

- **Don't try `file:///` opening `index.html` directly.** Client-side routing,
  the service worker, and module loading require an HTTP origin. You need an
  actual server (Caddy, nginx, or `python -m http.server`).

- **Two tools are gone from the air-gapped nav by design**: Code Optimizer and
  Code Explainer call `api.anthropic.com` and have no offline substitute.

- **Security headers** that Next.js sets when running in normal mode (CSP, HSTS,
  X-Frame-Options, etc.) don't apply to static exports — they have to be set by
  the HTTP server. For Caddy:

  ```caddy
  :8080
  root * out
  file_server
  header {
    Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    X-Frame-Options DENY
    X-Content-Type-Options nosniff
    Referrer-Policy strict-origin-when-cross-origin
  }
  ```

- **USB drive build**: `npm ci` writes ~250k small files into `node_modules\`.
  This runs on FAT32/exFAT/NTFS USB drives but is slow. If you see long-path
  errors on FAT32, reformat to exFAT or NTFS. After `npm run build:airgap`,
  only the `out\` folder and `caddy.exe` need to travel to the air-gapped box —
  not `node_modules`.

- **Updating**: same flow. Pull the latest repo, re-run `npm ci` and `npm run
  build:airgap`, copy the new `out\` over.
