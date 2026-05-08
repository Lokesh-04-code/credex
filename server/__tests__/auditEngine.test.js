/**
 * Audit Engine Tests
 *
 * Tests the core business logic deterministically.
 * No external services are called in these tests.
 *
 * Run: npm test (from /server directory)
 */

const { runAudit, PRICING } = require('../src/services/auditEngine');

describe('Audit Engine — Core Logic', () => {

  // ── Test 1: Empty tools returns zero savings ──────────────────────────────
  test('returns zero savings for empty tools array', () => {
    const result = runAudit({ tools: [], teamSize: 5, primaryUseCase: 'coding' });
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
    expect(result.recommendations).toHaveLength(0);
  });

  // ── Test 2: Cursor Business → Pro downgrade for small team ────────────────
  test('recommends Cursor Pro downgrade for small team on Business plan', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      primaryUseCase: 'coding',
    });

    const downgrade = result.recommendations.find((r) => r.type === 'downgrade' && r.tool === 'cursor');
    expect(downgrade).toBeDefined();
    expect(downgrade.estimatedMonthlySavings).toBeGreaterThan(0);

    // Cursor Business is $40/seat, Pro is $20/seat. For 2 seats: $80 vs $40
    expect(downgrade.estimatedMonthlySavings).toBe(40); // $80 - $40
    expect(downgrade.estimatedAnnualSavings).toBe(480); // $40 × 12
  });

  // ── Test 3: No false savings for efficient spend ──────────────────────────
  test('does NOT manufacture savings when spend matches official pricing', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
        { toolId: 'github_copilot', plan: 'individual', monthlySpend: 10, seats: 1 },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    });

    // No overspend recommendations expected
    const overspend = result.recommendations.filter((r) => r.type === 'overspend');
    expect(overspend).toHaveLength(0);
  });

  // ── Test 4: Overspending detection ───────────────────────────────────────
  test('detects overspending vs official pricing', () => {
    // Copilot Business is $19/seat. 3 seats = $57. User paying $90 = overspend.
    const result = runAudit({
      tools: [{ toolId: 'github_copilot', plan: 'business', monthlySpend: 90, seats: 3 }],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    const overspend = result.recommendations.find((r) => r.type === 'overspend');
    expect(overspend).toBeDefined();
    expect(overspend.estimatedMonthlySavings).toBe(33); // $90 - $57
  });

  // ── Test 5: GitHub Copilot Enterprise → Business for small team ──────────
  test('recommends Copilot Business downgrade for team under 10', () => {
    const seats = 5;
    const enterpriseMonthly = PRICING.github_copilot.enterprise.price * seats; // $39 × 5 = $195
    const result = runAudit({
      tools: [{ toolId: 'github_copilot', plan: 'enterprise', monthlySpend: enterpriseMonthly, seats }],
      teamSize: seats,
      primaryUseCase: 'coding',
    });

    const downgrade = result.recommendations.find(
      (r) => r.type === 'downgrade' && r.tool === 'github_copilot'
    );
    expect(downgrade).toBeDefined();

    const expectedSavings = (PRICING.github_copilot.enterprise.price - PRICING.github_copilot.business.price) * seats;
    expect(downgrade.estimatedMonthlySavings).toBe(expectedSavings); // ($39 - $19) × 5 = $100
  });

  // ── Test 6: Annual savings = monthly × 12 ────────────────────────────────
  test('annual savings is exactly 12x monthly savings', () => {
    const result = runAudit({
      tools: [{ toolId: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }],
      teamSize: 3,
      primaryUseCase: 'coding',
    });

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  // ── Test 7: Claude Max → Pro downgrade for low-usage team ─────────────────
  test('recommends Claude Pro downgrade from Max for 1-2 users', () => {
    const result = runAudit({
      tools: [{ toolId: 'claude', plan: 'max', monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      primaryUseCase: 'research',
    });

    const downgrade = result.recommendations.find((r) => r.type === 'downgrade' && r.tool === 'claude');
    expect(downgrade).toBeDefined();
    expect(downgrade.estimatedMonthlySavings).toBe(80); // $100 - $20
  });

  // ── Test 8: Multiple coding tools triggers consolidation advice ───────────
  test('identifies consolidation opportunity when multiple coding tools are active', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
        { toolId: 'github_copilot', plan: 'individual', monthlySpend: 10, seats: 1 },
        { toolId: 'windsurf', plan: 'pro', monthlySpend: 15, seats: 1 },
      ],
      teamSize: 1,
      primaryUseCase: 'coding',
    });

    const consolidation = result.recommendations.find((r) => r.type === 'consolidation');
    expect(consolidation).toBeDefined();
    expect(consolidation.estimatedMonthlySavings).toBeGreaterThan(0);
  });

  // ── Test 9: Pricing constants are positive numbers ────────────────────────
  test('all non-free pricing tiers have a positive price', () => {
    const paidPlans = [
      PRICING.cursor.pro.price,
      PRICING.cursor.business.price,
      PRICING.github_copilot.individual.price,
      PRICING.github_copilot.business.price,
      PRICING.github_copilot.enterprise.price,
      PRICING.claude.pro.price,
      PRICING.claude.max.price,
      PRICING.chatgpt.plus.price,
    ];

    for (const price of paidPlans) {
      expect(price).toBeGreaterThan(0);
    }
  });

  // ── Test 10: Recommendations are sorted by savings descending ─────────────
  test('recommendations are sorted by monthly savings descending', () => {
    const result = runAudit({
      tools: [
        { toolId: 'cursor', plan: 'business', monthlySpend: 200, seats: 5 },
        { toolId: 'github_copilot', plan: 'enterprise', monthlySpend: 195, seats: 5 },
      ],
      teamSize: 5,
      primaryUseCase: 'coding',
    });

    const savings = result.recommendations.map((r) => r.estimatedMonthlySavings);
    for (let i = 1; i < savings.length; i++) {
      expect(savings[i - 1]).toBeGreaterThanOrEqual(savings[i]);
    }
  });
});
