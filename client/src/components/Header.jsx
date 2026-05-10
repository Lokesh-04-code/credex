import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="site-header">
      <div className="page-container">
        <NavLink to="/" className="site-logo">
          <img src="/src/assets/logo.svg" alt="Credex Logo" width="32" height="32" />
          Credex
        </NavLink>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/audit" className={({ isActive }) => isActive ? 'active' : ''}>Audit</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Settings</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        </nav>
      </div>
    </header>
  );
}
