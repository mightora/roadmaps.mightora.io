# Mightora Roadmaps

A free, open-source browser roadmap editor with editable workstreams, quarters, activities and dependencies. Import/export Markdown and CSV, or share a read-only snapshot link. Your workspace saves locally in the browser; no account is required.

## Industry examples

Choose Chemistry (safer coatings), Manufacturing (predictive maintenance), Energy (community solar) or Power Platform (app factory). Each starter has four quarters, four workstreams and eight activities. Examples are illustrative starting points, not regulatory advice or forecasts.

Add new examples by editing a single JSON file in `examples/` and opening a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Run locally

Use Node.js 24 or later. No dependency installation is required.

```sh
npm run build
npm start
```

Open http://localhost:8080. Run `npm run check` and `npm test` before submitting code.

## GitHub Pages

The included workflow validates every pull request. Pushes to `main` deploy `dist/` to GitHub Pages after checks pass. Enable Pages with GitHub Actions as the source. The workflow requests automatic enablement where repository permissions permit it; if this is refused, use Settings → Pages → Build and deployment → GitHub Actions.

The default public URL is https://mightora.github.io/roadmaps.mightora.io/. No custom domain is assumed. To use roadmaps.mightora.io later, configure the custom domain and DNS first; the build takes the actual Pages URL for canonical metadata and sitemap entries.

For another host, run `SITE_URL=https://your-host/your-path/ npm run build`.

## Features

- Multiple roadmaps, editable workstreams and 4–12 quarters with custom labels.
- Multiple activities in a cell; cross-workstream prerequisites, cycle prevention and blocker checks.
- Markdown/CSV roadmap transfers and whole-workspace backups with preview.
- Read-only compressed snapshot links and editable recipient copies.
- Local history, templates, portfolio summaries and SVG/print exports.
- Crawlable guide and example pages, structured app metadata, sitemap and social metadata.
- Public example catalog, JSON Schema, agent data guide and `llms.txt` discovery aid.

## Data and sharing

Browser data is device-specific. Export backups before clearing storage or changing devices. Share links contain snapshots; later edits need a new link. Persistent published URLs and online collaboration are not implemented. Public examples contain no user workspace data.

## License

Code and contributed examples are MIT licensed; see [LICENSE](LICENSE). Externally loaded dependencies and Mightora branding assets retain their respective licenses and branding rights. The MIT license grants no trademark rights.

## Custom domain and browser security

Use **HTTPS** for a custom domain, and enable **Enforce HTTPS** in GitHub Pages once the certificate is ready. `crypto.randomUUID()` is unavailable on HTTP origins in many browsers. The editor uses a cryptographically secure `getRandomValues()` fallback for ID generation, but HTTPS remains the recommended way to access the site. Browser-local workspaces are scoped to the URL origin, so export a Markdown or CSV backup before changing an existing site from HTTP to HTTPS.
