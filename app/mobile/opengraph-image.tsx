import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Mobile Forensics'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Mobile Forensics',
    tagline: 'Android & iOS artifact paths · acquisition · ADB · SQLite · cloud extraction.',
    accent: 'sky',
  })
}
