import { useState, useEffect, useCallback } from "react";
import AnalyticsPanel from "./AnalyticsPanel";

// cSpell:ignore adash topbar wallart
const PANELS = [
  { key: "analytics", icon: "📊", label: "Analytics" },
  { key: "hero", icon: "🏠", label: "Hero" },
  { key: "gallery", icon: "🖼️", label: "Gallery" },
  { key: "about", icon: "ℹ️", label: "About" },
  { key: "services", icon: "⚡", label: "Services" },
  { key: "process", icon: "🔄", label: "Process" },
  { key: "reviews", icon: "⭐", label: "Reviews" },
  { key: "contact", icon: "📞", label: "Contact" },
  { key: "footer", icon: "📝", label: "Footer" },
];

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej();
    r.readAsDataURL(file);
  });
}

/* ── HERO PANEL ── */
function HeroPanel({ data, onChange }) {
  const h = data.hero || {};
  const cards = h.cards || [];

  const set = (key, val) =>
    onChange((d) => {
      d.hero[key] = val;
      return d;
    });
  const setCard = (ci, key, val) =>
    onChange((d) => {
      d.hero.cards[ci][key] = val;
      return d;
    });

  const handleCardImgs = async (ci, files) => {
    const urls = await Promise.all(Array.from(files).map(fileToDataUrl));
    onChange((d) => {
      d.hero.cards[ci].images = [...(d.hero.cards[ci].images || []), ...urls];
      return d;
    });
  };
  const removeCardImg = (ci, imgIdx) =>
    onChange((d) => {
      d.hero.cards[ci].images.splice(imgIdx, 1);
      return d;
    });
  const clearCardImgs = (ci) =>
    onChange((d) => {
      d.hero.cards[ci].images = [];
      return d;
    });
  const handleDragStart = (e, ci, ii) => {
    e.dataTransfer.setData("text/plain", `${ci}-${ii}`);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetCi, targetIi) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    if (!data) return;
    const [sourceCiStr, sourceIiStr] = data.split("-");
    const sourceCi = parseInt(sourceCiStr, 10);
    const sourceIi = parseInt(sourceIiStr, 10);
    if (sourceCi === targetCi && sourceIi !== targetIi) {
      onChange((d) => {
        const imgs = d.hero.cards[targetCi].images;
        const [draggedImg] = imgs.splice(sourceIi, 1);
        imgs.splice(targetIi, 0, draggedImg);
        return d;
      });
    }
  };

  const CARD_LABELS = [
    "Card 1 — Large Left Card",
    "Card 2 — Top Right Card",
    "Card 3 — Bottom Right Card",
  ];

  return (
    <div>
      <div className="ad-section-title">Hero Section</div>
      <div className="ad-section-sub">
        Edit the main banner content visible to visitors.
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Badge & Headline</div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Badge Text</label>
            <input
              type="text"
              value={h.badge || ""}
              onChange={(e) => set("badge", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row three">
          <div className="ad-field">
            <label>Headline Line 1</label>
            <input
              type="text"
              value={h.line1 || ""}
              onChange={(e) => set("line1", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Headline Line 2</label>
            <input
              type="text"
              value={h.line2 || ""}
              onChange={(e) => set("line2", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Headline Line 3</label>
            <input
              type="text"
              value={h.line3 || ""}
              onChange={(e) => set("line3", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Subtitle Text</label>
            <textarea
              value={h.sub || ""}
              onChange={(e) => set("sub", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Buttons</div>
        <div className="ad-row">
          <div className="ad-field">
            <label>Primary Button</label>
            <input
              type="text"
              value={h.btn1 || ""}
              onChange={(e) => set("btn1", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Secondary Button</label>
            <input
              type="text"
              value={h.btn2 || ""}
              onChange={(e) => set("btn2", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Statistics</div>
        <div className="ad-row three">
          {[1, 2, 3].map((n) => (
            <div className="ad-field" key={n}>
              <label>Stat {n} Value</label>
              <input
                type="text"
                value={h[`s${n}v`] || ""}
                onChange={(e) => set(`s${n}v`, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="ad-row three">
          {[1, 2, 3].map((n) => (
            <div className="ad-field" key={n}>
              <label>Stat {n} Label</label>
              <input
                type="text"
                value={h[`s${n}l`] || ""}
                onChange={(e) => set(`s${n}l`, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">
          🖼️ Hero Slider Images — 3 Separate Sliders
        </div>
        <p
          style={{
            fontSize: ".75rem",
            color: "#666",
            marginBottom: "1.4rem",
            lineHeight: "1.6",
          }}
        >
          Each card has its own independent image slider. Add multiple photos to
          any card — they will auto-slide within that card only.
        </p>
        {cards.map((c, ci) => (
          <div
            key={ci}
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                background: "#1e1e1e",
                padding: ".8rem 1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: ".65rem",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: "var(--coral)",
                    fontWeight: 600,
                  }}
                >
                  {CARD_LABELS[ci]}
                </span>
                <span
                  style={{
                    fontSize: ".68rem",
                    color: "#555",
                    marginLeft: ".6rem",
                  }}
                >
                  {(c.images || []).length} images
                </span>
              </div>
              <label
                className="gal-item-change-btn"
                style={{ fontSize: ".72rem" }}
              >
                ＋ Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleCardImgs(ci, e.target.files)}
                />
              </label>
            </div>
            <div style={{ padding: ".9rem 1.1rem" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".5rem",
                  minHeight: "36px",
                  alignItems: "center",
                }}
              >
                {(c.images || []).length === 0 ? (
                  <span
                    style={{
                      fontSize: ".72rem",
                      color: "#444",
                      fontStyle: "italic",
                    }}
                  >
                    No images yet — click Add Images above
                  </span>
                ) : (
                  (c.images || []).map((url, ii) => (
                    <div
                      key={ii}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ci, ii)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, ci, ii)}
                      style={{
                        position: "relative",
                        width: "74px",
                        height: "60px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        cursor: "grab",
                      }}
                    >
                      <img
                        src={url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                      />
                      <button
                        onClick={() => removeCardImg(ci, ii)}
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          background: "rgba(0,0,0,.8)",
                          color: "#ff4d4d",
                          border: "none",
                          borderRadius: "50%",
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          fontSize: ".7rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div
              style={{
                padding: ".6rem 1.1rem",
                borderTop: "1px solid #222",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: ".6rem",
              }}
            >
              <div className="ad-field">
                <label>Tag Label</label>
                <input
                  type="text"
                  value={c.tag || ""}
                  placeholder="Featured Work"
                  onChange={(e) => setCard(ci, "tag", e.target.value)}
                />
              </div>
              <div className="ad-field">
                <label>Card Title</label>
                <input
                  type="text"
                  value={(c.title || "").replace(/\n/g, " ")}
                  placeholder="Bohemian Living Room"
                  onChange={(e) => setCard(ci, "title", e.target.value)}
                />
              </div>
            </div>
            <div
              style={{
                padding: ".5rem 1.1rem",
                background: "#111",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => clearCardImgs(ci)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  fontSize: ".7rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                🗑 Clear all images
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── GALLERY PANEL ── */
function GalleryPanel({ data, onChange }) {
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newBg, setNewBg] = useState("mb1");
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newImgPreview, setNewImgPreview] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const cats = data.categories || {};
  const gallery = data.gallery || [];

  const catKeys = Object.keys(cats);
  useEffect(() => {
    if (!newCat && catKeys.length) setNewCat(catKeys[0]);
  }, [newCat, catKeys.length]);

  const addGalleryItem = () => {
    if (!newTitle.trim()) return;
    const maxId = Math.max(0, ...gallery.map((g) => g.id));
    onChange((d) => {
      d.gallery.push({
        id: maxId + 1,
        emoji: "🎨",
        imgUrl: newImgUrl,
        cat: newCat,
        title: newTitle,
        ratio: 120,
        bg: newBg,
      });
      return d;
    });
    setNewTitle("");
    setNewImgUrl("");
    setNewImgPreview("");
  };
  const deleteItem = (id) =>
    onChange((d) => {
      d.gallery = d.gallery.filter((g) => g.id !== id);
      return d;
    });
  const updateItem = (id, key, val) =>
    onChange((d) => {
      const g = d.gallery.find((x) => x.id === id);
      if (g) g[key] = val;
      return d;
    });

  const handleNewImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setNewImgUrl(url);
    setNewImgPreview(url);
  };
  const handleItemImg = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    updateItem(id, "imgUrl", url);
  };
  const addCategory = () => {
    if (!newCatLabel.trim()) return;
    const key = newCatLabel
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    onChange((d) => {
      d.categories[key] = newCatLabel;
      return d;
    });
    setNewCatLabel("");
  };
  const removeCategory = (key) =>
    onChange((d) => {
      delete d.categories[key];
      return d;
    });

  return (
    <div>
      <div className="ad-section-title">Gallery</div>
      <div className="ad-section-sub">
        Add new artworks, manage categories and edit titles.
      </div>
      <div className="ad-group">
        <div className="ad-group-label">📂 Manage Categories</div>
        <div
          id="cat-mgr-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: ".5rem",
            marginBottom: "1rem",
          }}
        >
          {Object.entries(cats).map(([k, v]) => (
            <span className="cat-chip" key={k}>
              {v} <button onClick={() => removeCategory(k)}>✕</button>
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: ".6rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="New category name e.g. Hotel Mural"
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCategory();
            }}
            style={{
              flex: 1,
              minWidth: "160px",
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: ".6rem .9rem",
              fontSize: ".82rem",
              color: "#ddd",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            className="gal-add-btn"
            onClick={addCategory}
            style={{ background: "var(--coral)" }}
          >
            ➕ Add Category
          </button>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Existing Gallery Items</div>
        <div className="gal-items">
          {gallery.map((item) => (
            <div className="gal-item" key={item.id}>
              <div className="gal-item-preview">
                {item.imgUrl ? <img src={item.imgUrl} alt="" /> : item.emoji}
              </div>
              <div className="gal-item-inputs">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, "title", e.target.value)}
                  placeholder="Title"
                />
                <select
                  value={item.cat}
                  onChange={(e) => updateItem(item.id, "cat", e.target.value)}
                >
                  {Object.entries(cats).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".3rem",
                }}
              >
                <label className="gal-item-change-btn">
                  📷 Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleItemImg(item.id, e)}
                  />
                </label>
              </div>
              <button
                className="gal-del-btn"
                onClick={() => deleteItem(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="ad-group">
        <div className="gal-add-form">
          <div className="gal-add-title">➕ Add New Gallery Item</div>
          <div className="gal-upload-zone">
            <input type="file" accept="image/*" onChange={handleNewImg} />
            <span className="uz-icon">📸</span>
            <div className="uz-text">Click or Drag & Drop Image Here</div>
            <div className="uz-hint">JPG, PNG, WEBP</div>
          </div>
          {newImgPreview && (
            <div className="uz-preview-wrap show">
              <img src={newImgPreview} alt="preview" />
              <button
                className="uz-clear"
                onClick={() => {
                  setNewImgUrl("");
                  setNewImgPreview("");
                }}
              >
                ✕
              </button>
            </div>
          )}
          <div className="gal-add-grid">
            <div className="ad-field">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Resort Mural, Goa"
              />
            </div>
            <div className="ad-field">
              <label>Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              >
                {Object.entries(cats).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="ad-field">
              <label>Background Style</label>
              <select value={newBg} onChange={(e) => setNewBg(e.target.value)}>
                <option value="mb1">Coral Red</option>
                <option value="mb2">Forest Green</option>
                <option value="mb3">Deep Plum</option>
                <option value="mb4">Warm Brown</option>
                <option value="mb5">Teal</option>
                <option value="mb6">Rose</option>
              </select>
            </div>
          </div>
          <button className="gal-add-btn" onClick={addGalleryItem}>
            ➕ Add to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ABOUT PANEL ── */
function AboutPanel({ data, onChange }) {
  const a = data.about || {};
  const set = (key, val) =>
    onChange((d) => {
      d.about[key] = val;
      return d;
    });
  return (
    <div>
      <div className="ad-section-title">About Section</div>
      <div className="ad-section-sub">
        Edit the about section content and statistics.
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Text Content</div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Section Label</label>
            <input
              type="text"
              value={a.label || ""}
              onChange={(e) => set("label", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Heading Line 1</label>
            <input
              type="text"
              value={a.h1 || ""}
              onChange={(e) => set("h1", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Heading Line 2 (italic)</label>
            <input
              type="text"
              value={a.h2 || ""}
              onChange={(e) => set("h2", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Paragraph 1</label>
            <textarea
              value={a.p1 || ""}
              onChange={(e) => set("p1", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Paragraph 2</label>
            <textarea
              value={a.p2 || ""}
              onChange={(e) => set("p2", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Statistics</div>
        {[1, 2, 3, 4].map((n) => (
          <div className="ad-row" key={n}>
            <div className="ad-field">
              <label>Stat {n} Value</label>
              <input
                type="text"
                value={a[`s${n}v`] || ""}
                onChange={(e) => set(`s${n}v`, e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Stat {n} Label</label>
              <input
                type="text"
                value={a[`s${n}l`] || ""}
                onChange={(e) => set(`s${n}l`, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SERVICES PANEL ── */
function ServicesPanel({ data, onChange }) {
  const services = data.services || [];
  const set = (i, key, val) =>
    onChange((d) => {
      d.services[i][key] = val;
      return d;
    });
  const handleImg = async (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    set(i, "imgUrl", url);
  };

  return (
    <div>
      <div className="ad-section-title">Services</div>
      <div className="ad-section-sub">
        Edit service cards shown on the website.
      </div>
      {services.map((s, i) => (
        <div className="ad-group" key={i}>
          <div className="ad-group-label">
            Service {i + 1}: {s.title}
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label>Icon (emoji)</label>
              <input
                type="text"
                value={s.icon || ""}
                onChange={(e) => set(i, "icon", e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Number</label>
              <input
                type="text"
                value={s.num || ""}
                onChange={(e) => set(i, "num", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row full">
            <div className="ad-field">
              <label>Title</label>
              <input
                type="text"
                value={s.title || ""}
                onChange={(e) => set(i, "title", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row full">
            <div className="ad-field">
              <label>Description</label>
              <textarea
                value={s.desc || ""}
                onChange={(e) => set(i, "desc", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label>Style</label>
              <select
                value={s.style || "coral"}
                onChange={(e) => set(i, "style", e.target.value)}
              >
                {["coral", "forest", "gold", "plum", "sage", "sand"].map(
                  (st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="ad-field">
              <label>Background Image</label>
              {s.imgUrl && (
                <div
                  style={{
                    marginBottom: ".5rem",
                    position: "relative",
                    width: "80px",
                    height: "60px",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={s.imgUrl}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => set(i, "imgUrl", null)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "rgba(0,0,0,.8)",
                      color: "#ff4d4d",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      fontSize: ".7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <label
                className="gal-item-change-btn"
                style={{ marginTop: ".4rem" }}
              >
                📷 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImg(i, e)}
                />
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PROCESS PANEL ── */
function ProcessPanel({ data, onChange }) {
  const process = data.process || [];
  const set = (i, key, val) =>
    onChange((d) => {
      d.process[i][key] = val;
      return d;
    });
  const handleImg = async (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    set(i, "imgUrl", url);
  };
  return (
    <div>
      <div className="ad-section-title">Process / How It Works</div>
      <div className="ad-section-sub">Edit the 4-step process cards.</div>
      {process.map((p, i) => (
        <div className="ad-group" key={i}>
          <div className="ad-group-label">Step {i + 1}</div>
          <div className="ad-row">
            <div className="ad-field">
              <label>Icon</label>
              <input
                type="text"
                value={p.icon || ""}
                onChange={(e) => set(i, "icon", e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Number</label>
              <input
                type="text"
                value={p.num || ""}
                onChange={(e) => set(i, "num", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row full">
            <div className="ad-field">
              <label>Title</label>
              <input
                type="text"
                value={p.title || ""}
                onChange={(e) => set(i, "title", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row full">
            <div className="ad-field">
              <label>Description</label>
              <textarea
                value={p.desc || ""}
                onChange={(e) => set(i, "desc", e.target.value)}
              />
            </div>
          </div>
          <div className="ad-row">
            <div className="ad-field">
              <label>Background Image</label>
              {p.imgUrl && (
                <div
                  style={{
                    marginBottom: ".5rem",
                    position: "relative",
                    width: "80px",
                    height: "60px",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={p.imgUrl}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => set(i, "imgUrl", null)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "rgba(0,0,0,.8)",
                      color: "#ff4d4d",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      fontSize: ".7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <label
                className="gal-item-change-btn"
                style={{ marginTop: ".4rem" }}
              >
                📷 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImg(i, e)}
                />
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── REVIEWS PANEL ── */
function ReviewsPanel({ data, onChange }) {
  const reviews = data.reviews || [];
  const set = (i, key, val) =>
    onChange((d) => {
      d.reviews[i][key] = val;
      return d;
    });
  const addReview = () =>
    onChange((d) => {
      d.reviews.push({
        name: "New Client",
        loc: "City",
        initials: "NC",
        av: "coral",
        text: "Amazing work!",
      });
      return d;
    });
  const del = (i) =>
    onChange((d) => {
      d.reviews.splice(i, 1);
      return d;
    });

  return (
    <div>
      <div className="ad-section-title">Reviews / Testimonials</div>
      <div className="ad-section-sub">Edit client reviews.</div>
      <div className="ad-group">
        <div className="ad-group-label">Client Reviews</div>
        {reviews.map((r, i) => (
          <div className="rev-item" key={i}>
            {/* Header row: Name + City + Delete */}
            <div className="rev-item-header">
              <input
                type="text"
                value={r.name || ""}
                onChange={(e) => set(i, "name", e.target.value)}
                placeholder="Client Name"
              />
              <input
                type="text"
                value={r.loc || ""}
                onChange={(e) => set(i, "loc", e.target.value)}
                placeholder="City / Location"
              />
              <button className="gal-del-btn" onClick={() => del(i)}>
                ✕
              </button>
            </div>
            {/* Initials + Avatar colour row */}
            <div className="rev-meta-row">
              <div className="ad-field">
                <label>Initials</label>
                <input
                  type="text"
                  value={r.initials || ""}
                  onChange={(e) => set(i, "initials", e.target.value)}
                  placeholder="e.g. RC"
                  maxLength={3}
                />
              </div>
              <div className="ad-field">
                <label>Avatar Colour</label>
                <select
                  value={r.av || "coral"}
                  onChange={(e) => set(i, "av", e.target.value)}
                >
                  {["coral", "forest", "plum"].map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Review text */}
            <div className="ad-field" style={{ marginTop: ".4rem" }}>
              <label>Review Text</label>
              <textarea
                value={r.text || ""}
                onChange={(e) => set(i, "text", e.target.value)}
                placeholder="Write the client's review here…"
                style={{ minHeight: "80px" }}
              />
            </div>
          </div>
        ))}
        <button
          className="gal-add-btn"
          onClick={addReview}
          style={{ background: "var(--coral)", marginTop: ".5rem" }}
        >
          + Add New Review
        </button>
      </div>
    </div>
  );
}

/* ── CONTACT PANEL ── */
function ContactPanel({ data, onChange }) {
  const c = data.contact || {};
  const set = (key, val) =>
    onChange((d) => {
      d.contact[key] = val;
      return d;
    });
  return (
    <div>
      <div className="ad-section-title">Contact / CTA</div>
      <div className="ad-section-sub">
        Edit the call-to-action section and contact info.
      </div>
      <div className="ad-group">
        <div className="ad-group-label">CTA Content</div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Section Label</label>
            <input
              type="text"
              value={c.label || ""}
              onChange={(e) => set("label", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row">
          <div className="ad-field">
            <label>Heading Line 1</label>
            <input
              type="text"
              value={c.h1 || ""}
              onChange={(e) => set("h1", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Heading Line 2 (italic)</label>
            <input
              type="text"
              value={c.h2 || ""}
              onChange={(e) => set("h2", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Subtitle</label>
            <textarea
              value={c.sub || ""}
              onChange={(e) => set("sub", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Contact Details</div>
        <div className="ad-row">
          <div className="ad-field">
            <label>Phone Number</label>
            <input
              type="text"
              value={c.phone || ""}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 83100 74733"
            />
          </div>
          <div className="ad-field">
            <label>WhatsApp Number (digits only)</label>
            <input
              type="text"
              value={c.wa || ""}
              onChange={(e) => set("wa", e.target.value)}
              placeholder="918310074733"
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Email Address</label>
            <input
              type="email"
              value={c.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Contact Strip</div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Strip Heading</label>
            <input
              type="text"
              value={c.stripH || ""}
              onChange={(e) => set("stripH", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Strip Subtext</label>
            <input
              type="text"
              value={c.stripP || ""}
              onChange={(e) => set("stripP", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FOOTER PANEL ── */
function FooterPanel({ data, onChange }) {
  const f = data.footer || {};
  const set = (key, val) =>
    onChange((d) => {
      d.footer[key] = val;
      return d;
    });
  return (
    <div>
      <div className="ad-section-title">Footer</div>
      <div className="ad-section-sub">
        Edit footer links, tagline and social media URLs.
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Brand</div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Tagline / Description</label>
            <textarea
              value={f.tag || ""}
              onChange={(e) => set("tag", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row full">
          <div className="ad-field">
            <label>Copyright Line</label>
            <input
              type="text"
              value={f.copy || ""}
              onChange={(e) => set("copy", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="ad-group">
        <div className="ad-group-label">Social Links</div>
        <div className="ad-row">
          <div className="ad-field">
            <label>Instagram URL</label>
            <input
              type="text"
              value={f.ig || ""}
              onChange={(e) => set("ig", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Facebook URL</label>
            <input
              type="text"
              value={f.fb || ""}
              onChange={(e) => set("fb", e.target.value)}
            />
          </div>
        </div>
        <div className="ad-row">
          <div className="ad-field">
            <label>WhatsApp URL</label>
            <input
              type="text"
              value={f.wa || ""}
              onChange={(e) => set("wa", e.target.value)}
            />
          </div>
          <div className="ad-field">
            <label>Phone (tel: link)</label>
            <input
              type="text"
              value={f.ph || ""}
              onChange={(e) => set("ph", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const PANEL_COMPONENTS = {
  analytics: null, // handled separately below
  hero: HeroPanel,
  gallery: GalleryPanel,
  about: AboutPanel,
  services: ServicesPanel,
  process: ProcessPanel,
  reviews: ReviewsPanel,
  contact: ContactPanel,
  footer: FooterPanel,
};

export default function AdminDashboard({ show, data, onSave, onExit }) {
  const [activePanel, setActivePanel] = useState("analytics");
  const [localData, setLocalData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (show && data) {
      setLocalData(JSON.parse(JSON.stringify(data)));
      setIsDirty(false);
    }
  }, [show, data]);

  const handleChange = useCallback(
    (updater) => {
      setLocalData((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const finalData = updater(next);
        setIsDirty(true);
        return finalData;
      });
    },
    [],
  );

  const handleSave = () => {
    if (!localData) return;
    onSave(localData);
    setIsDirty(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!show || !localData) return null;

  const ActivePanelComponent = PANEL_COMPONENTS[activePanel];

  return (
    <>
      <div id="admin-dash" className="show" data-lenis-prevent>
        <div className="adash-topbar">
          <div className="adash-topbar-left">
            <button
              className="adash-menu-btn"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              ☰
            </button>
            <div className="adash-logo">
              <span>Wall</span>Art
            </div>
            <div className="adash-title">Admin Dashboard</div>
          </div>
          <div className="adash-topbar-right">
            {isDirty ? (
              <span
                style={{
                  fontSize: ".75rem",
                  color: "#E8A830",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  background: "rgba(232,168,48,.1)",
                  padding: ".4rem .8rem",
                  borderRadius: "100px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#E8A830",
                    boxShadow: "0 0 8px #E8A830",
                  }}
                />{" "}
                <span className="adash-status-text">Unsaved Changes</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: ".75rem",
                  color: "#7FB08C",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  background: "rgba(127,176,140,.1)",
                  padding: ".4rem .8rem",
                  borderRadius: "100px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 8px #4ade80",
                  }}
                />{" "}
                <span className="adash-status-text">All Changes Saved</span>
              </span>
            )}
            <button
              className="adash-save-btn"
              onClick={handleSave}
              style={{
                opacity: isDirty ? 1 : 0.65,
                cursor: isDirty ? "pointer" : "not-allowed",
              }}
              disabled={!isDirty}
            >
              💾 Save Changes
            </button>
            <button
              className="adash-exit-btn"
              onClick={() => {
                localStorage.removeItem("wallart_admin_logged_in");
                window.history.pushState({}, "", "/");
                onExit();
              }}
            >
              ← Logout
            </button>
          </div>
        </div>
        <div className="adash-body">
          {sidebarOpen && (
            <div
              className="adash-overlay show"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`adash-sidebar${sidebarOpen ? " open" : ""}`}>
            {PANELS.map((p) => (
              <div
                key={p.key}
                className={`adash-nav-item${activePanel === p.key ? " active" : ""}`}
                onClick={() => {
                  setActivePanel(p.key);
                  setSidebarOpen(false);
                }}
                id={`nav-${p.key}`}
              >
                <span className="adash-nav-icon">{p.icon}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
          <div className="adash-content">
            {activePanel === "analytics" ? (
              <AnalyticsPanel siteData={localData} />
            ) : (
              ActivePanelComponent && (
                <ActivePanelComponent
                  data={localData}
                  onChange={handleChange}
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className={`ad-toast ${showToast ? "show" : ""}`}>
        <span>✅</span> Changes Saved Successfully!
      </div>
    </>
  );
}
