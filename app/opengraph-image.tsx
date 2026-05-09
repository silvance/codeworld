import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — reference for cyber operations, TSCM, and digital forensics'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    tagline:
      'Reference tools and interactive utilities for cyber operations, TSCM, and digital forensics. Built for practitioners, not demos.',
    accent: 'emerald',
  })
}
