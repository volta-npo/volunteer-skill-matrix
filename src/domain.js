export const domain = {
  "kind": "skill-matrix",
  "title": "Volunteer Skill Matrix",
  "purpose": "A purpose-built skill matrix interface for a skills inventory that matches students to projects without overloading the same top performers.",
  "inputTitle": "Product-specific inputs",
  "previewTitle": "Generated working outputs",
  "tableTitle": "Volunteer skills",
  "metricLabels": [
    "Coverage Score",
    "Overuse Risk",
    "Pod Fit"
  ],
  "fields": [
    {
      "id": "organization-client",
      "label": "Organization / client",
      "type": "text",
      "sample": "Volta Cyprus Chapter",
      "placeholder": "Enter organization / client"
    },
    {
      "id": "primary-goal",
      "label": "Primary goal",
      "type": "text",
      "sample": "projects staffed with balanced skills and availability",
      "placeholder": "Enter primary goal"
    },
    {
      "id": "owner-reviewer",
      "label": "Owner / reviewer",
      "type": "text",
      "sample": "Volta project lead",
      "placeholder": "Enter owner / reviewer"
    },
    {
      "id": "evidence-source",
      "label": "Evidence source",
      "type": "text",
      "sample": "Owner interview + public audit",
      "placeholder": "Enter evidence source"
    },
    {
      "id": "rows-people",
      "label": "Rows / people",
      "type": "number",
      "sample": 18,
      "placeholder": "Enter rows / people"
    },
    {
      "id": "columns-skills",
      "label": "Columns / skills",
      "type": "number",
      "sample": 12,
      "placeholder": "Enter columns / skills"
    },
    {
      "id": "coverage-target-percent",
      "label": "Coverage target percent",
      "type": "number",
      "sample": 90,
      "placeholder": "Enter coverage target percent"
    },
    {
      "id": "max-load",
      "label": "Max load",
      "type": "number",
      "sample": 3,
      "placeholder": "Enter max load"
    }
  ],
  "rows": [
    "Volunteers entered",
    "Skills self-assessed",
    "Evidence links attached",
    "Availability captured",
    "Load limits set",
    "Assignments tracked",
    "Pod recommendations generated",
    "Skill-gap report exported"
  ],
  "artifacts": [
    "Staffing plan",
    "Pod match sheet",
    "Skill-gap report"
  ],
  "checks": [
    "Evidence for advanced skills",
    "Max load enforced",
    "Balanced pod coverage required"
  ],
  "sampleClient": "Volta Cyprus Chapter"
};
