# Fonts

| Name in the code | Design | Where it comes from |
|---|---|---|
| `TD` | Thmanyah Serif Display, Bold | uploaded in the Studio |
| `TS` | Thmanyah Sans, Regular, Medium, Bold | uploaded in the Studio |
| IBM Plex Sans Arabic | body text of the design | `@fontsource`, open licence |

Until the four files are uploaded, or if they cannot load, Markazi Text and IBM Plex Sans Arabic (open licences) stand in for `TD` and `TS`.

## What Thmanyah's licence says

[The licence](https://font.thmanyah.com/licenses-en) (the [Arabic text](https://font.thmanyah.com/licenses) prevails) allows commercial use in logos, branding, websites and applications, and embedding in websites and web applications "only as part of a compiled, packaged, or obfuscated product". It does not allow hosting the files for download, letting visitors take them as font files, changing them, renaming them, or suggesting a partnership with Thmanyah.

So here:

- The files are **not in this repository**. `.gitignore` and `npm run check:secrets` refuse them.
- They are kept in the private database. There is no address that returns a font file.
- Pages receive one scrambled pack (`/api/type`, `src/lib/typepack.ts`) that the app puts together in memory. Each font's bytes stay exactly as Thmanyah published them.
- Saved pictures, videos and certificates contain the drawn text, not the fonts.

A determined person can always recover what a browser displays; the licence's condition is about how it is delivered. For a written confirmation, ask ask@thmanyah.com. Do not say or imply that Thmanyah works with Hayyak.

## Uploading

Studio → **التصاميم الجاهزة** → **خط الهوية** (founders only): choose the four files together, with their original names, from the download at [font.thmanyah.com](https://font.thmanyah.com). WOFF2 is better than OTF because it is about half the size. The site shows it within about five minutes. **شيل الخط** takes it off again.
