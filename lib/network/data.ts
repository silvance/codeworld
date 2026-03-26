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
