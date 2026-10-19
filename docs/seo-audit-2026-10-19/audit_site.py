#!/usr/bin/env python3
"""Read-only, bounded audit of public HTML, links and HTTP behavior (stdlib only)."""
import concurrent.futures
import datetime
import hashlib
import json
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = 'https://www.privacyscore.fr'
OUT = Path(__file__).resolve().parent
HOSTS = {'www.privacyscore.fr', 'privacyscore.fr'}

class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta = {}; self.links = []; self.anchors = []; self.images = []
        self.ids = set(); self.headings = []; self.title = ''; self.text = []
        self.scripts = []; self.jsonld = []; self.lang = None; self.capture = None
        self.skip = 0; self.script = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'meta': self.meta[a.get('name', a.get('property', a.get('http-equiv', '')))] = a.get('content', '')
        if tag == 'link': self.links.append(a)
        if tag == 'a' and a.get('href'): self.anchors.append(a)
        if tag == 'img': self.images.append(a)
        if tag == 'title': self.capture = ('title', [])
        if re.fullmatch('h[1-6]', tag): self.capture = (tag, [])
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'script': self.script = {'attrs': a, 'body': ''}

    def handle_data(self, data):
        if self.capture: self.capture[1].append(data)
        if self.script: self.script['body'] += data
        if not self.skip: self.text.append(data)

    def handle_endtag(self, tag):
        if self.capture and self.capture[0] == tag:
            value = ' '.join(''.join(self.capture[1]).split())
            if tag == 'title': self.title = value
            else: self.headings.append({'level': tag, 'text': value})
            self.capture = None
        if tag == 'script' and self.script:
            self.scripts.append(self.script)
            if self.script['attrs'].get('type') == 'application/ld+json':
                try: self.jsonld.append(json.loads(self.script['body']))
                except ValueError: self.jsonld.append({'parse_error': True})
            self.script = None
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)

def fetch(url, ua='Mozilla/5.0 (compatible; PrivacyScoreAudit/1.0)'):
    redirects = []
    class Redirects(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            redirects.append({'status': code, 'from': req.full_url, 'to': newurl})
            return super().redirect_request(req, fp, code, msg, headers, newurl)
    start = time.monotonic()
    try:
        req = urllib.request.Request(url, headers={'User-Agent': ua})
        try: response = urllib.request.build_opener(Redirects()).open(req, timeout=18)
        except urllib.error.HTTPError as error: response = error
        with response:
            body = response.read(2500000)
            headers = {k.lower(): v for k, v in response.headers.items()
                       if k.lower() not in ('report-to', 'nel', 'set-cookie')}
            return {'url': url, 'final_url': response.url, 'status': response.code,
                    'redirects': redirects, 'seconds': round(time.monotonic()-start, 3),
                    'bytes': len(body), 'sha256': hashlib.sha256(body).hexdigest(),
                    'headers': headers, 'body': body.decode('utf-8', errors='replace')}
    except Exception as error:
        return {'url': url, 'error': str(error), 'redirects': redirects}

def parallel(urls):
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        return list(pool.map(fetch, sorted(set(urls))))

def main():
    sitemap = fetch(ROOT+'/sitemap-0.xml')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    xml = ET.fromstring(sitemap['body'])
    urls = [n.text for n in xml.findall('s:url/s:loc', ns)]
    pages = parallel(urls + [ROOT+'/'])
    documents = {}; link_sources = defaultdict(set)
    for page in pages:
        if 'body' not in page: continue
        doc = Document(page['body']); documents[page['url']] = doc
        page.update({'title': doc.title, 'title_length': len(doc.title), 'lang': doc.lang,
                     'meta': doc.meta, 'canonical': [l.get('href') for l in doc.links if l.get('rel') == 'canonical'],
                     'hreflang': [l for l in doc.links if 'hreflang' in l], 'headings': doc.headings,
                     'word_count_including_navigation': len(' '.join(doc.text).split()),
                     'images': doc.images, 'jsonld': doc.jsonld,
                     'script_sources': [s['attrs'].get('src') for s in doc.scripts if s['attrs'].get('src')],
                     'analytics_markers': re.findall(r'googletagmanager|google-analytics|gtag\(|dataLayer|plausible|matomo|cloudflareinsights', page['body'], re.I)})
        for a in doc.anchors:
            target = urllib.parse.urljoin(page['url'], a['href'])
            if urllib.parse.urlsplit(target).scheme in ('http', 'https'): link_sources[target].add(page['url'])
        del page['body']
    internal = {urllib.parse.urldefrag(u)[0] for u in link_sources if urllib.parse.urlsplit(u).hostname in HOSTS}
    extra = parallel(internal - set(documents))
    for page in extra:
        if 'body' in page:
            documents[page['url']] = Document(page.pop('body'))
    external = parallel({urllib.parse.urldefrag(u)[0] for u in link_sources if urllib.parse.urlsplit(u).hostname not in HOSTS})
    for row in external: row.pop('body', None)
    fragments = []
    for url, sources in link_sources.items():
        target, fragment = urllib.parse.urldefrag(url)
        if fragment and urllib.parse.urlsplit(target).hostname in HOSTS:
            doc = documents.get(target)
            if doc and urllib.parse.unquote(fragment) not in doc.ids:
                fragments.append({'url': url, 'sources': sorted(sources)})
    paths = ['/fr/legal-notice/', '/fr/privacy-policy/', '/fr/terms-of-use/', '/fr', '/en',
             '/fr/index.html', '/en/index.html', '/index.html', '/blog/',
             '/audit-nonexistent-20261019/', '/404/', '/404.html', '/.well-known/security.txt']
    probes = parallel([ROOT+p for p in paths] +
                      ['http://privacyscore.fr/fr/', 'http://www.privacyscore.fr/fr/', 'https://privacyscore.fr/fr/'])
    for row in probes:
        body = row.pop('body', '')
        if 'text/html' in row.get('headers',{}).get('content-type',''):
            doc = Document(body); row.update({'title':doc.title,'meta':doc.meta,'canonical':[l.get('href') for l in doc.links if l.get('rel')=='canonical']})
        elif row['url'].endswith('security.txt'): row['text'] = body
    bots=[]
    for ua in ['Googlebot', 'bingbot']:
        row=fetch(ROOT+'/fr/', ua); row.pop('body',None); row['user_agent']=ua; bots.append(row)
    result={'audited_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'scope':'Public GET requests; sitemap URLs and all anchor links; no authenticated origin/server access',
            'sitemap_xml':sitemap['body'], 'sitemap_urls':urls, 'pages':pages, 'internal_extra':extra,
            'external_links':external, 'link_sources':{u:sorted(s) for u,s in sorted(link_sources.items())},
            'broken_internal_fragments':fragments, 'http_probes':probes, 'simulated_user_agents':bots}
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'crawl.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pages':len(pages),'sitemap_urls':len(urls),'extra_internal':len(extra),
                      'external_urls':len(external),'broken_fragments':len(fragments),
                      'external_non_200':[{'url':r['url'],'status':r.get('status'),'error':r.get('error')} for r in external if r.get('status')!=200],
                      'internal_non_200':[{'url':r['url'],'status':r.get('status')} for r in extra if r.get('status')!=200]},ensure_ascii=False,indent=2))

if __name__ == '__main__': main()
