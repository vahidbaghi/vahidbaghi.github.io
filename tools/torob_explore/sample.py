"""Second pass: how many products in each box-shaped category list usable dimensions.

Each target is a Torob category id or, when the id isn't known yet, a search
keyword. One search, then the detail pages of SAMPLES products spread over the
first 24 results; every size-like spec is kept so the parser can be tuned offline.

    python sample.py <job index> <job count> <out.json>
"""
import json
import random
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

TARGETS = [
    # known category ids
    {"name": "یخچال", "cat": 212}, {"name": "یخچال فریزر دوقلو", "cat": 207},
    {"name": "یخچال فریزر بالاپایین", "cat": 209}, {"name": "یخچال ساید بای ساید", "cat": 208},
    {"name": "فریزر", "cat": 213}, {"name": "ماشین لباسشویی", "cat": 201},
    {"name": "ماشین ظرفشویی", "cat": 202}, {"name": "اجاق گاز", "cat": 195},
    {"name": "مایکروویو", "cat": 668}, {"name": "فر برقی و گازی", "cat": 2520},
    {"name": "کمد، بوفه و قفسه دیواری", "cat": 339}, {"name": "تلویزیون", "cat": 246},
    {"name": "مانیتور", "cat": 230}, {"name": "پاور کامپیوتر", "cat": 521},
    {"name": "گوشی موبایل", "cat": 94}, {"name": "لپ تاپ", "cat": 99},
    {"name": "پرینتر لیزری و چند کاره", "cat": 647}, {"name": "پرینتر جوهر افشان", "cat": 1174},
    {"name": "ساندبار", "cat": 1494}, {"name": "آکواریوم آماده", "cat": 3898},
    {"name": "بخاری گازی", "cat": 2483}, {"name": "آبگرمکن گازی", "cat": 2511},
    {"name": "باتری خودرو", "cat": 541}, {"name": "کولر گازی", "cat": 221},
    {"name": "گاو صندوق", "cat": 1184}, {"name": "پاوربانک", "cat": 369},
    # ids not known yet
    {"name": "تبلت", "q": "تبلت"}, {"name": "چمدان", "q": "چمدان"},
    {"name": "تشک", "q": "تشک خوشخواب"}, {"name": "فر توکار", "q": "فر توکار"},
    {"name": "باکس نگهداری", "q": "باکس نگهداری"}, {"name": "کتاب", "q": "کتاب رمان"},
    {"name": "پکیج گرمایشی", "q": "پکیج دیواری"}, {"name": "رادیاتور", "q": "رادیاتور پنلی"},
    {"name": "جاکفشی", "q": "جاکفشی"}, {"name": "دراور", "q": "دراور"},
    {"name": "کتابخانه", "q": "کتابخانه چوبی"}, {"name": "میز تلویزیون", "q": "میز تلویزیون"},
]
SAMPLES = 12
SIZE_KEY = re.compile(r"ابعاد|اندازه|طول|عرض|پهنا|ارتفاع|عمق|ضخامت|قطر|سایز")
SEARCH = "https://api.torob.com/v4/base-product/search/?page=1&sort=popularity&size=24&source=next_desktop"
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
    mine = TARGETS[job::jobs]
    report = {"job": job, "targets": mine, "results": [], "stopped": None}
    try:
        for t in mine:
            url = SEARCH + (f"&category={t['cat']}" if "cat" in t else "&q=" + urllib.parse.quote(t["q"]))
            search = get_json(url)
            entry = {"target": t, "count": search.get("count"), "samples": []}
            report["results"].append(entry)
            products = [r for r in search.get("results") or [] if r.get("random_key") and not r.get("is_adv")]
            for r in products[::2][:SAMPLES]:
                d = get_json(DETAILS.format(prk=r["random_key"]))
                specs = {}
                for h in (d.get("structural_specs") or {}).get("headers") or []:
                    for k, v in (h.get("specs") or {}).items():
                        if SIZE_KEY.search(k):
                            specs[k] = v
                entry["samples"].append({
                    "name": r.get("name1"),
                    "torob_category": d.get("torob_category"),
                    "path": " > ".join(c.get("title", "") for c in (d.get("breadcrumbs") or [])[1:]),
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
