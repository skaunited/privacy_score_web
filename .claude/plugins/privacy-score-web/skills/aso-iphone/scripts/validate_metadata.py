#!/usr/bin/env python3
"""
Validate Apple App Store metadata for Privacy Score iOS app.
Checks Apple's character/byte limits and best practices.

Usage:
  python validate_metadata.py --app-name "..." --subtitle "..." --keywords "..." --description @file.txt --lang fr

Key fact: Apple's keyword field is measured in BYTES, not chars.
Accented chars (é, à) = 2 bytes in UTF-8. CJK = 3 bytes.
"""

import argparse
import sys
from pathlib import Path

# Apple App Store limits (May 2026)
LIMITS = {
    'app_name': 30,           # chars
    'subtitle': 30,           # chars
    'promotional_text': 170,  # chars (updatable without app release)
    'description': 4000,      # chars (NOT indexed by Apple — unlike Google Play)
    'keywords_bytes': 100,    # BYTES (UTF-8) — comma-separated, NO spaces
    'whats_new': 4000,        # chars (release notes)
    'caption': 110,           # chars (screenshot captions, INDEXED since June 2025)
    'url_slug': 30,           # chars
}

ANSI_GREEN = '\033[92m'
ANSI_RED = '\033[91m'
ANSI_YELLOW = '\033[93m'
ANSI_RESET = '\033[0m'
CHECK = f'{ANSI_GREEN}✓{ANSI_RESET}'
CROSS = f'{ANSI_RED}✗{ANSI_RESET}'
WARN = f'{ANSI_YELLOW}⚠{ANSI_RESET}'


def read_arg(value):
    """If value starts with @, read it from a file."""
    if value and value.startswith('@'):
        return Path(value[1:]).read_text(encoding='utf-8').strip()
    return value or ''


def validate_chars(label, value, limit):
    """Validate a field by character count."""
    count = len(value)
    remaining = limit - count
    if count == 0:
        print(f'{WARN} {label}: empty (limit {limit})')
        return None
    if count > limit:
        print(f'{CROSS} {label}: {count}/{limit} chars — TOO LONG by {-remaining}')
        return False
    print(f'{CHECK} {label}: {count}/{limit} chars ({remaining} remaining)')
    return True


def validate_bytes(label, value, limit):
    """Validate a field by UTF-8 byte count."""
    byte_count = len(value.encode('utf-8'))
    remaining = limit - byte_count
    if byte_count == 0:
        print(f'{WARN} {label}: empty (limit {limit} bytes)')
        return None
    if byte_count > limit:
        print(f'{CROSS} {label}: {byte_count}/{limit} bytes — TOO LONG by {-remaining}')
        return False
    print(f'{CHECK} {label}: {byte_count}/{limit} bytes ({remaining} remaining)')
    return True


def check_keyword_format(keywords):
    """Check keyword-specific rules: no spaces after commas, no duplicates."""
    issues = []

    if ', ' in keywords:
        issues.append('Keyword field contains ", " (space after comma) — must be "," only. Removes wasted bytes.')

    parts = [k.strip() for k in keywords.split(',') if k.strip()]
    duplicates = set([k for k in parts if parts.count(k) > 1])
    if duplicates:
        issues.append(f'Duplicate keywords found: {duplicates}')

    # Apple bans these in keyword field
    banned = {'free', 'gratuit', 'best', 'meilleur', 'top', 'new', 'nouveau'}
    found_banned = set(k.lower() for k in parts) & banned
    if found_banned:
        issues.append(f'Apple may reject banned keywords: {found_banned}')

    if issues:
        print(f'{WARN} Keyword format issues:')
        for i in issues:
            print(f'    - {i}')
        return False
    print(f'{CHECK} Keyword format: OK')
    return True


def check_word_overlap(app_name, subtitle, keywords):
    """Flag words present in both name/subtitle and keyword field (wasted indexing)."""
    name_words = set(app_name.lower().replace(':', ' ').split())
    sub_words = set(subtitle.lower().replace(':', ' ').split())
    kw_words = set(k.strip().lower() for k in keywords.split(','))

    overlap = (name_words | sub_words) & kw_words
    # Filter out short words that don't matter
    overlap = {w for w in overlap if len(w) > 2}

    if overlap:
        print(f'{WARN} Words in keyword field already in Name/Subtitle (wasted indexing): {overlap}')
        return False
    print(f'{CHECK} No word overlap between Name/Subtitle and Keywords')
    return True


def main():
    p = argparse.ArgumentParser(description='Validate Apple App Store metadata')
    p.add_argument('--app-name', required=True)
    p.add_argument('--subtitle', default='')
    p.add_argument('--promotional-text', default='')
    p.add_argument('--description', default='', help='Text or @path/to/file.txt')
    p.add_argument('--keywords', default='', help='Comma-separated, no spaces')
    p.add_argument('--whats-new', default='', help='Text or @path/to/file.txt')
    p.add_argument('--captions', default='', help='Pipe-separated captions: "cap1|cap2|cap3"')
    p.add_argument('--lang', default='fr', choices=['fr', 'en', 'other'])
    args = p.parse_args()

    print(f'\n=== App Store Metadata Validation ({args.lang}) ===\n')

    results = []

    results.append(validate_chars('App Name', args.app_name, LIMITS['app_name']))
    results.append(validate_chars('Subtitle', args.subtitle, LIMITS['subtitle']))
    results.append(validate_chars('Promotional Text', read_arg(args.promotional_text), LIMITS['promotional_text']))
    results.append(validate_chars('Description', read_arg(args.description), LIMITS['description']))
    results.append(validate_bytes('Keywords', args.keywords, LIMITS['keywords_bytes']))
    results.append(validate_chars("What's New", read_arg(args.whats_new), LIMITS['whats_new']))

    if args.captions:
        for i, cap in enumerate(args.captions.split('|'), 1):
            results.append(validate_chars(f'Caption #{i}', cap, LIMITS['caption']))

    # Best-practice checks
    if args.keywords:
        results.append(check_keyword_format(args.keywords))
    if args.keywords and args.app_name:
        results.append(check_word_overlap(args.app_name, args.subtitle, args.keywords))

    # Summary
    print()
    failed = sum(1 for r in results if r is False)
    warnings = sum(1 for r in results if r is None)
    if failed > 0:
        print(f'{CROSS} {failed} CHECK(S) FAILED — fix before submitting')
        sys.exit(1)
    elif warnings > 0:
        print(f'{WARN} {warnings} warning(s) — review before submitting')
        sys.exit(0)
    else:
        print(f'{CHECK} All checks passed — ready to submit')
        sys.exit(0)


if __name__ == '__main__':
    main()
