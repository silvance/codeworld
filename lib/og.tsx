import { ImageResponse } from 'next/og'

// Resolved hex per accent name — kept in sync with the homepage colorMap.
const ACCENT_HEX: Record<string, string> = {
  zinc:    '#a1a1aa',
  emerald: '#34d399',
  blue:    '#60a5fa',
  purple:  '#c084fc',
  amber:   '#fbbf24',
  teal:    '#5eead4',
  rose:    '#fb7185',
  coral:   '#fb7185',
  violet:  '#a78bfa',
  sky:     '#7dd3fc',
}

export const OG_SIZE = { width: 1200, height: 630 }

export interface BrandCardProps {
  /** The page name shown as the lower title (e.g. "Cloud Security"). Falls back to wordmark only. */
  pageTitle?: string
  /** Tagline shown under the title. */
  tagline: string
  /** Accent color name for the underline glow + footer chips. */
  accent?: string
}

const FOOTER_CHIPS: { label: string; accent: string }[] = [
  { label: 'Tools',     accent: 'zinc'    },
  { label: 'OSINT',     accent: 'coral'   },
  { label: 'Pentest',   accent: 'rose'    },
  { label: 'Malware',   accent: 'amber'   },
  { label: 'Network',   accent: 'teal'    },
  { label: 'Forensics', accent: 'purple'  },
  { label: 'Cloud',     accent: 'violet'  },
  { label: 'Mobile',    accent: 'sky'     },
  { label: 'RF / TSCM', accent: 'blue'    },
]

export function brandImage({ pageTitle, tagline, accent = 'emerald' }: BrandCardProps) {
  const accentHex = ACCENT_HEX[accent] ?? ACCENT_HEX.emerald

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px',
          background:
            'radial-gradient(ellipse 60% 50% at 15% 20%, rgba(16,185,129,0.18), transparent 60%),' +
            'radial-gradient(ellipse 50% 40% at 85% 80%, rgba(99,102,241,0.16), transparent 60%),' +
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(244,63,94,0.08), transparent 70%),' +
            '#09090b',
          color: '#ededed',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: domain wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#52525b' }}>
            codeworld.codes
          </div>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: pageTitle ? 90 : 130 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                fontSize: pageTitle ? 120 : 156,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #fafafa 0%, #d4d4d8 60%, #71717a 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              codeworld
            </div>
            <div
              style={{
                fontSize: pageTitle ? 120 : 156,
                fontWeight: 700,
                color: accentHex,
                marginLeft: 4,
                lineHeight: 1,
              }}
            >
              _
            </div>
          </div>
          {pageTitle && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 18,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 4, background: accentHex }} />
              <div style={{ fontSize: 44, color: '#e4e4e7', fontWeight: 600, letterSpacing: -1 }}>
                {pageTitle}
              </div>
            </div>
          )}
          <div
            style={{
              fontSize: 28,
              color: '#a1a1aa',
              marginTop: 28,
              maxWidth: 920,
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Footer chips */}
        <div style={{ display: 'flex', gap: 12, marginTop: 'auto', flexWrap: 'wrap' }}>
          {FOOTER_CHIPS.map(c => (
            <div
              key={c.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 18,
                fontFamily: 'monospace',
                color: '#a1a1aa',
                padding: '8px 14px',
                border: '1px solid #27272a',
                borderRadius: 6,
                background: 'rgba(24, 24, 27, 0.6)',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 3, background: ACCENT_HEX[c.accent] }} />
              {c.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}
