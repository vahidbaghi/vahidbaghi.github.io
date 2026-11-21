import csv, json, datetime, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jalali import g2j
DL = sys.argv[1]
def daily_cm(name):
    d = {}
    for r in csv.DictReader(open(os.path.join(DL, name+'.csv'))):
        if r.get('PriceUSD'): d[r['time']] = float(r['PriceUSD'])
    return d
def daily_kr(name, key):
    res = json.load(open(os.path.join(DL, name)))['result'][key]
    return {datetime.datetime.fromtimestamp(x[0], datetime.UTC).strftime('%Y-%m-%d'): float(x[4]) for x in res}
out = {}
for sym, cmf, krf, krk in (('btc','btc','kr_btc.json','XXBTZUSD'), ('eth','eth','kr_eth.json','XETHZUSD')):
    d = daily_cm(cmf); src = {k:'coinmetrics' for k in d}
    for k, v in daily_kr(krf, krk).items():
        if k not in d: d[k] = v; src[k] = 'kraken'
    months = {}
    for k in sorted(d):
        y, m, dd = map(int, k.split('-')); jy, jm, _ = g2j(y, m, dd)
        months.setdefault((jy, jm), []).append((d[k], src[k]))
    rows = []
    for (jy, jm), v in sorted(months.items()):
        srcs = sorted(set(s for _, s in v))
        rows.append((jy, jm, sum(x for x, _ in v)/len(v), v[-1][0], len(v), '+'.join(srcs)))
    with open(f'{sym}_jmonthly.csv', 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['jy','jm','avg_usd','close_usd','days','source'])
        for r in rows: w.writerow([r[0], r[1], f'{r[2]:.6g}', f'{r[3]:.6g}', r[4], r[5]])
    print(sym, rows[0][:2], rows[-1][:2], 'last', rows[-1])
# gold: Gregorian monthly averages -> Jalali month = days-weighted mix of the Gregorian months it overlaps
gm = {}
for r in csv.DictReader(open(os.path.join(DL, 'gold_monthly.csv'))):
    gm[r['Date']] = float(r['Price'])
acc = {}
day = datetime.date(1971, 3, 21)
end = datetime.date(2026, 10, 31)
while day <= end:
    key = day.strftime('%Y-%m')
    if key in gm:
        jy, jm, _ = g2j(day.year, day.month, day.day)
        acc.setdefault((jy, jm), []).append(gm[key])
    day += datetime.timedelta(days=1)
with open('gold_jmonthly.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['jy','jm','usd_per_oz','days'])
    for (jy, jm), v in sorted(acc.items()):
        if len(v) >= 28: w.writerow([jy, jm, f'{sum(v)/len(v):.2f}', len(v)])
print('gold rows', sum(1 for _ in open('gold_jmonthly.csv'))-1)
