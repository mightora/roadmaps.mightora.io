# Privacy and data handling

Mightora Roadmaps is a static, browser-first application. No account or organisation membership is required to use the community edition.

## Your roadmap data

The editor stores your workspace, activity details, notes, history and templates in your browser's local storage for the current site origin. This information is not automatically uploaded to an application-operated roadmap server. It can be lost if you clear browser data, switch browsers or devices, or change between HTTP and HTTPS. Use the Markdown or CSV export features for backups.

Import files are processed by the browser application. A generated share link embeds a snapshot of the selected roadmap in the URL fragment; anyone with the full link can read the included data and save a copy. Do not include personal, confidential or client-sensitive information in a link you plan to share. Recipients, browser history, screenshots, extensions and link-sharing services may retain the URL. Links do not provide revocation, access controls or live synchronisation.

## Network requests and third parties

The static website is delivered through its web host (such as GitHub Pages). It also references external Mightora shared UI assets, jsDelivr-hosted scripts and styles, GitHub-hosted images and author images. Visiting the site therefore sends normal HTTP requests and associated technical metadata (such as IP address and browser information) to the relevant providers. Review their privacy policies for their own logging and retention practices. We do not claim that using the site results in zero network requests.

This repository does not currently implement a dedicated user-account service, server-side roadmap database or app-specific analytics. Future additions that change these behaviours should update this document before release.

## Control and deletion

You can export your workspace or clear the site's stored data using your browser's site-data controls. Clearing local data is irreversible without an exported backup. Repository issues and pull requests are public; do not include personal data or sensitive roadmap links when contributing.

For security reports, follow [SECURITY.md](SECURITY.md). For questions about the project, see [SUPPORT.md](SUPPORT.md).

_Last reviewed: October 2026._
