import { ImageResponse } from 'next/og'

export const alt = 'codeworld — reference for cyber operations, TSCM, and digital forensics'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
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
        {/* Top row: status pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 18,
              fontFamily: 'monospace',
              color: '#34d399',
              padding: '8px 16px',
              border: '1px solid #064e3b',
              borderRadius: 6,
              background: 'rgba(6, 78, 59, 0.4)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34d399' }} />
            All systems operational
          </div>
          <div style={{ fontSize: 16, fontFamily: 'monospace', color: '#52525b' }}>
            codeworld.codes
          </div>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 130 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                fontSize: 156,
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
            <div style={{ fontSize: 156, fontWeight: 700, color: '#34d399', marginLeft: 4, lineHeight: 1 }}>
              _
            </div>
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#a1a1aa',
              marginTop: 32,
              maxWidth: 920,
              lineHeight: 1.4,
            }}
          >
            Reference tools and interactive utilities for cyber operations,
            TSCM, and digital forensics. Built for practitioners, not demos.
          </div>
        </div>

        {/* Footer chips */}
        <div style={{ display: 'flex', gap: 12, marginTop: 'auto', flexWrap: 'wrap' }}>
          {['Tools', 'OSINT', 'Pentest', 'Malware', 'Network', 'Forensics', 'Cloud', 'Mobile', 'RF / TSCM'].map(
            (label, i) => {
              const accents = ['#a1a1aa', '#fb7185', '#fb7185', '#fbbf24', '#5eead4', '#c084fc', '#a78bfa', '#7dd3fc', '#60a5fa']
              return (
                <div
                  key={label}
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
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: accents[i] }} />
                  {label}
                </div>
              )
            }
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
