import type { Metadata } from 'next'
import CloudPage from '@/components/cloud/CloudPage'

export const metadata: Metadata = {
  title: 'Cloud Security & Forensics',
  description:
    'AWS, Azure, and GCP reference: critical services, audit log events, IAM attack paths, container/Kubernetes attack chain, storage misconfigurations, cloud incident-response runbook, and tooling.',
}

export default function CloudRoute() {
  return <CloudPage />
}
