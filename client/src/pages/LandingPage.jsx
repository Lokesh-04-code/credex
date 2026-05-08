import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingDown, Share2, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const stats = [
  { value: '$2,400+', label: 'Avg. annual savings found' },
  { value: '8 tools', label: 'AI tools supported' },
  { value: '< 3 min', label: 'Time to audit' },
];

const features = [
  {
    icon: TrendingDown,
    title: 'Spot Overspend Instantly',
    description: 'We compare your reported spend against official vendor pricing to flag billing errors and unused seat charges.',
  },
  {
    icon: Zap,
    title: 'Smart Downgrade Analysis',
    description: 'Our audit engine identifies when you\'re on a plan tier that\'s overkill for your team size and use case.',
  },
  {
    icon: Shield,
    title: 'Consolidation Opportunities',
    description: 'Find where overlapping tools (Cursor + Copilot + Windsurf) are draining budget on redundant capabilities.',
  },
  {
    icon: Share2,
    title: 'Share with Your Team',
    description: 'Every audit gets a unique public URL you can share with your manager or board — no account needed.',
  },
];

const faqs = [
  {
    q: 'Is my data private?',
    a: 'Yes. Your email is only collected after you choose to receive results. The public share URL strips all personal data — it only shows tools and savings.',
  },
  {
    q: 'How accurate are the savings estimates?',
    a: 'Savings are calculated using official vendor pricing pages (sources in PRICING_DATA.md). We use deterministic business logic, not AI, for all financial math.',
  },
  {
    q: 'Do I need to connect any accounts?',
    a: 'No integrations required. You manually enter your tools, plans, and spend. This makes the tool work for any team structure.',
  },
  {
    q: 'What AI tools are supported?',
    a: 'Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf/v0. More tools added regularly.',
  },
  {
    q: 'Is this free?',
    a: 'The audit tool is completely free. For teams with >$500/month in savings, we surface an optional consultation with the Credex team.',
  },
];

const socialProof = [
  { role: 'Engineering Manager', company: 'Series A SaaS', quote: 'Found $840/month we were wasting on overlapping Copilot Enterprise seats. Took 2 minutes.' },
  { role: 'Founder', company: 'AI Startup', quote: 'We had 3 coding AI tools running simultaneously. This audit made the redundancy embarrassingly obvious.' },
  { role: 'CTO', company: 'Dev Agency', quote: 'Saved $400/month by downgrading Claude Enterprise to Team for our 4-person team.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>AI Spend Audit — Find Hidden Savings in Your AI Tool Stack</title>
        <meta name="description" content="Audit your AI tool spending in under 3 minutes. Find overspend, downgrade opportunities, and consolidation savings across Cursor, Copilot, Claude, ChatGPT, and more." />
        <meta property="og:title" content="AI Spend Audit — Stop Overpaying for AI Tools" />
        <meta property="og:description" content="Free audit tool for startup founders and engineering managers. Find hidden savings in your AI tool stack." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen hero-bg noise-overlay relative">
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">AI Spend Audit</span>
          </div>
          <Link
            to="/audit"
            id="nav-cta-btn"
            className="btn-primary text-sm py-2 px-4"
          >
            Start Free Audit
          </Link>
        </nav>

        {/* Hero */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="badge-purple text-sm px-3 py-1.5">
                Free for startup teams
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Stop Overpaying for{' '}
              <span className="gradient-text">AI Tools</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              3-minute audit for startup founders and engineering managers.
              Find hidden savings in Cursor, Copilot, Claude, ChatGPT, and more.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/audit"
                id="hero-cta-primary"
                className="btn-primary text-lg py-4 px-8 shadow-glow"
              >
                Audit My AI Spend <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                id="hero-cta-secondary"
                className="btn-ghost text-lg py-4 px-8"
              >
                See How It Works <ChevronDown className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              No integrations. No accounts. Just honest financial analysis of your AI spending.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Enter Your Tools', desc: 'Select which AI tools your team uses, your plan tier, monthly spend, and number of seats.' },
              { step: '02', title: 'Get Your Audit', desc: 'Our engine runs deterministic rules against official pricing data to find real savings opportunities.' },
              { step: '03', title: 'Share & Act', desc: 'Get a shareable URL with your full report. No account required to start saving.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 relative"
              >
                <div className="text-6xl font-black text-brand-500/20 absolute top-4 right-6 font-mono">
                  {item.step}
                </div>
                <div className="text-brand-400 font-bold text-sm mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Proof — clearly marked as illustrative */}
        <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">What Teams Are Finding</h2>
            <p className="text-slate-500 text-sm">
              ⚠️ Illustrative examples based on common audit patterns — not verified testimonials
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {socialProof.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <p className="text-slate-300 leading-relaxed mb-4">"{item.quote}"</p>
                <div>
                  <div className="text-sm font-semibold text-white">{item.role}</div>
                  <div className="text-xs text-slate-500">{item.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="glass-card p-12 shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your savings?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Takes 3 minutes. No account needed. Completely free.
            </p>
            <Link
              to="/audit"
              id="footer-cta-btn"
              className="btn-primary text-lg py-4 px-10 shadow-glow"
            >
              Start My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
          <p className="text-slate-600 text-sm">
            © 2025 AI Spend Audit · Built by{' '}
            <a href="https://credex.ai" className="text-brand-500 hover:text-brand-400">Credex</a>
            {' '}· Pricing data verified from official vendor pages
          </p>
        </footer>
      </div>
    </>
  );
}
