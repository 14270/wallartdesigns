import { useState, useEffect, useCallback } from 'react';
import { getTotals, getLast7Days, getTopCategories, getAnalytics, clearAnalytics } from '../../hooks/useAnalytics';

/* ── Mini Bar Chart (pure SVG, no lib) ── */
function BarChart({ days }) {
  const W = 560, H = 160, PAD = 36, GAP = 10;
  const cols = days.length;
  const barW = (W - PAD * 2 - GAP * (cols - 1)) / cols;
  const maxVal = Math.max(...days.map((d) => d.visits), 1);

  const colors = { visits: '#E8603A', portfolio: '#E8A830', lightbox: '#7FB08C' };

  return (
    <svg viewBox={`0 0 ${W} ${H + 40}`} style={{ width: '100%', height: 'auto' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD + (1 - pct) * H;
        return (
          <g key={pct}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth="1" />
            <text x={PAD - 4} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,.25)">
              {Math.round(pct * maxVal)}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {days.map((d, i) => {
        const x = PAD + i * (barW + GAP);
        const visitH = (d.visits / maxVal) * H;
        const portfolioH = (d.portfolio / maxVal) * H;
        const lightboxH = (d.lightbox / maxVal) * H;
        return (
          <g key={i}>
            {/* Lightbox bar (back) */}
            <rect x={x} y={PAD + H - lightboxH} width={barW} height={lightboxH} fill={colors.lightbox} opacity=".6" rx="3" />
            {/* Portfolio bar */}
            <rect x={x} y={PAD + H - portfolioH} width={barW} height={portfolioH} fill={colors.portfolio} opacity=".8" rx="3" />
            {/* Visit bar (front) */}
            <rect x={x} y={PAD + H - visitH} width={barW} height={visitH} fill={colors.visits} rx="3" />
            {/* Day label */}
            <text x={x + barW / 2} y={PAD + H + 16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,.4)">{d.label}</text>
            {/* Value */}
            {d.visits > 0 && (
              <text x={x + barW / 2} y={PAD + H - visitH - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.6)">{d.visits}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Donut Chart (device split) ── */
function DonutChart({ mobile, desktop }) {
  const total = mobile + desktop || 1;
  const mobilePct = mobile / total;
  const R = 40, CX = 56, CY = 56;
  const circ = 2 * Math.PI * R;
  const mobileArc = circ * mobilePct;
  const desktopArc = circ * (1 - mobilePct);

  return (
    <svg viewBox="0 0 112 112" style={{ width: '112px', height: '112px', flexShrink: 0 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="16" />
      {/* Desktop arc */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#E8A830" strokeWidth="16"
        strokeDasharray={`${desktopArc} ${circ}`}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CY})`}
      />
      {/* Mobile arc */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#E8603A" strokeWidth="16"
        strokeDasharray={`${mobileArc} ${circ}`}
        strokeDashoffset={`${-desktopArc}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${CX} ${CY})`}
      />
      <text x={CX} y={CY - 6} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">{Math.round((1 - mobilePct) * 100)}%</text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.4)">Desktop</text>
    </svg>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, value, label, sub, color, trend }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a, #141414)',
      border: `1px solid ${color}33`,
      borderRadius: '16px', padding: '1.4rem 1.6rem',
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Glow accent */}
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: color, opacity: '.08', filter: 'blur(20px)' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.6rem' }}>
        <div style={{ fontSize: '1.6rem' }}>{icon}</div>
        {trend !== undefined && (
          <span style={{ fontSize: '.68rem', color: trend >= 0 ? '#4ade80' : '#f87171', background: trend >= 0 ? 'rgba(74,222,128,.12)' : 'rgba(248,113,113,.12)', padding: '.2rem .5rem', borderRadius: '100px', fontWeight: 600 }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 900, color, lineHeight: 1, marginBottom: '.25rem' }}>{value}</div>
      <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#ccc', marginBottom: '.15rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '.72rem', color: '#555' }}>{sub}</div>}
    </div>
  );
}

/* ── Activity Item ── */
function ActivityItem({ item }) {
  const icons = { visit: '👁', portfolio: '🖼', lightbox: '🔍' };
  const colors = { visit: '#E8603A', portfolio: '#E8A830', lightbox: '#7FB08C' };
  const timeStr = new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.6rem 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `${colors[item.type]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', flexShrink: 0 }}>
        {icons[item.type] || '•'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '.8rem', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
        <div style={{ fontSize: '.68rem', color: '#444' }}>{dateStr} · {timeStr}</div>
      </div>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[item.type] || '#555', flexShrink: 0 }} />
    </div>
  );
}

/* ── Category Bar ── */
function CategoryBar({ cat, count, max, categories }) {
  const pct = max ? (count / max) * 100 : 0;
  const label = (categories || {})[cat] || cat;
  return (
    <div style={{ marginBottom: '.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.3rem' }}>
        <span style={{ fontSize: '.78rem', color: '#bbb', textTransform: 'capitalize' }}>{label}</span>
        <span style={{ fontSize: '.72rem', color: '#E8A830', fontWeight: 700 }}>{count}</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #E8603A, #E8A830)', borderRadius: '3px', transition: 'width .8s ease' }} />
      </div>
    </div>
  );
}

/* ── Main Analytics Panel ── */
export default function AnalyticsPanel({ siteData }) {
  const [totals, setTotals] = useState(null);
  const [days, setDays] = useState([]);
  const [topCats, setTopCats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setTotals(getTotals(siteData));
    setDays(getLast7Days());
    setTopCats(getTopCategories(8));
    const a = getAnalytics();
    setActivity(a.recentActivity || []);
    setTimeout(() => setIsRefreshing(false), 400);
  }, [siteData]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleClear = () => {
    if (confirmClear) {
      clearAnalytics();
      refresh();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  if (!totals) return null;

  const maxCat = topCats.length ? topCats[0].count : 1;
  const totalDevice = (totals.deviceTypes?.mobile || 0) + (totals.deviceTypes?.desktop || 0);
  const mobilePct = totalDevice ? Math.round(((totals.deviceTypes?.mobile || 0) / totalDevice) * 100) : 0;

  // Compute today's visits for "today" badge
  const todayVisits = days[days.length - 1]?.visits || 0;
  const yesterdayVisits = days[days.length - 2]?.visits || 0;
  const visitTrend = yesterdayVisits ? Math.round(((todayVisits - yesterdayVisits) / yesterdayVisits) * 100) : 0;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '.3rem' }}>
            📊 Analytics Overview
          </div>
          <div style={{ fontSize: '.8rem', color: '#555' }}>
            Real-time insights — tracking since {totals.firstVisit ? new Date(totals.firstVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'now'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <button onClick={refresh} disabled={isRefreshing} style={{ background: 'rgba(232,96,58,.12)', border: '1px solid rgba(232,96,58,.3)', color: '#E8603A', borderRadius: '8px', padding: '.45rem .9rem', fontSize: '.75rem', cursor: isRefreshing ? 'default' : 'pointer', fontFamily: 'inherit', fontWeight: 600, opacity: isRefreshing ? 0.8 : 1, transition: 'all 0.2s' }}>
            <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease-out' }}>↻</span> Refresh
          </button>
          <button onClick={handleClear} style={{ background: confirmClear ? 'rgba(255,80,80,.2)' : 'rgba(255,255,255,.05)', border: '1px solid rgba(255,80,80,.25)', color: confirmClear ? '#ff8080' : '#666', borderRadius: '8px', padding: '.45rem .9rem', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
            {confirmClear ? '⚠ Confirm Clear?' : '🗑 Clear Data'}
          </button>
        </div>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard
          icon="👥"
          value={totals.totalVisitors.toLocaleString()}
          label="Total Visitors"
          sub={`${todayVisits} today · ${totals.uniqueSessions} sessions`}
          color="#E8603A"
          trend={visitTrend}
        />
        <StatCard
          icon="🖼️"
          value={totals.portfolioExplorations.toLocaleString()}
          label="Portfolio Explorations"
          sub="Category filter clicks"
          color="#E8A830"
        />
        <StatCard
          icon="📸"
          value={totals.uploadedImages.toLocaleString()}
          label="Images Uploaded"
          sub={`Across gallery, hero & services`}
          color="#7FB08C"
        />
        <StatCard
          icon="🎨"
          value={totals.galleryItems.toLocaleString()}
          label="Gallery Artworks"
          sub="Total portfolio items"
          color="#9B7FD4"
        />
      </div>

      {/* ── Bar Chart + Device Split ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem', marginBottom: '1rem' }}>
        {/* Chart */}
        <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px', padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '.5rem' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#fff' }}>7-Day Traffic</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[['#E8603A','Visitors'],['#E8A830','Portfolio'],['#7FB08C','Lightbox']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />
                  <span style={{ fontSize: '.68rem', color: '#666' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart days={days} />
          {days.every((d) => d.visits === 0) && (
            <div style={{ textAlign: 'center', color: '#444', fontSize: '.8rem', marginTop: '.5rem' }}>
              No visitor data yet — data appears as people browse the website
            </div>
          )}
        </div>

        {/* Device split */}
        <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px', padding: '1.4rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Device Split</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <DonutChart mobile={totals.deviceTypes?.mobile || 0} desktop={totals.deviceTypes?.desktop || 0} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.2rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#E8A830' }} />
                  <span style={{ fontSize: '.75rem', color: '#aaa' }}>Desktop</span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#E8A830', fontFamily: 'Playfair Display' }}>{100 - mobilePct}%</div>
                <div style={{ fontSize: '.68rem', color: '#555' }}>{totals.deviceTypes?.desktop || 0} sessions</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.2rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#E8603A' }} />
                  <span style={{ fontSize: '.75rem', color: '#aaa' }}>Mobile</span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#E8603A', fontFamily: 'Playfair Display' }}>{mobilePct}%</div>
                <div style={{ fontSize: '.68rem', color: '#555' }}>{totals.deviceTypes?.mobile || 0} sessions</div>
              </div>
            </div>
          </div>
          {totalDevice === 0 && (
            <div style={{ fontSize: '.72rem', color: '#444', textAlign: 'center', marginTop: '.5rem' }}>No device data yet</div>
          )}
        </div>
      </div>

      {/* ── Top Categories + Activity Feed ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Top Categories */}
        <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px', padding: '1.4rem' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            🏆 Top Portfolio Categories
          </div>
          {topCats.length === 0 ? (
            <div style={{ color: '#444', fontSize: '.8rem', textAlign: 'center', padding: '1.5rem 0' }}>No portfolio clicks yet</div>
          ) : (
            topCats.map((c) => (
              <CategoryBar key={c.cat} cat={c.cat} count={c.count} max={maxCat} categories={siteData?.categories} />
            ))
          )}
        </div>

        {/* Activity Feed */}
        <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px', padding: '1.4rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '.8rem' }}>
            ⚡ Recent Activity
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
            {activity.length === 0 ? (
              <div style={{ color: '#444', fontSize: '.8rem', textAlign: 'center', padding: '1.5rem 0' }}>No activity recorded yet</div>
            ) : (
              activity.map((item, i) => <ActivityItem key={i} item={item} />)
            )}
          </div>
        </div>
      </div>

      {/* ── Image Upload Summary ── */}
      <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: '16px', padding: '1.4rem' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          📁 Upload Summary
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            {
              label: 'Gallery Images',
              value: (siteData?.gallery || []).filter((g) => g.imgUrl).length,
              total: (siteData?.gallery || []).length,
              color: '#E8603A',
              icon: '🖼',
            },
            {
              label: 'Hero Card Images',
              value: (siteData?.hero?.cards || []).reduce((s, c) => s + (c.images || []).length, 0),
              total: (siteData?.hero?.cards || []).length,
              color: '#E8A830',
              icon: '🏠',
            },
            {
              label: 'Service Images',
              value: (siteData?.services || []).filter((s) => s.imgUrl).length,
              total: (siteData?.services || []).length,
              color: '#7FB08C',
              icon: '⚡',
            },
            {
              label: 'Total Uploaded',
              value: totals.uploadedImages,
              total: null,
              color: '#9B7FD4',
              icon: '📸',
            },
          ].map((item) => (
            <div key={item.label} style={{ background: '#141414', borderRadius: '12px', padding: '1rem', border: `1px solid ${item.color}22` }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '.4rem' }}>{item.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: item.color }}>{item.value}</div>
              {item.total !== null && (
                <div style={{ fontSize: '.68rem', color: '#555', marginBottom: '.2rem' }}>of {item.total} total</div>
              )}
              <div style={{ fontSize: '.72rem', color: '#888' }}>{item.label}</div>
              {item.total !== null && (
                <div style={{ marginTop: '.5rem', height: '4px', background: 'rgba(255,255,255,.05)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${item.total ? (item.value / item.total) * 100 : 0}%`, background: item.color, borderRadius: '2px' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
