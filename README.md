# Icystrap — Website

Static marketing site for [Icystrap](https://github.com/icyxvcz/Icystrap), an alternative
launcher for Roblox in the spirit of Bloxstrap.

This repo (`IcystrapApp`) holds **only the website**. The launcher itself and its
releases live in [`icyxvcz/Icystrap`](https://github.com/icyxvcz/Icystrap) — which is why
the download buttons point there. `IcystrapApp` has no releases, so those URLs must not
be repointed at it.

## Structure

```
index.html              Single-page site (hero, features, mods, install, footer)
assets/css/styles.css   All styling — dark theme, responsive, no frameworks
assets/js/main.js       Nav toggle, copy-to-clipboard, scroll reveal, custom cursor
assets/img/Icystrap.png Brand mark + favicon
assets/img/ss.png       Launcher screenshot (hero)
assets/img/ss2.png      Discord Rich Presence screenshot
```

No build step, no dependencies. Everything is plain HTML/CSS/JS.
Brand/social icons are [Remix Icon](https://remixicon.com) (Apache 2.0), loaded from a CDN.

## Preview locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 8080
# then visit http://localhost:8080
```

## Deploying

Works on any static host:

- **GitHub Pages** — push this folder, then enable Pages on the branch root.
- **Cloudflare Pages / Netlify / Vercel** — no build command, publish directory `.`.

## Editing content

| What | Where |
| --- | --- |
| Download link | `index.html` — every `releases/download/Icystrap/Icystrap.exe` URL (points at the `Icystrap` repo, not this one) |
| Discord invite | `index.html` — `discord.gg/43nUV95XsZ` |
| Feature cards | `index.html` → `#features` |
| Mods grid | `index.html` → `#mods` |
| Setup steps | `index.html` → `#install` |
| Colours / spacing | `assets/css/styles.css` → `:root` variables |

The `[data-latest-version]` elements are filled in at runtime from the GitHub
releases API; if the request fails the fallback text stays visible.

## Notes

- Mod-folder path in the mods section assumes `%LOCALAPPDATA%\Icystrap\Modifications`.
