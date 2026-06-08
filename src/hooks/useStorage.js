import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from '../data/defaultData';

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

/* ── IndexedDB helpers ── */
const DB_NAME    = 'wallart-db';
const STORE_NAME = 'site-data';
const DATA_KEY   = 'main';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = ()  => reject(req.error);
  });
}

async function loadFromIDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(DATA_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror   = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveToIDB(data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, DATA_KEY);
      tx.oncomplete = resolve;
      tx.onerror    = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB save failed:', e);
  }
}

/* ── Optional server sync (when Express is running) ── */
async function syncToServer(data) {
  try {
    await fetch('/api/data', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
  } catch {
    // Express not running — that's fine, IDB is the source of truth
  }
}

async function loadFromServer() {
  try {
    const res = await fetch(`/api/data?t=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return (data && typeof data === 'object') ? data : null;
  } catch {
    return null;
  }
}

/* ── Main hook ── */
export function useStorage() {
  const [siteData, setSiteData] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function init() {
      // 1. Try IndexedDB first (always fast, always available)
      let saved = await loadFromIDB();

      // 2. If IDB is empty, try the Express server (production / first run)
      if (!saved) {
        saved = await loadFromServer();
        // If server had data, immediately persist it into IDB
        if (saved) await saveToIDB(saved);
      }

      // 3. Merge any missing defaults then set state
      if (saved) {
        if (!saved.categories || !Object.keys(saved.categories).length) {
          saved.categories = deepClone(DEFAULT_DATA.categories);
        }
        setSiteData(saved);
      } else {
        const defaults = deepClone(DEFAULT_DATA);
        setSiteData(defaults);
        await saveToIDB(defaults);
      }

      setLoading(false);
    }

    init();
  }, []);

  const persist = useCallback((updater) => {
    setSiteData((prev) => {
      const next = typeof updater === 'function' ? updater(deepClone(prev)) : updater;

      // Save to IndexedDB immediately (primary, always works)
      saveToIDB(next);

      // Also try to sync to Express server in background (secondary)
      syncToServer(next);

      return next;
    });
  }, []);

  return { siteData, setSiteData: persist, loading };
}
