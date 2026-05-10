import { Helmet } from 'react-helmet-async';

import { Badge, Card } from '../components';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | Credex AI Spend Audit</title>
        <meta name="description" content="Learn how Credex AI Spend Audit helps teams manage AI tool sprawl and make accountable spend decisions." />
      </Helmet>

      <div className="page">
        <div className="container">
          <div className="section__header fade-in">
            <p className="eyebrow">About Credex</p>
            <h1>About</h1>
            <p>Credex AI Spend Audit exists for teams that adopted AI tools quickly and now need a calmer, accountable way to manage the stack.</p>
          </div>

          <div className="grid grid--3">
            <Card className="fade-in">
              <Badge tone="primary">Clarity</Badge>
              <h2>Normalize the stack</h2>
              <p>Bring vendors, plan tiers, users, and invoices into a single view built for finance and operators.</p>
            </Card>
            <Card className="fade-in">
              <Badge tone="success">Action</Badge>
              <h2>Prioritize savings</h2>
              <p>Rank recommendations by confidence, risk, expected savings, and renewal timing.</p>
            </Card>
            <Card className="fade-in">
              <Badge tone="accent">Trust</Badge>
              <h2>Keep an audit trail</h2>
              <p>Record approvals and rationale so spend changes stay understandable after the decision.</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
