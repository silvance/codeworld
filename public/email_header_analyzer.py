#!/usr/bin/env python3
"""
email_header_analyzer.py
Codeworld.codes — Email Header Analyzer (offline version)

Usage:
    python3 email_header_analyzer.py headers.txt
    python3 email_header_analyzer.py < headers.txt
    cat email.eml | python3 email_header_analyzer.py

Paste raw email headers into a file or pipe them in.
This script performs NO network requests — all analysis is local.
"""

import sys
import re
import json
from email import message_from_string
from email.utils import parsedate_to_datetime
from datetime import timezone
from typing import Optional

# ── Helpers ──────────────────────────────────────────────────────────────────

def parse_received(header: str) -> dict:
    """Extract from/by/via/with/id/for fields from a Received header."""
    result: dict = {}
    patterns = {
        'from': r'from\s+(\S+(?:\s+\([^)]+\))?)',
        'by':   r'by\s+(\S+)',
        'via':  r'via\s+(\S+)',
        'with': r'with\s+(\S+)',
        'id':   r';\s*(.+)$',
    }
    for key, pat in patterns.items():
        m = re.search(pat, header, re.IGNORECASE)
        if m:
            result[key] = m.group(1).strip()

    # Extract timestamp — appears after semicolon at end
    ts_match = re.search(r';\s*(.+)$', header, re.IGNORECASE)
    if ts_match:
        result['timestamp_raw'] = ts_match.group(1).strip()
        try:
            result['timestamp_parsed'] = parsedate_to_datetime(result['timestamp_raw']).isoformat()
        except Exception:
            pass

    # Extract IPs from the header
    ips = re.findall(r'\[(\d{1,3}(?:\.\d{1,3}){3})\]', header)
    if ips:
        result['ips'] = ips

    return result


def is_private_ip(ip: str) -> bool:
    """Check if an IP is in RFC 1918 / loopback / link-local ranges."""
    parts = [int(x) for x in ip.split('.')]
    a, b = parts[0], parts[1]
    return (
        a == 10 or
        a == 127 or
        (a == 172 and 16 <= b <= 31) or
        (a == 192 and b == 168) or
        (a == 169 and b == 254)
    )


def extract_domain(email_str: str) -> str:
    """Pull domain from an email address string."""
    m = re.search(r'@([\w.-]+)', email_str)
    return m.group(1).lower() if m else ''


def check_spf(auth_results: str) -> str:
    """Parse SPF result from Authentication-Results."""
    m = re.search(r'spf=(\w+)', auth_results, re.IGNORECASE)
    return m.group(1).upper() if m else 'NOT FOUND'


def check_dkim(auth_results: str) -> str:
    """Parse DKIM result from Authentication-Results."""
    m = re.search(r'dkim=(\w+)', auth_results, re.IGNORECASE)
    return m.group(1).upper() if m else 'NOT FOUND'


def check_dmarc(auth_results: str) -> str:
    """Parse DMARC result from Authentication-Results."""
    m = re.search(r'dmarc=(\w+)', auth_results, re.IGNORECASE)
    return m.group(1).upper() if m else 'NOT FOUND'


def check_alignment(from_domain: str, return_path: str, dkim_domain: str) -> list:
    """Check From domain alignment with Return-Path and DKIM d= domain."""
    issues = []
    from_d = from_domain.lower()

    rp_domain = extract_domain(return_path) if return_path else ''
    if rp_domain and not (rp_domain == from_d or from_d.endswith('.' + rp_domain) or rp_domain.endswith('.' + from_d)):
        issues.append(f'SPF misalignment: From domain ({from_d}) ≠ Return-Path domain ({rp_domain})')

    if dkim_domain:
        dk = dkim_domain.lower()
        if not (dk == from_d or from_d.endswith('.' + dk) or dk.endswith('.' + from_d)):
            issues.append(f'DKIM misalignment: From domain ({from_d}) ≠ DKIM d= ({dk})')

    return issues


def check_reply_to(from_addr: str, reply_to: str) -> Optional[str]:
    """Flag if Reply-To domain differs from From domain."""
    if not reply_to:
        return None
    from_d = extract_domain(from_addr)
    rt_d   = extract_domain(reply_to)
    if from_d and rt_d and from_d != rt_d:
        return f'Reply-To domain ({rt_d}) differs from From domain ({from_d}) — possible phishing redirect'
    return None


# ── Main analysis ─────────────────────────────────────────────────────────────

def analyze(raw_headers: str) -> dict:
    # email.message_from_string needs at least a blank line to parse headers
    if '\n\n' not in raw_headers:
        raw_headers += '\n\n'

    msg = message_from_string(raw_headers)

    result: dict = {
        'summary':          {},
        'authentication':   {},
        'routing':          [],
        'timing':           {},
        'security_flags':   [],
        'raw_headers':      {}
    }

    # ── Core headers ─────────────────────────────────────────────────────────
    from_addr    = msg.get('From', '')
    to_addr      = msg.get('To', '')
    subject      = msg.get('Subject', '')
    date         = msg.get('Date', '')
    reply_to     = msg.get('Reply-To', '')
    message_id   = msg.get('Message-ID', '')
    return_path  = msg.get('Return-Path', '')
    x_mailer     = msg.get('X-Mailer', '') or msg.get('User-Agent', '')
    x_originating_ip = msg.get('X-Originating-IP', '') or msg.get('X-Source-IP', '')

    result['summary'] = {
        'from':           from_addr,
        'to':             to_addr,
        'subject':        subject,
        'date':           date,
        'message_id':     message_id,
        'return_path':    return_path,
        'reply_to':       reply_to,
        'x_mailer':       x_mailer,
        'x_originating_ip': x_originating_ip,
    }

    # ── Authentication ────────────────────────────────────────────────────────
    auth_results = msg.get('Authentication-Results', '') or ''

    spf_result  = check_spf(auth_results)
    dkim_result = check_dkim(auth_results)
    dmarc_result= check_dmarc(auth_results)

    # DKIM domain
    dkim_d_match = re.search(r'dkim=\w+[^;]*d=([\w.-]+)', auth_results, re.IGNORECASE)
    dkim_domain  = dkim_d_match.group(1) if dkim_d_match else ''

    from_domain = extract_domain(from_addr)
    alignment_issues = check_alignment(from_domain, return_path, dkim_domain)

    result['authentication'] = {
        'spf':               spf_result,
        'dkim':              dkim_result,
        'dmarc':             dmarc_result,
        'dkim_domain':       dkim_domain,
        'from_domain':       from_domain,
        'auth_results_raw':  auth_results,
        'alignment_issues':  alignment_issues,
    }

    # ── Routing (Received chain) ───────────────────────────────────────────────
    received_headers = msg.get_all('Received') or []
    # Received headers are in reverse chronological order — reverse to get true path
    received_headers = list(reversed(received_headers))

    routing = []
    for i, hdr in enumerate(received_headers):
        parsed = parse_received(hdr)
        parsed['hop'] = i + 1
        parsed['raw'] = hdr
        routing.append(parsed)

    result['routing'] = routing

    # ── Timing ────────────────────────────────────────────────────────────────
    timestamps = []
    for hop in routing:
        if 'timestamp_parsed' in hop:
            try:
                from dateutil import parser as dparser  # type: ignore
                timestamps.append(dparser.parse(hop['timestamp_parsed']))
            except Exception:
                pass

    if timestamps:
        result['timing'] = {
            'hop_count': len(routing),
            'first_hop': timestamps[0].isoformat() if timestamps else '',
            'last_hop':  timestamps[-1].isoformat() if len(timestamps) > 1 else '',
            'total_transit_seconds': int((timestamps[-1] - timestamps[0]).total_seconds()) if len(timestamps) > 1 else 0,
        }
    else:
        result['timing'] = {'hop_count': len(routing)}

    # ── Security flags ────────────────────────────────────────────────────────
    flags = []

    # SPF/DKIM/DMARC failures
    for check, name in [(spf_result, 'SPF'), (dkim_result, 'DKIM'), (dmarc_result, 'DMARC')]:
        if check in ('FAIL', 'SOFTFAIL', 'NONE', 'PERMERROR', 'TEMPERROR'):
            flags.append({'severity': 'HIGH', 'flag': f'{name} {check}', 'detail': f'Authentication failure: {name} check returned {check}'})
        elif check == 'NOT FOUND':
            flags.append({'severity': 'MED', 'flag': f'{name} not present', 'detail': f'No {name} result found in Authentication-Results header'})

    # Alignment issues
    for issue in alignment_issues:
        flags.append({'severity': 'HIGH', 'flag': 'Domain misalignment', 'detail': issue})

    # Reply-To mismatch
    rt_flag = check_reply_to(from_addr, reply_to)
    if rt_flag:
        flags.append({'severity': 'HIGH', 'flag': 'Reply-To mismatch', 'detail': rt_flag})

    # External IPs in routing
    all_ips = []
    for hop in routing:
        for ip in hop.get('ips', []):
            if not is_private_ip(ip):
                all_ips.append(ip)
    if all_ips:
        result['summary']['external_ips'] = list(dict.fromkeys(all_ips))

    # Message-ID domain mismatch
    if message_id and from_domain:
        mid_domain_m = re.search(r'@([\w.-]+)>', message_id)
        if mid_domain_m:
            mid_domain = mid_domain_m.group(1).lower()
            if mid_domain != from_domain and not from_domain.endswith('.' + mid_domain):
                flags.append({'severity': 'MED', 'flag': 'Message-ID domain mismatch',
                               'detail': f'Message-ID domain ({mid_domain}) differs from From domain ({from_domain})'})

    # Suspicious X-Mailer
    suspicious_mailers = ['PHPMailer', 'sendmail', 'Mass Mailer', 'Bulk', 'Smtp2go']
    for sm in suspicious_mailers:
        if sm.lower() in x_mailer.lower():
            flags.append({'severity': 'MED', 'flag': 'Bulk/script mailer',
                          'detail': f'X-Mailer indicates scripted or bulk sending: {x_mailer}'})
            break

    result['security_flags'] = flags

    # ── Raw header dump ───────────────────────────────────────────────────────
    raw = {}
    for key in msg.keys():
        values = msg.get_all(key)
        raw[key] = values if len(values) > 1 else values[0]
    result['raw_headers'] = raw

    return result


def print_report(r: dict):
    SEP = '─' * 60
    print(f'\n{SEP}')
    print('  EMAIL HEADER ANALYSIS')
    print(SEP)

    s = r['summary']
    print(f'\nFrom:         {s["from"]}')
    print(f'To:           {s["to"]}')
    print(f'Subject:      {s["subject"]}')
    print(f'Date:         {s["date"]}')
    print(f'Message-ID:   {s["message_id"]}')
    if s.get('return_path'):
        print(f'Return-Path:  {s["return_path"]}')
    if s.get('reply_to'):
        print(f'Reply-To:     {s["reply_to"]}')
    if s.get('x_mailer'):
        print(f'X-Mailer:     {s["x_mailer"]}')
    if s.get('x_originating_ip'):
        print(f'Orig IP:      {s["x_originating_ip"]}')
    if s.get('external_ips'):
        print(f'External IPs: {", ".join(s["external_ips"])}')

    print(f'\n{SEP}')
    print('  AUTHENTICATION')
    print(SEP)
    a = r['authentication']
    def result_icon(v):
        return '✓' if v == 'PASS' else ('✗' if v in ('FAIL','SOFTFAIL') else '?')
    print(f'SPF:          {result_icon(a["spf"])} {a["spf"]}')
    print(f'DKIM:         {result_icon(a["dkim"])} {a["dkim"]}  (domain: {a["dkim_domain"] or "n/a"})')
    print(f'DMARC:        {result_icon(a["dmarc"])} {a["dmarc"]}')
    if a['alignment_issues']:
        for issue in a['alignment_issues']:
            print(f'  ⚠ {issue}')

    print(f'\n{SEP}')
    print('  ROUTING CHAIN')
    print(SEP)
    for hop in r['routing']:
        print(f'\nHop {hop["hop"]}:')
        if 'from' in hop:   print(f'  From:  {hop["from"]}')
        if 'by' in hop:     print(f'  By:    {hop["by"]}')
        if 'with' in hop:   print(f'  With:  {hop["with"]}')
        if 'ips' in hop:    print(f'  IPs:   {", ".join(hop["ips"])}')
        if 'timestamp_parsed' in hop:
            print(f'  Time:  {hop["timestamp_parsed"]}')

    t = r['timing']
    if t.get('total_transit_seconds') is not None:
        print(f'\nTotal transit: {t.get("total_transit_seconds", "?")}s across {t.get("hop_count","?")} hops')

    flags = r['security_flags']
    if flags:
        print(f'\n{SEP}')
        print('  SECURITY FLAGS')
        print(SEP)
        for f in flags:
            icon = '🔴' if f['severity'] == 'HIGH' else '🟡'
            print(f'\n{icon} [{f["severity"]}] {f["flag"]}')
            print(f'   {f["detail"]}')
    else:
        print('\n✓ No security flags raised.')

    print(f'\n{SEP}\n')


def main():
    if len(sys.argv) > 1 and sys.argv[1] != '-':
        with open(sys.argv[1], 'r', encoding='utf-8', errors='replace') as f:
            raw = f.read()
    else:
        raw = sys.stdin.read()

    if not raw.strip():
        print('Error: No input. Pipe headers or pass a file path.', file=sys.stderr)
        sys.exit(1)

    result = analyze(raw)

    if '--json' in sys.argv:
        print(json.dumps(result, indent=2, default=str))
    else:
        print_report(result)


if __name__ == '__main__':
    main()
