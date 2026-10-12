# Community solar feasibility to delivery

**Client / workspace:** Energy · illustrative example

**Start:** 2027-01-01 · **Quarters:** 4

## Workstreams

| ID | Workstream | Colour |
| --- | --- | --- |
| energy-t0 | Demand &amp; stakeholders | #376d62 |
| energy-t1 | Site &amp; feasibility | #6979ab |
| energy-t2 | Delivery &amp; procurement | #bd8659 |
| energy-t3 | Operations &amp; value | #8a70a1 |

## Activities and dependencies

| ID | Activity | Workstream | Start | Finish | Status | Owner | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| energy-a0 | Agree project objectives and stakeholders | Demand &amp; stakeholders | 2027-01-01 | 2027-01-03 | Planned |  | — |
| energy-a1 | Measure baseline energy demand | Demand &amp; stakeholders | 2027-01-04 | 2027-01-06 | Planned |  | energy-a0 |
| energy-a2 | Assess site suitability and grid options | Site &amp; feasibility | 2027-01-07 | 2027-01-09 | Planned |  | energy-a0 |
| energy-a3 | Review permissions, costs and business case | Site &amp; feasibility | 2027-04-10 | 2027-04-12 | Planned |  | energy-a1, energy-a2 |
| energy-a4 | Agree design and procurement approach | Delivery &amp; procurement | 2027-04-13 | 2027-04-15 | Planned |  | energy-a3 |
| energy-a5 | Plan installation and commissioning | Delivery &amp; procurement | 2027-07-16 | 2027-07-18 | Planned |  | energy-a4 |
| energy-a6 | Prepare maintenance and monitoring | Operations &amp; value | 2027-07-19 | 2027-07-21 | Planned |  | energy-a5 |
| energy-a7 | Review performance and benefits | Operations &amp; value | 2027-10-22 | 2027-10-24 | Planned |  | energy-a6 |

## Restore data

This structured block preserves the complete data for import. The tables above are a readable summary; edit this block to change the imported data.

<!-- mightora:roadmap:v1 -->

```json
{"schemaVersion":1,"title":"Community solar feasibility to delivery","client":"Energy · illustrative example","startDate":"2027-01-01","periodCount":4,"quarterLabels":["Q1 · Discover","Q2 · Develop","Q3 · Validate","Q4 · Adopt"],"tracks":[{"id":"energy-t0","name":"Demand & stakeholders","color":"#376d62"},{"id":"energy-t1","name":"Site & feasibility","color":"#6979ab"},{"id":"energy-t2","name":"Delivery & procurement","color":"#bd8659"},{"id":"energy-t3","name":"Operations & value","color":"#8a70a1"}],"activities":[{"id":"energy-a0","title":"Agree project objectives and stakeholders","trackId":"energy-t0","start":"2027-01-01","end":"2027-01-03","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"energy-a1","title":"Measure baseline energy demand","trackId":"energy-t0","start":"2027-01-04","end":"2027-01-06","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a0"]},{"id":"energy-a2","title":"Assess site suitability and grid options","trackId":"energy-t1","start":"2027-01-07","end":"2027-01-09","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a0"]},{"id":"energy-a3","title":"Review permissions, costs and business case","trackId":"energy-t1","start":"2027-04-10","end":"2027-04-12","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a1","energy-a2"]},{"id":"energy-a4","title":"Agree design and procurement approach","trackId":"energy-t2","start":"2027-04-13","end":"2027-04-15","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a3"]},{"id":"energy-a5","title":"Plan installation and commissioning","trackId":"energy-t2","start":"2027-07-16","end":"2027-07-18","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a4"]},{"id":"energy-a6","title":"Prepare maintenance and monitoring","trackId":"energy-t3","start":"2027-07-19","end":"2027-07-21","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a5"]},{"id":"energy-a7","title":"Review performance and benefits","trackId":"energy-t3","start":"2027-10-22","end":"2027-10-24","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["energy-a6"]}]}
```
