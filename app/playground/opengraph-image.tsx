import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Code Playground'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Code Playground',
    tagline: 'Live Python, JavaScript, Go, Ruby, and Bash execution in the browser.',
    accent: 'emerald',
  })
}
