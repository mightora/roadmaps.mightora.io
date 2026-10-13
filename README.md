# Mightora Roadmaps

[![Build & tests](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/pages.yml)
[![CodeQL analysis](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[Use the editor](https://roadmaps.mightora.io/)** · **[Documentation](https://roadmaps.mightora.io/docs/)** · **[Source code](https://github.com/mightora/roadmaps.mightora.io)** · **[Report a bug](https://github.com/mightora/roadmaps.mightora.io/issues/new/choose)** · **[Suggest a feature](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=feature_request.yml)** · **[Contribute](CONTRIBUTING.md)**

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
- Copyable, plan-specific browser bookmarks, with recently edited plans in the roadmap library.
- Polished read-only published roadmap pages with progress, quarter timeline, expandable activity details and copyable self-contained links.
- Read-only compressed snapshot links and editable recipient copies.
- Illustrated documentation and SVG graphics across the site.
- Local history, templates, portfolio summaries and SVG/print exports.
- **Presentation studio:** generate an editable 16:9 slide deck with title, executive summary, multi-page roadmap timeline, dependencies, quarter-by-quarter delivery, workstream breakdowns, delivery risks and next steps. Preview every slide, edit text/cards, reorder or hide slides, add commentary, save/reopen a deck draft, and export an editable PowerPoint (.pptx). Optional activity deep dives and owner inclusion.
- Crawlable guide and example pages, structured app metadata, sitemap and social metadata.
- Public example catalog, JSON Schema, agent data guide and `llms.txt` discovery aid.

## Presentation preview and PowerPoint export

Select **Presentation preview** from an open roadmap. The studio opens in the same browser tab using a temporary session-storage copy. It creates slides for the roadmap at different levels: executive summary, a paginated timeline, dependency links, individual quarters, workstreams and next steps. You can include individual activity deep dives if needed.

Edit slide text and content cards, reorder or exclude slides, add commentary and presenter notes, then export **PowerPoint (.pptx)**. Slide content uses native editable PowerPoint text boxes and shapes, not screenshots. The roadmap itself is never changed by presentation edits. Use **Save deck draft** to export your edits as JSON and **Open deck draft** to restore them. A regenerated deck replaces edits, so save a draft first.

The editor and preview run locally. When you click **Export PowerPoint**, the browser loads PptxGenJS from jsDelivr; this requires network access and makes a request to that provider. No roadmap data is sent to a Mightora server. Owner names are excluded by default. See [presentation documentation](dist/docs/presentations.html) and [privacy details](PRIVACY.md).

## Trust badges and consistent iconography

The homepage displays live **Build & tests** and **CodeQL analysis** workflow status badges linked to their GitHub results, plus the project’s **MIT licence** badge. These are verifiable status indicators, not security certifications or independent audits. The badge images are served by GitHub and Shields.io, as documented in [PRIVACY.md](PRIVACY.md).

The sidebar, editor controls, roadmap statistics and community actions use a single accessible, inline SVG icon set in [`dist/icons.mjs`](dist/icons.mjs). The icons share a 24px viewBox, 1.8px rounded strokes and currentColor so they follow the Mightora shared theme. Decorative icons have `aria-hidden="true"`; labels remain visible and accessible.

## Community, openness and trust

This is a community project: **all editing features are free**, there are no accounts, and changes are reviewed in public pull requests. You can [report bugs](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=bug_report.yml), [propose features](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=feature_request.yml), or [contribute an industry example](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=industry_example.yml). Start with [CONTRIBUTING.md](CONTRIBUTING.md).

- [Build and test results](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/pages.yml) and [CodeQL analysis](https://github.com/mightora/roadmaps.mightora.io/actions/workflows/codeql.yml) are public. Badges show workflow outcomes, **not a guarantee of security**.
- [Security policy](SECURITY.md): disclose vulnerabilities privately, not through public issues.
- [Privacy and data handling](PRIVACY.md): browser-local workspace data, share-link limitations and third-party requests.
- [Code of conduct](CODE_OF_CONDUCT.md), [governance](GOVERNANCE.md), [accessibility](ACCESSIBILITY.md), and [support](SUPPORT.md).
- [Architecture and security boundaries](docs/ARCHITECTURE.md) describe how the site works and what remains to be improved.

The project is maintained by volunteers without guaranteed response times. The MIT license is permissive but does not imply an audit, endorsement, warranty, or trademark licence.

## Footer and shared branding

The website uses Mightora's shared header, author and footer components. The footer navigation is deliberately configured in [dist/footer.json](dist/footer.json) so all links resolve to real Roadmaps or Mightora destinations and do not depend on malformed or changing external YAML. The shared footer component accepts this JSON because JSON is valid YAML. Footer layout and responsive rules are in [dist/platform.css](dist/platform.css).

## Data and sharing

Browser data is device-specific. Export backups before clearing storage or changing devices. Share links contain snapshots; later edits need a new link. Persistent published URLs and online collaboration are not implemented. Public examples contain no user workspace data.

## License

Code and contributed examples are MIT licensed; see [LICENSE](LICENSE). Externally loaded dependencies and Mightora branding assets retain their respective licenses and branding rights. The MIT license grants no trademark rights.

## Custom domain and browser security

Use **HTTPS** for a custom domain, and enable **Enforce HTTPS** in GitHub Pages once the certificate is ready. `crypto.randomUUID()` is unavailable on HTTP origins in many browsers. The editor uses a cryptographically secure `getRandomValues()` fallback for ID generation, but HTTPS remains the recommended way to access the site. Browser-local workspaces are scoped to the URL origin, so export a Markdown or CSV backup before changing an existing site from HTTP to HTTPS.

## Returning to plans and publishing

Select **Copy plan link** to bookmark a roadmap by its browser-local identifier. This link does not contain data, is not an account or cloud save, and only works in a browser that still has that roadmap in local storage. Export a workspace backup for durable recovery or another device.

Select **Publish** to create a self-contained read-only URL for `published.html`. Recipients see a polished presentation and can save an independent editable copy. Links are not server-hosted records: they cannot be revoked, access-controlled or automatically updated. Republish after changes. The full URL embeds the selected data, so do not include sensitive information. See [the documentation](dist/docs/index.html) and [privacy information](PRIVACY.md).
