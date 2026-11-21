# Iran macro series 1350–1405: sources

Compiled 1 Azar 1405 (2026-11-22). The three series are covered in turn:

- **Part A:** CPI (`cpi_annual.csv`, `cpi_monthly.csv`, `cpi_crosscheck.csv`).
- **Part B:** minimum wage (`min_wage.csv`).
- **Part C:** one-year deposit rate (`deposit_rate.csv`).

Raw downloads are in `raw/`. Treat them as untrusted data.

**Access note.** cbi.ir sits behind an F5 bot challenge that blocks automated fetching from this machine. I did not try to get around it, and I did not use web-archive copies of cbi.ir. So every CBI number here comes from official CBI letters to the Judiciary. Those letters were published as scans, by the Judiciary (dotic.ir) and by the legal news site ekhtebar.ir.

---

# Part A — Consumer price index

## A.1 What the files contain

### cpi_annual.csv
- **Index:** urban CPI (شاخص کل بهای کالاها و خدمات مصرفی در مناطق شهری), 1400 = 100. Each value is the average of that year's 12 months.
- **Coverage:** 1350–1404.
- **`annual_inflation_pct` up to 1380:** CBI's published annual rate, to one decimal. CBI computed these "from the full (unrounded) numbers".
- **`annual_inflation_pct` from 1381:** the change in the SCI index, rounded to one decimal. It equals SCI's published urban rate.
- **1405:** no annual row, because the year is not over.

### cpi_monthly.csv
- **Index:** the same urban CPI, 1400 = 100, chained onto one base.
- **Coverage:** Farvardin 1369 to Mehr 1405, 439 months, with no gaps.
- **Latest month:** Mehr 1405 is the most recent SCI release (file dated 1405/08/13). Aban 1405 had not been published as of 1 Azar 1405.

### cpi_crosscheck.csv
- **Columns, side by side:**
  - CBI's published rate.
  - CBI's annual "dower" index (1395 = 100), as published.
  - The inflation implied by that index.
  - SCI urban and SCI national rates.
  - World Bank FP.CPI.TOTL.ZG for the Gregorian year that starts during the Solar year (g = jy + 621).
  - The value I chose.

### Why urban and not national?
- The national (کل کشور) index exists only from 1390. Urban is the only CPI that runs without a break from 1350 to 1405.
- SCI's headline figure today is the national one. It is in `cpi_crosscheck.csv` (`sci_national_infl_pct`, 1391–1404) and in raw file S2 if a national series is wanted for 1390+.
- National and urban annual rates differed by −0.3 to +1.0 pp in 1401–1404.

## A.2 Sources

### C1 — CBI annual and monthly CPI tables from the governor's letter to the Judiciary (1395 letter covering up to 1394)
- **What it is:** two CBI tables, published by ekhtebar.ir.
- **Page:** https://www.ekhtebar.ir/اعداد-شاخص-سالانه-جهت-محاسبه-میزان-مهر/
- **Annual table:** image `.../wp-content/uploads/2016/04/306-شاخص-تورم-سالانه-1394.png`
  - Title: «شاخص کل بهای کالاها و خدمات مصرفی در مناطق شهری ایران (شاخص تورم) – اعداد سالانه شاخص و نرخ تورم در سالهای ۱۳۹۴–۱۳۱۵ (۱۰۰=۱۳۹۰)».
  - Index to 2 decimals, inflation % to 1 decimal.
  - Footnote: «نرخ تورم بر اساس اعداد کامل محاسبه شده است».
- **Monthly table:** image `.../2016/04/307-شاخص-تورم-ماهانه-1394.png`
  - Monthly urban CPI, Farvardin 1369 to Esfand 1394, 1390 = 100, one decimal, with the annual average and the inflation rate.
- **What I used:**
  - Annual rates 1348–1394.
  - The 1380 annual index, 23.38.
  - Monthly values 1369-01 to 1381-12.
- **Checks on my transcription:**
  - Every monthly value for 1369–1381 matched C3 (the same data rebased to 1395 = 100) after multiplying by 0.40221.
  - Each year's 12-month mean matched the published annual average to within rounding.
  - Annual rates from 1369 on matched the ratios of the C2 dower index to within ±0.25 pp. That limit comes from the dower index's three-decimal rounding.

### C2 — CBI governor's letter 99/2560 of 1399/01/10 (A. Hemmati), forwarded by the Judiciary
- **Forwarding letter:** 9000/2847/100, dated 1399/01/16.
- **PDF:** https://media.dotic.ir/uploads/org/158611657006631500.pdf (4 scanned pages).
- **Page 3:** monthly urban CPI 1369–1398, 1395 = 100, one decimal, plus the annual average and the inflation rate (نرخ تورم).
- **Page 4:** annual "dower" index 1315–1398, 1395 = 100, three decimals.
- **What I used:**
  - Rates 1395–1398: 9.0, 9.6, 31.2, 41.2.
  - The dower index, for cross-checks only.
- **Wikipedia:** the template `Template:Inflation/IR/dataset` cites this PDF. Its values for 1315–1398 match page 4 (I checked them against the scan).

### C3 — CBI governor's letter 02/10899 of 1402/01/22 (M. R. Farzin)
- **Page:** https://www.ekhtebar.ir/اعداد-شاخص-سالانه-و-ماهانه-جهت-محاسبه-3/
- **Annual table:** image `.../2023/04/shakhes.jpg`, annual 1315–1401, 1395 = 100, three decimals.
  - 1399 = 298.858
  - 1400 = 437.042
  - 1401 = 640.225
- **Monthly table:** image `.../2023/04/shakhes-2.jpg`, monthly 1369–1401, 1395 = 100.
- **What I used:** to verify C1, and the CBI 1399–1401 cross-check values.

### C4 — Judiciary letter 9000/2082/100 of 1401/03/17 forwarding the CBI tables up to 1400
- **Page:** https://www.ekhtebar.ir/اعداد-شاخص-سالانه-و-ماهانه-جهت-محاسبه-2/
- **Image:** `.../2022/06/photo_2022-06-18_13-28-11.jpg`
- **Content:** annual 1315–1400, 1395 = 100. It is the same as C3 for the years they share, including 1400 = 437.042.

### S1 — SCI, urban households CPI time series, 1400 = 100
- **File:** https://amar.org.ir/Portals/0/Statistics/ts_urban_140507-14050813162957.xlsx (listed on https://amar.org.ir/prices).
- **Tables used:**
  - جدول 11: annual, 1315–1404.
  - جدول 12: monthly, 1361-01 to 1405-07.
  - These equal جدول 5 and جدول 1 over 1381+ (I checked: ratio 1.000000).
- **What I used:** every value from 1381-01 on, monthly and annual.
- **Caveat:** SCI's own urban survey starts in 1381 (metadata sheet: «از ابتدای سال 1381 بصورت ماهانه»). Values before 1381 in this file are a back-series, and it is damaged:
  - The monthly values are whole numbers on a base close to Esfand 1380 = 100. This makes 1361–1370 a step function.
  - The annual values give nonsense rates: 1350 = 0.0%, 1356 = 33.7%, 1357 = 1.5%, 1363 = 27.0%, 1364 = 2.1%.
  - **Not used before 1381.**

### S2 — SCI, all households (national) CPI, 1400 = 100
- **File:** https://amar.org.ir/Portals/0/Statistics/ts_national_140507-14050813162616.xlsx
- **Tables:** جدول 1 (monthly 1390-01 to 1405-07) and جدول 5 (annual 1390–1404).
- **Use:** cross-check only.

### S3 — SCI, older-base urban/rural/national CPI, 1395 = 100
- **File:** https://amar.org.ir/Portals/0/Statistics/ts_cpi_1395=100-14040208113537.xlsx
- **Tables:** 3 and 4 (long urban), 7 and 8 (national).
- **Use:** cross-check only.
- **What it shows:**
  - The annual back-series equals S1 × 3.50160 for every year (constant).
  - The monthly values for 1400–1401 differ by up to 3.5%. SCI revised the months of 1400–1401 when it moved to base 1400.

### S4 — SCI monthly report «شاخص قیمت مصرف کننده – مهر ماه 1405 (100=1400)»
- **File:** https://amar.org.ir/Portals/0/Articles/shg0507.pdf
- **Figures:** national CPI 761.8; month-on-month +4.4%; point-to-point 88.7%; 12-month 76.8%.
- **Check:** these match S2 for 1405-07 (761.787).

### WB1 — World Bank WDI, FP.CPI.TOTL and FP.CPI.TOTL.ZG for Iran
- **Query:** https://api.worldbank.org/v2/country/IRN/indicator/FP.CPI.TOTL.ZG?format=json&per_page=200 (last updated 2026-11-11).
- **Calendar:** Gregorian years. This is a sanity check only, never a value source.

### N1 — Aftab News, «مرکز آمار تعطیل شد؟ چرا نرخ تورم اعلام نمی‌شود؟», 2023-04-30 (1402/02/10)
- **URL:** https://aftabnews.ir/fa/news/837151
- **Content:** SCI had published no CPI for two months. Its last release was in Esfand 1401. CBI was meanwhile acting as the source.

### N2 — Ecoiran, «سکوت بانک مرکزی شکست؛ تورم به کف رسید؟», 2024-12-29
- **URL:** https://ecoiran.com/fa/tiny/news-79973
- **Content:**
  - CBI had not officially published inflation from 1401 on.
  - In Dey 1403 it republished its series from 1399 to Azar 1403, on a new base of 1400.
  - It reported a 12-month rate of 36.3% for Azar 1403.
  - The article calls SCI the official custodian.

### N3 — Ecoiran, «خروج آمار تورم از گنجه بانک مرکزی…», 2025-05-12
- **URL:** https://ecoiran.com/fa/tiny/news-91805
- **Content:**
  - The CBI governor gave CBI's 1403 annual inflation as 35.8% and Esfand 1403 point-to-point as 39.7%.
  - SCI's figures were 32.5% and 37.1% (national).
  - CBI had again stopped regular publication.

### N4 — Ecoiran on CBI's own 1404 numbers
- **Bahman 1404:** https://ecoiran.com/fa/tiny/news-124342. Urban CPI 558.1; 12-month rate 46.3%; point-to-point 62.2%.
- **Esfand 1404:** https://ecoiran.com/fa/tiny/news-128755, citing IRNA. Urban CPI 575.0; 1404 annual inflation 48.3%; point-to-point 62.1%.

## A.3 Chain-linking: how the single index was built

**1. Splice point: Farvardin 1381.** This is the first month SCI measured urban prices itself. CBI data is used up to Esfand 1380, and SCI data from Farvardin 1381.

**2. Monthly link factor.**
- f = SCI urban 1381-01 (S1, 1400 = 100) ÷ CBI urban 1381-01 (C1, 1390 = 100)
- f = 3.053936 ÷ 25.3 = **0.12070893**
- Months 1369-01 to 1380-12 = CBI value (1390 = 100) × f.
- Months 1381-01 to 1405-07 = S1 as published.
- The step from Esfand 1380 to Farvardin 1381 is therefore CBI's own (24.8 to 25.3).

**3. Annual link.**
- 1380 = CBI's 1380 annual index (23.38, 1390 = 100) × f = **2.82217**.
- 1350–1379 run backwards with CBI's published rates: I(y−1) = I(y) / (1 + π_y/100).
- 1381–1404 = S1 annual.
- Check: the chained annual index and the mean of the chained monthly index agree to within ±0.25% for every year 1369–1380.
- Consequence: the series' 1381 inflation is **13.2%**, which is SCI's figure, not CBI's 15.8%.

**4. Why use CBI's rates rather than an index level before 1381?** All the levels CBI published are rounded too much to be useful:
- The 1395-base dower index uses 3 decimals: 1349 = 1350 = 0.056, so 1350 reads as 0%.
- The 1390-base index uses 2 decimals.
- The rates, by contrast, were "computed from full numbers".
- Rounding each rate to 0.1 pp adds at most about ±0.3% cumulative error to the 1350 level.

**5. Precision warning, monthly 1369–1374.**
- CBI published these to 0.1 on base 1390, where the index is about 2.4–10.
- A 0.1 step is a 1–4% move, so month-to-month changes before about 1375 cannot be resolved. Example: 1369 shows 2.4, 2.4, 2.4, 2.4, 2.3, …
- Use annual or 12-month changes for those years.
- From 1381 the SCI values have full precision.

## A.4 Publication halts and irregular releases

### SCI
- **What happened:** releases stopped after the Bahman 1401 report (reported from Bahman 1401; N1, as of 1402/02/10, says the last release was in Esfand 1401). Publication resumed during 1402 on the new base 1400 = 100.
- **Effect on the data:** the current S1 file has every month, so nothing is missing. Months 1401-12, 1402-01 and 1402-02 are marked `S1;N1` in `cpi_monthly.csv`: they were published late, and only on the new base.
- **What was revised:** SCI revised 1400–1401 when it rebased (S3 vs S1, up to 3.5%). I use the revised S1 values.
- **The halt you remembered for 1403–1404:** I found no SCI halt then. N3 and N2 show SCI publishing monthly through 1403 and 1404.

### CBI
- Stopped regular official CPI releases from 1401 (N2).
- Republished in Dey 1403 on base 1400 (N2).
- Went silent again in early 1404 (N3).
- Issued 1404 figures by Esfand 1404 (N4).
- Kept sending the annual dower index to the Judiciary: C4 for 1400, C3 for 1401.

## A.5 Disagreements (all in `cpi_crosscheck.csv`)

### CBI vs SCI, 1381 onwards
**Choice: SCI.** Three reasons:
- SCI is the legal producer of price statistics, per article 3 of its law and article 10 of the Permanent Provisions of Development Plans law, as cited in S1's metadata. N2 says the same.
- Its index has full precision.
- It is the only continuous series to 1405.

| | CBI | SCI urban | SCI national |
|---|---|---|---|
| 1397 | 31.2 | 26.6 | |
| 1398 | 41.2 | 34.4 | |
| 1399 | 47.1 | 36.2 | |
| 1400 | 46.2 | 39.7 | |
| 1401 | 46.5 | 45.0 | |
| 1403 | 35.8 (N3) | 32.8 | 32.5 |
| 1404 | 48.3 (N4) | 49.6 | 50.6 |
| Esfand 1404 point-to-point | 62.1 | 69.3 | |

- CBI's 1399–1401 figures are dower-index ratios (C3).
- CBI's Esfand 1404 level of 575.0 is above SCI urban's 531.8. Both are described as 1400 = 100, but CBI's base for that figure was not confirmed in a primary document.
- From 1380 to 1401, CBI's price level rose 67.9× and SCI's (as chained here) 51.4×, so CBI's level ends about 32% higher. A user who prefers CBI can rebuild from `cbi_published_infl_pct`.

### SCI back-series before 1381 vs CBI
- **Choice: CBI.** The SCI back-series is damaged (see S1).
- Its year-to-year rates differ from CBI by up to 23 pp: 1356 SCI 33.7 vs CBI 25.1, and 1357 1.5 vs 10.0.

### World Bank (Gregorian) vs chosen series
- The two broadly track each other.
- Gaps above 5 pp occur where inflation was turning fast and the 3-month calendar offset matters:

| Year (WB year) | Chosen | World Bank |
|---|---|---|
| 1355 (1976) | 16.6 | 11.3 |
| 1365 (1986) | 23.7 | 18.4 |
| 1375 (1996) | 23.2 | 28.9 |
| 1397 (2018) | 26.6 | 18.0 |
| 1398 (2019) | 34.4 | 39.9 |
| 1399 (2020) | 36.2 | 30.6 |
| 1404 (2025) | 49.6 | 42.2 |

- These look like calendar-offset effects (a Gregorian year shares only about 9 months with the Solar year), not transcription errors. In most cases the chosen series is above WB in one year and below it in a neighbouring year, or WB is catching up with an acceleration that the Solar year records earlier (1397–1399).

## A.6 Confidence

| Period | Confidence | Why |
|---|---|---|
| Annual 1350–1380 | High | Official CBI rates. Transcribed from a clean scan and checked against a second CBI table. |
| Annual 1381–1404 | High | SCI official. The SCI vs CBI level gap is a definitional choice, not an error. |
| Monthly 1369–1374 | Low resolution | Levels are fine; month-to-month changes are not usable. |
| Monthly 1375–1380 | Medium | |
| Monthly 1381-01 to 1405-07 | High | |


---

# Part B — Minimum wage (min_wage.csv), source ids W*


Collected 2026-11-21 (30 Aban 1405). Raw copies of every page and PDF are in
`research/macro/raw/wage/`. Rendered images of PDF pages 17–18 of W1 are in `research/wage_png/rc19242/`.

**Units.** All CSV values are **toman per month** (1 toman = 10 rial). Almost every source publishes **rial**. I divided
by 10 and did no other conversion. Since 1369, Supreme Labour Council decisions give a **daily** minimum wage (حداقل مزد
روزانه). The monthly base is **daily × 30**, the convention the ministry, CBI (W1) and every news source use. I checked
this for every year that has a published daily figure (1375–1383 and 1387–1405); each base in the CSV equals daily × 30
exactly.

**base_toman** is the statutory minimum wage (حداقل مزد پایه) for a worker with no seniority. It excludes سنوات,
allowances and overtime.

**total_toman** is base + کمک هزینه مسکن (housing) + کمک هزینه اقلام مصرفی خانوار / بن کارگری (groceries). It describes a
single worker with no children and no seniority. It excludes:
- حق اولاد (child allowance). By law this is 3 × the daily minimum wage per child per month (W5 tables; for example 1402:
  5,308,284 rial per child).
- پایه سنوات (seniority). It is part of each decision, but only workers with at least one year of service get it.
- حق تأهل (marriage allowance). It exists from 1403 (5,000,000 rial/month in 1403, 1404 and 1405) and only married workers
  get it.

The total is given only from 1389 on, the first year where both housing and bon are sourced as uniform amounts for all
workers.

---

### 1. Sources

**W1: Majlis Research Center (مرکز پژوهش‌های مجلس), report «آسیب‌شناسی تعیین حداقل دستمزد در ایران (1): بررسی ساختار تصمیم‌گیری تعیین دستمزد»**
- Serial (شماره مسلسل) 19242, published 1402/06/11.
- Page: https://rc.majlis.ir/fa/report/show/1782097 . PDF: https://rc.majlis.ir/fa/report/download/1782097 (saved as `raw/wage/rc_19242.pdf`).
- Location: printed page 18, «جدول ۴. حداقل دستمزد اسمی و حقیقی طی سال‌های ۱۳۵۳ تا ۱۴۰۰», column «حداقل دستمزد اسمی (ریال)».
  The table's source line reads «منبع: بانک مرکزی جمهوری اسلامی ایران».
- Unit: rial, monthly. The column header gives no period, but the prose on p.17 says «ریال در هر ماه» and the values equal
  daily × 30.
- Years: 1353–1400.
- Caveats:
  - The prose on p.17 says the wage went «از رقم ۶۸۰۰ ریال در هر ماه سال ۱۳۵۷ به ۱۷۰۱۰ ریال … (رشدی در حدود ۱۷۰ درصد)», but
    Table 4 gives **6,300** for 1357. Only 6,300 fits the stated 170% growth (17,010 / 6,300 = 2.70), so the prose figure
    is a typo.
  - Small differences from the decision texts: 1391, 1393 and 1398 (see section 2).
  - For 1399 it uses the revised value in force from 1 Tir (see section 3).
  - I checked the table's internal consistency: each year's growth % matches the nominal values (for example 1354
    3,930 / 3,150 = +24.8%, 1370 50,010 / 30,000 = +66.7%).

**W2: Student News Network (SNN, خبرگزاری دانشجو), «جدول ۳۵ ساله افزایش حقوق‌ها/ حداقل مزد واقعی چقدر است؟», 1395/01/14**
- URL: https://snn.ir/fa/news/498100/
- Location: the table «جدول مقایسه‌ای ۳۵ ساله نرخ رشد تورم و دستمزد کارگران», column «حداقل‌مزد ماهیانه (تومان)».
- Unit: toman, monthly. Years: 1358–1395.
- Caveats: it cites no source. All its values match W1 to the toman, including W1's apparent 1391 and 1393 slips, so it is
  probably not independent of the CBI series. Its 1395 value of 812,164 is a typo; the decision text gives 812,166.
  Used only as corroboration.

**W3: Ecoiran (اکوایران), «جاماندگی حداقل دستمزدها از تورم», summary of the W1 report**
- URL: https://ecoiran.com/fa/tiny/news-45006
- Location: paragraph «…از 680 تومان به 1701 تومان…»; «1905 تومان … 1359 تا 1363».
- Unit: toman. Used only to record the 1357 disagreement. It repeats W1's 6,800-rial prose typo.

**W4: Tabnak (تابناک), news 1227590, «از افزایش ۱۷۰ درصدی تا ثابت ماندن دستمزد…»**
- URL: https://www.tabnak.ir/fa/news/1227590/
- Location: paragraph «…حداقل مزد از ۶۳۰ تومان به هزار و ۷۰۱ تومان برسد». Corroborates 630 toman for 1357.

**W5: IranEstekhdam (ایران استخدام), yearly pages «جدول حقوق سال YYYY»**
- URLs: `https://iranestekhdam.ir/جدول-حقوق-سال-YYYY` for YYYY = 1375–1384, 1386, 1387, 1389–1396 and 1400–1404 (saved as
  `raw/wage/ie/YYYY.html`).
- Location: each page's summary table, plus the quoted wire-agency text below it (IRNA, Mehr, ISNA, پایگاه اطلاع‌رسانی
  دولت, and quotes from the deputy labour minister).
- Unit: rial, daily and monthly. Some pages also give toman.
- Caveats: a private job-ads aggregator, not an official source. I used it for the **wording it quotes** from the decision
  or from the ministry, not for its own tables, except as noted. Page labels are sometimes off by a year:
  - The page labelled 1386 describes the 1385 decision.
  - The page labelled 1393 has a table of 1392 values.

  Specific uses:
  - Daily rates 1375–1383, from the deputy minister's statements.
  - 1374 daily 5,333 rial, from the 1375 page.
  - 1387 daily 73,200, quoting the decision of 22 Esfand 1386.
  - 1388 daily 87,840 and bon 100,000, from the 1389 page.
  - 1389 housing 100,000 and bon 200,000, from the deputy minister's statement.
  - 1390 bon 280,000, quoting item 3 of the circular; housing 100,000 from the table.
  - 1391 daily 129,900, quoting the circular's تبصره; bon 350,000 and housing 100,000 from the table.
  - 1392 bon 35,000 toman and housing 10,000 toman, from the Mehr report.
  - 1393 bon 800,000 and housing 200,000, from the ISNA report.
  - 1394 daily 20,297 toman for 1393.
  - 1396 table: housing 400,000, bon 1,100,000.
  - 1400 table: housing 4,500,000, bon 6,000,000.
  - 1401–1404 component lists.

**W6: Ekhtebar (اختبار), «بخشنامۀ تعیین دستمزد مشمولان قانون کار در سال ۱۳۹۴»**
- Text of minister Rabiei's circular, via پایگاه اطلاع‌رسانی دولت.
- URL: https://www.ekhtebar.ir/بخشنامۀ-تعیین-دستمزد-مشمولان-قانون-کا/
- Location: item ۱, «…مبلغ ۲۳۷۴۷۵ ریال…» (daily), from the Supreme Labour Council session of 1393/12/24.

**W7: Ekhtebar, «تعیین حداقل دستمزد کارگران در سال ۱۳۹۵» (ISNA report), 1394/12/19**
- URL: https://www.ekhtebar.ir/تعیین-حداقل-دستمزد-کارگران-در-سال-۱۳۹۵/
- Location: «حق مسکن کارگران از فروردین سال ۹۵، همچنان ۲۰ هزار تومان، حق بن نقدی ۱۱۰ هزار تومان»; base 812 thousand toman.
  The daily 270,722 rial comes from the W5 1395 page («دویست و هفتاد هزار و 722 ریال»).

**W8: Ekhtebar, «بخشنامه دستمزد ۹۷ ابلاغ شد», 1397/01/26**
- URL: https://www.ekhtebar.ir/بخشنامه-دستمزد-۹۷-ابلاغ-شد/
- Location: item ۱, daily «۳۷۰.۴۲۳ ریال»; item ۳, bon «۱.۱۰۰.۰۰۰ ریال». Decision session 1397/1/22.

**W9: Ekhtebar, «ابلاغ بخشنامه دستمزد ۹۸», 1398/01/06**
- URL: https://www.ekhtebar.ir/ابلاغ-بخشنامه-دستمزد-۹۸/
- Location: item ۱, daily «۵۰۵۶۲۷ ریال»; item ۳, bon «۱۹۰۰۰۰۰ ریال». Session 1397/12/27.

**W10: Ekhtebar, «مصوبه حداقل مزد کارگران در سال ۱۳۹۹», 1399/02/06**
- URL: https://www.ekhtebar.ir/مصوبه-حداقل-مزد-کارگران-در-سال-۱۳۹۹/
- Location: item ۱, daily «۶۱۱۸۰۹ ریال» (initial decision of 1399/1/20); item ۳, bon «۴۰۰۰۰۰۰ ریال»; item ۸, housing
  proposal to be sent to the cabinet.

**W11: E-Estekhdam (ای‌استخدام), «مصوبه افزایش ۵ درصدی حداقل مزد ابلاغ شد», 1399/04/02**
- URL: https://www.e-estekhdam.com/مصوبه-افزایش-۵-درصدی-حداقل-مزد-ابلاغ-ش (saved as `raw/wage/ee_1399rev.html`).
- Location: «…حداقل مزد از اول تیرماه ۹۹ روزانه ۶۳۶۸۰۹ … ریال تعیین می گردد», implementing items 7–8 of circular 7933
  dated 99/1/26.

**W12: Ekhtebar, «حداقل دستمزد در سال آینده ۵۷/۴ درصد افزایش یافت», session of 19 Esfand 1400**
- URL: https://www.ekhtebar.ir/حداقل-دستمزد-در-سال-آینده-۵۷-۴-درصد-افزا/
- Location:
  - «حداقل مزد ماهیانه از ۲۶.۵۵۴.۹۵۰ ریال در سال ۱۴۰۰ به ۴۱.۷۹۷.۵۰۰ ریال در سال ۱۴۰۱».
  - «مسکن که پیش از این ۴۵۰ هزار تومان بود … به ۶۵۰ هزار تومان و بن خواربار از ۶۰۰ هزار تومان به ۸۵۰ هزار تومان».
- Caveat: the same article's daily figure, «۱۳۹ هزار و ۲۹۹ تومان», is a typo. 41,797,500 / 30 = 1,393,250 rial, which
  matches the W5 1401 page («حقوق روزانه: ۱.۳۹۳.۲۵۰ ریال»).

**W13: Ekhtebar, «بخشنامه حداقل دستمزد سال ۱۴۰۲»**
- Circular No. 296137, 1401/12/29.
- URL: https://www.ekhtebar.ir/بخشنامه-حداقل-دستمزد-سال-۱۴۰۲/
- Location: item ۱, daily «۱۷۶۹۴۲۸ ریال»; item ۳, bon «۱۱.۰۰۰.۰۰۰».

**W14: Ekhtebar, «بخشنامه حداقل دستمزد سال ۱۴۰۳»**
- Circular No. 276716, 1402/12/29.
- URL: https://www.ekhtebar.ir/بخشنامه-حداقل-دستمزد-سال-۱۴۰۳/
- Location: item ۱, daily «۲.۳۸۸.۷۲۸ ریال»; item ۳, bon «۱۴.۰۰۰.۰۰۰»; item ۴, housing «ماهانه ۹.۰۰۰.۰۰۰ ریال» («مطابق
  سال گذشته»); item ۵, حق تأهل 5,000,000.

**W15: Ekhtebar, «بخشنامه مزد سال ۱۴۰۴ و دستورالعمل های تبعی تجمیعی»**
- Circular No. 231711, 1403/12/28; session 1403/12/25.
- URL: https://www.ekhtebar.ir/بخشنامه-مزد-سال-۱۴۰۴-و-دستورالعمل-های-تبعی-تجمیعی/
- Location: item ۱, daily «۳.۴۶۳.۶۵۶ ریال»; item ۳, bon «۲۲.۰۰۰.۰۰۰ ریال»; item ۴, housing «۹.۰۰۰.۰۰۰۰ ریال (نه میلیون ریال)».
  The digits contain an extra zero, but the words say nine million.

**W16: Ekhtebar, «مصوبه شورای عالی کار در خصوص تعیین حداقل دستمزد سال ۱۴۰۵ کارگران»**
- Decision of 1404/12/24.
- URL: https://www.ekhtebar.ir/مصوبه-شورای-عالی-کار-در-خصوص-تعیین-حداق/
- Location: item ۱, daily «۵.۵۴۱.۸۵۰ ریال»; item ۳, bon written «۲۲.۰۰۰۰.۰۰۰» (a digit typo; W17 gives 22,000,000);
  item ۴, housing «ماهانه ۳۰.۰۰۰.۰۰۰ ریال».

**W17: Ekhtebar, «بخشنامه مزد ۱۴۰۵ ابلاغ شد», 1405/01/31**
- The ministry's own text of the 1405 circular, via its public-relations center.
- URL: https://www.ekhtebar.ir/بخشنامه-مزد-۱۴۰۵-ابلاغ-شد/
- Location: item ۱, daily «پنج میلیون و پانصد و چهل و یک هزار و هشتصد و پنجاه ریال»; item ۳, bon «۲۲.۰۰۰.۰۰۰ ریال»;
  item ۴, حق تأهل 5,000,000.

**W18: Eghtesad News (اقتصادنیوز), quoting ISNA, «رشد 42 درصدی حق مسکن کارگران؛ حق مسکن کارگران چقدر افزایش یافت؟»**
- URL: https://www.eghtesadnews.com/بخش-اخبار-اقتصادی-67/489035-حق-مسکن-کارگران-چقدر-افزایش-یافت
- Location: «حق مسکن کارگران تا سال ۱۳۹۷ مبلغ ۴۰ هزار تومان بود اما در سال ۱۳۹۸ به ۱۰۰ هزار تومان، در سال ۱۳۹۹ به ۳۰۰ هزار
  تومان و در سال ۱۴۰۰ به ۴۵۰ هزار تومان رسید … ۶۵۰ هزار تومان».
- This is the source for housing in 1397–1401. The housing allowance is the only item in the package that needs cabinet
  approval; approvals came late but applied retroactively from Farvardin.

**W19: Tabnak (quoting Tasnim), «پرداخت حق مسکن ۹۰۰ هزار تومانی کارگران الزامی شد», 1402/01/19**
- URL: https://www.tabnak.ir/fa/news/1170415/
- Location: «…کارفرما‌ها باید این مبلغ را از ماه فروردین اعمال…». Housing 1402 = 9,000,000 rial from Farvardin.

**W20: Aftab News (آفتاب‌نیوز), «حق مسکن کارگران تصویب شد», 1395/08/26**
- URL: https://aftabnews.ir/fa/news/408781/
- Location: «…میزان حق مسکن کارگران از ابتدای مهرماه سال جاری ۴۰ هزار تومان تعیین کرد»; the 40k approved by the Supreme
  Labour Council for 1394 had not been sent to or ratified by the cabinet.

**W21: ILNA (ایلنا), «دستمزد «واقعاً» ترمیم می‌شود؟!», 1405/07/08**
- URL: https://www.ilna.ir/بخش-کارگری-9/1845794-دستمزد-واقعا-ترمیم-می-شود
- Location: «…موضوع ترمیم دستمزد کارگران … همچنان در انتظار تصمیم نهایی شورای عالی کار قرار دارد»; session 345 on 28
  Shahrivar 1405 ended without a decision.
- Shows that no mid-year revision for 1405 had been adopted as of 8 Mehr 1405. I found no later decision up to 30 Aban 1405.

**W22: Ekhtebar, text of «قانون اجرای طرح طبقه‌بندی مشاغل در کارگاهها» (مصوب 1352/12/07)**
- URL: https://www.ekhtebar.ir/قانون-اجرای-طرح-طبقه‌بندی-مشاغل-در-کا/
- Location: ماده واحده («…تغییر حداقل مزد در مناطق و صنایع…») and تبصره ۵ («…هر یکسال یکبار تعیین و پس از تصویب شورای
  عالی کار…»).
- Context for the 1350–1352 gap. Before this law, minimum wages were set by region and industry. The yearly national
  determination starts with it, which matches the CBI series in W1 beginning at 1353.

**W23: Radio Farda, «o2_iran_wage», 1385/12/16**
- URL: https://www.radiofarda.com/a/o2_iran_wage/381577.html
- Location: «در سال گذشته دولت تعيين حداقل دستمزدی دو نرخی را تصويب کرد … ميزان حداقل دستمزد کارگران دايم و پيمانی متفاوت
  بود». It gives no amounts.

**W24: Aftab News, «عارف: حق مسکن کارگری به ۳ میلیون تومان افزایش یافت», 1405/02/09**
- URL: https://aftabnews.ir/fa/news/1047453/
- Location: «حق مسکن کارگری برای سال ۱۴۰۵ از ۹۰۰ هزار تومان به ۳ میلیون تومان افزایش یافت» (cabinet approval).
  Payable from Farvardin 1405, per W16 item ۴.

**Pointers checked but not used as sources**
- Persian Wikipedia: I could not reach a dedicated year-by-year table. fa.wikipedia returned an error through both curl and
  WebFetch, and a search found no «حداقل دستمزد در ایران» table. Wikipedia snippets (for example 1397: daily 370,423;
  housing + bon 1.5M rial) agree with W8 and W18.
- iranopendata.org has a dataset, «ratio-increase-minimum-wage-workers-inflation-rate-1353-1399», attributed to the
  Statistical Centre. A search snippet shows 1353 = 10.5 toman/day, which is ×30 = 3,150 rial and agrees with W1. The page
  returned 404 when fetched, so it is not cited.

---

### 2. Disagreements and choices

| Year | Values found | Chosen | Why |
|---|---|---|---|
| 1357 | W1 Table 4: 6,300 rial (630 t); W1 prose p.17 and W3: 6,800 rial (680 t); W4: 630 t | **630** | The table is the data; only 6,300 fits the 170% growth stated in the same sentence. |
| 1374 | W1: 160,000 rial; W5 (1375 page, deputy minister): 1374 daily 5,333 rial, so ×30 = 159,990 | **16,000** (W1) | 10-rial difference, probably rounding. The daily decision text was not found. |
| 1380 | W1: 567,900; W5 headline: 567,910 | **56,790** | Daily 18,930 × 30 = 567,900. |
| 1383 | W1: 1,066,020; W5 headline: 1,066,000 | **106,602** | Daily 35,534 × 30 = 1,066,020; the headline is rounded. |
| 1385 | W1: 1,500,000 rial; W23: a two-tier wage (permanent and contract) that year; W5 (page labelled 1386, IRNA): 1,800,000 for temporary-contract workers and «2,000,000 with benefits» | **150,000** (W1), low confidence | The CBI series gives one figure. The two-tier structure means 1385 has no single statutory minimum. |
| 1391 | W1 and W2: 3,897,540; W5: daily 129,900 (quoting the circular's تبصره «نباید از مبلغ 129900 ریال … کمتر شود») so ×30 = 3,897,000 | **389,700** | Cross-check: 110,100 × 1.07 + 12,093 = 129,900, and 1392's 162,375 = 129,900 × 1.10 + 19,485. W1 is off by 540 rial. |
| 1393 | W1 and W2: 6,089,000; W5 (ISNA): 6,089,100; W5 1394 page: 1393 daily 20,297 toman | **608,910** | 202,970 × 30 = 6,089,100. 100-rial difference. |
| 1395 | W2: 812,164 t; decision: daily 270,722, so ×30 = 8,121,660 rial | **812,166** | W2 typo; W1 agrees with 8,121,660. |
| 1398 | W1: 15,168,820; W9 (decision): daily 505,627, so ×30 = 15,168,810 | **1,516,881** | Decision text. 10-rial difference. |
| 1399 | W10: daily 611,809 (decision of 1399/1/20, Farvardin–Khordad), so 18,354,270/month; W11: 636,809 from 1 Tir, so 19,104,270; W1 uses 19,104,270 | **1,910,427** | In force for 9 of 12 months, and it is the value in the CBI series. The initial value was 1,835,427 t. |
| 1392 bon | W5 (Mehr, start of 1392): «مانند سال گذشته 35 هزار تومان»; W5 (ISNA, 1393 decision): «از 50 هزار تومان به 80 هزار تومان» | **350,000 rial** in the total | The decision value at the start of 1392. A rise to 50k toman during 1392 is implied by ISNA but no decision text was found. If it applied, the 1392 total would be 547,125. |
| 1394 housing | W5 (ISNA): the Supreme Labour Council approved 20k→40k toman; W7 and W20: the cabinet did not ratify it, and housing stayed 20k | **200,000 rial** | Only cabinet-approved housing is payable (W20). |
| 1401 base daily | W12: «۱۳۹ هزار و ۲۹۹ تومان»; W12 and W5 monthly: 41,797,500 | **4,179,750** | The monthly figure is consistent in both sources; the W12 daily figure is a typo. |
| 1405 bon | W16 digits «۲۲.۰۰۰۰.۰۰۰»; W17 «۲۲.۰۰۰.۰۰۰ ریال» | **22,000,000 rial** | Ministry circular text (W17). |

### 3. Mid-year revisions and other within-year changes (not in the CSV values except as stated)

- **1385**: two-tier minimum wage, permanent and contract workers (W23). The CSV gives W1's single figure.
- **1387**: the decision of 1387/7/21 extended the groceries bon to all workers. 1387 has no total in the CSV.
- **1392**: bon possibly raised from 35k to 50k toman during the year (see the table above).
- **1395**: housing raised by the cabinet from 20k to 40k toman **from 1 Mehr 1395** (W20). The CSV total uses 20k; from
  Mehr the total would be 962,166 t.
- **1399**: base raised from daily 611,809 to **636,809 rial from 1 Tir 1399**. The Supreme Labour Council moved 25,000
  rial/day from seniority (پایه سنوات) into the base (W11). The CSV uses the Tir value. Housing for 1399 (300k toman) was
  approved by the cabinet after the decision (W10 item ۸, W18).
- **1401**: housing 650k toman was approved by the Supreme Labour Council on 19 Esfand 1400 and needed cabinet approval.
  W18 says the cabinet approval came later, payable from Farvardin.
- **1402**: housing raised to 900k toman by the cabinet in Farvardin 1402, payable from Farvardin (W19).
- **1405**: housing raised to 30,000,000 rial by the cabinet on 9 Ordibehesht 1405 (W24), payable from Farvardin (W16).
  A mid-year wage repair (ترمیم مزد) was discussed in Shahrivar (session 345, 28 Shahrivar 1405) but **not adopted** as of
  8 Mehr 1405 (W21). No later decision was found up to 30 Aban 1405.

### 4. What total_toman includes, by period

| Period | Included | Notes |
|---|---|---|
| 1350–1388 | no total | Housing and bon are not reliably sourced as uniform amounts. Before 1387 the bon was set by marital status: 1375–1377 married 7,000 and single 3,000 rial; 1378–1382 married 10,000 and single 6,000 (W5). |
| 1389–1392 | base + housing 100,000 rial + bon (1389: 200,000; 1390: 280,000; 1391: 350,000; 1392: 350,000) | W5 (deputy minister's statement for 1389; circular item ۳ for 1390; Mehr for 1392). Housing per W5: «حق مسکن … تقریبا یک دهه گذشته … 10 هزار تومان». |
| 1393–1395 | base + housing 200,000 + bon (1393: 800,000; 1394 and 1395: 1,100,000) | W5 (ISNA), W6, W7, W20. Housing as at the start of the year. |
| 1396–1397 | base + housing 400,000 + bon 1,100,000 | W5 (1396 table), W8, W18. |
| 1398–1405 | base + housing + bon, as set for the year (retroactive housing approvals included) | 1398: 1,000,000 + 1,900,000. 1399: 3,000,000 + 4,000,000. 1400: 4,500,000 + 6,000,000. 1401: 6,500,000 + 8,500,000. 1402: 9,000,000 + 11,000,000. 1403: 9,000,000 + 14,000,000. 1404: 9,000,000 + 22,000,000. 1405: 30,000,000 + 22,000,000 (all rial). Sources: W9–W19, W24. |

Consistency checks with published totals:
- 1400: W5 «جمع حقوق 38,454,930» = our 37,054,950 + seniority 1,399,980.
- 1401: W5 (IMNA) «۵۶,۷۹۷,۵۰۰ ریال» for a worker with no seniority and no children. This equals our total.
- 1402: W5 «هفت میلیون و ۳۰۸ هزار تومان» for a single worker with no seniority. This equals our 7,308,284.

### 5. Gaps and confidence

- **1350–1352: empty.** No reliable national figure was found. Minimum wages were then set by region and industry (W22),
  and the CBI series (W1) starts in 1353. Filling these years would need the Ministry of Labour or Plan Organization
  statistical yearbooks of 1350–1352 (not online).
- **1353–1368:** a single primary series (W1, CBI data) plus W2, which agrees but is probably derived from the same data.
  **Medium confidence.** These are nominal monthly figures. Before 1358 they presumably reflect the CBI's
  national/reference rate; the regional nature of pre-revolution wages is not explained in W1.
- **1369–1388:** W1 plus decision figures quoted by the ministry or wire agencies (via W5) for 1374–1384 and 1386–1388.
  **Medium–high confidence.** The exception is 1385 (two-tier wage, **low confidence**).
- **1389–1405:** base figures from decision or circular texts (via ekhtebar.ir and wire agencies) that agree with W1 to
  within ≤540 rial. **High confidence.** Totals are **high confidence for 1397–1405** and **medium for 1389–1396**, where
  allowance amounts come from news quotes and aggregator tables and include the noted 1392 bon and 1395 housing
  ambiguities.
- Not primary: mcls.gov.ir, the official gazette (rrk.ir) and qavanin.ir were not used. qavanin.ir returned a JS challenge
  page; rrk.ir and mcls.gov.ir were not reached. The circular texts come from ekhtebar.ir, a legal news site reproducing the
  ministry's texts, and from wire agencies.

---

# Part C — One-year deposit rate (deposit_rate.csv), source ids D*


Companion to `deposit_rate.csv` (`jy,rate_pct_min,rate_pct_max,source_id`). Compiled 1405/09/01 (2026-11-22).

**What the series is.** It records the officially set or declared annual rate, in percent per year, on a one-year bank deposit.
- 1350–1362: interest (بهره), and later the "guaranteed minimum profit", on time or fixed deposits (سپرده ثابت).
- 1363 onward: the provisional profit rate (سود علی‌الحساب) on one-year term investment deposits (سپرده سرمایه‌گذاری بلندمدت یک‌ساله).
- 1363–1368: the rate applied to all long-term deposits of one year or more, because no separate one-year class existed.
- Ceilings or ranges are given as min/max.
- Market (actually paid) rates are not in the CSV. They appear only in the notes.

**How a year's value is chosen.** A year's value is the rate that was in force for most of that Solar Hijri year. Changes during a year are listed below.

**Raw files.** Every raw page used is saved under `scratchpad/research/macro/raw/rate/`.

**Off-limits source.** cbi.ir was not accessed. Where a CBI table is used, it comes through a reproduction, as labelled.

---

### Sources

**D1. CBI table "نرخ سود علی‌الحساب سپرده‌های سرمایه‌گذاری مدت‌دار (درصد)", 1363–1396, via ISNA and Tabnak.**
- **Where it was published:** Tabnak news 806103, "نگاهی به نرخ تورم و سود بانکی در ۳۴ سال گذشته", 18 Khordad 1397, quoting ISNA. https://www.tabnak.ir/fa/news/806103
  - The table is an embedded image: https://www.tabnak.ir/image/1280/legacy-media/fa/news/1397/3/18/891748_352.jpg
  - Local copies: `raw/rate/tabnak_806103_table.jpg`, plus the zoomed crops `tab_top.png`, `tab_bot.png` and `tab_8589.png`.
- **How to read it:** use the "یک‌ساله" column.
  - 1363–1368: the single cell "X برای کلیه سپرده‌های بلندمدت (یک سال به بالا)".
  - 1390–1392: the full-row text "در اختیار بانکها و موسسات اعتباری در دامنه ۶–۲۰ / ۷–۲۰ درصد".
  - 1387: two sub-rows, "حداکثر ۱۵" and "۱۷/۲۵".
- **Unit:** percent per year.
- **Caveats:**
  - The image is low resolution. Every digit was checked on 3–4× crops; ۱۷/۲۵, ۱۴/۵, ۱۱/۵ and ۱۶‑۷ are legible.
  - The image has no source line. The attribution to CBI rests on two things. First, its title and layout match CBI's standard table. Second, its values match the IMF tables (D3–D5, sourced "Central Bank of Iran") wherever they overlap, which is 1373–1385, and the World Bank table (D7, sourced "Central Bank of Iran") for 1363–1368.
  - The 1387 sub-rows are not labelled in the reproduction (see Disagreements).

**D2. Hamshahri Online 732581, "بانک ها بیشترین سود را در چه دوره ای دادند؟", 14 Dey 1401 (2023-01-04). A narrative history.** https://www.hamshahrionline.ir/news/732581
- **What it gives:**
  - 1363: long-term 9; 1364: 8; 1365: 8.5, "unchanged 65–68".
  - 1369: one-year 9; 1370: one-year 9; 1374: one-year 14; 1379: one-year 14.
  - 1380: rates cut by 1 point.
  - 1385: range 7–16.
  - 1390: 6–20, and 1391–92: 7–20, both at the banks' discretion.
  - 1393: 22; 1394: 20, then 18; 1395: 15; 1396–97: 15.
- **Also gives:** the law approved Shahrivar 1362 and implemented from 1 Farvardin 1363.
- **Caveat:** secondary journalism. It agrees with D1 throughout and is used only as corroboration.

**D3. IMF Staff Country Report No. 99/37, "Islamic Republic of Iran: Recent Economic Developments" (1999).** https://www.imf.org/external/pubs/ft/scr/1999/cr9937.pdf
- **Where:** Table 42, "Average Rates of Return on Deposits, 1994/95–1998/99", printed page 47 (PDF page 48), row "Long-term, 1-year": 11.5, 14.0, 14.0, 14.0, 14.0. Source line: "Bank Markazi Jomhouri Islami Iran; and Fund staff estimates".
- **Unit:** percent per annum. Years are Iranian years ending 20 March, so 1994/95 = 1373.
- **Copies:** scanned PDF, read by OCR and checked visually (`raw/rate/imf/t42.png`).

**D4. IMF Country Report No. 04/307, "Islamic Republic of Iran: Statistical Appendix" (2004).** https://www.imf.org/external/pubs/ft/scr/2004/cr04307.pdf
- **Where:** Table 35, "Rates of Return on Deposits, 1999/2000–2003/04", printed page 38 (PDF page 40), row "Long term, 1-year": 14.0, 14.0, 13.0, 13.0, 13.0. Source line: "Central Bank of Iran".
- **Footnote 2:** the 2001/02 rates are effective from 22 Ordibehesht 1380 (12 May 2001).

**D5. IMF Country Report No. 07/101, "Islamic Republic of Iran: Statistical Appendix" (2007).** https://www.imf.org/external/pubs/ft/scr/2007/cr07101.pdf
- **Where:** Table 29, "Rates of Return on Deposits with State-Owned Banks, 2001/02–2006/07", printed page 31 (PDF page 33), row "1-year": 13, 13, 13, 13, 13, "7–16". Source line: "Central Bank of Iran".
- **Footnote 1:** "Private banks have freedom to determine the provisional deposit rates based on the Usury-Free Banking Law."

**D6. World Bank, "Iran – Economic Development (Vol. 4): Statistical appendix", 14 Oct 1974.** http://documents.worldbank.org/curated/en/445331468044098551/pdf/multi0page.pdf
- **Where:** Table 7.5, "Interest Rates on Bank Deposits (In percent per annum)", printed page 59 (PDF page 67), row "Time Deposits 365–729 [days]". Source line: "Bank Markazi Iran".
- **Values by period (effective dates):**

| Period | 365–729-day time deposits |
|---|---|
| 23 Aug 1970 – 3 Mar 1972 | 7½ |
| 3 Mar 1972 – 6 Jul 1973 | 7½ |
| from 6 Aug 1973 (open-ended) | 9 |

- **Copies:** checked on a 300 dpi render (`raw/rate/wb/wb1974_t75_right.png`).
- **Caveat:** these are the CBI-regulated rates for that maturity bucket. The table does not say whether they are ceilings or fixed rates.

**D7. World Bank, "Iran – Reconstruction and economic growth (Vol. 2): Annexes and statistical appendix", 30 Jul 1991.** http://documents.worldbank.org/curated/en/258321468040503534/pdf/multi0page.pdf
- **Where:** Table 6.9, "Deposit Rates (Ex Post) (Percent)", printed page 171 (PDF page 173). Source line: "Central Bank of Iran".
- **Rows:**
  - "OLD – Time Deposit": 8.5 for 1358–1362, and 8.5 for 1363.
  - "NEW – Long-term Investment Deposit": 9.0 (1363), 8.0 (1364), 8.5 (1365–1368), 8.75 (1369).
  - Footnote: 1363 is a "Transitional Year".
- **Also used:** Annex IV, pages 110–112, describes the post-1363 system.
- **Caveats:**
  - The table is labelled "ex post".
  - The pre-1363 "time deposit" figure is not term-specific.
  - The English year labels under the Persian years are misprinted. For example, 1364 is labelled "1985". The Persian years are used here.

**D8. Rade.ir, "همه چیز درباره بانکداری در ایران", 2023-07-04.** https://www.rade.ir/28322-بانکداری-در-ایران/
- **What it says:** "از ابتدای سال ۱۳۵۸ … سود علی‌الحساب … برای سپرده ثابت 8.5 درصد و برای سپرده پس‌انداز معادل ۷ درصد".
- **Caveat:** commercial site, no citation. It is used only as corroboration of D7. It matches D7 exactly: savings 7.0, time 8.5.

**D9. CBI circular on deposit profit (Banking Supervision Dept.), reproduced by Mehr via Tabnak 18287, 25 Shahrivar 1387.** https://www.tabnak.ir/fa/news/18287
- **Clause 7-4, table:** "سپرده‌های با سررسید یک‌ساله حداکثر ۱۵ درصد" (two-year: maximum 16; up to five-year: maximum 19).
- **Clause 7-2:** higher rates are allowed with CBI's written approval.
- **Clause 10:** binding for deposits taken from 1 Aban 1387.
- **Corroboration:** Aftab 81765 (29 Aban 1387) confirms the circular was "approved on 24 Shahrivar and implemented from 1/8/1387".

**D10. Hamshahri 104477, 17 Farvardin 1389 (CBI governor Bahmani on the 1389 policy package).** https://www.hamshahrionline.ir/news/104477
- **What it says:** "نرخ سود علی الحساب سپرده‌های یکساله از 14.5 درصد به 14 درصد" (two-year 15.5 to 14.5; five-year 17.5 to 17).
- **Use:** confirms 1388 = 14.5 and 1389 = 14.

**D11. Tabnak 154221, 26 Esfand 1389. The 1124th session of the Money and Credit Council (MCC) set the 1390 rates.** https://www.tabnak.ir/fa/news/154221
- **What it says:** "سود سپرده های یک ساله 12 و نیم درصد … به صورت علی الحساب تصویب شد".
- **Corroboration:** Jamejam 407231, 11 Khordad 1390, the 1390 policy package: one-year 12.5, five-year 15.

**D12. The Bahman 1390 change.**
- **Tabnak 222900 and 222878, 9 Bahman 1390:** state and private banks, under the MCC's delegation, set one-year at 17% and one-to-five-year at 17–20%.
  - https://www.tabnak.ir/fa/news/222900
  - https://www.tabnak.ir/fa/news/222878
- **Tabnak 223678, 11 Bahman 1390:** an MCC member confirms the banks may set the rates.
- **Tabnak 844277, 28 Mehr 1397 (Fars):** "شورای پول و اعتبار در بهمن ماه 90 حداکثر نرخ سود بانکی را 20 درصد تعیین کرد … در اواخر سال 92 نرخ سود به 25 تا 28 درصد رسید". https://www.tabnak.ir/fa/news/844277

**D13. Tabnak 328215, 5 Tir 1392.** https://www.tabnak.ir/fa/news/328215
- **What it says:** the latest policy package "بانک ها را در تعیین نرخ سود برای سپرده ها آزاد گذاشته". It describes one-to-two-year deposits as previously about 18%, now up to 22% at some banks.

**D14. The 22% cap of 1393.**
- **Aftab 248869, 28 Khordad 1393:** CBI governor Seif says the MCC's caps (22% on lending, and a deposit maximum of 22) are binding from that day. https://aftabnews.ir/fa/news/248869
- **Tabnak 459863, 29 Azar 1393:** the CBI–banks meeting confirms "سپرده یک ساله … ۲۲ درصد". https://www.tabnak.ir/fa/news/459863

**D15. Aftab 294511, 9 Ordibehesht 1394. The 11-article MCC decision.** https://aftabnews.ir/fa/news/294511
- **Article 1:** "سقف نرخ سود علی‌الحساب سپرده‌های بانکی … (با حداکثر سررسید یک‌سال) معادل ۲۰ درصد".
- **Effective date:** Aftab 295468 (15 Ordibehesht 1394) puts it at Wednesday 16 Ordibehesht 1394.

**D16. Asriran 452124, 30 Bahman 1394.** https://www.asriran.com/fa/news/452124
- **What it says:** the MCC approved the banks' agreement. One-year goes from 20% to 18%, effective Saturday 1 Esfand 1394.

**D17. The 15% of 1395.**
- **Aftab 376343, 31 Khordad 1395:** state and private banks agree to cut one-year from 18% to 15%, effective 1 Tir 1395. https://aftabnews.ir/fa/news/376343
- **Aftab 378064, 8 Tir 1395:** the MCC "تایید و تصویب" that agreement. https://aftabnews.ir/fa/news/378064

**D18. The 15% cap, 1396–1399.**
- **Taadol 105481, 1 Shahrivar 1396:** CBI's new circular sets the one-year maximum at 15%, binding from 11 Shahrivar 1396. https://www.taadolnewspaper.ir/fa/news/105481
- **Khabaronline 1378821, 31 Farvardin 1399:** the MCC's 15% rate had been unchanged since Shahrivar 1396, but banks were paying above 23%. The banks' supreme council re-imposed 15% for one-year deposits from 1 Ordibehesht 1399. https://www.khabaronline.ir/news/1378821

**D19. The 16% cap of 1399.**
- **Hamshahri 531024, 24 Tir 1399 (ISNA):** the 1297th MCC session of 24/4/1399 set the cap on one-year deposits at 16%, and on two-year deposits at 18%. https://www.hamshahrionline.ir/news/531024
- **Taadol 169183, 31 Tir 1399:** the CBI circular text. https://www.taadolnewspaper.ir/fa/news/169183

**D20. The 20.5% cap of 1401.**
- **CBI circular 01/280373, 10 Bahman 1401 (1350th MCC session), reproduced by Ravihesab:** https://www.ravihesab.com/01-280373
  - Clause (الف)4: "سپرده سرمایه گذاری بلند مدت با سررسید یک سال: 20.5٪".
  - The circular refers to circular 99/126642 of 28/4/1399 as the prior rule.
- **Same text:** Aftab 821911, 10 Bahman 1401.

**D21. 1403 confirmations.**
- **Khabaronline 1970762, 23 Mehr 1403, quoting Tasnim:** under the MCC decision, one-year is 20.5. https://www.khabaronline.ir/news/1970762
- **Asriran 1022286, 26 Azar 1403:** CBI official Shirijian says the maximum deposit rate approved by the MCC is 22.5, which is the three-year rate, and that no change is planned.

**D22. 1404 confirmations.**
- **Eghtesadonline 2094569 and Asriran 1105756, 29 Mehr 1404:** one-year 20.5, two-year 21.5, three-year 22.5 under the MCC decision. https://www.eghtesadonline.com/fa/news/2094569/
- **Fararu 939786, 17 Dey 1404:** "بر اساس آخرین ابلاغیه‌ها، نرخ سود سپرده‌های بلندمدت یک‌ساله ۲۰.۵ درصد". https://fararu.com/fa/news/939786

**D23. 1405 statements.**
- **CBI statement of 30 Khordad 1405:** carried by Ecoiran 140219, Eghtesadonline 2145357 and Donya-e-Eqtesad 4277598. A rate review is under way, but no new policy has been adopted.
- **Ecoiran 141707, 9 Tir 1405, and Fararu 982815, 6 Tir 1405, both quoting IRNA:** "هیچ تصمیمی در مراجع ذی‌صلاح از جمله هیأت عالی بانک مرکزی برای افزایش نرخ بلندمدت سود بانکی اخذ نشده".
  - They add that under the 1402 CBI law the MCC was dissolved, and that the CBI's High Council (هیأت عالی) now sets rates.
  - They also contain the sentence "در حال حاضر نرخ سود سپرده‌های بلندمدت بانکی (یک ساله) ۲۳ درصد است" (see Disagreements).
  - https://ecoiran.com/fa/tiny/news-141707

**D24. Ecoiran 83488, 19 Esfand 1403, "روند نرخ سود سپرده‌های سرمایه‌گذاری یک ساله از سال ۱۳۹۰ تا ۱۴۰۳".** https://ecoiran.com/fa/tiny/news-83488
- **What it gives:**
  - 1390: 6–20; 1391–92: 7–20, a band announced by CBI with banks free inside it.
  - 1393: 22 by MCC decision.
  - Azar 1394: cut from 20 to 18.
  - Tir 1399: 16.
  - Bahman 1401: 20.5, still current.

**D25. Text of the Usury-free Banking Law (قانون عملیات بانکی بدون ربا (بهره)), via ekhtebar.ir.** https://www.ekhtebar.ir/‌قانون-عمليات-بانكي-بدون-ربا-‌بهره/
- **Closing paragraph:** approved by the Majlis on Tuesday 8 Shahrivar 1362, and confirmed by the Guardian Council on 10/06/1362.
- **Art. 3:** deposits are qarḍ al-ḥasana (current or savings) or term investment deposits.
- **Art. 4:** the principal of term deposits may be guaranteed or insured.
- **Art. 5:** profit is shared pro rata by amount and duration.
- **Art. 20:** CBI sets minimum and maximum profit shares and rates.

**D26. Encyclopaedia Iranica, "Banking ii. Banking in the Islamic Republic of Iran".** https://www.iranicaonline.org/articles/banking-in-iran/banking-ii-banking-in-the-islamic-republic-of-iran/
- **What it says:** "the Bānk‑e Markazī sets one uniform rate which all banks pay on term investment deposits … Islamic banking [in Iran] involves a guaranteed rate of return". This describes the system in the mid-1980s.

**D27. Cross-check only, not used in the CSV: World Bank WDI FR.INR.DPST, "Deposit interest rate (%)", Iran.** https://api.worldbank.org/v2/country/IRN/indicator/FR.INR.DPST
- **Coverage:** 2003–2016 only. The values (11.6–16.9) are averages across deposit types, by Gregorian year. This is a different concept from the one-year rate in the CSV.
- **Local copy:** `raw/rate/wb_FR.INR.DPST.json`.

---

### Disagreements and choices

- **1369: D1 gives 9 and D7 gives 8.75.**
  - D1 and D2 give 9 for the one-year deposit (two-year 10, three-year 11, five-year 13).
  - D7 gives 8.75 for "long-term investment deposit", labelled ex post and not term-specific.
  - **Chose 9:** it is the announced one-year rate.

- **1387: CSV records 15–17.25.**
  - D1 shows two sub-rows. One reads "حداکثر ۱۵" (with two-year maximum 16 … five-year maximum 19, and the special short-term rate "on the bank's proposal with CBI approval"). The other reads 17.25 (two-year 17.5, three-year 18, four-year 18.5, five-year 19).
  - D9 confirms that the 15% ceiling was the CBI circular effective 1/8/1387, with higher rates allowed case by case with CBI approval.
  - The reproduction does not say what the 17.25 line represents. It may be the rates in force before Aban 1387, or the rates approved above the table.
  - **Recorded as min 15 / max 17.25.** Confidence for this year is low.

- **1390: CSV records 12.5, while D1 and D24 describe a band.**
  - D1 and D24 summarise 1390 as "at the banks' discretion within 6–20".
  - The MCC-approved rate in force from 1 Farvardin 1390 to 9 Bahman 1390 (about 10 months) was 12.5 (D11).
  - From 9 Bahman 1390, banks under MCC delegation set 17%, with 20% as the MCC maximum (D12).
  - **Recorded 12.5** under the "most of the year" rule. The CBI retrospective band and the Bahman change are noted here.

- **1391–1392: CSV leaves min empty and puts max at 20.**
  - There was no official one-year rate. D1 gives a band of 7–20 across all deposit terms, at the banks' discretion; 7 is the short-term floor, not a one-year rate.
  - The 20% is the MCC ceiling (D12).
  - Banks paid about 17–18% (D12, D13), and by late 1392 up to 25–28% (D12, Tabnak 844277).

- **1385–1386: CSV records 7–16.**
  - D1 shows the band 7–16 for every term up to four years.
  - D5 shows 7–16 for state-owned banks in 2006/07, and notes that private banks were free to set their own rates.

- **1405: CSV records 20.5; the IRNA text in D23 says 23.**
  - The IRNA-sourced text (Tir 1405) says the one-year rate "is 23%".
  - No decision raising the one-year rate above 20.5 was found:
    - CBI's own statements in Khordad and Tir 1405 deny that any increase was approved (D23).
    - The last decision found is the Bahman 1401 MCC rate of 20.5 (D20).
    - That rate is reported as still current in Mehr 1404 and Dey 1404 (D22).
  - 23% is the MCC rate on lending and on the 1401 "general" certificates of deposit (D2 and D20). The IRNA sentence probably conflates them, but this is an inference.
  - **Kept 20.5** and flagged it. If a High Council decision of 1404–1405 surfaces, revisit this year.

- **1363: CSV records 9.**
  - D1 and D7 both give 9 for long-term deposits of one year or more.
  - D7 marks 1363 as transitional: old-style time deposits still earned 8.5.

### Changes within a year (CSV value = rate in force for most of the year)

| Year | Change |
|---|---|
| 1352 | 7.5% until 6 Jul 1973 (15 Tir 1352); 9% from 6 Aug 1973 (15 Mordad 1352) (D6). |
| 1380 | 14% until 21 Ordibehesht 1380; 13% from 22 Ordibehesht 1380 (D4). |
| 1387 | New ceiling regime from 1 Aban 1387 (D9). See Disagreements. |
| 1389 | 14.5% cut to 14% with the 1389 package, announced 16–17 Farvardin 1389 (D10). |
| 1390 | 12.5% to 9 Bahman 1390; then bank-set 17% within a 20% maximum (D11, D12). |
| 1393 | Bank-set rates (discretion regime) until 27 Khordad 1393; 22% cap from 28 Khordad 1393 (D14). |
| 1394 | 22% until 15 Ordibehesht 1394; 20% from 16 Ordibehesht 1394; 18% from 1 Esfand 1394 (D15, D16). |
| 1395 | 18% until 31 Khordad 1395; 15% from 1 Tir 1395, ratified by the MCC on 8 Tir 1395 (D17). |
| 1396 | 15% cap; CBI enforcement circular binding from 11 Shahrivar 1396 (D18). |
| 1399 | 15% (re-imposed by the banks' council from 1 Ordibehesht 1399); 16% from MCC session 24 Tir 1399 (D18, D19). |
| 1401 | 16% until 10 Bahman 1401; 20.5% from the CBI circular of 10 Bahman 1401 (D20). |

### Market (paid) rates, for context only, not in the CSV

- **1390s:** after Bahman 1390, banks and unlicensed credit institutions paid above the 20% ceiling. Rates reached 25–28% by late 1392 (D12) and up to 32% on five-year deposits in some banks in Tir 1392 (D13).
- **1397–1398:** while the official cap was 15%, banks paid 18–23% (Tabnak 844277, 1397; Khabaronline 1378821).
- **Certificates of deposit:** CBI authorised 20% certificates of deposit in Bahman 1396 (D18) and "general" CDs at 23% in Dey 1401 (D2). A short-lived 30% "special" CD was authorised in late 1402 (D21).
- **1404–1405:** banks offered up to about 25–30% on large deposits (D22, D23). None of these are official one-year deposit rates.

### Interest (بهره) before 1363 versus profit (سود) after

- **Up to 1357.** Banks paid contractual interest on deposits. Under the Monetary and Banking Act (قانون پولی و بانکی کشور, approved 18/4/1351, as listed on the D25 page), CBI and the MCC set interest rates by maturity bucket. D6 shows the schedule up to 1352.
- **From 1358 to 1362.** Banks were nationalised in Khordad 1358. From the start of 1358, interest on deposits was replaced by a "guaranteed minimum profit" (حداقل سود تضمین‌شده): 8.5% on time deposits and 7% on savings deposits (D7 Table 6.9; D8). In substance it was still a fixed return.
- **The usury-free banking law.**
  - Approved by the Majlis on 8 Shahrivar 1362, confirmed by the Guardian Council on 10 Shahrivar 1362 (D25).
  - Implemented in the banks from 1 Farvardin 1363 (D2). 1363 is shown by the World Bank as a transitional year (D7).
- **Under the law.**
  - Deposits are either interest-free qarḍ al-ḥasana deposits or term investment deposits. With term investment deposits, the bank acts as the depositor's agent (وکیل) and shares the realised profit (D25, Arts. 3–5).
  - The bank pays a provisional profit (سود علی‌الحساب) announced in advance. In principle this is settled to a definitive profit (سود قطعی) at year-end, with any difference paid out (D9 clause 9).
  - Banks may guarantee or insure the principal (Art. 4).
  - In practice, CBI and the MCC set one uniform rate, or a ceiling, and the return is effectively guaranteed (D26; World Bank 1991, Annex IV, D7).
- **Who sets the rate.** From 1363 to 1401 the MCC (شورای پول و اعتبار) set the rates. The 1402 CBI law dissolved the MCC; rate decisions now belong to CBI's High Council (هیأت عالی) (D23).

### Gaps

- **1353–1357: empty.**
  - No source found giving the one-year time-deposit rate.
  - D6 shows 9% from 6 Aug 1973, still open-ended at the report date (14 Oct 1974, about 1353/07/22). The World Bank's 1976 Country Economic Memorandum (p. 13, OCR) says only that "interest rates were reduced in January 1975", without figures.
  - Not filled, to avoid inference.
  - Leads: Bank Markazi Iran Annual Reports for 1353–1357 (1974/75 to 1978/79), and P. Basseer's 1983 dissertation (cited in the IJMES article "The Political Economy of Credit Subsidy in Iran, 1973–1978").
- **1371 and 1372:** single source (D1) only. No independent cross-check was found; IMF D3 starts at 1373.
- **1386:** D1 only.
- **1358–1362:** the 8.5% is for time deposits generally, not specifically one-year, and D7 labels it ex post.
- **1391–1392:** no official one-year figure exists, only the 20% ceiling.
