"""Fetch the PC-case list from Torob into hobby/data/torob-cases.json.

Torob's API does not allow cross-origin calls from the browser, so the
compare page reads this file instead. Torob rate-limits hard, so the run
is slow on purpose: a few seconds between calls, a cap on detail pages per
run, and it stops at the first 429/403/490 and keeps what it already has.
Dimensions never change, so each product's detail page is fetched once and
remembered; later runs only refresh the list (names, prices, order).

    python tools/torob_cases.py              # full list + up to 120 detail pages
    MAX_DETAILS=3 MAX_PAGES=1 python tools/torob_cases.py   # quick local test
"""
import datetime
import json
import os
import pathlib
import random
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "hobby" / "data" / "torob-cases.json"

CATEGORY = 239  # کیس کامپیوتر
PAGE_SIZE = 100
MAX_PAGES = int(os.environ.get("MAX_PAGES", "20"))
MAX_DETAILS = int(os.environ.get("MAX_DETAILS", "120"))
DELAY = float(os.environ.get("DELAY", "4"))
RECHECK_DAYS = 30  # products with no dimensions on Torob are re-checked this often

SEARCH = ("https://api.torob.com/v4/base-product/search/?page={page}&sort=popularity"
          "&size={size}&category={cat}&source=next_desktop&rank_offset={offset}")
DETAILS = "https://api.torob.com/v4/base-product/details/?prk={prk}&source=next_desktop"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/128.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "fa",
}


class Blocked(Exception):
    pass


RUN = {"requests": 0, "log": []}  # saved into the JSON so a run can be checked without its CI log


def log(msg):
    print(msg)
    RUN["log"].append(msg)


def get_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(2):
        RUN["requests"] += 1
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                return json.load(res)
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 490) and attempt == 0:  # 490 = Torob's "are you a robot?" page
                wait = int(e.headers.get("Retry-After") or 60)
                log(f"request {RUN['requests']}: {e.code}, waiting {wait}s once")
                time.sleep(min(wait, 120))
                continue
            raise Blocked(f"request {RUN['requests']}: {e.code}")
        except (urllib.error.URLError, TimeoutError, ValueError) as e:
            if attempt == 0:
                time.sleep(10)
                continue
            raise Blocked(f"request {RUN['requests']}: {e}")


def pause():
    time.sleep(DELAY + random.uniform(0, DELAY / 2))


def find_dims(detail):
    for header in (detail.get("structural_specs") or {}).get("headers") or []:
        for key, value in (header.get("specs") or {}).items():
            if "ابعاد" in key and isinstance(value, str) and value.strip():
                return value.strip()
    return None


def main():
    today = datetime.date.today().isoformat()
    old = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    old_cases = {c["id"]: c for c in old.get("cases", [])}
    dims = old.get("dims", {})  # prk -> {"raw": str|None, "checked": date}

    # 1) the list, in Torob's popularity order; once a day is enough, so a later
    #    run that day spends its whole budget on detail pages instead
    listed, total, complete, blocked = [], None, False, False
    list_date = old.get("list_date")
    fresh = old.get("list_complete") and list_date == today
    if fresh:
        listed = sorted(old_cases.values(), key=lambda c: c["rank"])
        total, complete = old.get("torob_count"), True
        log(f"list already fetched today, {len(listed)} cases")
    try:
        for page in ([] if fresh else range(1, MAX_PAGES + 1)):
            data = get_json(SEARCH.format(page=page, size=PAGE_SIZE, cat=CATEGORY,
                                          offset=(page - 1) * PAGE_SIZE))
            total = data.get("count") or 0
            results = data.get("results") or []
            log(f"page {page}: {len(results)} items (of {total})")
            for r in results:
                prk = r.get("random_key")
                if not prk or r.get("is_adv"):
                    continue
                listed.append({
                    "id": prk,
                    "name": r.get("name1") or "",
                    "name2": r.get("name2") or "",
                    "price": r.get("price") or 0,
                    "price_text": r.get("price_text") or "",
                    "image": r.get("image_url") or "",
                    "url": r.get("web_client_absolute_url") or "",
                })
            if not results or page * PAGE_SIZE >= total:
                complete, list_date = True, today
                break
            pause()
    except Blocked as e:
        log(f"list stopped: {e}")
        blocked = True

    seen, cases = set(), []
    for c in listed:
        if c["id"] in seen:
            continue
        seen.add(c["id"])
        c["first_seen"] = old_cases.get(c["id"], {}).get("first_seen", today)
        cases.append(c)
    if not complete:  # keep the rest of the old list rather than shrinking it
        cases += [c for prk, c in old_cases.items() if prk not in seen]
    for i, c in enumerate(cases):
        c["rank"] = i

    # 2) detail pages for products whose dimensions we don't know yet
    cutoff = (datetime.date.today() - datetime.timedelta(days=RECHECK_DAYS)).isoformat()
    todo = [c["id"] for c in cases
            if c["id"] not in dims
            or (dims[c["id"]]["raw"] is None and dims[c["id"]]["checked"] < cutoff)]
    log(f"details: {len(todo)} pending, fetching up to {MAX_DETAILS}")
    fetched = 0
    try:
        for prk in ([] if blocked else todo[:MAX_DETAILS]):
            pause()
            detail = get_json(DETAILS.format(prk=prk))
            dims[prk] = {"raw": find_dims(detail), "checked": today}
            fetched += 1
    except Blocked as e:
        log(f"details stopped: {e}")
    log(f"details fetched: {fetched}")

    for c in cases:
        c["dim_raw"] = (dims.get(c["id"]) or {}).get("raw")
    with_dims = sum(1 for c in cases if c["dim_raw"])
    log(f"{len(cases)} cases, {with_dims} with dimensions, {RUN['requests']} requests this run")

    out = {
        "source": "torob.com",
        "updated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "torob_count": total,
        "list_complete": complete,
        "list_date": list_date,
        "details_pending": max(len(todo) - fetched, 0),
        "last_run": RUN,
        "cases": cases,
        "dims": dims,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
