# Anushka Srivastava — Portfolio

User Interface / User Experience Designer from Lucknow. This is the code for my portfolio, built from my Figma design.

**Stack:** [Astro](https://astro.build) (static), plain CSS with design tokens, a little vanilla JS. Hosted on GitHub Pages.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # serve the built site
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/styles/tokens.css` | Colours, type, spacing, radius, motion (mirrors the Figma variables) |
| `src/styles/global.css` | Base styles and shared pieces: keys, windows, chips, cards, folders, device frames |
| `src/data/stories.ts` | All five case studies (Kosh, Pulsewise, Promptjuice, Relay, Hyra), their 5 chapters and links |
| `src/pages/index.astro` | Home: hero, skills marquee, Creativity path, about, contact |
| `src/pages/work/[slug].astro` | One case-study page per story |
| `src/components/` | Character (with Follow, Baby and Happy eyes), Key, Window, Shot, Folder |
| `src/scripts/site.ts` | Reveal on scroll, eye tracking, pop-ups, F1–F3 shortcuts, chapter progress |
| `public/assets/<app>/` | Screens as WebP |

## Adding or changing screens

Drop PNG/JPG exports into `assets-src/<app>/<name>.png`, then run `npm run images` to write optimised WebP files into `public/assets/<app>/`. Reference them by `<name>` in `src/data/stories.ts`.

## Deploy

Every push to `main` builds and publishes to GitHub Pages through `.github/workflows/deploy.yml`. In the repo, set **Settings → Pages → Source** to **GitHub Actions** once.
