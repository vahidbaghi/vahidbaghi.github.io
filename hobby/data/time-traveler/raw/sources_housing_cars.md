# Sources: Tehran residential price per m² (city-wide and by district)

All values in the CSVs are in TOMAN (1 toman = 10 rials). Where a source gives rials, I divided by 10. Raw copies of every page and PDF I used are saved under `raw/` (news HTML in `raw/news/`, PDFs in `raw/pdf/` and `raw/yb/`, the d-learn CSV in `raw/dlearn/`). `scripts/build_housing.py` rebuilds both CSVs from these sources. Every value it hard-codes is copied from the source named next to it.

## Files and kinds

- `tehran_m2.csv`: `jy,jm,toman_per_m2,kind,source_id`. `jm` is empty for annual rows.
  - `annual_avg`: an annual average published by the source.
  - `quarterly`: SCI seasonal survey; `jm` is the season's last month (spring = 3, summer = 6, autumn = 9, winter = 12).
  - `monthly`: CBI monthly transaction average, recorded in the national real-estate registry (سامانه ثبت معاملات املاک و مستغلات).
  - `monthly_sci`: a Statistical Centre monthly figure, used only after CBI stopped. Different method; see below.
  - `monthly_asking`: an average of advertised **asking** prices, not a transaction price. These are listed only because no official transaction series exists after Mordad 1403. Use them only with a visible caveat, or not at all.
- `tehran_districts.csv`: `jy,jm,district,toman_per_m2,kind,source_id`. District 1–22 are Tehran municipal districts. The city average is in `tehran_m2.csv`.

**Measure.** The SCI and CBI series both measure the average sale price per m² of floor area (زیربنا) of residential units transacted through real-estate agencies in Tehran city. Neither is a land price. No rent index is mixed in.

---

## City-wide series, by period

| Period | Series | Kind | Source ids |
|---|---|---|---|
| 1350–1369 | **No credible figure.** Qualitative only (see "Pre-1370") | none | DEY_4111056 |
| 1370 | One number, "official statistics" (low confidence) | annual_avg | DEY_4111056 |
| 1371 | **Gap** | none | none |
| 1372–1391 (to autumn) | SCI quarterly survey | quarterly | SCI_Q_EGHTESADNEWS |
| 1375, 1380, 1384–1399 | SCI Statistical Yearbook annual average | annual_avg | SCI_YB1388 / 1389 / 1391 / 1395 / 1396 / 1397 / 1399 |
| Mehr 1396 – Azar 1401 | CBI monthly (Esfand 1397 was never published) | monthly | CBI_DLEARN |
| Dey 1401 – Tir 1402 | **Gap.** CBI published these late (backfilled in Aban 1402), but I did not find the monthly figures | none | ECO_49098 |
| Mordad 1402 – Mordad 1403 | CBI monthly (missing: Dey and Bahman 1402, Ordibehesht 1403) | monthly | see the rows |
| Shahrivar 1403 – now | **CBI stopped** (it lost access to the registry data). Only SCI Tir and Mordad 1404, plus asking-price averages | monthly_sci / monthly_asking | TITR24_SCI, ECO_128139_DEY, IRANECONOMIST_844208_KILID |

### Cross-checks

- **SCI quarterly vs SCI yearbook.** The mean of the four quarters matches the yearbook annual value within about 2% in 1375, 1380, 1384 and 1386–1389. In 1385 the gap is 1.7%. In 1390 it is 5%: the yearbook gives 2,185,700, the quarter mean 2,076,750. In 1391 the yearbook switched to a weighted average, so 1391 is not comparable.
- **CBI monthly vs SCI yearbook.**
  - 1397: the CBI 11-month mean is 7.96M; SCI gives 8.19M.
  - 1398: CBI 13.17M; SCI 14.16M.
  - 1399: CBI 23.87M; SCI 24.55M.
  - So the two agencies agree within about 3–7%, with SCI slightly higher.
- **CBI vs SCI in the same month.** Shahrivar 1402: CBI 75.33M, SCI 77.4M (DEY_4017134).
- **d-learn vs the CBI original.** All 23 rows for Ordibehesht 1401 (22 districts plus the city) are identical to Table 3 of the CBI PDF (CBI_1401_02_PDF). Mordad 1401 (42.73M) and Azar 1401 (48.07M) match news reports of the CBI releases (MELK_95196). Shahrivar 1399 (24.29M) matches the CBI figure of 242.9M rials in the CBI PDF hosted by Tejarat News (https://tejaratnews.com/wp-content/uploads/2020/09/; I saw it in a search-result extract only).

### Which series to use

Use CBI monthly where it exists (1396/7–1403/5), SCI annual for 1375–1395, and SCI quarterly for 1372–1374 and 1376–1379 (also 1381–1383, which have no yearbook value). Neither series was chained to the other. The level differences are 3–7%, small next to the year-to-year moves.

---

## Source entries

### DEY_4111056: Donya-e-Eqtesad, «سرنوشت قیمت مسکن»
- URL: https://donya-e-eqtesad.com/fa/tiny/news-4111056 (raw: `raw/news/dey4111056.html`). The article discusses 1403, so it was published in 1403 or later.
- Quote (paragraph on history): «سال ۷۰ متوسط قیمت مسکن در تهران بر اساس آمار رسمی (آمار از آن سال به بعد در دسترس است) به ۴۷‌هزار تومان در مترمربع می‌‌رسد.»
- Used for: **1370 = 47,000 toman/m²**, annual. Confidence is low: the article does not name the agency or the table.
- **Disagreement.** A search-engine summary of a ResearchGate paper ("Spatial analysis of housing prices in Tehran city", publication 364938251, data attributed to MRUD's Housing Economics Office) gave 41,000 toman for 1991 (≈1370). The paper returned HTTP 403, so I could not verify it and did not use it. The 1372 SCI quarters (51–53k) fit either value.
- **Pre-1370, qualitative only (not in the CSV).** The same article says that no official statistics exist for the 1350s. From newspaper reports of the time, prices rose roughly six-fold between 1350 and 1355, to "at least 4,000 toman/m²". In the early 1360s they reached "10,000 toman/m² and above". These are anecdotal bounds, not a series.

### SCI_Q_EGHTESADNEWS: Statistical Centre of Iran quarterly survey 1372–1391, as reported by Eghtesadnews
- URL: https://www.eghtesadnews.com/fa/tiny/news-168316 («سال 76 هر متر خانه در تهران 152 هزار تومان …»; raw: `raw/news/eghtesadnews168316.html`).
- The article says it reproduces SCI data published by ISNA on 19 Khordad 1392, news code 92031910127 (https://www.isna.ir/news/92031910127/). The ISNA page sits behind a JS challenge, so I did not fetch it; the original is unverified.
- Unit: thousand toman per m², one value per season, Tehran city.
- Gaps: winter 1391 is not given. 1371 is not given, so 1372 is the first year.
- Cross-checked against SCI yearbook annual values (see above). Confidence is medium-high: secondary transcription, but internally consistent with the primary yearbook figures.

### SCI_YB*: Iran Statistical Yearbook, chapter "Construction and Housing"
Table: "Average price of floor area per square metre of housing units transacted in real estate agencies by selected cities / capital of ostans" (1000 rials). Row: Tehran. The yearbooks list SCI as the source, and the 1391 edition also lists MRUD. Footnote: "Since 1391 … calculated in a modified way (weighted)."

| id | URL | Table / PDF page | Years used |
|---|---|---|---|
| SCI_YB1388 | https://amar.org.ir/Portals/2/yearbook/1388/9.pdf | table 9.26, PDF p.27 | 1375 1603, 1380 3198, 1384 6497, 1385 8314, 1386 15098, 1387 18661, 1388 16334 |
| SCI_YB1389 | https://amar.org.ir/Portals/2/yearbook/1389/9.pdf | table 9.26, PDF p.29 | 1389 18375 (repeats 1375–1388 identically) |
| SCI_YB1391 | https://www.amar.org.ir/Portals/2/yearbook/1391/9.pdf | table 9.26, PDF p.33 | 1390 21857; its 1391 = **32373** (not used, see below) |
| SCI_YB1395 | https://irandataportal.syr.edu/wp-content/uploads/Construction-and-Housing-3.pdf (Persian edition 1395, mirrored by Syracuse Iran Data Portal) | table 10-17, PDF p.23 (printed p.406) | 1391 33373, 1392 40163, 1393 42021, 1394 42914, 1395 43121 |
| SCI_YB1396 | https://www.amar.org.ir/Portals/2/yearbook/1396/10.pdf | table 10.17, PDF p.22 | 1396 51186 |
| SCI_YB1397 | https://www.amar.org.ir/Portals/2/yearbook/1397/10.pdf | table 10.17, PDF p.22 | 1397 81862 |
| SCI_YB1399 | https://amar.org.ir/Portals/2/yearbook/1399/10.pdf | table 10.17, PDF p.22 | 1398 141558, 1399 245539 |

- **Disagreement, 1391.** The 1391 yearbook gives 32,373; the 1394 and 1395 yearbooks give 33,373. I chose **33,373**, the later revision, which is weighted per the footnote. The 1394 edition (irandataportal `Construction-and-Housing.pdf`, table 10-17, PDF p.21) also shows 33,373. The 1393 English yearbook PDF downloaded empty (0 pages) and was not used.
- Years 1381–1383 and 1376–1379 are not in any yearbook I could read, so the quarterly series covers them.
- The yearbooks for 1400–1402 were not at the same URL pattern (404), so SCI annual coverage ends at 1399.

### CBI_DLEARN: CBI monthly Tehran report, compiled by d-learn.ir («مدرسه دقیقه»)
- Page: https://d-learn.ir/p/tehran-houseprice-data-cbi/ (dated 30 Mordad 1401). File: https://d-learn.ir/wp-content/uploads/2023/01/cbi_houseprice_tehran.csv (raw: `raw/dlearn/cbi_houseprice_tehran.csv`).
- The page says the data are compiled from the CBI monthly PDFs «گزارش تحولات بازار معاملات مسکن شهر تهران» (CBI computes them from the national real-estate registry). Columns: y, m, region (1–22; −1 = whole city), priceM2, count. Coverage: Mehr 1396 – Azar 1401. Esfand 1397 is NA; the page notes that CBI never published it.
- **Unit trap.** priceM2 is in toman up to Tir 1401 (1401/4). From Mordad 1401 (1401/5) the file switches to thousand rials, so I multiplied by 100. I verified this against the CBI originals: Ordibehesht 1401 in toman matches the CBI PDF exactly, and Mordad 1401 = 427,299 → 42.73M toman matches the news.
- Used for: all `monthly` rows with this id, and all district rows 1396/7–1401/9.

### CBI_1401_02_PDF: CBI report, Ordibehesht 1401 (verification only)
- URL: https://shahraranews.ir/files/fa/news/1401/3/18/504275_838.pdf (CBI, اداره بررسی‌ها و سیاست‌های اقتصادی, Khordad 1401; raw: `raw/pdf/504275_838.pdf`).
- Table 3 (PDF p.7) gives districts 1–22 and the city average in thousand rials; the city is 363,515, i.e. 36.35M toman. Its text says 55.3% of transactions were units under 80 m².

### CBI_1403_05_PDF: CBI report, Mordad 1403 (the last CBI report)
- URL: https://media.mehrnews.com/d/2025/01/25/0/5346317.pdf (a CBI PDF hosted by Mehr News; raw: `raw/pdf/cbi_mordad1403_mehr.pdf`).
- Summary table (PDF p.3), average price in million rials: Mordad 1402 757.9, Tir 1403 874.6, Mordad 1403 885.0.
- Table 3 (PDF p.7) gives all 22 districts in million rials. These are the 1403/5 district rows.
- Chart 3 (PDF p.4) gives the size distribution of transacted units; see "Typical apartment size" below.

### CBI monthly values from news reports of CBI releases
| id | URL | Month | Quoted figure |
|---|---|---|---|
| DEY_4017134 | https://donya-e-eqtesad.com/fa/tiny/news-4017134 | Shahrivar 1402 | «۷۵میلیون و۳۳۰هزار تومانی … شهریورماه» (the article also gives the SCI figure for the same month, 77.4M) |
| ECO_49814 | https://ecoiran.com/fa/tiny/news-49814 | Mehr 1402 | «76 میلیون و 60 هزار تومان»; same figure in ECO_49111 (https://ecoiran.com/fa/tiny/news-49111) |
| ECO_51263 | https://ecoiran.com/fa/tiny/news-51263 | Aban 1402 | «757.7 میلیون ریال», −0.4% m/m; same in melkradar post 96076 |
| TAADOL_303845 | https://www.taadolnewspaper.ir/fa/news/303845/ | Azar 1402 | «74 میلیون و 88 هزار تومان», −2.2% m/m |
| ALEF_4030112001 | https://www.alef.ir/news/4030112001.html (Tasnim) | Esfand 1402 | «814.4 میلیون ریال»; district 1 1506.8, district 18 432.2 million rials |
| MEHR_6099594 | https://www.mehrnews.com/news/6099594/ | Farvardin 1403 | «۸۱۶.۳ میلیون ریال»; district 1 1504.2, district 18 423.6 million rials |
| MELK_96501 | https://bazarmaskan.melkradar.com (WP post 96501, «گزارش بانک مرکزی از بازار تهران در خرداد ۱۴۰۳»); same in AFTAB_919689 https://aftabnews.ir/fa/news/919689/ | Khordad 1403 | «۸۵۹/۱ میلیون ریال»; district 1 160.9M, district 19 44.5M toman |
| KILID_27795 | https://kilid.com/mag/newsroom/report/27795/ | Mehr 1402 | districts only: district 1 «148 میلیون 960 هزار», district 18 «32 میلیون 280 هزار» toman |
| MELK_95196 | melkradar post 95196 | Azar 1401 | cross-check only: «۴۸ میلیون و ۷۳ هزار تومان» |

### Why the series stops in 1403, and the publication pauses
- MIZAN_4804258: https://www.mizanonline.ir/fa/news/4804258/. CBI's own statement: it published the Tehran report "from Farvardin 1396 to Mordad 1403" from the registry's raw data. Publication stopped after that because the old registry system was replaced and CBI lost access to the data. Melkradar post 96704 (Aban 1403) also says CBI will base future reports on the new system.
- ECO_93643: https://ecoiran.com/fa/tiny/news-93643. At the end of spring 1404, still no CBI data for autumn 1403 – spring 1404.
- ECO_49069 / ECO_49098 (https://ecoiran.com/fa/tiny/news-49098). CBI paused for 10 months after Azar 1401, then in Aban 1402 also posted the missing months. I did not find figures for Dey 1401 – Tir 1402, Dey–Bahman 1402 or Ordibehesht 1403, so those months are empty.

### After CBI: what exists for Shahrivar 1403 – Aban 1405 (low confidence)
- **TITR24_SCI** (https://titr24.com/news/ «قیمت خانه در تهران چقدر شد؟ گزارش مرکز آمار»): Statistical Centre monthly CPI and housing release for Mordad 1404. Quote: «میانگین قیمت هر مترمربع خانه در تهران نیز از ۱۲۰ میلیون تومان در تیرماه به ۱۲۲ میلیون و ۴۶۰ هزار تومان در مردادماه». Another outlet gave Tir 1404 as 119.54M, so I recorded Tir as 120M, rounded as quoted. These are secondary quotes, and the SCI method (registry-based, possibly quality-adjusted) differs from CBI's. I did not find SCI figures for other months.
- **ECO_128139_DEY** (https://ecoiran.com/fa/tiny/news-128139, «مسکن در سالی که گذشت»): **asking prices** from Donya-e-Eqtesad's field monitoring, not transactions. Farvardin 1404 ≈102M ("میان‌متراژ" units), Mehr 105M, Aban 107.8M, Azar ≈108.5M, Dey ≈115M.
  - Note: these are *below* the SCI transaction-based ~120M for Tir 1404. The two use different samples, so do not splice them.
- **IRANECONOMIST_844208_KILID** (https://iraneconomist.com/fa/news/844208/): the Kilid listings site's average **asking** price per m² for Aban 1405, 237.2M toman. Listing data, not official. This is the most recent figure I could find.
- Not used (estimates, not measurements):
  - The Tehran realtors' union head said "about 90M" after the 12-day war in 1404 (TAADOL_360866).
  - Eghtesad Online estimated the end of 1404 at "110–120M" by inflating the Mordad 1403 figure with CPI (https://www.eghtesadonline.com/fa/news/2047577/).
  - An MRUD statement put Mordad 1405 at "+63% y/y, under 200M", with the caveat that its new registry data are not yet statistically reliable (via thefinance.ir; not fetched).
- **Bottom line for 1404–1405:** there is no official transaction-based series. The page should either stop the housing line at Mordad 1403 (88.5M) or show the 1404/1405 points as clearly labelled estimates.

### Rejected
- tribunezamaneh.com/archives/389271 («جدول میانگین قیمت مسکن در تهران از سال ۱۳۵۰ تا ۱۴۰۳»): round-number progression (1350 = 5,000 … 1370 = 100,000) with no per-year source. Its 1370 value of 100k is twice the official 1372 level. Rejected.
- alirezabn.ir («روند تاریخی قیمت مسکن ۱۳۷۵ تا ۱۴۰۳»): a builder's blog with rounded values (for example, 1386 = 1.5M, 1389 = 1.5M) and only a generic source list. Rejected; the SCI and CBI values replace it.
- asriran.com/fa/news/607905: says 1371 = 51–53k, but this is the SCI 1372 range mislabelled. Not used.

---

## Typical apartment size (for the 75 m² / 100 m² benchmark)
- **CBI, Mordad 1403** (CBI_1403_05_PDF, chart 3, PDF p.4): share of transacted Tehran units by floor area.

  | Floor area (m²) | Share |
  |---|---|
  | under 30 | 0.5% |
  | 30–40 | 3.4% |
  | 40–50 | 11.7% |
  | 50–60 | 15.1% (the mode) |
  | 60–70 | 14.2% |
  | 70–80 | 10.8% |
  | 80–90 | 8.6% |
  | 90–100 | 7.1% |
  | 100–110 | 6.8% |
  | 110–120 | 5.1% |
  | 120–130 | 3.9% |
  | 130–140 | 3.0% |
  | 140–150 | 2.5% |
  | 150–160 | 1.5% |
  | 160–170 | 1.4% |
  | 170–180 | 0.9% |
  | 180–190 | 0.9% |
  | 190–200 | 0.4% |
  | over 200 | 2.1% |

  The text says «واحدهای مسکونی با سطح زیربنای کمتر از ۸۰ متر مربع، سهمی معادل ۵۵/۷ درصد». So the **median transacted unit is in the 70–80 m² band**, which supports **75 m²** as a "typical" Tehran apartment. About 72% are under 100 m².
- Other months agree:
  - Ordibehesht 1401: 55.3% under 80 m² (CBI_1401_02_PDF).
  - Mehr 1402: 58% (DEY_4017134).
  - Esfand 1402: 51.9% (melkradar post 96363).
- No source gives this distribution before 1396. The 1385 census table of housing units by floor area (yearbook 1388, table 9.19) is national stock, not Tehran transactions.

## Districts: coverage
- Full 22-district monthly rows: Mehr 1396 – Azar 1401 (CBI_DLEARN, 63 months; Esfand 1397 missing), plus Mordad 1403 (CBI_1403_05_PDF).
- Only the most and least expensive district: Mehr 1402, Esfand 1402, Farvardin 1403 and Khordad 1403.
- **No credible per-district data before 1396 or after Mordad 1403.** CBI's earlier monthly PDFs are on cbi.ir, which blocks automated access. SCI's quarterly Tehran reports (for example https://amar.org.ir/Portals/0/Articles/2019/avmt-2-98.pdf, summer 1398; raw in `raw/pdf/`) do have 22-district tables for 1397–1400, but they overlap the CBI coverage and their text layer is garbled, so I did not transcribe them.
- Caveat from CBI's own footnote: district averages are not quality-adjusted (age, floor, parking, neighbourhood), so month-to-month moves in small districts (for example district 19, with about 35–75 deals a month) are noisy.


---

# Car price sources

(The same content is in car_sources.md. Car rows are in car.csv.)

# Iranian benchmark car prices, 1350–1405: sources

Companion to `car.csv` (columns `jy,model,toman,kind,source_id`). Every value in the CSV comes from a page I downloaded
and read. The raw copies are in `research\housing\raw\car\` (file names in brackets; magiran pages in `raw\car\mg\`,
Ettela'at pages in `raw\car\ett\`, newspaper clipping images in `raw\car\img\`). Unless a row says otherwise, the
source unit is **toman**; rial figures were divided by 10.

- **kind = factory**: the official, approved or dealer list price (قیمت کارخانه / مصوب / نمایندگی / «قیمت فروش شرکت»).
  Before 1357, official Paykan prices were set by the Ministry of Economy or the «مرکز بررسی قیمت‌ها», so every 1351–1356 row is factory.
- **kind = market**: the Tehran free-market / dealer-floor price of a new (zero-km) car, as reported by a newspaper or news agency.
- **jy convention**: the year the price applied. The pre-revolution Paykan price lists were published per **model year**
  (for example, the "1353 prices" were advertised on 18 Bahman 1352, and the "Paykan 54" prices on 4 Farvardin 1354), so the row goes
  under the model year. Each source entry gives the exact date.
- **Model names**: `paykan` (the Deluxe / دولوکس trim for 1351–1356, «پیکان ۱۶۰۰» for 1371, trim not stated for 1382);
  `pride` (1372–1389, the Saba/Nasim era, trim noted per row; the 131 and 111 replaced Saba and Nasim in 1389);
  `pride_131` and `pride_111` (from 1390); `peugeot_206_t2` (206 tip 2 hatchback, the base trim); `saina`, `quick`, `tiba2`
  (Pride successors; see the 1390+ part for the exact trims).

Part A covers 1350-1389 (Paykan, Pride, 206), Part B covers 1390-1405 (Pride, 206, Saina, Quick, Tiba 2), and Part C adds Peugeot 405, Peugeot Pars, Samand, Dena, Dena+, Tara, Shahin and Toyota Camry. **The per-model coverage summary is at the end of Part C.**

## Coverage at a glance (Part A)
| period | what exists | gaps |
|---|---|---|
| 1351–1356 | Paykan Deluxe official price for 1351, 1352, 1353, 1354 and 1356 (Ettela'at reports and adverts, reprinted with dates) | 1350, 1355 |
| 1357–1370 | nothing credible | the whole period (see "Unverified candidates") |
| 1371–1373 | Paykan 1600 official price for 1371; Pride launch prices for 1372 (factory and market) and 1373 (market) | Paykan market for all three years |
| 1374–1381 | nothing credible | the whole period |
| 1382–1389 | Pride market for 1382 and 1384–1389, Pride factory for 1384–1386, 206 tip 2 market for 1382 and 1385–1388, Paykan market for 1382 | 1383 (everything), 1389 (206), Paykan for 1383–1384 (production ended 25 Ordibehesht 1384) |
| 1390–1405 | see the 1390+ part below | see that part |

---

# Part A: 1350–1389

## CAR_EN_1351: Eghtesad News column «نیم قرن با اقتصاد ایران»; Ettela'at, 20 Ordibehesht 1351
- URL: https://www.eghtesadnews.com/fa/tiny/news-411082 [en_411082.html]. Column published 2021-05-10.
- Location: item «20 اردیبهشت 1351؛ علل افزایش قیمت اتومبیل‌های ایرانی». Farrokh Najmabadi, deputy minister of economy, says:
  «در سال 1346 قیمت یک دستگاه اتومبیل پیکان 17890 تومان بوده و اینک یک دستگاه اتومبیل پیکان با مشخصاتی بالاتر از مشخصات پیکان 1346، 23 هزار و 690 تومان است».
- Unit: toman. Kind: factory (official price). Value used: 23,690 for 1351.
- Cross-check: **CAR_EN_1350E**, https://www.eghtesadnews.com/fa/tiny/news-394593 [en_394593.html], item «چهارم اسفند 1350؛ پایین‌ترین و بالاترین قیمت پیکان».
  Ettela'at lists the new prices as «پیکان لوکس با رادیو 23690 تومان», «پیکان کار 20290», «پیکان جوانان 27500», «وانت پیکان 16500»,
  «پیکان تاکسی 17250», and notes «این قیمت‌ها هنوز از طرف مقامات رسمی اعلام نشده است». The 20 Ordibehesht 1351 statement confirms 23,690 as the official price.
- Caveat: the 1350 price before this list is unknown, so 1350 is empty.

## CAR_EN_1352: Eghtesad News column; Ettela'at, 13 Shahrivar 1352
- URL: https://www.eghtesadnews.com/fa/tiny/news-519420 [en_519420.html]. Column published 2022-09-04.
- Location: item «13 شهریور 1352؛ جنگ نفت آغاز شد», sub-item «قیمت پیکان افزایش یافت»:
  «اتومبیل پیکان دولوکس 16 هزار ریال (قیمت قبلی 239 هزار و 900 ریال)», «پیکان کار 15 هزار ریال (قیمت قبلی 202 هزار و 900 ریال)»,
  «جوانان 17 هزار ریال (قیمت قبلی 275 هزار ریال)». The Paykan taxi stayed at 171,900 rial, «همان قیمت چهار سال قبل».
- **Unit: rial.** Value used: 239,900 rial = **23,990 toman**, the Deluxe price in force from the start of 1352 until 13 Shahrivar 1352.
  From 13 Shahrivar the price was 255,900 rial = 25,590 toman.
- Cross-check: Khabar Foori 3188013, https://www.khabarfoori.com/fa/tiny/news-3188013 [kf_3188013.html], published 2026-01-09,
  retells the same Ettela'at report with the same rial figures and adds «نرخ برخی مدل‌های پیکان طی دو سه سال قبل از آن، ثابت مانده بود».
  khodro45 (rejected as a source, below) also gives «در سال ۵۲، قیمت پیکان دولوکس ۲۳ هزار و ۹۹۰ تومان».

## CAR_EO_1353: Iran National advert, Ettela'at, 18 Bahman 1352 (prices for 1353)
- URL: https://www.eghtesadonline.com/fa/news/824110/ [eo_824110.html], published 2024-02-10, title «قیمت مدل‌های مختلف پیکان در سال ۱۳۵۳ + عکس».
- Location: «روز ۱۸ بهمن ماه ۱۳۵۲ ... کارخانجات ایران ناسیونال ... با یک آگهی ضمن انتشار قیمت های ویژه سال ۱۳۵۳ ... قیمت های جدید نسبت به سال گذشته تغییری نکرده است»;
  list «پیکان دولوکس (بدون قفل فرمان) ۲۵ هزار و ۲۹۰ تومان», «پیکان جوانان: ۲۹ هزار و ۲۰۰», «پیکان کار: ۲۱ هزار و ۷۹۰», «پیکان وانت: ۱۸ هزار و ۳۰۰».
- Unit: toman. Kind: factory. Value used: 25,290 for 1353.
- Cross-checks: Khabaronline 1870734, https://www.khabaronline.ir/news/1870734/ [ko_1870734.html], 2024-02-08, cites the same advert («روزنامه اطلاعات ۱۸ بهمن ۱۳۵۲»).
  The 4 Farvardin 1354 clipping (CAR_KO_1354) independently states that the Deluxe was «۲۵۲۹۰ تومان» for model 52.
- Caveat: 25,290 is «بدون قفل فرمان» (without steering lock). This explains the 300-toman difference from the 25,590 of Shahrivar 1352.

## CAR_KO_1354: Ettela'at, 4 Farvardin 1354 (newspaper clipping reproduced by Khabaronline)
- URL: https://www.khabaronline.ir/news/2043240/ [ko_2043240.html], published 2025-03-29, title «نرخ انواع پیکان اعلام شد/ وقتی بهترین خودرو ایرانی ۳۲هزار و ۷۲۰ تومان بود!».
  The page text says «در اولین روز کاری سال ۱۳۵۴ مرکز بررسی قیمت‌ها ... نرخ‌های مصوب جدید اعلام کرد ... روزنامه اطلاعات ۴ فروردین ۱۳۵۴».
- Location: the prices are **only in the clipping images**, which I downloaded and read: `img\ko_1354_b.jpg` (media.khabaronline.ir/d/2025/03/30/4/6205918.jpg).
  Headline «قیمت پیکان ۵۴ تعیین شد». Text: «پیکان دولوکس که قیمت تثبیت شده مدل ۵۲ آن ۲۵۲۹۰ تومان بود با ۳۱۲۰ تومان افزایش ۲۸۴۱۰ تومان شد»;
  Javanan 29,200 → 32,720; Kar 21,790 → 24,560; Vanet 18,300 → 21,040; «قیمت های جدید بدون احتساب ۵ درصد عوارض آسفالت میباشد».
- Unit: toman. Kind: factory. Value used: 28,410 for 1354.
- Caveats: excludes the 5% asphalt levy. On 8 Shahrivar 1354 Iran National cut the price of «برخی مدل‌ها» and refunded the difference
  (Donya-e-Eqtesad 1066481, https://donya-e-eqtesad.com/fa/tiny/news-1066481 [dee_1066481.html], 2016-08-29), but no new figure is given.
  Market context: on 31 Tir 1354 dealers resold new Paykans «5 تا 7 هزار تومان گرانتر» than the factory price (Eghtesad News 660934 [en_660934.html]).
  So the 1354 market price was about 33–35k, but no source states a market level, so no market row.
- Cross-check: Bultannews 290736 (2015) quotes an entrepreneur who says his father paid 28,800 toman for a Paykan in Azar 1354 [bultan_290736.html].
  This is an anecdote and is not used, but it agrees within 1.4%.

## 1355 (no row)
- Eghtesad News 722764 [en_722764.html], item «15 خرداد 1355»: «مرکز بررسی قیمت‌ها اوایل امسال ... قیمت اتومبیل پیکان را تا پنج هزار ریال کاهش داد».
  This gives a cut of up to 500 toman but no level, so I did not compute one.

## CAR_DIDBAN_1356: Ettela'at, 5 Esfand 1355 (prices of the "36" (1356) models)
- URL: https://www.didbaniran.ir/fa/tiny/news-217094 [didban_217094.html], published 2025-02-23, title «قیمت جدید انواع پیکان اعلام شد/دولوکس: ۳۷ هزار و ۹۱۰ تومان»,
  in its «روزنامه گردی دیدبان تاریخ ۵ اسفند ۱۳۵۵» series, which reproduces the front page of Ettela'at of Thursday 5 Esfand 1355.
- Location: list «پیکان کار ۳۳ هزار و ۲۶۰ تومان», «پیکان دولوکس ۳۷ هزار و ۹۱۰ تومان», «پیکان جوانان ۴۳ هزار و ۷۳۰ تومان»,
  «پیکان‌اتوماتیک ۴۱ هزار و ۴۱۰», «پیکان استیشن ۴۲ هزار و ۱۳۰», «وانت پیکان ۳۰ هزار و ۴۶۰», followed by «مدلهای جدید ۳۶ از دوشنبه هفته آینده به بازار عرضه خواهد شد».
- Unit: toman. Kind: factory. Value used: 37,910, filed under **1356** because it is the price of the 1356-model cars sold from late Esfand 1355.
  If the page prefers the announcement date, move it to 1355.
- Caveat: a 33% jump over 1354. I found no 1355 mid-year list to show when the increase happened.

## CAR_EN_1371: Eghtesad News column; Ettela'at, 11 Esfand 1371
- URL: https://www.eghtesadnews.com/fa/tiny/news-479930 [en_479930.html], published 2022-03-02.
- Location: item «11 اسفند 1371؛ قیمت پیکان و پژو کاهش یافت»: «از این پس اتومبیل پیکان 1600 با قیمت 974 هزار تومان در اختیار متقاضیان قرار خواهد گرفت ... از مبلغ مذکور 7 میلیون ریال به عنوان پیش‌پرداخت».
  The same item gives the Peugeot 405 GL at 1,780,000 and the GLX at 2,080,000.
- Unit: toman. Kind: factory (Iran Khodro's sale price after a reduction). Value used: 974,000 for 1371.
- Caveat: this is a late-year (Esfand) price, after a cut. The free-market price was much higher in these years. Ettela'at adverts of
  22 Mordad 1373 and 26 Mehr 1374 sell the Paykan at "market price minus 1,000,000 rial" and "minus 3,000,000 rial" (see "Not usable"),
  but no market level was found for 1371–1381.

## CAR_MOJ_1372: Mojnews, «قیمت پراید از ابتدا تا امروز»
- URL: https://www.mojnews.com/fa/tiny/news-397741 [moj_397741.html], published 2021-09-19 (1400).
- Location: «در سال ۱۳۷۲ که اولین بار خودروی پراید در کشور و توسط شرکت سایپا تولید شد، قیمت آن ۲ میلیون تومان تعیین شد ... با ورود به سال ۱۳۷۳ به مبلغ ۳ میلیون و ۶۰۰ هزار تومان رسید».
- Unit: toman. Kind: factory («تعیین شد»). Value used: 2,000,000 for 1372.
- Confidence: **low-medium.** This is a 2021 retrospective with no cited source.
  Farda-ye Eqtesad 16048 (https://www.fardayeeghtesad.com/news/16048/ [farda_16048.html], 2023-02-23) also says «قیمت پراید توسط سایپا دو میلیون تومان تعیین شده بود»,
  but it dates the launch to 1373. Ettela'at of 10 Azar 1371 (Eghtesad News 458348 [en_458348.html]) says the Pride line starts «از خردادماه سال 1372»
  with about 8,000 cars in 1372, so 1372 is the launch year.

## CAR_DEE_1399R: Donya-e-Eqtesad retrospective, «پراید با چه قیمتی با خط تولید خداحافظی می‌کند؟»
- URL: https://donya-e-eqtesad.com/fa/tiny/news-3649791 [dee_3649791.html], datePublished 2020-05-01 (12 Ordibehesht 1399).
- Location: «پراید ورودی به بازار در سال ۱۳۷۲ قیمتی بین یک میلیون و ۸۷۰ هزار تا ۲ میلیون و ۲۰۰ هزار تومان در بازار فروخته می‌شد. پرایدهای فول صندوقدار ... ۲ میلیون و سیصد هزار تومان»;
  «سال ۱۳۷۳ این خودرو روی ۳ میلیون و ۶۰۰ هزار تومان را دید».
- Unit: toman. Kind: market. Values used: 1372 = 1,870,000 (the bottom of the stated range, i.e. the base car; the range runs to 2.2M, and 2.3M for the fully optioned saloon), 1373 = 3,600,000.
- Confidence: medium. This is a retrospective by a reputable economic daily, but it cites no source. Mojnews repeats the 3.6M figure for 1373.
- Disagreement (rejected): Aftab 577476 (CAR_REJ_AFTAB below) says the Pride entered the market in 1372 at 5 million toman. It contradicts DEE and Mojnews and has the 1380s-level price, so I rejected it for 1372.

## CAR_EN_1382: Eghtesad News column; Donya-e-Eqtesad, 30 Azar 1382
- URL: https://www.eghtesadnews.com/fa/tiny/news-543137 [en_543137.html], published 2022-12-21.
- Location: item «30 آذر 1382؛ خودروهای داخلی ارزان شد»: «پیکان با قیمت 6 میلیون و 100 هزار تومان در بازار خودرو معامله شد»;
  «پراید سفید تولیدشده در سال 82 نیز با قیمت 6 میلیون و 850 هزار تومان و پراید 141 با قیمت 7 میلیون و 500 هزار تومان در بازار تهران مورد معامله قرار گرفت»;
  «پژو 206 تیپ 2 مدل 82 با رنگ یشمی به قیمت 10 میلیون و 600 هزار تومان خریداری شد».
- Unit: toman. Kind: market (Tehran). Values used for 1382: Paykan 6,100,000; Pride (white, 1382 model, base) 6,850,000; 206 tip 2 10,600,000.
- Caveats: this is a late-year report from a week of falling prices; the same item says the Pride fell about 500k «در این مدت». The 206 figure is a single transaction for a specific colour.
- Cross-check: Zoomit 286913 (2019, unsourced) says «درسال ۱۳۸۲، قیمت پیکان انژکتوری پلاک تهران، ۶ میلیون تومان بود», which agrees.

## CAR_EN_1392R: Eghtesad News column; Donya-e-Eqtesad, 2 Shahrivar 1392 (retrospective coin/car table)
- URL: https://www.eghtesadnews.com/fa/tiny/news-516991 [en_516991.html], published 2022-08-24.
- Location: item «دوم شهریور 1392؛ با چند سکه می‌توان پراید خرید»: «در سال 84 ... خودرویی مانند پراید، تنها حدود هفت میلیون تومان قیمت داشته است»;
  «در سال 85 ... قیمت پراید تغییر بسیار اندکی در مقایسه با سال 84 داشت»; «قیمت هر دستگاه پراید در پایان سال 87 تقریبا همان هشت میلیون تومان سال 86 بوده»; «سال 90 ... قیمت پراید به 10 میلیون تومان رسید».
- Unit: toman. Kind: market. Value used: 1384 = 7,000,000 («حدود», so **approximate**). The 1386–1387 figures of about 8M are used only as cross-checks,
  because contemporaneous reports exist for those years and give 7.6–8.4M depending on fuel type.

## CAR_MG_1385: Donya-e-Eqtesad, 11 Aban 1385, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1249727 [mg\art_1249727.html]. Donya-e-Eqtesad issue 1092, Thursday 11 Aban 1385, «بررسی قیمت خودروهای داخلی در فاصله یک سال گذشته».
  The same ISNA text appears in Etemad (magiran 1249229 [mg\art_1249229.html]).
- Location: «پراید با افزایش قیمت حدود 300 هزار تومانی نسبت به سال گذشته ازسوی کارخانه با قیمت هفت میلیون و 130 هزار تومان به فروش می رسد، حال آن که در سال گذشته با قیمت شش میلیون و 800 هزار تومان ازسوی سایپا به فروش می رسید ... این خودرو در بازار شش میلیون و 900 تا هفت میلیون تومان معامله می شود»;
  «پژو 206 هاچ بک نیز با قیمت 10 میلیون و 900 هزار تومان به فروش می رسد»; «پراید هاچ بک نیز با قیمت شش میلیون و 900 هزار تومان معامله می شود».
- Unit: toman. Values used: 1385 Pride factory 7,130,000; 1385 Pride market 6,900,000 (hatchback; the range is 6.9–7.0M);
  1384 Pride factory 6,800,000 («سال گذشته», i.e. about Aban 1384); 1385 206 tip 2 market 10,900,000.
- Caveats: the 206 is described only as «پژو 206 هاچ بک». The tip 2 is the base hatchback, and in Bahman 1386 ISNA prices «پژو 206 هاچ بک و تیپ 2 آن» together, but the trim is not stated here.
  The market was briefly *below* the factory price.
- Cross-check: Ettela'at Online 157512 (2026, retrospective) says «یک پراید ۷.۵ میلیون تومانی» for 1385.

## CAR_MG_1386F: Donya-e-Eqtesad, 28 Bahman 1386, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1575202 [mg\art_1575202.html]. DEE issue 1461, «متقاضیان برای خرید فقط از طریق نمایندگی ها اقدام کنند».
- Location: SAIPA sales director Farzad Neshan: «قیمت پراید در حال حاضر هفت میلیون و 230 هزار تومان است ... قیمت کف بازار در تهران، بالاتر از قیمت کارخانه است».
- Unit: toman. Kind: factory. Value used: 7,230,000 for 1386.

## CAR_MG_1386: Donya-e-Eqtesad, 27 Bahman 1386, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1574269 [mg\art_1574269.html]. DEE issue 1460, «بازار خودرو همچنان داغ است».
- Location: «قیمت پراید بنزین سوز این هفته بدون تغییر قیمت هفت میلیون و 600هزار تومان معامله شد. نوع گاز سوز این خودرو ... هشت میلیون و 600هزار تومان ... مدل هاچ بک این خودرو 5/7 میلیون تومان»;
  «تیپ 2 این خودرو [پژو 206] با افزایش 150 هزار تومانی به 13 میلیون و 350 هزار تومان رسید».
- Unit: toman. Kind: market. Values used for 1386: Pride (petrol saloon) 7,600,000; 206 tip 2 13,350,000.
- Caveat: a late-year (Bahman) report. No mid-1386 report with a visible price was found; Etemad 20 Tir 1386 is paywalled after the first paragraph.
- Cross-check: Resalat 9 Bahman 1386 quoting ISNA (magiran 1563483 [mg\art_1563483.html]): «پژو 206 هاچ بک و تیپ 2 آن حدود 13 میلیون و 200 هزار تومان».

## CAR_MG_1387: Etemad, 2 Azar 1387, quoting Fars (via magiran)
- URL: https://www.magiran.com/article/1749929 [mg\art_1749929.html]. Etemad issue 1826, «رکود در بازار بار دیگر قیمت خودرو را کاهش داد».
- Location: «پراید سفید تک سوز که تا هفته پیش حدود هفت میلیون و 900 هزار تومان معامله می شد، هفته پیش حدود هفت میلیون و 750 هزار تومان خرید و فروش شد، اما پراید 141 همچنان به قیمت فروش شرکت یعنی هفت میلیون و 900 هزار تومان و پراید 132 نیز هفت میلیون و 950 هزار تومان معامله می شود».
- Unit: toman. Kind: market. Value used: 1387 Pride (white, petrol-only) 7,750,000.
- Caveats: the 1387 factory price is given only for the 141 trim (7.9M), so there is no 1387 factory row.
  For mid-year, Donya-e-Eqtesad of 6 Mehr 1387 (magiran 1708755 [mg\art_1708755.html]) gives the dual-fuel Pride at «8 میلیون و 400 هزار تومان در 15 مردادماه» and 8.2M in early Mehr.
  Dual-fuel versions cost about 0.5–0.9M more than petrol-only ones.

## CAR_MG_1387B: Donya-e-Eqtesad, 23 Khordad 1387 (via magiran)
- URL: https://www.magiran.com/article/1637369 [mg\art_1637369.html]. DEE issue 1543, «پژو 206 تیپ 2 گران شد، زانتیا ارزان».
- Location: «206تیپ 2 ... هم اکنون 400هزار تومان نسبت به هفته پیش گران تر شده و قیمتش به 15میلیون تومان رسیده است».
- Unit: toman. Kind: market. Value used: 15,000,000 for 1387.

## CAR_MG_1388: Etemad, 23 Khordad 1388, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1879817 [mg\art_1879817.html]. Etemad issue 1974, «بازار خودرو کمی تکان خورد».
- Location: «رسیدن قیمت پراید به زیر قیمت کارخانه یی خود ... هم اکنون پراید با کمی افزایش قیمت در مدل صبای بنزینی به هفت میلیون و 550 هزار تومان رسیده است، ولی نوع دوگانه سوز آن هشت میلیون و 400 هزار تومان».
- Unit: toman. Kind: market. Value used: 1388 Pride Saba (petrol) 7,550,000.
- Cross-check: Donya-e-Eqtesad of 7 Ordibehesht 1388 (magiran 1845234 [mg\art_1845234.html]) quotes SAIPA's sales manager: «پراید هاچ بک که هم اکنون با قیمت هفت میلیون و 800هزار تومان در بازار عرضه می شود».
  That is a different trim (hatchback), and it is unclear whether it is a list or a market price, so it was not used.

## CAR_MG_1388B: Etemad, 31 Mordad 1388, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1931786 [mg\art_1931786.html]. Etemad, «افزایش قیمت خودرو های وارداتی در بازار».
- Location: «پژو 206 تیپ 2 که چند هفته یی است با افزایش قیمت در بازار مواجه شده، به همان قیمت 14 میلیون و 350 هزار تومان هفته پیش قناعت کرد».
- Unit: toman. Kind: market. Value used: 14,350,000 for 1388.
- Cross-checks: Iran newspaper of 17 Dey 1388 (magiran 2018675): «پژو 206 تیپ 2 به قیمت 138 میلیون و 500 هزار ریال» (13.85M toman, rial in source).
  Donya-e-Eqtesad of 8 Bahman 1388 (magiran 2033102): 13.6M. The 206 was slightly cheaper late in the year.

## CAR_MG_1389: Donya-e-Eqtesad, 3 Shahrivar 1389 (via magiran)
- URL: https://www.magiran.com/article/2141357 [mg\art_2141357.html]. DEE, «خلاقیمتی در بازار خودروی ایران».
- Location: «مشتری ایرانی ... پس از پراید هفت و نیم میلیونی، روآی هشت و نیم میلیونی و MVM چینی 9 میلیونی، تا پژو 405 قدیمی و 13 میلیون و 100 هزار تومانی، دیگر هیچ گزینه ای ... ندارد».
- Unit: toman. Kind: market (a market-structure article, a round figure). Value used: 7,500,000 for 1389. Confidence: medium, because the figure is rounded and no trim is given.
- Cross-check: Farda-ye Eqtesad 16048 (2023 retrospective, unsourced) says that in 1389 «قیمت پراید صبا هفت میلیون و ۷۰۰ هزار تومان بود و پراید نسیم را هشت میلیون و ۸۰۰ هزار تومان می‌فروختند».

## Unverified candidates (left out of car.csv; the caller may decide)
- **Paykan 1360, factory 59,735 toman (Deluxe) / 52,227 (Kar-Lux)**. Source: khodro45 magazine, «قیمت پیکان در ۳۸ سال» (https://khodro45.com/mag/paykan-price/ [khodro45_paykan.html], 2025-11-09).
  It is a dealer blog and cites no source. Its 1352 figure (23,990) checks out against Ettela'at, but its 1346 figure (14,300) contradicts the deputy minister's 17,890 (CAR_EN_1351).
  Its «در سال ۵۷، قیمت پیکان صفر لوکس به ۳۵ هزار تومان رسید» is *below* the official 1356 Deluxe price of 37,910. Its «اواخر دهه ۶۰ ... ۱۳۵ هزار – ۱۵۰ هزار تومان» and
  «یک میلیون و ۴۰۰ هزار تا یک میلیون و ۷۰۰ هزار تومان» (no year) cannot be placed. It is the only source for the 1360s, so if the page needs a 1360 point, use 59,735 labelled "factory, unverified blog".
- **Paykan 1365, about 95,000–110,000 toman**. Source: Ettela'at Online 157512, «دست کارگران دیگر حتی به «خودرو» هم نمی‌رسد!» (https://www.ettelaat.com/news/157512 [ett\ett_157512.html], 2026-07-18).
  The text is «پیکان ... قیمتی حدود ۹۵ تا ۱۱۰ هزار تومان داشته است». It gives a range, cites no source, and does not say factory or market.
  Comparing with the same article's Renault 5 (government price ~70k in 1361 against a free price of 140–150k, rising to ~400k by 1365) suggests it is the official price.
- **Pride 1389, 7,700,000 (Saba)**. Farda-ye Eqtesad 16048 is an unsourced retrospective. The contemporaneous DEE figure (7.5M) is used instead.

## Not usable (no price level), recorded for completeness
- Ettela'at advert, 22 Mordad 1373 (Tabnak 1254173 [tabnak_1254173.html]; image `img\tabnak_1373_ad.png`). Paykan 1600: deposit 14,500,000 rial, and the car is sold «براساس قیمت روز بازار ... حدود ۱/۰۰۰/۰۰۰ ریال کمتر از قیمت روز بازار». It gives no level.
- Ettela'at, 26 Mehr 1374 (Ettela'at Online 117997 [ett\ett_117997.html]; images `img\ett_1374_a.jpg`, `ett_1374_b.jpg`). The Paykan is sold at «۳ میلیون ریال زیر قیمت بازار», with a deposit of 20 million rial. It gives no level.
- Ettela'at, 27 Farvardin 1381 (Eghtesad News 405943 [en_405943.html]). The prices of the Paykan and all Prides are cut by 2.5 million rial. It gives no level.
- SCI «tavakhodro.pdf» (amar.org.ir, 1396–1397) contains only inflation rates.

## Rejected sources (1350–1389)
- **CAR_REJ_AFTAB: Aftab News 577476**, «پرواز پراید در ۲۵ سال» (2019-02-27) [aftab_577476.html]. It says «سال ۷۲ که پای پراید با قیمت ۵ میلیون تومان ... به بازار ... باز شد» and that the price stayed at 5–8 million «از آغاز ورودش ... تا سال ۹۰».
  This contradicts the 1372–1373 figures of DEE and Mojnews (2–3.6M) and is implausible for 1372. Its 1390–1397 narrative (10M at the end of 1390, 17M at the end of 1391, 37M SAIPA / 45M market at the end of 1397) is used only as a cross-check by the 1390+ part.
- **khodro45** (see Unverified candidates). It is an unsourced dealer blog with internal contradictions.
- **bama.ir 18038** (Paykan history): «در آستانه پیروزی انقلاب اسلامی هنوز در حوالی 30 هزار تومان». This is unsourced and below the official 1356 price.
- **Zoomit 286913** (2019, «پیکان؛ نوستالوژی ...»). It is unsourced. It gives «۱۷ هزار تومان» for 1346 (contradicting khodro45's 14,300) and «سال ۱۳۸۴ ... نزدیک به ۷ میلیون تومان» for the Paykan. Used only as a cross-check for 1382.
- **Bultannews 290736** (Azar 1354, 28,800). It is a personal anecdote, used only as a cross-check.
- **Hamshahri Online 650597 and similar «قیمت پیکان کارکرده» pages, hamrah-mechanic, divar, eghtesadnews 813909.** These are today's used-car prices for old model years, not historical prices.
- **Aftab 191817** («پیکان در بدو ورود 100 سکه ...»). It gives coin ratios only, with rounded numbers.

---

# Part B: 1390–1405


All pages below were downloaded with curl and read locally. The raw copies are in
`research\housing\raw\car\` (file name in brackets). Article dates come from the page's `datePublished` /
`article:published_time` metadata, converted to the Solar Hijri calendar, and checked against the date given in the text when there is one.
Unless a row says "rial", the source reports **toman**. "Market" means the Tehran free-market or dealer-floor price
(قیمت بازار / بازار آزاد) for a new (zero-km) car. "Factory" means the official or dealer list price (قیمت کارخانه / نمایندگی / رسمی / مصوب).

## How I chose values and trims
- I used one report per year, preferably from about mid-year (Tir–Shahrivar), and named the month for each year. When no mid-year report was found, I used the closest report and say so.
- **pride_131**: the SE trim when the table lists one (1392–1394). For 1390–1391 the source names only the SL trim, so I used SL. In 1395–1401 the tables list a single "پراید 131" or "سایپا 131", which by then was the SE.
- **pride_111**: SE when listed. Otherwise the single "پراید 111" or "سایپا 111" row.
- **peugeot_206_t2**: the plain tip 2 ("ساده") row.
- **saina**: the base manual model. That is "ساینا" in 1397–1400, "ساینا دنده‌ای EX" in 1401 and "ساینا S (دنده‌ای)" from 1402. **quick**: the base manual model. That is "کوئیک ساده" or "کوییک دنده‌ای" in 1399–1401 and "کوییک S" from 1402. **tiba2**: the Tiba 2 hatchback ("تیبا 2"، "تیبا هاچ بک"), not the Tiba sedan (تیبا صندوقدار).
- **Pride after 1399**: SAIPA stopped Pride 111/131 production in 1399 (DEE 3654556, 1399/02/27, describes the phase-out before Mordad 1399; Hamshahri 537907 headline "قیمت پراید در آستانه خداحافظی"). The 1400 and 1401 Pride rows are **free-market prices for remaining zero-km stock** of a discontinued car, so treat them as a different kind of price, or drop them.
- **206 tip 2 after 1402**: Ecoiran (news-60324, 1403/01/01) states «پژو ۲۰۶ تیپ دو ... در سال ۱۴۰۲ تولید نشد» and «توقف تولید این خودرو از ابتدای ۱۴۰۲». The 1403–1405 tables I read have no 206 tip 2 row, so 1403–1405 is empty by design. The 1402 row is for zero-km stock.
- **Tiba 2 after 1402**: the 1403–1405 SAIPA tables have no Tiba row (Tabnak 1403, Shargh 1404/1405), so 1403–1405 is empty.

---

## CAR_F_ASR_1390: Asr-e Iran, quoting ISNA's weekly price report
- URL: https://www.asriran.com/fa/news/186382 [f_asr_186382.html]
- Article date: 2011-10-22, i.e. 30 Mehr 1390. Title «مروری بر قیمت خودروها در بازار».
- Location: paragraph «اما در خانواده محصولات پژو 206، مدل تیپ 5 ... و تیپ 2 آن نیز قیمت 14 میلیون و900 هزار تومان عرضه ‌شد».
- Unit: toman. Kind: market (ISNA's weekly survey of the prices at which cars are offered at dealers / in the market, which are not factory list prices).
- Cross-checks: Entekhab news 41499 (2011-10-16, 24 Mehr 1390) [f_entekhab_41499.html], table row «پژو 206- تیپ 2 | 15000,000» (an average of market players' figures). Aftab 144688 (Bahman 1390) gives 15.1M. Eghtesadnews «نیم قرن» column 394593 (Donya-e-Eqtesad item of 4 Esfand 1390) gives 16.5M at year end.
- Caveat: the same ISNA report gives the Pride only as «پراید صندوق‌دار ... هشت میلیون و670 هزار تومان» with no trim, so I took the 1390 Pride values from CAR_F_AFTAB_1390.

## CAR_F_AFTAB_1390: Aftab News, quoting ISNA
- URL: https://aftabnews.ir/fa/news/144688/ [f_aftab_144688.html]
- Article date: 2012-02-03, i.e. 14 Bahman 1390. Title «آخرین قیمت خودروهای داخلی».
- Location: body paragraphs «سایپا ۱۳۱ در مدل SL آن به قیمت حدود هشت میلیون و 930 هزار تومان» and «قیمت سایپا ۱۱۱ نیز حدود 9 میلیون و 260 هزار تومان». The same text also gives 206 tip 2 at «حدود 15 میلیون و 100 هزار تومان».
- Unit: toman. Kind: market. The prices are what dealers ask ("عرضه شد" … «قیمت‌های یاد شده نسبی بوده و در نمایندگی‌های فروش مختلف درصدی تفاوت قیمت به چشم می‌خورد»).
- Caveats: the report is from late in the year (Bahman), and Pride 131 is the SL trim. Eghtesadnews column 394593 (4 Esfand 1390) says «پراید مروارید 9 میلیون و 900 هزار تومان … چیزی نمانده قیمت پراید هم دورقمی شود», which agrees. The Tejarat News retrospective (2021-08-23) says «قیمت پراید ۱۱۱ در سال ۹۰ حدود ۹ میلیون تومان», which also agrees.

## CAR_F_ASR_1391: Asr-e Iran, quoting YJC (باشگاه خبرنگاران)
- URL: https://www.asriran.com/fa/news/228805 [f_asr_228805.html]
- Article date: 2012-08-24, i.e. 3 Shahrivar 1391 (the page shows ۰۳-۰۶-۱۳۹۱). Title «پژو ۲۰۷ به ۳۲.۵ میلیون تومان رسید».
- Location: section «سبقت ۲۰۷ از ۲۰۶»: «۲۰۶ تیپ ۲ ... هم اکنون ۲۰ میلیون و ۸۰۰ هزار تومان به فروش می‌رسد».
- Unit: toman. Kind: market ("فعالان بازار").

## CAR_F_AFTAB_1391: Aftab News, quoting ISNA
- URL: https://aftabnews.ir/fa/news/180333/ [f_aftab_180333.html]
- Article date: 2012-12-07, i.e. 17 Azar 1391. Title «جدیدترین قیمت خودروهای پرتیراژ داخلی».
- Location: «سایپا ۱۱۱ به قیمت حدود ۱۳ میلیون و ۴۰۰ هزار تومان عرضه می‌شد. این در حالی است که قیمت رسمی این خودرو ۱۱ میلیون و ۷۸۰ هزار تومان است» and «قیمت سایپا SL ۱۳۱ ... به حدود ۱۱ میلیون و ۷۰۰ هزار تومان ... قیمت رسمی SL ۱۳۱ معادل ۱۱ میلیون و ۵۴۰ هزار تومان».
- Unit: toman. Kind: market, plus factory (قیمت رسمی).
- Caveats: no mid-1391 Pride figure was found, so this report is from Azar, late in the year. Pride 131 is the SL trim. The same text was republished by Asr-e Iran 244856 (same day) [f_asr_244856.html]. Other ISNA weeks give the 111 at 13.0M (Aftab 179302, 7 Azar), 13.3M (Aftab 180592, 20 Azar) and 14.3M (Aftab 184210, 26 Dey 1391), with the factory price unchanged at 11.78M.

## CAR_F_AFTAB_1392: Aftab News price table
- URL: https://aftabnews.ir/fa/news/211201/ [f_aftab_211201.html]
- Article date: 2013-09-21, i.e. 30 Shahrivar 1392. Title «قیمت پژو و پراید در بازار و کارخانه/جدول».
- Location: Table 0 (نام خودرو | قیمت بازار (تومان) | قیمت کارخانه (تومان)), with these rows: «پژو 206 . تیپ 2 | 33,000,000 | ---», «پراید 111 SE | 17,200,000 | ---», «پراید SE 131 | 16,400,000 | ---», «پراید 111 SL | 16,000,000 | 14,776,000», «پراید SL 131 | 15,050,000 | 14,474,000».
- Unit: toman. The table gives both market and factory prices.
- Caveat: the factory price exists only for the **SL** trims, so the factory rows are SL while the market rows are SE. The SL market prices were 15.05M (131) and 16.0M (111).
- Cross-checks: identical tables appear on Entekhab 129849 (same day) [f_entekhab_129849.html] and Asr-e Iran 296831 (31 Shahrivar 1392) [f_asr_296831.html]. Within the year, 206 tip 2 was 36.5M in Tir 1392 (Aftab 201140, 22 Tir) and 37.5M in Azar 1392 (Aftab 220256, 3 Azar). On 11 Esfand 1392 the 206 tip 2 was 37M and the Pride 131 18.1M (Aftab 233742). Donya-e-Eqtesad 3649791 (1399) says Pride "16.8M in 1392", which is consistent.

## CAR_F_AFTAB_1392B: Aftab News price table (206 tip 2 factory price)
- URL: https://aftabnews.ir/fa/news/215578/ [f_aftab_215578.html]
- Article date: 2013-10-22, i.e. 30 Mehr 1392. Table 0, row «پژو 206 . تیپ 2 | 34,100,000 | 29,000,000» (market | factory).
- Unit: toman. Cross-check: Aftab 192852 (10 Ordibehesht 1392) gives «206 تیپ2 (نمایندگی/ تومان) 29,000,000».

## CAR_F_AFTAB_1393: Aftab News price table
- URL: https://aftabnews.ir/fa/news/263003/ [f_aftab_263003.html]
- Article date: 2014-09-23, i.e. 1 Mehr 1393. Title «قیمت خودرو های داخلی+جدول».
- Location: Table 0 (خودرو | قیمت بازار (تومان) | قیمت کارخانه (تومان)), with these rows: «سایپا SE 131 ( رنگ سفید ) | 19,100,000 | 19,720,000», «سایپا 111 SE | 20,200,000 | 19,940,000», «پژو 206 . تیپ 2 | 35,600,000 | ---», «تیبا 2 - هاچ بک SX | 26,700,000 | 26,900,000».
- Unit: toman. The table gives both market and factory prices. The 206 tip 2 factory cell is empty.
- Cross-check: Aftab 264117 (8 Mehr 1393) [f_aftab_264117.html] gives 131 SE 19.4M, 111 SE 20.2M and 206 tip 2 35.5M.

## CAR_F_AFTAB_1394: Aftab News, quoting Mehr News Agency's field survey
- URL: https://aftabnews.ir/fa/news/304542/ [f_aftab_304542.html]
- Article date: 2015-06-25, i.e. 4 Tir 1394. Title «قیمت خودرو کارکرده شکسته شد/ جزئیات قیمت انواع خودرو».
- Location: «بررسی های میدانی مهر نشانگر این است که قیمت هر دستگاه پراید ۱۱۱ معادل ۲۱ میلیون و ۵۰ هزار تومان، پراید ۱۳۱ معادل ۲۰ میلیون تومان ... تیبا هاچ بک نیز ۲۷ میلیون و ۶۰۰ هزار تومان» and «پژو 206 تیپ 2 در بازار 32 میلیون و 450 هزار تومان».
- Unit: toman. Kind: market. No trim is given for the Pride rows.
- Cross-checks: Aftab 315859 (5 Shahrivar 1394, also Mehr) gives 111 20.0M, 131 19.6M, 206 tip 2 32.4M and Tiba hatchback 26M+. CAR_F_AFTAB_1394B gives 131 SE 20.1M, 111 SE 21.0M and Tiba 2 27.2M.

## CAR_F_AFTAB_1394B: Aftab News price table (in rial)
- URL: https://aftabnews.ir/fa/news/309649/ [f_aftab_309649.html]
- Article date: 2015-07-23, i.e. 1 Mordad 1394.
- Location: Table 0 (نام کارخانه | نام خودرو | قیمت نمایندگی (ریال) | قیمت بازار(ریال)), with these rows: «سایپا | ۱۳۱ -SE | ۱۹۹,۲۰۰,۰۰۰ | ۲۰۱,۰۰۰,۰۰۰», «۱۱۱-SE | ۲۰۱,۴۰۰,۰۰۰ | ۲۱۰,۰۰۰,۰۰۰», «تیبا ۲ (هاچ بک) | ۲۷۱,۷۰۰,۰۰۰ | ۲۷۲,۰۰۰,۰۰۰».
- **Unit: rial.** I divided by 10. The factory (dealer list) prices in toman are 19,920,000, 20,140,000 and 27,170,000. The table has no 206 tip 2 row. The same table appears on Aftab 306565, Aftab 309916 and Asr-e Iran 407756.

## CAR_F_AFTAB_1395: Aftab News, quoting ISNA's weekly table
- URL: https://aftabnews.ir/fa/news/383808/ [f_aftab_383808.html]
- Article date: 2016-07-24, i.e. 3 Mordad 1395. Title «تفاوت قیمت خودرو از کارخانه تا بازار +جدول».
- Location: Table 0 (خودرو | قیمت کارخانه | قیمت بازار), with these rows: «پراید SE111 | 20میلیون و 900 هزار | 21 میلیون و 100هزار», «پراید 131 | 20 میلیون و 670 هزار | 20 میلیون و 600هزار», «پژو 206تیپ 2 | 32میلیون و 660 هزار | 33 میلیون و 100 هزار».
- Unit: toman.
- Cross-check: Hamshahri Online 344839 (9 Shahrivar 1395, ISNA) [f_hamshahri_344839.html] gives 131 factory 20.67M / market 20.9M and 206 tip 2 factory 32.66M / market 34.5M. Aftab 365220 (14 Ordibehesht 1395) gives 131 at 20.0M and 206 tip 2 at 32.8M.

## CAR_F_AFTAB_1396: Aftab News, quoting ISNA's weekly table
- URL: https://aftabnews.ir/fa/news/470206/ [f_aftab_470206.html]
- Article date: 2017-08-22, i.e. 31 Mordad 1396. Title «جدیدترین قیمت خودروهای داخلی».
- Location: Table 0 (خودرو | قیمت کارخانه‌ای | قیمت بازار), with these rows: «پراید SE111 | 21 میلیون و 250 هزار | 21 میلیون و 900 هزار», «پراید 131 | 21 میلیون و 300 هزار | 21 میلیون», «پژو 206 تیپ 2 | 32 میلیون و 804 هزار | 34 میلیون و 200 هزار».
- Unit: toman. Cross-check: Donya-e-Eqtesad 3649791 (1399/02/12) says «پراید در سال ۹۶ با رسیدن به قیمت ۲۱ میلیون و ۷۰۰ هزار تومان».

## CAR_F_AFTAB_1397: Aftab News, quoting Fars News Agency
- URL: https://aftabnews.ir/fa/news/545174/ [f_aftab_545174.html]
- Article date: 2018-09-12, i.e. 21 Shahrivar 1397. Title «ادامه ثبات نسبی قیمت خودرو در بازار+ جدول قیمت». The page ends with «منبع: خبرگزاری فارس».
- Location: Table 0 (نوع خودرو | قیمت کارخارنه | قیمت بازار (ریال)), with these rows: «پراید ۱۱۱ | ۲۲۴.۹۲۰.۰۰۰ | ۳۸۰.۰۰۰.۰۰۰», «۲۰۶ تیپ ۲ | ۳۶۲.۸۶۹.۰۰۰ | ۶۰۵.۰۰۰.۰۰۰», «پراید ۱۳۱ | ۲۲۷.۰۹۰.۰۰۰ | ۳۵۰.۰۰۰.۰۰۰».
- **Unit: rial.** I divided by 10. The factory column header has a typo, «(قیمت)», but it is clearly rial too: 224.92M rial is 22.49M toman, which matches the ~21–24M toman factory level. The Aftab 577476 retrospective says «اوایل سال ۹۷، قیمت پراید در کارخانه ۲۱ الی ۲۴ میلیون تومان».
- Cross-check: CAR_F_AFTAB_1397D (21 Dey 1397) gives 131 35.0M, 111 37.7M and 206 tip 2 60.0M. 1397 was the year of the currency shock, so prices moved a lot within the year.

## CAR_F_AFTAB_1397D: Aftab News table, quoting Iran Jeep
- URL: https://aftabnews.ir/fa/news/567997/ [f_aftab_567997.html]
- Article date: 2019-01-11, i.e. 21 Dey 1397. The table compares «قیمت ۱۷ دی | قیمت امروز». Below it: «منبع جدول سایت ایران جیب است».
- Location: row «ساینا (رینگ آلومینومی) | ۴۷/۵۰۰/۰۰۰ | ۴۷/۵۰۰/۰۰۰».
- Unit: toman. Kind: market. Caveats: Saina was launched during 1397, so this is the earliest 1397 figure I have. The source is a dealer website quoted by Aftab. This table has no Tiba 2 or Quick row (only «تیبا صندوقدار» at 40.5M).

## CAR_F_TN_1398: Tejarat News
- URL: https://tejaratnews.com/قیمت-خودرو-های-پرفروش-در-۱۲-شهریور [f_tn_12shahrivar.html]
- Article date: 2019-09-03, i.e. 12 Shahrivar 1398. Title «قیمت خودرو‌های پرفروش در 12 شهریور».
- Location: «پژو 206 تیپ 2 (ساده)، 77 میلیون و 500 هزار تومان با کاهش 200 هزار تومانی» and «سایپا 111، 47 میلیون و 500 هزار تومان، سایپا 131، 42 میلیون و 600 هزار تومان ... در بازار آزاد خودرو».
- Unit: toman. Kind: market.
- Disagreement: according to the search-engine summary, another report gives the 206 tip 2 at 79.4M on the same days. I did not read that page, so the figure is unverified and I did not use it.

## CAR_F_AFTAB_1398A: Aftab News free-market table
- URL: https://aftabnews.ir/fa/news/627340/ [f_aftab_627340.html]
- Article date: 2019-12-18. The text says «امروز (۲۷ آذر ۹۸)».
- Location: Table 0 (مدل خودرو | قیمت (تومان)), with these rows: «ساینا | ۶۴,۲۰۰,۰۰۰», «تیبا 2 | ۶۳,۸۰۰,۰۰۰», «سایپا 111 | ۵۴,۰۰۰,۰۰۰», «سایپا 131 | ۵۰,۰۰۰,۰۰۰», «پژو 206 تیپ2 (ساده) | ۸۹,۰۰۰,۰۰۰».
- Unit: toman. Kind: market (بازار آزاد).
- Caveats: this is late 1398 (Azar). I used it only for Saina and Tiba 2 because no mid-1398 value was found for them. The Pride and 206 figures here are cross-checks and are higher than in Shahrivar. Aftab 623688 (6 Azar 1398) gives Tiba 2 ≈63M and 206 tip 2 86.2M. Aftab 628486 (4 Dey 1398) gives Saina 65.0M and Tiba 2 64.7M.

## CAR_F_AFTAB_1399: Aftab News weekly market report
- URL: https://aftabnews.ir/fa/news/664661/ [f_aftab_664661.html]
- Article date: 2020-08-03, i.e. 13 Mordad 1399. Title «پراید در بازار راکد خودرو 93 میلیون تومان قیمت خورد».
- Location: «پراید 111 از 89 در هفته‌های گذشته به 93 میلیون تومان ... پراید 131 نیز از 78.5 به 81 میلیون تومان رسیده‌اند», «تیبا 2 از 102 به 107.5 میلیون تومان، ساینا از 103 به 108 میلیون تومان», «کوئیک ساده 123 میلیون تومان و کوئیک R (دو رنگ) 127 میلیون تومان تعیین قیمت‌ شده‌اند» and «پژو 206 تیپ 2 از 151 به 163 میلیون تومان».
- Unit: toman. Kind: market. The source is not named beyond Aftab. The Quick wording, «تعیین قیمت‌ شده‌اند», is ambiguous because the Quick was newly launched. It sits inside a market report, and Aftab 668576 (5 Shahrivar 1399) gives a market price of 126M, so it is treated as market but with low confidence.
- **Disagreement**: Hamshahri Online 537907 (2020-08-06, 16 Mordad 1399, quoting Donya-e-Eqtesad) [f_hamshahri_537907.html] gives **Pride 131 at 89.5M** (Aftab: 81M), 111 at 93M (same), Saina at 108M (same) and **206 tip 2 at 170M** (Aftab: 163M). Hamshahri 538754 (19 Mordad 1399) [f_hamshahri_538754.html] gives 111 93.5M and **131 81M**, which supports Aftab. I prefer Aftab because its 131 figure is backed by a second report three days later. Note that DEE's 131 figure may be a different trim.
- Later in 1399: Aftab 668576 (5 Shahrivar 1399) gives 111 95M, 131 83M, Tiba 2 111M, Saina 112M, Quick 126M and 206 tip 2 167M.

## CAR_F_TABNAK_1400: Tabnak, quoting YJC
- URL: https://www.tabnak.ir/fa/news/1071056 [f_tabnak_1071056.html]
- Article date: 2021-08-20, i.e. 29 Mordad 1400. The text says «به گزارش باشگاه خبرنگاران جوان، بر اساس معاملات انجام شده امروز (۲۹ مرداد ۱۴۰۰)».
- Location: Table 0 (مدل خودرو | قیمت (تومان)), with these rows: «پژو 206تیپ 2 (ساده) | 220.000.000», «پژو 206 تیپ 2 (ساده) 1400 | 232.000.000», «سایپا 111 | 145.000.000», «سایپا 131 | 132.000.000», «ساینا | 141.000.000», «ساینا 1400 | 147.000.000», «تیبا 2(رینگ فولادی ) | 143.000.000», «تیبا 2(رینگ فولادی ) 1400 | 151.000.000», «کوییک دنده ای | 158.000.000», «کوییک دنده ای 1400 | 168.000.000».
- Unit: toman. Kind: market.
- **Choice:** I recorded the **current model-year (1400)** zero-km price where the table gives two rows. The earlier-model zero-km prices were 206 tip 2 220M, Saina 141M, Tiba 2 143M and Quick 158M. The Pride rows have only one value, which is old stock of a discontinued car (see the note at the top).
- Cross-check: the Tejarat News retrospective (2021-08-23) says «پراید ۱۱۱ ... در نیمه مرداد ماه ۱۴۰۰ با قیمت ۱۴۷ میلیون تومان معامله می‌شود» and «پژو ۲۰۶ تیپ دو ... در مرداد ماه ۱۴۰۰ ... ۲۴۵ میلیون». Its 245M for the 206 tip 2 is higher than Tabnak's 220–232M, and it does not give its source.

## CAR_F_MEHR_1401: Mehr News Agency
- URL: https://www.mehrnews.com/news/5587750 [f_mehr_5587750.html]
- Article date: 2022-09-12, i.e. 21 Shahrivar 1401. Title «قیمت خودروی تولید داخل؛ ۲۱ شهریور ۱۴۰۱».
- Location: Table 0 (نوع خودرو | قیمت بازار (تومان)), with these rows: «پژو 206 تیپ 2 | 298,000,000», «پراید 111 | 205,000,000», «پراید 131 | 186,000,000», «تیبا 2 | 206,000,000», «ساینا دنده‌ای EX | 206,000,000», «کوییک دنده‌ای | 197,000,000».
- Unit: toman. Kind: market.
- Cross-checks: Aftab 790082 (5 Shahrivar 1401) gives 206 tip 2 297M, 111 204M, 131 184M, Tiba 2 208M, Saina EX 202M and Quick 195M. Aftab 792179 (13 Shahrivar 1401) gives 296, 203, 183, 207, 202 and 199M. The three reports agree to within about 2%. The Pride rows are old stock (see the note at the top).

## CAR_F_MEHR_1402: Mehr News Agency
- URL: https://www.mehrnews.com/news/5869033 [f_mehr_5869033.html]
- Article date: 2023-08-24, i.e. 2 Shahrivar 1402. Title «آخرین قیمت خودرو در بازار/ ریزش قیمت خودرو ادامه دارد+ جدول».
- Location: Table 0 (خودرو | 2 شهریور ماه | 26 مرداد ماه), with these rows: «پژو 206 تیپ 2 | 475 میلیون تومان», «ساینا S دنده‌ای | 345 میلیون تومان», «تیبا هاچ بک | 325 میلیون تومان», «کوییک دنده‌ای S | 350 میلیون تومان». Quick R was 335M.
- Unit: toman. Kind: market.
- **Disagreement**: Aftab 861445 (22 Shahrivar 1402) (see CAR_F_AFTAB_1402) has a market column of «پژو 206 تیپ 2 | 5.160.000.000 ریال» (= **516M toman**), «ساینا اس» 350M, «کوییک دنده ای» 334M and «تیبا 2 پلاس» 310M. The 206 tip 2 figures differ by about 9% within three weeks, while the Saina and Quick figures agree. Ecoiran (news-60324) puts the 206 tip 2 at about 460M in the first week of autumn 1402. I prefer Mehr: it is a named news agency, and Ecoiran's figure is closer to it.

## CAR_F_AFTAB_1402: Aftab News table (factory prices)
- URL: https://aftabnews.ir/fa/news/861445/ [f_aftab_861445.html]
- Article date: 2023-09-14. The text says «بیست و دوم شهریور ۱۴۰۲».
- Location: Table 0 (… | قیمت (ریال) بازار | قیمت کارخانه(ریال)), with these rows: «پژو 206 تیپ 2 | 5.160.000.000 | 2.140.810.000», «ساینا اس | 3.500.000.000 | 2.040.800.000», «کوییک دنده ای | 3.340.000.000 | 1.930.500.000». «کوییک دنده ای R» has a factory price of 2.500.100.000.
- **Unit: rial.** I divided by 10. Caveat: the factory row for Quick is the plain "کوییک دنده ای", while the 1402 market row (Mehr) is Quick S. They are similar base manual trims, but not the same label.

## CAR_F_TABNAK_1403: Tabnak daily table
- URL: https://www.tabnak.ir/fa/news/1260881 [f_tabnak_1260881.html]
- Article date: 2024-09-21, i.e. 31 Shahrivar 1403. Title «قیمت خودرو در بازار امروز 31 شهریورماه».
- Location: Table 0, SAIPA block (نام خودرو | قیمت بازار (تومان) | قیمت کارخانه (تومان)), with these rows: «ساینا S | ۴۱۱,۵۰۰,۰۰۰ | ۳۴۵,۷۶۴,۰۰۰», «کوییک S | ۴۱۴,۰۰۰,۰۰۰ | ۲۹۸,۸۸۴,۰۰۰».
- Unit: toman. The table has no Tiba or 206 tip 2 rows.
- Cross-checks: Tabnak 1255568 (3 Shahrivar 1403) gives Saina S 412.5M and Quick S 409M, with the same factory prices. Tabnak 1271107 (21 Aban 1403) gives Saina S 437M and Quick S 427M.

## CAR_F_SHARGH_1404: Shargh Daily, SAIPA daily table
- URL: https://www.sharghdaily.com/fa/tiny/news-1052879 [f_shargh_1052879.html]
- Article date: 2025-09-22, i.e. 31 Shahrivar 1404. Title «قیمت خودروهای سایپا امروز دوشنبه 31 شهریور اعلام شد + جدول».
- Location: Table 0 (خودرو | قیمت بازار (تومان) | قیمت نمایندگی (تومان)), with these rows: «ساینا S | 573,000,000 | 468,994,000», «کوییک S | 543,000,000 | 466,891,000». The text says «قیمت متوسط بازار آزاد و قیمت نمایندگی ... به تومان».
- Unit: toman.
- Cross-checks: Shargh 1046444 (10 Shahrivar 1404) gives Saina S 580M and Quick S 538M, with the same dealer prices. Eghtesad Online 2087352 («قیمت جدید کارخانه ساینا اعلام شد + جدول شهریور 1404», 2025-09-19) gives the factory price «ساینا S دنده‌ای بنزینی | 1404 | صفر | 468,994,000», which matches. Aftab 984023 (3 Ordibehesht 1404) gives Saina S (1404 model) 515M and Quick manual 510M.

## CAR_F_SHARGH_1405: Shargh Daily, SAIPA daily table
- URL: https://www.sharghdaily.com/fa/tiny/news-1128944 [f_shargh_1128944.html]
- Article date: 2026-09-19, i.e. 28 Shahrivar 1405. Title «قیمت خودرو سایپا امروز شنبه 28 شهریور 1405 / قیمت کوییک چند؟ + جدول».
- Location: Table 0 (خودرو | قیمت بازار (تومان) | قیمت نمایندگی (تومان)), with these rows: «ساینا S | 1,440,000,000 | 992,900,000», «کوییک S | 1,415,000,000 | 1,032,500,000».
- Unit: toman.
- Caveats: 1405 is a partial year, and prices were rising fast during the year. That fits the wartime context visible on the news sites in 1405. Within-year points: Shargh 1109924 (25 Khordad 1405) gives Saina S 1,274M (dealer 722.854M) and Quick S 1,253M (dealer 732.78M). Etemad Online 797654 (9 Aban 1405) [f_etemad_797654.html] gives Saina S 1,752M (factory 992.9M) and Quick S 1,720M (factory 1,032.5M). The factory prices in Etemad match Shargh. I chose Shahrivar to match the other years' mid-year convention. If the page wants the latest value, use Etemad's 9 Aban 1405 figures.

---

## Rejected or used only as cross-checks
- **Tejarat News retrospectives**: «قیمت کدام خودرو در یک دهه ۲۱ برابر شد؟» (2021-08-23) [f_tn_dahe90.html] and «میزان افزایش قیمت خودروهای پرطرفدار در یک سال گذشته» (2022-01-24) [f_tn_yekSal.html]. They use rounded figures ("حدود ۹ میلیون", "۱۵ میلیون") and cite no source table. I used them only as cross-checks. The second page has a visible typo: «دی ۱۴۴».
- **Donya-e-Eqtesad 3649791** (2020-05-01, «پراید با چه قیمتی با خط تولید خداحافظی می‌کند؟») gives the Pride as "10.4M in 1391, 16.8M in 1392, 21.7M in 1396, ~75M now". These are retrospective and give no month. Its 1392 and 1396 figures agree with the contemporaneous tables, but its 1391 figure of 10.4M is below the ISNA Azar 1391 figures (11.7–13.4M); it probably refers to early 1391. Cross-check only.
- **Eghtesad Online pages** whose header shows a 1405 date but whose content is from another year, for example news/729957 and news/728021 ("16 مرداد" / "28 تیر" with 349M Saina S). The year could not be confirmed, so I did not use them.
- **hamrah-mechanic.com / bama.ir model-year pages** (e.g. "پراید ۱۳۱ مدل ۱۳۹۳" at 530–575M). These are today's used-car prices for old model years, not historical prices.
- **SCI (amar.org.ir) "tavakhodro.pdf"** (1396–1397 car inflation). It contains only index and inflation rates, no price levels.
- **Aftab 1050153 and 1050458** (Khordad 1405) and **Aftab 535006** (Tir 1397, Tiba). The price tables are images or not in the HTML, so no values could be extracted.
- **YJC 4050683** (Mordad 1391). The download contained no article text.

## Gaps
- **pride_131 and pride_111**: no factory price for 1390 or for 1398–1399. Values for 1400–1401 exist but are prices of old stock after production ended. There is no Pride row in the 1402 tables.
- **peugeot_206_t2**: no factory price for 1390, 1391, 1393, 1394, 1398–1401. No values for 1403–1405 (production stopped at the start of 1402).
- **tiba2**: nothing for 1390–1392 (the 1392 tables list only the Tiba sedan) or for 1395–1397 (not found). Nothing for 1403–1405 (no longer listed). Factory prices exist only for 1393–1394.
- **saina**: market prices for 1397–1405. Factory prices only for 1402–1405.
- **quick**: market prices for 1399–1405, none for 1398. Factory prices only for 1402–1405.

---

# Part C: additional models (scope expansion)

These rows were added under the same rules. Most values come from the full price tables already downloaded for Parts A and B,
so several source IDs below point to the same page as a `CAR_F_*` entry, now read for other rows. Column order was checked against each
table's header row. Rial tables are marked and divided by 10.

## Model names and trims
- `peugeot_405`: GLX (petrol) where the source separates trims. 1396 is **SLX** (the only 405 row in that table). 1382, 1385, 1395 and 1398 give no trim («پژو 405»). Production ended after 1401 (no 405 row in the 1402+ tables).
- `peugeot_pars`: the base Pars («پژو پارس معمولی» in the 1380s, «پژو پارس سال» from 1390–1396, «پژو پارس»/«پارس ساده» from 1397). For 1402 it is «پژو پارس XU7P» (market) / «XU7» (factory). For 1403 it is «پژو پارس», marked «توقف تولید» by Tabnak, so it is old stock. «پارس نوآ» (1405, Pars Khodro) is a different car and is not used.
- `samand`: Samand LX petrol where stated (1385, 1388–1390, 1392–1394, 1397–1401). 1382 and 1386 give no trim («سمند مشکی», «سمند بنزین سوز»). 1402 is **«سمند LX EF7»** (EF7 engine). Nothing after 1402.
- `dena`: the base Dena («دنا», «دنا تیپ ۱», «دنا معمولی (رینگ فولادی)»). Nothing after 1402, when the 1403+ tables list only Dena+.
- `dena_plus`: the base manual Dena+: «دناپلاس» (1399, 1402), «دنا پلاس ساده» (1401), «دنا پلاس (6 سرعته)» (1403) and «دنا پلاس MT6 (رینگ فولادی)» (1404–1405). Turbo rows are not used.
- `tara`: Tara manual («تارا دنده‌ای», «تارا دستی V1»). Launched 1401.
- `shahin`: Shahin G (manual): «شاهین G» (1401), «شاهین» (1402), «شاهین G (سانروف)» (1403–1405). Launched about 1399–1400, and no 1399–1400 row was found.
- `toyota_camry`: the imported reference, a new car of the current model year (GLX / 2014 / 2015). Only 1390–1394 are covered. Imports were then banned (1397 onward), so later "Camry" prices are for old stock and are not comparable.

## Additional rows taken from Part A sources
- **CAR_EN_1371** (Ettela'at, 11 Esfand 1371): «پژو 405 جی‌ال ... یک میلیون و 780 هزار تومان», «جی‌ال‌ایکس ... دو میلیون و 80 هزار تومان». This gives `peugeot_405` 1371 factory = 2,080,000 (GLX).
- **CAR_EN_1382** (DEE, 30 Azar 1382): «پژو 405 مشکی مدل 1382، 11 میلیون و 300 هزار تومان، خودرو سمند مشکی با قیمت 11 میلیون و 250 هزار تومان». This gives `peugeot_405` and `samand` 1382 market. The colour is specified, there is no trim, and the report is late-year.
- **CAR_MG_1385** (DEE, 11 Aban 1385): «ریو و سمند LX و پروت نیز به ترتیب با 11 میلیون و 75، 13 میلیون و 500 و 13 میلیون و 950 هزار تومان». This gives `samand` (LX) 1385 = 13,500,000. The same text has «پژو 405 ... همچنان 12 میلیون تومان», which is a cross-check for CAR_MG_1385B.
- **CAR_MG_1386** (DEE, 27 Bahman 1386, ISNA): «قیمت پژو 405 بنزین سوز به 13 میلیون و 100 هزار تومان رسید», «سمند بنزین سوز ... این هفته ... تا 13 میلیون تومان», «پژو پارس معمولی 17 تا 17 میلیون و 100 هزار تومان». Used: 405 13.1M, Samand 13.0M (no trim), Pars 17.0M (the bottom of a 100k range).

## CAR_MG_1385B: Donya-e-Eqtesad, 2 Azar 1385 (via magiran)
- URL: https://www.magiran.com/article/1272050 [mg\art_1272050.html]. «افزایش 500هزار تومانی قیمت پژو روا».
- Quote: «کارشناس بازار خودرو قیمت پژو 405 را حدود 12میلیون و 100هزار تومان اعلام کرده اند». The same page says Samand «معمولی» is 11.5M (this is the base trim, not LX, so it is not used).
- Unit: toman. Kind: market. This gives `peugeot_405` 1385 = 12,100,000.
- Cross-checks: DEE 16 Azar 1385 (magiran 1284923) gives 12.1M. DEE 30 Azar 1385 (magiran 1299769) gives «حدود 12میلیون تومان».

## CAR_MG_1387C: Donya-e-Eqtesad, 28 Shahrivar 1387 (via magiran)
- URL: https://www.magiran.com/article/1702958 [mg\art_1702958.html]. «تندر 90 E1 بخریم یا 405؟».
- Quote: «پژو405 هم 14میلیون تومان قیمت دارد». Unit: toman. Kind: market. This gives `peugeot_405` 1387 = 14,000,000.
- Cross-check: Jam-e Jam 28 Dey 1387 (magiran 1787469) recalls 405 «به 14 میلیون و500 هزار تومان رسید» earlier in 1387.

## CAR_MG_1387D: Donya-e-Eqtesad, 7 Dey 1387 (via magiran)
- URL: https://www.magiran.com/article/1774413 [mg\art_1774413.html]. «پیش فروش SLX آغاز شد».
- Quote: «هم اکنون پژو 405 GLX با قیمت 13 میلیون و 150 هزار تومان در نمایندگی های ایران خودرو به فروش می رسد». Unit: toman. Kind: factory (dealer price). This gives `peugeot_405` 1387 factory = 13,150,000.

## CAR_MG_1387E: Donya-e-Eqtesad, 24 Mehr 1387 (via magiran)
- URL: https://www.magiran.com/article/1721790 [mg\art_1721790.html]. «پژو پارس معمولی بخرم یا ELX؟».
- Quote: «پژو پارس ELX که هم اکنون قیمتی معادل 24میلیون تومان دارد در مقایسه با پژو پارس معمولی که 18میلیون و 700هزار تومان است». Unit: toman. Kind: market (a buyer's guide quoting current prices). This gives `peugeot_pars` 1387 = 18,700,000.
- Note: DEE 11 Azar 1387 (magiran 1757971) reports that the Pars معمولی fell about 1M in the following month.
- Samand 1387 was left empty. The only 1387 figures found are for the dual-fuel LX (16.5M, DEE 16 Mehr 1387, magiran 1715149) and the EF7 LX (~16.45M, DEE 23 Tir 1387, magiran 1657837). Both are different trims from the petrol LX used in other years.

## CAR_MG_1388C: Jam-e Jam, 30 Aban 1388, quoting ISNA (via magiran)
- URL: https://www.magiran.com/article/1989331 [mg\art_1989331.html]. «رکود پاییزی بازار خودرو قیمت ها را کاهش نداد».
- Quotes: «قیمت مدل بنزین سوز این خودرو [پژو 405] ... به 13 میلیون و 100 هزار تومان رسید»; «پژو پارس دوگانه سوز ... 18 میلیون و 200 هزار تومان ... مدل بنزین سوز آن نیز 17 میلیون و 200 هزار تومان»; «سمند ال ایکس بنزین سوز 15 میلیون تومان».
- Unit: toman. Kind: market. Values for 1388: 405 13.1M, Pars 17.2M and Samand LX 15.0M (all petrol).
- Cross-checks: Jam-e Jam 12 Dey 1388 (magiran 2014608) gives 405 petrol 13.5M and Pars petrol 17.2M. Etemad 8 Esfand 1388 (magiran 2048974) gives 405 petrol 13.2M and Pars petrol 17.1M. DEE 8 Bahman 1388 (magiran 2033102) gives 405 13.25M.

## CAR_G_AFTAB_1389: Aftab News, quoting ISNA, 21 Azar 1389
- URL: https://aftabnews.ir/fa/news/116168/ [f_aftab_116168.html]. Published 2010-12-12, «قیمت خودروهای داخلی در بازار».
- Quotes: «پژو405 تک سوز 13 میلیون و 600 هزار تومان»; «پژو پارس بنزینی 16 میلیون و 800 هزار تومان»; «سمند ال.ایکس بنزینی در بازار 14 میلیون و 600 هزار تومان».
- Unit: toman. Kind: market. Caveat: a late-year report (Azar 1389, the week the subsidy reform started).

## CAR_G_ASR_1390: Asr-e Iran, quoting ISNA, 30 Mehr 1390
- URL: https://www.asriran.com/fa/news/186382 [f_asr_186382.html] (the same page as CAR_F_ASR_1390).
- Quotes: «پژو 405 به قیمت حدود 13 ميليون و800 هزار تومان عرضه شد»; «قيمت پژو پارس سال حدود 18 ميليون». Unit: toman. Kind: market.

## CAR_G_ENTEKHAB_1390: Entekhab, 24 Mehr 1390, 52-car market list
- URL: Entekhab news 41499 [f_entekhab_41499.html] (the Part B cross-check page). Table rows «سمند LX | 15,100,000», «تویوتا کمری GLX | 59, 900, 000», «هیوندای سوناتا 2012 | 66, 500, 000».
- Unit: toman. Kind: market. This gives `samand` (LX) 1390 and `toyota_camry` (GLX) 1390.
- Cross-check: Asr-e Iran 186382 gives Samand petrol «حدود 15 میليون».

## CAR_G_AFTAB_1391: Aftab News, quoting ISNA, 17 Azar 1391
- URL: https://aftabnews.ir/fa/news/180333/ [f_aftab_180333.html] (the page of CAR_F_AFTAB_1391).
- Quotes: «پژو ۴۰۵ نیز به قیمت حدود ۱۹ میلیون تومان به فروش می‌رسید. البته قیمت مصوب این خودرو ۱۵ میلیون و ۵۸۰ هزار تومان»; «قیمت پژو پارس سال ... به حدود ۲۳ میلیون و ۳۰۰ هزار تومان رسید. البته قیمت رسمی این خودرو حدود ۲۳ میلیون تومان».
- Unit: toman. 405 market 19.0M / factory (مصوب) 15.58M; Pars Saal market 23.3M / factory ~23.0M («حدود»).
- Caveat: a late-year report. Other ISNA weeks give the 405 at 19.9M (Aftab 179302, 7 Azar) and 20M (Aftab 184210, 26 Dey 1391), and the Pars at 25.6M and 27.5M. No mid-1391 report was found, and Samand LX 1391 is empty (only EF7 is quoted).

## CAR_G_AFTAB_1392M: Aftab News market table, 23 Mordad 1392
- URL: https://aftabnews.ir/fa/news/205620/ [f_aftab_205620.html]. Published 2013-08-14, «قیمت انواع خودرو داخلی (جدول)». Single column «قیمت بازار ( تومان )».
- Rows: «سمند LX | 26,900,000», «پژو GLX 405 | 26,600,000», «پژو پارس سال | 33,200,000». Unit: toman. Kind: market.
- Cross-checks: Aftab 211201 (30 Shahrivar 1392) gives 405 GLX Euro4 26.85M and Pars Saal 33.2M. Aftab 233742 (11 Esfand 1392, unlabelled rial list) gives 405 petrol 27.8M, Pars Saal 35.3M and Samand LX 27.5M.

## CAR_G_AFTAB_1392F: Aftab News table, 22 Tir 1392 (factory column)
- URL: https://aftabnews.ir/fa/news/201140/ [f_aftab_201140.html]. Published 2013-07-13. Header «قیمت کارخانه | قیمت بازار ( تومان ) | نام خودرو».
- Rows: «23.000.000 | 26.500.000 | LX سمند», «25.180.000 | 26.500.000 | GLX 405 پژو», «29.970.000 | 34.800.000 | پژو پارس سال». Unit: toman. Values used: the factory column only.

## CAR_G_AFTAB_1392E: Aftab News, quoting IRIB News network, 11 Esfand 1392
- URL: https://aftabnews.ir/fa/news/233742/ [f_aftab_233742.html]. A list «قیمت انواع خودرو، یکشنبه 11 اسفند ماه 1392 در بازار», with row «کمری 2014 ۱۴۱۰۰۰۰۰۰۰».
- **Unit: rial, though the list does not say so.** The same list has «پژو 206 تیپ2 ۳۷۰۰۰۰۰۰۰» while the article text says «پژو ۲۰۶ تیپ ۲، ۳۷ میلیون تومان», so the list is in rial. This gives `toyota_camry` 1392 = 141,000,000 toman (market). Caveat: a late-year report.

## CAR_G_AFTAB_1393: Aftab News table, 1 Mehr 1393
- URL: https://aftabnews.ir/fa/news/263003/ [f_aftab_263003.html] (the page of CAR_F_AFTAB_1393). Columns: market | factory.
- Rows: «سمند LX - دو ایربگ | 29,000,000 | 29,448,000», «پژو GLX 405 | 27,500,000 | 26,707,000», «پژو پارس سال | 34,400,000 | 32,328,000». Unit: toman.
- Caveat: the Samand LX row is the two-airbag version. The one-airbag version is 28.5M market and has no factory price.

## CAR_G_AFTAB_1393B: Aftab News, 8 Mehr 1393
- URL: https://aftabnews.ir/fa/news/264117/ [f_aftab_264117.html]. Table 1 «قیمت انواع خودرو لوکس در بازار», row «کمری | GLX | 155,000,000». Unit: toman. Kind: market.

## CAR_G_AFTAB_1394: Aftab News, quoting Mehr, 5 Shahrivar 1394
- URL: https://aftabnews.ir/fa/news/315859/ [f_aftab_315859.html]. Quote: «قیمت هر دستگاه خودرو پژو ۴۰۵ جی‌ال‌ایکس در بازار آزاد ۲۸ میلیون و ۳۰۰ هزار تومان ... پژو پارس سال ۳۴ میلیون و ۸۰۰ هزار تومان».
- Unit: toman. Kind: market. This gives `peugeot_405` 1394 = 28.3M. The Pars value of 34.8M is a cross-check for CAR_G_AFTAB_1394B (36.8M a month earlier).

## CAR_G_AFTAB_1394B: Aftab News table, 1 Mordad 1394 (rial)
- URL: https://aftabnews.ir/fa/news/309649/ [f_aftab_309649.html] (the page of CAR_F_AFTAB_1394B). Header «نام کارخانه | نام خودرو | قیمت نمایندگی (ریال) | قیمت بازار(ریال)».
- Rows: «پژو پارس سال | ۳۵۳,۲۷۰,۰۰۰ | ۳۶۸,۰۰۰,۰۰۰», «سمند ال ایکس بنزینی | ۲۹۸,۴۳۰,۰۰۰ | ۳۰۲,۰۰۰,۰۰۰», «تویوتا | کمری ۲۰۱۵ | --- | ۱,۸۲۰,۰۰۰,۰۰۰».
- **Unit: rial**, divided by 10. Pars Saal 35.327M factory / 36.8M market, Samand LX 29.843M / 30.2M, Camry 2015 182M market.
- Not used: the 405 rows in this table are SLX and «دوگانه سوز», while GLX is taken from CAR_G_AFTAB_1394.

## CAR_G_AFTAB_1395: Aftab News, ISNA table, 3 Mordad 1395
- URL: https://aftabnews.ir/fa/news/383808/ [f_aftab_383808.html] (the page of CAR_F_AFTAB_1395). Columns: factory | market.
- Rows: «پژو ۴۰۵ | ۳۰میلیون و۸۶۰ هزار تومان | ۲۹ میلیون و ۹۰۰ هزار تومان», «پژو پارس سال | ۳۵ میلیون و ۳۲۷ هزار | ۳۵ میلیون و ۸۰۰ هزار», «دنا | ۴۲میلیون و ۵۴۰ هزار | ۴۳ میلیون و ۴۰۰ هزار».
- Unit: toman. Samand LX 1395 is empty because the table has only Samand EF7.
- Cross-check: Hamshahri 344839 (9 Shahrivar 1395) gives 405 30.2M, Pars Saal 36.3–36.4M and Dena 44.4M, with the same factory prices.

## CAR_G_AFTAB_1396: Aftab News, ISNA table, 31 Mordad 1396
- URL: https://aftabnews.ir/fa/news/470206/ [f_aftab_470206.html] (the page of CAR_F_AFTAB_1396). Columns: factory | market.
- Rows: «پژو ۴۰۵ SLX | ۳۱ میلیون و ۳۸۱ هزار | ۳۱ میلیون و ۲۰۰ هزار», «پژو پارس سال | ۳۶ میلیون و ۳۷۱ هزار | ۳۷ میلیون», «دنا | ۴۲ میلیون و ۶۸۰ هزار | ۴۴ میلیون و ۵۰۰ هزار».
- Unit: toman. Caveat: the 405 is **SLX**, the only 405 row here, and is typically 1–2M above GLX. Samand LX is empty because only EF7 is listed.

## CAR_G_AFTAB_1397: Aftab News, quoting Fars, 21 Shahrivar 1397 (rial)
- URL: https://aftabnews.ir/fa/news/545174/ [f_aftab_545174.html] (the page of CAR_F_AFTAB_1397). Columns: factory | market, both in rial.
- Rows: «پژو GLX405 | ۳۲۹.۴۴۶.۰۰۰ | ۵۰۰.۰۰۰.۰۰۰», «سمند LX | ۳۳۵.۳۵۴.۰۰۰ | ۵۲۵.۰۰۰.۰۰۰», «پژو پارس | ۴۰۵.۹۵۰.۰۰۰ | ۷۰۰.۰۰۰.۰۰۰», «دنا | ۴۶۹.۸۹۴.۰۰۰ | ۸۱۰.۰۰۰.۰۰۰».
- **Unit: rial**, divided by 10. This is the 1397 currency-shock year, when the market price ran 50–75% above the factory price.
- Cross-check: Aftab 553762 (7 Aban 1397) gives Pars 66M, Samand LX 52.5M and Dena 74.5M.

## CAR_G_TN_1398: Tejarat News, 12 Shahrivar 1398
- URL: the page of CAR_F_TN_1398 [f_tn_12shahrivar.html]. Quotes: «پژو ۴۰۵، ۷۱ میلیون و ۵۰۰ هزار تومان»; «سمند ال‌ایکس ... ۷۴ میلیون و ۵۰۰ هزار تومان»; «پژو پارس، ۹۲ میلیون و ۵۰۰ هزار تومان». Unit: toman. Kind: market. The 405 trim is not stated.

## CAR_G_AFTAB_1398: Aftab News free-market table, 27 Azar 1398
- URL: the page of CAR_F_AFTAB_1398A [f_aftab_627340.html]. Row «دنا (تیپ1) | ۱۲۲,۰۰۰,۰۰۰». Unit: toman. Kind: market. Used only for Dena, because Tejarat had no Dena row. Caveat: a late-year report.
- The same table has «سمند LX | ۸۳,۵۰۰,۰۰۰», «پژو 405 GLX | ۷۸,۱۰۰,۰۰۰» and «پژو پارس | ۱۰۲,۵۰۰,۰۰۰», which are cross-checks about 10% above the Shahrivar Tejarat figures.

## CAR_G_AFTAB_1399: Aftab News weekly market report, 13 Mordad 1399
- URL: the page of CAR_F_AFTAB_1399 [f_aftab_664661.html]. Quotes: «پژو ۴۰۵ GLX از ۱۳۰ به ۱۳۹ میلیون تومان، سمند LX از ۱۳۶ ... به ۱۴۳ میلیون تومان، پژو پارس ۱۷۳ میلیون تومان»; «دنا ۲۱۲ میلیون تومان و دناپلاس نیز ۲۶۰ میلیون تومان».
- Unit: toman. Kind: market. Cross-check: Hamshahri 538754 (19 Mordad 1399) gives Samand LX 144M and 405 GLX 143M.

## CAR_G_TABNAK_1400: Tabnak, quoting YJC, 29 Mordad 1400
- URL: the page of CAR_F_TABNAK_1400 [f_tabnak_1071056.html]. Rows: «سمند LX (ساده) 1400 | 231.000.000», «پژو 405 GLX | 222.000.000», «پژو پارس (ساده) 1400 | 255.000.000», «دنا معمولی (رینگ فولادی)1400 | 312.000.000».
- Unit: toman. Kind: market. As in Part B, the 1400 model-year row is used where two rows exist. The earlier-model rows are Samand 217M, Pars 240M and Dena 302M. The 405 has only one row.
- Dena+ 1400 is empty because the only Dena+ row is the turbo («دنا پلاس دنده ای توربو» 412M).

## CAR_G_MEHR_1401: Mehr, 21 Shahrivar 1401
- URL: the page of CAR_F_MEHR_1401 [f_mehr_5587750.html]. Rows: «سمند LX | ۳۰۸,۰۰۰,۰۰۰», «دنا (تیپ ۱) | ۴۰۲,۰۰۰,۰۰۰», «دنا پلاس ساده | ۴۲۹,۰۰۰,۰۰۰», «پژو GLX ۴۰۵ | ۲۹۵,۰۰۰,۰۰۰», «پژو پارس | ۳۰۷,۰۰۰,۰۰۰», «تارا دنده‌ای | ۴۴۰,۰۰۰,۰۰۰», «شاهین G | ۳۶۰,۰۰۰,۰۰۰».
- Unit: toman. Kind: market.

## CAR_G_MEHR_1402: Mehr, 2 Shahrivar 1402
- URL: the page of CAR_F_MEHR_1402 [f_mehr_5869033.html]. Columns «۲ شهریور ماه | ۲۶ مرداد ماه», of which the 2 Shahrivar column is used.
  Rows: «سمند LX EF۷ | ۵۶۰ میلیون تومان», «پژو پارس xuvp | ۴۹۰ میلیون تومان», «دنا معمولی | ۵۷۵ میلیون تومان», «تارا دنده‌ای | ۶۸۰ میلیون تومان», «شاهین | ۵۷۰ میلیون تومان».
- Unit: toman. Kind: market. Caveat: the Samand is the EF7 LX, a different engine from the earlier XU7 LX.
- Disagreements: Aftab 861445 (22 Shahrivar 1402) gives market Pars XU7 498M, Tara manual 648M and Shahin 565M, all within 5%.

## CAR_G_AFTAB_1402: Aftab News table, 22 Shahrivar 1402 (rial)
- URL: the page of CAR_F_AFTAB_1402 [f_aftab_861445.html]. Header «… | قیمت (ریال) بازار | قیمت کارخانه(ریال)».
- Rows: «دناپلاس | ۶.۲۵۰.۰۰۰.۰۰۰ | ۳.۲۴۰.۶۰۰.۰۰۰», «پژو پارس XU۷ | ۴.۹۸۰.۰۰۰.۰۰۰ | ۲.۳۷۰.۴۰۰.۰۰۰», «تارا دستی | ۶.۴۸۰.۰۰۰.۰۰۰ | ۳.۹۱۳.۰۰۰.۰۰۰», «شاهین | ۵.۶۵۰.۰۰۰.۰۰۰ | ۴.۱۳۸.۰۰۰.۰۰۰».
- **Unit: rial**, divided by 10. Used: the factory column for Pars, Tara, Shahin and Dena+, and the market column for Dena+ only (625M), because Mehr lists only the Dena+ turbo.

## CAR_G_TABNAK_1403: Tabnak daily table, 31 Shahrivar 1403
- URL: the page of CAR_F_TABNAK_1403 [f_tabnak_1260881.html]. Columns: market | factory.
- Rows: «دنا پلاس (6 سرعته) | ۷۹۲,۰۰۰,۰۰۰ | ۵۶۱,۴۶۵,۰۰۰», «پژو پارس | ۶۶۹,۰۰۰,۰۰۰ | توقف تولید», «تارا دستی V1 | ۷۶۹,۰۰۰,۰۰۰ | ۵۸۶,۹۳۲,۰۰۰», «شاهین G (سانروف) | ۷۱۴,۵۰۰,۰۰۰ | ۴۴۰,۲۶۶,۰۰۰».
- Unit: toman. Caveat: the Pars is marked «توقف تولید», so the price is for remaining stock and there is no factory price.

## CAR_G_SHARGH_1404: Shargh Daily, Iran Khodro daily table, 31 Shahrivar 1404
- URL: https://www.sharghdaily.com/fa/tiny/news-1052872 [g_shargh_1052872.html]. Title «قیمت خودروهای ایران خودرو امروز دوشنبه ۳۱ شهریور اعلام شد + جدول». Header «خودرو | قیمت بازار (تومان) | قیمت نمایندگی (تومان)».
- Rows: «دنا پلاس MT6 (رینگ فولادی) | 1,025,000,000 | 912,149,000», «تارا دستی V1 | 1,020,000,000 | 886,412,000».
- Unit: toman. It is the same day as the SAIPA table CAR_F_SHARGH_1404. There is no Pars, Samand or 405 row.

## CAR_G_SHARGH_1405: Shargh Daily, Iran Khodro daily table, 28 Shahrivar 1405
- URL: https://www.sharghdaily.com/fa/tiny/news-1128943 [g_shargh_1128943.html]. Title «قیمت خودرو ایران خودرو امروز شنبه ۲۸ شهریور ۱۴۰۵/ قیمت دنا چند ؟+ جدول». Header «خودرو | قیمت بازار (تومان) | قیمت نمایندگی (تومان)».
- Rows: «دنا پلاس MT6 (رینگ فولادی) | 2,405,000,000 | 2,082,000,000», «تارا دستی V1 | 2,260,000,000 | 2,063,000,000».
- Unit: toman. It is the same day as CAR_F_SHARGH_1405.
- Cross-check: Etemad 9 Aban 1405 [f_etemad_797654.html] gives Dena+ MT6 (steel) 3,080M (factory 2,082.6M) and Tara V1 3,100M (factory 2,063.7M), so the market rose about 30% in six weeks.

## Shahin 1404–1405 (CAR_F_SHARGH_1404 / CAR_F_SHARGH_1405, the SAIPA tables of Part B)
- 31 Shahrivar 1404 [f_shargh_1052879.html]: «شاهین G (سانروف) | 999,000,000 | 671,749,000». 28 Shahrivar 1405 [f_shargh_1128944.html]: «شاهین G (سانروف) | 2,325,000,000 | 1,452,161,000». Columns: market | dealer, in toman.

## Dropped or partly dropped
- **Hyundai Sonata** was dropped as a series. The values found are not comparable across years: «سوناتا 2012» 66.5M (Entekhab, Mehr 1390); «سوناتا» market 150M / dealer 130M (Aftab 192852, Ordibehesht 1392); «سوناتا ۲۰۱۵» market 170.5M / dealer 179.43M (Aftab 309649, Mordad 1394, rial); then only the «سوناتا ۲۰۱۸ هیبرید +GLS» at 855M (Aftab 627340, Azar 1398) and 1,600M (Tabnak 1071056, Mordad 1400). The powertrain and model year change, and imports were banned from 1397. Camry is kept as the import reference instead, for 1390–1394 only.
- **Toyota Camry after 1394**: no 1395–1396 value was found, and from 1397 imports were banned, so later prices are for aging used/old stock and are not usable.
- **Paykan 1357–1384 and Pride 1374–1383**: I searched again (Eghtesad News «نیم قرن» columns for 1366/1376/1377, Ettela'at Online's own search, magiran, which starts in about 1385, and web searches for Paykan 1378–1380 and Pride 1380–1383). Nothing new and credible was found. The Ettela'at adverts of 1373 and 1374 give only "market minus X" terms. Those years stay empty.

## Per-model coverage summary
| model | market years (source_ids) | factory years (source_ids) | empty / notes |
|---|---|---|---|
| paykan | 1382 (CAR_EN_1382) | 1351 (CAR_EN_1351), 1352 (CAR_EN_1352), 1353 (CAR_EO_1353), 1354 (CAR_KO_1354), 1356 (CAR_DIDBAN_1356), 1371 (CAR_EN_1371) | 1350, 1355, 1357–1370, 1372–1381, 1383–1384 (production ended Ordibehesht 1384) |
| pride (Saba/Nasim era) | 1372, 1373 (CAR_DEE_1399R); 1382 (CAR_EN_1382); 1384 (CAR_EN_1392R); 1385 (CAR_MG_1385); 1386 (CAR_MG_1386); 1387 (CAR_MG_1387); 1388 (CAR_MG_1388); 1389 (CAR_MG_1389) | 1372 (CAR_MOJ_1372); 1384, 1385 (CAR_MG_1385); 1386 (CAR_MG_1386F) | 1374–1381, 1383 |
| pride_131 / pride_111 | 1390–1401 (CAR_F_*) | 1391–1397 (CAR_F_*) | 1400–1401 are prices of old stock after production ended |
| peugeot_206_t2 | 1382, 1385–1388, 1390–1402 | 1392, 1395–1397, 1402 | 1383–1384, 1389, 1403–1405 (production ended at the start of 1402) |
| peugeot_405 | 1382 (CAR_EN_1382), 1385 (CAR_MG_1385B), 1386 (CAR_MG_1386), 1387 (CAR_MG_1387C), 1388 (CAR_MG_1388C), 1389 (CAR_G_AFTAB_1389), 1390 (CAR_G_ASR_1390), 1391 (CAR_G_AFTAB_1391), 1392 (CAR_G_AFTAB_1392M), 1393 (CAR_G_AFTAB_1393), 1394 (CAR_G_AFTAB_1394), 1395 (CAR_G_AFTAB_1395), 1396 (CAR_G_AFTAB_1396, SLX), 1397 (CAR_G_AFTAB_1397), 1398 (CAR_G_TN_1398), 1399 (CAR_G_AFTAB_1399), 1400 (CAR_G_TABNAK_1400), 1401 (CAR_G_MEHR_1401) | 1371 (CAR_EN_1371), 1387 (CAR_MG_1387D), 1391, 1392 (CAR_G_AFTAB_1392F), 1393, 1395, 1396, 1397 | 1372–1381, 1383–1384; no factory price for 1394 or 1398+; ended after 1401 |
| peugeot_pars | 1386 (CAR_MG_1386), 1387 (CAR_MG_1387E), 1388 (CAR_MG_1388C), 1389 (CAR_G_AFTAB_1389), 1390 (CAR_G_ASR_1390), 1391–1403 (CAR_G_*) | 1391, 1392 (CAR_G_AFTAB_1392F), 1393–1397, 1402 (CAR_G_AFTAB_1402) | before 1386 (launched about 1380), 1404–1405; 1403 is old stock |
| samand | 1382 (CAR_EN_1382, no trim), 1385 (CAR_MG_1385), 1386 (CAR_MG_1386, no trim), 1388 (CAR_MG_1388C), 1389 (CAR_G_AFTAB_1389), 1390 (CAR_G_ENTEKHAB_1390), 1392–1394, 1397–1402 (CAR_G_*) | 1392 (CAR_G_AFTAB_1392F), 1393, 1394, 1397 | 1383–1384, 1387, 1391, 1395–1396, 1403–1405; 1402 is the EF7 LX |
| dena | 1395–1402 (CAR_G_*) | 1395–1397 | launched about 1394; base Dena not listed after 1402 |
| dena_plus | 1399, 1401–1405 (CAR_G_*) | 1402–1405 | 1400 (only the turbo is listed) |
| tara | 1401–1405 (CAR_G_*) | 1402–1405 | launched 1401 |
| shahin | 1401–1405 (CAR_G_MEHR_1401, CAR_G_MEHR_1402, CAR_G_TABNAK_1403, CAR_F_SHARGH_1404, CAR_F_SHARGH_1405) | 1402–1405 | 1399–1400 not found |
| saina, quick, tiba2 | see Part B | see Part B | see Part B |
| toyota_camry | 1390 (CAR_G_ENTEKHAB_1390), 1392 (CAR_G_AFTAB_1392E), 1393 (CAR_G_AFTAB_1393B), 1394 (CAR_G_AFTAB_1394B) | none | 1391, 1395+ (import ban from 1397) |
