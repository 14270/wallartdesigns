# WallArt Designs — React App

A complete conversion of the WallArt Designs website from a single HTML file to a full React project, preserving every design element, color token, animation, and admin dashboard feature.

## 🎨 Design System

- **Cream** `#FDF6EC` — background
- **Coral** `#E8603A` — primary accent
- **Forest** `#1A3328` — dark green sections
- **Gold** `#E8A830` — highlights
- **Fonts**: Playfair Display (headings) + Plus Jakarta Sans (body)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
```

## 🔑 Admin Dashboard

Click the **🔑 Admin** button in the nav.

- **Username:** `admin`
- **Password:** `wallart2026`

### Admin Features
- **Hero** — Edit badge, headline, subtitle, stats, and 3 independent card sliders with image upload
- **Gallery** — Add/remove/edit artworks, manage categories, upload images
- **About** — Edit text content and statistics
- **Services** — Edit all 6 service cards (icon, title, description, style, image)
- **Process** — Edit 4-step process cards
- **Reviews** — Add/remove/edit client testimonials
- **Contact** — Edit CTA section, phone, WhatsApp, email
- **Footer** — Edit tagline, social links, copyright

All data is persisted in **IndexedDB** (with localStorage fallback) so edits survive page refreshes.

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component
├── index.jsx                  # Entry point
├── data/
│   └── defaultData.js         # Default site content
├── hooks/
│   └── useStorage.js          # IndexedDB persistence hook
├── styles/
│   └── globals.css            # All CSS (design tokens, layout, responsive)
└── components/
    ├── Cursor.jsx              # Custom cursor
    ├── Nav.jsx                 # Navigation
    ├── Hero.jsx                # Hero section with card sliders
    ├── Sections.jsx            # Marquee, Gallery, About, Services, Process, Testimonials, CTA, ContactStrip, Footer, WhatsAppFab
    ├── Lightbox.jsx            # Gallery lightbox
    └── admin/
        ├── AdminModal.jsx      # Login modal
        └── AdminDashboard.jsx  # Full admin dashboard with all panels
```

## ✨ Features Preserved from Original HTML

- Custom animated cursor with hover effects
- Hero section with 3 independent image sliders (auto-play, dots, swipe)
- Parallax blob animations on mousemove
- Scroll reveal animations (IntersectionObserver)
- Gallery masonry with category filter tabs
- Lightbox with keyboard navigation and touch swipe
- Service card 3D tilt hover
- Marquee ticker animation
- Full admin dashboard (dark theme) with image upload
- IndexedDB persistence for all admin edits
- Fully responsive (mobile → 1400px+)
- Floating WhatsApp FAB button
