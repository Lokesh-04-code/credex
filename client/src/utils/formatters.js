/**
 * Utility formatters
 */

/**
 * Format a number as USD currency
 * @param {number} value
 * @param {Object} options
 * @returns {string}
 */
export function formatCurrency(value, { compact = false } = {}) {
  if (value === 0) return '$0';
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a date string to human-readable
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}

/**
 * Truncate text to a max length with ellipsis
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncate(text, max = 100) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

/**
 * Get savings severity label and color
 * @param {number} monthlySavings
 * @returns {{ label: string, color: string }}
 */
export function getSavingsSeverity(monthlySavings) {
  if (monthlySavings >= 500) return { label: 'Major Savings', color: 'text-emerald-400' };
  if (monthlySavings >= 100) return { label: 'Significant Savings', color: 'text-emerald-400' };
  if (monthlySavings >= 20) return { label: 'Moderate Savings', color: 'text-amber-400' };
  if (monthlySavings > 0) return { label: 'Minor Savings', color: 'text-amber-400' };
  return { label: 'Well Optimized', color: 'text-brand-400' };
}

/**
 * Get tool display name from toolId
 * @param {string} toolId
 * @returns {string}
 */
export function getToolName(toolId) {
  const names = {
    cursor: 'Cursor',
    github_copilot: 'GitHub Copilot',
    claude: 'Claude',
    chatgpt: 'ChatGPT',
    anthropic_api: 'Anthropic API',
    openai_api: 'OpenAI API',
    gemini: 'Gemini',
    windsurf: 'Windsurf / v0',
  };
  return names[toolId] || toolId;
}

/**
 * Build a shareable URL for an audit
 * @param {string} shareId
 * @returns {string}
 */
export function buildShareUrl(shareId) {
  return `${window.location.origin}/audit/${shareId}`;
}
