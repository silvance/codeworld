#!/usr/bin/env python3
"""
mac_lookup.py
Codeworld.codes — MAC address inspector (offline version)

Usage:
    python3 mac_lookup.py aa:bb:cc:dd:ee:ff
    python3 mac_lookup.py AABBCCDDEEFF
    python3 mac_lookup.py --json aa:bb:cc:dd:ee:ff
    python3 mac_lookup.py --eui64 aa:bb:cc:dd:ee:ff    # show derived IPv6 EUI-64

Parses a MAC address — vendor OUI prefix, UAA/LAA bit, unicast/multicast bit,
EUI-64 derivation. Vendor lookup uses a built-in mini OUI database; for full
IEEE coverage point this script at the official OUI file (see VENDORS below).
"""

import sys
import re
import json


# ── Mini OUI dictionary ──────────────────────────────────────────────────────
# The IEEE publishes a complete OUI list at
# https://standards-oui.ieee.org/oui/oui.txt — drop that file alongside
# this script and uncomment the OUI_FILE block below for a full DB.
VENDORS = {
    '000C29': 'VMware',
    '001A11': 'Google',
    '001B63': 'Apple',
    '001CB3': 'Apple',
    '001E64': 'Apple',
    '003065': 'Apple',
    '003EE1': 'Apple',
    '0050E4': 'Apple',
    '0056CD': 'Apple',
    '00A040': 'Apple',
    '04E536': 'Apple',
    '080027': 'PCS Systemtechnik (VirtualBox)',
    '080037': 'Fuji-Xerox',
    '0CA8A7': 'Apple',
    '14109F': 'Apple',
    '18B43F': 'TP-Link',
    '186590': 'Apple',
    '1CFA68': 'TP-Link',
    '24A2E1': 'Apple',
    '286ABA': 'Apple',
    '34159E': 'Apple',
    '38F9D3': 'Apple',
    '3CA9F4': 'Intel',
    '40A6D9': 'Apple',
    '443839': 'Cumulus Networks',
    '485D60': 'AzureWave (HP / Dell / Lenovo WiFi)',
    '4C72B9': 'Pegatron',
    '52540': 'QEMU (any 52:54:00 prefix)',
    '525400': 'QEMU / KVM virtual',
    '60334B': 'Apple',
    '64BC0C': 'LG Electronics',
    '6C40089': 'Apple',
    '70568B': 'Apple',
    '74E5F9': 'Intel',
    '78D75F': 'Samsung',
    '7C04D0': 'Apple',
    '80E650': 'Apple',
    '88665A': 'Apple',
    '8C8590': 'Apple',
    '98B8E3': 'Apple',
    'A4C361': 'Apple',
    'AC1F6B': 'Super Micro Computer',
    'B827EB': 'Raspberry Pi Foundation',
    'BCD074': 'Apple',
    'C8BCC8': 'Apple',
    'D0E140': 'Apple',
    'D49A20': 'Apple',
    'DCA904': 'Apple',
    'DCA632': 'Raspberry Pi Trading',
    'E45F01': 'Raspberry Pi Trading',
    'F0189800': 'Apple',
    'F0DCE2': 'Apple',
    'F4F15A': 'Apple',
    'F8E61A': 'Apple',
    'FCFC48': 'Apple',
}

# Uncomment to load the official IEEE OUI file if you have one alongside:
# import os
# OUI_FILE = os.path.join(os.path.dirname(__file__), 'oui.txt')
# if os.path.exists(OUI_FILE):
#     with open(OUI_FILE, encoding='utf-8', errors='ignore') as f:
#         for line in f:
#             m = re.match(r'^\s*([0-9A-F]{6})\s*\(base 16\)\s*(.+)$', line)
#             if m:
#                 VENDORS[m.group(1)] = m.group(2).strip()


def parse_mac(s: str) -> tuple[bytes, str]:
    raw = re.sub(r'[\s:.\-]', '', s).upper()
    if len(raw) != 12 or not re.fullmatch(r'[0-9A-F]{12}', raw):
        raise ValueError(f'Not a valid MAC: "{s}" (need 12 hex chars; got {len(raw)})')
    return bytes.fromhex(raw), raw


def to_eui64(mac_raw: bytes) -> str:
    """Build the IPv6 EUI-64 modified identifier from a 48-bit MAC."""
    b = bytearray(mac_raw)
    b[0] ^= 0x02  # flip universal/local bit
    eui64 = b[:3] + b'\xff\xfe' + b[3:]
    return ':'.join(f'{eui64[i] << 8 | eui64[i+1]:04x}' for i in range(0, 8, 2))


def analyze(mac: str) -> dict:
    raw, hex12 = parse_mac(mac)
    first = raw[0]
    is_multicast = bool(first & 0x01)
    is_local     = bool(first & 0x02)

    oui24 = hex12[:6]
    vendor = VENDORS.get(oui24, '(unknown — see ieee.org OUI list)')

    return {
        'input':         mac,
        'canonical':     ':'.join(hex12[i:i+2] for i in range(0, 12, 2)).lower(),
        'cisco':         '.'.join([hex12[0:4], hex12[4:8], hex12[8:12]]).lower(),
        'bare_hex':      hex12.lower(),
        'oui':           oui24,
        'nic_specific':  hex12[6:],
        'vendor':        vendor,
        'is_unicast':    not is_multicast,
        'is_multicast':  is_multicast,
        'is_universal':  not is_local,
        'is_local':      is_local,
        'eui64_id':      to_eui64(raw),
        'eui64_lladdr':  f'fe80::{to_eui64(raw)}',
    }


def print_report(d: dict) -> None:
    print('═' * 78)
    print(f'  MAC: {d["canonical"]}    (vendor: {d["vendor"]})')
    print('═' * 78)
    order = ['canonical', 'cisco', 'bare_hex', 'oui', 'nic_specific', 'vendor',
             'is_unicast', 'is_multicast', 'is_universal', 'is_local',
             'eui64_id', 'eui64_lladdr']
    for k in order:
        print(f'  {k:<15} {d[k]}')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    eui64_only = '--eui64' in args
    args = [a for a in args if a not in ('--json', '--eui64')]

    if not args:
        print('Error: pass a MAC address.', file=sys.stderr)
        sys.exit(1)

    try:
        d = analyze(args[0])
    except ValueError as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

    if eui64_only:
        print(d['eui64_lladdr'])
        return

    if json_out:
        print(json.dumps(d, indent=2))
    else:
        print_report(d)


if __name__ == '__main__':
    main()
