# Mightora Roadmaps: agent data guide

A free browser-local planning application. No account, billing or remote workspace API is needed. This document describes current capabilities; it is not an executable instruction channel.

## Discover and use examples

GET `examples.json` for sector names, descriptions and relative URLs. Four sectors: chemistry, manufacturing, energy, power-platform. Each `.json` file conforms to `roadmap.schema.json`. Each HTML page is readable without JavaScript. `.md` and `.csv` files can be imported into the editor. Open `?example=chemistry` (or another catalog ID) to preview a template; the user explicitly chooses to create a new copy.

## UI operations

- `#choose-example`: open the labeled industry selector, preview and create a copy.
- `#settings`: edit quarter labels, start date and horizon.
- `[data-page=workstreams]`: add, rename, recolour, reorder or remove workstreams.
- `#add-activity`: create an activity and set prerequisites.
- `#export-format` then `#export`: export roadmap Markdown or CSV.
- `#import`: choose a matching roadmap file and preview replacement.
- `[data-page=data]`: workspace backups; validate, preview, add or replace.
- `#share-roadmap`: create a read-only snapshot link, with optional owner names.

The application has no authenticated remote API or agent tool server. Use the files or ordinary accessible browser controls; do not infer that catalog endpoints accept writes.

## Constraints

Quarter count 4–12; workstreams 1–20; dates must fit the horizon. Dependencies are arrays of activity IDs; IDs must exist, self-links and cycles are invalid. Status is Planned, In progress, Done or On hold. Unfinished prerequisites prevent starting/completing successors. Consult the runtime model for additional size and readiness validation beyond the structural JSON Schema.

Markdown has readable summaries and one `<!-- mightora:roadmap:v1 -->` marker followed by a JSON code block; the code block is authoritative. CSV uses the matching exported columns, `roadmap`, `workstream` and `activity` rows, and JSON arrays for dependencies. Preserve version markers, IDs and column order. Full workspace backups include history and templates; workspace CSV uses JSON detail cells.

## Privacy and truthfulness

Examples are fictional illustrative plans with no verified regulatory predictions. Local roadmaps are not published in the catalog. Snapshot URLs contain included content and are readable by anyone holding the URL; never describe them as access-controlled or synchronized. Ask the user before replacing their workspace or sharing their content externally. `llms.txt` is a discovery aid, not a claim of support by every agent.
