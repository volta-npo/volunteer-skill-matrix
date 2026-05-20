export function createWorkspaceProfile(config, state) {
  const criteria = state.criteria || [];
  const actions = state.actions || [];
  const evidence = state.evidence || [];
  const approvedCriteria = criteria.filter((item) => item.status === 'approved').length;
  const readyCriteria = criteria.filter((item) => item.status === 'ready' || item.status === 'approved').length;
  const blockedCriteria = criteria.filter((item) => item.status === 'blocked').length;
  const completedActions = actions.filter((action) => action.status === 'approved').length;
  const totalCriteria = config.criteria.length || 1;
  const totalActions = actions.length || 1;
  return {
    client: state.project?.clientName || 'Untitled client',
    chapter: state.project?.chapter || 'Unassigned chapter',
    lead: state.project?.studentLead || 'Unassigned lead',
    approvedCriteria,
    readyCriteria,
    blockedCriteria,
    evidenceCount: evidence.length,
    completedActions,
    completionRate: Math.round(((readyCriteria / totalCriteria) * 0.65 + (completedActions / totalActions) * 0.35) * 100),
    updatedAt: state.updatedAt || state.createdAt
  };
}

export function createSaasMetrics(config, state, scoreResult, warnings = []) {
  const profile = createWorkspaceProfile(config, state);
  const score = Number(scoreResult.score || 0);
  const risk = profile.blockedCriteria > 0 || warnings.length > 3 ? 'High' : score < 75 ? 'Medium' : 'Low';
  const revenueReadiness = Math.min(100, Math.round(score * 0.55 + profile.completionRate * 0.25 + Math.min(profile.evidenceCount, 8) * 2.5));
  const handoffConfidence = Math.min(100, Math.round(score * 0.6 + profile.evidenceCount * 4 + (state.approvals?.ownerApproval ? 12 : 0)));
  const operatingCadence = Math.min(100, Math.round(profile.completionRate * 0.7 + profile.completedActions * 7.5));
  const onboardingFriction = Math.max(0, Math.round(100 - profile.completionRate + warnings.length * 4 + profile.blockedCriteria * 8));
  const expansionSignal = Math.min(100, Math.round(profile.approvedCriteria * 9 + profile.evidenceCount * 5 + (state.approvals?.ownerApproval ? 20 : 0)));
  const supportLoad = Math.max(0, Math.round(warnings.length * 12 + profile.blockedCriteria * 18 + (state.approvals?.mentorReview ? 0 : 10)));
  return {
    profile,
    kpis: [
      { label: 'SaaS readiness', value: score, suffix: '/100', detail: scoreResult.label },
      { label: 'Revenue readiness', value: revenueReadiness, suffix: '%', detail: 'Pricing, packaging, proof, and handoff signal' },
      { label: 'Handoff confidence', value: handoffConfidence, suffix: '%', detail: `${profile.evidenceCount} evidence item(s), ${profile.approvedCriteria} approved gate(s)` },
      { label: 'Operating cadence', value: operatingCadence, suffix: '%', detail: `${profile.completedActions}/${state.actions?.length || 0} next actions complete` },
      { label: 'Onboarding friction', value: onboardingFriction, suffix: '%', detail: 'Lower is better; driven by blockers and incomplete setup' },
      { label: 'Expansion signal', value: expansionSignal, suffix: '%', detail: 'Evidence that the workspace can renew or expand' },
      { label: 'Support load', value: supportLoad, suffix: '%', detail: 'Estimated customer-success effort for this account' }
    ],
    risk,
    segments: buildSegments(config, state),
    experiments: buildExperimentBacklog(config, state, score, risk),
    board: buildCustomerBoard(config, state, warnings),
    milestones: buildMilestones(config, state, score),
    automations: buildAutomationBacklog(config, state),
    pricing: buildPricingLadder(config, state, score),
    governance: buildGovernanceChecks(config, state, warnings),
    personas: buildPersonaMatrix(config, state),
    journeys: buildLifecycleJourneys(config, state, risk),
    featurePackaging: buildFeaturePackaging(config, state),
    revenueModel: buildRevenueModel(config, state, score),
    analyticsPlan: buildAnalyticsPlan(config, state),
    securityModel: buildSecurityModel(config, state, warnings),
    successPlaybooks: buildSuccessPlaybooks(config, state, risk),
    integrations: buildIntegrationCatalog(config, state),
    expansionRoadmap: buildExpansionRoadmap(config, state, score),
    investorBrief: buildInvestorBrief(config, state, score, risk)
  };
}

export function buildSaasMarkdown(config, state, scoreResult, warnings = []) {
  const dashboard = createSaasMetrics(config, state, scoreResult, warnings);
  const lines = [];
  lines.push(`# ${config.title} Standalone SaaS Blueprint`);
  lines.push('');
  lines.push(`**Client / organization:** ${dashboard.profile.client}`);
  lines.push(`**Chapter:** ${dashboard.profile.chapter}`);
  lines.push(`**Student lead:** ${dashboard.profile.lead}`);
  lines.push(`**Risk level:** ${dashboard.risk}`);
  lines.push('');
  lines.push('## SaaS KPIs');
  dashboard.kpis.forEach((kpi) => lines.push(`- **${kpi.label}:** ${kpi.value}${kpi.suffix} — ${kpi.detail}`));
  lines.push('');
  lines.push('## Customer Segments');
  dashboard.segments.forEach((segment) => lines.push(`- **${segment.name}:** ${segment.need} Package: ${segment.package}. Success metric: ${segment.successMetric}.`));
  lines.push('');
  lines.push('## Persona Matrix');
  dashboard.personas.forEach((persona) => lines.push(`- **${persona.role}:** ${persona.job}; permission: ${persona.permission}; moment of value: ${persona.valueMoment}.`));
  lines.push('');
  lines.push('## Lifecycle Journeys');
  dashboard.journeys.forEach((journey) => lines.push(`- **${journey.phase}:** ${journey.promise} Activation: ${journey.activation}. Churn risk: ${journey.churnRisk}.`));
  lines.push('');
  lines.push('## Feature Packaging');
  dashboard.featurePackaging.forEach((feature) => lines.push(`- **${feature.feature}:** ${feature.tier} tier — ${feature.value}.`));
  lines.push('');
  lines.push('## Growth Experiments');
  dashboard.experiments.forEach((experiment) => lines.push(`- **${experiment.title}:** ${experiment.hypothesis} Measure ${experiment.metric}; owner ${experiment.owner}.`));
  lines.push('');
  lines.push('## Revenue Model');
  dashboard.revenueModel.forEach((item) => lines.push(`- **${item.lever}:** ${item.assumption}; KPI: ${item.kpi}; guardrail: ${item.guardrail}.`));
  lines.push('');
  lines.push('## Analytics Plan');
  dashboard.analyticsPlan.forEach((event) => lines.push(`- **${event.event}:** ${event.question}; owner action: ${event.action}.`));
  lines.push('');
  lines.push('## Customer Success Board');
  dashboard.board.forEach((item) => lines.push(`- **${item.stage}:** ${item.playbook} (${item.health})`));
  lines.push('');
  lines.push('## Success Playbooks');
  dashboard.successPlaybooks.forEach((playbook) => lines.push(`- **${playbook.name}:** Trigger ${playbook.trigger}; response ${playbook.response}; success ${playbook.success}.`));
  lines.push('');
  lines.push('## Integration Catalog');
  dashboard.integrations.forEach((integration) => lines.push(`- **${integration.name}:** ${integration.direction}; ${integration.value}; privacy: ${integration.privacy}.`));
  lines.push('');
  lines.push('## 30/60/90 Milestones');
  dashboard.milestones.forEach((milestone) => lines.push(`- **${milestone.window}:** ${milestone.outcome} — ${milestone.evidence}`));
  lines.push('');
  lines.push('## Expansion Roadmap');
  dashboard.expansionRoadmap.forEach((item) => lines.push(`- **${item.horizon}:** ${item.release}; unlocks ${item.unlock}; proof ${item.proof}.`));
  lines.push('');
  lines.push('## Automation Backlog');
  dashboard.automations.forEach((automation) => lines.push(`- **${automation.name}:** ${automation.trigger} → ${automation.action}`));
  lines.push('');
  lines.push('## Pricing Ladder');
  dashboard.pricing.forEach((tier) => lines.push(`- **${tier.tier}:** ${tier.audience}; ${tier.promise}; suggested price ${tier.price}`));
  lines.push('');
  lines.push('## Security & Compliance Model');
  dashboard.securityModel.forEach((control) => lines.push(`- **${control.control}:** ${control.policy}; evidence ${control.evidence}.`));
  lines.push('');
  lines.push('## Investor / Sponsor Brief');
  dashboard.investorBrief.forEach((item) => lines.push(`- **${item.topic}:** ${item.message}`));
  lines.push('');
  lines.push('## Governance Checks');
  dashboard.governance.forEach((check) => lines.push(`- ${check.status === 'pass' ? '[x]' : '[ ]'} **${check.name}:** ${check.detail}`));
  return lines.join('\n');
}

function buildSegments(config, state) {
  const client = state.project?.clientName || 'pilot partner';
  return [
    {
      name: 'Pilot partner',
      need: `Get ${config.metric} without managing student delivery details.`,
      package: `${config.title} guided pilot`,
      successMetric: config.metric
    },
    {
      name: 'Chapter operator',
      need: `Standardize ${config.modules[0]} and recurring delivery rituals.`,
      package: 'Chapter operations workspace',
      successMetric: 'weekly active workspace reviews'
    },
    {
      name: 'Sponsor / funder',
      need: `See proof that ${client} outcomes are credible and repeatable.`,
      package: 'Impact proof export',
      successMetric: 'approved sponsor-ready packets'
    }
  ];
}

function buildExperimentBacklog(config, state, score, risk) {
  const owner = state.project?.studentLead || 'student lead';
  return [
    {
      title: 'Concierge onboarding pilot',
      hypothesis: `If ${config.title} starts with a done-with-you setup, first value lands in one session.`,
      metric: 'time to first approved export',
      owner
    },
    {
      title: 'Proof-to-upgrade motion',
      hypothesis: 'If exported proof is sponsor-ready, chapters can justify a recurring support plan.',
      metric: 'owner approval rate',
      owner: 'mentor reviewer'
    },
    {
      title: risk === 'High' ? 'Blocker reduction sprint' : 'Expansion referral loop',
      hypothesis: score < 75 ? 'Reducing blocker count increases launch readiness faster than adding new features.' : 'Ready workspaces can generate referrals into nearby chapters.',
      metric: score < 75 ? 'blocked gates closed per week' : 'qualified referrals per export',
      owner
    },
    {
      title: 'Template marketplace seed',
      hypothesis: `Reusable ${config.modules[0]} templates reduce time-to-value for new chapters.`,
      metric: 'template reuse rate',
      owner: 'product lead'
    },
    {
      title: 'Sponsor evidence digest',
      hypothesis: 'Monthly evidence summaries increase sponsor renewal confidence.',
      metric: 'renewal conversations opened',
      owner: 'partnership lead'
    }
  ];
}

function buildCustomerBoard(config, state, warnings) {
  return [
    { stage: 'Lead', playbook: `Use ${config.niche} outreach with the sample scenario as proof.`, health: 'Needs qualification' },
    { stage: 'Onboarding', playbook: `Capture client, chapter, lead, and ${config.modules[0]} inputs before delivery.`, health: state.project?.clientName ? 'Active' : 'Missing client' },
    { stage: 'Activation', playbook: 'Require evidence for every ready or approved gate.', health: warnings.length ? 'Needs attention' : 'Healthy' },
    { stage: 'Adoption', playbook: 'Schedule weekly workspace reviews and compare score trends.', health: state.actions?.some((action) => action.status === 'approved') ? 'Habit forming' : 'Needs cadence' },
    { stage: 'Renewal', playbook: `Export Markdown + JSON bundle as the recurring success review.`, health: state.approvals?.ownerApproval ? 'Expansion-ready' : 'Awaiting approval' }
  ];
}

function buildMilestones(config, state, score) {
  return [
    { window: '30 days', outcome: `Ship a reliable ${config.modules[0]} pilot`, evidence: 'one approved export and owner review notes' },
    { window: '60 days', outcome: `Turn ${config.title} into a repeatable service package`, evidence: 'documented pricing, intake, QA, and delivery checklist' },
    { window: '90 days', outcome: score >= 90 ? 'Scale into a chapter-wide operating product' : 'Reach launch-ready score and close blocker backlog', evidence: 'trend report, renewal plan, and sponsor summary' },
    { window: '180 days', outcome: 'Operate as a multi-account SaaS with partner reporting', evidence: 'cohort metrics, retention proof, and integration backlog' }
  ];
}

function buildAutomationBacklog(config, state) {
  return [
    { name: 'Risk digest', trigger: 'readiness warnings change', action: 'send mentor-ready blocker summary' },
    { name: 'Evidence request', trigger: 'ready gate has no evidence', action: 'prompt owner for proof link or reviewer note' },
    { name: 'Renewal packet', trigger: 'owner approval complete', action: `generate ${config.metric} impact report` },
    { name: 'Expansion alert', trigger: 'readiness score stays above 85 for two reviews', action: 'suggest a sponsor update and referral ask' },
    { name: 'Churn save', trigger: 'workspace has blockers for seven days', action: 'create a customer-success intervention checklist' }
  ];
}

function buildPricingLadder(config, state, score) {
  const client = state.project?.clientName || 'chapter partner';
  return [
    { tier: 'Free', audience: 'student chapter trial', promise: `local-first ${config.title} workspace`, price: '$0' },
    { tier: 'Starter', audience: 'single pilot team', promise: 'guided sample data, exports, and readiness coaching', price: '$19–$39/month' },
    { tier: 'Team', audience: client, promise: 'shared reviews, templates, and exports', price: '$49–$99/month' },
    { tier: 'Partner', audience: 'regional sponsor or multi-chapter operator', promise: 'portfolio reporting, QA governance, and impact proof', price: score >= 90 ? '$299+/month' : 'pilot-priced after readiness' }
  ];
}

function buildGovernanceChecks(config, state, warnings) {
  return [
    { name: 'Client data boundary', status: 'pass', detail: 'Workspace remains local-first unless the user exports data.' },
    { name: 'Evidence completeness', status: warnings.some((warning) => /evidence/i.test(warning)) ? 'fail' : 'pass', detail: 'Ready and approved gates need evidence notes.' },
    { name: 'Human approval', status: state.approvals?.mentorReview && state.approvals?.ownerApproval ? 'pass' : 'fail', detail: 'Mentor and owner approval required before SaaS-style handoff.' },
    { name: 'Mission alignment', status: 'pass', detail: `Positioning remains tied to ${config.niche} and digital equity.` },
    { name: 'Commercial boundary', status: 'pass', detail: 'Pricing is packaged around support and reporting, not selling client data.' },
    { name: 'Accessibility posture', status: 'pass', detail: 'The static UI keeps keyboard-friendly controls and readable exports.' }
  ];
}

function buildPersonaMatrix(config, state) {
  const lead = state.project?.studentLead || 'student lead';
  return [
    { role: 'Workspace owner', job: `Own ${config.metric} and approve final handoff`, permission: 'approve exports', valueMoment: 'sees one clean certified packet' },
    { role: 'Student operator', job: `Capture ${config.modules[0]} evidence and close gates`, permission: 'edit workspace', valueMoment: 'turns messy work into a scored plan' },
    { role: 'Mentor reviewer', job: 'Coach quality, risk, and client-safe delivery', permission: 'review and certify', valueMoment: 'spots blockers before client review' },
    { role: 'Sponsor viewer', job: 'Understand portfolio-level impact without sensitive details', permission: 'view exported reports', valueMoment: 'gets proof of repeatable outcomes' },
    { role: lead, job: 'Coordinate cadence and accountability', permission: 'manage next actions', valueMoment: 'keeps the delivery loop moving' }
  ];
}

function buildLifecycleJourneys(config, state, risk) {
  return [
    { phase: 'Discover', promise: `Clarify whether ${config.title} fits the client scenario`, activation: 'load sample or enter project setup', churnRisk: 'unclear target user' },
    { phase: 'Activate', promise: 'Convert rubric items into a visible readiness score', activation: 'mark first gate ready with evidence', churnRisk: risk === 'High' ? 'too many blockers' : 'missing habit loop' },
    { phase: 'Adopt', promise: 'Run weekly review rituals from one workspace', activation: 'complete one next action', churnRisk: 'stale evidence' },
    { phase: 'Expand', promise: 'Package proof for sponsors and adjacent chapters', activation: 'export SaaS blueprint and handoff report', churnRisk: 'no renewal owner' }
  ];
}

function buildFeaturePackaging(config, state) {
  return [
    { feature: 'Local-first workspace', tier: 'Free', value: 'private browser persistence and sample data' },
    { feature: 'Certification rubric', tier: 'Starter', value: `structured ${config.metric} scoring and warnings` },
    { feature: 'Evidence locker', tier: 'Starter', value: 'proof-backed decisions and audit trail' },
    { feature: 'SaaS blueprint export', tier: 'Team', value: 'pricing, experiments, personas, and roadmap in Markdown' },
    { feature: 'Portfolio reporting', tier: 'Partner', value: 'multi-client trend review for sponsors and operators' },
    { feature: 'Automation triggers', tier: 'Partner', value: 'risk, renewal, and expansion playbooks ready for backend implementation' }
  ];
}

function buildRevenueModel(config, state, score) {
  return [
    { lever: 'Activation', assumption: 'Concierge setup creates first-value in under one session', kpi: 'time to first export', guardrail: 'do not require login for core value' },
    { lever: 'Retention', assumption: `Teams return when ${config.metric} trends are reviewed weekly`, kpi: 'weekly active workspaces', guardrail: 'alerts must be useful, not noisy' },
    { lever: 'Expansion', assumption: 'Sponsor-ready proof creates multi-chapter pull', kpi: 'exports shared with sponsors', guardrail: 'client-safe data only' },
    { lever: 'Pricing', assumption: score >= 80 ? 'High-readiness accounts can support paid reporting' : 'Lower-readiness accounts need setup services first', kpi: 'pilot-to-paid conversion', guardrail: 'pricing follows demonstrated value' }
  ];
}

function buildAnalyticsPlan(config, state) {
  return [
    { event: 'workspace_created', question: 'Which segments start using the tool?', action: 'prioritize onboarding copy by segment' },
    { event: 'sample_loaded', question: 'Do users need examples before entering real data?', action: 'improve templates and empty states' },
    { event: 'gate_status_changed', question: 'Where do teams get stuck?', action: 'build targeted guidance and automations' },
    { event: 'evidence_added', question: 'Are claims becoming proof-backed?', action: 'surface weak evidence categories' },
    { event: 'saas_blueprint_exported', question: 'Which accounts reach strategic value?', action: 'trigger renewal and sponsor follow-up' }
  ];
}

function buildSecurityModel(config, state, warnings) {
  return [
    { control: 'Data residency', policy: 'Default storage stays in browser localStorage', evidence: 'no network connect-src in the static shell' },
    { control: 'Export consent', policy: 'Human approvals gate client-safe handoff', evidence: state.approvals?.ownerApproval ? 'owner approval complete' : 'owner approval pending' },
    { control: 'Secret handling', policy: 'Exports describe work without requesting credentials', evidence: 'governance checks and local-first posture' },
    { control: 'Auditability', policy: 'Readiness warnings and deterministic reports expose risk', evidence: `${warnings.length} current warning(s)` },
    { control: 'Access model', policy: 'Future SaaS backend should separate owner, operator, reviewer, and sponsor roles', evidence: 'persona matrix included in blueprint' }
  ];
}

function buildSuccessPlaybooks(config, state, risk) {
  return [
    { name: 'First-value sprint', trigger: 'new workspace or empty setup', response: `load sample, replace with real ${config.modules[0]} data, export first report`, success: 'first export in one session' },
    { name: 'Blocked-account rescue', trigger: 'high risk or blocked gates', response: 'mentor review of top three blockers with owner-safe next action', success: 'risk drops by next review' },
    { name: 'Renewal review', trigger: 'owner approval complete', response: 'share impact proof, pricing tier, and next milestone', success: 'renewal owner identified' },
    { name: 'Expansion motion', trigger: 'multiple clean exports', response: 'ask for adjacent chapter or sponsor referral', success: 'qualified expansion lead created' }
  ];
}

function buildIntegrationCatalog(config, state) {
  return [
    { name: 'CSV import/export', direction: 'two-way operations bridge', value: 'move rubric and evidence summaries into spreadsheets', privacy: 'user-controlled local files' },
    { name: 'Markdown report', direction: 'outbound documentation', value: 'drop certified proof into client handoff docs', privacy: 'client-safe content only' },
    { name: 'Webhook-ready events', direction: 'future backend extension', value: 'trigger reminders from blocker, approval, and export events', privacy: 'send metadata, not raw sensitive evidence' },
    { name: 'Sponsor dashboard API', direction: 'future partner extension', value: 'aggregate readiness across chapters', privacy: 'aggregate scores and approved summaries only' }
  ];
}

function buildExpansionRoadmap(config, state, score) {
  return [
    { horizon: 'Now', release: 'Static SaaS command center', unlock: 'positioning, packaging, blueprint exports', proof: 'local tests and CI' },
    { horizon: 'Next', release: 'Team workspace sync', unlock: 'shared accounts, reviewer assignment, evidence comments', proof: 'role-based pilot with one chapter' },
    { horizon: 'Later', release: 'Portfolio sponsor console', unlock: 'multi-chapter reporting and renewal analytics', proof: score >= 80 ? 'high-readiness workspace cohort' : 'readiness score improvement trend' },
    { horizon: 'Scale', release: 'Template and automation marketplace', unlock: 'repeatable playbooks across Volta tools', proof: 'template reuse and expansion conversion' }
  ];
}

function buildInvestorBrief(config, state, score, risk) {
  return [
    { topic: 'Problem', message: `${config.niche} teams need ${config.metric} without expensive SaaS administration.` },
    { topic: 'Solution', message: `${config.title} packages rubric scoring, evidence capture, client-safe exports, and SaaS planning into one local-first workspace.` },
    { topic: 'Moat', message: 'Deterministic certification plus student-pod operating rituals create repeatable proof, not generic task tracking.' },
    { topic: 'Traction proxy', message: `${score}/100 readiness with ${risk} risk from current workspace data.` },
    { topic: 'Business model', message: 'Free local workspace, paid team collaboration, partner reporting, and services-led onboarding.' }
  ];
}
