# Personal Profile Page — Audit Checklist

Use this document to review `index.html`, `style.css`, and `script.js` before publishing or sharing Devshree Pareek’s profile.

## Current page content (as implemented)

| Item | Value |
|------|--------|
| **Name (`<h1>`)** | Devshree Pareek |
| **Title / tagline** | B.Tech Student - Artificial Intelligence and Data Science |
| **About** | B.Tech student in AI and Data Science; learning programming, web development, and AI while building projects |
| **Email** | Not listed — About section shows “Email: not added yet.” (no `mailto:` link) |
| **Phone / GitHub** | Not on the page |
| **Skills** | Python (learning), HTML, CSS, JavaScript (learning), Artificial Intelligence and Data Science |
| **Projects** | (1) Personal Portfolio Website — HTML, CSS, JavaScript; (2) Interactive Quiz App — beginner web project |
| **Project URLs** | None — each project includes “Project link not added yet.” |
| **External repository** | No GitHub or other repo URL is linked or implied on the page |

There is no `PLACEHOLDER` text remaining in `index.html`.

## Structure and content

| Requirement | Status | Notes |
|-------------|--------|-------|
| Valid HTML5 document (`<!DOCTYPE html>`, `lang` on `<html>`) | ☐ | |
| Page `<title>`: Devshree Pareek — Personal Profile | ☐ | |
| Exactly one `<h1>` (main heading) | ☐ | Hero section |
| About section with heading | ☐ | `#about` |
| Skills section as a list (`<ul>`) | ☐ | `#skills`, five items |
| Projects section | ☐ | `#projects`, two projects with descriptions |
| Project / demo links | ☐ | Intentionally omitted until real URLs exist; see on-page messages |
| No invented email, phone, GitHub, or project URLs | ☐ | |
| No inline `style=""` attributes | ☐ | Styling only in `style.css` |
| `script.js` linked at end of `<body>` | ☐ | |
| `style.css` linked in `<head>` | ☐ | |

## Accessibility

| Check | Status | Notes |
|-------|--------|-------|
| Skip link to main content | ☐ | Tab from top of page |
| Landmark regions (`header`, `main`, `footer`) | ☐ | |
| Section headings in logical order (`h1` → `h2`) | ☐ | |
| Nav has `aria-label` | ☐ | |
| Project names are readable without relying on broken links | ☐ | Titles use `<strong>`, not placeholder `<a href>` |
| Color contrast readable (body text on backgrounds) | ☐ | Adjust CSS variables in `style.css` if needed |
| Focus visible on links and skip link | ☐ | Keyboard tab through nav |
| `prefers-reduced-motion` respected for smooth scroll | ☐ | In `style.css` |

## JavaScript (`script.js`)

| Check | Status | Notes |
|-------|--------|-------|
| Footer year updates automatically | ☐ | `#year` span |
| Active nav item highlights while scrolling | ☐ | Requires JS enabled; degrades gracefully |
| No console errors on load | ☐ | Open DevTools → Console |

## Visual / responsive

| Check | Status | Notes |
|-------|--------|-------|
| Readable on mobile (~375px width) | ☐ | |
| Readable on desktop | ☐ | Max width ~42rem |
| Sticky header does not hide section titles awkwardly | ☐ | Scroll to each section |

## Manual test plan

1. Open `index.html` in a browser (double-click or use Live Server).
2. Confirm the browser tab title is **Devshree Pareek — Personal Profile**.
3. Click each nav link (About, Skills, Projects); each section should scroll into view.
4. Confirm About shows the bio and **Email: not added yet.** with no clickable email.
5. Confirm both projects show descriptions and **Project link not added yet.** with no external project links.
6. Disable JavaScript once and reload; page content should still be fully readable.
7. Run through the tables above and mark each row when satisfied.

## Future additions (when you have real details)

- Add a `mailto:` link and visible email in the About section only after you have an address you want public.
- Replace “Project link not added yet.” with `<a href="…" target="_blank" rel="noopener noreferrer">` (or similar) only when live demo or repo URLs exist.
- Do not add a GitHub link in copy or markup unless you provide an actual profile or repository URL.

## Optional improvements (not required)

- Add Open Graph / meta description for link previews  
- Add a favicon  
- Host the site on a static host when you are ready (no GitHub repo is required for this checklist)

---

**Files in this profile:**

- `index.html` — markup and content  
- `style.css` — presentation  
- `script.js` — footer year and scroll-spy nav  
- `audit-page.md` — this review document  
