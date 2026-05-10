export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <p>&copy; {new Date().getFullYear()} Credex AI Spend Audit. All rights reserved.</p>
        <div className="social-links">
          <a href="#" aria-label="GitHub">
            <img src="/src/assets/social-github.svg" alt="" width="20" height="20" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <img src="/src/assets/social-linkedin.svg" alt="" width="20" height="20" />
          </a>
        </div>
      </div>
    </footer>
  );
}
