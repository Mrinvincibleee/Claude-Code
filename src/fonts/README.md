# Self-hosted Noto Nastaliq Urdu subsets

Noto Nastaliq Urdu's arabic subset is ~240 KB, far too heavy for the
slow-4G performance budget, and Next 15's `next/font/google` has no
per-glyph `text` option. So two subsets are generated with Google Fonts'
css2 API (which subsets server-side via the `text` query param) and
self-hosted here:

| File | Contents | Preload |
|---|---|---|
| `noto-nastaliq-urdu-lockup.woff2` (~20 KB) | `چائے ۲۵ ہے` only — the brand lockup (hero LCP element, header, footer) | yes |
| `noto-nastaliq-urdu-subset.woff2` (~95 KB) | every Urdu string on the site | no (all uses are below the fold) |

## Regenerating (e.g. after adding new Urdu strings to `src/data/`)

```sh
TEXT=$(python3 -c "from urllib.parse import quote; print(quote('<all urdu strings>'))")
curl -s -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap&text=$TEXT"
# then download the woff2 URL from the returned @font-face src
```

The Chrome User-Agent matters — it makes the API return woff2.
Current full-subset text:

```
چائے ۲۵ ہے مینیو ہماری کہانی جھلکیاں آراء آئیے دودھ پتی کڑک مصالحہ کشمیری سبز
```

Urdu strings missing from the subset render in the fallback font, so
regenerate whenever `src/data/menu.ts` gains new `nameUrdu` values.

License: Noto fonts are licensed under the SIL Open Font License 1.1.
