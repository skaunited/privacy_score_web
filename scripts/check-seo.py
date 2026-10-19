#!/usr/bin/env python3
"""Validate built static SEO, local links and resources. No third-party dependencies."""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = "import{SITE_ORIGIN,PAGE_PATHS,LEGACY_REDIRECTS}from'./src/i18n/routes.mjs';console.log(JSON.stringify({origin:SITE_ORIGIN,pages:PAGE_PATHS,redirects:LEGACY_REDIRECTS}))"
registry = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', REGISTRY], cwd=ROOT, text=True))
ORIGIN = registry['origin']
HOST = urlsplit(ORIGIN).netloc

class Page(HTMLParser):
    def __init__(self, source: str, route: str):
        super().__init__(convert_charrefs=True)
        self.route = route
        self.ids: set[str] = set()
        self.canonicals: list[str] = []
        self.alternates: dict[str, str] = {}
        self.alternate_count = 0
        self.refs: list[tuple[str, str]] = []
        self.robots: list[str] = []
        self.h1s = 0
        self.json_blocks: list[str] = []
        self.capture_json = False
        self.json_buffer = ''
        self.refresh: str | None = None
        self.source = source
        self.feed(source)
    def handle_starttag(self, tag: str, attrs_list):
        attrs = dict(attrs_list)
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('name'): self.ids.add(attrs['name'])
        if tag == 'h1': self.h1s += 1
        if tag == 'meta':
            if attrs.get('name', '').lower() in ('robots', 'googlebot'):
                self.robots.append(attrs.get('content', '').lower())
            if attrs.get('http-equiv', '').lower() == 'refresh':
                self.refresh = attrs.get('content', '')
        if tag == 'link':
            rel = attrs.get('rel', '').lower().split()
            if 'canonical' in rel: self.canonicals.append(attrs.get('href', ''))
            if 'alternate' in rel and attrs.get('hreflang'):
                self.alternate_count += 1
                self.alternates[attrs['hreflang']] = attrs.get('href', '')
        if tag == 'script' and attrs.get('type', '').lower() == 'application/ld+json':
            self.capture_json = True
            self.json_buffer = ''
        for attribute in ('href', 'src', 'poster'):
            metadata_link = tag == 'link' and bool(set(attrs.get('rel', '').lower().split()) & {'canonical', 'alternate'})
            if attrs.get(attribute) and not metadata_link:
                self.refs.append((f'{tag}[{attribute}]', attrs[attribute]))
        if tag == 'meta' and attrs.get('property', '').lower() in ('og:image', 'og:video') and attrs.get('content'):
            self.refs.append(('meta resource', attrs['content']))
        if attrs.get('srcset') and not attrs['srcset'].startswith('data:'):
            self.refs.extend(('srcset', item.strip().split()[0]) for item in attrs['srcset'].split(',') if item.strip())
    def handle_data(self, data: str):
        if self.capture_json: self.json_buffer += data
    def handle_endtag(self, tag: str):
        if tag == 'script' and self.capture_json:
            self.json_blocks.append(self.json_buffer)
            self.capture_json = False
    @property
    def noindex(self):
        return any('noindex' in re.split(r'[\s,]+', value) for value in self.robots)


def path_for_html(file: Path, dist: Path):
    relative = file.relative_to(dist).as_posix()
    if relative == 'index.html': return '/'
    if relative.endswith('/index.html'): return '/' + relative[:-10]
    return '/' + relative


def frontmatter(path: Path):
    block = path.read_text().split('---', 2)[1]
    return {key: val.strip().strip('\"\'') for key, val in re.findall(r'^(\w+):\s*(.*?)\s*$', block, re.M)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dist', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    dist = args.dist.resolve()
    errors: list[str] = []
    def fail(route: str, message: str): errors.append(f'{route}: {message}')
    if not (dist / 'index.html').is_file():
        parser.error(f'{dist} has no built index.html; run pnpm build first')
    pages = {path_for_html(file, dist): Page(file.read_text(), path_for_html(file, dist)) for file in sorted(dist.rglob('*.html'))}
    sitemap_urls: set[str] = set()
    sitemap_files = sorted(dist.glob('sitemap*.xml'))
    if not sitemap_files: fail('sitemap', 'no sitemap files found')
    for file in sitemap_files:
        try:
            xml = ET.parse(file).getroot()
            if xml.tag.rsplit('}', 1)[-1] == 'urlset':
                for element in xml.findall('{*}url/{*}loc'):
                    value = element.text or ''
                    if value in sitemap_urls: fail(file.name, f'duplicate URL {value}')
                    sitemap_urls.add(value)
            elif xml.tag.rsplit('}', 1)[-1] == 'sitemapindex':
                for element in xml.findall('{*}sitemap/{*}loc'):
                    linked = urlsplit(element.text or '')
                    if linked.netloc != HOST or not (dist / linked.path.lstrip('/')).is_file():
                        fail(file.name, f'missing/local sitemap target {element.text}')
        except ET.ParseError as error: fail(file.name, f'invalid XML: {error}')
    expected_groups = {}
    for pair in registry['pages'].values():
        mapping = {lang: ORIGIN + route for lang, route in pair.items()}
        mapping['x-default'] = mapping['en']
        for route in pair.values(): expected_groups[route] = mapping
    article_routes: dict[str, list[str]] = {'en': [], 'fr': []}
    translations: dict[str, dict[str, str]] = {}
    for language in ('en', 'fr'):
        for file in sorted((ROOT / 'src/content/blog' / language).glob('*.md')):
            meta = frontmatter(file)
            if meta.get('draft') == 'true' or meta.get('status') == 'draft': continue
            published = datetime.fromisoformat(meta['publishedAt'].replace('Z', '+00:00'))
            if published.tzinfo is None: published = published.replace(tzinfo=timezone.utc)
            if published > datetime.now(timezone.utc): continue
            route = ('' if language == 'en' else '/fr') + '/blog/' + meta['slug'] + '/'
            article_routes[language].append(route)
            if meta.get('translationKey'):
                group = translations.setdefault(meta['translationKey'], {})
                if language in group: fail(file.name, 'duplicate locale in translation group')
                group[language] = route
    for language, routes in article_routes.items():
        for route in routes:
            if route not in pages or pages[route].noindex: fail(route, 'published post missing or noindex')
            if ORIGIN + route not in sitemap_urls: fail(route, 'published post absent from sitemap')
    for key, pair in translations.items():
        if set(pair) != {'en', 'fr'}:
            fail(key, 'translation group must have one EN and one FR page')
            continue
        mapping = {lang: ORIGIN + route for lang, route in pair.items()}
        mapping['x-default'] = mapping['en']
        for route in pair.values(): expected_groups[route] = mapping
    for route, page in pages.items():
        if route in registry['redirects']:
            destination = ORIGIN + registry['redirects'][route]
            if not page.noindex or page.canonicals != [destination] or not page.refresh:
                fail(route, 'redirect stub needs noindex, one destination canonical, and refresh fallback')
            if destination in sitemap_urls and destination == ORIGIN + route:
                fail(route, 'redirect loops to itself')
            if ORIGIN + route in sitemap_urls: fail(route, 'redirect stub included in sitemap')
            continue
        if len(page.canonicals) != 1: fail(route, f'expected one canonical, got {len(page.canonicals)}')
        if not page.noindex:
            if page.canonicals != [ORIGIN + route]: fail(route, f'canonical is not self: {page.canonicals}')
            if page.h1s != 1: fail(route, f'expected one h1, got {page.h1s}')
            if ORIGIN + route not in sitemap_urls: fail(route, 'indexable HTML missing from sitemap')
        elif ORIGIN + route in sitemap_urls: fail(route, 'noindex page included in sitemap')
        if any('/en/' in urlsplit(value).path or urlsplit(value).path == '/en' for value in page.canonicals):
            fail(route, 'legacy /en canonical')
        expected = {} if page.noindex else expected_groups.get(route, {})
        if page.alternates != expected or page.alternate_count != len(page.alternates):
            fail(route, f'hreflang must match actual equivalents; got {page.alternates}, expected {expected}')
        for language, target in page.alternates.items():
            if language == 'x-default': continue
            peer = pages.get(urlsplit(target).path)
            if not peer or peer.alternates != page.alternates: fail(route, f'nonreciprocal hreflang {target}')
        for block in page.json_blocks:
            try:
                parsed = json.loads(block)
                if not isinstance(parsed, (dict, list)): fail(route, 'JSON-LD must be an object or array')
                if re.search(r'https?://(?:www\.)?privacyscore\.fr/en(?:/|["?])', block):
                    fail(route, 'legacy /en URL in JSON-LD')
            except json.JSONDecodeError as error: fail(route, f'invalid JSON-LD: {error}')
        for kind, ref in page.refs:
            check_reference(route, kind, ref, dist, pages, fail)
        for ref in re.findall(r'url\(\s*[\"\']?([^\)\"\']+)', page.source):
            check_reference(route, 'CSS url', ref, dist, pages, fail)
    for value in sitemap_urls:
        parsed = urlsplit(value)
        if parsed.scheme != 'https' or parsed.netloc != HOST or parsed.query or parsed.fragment:
            fail('sitemap', f'noncanonical URL {value}')
        page = pages.get(parsed.path)
        if not page or page.noindex: fail('sitemap', f'URL has no indexable HTML {value}')
        if parsed.path.startswith('/en/') or parsed.path == '/en': fail('sitemap', f'legacy URL {value}')
    for file in dist.rglob('*.css'):
        for ref in re.findall(r'url\(\s*[\"\']?([^\)\"\']+)', file.read_text()):
            check_reference('/' + file.relative_to(dist).as_posix(), 'CSS url', ref, dist, pages, fail)
    if errors:
        for error in sorted(set(errors)): print(f'ERROR {error}', file=sys.stderr)
        print(f'SEO validation failed: {len(set(errors))} issue(s).', file=sys.stderr)
        return 1
    print(f'SEO validation passed: {len(pages)} HTML files, {len(sitemap_urls)} indexable URLs, '
          f'{sum(map(len, article_routes.values()))} published posts, {len(translations)} article translation groups; links, fragments, resources and JSON-LD checked.')
    return 0


def check_reference(route, kind, ref, dist, pages, fail):
    if not ref or ref.startswith(('data:', 'mailto:', 'tel:', 'javascript:')): return
    resolved = urlsplit(urljoin(ORIGIN + route, html.unescape(ref)))
    if resolved.netloc != HOST or resolved.scheme not in ('https', 'http'): return
    target = unquote(resolved.path)
    if target.startswith('/en/') or target == '/en': fail(route, f'{kind} links to legacy {ref}')
    if target in registry['redirects']: fail(route, f'{kind} links through redirect {ref}')
    if target in pages:
        if resolved.fragment and unquote(resolved.fragment) not in pages[target].ids:
            fail(route, f'{kind} missing fragment {ref}')
        return
    resource = (dist / target.lstrip('/')).resolve()
    if not resource.is_relative_to(dist):
        fail(route, f'{kind} escapes output directory {ref}')
    elif not resource.is_file():
        fail(route, f'{kind} missing local target {ref}')

if __name__ == '__main__':
    sys.exit(main())
