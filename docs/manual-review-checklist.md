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

## ⚠️ What I could NOT verify — please check these too

The automated browser pass did not run. It was attempted twice and both times
the agent was killed by a process exit, and the browser tooling here needs a
debug port that is also used by your own Chrome — I won't spawn into that.

So these are **unverified**, not passed. They're quick, but they need a browser:

- [ ] **Keyboard focus rings.** Press `Tab` repeatedly through both pages. Every
      link and button should show a visible ring. This one matters most — a
      site-wide missing focus ring was found and fixed earlier, but the fix was
      only ever confirmed in code, never by actually pressing Tab.
- [ ] **Console clean.** F12 → Console, reload each route. Should be empty —
      no red errors, no yellow warnings.
- [ ] **Page titles change.** Watch the browser tab while you go home → case
      study → a bad URL like `/nope`. The tab text should change each time.
- [ ] **Anchor links.** Click "Get in touch" from the case-study page. It should
      scroll to the contact section, not dump you at the top of the home page.
      (This exact bug was found and fixed once already.)
- [ ] **Sideways scroll on phone** (already in §6, but it's the one I most want
      a second pair of eyes on).
- [ ] **Favicon** shows in the tab.
- [ ] **404 page** renders properly at any bad URL.
