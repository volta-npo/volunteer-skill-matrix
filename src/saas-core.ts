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
  return {
    profile,
    kpis: [
      { label: 'SaaS readiness', value: score, suffix: '/100', detail: scoreResult.label },
      { label: 'Revenue readiness', value: revenueReadiness, suffix: '%', detail: 'Pricing, packaging, proof, and handoff signal' },
      { label: 'Handoff confidence', value: handoffConfidence, suffix: '%', detail: `${profile.evidenceCount} evidence item(s), ${profile.approvedCriteria} approved gate(s)` },
      { label: 'Operating cadence', value: operatingCadence, suffix: '%', detail: `${profile.completedActions}/${state.actions?.length || 0} next actions complete` }
    ],
    risk,
    segments: buildSegments(config, state),
    experiments: buildExperimentBacklog(config, state, score, risk),
    board: buildCustomerBoard(config, state, warnings),
    milestones: buildMilestones(config, state, score),
    automations: buildAutomationBacklog(config, state),
    pricing: buildPricingLadder(config, state, score),
    governance: buildGovernanceChecks(config, state, warnings)
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
  lines.push('## Growth Experiments');
  dashboard.experiments.forEach((experiment) => lines.push(`- **${experiment.title}:** ${experiment.hypothesis} Measure ${experiment.metric}; owner ${experiment.owner}.`));
  lines.push('');
  lines.push('## Customer Success Board');
  dashboard.board.forEach((item) => lines.push(`- **${item.stage}:** ${item.playbook} (${item.health})`));
  lines.push('');
  lines.push('## 30/60/90 Milestones');
  dashboard.milestones.forEach((milestone) => lines.push(`- **${milestone.window}:** ${milestone.outcome} — ${milestone.evidence}`));
  lines.push('');
  lines.push('## Automation Backlog');
  dashboard.automations.forEach((automation) => lines.push(`- **${automation.name}:** ${automation.trigger} → ${automation.action}`));
  lines.push('');
  lines.push('## Pricing Ladder');
  dashboard.pricing.forEach((tier) => lines.push(`- **${tier.tier}:** ${tier.audience}; ${tier.promise}; suggested price ${tier.price}`));
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
    }
  ];
}

function buildCustomerBoard(config, state, warnings) {
  return [
    { stage: 'Lead', playbook: `Use ${config.niche} outreach with the sample scenario as proof.`, health: 'Needs qualification' },
    { stage: 'Onboarding', playbook: `Capture client, chapter, lead, and ${config.modules[0]} inputs before delivery.`, health: state.project?.clientName ? 'Active' : 'Missing client' },
    { stage: 'Activation', playbook: 'Require evidence for every ready or approved gate.', health: warnings.length ? 'Needs attention' : 'Healthy' },
    { stage: 'Renewal', playbook: `Export Markdown + JSON bundle as the recurring success review.`, health: state.approvals?.ownerApproval ? 'Expansion-ready' : 'Awaiting approval' }
  ];
}

function buildMilestones(config, state, score) {
  return [
    { window: '30 days', outcome: `Ship a reliable ${config.modules[0]} pilot`, evidence: 'one approved export and owner review notes' },
    { window: '60 days', outcome: `Turn ${config.title} into a repeatable service package`, evidence: 'documented pricing, intake, QA, and delivery checklist' },
    { window: '90 days', outcome: score >= 90 ? 'Scale into a chapter-wide operating product' : 'Reach launch-ready score and close blocker backlog', evidence: 'trend report, renewal plan, and sponsor summary' }
  ];
}

function buildAutomationBacklog(config, state) {
  return [
    { name: 'Risk digest', trigger: 'readiness warnings change', action: 'send mentor-ready blocker summary' },
    { name: 'Evidence request', trigger: 'ready gate has no evidence', action: 'prompt owner for proof link or reviewer note' },
    { name: 'Renewal packet', trigger: 'owner approval complete', action: `generate ${config.metric} impact report` }
  ];
}

function buildPricingLadder(config, state, score) {
  const client = state.project?.clientName || 'chapter partner';
  return [
    { tier: 'Free', audience: 'student chapter trial', promise: `local-first ${config.title} workspace`, price: '$0' },
    { tier: 'Team', audience: client, promise: 'shared reviews, templates, and exports', price: '$49–$99/month' },
    { tier: 'Partner', audience: 'regional sponsor or multi-chapter operator', promise: 'portfolio reporting, QA governance, and impact proof', price: score >= 90 ? '$299+/month' : 'pilot-priced after readiness' }
  ];
}

function buildGovernanceChecks(config, state, warnings) {
  return [
    { name: 'Client data boundary', status: 'pass', detail: 'Workspace remains local-first unless the user exports data.' },
    { name: 'Evidence completeness', status: warnings.some((warning) => /evidence/i.test(warning)) ? 'fail' : 'pass', detail: 'Ready and approved gates need evidence notes.' },
    { name: 'Human approval', status: state.approvals?.mentorReview && state.approvals?.ownerApproval ? 'pass' : 'fail', detail: 'Mentor and owner approval required before SaaS-style handoff.' },
    { name: 'Mission alignment', status: 'pass', detail: `Positioning remains tied to ${config.niche} and digital equity.` }
  ];
}
