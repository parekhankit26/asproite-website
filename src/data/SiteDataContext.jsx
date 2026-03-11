import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchSiteData } from './api.js';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  // Guard: prevent multiple simultaneous fetches
  const fetching = useRef(false);

  const reload = useCallback(async () => {
    if (fetching.current) return; // already fetching — skip
    fetching.current = true;
    try {
      const d = await fetchSiteData();
      setData(d);
      setLoading(false);
    } catch(e) {
      setLoading(false);
    } finally {
      fetching.current = false;
    }
  }, []);

  useEffect(() => {
    reload();

    // Listen for admin saves — reload data once
    window.addEventListener('asproite_data_updated', reload);

    // Cross-tab sync
    let channel = null;
    try {
      channel = new BroadcastChannel('asproite_updates');
      channel.onmessage = () => reload();
    } catch(e) {
      const onStorage = (e) => { if (e.key === 'asproite_db') reload(); };
      window.addEventListener('storage', onStorage);
      return () => {
        window.removeEventListener('asproite_data_updated', reload);
        window.removeEventListener('storage', onStorage);
      };
    }

    return () => {
      window.removeEventListener('asproite_data_updated', reload);
      if (channel) channel.close();
    };
  }, [reload]);

  return (
    <SiteDataContext.Provider value={{ data, loading, reload }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() { return useContext(SiteDataContext); }
