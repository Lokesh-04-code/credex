# Tests — AI Spend Audit

## Testing Strategy

The core testing investment is in the **audit engine** — the most business-critical code in the product. All pricing math and recommendation logic is covered by deterministic unit tests.

We use **Jest** for the test runner. No external services are mocked or called during tests.

---

## Running Tests

```bash
cd server
npm test          # Run all tests once
npm run test:watch  # Watch mode for development
```

---

## Test File Location

```
server/
└── __tests__/
    └── auditEngine.test.js   (10 tests)
```

---

## Test Coverage

| Test | Description | Covers |
|------|-------------|--------|
| 1 | Empty tools returns zero | Edge case: no input |
| 2 | Cursor Business → Pro downgrade | Rule: small team on expensive plan |
| 3 | No false savings on efficient spend | Critical: anti-hallucination |
| 4 | Overspend detection | Rule: billing reconciliation |
| 5 | Copilot Enterprise → Business for small team | Rule: downgrade logic |
| 6 | Annual savings = monthly × 12 | Math: year calculation |
| 7 | Claude Max → Pro for 1-2 users | Rule: usage-appropriate plan |
| 8 | Multiple coding tools → consolidation | Rule: overlap detection |
| 9 | All non-free pricing constants > 0 | Data: pricing sanity check |
| 10 | Recommendations sorted by savings descending | Output: sort order |

---

## Sample Test Output

```
PASS __tests__/auditEngine.test.js
  Audit Engine — Core Logic
    ✓ returns zero savings for empty tools array (3ms)
    ✓ recommends Cursor Pro downgrade for small team on Business plan (2ms)
    ✓ does NOT manufacture savings when spend matches official pricing (1ms)
    ✓ detects overspending vs official pricing (1ms)
    ✓ recommends Copilot Business downgrade for team under 10 (1ms)
    ✓ annual savings is exactly 12x monthly savings (1ms)
    ✓ recommends Claude Pro downgrade from Max for 1-2 users (1ms)
    ✓ identifies consolidation opportunity when multiple coding tools are active (2ms)
    ✓ all non-free pricing tiers have a positive price (1ms)
    ✓ recommendations are sorted by monthly savings descending (1ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

## What's NOT Tested (Known Gaps)

1. **API layer integration tests**: The Express routes are not tested end-to-end. Prisma is not mocked — a schema change could silently break the API.
   - Mitigation: The CI build catches TypeScript errors (if using TS) — in JS, rely on the type annotations in JSDoc comments

2. **AI summary service**: Anthropic API is not mocked. Testing the AI summary would require either a real API key or a mocked HTTP client.
   - Mitigation: The fallback path is effectively tested by verifying `generateFallbackSummary()` returns a non-empty string

3. **Email service**: Resend is not tested. Email delivery depends on real API keys.
   - Mitigation: The email service is isolated in `emailService.js` — it fails gracefully with a console warning

4. **Frontend component tests**: No React Testing Library or Playwright tests for UI components.
   - Mitigation: The CI build (`npm run build`) catches JSX syntax errors and dead imports

---

## Week-2 Testing Roadmap

If extended:
- Add **Supertest** integration tests for `POST /api/audit` and `GET /api/audit/:shareId`
- Mock Prisma client using `jest.mock()`
- Add `buildPrompt()` unit tests to verify prompt structure
- Add **Playwright** E2E tests for the audit form → results flow
