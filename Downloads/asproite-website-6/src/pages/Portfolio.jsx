import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, SectionHeader, CTABox } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

const portfolioFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Development' },
  { value: 'cloud', label: 'Cloud & AI' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'design', label: 'Design' },
  { value: 'it', label: 'IT Infrastructure' },
];

export default function Portfolio() {
  const { data } = useSiteData();
  const portfolioProjects = data?.portfolio || [];
  const testimonials = data?.testimonials || [];
  useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? portfolioProjects
      : portfolioProjects.filter(p => p.category === activeFilter),
    [activeFilter]
  );

  return (
    <>
      <style>{`
        @keyframes scanLines { from{background-position:0 0} to{background-position:0 4px} }
      `}</style>

      <PageHeader title="Our" titleAccent="Portfolio" breadcrumb="Portfolio" subtitle="A selection of projects showcasing our expertise across web development, cloud solutions, AI, mobile apps, and more.">
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,212,255,0.015) 2px,rgba(0,212,255,0.015) 4px)', pointerEvents: 'none' }} />
        <div className="page-header-bg" />
        <div className="page-header-grid" />
      </PageHeader>

      {/* STATS BAR */}
      <div style={{ padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
            {[['80+','Projects Delivered'],['500+','Satisfied Clients'],['12','Industry Sectors'],['99%','Client Retention']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--cyan)' }}>{n}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS */}
      <section style={{ padding: '80px 0 100px' }}>
        <div className="container">
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 56, justifyContent: 'center' }}>
            {portfolioFilters.map(f => (
              <button key={f.value} onClick={() => setActiveFilter(f.value)}
                style={{ background: activeFilter === f.value ? 'rgba(0,212,255,0.1)' : 'var(--bg2)', border: `1px solid ${activeFilter === f.value ? 'var(--cyan)' : 'var(--border)'}`, borderRadius: 100, padding: '9px 22px', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.06em', color: activeFilter === f.value ? 'var(--cyan)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                No projects found in this category.
              </div>
            )}
          </div>

          {/* Count */}
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem', marginTop: 32 }}>
            Showing {filtered.length} of {portfolioProjects.length} projects
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionHeader label="Client Feedback" title="What Clients" titleAccent="Say" center />
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`reveal d${i}`} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ fontSize: '2.5rem', color: 'var(--cyan)', opacity: 0.3, lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia,serif' }}>"</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.88rem', fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox label="Start a Project" title="Your Project Could Be" titleAccent="Next" subtitle="Ready to build something extraordinary? Let's talk about your goals and how we can help." primaryText="Start a Conversation →" primaryTo="/contact" ghostText="Our Services" ghostTo="/services" />
    </>
  );
}

function ProjectCard({ project }) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', position: 'relative', transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.6)'; e.currentTarget.querySelector('.proj-overlay').style.opacity = '1'; e.currentTarget.querySelector('.proj-emoji').style.transform = 'scale(1.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.querySelector('.proj-overlay').style.opacity = '0'; e.currentTarget.querySelector('.proj-emoji').style.transform = ''; }}>
      
      {/* Thumb */}
      <div style={{ aspectRatio: '16/10', position: 'relative', overflow: 'hidden', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center,rgba(0,212,255,0.08) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)' }} />
        <span className="proj-emoji" style={{ fontSize: project.featured ? '6rem' : '4rem', transition: 'transform 0.4s', position: 'relative', zIndex: 1 }}>{project.icon}</span>
        <div className="proj-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,212,255,0.06)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <button style={{ background: 'var(--bg2)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '10px 22px', borderRadius: 4, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>View Project</button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '24px 26px' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan)', background: 'rgba(0,212,255,0.07)', border: '1px solid var(--border)', borderRadius: 100, padding: '3px 10px' }}>{t}</span>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{project.title}</div>
        <div style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.65 }}>{project.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{project.year}</span>
          <span style={{ color: 'var(--cyan)', fontSize: '1.1rem', transition: 'transform 0.2s' }}>→</span>
        </div>
      </div>
    </div>
  );
}
