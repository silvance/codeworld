#!/usr/bin/env python3
"""
uuid_decoder.py
Codeworld.codes — UUID / GUID decoder (offline version)

Usage:
    python3 uuid_decoder.py 550e8400-e29b-41d4-a716-446655440000
    python3 uuid_decoder.py --json <uuid>

Decodes any RFC 4122 UUID — version, variant, and (for v1) the embedded
60-bit timestamp + 48-bit node (MAC) address. Pure stdlib.
"""

import sys
import json
import uuid as _uuid
from datetime import datetime, timedelta, timezone


# 60-bit UUIDv1 timestamps count 100-ns intervals since 1582-10-15 UTC.
UUID_V1_EPOCH = datetime(1582, 10, 15, tzinfo=timezone.utc)

VERSION_NAMES = {
    1: 'v1 (time-based + MAC)',
    2: 'v2 (DCE Security; rarely seen)',
    3: 'v3 (MD5 namespace hash)',
    4: 'v4 (random)',
    5: 'v5 (SHA-1 namespace hash)',
    6: 'v6 (re-ordered time; RFC 9562)',
    7: 'v7 (Unix epoch ms + random; RFC 9562)',
    8: 'v8 (custom; RFC 9562)',
}


def decode(s: str) -> dict:
    u = _uuid.UUID(s.strip())

    out: dict = {
        'input':       s,
        'canonical':   str(u),
        'urn':         u.urn,
        'hex':         u.hex,
        'integer':     u.int,
        'version':     u.version,
        'version_name': VERSION_NAMES.get(u.version, 'unknown'),
        'variant':     u.variant,
    }

    if u.version == 1:
        ts_100ns = u.time
        dt = UUID_V1_EPOCH + timedelta(microseconds=ts_100ns / 10)
        out['v1_timestamp']    = dt.isoformat()
        out['v1_clock_seq']    = u.clock_seq
        node_hex = f'{u.node:012x}'
        out['v1_node_raw']     = node_hex
        out['v1_node_mac']     = ':'.join(node_hex[i:i+2] for i in range(0, 12, 2))
        out['v1_node_local']   = bool(int(node_hex[:2], 16) & 0x02)
        out['v1_node_multicast'] = bool(int(node_hex[:2], 16) & 0x01)

    if u.version == 7:
        # First 48 bits are Unix milliseconds.
        ms = u.int >> 80
        dt = datetime.fromtimestamp(ms / 1000.0, timezone.utc)
        out['v7_timestamp'] = dt.isoformat()

    return out


def print_report(d: dict) -> None:
    print('═' * 78)
    print(f'  UUID {d["canonical"]}   ({d["version_name"]})')
    print('═' * 78)
    order = ['canonical', 'urn', 'hex', 'integer', 'version', 'version_name', 'variant',
             'v1_timestamp', 'v1_clock_seq', 'v1_node_raw', 'v1_node_mac',
             'v1_node_local', 'v1_node_multicast', 'v7_timestamp']
    for k in order:
        if k in d:
            print(f'  {k:<20} {d[k]}')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    if not args:
        print('Error: pass a UUID.', file=sys.stderr)
        sys.exit(1)

    try:
        d = decode(args[0])
    except ValueError as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

    if json_out:
        print(json.dumps(d, indent=2, default=str))
    else:
        print_report(d)


if __name__ == '__main__':
    main()
