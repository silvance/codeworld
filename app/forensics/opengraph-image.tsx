import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Digital Forensics'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Digital Forensics',
    tagline: 'Windows · Linux · macOS artifacts · memory analysis · triage · key CI artifacts.',
    accent: 'purple',
  })
}
