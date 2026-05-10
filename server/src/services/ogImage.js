/**
 * OG Image Service
 *
 * Generates a 1200×630 PNG Open Graph image for a given audit result.
 * Uses sharp to convert an SVG template with live data into a PNG buffer.
 *
 * Design:
 *   - Dark background (hsl 210 10% 12%)
 *   - Teal accent (hsl 170 70% 45%)
 *   - Savings number prominently centred
 *   - Sub-stats: tools audited, recommendation count, annual savings
 *   - Credex brand mark bottom-left
 */

const sharp = require('sharp');

const WIDTH = 1200;
const HEIGHT = 630;

// ── Colour constants (must be hex/rgb for SVG) ────────────────────────────────
const BG          = '#1b1f26';        // hsl(210 10% 12%)
const SURFACE     = '#2a2f38';        // hsl(210 10% 19%)
const ACCENT      = '#2dcfaf';        // hsl(170 70% 45%)
const ACCENT_DARK = '#1a7f6b';
const WHITE       = '#f2f2f2';
const MUTED       = '#b3b8c4';
const SUCCESS     = '#3ecf6e';        // hsl(140 60% 45%)
const WARNING     = '#f0b429';        // hsl(40 80% 55%)

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatUSD(value) {
  if (value === 0) return '$0';
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function severityColor(monthly) {
  if (monthly >= 100) return SUCCESS;
  if (monthly >= 20)  return WARNING;
  return ACCENT;
}

// ── SVG Template ─────────────────────────────────────────────────────────────

function buildSvg({ totalMonthlySavings, totalAnnualSavings, toolCount, recCount }) {
  const savingsText  = formatUSD(totalMonthlySavings);
  const annualText   = formatUSD(totalAnnualSavings);
  const savingsColor = severityColor(totalMonthlySavings);

  // Responsive font-size for large numbers
  const mainFontSize = savingsText.length > 6 ? 110 : 130;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"
     xmlns="http://www.w3.org/2000/svg">

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>

  <!-- Subtle grid lines -->
  ${Array.from({ length: 8 }, (_, i) => `
  <line x1="0" y1="${i * 90}" x2="${WIDTH}" y2="${i * 90}"
        stroke="${SURFACE}" stroke-width="1" opacity="0.6"/>`)
  .join('')}
  ${Array.from({ length: 13 }, (_, i) => `
  <line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"
        stroke="${SURFACE}" stroke-width="1" opacity="0.6"/>`)
  .join('')}

  <!-- Teal glow blob top-right -->
  <radialGradient id="glow" cx="80%" cy="20%" r="40%">
    <stop offset="0%"   stop-color="${ACCENT}" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
  </radialGradient>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="8" height="${HEIGHT}"
        fill="${ACCENT}"/>

  <!-- ── Credex brand (top-left) ── -->
  <!-- Logo circle -->
  <circle cx="64" cy="56" r="24" fill="${ACCENT}"/>
  <text x="64" y="63"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="700"
        fill="${BG}" text-anchor="middle">C</text>

  <!-- Brand name -->
  <text x="100" y="48"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="700" fill="${WHITE}">Credex</text>
  <text x="100" y="70"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="13" fill="${MUTED}">AI Spend Audit</text>

  <!-- ── Divider line ── -->
  <line x1="48" y1="100" x2="${WIDTH - 48}" y2="100"
        stroke="${SURFACE}" stroke-width="1.5"/>

  <!-- ── Main savings number ── -->
  <text x="600" y="330"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${mainFontSize}" font-weight="900"
        fill="${savingsColor}" text-anchor="middle"
        letter-spacing="-4">${savingsText}</text>

  <text x="600" y="380"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="28" fill="${MUTED}" text-anchor="middle">
    per month in potential savings
  </text>

  <!-- ── Stats row ── -->
  <!-- Box 1: Annual -->
  <rect x="200" y="430" width="240" height="80" rx="12"
        fill="${SURFACE}"/>
  <text x="320" y="462"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="13" fill="${MUTED}" text-anchor="middle">Annual Savings</text>
  <text x="320" y="492"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="26" font-weight="700" fill="${WHITE}" text-anchor="middle">
    ${annualText}/yr
  </text>

  <!-- Box 2: Tools -->
  <rect x="480" y="430" width="240" height="80" rx="12"
        fill="${SURFACE}"/>
  <text x="600" y="462"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="13" fill="${MUTED}" text-anchor="middle">Tools Audited</text>
  <text x="600" y="492"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="26" font-weight="700" fill="${WHITE}" text-anchor="middle">
    ${toolCount}
  </text>

  <!-- Box 3: Recommendations -->
  <rect x="760" y="430" width="240" height="80" rx="12"
        fill="${SURFACE}"/>
  <text x="880" y="462"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="13" fill="${MUTED}" text-anchor="middle">Recommendations</text>
  <text x="880" y="492"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="26" font-weight="700" fill="${WHITE}" text-anchor="middle">
    ${recCount}
  </text>

  <!-- ── Bottom CTA strip ── -->
  <rect x="0" y="${HEIGHT - 56}" width="${WIDTH}" height="56" fill="${SURFACE}"/>
  <text x="600" y="${HEIGHT - 22}"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16" fill="${MUTED}" text-anchor="middle">
    credex.ai · Free AI spend audit · Takes 3 minutes
  </text>
</svg>`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate an OG image PNG buffer for an audit record.
 * @param {{ totalMonthlySavings: number, totalAnnualSavings: number, tools: any[], recommendations: any[] }} audit
 * @returns {Promise<Buffer>}
 */
async function generateOgImage(audit) {
  const { totalMonthlySavings = 0, totalAnnualSavings = 0, tools = [], recommendations = [] } = audit;

  const svg = buildSvg({
    totalMonthlySavings,
    totalAnnualSavings,
    toolCount: tools.length,
    recCount:  recommendations.length,
  });

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return buffer;
}

module.exports = { generateOgImage };
