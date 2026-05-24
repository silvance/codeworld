export type SectionId =
  | 'aws' | 'azure' | 'gcp'
  | 'iam' | 'k8s' | 'storage'
  | 'forensics' | 'tools'

export interface NavItem { id: SectionId; label: string; sub: string; icon: string; group: string }

export const NAV: NavItem[] = [
  { id: 'aws',       label: 'AWS reference',        sub: 'Services · CloudTrail · IAM gotchas',     icon: '🟧', group: 'Provider Reference' },
  { id: 'azure',     label: 'Azure reference',      sub: 'Services · Activity Log · Entra ID',      icon: '🟦', group: 'Provider Reference' },
  { id: 'gcp',       label: 'GCP reference',        sub: 'Services · Audit Logs · IAM',             icon: '🟪', group: 'Provider Reference' },
  { id: 'iam',       label: 'IAM attacks',          sub: 'Privesc paths across all three clouds',   icon: '🔑', group: 'Attack Surface' },
  { id: 'k8s',       label: 'Containers & K8s',     sub: 'RBAC · pod escape · runtime',             icon: '🐳', group: 'Attack Surface' },
  { id: 'storage',   label: 'Storage attacks',      sub: 'S3 · Blob · GCS misconfigs + audit',      icon: '🪣', group: 'Attack Surface' },
  { id: 'forensics', label: 'Cloud forensics & IR', sub: 'Runbook · evidence · containment',        icon: '🚑', group: 'Investigation' },
  { id: 'tools',     label: 'Cloud security tools', sub: 'Prowler · CloudFox · Pacu · kube-bench',  icon: '🛠', group: 'Investigation' },
]

export const GROUPS = ['Provider Reference', 'Attack Surface', 'Investigation']
