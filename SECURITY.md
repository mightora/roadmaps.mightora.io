# Security policy

Security reports are welcome and should be handled privately to protect users.

## Reporting a vulnerability

**Do not create a public issue or pull request containing exploit details, credentials or sensitive user data.** Check [Security → Advisories](https://github.com/mightora/roadmaps.mightora.io/security/advisories) for the private vulnerability reporting option. If the repository has private reporting enabled, use [Report a vulnerability](https://github.com/mightora/roadmaps.mightora.io/security/advisories/new). If that option is unavailable, please contact the maintainers through a private contact channel listed on their GitHub profiles. Do not share the technical details publicly while requesting a private contact route.

Include the affected URL or code version, impact, minimal reproduction steps, and a suggested mitigation if you have one. Avoid uploading actual private roadmaps or credentials.

We aim to acknowledge and triage reports responsibly, but this community project does not promise a response or remediation deadline. We will credit reporters with permission and coordinate disclosure where practical.

## Scope and known boundaries

The supported version is the current `main` branch and the GitHub Pages deployment. Older commits and forks are not actively maintained. The application runs primarily in the browser and stores roadmaps in local storage. Share links encode a snapshot of roadmap content in the URL; **treat those links as sensitive when they contain non-public information**.

Automated tests and CodeQL scans are defence-in-depth, not a guarantee of safety. Third-party UI assets are loaded from external origins; see [PRIVACY.md](PRIVACY.md) and [architecture notes](docs/ARCHITECTURE.md).

## Responsible testing

Test only against your own data and environments. Do not disrupt availability, access others' information, or perform social engineering. Follow applicable laws and GitHub's policies.
