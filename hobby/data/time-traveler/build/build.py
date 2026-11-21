"""Build the monthly data file for the time-traveller page.

Every month from Farvardin 1370 to the last month with data gets, per series, a value and a quality flag:
  o = observed (monthly figure from the source)
  a = from an annual/quarterly figure placed at mid-period
  i = interpolated between neighbouring figures (log-linear; for car/house gaps on the CPI-deflated price)
  e = labelled estimate (a different, weaker series spliced on, e.g. asking prices)
  None = no data, the series is not usable that month
"""
import csv, json, math, os, sys, datetime, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jalali import g2j

S = sys.argv[1]          # scratchpad root
OUT = sys.argv[2]        # output json
R = lambda *p: os.path.join(S, *p)
Y0, Y1, M1 = 1370, 1405, 8
N = (Y1 - Y0) * 12 + M1
idx = lambda jy, jm: (jy - Y0) * 12 + (jm - 1)
ym = lambda i: (Y0 + i // 12, i % 12 + 1)


def rows(path):
    return list(csv.DictReader(open(path, encoding='utf-8-sig')))


def span_of(key):
    """months an anchor stands for: an annual figure (key = year start + 5.5) covers its 12 months,
    a quarterly figure (integer key, flag 'a') its 3 months."""
    if not float(key).is_integer():
        s = int(key - 5.5)
        return range(s, s + 12)
    return None


def fill(points, n=N, deflator=None, spans=None):
    """points: {month_index(float): (value, flag)}. Integer keys inside [0,n) are kept as is; the rest of the
    months between the first and last point are log-linearly interpolated (flag 'i'). A month inside the
    period an annual/quarterly figure stands for gets that figure's flag ('a' or 'f'), not 'i'."""
    vals, flags = fill_raw(points, n, deflator)
    for k, (v, fl) in points.items():
        rng = span_of(k) if spans is None else spans.get(k)
        if rng is None:
            continue
        for i in rng:
            if 0 <= i < n and flags[i] == 'i':
                flags[i] = fl
    return vals, flags


def fill_raw(points, n=N, deflator=None):
    vals, flags = [None] * n, [None] * n
    keys = sorted(points)
    if not keys:
        return vals, flags
    defl = (lambda t: 1.0) if deflator is None else deflator
    for i in range(n):
        if i in points and float(i).is_integer():
            vals[i], flags[i] = points[i]
            continue
        lo = max((k for k in keys if k <= i), default=None)
        hi = min((k for k in keys if k >= i), default=None)
        if lo is None or hi is None:
            continue
        if lo == hi:
            vals[i], flags[i] = points[lo][0], points[lo][1]
            continue
        a = math.log(points[lo][0] / defl(lo)); b = math.log(points[hi][0] / defl(hi))
        w = (i - lo) / (hi - lo)
        vals[i] = math.exp(a + (b - a) * w) * defl(i)
        flags[i] = 'i'
    return vals, flags


# ---------------- CPI (needed as deflator for gap filling) ----------------
cpi_pts = {}
cpi_src = {}
for r in rows(R('research', 'macro', 'cpi_monthly.csv')):
    if r['cpi_index'] and int(r['jy']) >= Y0 and idx(int(r['jy']), int(r['jm'])) < N:
        cpi_pts[idx(int(r['jy']), int(r['jm']))] = (float(r['cpi_index']), 'o')
        cpi_src[idx(int(r['jy']), int(r['jm']))] = r['source_id']
cpi, cpi_f = fill(cpi_pts)
last_cpi = max(i for i in range(N) if cpi[i] is not None)
# CPI may stop before the last month: carry the last observed monthly inflation is NOT done; months after the
# last published CPI are marked 'e' using the official point-to-point figure if the macro agent gave one.
CPI_LAST = last_cpi


def cpi_at(t):
    """CPI for deflating gap interpolation. After the last published month it is extrapolated with the
    last published monthly rate (Aban 1405 is not out yet; monthly inflation then was 4-9%)."""
    t = int(round(t))
    t = min(max(t, 0), N - 1)
    if t > CPI_LAST:
        g = cpi[CPI_LAST] / cpi[CPI_LAST - 1]
        return cpi[CPI_LAST] * g ** (t - CPI_LAST)
    while cpi[t] is None and t > 0:
        t -= 1
    return cpi[t]


# ---------------- dollar ----------------
usd_pts = {}
for r in rows(R('research', 'usd', 'usd_toman.csv')):
    jy = int(r['jy'])
    if jy < Y0 - 1:
        continue
    v = float(r['value_toman'])
    if r['kind'].startswith('annual'):
        usd_pts[idx(jy, 1) + 5.5] = (v, 'a')
    else:
        usd_pts[idx(jy, int(r['jm']))] = (v, 'o')
# an annual anchor is dropped when that year has monthly figures in the months around it
for k in [k for k in usd_pts if not float(k).is_integer()]:
    y = int(k // 12)
    if any(isinstance(j, int) and j // 12 == y for j in usd_pts):
        del usd_pts[k]
usd, usd_f = fill(usd_pts)
# months that land exactly on an anchor get 'a'; the rest between anchors are 'i'

# ---------------- gold (world price x free-market dollar) ----------------
oz = [None] * N
oz_f = [None] * N
for r in rows(R('build', 'gold_jmonthly.csv')):
    i = idx(int(r['jy']), int(r['jm']))
    if 0 <= i < N:
        oz[i] = float(r['usd_per_oz']); oz_f[i] = 'o'
# Aban 1405: Pink Sheet not out yet -> Kraken PAXG monthly average (median gap vs Pink Sheet ~1% in 1404-05)
pax = json.load(open(R('dl', 'kr_paxg.json')))['result']
pk = [k for k in pax if k != 'last'][0]
pm = collections.defaultdict(list)
for x in pax[pk]:
    t = datetime.datetime.fromtimestamp(x[0], datetime.UTC)
    jy, jm, _ = g2j(t.year, t.month, t.day)
    pm[(jy, jm)].append(float(x[4]))
for (jy, jm), v in pm.items():
    i = idx(jy, jm)
    if 0 <= i < N and oz[i] is None:
        oz[i] = sum(v) / len(v); oz_f[i] = 'e'
GRAM18 = 0.75 / 31.1034768
gold = [oz[i] * GRAM18 * usd[i] if oz[i] and usd[i] else None for i in range(N)]
gold_f = [None if gold[i] is None else ('o' if oz_f[i] == 'o' and usd_f[i] == 'o' else (oz_f[i] if oz_f[i] != 'o' else usd_f[i])) for i in range(N)]

# ---------------- coin (tgju sekee, monthly from 1389) ----------------
coin = [None] * N; coin_f = [None] * N
for r in rows(R('research', 'usd', 'coin_toman.csv')):
    i = idx(int(r['jy']), int(r['jm']))
    if 0 <= i < N:
        coin[i] = float(r['value_toman']); coin_f[i] = 'o'

# ---------------- crypto ----------------
def crypto(name):
    v = [None] * N; f = [None] * N
    for r in rows(R('build', f'{name}_jmonthly.csv')):
        i = idx(int(r['jy']), int(r['jm']))
        if 0 <= i < N and int(r['days']) >= 20 and usd[i]:
            v[i] = float(r['avg_usd']) * usd[i]; f[i] = 'o' if usd_f[i] == 'o' else usd_f[i]
    return v, f
btc, btc_f = crypto('btc')
eth, eth_f = crypto('eth')

# ---------------- TEDPIX (tsetmc, daily from 1387/09) ----------------
tm = collections.defaultdict(list)
for tok in open(R('dl', 'tedpix_old.txt'), encoding='utf-8').read().strip().split(';'):
    d, v = tok.split(',')
    jy, jm, _ = map(int, d.split('/'))
    tm[(jy, jm)].append(float(v))
tedpix = [None] * N; tedpix_f = [None] * N
for (jy, jm), v in tm.items():
    i = idx(jy, jm)
    if 0 <= i < N and len(v) >= 8:
        tedpix[i] = sum(v) / len(v); tedpix_f[i] = 'o'

# ---------------- deposit rate ----------------
dep = [None] * N; dep_f = [None] * N
for r in rows(R('research', 'macro', 'deposit_rate.csv')):
    jy = int(r['jy'])
    # when only a range is published (e.g. 7-16% in 1385-86), take the top: the most a one-year deposit could
    # legally earn. This favours the bank saver, which keeps the comparison fair to it.
    hi = r['rate_pct_max'] or r['rate_pct_min']
    if not hi:
        continue
    rate = float(hi)
    for jm in range(1, 13):
        i = idx(jy, jm)
        if 0 <= i < N:
            dep[i] = rate; dep_f[i] = 'a'

# ---------------- minimum wage ----------------
wage = [None] * N; wage_f = [None] * N
wage_year = {}
for r in rows(R('research', 'macro', 'min_wage.csv')):
    jy = int(r['jy'])
    v = r['total_toman'] or r['base_toman']
    if v:
        wage_year[jy] = (float(r['base_toman']) if r['base_toman'] else None, float(r['total_toman']) if r['total_toman'] else None)
        for jm in range(1, 13):
            i = idx(jy, jm)
            if 0 <= i < N:
                wage[i] = float(r['base_toman']) if r['base_toman'] else None; wage_f[i] = 'a'

# ---------------- Tehran price per m2 ----------------
hp = {}
hp_src = {}
for r in rows(R('research', 'housing', 'tehran_m2.csv')):
    jy = int(r['jy']); v = float(r['toman_per_m2']); k = r['kind']
    if k == 'annual_avg':
        key = idx(jy, 1) + 5.5; fl = 'a'
    elif k == 'quarterly':
        key = idx(jy, int(r['jm'])) - 1; fl = 'a'      # quarter ending month jm -> its middle month
    elif k == 'monthly':
        key = idx(jy, int(r['jm'])); fl = 'o'
    else:                                               # monthly_sci / monthly_asking after Mordad 1403
        key = idx(jy, int(r['jm'])); fl = 'e'
    if key < -12:
        continue
    hp.setdefault(key, []).append((v, fl, k, r['source_id']))
# priority when a month has several figures: CBI monthly > SCI monthly > quarterly/annual > asking
prio = {'monthly': 0, 'monthly_sci': 1, 'quarterly': 2, 'annual_avg': 3, 'monthly_asking': 4}
hp_pts = {}
for key, lst in hp.items():
    lst.sort(key=lambda x: prio.get(x[2], 9))
    hp_pts[key] = (lst[0][0], lst[0][1])
# annual anchors are redundant where quarterly figures exist for the same year
for k in [k for k in hp_pts if not float(k).is_integer() and k > 0]:
    y = int(k // 12)
    if sum(1 for j in hp_pts if float(j).is_integer() and j // 12 == y) >= 3:
        del hp_pts[k]
# After Mordad 1403 there is no official series. Kept, all flagged 'e': the SCI transaction figures for
# Tir/Mordad 1404 and the Kilid listing average for Aban 1405 (the latest figure). Donya-e-Eqtesad's 1404
# asking-price monitoring is a third, different sample (it runs below SCI), so it is NOT spliced in, and no
# series is rescaled by another.
official_end = idx(1403, 5)
for k in list(hp_pts):
    if k > official_end:
        lst = hp[k]
        keep = [v for v in lst if v[2] == 'monthly_sci' or v[3].startswith('IRANECONOMIST')]
        if keep:
            hp_pts[k] = (keep[0][0], 'e')
        else:
            del hp_pts[k]
ask_scale = None
hp_spans = {k: (range(k - 1, k + 2) if float(k).is_integer() and v[1] == 'a' else
                 (span_of(k) if not float(k).is_integer() else None)) for k, v in hp_pts.items()}
house_all, house_all_f = fill(hp_pts, deflator=cpi_at, spans=hp_spans)
for i in range(official_end + 1, N):
    if house_all[i] is not None:
        house_all_f[i] = 'e'

# ---------------- districts: ratio of district to city average ----------------
dist = collections.defaultdict(list)
city_m = {k: v[0] for k, lst in hp.items() for v in lst if v[2] == 'monthly'}
for r in rows(R('research', 'housing', 'tehran_districts.csv')):
    if not r['jm'] or not r['district']:
        continue
    k = idx(int(r['jy']), int(r['jm']))
    if k in city_m:
        dist[int(r['district'])].append(float(r['toman_per_m2']) / city_m[k])
district_ratio = {d: (sum(v) / len(v), min(v), max(v), len(v)) for d, v in sorted(dist.items())}

# ---------------- cars ----------------
car_raw = collections.defaultdict(dict)
for r in rows(R('research', 'housing', 'car.csv')):
    jy = int(r['jy'])
    car_raw[r['model']].setdefault(jy, {})[r['kind']] = float(r['toman'])
cars = {}
for model, years in car_raw.items():
    pts = {}
    for jy, kinds in years.items():
        if jy < Y0 - 1:
            continue
        v = kinds.get('market') or kinds.get('factory')
        pts[idx(jy, 1) + 5.5] = (v, 'a' if 'market' in kinds else 'f')
    if not pts:
        continue
    v, f = fill(pts, deflator=cpi_at)
    first = min(pts); last = max(pts)
    # a model is only "on sale" from the start of its first priced year to the end of its last one
    y_first = int(first // 12); y_last = int(last // 12)
    for i in range(N):
        if i // 12 < y_first or i // 12 > y_last:
            v[i] = None; f[i] = None
        elif v[i] is None:   # first/last half-year: the nearest annual figure moved with CPI
            near = first if i < first else last
            v[i] = pts[near][0] * cpi_at(i) / cpi_at(near); f[i] = pts[near][1]
    cars[model] = {'v': v, 'f': f, 'years': [Y0 + y_first, Y0 + y_last]}


def rnd(x):
    if x is None:
        return None
    return float(f'{x:.5g}')


out = {
    'start': [Y0, 1], 'n': N,
    'series': {
        'cpi': [rnd(x) for x in cpi], 'cpi_f': cpi_f,
        'usd': [rnd(x) for x in usd], 'usd_f': usd_f,
        'gold': [rnd(x) for x in gold], 'gold_f': gold_f,
        'coin': [rnd(x) for x in coin], 'coin_f': coin_f,
        'btc': [rnd(x) for x in btc], 'btc_f': btc_f,
        'eth': [rnd(x) for x in eth], 'eth_f': eth_f,
        'tedpix': [rnd(x) for x in tedpix], 'tedpix_f': tedpix_f,
        'dep': dep, 'dep_f': dep_f,
        'wage': [rnd(x) for x in wage], 'wage_f': wage_f,
        'house': [rnd(x) for x in house_all], 'house_f': house_all_f,
    },
    'house_official_end': official_end,
    'house_ask_scale': ask_scale,
    'district_ratio': {d: [round(a, 3), round(b, 3), round(c, 3), n] for d, (a, b, c, n) in district_ratio.items()},
    'cars': {m: {'v': [rnd(x) for x in c['v']], 'f': c['f'], 'years': c['years']} for m, c in cars.items()},
    'built': datetime.date.today().isoformat(),
}
json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('months', N, 'cpi last', ym(CPI_LAST), 'ask_scale', ask_scale)
for k in ('cpi', 'usd', 'gold', 'coin', 'btc', 'eth', 'tedpix', 'dep', 'wage', 'house'):
    s = out['series'][k]; f = out['series'][k + '_f']
    have = [i for i in range(N) if s[i] is not None]
    print(f'{k:7s}', ym(have[0]) if have else '-', ym(have[-1]) if have else '-', collections.Counter(x for x in f if x))
print('districts', {d: v[0] for d, v in out['district_ratio'].items()})
print('cars', {m: c['years'] for m, c in out['cars'].items()})
