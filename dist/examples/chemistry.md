# Safer coatings: research to market

**Client / workspace:** Chemistry · illustrative example

**Start:** 2027-01-01 · **Quarters:** 4

## Workstreams

| ID | Workstream | Colour |
| --- | --- | --- |
| chemistry-t0 | Drivers &amp; requirements | #376d62 |
| chemistry-t1 | Research &amp; evidence | #6979ab |
| chemistry-t2 | Pilot &amp; manufacturing | #bd8659 |
| chemistry-t3 | Market adoption | #8a70a1 |

## Activities and dependencies

| ID | Activity | Workstream | Start | Finish | Status | Owner | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| chemistry-a0 | Understand coating performance needs | Drivers &amp; requirements | 2027-01-01 | 2027-01-03 | Planned |  | — |
| chemistry-a1 | Map applicable safety and compliance requirements | Drivers &amp; requirements | 2027-01-04 | 2027-01-06 | Planned |  | — |
| chemistry-a2 | Screen candidate materials | Research &amp; evidence | 2027-01-07 | 2027-01-09 | Planned |  | chemistry-a0, chemistry-a1 |
| chemistry-a3 | Test performance and safety | Research &amp; evidence | 2027-04-10 | 2027-04-12 | Planned |  | chemistry-a2 |
| chemistry-a4 | Prepare a pilot production process | Pilot &amp; manufacturing | 2027-04-13 | 2027-04-15 | Planned |  | chemistry-a2 |
| chemistry-a5 | Validate repeatability and production cost | Pilot &amp; manufacturing | 2027-07-16 | 2027-07-18 | Planned |  | chemistry-a3, chemistry-a4 |
| chemistry-a6 | Run a customer trial | Market adoption | 2027-07-19 | 2027-07-21 | Planned |  | chemistry-a5 |
| chemistry-a7 | Decide whether to launch or iterate | Market adoption | 2027-10-22 | 2027-10-24 | Planned |  | chemistry-a6 |

## Restore data

This structured block preserves the complete data for import. The tables above are a readable summary; edit this block to change the imported data.

<!-- mightora:roadmap:v1 -->

```json
{"schemaVersion":1,"title":"Safer coatings: research to market","client":"Chemistry · illustrative example","startDate":"2027-01-01","periodCount":4,"quarterLabels":["Q1 · Discover","Q2 · Develop","Q3 · Validate","Q4 · Adopt"],"tracks":[{"id":"chemistry-t0","name":"Drivers & requirements","color":"#376d62"},{"id":"chemistry-t1","name":"Research & evidence","color":"#6979ab"},{"id":"chemistry-t2","name":"Pilot & manufacturing","color":"#bd8659"},{"id":"chemistry-t3","name":"Market adoption","color":"#8a70a1"}],"activities":[{"id":"chemistry-a0","title":"Understand coating performance needs","trackId":"chemistry-t0","start":"2027-01-01","end":"2027-01-03","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"chemistry-a1","title":"Map applicable safety and compliance requirements","trackId":"chemistry-t0","start":"2027-01-04","end":"2027-01-06","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":[]},{"id":"chemistry-a2","title":"Screen candidate materials","trackId":"chemistry-t1","start":"2027-01-07","end":"2027-01-09","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a0","chemistry-a1"]},{"id":"chemistry-a3","title":"Test performance and safety","trackId":"chemistry-t1","start":"2027-04-10","end":"2027-04-12","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a2"]},{"id":"chemistry-a4","title":"Prepare a pilot production process","trackId":"chemistry-t2","start":"2027-04-13","end":"2027-04-15","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a2"]},{"id":"chemistry-a5","title":"Validate repeatability and production cost","trackId":"chemistry-t2","start":"2027-07-16","end":"2027-07-18","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a3","chemistry-a4"]},{"id":"chemistry-a6","title":"Run a customer trial","trackId":"chemistry-t3","start":"2027-07-19","end":"2027-07-21","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a5"]},{"id":"chemistry-a7","title":"Decide whether to launch or iterate","trackId":"chemistry-t3","start":"2027-10-22","end":"2027-10-24","status":"Planned","owner":"","description":"Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.","dependencies":["chemistry-a6"]}]}
```
