import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home | Credex AI Spend Audit</title>
        <meta name="description" content="Credex AI Spend Audit - Optimize your AI API costs with intelligent insights." />
      </Helmet>
      
      <div className="page-container">
        <section className="fade-in text-center mb-3 mt-3">
          <Card className="hero-card">
            <h1 style={{ fontSize: 'var(--font-xxl)', marginBottom: 'var(--spacing-md)' }}>
              Optimize Your AI API Spend
            </h1>
            <p style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--spacing-lg)' }}>
              Discover hidden savings, track usage, and manage your AI API costs with our intelligent audit platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
              <Link to="/audit">
                <Button variant="primary" style={{ fontSize: 'var(--font-lg)', padding: '1rem 2rem' }}>
                  Start Free Audit
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        <section className="fade-in mb-3">
          <div className="grid-3">
            <Card title="AI-Driven Audit">
              <p>Our intelligent engine analyzes your API usage patterns and identifies areas for cost optimization.</p>
            </Card>
            <Card title="Actionable Insights">
              <p>Get precise recommendations on alternative models, caching strategies, and rate limit management.</p>
            </Card>
            <Card title="Secure & Private">
              <p>Your data is processed securely. We only analyze spend metadata, ensuring your prompt contents remain private.</p>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
