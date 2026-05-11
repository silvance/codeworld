#!/usr/bin/env python3
"""
hash_tool.py
Codeworld.codes — Hash & encoding tool (offline version)

Usage:
    python3 hash_tool.py <text>
    python3 hash_tool.py --file <path>
    echo -n 'hello' | python3 hash_tool.py
    python3 hash_tool.py --hex 48656c6c6f
    python3 hash_tool.py --b64-decode aGVsbG8=
    python3 hash_tool.py --identify <hex>           # guess hash type by length
    python3 hash_tool.py --base 16 ff0a              # number-base conversion
    python3 hash_tool.py --json <text>               # machine-readable

Hashes, encodings, and number-base conversion — all stdlib, no network.
"""

import sys
import hashlib
import base64
import urllib.parse
import html
import json
import codecs


HASH_LENGTHS = {
    16:  'Half-MD5 / LM segment',
    32:  'MD5 (128-bit)',
    40:  'SHA-1 (160-bit)',
    48:  'Tiger-192',
    56:  'SHA-224',
    64:  'SHA-256 (256-bit)',
    96:  'SHA-384',
    128: 'SHA-512 (512-bit)',
}


def all_hashes(data: bytes) -> dict:
    return {
        'md5':     hashlib.md5(data).hexdigest(),
        'sha1':    hashlib.sha1(data).hexdigest(),
        'sha256':  hashlib.sha256(data).hexdigest(),
        'sha512':  hashlib.sha512(data).hexdigest(),
    }


def all_encodings(text: str) -> dict:
    data = text.encode('utf-8')
    out = {
        'base64':       base64.b64encode(data).decode('ascii'),
        'hex':          data.hex(' '),
        'url_encoded':  urllib.parse.quote(text),
        'html_encoded': html.escape(text, quote=True),
        'rot13':        codecs.encode(text, 'rot_13'),
    }
    return out


def identify_hash(s: str) -> str:
    s = s.strip()
    if not all(c in '0123456789abcdefABCDEF' for c in s):
        return f'Not pure hex ({len(s)} chars).'
    return HASH_LENGTHS.get(len(s), f'Unrecognised length ({len(s)} hex chars). Common: MD5=32, SHA-1=40, SHA-256=64, SHA-512=128.')


def number_base(value: str, base: int) -> dict:
    value = value.replace(' ', '').replace('_', '')
    n = int(value, base)
    return {
        'binary':  '0b' + bin(n)[2:],
        'octal':   '0o' + oct(n)[2:],
        'decimal': str(n),
        'hex':     '0x' + hex(n)[2:].upper(),
    }


def print_report(text: str, data: bytes) -> None:
    print('═' * 78)
    short = text if len(text) <= 60 else text[:57] + '...'
    print(f'Input: {short!r}    ({len(data)} bytes)')
    print('═' * 78)

    print('\n── Hashes ──')
    h = all_hashes(data)
    for name, val in h.items():
        print(f'  {name.upper():<8} {val}')

    print('\n── Encodings ──')
    enc = all_encodings(text)
    for name, val in enc.items():
        short_val = val if len(val) <= 80 else val[:77] + '...'
        print(f'  {name:<14} {short_val}')


def main() -> None:
    args = sys.argv[1:]
    json_out = '--json' in args
    args = [a for a in args if a != '--json']

    if not args:
        text = sys.stdin.read().rstrip('\n')
        if not text:
            print('Error: No input. Pass text as argument, pipe via stdin, or --file <path>.', file=sys.stderr)
            sys.exit(1)
        data = text.encode('utf-8')

    elif args[0] == '--file' and len(args) >= 2:
        with open(args[1], 'rb') as f:
            data = f.read()
        text = data.decode('utf-8', errors='replace')

    elif args[0] == '--hex' and len(args) >= 2:
        hex_str = ''.join(args[1:]).replace(' ', '')
        data = bytes.fromhex(hex_str)
        text = data.decode('utf-8', errors='replace')

    elif args[0] == '--b64-decode' and len(args) >= 2:
        data = base64.b64decode(args[1])
        text = data.decode('utf-8', errors='replace')

    elif args[0] == '--identify' and len(args) >= 2:
        result = identify_hash(args[1])
        if json_out:
            print(json.dumps({'input': args[1], 'identification': result}))
        else:
            print(result)
        return

    elif args[0] == '--base' and len(args) >= 3:
        try:
            result = number_base(args[2], int(args[1]))
        except ValueError as e:
            print(f'Error: {e}', file=sys.stderr)
            sys.exit(1)
        if json_out:
            print(json.dumps(result, indent=2))
        else:
            for k, v in result.items():
                print(f'  {k:<8} {v}')
        return

    else:
        text = ' '.join(args)
        data = text.encode('utf-8')

    if json_out:
        out = {
            'input':     text,
            'byte_length': len(data),
            'hashes':    all_hashes(data),
            'encodings': all_encodings(text),
        }
        print(json.dumps(out, indent=2))
    else:
        print_report(text, data)


if __name__ == '__main__':
    main()
