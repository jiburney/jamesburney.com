# jamesburney.com

My personal site and portfolio. Built as a place to point people when I'm applying for PM roles, but also as an excuse to build something I actually own end to end.

Live at [jamesburney.com](https://jamesburney.com).

## What's interesting about it

No frameworks. Just HTML, CSS, and vanilla JavaScript. Every page is statically served from a flat directory.

That's a deliberate choice. A portfolio site doesn't need React, doesn't need a build step, and doesn't need 500KB of JS to render some text and images. Keeping it minimal means it loads fast, works without JS, and stays cheap to host — both in dollars and in carbon.

A few decisions worth calling out:

- **Sub-200KB per page.** Most pages weigh under 100KB. The heaviest (Projects and About Me) sit just under 200KB, mostly because of compressed photos. There's a page weight calculator in the footer that shows you the actual number for whichever page you're on.
- **System fonts only.** No web fonts, with one exception: the "James Burney" wordmark in the header uses Google's National Park typeface, scoped to just those characters. The rest of the site uses whatever sans-serif your OS ships with.
- **Service worker for offline support.** If you've loaded the site once, you can come back to it offline. Mostly an experiment, but it works.
- **Dark mode by default.** Theme toggle in the nav. Preference is persisted.
- **Low power mode detection.** If your device reports a low battery, animations and transitions are disabled to save power.
- **Sustainability badges in the footer.** Website Carbon and Green Web Foundation. The site runs on Cloudflare Pages, which is verified green.

## Tech stack

- HTML, CSS, and vanilla JavaScript
- JSON files for content that changes (projects, breweries, travel data)
- Service worker for caching and offline
- Hosted on Cloudflare Pages
- Domain registered with Porkbun

No bundler, no transpiler, no package manager. The site you see is the source code.

## Running it locally

```bash
cd james-burney-site
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Any static file server works. The Python one-liner is just convenient because it ships with macOS.

## Project structure

```
index.html              Homepage
offline.html            Service worker offline fallback
service-worker.js       Caches pages and assets for offline use
sitemap.xml, robots.txt SEO infrastructure

css/
  main.css              Layout, typography, components
  themes.css            Color tokens and dark/light mode

js/
  main.js               Core functionality (loaded on every page)
  theme-toggle.js       Dark/light toggle, loaded in <head>
  low-power-mode.js     Battery API detection
  at-profile.js         AT elevation profile (scaffold, not yet active)
  brewery-map.js        Brewery heat map (scaffold, not yet active)
  geoguessr.js          Geography game (scaffold, not yet active)

pages/
  experience.html       Work history
  projects.html         Personal projects
  about.html            Personal background, hobbies, the AT thru-hike

data/
  projects.json         Loaded by the projects page
  breweries.json        Brewery data for the planned heat map
  travels.json          Travel data
  experience.json       Structured experience data (reference, not actively rendered)

images/                 Photos, logos, icons (mostly WebP)
```

## A note on AI assistance

Large parts of this site were built with the help of Claude. The CSS, the JSON-driven content patterns, the topographic background on the homepage — all came out of long conversations and a lot of iteration. Every line was reviewed and approved by me, and the content (the words, the work history, the personal story) is all mine. But I'm not going to pretend I wrote every closing brace by hand. That feels increasingly dishonest in 2026.

## Contact

I'm currently open to product management roles. If you're hiring, or just want to say hi:

- [LinkedIn](https://linkedin.com/in/jiburney)
- [Email](mailto:james@jamesburney.com)
- [GitHub](https://github.com/jiburney)

