// ─── MARQUEE ───
export function Marquee() {
  const items = ['Wall Sculpture','Bohemian Murals','Tropical Design','Classic Interiors','Corporate Art','3D Sculpture','Custom Commissions','Pan India Projects','30+ Years Legacy'];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-sep" />{item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── GALLERY ───
import { useState, useEffect, useRef } from 'react';

export function Gallery({ gallery, categories, onOpenLightbox, onCategoryClick }) {
  const allCats = categories || {};
  const usedCats = new Set((gallery || []).map((g) => g.cat));
  const tabCats = Object.keys(allCats);
  const firstCat = tabCats.find((c) => usedCats.has(c)) || tabCats[0] || '';
  const [activeCat, setActiveCat] = useState(firstCat);

  useEffect(() => { setActiveCat(firstCat); }, [firstCat]);

  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 60);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const visible = (gallery || []).filter((g) => g.cat === activeCat);

  return (
    <section className="gallery-section" id="gallery" ref={revRef}>
      <div className="gallery-top">
        <div>
          <div className="section-eye rv">Our Portfolio</div>
          <h2 className="gallery-h2 rv">Spaces We've<br /><em>Transformed</em></h2>
        </div>
        <div className="filter-tabs rv" id="filter-tabs">
          {tabCats.map((c) => (
            <button
              key={c}
              className={`ftab${c === activeCat ? ' active' : ''}`}
              style={usedCats.has(c) ? {} : { opacity: 0.4, pointerEvents: 'none' }}
              onClick={() => { setActiveCat(c); if (onCategoryClick) onCategoryClick(c); }}
            >
              {allCats[c] || c}
            </button>
          ))}
        </div>
      </div>
      <div className="masonry rv" id="msnry">
        {visible.map((item) => (
          <div key={item.id} className="m-card" data-c={item.cat} data-id={item.id} onClick={() => onOpenLightbox && onOpenLightbox(item.id, visible)}>
            <div className="m-inner">
              <div className="m-img">
                <div className="m-emoji">{item.emoji || '🎨'}</div>
                {item.imgUrl && (
                  <img className="m-real-img" src={item.imgUrl} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
              </div>
              {item.videoUrl && (
                <div className="m-video-badge" title="This project has a video">
                  <span>▶</span>
                </div>
              )}
              <div className="m-hover">
                <div className="m-cat">{allCats[item.cat] || item.cat}</div>
                <div className="m-title">{item.title}</div>
                {item.videoUrl && <div className="m-video-hint">🎬 Video available</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ABOUT ───
export function About({ about, contact }) {
  const wa = contact?.wa || '918310074733';
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 60); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="about-section" id="about" ref={revRef}>
      <div className="about-deco" />
      <div className="about-deco2" />
      <div className="about-grid">
        <div>
          <div className="about-label rv">{about?.label || 'About WallArt Designs'}</div>
          <h2 className="about-h2 rv">
            <span>{about?.h1 || "We Don't Just Paint Walls."}</span><br />
            <em>{about?.h2 || 'We Create With Heart.'}</em>
          </h2>
          <p className="about-p rv">{about?.p1}</p>
          <p className="about-p rv">{about?.p2}</p>
          <a href={`https://wa.me/${wa}`} className="btn-white rv">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.054 23.946a.5.5 0 0 0 .611.611l6.099-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.802a9.798 9.798 0 0 1-4.997-1.369l-.358-.213-3.718.895.911-3.629-.234-.373A9.802 9.802 0 0 1 2.198 12c0-5.413 4.389-9.802 9.802-9.802 5.413 0 9.802 4.389 9.802 9.802S17.413 21.802 12 21.802z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
        <div className="stats-grid rv rv-right">
          {[
            { v: about?.s1v, l: about?.s1l, bg: about?.s1bg },
            { v: about?.s2v, l: about?.s2l, bg: about?.s2bg },
            { v: about?.s3v, l: about?.s3l, bg: about?.s3bg },
            { v: about?.s4v, l: about?.s4l, bg: about?.s4bg },
          ].map((s, i) => (
            <div
              className={`stat-card ${s.bg ? 'has-bg' : ''}`}
              key={i}
              style={s.bg ? {
                position: 'relative',
                overflow: 'hidden',
                color: '#fff',
              } : {}}
            >
              {s.bg && (
                <>
                  <img
                    src={s.bg}
                    alt=""
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 0,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 80%)',
                      zIndex: 1,
                    }}
                  />
                </>
              )}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div className="stat-v" style={s.bg ? { color: '#fff' } : {}}>{s.v}</div>
                <div className="stat-l" style={s.bg ? { color: 'rgba(255,255,255,0.8)' } : {}}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ───
export function Services({ services }) {
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 60); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="services-section" id="services" ref={revRef}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div className="section-eye rv" style={{ color: 'var(--coral)' }}>What We Create</div>
          <h2 className="services-h2 rv">Our <em>Services</em></h2>
        </div>
        <p className="rv" style={{ color: 'var(--muted)', maxWidth: '320px', fontSize: '.9rem', lineHeight: '1.65' }}>Custom wall art tailored to your space, personality, and vision — from concept to completion.</p>
      </div>
      <div className="services-grid">
        {(services || []).map((s, i) => (
          <div key={i} className={`svc-card svc-card-${s.style} rv`} style={s.imgUrl ? { color: '#fff' } : {}}>
            {s.imgUrl && <img className="svc-img" src={s.imgUrl} alt="" style={{ opacity: 1 }} />}
            {s.imgUrl && <div className="svc-img-overlay" style={{ opacity: 1 }} />}
            <div className="svc-content">
              <div className="svc-num">{s.num}</div>
              <span className="svc-icon">{s.icon}</span>
              <div className="svc-title">{s.title}</div>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-arrow" style={s.style === 'sand' ? { background: 'rgba(0,0,0,.08)', color: 'var(--charcoal)' } : {}}>→</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PROCESS ───
export function Process({ process }) {
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 60); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="process-section" ref={revRef}>
      <div className="process-bg-text">PROCESS</div>
      <div className="process-header">
        <div className="process-label rv">How It Works</div>
        <h2 className="process-h2 rv">Your Journey to a<br /><em>Beautiful Wall</em></h2>
      </div>
      <div className="process-steps">
        {(process || []).map((p, i) => (
          <div
            className={`process-card rv ${p.imgUrl ? 'has-bg' : ''}`}
            key={i}
            style={p.imgUrl ? {
              position: 'relative',
              overflow: 'hidden',
              color: '#fff',
            } : {}}
          >
            {p.imgUrl && (
              <>
                <img
                  src={p.imgUrl}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)',
                    zIndex: 1,
                  }}
                />
              </>
            )}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="pc-num">{p.num}</div>
              <span className="pc-icon">{p.icon}</span>
              <div className="pc-title">{p.title}</div>
              <p className="pc-desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ───
export function Testimonials({ reviews }) {
  const avColors = ['coral', 'forest', 'plum'];
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 60); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="testi-section" id="testimonials" ref={revRef}>
      <div className="testi-header">
        <div className="testi-label rv">Client Stories</div>
        <h2 className="testi-h2 rv">Loved By <em>Clients</em></h2>
      </div>
      <div className="testi-grid">
        {(reviews || []).map((r, i) => (
          <div className="testi-card rv" key={i}>
            <div className="t-stars">★★★★★</div>
            <div className="t-quote">"</div>
            <p className="t-text">{r.text}</p>
            <div className="t-author">
              <div className={`t-av av-${r.av || avColors[i % 3]}`}>{r.initials}</div>
              <div>
                <div className="t-name">{r.name}</div>
                <div className="t-loc">{r.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ───
export function CTA({ contact }) {
  const wa = contact?.wa || '918310074733';
  const phone = contact?.phone || '+91 83100 74733';
  const email = contact?.email || 'bangalorearthub@gmail.com';
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), i * 60); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revRef.current.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const waIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.054 23.946a.5.5 0 0 0 .611.611l6.099-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.802a9.798 9.798 0 0 1-4.997-1.369l-.358-.213-3.718.895.911-3.629-.234-.373A9.802 9.802 0 0 1 2.198 12c0-5.413 4.389-9.802 9.802-9.802 5.413 0 9.802 4.389 9.802 9.802S17.413 21.802 12 21.802z"/>
    </svg>
  );

  return (
    <section className="cta-section" id="contact" ref={revRef}>
      <div className="cta-blob1" /><div className="cta-blob2" />
      <div className="cta-label rv">{contact?.label || 'Start Your Project'}</div>
      <h2 className="cta-h2 rv">
        <span>{contact?.h1 || 'Ready to Transform'}</span><br />
        <em>{contact?.h2 || 'Your Space?'}</em>
      </h2>
      <p className="cta-sub rv">{contact?.sub}</p>
      <div className="cta-btns rv">
        <a href={`https://wa.me/${wa}`} className="btn-wa">{waIcon} WhatsApp Us</a>
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn-gold">📞 {phone}</a>
        <a href={`mailto:${email}`} className="btn-ghost-white">
          Email Us
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </section>
  );
}

// ─── CONTACT STRIP ───
export function ContactStrip({ contact }) {
  const phone = contact?.phone || '+91 83100 74733';
  const email = contact?.email || 'bangalorearthub@gmail.com';
  const revRef = useRef(null);
  useEffect(() => {
    if (!revRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    if (revRef.current.classList.contains('rv')) obs.observe(revRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="contact-strip rv" ref={revRef}>
      <div className="cs-left">
        <h3>{contact?.stripH || "Let's Talk About Your Project"}</h3>
        <p>{contact?.stripP || "We're just a call or message away — across Pan India"}</p>
      </div>
      <div className="cs-right">
        <div className="cs-contact">
          <div className="cs-icon">📞</div>
          <div className="cs-info">
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            <span>Call Us Directly</span>
          </div>
        </div>
        <div className="cs-contact">
          <div className="cs-icon">📧</div>
          <div className="cs-info">
            <a href={`mailto:${email}`}>{email}</a>
            <span>Email Us Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───
export function Footer({ footer, contact }) {
  const f = footer || {};
  return (
    <footer>
      <div className="footer-top">
        <div>
          <a className="fl-logo" href="#"><span>Wall</span>Art Designs</a>
          <p className="fl-p">{f.tag}</p>
          <div className="fl-socials">
            <a href={f.ig || '#'} className="fl-soc fl-soc-ig" title="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href={f.fb || '#'} className="fl-soc fl-soc-fb" title="Facebook">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={f.wa || '#'} className="fl-soc fl-soc-wa" title="WhatsApp">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.054 23.946a.5.5 0 0 0 .611.611l6.099-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.802a9.798 9.798 0 0 1-4.997-1.369l-.358-.213-3.718.895.911-3.629-.234-.373A9.802 9.802 0 0 1 2.198 12c0-5.413 4.389-9.802 9.802-9.802 5.413 0 9.802 4.389 9.802 9.802S17.413 21.802 12 21.802z"/></svg>
            </a>
            <a href={f.ph || '#'} className="fl-soc fl-soc-ph" title="Call Us">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
          </div>
        </div>
        <div className="fc">
          <h4>Navigate</h4>
          <ul>
            <li><a href="#gallery">Portfolio</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="fc">
          <h4>Services</h4>
          <ul>
            {['Wall Sculpture','Bohemian Murals','Tropical Design','Classic Interiors','Corporate Murals','Custom Art'].map((s) => <li key={s}><a href="#">{s}</a></li>)}
          </ul>
        </div>
        <div className="fc">
          <h4>Cities</h4>
          <ul>
            {['Bangalore','Hyderabad','Mumbai','Chennai','Goa','Pan India'].map((c) => <li key={c}><a href="#">{c}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{f.copy || '© 2026 WallArt Designs. All rights reserved.'}</p>
        <p>Made with ♥ for walls everywhere · <a href={f.ph || '#'} style={{ color: 'var(--coral)', textDecoration: 'none' }}>{(f.ph || '').replace('tel:', '')}</a></p>
      </div>
    </footer>
  );
}

// ─── WHATSAPP FAB ───
export function WhatsAppFab({ wa }) {
  return (
    <a href={`https://wa.me/${wa || '918310074733'}`} className="wa-fab">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.054 23.946a.5.5 0 0 0 .611.611l6.099-1.468A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.802a9.798 9.798 0 0 1-4.997-1.369l-.358-.213-3.718.895.911-3.629-.234-.373A9.802 9.802 0 0 1 2.198 12c0-5.413 4.389-9.802 9.802-9.802 5.413 0 9.802 4.389 9.802 9.802S17.413 21.802 12 21.802z"/>
      </svg>
    </a>
  );
}
