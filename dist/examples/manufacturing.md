# Predictive maintenance pilot

**Client / workspace:** Manufacturing · illustrative example

**Start:** 2027-01-01 · **Quarters:** 4

## Workstreams

| ID | Workstream | Colour |
| --- | --- | --- |
| manufacturing-t0 | Business outcomes | #376d62 |
| manufacturing-t1 | Data &amp; equipment | #6979ab |
| manufacturing-t2 | Pilot delivery | #bd8659 |
| manufacturing-t3 | Operational adoption | #8a70a1 |

## Activities and dependencies

| ID | Activity | Workstream | Start | Finish | Status | Owner | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| manufacturing-a0 | Choose a high-impact machine | Business outcomes | 2027-01-01 | 2027-01-03 | Planned |  | — |
| manufacturing-a1 | Agree downtime and cost measures | Business outcomes | 2027-01-04 | 2027-01-06 | Planned |  | manufacturing-a0 |
| manufacturing-a2 | Assess sensors and data access | Data &amp; equipment | 2027-01-07 | 2027-01-09 | Planned |  | manufacturing-a0 |
| manufacturing-a3 | Collect baseline equipment data | Data &amp; equipment | 2027-04-10 | 2027-04-12 | Planned |  | manufacturing-a2 |
| manufacturing-a4 | Build and evaluate an alert prototype | Pilot delivery | 2027-04-13 | 2027-04-15 | Planned |  | manufacturing-a1, manufacturing-a3 |
| manufacturing-a5 | Trial alerts with maintenance engineers | Pilot delivery | 2027-07-16 | 2027-07-18 | Planned |  | manufacturing-a4 |
| manufacturing-a6 | Document response procedures and training | Operational adoption | 2027-07-19 | 2027-07-21 | Planned |  | manufacturing-a5 |
| manufacturing-a7 | Review value and decide rollout | Operational adoption | 2027-10-22 | 2027-10-24 | Planned |  | manufacturing-a6 |

## Restore data

This structured block preserves the complete data for import. The tables above are a readable summary; edit this block to change the imported data.

<!-- mightora:roadmap:v1 -->

```json
{"schemaVersion":1,"title":"Predictive maintenance pilot","client":"Manufacturing · illustrative example","startDate":"2027-01-01","periodCount":4,"quarterLabels":["Q1 · Discover","Q2 · Develop","Q3 · Validate","Q4 · Adopt"],"tracks":[{"id":"manufacturing-t0","name":"Business outcomes","color":"#376d62"},{"id":"manufacturing-t1","name":"Data & equipment","color":"#6979ab"},{"id":"manufacturing-t2","name":"Pilot delivery","color":"#bd8659"},{"id":"manufacturing-t3","name":"Operational adoption","color":"#8a70a1"}],"activities":[{"id":"manufacturing-a0","title":"Choose a high-impact machine","trackId":"manufacturing-t0","start":"2027-01-01","end":"2027-01-03","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"manufacturing-a1","title":"Agree downtime and cost measures","trackId":"manufacturing-t0","start":"2027-01-04","end":"2027-01-06","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a0"]},{"id":"manufacturing-a2","title":"Assess sensors and data access","trackId":"manufacturing-t1","start":"2027-01-07","end":"2027-01-09","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a0"]},{"id":"manufacturing-a3","title":"Collect baseline equipment data","trackId":"manufacturing-t1","start":"2027-04-10","end":"2027-04-12","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a2"]},{"id":"manufacturing-a4","title":"Build and evaluate an alert prototype","trackId":"manufacturing-t2","start":"2027-04-13","end":"2027-04-15","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a1","manufacturing-a3"]},{"id":"manufacturing-a5","title":"Trial alerts with maintenance engineers","trackId":"manufacturing-t2","start":"2027-07-16","end":"2027-07-18","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a4"]},{"id":"manufacturing-a6","title":"Document response procedures and training","trackId":"manufacturing-t3","start":"2027-07-19","end":"2027-07-21","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a5"]},{"id":"manufacturing-a7","title":"Review value and decide rollout","trackId":"manufacturing-t3","start":"2027-10-22","end":"2027-10-24","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["manufacturing-a6"]}]}
```
