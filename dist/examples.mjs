// Generated from examples/*.json. Edit the source JSON files.
const examples=[
  {
    "id": "chemistry",
    "name": "Chemistry",
    "title": "Safer coatings: research to market",
    "description": "Connect customer needs, material research, pilot production and customer validation.",
    "roadmap": {
      "schemaVersion": 1,
      "title": "Safer coatings: research to market",
      "client": "Chemistry · illustrative example",
      "startDate": "2027-01-01",
      "periodCount": 4,
      "quarterLabels": [
        "Q1 · Discover",
        "Q2 · Develop",
        "Q3 · Validate",
        "Q4 · Adopt"
      ],
      "tracks": [
        {
          "id": "chemistry-t0",
          "name": "Drivers & requirements",
          "color": "#376d62"
        },
        {
          "id": "chemistry-t1",
          "name": "Research & evidence",
          "color": "#6979ab"
        },
        {
          "id": "chemistry-t2",
          "name": "Pilot & manufacturing",
          "color": "#bd8659"
        },
        {
          "id": "chemistry-t3",
          "name": "Market adoption",
          "color": "#8a70a1"
        }
      ],
      "activities": [
        {
          "id": "chemistry-a0",
          "title": "Understand coating performance needs",
          "trackId": "chemistry-t0",
          "start": "2027-01-01",
          "end": "2027-01-03",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "chemistry-a1",
          "title": "Map applicable safety and compliance requirements",
          "trackId": "chemistry-t0",
          "start": "2027-01-04",
          "end": "2027-01-06",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "chemistry-a2",
          "title": "Screen candidate materials",
          "trackId": "chemistry-t1",
          "start": "2027-01-07",
          "end": "2027-01-09",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a0",
            "chemistry-a1"
          ]
        },
        {
          "id": "chemistry-a3",
          "title": "Test performance and safety",
          "trackId": "chemistry-t1",
          "start": "2027-04-10",
          "end": "2027-04-12",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a2"
          ]
        },
        {
          "id": "chemistry-a4",
          "title": "Prepare a pilot production process",
          "trackId": "chemistry-t2",
          "start": "2027-04-13",
          "end": "2027-04-15",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a2"
          ]
        },
        {
          "id": "chemistry-a5",
          "title": "Validate repeatability and production cost",
          "trackId": "chemistry-t2",
          "start": "2027-07-16",
          "end": "2027-07-18",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a3",
            "chemistry-a4"
          ]
        },
        {
          "id": "chemistry-a6",
          "title": "Run a customer trial",
          "trackId": "chemistry-t3",
          "start": "2027-07-19",
          "end": "2027-07-21",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a5"
          ]
        },
        {
          "id": "chemistry-a7",
          "title": "Decide whether to launch or iterate",
          "trackId": "chemistry-t3",
          "start": "2027-10-22",
          "end": "2027-10-24",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "chemistry-a6"
          ]
        }
      ]
    }
  },
  {
    "id": "energy",
    "name": "Energy",
    "title": "Community solar feasibility to delivery",
    "description": "Connect demand, feasibility, procurement and operational readiness for an illustrative solar project.",
    "roadmap": {
      "schemaVersion": 1,
      "title": "Community solar feasibility to delivery",
      "client": "Energy · illustrative example",
      "startDate": "2027-01-01",
      "periodCount": 4,
      "quarterLabels": [
        "Q1 · Discover",
        "Q2 · Develop",
        "Q3 · Validate",
        "Q4 · Adopt"
      ],
      "tracks": [
        {
          "id": "energy-t0",
          "name": "Demand & stakeholders",
          "color": "#376d62"
        },
        {
          "id": "energy-t1",
          "name": "Site & feasibility",
          "color": "#6979ab"
        },
        {
          "id": "energy-t2",
          "name": "Delivery & procurement",
          "color": "#bd8659"
        },
        {
          "id": "energy-t3",
          "name": "Operations & value",
          "color": "#8a70a1"
        }
      ],
      "activities": [
        {
          "id": "energy-a0",
          "title": "Agree project objectives and stakeholders",
          "trackId": "energy-t0",
          "start": "2027-01-01",
          "end": "2027-01-03",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "energy-a1",
          "title": "Measure baseline energy demand",
          "trackId": "energy-t0",
          "start": "2027-01-04",
          "end": "2027-01-06",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a0"
          ]
        },
        {
          "id": "energy-a2",
          "title": "Assess site suitability and grid options",
          "trackId": "energy-t1",
          "start": "2027-01-07",
          "end": "2027-01-09",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a0"
          ]
        },
        {
          "id": "energy-a3",
          "title": "Review permissions, costs and business case",
          "trackId": "energy-t1",
          "start": "2027-04-10",
          "end": "2027-04-12",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a1",
            "energy-a2"
          ]
        },
        {
          "id": "energy-a4",
          "title": "Agree design and procurement approach",
          "trackId": "energy-t2",
          "start": "2027-04-13",
          "end": "2027-04-15",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a3"
          ]
        },
        {
          "id": "energy-a5",
          "title": "Plan installation and commissioning",
          "trackId": "energy-t2",
          "start": "2027-07-16",
          "end": "2027-07-18",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a4"
          ]
        },
        {
          "id": "energy-a6",
          "title": "Prepare maintenance and monitoring",
          "trackId": "energy-t3",
          "start": "2027-07-19",
          "end": "2027-07-21",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a5"
          ]
        },
        {
          "id": "energy-a7",
          "title": "Review performance and benefits",
          "trackId": "energy-t3",
          "start": "2027-10-22",
          "end": "2027-10-24",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "energy-a6"
          ]
        }
      ]
    }
  },
  {
    "id": "manufacturing",
    "name": "Manufacturing",
    "title": "Predictive maintenance pilot",
    "description": "Plan a small equipment-monitoring pilot, from maintenance needs to operational rollout.",
    "roadmap": {
      "schemaVersion": 1,
      "title": "Predictive maintenance pilot",
      "client": "Manufacturing · illustrative example",
      "startDate": "2027-01-01",
      "periodCount": 4,
      "quarterLabels": [
        "Q1 · Discover",
        "Q2 · Develop",
        "Q3 · Validate",
        "Q4 · Adopt"
      ],
      "tracks": [
        {
          "id": "manufacturing-t0",
          "name": "Business outcomes",
          "color": "#376d62"
        },
        {
          "id": "manufacturing-t1",
          "name": "Data & equipment",
          "color": "#6979ab"
        },
        {
          "id": "manufacturing-t2",
          "name": "Pilot delivery",
          "color": "#bd8659"
        },
        {
          "id": "manufacturing-t3",
          "name": "Operational adoption",
          "color": "#8a70a1"
        }
      ],
      "activities": [
        {
          "id": "manufacturing-a0",
          "title": "Choose a high-impact machine",
          "trackId": "manufacturing-t0",
          "start": "2027-01-01",
          "end": "2027-01-03",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "manufacturing-a1",
          "title": "Agree downtime and cost measures",
          "trackId": "manufacturing-t0",
          "start": "2027-01-04",
          "end": "2027-01-06",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a0"
          ]
        },
        {
          "id": "manufacturing-a2",
          "title": "Assess sensors and data access",
          "trackId": "manufacturing-t1",
          "start": "2027-01-07",
          "end": "2027-01-09",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a0"
          ]
        },
        {
          "id": "manufacturing-a3",
          "title": "Collect baseline equipment data",
          "trackId": "manufacturing-t1",
          "start": "2027-04-10",
          "end": "2027-04-12",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a2"
          ]
        },
        {
          "id": "manufacturing-a4",
          "title": "Build and evaluate an alert prototype",
          "trackId": "manufacturing-t2",
          "start": "2027-04-13",
          "end": "2027-04-15",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a1",
            "manufacturing-a3"
          ]
        },
        {
          "id": "manufacturing-a5",
          "title": "Trial alerts with maintenance engineers",
          "trackId": "manufacturing-t2",
          "start": "2027-07-16",
          "end": "2027-07-18",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a4"
          ]
        },
        {
          "id": "manufacturing-a6",
          "title": "Document response procedures and training",
          "trackId": "manufacturing-t3",
          "start": "2027-07-19",
          "end": "2027-07-21",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a5"
          ]
        },
        {
          "id": "manufacturing-a7",
          "title": "Review value and decide rollout",
          "trackId": "manufacturing-t3",
          "start": "2027-10-22",
          "end": "2027-10-24",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "manufacturing-a6"
          ]
        }
      ]
    }
  },
  {
    "id": "power-platform",
    "name": "Power Platform",
    "title": "A simple low-code app factory",
    "description": "Build a repeatable delivery capability through intake, guardrails, reusable features and a first application.",
    "roadmap": {
      "schemaVersion": 1,
      "title": "A simple low-code app factory",
      "client": "Power Platform · illustrative example",
      "startDate": "2027-01-01",
      "periodCount": 4,
      "quarterLabels": [
        "Q1 · Discover",
        "Q2 · Develop",
        "Q3 · Validate",
        "Q4 · Adopt"
      ],
      "tracks": [
        {
          "id": "power-platform-t0",
          "name": "Outcomes & demand",
          "color": "#376d62"
        },
        {
          "id": "power-platform-t1",
          "name": "Governance & platform",
          "color": "#6979ab"
        },
        {
          "id": "power-platform-t2",
          "name": "Features & delivery",
          "color": "#bd8659"
        },
        {
          "id": "power-platform-t3",
          "name": "People & value",
          "color": "#8a70a1"
        }
      ],
      "activities": [
        {
          "id": "power-platform-a0",
          "title": "Agree outcomes and demand intake",
          "trackId": "power-platform-t0",
          "start": "2027-01-01",
          "end": "2027-01-03",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "power-platform-a1",
          "title": "Choose the first application",
          "trackId": "power-platform-t0",
          "start": "2027-01-04",
          "end": "2027-01-06",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a0"
          ]
        },
        {
          "id": "power-platform-a2",
          "title": "Define environments and security guardrails",
          "trackId": "power-platform-t1",
          "start": "2027-01-07",
          "end": "2027-01-09",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": []
        },
        {
          "id": "power-platform-a3",
          "title": "Set up deployment and solution standards",
          "trackId": "power-platform-t1",
          "start": "2027-04-10",
          "end": "2027-04-12",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a2"
          ]
        },
        {
          "id": "power-platform-a4",
          "title": "Build a reusable feature",
          "trackId": "power-platform-t2",
          "start": "2027-04-13",
          "end": "2027-04-15",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a1",
            "power-platform-a3"
          ]
        },
        {
          "id": "power-platform-a5",
          "title": "Deliver a small application pilot",
          "trackId": "power-platform-t2",
          "start": "2027-07-16",
          "end": "2027-07-18",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a4"
          ]
        },
        {
          "id": "power-platform-a6",
          "title": "Train support and delivery teams",
          "trackId": "power-platform-t3",
          "start": "2027-07-19",
          "end": "2027-07-21",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a5"
          ]
        },
        {
          "id": "power-platform-a7",
          "title": "Review outcomes and plan the next wave",
          "trackId": "power-platform-t3",
          "start": "2027-10-22",
          "end": "2027-10-24",
          "status": "Planned",
          "owner": "",
          "description": "Illustrative planning activity. Adapt scope, dates, evidence and acceptance criteria to your project; this is not a regulatory forecast.",
          "dependencies": [
            "power-platform-a6"
          ]
        }
      ]
    }
  }
];
export const EXAMPLES=examples.map(({roadmap,...info})=>info);
export function exampleRoadmap(id){const e=examples.find(e=>e.id===id);if(!e)throw new Error('Choose a supported industry example.');return structuredClone(e.roadmap);}
