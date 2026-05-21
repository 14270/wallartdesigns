import { useEffect, useRef, useState } from 'react';

export default function Nav({ contact, onAdminOpen }) {
  const navRef = useRef(null);
  const [dark, setDark] = useState(false);

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
      </div>
    </nav>
  );
}
