import { useState, useEffect } from 'react';

const CREDS = { user: 'admin', pass: 'wallart2026' };

export default function AdminModal({ show, onClose, onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (show) { setUser(''); setPass(''); setErr(false); }
  }, [show]);

  const doLogin = () => {
    if (user === CREDS.user && pass === CREDS.pass) {
      localStorage.setItem('wallart_admin_logged_in', 'true');
      onClose();
      onLogin();
    } else {
      setErr(true);
      setPass('');
    }
  };

  if (!show) return null;

  return (
    <div id="admin-modal" className="show">
      <div className="aml-box">
        <div className="aml-logo"><span>Wall</span>Art Designs</div>
        <div className="aml-sub">ADMIN ACCESS</div>
        {err && <p className="aml-err" style={{ display: 'block' }}>Invalid credentials. Please try again.</p>}
        <label className="aml-label">Username</label>
        <input className="aml-input" type="text" placeholder="Enter username" autoComplete="off"
          value={user} onChange={(e) => setUser(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') document.querySelector('.aml-input[type=password]')?.focus(); }}
        />
        <label className="aml-label">Password</label>
        <input className="aml-input" type="password" placeholder="Enter password"
          value={pass} onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doLogin(); }}
        />
        <button className="aml-btn" onClick={doLogin}>Login to Dashboard</button>
        <button className="aml-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
