import { brandImage, OG_SIZE } from '@/lib/og'

export const alt = 'codeworld — Cloud Security'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return brandImage({
    pageTitle: 'Cloud Security',
    tagline: 'AWS · Azure · GCP services and audit events · IAM attacks · K8s · cloud forensics & IR.',
    accent: 'violet',
  })
}
