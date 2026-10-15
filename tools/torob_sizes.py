"""Product dimensions from Torob for hobby/sizes.html.

Torob's API does not allow cross-origin calls from the browser, so a GitHub
Action runs this script per category and the page only reads the files it
writes. Torob shows an "are you a robot?" page (HTTP 490) after ~40 calls
from one IP, so every run takes a small bite: the most popular products of
each category are listed once a day, and each product's detail page (where
the dimensions are) is read once and remembered.

    python tools/torob_sizes.py --keys            # category keys, as JSON (CI matrix)
    python tools/torob_sizes.py fridge            # one category
    python tools/torob_sizes.py --index           # rebuild hobby/data/sizes/index.json
    BUDGET=5 python tools/torob_sizes.py fridge   # quick local test

Files, all under hobby/data/sizes/:
    <key>.json        what the page reads: products that have dimensions
    state/<key>.json  everything this script remembers about the category
    index.json        the category list with counts
"""
import datetime
import json
import os
import pathlib
import random
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "hobby" / "data" / "sizes"
IMAGE_PREFIX = "https://image.torob.com/base/images/"

# group 1: has to fit a set space, 2: large furniture and home items,
# 3: goes on a desk or counter, or inside something else.
# shape says which way the box stands when Torob gives one "a×b×c" string:
#   tall  height is the largest side (fridge, wardrobe, washing machine)
#   wide  width is the largest, depth the smallest (TV, radiator, aquarium)
#   flat  height is the smallest (microwave, printer, mattress)
#   given the order Torob writes is length × width × height (PC cases)
# size is the range (mm) the largest side must fall in, to reject typos and wrong units.
CATEGORIES = [
    {"key": "fridge", "title": "یخچال و فریزر", "group": 1, "cats": [212, 207, 209, 208, 213], "shape": "tall", "size": (200, 2300), "per_source": 200},
    {"key": "washer", "title": "ماشین لباسشویی", "group": 1, "cats": [201], "shape": "tall", "size": (400, 1300)},
    {"key": "dishwasher", "title": "ماشین ظرفشویی", "group": 1, "cats": [202], "shape": "tall", "size": (300, 1000)},
    {"key": "oven", "title": "فر توکار و رومیزی", "group": 1, "cats": [2520], "shape": "wide", "size": (250, 1000)},
    {"key": "boiler", "title": "پکیج گرمایشی", "group": 1, "cats": [2383], "shape": "tall", "size": (400, 1200)},
    {"key": "water-heater", "title": "آبگرمکن", "group": 1, "cats": [2511, 2512], "shape": "tall", "size": (300, 2200)},
    {"key": "radiator", "title": "رادیاتور", "group": 1, "cats": [2513], "shape": "wide", "size": (200, 3000)},
    {"key": "wardrobe", "title": "کمد و بوفه", "group": 2, "cats": [339], "shape": "tall", "size": (300, 3000)},
    {"key": "drawer", "title": "دراور", "group": 2, "cats": [342], "shape": "tall", "size": (300, 2500)},
    {"key": "shoe-cabinet", "title": "جاکفشی", "group": 2, "cats": [341], "shape": "tall", "size": (300, 2500)},
    {"key": "bookcase", "title": "کتابخانه", "group": 2, "cats": [340], "shape": "tall", "size": (300, 2800)},
    {"key": "tv-stand", "title": "میز تلویزیون", "group": 2, "cats": [351], "shape": "wide", "size": (400, 3500)},
    {"key": "tv", "title": "تلویزیون", "group": 2, "cats": [246], "shape": "wide", "size": (400, 2500)},
    {"key": "ac", "title": "کولر گازی (یونیت داخلی)", "group": 2, "cats": [221], "shape": "wide", "size": (500, 2000)},
    {"key": "gas-heater", "title": "بخاری گازی", "group": 2, "cats": [2483], "shape": "wide", "size": (300, 1500)},
    {"key": "aquarium", "title": "آکواریوم", "group": 2, "cats": [3898], "shape": "wide", "size": (150, 2500)},
    {"key": "microwave", "title": "مایکروویو", "group": 3, "cats": [668], "shape": "flat", "size": (300, 800)},
    {"key": "monitor", "title": "مانیتور", "group": 3, "cats": [230], "shape": "wide", "size": (250, 1500)},
    {"key": "printer", "title": "پرینتر", "group": 3, "cats": [647, 1174], "shape": "flat", "size": (150, 900)},
    {"key": "pc-case", "title": "کیس کامپیوتر", "group": 3, "cats": [239], "shape": "given", "size": (150, 900)},
    {"key": "psu", "title": "پاور کامپیوتر", "group": 3, "cats": [521], "shape": "flat", "size": (80, 300)},
    {"key": "soundbar", "title": "ساندبار", "group": 3, "cats": [1494], "shape": "wide", "size": (200, 1700)},
    {"key": "safe", "title": "گاوصندوق", "group": 3, "cats": [1184], "shape": "tall", "size": (150, 2000)},
    {"key": "car-battery", "title": "باتری خودرو", "group": 3, "cats": [541], "shape": "flat", "size": (100, 600)},
]
BY_KEY = {c["key"]: c for c in CATEGORIES}

PER_SOURCE = int(os.environ.get("PER_SOURCE", "300"))  # most popular products listed per category id (unless the category sets per_source)
BUDGET = int(os.environ.get("BUDGET", "38"))            # Torob calls per run, under the ~40 that trip the block
DELAY = float(os.environ.get("DELAY", "4"))
RECHECK_DAYS = 30  # a product without dimensions is read again after this many days
PAGE_SIZE = 100

SEARCH = "https://api.torob.com/v4/base-product/search/?page={page}&sort=popularity&size={size}&source=next_desktop&rank_offset={offset}"
DETAILS = "https://api.torob.com/v4/base-product/details/?prk={prk}&source=next_desktop"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/128.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "fa",
}


class Blocked(Exception):
    pass


RUN = {"calls": 0, "log": []}


def log(msg):
    print(msg)
    RUN["log"].append(msg)


def get_json(url):
    if RUN["calls"] >= BUDGET:
        raise Blocked("budget used up")
    RUN["calls"] += 1
    time.sleep(DELAY + random.uniform(0, DELAY / 2))
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=30) as res:
            return json.load(res)
    except urllib.error.HTTPError as e:
        raise Blocked(f"call {RUN['calls']}: HTTP {e.code}")  # 490 = Torob's "are you a robot?" page
    except Exception as e:
        raise Blocked(f"call {RUN['calls']}: {e}")


# ---------- dimensions ----------

FA_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
NUM = re.compile(r"\d+(?:\.\d+)?")
SKIP_KEY = re.compile(r"بسته|کارتن|نمایشگر|صفحه|حسگر|عکس|فن|درایور|لوله|دودکش|سینی|کابل|سیم|آکس|"
                      r"داخل|مخزن|یونیت خارجی|کمپرسور|ساب|بلندگو|کابینت|برش|نصب|تنظیم|برآمدگی|درب باز|"
                      r"پشتی|کفی|حداقل|حداکثر|سفارشی|انتخابی|انواع")
SIDE = {"ارتفاع": "h", "عرض": "w", "پهنا": "w", "عمق": "d", "طول": "l"}
LABELLED = re.compile(r"(ارتفاع|عرض|پهنا|عمق|طول)[^\d]{0,15}?(\d+(?:\.\d+)?)")  # "ارتفاع با پایه 790"


def normalize(text):
    text = str(text).translate(FA_DIGITS)
    text = re.sub(r"(?<=\d)[٫/](?=\d)", ".", text)  # ۵۳/۵ and ۵۳٫۵ are decimals
    return text.replace("٬", "").replace(",", "")


def unit_factor(text):
    """mm per unit written in text, or None when no unit is written."""
    if re.search(r"میلی|میلي|mm|میل\b", text, re.I):
        return 1
    if re.search(r"سانت|cm", text, re.I):
        return 10
    if re.search(r"(?<![a-z])m(?![a-z])|متر", text, re.I):
        return 1000
    return None


def fit_unit(values, factor, size):
    """Pick the unit so the largest side lands in the category's range; a written
    unit is tried first, but sellers often write the wrong one."""
    lo, hi = size
    for f in ([factor] if factor else []) + [1, 10]:
        mm = [v * f for v in values]
        if lo <= max(mm) <= hi and min(mm) >= 3:
            return [round(v) for v in mm]
    return None


def orient(abc, shape):
    """[width, height, depth] in mm from three sides whose order is unknown."""
    if shape == "given":  # length × width × height, unless width isn't the narrowest side
        length, width, height = abc
        if width != min(abc):
            rest = list(abc)
            width = rest.pop(rest.index(min(abc)))
            length, height = rest
        return [width, height, length]
    s = sorted(abc)
    if shape == "tall":
        return [s[1], s[2], s[0]]
    if shape == "wide":
        return [s[2], s[1], s[0]]
    return [s[2], s[0], s[1]]  # flat


def consistent(whd, shape):
    w, h, d = whd
    if shape == "tall":
        return h >= w and h >= d
    if shape == "wide":
        return w >= h and w >= d
    if shape == "flat":
        return h <= w and h <= d
    return True


def from_sides(parts, cat):
    """parts: {side: (value, unit factor)} -> [w, h, d] mm, or None."""
    if "d" not in parts and "l" in parts and "w" in parts:
        # length and width with no depth: the longer one faces you (furniture "طول ۸۶ عرض ۳۲")
        a, b = sorted([parts.pop("l"), parts.pop("w")], key=lambda p: p[0] * (p[1] or 1))
        parts["w"], parts["d"] = b, a
    elif "w" not in parts and "l" in parts:
        parts["w"] = parts.pop("l")
    if not all(s in parts for s in "whd"):
        return None
    factor = next((parts[s][1] for s in "hwd" if parts[s][1]), None)
    mm = fit_unit([parts[s][0] for s in "whd"], factor, cat["size"])
    if not mm:
        return None
    return mm if consistent(mm, cat["shape"]) else orient(mm, cat["shape"])


def find_dims(specs, cat):
    """[width, height, depth] in mm, or None. specs: {key: value} from Torob."""
    keys = [k for k in specs if not SKIP_KEY.search(k)]
    # 1) separate height / width / depth entries
    parts = {}
    for k in keys:
        v = normalize(specs[k])
        nums = NUM.findall(v)
        side = next((SIDE[w] for w in SIDE if w in k), None)
        if len(nums) == 1 and side and side not in parts:
            parts[side] = (float(nums[0]), unit_factor(k + " " + v))
    mm = from_sides(parts, cat)
    if mm:
        return mm
    # 2) one "a × b × c" entry; for TVs and monitors prefer the one without the stand
    dim_keys = [k for k in keys if re.search("ابعاد|سایز|اندازه|طول|عرض|ارتفاع|عمق", k)]
    dim_keys.sort(key=lambda k: (0 if "بدون پایه" in k else 2 if "پایه" in k else 1))
    for k in dim_keys:
        v = normalize(specs[k])
        labelled = {}
        for word, n in LABELLED.findall(v):  # "عرض 60 ارتفاع 99 عمق 72", also inside longer text
            labelled.setdefault(SIDE[word], (float(n), None))
        if len(labelled) >= 3:
            unit = unit_factor(k + " " + v)
            mm = from_sides({s: (n, unit) for s, (n, _) in labelled.items()}, cat)
            if mm:
                return mm
        nums = [float(n) for n in NUM.findall(v)]
        if len(nums) != 3:
            continue
        mm = fit_unit(nums, unit_factor(k + " " + v), cat["size"])
        if mm:
            return orient(mm, cat["shape"])
    return None


def size_specs(detail):
    out = {}
    for h in (detail.get("structural_specs") or {}).get("headers") or []:
        for k, v in (h.get("specs") or {}).items():
            if isinstance(v, (str, int, float)) and re.search(r"ابعاد|اندازه|طول|عرض|پهنا|ارتفاع|عمق|سایز", k):
                out[k] = str(v)
    return out


# ---------- one category ----------

def sources(cat):
    if "cats" in cat:
        return [f"&category={c}" for c in cat["cats"]]
    return ["&q=" + urllib.parse.quote(cat["q"])]


def run(key):
    cat = BY_KEY[key]
    today = datetime.date.today().isoformat()
    state_file = DATA / "state" / f"{key}.json"
    state = json.loads(state_file.read_text(encoding="utf-8")) if state_file.exists() else {}
    products = state.get("products", {})  # id -> product
    order = state.get("order", [])        # ids in popularity order (last complete listing)
    cursor = state.get("cursor")          # listing in progress: {"date", "source", "page", "ids"}

    # 1) listing: once a day, resumable across runs
    try:
        if state.get("list_date") != today:
            if not cursor or cursor["date"] != today:
                cursor = {"date": today, "source": 0, "page": 1, "ids": []}  # ids: one list per source
            srcs = sources(cat)
            while cursor["source"] < len(srcs):
                page = cursor["page"]
                data = get_json(SEARCH.format(page=page, size=PAGE_SIZE, offset=(page - 1) * PAGE_SIZE)
                                + srcs[cursor["source"]])
                results = [r for r in data.get("results") or [] if r.get("random_key") and not r.get("is_adv")]
                for r in results:
                    prk = r["random_key"]
                    p = products.setdefault(prk, {"first_seen": today})
                    p.update(name=r.get("name1") or "", price=r.get("price") or 0,
                             image=r.get("image_url") or "", url=r.get("web_client_absolute_url") or "")
                    if len(cursor["ids"]) <= cursor["source"]:
                        cursor["ids"].append([])
                    cursor["ids"][cursor["source"]].append(prk)
                log(f"list {srcs[cursor['source']][:40]} page {page}: {len(results)}")
                if not results or page * PAGE_SIZE >= min(cat.get("per_source", PER_SOURCE), data.get("count") or 0):
                    cursor["source"] += 1
                    cursor["page"] = 1
                else:
                    cursor["page"] += 1
            # take the sources in turn, so one weak sub-category doesn't use up the first runs
            seen, order = set(), []
            lists = [l if isinstance(l, list) else [l] for l in cursor["ids"]]
            for row in range(max(map(len, lists), default=0)):
                for l in lists:
                    if row < len(l) and l[row] not in seen:
                        seen.add(l[row])
                        order.append(l[row])
            state["list_date"], cursor = today, None
            log(f"list done: {len(order)} products")
    except Blocked as e:
        log(f"list paused: {e}")

    # 2) detail pages, most popular first
    cutoff = (datetime.date.today() - datetime.timedelta(days=RECHECK_DAYS)).isoformat()
    todo = [i for i in order if i in products and ("checked" not in products[i] or
            (products[i].get("dims") is None and products[i]["checked"] < cutoff))]
    read = 0
    try:
        for prk in todo:
            d = get_json(DETAILS.format(prk=prk))
            specs = size_specs(d)
            products[prk].update(specs=specs, dims=find_dims(specs, cat), checked=today)
            read += 1
    except Blocked as e:
        log(f"details paused after {read}: {e}")
    log(f"details read {read}, {max(len(todo) - read, 0)} left")

    state.update(products=products, order=order, cursor=cursor,
                 updated=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                 last_run=RUN)
    (DATA / "state").mkdir(parents=True, exist_ok=True)
    state_file.write_text(json.dumps(state, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    write_page_file(cat, state)


def reparse(key):
    """Re-run the parser over stored specs (after changing find_dims) without calling Torob."""
    cat = BY_KEY[key]
    state_file = DATA / "state" / f"{key}.json"
    state = json.loads(state_file.read_text(encoding="utf-8"))
    for p in state["products"].values():
        if "specs" in p:
            p["dims"] = find_dims(p["specs"], cat)
    state_file.write_text(json.dumps(state, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    write_page_file(cat, state)


def write_page_file(cat, state):
    """Rows of products that have dimensions, in popularity order:
    [id, name, price, image, url slug, width, height, depth] (mm)."""
    products, rows = state["products"], []
    for prk in state["order"]:
        p = products.get(prk) or {}
        if not p.get("dims"):
            continue
        image = p["image"][len(IMAGE_PREFIX):] if p["image"].startswith(IMAGE_PREFIX) else p["image"]
        slug = urllib.parse.unquote(p["url"])
        prefix = f"/p/{prk}/"
        slug = slug[len(prefix):].strip("/") if slug.startswith(prefix) else ""
        rows.append([prk, p["name"], p["price"], image, slug] + p["dims"])
    checked = sum(1 for i in state["order"] if "checked" in (products.get(i) or {}))
    page = {"key": cat["key"], "title": cat["title"], "updated": state.get("updated"),
            "listed": len(state["order"]), "checked": checked, "image_prefix": IMAGE_PREFIX, "rows": rows}
    (DATA / f"{cat['key']}.json").write_text(json.dumps(page, ensure_ascii=False, separators=(",", ":")),
                                             encoding="utf-8")


def build_index():
    cats = []
    for c in CATEGORIES:
        f = DATA / f"{c['key']}.json"
        page = json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}
        cats.append({"key": c["key"], "title": c["title"], "group": c["group"],
                     "count": len(page.get("rows", [])), "listed": page.get("listed", 0),
                     "checked": page.get("checked", 0), "updated": page.get("updated")})
    index = {"updated": max((c["updated"] or "" for c in cats), default=""), "categories": cats}
    (DATA / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    if arg == "--keys":
        print(json.dumps([c["key"] for c in CATEGORIES]))
    elif arg == "--index":
        build_index()
    elif arg == "--reparse":
        for k in sys.argv[2:] or BY_KEY:
            if (DATA / "state" / f"{k}.json").exists():
                reparse(k)
        build_index()
    elif arg in BY_KEY:
        run(arg)
    else:
        sys.exit(__doc__)
