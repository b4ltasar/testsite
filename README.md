# NEARWEEK site – quick guide

A small Jekyll site designed for easy editing by non-coders. Content is data-driven via `_data/*.yml` and reusable HTML includes in `_includes/`.

## How to edit content

- Header and footer links: `_data/nav.yml`
- Hero text and video: `_data/hero.yml`
- Cards in the scrolling marquee: `_data/cards.yml`
- Theme colors (light/dark): `_data/theme.yml`
- Images: place under `images/` and reference with a path like `/images/your-file.png`

Each data file contains short comments explaining what to change.

## Structure

- `_layouts/default.html`: Base layout, sets theme variables and includes header/footer
- `_includes/header.html`, `_includes/footer.html`, `_includes/hero.html`, `_includes/cards-marquee.html`
- `index.html`: Home page that stitches includes together
- `assets/styles.css`: Single source of styles

## Run locally

Requires Ruby + Bundler and Jekyll.

```bash
# Install Jekyll tooling (one time)
# If you don't have Ruby/bundler/jekyll, install via rbenv/asdf or system Ruby
# gem install bundler jekyll

# Serve the site
jekyll serve --livereload
# Open http://127.0.0.1:4000
```

If your GitHub Pages is configured, you can also rely on GitHub to build it automatically on push.

## Deploy (GitHub Pages)

- Commit and push changes to the `main` branch; GitHub Pages (if enabled) will rebuild.
- Settings → Pages → Build from GitHub Actions or from branch.
- If using Actions, ensure a workflow exists in `.github/workflows/`.

## Add new cards

1. Upload your image to `images/`
2. Add an entry in `_data/cards.yml`:

```yaml
- title: "My Card"
  text: "Short description"
  image: "/images/my-card.png"
  link:  "https://example.com"
```

## Notes

- Avoid spaces in filenames; use dashes or underscores.
- The theme toggle remembers preference in the browser.

## Base URL configuration

If your site is served from a subpath (e.g. https://user.github.io/repo), set in _config.yml:

- url: https://user.github.io
- baseurl: /repo

Use {{ "relative_url" }} filter for links and assets to respect baseurl.

Local test with baseurl:

```bash
jekyll serve --baseurl "$$(awk -F: "/baseurl:/ {print $2}" _config.yml | xargs)"
```

