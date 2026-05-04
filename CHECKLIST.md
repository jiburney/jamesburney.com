# Launch Checklist

Print this page and check off items as you complete them.

---

## 🗒️ Development Notes & Decisions

Ongoing notes on architectural decisions, known inconsistencies, and things to hand off to Claude Code.

### Content Architecture
- **Experience page is currently dual-tracked:** Content exists in both `data/experience.json` (source of truth) and hardcoded in `pages/experience.html`. These must be kept in sync while iterating on copy. When content is finalized, have Claude Code convert the experience page to render dynamically from the JSON — updating both in one pass.
- **Company-first ordering:** The Zillow entry has been updated to show company name first, title second. All other roles still show title first. Apply company-first ordering consistently across all roles when converting to dynamic rendering.
- **Narrative descriptions:** A `role__description` style (italic, green left border) has been added to `experience.html` for context paragraphs above the bullet highlights. This pattern should be applied to other roles as content is developed.

---

## 📋 Pre-Launch Checklist

### Phase 1: Initial Setup (Day 1)
- [ ] Read [GETTING_STARTED.md](GETTING_STARTED.md)
- [ ] Run local server: `python -m http.server 8000`
- [ ] Browse all pages and test features
- [ ] Understand file structure

### Phase 2: Basic Customization (Day 1-2)
- [ ] Update `/data/metadata.json` with your info
- [ ] Find & replace social media links in all HTML files:
  - [ ] LinkedIn URL
  - [ ] GitHub URL
  - [ ] Email address
- [ ] Update CNAME file with your domain
- [ ] Test site locally after changes

### Phase 3: Content (Day 2-4)
- [ ] Update `/data/experience.json` with work history
- [ ] Update `/data/projects.json` with your projects
- [ ] Edit home page intro in `index.html`
- [ ] Decide if AT elevation profile is relevant (remove if not)
- [ ] Update "Currently Seeking" section
- [ ] Verify all placeholder text is replaced

### Phase 4: Images (Day 4-5)
**Required:**
- [ ] Create/add `images/misc/favicon.svg`
- [ ] Create/add `images/misc/og-image.jpg` (1200x630px)
- [ ] Create/add `images/misc/apple-touch-icon.png` (180x180px)

**Projects:**
- [ ] Gather project screenshots
- [ ] Optimize each to <150KB using Squoosh.app
- [ ] Convert to WebP format
- [ ] Add to `images/projects/`
- [ ] Verify paths match JSON

**Optional - Travels:**
- [ ] Add travel photos to `images/travels/`
- [ ] Update `/data/travels.json` with your stories
- [ ] Test GeoGuessr functionality

### Phase 5: Testing (Day 6)
**Desktop Testing:**
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Dark/light mode toggle works
- [ ] All navigation links work
- [ ] All external links open in new tab
- [ ] Images load correctly
- [ ] No console errors (F12)

**Mobile Testing:**
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Hamburger menu works
- [ ] All gestures work (tap, scroll)
- [ ] Images are lazy loading
- [ ] Dark mode looks good

**Feature Testing:**
- [ ] AT elevation profile animates on scroll
- [ ] GeoGuessr game works end-to-end
- [ ] Brewery map easter egg opens
- [ ] Service worker registers (check DevTools)
- [ ] Works offline (disconnect network and test)

**Performance Testing:**
- [ ] Check page weight in DevTools Network tab (<100KB)
- [ ] Run PageSpeed Insights (target: 90+)
- [ ] Test on 3G throttling (DevTools)
- [ ] All pages load in <2 seconds

### Phase 6: SEO & Metadata (Day 6)
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] og:image tags are correct
- [ ] Canonical URLs are set
- [ ] robots.txt is accessible
- [ ] sitemap.xml is valid
- [ ] Structured data validates

### Phase 7: Final Pre-Launch (Day 7)
- [ ] No "TODO" or placeholder text remains
- [ ] All personal info is correct
- [ ] Contact email works
- [ ] Social links go to correct profiles
- [ ] Resume/CV is current
- [ ] Double-check for typos
- [ ] Get feedback from friend/colleague

## 🚀 Deployment Checklist

### GitHub Setup
- [ ] Create GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Add remote: `git remote add origin [URL]`
- [ ] Push to GitHub: `git push -u origin main`

### GitHub Pages
- [ ] Go to Settings → Pages
- [ ] Set source to: main branch / (root)
- [ ] Save and wait for deployment
- [ ] Visit username.github.io/repo-name
- [ ] Verify site works

### Custom Domain (Optional)
- [ ] Update DNS A records at registrar
- [ ] Update DNS CNAME record
- [ ] Add custom domain in GitHub Pages settings
- [ ] Wait for DNS propagation (up to 24 hours)
- [ ] Enable "Enforce HTTPS"
- [ ] Test www redirect works

## 📊 Post-Launch Checklist

### First Hour
- [ ] Site loads at correct URL
- [ ] HTTPS works (green lock)
- [ ] Test on mobile device
- [ ] Share with 3-5 people for feedback
- [ ] Fix any critical issues

### First Day
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Run Website Carbon test
- [ ] Run EcoGrader test
- [ ] Run PageSpeed Insights
- [ ] Share on LinkedIn/Twitter

### First Week
- [ ] Check Google Search Console for issues
- [ ] Test search: `site:yourdomain.com`
- [ ] Verify all pages are indexed
- [ ] Check for broken links
- [ ] Monitor GitHub Pages build status
- [ ] Gather and implement feedback

## 🔄 Ongoing Maintenance

### Monthly
- [ ] Check for broken links
- [ ] Verify all images still load
- [ ] Update content if needed
- [ ] Check analytics (if implemented)

### Quarterly
- [ ] Update resume/experience
- [ ] Add new projects
- [ ] Refresh travel stories
- [ ] Run performance tests
- [ ] Check sustainability metrics

### Annually
- [ ] Major content refresh
- [ ] Review and update all pages
- [ ] Update metadata
- [ ] Check for new best practices
- [ ] Full SEO audit

---

## ✅ Launch Readiness Score

Count your checkmarks in Pre-Launch section:
- **45+ checks:** Ready to launch! 🚀
- **35-44 checks:** Almost there, finish remaining items
- **<35 checks:** More work needed before launch

**Current Score: _____ / 45**

---

**Last Updated:** January 2025
