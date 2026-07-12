import { Link, useParams } from 'react-router-dom';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';
import Seo from '../components/Seo.jsx';

function IndustryCard({ industry }) {
  return (
    <Link to={`/industries/${industry.slug}`} className="reveal" style={{
      display: 'block', textDecoration: 'none',
      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
      padding: 32, transition: 'border-color 0.3s, transform 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
      <div style={{ fontSize: '2rem', marginBottom: 16 }}>{industry.icon}</div>
      <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{industry.name}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>{industry.heroSubtitle}</p>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cyan)' }}>See how we help →</span>
    </Link>
  );
}

export function IndustriesIndex() {
  const { data } = useSiteData();
  const ip = data?.industriesPage || {};
  const industries = data?.industries || [];
  useScrollReveal();

  return (
    <>
      <Seo
        title={`${ip.pageTitle || 'IT Solutions Built for'} ${ip.pageTitleAccent || 'Your Industry'}`}
        description={ip.subtitle || "See how Asproite solves the specific IT challenges facing your industry — healthcare, financial services, retail, and more."}
        path="/industries"
      />
      <PageHeader
        title={ip.pageTitle || 'IT Solutions Built for'}
        titleAccent={ip.pageTitleAccent || 'Your Industry'}
        breadcrumb="Industries"
        subtitle={ip.subtitle || "Generic IT advice doesn't cut it. See how Asproite solves the specific challenges facing your sector."} />

      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionHeader
              label={ip.sectionLabel || 'Industries We Serve'}
              title={ip.sectionTitle || 'Specialised'}
              titleAccent={ip.sectionTitleAccent || 'Expertise'}
              center />
          </div>
          {industries.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="industries-grid">
              {industries.map(ind => <IndustryCard key={ind.id || ind.slug} industry={ind} />)}
            </div>
          ) : (
            <div className="reveal" style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
              Industry pages are being added soon — check back shortly.
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{
            background: 'linear-gradient(135deg,rgba(0,212,255,0.05) 0%,rgba(11,16,25,0.9) 60%)',
            border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 56,
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
          }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 14 }}>{ip.ctaLabel || 'Not Seeing Your Industry?'}</div>
            <h2 style={{ marginBottom: 14 }}>{ip.ctaTitle || 'We Work With'} <em>{ip.ctaTitleAccent || 'Every Sector'}</em></h2>
            <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
              {ip.ctaSubtitle || "Don't see your industry listed — we still want to hear from you. Get in touch and we'll show you how we can help."}
            </p>
            <Link to="/contact" className="btn-primary">Get In Touch →</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) { .industries-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .industries-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

export function IndustryDetail() {
  const { slug } = useParams();
  const { data } = useSiteData();
  const industries = data?.industries || [];
  const industry = industries.find(i => i.slug === slug);
  useScrollReveal();

  if (!industry) {
    return (
      <>
        <Seo title="Industry Not Found" description="This industry page could not be found." path={`/industries/${slug || ''}`} />
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px' }}>
          <h2 style={{ marginBottom: 16 }}>Industry Page Not Found</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 420, lineHeight: 1.7 }}>We couldn't find that industry page. See all the industries we work with instead.</p>
          <Link to="/industries" className="btn-primary">View All Industries →</Link>
        </div>
      </>
    );
  }

  const painPoints = industry.painPoints || [];
  const services = industry.relevantServices || [];

  return (
    <>
      <Seo
        title={`${industry.heroTitle} ${industry.heroTitleAccent}`}
        description={industry.metaDescription}
        path={`/industries/${industry.slug}`}
      />
      <PageHeader
        title={industry.heroTitle}
        titleAccent={industry.heroTitleAccent}
        breadcrumb={industry.name}
        subtitle={industry.heroSubtitle} />

      {/* PAIN POINTS */}
      {painPoints.length > 0 && (
        <section style={{ padding: '100px 0' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
              <SectionHeader label="The Challenges" title="Problems We Solve" titleAccent={`for ${industry.name}`} center />
            </div>
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="painpoints-grid">
              {painPoints.map((p, i) => (
                <div key={i} className={`reveal d${i % 3}`} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                  padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <span style={{ color: 'var(--cyan)', fontSize: '1.1rem', flexShrink: 0 }}>◆</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELEVANT SERVICES */}
      {services.length > 0 && (
        <section style={{ padding: '0 0 100px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
              Relevant Services
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {services.map((s, i) => (
                <Link key={i} to="/services" style={{
                  textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, color: 'var(--cyan)',
                  border: '1px solid var(--cyan)', borderRadius: 100, padding: '8px 18px',
                  background: 'rgba(0,212,255,0.06)',
                }}>{s}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CASE STUDY + TESTIMONIAL */}
      {(industry.caseStudyTitle || industry.testimonialQuote) && (
        <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="reveal" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              {industry.caseStudyTitle && (
                <>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 12 }}>
                    Real Results
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 16 }}>{industry.caseStudyTitle}</h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 32 }}>{industry.caseStudyText}</p>
                </>
              )}
              {industry.testimonialQuote && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
                  <p style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text)', marginBottom: 16, lineHeight: 1.6 }}>
                    "{industry.testimonialQuote}"
                  </p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: 600 }}>{industry.testimonialName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{industry.testimonialRole}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{
            background: 'linear-gradient(135deg,rgba(0,212,255,0.05) 0%,rgba(11,16,25,0.9) 60%)',
            border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 56,
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: 14 }}>Ready to Talk <em>{industry.name}</em>?</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Tell us about your business and we'll show you exactly how Asproite can help.
            </p>
            <Link to="/contact" className="btn-primary">{industry.ctaText || 'Book a Consultation →'}</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .painpoints-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
