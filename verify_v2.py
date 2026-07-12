import os, re, sys

print('=== V2 VERIFICATION ===\n')

with open('/Users/pratyashaverma/.gemini/antigravity/scratch/sm-times/index.html') as f:
    html = f.read()

print('--- 1. Annotation crash fix ---')
old_crash = "let annotations = JSON.parse(localStorage.getItem"
crash_fixed = old_crash not in html
trycatch    = 'const raw = localStorage.getItem' in html
array_check = 'Array.isArray(parsed)' in html
save_guard  = 'if (!Array.isArray(annotations))' in html
restore_guard = 'typeof a.id' in html
print('  {} Old bare JSON.parse gone:     {}'.format('OK' if crash_fixed else 'FAIL', crash_fixed))
print('  {} try/catch wrapper present:    {}'.format('OK' if trycatch else 'FAIL', trycatch))
print('  {} Array.isArray guard:          {}'.format('OK' if array_check else 'FAIL', array_check))
print('  {} saveAnnotations() hardened:   {}'.format('OK' if save_guard else 'FAIL', save_guard))
print('  {} restoreHighlights() hardened: {}'.format('OK' if restore_guard else 'FAIL', restore_guard))

print('\n--- 2. Portfolio integration ---')
opt_load    = 'src="portfolio.js" onerror=' in html
badge_html  = 'Portfolio Relevant' in html
undef_check = "typeof PORTFOLIO" in html

badge_idx = html.find('Portfolio Relevant')
badge_context = html[max(0,badge_idx-200):badge_idx+200] if badge_idx > 0 else ''
portfolio_vals = ['HDFC Bank','Infosys','Reliance','Banking','Technology','AI','Payments']
leaks = [v for v in portfolio_vals if v in badge_context]
no_leak = len(leaks) == 0

print('  {} portfolio.js loaded optionally: {}'.format('OK' if opt_load else 'FAIL', opt_load))
print('  {} badge HTML present:             {}'.format('OK' if badge_html else 'FAIL', badge_html))
print('  {} typeof PORTFOLIO guard:         {}'.format('OK' if undef_check else 'FAIL', undef_check))
print('  {} No holdings in badge context:   {} (leaks={})'.format('OK' if no_leak else 'FAIL', no_leak, leaks))

print('\n--- 3. Refresh button V2 ---')
ts_aware      = 'PAGE_LOAD_EDITION_TS' in html
fetch_check   = 'data.js' in html and 'fetch(' in html
reload_prompt = 'new edition is available' in html
fallback      = 'location.reload()' in html
print('  {} Timestamp recorded on load:  {}'.format('OK' if ts_aware else 'FAIL', ts_aware))
print('  {} fetch() data.js:             {}'.format('OK' if fetch_check else 'FAIL', fetch_check))
print('  {} Reload prompt on new edition:{}'.format('OK' if reload_prompt else 'FAIL', reload_prompt))
print('  {} file:// fallback reload:     {}'.format('OK' if fallback else 'FAIL', fallback))

print('\n--- 4. portfolio.js ---')
ppath = '/Users/pratyashaverma/.gemini/antigravity/scratch/sm-times/portfolio.js'
portfolio_exists = os.path.exists(ppath)
if portfolio_exists:
    with open(ppath) as f:
        pjs = f.read()
    has_const    = 'const PORTFOLIO' in pjs
    has_equities = 'equities:' in pjs
    has_sectors  = 'sectors:' in pjs
    has_themes   = 'themes:' in pjs
    print('  OK File exists and has const PORTFOLIO: {}'.format(has_const))
    print('  OK equities: {}, sectors: {}, themes: {}'.format(has_equities, has_sectors, has_themes))

print('\n--- 5. ingest.py structure ---')
ipath = '/Users/pratyashaverma/.gemini/antigravity/scratch/sm-times/ingest.py'
ingest_exists = os.path.exists(ipath)
print('  {} ingest.py exists ({} bytes)'.format('OK' if ingest_exists else 'FAIL', os.path.getsize(ipath) if ingest_exists else 0))
if ingest_exists:
    with open(ipath) as f:
        ingest = f.read()
    checks = [
        ('SOURCES registry', 'SOURCES = ['),
        ('fetch_rss()', 'def fetch_rss('),
        ('editorial filter', 'def passes_editorial_filter('),
        ('Gemini integration', 'def call_gemini('),
        ('rule-based fallback', 'def enrich_rule_based('),
        ('build_story()', 'def build_story('),
        ('write_data_js()', 'def write_data_js('),
        ('Atomic write', '.tmp'),
        ('validate_output()', 'def validate_output('),
        ('CLI main()', 'def main():'),
        ('--dry-run', '--dry-run'),
        ('--no-ai', '--no-ai'),
        ('GLOSSARY static', 'GLOSSARY = ['),
        ('CALCULATIONS static', 'CALCULATIONS = ['),
        ('ECONOMIC_CALENDAR static', 'ECONOMIC_CALENDAR = ['),
    ]
    for label, pat in checks:
        found = pat in ingest
        print('  {} {}'.format('OK' if found else 'FAIL', label))

print('\n--- 6. setup_cron.sh ---')
cpath = '/Users/pratyashaverma/.gemini/antigravity/scratch/sm-times/setup_cron.sh'
cron_exists = os.path.exists(cpath)
print('  {} setup_cron.sh exists ({} bytes)'.format('OK' if cron_exists else 'FAIL', os.path.getsize(cpath) if cron_exists else 0))

print('\n--- 7. ingest.py syntax check ---')
import subprocess
result = subprocess.run(['python3', '-m', 'py_compile', ipath], capture_output=True, text=True)
syntax_ok = result.returncode == 0
print('  {} ingest.py syntax valid: {} {}'.format('OK' if syntax_ok else 'FAIL', syntax_ok, result.stderr.strip()))

print('\n--- 8. File sizes ---')
files = ['index.html', 'data.js', 'portfolio.js', 'ingest.py', 'setup_cron.sh', 'README.md']
base = '/Users/pratyashaverma/.gemini/antigravity/scratch/sm-times/'
for fn in files:
    fp = base + fn
    if os.path.exists(fp):
        sz = os.path.getsize(fp)
        print('  {:20s} {:>8,} bytes'.format(fn, sz))
    else:
        print('  {:20s} MISSING'.format(fn))

print('\n=== ALL DONE ===')
