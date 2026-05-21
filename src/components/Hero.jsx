import { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════
   SINGLE HERO CARD — independent image slider
═══════════════════════════════════════════ */
function HeroCard({ card, ci, isFirst }) {
  const images  = card.images || [];
  const count   = images.length;
  const hasMany = count > 1;

  const [dot,   setDot]   = useState(0);   // active dot indicator
  const trackRef           = useRef(null);
  const posRef             = useRef(0);    // current slide index in track
  const lockedRef          = useRef(false); // prevent overlapping transitions
  const touchXRef          = useRef(0);

  /* ── Slide the track to a given position ── */
  const moveTo = useCallback((pos, animate = true) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate
      ? 'transform .6s cubic-bezier(.4,0,.2,1)'
      : 'none';
    
    if (!animate) {
      // Force reflow so transition: none takes effect immediately
      void el.offsetHeight;
    }
    
    el.style.transform  = `translateX(-${pos * 100}%)`;
    posRef.current = pos;
  }, []);

  /* ── Advance one step forward (infinite loop via clone) ── */
  const advance = useCallback(() => {
    if (!hasMany || lockedRef.current) return;
    lockedRef.current = true;
    const next = posRef.current + 1;

    if (next >= count) {
      // Slide into the clone at position `count`, then snap back to 0
      moveTo(count);
      setDot(0);
      setTimeout(() => {
        moveTo(0, false);
        requestAnimationFrame(() => { lockedRef.current = false; });
      }, 660);
    } else {
      moveTo(next);
      setDot(next);
      setTimeout(() => { lockedRef.current = false; }, 660);
    }
  }, [hasMany, count, moveTo]);

  /* ── Jump to dot index (user click) ── */
  const jumpTo = useCallback((i) => {
    if (lockedRef.current) return;
    moveTo(i);
    setDot(i);
  }, [moveTo]);

  /* ── Auto-play — each card has its own staggered interval ── */
  useEffect(() => {
    if (!hasMany) return;
    const id = setInterval(advance, 3400 + ci * 900);
    return () => clearInterval(id);
  }, [advance, hasMany, ci]);

  /* ── Touch/swipe support ── */
  const onTouchStart = (e) => { touchXRef.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    const diff = touchXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) advance();                         // swipe left  → next
      else {
        // swipe right → prev
        if (lockedRef.current) return;
        lockedRef.current = true;
        const prev = posRef.current - 1;
        if (prev < 0) {
          moveTo(count - 1);
          setDot(count - 1);
        } else {
          moveTo(prev);
          setDot(prev);
        }
        setTimeout(() => { lockedRef.current = false; }, 660);
      }
    }
  };

  /* Slides = real images + clone of first (for seamless infinite loop) */
  const slides = count > 0 ? [...images, images[0]] : [null];

  /* Title size: first card is bigger so use a larger size */
  const titleClass = isFirst ? 'ac-title ac-title-lg' : 'ac-title';

  return (
    <div
      className={`art-card${isFirst ? ' art-card-main' : ''}`}
      style={isFirst ? { gridRow: '1 / 3' } : {}}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Slider track ── */}
      <div className="card-track" ref={trackRef}>
        {slides.map((url, si) => (
          <div className="card-slide" key={si}>
            {/* Gradient background (visible until image loads) */}
            <div className={`slide-bg ${card.bg}`} />

            {/* Emoji fallback (shown when no image) */}
            {!url && (
              <div className="ac-bg ac-bg-emoji">{card.emoji}</div>
            )}

            {/* Real image */}
            {url && (
              <img
                className="slide-img"
                src={url}
                alt={card.title}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}

            {/* Dark overlay gradient */}
            <div className="slide-overlay" />

            {/* Content: tag + title + dots */}
            <div className="slide-content">
              <span className="ac-tag">{card.tag}</span>
              <div
                className={titleClass}
                dangerouslySetInnerHTML={{
                  __html: (card.title || '').replace(/\n/g, '<br/>'),
                }}
              />
              {/* Dots live INSIDE content so they sit naturally below title */}
              {hasMany && (
                <div className="card-dots-inline">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`card-dot${i === dot ? ' active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); jumpTo(i); }}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════
   HERO SECTION
═════════════════════════ */
export default function Hero({ hero }) {
  const defaultCards = [
    { tag: 'Featured Work', title: 'Bohemian\nLiving Room', emoji: '🌿', bg: 'art-a-bg', images: [] },
    { tag: '3D Art',        title: 'Sculpture Panel',      emoji: '🏛',  bg: 'art-b-bg', images: [] },
    { tag: 'Tropical',      title: 'Resort Mural',         emoji: '🌴',  bg: 'art-c-bg', images: [] },
  ];
  const cards = (hero?.cards && hero.cards.length === 3) ? hero.cards : defaultCards;

  /* Parallax blobs on mousemove */
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth  - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      document.querySelectorAll('.blob1').forEach((b) => {
        b.style.transform = `translate(${x * 30}px,${y * 20}px)`;
      });
      document.querySelectorAll('.blob2').forEach((b) => {
        b.style.transform = `translate(${-x * 20}px,${-y * 15}px)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero">
      {/* Decorative blobs */}
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <div className="hero-deco-circle dc1" />
      <div className="hero-deco-circle dc2" />

      {/* ── Left: text content ── */}
      <div className="hero-left">
        <div className="hero-badge">
          <div className="badge-dot">★</div>
          <span className="badge-text">
            {hero?.badge || "Bangalore's No.1 Wall Art Studio · 30+ Years"}
          </span>
        </div>

        <h1 className="hero-h1">
          <span className="line">{hero?.line1 || 'Walls That'}</span>
          <span className="line hi-coral">
            <em>{hero?.line2 || 'Tell Your'}</em>
          </span>
          <span className="line hi-forest">{hero?.line3 || 'Story.'}</span>
        </h1>

        <p className="hero-sub">{hero?.sub}</p>

        <div className="hero-btns">
          <a href="#gallery" className="btn-coral">
            {hero?.btn1 || 'Explore Portfolio'}
          </a>
          <a href="#contact" className="btn-outline">
            {hero?.btn2 || 'Talk to Us'}
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="hero-nums">
          <div>
            <div className="hnum-val">{hero?.s1v || '30'}+</div>
            <div className="hnum-lbl">{hero?.s1l || 'Years of Craft'}</div>
          </div>
          <div>
            <div className="hnum-val">{hero?.s2v || '500'}+</div>
            <div className="hnum-lbl">{hero?.s2l || 'Projects Done'}</div>
          </div>
          <div>
            <div className="hnum-val">{hero?.s3v || '6'}+</div>
            <div className="hnum-lbl">{hero?.s3l || 'Cities Served'}</div>
          </div>
        </div>
      </div>

      {/* ── Right: 3 independent card sliders ── */}
      <div className="hero-right" id="hero-right">
        {cards.map((card, ci) => (
          <HeroCard
            key={ci}
            card={card}
            ci={ci}
            isFirst={ci === 0}
          />
        ))}
      </div>
    </section>
  );
}
