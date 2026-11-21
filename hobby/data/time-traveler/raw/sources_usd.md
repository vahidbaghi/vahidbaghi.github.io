# Free-market USD in Iran (toman), 1350 to Aban 1405: sources

Files in this folder:
- `usd_toman.csv` is the chosen series. Columns are `jy,jm,value_toman,kind,source_id`. `jm` is empty on annual rows. 1 toman = 10 rials, and every rial source was divided by 10.
- `coin_toman.csv` is the Emami gold coin series (سکه امامی), monthly, 1389/01 to 1405/08.
- `usd_crosscheck.csv` lists every alternative value collected, in long format: tgju, bonbast, CBI monthly and annual, IMF annual and quarterly, ISNA/CBI, asriran, the IMF "authorized dealers" column, and coin from both sites.
- `official_context_toman.csv` holds the official rate for 1350 to 1358. It is context only and is not part of the free-market series.
- `raw/` holds the downloads: tgju JSON, bonbast yearly JSON, IMF PDFs, CBI xlsb and PDF, news HTML. `work/` holds the monthly aggregates and OCR output. `scripts/` holds the code. Rebuild the outputs with `python -I scripts/build.py work .`.

Iranian month mapping: the IMF labels its months "Mar/Apr", "Apr/May" and so on. Each label is one Iranian month (Farvardin = Mar 21 to Apr 20), so `jm` 1 = Mar/Apr.

## Coverage of usd_toman.csv

| Period | Granularity | source_id | Confidence |
|---|---|---|---|
| 1350–1352 | annual, **official** rate | pwt_official_fred | high for the number. Free market ≈ official (IRR classify the market as unified to 1973M12) |
| 1353–1356 | **missing** | none | no free-market source found. IRR flag a dual/parallel market from 1974M1. The official rate is in official_context_toman.csv |
| 1357–1369 | annual | asriran_198282 | **low to medium**. Secondary compilation that names no source. Where it can be checked (1370–72, 1377–78, 1383–87), it matches CBI and IMF figures |
| 1370/01–1373/12 | monthly | imf_cr9827_t57 | high |
| 1374–1376 | annual | asriran_198282 | low to medium. The IMF prints "..." for these years. Free-market trading was suppressed after Ordibehesht 1374 |
| 1377/01–1380/12 | monthly | imf_cr02212_t49 | high |
| 1381–1389 | annual | cbi_via_isna_1400 | medium to high. These are CBI figures relayed by ISNA, and they match the IMF and the SCI yearbook wherever the sources overlap |
| 1390 | annual | sci_yearbook_cbi | high |
| 1390/09–1405/08 | monthly | tgju_price_dollar_rl, with bonbast_github in 11 months | high. 1397/07–12 is medium (see below) |

Monthly data is missing for 1350–1369, 1374–1376 and 1381–1390/08.

## Sources

### tgju_price_dollar_rl
- TGJU (شبکه اطلاع‌رسانی طلا و ارز), «قیمت دلار آزاد». Page: https://www.tgju.org/profile/price_dollar_rl/history
- Data endpoint behind the history table: `https://api.tgju.org/v1/market/indicator/summary-table-data/price_dollar_rl?lang=fa&order_dir=asc&draw=1&start=N&length=1000`. Downloaded 2026-11-21, 4008 daily rows. Each row has open, low, high, close, change, %, Gregorian date and Jalali date.
- Unit: **rial**. Covers 1390/09/05 to 1405/08/28. Rows are trading days only, about 16–27 per month.
- Value used: the mean of the daily **closing** prices in each Jalali month (kind `monthly_avg`). 1390/09 starts on day 5 and 1405/08 ends on day 28.
- Problems found:
  - In 1394/08 to 1394/11 the closing price is stuck at about 33,8xx–33,9xx rial while that day's high is about 36,000. Bonbast shows about 3,600 toman for the same days. The CBI annual figure for 1394 (34,501 rial) matches bonbast (−0.1%), not tgju (−2.6%). **Bonbast is used for these months.**
  - In 1397/07 to 1397/12 tgju is 3–14% below bonbast. On 1397/08/13 (4 Nov 2018) tgju shows 120,500 rial. Bonbast shows 14,900 toman, and Iran Times reports "149,000 rials on November 4" (https://iran-times.com/regime-has-pushed-rial-down-to-100000-per-us/). The authorities restricted publication of rates in that period. **Bonbast is used for 1397/07–12. Confidence is medium.** On the other side, the CBI annual average for 1397 (103,378 rial) is closer to tgju (−1.2%) than to bonbast (+2.3%). Both values are in usd_crosscheck.csv.
  - In 1404/12 tgju is +3.6% above the CBI monthly unofficial rate. Bonbast is −0.4%. **Bonbast is used.**

### bonbast_github
- Bonbast.com daily archive, mirrored on GitHub by SamadiPour: https://github.com/SamadiPour/rial-exchange-rates-archive. Files used: `jalali/{1391..1405}/full`, fetched from raw.githubusercontent.com. The README says values are in **toman** and taken daily from bonbast.com.
- Covers 1391/07/18 to 1405/08/29. Value used: the mean of the daily USD "sell" price per Jalali month. Some days store the key in upper case (`USD`); both cases are read.
- Overall agreement with tgju: median absolute monthly difference 0.30% over 170 overlapping months. Months that differ by more than 3%: 1391/07 (partial month), 1394/08–11, 1397/07–12, 1399/01 (3.7%, tgju kept), 1404/01 (3.0%), 1404/03 (bonbast +4.2% vs CBI, tgju kept) and 1404/12.
- Live check: bonbast.com on 2026-11-20 showed USD sell 272,900 toman.

### cbi_economic_trends (cross-check only)
- Central Bank of Iran, *Economic Trends*, Excel versions. Sheet "17-Exchange Rate", column "Exchange rate in the unofficial market" (USD/rial).
  - No. 120 (Q1 1404): http://www.cbi.ir/page/33693.aspx
  - No. 122: http://www.cbi.ir/page/35477.aspx
  - No. 123: http://www.cbi.ir/page/36174.aspx
- Unit: rial. Monthly figures cover Dey 1403 to Esfand 1404, and annual figures cover 1400 to 1404.
- Over these 15 months, tgju averages 0.62% absolute difference from the CBI figures and bonbast 0.74%. Annual 1400–1404: tgju is within 0.1–1.1% and bonbast within 0.0–1.0%.
- Retrieval: cbi.ir sits behind a JavaScript challenge, so plain curl from this machine fails. These files came through WebFetch. tsd.cbi.ir, the CBI time-series database, timed out from both routes, so the CBI long annual series could not be pulled directly.

### sci_yearbook_cbi
- Statistical Centre of Iran, Iran Statistical Yearbook, ch. 14 "Financial Intermediation":
  - 1394 edition, table 14.18: https://amar.org.ir/Portals/2/yearbook/1394/14.pdf
  - 1397 edition, table 14.17 "Average rates of major exchanges in the formal exchange market and free market": https://amar.org.ir/Portals/2/yearbook/1397/14.pdf
- Source stated in the table: Central Bank of the I.R. of Iran. Unit: rial, annual averages.
- Free-market USD: 1385 9,226; 1390 13,568; 1391 26,059; 1392 31,839; 1393 32,801 (32,800 in the 1394 edition); 1394 34,501; 1395 36,440; 1396 40,453; 1397 103,378.

### cbi_via_isna_1400
- ISNA report, republished by Aftab News (https://aftabnews.ir/fa/news/749824) and Entekhab (https://www.entekhab.ir/fa/news/658366), Dey 1400.
- The report cites «آمار بانک مرکزی … متوسط قیمت فروش دلار در بازار آزاد تهران» (CBI statistics, average selling price of the dollar in the Tehran free market). Unit: toman, annual.
- Values: 1381 801; 1382 832; 1383 874; 1384 904; 1385 922; 1386 935; 1387 966; 1388 997; 1389 1,044; 1391 2,607; 1392 3,183; 1393 3,280; 1394 3,450; 1395 3,644; 1396 4,045; 1398 12,918; 1399 22,887. The report says CBI gave 1390 only through Dey (1,541).
- Checks: these match the SCI/CBI yearbook values to rounding for 1385 and 1391–1396. They match the IMF parallel rate for 1381 (8,019 rial) and 1382 (8,323 rial).

### imf_cr9827_t57
- IMF Staff Country Report 98/27, *Islamic Republic of Iran: Recent Economic Developments* (April 1998). Statistical Appendix, Table 57, "Exchange Rate Developments, 1991/92–1997/98", PDF pp. 106–108.
- URL: https://www.imf.org/external/pubs/ft/scr/1998/cr9827.pdf (fetched through WebFetch; the IMF returns 403 to this IP).
- The PDF is a scan. Values were read from the page images, rendered at 170 dpi, and checked against tesseract OCR.
- Column used: "Offshore Market". Source: Bank Markazi. Unit: rial per USD.
- Covers Farvardin 1370 to Esfand 1373. From 1374 the column is "...".
- Check: the 12-month means equal the printed annual "Average" rows (1370: 1,418.4 vs 1,418; 1373: 3,087.8 vs 3,088), so the monthly figures are treated as monthly averages.
- Alternative column "Authorized Dealers Market (Nonbank)": identical to the offshore column until Aban 1372. It is lower from Azar 1372, and in 1373 it averages 2,612 against 3,088 offshore. Both columns are in the cross-check file.

### imf_cr02212_t49
- IMF Country Report 02/212, *Islamic Republic of Iran: Selected Issues and Statistical Appendix* (Sept 2002). Table 49, "Exchange Rate Developments, 1997/98–2001/02", PDF pp. 126–127, column "Parallel Market Rate".
- URL: https://www.imf.org/external/pubs/ft/scr/2002/cr02212.pdf (scanned; read from the images).
- Footnote 4: "an amalgamation of the 'agreed rate', local curbs market rate and the Dubai off-shore rate". Unit: rial. Covers Farvardin 1377 to Esfand 1380.
- An earlier vintage, CR 00/120 Table 59 (https://www.imf.org/external/pubs/ft/scr/2000/cr00120.pdf), agrees except for Bahman 1377: 7,966 there against 7,998 here. The newer value is used.
- Means against the printed averages: 1377 6,471 vs 6,468; 1378 8,615 vs **8,634**; 1379 8,188 vs 8,188; 1380 8,009 vs 8,008.
- The 1378 gap traces to the first quarter. CR 04/307 gives Q1 1378 as 8,315, while the months here average 8,297.

### imf_cr04307_t48 (cross-check only)
- IMF Country Report 04/307, *Statistical Appendix*, Table 48. Mirror: https://www.iranwatch.org/sites/default/files/io-imf-countryreport-annex-0904.pdf (text PDF).
- Parallel rate in rial: annual 1377–1382 (6,468; 8,634; 8,188; 8,008; 8,019; 8,323) and quarterly 1378–1382.
- These are the only free-market figures found for 1381–1382 below annual level. They are quarterly, so they are not in the main CSV.

### asriran_198282
- Asr-e Iran, «جدول کامل قیمت دلار در 47 سال گذشته», https://www.asriran.com/fa/news/198282 (first published 1390/11/04, updated Dey 1404). Unit: toman, one value per year.
- **The page names no source**, and from 1388 onward its values are rounded or end-of-year figures. Only 1357–1369 and 1374–1376 are used, because no other source for those years was found.
- Consistency checks:
  - 1370 142 / 1371 149 / 1372 180 match IMF offshore 141.8 / 149.9 / 183.
  - 1373 263 matches the IMF **authorized-dealers** average (261), not offshore (309).
  - 1377 646 and 1378 863 match the IMF parallel rate.
  - 1379–1381 (813 / 792 / 799) are 0.3–1.2% below the IMF figures.
  - 1383–1387 match the CBI/ISNA figures exactly.
- This suggests the page copies the CBI annual "free market" series, but that could not be verified at the source.
- Values worth a second look: 1357 = 10 (no other source found), and 1367 = 96, which is lower than 1366 = 99.

### pwt_official_fred
- Penn World Table exchange rate as served by FRED: "Exchange Rate to U.S. Dollar for Iran" (FXRATEIRA618NUPN), https://fred.stlouisfed.org/data/FXRATEIRA618NUPN.txt.
- Annual **calendar-year** official rate, in rial. It is mapped to the Iranian year that starts in that March: 1350 ↔ 1971, and so on.
- It is used as the free-market value only for 1350–1352. The Ilzetzki–Reinhart–Rogoff "Unified market" file (https://www.ilzetzki.com, `Unified market analysis_1946-2021_June.xlsx`, sheet Unified, column IRN) codes Iran 0 (unified) for 1969M1–1973M12 and 1 (dual/parallel) from 1974M1.

### tgju_sekee (coin)
- TGJU «قیمت سکه امامی», endpoint `.../summary-table-data/sekee`. Unit: rial.
- Daily data from 1389/01/15 to 1405/08/28 (4,346 rows). Value used: the mean of the daily closes per month.
- Cross-check against bonbast `emami1` (toman) over 165 overlapping months: median absolute difference 0.35%. The largest gaps are 1405/01 (7.2%), 1397/08 (4.3%) and 1397/05 (4.0%).
- No coin source before 1389 was found.

## Sources tried and not usable
- The CBI time-series database (tsd.cbi.ir, tsdview.cis.cbi.ir) timed out.
- The CBI Annual Reviews (e.g. 1389, http://www.cbi.ir/page/9497.aspx) give only interbank rates.
- Older issues of CBI *Economic Trends*, which carry monthly unofficial rates, are not listed on the category page, so their URLs could not be found.
- Carmen Reinhart's "Exchange_Rates_(Official And Parallel).xls" has a dead link on her site, and the Wayback Machine was unreachable.
- Pesaran (1992, IJMES) and Mazarei (IMF WP/95/69, 1978–90 monthly parallel rates) are paywalled or blocked. **These are the best leads for monthly 1357–1369 data.**
- IMF CR 99/37, Table 55, also shows "..." for the free market in 1374–1377.
- The SCI yearbooks for 1388–1392 have no free-market table, or their PDFs are damaged.
