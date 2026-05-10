import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { Badge, Button, Card, InputGroup, Modal } from '../components';
import { showToast } from '../utils/ui';

export default function Settings() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast('Settings saved locally for this UI build.', 'success');
  };

  return (
    <>
      <Helmet>
        <title>Settings | Credex AI Spend Audit</title>
        <meta name="description" content="Configure audit thresholds, renewal alerts, and Credex AI Spend Audit workspace preferences." />
      </Helmet>

      <div className="page page--compact">
        <div className="container">
          <div className="section__header fade-in">
            <p className="eyebrow">Workspace controls</p>
            <h1>Settings</h1>
            <p>Set the thresholds Credex uses to surface risk, savings, and renewal urgency.</p>
          </div>

          <div className="grid grid--2">
            <Card className="fade-in">
              <h2>Audit rules</h2>
              <form className="settings-form" onSubmit={handleSubmit}>
                <InputGroup hint="Savings below this value are grouped into low-priority recommendations." id="threshold" label="Savings threshold">
                  {({ id, describedBy }) => (
                    <input aria-describedby={describedBy} className="field" defaultValue="5000" id={id} min="0" type="number" />
                  )}
                </InputGroup>
                <InputGroup id="window" label="Renewal alert window">
                  {({ id }) => (
                    <select className="select" defaultValue="45" id={id}>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                    </select>
                  )}
                </InputGroup>
                <Button type="submit">Save settings</Button>
              </form>
            </Card>

            <Card className="fade-in">
              <Badge tone="accent">Approval policy</Badge>
              <h2>Finance review</h2>
              <p>Require review when a recommendation affects security posture or changes more than 20 seats.</p>
              <Button variant="secondary" onClick={() => setModalOpen(true)}>Review policy</Button>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} title="Approval policy" onClose={() => setModalOpen(false)}>
        <p>High-impact recommendations should include business owner notes, renewal deadline, expected savings, and any security or compliance tradeoffs before approval.</p>
        <Button onClick={() => setModalOpen(false)}>Got it</Button>
      </Modal>
    </>
  );
}
