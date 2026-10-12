# A simple low-code app factory

**Client / workspace:** Power Platform · illustrative example

**Start:** 2027-01-01 · **Quarters:** 4

## Workstreams

| ID | Workstream | Colour |
| --- | --- | --- |
| power-platform-t0 | Outcomes &amp; demand | #376d62 |
| power-platform-t1 | Governance &amp; platform | #6979ab |
| power-platform-t2 | Features &amp; delivery | #bd8659 |
| power-platform-t3 | People &amp; value | #8a70a1 |

## Activities and dependencies

| ID | Activity | Workstream | Start | Finish | Status | Owner | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| power-platform-a0 | Agree outcomes and demand intake | Outcomes &amp; demand | 2027-01-01 | 2027-01-03 | Planned |  | — |
| power-platform-a1 | Choose the first application | Outcomes &amp; demand | 2027-01-04 | 2027-01-06 | Planned |  | power-platform-a0 |
| power-platform-a2 | Define environments and security guardrails | Governance &amp; platform | 2027-01-07 | 2027-01-09 | Planned |  | — |
| power-platform-a3 | Set up deployment and solution standards | Governance &amp; platform | 2027-04-10 | 2027-04-12 | Planned |  | power-platform-a2 |
| power-platform-a4 | Build a reusable feature | Features &amp; delivery | 2027-04-13 | 2027-04-15 | Planned |  | power-platform-a1, power-platform-a3 |
| power-platform-a5 | Deliver a small application pilot | Features &amp; delivery | 2027-07-16 | 2027-07-18 | Planned |  | power-platform-a4 |
| power-platform-a6 | Train support and delivery teams | People &amp; value | 2027-07-19 | 2027-07-21 | Planned |  | power-platform-a5 |
| power-platform-a7 | Review outcomes and plan the next wave | People &amp; value | 2027-10-22 | 2027-10-24 | Planned |  | power-platform-a6 |

## Restore data

This structured block preserves the complete data for import. The tables above are a readable summary; edit this block to change the imported data.

<!-- mightora:roadmap:v1 -->

```json
{"schemaVersion":1,"title":"A simple low-code app factory","client":"Power Platform · illustrative example","startDate":"2027-01-01","periodCount":4,"quarterLabels":["Q1 · Discover","Q2 · Develop","Q3 · Validate","Q4 · Adopt"],"tracks":[{"id":"power-platform-t0","name":"Outcomes & demand","color":"#376d62"},{"id":"power-platform-t1","name":"Governance & platform","color":"#6979ab"},{"id":"power-platform-t2","name":"Features & delivery","color":"#bd8659"},{"id":"power-platform-t3","name":"People & value","color":"#8a70a1"}],"activities":[{"id":"power-platform-a0","title":"Agree outcomes and demand intake","trackId":"power-platform-t0","start":"2027-01-01","end":"2027-01-03","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"power-platform-a1","title":"Choose the first application","trackId":"power-platform-t0","start":"2027-01-04","end":"2027-01-06","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a0"]},{"id":"power-platform-a2","title":"Define environments and security guardrails","trackId":"power-platform-t1","start":"2027-01-07","end":"2027-01-09","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"power-platform-a3","title":"Set up deployment and solution standards","trackId":"power-platform-t1","start":"2027-04-10","end":"2027-04-12","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a2"]},{"id":"power-platform-a4","title":"Build a reusable feature","trackId":"power-platform-t2","start":"2027-04-13","end":"2027-04-15","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a1","power-platform-a3"]},{"id":"power-platform-a5","title":"Deliver a small application pilot","trackId":"power-platform-t2","start":"2027-07-16","end":"2027-07-18","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a4"]},{"id":"power-platform-a6","title":"Train support and delivery teams","trackId":"power-platform-t3","start":"2027-07-19","end":"2027-07-21","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a5"]},{"id":"power-platform-a7","title":"Review outcomes and plan the next wave","trackId":"power-platform-t3","start":"2027-10-22","end":"2027-10-24","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["power-platform-a6"]}]}
```
