#!/usr/bin/env python3
"""
packet_decoder.py
Codeworld.codes — Hex packet decoder (offline version)

Usage:
    python3 packet_decoder.py "ff ff ff ff ff ff 00 1a 2b 3c 4d 5e 08 06 00 01 ..."
    python3 packet_decoder.py --file packet.hex
    cat packet.hex | python3 packet_decoder.py
    python3 packet_decoder.py --json "<hex>"

Decodes a hex-string packet through Ethernet → IPv4 → TCP/UDP/ICMP/ARP/DNS.
Tolerant of spaces, colons, dashes, 0x prefixes, and Wireshark-style
"hex stream" formatting. Pure stdlib.
"""

import sys
import re
import json
import struct


def parse_hex(s: str) -> bytes:
    cleaned = re.sub(r'(?i)(0x|[^0-9a-f])', '', s)
    if len(cleaned) % 2:
        raise ValueError(f'Odd hex length ({len(cleaned)})')
    return bytes.fromhex(cleaned)


def mac_str(data: bytes, offset: int) -> str:
    return ':'.join(f'{b:02x}' for b in data[offset:offset + 6])


def ip_str(data: bytes, offset: int) -> str:
    return '.'.join(str(b) for b in data[offset:offset + 4])


def u16(data: bytes, offset: int) -> int:
    return struct.unpack_from('>H', data, offset)[0]


def u32(data: bytes, offset: int) -> int:
    return struct.unpack_from('>I', data, offset)[0]


ETHERTYPES = {
    0x0800: 'IPv4',
    0x0806: 'ARP',
    0x86DD: 'IPv6',
    0x8100: '802.1Q VLAN',
}

IP_PROTOS = {1: 'ICMP', 6: 'TCP', 17: 'UDP', 41: 'IPv6-in-IPv4', 47: 'GRE', 50: 'ESP', 51: 'AH'}

TCP_FLAGS = ['FIN', 'SYN', 'RST', 'PSH', 'ACK', 'URG', 'ECE', 'CWR']

ICMP_TYPES = {0: 'Echo Reply', 3: 'Destination Unreachable', 5: 'Redirect',
              8: 'Echo Request', 11: 'Time Exceeded', 12: 'Parameter Problem'}

DNS_RCODES = {0: 'NOERROR', 1: 'FORMERR', 2: 'SERVFAIL', 3: 'NXDOMAIN', 5: 'REFUSED'}


def decode(data: bytes) -> list[dict]:
    layers: list[dict] = []
    offset = 0

    # ── Ethernet ─────────────────────────────────────────────────────────────
    if len(data) >= 14:
        ethertype = u16(data, 12)
        if ethertype in ETHERTYPES:
            layers.append({'layer': 'Ethernet II', 'fields': {
                'dst_mac':   mac_str(data, 0),
                'src_mac':   mac_str(data, 6),
                'ethertype': f'0x{ethertype:04X} ({ETHERTYPES[ethertype]})',
            }})
            offset = 14
            if ethertype == 0x8100 and len(data) > 18:
                offset = 18  # skip VLAN tag

    # ── IPv4 ─────────────────────────────────────────────────────────────────
    if offset + 20 <= len(data) and (data[offset] >> 4) == 4:
        ihl = (data[offset] & 0x0f) * 4
        proto = data[offset + 9]
        ttl = data[offset + 8]
        total_len = u16(data, offset + 2)
        flags_byte = data[offset + 6] >> 5
        frag_off = (u16(data, offset + 6) & 0x1fff) * 8
        flag_strs: list[str] = []
        if flags_byte & 2: flag_strs.append('DF')
        if flags_byte & 1: flag_strs.append('MF')
        if frag_off: flag_strs.append(f'frag@{frag_off}')

        layers.append({'layer': 'IPv4', 'fields': {
            'version':       4,
            'ihl_bytes':     ihl,
            'total_length':  total_len,
            'ttl':           ttl,
            'protocol':      f'{proto} ({IP_PROTOS.get(proto, "unknown")})',
            'flags':         ' '.join(flag_strs) or 'none',
            'src_ip':        ip_str(data, offset + 12),
            'dst_ip':        ip_str(data, offset + 16),
            'checksum':      f'0x{u16(data, offset + 10):04x}',
        }})
        ip_payload = offset + ihl

        # ── TCP ──────────────────────────────────────────────────────────────
        if proto == 6 and ip_payload + 20 <= len(data):
            data_off = (data[ip_payload + 12] >> 4) * 4
            tcp_flags = data[ip_payload + 13]
            flags = ' '.join(f for i, f in enumerate(TCP_FLAGS) if tcp_flags & (1 << i)) or 'none'
            layers.append({'layer': 'TCP', 'fields': {
                'src_port':    u16(data, ip_payload),
                'dst_port':    u16(data, ip_payload + 2),
                'seq':         u32(data, ip_payload + 4),
                'ack':         u32(data, ip_payload + 8),
                'data_offset': f'{data_off} bytes',
                'flags':       flags,
                'window':      u16(data, ip_payload + 14),
                'checksum':    f'0x{u16(data, ip_payload + 16):04x}',
            }})
            payload = data[ip_payload + data_off:]
            if payload and any(32 <= b < 127 for b in payload):
                ascii_preview = ''.join(chr(b) if 32 <= b < 127 else '.' for b in payload[:64])
                layers.append({'layer': 'TCP Payload', 'fields': {
                    'length': f'{len(payload)} bytes',
                    'ascii_preview': ascii_preview,
                }})

        # ── UDP ──────────────────────────────────────────────────────────────
        if proto == 17 and ip_payload + 8 <= len(data):
            src_port = u16(data, ip_payload)
            dst_port = u16(data, ip_payload + 2)
            udp_len = u16(data, ip_payload + 4)
            layers.append({'layer': 'UDP', 'fields': {
                'src_port': src_port,
                'dst_port': dst_port,
                'length':   f'{udp_len} bytes',
                'checksum': f'0x{u16(data, ip_payload + 6):04x}',
            }})
            # DNS over UDP/53
            dns_off = ip_payload + 8
            if (src_port == 53 or dst_port == 53) and dns_off + 12 <= len(data):
                flags = u16(data, dns_off + 2)
                is_response = bool((flags >> 15) & 1)
                opcode = (flags >> 11) & 0xf
                rcode = flags & 0xf
                layers.append({'layer': 'DNS', 'fields': {
                    'transaction_id': f'0x{u16(data, dns_off):04x}',
                    'type':           'Response' if is_response else 'Query',
                    'opcode':         opcode,
                    'rcode':          f'{rcode} ({DNS_RCODES.get(rcode, "unknown")})',
                    'questions':      u16(data, dns_off + 4),
                    'answers':        u16(data, dns_off + 6),
                }})

        # ── ICMP ─────────────────────────────────────────────────────────────
        if proto == 1 and ip_payload + 4 <= len(data):
            icmp_type = data[ip_payload]
            layers.append({'layer': 'ICMP', 'fields': {
                'type':     f'{icmp_type} ({ICMP_TYPES.get(icmp_type, "unknown")})',
                'code':     data[ip_payload + 1],
                'checksum': f'0x{u16(data, ip_payload + 2):04x}',
            }})

    # ── ARP ──────────────────────────────────────────────────────────────────
    if offset + 28 <= len(data) and u16(data, offset) == 1 and u16(data, offset + 2) == 0x0800:
        op = u16(data, offset + 6)
        layers.append({'layer': 'ARP', 'fields': {
            'operation':   '1 (Request)' if op == 1 else '2 (Reply)' if op == 2 else str(op),
            'sender_mac':  mac_str(data, offset + 8),
            'sender_ip':   ip_str(data, offset + 14),
            'target_mac':  mac_str(data, offset + 18),
            'target_ip':   ip_str(data, offset + 24),
        }})

    if not layers:
        ascii_preview = ''.join(chr(b) if 32 <= b < 127 else '.' for b in data[:64])
        layers.append({'layer': 'Raw bytes', 'fields': {
            'length': f'{len(data)} bytes',
            'hex':    data[:32].hex(' ') + (' ...' if len(data) > 32 else ''),
            'ascii':  ascii_preview,
        }})

    return layers


def print_report(layers: list[dict]) -> None:
    for layer in layers:
        print('═' * 78)
        print(f'  {layer["layer"]}')
        print('═' * 78)
        for k, v in layer['fields'].items():
            print(f'  {k:<16} {v}')
        print()


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    if args and args[0] == '--file' and len(args) >= 2:
        with open(args[1], 'r', encoding='utf-8', errors='replace') as f:
            raw = f.read()
    elif args:
        raw = ' '.join(args)
    else:
        raw = sys.stdin.read()

    if not raw.strip():
        print('Error: no hex input.', file=sys.stderr)
        sys.exit(1)

    try:
        data = parse_hex(raw)
    except ValueError as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

    layers = decode(data)

    if json_out:
        print(json.dumps(layers, indent=2))
    else:
        print_report(layers)


if __name__ == '__main__':
    main()
