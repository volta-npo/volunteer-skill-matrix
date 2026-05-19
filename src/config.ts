export const config = {
  "number": 48,
  "slug": "volunteer-skill-matrix",
  "title": "Volunteer Skill Matrix",
  "category": "Student Agency Operations",
  "tagline": "A skills inventory that matches students to projects without overloading the same top performers.",
  "persona": "Chapter leads building pods from student cohorts.",
  "gap": "Student organizations often underuse talent because skills are hidden or self-reported inconsistently.",
  "niche": "Student talent allocation for real client work.",
  "metric": "projects staffed with balanced skills and availability",
  "modules": [
    "Skill self-assessment",
    "Evidence fields",
    "Availability map",
    "Pod matching view"
  ],
  "theme": {
    "accent": "#f97316",
    "accent2": "#fdba74",
    "emoji": "\ud83c\udf93",
    "metricLabel": "Operating readiness",
    "workflow": [
      "Set roles and artifacts",
      "Run rubric review",
      "Resolve blockers",
      "Export operating packet"
    ],
    "privacy": "Separate internal student notes from client-facing exports. Never store passwords."
  },
  "statuses": [
    "not-started",
    "blocked",
    "in-progress",
    "ready",
    "approved"
  ],
  "criteria": [
    {
      "id": "skill-self-assessment",
      "label": "Skill self-assessment",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify skill self-assessment with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "evidence-fields",
      "label": "Evidence fields",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify evidence fields with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "availability-map",
      "label": "Availability map",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify availability map with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "pod-matching-view",
      "label": "Pod matching view",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify pod matching view with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "evidence-quality",
      "label": "Evidence quality",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Attach proof, source notes, screenshots, owner confirmation, or reviewer rationale."
    },
    {
      "id": "owner-handoff",
      "label": "Owner handoff",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Make the output understandable and maintainable by a nontechnical owner."
    },
    {
      "id": "mission-alignment",
      "label": "Mission alignment",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Show how this advances digital equity, student growth, or pro bono delivery."
    },
    {
      "id": "qa-safety",
      "label": "QA and safety",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Resolve privacy, accessibility, accuracy, and operational risks before handoff."
    }
  ],
  "templates": {
    "actions": [
      "Run a real Volta scenario for Volunteer Skill Matrix and capture baseline evidence.",
      "Complete the skill self-assessment workflow with owner-safe notes.",
      "Resolve all blocked rubric items and add evidence for every ready item.",
      "Export the handoff packet and review it with a mentor before client use."
    ]
  },
  "sample": {
    "clientName": "Volta Cyprus Chapter",
    "chapter": "Cyprus",
    "studentLead": "Volta Student Lead",
    "notes": "Internal chapter operations project for student-led delivery excellence. Volunteer Skill Matrix sample.",
    "evidencePrefix": "Volunteer Skill Matrix",
    "evidence": [
      "Discovery call notes captured with owner confirmation.",
      "Public digital footprint reviewed and summarized.",
      "Mentor QA comments attached before handoff."
    ]
  }
};
