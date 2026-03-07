import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteData } from './api.js';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    const d = await fetchSiteData();
    setData(d);
    setLoading(false);
  };

  useEffect(() => {
    reload();
    // Listen for storage changes (when admin saves)
    const onStorage = () => reload();
    window.addEventListener('storage', onStorage);
    window.addEventListener('asproite_data_updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('asproite_data_updated', onStorage);
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ data, loading, reload }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
