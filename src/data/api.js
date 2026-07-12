// ═══════════════════════════════════════════════════════════════
// ASPROITE — DATA API
// ═══════════════════════════════════════════════════════════════

const DB_CACHE_KEY      = 'asproite_db';
const DB_CACHE_TIME_KEY = 'asproite_db_cachetime';
const CACHE_TTL_MS      = 60 * 1000; // 60 seconds

const GITHUB_OWNER  = 'parekhankit26';
const GITHUB_REPO   = 'asproite-website';
const GITHUB_FILE   = 'public/sitedata.json';
const GITHUB_BRANCH = 'main';
const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_FILE}`;

// ─── Defaults ─────────────────────────────────────────────────
function getDefaults() {
  return {
    siteInfo: {
      companyName: 'Asproite Cloud and Consultancy', tagline: 'Your End-to-End IT Partner',
      email: 'info@asproite.com', phone: '+44 (0)7555185061',
      londonAddress: 'Kingsland Road, London, E13 9PA', indiaAddress: 'Gotri Road, Vadodara, 390001',
      logo: '', description: 'Asproite delivers end-to-end IT solutions trusted by organisations across the UK for over 25 years.',
    },
    homePage: {
      heroTitle: 'Transform Your', heroTitleAccent: 'Digital Future',
      heroSubtitle: 'Asproite delivers end-to-end IT solutions — from cloud infrastructure and AI to hardware decommissioning. Trusted by organisations across the UK for over 25 years.',
      heroPrimaryText: 'Explore Services →', heroGhostText: 'View Portfolio',
      typingPhrases: ['UK IT Managed Service Provider','Cloud & AI Experts','25+ Years of Excellence','Hardware Decommissioning Experts'],
      heroStats: [{value:'25+',label:'Years Experience'},{value:'40+',label:'IT Services'},{value:'24/7',label:'Support'},{value:'500+',label:'Clients Served'}],
      aboutSectionLabel: 'About Asproite',
      aboutMiniStats: [{value:'25+',label:'Years Active'},{value:'40+',label:'Services'},{value:'500+',label:'Clients'},{value:'2',label:'Global Offices'}],
      aboutTitle: "The UK's Most Trusted", aboutTitleAccent: 'IT Partner',
      aboutText1: 'Welcome to Asproite Cloud and Consultancy — a dynamic IT solutions provider committed to delivering cutting-edge services that drive your business forward.',
      aboutText2: 'From IT support and software solutions to web development, mobile apps, AI strategies, and responsible hardware decommissioning — our experts craft innovative, scalable digital solutions.',
      aboutBullets: ['ISO-certified processes & wide-reaching technology accreditations','24/7 dedicated helpdesk and infrastructure monitoring','Offices in London, UK and Vadodara, India','Full lifecycle IT — procurement to decommissioning'],
      aboutPrimaryBtn: 'Learn About Us →', aboutGhostBtn: 'Get a Quote',
      servicesSectionLabel: 'What We Do', servicesSectionTitle: 'Our', servicesSectionTitleAccent: 'Core Services', servicesLinkText: 'All Services →',
      ctaLabel: 'Get Started', ctaTitle: 'Ready to', ctaTitleAccent: 'Elevate Your IT?',
      ctaSubtitle: 'Talk to our team today and discover how Asproite can modernise, secure, and scale your technology.',
      ctaPrimaryText: 'Get a Free Quote →', ctaGhostText: 'See Our Work',
    },
    aboutPage: {
      pageTitle: 'About', pageTitleAccent: 'Asproite',
      subtitle: "Over 25 years of delivering IT excellence across the UK. We're not just a service provider — we're your long-term technology partner.",
      missionIcon:'🎯', missionTitle:'Our Mission', missionText:'To empower businesses with cutting-edge, secure, and scalable IT solutions that drive real growth and digital transformation.',
      visionIcon:'👁️', visionTitle:'Our Vision', visionText:"To be the UK's most trusted technology partner, recognised for innovation, integrity, and measurable client success.",
      valuesIcon:'💎', valuesTitle:'Our Values', valuesText:'Excellence, transparency, and continuous improvement in everything we do — from strategy to responsible hardware disposal.',
      statsSectionLabel:'By the Numbers', statsSectionTitle:'Asproite in', statsSectionTitleAccent:'Numbers',
      coreValuesSectionLabel:'Core Values', coreValuesSectionTitle:'What We', coreValuesSectionTitleAccent:'Stand For',
      coreValues:[{id:1,icon:'⚡',title:'Agility',body:'We respond fast, adapt faster.'},{id:2,icon:'🔒',title:'Security',body:'Security-first mindset in every solution.'},{id:3,icon:'🌱',title:'Sustainability',body:'Responsible IT lifecycle management.'},{id:4,icon:'🤝',title:'Partnership',body:"We're partners invested in your long-term success."}],
      timelineSectionLabel:'Our Journey', timelineSectionTitle:'Years of', timelineSectionTitleAccent:'Innovation',
      teamSectionLabel:'Our People', teamSectionTitle:'Meet the', teamSectionTitleAccent:'Team',
      officesSectionLabel:'Our Offices', officesSectionTitle:'Where We', officesSectionTitleAccent:'Operate',
      ctaLabel:'Work With Us', ctaTitle:'Ready to', ctaTitleAccent:'Partner?',
      ctaSubtitle:"Let's talk about how Asproite can support your technology journey.", ctaPrimaryText:'Contact Us →', ctaGhostText:'Our Services',
    },
    servicesPage: {
      pageTitle:'Our', pageTitleAccent:'Services', subtitle:'9 specialised IT services covering every stage of your digital journey.',
      sectionLabel:'What We Offer', sectionTitle:'Complete', sectionTitleAccent:'IT Solutions',
      processSectionLabel:'How We Work', processSectionTitle:'Our', processSectionTitleAccent:'Process',
      processSteps:[{id:1,num:'01',title:'Discovery',body:'We deep-dive into your business needs.'},{id:2,num:'02',title:'Strategy',body:'Our experts craft a tailored IT roadmap.'},{id:3,num:'03',title:'Design',body:'Solutions are architected with security and scalability.'},{id:4,num:'04',title:'Delivery',body:'We execute on time, on budget.'},{id:5,num:'05',title:'Support',body:'24/7 ongoing support and optimisation.'}],
      whySectionLabel:'Why Asproite', whySectionTitle:'The Reasons Clients', whySectionTitleAccent:'Choose Us',
      whyText:"Over 25 years we've built a reputation on delivering what we promise.",
      whyPrimaryBtn:'Start a Project →', whyGhostBtn:'See Portfolio',
      whyCards:[{id:1,icon:'⚡',title:'24/7 Support',body:'Round-the-clock helpdesk.'},{id:2,icon:'🏆',title:'Certified',body:'Wide-reaching technology accreditations.'},{id:3,icon:'🌐',title:'Full Lifecycle',body:'Procurement to decommissioning.'},{id:4,icon:'🔒',title:'Security First',body:'Security baked into every solution.'}],
      ctaLabel:"Ready to Start?", ctaTitle:"Let's Build Something", ctaTitleAccent:'Remarkable',
      ctaSubtitle:"Tell us about your project and we'll put together a tailored proposal.", ctaPrimaryText:'Get a Free Quote →', ctaGhostText:'View Our Work',
    },
    portfolioPage: {
      pageTitle:'Our', pageTitleAccent:'Portfolio', subtitle:'A selection of projects showcasing our expertise.',
      statsBar:[{value:'80+',label:'Projects Delivered'},{value:'500+',label:'Satisfied Clients'},{value:'12',label:'Industry Sectors'},{value:'99%',label:'Client Retention'}],
      testimonialsSectionLabel:'Client Feedback', testimonialsSectionTitle:'What Clients', testimonialsSectionTitleAccent:'Say',
      ctaLabel:'Start a Project', ctaTitle:'Your Project Could Be', ctaTitleAccent:'Next',
      ctaSubtitle:"Ready to build something extraordinary? Let's talk.", ctaPrimaryText:'Start a Conversation →', ctaGhostText:'Our Services',
    },
    contactPage: {
      pageTitle:'Get in', pageTitleAccent:'Touch',
      subtitle:"Whether you have a project in mind or just want to learn more — our team is ready to help.",
      infoTitle:"Let's Start a", infoTitleAccent:'Conversation',
      infoCards:[{id:1,label:'Email',value:'info@asproite.com'},{id:2,label:'Phone',value:'+44 (0)7555185061'},{id:3,label:'Response Time',value:'Within 24 hours — usually much faster.'},{id:4,label:'London HQ',value:'Kingsland Road, London, E13 9PA'},{id:5,label:'Vadodara, India',value:'Gotri Road, Vadodara, 390001'}],
      formTitle:'Send Us a Message', formSubtitle:"Fill in the form below and we'll get back to you within 24 hours.",
      formSubmitText:'Send Message →', faqSectionLabel:'FAQs', faqSectionTitle:'Common', faqSectionTitleAccent:'Questions',
    },
    careersPage: {
      pageTitle:'Join Our', pageTitleAccent:'Team',
      subtitle:'Help us deliver exceptional IT solutions. Explore our open roles and grow your career with Asproite.',
      sectionLabel:'Open Positions', sectionTitle:'Current', sectionTitleAccent:'Openings',
      noOpeningsText:"We don't have any open positions right now, but we're always happy to hear from talented people. Send us your CV and we'll keep you in mind for future roles.",
      whySectionLabel:'Why Asproite', whySectionTitle:'Why Work', whySectionTitleAccent:'With Us',
      perks:[
        {id:1,icon:'💰',title:'Competitive Salary',body:'Market-leading pay with regular reviews.'},
        {id:2,icon:'🏥',title:'Health Cover',body:'Comprehensive private healthcare for you and your family.'},
        {id:3,icon:'🏡',title:'Flexible & Remote',body:'Hybrid and remote working options across all roles.'},
        {id:4,icon:'📚',title:'Learning Budget',body:'Annual budget for courses, certifications, and conferences.'},
        {id:5,icon:'🌴',title:'Generous Leave',body:'25+ days holiday plus bank holidays.'},
        {id:6,icon:'🚀',title:'Career Growth',body:'Clear progression paths and regular promotions.'},
      ],
      formTitle:'Apply Now', formSubtitle:"Fill in your details below and we'll be in touch within 5 working days.",
      formSubmitText:'Submit Application →',
      ctaLabel:'Get In Touch', ctaTitle:"Don't See a Role", ctaTitleAccent:'That Fits?',
      ctaSubtitle:"We're always on the lookout for great people. Send us a speculative application.",
    },
    industriesPage: {
      pageTitle:'IT Solutions Built for', pageTitleAccent:'Your Industry',
      subtitle:"Generic IT advice doesn't cut it. See how Asproite solves the specific challenges facing your sector.",
      sectionLabel:'Industries We Serve', sectionTitle:'Specialised', sectionTitleAccent:'Expertise',
      ctaLabel:'Not Seeing Your Industry?', ctaTitle:'We Work With', ctaTitleAccent:'Every Sector',
      ctaSubtitle:"Don't see your industry listed — we still want to hear from you. Get in touch and we'll show you how we can help.",
    },
    footer: {
      description:'Asproite Cloud and Consultancy — your end-to-end IT partner for over 25 years.',
      servicesHeading:'Services', companyHeading:'Company',
      serviceLinks:['Website Development','Software Solutions','IT Support','Cloud Services','AI Solutions','Hardware Decommissioning'],
      companyLinks:['About Us','Portfolio','Industries','Careers','Contact Us'],
      newsletterTitle:'Stay Updated', newsletterSubtitle:'Get the latest IT insights and news from Asproite.',
      linkedinUrl:'#', twitterUrl:'#', facebookUrl:'#', instagramUrl:'#',
      copyrightName:'Asproite Cloud and Consultancy Ltd',
    },
    stats:[{num:25,suffix:'+',label:'Years Experience'},{num:500,suffix:'+',label:'Clients Worldwide'},{num:40,suffix:'+',label:'IT Services'},{num:99,suffix:'%',label:'Client Satisfaction'}],
    services:[
      {id:1,icon:'🌐',title:'Website Development',tagline:'High-performance websites',description:'Bespoke, high-performance websites engineered for speed.',features:['Custom CMS solutions','Performance optimised','Responsive and SEO-ready'],category:'development',isNew:false},
      {id:2,icon:'⚙️',title:'Software Solutions',tagline:'Custom enterprise software',description:'Custom software development tailored to your workflows.',features:['Enterprise software development','API design & microservices','Legacy system modernisation'],category:'development',isNew:false},
      {id:3,icon:'🎨',title:'Web Design',tagline:'Award-winning UI/UX',description:'Strategically crafted user experiences.',features:['UI/UX design & prototyping','Brand identity & design systems','User research & usability testing'],category:'design',isNew:false},
      {id:4,icon:'🛡️',title:'IT Support',tagline:'24/7 support',description:'24/7 responsive IT support.',features:['24/7 helpdesk & remote support','Proactive monitoring','On-site support across the UK'],category:'infrastructure',isNew:false},
      {id:5,icon:'☁️',title:'Cloud Services',tagline:'AWS, Azure & GCP',description:'Cloud migration and managed services.',features:['Cloud migration strategy','Managed cloud operations','Disaster recovery'],category:'cloud',isNew:false},
      {id:6,icon:'📣',title:'Digital Marketing',tagline:'Data-driven growth',description:'Data-driven digital marketing strategies.',features:['SEO & technical optimisation','PPC campaign management','Content strategy & social media'],category:'marketing',isNew:false},
      {id:7,icon:'📱',title:'Mobile App Solutions',tagline:'iOS & Android apps',description:'Native and cross-platform mobile applications.',features:['React Native & Flutter','Native iOS & Android','App Store deployment'],category:'development',isNew:false},
      {id:8,icon:'🤖',title:'AI Solutions',tagline:'Machine learning & automation',description:'Harness the power of artificial intelligence.',features:['Custom ML model development','NLP & chatbots','AI-driven automation'],category:'cloud',isNew:false},
      {id:9,icon:'🖥️',title:'Hardware Decommissioning',tagline:'Secure WEEE-compliant disposal',description:'Secure, compliant IT hardware decommissioning.',features:['Certified data destruction','WEEE-compliant recycling','Full audit documentation'],category:'infrastructure',isNew:true},
    ],
    portfolio:[{id:1,title:'NovaTech Cloud Migration',icon:'☁️',description:'AWS cloud migration reducing costs by 40%.',tags:['Cloud','AWS'],category:'cloud',year:'2024',featured:true,image:''},{id:2,title:'MediConnect Patient App',icon:'📱',description:'Healthcare app connecting 15,000+ patients.',tags:['Mobile','React Native'],category:'mobile',year:'2024',featured:false,image:''},{id:3,title:'LuxeStore E-commerce',icon:'🛒',description:'Custom headless commerce platform.',tags:['Web Dev'],category:'web',year:'2023',featured:false,image:''}],
    team:[{id:1,name:'James Mitchell',role:'CEO & Founder',avatar:'👨‍💼',bio:'25+ years in enterprise IT.',image:''},{id:2,name:'Priya Sharma',role:'Head of Engineering',avatar:'👩‍💻',bio:'Full-stack architect.',image:''},{id:3,name:'David Chen',role:'AI Solutions Lead',avatar:'👨‍🔬',bio:'PhD in ML.',image:''},{id:4,name:'Sarah Blake',role:'Creative Director',avatar:'👩‍🎨',bio:'Award-winning designer.',image:''}],
    testimonials:[{id:1,text:'Asproite transformed our infrastructure. The cloud migration was flawless.',name:'Marcus Webb',role:'CTO, NovaTech Financial',avatar:'👨'},{id:2,text:'The MediConnect app exceeded every expectation.',name:'Dr. Aisha Patel',role:'Medical Director, MediConnect',avatar:'👩'},{id:3,text:'From design to launch in 8 weeks — conversion rate increased by 60%.',name:'Tom Lawson',role:'CEO, LuxeStore UK',avatar:'👨'}],
    faqs:[{id:1,q:'How quickly can you start?',a:'Typically within 1-2 weeks of agreeing scope.'},{id:2,q:'Do you work with small businesses?',a:'Absolutely. We work with organisations of all sizes.'},{id:3,q:'What is included in hardware decommissioning?',a:'Full asset inventory, certified data destruction, WEEE-compliant recycling, and audit documentation.'},{id:4,q:'Do you offer ongoing support?',a:'Yes — all projects include a post-launch support period.'}],
    timeline:[{id:1,year:'1999',title:'Asproite is Born',body:'Founded in London.'},{id:2,year:'2005',title:'Software & Web Division',body:'Launched dedicated divisions.'},{id:3,year:'2012',title:'India Office Opens',body:'Opened our Vadodara office.'},{id:4,year:'2018',title:'Cloud & AI Services',body:'Became certified AWS and Azure partners.'},{id:5,year:'2024',title:'Hardware Decommissioning',body:'Launched WEEE-compliant hardware decommissioning.'}],
    effects:{neuralCanvas:true,customCursor:true,scrollReveal:true,marquee:true,orbitRings:true},
    web3formsKey: '',
    careers:[
      {id:1,title:'Senior Full-Stack Developer',department:'Engineering',location:'London, UK',type:'Full-time',description:'We\'re looking for an experienced full-stack developer to join our engineering team, building scalable web applications for clients across the UK.',requirements:['5+ years of full-stack development experience','Strong knowledge of React and Node.js','Experience with cloud platforms (AWS/Azure)','Excellent communication skills'],isNew:true,postedDate:'2026-07-01'},
      {id:2,title:'Cloud Solutions Architect',department:'Cloud Services',location:'Remote (UK)',type:'Full-time',description:'Design and implement cloud migration strategies for enterprise clients, working closely with our infrastructure and support teams.',requirements:['AWS or Azure certification','7+ years in cloud architecture','Experience leading migration projects','Strong client-facing communication'],isNew:false,postedDate:'2026-06-15'},
      {id:3,title:'IT Support Engineer',department:'IT Support',location:'Vadodara, India',type:'Full-time',description:'Provide first and second-line technical support to our growing client base, with opportunities to progress into senior support and infrastructure roles.',requirements:['2+ years in IT support or helpdesk','Strong troubleshooting skills','Familiarity with Windows and network fundamentals','Customer-focused attitude'],isNew:false,postedDate:'2026-06-01'},
    ],
    industries:[
      {id:1,slug:'healthcare',icon:'🏥',name:'Healthcare & Clinics',
        metaDescription:'IT support and cloud solutions for healthcare providers and clinics — GDPR-compliant patient data security, zero-downtime systems, and 24/7 support. Trusted across the UK.',
        heroTitle:'IT Support Built for',heroTitleAccent:'Healthcare Providers',
        heroSubtitle:'Patient data security, uptime you can rely on, and compliance handled — so your team can focus on care, not IT.',
        painPoints:['Protecting patient data and staying GDPR compliant','Zero tolerance for downtime on critical care systems','Legacy systems that don\'t talk to modern software','Staff need reliable remote access without security gaps'],
        relevantServices:['IT Support','Cloud Services','Software Solutions'],
        caseStudyTitle:'MediConnect Patient App',
        caseStudyText:'Built and secured a patient-facing app now connecting 15,000+ patients, with healthcare-grade data protection built in from day one.',
        testimonialQuote:'The MediConnect app exceeded every expectation.',testimonialName:'Dr. Aisha Patel',testimonialRole:'Medical Director, MediConnect',
        ctaText:'Book a Healthcare IT Consultation'},
      {id:2,slug:'financial-services',icon:'🏦',name:'Financial Services',
        metaDescription:'IT support and cloud migration for financial services firms — compliance-aware security, disaster recovery, and reliable infrastructure. Trusted UK IT partner.',
        heroTitle:'IT Infrastructure Built for',heroTitleAccent:'Financial Services',
        heroSubtitle:"Security, uptime, and compliance-aware infrastructure for firms that can't afford to get IT wrong.",
        painPoints:['Regulatory and compliance pressure around data handling','Downtime directly costs money and client trust','Legacy on-prem systems slowing down cloud migration','Disaster recovery that actually gets tested, not just documented'],
        relevantServices:['Cloud Services','IT Support','AI Solutions'],
        caseStudyTitle:'NovaTech Cloud Migration',
        caseStudyText:'Migrated core infrastructure to the cloud, cutting infrastructure costs by 40% while improving uptime and disaster recovery readiness.',
        testimonialQuote:'Asproite transformed our infrastructure. The cloud migration was flawless.',testimonialName:'Marcus Webb',testimonialRole:'CTO, NovaTech Financial',
        ctaText:'Book a Financial Services IT Consultation'},
      {id:3,slug:'retail-ecommerce',icon:'🛒',name:'Retail & E-commerce',
        metaDescription:'Website development, hosting, and IT support for retail and e-commerce businesses — built for conversion, speed, and peak sales traffic.',
        heroTitle:'Digital Solutions Built for',heroTitleAccent:'Retail & E-commerce',
        heroSubtitle:'Fast, reliable storefronts and the infrastructure to handle your busiest sales day without breaking.',
        painPoints:['Site speed and checkout friction directly costing sales','Traffic spikes during sales periods overwhelming hosting','Disconnected inventory, payments, and marketing systems','Needing a dev partner who moves at retail speed, not agency speed'],
        relevantServices:['Website Development','Digital Marketing','Cloud Services'],
        caseStudyTitle:'LuxeStore E-commerce Platform',
        caseStudyText:'Designed and launched a custom headless commerce platform in 8 weeks, increasing conversion rate by 60%.',
        testimonialQuote:'From design to launch in 8 weeks — conversion rate increased by 60%.',testimonialName:'Tom Lawson',testimonialRole:'CEO, LuxeStore UK',
        ctaText:'Book a Retail IT & Web Consultation'},
    ],
  };
}

// ─── Validate ─────────────────────────────────────────────────
function isValidData(d) {
  return d && typeof d === 'object' && d.homePage && d.siteInfo;
}

// ─── Merge fetched data with defaults ────────────────────────
function mergeWithDefaults(raw) {
  if (!isValidData(raw)) return getDefaults();
  const defaults = getDefaults();
  const result = { ...defaults };
  for (const key of Object.keys(raw)) {
    const sv = raw[key]; const dv = defaults[key];
    if (sv != null && typeof sv === 'object' && !Array.isArray(sv) && dv && typeof dv === 'object' && !Array.isArray(dv)) {
      result[key] = { ...dv, ...sv };
    } else if (sv != null) {
      result[key] = sv;
    }
  }
  return result;
}

// ─── Cache ────────────────────────────────────────────────────
function getCached() {
  try {
    const t = parseInt(localStorage.getItem(DB_CACHE_TIME_KEY) || '0');
    const d = localStorage.getItem(DB_CACHE_KEY);
    if (d && (Date.now() - t) < CACHE_TTL_MS) {
      const p = JSON.parse(d);
      if (isValidData(p)) return p;
    }
  } catch(e) {}
  return null;
}
function setCache(data) {
  try {
    localStorage.setItem(DB_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(DB_CACHE_TIME_KEY, String(Date.now()));
  } catch(e) {}
}

// ─── Fetch live data ──────────────────────────────────────────
// Returns merged data or null. NEVER fires any events (prevents loops).
async function fetchLiveData() {
  // 1. Same-origin /sitedata.json — fastest, always fresh from Hostinger
  try {
    const res = await fetch('/sitedata.json?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const raw = await res.json();
      if (isValidData(raw)) {
        const data = mergeWithDefaults(raw);
        setCache(data);
        return data;
      }
    }
  } catch(e) {}
  // 2. GitHub raw URL fallback (for local dev)
  try {
    const res = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const raw = await res.json();
      if (isValidData(raw)) {
        const data = mergeWithDefaults(raw);
        setCache(data);
        return data;
      }
    }
  } catch(e) {}
  return null;
}

// ─── Public API ───────────────────────────────────────────────

// Used by website pages — returns instantly (cache or defaults), refreshes in background
export async function fetchSiteData() {
  const cached = getCached();
  if (cached) {
    // Already have data — refresh silently in background (no events, no loops)
    fetchLiveData(); // fire and forget — just updates cache for next load
    return cached;
  }
  // No cache — return defaults immediately so page renders right away
  // then fetch live data and update via the 'asproite_data_updated' event
  const livePromise = fetchLiveData();
  // Kick off a delayed event so SiteDataContext reloads once live data arrives
  livePromise.then((fresh) => {
    if (fresh) window.dispatchEvent(new Event('asproite_data_updated'));
  });
  // Return defaults instantly — page renders NOW, not after network request
  return getDefaults();
}

// Used by admin — always fetches latest, NO events fired
export async function adminGetData() {
  const fresh = await fetchLiveData();
  if (fresh) return fresh;
  const cached = getCached();
  if (cached) return cached;
  return getDefaults();
}

// Admin save — writes through the server (which owns the GitHub token),
// updates cache, fires ONE event only
export async function adminSave(section, sectionData) {
  const current = await adminGetData();
  current[section] = sectionData;

  // Update cache immediately
  setCache(current);

  // Fire ONE update event so the website pages reload their data
  // This is the ONLY place notifyUpdate is called — no loops possible
  window.dispatchEvent(new Event('asproite_data_updated'));
  try {
    const ch = new BroadcastChannel('asproite_updates');
    ch.postMessage('updated');
    ch.close();
  } catch(e) {}

  try {
    const res = await fetch('/site-api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ section, sectionData }),
    });
    if (res.status === 401) return { ok: false, error: 'not_authenticated' };
    const body = await res.json();
    if (!res.ok) return { ok: false, error: body.error || 'Save failed' };
    // body.github reflects whether the server-side GitHub push succeeded
    return body.github?.ok ? { ok: true } : { ok: false, error: body.github?.error || 'no_token' };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

// Step 1 of login. If the account has 2FA enabled, resolves with
// { needs2FA: true } instead of logging in — no session cookie is set
// until verify2FA() succeeds.
export async function adminLogin(password) {
  const res = await fetch('/site-api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Wrong password');
  return body; // { ok: true } or { ok: true, needs2FA: true }
}

// Step 2 of login when 2FA is enabled — re-sends the password alongside
// the 6-digit authenticator code (kept stateless server-side, see auth.js).
export async function adminLoginVerify2FA(password, code) {
  const res = await fetch('/site-api/admin/login/2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password, code }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Invalid code');
  return { ok: true };
}

export async function adminLogout() {
  await fetch('/site-api/admin/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
}

// Pinged on real admin activity to keep the 15-minute idle session alive.
// Returns false (without throwing) when the session has expired or hit the
// 8-hour absolute cap, so the caller can prompt for re-login.
export async function adminHeartbeat() {
  try {
    const res = await fetch('/site-api/admin/heartbeat', { method: 'POST', credentials: 'include' });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function get2FAStatus() {
  try {
    const res = await fetch('/site-api/admin/2fa/status', { credentials: 'include' });
    if (!res.ok) return { enabled: false };
    return await res.json();
  } catch (e) {
    return { enabled: false };
  }
}

export async function setup2FA() {
  const res = await fetch('/site-api/admin/2fa/setup', { method: 'POST', credentials: 'include' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not start 2FA setup');
  return body; // { secret, otpauth, qrDataUrl }
}

export async function confirm2FA(code) {
  const res = await fetch('/site-api/admin/2fa/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Invalid code');
  return { ok: true };
}

export async function disable2FA(currentPassword) {
  const res = await fetch('/site-api/admin/2fa/disable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not disable 2FA');
  return { ok: true };
}

export async function isLoggedIn() {
  try {
    const res = await fetch('/site-api/admin/session', { credentials: 'include' });
    if (!res.ok) return false;
    const body = await res.json();
    return !!body.loggedIn;
  } catch (e) {
    return false;
  }
}

export async function changeAdminPassword(currentPw, newPw) {
  const res = await fetch('/site-api/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not change password');
  return { ok: true };
}

// Submits a new GitHub token / Anthropic key to the server for validation
// and storage. The value is sent once, over the authenticated session, and
// never returned — only a configured/not-configured status comes back.
export async function setGitHubToken(token) {
  const res = await fetch('/site-api/admin/github-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not save token');
  return { ok: true };
}

export async function clearGitHubToken() {
  await fetch('/site-api/admin/github-token/clear', { method: 'POST', credentials: 'include' }).catch(() => {});
}

export async function setAnthropicKey(key) {
  const res = await fetch('/site-api/admin/anthropic-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ key }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Could not save key');
  return { ok: true };
}

export async function clearAnthropicKey() {
  await fetch('/site-api/admin/anthropic-key/clear', { method: 'POST', credentials: 'include' }).catch(() => {});
}

// Reports whether the server currently has GitHub sync / AI chat
// configured (via env var or an admin-panel-set value) — used to render
// read-only status in Admin, never returns the secrets themselves.
export async function getConfigStatus() {
  try {
    const res = await fetch('/site-api/admin/config-status', { credentials: 'include' });
    if (!res.ok) return { githubConfigured: false, aiConfigured: false, careersEmailConfigured: false, twoFactorEnabled: false };
    return await res.json();
  } catch (e) {
    return { githubConfigured: false, aiConfigured: false, careersEmailConfigured: false, twoFactorEnabled: false };
  }
}
export async function adminUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ url: e.target.result });
    reader.onerror = () => reject(new Error('Upload failed'));
    reader.readAsDataURL(file);
  });
}
