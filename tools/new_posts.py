# -*- coding: utf-8 -*-
"""Fun projects that were only ever posted to Telegram or X, written up as posts.

Each entry carries the date of the original channel post or tweet and links back
to it. Body blocks are ('p', text) prose, ('img', file, caption) figures, or
('code', text) blocks. Generates blog/posts/<id>.html and rewrites the rows in
assets/posts.js.

Run from the repo root:  python tools/new_posts.py
"""
import io
import os
import re
import shutil
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'blog', 'posts', 'images')
TG = r"C:\Users\Vahid\Downloads\Telegram Desktop\ChatExport_2026-09-05"
TWZIP = (r"C:\Users\Vahid\Downloads\twitter-2026-09-05-"
         r"3863cc633c6d7d415e64d060ec8194009454c8b30ee3106d7a1351b72e9f95d7.zip")

FA = '۰۱۲۳۴۵۶۷۸۹'
def fa(n):
    return ''.join(FA[int(c)] if c.isdigit() else c for c in str(n))

P = 'p'; I = 'img'; C = 'code'

POSTS = [

# ── 1401 ───────────────────────────────────────────────────────────
dict(id=52, date=(1401, 12, 19), topic='اسنپ', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='هیت‌مپ سوپرمارکت‌هایی که گل‌محمدی معینی‌پور دارند!',
     tg=51, tw='1634293561884540929',
     imgs=[('tg', 51, 0)],
     body=[
      (P, 'یه سری محصول هست که وقتی می‌خوای بخری، مسئله دیگه قیمت نیست؛ مسئله اینه که اصلاً '
          'پیداش می‌کنی یا نه. گل‌محمدی معینی‌پور یکی از همون‌هاست.'),
      (P, 'حالا سوپرمارکت اسنپ برای هر فروشگاه، لیست کامل محصولاتش رو داره. یعنی من می‌تونم '
          'برعکسِ کاری که همه می‌کنن عمل کنم: به‌جای اینکه دنبال فروشگاه بگردم، دنبال محصول '
          'بگردم و ببینم کدوم فروشگاه‌ها دارنش. اطلاعات فروشگاه‌های تهران رو جمع کردم و بعد '
          'هر کدوم که این محصول رو داشتن، روی نقشه گذاشتم.'),
      (I, 0, 'هر نقطه یک سوپرمارکتی است که این محصول را دارد'),
      (P, 'لازم به ذکر است، آدرس دقیق سوپرمارکت‌ها به فروش می‌رسد 😂'),
      (P, 'پ.ن. این رو در جواب <a href="https://x.com/gravita_s/status/1633800194704695296" '
          'target="_blank" rel="noopener">این توییت</a> گذاشته بودم.'),
     ]),

# ── 1403 ───────────────────────────────────────────────────────────
dict(id=53, date=(1403, 2, 8), topic='ابزار وب', cats=['تپه‌نوردی', 'کاربردی'],
     title='یک اکوسیستم تخیلی که همه با هم می‌چرخانیمش',
     tg=109, tw='1784220364333068778',
     imgs=[],
     body=[
      (P, 'یه اکوسیستم تخیلی درست کردم که هر ۲۴ ساعت می‌تونستید سه تا تغییر توش ایجاد کنید. '
          'مثلاً تعداد یه گونه رو کم یا زیاد کنید، یا یه متغیر محیطی رو دست بزنید.'),
      (P, 'هدف این بود که ببینیم با تصمیم‌های جمعیِ چند صد نفر آدم که هیچ‌کدوم همدیگه رو '
          'نمی‌شناسن، این اکوسیستم آخرش به کجا می‌رسه. کل داستان فقط فان بود و هیچ ادعای '
          'علمی‌ای پشتش نبود.'),
      (C, 'https://ecosystem.vahidbaghi.ir'),
      (P, 'این رو فقط برای فان و امتحان کردن یه سری چیزا با FastAPI نوشتم. روی لیارا هم '
          'deploy شده بود.'),
      (P, 'بعد از یه مدت غیرفعالش کردم؛ یعنی لینک بالا دیگه کار نمی‌کنه.'),
     ]),

dict(id=54, date=(1403, 2, 28), topic='تهران و نقشه', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='هیت‌مپ آدم‌های اطرافِ تلگرام در تهران',
     tg=112, tw='1791399886144852361',
     imgs=[('tw', '1791399886144852361', 0)],
     body=[
      (P, 'همون‌طور که می‌دونید تلگرام یه قسمتی داشت به اسم Find People Nearby که افرادی '
          'که اطراف شما بودن و این گزینه رو فعال کرده بودن نشون می‌داد. چیزی که کمتر کسی '
          'بهش فکر می‌کرد این بود که این «اطراف» یه نقطه‌ی ثابت نیست — هر جا که باشی، '
          'لیستِ خودش رو می‌ده.'),
      (P, 'من با API تلگرام به مدت ۱۲ ساعت دیتای کل تهران رو جمع کردم و نتیجه این هیت‌مپ شد.'),
      (I, 0, 'تراکم افرادی که Find People Nearby را روشن گذاشته بودند'),
      (P, 'هر چقدر دیتای بیشتری در مدت زمان بیشتری جمع بشه، نقشه دقیق‌تر می‌شه. من فقط از '
          '۱۲ شب تا ۱۲ ظهر دیتا جمع کردم و کلاً اطلاعات حدود ۱۰ هزار نفره. صرفاً دوست داشتم '
          'این ایده که مدت‌هاست تو ذهنمه رو تست کنم.'),
      (P, 'نکته‌ی نگران‌کننده‌تر این بود که تلگرام فاصله‌ی تقریبی هر نفر رو هم می‌ده. یعنی با '
          'تکنیکی مثل trilaterate — سه بار اندازه‌گیری از سه نقطه‌ی مختلف — می‌شه مختصات '
          'تقریبی خودِ فرد رو پیدا کرد. من این کار رو نکردم، ولی شدنی بود.'),
      (P, 'پ.ن. مدتی بعد تلگرام کلاً این فیچر رو حذف کرد. نمی‌دونم ربطی داشت یا نه 😁'),
     ]),

dict(id=55, date=(1403, 3, 7), topic='ابزار وب', cats=['تپه‌نوردی', 'کاربردی'],
     title='بازی‌ای که برنده‌اش هیچ‌کس نیست',
     tg=113, tw=None,
     imgs=[],
     body=[
      (P, 'یه بازی گروهی خیلی ساده ساختم: یه نقطه روی صفحه‌ی مختصات هست و هدف اینه که '
          'با مشارکت جمعی به نقطه‌ی (۱۰۰۰۰ , ۱۰۰۰۰) برسید. هر کسی می‌تونه یه قدم برداره، '
          'ولی هیچ‌کس به‌تنهایی نمی‌تونه ببرتش.'),
      (P, 'از لینک زیر می‌تونید بازی رو انجام بدید:'),
      (C, 'https://coordinate-game.liara.run'),
      (P, 'با FastAPI نوشته شده و روی لیارا مستقر شده.'),
      (P, 'در حال حاضر اسپانسر نداره، ولی اگر پیدا بشه به برنده جایزه هم تعلق می‌گیره :)'),
     ]),

dict(id=56, date=(1403, 3, 17), topic='امنیت', cats=['تپه‌نوردی'],
     title='کد مورس همستر را از کجا می‌آوردم؟',
     tg=138, tw='1798853521925894192',
     imgs=[],
     body=[
      (P, 'اون روزها همستر کامبت هر روز یه «کد مورس» می‌داد که اگر واردش می‌کردی یه مقدار '
          'سکه می‌گرفتی. کد هر روز ساعت مشخصی می‌اومد و ملت منتظر می‌موندن تا یکی لوش بده.'),
      (P, 'من رفتم سراغ خودِ درخواست‌هایی که اپلیکیشن به سرور می‌زنه. معلوم شد cipher قبل '
          'از اینکه رسماً منتشر بشه، از سرور قابل گرفتنه. یعنی یه باگ داشتن که می‌شد کد '
          'رو زودتر فهمید.'),
      (P, 'یه کد ساده نوشتم که مستقیم به سرور همستر درخواست می‌فرسته، cipher رو می‌گیره، '
          'رمزگشایی می‌کنه و نشون می‌ده. خیلی ساده بود و ممکن بود هر لحظه از کار بیفته، '
          'ولی اون موقع کار می‌کرد:'),
      (C, 'https://vahidbaghi.ir/hamster-morse-code.php'),
      (P, 'مثلاً یه روز کد مورس <code>QlR4D</code> بود که ۹ ساعت بعد تازه قرار بود بیاد 😂'),
     ]),

dict(id=57, date=(1403, 4, 10), topic='بازار و مصرف', cats=['تپه‌نوردی'],
     title='کدام شامپو واقعاً به‌صرفه است؟',
     tg=144, tw='1807464122176712908',
     imgs=[('tg', 144, 0), ('tg', 145, 0)],
     body=[
      (P, 'داشتم فکر می‌کردم کدوم شامپو از بقیه قیمت بهتری داره. مشکل اینه که شامپوها تو '
          'حجم‌های مختلف فروخته می‌شن و مقایسه‌ی قیمتِ روی برچسب هیچ معنی‌ای نداره. '
          'چیزی که باید مقایسه بشه نسبت وزن به قیمته.'),
      (P, 'پس نمودار نسبت وزن به قیمت رو رسم کردم و نتیجه این شد:'),
      (I, 0, 'بیست شامپوی اول بر اساس مقدار شامپو به ازای هر تومان'),
      (I, 1, 'رتبه‌های ۲۰ تا ۴۰'),
      (P, 'اختلاف بین سر و ته لیست اون‌قدر زیاده که واقعاً ارزش نگاه‌کردن داره.'),
      (P, 'پ.ن. این دو تا نمودار رو در حالی کدش رو نوشتم که دستشویی داشتم و سریع جمعش کردم :)'),
     ]),

dict(id=58, date=(1403, 6, 19), topic='اعداد', cats=['تپه‌نوردی'],
     title='در چهل سال گذشته چند روز تعطیل بوده‌ایم؟',
     tg=160, tw='1832899996213199063',
     imgs=[('file', 'plot2.png'), ('tw', '1833190531683230135', 0), ('file', 'plot1.png')],
     body=[
      (P, 'برام جالب بود بدونم در طول سال‌ها و ماه‌های مختلف، چه تعداد تعطیلی رسمی '
          '(به‌جز جمعه) داشتیم. نمودار زیر مربوط به سال‌های ۱۳۷۰ تا ۱۴۱۰ است.'),
      (I, 0, 'تعداد تعطیلی رسمی به‌جز جمعه، از ۱۳۷۰ تا ۱۴۱۰'),
      (P, 'حالا یه حالت دیگه هم هست. اگر بین‌التعطیلی رو هم حساب کنیم — مثلاً یکشنبه تعطیل '
          'باشه و جمعه هم که تعطیله، پس عملاً سه روز تعطیلی داریم — نمودار این شکلی می‌شه:'),
      (I, 1, 'همان نمودار، این بار با احتساب بین‌التعطیلی'),
      (P, 'و اگر علاوه بر جمعه، پنجشنبه‌ها رو هم حذف کنیم نتیجه این می‌شه:'),
      (I, 2, 'تعطیلی رسمی به‌جز پنجشنبه‌ها و جمعه‌ها'),
     ]),

dict(id=59, date=(1403, 9, 1), topic='اسنپ', cats=['تپه‌نوردی', 'کاربردی'],
     title='اسنپ بهینه، این بار با یک رابط کاربری درست‌وحسابی',
     tg=174, tw='1859233197206237671',
     imgs=[],
     body=[
      (P, 'سه سال پیش، دوران سربازی، یه اسکریپت نوشته بودم که بهم می‌گفت اگر چند ده متر '
          'جابه‌جا بشم، کرایه‌ی اسنپ چقدر فرق می‌کنه (<a href="/blog/posts/6.html">یافتن '
          'نقطهٔ بهینه موقع گرفتن اسنپ!</a> و <a href="https://x.com/vahidbaghi95/status/'
          '1474311718314647556" target="_blank" rel="noopener">توییتش</a>). اون موقع فقط '
          'برای خودم بود و خروجیش هم یه مشت عدد توی ترمینال.'),
      (P, 'حالا یه UI براش ساختم و یه مقدار تغییرش دادم که بقیه هم بتونن استفاده کنن:'),
      (C, 'https://vahidbaghi.ir/snapp-snap/'),
      (P, 'منطقش همون قبلیه — نقاط اطراف مبدأ رو نمونه‌برداری می‌کنه و قیمت رو مقایسه '
          'می‌کنه — فقط این بار لازم نیست کد اجرا کنی.'),
     ]),

dict(id=60, date=(1403, 10, 3), topic='اعداد', cats=['تپه‌نوردی'],
     title='هر چند وقت یک بار می‌روم سلمونی؟',
     tg=253, tw='1871202852133364072',
     imgs=[('tg', 253, 0), ('tw', '1871202852133364072', 0)],
     body=[
      (P, 'داشتم فکر می‌کردم فاصله‌ی زمانی بین هر دفعه که می‌رم سلمونی چقدره. من تقریباً '
          'همه‌چیز رو log می‌کنم و آمارشون رو دارم، پس دیتاش بود.'),
      (P, 'نمودارش رو کشیدم و نتیجه این شد:'),
      (I, 0, 'فاصلهٔ بین هر دو نوبت'),
      (I, 1, 'ساعتی که می‌روم'),
      (P, 'به‌طور میانگین هر ۳۰ روز می‌رم، و تقریباً همیشه بین ساعت ۱۷ تا ۲۰ :)'),
      (P, 'زمان صرف‌شده برای رسم این نتایج: ۱۰ دقیقه. ارزشش رو داشت؟ نمی‌دونم.'),
     ]),

dict(id=61, date=(1403, 11, 10), topic='زبان فارسی', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='۵۴ کلمه‌ای که همهٔ شاعران فارسی به کار برده‌اند',
     tg=185, tw='1884264994889687393',
     imgs=[('tw', '1884264994889687393', 0), ('tg', 185, 0)],
     body=[
      (P, 'قبلاً یه بار رفتم سراغ گنجور و کل شعر فارسی رو شخم زدم (<a href="/blog/posts/14.html">'
          'سفر به دنیای گنجور!</a>). این بار سؤالم فرق می‌کرد: چه کلماتی هست که <strong>همه‌ی</strong> شاعرها، بدون استثنا، تو شعرشون '
          'به کار بردن؟'),
      (P, 'کار خیلی ساده‌ست. لیست تمام کلمات هر یک از شاعران رو استخراج کردم، بعد اشتراک '
          'همه‌ی لیست‌ها رو گرفتم. جواب می‌شه ۵۴ کلمه.'),
      (P, 'حالا اگر حروف ربط و اضافه، ضمایر، کلمات پرسشی و شرطی و افعال رو حذف کنیم، '
          'چیزی که باقی می‌مونه این می‌شه:'),
      (I, 0, 'کلمات مشترک همهٔ شاعران فارسی‌زبان'),
      (P, 'و اگر حذف نکنیم، می‌شه این:'),
      (I, 1, 'همان ۵۴ کلمه، بدون حذف کلمات دستوری'),
     ]),

# ── 1404 ───────────────────────────────────────────────────────────
dict(id=62, date=(1403, 12, 26), topic='تهران و نقشه', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='نقشهٔ ارتفاع ساختمان‌های تهران',
     tg=199, tw=None,
     imgs=[('tg', 199, 0), ('tg', 200, 0)],
     body=[
      (P, 'نقشه‌ی ارتفاع ساختمان‌های تهران. هر چی از سبز به سمت قرمز می‌ریم، ارتفاع '
          'ساختمون‌ها بیشتره. داخل Legend رنج ارتفاع نوشته شده.'),
      (I, 0, 'میانگین ارتفاع ساختمان‌ها در شعاع ۵۰ متری'),
      (P, 'نکته‌ی مهم اینه که این تخمین نیست! یعنی با آنالیز نقشه‌های ماهواره‌ای به دست '
          'نیومده. شعاع رو هم ۵۰ متر گرفتم؛ یعنی میانگین ارتفاع ساختمون‌ها در یک شعاع '
          '۵۰ متری رنگ رو مشخص می‌کنه.'),
      (P, 'برای اینکه بهتر نقشه رو درک کنید: ارتفاع ساختمون ۴ طبقه حدود ۱۵ متر در نظر '
          'گرفته شده. نقشه رو هم با <a href="https://kepler.gl" target="_blank" '
          'rel="noopener">kepler.gl</a> رسم کردم — دیتا رو آماده کردم و import کردم.'),
      (P, 'حالا همین دیتا یه چیز دیگه هم داشت. می‌دونستید ساختمون‌هایی داریم که تا ۹ طبقه '
          'زیر زمین ساختن؟'),
      (I, 1, 'عددِ داخل Legend اینجا تعداد طبقات زیرِ زمین است'),
      (P, 'پ.ن. دیتا رو به اشتراک نمی‌ذارم، بنابراین درخواستش رو نکنید.'),
     ]),

dict(id=63, date=(1404, 1, 15), topic='رسانه', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='سریال‌هایی که هر فصلشان بهتر تمام می‌شود',
     tg=221, tw=None,
     imgs=[],
     body=[
      (P, 'داشتم فکر می‌کردم آیا سریالی وجود داره که امتیاز همه‌ی فصل‌هاش صعودی باشه؟ '
          'یعنی سریال‌هایی که هر فصلشون رو که شروع می‌کنی اولش خیلی جذاب نیست و هر چی به '
          'انتهای فصل نزدیک می‌شی جذاب‌تر می‌شه — و این الگو رو <strong>همه‌ی</strong> '
          'فصل‌ها داشته باشن.'),
      (P, 'مثلاً یه سریال با این امتیازها:'),
      (C, 's1 : [7.1, 7.4, 7.8]\ns2 : [7.4, 7.6, 7.6]\ns3 : [7.3, 7.3, 7.5]'),
      (P, 'هر سه فصل روند صعودی دارن، پس قبوله. حالا اگر فصل ۲ به‌جای بهتر شدن، بدتر '
          'می‌شد، دیگه توی این فیلتر نمی‌اومد. چون از سه فصل، فقط دو فصلش صعودی بوده.'),
      (P, 'دیتاست IMDb طبیعتاً realtime نیست. فیلترهایی که در پیش‌پردازش گذاشتم:'),
      (P, '۱. فقط سریال‌هایی که همه‌ی فصل‌هاشون حداقل ۱۰۰۰ رأی داشتن.<br>'
          '۲. سریال‌هایی که حتی یک اپیزود با امتیاز کمتر از ۷ داشتن رو حذف کردم.<br>'
          '۳. فقط سریال‌هایی که هر فصلشون حداقل ۳ اپیزود داشته.'),
      (P, 'لیست سریال‌ها:'),
      ('html', '<table class="dataframe"><thead><tr><th></th><th>title</th><th>year</th>'
               '<th>rating</th></tr></thead><tbody>' + ''.join(
          '<tr><th class="num">%d</th><td class="l"><a href="https://www.imdb.com/title/%s/" '
          'target="_blank" rel="noopener">%s</a></td><td class="num">%d</td>'
          '<td class="num">%.1f</td></tr>' % (i, tt, name, year, rating)
          for i, (tt, name, year, rating) in enumerate([
              ('tt10166622', 'The Dropout', 2022, 7.5),
              ('tt13138834', 'Time', 2021, 8.2),
              ('tt13651632', 'Night Stalker: The Hunt for a Serial Killer', 2021, 7.5),
              ('tt3581932', 'And Then There Were None', 2015, 7.8),
              ('tt6954652', 'Jack Taylor', 2010, 7.4),
              ('tt7985576', 'The Serpent', 2021, 7.6),
              ('tt9425132', 'Conversations with a Killer: The Ted Bundy Tapes', 2019, 7.7),
          ])) + '</tbody></table>'),
      (P, 'لیست خیلی کوتاه‌تر از چیزی بود که فکر می‌کردم.'),
     ]),

dict(id=64, date=(1404, 2, 14), topic='رسانه', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='ژانرهای IMDb زیر ذره‌بین!',
     tg=255, tw=None,
     imgs=[('tg', 255, 0), ('tg', 257, 0), ('tg', 260, 0), ('tg', 256, 0)],
     body=[
      (P, 'دیتاست عمومی IMDb رو برداشتم و رفتم سراغ یه سؤال ساده: میانگین امتیاز فیلم‌ها '
          'و سریال‌ها در ژانرهای مختلف چقدره؟ فایل‌هایی که استفاده کردم اینا بودن:'),
      (C, 'https://datasets.imdbws.com/title.episode.tsv.gz\n'
          'https://datasets.imdbws.com/title.ratings.tsv.gz'),
      (P, 'در نمودار زیر، رنگ قرمز سریال‌هاست و رنگ آبی که زیر نمودار قرمز قرار گرفته، '
          'فیلم‌ها. یعنی تقریباً در هر ژانری، سریال‌ها امتیاز بالاتری می‌گیرن.'),
      (I, 0, 'میانگین امتیاز فیلم‌ها و سریال‌ها به تفکیک ژانر'),
      (P, 'نمودار قبلی رو می‌شه یه جور دیگه هم دید. محور افقی: میانگین امتیاز فیلم‌ها در اون '
          'ژانر. محور عمودی: میانگین امتیاز سریال‌ها در اون ژانر. همون‌طور که از نمودار قبلی '
          'هم مشخصه، ژانر News توی فیلم‌ها میانگین امتیاز بالاتری داره.'),
      (I, 3, 'مقایسهٔ امتیاز فیلم و سریال برای هر ژانر'),
      (P, 'میانگین به‌تنهایی گول‌زننده‌ست، پس همین امتیازها رو از دید Box Plot هم نگاه کردم '
          'که ببینم میانه و پراکندگی در ژانرهای مختلف چه شکلیه:'),
      (I, 1, 'توزیع امتیازها در هر ژانر'),
      (P, 'و آخرین چیزی که برام جالب بود، روند میانگین امتیازها در طول زمان بود:'),
      (I, 2, 'روند میانگین امتیاز ژانرها در طول سال‌ها'),
     ]),

dict(id=65, date=(1404, 2, 19), topic='بازار و مصرف', cats=['تپه‌نوردی', 'کاربردی'],
     title='ارزان‌ترین و گران‌ترین کالای دیجی‌کالا، هر ۱۲ ساعت',
     tg=267, tw=None,
     imgs=[],
     body=[
      (P, 'به عنوان یه کار فان، یه کد ساده نوشتم توی Cloudflare Worker که هر ۱۲ ساعت '
          'می‌آد ارزون‌ترین و گرون‌ترین محصول دیجی‌کالا رو پیدا می‌کنه و لاگش رو نگه می‌داره.'),
      (C, 'http://digikala-price-history.vahidbaghi.ir/'),
      (P, 'هدف؟ هیچی!'),
     ]),

dict(id=66, date=(1404, 4, 30), topic='اسنپ', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='گران‌ترین محصول هر دسته در سوپرمارکت‌های اسنپ',
     tg=317, tw=None,
     imgs=[('tg', 317, 0)],
     body=[
      (P, 'من موقع خرید کردن خیلی مرتب‌کردن بر اساس قیمت رو دوست دارم. یعنی حتی از '
          'سوپرمارکت بخوام پفک هم بخرم، از گران‌ترین به ارزان‌ترین مرتب می‌کنم و بعد '
          'داخل لیست می‌آم پایین و طبق اون بودجه‌ای که می‌خوام خرج کنم یه چیزی رو '
          'انتخاب می‌کنم.'),
      (P, 'بعد برام سؤال شد که گرون‌ترین محصول هر دسته‌بندی در کل سوپرمارکت‌های اسنپ '
          'تهران چیه؟'),
      (P, 'اول دیتا رو جمع کردم و بعد آنومالی‌های قیمت رو حذف کردم — چون قیمت بعضی '
          'محصولات اشتباه درج شده بود. مثلاً سرکه چرا باید ۶۸ میلیون تومن باشه؟ — و '
          'بعد این نمودار رو رسم کردم:'),
      (I, 0, 'گران‌ترین محصول هر دسته‌بندی'),
      (P, 'فایل html رو هم همین‌جا می‌ذارم که بتونید خودتون هر دسته‌بندی رو باز کنید '
          '(از منوی بالای نمودار):'),
      ('embed', 'snapp_supermarket_top20.html', '۲۰ محصول گران هر دسته‌بندی', 620),
      (P, 'تنها نکته‌ای که به نظرم می‌رسه اینه که بعضی سوپرمارکت‌ها بعضی محصولات رو خیلی '
          'بیشتر از قیمتی که هست به مشتری فرو می‌کنن. آنومالی قیمت نیستا؛ مثلاً یه محصولی '
          '۸۰۰ تومنه، می‌فروشه ۱۵۰۰.'),
      (P, 'بازم من نظری روی valid بودن یا نبودن دیتا ندارم. قیمت بعضی محصولات عجیبه؛ حالا '
          'ممکنه اشتباه قیمت‌گذاری موقتی باشه یا گرون‌فروشی. دلیل اینکه ۲۰ تا گرون‌ترین '
          'محصول هر دسته رو انتخاب کردم دقیقاً همین بود.'),
     ]),

dict(id=67, date=(1404, 7, 24), topic='امنیت', cats=['کاربردی'],
     title='ساده‌ترین فیلتر اسپمی که تا حالا نوشته‌ام',
     tg=404, tw=None,
     imgs=[],
     body=[
      (P, 'پلاگین Akismet رو احتمالاً بشناسید. شما کافیه یه صفحه‌ی «تماس با ما» وردپرسی '
          'داشته باشی تا این ربات‌های اسپم قشنگ سرویست کنن.'),
      (P, 'من یه ترفندی زدم که تا الان جواب داده — یعنی حتی یک خطا هم نداشته. پیامی که '
          'توی فرم تماس گذاشته می‌شه، یا شماره تلفن داره یا نداره. اگر داره و با <code>09</code> '
          'شروع نمی‌شه، پاکش می‌کنم. به همین راحتی.'),
      (P, 'یعنی این ربات‌هایی که تا الان برای من کامنت می‌ذاشتن، همه‌شون همین‌جوری بودن.'),
     ]),

# ── 1405 ───────────────────────────────────────────────────────────
dict(id=68, date=(1404, 11, 21), topic='ابزار وب', cats=['تپه‌نوردی', 'کاربردی'],
     title='ابعاد کیس کامپیوتر را سه‌بعدی مقایسه کن',
     tg=496, tw=None,
     imgs=[],
     body=[
      (P, 'وقتی می‌خوای کیس کامپیوتر بخری، تنها چیزی که واقعاً مهمه اینه که جا می‌شه یا نه. '
          'ولی چیزی که می‌بینی سه تا عدده که هیچ حسی بهت نمی‌ده.'),
      (P, 'یه چیزی نوشتم که ابعاد جعبه‌ی کیس‌های موجود در ترب رو واکشی می‌کنه و می‌تونی '
          'به صورت سه‌بعدی با هم مقایسه‌شون کنی.'),
      (P, 'می‌تونستم دیتا رو یه بار از ترب بگیرم و روی GitHub Pages بذارم، اما می‌خواستم '
          'live باشه؛ همون لحظه درخواست بزنه. برای همین باید لوکال اجراش کنی:'),
      (C, 'python -m http.server'),
      (P, 'کافیه فایل رو دانلود کنی، توی پوشه‌ای که هست cmd باز کنی، دستور بالا رو بزنی '
          'و بعد فایل html رو باز کنی:'),
      (P, '<a href="/hobby/compare-boxes.html" download>compare-boxes.html</a>'),
     ]),

dict(id=69, date=(1405, 4, 24), topic='اعداد', cats=['تپه‌نوردی', 'وب‌نوردی'],
     title='مردم کِی دلار می‌خرند؟',
     tg=620, tw=None,
     imgs=[],
     body=[
      (P, 'همین‌جوری کرمم گرفت. آدرس ولت USDT ایرانی‌کارت در شبکه‌ی BSC رو گرفتم و صرفاً '
          'یک ماه گذشته رو بررسی کردم که ببینم نمودار خرید دلار توسط مردم چه شکلی بوده.'),
      (P, 'تراکنش‌های بلاک‌چین عمومی‌ان؛ فقط باید بدونی کدوم آدرس مال کیه.'),
      ('embed', 'bsc_exchange_purchases.html',
       'تعداد و حجم دلاری خرید روزانه، از ۱۴۰۵/۰۳/۱۹ تا ۱۴۰۵/۰۴/۲۳', 700),
      (P, 'تو این یه ماه ۵۰۴۷ تا خرید ثبت شده، جمعاً حدود ۷۸۶ هزار دلار. اوجش ۱۴۰۵/۰۴/۱۷ '
          'با ۳۱۳ خرید در یک روز.'),
      (P, 'جالب بود که قیمت دلار رفته بود بالا، ملت خریدشون زیاد شده؛ و قیمت اومده پایین، '
          'خریدشون کم شده!'),
     ]),

dict(id=70, date=(1405, 5, 16), topic='امنیت', cats=['تپه‌نوردی'],
     title='یک چالش وب‌اسکرپینگ که خودش خودش را می‌شکند',
     tg=658, tw=None,
     imgs=[],
     body=[
      (P, 'چند درصد آخر ظرفیت هفتگی Claude مونده بود، گفتم یه کاری کنم که تموم بشه. '
          'اومدم باهاش یه چالش web scraping درست کنم: یک صفحه‌ی مقاوم که نشه دیتاش رو '
          'راحت برداشت.'),
      (P, 'البته از اول هم می‌دونستم هیچ راهی در مقابل OCR وجود نداره. فقط می‌شه کار رو '
          'سخت کرد که طول بکشه طرف اسکرین‌شات بگیره و بعد OCR کنه. یا نهایتاً می‌تونی '
          'rate limit سختی بذاری که هر اکانت مثلاً ۱۰ تا رکورد بتونه ببینه.'),
      (P, 'روال کار این شد: بهش می‌گفتم می‌خوام فتح پرچم انجام بدی. می‌رفت خودش رو دو '
          'ساعت پاره می‌کرد و بعد موفق می‌شد. نتایج رو دوباره تو یه سشن دیگه می‌دادم به '
          'خودش و می‌گفتم در مقابل این هم مقاومش کن. این کار رو بارها به شکل‌های مختلف '
          'انجام دادم — یعنی خودش attack طراحی می‌کرد و خودش در مقابل همون attack '
          'مقاومش می‌کرد.'),
      (P, 'اما هنوز هم تو یک سشن دیگه که بهش می‌گم پرچم رو فتح کن، دوباره موفق می‌شه.'),
      (P, 'برام کلاً سؤال شده که تا کجا می‌خواد ادامه بده. یعنی چقدر سوراخ وجود داره که '
          'هنوز پیداشون نکرده.'),
      (P, 'نتیجه که به یه جای مناسبی رسید، لینکش رو می‌ذارم.'),
     ]),
]


# ── image plumbing ─────────────────────────────────────────────────
def grab_images(spec):
    """Copy the source images next to the post and return their file names."""
    out = []
    tz = None
    for n, ref in enumerate(spec['imgs']):
        dest = '%d-%d.jpg' % (spec['id'], n + 1)
        if ref[0] == 'file':
            dest = '%d-%d%s' % (spec['id'], n + 1, os.path.splitext(ref[1])[1])
        dp = os.path.join(IMG, dest)
        if ref[0] == 'file':
            # a chart that was sent as a document rather than a photo
            shutil.copyfile(os.path.join(TG, 'files', ref[1]), dp)
        elif ref[0] == 'tg':
            import json
            m2p = json.load(io.open(os.path.join(
                os.path.dirname(os.path.abspath(__file__)), 'tg_photos.json'), encoding='utf-8'))
            pics = [p for p in m2p.get(str(ref[1]), []) if '_thumb' not in p]
            src = os.path.join(TG, pics[ref[2]].replace('/', os.sep))
            shutil.copyfile(src, dp)
        else:
            if tz is None:
                tz = zipfile.ZipFile(TWZIP)
            names = [x for x in tz.namelist()
                     if x.startswith('data/tweets_media/' + ref[1] + '-')]
            names.sort()
            with open(dp, 'wb') as f:
                f.write(tz.read(names[ref[2]]))
        out.append(dest)
    return out


# ── page emitting ──────────────────────────────────────────────────
PAGE = '''<!DOCTYPE html>
<html lang="fa">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — وحید باقی</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Vazirmatn:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/lab.css">
<style>
.meta{{display:flex;gap:9px;align-items:center;flex-wrap:wrap;color:var(--jp-ui-font-color2);
  font-size:12.5px;margin:-.2em 0 1.5em;max-width:none}}
.meta .dot{{width:3px;height:3px;border-radius:50%;background:var(--jp-border2);flex:0 0 3px}}
.meta .tag{{border:1px solid var(--jp-border2);border-radius:2px;padding:0 7px;font-size:11.5px}}
.meta .mono{{direction:ltr;font-family:"JetBrains Mono",Menlo,monospace}}
.mono{{font-family:"JetBrains Mono",Menlo,monospace;font-size:12.5px}}
.figout{{margin:0;display:flex;flex-direction:column;align-items:center;text-align:center}}
.figout img{{max-width:min(100%,720px);height:auto;border:1px solid var(--jp-border1);
  border-radius:2px;display:block;margin:0 auto}}
.figout figcaption{{color:var(--jp-ui-font-color2);font-size:12px;padding-top:8px;
  max-width:60ch;text-align:center}}
.src-note{{border-inline-start:3px solid var(--jp-border2);padding:2px 14px;
  color:var(--jp-ui-font-color2);font-size:13px}}
.src-note a{{color:var(--jp-brand1)}}
</style>
</head>
<body>
<div id="cells" hidden>
{cells}</div>
<script src="/assets/lab.js"></script>
<script>
Lab.chrome({{ active:'post', tab:{{ name:'post_{id:02d}.ipynb', href:'/blog/posts/{id}.html' }} }});
Lab.wire();
Lab.kernel(false);
</script>
</body>
</html>
'''

def md_cell(inner):
    return ('  <div class="jp-cell">\n    <div class="jp-collapser"></div>\n'
            '    <div class="jp-md rtl">%s</div>\n  </div>\n' % inner)

def out_cell(n, inner):
    return ('  <div class="jp-cell">\n    <div class="jp-collapser"></div>\n'
            '    <div class="jp-inner"><div class="jp-io">\n'
            '      <div class="jp-prompt out">Out[%d]:</div>\n'
            '      <div class="jp-outputs">%s</div>\n'
            '    </div></div>\n  </div>\n' % (n, inner))

def in_cell(n, code):
    return ('  <div class="jp-cell">\n    <div class="jp-collapser"></div>\n'
            '    <div class="jp-inner"><div class="jp-io">\n'
            '      <div class="jp-prompt">[%d]:</div>\n'
            '      <div class="jp-editor"><pre>%s</pre></div>\n'
            '    </div></div>\n  </div>\n' % (n, code))


def build(spec, index):
    files = grab_images(spec)
    y, m, d = spec['date']
    parts = []
    meta = ('<span class="mono">%s/%s/%s</span><span class="dot"></span>%s'
            '<span class="dot"></span><span>%s</span>'
            % (fa(y), fa('%02d' % m), fa('%02d' % d),
               ''.join('<span class="tag">%s</span>' % c for c in spec['cats']),
               spec['topic']))
    parts.append(md_cell('\n      <h1>%s</h1>\n      <div class="meta">%s</div>\n    '
                         % (spec['title'], meta)))

    n_out = n_in = 0
    first = ''
    for block in spec['body']:
        if block[0] == P:
            if not first:
                first = re.sub(r'<[^>]+>', '', block[1])[:150]
            parts.append(md_cell('\n      <p>%s</p>\n    ' % block[1]))
        elif block[0] == C:
            n_in += 1
            parts.append(in_cell(n_in, block[1]))
        elif block[0] == 'html':
            n_out += 1
            parts.append(out_cell(n_out, block[1]))
        elif block[0] == 'embed':
            # an interactive html file shared alongside the post, in blog/posts/files/
            n_out += 1
            parts.append(out_cell(n_out,
                '<figure class="figout"><div class="embed"><iframe src="files/%s" '
                'height="%d" loading="lazy" title="%s"></iframe>'
                '<a class="open" href="files/%s" target="_blank" rel="noopener">'
                'باز کردن در صفحهٔ جدا ↗</a></div><figcaption>%s</figcaption></figure>'
                % (block[1], block[3], block[2], block[1], block[2])))
        else:
            n_out += 1
            parts.append(out_cell(n_out,
                '<figure class="figout"><img src="images/%s" alt="%s" loading="lazy">'
                '<figcaption>%s</figcaption></figure>'
                % (files[block[1]], block[2], block[2])))

    # where it first appeared
    links = []
    if spec.get('tg'):
        links.append('<a href="https://t.me/Dataphil/%d" target="_blank" rel="noopener">'
                     'کانال تلگرام</a>' % spec['tg'])
    if spec.get('tw'):
        links.append('<a href="https://x.com/vahidbaghi95/status/%s" target="_blank" '
                     'rel="noopener">توییت</a>' % spec['tw'])
    parts.append(md_cell(
        '\n      <div class="src-note"><p style="margin:0">این کار را اول در %s گذاشتم؛ '
        'این نوشته همان است، کمی کامل‌تر.</p></div>\n    ' % ' و '.join(links)))

    # prev / next
    ids = sorted(index)
    pos = ids.index(spec['id'])
    nav = []
    if pos > 0:
        nav.append(('prev', index[ids[pos - 1]]))
    if pos < len(ids) - 1:
        nav.append(('next', index[ids[pos + 1]]))
    if nav:
        rows = ''.join(
            '<tr><th class="l mono">%s</th><td><a href="%s">%s</a></td>'
            '<td class="num">%s/%s</td></tr>'
            % (k, r['href'], r['title'], fa(r['y']), fa('%02d' % r['m']))
            for k, r in nav)
        parts.append(
            '  <div class="jp-cell">\n    <div class="jp-collapser"></div>\n'
            '    <div class="jp-inner">\n'
            '      <div class="jp-io"><div class="jp-prompt">[%d]:</div>\n'
            '        <div class="jp-editor"><pre>nb<span class="o">.</span>'
            '<span class="f">neighbours</span>()</pre></div></div>\n'
            '      <div class="jp-io"><div class="jp-prompt out">Out[%d]:</div>\n'
            '        <div class="jp-outputs"><table class="dataframe"><thead><tr><th></th>'
            '<th>title</th><th>date</th></tr></thead><tbody>%s</tbody></table></div></div>\n'
            '    </div>\n  </div>\n' % (n_in + 1, n_out + 1, rows))

    return PAGE.format(title=spec['title'], desc=first.replace('"', "'"),
                       cells=''.join(parts), id=spec['id'])


def main():
    src = io.open(os.path.join(ROOT, 'assets', 'posts.js'), encoding='utf-8').read()
    rows = re.findall(
        r'^\[(\d+),"([^"]*)",(\d+),(\d+),(\d+),"([^"]*)",\[([^\]]*)\],"([^"]*)","([^"]*)"\],?$',
        src, re.M)
    index, keep = {}, []
    mine = {s['id'] for s in POSTS}
    for r in rows:
        i = int(r[0])
        if i <= 51:
            index[i] = {'title': r[1], 'y': int(r[2]), 'm': int(r[3]), 'href': r[8]}
            keep.append(r)
        elif i in mine:
            continue                                      # regenerated below
        elif i < 100:
            keep.append(('%d' % (i + 49),) + r[1:])      # hobby moves to 101-108
        else:
            keep.append(r)
    for s in POSTS:
        index[s['id']] = {'title': s['title'], 'y': s['date'][0], 'm': s['date'][1],
                          'href': '/blog/posts/%d.html' % s['id']}

    for s in POSTS:
        html = build(s, index)
        io.open(os.path.join(ROOT, 'blog', 'posts', '%d.html' % s['id']),
                'w', encoding='utf-8', newline='').write(html)
        print('wrote post %d — %s' % (s['id'], s['title']))

    lines = ['/* every post and interactive notebook on the site, with its real date */',
             'var POSTS=[']
    def row(r):
        return ('[%s,"%s",%s,%s,%s,"%s",[%s],"%s","%s"],'
                % (r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]))
    for r in keep:
        if int(r[0]) <= 51:
            lines.append(row(r))
    for s in POSTS:
        lines.append('[%d,"%s",%d,%d,%d,"پست",[%s],"%s","/blog/posts/%d.html"],'
                     % (s['id'], s['title'], s['date'][0], s['date'][1], s['date'][2],
                        ','.join('"%s"' % c for c in s['cats']), s['topic'], s['id']))
    for r in keep:
        if int(r[0]) > 51:
            lines.append(row(r))
    lines.append('];')
    io.open(os.path.join(ROOT, 'assets', 'posts.js'), 'w',
            encoding='utf-8', newline='').write('\n'.join(lines) + '\n')
    print('\nposts.js now has %d rows' % (len([r for r in keep]) + len(POSTS)))


if __name__ == '__main__':
    main()
