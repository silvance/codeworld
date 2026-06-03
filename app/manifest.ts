import type { MetadataRoute } from 'next'

// Force static so `output: 'export'` (air-gapped build) can include this.
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'codeworld.codes',
    short_name: 'codeworld',
    description:
      'Reference tools and interactive utilities for cyber operations, TSCM, and digital forensics. Built for practitioners, not demos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    orientation: 'any',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    categories: ['security', 'productivity', 'reference'],
  }
}
