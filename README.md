# mstampfli.com

The personal site of Marc Stampfli, a static, hand-written page with one project
page per build and a couple of live demos. No framework, no build step.

## Stack
- Plain HTML + a little vanilla JS (`site.js`) and one local stylesheet (`site.css`).
- Styled by the [maka-design](https://github.com/mstampfli/maka-design) system,
  loaded from its GitHub Pages stylesheet.
- The boot-log repo count is fetched live from the GitHub API.

## Layout
```
index.html        home (hero, projects, about, contact)
projects/         one page per project + the live demos (seccard, cve2detect, codecard)
writing/          long-form writeups
site.css site.js  local styles + behavior (theme toggle, boot typing, clock, reveals)
```

## Deploy
The site lives on the Hetzner hub and is served by Caddy (auto-TLS via Cloudflare
DNS-01) straight out of the git checkout at `/var/www/mstampfli.com`. No build step,
no rsync: edit the files on the hub and the change is live the moment Caddy reads them.
Caddy sets the security headers (CSP, HSTS, and friends).

```sh
ssh hub
cd /var/www/mstampfli.com
# edit in place, then commit for history
git add -A && git commit -m "..."
```

`origin` points at GitHub (`mstampfli/mstampfli.com`); it seeded this checkout and is
the off-box backup. `git pull` brings in anything pushed from elsewhere. Pushing the
hub's own commits back to GitHub needs a write credential on the hub (a deploy key),
set up separately. The pre-migration live files are kept on the `hub-snapshot` branch.
