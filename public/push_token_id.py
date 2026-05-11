#!/usr/bin/env python3
"""
push_token_id.py
Codeworld.codes — Push Token Identifier (offline version)

Usage:
    python3 push_token_id.py <token>
    python3 push_token_id.py < tokens.txt          # one token per line
    cat tokens.txt | python3 push_token_id.py
    python3 push_token_id.py --json <token>        # machine-readable

Identifies which push-notification provider a token belongs to:
APNs · FCM · WNS · MPNS · AWS SNS · OneSignal · Expo · Pushover · FBNS / HMS / MiPush.
All detection is local — no network requests.
"""

import sys
import re
import json
from urllib.parse import urlparse


def identify(token: str) -> list[dict]:
    t = token.strip()
    if not t:
        return []

    matches: list[dict] = []
    n = len(t)
    is_hex = bool(re.fullmatch(r'[0-9a-fA-F]+', t))
    is_uuid = bool(re.fullmatch(r'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', t))
    is_url = bool(re.match(r'https?://', t, re.IGNORECASE))
    is_b64_like = bool(re.fullmatch(r'[A-Za-z0-9_\-+/=:]+', t)) and n > 30

    # ── FCM (Firebase Cloud Messaging) ───────────────────────────────────────
    if ':APA91b' in t:
        iid, _, body = t.partition(':APA91b')
        matches.append({
            'provider': 'FCM (Firebase Cloud Messaging)',
            'confidence': 'High',
            'reason': 'Contains the canonical ":APA91b" separator between Instance ID and token body.',
            'details': {
                'total_length': f'{n} chars',
                'instance_id': iid or '(empty)',
                'token_body': f'APA91b{body[:24]}…',
            },
            'notes': 'Android apps and many cross-platform apps via the Firebase SDK. Token rotates on app reinstall, data clear, or token-refresh callback.',
        })

    # ── WNS (Windows Notification Service) ───────────────────────────────────
    if is_url and re.search(r'\.notify\.windows\.com', t, re.IGNORECASE):
        matches.append({
            'provider': 'WNS (Windows Notification Service)',
            'confidence': 'High',
            'reason': 'URL on a *.notify.windows.com host — WNS uses a per-channel HTTPS URI as its push target.',
            'details': {
                'total_length': f'{n} chars',
                'host': urlparse(t).netloc,
            },
            'notes': 'Windows 10/11 UWP apps. The URI itself is the addressable endpoint; rotate when the app re-registers a push channel.',
        })

    # ── MPNS (Microsoft Push Notification Service — legacy) ──────────────────
    if is_url and re.search(r'\.notify\.live\.net', t, re.IGNORECASE):
        matches.append({
            'provider': 'MPNS (Microsoft Push Notification Service)',
            'confidence': 'High',
            'reason': 'URL on a *.notify.live.net host — MPNS is the legacy Windows Phone push service.',
            'details': {
                'total_length': f'{n} chars',
                'host': urlparse(t).netloc,
            },
            'notes': 'Deprecated in 2017. Seeing this token in current data is a strong signal of legacy / archival material from Windows Phone 7/8.x.',
        })

    # ── AWS SNS endpoint ARN ─────────────────────────────────────────────────
    if re.match(r'^arn:aws:sns:[a-z0-9-]+:\d{12}:endpoint/', t):
        parts = t.split(':')
        matches.append({
            'provider': 'AWS SNS Platform Endpoint ARN',
            'confidence': 'High',
            'reason': 'arn:aws:sns:<region>:<acct>:endpoint/... format. Wraps an underlying APNs / FCM / Baidu token.',
            'details': {
                'region': parts[3] if len(parts) > 3 else '',
                'account_id': parts[4] if len(parts) > 4 else '',
                'resource_path': t[t.index('endpoint/'):],
            },
            'notes': 'The ARN is the AWS-side handle; the underlying provider token is in the Endpoint\'s Token attribute. Need AWS access or original CloudTrail logs to recover the underlying token.',
        })

    # ── OneSignal Player ID (UUID) ───────────────────────────────────────────
    if is_uuid:
        matches.append({
            'provider': 'OneSignal Player ID (or generic UUIDv4)',
            'confidence': 'Low',
            'reason': '36-char UUID. OneSignal Player IDs are UUIDs, but most UUIDs are NOT push tokens — confirm by context.',
            'details': {'format': 'UUID 8-4-4-4-12'},
            'notes': 'OneSignal SDKs record this as the per-device player ID. Lookup requires OneSignal app credentials.',
        })

    # ── APNs ─────────────────────────────────────────────────────────────────
    if is_hex and n == 64:
        matches.append({
            'provider': 'APNs device token (modern, 32-byte)',
            'confidence': 'High',
            'reason': 'Exactly 64 hex chars = 32 raw bytes. Canonical modern APNs token length.',
            'details': {'length': '64 hex chars (32 bytes)'},
            'notes': 'Issued by APNs on registerForRemoteNotifications. Often stored in app Preferences plist or keychain item.',
        })
    elif is_hex and 60 <= n <= 200 and n != 64:
        matches.append({
            'provider': 'Possible APNs token (legacy / non-standard length)',
            'confidence': 'Medium',
            'reason': f'Hex string of length {n} — APNs tokens can vary in older logs / intermediary representations.',
            'details': {'length': f'{n} hex chars ({n // 2} bytes)'},
            'notes': 'Non-64-char hex sometimes appears in legacy logs or after wrapping (e.g. with a leading length byte).',
        })

    # ── FBNS / HMS / MiPush (proprietary, heuristic) ─────────────────────────
    if is_b64_like and 100 < n < 300 and ':APA91b' not in t and not is_hex:
        matches.append({
            'provider': 'Possible FBNS / proprietary push token',
            'confidence': 'Low',
            'reason': 'Long base64-shaped string with no other known signature. FBNS (Facebook/Instagram), Huawei HMS, Xiaomi MiPush all produce tokens in this shape.',
            'details': {'length': f'{n} chars', 'charset': 'Base64-like'},
            'notes': 'Format alone is unreliable. Lookup the source app: com.facebook.* / com.instagram.android (Android) or Facebook / Instagram bundle IDs (iOS) suggests FBNS.',
        })

    # ── Pushover device key ──────────────────────────────────────────────────
    if re.fullmatch(r'[a-zA-Z0-9]{30}', t):
        matches.append({
            'provider': 'Pushover device or user key',
            'confidence': 'Medium',
            'reason': '30 alphanumeric chars — matches Pushover\'s key format.',
            'details': {'length': '30 chars'},
            'notes': 'Pushover uses 30-char keys for both user identifiers and device names. Without app context this is a guess.',
        })

    # ── Expo push token ──────────────────────────────────────────────────────
    if re.match(r'^(Exponent|Expo)PushToken\[', t):
        matches.append({
            'provider': 'Expo push token (React Native / Expo SDK)',
            'confidence': 'High',
            'reason': 'Begins with ExponentPushToken[ or ExpoPushToken[ — Expo wraps the underlying APNs / FCM token.',
            'details': {'length': f'{n} chars'},
            'notes': 'Expo proxies push delivery through their server. Recovering the underlying token requires Expo project credentials or legal process.',
        })

    return matches


def print_report(token: str, matches: list[dict]) -> None:
    print('═' * 78)
    short = token if len(token) <= 80 else token[:77] + '...'
    print(f'Token: {short}')
    print('═' * 78)

    if not matches:
        print('No known push-token format matched.')
        print('Check that the token has no surrounding quotes / commas / whitespace.')
        print('Cellebrite / AXIOM occasionally truncate or split tokens across columns —')
        print('compare against the raw plist / shared_prefs / database value.')
        return

    for i, m in enumerate(matches, 1):
        print(f'\n[{i}] {m["provider"]}   [{m["confidence"]} confidence]')
        print(f'    why: {m["reason"]}')
        for k, v in m['details'].items():
            print(f'    {k:<16} {v}')
        print(f'    forensic note: {m["notes"]}')


def main() -> None:
    json_out = '--json' in sys.argv
    args = [a for a in sys.argv[1:] if a != '--json']

    tokens: list[str] = []
    if args:
        tokens = [args[0]]
    else:
        tokens = [line.strip() for line in sys.stdin if line.strip()]

    if not tokens:
        print('Error: No token. Pass as argument or pipe one per line.', file=sys.stderr)
        sys.exit(1)

    if json_out:
        out = [{'token': t, 'matches': identify(t)} for t in tokens]
        print(json.dumps(out, indent=2))
        return

    for t in tokens:
        print_report(t, identify(t))
        print()


if __name__ == '__main__':
    main()
