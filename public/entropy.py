#!/usr/bin/env python3
"""
entropy.py
Codeworld.codes — Shannon entropy calculator (offline version)

Usage:
    python3 entropy.py <text>
    python3 entropy.py --file <path>
    python3 entropy.py --hex 48656c6c6f
    cat file.bin | python3 entropy.py
    python3 entropy.py --json --file packed.exe

Shannon entropy in bits per byte (0.0–8.0). Useful for spotting packed /
encrypted regions in binaries, random tokens, or unusually repetitive data.
"""

import sys
import json
import math
from collections import Counter


def shannon(data: bytes) -> float:
    if not data:
        return 0.0
    counts = Counter(data)
    total = len(data)
    return -sum((c / total) * math.log2(c / total) for c in counts.values())


def classify(h: float) -> str:
    if h < 1.0:
        return 'Very low (constant-ish / mostly one byte)'
    if h < 3.0:
        return 'Low (English text, structured ASCII)'
    if h < 5.0:
        return 'Medium (mixed binary; code + data)'
    if h < 6.5:
        return 'Medium-high (compressed text, executables with strings)'
    if h < 7.5:
        return 'High (compressed / encoded; e.g. zip, base64-of-random)'
    return 'Very high (encrypted, packed, or pure random)'


def histogram(data: bytes, bins: int = 16) -> list[int]:
    if not data:
        return [0] * bins
    counts = Counter(data)
    out = []
    width = 256 // bins
    for b in range(bins):
        out.append(sum(counts[i] for i in range(b * width, (b + 1) * width)))
    return out


def print_report(data: bytes, label: str) -> None:
    h = shannon(data)
    print('═' * 78)
    print(f'  Source: {label}     ({len(data)} bytes)')
    print('═' * 78)
    print(f'  Shannon entropy : {h:.4f} bits/byte')
    print(f'  Classification  : {classify(h)}')
    print(f'  Unique bytes    : {len(set(data))} / 256')
    print()
    print('  Histogram (16 bins, 0x00→0xff):')
    hist = histogram(data, 16)
    peak = max(hist) if hist else 1
    for i, count in enumerate(hist):
        bar = '█' * int(40 * count / peak) if peak else ''
        print(f'    {i * 16:#05x}-{i * 16 + 15:#05x}  {count:>8}  {bar}')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    label = 'stdin'
    if not args:
        data = sys.stdin.buffer.read()
    elif args[0] == '--file' and len(args) >= 2:
        with open(args[1], 'rb') as f:
            data = f.read()
        label = args[1]
    elif args[0] == '--hex' and len(args) >= 2:
        data = bytes.fromhex(''.join(args[1:]).replace(' ', ''))
        label = 'hex'
    else:
        data = ' '.join(args).encode('utf-8')
        label = 'argv'

    if not data:
        print('Error: empty input.', file=sys.stderr)
        sys.exit(1)

    h = shannon(data)
    if json_out:
        out = {
            'source':       label,
            'byte_length':  len(data),
            'entropy':      round(h, 6),
            'classification': classify(h),
            'unique_bytes': len(set(data)),
            'histogram':    histogram(data, 16),
        }
        print(json.dumps(out, indent=2))
    else:
        print_report(data, label)


if __name__ == '__main__':
    main()
