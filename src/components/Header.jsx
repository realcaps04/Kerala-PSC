import { useState } from 'react';
import { Menu, X, Bell, BookOpen, List, HelpCircle, UserPlus } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Notifications', href: '#', icon: <Bell size={14} /> },
  { label: 'Syllabus',      href: '#', icon: <BookOpen size={14} /> },
  { label: 'Rank List',     href: '#', icon: <List size={14} /> },
  { label: 'Help',          href: '#', icon: <HelpCircle size={14} /> },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <a href="#" className="brand">
          <div className="brand-logo">
            <img src="/kerala_psc_logo.webp" alt="Kerala Public Service Commission Official Logo" />
          </div>
          <div className="brand-text">
            <span className="brand-subtitle">Government of Kerala</span>
            <span className="brand-title">Kerala Public Service Commission</span>
            <span className="brand-tagline">Thulasi – One-Time Registration Portal</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="header-nav">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <button className="nav-btn-register">
            <UserPlus size={14} style={{ marginRight: '0.35rem', display: 'inline' }} />
            New Registration
          </button>
        </nav>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} color="#007AD1" /> : <Menu size={22} color="#007AD1" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a key={link.label} href={link.href} className="mobile-nav-link">{link.label}</a>
        ))}
        <a href="#" className="mobile-nav-link mobile-register">New Registration</a>
      </nav>
    </header>
  );
}
