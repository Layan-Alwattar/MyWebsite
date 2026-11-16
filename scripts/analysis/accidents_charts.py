"""
Aggregates for the "Traffic Accidents in Qatar, 2021-2024" project charts.

    python scripts/analysis/accidents_charts.py path/to/accident.csv

Source: Qatar Open Data Portal (Ministry of Interior), semicolon-separated
with Arabic headers. Writes supabase/seed/data/accidents-2021-2024.json,
then run: node scripts/build-seed.mjs
"""
import json
import re
import sys
from pathlib import Path

import pandas as pd

OUT = Path(__file__).resolve().parents[2] / 'supabase' / 'seed' / 'data' / 'accidents-2021-2024.json'
COLUMNS = ['year', 'time', 'weather', 'road_cond', 'road_type', 'classification', 'nature', 'reason', 'city',
           'zone', 'street', 'severity', 'deaths', 'birth_year', 'nationality', 'total']
# Zone names from the original notebook's mapping (top zones only).
ZONE_NAMES = {56: 'Mesaimeer / Ain Khaled', 55: 'Al Waab / Al Aziziya', 57: 'Industrial Area', 71: 'Umm Slal Mohammed',
              53: 'New Al Rayyan / Muaither', 90: 'Al Wakra', 70: 'Lusail / Al Daayen', 51: 'Al Gharrafa',
              91: 'Al Wukair', 45: 'Old Airport', 52: 'Al Luqta / Old Al Rayyan', 66: 'Onaiza / Leqtaifiya'}


def hour(t):
    m = re.match(r'(\d+)(AM|PM)', str(t))
    if not m:
        return None
    return int(m.group(1)) % 12 + (12 if m.group(2) == 'PM' else 0)


def main(csv_path):
    d = pd.read_csv(csv_path, sep=';', low_memory=False, encoding='utf-8-sig')
    d.columns = COLUMNS
    d = d[d.year.between(2021, 2024)].copy()  # four complete years
    out = {'n': len(d)}
    out['year'] = [{'Year': str(y), 'Accidents': int(c)} for y, c in d.year.value_counts().sort_index().items()]

    d['hour'] = d.time.map(hour)
    out['hour'] = [{'Hour': int(h), 'Accidents': int(c)} for h, c in d.groupby('hour').size().items()]

    known = d[d.severity.isin(['SIMPLE', 'LIGHT INJURY', 'HEAVY INJURY', 'DEATH INJURY'])]
    severe = known.groupby('hour').severity.apply(lambda s: s.isin(['HEAVY INJURY', 'DEATH INJURY']).mean() * 1000)
    out['severe_hour'] = [{'Hour': int(h), 'Heavy or fatal per 1,000': round(float(v), 1)} for h, v in severe.items()]
    vc = known.severity.value_counts()
    out['known'] = len(known)
    out['simple_pct'] = round(vc['SIMPLE'] / len(known) * 100, 1)
    out['severity'] = [{'Severity': label, 'Accidents': int(vc[key])}
                       for label, key in [('Light injury', 'LIGHT INJURY'), ('Heavy injury', 'HEAVY INJURY'), ('Fatal', 'DEATH INJURY')]]

    zones = d.zone.value_counts().head(10)
    out['zones'] = [{'Zone': f'Zone {int(k)} · {ZONE_NAMES[int(k)]}' if int(k) in ZONE_NAMES else f'Zone {int(k)}', 'Accidents': int(c)}
                    for k, c in zones.items()]

    age = d.year - pd.to_numeric(d.birth_year, errors='coerce')
    age = age[(age >= 16) & (age <= 90)]  # drop missing / impossible birth years
    bands = pd.cut(age, [15, 24, 34, 44, 54, 64, 90], labels=['16–24', '25–34', '35–44', '45–54', '55–64', '65+'])
    out['age'] = [{'Driver age': str(k), 'Accidents': int(c)} for k, c in bands.value_counts().sort_index().items()]
    out['age_n'] = int(len(age))

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf8')
    print('Wrote', OUT)


if __name__ == '__main__':
    main(sys.argv[1])
