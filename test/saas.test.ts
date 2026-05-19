import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { applySampleData, calculateScore, readinessWarnings } from '../src/core.js';
import { createSaasMetrics, buildSaasMarkdown } from '../src/saas-core.js';

test('standalone SaaS dashboard includes actionable productization sections', () => {
  const state = applySampleData(config);
  const score = calculateScore(config, state);
  const warnings = readinessWarnings(config, state);
  const dashboard = createSaasMetrics(config, state, score, warnings);
  assert.equal(dashboard.kpis.length, 4);
  assert.equal(dashboard.segments.length, 3);
  assert.equal(dashboard.experiments.length, 3);
  assert.equal(dashboard.board.length, 4);
  assert.equal(dashboard.milestones.length, 3);
  assert.equal(dashboard.automations.length, 3);
  assert.equal(dashboard.pricing.length, 3);
});

test('SaaS blueprint markdown exports productization roadmap', () => {
  const state = applySampleData(config);
  const markdown = buildSaasMarkdown(config, state, calculateScore(config, state), readinessWarnings(config, state));
  assert.match(markdown, /Standalone SaaS Blueprint/);
  assert.match(markdown, /Customer Segments/);
  assert.match(markdown, /Growth Experiments/);
  assert.match(markdown, /Pricing Ladder/);
  assert.match(markdown, new RegExp(config.title.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&')));
});
