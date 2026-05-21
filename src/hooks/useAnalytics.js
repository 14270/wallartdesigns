// ─── Analytics Storage Key ───
const KEY = 'wallart_analytics';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getSessionId() {
  let id = sessionStorage.getItem('wa_sid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('wa_sid', id);
  }
  return id;
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

function loadAnalytics() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveAnalytics(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

function initAnalytics() {
  const existing = loadAnalytics();
  if (existing) return existing;
  return {
    totalVisits: 0,
    uniqueSessions: [],
    daily: {},           // { 'YYYY-MM-DD': { visits: N, portfolio: N, lightbox: N } }
    categoryClicks: {},  // { bohemian: N, ... }
    deviceTypes: { mobile: 0, desktop: 0 },
    recentActivity: [],  // [{ time, type, label }]
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
  };
}

function addActivity(data, type, label) {
  const entry = { time: new Date().toISOString(), type, label };
  data.recentActivity = [entry, ...(data.recentActivity || [])].slice(0, 20);
}

function ensureDay(data, date) {
  if (!data.daily[date]) data.daily[date] = { visits: 0, portfolio: 0, lightbox: 0 };
}

// ─── Public API ───

export function trackVisit() {
  const data = initAnalytics();
  const sid = getSessionId();
  const d = today();
  ensureDay(data, d);

  // Only count once per session
  if (!data.uniqueSessions.includes(sid)) {
    data.uniqueSessions.push(sid);
    data.totalVisits = (data.totalVisits || 0) + 1;
    data.daily[d].visits += 1;
    const device = isMobile() ? 'mobile' : 'desktop';
    data.deviceTypes[device] = (data.deviceTypes[device] || 0) + 1;
    addActivity(data, 'visit', `New ${device} visitor`);
  }
  data.lastVisit = new Date().toISOString();
  saveAnalytics(data);
}

export function trackPortfolioClick(category) {
  const data = initAnalytics();
  const d = today();
  ensureDay(data, d);
  data.daily[d].portfolio = (data.daily[d].portfolio || 0) + 1;
  data.categoryClicks[category] = (data.categoryClicks[category] || 0) + 1;
  addActivity(data, 'portfolio', `Portfolio: ${category}`);
  saveAnalytics(data);
}

export function trackLightboxOpen(title) {
  const data = initAnalytics();
  const d = today();
  ensureDay(data, d);
  data.daily[d].lightbox = (data.daily[d].lightbox || 0) + 1;
  addActivity(data, 'lightbox', `Viewed: ${title}`);
  saveAnalytics(data);
}

export function getAnalytics() {
  return initAnalytics();
}

export function clearAnalytics() {
  localStorage.removeItem(KEY);
}

// ─── Computed helpers ───

export function getLast7Days() {
  const data = loadAnalytics() || initAnalytics();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = data.daily[key] || { visits: 0, portfolio: 0, lightbox: 0 };
    result.push({ date: key, label, ...day });
  }
  return result;
}

export function getTopCategories(limit = 6) {
  const data = loadAnalytics() || initAnalytics();
  return Object.entries(data.categoryClicks || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat, count]) => ({ cat, count }));
}

export function getTotals(siteData) {
  const data = loadAnalytics() || initAnalytics();

  // Count uploaded images
  let uploadedImages = 0;
  const gallery = siteData?.gallery || [];
  gallery.forEach((g) => { if (g.imgUrl) uploadedImages++; });
  const cards = siteData?.hero?.cards || [];
  cards.forEach((c) => { uploadedImages += (c.images || []).length; });
  const services = siteData?.services || [];
  services.forEach((s) => { if (s.imgUrl) uploadedImages++; });

  // Total portfolio clicks (all time)
  const portfolioTotal = Object.values(data.daily || {})
    .reduce((sum, d) => sum + (d.portfolio || 0), 0);

  return {
    totalVisitors: data.totalVisits || 0,
    uniqueSessions: (data.uniqueSessions || []).length,
    portfolioExplorations: portfolioTotal,
    uploadedImages,
    galleryItems: gallery.length,
    deviceTypes: data.deviceTypes || { mobile: 0, desktop: 0 },
    lastVisit: data.lastVisit || null,
    firstVisit: data.firstVisit || null,
    recentActivity: data.recentActivity || [],
  };
}
