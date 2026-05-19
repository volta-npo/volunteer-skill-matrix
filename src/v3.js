export const v3 = {
    "productName": "Volunteer Skill Matrix",
    "productTier": "release",
    "category": "Student Agency Operations",
    "acceptance": [
        "mentor signoff tracked",
        "client-safe export available",
        "role ownership explicit",
        "impact evidence preserved"
    ],
    "capabilities": [
        "Domain-specific workbench: Talent Coverage Matrix",
        "Operational table: Volunteer skills",
        "Local autosave with no backend dependency",
        "JSON production bundle export/import",
        "CSV operational table export",
        "Markdown release certification export",
        "Print-ready handoff and release packet",
        "Integrity hash for release evidence"
    ],
    "schemas": [
        "workspace.version:string",
        "workspace.updatedAt:iso-date",
        "releaseGate.status:enum",
        "releaseGate.evidence:string",
        "releaseGate.owner:string",
        "releaseGate.severity:enum",
        "bundle.product.slug:string",
        "bundle.certification.hash:string"
    ],
    "qualityGates": [
        "All exports work offline",
        "Privacy and data handling documented",
        "No blocked critical gates",
        "Every certified claim has evidence",
        "Import rejects wrong product bundles",
        "Release hash is deterministic",
        "Client-safe markdown contains no secrets",
        "CSV contains every operational row",
        "Evidence for advanced skills",
        "Max load enforced",
        "Balanced pod coverage required"
    ],
    "releaseChecklist": [
        "Core workflow completes from empty state to export",
        "Sample data demonstrates realistic Volta field usage",
        "JSON export/import round trip validated",
        "Markdown certification packet generated",
        "CSV operational export generated",
        "Print view produces client-safe handoff",
        "No raw passwords or secrets stored",
        "Local-first privacy model documented",
        "Keyboard-accessible controls present",
        "Owner/mentor review gates represented",
        "Evidence required for launch-ready claims",
        "Release certification hash generated",
        "Coverage Score reaches production threshold",
        "Overuse Risk is documented with evidence",
        "Pod Fit has no unresolved blocker",
        "Staffing plan verified",
        "Pod match sheet verified",
        "Skill-gap report verified"
    ],
    "operations": [
        "Operate as a static local-first OSS product.",
        "Privacy: client data stays in the browser unless the user exports it.",
        "Backups: use JSON production bundle export after every client session.",
        "Recovery: import a previously exported production bundle.",
        "Release: certify all gates before public client handoff.",
        "Support: triage issues by blocked, critical, high, normal severity."
    ],
    "testPlan": [
        "Definition schema tests",
        "Initial non-certified state test",
        "Certification happy path test",
        "Export/import round-trip test",
        "Wrong-slug rejection test",
        "Markdown safety test",
        "CSV completeness test",
        "Integrity mutation test",
        "Self-audit test",
        "Blocked/critical gate tests"
    ]
};
//# sourceMappingURL=v3.js.map