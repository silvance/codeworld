import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — RF / TSCM'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'RF / TSCM',
    tagline: 'Frequency reference · path loss · sweep methodology · bug frequencies · SDR · TEMPEST.',
    accent: 'blue',
  })
}
