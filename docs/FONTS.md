# Fonts

The design uses **Thmanyah** (Thmanyah Serif Display and Thmanyah Sans). Its licence does not allow the font files to be redistributed, hosted or embedded where a visitor can extract them, and this repository is public, so the files are not here:

- https://font.thmanyah.com/licenses
- https://ask.thmanyah.com/hc/en-001/articles/45993930027281-Thmanyah-Font-for-Everyone

Until you have a licence that covers web use, two open families (SIL Open Font License, from `@fontsource`) stand in:

| Name in the code | Design | Stand-in |
|---|---|---|
| `TD` | Thmanyah Serif Display | Markazi Text 700 |
| `TS` | Thmanyah Sans | IBM Plex Sans Arabic |

## Switching to a licensed font

1. Get written permission that covers hosting the files on your site.
2. Do not commit the files: `public/fonts/licensed/` is ignored by git. Add them on the server at build time, for example from private storage.
3. Change the `src` of the `TD` and `TS` rules at the top of `src/app/globals.css`. No other file names the fonts.
