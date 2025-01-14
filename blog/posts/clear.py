

import re
import jdatetime

import re
import jdatetime

# Function to convert numbers to Persian (Farsi)
def to_persian_numbers(number):
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    english_digits = "0123456789"
    translation_table = str.maketrans(english_digits, persian_digits)
    return number.translate(translation_table)

# Function to normalize and correct dates
def correct_dates(html):
    def fix_date(match):
        raw_date = match.group(1).strip()
        # Try parsing the date based on possible formats
        for fmt in ["%d/%m/%Y", "%Y/%m/%d", "%d-%m-%Y", "%d/%m/%y"]:
            try:
                # Parse the date and convert to jdatetime
                parsed_date = jdatetime.datetime.strptime(raw_date, fmt)
                formatted_date = parsed_date.strftime("%Y/%m/%d")
                return f'<span class="date">{to_persian_numbers(formatted_date)}</span>'
            except ValueError:
                continue
        return f'<span class="date">INVALID_DATE</span>'

    # Regex to find all dates within <span class="date">...</span>
    pattern = r'<span class="date">(.*?)</span>'
    corrected_html = re.sub(pattern, fix_date, html)
    return corrected_html









for i in range(1, 51):
    with open(f"{i}.html", "r", encoding="utf-8") as reader:
      codes = reader.read()
      if "دونیت" in codes:
          print(i)
    # codes = codes.replace("content_copy","").replace("download","").replace("Use code with caution.","").replace("```html","").replace("```","").replace("images/13-",f"images/{i}-")
    # corrected_html = correct_dates(codes)
    # with open(f"{i}.html", "w", encoding="utf-8") as w:
    #   w.write(codes)