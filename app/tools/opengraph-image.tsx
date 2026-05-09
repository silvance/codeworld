import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Tools'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Tools',
    tagline: 'Hash · subnet · JWT · email headers · regex · cert · cron — every utility runs locally.',
    accent: 'zinc',
  })
}
