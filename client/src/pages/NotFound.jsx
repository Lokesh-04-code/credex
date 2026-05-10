import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '../components';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Credex</title>
      </Helmet>
      <div className="page-container fade-in text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: 'var(--spacing-sm)' }}>404</h1>
        <p className="mb-2" style={{ fontSize: 'var(--font-lg)' }}>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </>
  );
}
