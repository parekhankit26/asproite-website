import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSiteData } from './api.js';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const d = await fetchSiteData();
    setData(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();

    // Same-tab: fires when admin saves
    window.addEventListener('asproite_data_updated', reload);

    // Cross-tab: BroadcastChannel is reliable across tabs on same origin
    let channel = null;
    try {
      channel = new BroadcastChannel('asproite_updates');
      channel.onmessage = () => reload();
    } catch(e) {
      // Fallback for browsers without BroadcastChannel
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

export function useSiteData() {
  return useContext(SiteDataContext);
}
