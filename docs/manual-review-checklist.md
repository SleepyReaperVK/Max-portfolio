# Manual review checklist — portfolio site

**How to start:** in the repo, run `npm run build` then `npm run preview`, and open
<http://localhost:4173/>. (A preview server may already be running on that port.)

Two routes only:
- `/` — the whole home page, one scroll
- `/projects/pray-for-plagues` — the case study
- anything else → 404 page

Tick, or write what's wrong next to it. Anything you mark ❌ I'll fix.

---

## 1. First impression (do this once, then don't look again)

Open `/` at your normal window size and just read it top to bottom, like a recruiter would.

- [ ] Does it look like a **real studio-quality site**, or like a template?
- [ ] Does the hero make you want to scroll?
- [ ] Reading it once — is it clear **what Max does** and **what the flagship project is**?
- [ ] Anything that feels cheap, filler, or padded?

## 2. The one hard requirement — availability

The brief demands hybrid / remote / relocation be **clearly visible, not buried**.

- [ ] Scroll the page at normal speed. Did the availability section **catch your eye on its own**, without you looking for it?
- [ ] Does it read as a distinct beat, or does it blend into the sections above and below?
- [ ] Is the wording right — hybrid, remote, **and** relocation, with Israel as the base?

> This is the item I'd most like your opinion on. It competes with five other sections and I can't judge "unmissable" for you.

## 3. Copy — your own words

All the text came from your Notion page. Read it as yourself.

- [ ] **About section** — does it sound like you, or like it was rewritten?
- [ ] **Skills list** — anything missing, anything overstated? (I flagged one open question: is **Python** correct to list?)
- [ ] Case-study text — any technical claim that's wrong or exaggerated?
- [ ] **5 level-design captions** I was least sure about — check those specifically; they were the hardest to infer from the source.
- [ ] I changed one phrase in your own writing: **"I've began" → "I began"**. Fine, or put it back?

## 4. Media

- [ ] All **55 case-study items** (30 videos, 25 images) — is the right clip next to the right text?
- [ ] Any video that's the wrong moment, too long, or not worth showing?
- [ ] Videos should play only when scrolled into view, muted. Anything that autoplays with sound is a bug — tell me.
- [ ] Your **portrait** — is that the photo you want? It's the LinkedIn one.
- [ ] ⚠️ **Known gap:** the hero background, the case-study hero and the project card cover are currently **the same image**. Does that bother you? If yes, pick a distinct image for the project card and I'll wire it in.

## 5. The case study — read it as a hiring manager

`/projects/pray-for-plagues`, six system breakdowns (combat, AI, interaction, inventory, audio, level design).

- [ ] Is the **order** right? Should combat still lead?
- [ ] Is any section too long? Too thin?
- [ ] Click a few gallery images — the lightbox should open, Esc should close, ← → should move between items.
- [ ] Does the sticky nav on the right highlight the section you're actually reading?
- [ ] Does this read as **evidence you can build systems**, or as a feature list?

## 6. Phone

Open it on your actual phone (same Wi-Fi: re-run preview with `--host` and use the Network URL it prints).

- [ ] Nothing cut off, nothing overlapping
- [ ] **No sideways scrolling** on any section
- [ ] Text big enough to read without zooming
- [ ] The menu opens and closes properly
- [ ] Case-study videos don't make the page crawl

## 7. Links and contact

- [ ] Email link opens a mail draft to **maxer.masarski@gmail.com**
- [ ] GitHub link goes to the right repo
- [ ] LinkedIn link is right
- [ ] ⚠️ **YouTube is a placeholder** — give me the real URL, or say remove it
- [ ] ⚠️ **CV download is switched off** — no PDF yet. Send me the PDF and I'll turn it on
- [ ] "View the case study" and "Get in touch" buttons both go where they say

## 8. Before it goes live — decisions only you can make

- [ ] **The domain.** Everything is built; the canonical URL and social-preview URL are placeholders until you tell me the real domain name
- [ ] The **social preview card** (what shows when the link is pasted into WhatsApp/LinkedIn) — I'll show you the image once the domain is set
- [ ] Deployment: `DEPLOY.md` in the repo has the manual steps for your Hetzner server. **I will not deploy it** — that's yours to run

---

## What I've already verified, so you don't need to

Don't spend your time on these — they're measured, not eyeballed:

| | |
|---|---|
| Build | clean, no errors |
| Initial JS | 185 kB gzipped (budget was 250 kB) |
| Case study | loads as a separate chunk, only when visited |
| Theme guard | no hardcoded colours or sizes anywhere in the components |
| Fonts/scripts | zero external requests — nothing loads from another server |
| Reduced motion | animations respect the OS setting |

## ✅ Previously unverified — now checked by machine

These were listed here as "could not verify" because the browser pass kept
failing. It has since run in full (2026-08-17) against a production build, using
its own Chrome so it could not collide with yours. Full detail:
`.superpowers/sdd/2026-08-16-portfolio-site/browser-end-pass-report.md`.

| Was unverified | Result |
|---|---|
| Keyboard focus rings | **Pass.** 18 of 18 tabbable elements on the home page show a 2 px gold ring under real Tab presses. Hover does not. |
| Console clean | **Pass.** Zero errors and zero warnings on all three routes. |
| Page titles change | **Pass.** Title, description, canonical and OG all update per route. |
| Anchor links from the case study | **Pass.** "Get in touch" from the case study lands on the contact section, not the top of the page. |
| Sideways scroll | **Pass.** Zero overflow at 390 / 768 / 1440 with the hiding rule forced off, so nothing is being masked. |
| Favicon | **Pass.** Serves 200 as an SVG. |
| 404 page | **Pass.** Renders, and is marked `noindex, nofollow`. |

Nothing on this list still needs your eyes. Your own pass through the site is
still worth doing for taste and wording, which no script can judge — that is
what the rest of this document covers.

## Two calls that were yours — both decided (2026-08-17)

Max reviewed both and accepted them as they are. No code changed. Recording the
reasoning so nobody re-opens them as bugs later.

- **The same image appears three times — ACCEPTED.** The hero background, the
  project card cover, and the case study hero are all the same candlelit statue
  shot. Nothing is broken; it just repeats. Left as-is deliberately.
  *To reverse:* point `siteConfig.media.projectCover` at a different manifest
  key (a combat or level-design still). One line, no other file involved.
- **Lightbox sound — ACCEPTED.** Gallery thumbnails stay muted. A clip opened in
  the large viewer has sound when you press play, and never autoplays. Correct
  for the audio and feedback section, where the sound is the evidence.
  *To reverse:* add `muted` to the `<video>` in
  `src/components/caseStudy/Lightbox.jsx`.
