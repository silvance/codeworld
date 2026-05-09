// ─── Cloud Security & Forensics Reference Data ───────────────────────────────

// ─── AWS Services ─────────────────────────────────────────────────────────────

export interface CloudService {
  name: string
  category: string
  description: string
  notable: string
}

export const awsServices: CloudService[] = [
  { name: 'IAM',         category: 'Identity', description: 'Identity and Access Management — users, roles, policies, federated identity', notable: 'Wildcard policies (*:*) are catastrophic. AssumeRole + sts:AssumeRoleWithWebIdentity = federated trust path.' },
  { name: 'STS',         category: 'Identity', description: 'Security Token Service — temporary credentials via AssumeRole', notable: 'Session tokens are bearer credentials. Look for unusual sts:GetCallerIdentity in CloudTrail.' },
  { name: 'Organizations', category: 'Identity', description: 'Multi-account management, SCPs (Service Control Policies)', notable: 'SCPs apply to root user too. Cross-account trust paths are key for privesc.' },
  { name: 'IAM Identity Center', category: 'Identity', description: 'Formerly AWS SSO — workforce identity federation', notable: 'Permission sets bound to OUs/accounts. Common federation entry from Okta/Entra/Google.' },
  { name: 'EC2',         category: 'Compute',  description: 'Elastic Compute Cloud — virtual machines',                                  notable: 'Instance metadata (IMDSv1/v2) — SSRF can steal role creds. Always require IMDSv2.' },
  { name: 'Lambda',      category: 'Compute',  description: 'Serverless functions',                                                       notable: 'Execution role inherits permissions. Dependency confusion + role escalation = supply chain.' },
  { name: 'ECS / Fargate', category: 'Compute', description: 'Container orchestration (managed and serverless)',                          notable: 'Task role + execution role distinct. Task IMDS available unless explicitly blocked.' },
  { name: 'EKS',         category: 'Compute',  description: 'Managed Kubernetes',                                                         notable: 'IRSA maps K8s service accounts to IAM roles. RBAC misconfig + node IMDS = cluster-wide compromise.' },
  { name: 'S3',          category: 'Storage',  description: 'Simple Storage Service — object storage',                                    notable: 'Block Public Access at account + bucket level. ACLs + bucket policy + IAM = three overlapping control planes.' },
  { name: 'EBS',         category: 'Storage',  description: 'Elastic Block Store — block volumes for EC2',                                notable: 'Snapshots can be made public. CreateSnapshot + ModifySnapshotAttribute is a classic exfil chain.' },
  { name: 'EFS',         category: 'Storage',  description: 'Elastic File System — managed NFS',                                          notable: 'Mount target SGs control access. Often forgotten in network reviews.' },
  { name: 'RDS',         category: 'Database', description: 'Relational Database Service',                                                notable: 'CreateDBSnapshot → ShareDBSnapshot to attacker account = data exfil. Public RDS instances frequent.' },
  { name: 'DynamoDB',    category: 'Database', description: 'Managed NoSQL key-value / document store',                                   notable: 'IAM-based access. Streams + EventBridge = audit but expensive.' },
  { name: 'Secrets Manager', category: 'Secrets', description: 'Encrypted secret storage with rotation',                                 notable: 'GetSecretValue events surface in CloudTrail. Cross-account sharing via resource policy.' },
  { name: 'Parameter Store', category: 'Secrets', description: 'Systems Manager Parameter Store — config + SecureString',                notable: 'Cheaper than Secrets Manager. SecureString uses KMS. GetParameter is logged.' },
  { name: 'KMS',         category: 'Secrets',  description: 'Key Management Service — symmetric/asymmetric keys',                         notable: 'Key policies and grants. CMK with overly broad principal = decrypt-anywhere.' },
  { name: 'CloudTrail',  category: 'Logging',  description: 'API audit log',                                                              notable: 'Management events on by default. Data events (S3 GetObject, Lambda Invoke) opt-in. Multi-region and Org Trail recommended.' },
  { name: 'CloudWatch Logs', category: 'Logging', description: 'Log aggregation and metrics',                                            notable: 'Subscription filters → Lambda/Kinesis. Retention default infinite if not set.' },
  { name: 'GuardDuty',   category: 'Detection', description: 'Threat detection — VPC flow + DNS + CloudTrail anomalies',                 notable: 'Findings into Security Hub. Severity 7+ usually merits page.' },
  { name: 'Config',      category: 'Detection', description: 'Resource compliance and configuration history',                            notable: 'AWS-managed rules + custom Lambda rules. Conformance packs map to CIS/NIST.' },
  { name: 'Inspector',   category: 'Detection', description: 'EC2/ECR/Lambda vulnerability scanning',                                    notable: 'Inspector v2 covers OS + application packages. CVE-based.' },
  { name: 'Detective',   category: 'Detection', description: 'Investigation graph for GuardDuty findings',                               notable: 'Visualizes IAM session activity and inter-resource interactions.' },
  { name: 'VPC',         category: 'Network',  description: 'Virtual Private Cloud — networking primitives',                              notable: 'Flow logs at VPC, subnet, or ENI level. Default VPCs in every account at creation.' },
  { name: 'Route 53',    category: 'Network',  description: 'DNS service',                                                               notable: 'Resolver query logs feed CloudWatch. Subdomain takeover via dangling records is classic.' },
  { name: 'API Gateway', category: 'Network',  description: 'REST/HTTP/WebSocket API frontend',                                          notable: 'Resource policies, IAM auth, Cognito, Lambda authorizers. Often misconfigured to allow * principal.' },
]

export const azureServices: CloudService[] = [
  { name: 'Entra ID',           category: 'Identity', description: 'Identity service — formerly Azure AD',                                     notable: 'Conditional Access bypass via legacy auth (IMAP/POP). Service principals + workload identity.' },
  { name: 'Subscriptions / Management Groups', category: 'Identity', description: 'Hierarchical resource scopes',                              notable: 'Owner role at MG level cascades. Tenant Root Group = god mode.' },
  { name: 'Managed Identities', category: 'Identity', description: 'System-assigned and user-assigned identities for Azure resources',         notable: 'Reachable via IMDS at 169.254.169.254 — same SSRF risk as EC2.' },
  { name: 'Service Principals', category: 'Identity', description: 'Application identities in a tenant',                                       notable: 'Long-lived secrets/certs. Application.ReadWrite.OwnedBy → tenant takeover via consent grant abuse.' },
  { name: 'Virtual Machines',   category: 'Compute',  description: 'IaaS VMs',                                                                  notable: 'VM extension RCE via custom script. Disk encryption and disk attach are key forensics surfaces.' },
  { name: 'Functions',          category: 'Compute',  description: 'Serverless functions',                                                     notable: 'KUDU/SCM site exposes deployment metadata. Master key compromise = arbitrary invoke.' },
  { name: 'Container Apps / AKS', category: 'Compute', description: 'Managed container platforms',                                             notable: 'AKS: kubelet identity has IMDS access. Azure AD pod identity replaced by Workload Identity.' },
  { name: 'Storage Accounts',   category: 'Storage',  description: 'Blobs, files, queues, tables',                                              notable: 'Anonymous container access still possible if not blocked at account. Shared keys = full compromise.' },
  { name: 'Key Vault',          category: 'Secrets',  description: 'Keys, secrets, certificates',                                              notable: 'Two access models: vault access policies (legacy) vs RBAC. Soft delete and purge protection are forensic anchors.' },
  { name: 'SQL Database',       category: 'Database', description: 'Managed SQL Server',                                                       notable: 'Active Directory admin separate from logins. Auditing → Log Analytics or storage.' },
  { name: 'Cosmos DB',          category: 'Database', description: 'Multi-model NoSQL',                                                        notable: 'Account keys = full DB access. RBAC option exists but underused.' },
  { name: 'Activity Log',       category: 'Logging',  description: 'Subscription-level control-plane events',                                   notable: '90 day retention by default. Export to Log Analytics or storage for long-term.' },
  { name: 'Log Analytics',      category: 'Logging',  description: 'KQL-queryable log warehouse',                                              notable: 'Diagnostic settings push from each resource. Cross-workspace queries possible.' },
  { name: 'Microsoft Sentinel', category: 'Detection', description: 'Cloud-native SIEM on Log Analytics',                                      notable: 'KQL detection rules. Solutions cover M365 + Azure + on-prem connectors.' },
  { name: 'Defender for Cloud', category: 'Detection', description: 'CSPM + CWP across Azure / AWS / GCP',                                     notable: 'Secure Score. Defender plans per resource type (Server, Storage, etc.).' },
  { name: 'Network Security Groups', category: 'Network', description: 'Stateful packet filters',                                              notable: 'Apply to subnet or NIC. Logs to NSG flow logs (v2) → traffic analytics.' },
  { name: 'Bastion',            category: 'Network',  description: 'Managed jump-host service',                                                notable: 'No public IP on target VMs needed. Session recording in Premium SKU.' },
  { name: 'Front Door / App Gateway', category: 'Network', description: 'Edge / Layer 7 load balancers with WAF',                              notable: 'WAF rule sets: OWASP CRS or Microsoft managed. Detection mode vs prevention.' },
  { name: 'Logic Apps',         category: 'Compute',  description: 'Workflow automation',                                                      notable: 'Connector OAuth tokens stored encrypted. Workflow run history retains payloads.' },
  { name: 'API Management',     category: 'Network',  description: 'API frontend with policies',                                               notable: 'Subscription keys, OAuth, JWT. Policy XML executes inside the gateway runtime.' },
]

export const gcpServices: CloudService[] = [
  { name: 'IAM',               category: 'Identity', description: 'Identity and Access Management',                                            notable: 'Roles are unions of permissions. Conditional bindings supported. Resource hierarchy: Org → Folder → Project → Resource.' },
  { name: 'Cloud Identity',    category: 'Identity', description: 'User/group identity layer (sister to Workspace)',                           notable: 'Federation with on-prem AD via Cloud Identity Connect.' },
  { name: 'Service Accounts',  category: 'Identity', description: 'Workload identities',                                                       notable: 'Service account impersonation chain: iam.serviceAccounts.getAccessToken → privesc. Default Compute SA is editor on project.' },
  { name: 'Workload Identity Federation', category: 'Identity', description: 'External IdP → GCP via STS without keys',                       notable: 'OIDC/SAML provider mappings. Misconfigured attribute conditions = trust bypass.' },
  { name: 'Compute Engine',    category: 'Compute',  description: 'VMs',                                                                       notable: 'Metadata server at metadata.google.internal — SSRF risk identical to AWS/Azure.' },
  { name: 'Cloud Functions',   category: 'Compute',  description: 'Serverless functions',                                                      notable: 'Default runtime SA = App Engine default SA = editor. Specify least-privilege SA.' },
  { name: 'Cloud Run',         category: 'Compute',  description: 'Serverless containers',                                                     notable: 'Per-revision SA. Public ingress vs internal-only. IAM invoker role.' },
  { name: 'GKE',               category: 'Compute',  description: 'Managed Kubernetes',                                                         notable: 'Workload Identity binds K8s SA → GCP SA. Node SA inherits if WI disabled.' },
  { name: 'Cloud Storage',     category: 'Storage',  description: 'Object storage (GCS)',                                                       notable: 'Uniform vs fine-grained access. allUsers + allAuthenticatedUsers are dangerous principals.' },
  { name: 'Persistent Disks',  category: 'Storage',  description: 'Block storage for VMs',                                                      notable: 'Snapshots project-scoped. CreateSnapshot + image creation = data exfil chain.' },
  { name: 'Cloud SQL',         category: 'Database', description: 'Managed MySQL/Postgres/SQL Server',                                          notable: 'Private IP recommended. Auth proxy for IAM-based auth.' },
  { name: 'BigQuery',          category: 'Database', description: 'Petabyte-scale analytics warehouse',                                         notable: 'Authorized views to share filtered slices. Audit logs include rows-read counts.' },
  { name: 'Secret Manager',    category: 'Secrets',  description: 'Encrypted secret storage',                                                  notable: 'Versioned secrets. AccessSecretVersion events in audit log.' },
  { name: 'Cloud KMS',         category: 'Secrets',  description: 'Key management',                                                              notable: 'Key rings + keys. CMEK on services for tenant-controlled encryption.' },
  { name: 'Cloud Logging',     category: 'Logging',  description: 'Centralized log ingestion',                                                  notable: 'Admin Activity always-on, Data Access opt-in (and expensive at scale). Log sinks → BigQuery / GCS / Pub/Sub.' },
  { name: 'Cloud Audit Logs',  category: 'Logging',  description: 'Admin Activity, Data Access, System Event, Policy Denied',                   notable: 'Admin Activity = control plane. Data Access = read/write. Policy Denied = blocked attempts (gold for detection).' },
  { name: 'SCC',               category: 'Detection', description: 'Security Command Center — findings hub',                                   notable: 'Premium tier adds Event Threat Detection, Container Threat Detection.' },
  { name: 'VPC Service Controls', category: 'Network', description: 'Service perimeters around APIs',                                          notable: 'Prevents data exfiltration to outside-perimeter projects. Egress/ingress rules.' },
]

// ─── CloudTrail / Activity Log / Audit Log key events ────────────────────────

export interface AuditEvent {
  cloud: 'AWS' | 'Azure' | 'GCP'
  event: string
  description: string
  why: string
}

export const auditEvents: AuditEvent[] = [
  // AWS
  { cloud: 'AWS', event: 'ConsoleLogin',                  description: 'IAM user or federated console sign-in', why: 'Failed logins, MFA bypass, root login. Filter by Recipient = Console.' },
  { cloud: 'AWS', event: 'AssumeRole / AssumeRoleWithSAML', description: 'Cross-account or federated role assumption', why: 'Identity boundary crossings. Track sessionContext.sourceIdentity.' },
  { cloud: 'AWS', event: 'GetSecretValue',                description: 'Secrets Manager read', why: 'Bulk reads = staging for exfil. Correlate with caller identity.' },
  { cloud: 'AWS', event: 'CreateAccessKey',               description: 'New long-lived IAM access key', why: 'Persistence on a compromised user. Especially for non-human accounts.' },
  { cloud: 'AWS', event: 'PutBucketPolicy / PutBucketAcl', description: 'S3 access policy change',  why: 'Public-bucket flips. Compare statement principals against {"AWS":"*"}.' },
  { cloud: 'AWS', event: 'CreateLoginProfile / UpdateLoginProfile', description: 'Console password set on IAM user', why: 'Adding console access to a programmatic user = backdoor.' },
  { cloud: 'AWS', event: 'PutUserPolicy / AttachUserPolicy', description: 'Inline / managed policy attached to user', why: 'IAM privesc step. Look for AdministratorAccess.' },
  { cloud: 'AWS', event: 'ModifySnapshotAttribute',       description: 'EBS snapshot sharing modified', why: 'Sharing a snapshot to an unknown account = data exfil.' },
  { cloud: 'AWS', event: 'DeleteTrail / StopLogging',     description: 'CloudTrail tampering', why: 'Defender evasion. Trail is restored often via Org Trail; check who/why.' },
  { cloud: 'AWS', event: 'PutRolePolicy on AWSReservedSSO_*', description: 'Permission set drift in IAM Identity Center', why: 'Direct role tampering bypasses permission set CI/CD.' },
  // Azure
  { cloud: 'Azure', event: 'Add member to role',          description: 'Entra directory role assignment', why: 'Global Admin / Privileged Role Admin assignments are the highest-signal events.' },
  { cloud: 'Azure', event: 'Add app role assignment grant to user', description: 'OAuth consent given (admin or user)', why: 'Illicit consent grant phishing. Filter app names against approved list.' },
  { cloud: 'Azure', event: 'Update application certificates and secrets', description: 'New SP credential', why: 'Persistence on a service principal. Commonly skipped by IR.' },
  { cloud: 'Azure', event: 'Set Conditional Access policy', description: 'CA policy created/updated/disabled', why: 'Disabling CA = MFA bypass setup. Always check who and at what hour.' },
  { cloud: 'Azure', event: 'Microsoft.KeyVault/vaults/secrets/getSecret', description: 'Key Vault secret read', why: 'Bulk reads from non-app identities = exfil.' },
  { cloud: 'Azure', event: 'Microsoft.Resources/deployments/write', description: 'Resource deployment via ARM template', why: 'Bulk resource creation often hides stagers (VMs, runbooks).' },
  { cloud: 'Azure', event: 'Microsoft.Compute/virtualMachines/runCommand/action', description: 'Run-command on VM', why: 'Code execution on VM via management plane — bypasses NSG/SSH controls.' },
  { cloud: 'Azure', event: 'Set-MailboxFolderPermission / New-InboxRule', description: 'Exchange Online mailbox manipulation', why: 'Common BEC and persistence: forwarding rules, hidden inbox rules.' },
  // GCP
  { cloud: 'GCP', event: 'google.iam.admin.v1.SetIAMPolicy', description: 'Project/resource IAM policy change', why: 'Privilege grants. Especially roles/owner, roles/editor, custom admin roles.' },
  { cloud: 'GCP', event: 'google.iam.admin.v1.CreateServiceAccountKey', description: 'New service account key issued', why: 'Long-lived JSON key = persistent credential. Prefer short-lived workload identity.' },
  { cloud: 'GCP', event: 'google.iam.credentials.v1.GenerateAccessToken', description: 'Service account impersonation', why: 'iam.serviceAccounts.getAccessToken privesc path. Track principal vs target SA.' },
  { cloud: 'GCP', event: 'storage.setIamPermissions',     description: 'GCS bucket IAM change', why: 'allUsers / allAuthenticatedUsers added = world-readable bucket.' },
  { cloud: 'GCP', event: 'AccessSecretVersion',           description: 'Secret Manager read', why: 'Same as AWS GetSecretValue — bulk reads matter.' },
  { cloud: 'GCP', event: 'compute.instances.setMetadata', description: 'VM metadata update', why: 'SSH keys can be added at instance metadata level → host login.' },
]

// ─── Common misconfigurations (cross-cloud) ───────────────────────────────────

export interface Misconfig {
  cloud: 'AWS' | 'Azure' | 'GCP' | 'All'
  area: string
  pattern: string
  impact: string
  fix: string
}

export const misconfigs: Misconfig[] = [
  { cloud: 'All',   area: 'Storage',     pattern: 'Public bucket / container',                              impact: 'Anyone on the internet can list and read objects.',                                fix: 'Block Public Access (S3) / disable anon (Storage Account) / remove allUsers binding (GCS).' },
  { cloud: 'All',   area: 'Storage',     pattern: 'Versioning disabled on data buckets',                    impact: 'Ransomware overwrite is unrecoverable.',                                          fix: 'Enable versioning + MFA-delete (S3) / soft delete + immutability (Azure).' },
  { cloud: 'AWS',   area: 'IAM',         pattern: 'iam:PassRole on * with iam:CreateRole',                  impact: 'Create a privileged role then pass it to a Lambda/EC2 — full account takeover.',  fix: 'Constrain Resource on PassRole. Use permission boundaries.' },
  { cloud: 'AWS',   area: 'IAM',         pattern: 'AdministratorAccess attached to roles for CI/CD',        impact: 'Pipeline compromise = production compromise.',                                    fix: 'Scope down by service and resource; use sessionPolicy at AssumeRole.' },
  { cloud: 'AWS',   area: 'Compute',     pattern: 'IMDSv1 still enabled on EC2',                            impact: 'SSRF on app → instance role credentials.',                                        fix: 'Set HttpTokens=required (IMDSv2) at instance and at AMI level.' },
  { cloud: 'AWS',   area: 'Network',     pattern: 'Security group with 0.0.0.0/0 to 22/3389/3306/5432',     impact: 'Internet-facing brute force.',                                                    fix: 'Restrict by source CIDR. Use SSM Session Manager instead of SSH where possible.' },
  { cloud: 'AWS',   area: 'Logging',     pattern: 'No org-wide CloudTrail',                                 impact: 'New accounts ship with no centralized logging.',                                  fix: 'Org Trail at root with multi-region + log file integrity validation.' },
  { cloud: 'Azure', area: 'Identity',    pattern: 'Legacy authentication not blocked',                      impact: 'IMAP/POP/SMTP basic auth = MFA bypass.',                                          fix: 'Conditional Access policy: block legacy auth.' },
  { cloud: 'Azure', area: 'Identity',    pattern: 'Users can register applications',                        impact: 'Any user can create SP → consent grant → tenant footprint.',                      fix: 'Entra → User Settings → Users can register applications: No.' },
  { cloud: 'Azure', area: 'Storage',     pattern: 'Storage account allows shared key access',                impact: 'Account key compromise = full access. Keys rarely rotated.',                      fix: 'Disable shared key access; require Entra ID auth.' },
  { cloud: 'Azure', area: 'Network',     pattern: 'NSG with Any/Any source on management ports',            impact: 'RDP/SSH exposure to internet.',                                                   fix: 'Bastion or Private Link. JIT VM access in Defender for Cloud.' },
  { cloud: 'GCP',   area: 'IAM',         pattern: 'Default Compute Engine SA used for workloads',           impact: 'Editor role on whole project from a VM.',                                          fix: 'Disable default SA and create least-privilege SAs per workload.' },
  { cloud: 'GCP',   area: 'Storage',     pattern: 'Bucket has allUsers or allAuthenticatedUsers binding',   impact: 'World-readable / signed-in-anywhere readable.',                                   fix: 'Remove binding and enforce uniform bucket access.' },
  { cloud: 'GCP',   area: 'Compute',     pattern: 'OS Login disabled — SSH keys in metadata',               impact: 'Project metadata SSH keys cascade to all instances.',                             fix: 'Enable OS Login at project; disable instance-level SSH keys.' },
]

// ─── IAM attack patterns (cross-cloud privesc) ────────────────────────────────

export interface IAMPath {
  cloud: 'AWS' | 'Azure' | 'GCP'
  name: string
  trigger: string
  steps: string[]
  detection: string
}

export const iamPaths: IAMPath[] = [
  {
    cloud: 'AWS',
    name: 'CreateAccessKey on another user',
    trigger: 'iam:CreateAccessKey on someone else',
    steps: [
      'aws iam create-access-key --user-name target-user',
      'Use the new key from your own laptop (no MFA required for CLI by default)',
    ],
    detection: 'CloudTrail CreateAccessKey where userIdentity != requestParameters.userName.',
  },
  {
    cloud: 'AWS',
    name: 'AssumeRole on overly permissive role',
    trigger: 'iam:PassRole or sts:AssumeRole on admin-equivalent role',
    steps: [
      'Enumerate roles: aws iam list-roles | jq \'.Roles[] | select(.AssumeRolePolicyDocument | tostring | contains("YourPrincipal"))\'',
      'aws sts assume-role --role-arn arn:aws:iam::ACCT:role/PowerUser --role-session-name x',
      'Export returned creds and operate as the role.',
    ],
    detection: 'STS AssumeRole where targetRole.policy contains AdministratorAccess and sourceIdentity is unusual.',
  },
  {
    cloud: 'AWS',
    name: 'Lambda + iam:PassRole = takeover',
    trigger: 'lambda:CreateFunction + iam:PassRole on a privileged role',
    steps: [
      'Create function with handler that calls aws sts get-caller-identity and runs commands.',
      'aws lambda create-function --role <admin-role-arn> --function-name backdoor ...',
      'aws lambda invoke --function-name backdoor /dev/stdout',
    ],
    detection: 'CreateFunction events where role has * permissions; combine with subsequent Invoke from same principal.',
  },
  {
    cloud: 'Azure',
    name: 'Application owner adds credential',
    trigger: 'Application.ReadWrite.OwnedBy or app owner on a privileged SP',
    steps: [
      'Add client secret or certificate to the app: az ad app credential reset --id <app-id>',
      'Sign in as the app: az login --service-principal -u <app-id> -p <secret> --tenant <tenant>',
      'Use the SP\'s API permissions (Directory.ReadWrite.All etc.).',
    ],
    detection: 'Azure AD audit log: "Update application — Certificates and secrets management". Track principal vs app owner list.',
  },
  {
    cloud: 'Azure',
    name: 'Owner role on subscription via PIM activation',
    trigger: 'Eligible Owner via Privileged Identity Management',
    steps: [
      'Activate eligible role through PIM (no extra approver step if not configured).',
      'Until expiry: full subscription owner.',
    ],
    detection: 'PIM activation events. Alert on activations outside business hours and on production subscriptions.',
  },
  {
    cloud: 'GCP',
    name: 'Service account impersonation',
    trigger: 'iam.serviceAccounts.getAccessToken on target SA',
    steps: [
      'gcloud auth print-access-token --impersonate-service-account=target@proj.iam.gserviceaccount.com',
      'Use the token via REST or set CLOUDSDK_AUTH_ACCESS_TOKEN.',
    ],
    detection: 'Audit log: GenerateAccessToken where authenticationInfo.principalEmail differs from target. Build chain of impersonations.',
  },
  {
    cloud: 'GCP',
    name: 'CreateServiceAccountKey backdoor',
    trigger: 'iam.serviceAccountKeys.create on a privileged SA',
    steps: [
      'gcloud iam service-accounts keys create key.json --iam-account=admin@proj.iam.gserviceaccount.com',
      'Use the JSON key from anywhere; survives the principal who created it.',
    ],
    detection: 'CreateServiceAccountKey audit events on privileged accounts. Org policy iam.disableServiceAccountKeyCreation removes the path.',
  },
]

// ─── Storage attack patterns ──────────────────────────────────────────────────

export interface StorageAttack {
  cloud: 'AWS' | 'Azure' | 'GCP'
  pattern: string
  description: string
  detect: string
}

export const storageAttacks: StorageAttack[] = [
  { cloud: 'AWS',   pattern: 'Bucket policy with Principal: *',                description: 'Anyone in the world can perform allowed actions.',                                            detect: 'GuardDuty Policy:S3/BucketAnonymousAccessGranted. Macie scans for sensitive data in public buckets.' },
  { cloud: 'AWS',   pattern: 'Pre-signed URL with long expiry on sensitive object', description: 'Bearer URL bypasses bucket policy; can leak via logs.',                                  detect: 'CloudTrail GetObject with x-amz-signature parameters. Limit max-age via bucket policy condition.' },
  { cloud: 'AWS',   pattern: 'Cross-account replication enabled to attacker account', description: 'Continuous data exfiltration via S3 Replication.',                                        detect: 'Replication configuration changes in CloudTrail. Audit destination account ID.' },
  { cloud: 'AWS',   pattern: 'EBS snapshot shared publicly',                  description: 'Public snapshots can be copied by anyone — full disk image leak.',                              detect: 'ModifySnapshotAttribute with createVolumePermission "all". Trusted Advisor flags this.' },
  { cloud: 'Azure', pattern: 'Storage account "Allow Blob anonymous access" enabled', description: 'Containers can be set to anonymous read.',                                              detect: 'Activity Log: Microsoft.Storage/storageAccounts/write where allowBlobPublicAccess flips to true.' },
  { cloud: 'Azure', pattern: 'SAS token with full permissions and long expiry', description: 'Account-level SAS bypasses RBAC and is bearer.',                                              detect: 'No native log of SAS use; log queries on storage diagnostic logs by SAS signature parameters.' },
  { cloud: 'Azure', pattern: 'Storage account firewall = Allow all networks', description: 'No network restriction on top of identity controls.',                                          detect: 'Defender for Storage flags. Activity Log on networkAcls.' },
  { cloud: 'GCP',   pattern: 'Bucket binding with allUsers',                  description: 'World-readable bucket.',                                                                       detect: 'Cloud Audit Log: storage.setIamPermissions with member = allUsers. Forseti / SCC findings.' },
  { cloud: 'GCP',   pattern: 'Signed URL with overlong expiry',               description: 'Bearer URL valid up to 7 days for V4 signing.',                                                detect: 'No native log of signed URL minting. Audit code that produces them.' },
]

// ─── Kubernetes attack chain ──────────────────────────────────────────────────

export interface K8sStep {
  stage: string
  technique: string
  command: string
  detect: string
}

export const k8sChain: K8sStep[] = [
  { stage: 'Discovery',     technique: 'List service accounts and tokens',         command: 'kubectl get sa,secrets -A',                                                       detect: 'Audit log verb=list on serviceaccounts/secrets cluster-wide. Anomalous source IPs.' },
  { stage: 'Discovery',     technique: 'List nodes and pods',                      command: 'kubectl get nodes,pods -A -o wide',                                              detect: 'Verbose enumeration patterns from new identity.' },
  { stage: 'Privilege Esc', technique: 'Use a service account with cluster-admin', command: 'kubectl auth can-i --list --as=system:serviceaccount:default:builder',          detect: 'CanI / SubjectAccessReview audits — track principals checking broad permission sets.' },
  { stage: 'Privilege Esc', technique: 'Pod escape via hostPath / privileged',     command: 'Submit pod with hostPath: { path: / } or securityContext.privileged: true',     detect: 'Admission controller (Gatekeeper / Kyverno) blocks. Falco rules on pod create.' },
  { stage: 'Lateral',       technique: 'Steal node IMDS credentials',              command: 'curl http://169.254.169.254/latest/meta-data/iam/security-credentials/',         detect: 'NetworkPolicy denies pods → metadata. EKS: kube-proxy restriction. Falco metadata rule.' },
  { stage: 'Persistence',   technique: 'Cron job that re-creates a backdoor pod',  command: 'kubectl apply -f cronjob.yaml',                                                   detect: 'Admission controller alerts on workloads in kube-system. SCC custom rule on cronjob create.' },
  { stage: 'Persistence',   technique: 'Mutating webhook to inject sidecar',       command: 'kubectl apply -f mutating-webhook.yaml',                                          detect: 'Audit any MutatingWebhookConfiguration creation. Should be a tiny known set.' },
  { stage: 'Exfil',         technique: 'kubectl cp from sensitive pod',            command: 'kubectl cp ns/pod:/path/to/data ./local',                                         detect: 'exec / cp activity volume. Egress NetworkPolicy + DLP at edge.' },
  { stage: 'Defense Evasion', technique: 'Disable audit log forwarding',          command: 'edit kube-apiserver flags or sink',                                              detect: 'Cluster-level audit + control-plane log shipping outside cluster (impossible to disable from inside).' },
]

// ─── Cloud Forensics IR runbook ───────────────────────────────────────────────

export interface IRStep {
  phase: 'Identification' | 'Containment' | 'Eradication' | 'Recovery' | 'Lessons'
  step: string
  command: string
  notes: string
}

export const irRunbook: IRStep[] = [
  { phase: 'Identification', step: 'Snapshot the timeline',                     command: 'AWS: get-cloudtrail-events --start-time --end-time --output table',           notes: 'Pin a 14-day pre-window and a 24-hour post-window. Save raw JSON.' },
  { phase: 'Identification', step: 'Enumerate the principal\'s active sessions', command: 'AWS: aws sts get-caller-identity, list active access keys, MFA status',     notes: 'For Azure use Get-MgUserSignInActivity; for GCP, gcloud logging read principal=...' },
  { phase: 'Containment',    step: 'Disable / quarantine identity',             command: 'AWS: iam update-access-key --status Inactive; Azure: Disable user; GCP: disable SA', notes: 'Prefer disable over delete for evidence. Document timestamps.' },
  { phase: 'Containment',    step: 'Network isolate compromised compute',       command: 'AWS: replace SG with deny-all; Azure: NSG no-ingress no-egress; GCP: replace tags', notes: 'Do not stop instance — memory + ephemeral evidence. Keep network reachable to forensics tools only.' },
  { phase: 'Containment',    step: 'Snapshot disks and memory',                 command: 'AWS: create-snapshot of EBS; capture memory via SSM Run Command + LiME',     notes: 'Encrypt snapshots with isolated KMS key in IR account. Hash + chain of custody.' },
  { phase: 'Eradication',    step: 'Rotate all secrets touched by principal',   command: 'List Secrets Manager / Key Vault / Secret Manager reads; rotate each',      notes: 'Don\'t forget: API keys, OAuth refresh tokens, service account keys, database passwords.' },
  { phase: 'Eradication',    step: 'Invalidate sessions broadly',               command: 'AWS: aws iam update-account-password-policy + revoke-sessions; Entra: Revoke-MgUserSession', notes: 'Required when an identity provider was compromised.' },
  { phase: 'Eradication',    step: 'Remove persistence',                        command: 'Audit Lambda / Functions / Cloud Functions for unknown deployments; check IAM for new keys/roles', notes: 'Compare against IaC ground truth. Anything not in code → suspect.' },
  { phase: 'Recovery',       step: 'Re-deploy from clean image',                command: 'Replace compromised resources from versioned IaC; do not patch in place',    notes: 'Treat the compromised instance as evidence, not as a thing to repair.' },
  { phase: 'Lessons',        step: 'Update detections',                         command: 'Convert IOCs to GuardDuty / Sentinel / Chronicle rules; widen prevention controls', notes: 'Map each step of the attack to MITRE ATT&CK Cloud Matrix and add a control.' },
]

// ─── Cloud security tools ─────────────────────────────────────────────────────

export interface CloudTool {
  name: string
  url: string
  category: 'CSPM' | 'CIEM' | 'Offensive' | 'Forensics' | 'Detection' | 'IaC'
  description: string
  notes: string
}

export const cloudTools: CloudTool[] = [
  { name: 'Prowler',            url: 'https://github.com/prowler-cloud/prowler',  category: 'CSPM',      description: 'Multi-cloud security assessment (AWS, Azure, GCP, K8s)',  notes: '500+ checks. CIS / NIST / PCI / HIPAA mappings. CLI-first.' },
  { name: 'ScoutSuite',         url: 'https://github.com/nccgroup/ScoutSuite',    category: 'CSPM',      description: 'Multi-cloud security auditing',                            notes: 'Generates HTML report. Good for first-pass posture review.' },
  { name: 'CloudSploit',        url: 'https://github.com/aquasecurity/cloudsploit', category: 'CSPM',    description: 'AWS/Azure/GCP misconfiguration scanner',                   notes: 'Aqua-maintained. Plugin per check.' },
  { name: 'CloudFox',           url: 'https://github.com/BishopFox/cloudfox',     category: 'Offensive', description: 'Situational awareness for offensive cloud ops',           notes: 'Inventories interesting attack-relevant artifacts in one pass.' },
  { name: 'Pacu',               url: 'https://github.com/RhinoSecurityLabs/pacu', category: 'Offensive', description: 'AWS exploitation framework',                              notes: 'Module-based. Privesc, persistence, exfil. Standardizes red-team patterns.' },
  { name: 'PMapper',            url: 'https://github.com/nccgroup/PMapper',       category: 'CIEM',      description: 'AWS IAM relationship grapher',                            notes: 'Builds privilege escalation graph. Good for "who can reach root?" questions.' },
  { name: 'IAM Vulnerable',     url: 'https://github.com/BishopFox/iam-vulnerable', category: 'Offensive', description: 'Lab for AWS IAM privesc paths',                           notes: 'Practice on Terraform-deployed sandbox.' },
  { name: 'Stratus Red Team',   url: 'https://github.com/datadog/stratus-red-team', category: 'Offensive', description: 'Granular cloud attack simulation',                       notes: 'Maps to ATT&CK; safe to run in test accounts.' },
  { name: 'leonidas',           url: 'https://github.com/FSecureLABS/leonidas',   category: 'Offensive', description: 'Detection engineering framework — adversary emulation',  notes: 'YAML-defined attacks with corresponding detections.' },
  { name: 'kube-hunter',        url: 'https://github.com/aquasecurity/kube-hunter', category: 'Offensive', description: 'K8s pen-testing tool',                                    notes: 'Active and passive scans. Good against unmanaged clusters.' },
  { name: 'kube-bench',         url: 'https://github.com/aquasecurity/kube-bench',  category: 'CSPM',    description: 'CIS Kubernetes Benchmark check',                          notes: 'Run on each node. Pairs with admission policy in production.' },
  { name: 'Trivy',              url: 'https://github.com/aquasecurity/trivy',     category: 'CSPM',      description: 'Container, IaC, secret, license scanner',                 notes: 'IaC scanning covers Terraform, CloudFormation, Kubernetes manifests.' },
  { name: 'Checkov',            url: 'https://github.com/bridgecrewio/checkov',   category: 'IaC',       description: 'IaC misconfig scanner',                                   notes: 'Terraform, CFN, K8s, ARM, Bicep. CI integration.' },
  { name: 'tfsec',              url: 'https://github.com/aquasecurity/tfsec',     category: 'IaC',       description: 'Terraform-specific security scanner',                     notes: 'Now bundled into Trivy. Lightweight.' },
  { name: 'AWS Detective',      url: 'https://aws.amazon.com/detective/',         category: 'Forensics', description: 'AWS-native investigation graph',                          notes: 'Visualizes IAM, VPC flow, finding context.' },
  { name: 'Microsoft Sentinel', url: 'https://learn.microsoft.com/azure/sentinel/', category: 'Detection', description: 'KQL-based SIEM',                                          notes: 'Solutions catalog covers M365, Azure, AWS, on-prem. Workbooks for IR.' },
  { name: 'Chronicle / SecOps', url: 'https://chronicle.security/',               category: 'Detection', description: 'Google\'s log warehouse + detection',                     notes: 'Yara-L 2.0 rule language. Long retention by default.' },
  { name: 'Cartography',        url: 'https://github.com/lyft/cartography',       category: 'Detection', description: 'Asset graph in Neo4j across cloud providers',             notes: 'Build queries that span AWS+GCP+GitHub+Okta in one Cypher query.' },
  { name: 'Falco',              url: 'https://falco.org/',                        category: 'Detection', description: 'Runtime security for containers and hosts',               notes: 'Default rules cover most pod escape patterns. Custom rules cheap to write.' },
]

// ─── Search index entries ────────────────────────────────────────────────────

import type { RawSearchEntry } from '@/lib/search/types'

export const cloudSearchEntries: RawSearchEntry[] = [
  ...awsServices.map<RawSearchEntry>(s => ({ title: `AWS ${s.name}`, aka: s.category, subtitle: s.description, section: 'aws' })),
  ...azureServices.map<RawSearchEntry>(s => ({ title: `Azure ${s.name}`, aka: s.category, subtitle: s.description, section: 'azure' })),
  ...gcpServices.map<RawSearchEntry>(s => ({ title: `GCP ${s.name}`, aka: s.category, subtitle: s.description, section: 'gcp' })),
  ...auditEvents.map<RawSearchEntry>(e => ({ title: e.event, aka: `${e.cloud} · audit event`, subtitle: e.description, section: e.cloud === 'AWS' ? 'aws' : e.cloud === 'Azure' ? 'azure' : 'gcp' })),
  ...misconfigs.map<RawSearchEntry>(m => ({ title: m.pattern, aka: `${m.cloud} · ${m.area}`, subtitle: m.impact, section: 'storage' })),
  ...iamPaths.map<RawSearchEntry>(p => ({ title: p.name, aka: `${p.cloud} · IAM privesc`, subtitle: p.trigger, section: 'iam' })),
  ...storageAttacks.map<RawSearchEntry>(a => ({ title: a.pattern, aka: `${a.cloud} · storage`, subtitle: a.description, section: 'storage' })),
  ...k8sChain.map<RawSearchEntry>(s => ({ title: s.technique, aka: `K8s · ${s.stage}`, subtitle: s.command, section: 'k8s' })),
  ...irRunbook.map<RawSearchEntry>(r => ({ title: r.step, aka: `IR · ${r.phase}`, subtitle: r.notes, section: 'forensics' })),
  ...cloudTools.map<RawSearchEntry>(t => ({ title: t.name, aka: t.category, subtitle: t.description, section: 'tools' })),
]
