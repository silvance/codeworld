#!/usr/bin/env python3
"""
timestamp.py
Codeworld.codes — Timestamp converter (offline version)

Usage:
    python3 timestamp.py <value>              # auto-detect format
    python3 timestamp.py --format <fmt> <val> # force a format
    python3 timestamp.py --now                # current time in every format
    python3 timestamp.py --json <value>       # machine-readable

Formats: unix, unix_ms, filetime, chrome, mac, hfsplus, iso, dotnet
- unix      Unix epoch seconds  (1970-01-01 UTC)
- unix_ms   Unix epoch milliseconds
- filetime  Windows FILETIME    (100ns intervals since 1601-01-01 UTC)
- chrome    Chrome / WebKit     (microseconds since 1601-01-01 UTC)
- mac       Mac Absolute Time   (seconds since 2001-01-01 UTC)
- hfsplus   HFS+                (seconds since 1904-01-01 UTC)
- dotnet    .NET DateTime ticks (100ns intervals since 0001-01-01 UTC)
"""

import sys
import json
from datetime import datetime, timezone, timedelta


FILETIME_EPOCH = datetime(1601, 1, 1, tzinfo=timezone.utc)
MAC_EPOCH      = datetime(2001, 1, 1, tzinfo=timezone.utc)
HFS_EPOCH      = datetime(1904, 1, 1, tzinfo=timezone.utc)
DOTNET_EPOCH   = datetime(1, 1, 1, tzinfo=timezone.utc)


def from_unix(v: float) -> datetime:
    return datetime.fromtimestamp(v, timezone.utc)


def from_unix_ms(v: float) -> datetime:
    return datetime.fromtimestamp(v / 1000.0, timezone.utc)


def from_filetime(v: int) -> datetime:
    return FILETIME_EPOCH + timedelta(microseconds=v // 10)


def from_chrome(v: int) -> datetime:
    return FILETIME_EPOCH + timedelta(microseconds=v)


def from_mac(v: float) -> datetime:
    return MAC_EPOCH + timedelta(seconds=v)


def from_hfsplus(v: int) -> datetime:
    return HFS_EPOCH + timedelta(seconds=v)


def from_dotnet(v: int) -> datetime:
    return DOTNET_EPOCH + timedelta(microseconds=v // 10)


CONVERTERS = {
    'unix':     from_unix,
    'unix_ms':  from_unix_ms,
    'filetime': from_filetime,
    'chrome':   from_chrome,
    'mac':      from_mac,
    'hfsplus':  from_hfsplus,
    'dotnet':   from_dotnet,
}


def to_all_formats(dt: datetime) -> dict:
    """Render one datetime in every supported format."""
    epoch = dt.timestamp()
    return {
        'iso':       dt.isoformat(),
        'unix':      str(int(epoch)),
        'unix_ms':   str(int(epoch * 1000)),
        'filetime':  str(int((dt - FILETIME_EPOCH).total_seconds() * 10_000_000)),
        'chrome':    str(int((dt - FILETIME_EPOCH).total_seconds() * 1_000_000)),
        'mac':       f'{(dt - MAC_EPOCH).total_seconds():.6f}',
        'hfsplus':   str(int((dt - HFS_EPOCH).total_seconds())),
        'dotnet':    str(int((dt - DOTNET_EPOCH).total_seconds() * 10_000_000)),
    }


def auto_detect(s: str) -> list[tuple[str, datetime]]:
    """Try plausible formats and return only those producing a sane (1900-2100) datetime."""
    out: list[tuple[str, datetime]] = []
    try:
        n = float(s)
    except ValueError:
        try:
            return [('iso', datetime.fromisoformat(s.replace('Z', '+00:00')))]
        except ValueError:
            return []

    candidates = [
        ('unix',     from_unix,     1_000_000_000,    32_500_000_000),
        ('unix_ms',  from_unix_ms,  1_000_000_000_000, 32_500_000_000_000),
        ('mac',      from_mac,      100_000_000,      4_000_000_000),
        ('chrome',   from_chrome,   12_500_000_000_000_000, 14_000_000_000_000_000),
        ('filetime', from_filetime, 125_000_000_000_000_000, 140_000_000_000_000_000),
        ('dotnet',   from_dotnet,   600_000_000_000_000_000, 700_000_000_000_000_000),
        ('hfsplus',  from_hfsplus,  2_000_000_000,   4_000_000_000),
    ]
    for name, fn, lo, hi in candidates:
        if lo <= n <= hi:
            try:
                out.append((name, fn(n)))
            except (OverflowError, ValueError):
                pass
    return out


def print_one(name: str, dt: datetime) -> None:
    print(f'  {name:<10} → {dt.isoformat()}   ({dt.strftime("%Y-%m-%d %H:%M:%S UTC")})')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    if '--now' in args:
        dt = datetime.now(timezone.utc)
        formats = to_all_formats(dt)
        if json_out:
            print(json.dumps({'now': dt.isoformat(), 'formats': formats}, indent=2))
        else:
            print(f'Now (UTC): {dt.isoformat()}\n')
            for k, v in formats.items():
                print(f'  {k:<10} {v}')
        return

    if not args:
        print('Error: No value. Pass a timestamp or --now.', file=sys.stderr)
        sys.exit(1)

    if args[0] == '--format' and len(args) >= 3:
        fmt = args[1]
        if fmt not in CONVERTERS:
            print(f'Unknown format "{fmt}". Choose: {", ".join(CONVERTERS)}', file=sys.stderr)
            sys.exit(1)
        try:
            dt = CONVERTERS[fmt](float(args[2]))
        except (ValueError, OverflowError) as e:
            print(f'Error: {e}', file=sys.stderr)
            sys.exit(1)
        result = [(fmt, dt)]
    else:
        result = auto_detect(args[0])
        if not result:
            print('Could not auto-detect timestamp format. Try --format <fmt> <value>.', file=sys.stderr)
            sys.exit(1)

    if json_out:
        out = [{'format': name, 'datetime': dt.isoformat(),
                'all_formats': to_all_formats(dt)} for name, dt in result]
        print(json.dumps(out, indent=2))
    else:
        print('═' * 78)
        for name, dt in result:
            print_one(name, dt)
            print('  ── as every format ──')
            for k, v in to_all_formats(dt).items():
                print(f'      {k:<10} {v}')
            print()


if __name__ == '__main__':
    main()
