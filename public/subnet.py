#!/usr/bin/env python3
"""
subnet.py
Codeworld.codes — Subnet calculator (offline version)

Usage:
    python3 subnet.py 192.168.1.0/24
    python3 subnet.py 10.0.0.0/8 --json
    python3 subnet.py 2001:db8::/32

Pure stdlib (ipaddress). No network requests.
"""

import sys
import json
import ipaddress


def calc(cidr: str) -> dict:
    net = ipaddress.ip_network(cidr, strict=False)
    out: dict = {
        'network':      str(net.network_address),
        'cidr':         str(net),
        'prefix_len':   net.prefixlen,
        'netmask':      str(net.netmask),
        'hostmask':     str(net.hostmask),
        'version':      net.version,
        'total_addrs':  net.num_addresses,
        'is_private':   net.is_private,
        'is_global':    net.is_global,
        'is_multicast': net.is_multicast,
        'is_loopback':  net.is_loopback,
    }
    if isinstance(net, ipaddress.IPv4Network):
        out['broadcast']     = str(net.broadcast_address)
        out['first_host']    = str(list(net.hosts())[0]) if net.num_addresses > 2 else str(net.network_address)
        out['last_host']     = str(list(net.hosts())[-1]) if net.num_addresses > 2 else str(net.broadcast_address)
        out['usable_hosts']  = max(0, net.num_addresses - 2)
        out['binary_mask']   = '.'.join(f'{int(o):08b}' for o in str(net.netmask).split('.'))
        out['wildcard_mask'] = str(net.hostmask)
    else:
        out['first_address'] = str(net[0])
        out['last_address']  = str(net[-1])
    return out


def print_report(d: dict) -> None:
    print('═' * 78)
    print(f'  {d["cidr"]}    (IPv{d["version"]}, /{d["prefix_len"]})')
    print('═' * 78)
    order = ['network', 'broadcast', 'first_host', 'last_host', 'first_address', 'last_address',
             'netmask', 'wildcard_mask', 'binary_mask',
             'total_addrs', 'usable_hosts',
             'is_private', 'is_global', 'is_multicast', 'is_loopback']
    for k in order:
        if k in d:
            print(f'  {k:<14} {d[k]}')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    if not args:
        print('Error: pass a CIDR like 192.168.1.0/24', file=sys.stderr)
        sys.exit(1)

    try:
        d = calc(args[0])
    except ValueError as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)

    if json_out:
        print(json.dumps(d, indent=2))
    else:
        print_report(d)


if __name__ == '__main__':
    main()
