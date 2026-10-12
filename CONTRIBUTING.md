# Contributing to Mightora Roadmaps

Thanks for helping make roadmap planning accessible to everyone. Contributions of all sizes are welcome: industry examples, bug reports, documentation, accessibility fixes, tests, translations and improvements to the editor.

Before starting, browse [open issues](https://github.com/mightora/roadmaps.mightora.io/issues), [report a bug](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=bug_report.yml), or [suggest a feature](https://github.com/mightora/roadmaps.mightora.io/issues/new?template=feature_request.yml). For larger changes, please discuss the idea in an issue first so we can agree on the approach. Please read our [code of conduct](CODE_OF_CONDUCT.md) and [security policy](SECURITY.md). Do not post vulnerabilities in public issues.

## Contributing industry examples

Examples are plain JSON files in `examples/`. Add or edit one file and open a pull request. You do not need to edit JavaScript or generated downloads.

1. Copy `examples/chemistry.json` to `examples/your-sector.json`.
2. Set `id` to the matching filename slug (`your-sector`), `name` to the sector name, and `title`/`description` to the example's purpose.
3. Keep `title` equal to `roadmap.title`. Edit the roadmap's quarter labels, workstreams, dates and activities.
4. Give workstreams and activities unique IDs. Every `trackId` must name a workstream; dependency entries must name activities in the same roadmap.
5. Start every activity as `Planned`. Schedule prerequisites to finish before successors start. Cycles are invalid.
6. Keep the example simple: approximately 4 workstreams, 4 quarters and 6–12 activities. These are guidance, not hard size limits. Do not include personal data, client information or credentials.
7. Use illustrative wording. Do not present unverified legal deadlines or forecasts as facts. Explain evidence in activity descriptions where useful.
8. With Node.js 24+, run `npm run build`, `npm run check` and `npm test`.
9. Commit only your source JSON change and any intentional docs/code changes. Generated `dist/examples.mjs`, downloads and discovery metadata are rebuilt by GitHub Actions.
10. Open a pull request describing the sector, intended users and why the example is useful.

The generator discovers all `examples/*.json` automatically and checks the file's metadata, dates, IDs, references, status and dependencies. The picker, catalog and downloadable Markdown/CSV/JSON are generated from those files. A structural roadmap schema is in `dist/roadmap.schema.json`; runtime validation checks additional relationships.

Without Node.js, edit a JSON file through GitHub's web interface and open a PR. GitHub Actions provides validation results. If you export a roadmap as Markdown from the app, the restore-data JSON block contains the roadmap object you can paste into the example's `roadmap` field. Alternatively download an example JSON file and edit it.

## Other contributions

Use `npm start` after building to run the editor locally at http://localhost:8080. Keep the browser-local edition free of required accounts or paid services. Changes to data formats must preserve existing imports and share links. Describe user-visible changes and relevant validation in your pull request.

## Pull request checklist

- Keep changes small and explain why they matter. Link a related issue where available.
- Describe how you tested the change, including keyboard and mobile behaviour if UI is affected.
- Run `npm run build && npm run check && npm test` (Node.js 24+). GitHub Actions repeats these checks for pull requests.
- Update documentation and tests for user-visible behaviour and data-format changes.
- Do not include client data, private roadmaps, API keys, credentials, or sensitive URLs in screenshots, examples, tests or logs.
- Preserve existing Markdown/CSV formats and snapshot links when possible; document any unavoidable migration.
- Do not add external dependencies, tracking scripts or hosted services without explaining the privacy, licence, security and maintenance implications.
- Check the [accessibility statement](ACCESSIBILITY.md) and keep focus indicators, labels and keyboard support intact.
- Be respectful in review. Maintainers may request changes and have final merge responsibility; see [governance](GOVERNANCE.md).

## Reviewing and maintaining

All normal code contributions go through pull requests, with publicly visible checks and review discussion. A passing workflow is not a substitute for manual review. We welcome first-time contributors; asking questions is fine. We cannot promise an issue or pull request response deadline.
