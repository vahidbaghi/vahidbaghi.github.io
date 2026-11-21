# Standard Gregorian <-> Jalali conversion (jdf algorithm, valid for 1300-1500 SH)
def g2j(gy, gm, gd):
    g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334]
    gy2 = gy + 1 if gm > 2 else gy
    days = 355666 + (365*gy) + ((gy2+3)//4) - ((gy2+99)//100) + ((gy2+399)//400) + gd + g_d_m[gm-1]
    jy = -1595 + (33*(days//12053)); days %= 12053
    jy += 4*(days//1461); days %= 1461
    if days > 365:
        jy += (days-1)//365; days = (days-1) % 365
    if days < 186: jm = 1 + days//31; jd = 1 + days % 31
    else: jm = 7 + (days-186)//30; jd = 1 + (days-186) % 30
    return jy, jm, jd
if __name__ == '__main__':
    assert g2j(2026,11,21) == (1405,8,30), g2j(2026,11,21)
    assert g2j(2025,3,21) == (1404,1,1), g2j(2025,3,21)
    assert g2j(1979,2,11) == (1357,11,22), g2j(1979,2,11)
    print('ok')
