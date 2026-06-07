import { useEffect, useRef, useState } from 'react';

export default function Nav({ contact, onAdminOpen }) {
  const navRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ['gallery', 'about', 'contact'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id) || document.querySelector('.gallery-section');
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setDark(true);
            else {
              const anyDark = sections.some((s) => {
                const sec = document.getElementById(s) || document.querySelector('.gallery-section');
                if (!sec) return false;
                const r = sec.getBoundingClientRect();
                return r.top <= 80 && r.bottom >= 80;
              });
              if (!anyDark) setDark(false);
            }
          });
        },
        { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  const phone = contact?.phone || '+91 83100 74733';

  return (
    <>
      <nav ref={navRef} className={dark ? 'dark' : ''} id="nav">
        <a className="nav-logo" href="#"><span>Wall</span>Art Designs</a>
        <ul className="nav-links">
          <li><a href="#gallery">Portfolio</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-right">
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="nav-cta">Get a Quote</a>
          <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${menuOpen ? 'show' : ''}`}>
        <button className="mobile-sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <ul className="mobile-sidebar-links">
          <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Portfolio</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </>
  );
}
