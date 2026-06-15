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
Served by Caddy (auto-TLS via Cloudflare DNS-01) from a Hetzner box in nbg1, out of
`/var/www/mstampfli.com`. Deployed with `rsync` over the VPN; Caddy sets the security
headers (CSP, HSTS, and friends).

```sh
rsync -az --relative ./index.html ./projects ./writing ./site.css ./site.js <host>:/var/www/mstampfli.com/
```
