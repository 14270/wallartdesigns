import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from '../data/defaultData';

const DB_NAME = 'wallartDB';
const STORE_KEY = 'wallartSiteData';

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('store')) {
        db.createObjectStore('store', { keyPath: 'k' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject();
  });
}

async function loadFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('store', 'readonly');
      const req = tx.objectStore('store').get(STORE_KEY);
      req.onsuccess = (e) => {
        try {
          const val = e.target.result?.v ? JSON.parse(e.target.result.v) : null;
          resolve(val);
        } catch { resolve(null); }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch { return null; }
  }
}

async function saveToDB(data) {
  try {
    const db = await openDB();
    const tx = db.transaction('store', 'readwrite');
    tx.objectStore('store').put({ k: STORE_KEY, v: JSON.stringify(data) });
  } catch {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
  }
}

export function useStorage() {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromDB().then((saved) => {
      if (saved) {
        // merge categories
        if (!saved.categories || !Object.keys(saved.categories).length) {
          saved.categories = deepClone(DEFAULT_DATA.categories);
        }
        setSiteData(saved);
      } else {
        setSiteData(deepClone(DEFAULT_DATA));
      }
      setLoading(false);
    });
  }, []);

  const persist = useCallback((updater) => {
    setSiteData((prev) => {
      const next = typeof updater === 'function' ? updater(deepClone(prev)) : updater;
      saveToDB(next);
      return next;
    });
  }, []);

  return { siteData, setSiteData: persist, loading };
}
