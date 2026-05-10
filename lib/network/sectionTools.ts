import type { SectionId } from './nav'
import type { SectionTool } from '@/lib/sectionTools'

export const sectionTools: Partial<Record<SectionId, SectionTool[]>> = {
  wireshark: [
    {
      name: 'Wireshark',
      description: 'The industry-standard packet analyzer — graphical capture and decode for hundreds of protocols. Use it for protocol-aware traffic inspection, post-incident pcap review, and learning how a protocol actually works on the wire.',
      url: 'https://www.wireshark.org',
      notes: 'Display filters (what this section covers) differ from capture filters (BPF) — display filters happen post-capture and have richer syntax.',
    },
    {
      name: 'tshark',
      description: 'Wireshark\'s CLI sibling — same dissectors, scriptable. Use for headless capture, automated extraction (-Y filter -T fields), and processing pcaps at the command line.',
      url: 'https://www.wireshark.org/docs/man-pages/tshark.html',
      notes: 'tshark -r capture.pcap -Y "filter" -T fields -e ip.src -e tcp.dstport for CSV-ish extraction.',
    },
  ],
  nmap: [
    {
      name: 'Nmap',
      description: 'The industry-standard port scanner and service-version detector. Also runs scripted checks (NSE) for many common vulnerabilities and misconfigurations.',
      url: 'https://nmap.org',
      notes: 'nmap -sCV is the default scan worth running first. NSE scripts live in /usr/share/nmap/scripts. Pair with nmap-vulners for CVE enrichment.',
    },
    {
      name: 'Zenmap',
      description: 'Official GUI front-end for Nmap with scan profiles, topology visualization, and diff comparison. Useful when juggling many scans across multiple targets.',
      url: 'https://nmap.org/zenmap/',
      notes: 'CLI Nmap is faster for scripting; Zenmap shines for ad-hoc exploration and showing results to non-technical stakeholders.',
    },
  ],
  attacks: [
    {
      name: 'Suricata',
      description: 'High-performance open-source IDS / IPS / NSM. Same rule format as Snort (mostly), but multi-threaded, JSON-native output (EVE), and tightly integrated with TLS / HTTP / DNS protocol parsers.',
      url: 'https://suricata.io',
      notes: 'Emerging Threats Open ruleset is free; ET Pro requires a license. Run alongside Zeek for richer protocol context.',
    },
    {
      name: 'Zeek (formerly Bro)',
      description: 'Network analysis framework that turns traffic into structured event logs (conn.log, dns.log, ssl.log, etc.). Less about "alert on signature" and more about "give me a queryable history of what happened".',
      url: 'https://zeek.org',
      notes: 'Pairs naturally with Suricata: Suricata for signature alerts, Zeek for retrospective hunting on the same traffic.',
    },
    {
      name: 'Snort 3',
      description: 'The original signature-based IDS. Still widely deployed; Snort 3 finally has multi-threading. Strong commercial rule ecosystem via Talos.',
      url: 'https://www.snort.org',
      notes: 'Three rule tiers: Community (free), Registered (free with signup), Subscriber (paid, latest).',
    },
  ],
  tcpdump: [
    {
      name: 'tcpdump',
      description: 'The reference packet-capture CLI on Unix. Use anywhere libpcap is available — over SSH, on appliances, inside containers — when Wireshark isn\'t practical.',
      url: 'https://www.tcpdump.org',
      notes: 'BPF capture filters limit what hits disk. Save with -w pcapfile then analyze in Wireshark for a richer view.',
    },
    {
      name: 'tshark / dumpcap',
      description: 'Wireshark\'s capture tools — tshark adds protocol dissection, dumpcap is the raw capture engine. Use when you want Wireshark dissectors but no GUI.',
      url: 'https://www.wireshark.org/docs/man-pages/dumpcap.html',
      notes: 'dumpcap is faster than tshark/tcpdump for high-throughput capture because it does no dissection.',
    },
  ],
  netcat: [
    {
      name: 'netcat (nc / nc.openbsd / nc.traditional)',
      description: 'The universal TCP/UDP swiss-army knife. Multiple incompatible implementations (BSD, traditional, GNU) — features like -e (gaping security hole) differ. Use for listeners, banner grabbing, and ad-hoc transfers.',
      url: 'https://nc110.sourceforge.io',
      notes: 'Check `nc -h` first to learn which variant you have. -e is removed from most modern distros; use socat or ncat for shell binding.',
    },
    {
      name: 'Ncat',
      description: 'Nmap project\'s modernized Netcat — adds TLS, SOCKS, chained connections, and access controls. Preferred over classic nc when available.',
      url: 'https://nmap.org/ncat/',
      notes: 'Ships with Nmap. ncat --ssl, --proxy, --allow are the bonus features over nc.',
    },
    {
      name: 'socat',
      description: 'Bidirectional data relay between two sockets / endpoints of almost any type — TCP, UDP, Unix sockets, files, PTYs, OpenSSL. The "more powerful Netcat" for any transport.',
      url: 'http://www.dest-unreach.org/socat/',
      notes: 'Steeper learning curve but does things nc can\'t. Standard tool for upgrading reverse shells to TTY via socat exec:bash + readline.',
    },
  ],
  firewall: [
    {
      name: 'iptables',
      description: 'Legacy Linux netfilter front-end — still ubiquitous on older systems and in containers. Mature, well-documented; mostly being supplanted by nftables.',
      url: 'https://www.netfilter.org/projects/iptables/',
      notes: 'iptables-save / iptables-restore for persistence. Per-table (filter / nat / mangle) ordering matters.',
    },
    {
      name: 'nftables',
      description: 'Modern replacement for iptables / ip6tables / arptables / ebtables — unified syntax, atomic rule updates, better performance. Default firewall on RHEL 8+, Debian 11+.',
      url: 'https://www.nftables.org',
      notes: 'nft list ruleset shows everything. iptables-translate converts old rules to new syntax.',
    },
    {
      name: 'ufw',
      description: 'Ubuntu\'s "uncomplicated firewall" — a friendly wrapper over iptables/nftables. Use when you just want "allow 80, allow 443, deny everything else" without writing rules by hand.',
      url: 'https://help.ubuntu.com/community/UFW',
      notes: 'Default on Ubuntu, available on Debian. Not designed for complex policies — drop to nftables/iptables for those.',
    },
  ],
  dns: [
    {
      name: 'dig',
      description: 'The standard CLI DNS lookup tool. More expressive than nslookup — supports any record type, custom resolvers, DNSSEC validation, and zone transfers.',
      url: 'https://bind9.readthedocs.io/en/v9_18_19/manpages.html#dig',
      notes: 'dig @resolver name type — explicit recursive resolver makes results reproducible. dig +trace walks the delegation chain.',
    },
    {
      name: 'doggo / dog',
      description: 'Modern Rust/Go alternatives to dig with colored output, multiple resolvers in one query, and DoH/DoT support out of the box.',
      url: 'https://github.com/mr-karan/doggo',
      notes: 'Nicer UX than dig for one-off lookups. Same flags concept (-t for type, @resolver).',
    },
    {
      name: 'dnsx',
      description: 'High-speed DNS toolkit by ProjectDiscovery — bulk resolution, wildcard detection, brute-force, takeover checks. Pipe-friendly for recon pipelines.',
      url: 'https://github.com/projectdiscovery/dnsx',
      notes: 'cat domains.txt | dnsx -resp-only. Pairs with subfinder for full subdomain enumeration.',
    },
  ],
  tls: [
    {
      name: 'openssl s_client',
      description: 'The reference tool for inspecting a TLS handshake — connect, see the cert chain, negotiated cipher, ALPN, server name, OCSP, and renegotiation. Lowest-common-denominator: openssl is everywhere.',
      url: 'https://www.openssl.org/docs/man3.0/man1/openssl-s_client.html',
      notes: 'openssl s_client -connect host:443 -servername host -showcerts. Always pass -servername or you may get the wrong vhost cert.',
    },
    {
      name: 'testssl.sh',
      description: 'Comprehensive TLS configuration auditor — protocol versions, cipher strength, vulnerable extensions (Heartbleed, ROBOT, BEAST, etc.), HSTS, OCSP stapling. One script, one report.',
      url: 'https://testssl.sh',
      notes: 'Runs against arbitrary hosts and arbitrary ports. --severity for filtering, --jsonfile-pretty for machine-readable output.',
    },
    {
      name: 'sslscan / sslyze',
      description: 'Lighter-weight cipher and protocol enumeration. sslscan is C, sslyze is Python — both faster than testssl.sh for the "just list ciphers" case.',
      url: 'https://github.com/rbsec/sslscan',
      notes: 'sslyze (github.com/nabla-c0d3/sslyze) is the more actively-maintained Python alternative with rich JSON output.',
    },
  ],
  pivot: [
    {
      name: 'OpenSSH (port forwarding)',
      description: 'SSH\'s built-in tunneling features — local forward (-L), remote forward (-R), dynamic SOCKS proxy (-D). Available everywhere; use first when SSH is allowed.',
      url: 'https://www.openssh.com',
      notes: 'ssh -D 1080 host opens a SOCKS5 proxy. Combine with proxychains for tools that don\'t natively support SOCKS.',
    },
    {
      name: 'chisel',
      description: 'TCP/UDP tunnel over HTTP/WebSocket. Single Go binary; client/server model. Use when SSH is blocked but HTTPS isn\'t — chisel speaks WebSocket so it tunnels through most web proxies.',
      url: 'https://github.com/jpillora/chisel',
      notes: 'chisel server --reverse on attacker, chisel client server:port R:1080:socks on target. Reverse tunnel pivots through outbound HTTPS.',
    },
    {
      name: 'ligolo-ng',
      description: 'Layer-3 tunneling via TUN interface — full subnets routed through a compromised host, no per-port forwards needed. Currently the cleanest option for AD pivoting.',
      url: 'https://github.com/nicocha30/ligolo-ng',
      notes: 'No SOCKS / proxychains required — operates at the IP layer. Requires admin / sudo on the attacker side to create the tun interface.',
    },
    {
      name: 'proxychains-ng',
      description: 'Force any TCP-bound tool through a SOCKS proxy by hooking connect(). Pairs with SSH -D, chisel SOCKS, or any other SOCKS5 source.',
      url: 'https://github.com/rofl0r/proxychains-ng',
      notes: 'proxychains nmap ... is the classic pattern. Doesn\'t handle ICMP or UDP — use ligolo for those.',
    },
  ],
  wireless: [
    {
      name: 'aircrack-ng suite',
      description: 'The classic 802.11 toolkit — airodump-ng (capture), aireplay-ng (deauth/injection), aircrack-ng (offline crack of WPA handshakes / WEP). Still the reference suite for WiFi work.',
      url: 'https://www.aircrack-ng.org',
      notes: 'Requires a card that supports monitor mode + packet injection. Atheros AR9271 (e.g. Alfa AWUS036NHA) is the safe bet.',
    },
    {
      name: 'hcxtools / hcxdumptool',
      description: 'Modern WPA capture stack focused on PMKID and EAPOL hashes for hashcat / John. Faster than airodump-ng for the specific "grab hashes for offline crack" use case.',
      url: 'https://github.com/ZerBea/hcxdumptool',
      notes: 'hcxpcapngtool converts captures into hashcat\'s 22000 format (replaces the older 16800 PMKID format).',
    },
    {
      name: 'Kismet',
      description: 'Wireless detection, sniffing, and intrusion detection — passive monitoring across 802.11, BT, Zigbee, and SDR-fed protocols. The "what is in the air?" tool, not a cracker.',
      url: 'https://www.kismetwireless.net',
      notes: 'Headless capture server + web UI. Logs to SQLite for later analysis; pairs with Wireshark for deep packet inspection.',
    },
  ],
  scapy: [
    {
      name: 'Scapy',
      description: 'Python library and CLI for building, sending, sniffing, and dissecting packets layer by layer. Use when you need protocol-precise crafting that ready-made tools can\'t produce.',
      url: 'https://scapy.net',
      notes: 'pip install scapy. Interactive shell (scapy CLI) or import into scripts. Sniffing requires root / cap_net_raw.',
    },
    {
      name: 'pwntools (network helpers)',
      description: 'CTF-oriented Python lib with simple TCP / UDP / SSL client wrappers (remote(), listen()), useful as a quicker alternative to Scapy when you don\'t need raw layer-2 control.',
      url: 'https://github.com/Gallopsled/pwntools',
      notes: 'remote("host", 1337) gives you a socket-like object with sendline / recvuntil. Best for exploit dev rather than network analysis.',
    },
  ],
}
