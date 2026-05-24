import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Network Utilities'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Network Utilities',
    tagline: 'Common ports · Wireshark filters · Nmap reference · protocols · attack signatures.',
    accent: 'teal',
  })
}
