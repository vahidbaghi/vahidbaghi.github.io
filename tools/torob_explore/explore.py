"""Which Torob categories list exact product dimensions?

For each keyword: one search (gives the categories it lands in), then the
detail pages of the first few products, keeping every spec that looks like a
size (dimensions, length/width/height/depth, diameter, weight).
Torob blocks an IP after ~40 calls, so each CI job gets a slice of keywords.

    python explore.py <job index> <job count> <out.json>
"""
import json
import random
import re
import sys
import time
import urllib.error
import urllib.request

KEYWORDS = [
    # electronics
    "گوشی موبایل", "لپ تاپ", "تبلت", "تلویزیون", "مانیتور", "کنسول بازی", "اسپیکر",
    "ساندبار", "پاوربانک", "مودم روتر", "پرینتر", "کارت گرافیک", "منبع تغذیه کامپیوتر",
    "هارد اکسترنال", "ساعت هوشمند", "هدفون", "دوربین عکاسی", "یو پی اس",
    # home appliances
    "یخچال", "فریزر", "ماشین لباسشویی", "ماشین ظرفشویی", "اجاق گاز", "مایکروویو",
    "جاروبرقی", "کولر گازی", "کولر آبی", "آبگرمکن", "بخاری", "سرخ کن", "قهوه ساز",
    "پنکه", "هود آشپزخانه", "تصفیه آب",
    # furniture, travel, other
    "چمدان", "کوله پشتی", "مبل", "میز تحریر", "صندلی گیمینگ", "کمد", "تخت خواب",
    "کالسکه", "دوچرخه", "اسکوتر برقی", "باتری خودرو", "کیف لپ تاپ", "گاوصندوق", "آکواریوم",
]
SAMPLES = 3
SIZE_KEY = re.compile(r"ابعاد|اندازه|طول|عرض|ارتفاع|عمق|ضخامت|قطر|وزن|حجم|سایز")
SEARCH = "https://api.torob.com/v4/base-product/search/?page=1&sort=popularity&size=12&q={q}&source=next_desktop"
DETAILS = "https://api.torob.com/v4/base-product/details/?prk={prk}&source=next_desktop"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/128.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "fa",
}
calls = 0


class Blocked(Exception):
    pass


def get_json(url):
    global calls
    calls += 1
    time.sleep(4 + random.uniform(0, 2))
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=30) as res:
            return json.load(res)
    except urllib.error.HTTPError as e:
        raise Blocked(f"call {calls}: HTTP {e.code}")
    except Exception as e:
        raise Blocked(f"call {calls}: {e}")


def main():
    job, jobs, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
    mine = KEYWORDS[job::jobs]
    report = {"job": job, "keywords": mine, "results": [], "stopped": None}
    try:
        for kw in mine:
            search = get_json(SEARCH.format(q=urllib.request.quote(kw)))
            entry = {
                "keyword": kw,
                "count": search.get("count"),
                "categories": [(c.get("cat_id"), c.get("title")) for c in (search.get("categories") or [])[:6]],
                "samples": [],
            }
            report["results"].append(entry)
            products = [r for r in search.get("results") or [] if r.get("random_key") and not r.get("is_adv")]
            for r in products[:SAMPLES]:
                d = get_json(DETAILS.format(prk=r["random_key"]))
                crumbs = d.get("breadcrumbs") or []
                specs = {}
                n_specs = 0
                for h in (d.get("structural_specs") or {}).get("headers") or []:
                    for k, v in (h.get("specs") or {}).items():
                        n_specs += 1
                        if SIZE_KEY.search(k):
                            specs[k] = v
                entry["samples"].append({
                    "name": r.get("name1"),
                    "category": (crumbs[-1].get("cat_id"), crumbs[-1].get("title")) if crumbs else None,
                    "path": " > ".join(c.get("title", "") for c in crumbs[1:]),
                    "spec_count": n_specs,
                    "size_specs": specs,
                })
    except Blocked as e:
        report["stopped"] = str(e)
    report["calls"] = calls
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    print(json.dumps({k: report[k] for k in ("job", "calls", "stopped")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
