# Deploying the portfolio site

**This file covers the self-hosted (Hetzner + nginx) route only.** The site
currently ships to GitHub Pages instead, automatically, via
[`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push to
`main` — see "Hosting on GitHub Pages" in [`README.md`](README.md). Keep this
file as the fallback if the site ever moves off Pages.

The Hetzner process below is fully manual. Every step is something **you** run,
by hand, from your own machine or a shell on the server.

The target server, domain, and everything past step 6 is out of scope for any
automated agent working in this repo — that boundary is intentional. Note that
this boundary does **not** extend to the Pages workflow, which deploys itself
by design.

## 1. Build locally

```bash
npm ci
npm run build
```

This produces a static `dist/` folder. Verify it's clean:

```bash
npm run preview
```

Open the preview URL and check both routes (`/` and
`/projects/pray-for-plagues`) before going further.

## 2. Copy the build to the server

**First deploy only:** create the target directory on the server before
copying anything into it:

```bash
ssh user@your-server 'sudo mkdir -p /var/www/portfolio/dist && sudo chown user /var/www/portfolio/dist'
```

Then copy the contents of `dist/` to `/var/www/portfolio/dist` on the
Hetzner box, using WinSCP or `scp`:

```bash
scp -r dist/* user@your-server:/var/www/portfolio/dist/
```

(Or drag-and-drop the same folder contents with WinSCP, if that's your usual
tool.) For every deploy after the first, see the Rollback section below —
rename the existing `dist` to `dist.bak` before copying the new build in, so
a bad deploy can be swapped back instantly.

## 3. Place the nginx config

`nginx.conf.example` lives in this repo, on your local machine — it has to
be transferred to the server before it can be installed there. Either copy
it over first:

```bash
scp nginx.conf.example user@your-server:~/nginx.conf.example
```

then, on the server, edit `server_name` to the real domain and enable it:

```bash
sudo cp ~/nginx.conf.example /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
```

(or paste the edited contents directly into
`/etc/nginx/sites-available/portfolio` with an editor over SSH — whichever
is easier; the point is that `nginx.conf.example` alone, on your local
machine, does nothing until it's on the server.)

## 4. Validate and reload nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` must report syntax OK before reloading — reloading a broken config
can take the whole server's other sites down with it.

## 5. Point the domain at the server

Update the domain registrar's DNS to add an A record (and `www` CNAME/A
record) pointing at the server's IP. DNS propagation can take anywhere from
minutes to a few hours.

Once the domain resolves, update the domain references in the codebase to the
real domain — they currently point at the GitHub Pages project site
(`https://sleepyreapervk.github.io/Max-portfolio/`), in three places that must
stay in sync: `index.html` (canonical + `og:image` + `og:url`), `SITE_ORIGIN`
in `src/components/common/Seo.jsx`, and the commented sitemap line in
`public/robots.txt`.

**Also set `base` back to `/` in `vite.config.js`.** A self-hosted domain
serves from the root, whereas the Pages setup serves from the `/Max-portfolio/`
subpath — leaving `base` as-is would prefix every asset URL with a folder that
does not exist on this server. See "The subpath is load-bearing" in
[`README.md`](README.md) for the full list of things keyed to that value.

Then rebuild and redeploy (steps 1–2 again).

## 6. Enable HTTPS with certbot

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

certbot edits the nginx config in place to add the `443 ssl` block and an
HTTP → HTTPS redirect. Re-run `nginx -t` after it finishes, as always.

---

## Rollback

Before overwriting `/var/www/portfolio/dist` with a new build, rename the
current one out of the way:

```bash
mv /var/www/portfolio/dist /var/www/portfolio/dist.bak
```

then copy the new build in. If the new deploy is broken, swap it back:

```bash
rm -rf /var/www/portfolio/dist
mv /var/www/portfolio/dist.bak /var/www/portfolio/dist
```

No nginx config change or reload is needed for a rollback — nginx serves
whatever is on disk at `root`.

## Post-deploy checklist

Run through this after every deploy, not just the first one:

- [ ] `/` loads with no console errors
- [ ] `/projects/pray-for-plagues` loads with no console errors
- [ ] **Refresh** the browser while on `/projects/pray-for-plagues` directly — it must not 404 (this is what the nginx `try_files` fallback exists for)
- [ ] Media (images and video clips) plays on both routes; video posters show before the clip loads
- [ ] The mailto contact link opens a mail client with the right address pre-filled
- [ ] No requests to any external host in the Network tab (no notion.site, no licdn.com, no fonts.googleapis.com — everything is self-hosted)
