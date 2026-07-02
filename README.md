# zaldo

Static marketing site for [mizaldo.com](https://mizaldo.com).

**Tagline:** Deja de adivinar adonde se fue tu plata

## Structure

```
├── index.html              Home page
├── 404.html                Not-found page
├── robots.txt              Crawler rules
├── sitemap.xml             URL index
├── site.webmanifest        PWA manifest
├── favicon.ico             Root favicon (placeholder)
├── README.md
└── assets/
    ├── css/styles.css      All styles
    ├── js/main.js          Charts, pricing toggle, FAQ accordion
    └── img/
        ├── og-image.jpg    Social preview (1200×630)
        └── favicon/        App & browser icons
```

## Preview locally

From the project root:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

## Replace before production

| Asset | Path | Notes |
|-------|------|--------|
| OG / social image | `assets/img/og-image.jpg` | **Placeholder** — solid dark teal. Replace with branded 1200×630 JPG. |
| Favicon set | `assets/img/favicon/*` | **Placeholder** — solid teal squares. Replace with real brand icon. |
| Root favicon | `favicon.ico` | **Placeholder** — copy of 32×32 PNG. Replace with proper multi-size `.ico`. |
| Author meta | `index.html` `<meta name="author">` | Still set to `[AUTHOR]`. |
| Canonical & OG URLs | `index.html`, `robots.txt`, `sitemap.xml` | Point to `https://mizaldo.com`. Update if domain changes. |
| Page copy vs. meta | `index.html` body | Visible UI still uses **Finorix** demo copy; meta uses **zaldo** + Spanish tagline. Align when ready. |
| `html lang` vs `og:locale` | `index.html` | `lang="en"` (page copy is English); `og:locale` is `es_ES` (Spanish social description). Confirm target locale. |

## Ambiguous placeholders

- **`[AUTHOR]`** — not provided; update in `index.html`.
- **`en_SPANISH`** — interpreted as Spanish social locale (`es_ES`); page content remains English until copy is localized.
