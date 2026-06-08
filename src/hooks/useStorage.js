import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_DATA } from '../data/defaultData';

function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

async function loadFromServer() {
  try {
    const res = await fetch(`/api/data?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') return data;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToServer(data) {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.error("Failed to save to server", e);
  }
}

export function useStorage() {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromServer().then((saved) => {
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
      saveToServer(next);
      return next;
    });
  }, []);

  return { siteData, setSiteData: persist, loading };
}
