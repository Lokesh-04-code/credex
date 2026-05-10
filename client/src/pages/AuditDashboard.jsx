import { AlertTriangle, CircleDollarSign, Layers3, TrendingDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { Badge, Button, Card } from '../components';
import { showToast } from '../utils/ui';

const stats = [
  { icon: CircleDollarSign, label: 'Projected annual savings', value: '$84.2k' },
  { icon: Layers3, label: 'Tools under review', value: '27' },
  { icon: TrendingDown, label: 'Duplicate coverage', value: '31%' },
  { icon: AlertTriangle, label: 'Renewals in 30 days', value: '6' },
];

const auditItems = [
  { tool: 'GitHub Copilot Business', owner: 'Engineering', risk: 'Medium', savings: '$18.4k', progress: 72 },
  { tool: 'ChatGPT Team', owner: 'Product', risk: 'Low', savings: '$9.8k', progress: 58 },
  { tool: 'Claude Team', owner: 'Research', risk: 'High', savings: '$24.1k', progress: 86 },
  { tool: 'Midjourney Seats', owner: 'Marketing', risk: 'Low', savings: '$4.2k', progress: 44 },
];

export default function AuditDashboard() {
  return (
    <>
      <Helmet>
        <title>Audit Dashboard | Credex AI Spend Audit</title>
        <meta name="description" content="Review AI tool spend, renewal risk, duplicate coverage, and savings opportunities in the Credex audit dashboard." />
      </Helmet>

      <div className="page page--compact">
        <div className="container">
          <div className="section__header fade-in">
            <p className="eyebrow">Live audit</p>
            <h1>Audit dashboard</h1>
            <p>Prioritize the AI tools most likely to produce real savings, then move each recommendation through approval.</p>
            <div className="cluster">
              <Button onClick={() => showToast('Audit refresh queued.', 'success')}>Refresh audit</Button>
              <Button variant="secondary" onClick={() => showToast('CSV export prepared.', 'info')}>Export CSV</Button>
            </div>
          </div>

          <section aria-label="Audit summary" className="grid grid--4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card className="stat-card fade-in" key={stat.label}>
                  <span className="stat-card__icon"><Icon size={20} /></span>
                  <div>
                    <strong>{stat.value}</strong>
                    <p>{stat.label}</p>
                  </div>
                </Card>
              );
            })}
          </section>

          <section className="section dashboard-layout">
            <Card className="card--flat fade-in">
              <Badge tone="warning">Renewal risk</Badge>
              <h2>Approval queue</h2>
              <p>Six contracts renew before June close. Claude Team and Copilot Business have the strongest savings signal.</p>
              <div className="progress progress--64" aria-label="Approval progress">
                <span />
              </div>
            </Card>

            <Card className="card--flat fade-in">
              <h2>Recommendations</h2>
              <div className="audit-list">
                {auditItems.map((item) => (
                  <article className="audit-item" key={item.tool}>
                    <div>
                      <h3>{item.tool}</h3>
                      <p>{item.owner} owner · {item.risk} risk · {item.progress}% confidence</p>
                    </div>
                    <Badge tone={item.risk === 'High' ? 'warning' : 'success'}>{item.savings}</Badge>
                  </article>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
