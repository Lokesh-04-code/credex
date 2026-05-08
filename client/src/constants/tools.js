/**
 * AI Tool Definitions
 * Mirrors the server-side pricing data for UI display.
 * Sources: PRICING_DATA.md
 */

export const TOOLS = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    logo: '⬡',
    category: 'coding',
    plans: [
      { id: 'hobby', label: 'Hobby (Free)', price: 0 },
      { id: 'pro', label: 'Pro', price: 20 },
      { id: 'business', label: 'Business', price: 40 },
      { id: 'enterprise', label: 'Enterprise', price: 40 },
    ],
  },
  github_copilot: {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    logo: '◎',
    category: 'coding',
    plans: [
      { id: 'individual', label: 'Individual', price: 10 },
      { id: 'business', label: 'Business', price: 19 },
      { id: 'enterprise', label: 'Enterprise', price: 39 },
    ],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    logo: '◈',
    category: 'writing',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro', price: 20 },
      { id: 'max', label: 'Max', price: 100 },
      { id: 'team', label: 'Team', price: 30 },
      { id: 'enterprise', label: 'Enterprise', price: 60 },
      { id: 'api', label: 'API Direct', price: 0 },
    ],
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '◍',
    category: 'writing',
    plans: [
      { id: 'plus', label: 'Plus', price: 20 },
      { id: 'team', label: 'Team', price: 30 },
      { id: 'enterprise', label: 'Enterprise', price: 60 },
      { id: 'api', label: 'API Direct', price: 0 },
    ],
  },
  anthropic_api: {
    id: 'anthropic_api',
    name: 'Anthropic API',
    logo: '◈',
    category: 'api',
    plans: [
      { id: 'api', label: 'API Direct (usage-based)', price: 0 },
    ],
  },
  openai_api: {
    id: 'openai_api',
    name: 'OpenAI API',
    logo: '◎',
    category: 'api',
    plans: [
      { id: 'api', label: 'API Direct (usage-based)', price: 0 },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    logo: '◇',
    category: 'writing',
    plans: [
      { id: 'pro', label: 'Gemini Advanced', price: 19.99 },
      { id: 'ultra', label: 'Gemini Ultra', price: 19.99 },
      { id: 'api', label: 'API Direct', price: 0 },
    ],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf / v0',
    logo: '◈',
    category: 'coding',
    plans: [
      { id: 'free', label: 'Free', price: 0 },
      { id: 'pro', label: 'Pro', price: 15 },
      { id: 'team', label: 'Team', price: 35 },
    ],
  },
};

export const TOOL_LIST = Object.values(TOOLS);

export const USE_CASES = [
  { id: 'coding', label: 'Coding & Development' },
  { id: 'writing', label: 'Writing & Content' },
  { id: 'research', label: 'Research & Analysis' },
  { id: 'data', label: 'Data & Analytics' },
  { id: 'mixed', label: 'Mixed / General' },
];

export const SEVERITY_CONFIG = {
  high: { label: 'High Impact', color: 'badge-red', dot: 'bg-red-400' },
  medium: { label: 'Medium Impact', color: 'badge-yellow', dot: 'bg-amber-400' },
  low: { label: 'Low Impact', color: 'badge-purple', dot: 'bg-brand-400' },
};

export const RECOMMENDATION_TYPE_LABELS = {
  overspend: 'Billing Reconciliation',
  downgrade: 'Plan Downgrade',
  consolidation: 'Tool Consolidation',
  efficiency: 'Usage Efficiency',
  alternative: 'Cheaper Alternative',
};

export const HIGH_SAVINGS_THRESHOLD = 500; // per month — triggers Credex CTA
