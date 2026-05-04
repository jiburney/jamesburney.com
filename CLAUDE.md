# CLAUDE.md — James Burney Portfolio Site

Instructions for AI agents working in this codebase. Read this before making
any changes.

---

## Ground Rules

- **Always confirm before writing to any file.** Show a summary or preview of
  the proposed change and wait for explicit approval before using any file
  write tool.
- **Read before editing.** Always read the current state of a file before
  attempting an edit. Stale context causes failed edits.
- **One thing at a time.** Propose and confirm one logical change at a time.
  Don't batch unrelated edits into a single confirmation.
- **Flag downstream risk.** Before making any change, call out any other files
  or features that could be affected. See the dependency notes below.

---

## Project Overview

Personal portfolio site for James Burney — a product manager with ~5 years of
formal PM experience at Zillow Group/HotPads and The Motley Fool, plus earlier
SEO roles at Merkle and Cvent. The site serves as a professional portfolio for
job applications and potential clients: showcasing experience, a project
portfolio, and a way to get in contact.

**Live site:** jamesburney.com
**Stack:** Vanilla HTML, CSS, JavaScript — no frameworks
**Hosting:** GitHub Pages (static)
**Local dev:** `python3 -m http.server 8000` → http://localhost:8000

---

## Site Structure

The four active public-facing pages are:

| Page | File |
|------|------|
| Home | `index.html` |
| Experience | `pages/experience.html` |
| Projects | `pages/projects.html` |
| About Me (Beyond Work) | `pages/beyond-work.html` |

**Inactive pages** — `pages/hobbies.html`, `pages/wanderings.html`, and
`pages/sustainability.html` exist in the repo but are not part of the current
site. They may be removed or spun out into separate projects down the road.
Do not link to or modify these without explicit instruction.

---

## File Dependency Map

Before editing any file, check whether it appears here.

### CSS
- `css/themes.css` — all color variables and dark/light mode. Changes here
  affect every page.
- `css/main.css` — layout, typography, components. Changes here affect every
  page.

### JavaScript
- `js/main.js` — core functionality loaded on all pages. Touch with care.
- `js/theme-toggle.js` — loaded in `<head>` on all pages.
- `js/low-power-mode.js` — battery detection, affects animations site-wide.
- `js/at-profile.js` — AT elevation profile on homepage only.
- `js/brewery-map.js` — brewery heat map easter egg (beyond-work page).
- `js/geoguessr.js` — geography guessing game (beyond-work page).

### Data files (`/data/`)
- `projects.json` — loaded dynamically by `pages/projects.html`
- `travels.json` — loaded dynamically (wanderings page, currently inactive)
- `breweries.json` — loaded dynamically by `brewery-map.js`
- `metadata.json` — SEO metadata reference
- `reflections.json` — placeholder, not yet active
- `experience.json` — **structured reference only** (see below)

---

## experience.json vs experience.html

`pages/experience.html` is the **authoritative source** for all experience
page content. Edit only this file for any experience page changes.

`data/experience.json` is kept as a **structured data reference** — useful for
LLMs, potential ATS parsing, and as a foundation for future JSON-LD schema
markup. It is not actively synced with the HTML and should not be treated as a
live content source. Do not edit it as part of routine experience page work
unless specifically asked.

---

## Content Voice & Style Rules

These apply to all copy written for this site:

- **No em dashes.** They read as AI-generated. Use commas, colons, or
  restructure the sentence instead.
- **No resume-speak.** No "leveraged," "spearheaded," "results-driven," etc.
- **First person, conversational.** The site should sound like James talking,
  not a LinkedIn summary.
- **Company name leads role headers**, not job title. Consistent across all
  experience entries.
- **Narrative before bullets.** Experience entries lead with a first-person
  story paragraph, then supporting bullet points.
- **Climate interest is context, not positioning.** It surfaces through
  projects and personal details — it does not headline the professional pitch.

---

## Change Safety Checklist

Before proposing any edit, run through this:

1. **Which file(s) are changing?** Name them explicitly.
2. **What depends on those files?** Check the dependency map above.
3. **Could this break any interactive feature?** (AT profile, brewery map,
   GeoGuessr, theme toggle, low power mode)
4. **Are any internal links, image paths, or script references affected?**
5. **Does the change respect the performance budget?** (<500KB per page,
   images <150KB in WebP format)

---

## Session Startup

At the start of a new session on this project:

1. Run `conversation_search` or `recent_chats` to recover context from prior
   sessions.
2. Confirm what was last worked on and what's next before proceeding.
3. If picking up a task in progress (e.g., a role entry being drafted), read
   the relevant file before writing anything.

---

## Planned Features (Not Yet Built)

Be aware of these so you don't accidentally conflict with them. Do not build
them without explicit instruction.

- GeoGuessr-style travel photo guessing game (`js/geoguessr.js` exists as
  scaffold)
- Brewery heat map easter egg (`js/brewery-map.js` exists as scaffold)
- AT elevation profile animation (`js/at-profile.js` exists as scaffold)
- JSON-LD / schema.org structured data block in experience page `<head>`
- Gmail "Send As" SMTP for james@jamesburney.com

---

## Do Not Touch Without Explicit Instruction

- `service-worker.js` — cache invalidation can break the live site
- `CNAME` — domain configuration
- `sitemap.xml` and `robots.txt` — SEO infrastructure
- Any file in `.claude/`
