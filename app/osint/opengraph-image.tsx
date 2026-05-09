import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — OSINT Reference'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'OSINT Reference',
    tagline: 'Search operators · sock puppets · username enum · infrastructure · dark web.',
    accent: 'coral',
  })
}
