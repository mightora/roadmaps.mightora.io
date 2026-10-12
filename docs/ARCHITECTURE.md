# Architecture and trust boundaries

## Delivery model

Mightora Roadmaps is a static web application published from `dist/` to GitHub Pages. Node.js is used for building examples, generating discovery metadata and running tests; it is **not required as a runtime server** for the public editor.

The application runs in the browser, using local storage for workspace data. Markdown/CSV imports are parsed locally, and exported files are generated locally. Snapshot sharing compresses selected roadmap data into a URL fragment; recipients receive a copy, not live access to the author's workspace.

## Data flow

1. The browser downloads the HTML, JavaScript and CSS from the website host.
2. Additional shared UI styles, components and images may be requested from jsDelivr and GitHub-hosted asset URLs.
3. Workspace changes are written to local storage on the user's device.
4. Import/export reads or writes files chosen by the user.
5. Sharing places selected roadmap content into the URL fragment; it is not an authenticated, revocable sharing service.

## Security assumptions and limitations

- HTTPS is strongly recommended; HTTP and HTTPS have separate browser storage.
- Do not use this public, local-first editor as an access-controlled system for confidential client plans.
- Shared links are snapshots and can be forwarded by recipients.
- The browser storage and imported files are untrusted inputs; validate and bound their size and schema.
- Externally hosted scripts and styles are part of the supply-chain attack surface. Pinning immutable asset versions, reducing external dependencies and introducing a reviewed Content Security Policy are future hardening opportunities; **they are not currently claimed as completed**.
- Automated checks, CodeQL and dependency-update PRs improve visibility but cannot eliminate vulnerabilities.

## Quality controls

GitHub Actions runs build, syntax and test checks on pull requests. CodeQL scans JavaScript and GitHub Actions workflows on pushes, pull requests and a weekly schedule. Dependabot proposes updates to GitHub Actions and npm dependencies. A maintainer should review results before merging; check badges reflect workflow outcomes, not a security certification.

See [SECURITY.md](../SECURITY.md), [PRIVACY.md](../PRIVACY.md) and [CONTRIBUTING.md](../CONTRIBUTING.md).
