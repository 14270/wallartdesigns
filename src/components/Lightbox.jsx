import { useEffect, useRef, useState } from 'react';

export default function Lightbox({ items, initialId, categories, onClose }) {
  const [idx, setIdx] = useState(0);
  const tsX = useRef(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!items || !items.length) return;
    const i = items.findIndex((g) => g.id === initialId);
    setIdx(i >= 0 ? i : 0);
  }, [items, initialId]);

  // Pause & reset video whenever slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [idx]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((p) => (p + 1) % items.length);
      if (e.key === 'ArrowLeft') setIdx((p) => (p - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [items, onClose]);

  if (!items || !items.length) return null;

  const item = items[idx];
  const cats = categories || {};
  const hasVideo = !!item.videoUrl;
  const hasImage = !!item.imgUrl;

  const next = () => setIdx((p) => (p + 1) % items.length);
  const prev = () => setIdx((p) => (p - 1 + items.length) % items.length);

  return (
    <div className="lightbox open" id="lightbox"
      onTouchStart={(e) => { tsX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = tsX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) { diff > 0 ? next() : prev(); }
      }}
    >
      <div className="lb-overlay" onClick={onClose} />
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-prev" onClick={prev}>‹</button>
      <button className="lb-next" onClick={next}>›</button>
      <div className="lb-wrap">
        {/* Media area: side-by-side if both exist, else single */}
        <div className={`lb-media-row${hasImage && hasVideo ? ' dual' : ''}`}>
          {/* Image pane */}
          {hasImage && (
            <div className={`lb-img-box${hasVideo ? ' lb-img-box--half' : ''}`}>
              <img className="lb-img" src={item.imgUrl} alt="" />
            </div>
          )}
          {!hasImage && !hasVideo && (
            <div className="lb-img-box">
              <div className="lb-emoji-big" style={{ display: 'flex' }}>{item.emoji || '🎨'}</div>
            </div>
          )}
          {/* Video pane */}
          {hasVideo && (
            <div className={`lb-video-box${hasImage ? ' lb-video-box--half' : ''}`}>
              <div className="lb-video-label">
                <span className="lb-video-icon">▶</span> Project Video
              </div>
              <video
                ref={videoRef}
                className="lb-video"
                src={item.videoUrl}
                controls
                playsInline
                loop
              />
            </div>
          )}
        </div>

        <div className="lb-info">
          <div className="lb-cat-lbl">{cats[item.cat] || item.cat}</div>
          <div className="lb-title-lbl">{item.title}</div>
          {hasVideo && !hasImage && (
            <div className="lb-media-tag">🎬 Video Project</div>
          )}
          {hasVideo && hasImage && (
            <div className="lb-media-tag">🖼️ + 🎬 Image & Video</div>
          )}
          <div className="lb-counter">{idx + 1} / {items.length}</div>
        </div>
        <div className="lb-dots" id="lb-dots">
          {items.map((_, i) => (
            <button key={i} className={`lb-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
