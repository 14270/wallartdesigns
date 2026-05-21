import { useState, useEffect } from 'react';
import './styles/globals.css';
import Lenis from 'lenis';
import { useStorage } from './hooks/useStorage';
import { trackVisit, trackPortfolioClick, trackLightboxOpen } from './hooks/useAnalytics';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { Marquee, Gallery, About, Services, Process, Testimonials, CTA, ContactStrip, Footer, WhatsAppFab } from './components/Sections';
import Lightbox from './components/Lightbox';
import AdminModal from './components/admin/AdminModal';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { siteData, setSiteData, loading } = useStorage();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminDashOpen, setAdminDashOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, id: null, items: [] });

  useEffect(() => {
    trackVisit();
    if (window.location.pathname === '/admin') {
      if (localStorage.getItem('wallart_admin_logged_in') === 'true') {
        setAdminDashOpen(true);
      } else {
        setAdminModalOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = (adminDashOpen || lightbox.open) ? 'hidden' : '';
    if (window.lenis) {
      if (adminDashOpen || lightbox.open) {
        window.lenis.stop();
      } else {
        window.lenis.start();
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [adminDashOpen, lightbox.open]);

  const openLightbox = (id, items) => {
    const item = items.find((i) => i.id === id);
    if (item) trackLightboxOpen(item.title);
    setLightbox({ open: true, id, items });
  };
  const closeLightbox = () => setLightbox({ open: false, id: null, items: [] });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#E8603A' }}>
          <span style={{ color: '#E8603A' }}>Wall</span>Art Designs
        </div>
      </div>
    );
  }

  const sd = siteData || {};

  return (
    <>
      <Cursor />
      <AdminModal
        show={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onLogin={() => setAdminDashOpen(true)}
      />
      <AdminDashboard
        show={adminDashOpen}
        data={sd}
        onSave={(newData) => setSiteData(newData)}
        onExit={() => setAdminDashOpen(false)}
      />
      {!adminDashOpen && (
        <>
          <Nav contact={sd.contact} />
          <Hero hero={sd.hero} />
          <Marquee />
          <Gallery
            gallery={sd.gallery}
            categories={sd.categories}
            onOpenLightbox={openLightbox}
            onCategoryClick={trackPortfolioClick}
          />
          <About about={sd.about} contact={sd.contact} />
          <Services services={sd.services} />
          <Process process={sd.process} />
          <Testimonials reviews={sd.reviews} />
          <CTA contact={sd.contact} />
          <ContactStrip contact={sd.contact} />
          <Footer footer={sd.footer} contact={sd.contact} />
          <WhatsAppFab wa={sd.contact?.wa} />
          {lightbox.open && (
            <Lightbox
              items={lightbox.items}
              initialId={lightbox.id}
              categories={sd.categories}
              onClose={closeLightbox}
            />
          )}
        </>
      )}
    </>
  );
}
