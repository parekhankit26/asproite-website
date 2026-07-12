import { useEffect } from 'react';

const SITE_NAME = 'Asproite Cloud and Consultancy';
const BASE_URL = 'https://asproite.com';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(path) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', `${BASE_URL}${path}`);
}

// Sets per-page <title>, meta description, and Open Graph tags on mount —
// the site is a client-rendered SPA with a single static index.html, so
// each page has to push its own tags into <head> at runtime for search
// engines and social previews to see distinct content per route.
export default function Seo({ title, description, path }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', `${BASE_URL}${path || ''}`, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    if (path) setCanonical(path);
  }, [title, description, path]);

  return null;
}
