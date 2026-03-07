const DB_KEY = 'asproite_db';
const ADMIN_PW_KEY = 'asproite_admin_pw';
const DEFAULT_PASSWORD = 'asproite2024';

export function getAdminPassword() {
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_PASSWORD;
}

function getDefaults() {
  return {
    siteInfo: {
      companyName: 'Asproite Cloud and Consultancy',
      tagline: 'Your End-to-End IT Partner',
      email: 'info@asproite.com',
      phone: '+44 (0)7555185061',
      londonAddress: 'Kingsland Road, London, E13 9PA',
      indiaAddress: 'Gotri Road, Vadodara, 390001',
      logo: '',
      description: 'Asproite delivers end-to-end IT solutions trusted by organisations across the UK for over 25 years.',
    },
    homePage: {
      typingPhrases: ['UK IT Managed Service Provider','Cloud & AI Experts','25+ Years of Excellence','Hardware Decommissioning Experts'],
      heroTitle: 'Transform Your',
      heroTitleAccent: 'Digital Future',
      heroSubtitle: 'Asproite delivers end-to-end IT solutions — from cloud infrastructure and AI to hardware decommissioning. Trusted by private and public sector organisations across the UK for over 25 years.',
      heroPrimaryText: 'Explore Services →',
      heroGhostText: 'View Portfolio',
      aboutTitle: "The UK's Most Trusted",
      aboutTitleAccent: 'IT Partner',
      aboutText1: 'Welcome to Asproite Cloud and Consultancy — a dynamic IT solutions provider committed to delivering cutting-edge services that drive your business forward.',
      aboutText2: 'From IT support and software solutions to web development, mobile apps, AI strategies, and responsible hardware decommissioning — our experts craft innovative, scalable digital solutions.',
      aboutBullets: [
        'ISO-certified processes & wide-reaching technology accreditations',
        '24/7 dedicated helpdesk and infrastructure monitoring',
        'Offices in London, UK and Vadodara, India',
        'Full lifecycle IT — procurement to decommissioning',
      ],
    },
    aboutPage: {
      subtitle: "Over 25 years of delivering IT excellence across the UK. We're not just a service provider — we're your long-term technology partner.",
      missionIcon: '🎯', missionTitle: 'Our Mission',
      missionText: 'To empower businesses with cutting-edge, secure, and scalable IT solutions that drive real growth and digital transformation.',
      visionIcon: '👁️', visionTitle: 'Our Vision',
      visionText: "To be the UK's most trusted technology partner, recognised for innovation, integrity, and measurable client success.",
      valuesIcon: '💎', valuesTitle: 'Our Values',
      valuesText: 'Excellence, transparency, and continuous improvement in everything we do — from strategy to responsible hardware disposal.',
      coreValues: [
        { id:1, icon:'⚡', title:'Agility', body:'We respond fast, adapt faster. Your business needs evolve — we evolve with them.' },
        { id:2, icon:'🔒', title:'Security', body:'Security-first mindset in every solution — from infrastructure to data destruction.' },
        { id:3, icon:'🌱', title:'Sustainability', body:'Responsible IT lifecycle management with eco-conscious hardware practices.' },
        { id:4, icon:'🤝', title:'Partnership', body:"We're not vendors — we're partners invested in your long-term success." },
      ],
    },
    footer: {
      description: 'Asproite Cloud and Consultancy — your end-to-end IT partner for over 25 years. Serving private and public sector organisations across the UK and beyond.',
      serviceLinks: ['Website Development','Software Solutions','IT Support','Cloud Services','AI Solutions','Hardware Decommissioning'],
      companyLinks: ['About Us','Portfolio','Careers','Contact Us'],
      newsletterTitle: 'Stay Updated',
      newsletterSubtitle: 'Get the latest IT insights and news from Asproite.',
      linkedinUrl: '#', twitterUrl: '#', facebookUrl: '#', instagramUrl: '#',
      copyrightName: 'Asproite Cloud and Consultancy Ltd',
    },
    contactPage: {
      subtitle: "Whether you have a project in mind or just want to learn more — our team is ready to help. Response within 24 hours, guaranteed.",
      infoCards: [
        { id:1, label:'Email', value:'info@asproite.com' },
        { id:2, label:'Phone', value:'+44 (0)7555185061' },
        { id:3, label:'Response Time', value:'Within 24 hours — usually much faster.' },
        { id:4, label:'London HQ', value:'Kingsland Road, London, E13 9PA' },
        { id:5, label:'Vadodara, India', value:'Gotri Road, Vadodara, 390001' },
      ],
    },
    stats: [
      { num:25, suffix:'+', label:'Years Experience' },
      { num:500, suffix:'+', label:'Clients Worldwide' },
      { num:40, suffix:'+', label:'IT Services' },
      { num:99, suffix:'%', label:'Client Satisfaction' },
    ],
    services: [
      { id:1, icon:'🌐', title:'Website Development', tagline:'High-performance websites', description:'Bespoke, high-performance websites engineered for speed.', features:['Custom CMS solutions','Performance optimised','Responsive and SEO-ready'], category:'development', isNew:false },
      { id:2, icon:'⚙️', title:'Software Solutions', tagline:'Custom enterprise software', description:'Custom software development tailored to your workflows.', features:['Enterprise software development','API design & microservices','Legacy system modernisation'], category:'development', isNew:false },
      { id:3, icon:'🎨', title:'Web Design', tagline:'Award-winning UI/UX', description:'Strategically crafted user experiences.', features:['UI/UX design & prototyping','Brand identity & design systems','User research & usability testing'], category:'design', isNew:false },
      { id:4, icon:'🛡️', title:'IT Support', tagline:'24/7 support', description:'24/7 responsive IT support.', features:['24/7 helpdesk & remote support','Proactive monitoring','On-site support across the UK'], category:'infrastructure', isNew:false },
      { id:5, icon:'☁️', title:'Cloud Services', tagline:'AWS, Azure & GCP', description:'Cloud migration and managed services.', features:['Cloud migration strategy','Managed cloud operations','Disaster recovery'], category:'cloud', isNew:false },
      { id:6, icon:'📣', title:'Digital Marketing', tagline:'Data-driven growth', description:'Data-driven digital marketing strategies.', features:['SEO & technical optimisation','PPC campaign management','Content strategy & social media'], category:'marketing', isNew:false },
      { id:7, icon:'📱', title:'Mobile App Solutions', tagline:'iOS & Android apps', description:'Native and cross-platform mobile applications.', features:['React Native & Flutter','Native iOS & Android','App Store deployment'], category:'development', isNew:false },
      { id:8, icon:'🤖', title:'AI Solutions', tagline:'Machine learning & automation', description:'Harness the power of artificial intelligence.', features:['Custom ML model development','NLP & chatbots','AI-driven automation'], category:'cloud', isNew:false },
      { id:9, icon:'🖥️', title:'Hardware Decommissioning', tagline:'Secure WEEE-compliant disposal', description:'Secure, compliant IT hardware decommissioning.', features:['Certified data destruction','WEEE-compliant recycling','Full audit documentation'], category:'infrastructure', isNew:true },
    ],
    portfolio: [
      { id:1, title:'NovaTech Cloud Migration', icon:'☁️', description:'AWS cloud migration reducing infrastructure costs by 40%.', tags:['Cloud','AWS'], category:'cloud', year:'2024', featured:true, image:'' },
      { id:2, title:'MediConnect Patient App', icon:'📱', description:'Healthcare app connecting 15,000+ patients.', tags:['Mobile','React Native'], category:'mobile', year:'2024', featured:false, image:'' },
      { id:3, title:'LuxeStore E-commerce', icon:'🛒', description:'Custom headless commerce platform.', tags:['Web Dev'], category:'web', year:'2023', featured:false, image:'' },
    ],
    team: [
      { id:1, name:'James Mitchell', role:'CEO & Founder', avatar:'👨‍💼', bio:'25+ years in enterprise IT.', image:'' },
      { id:2, name:'Priya Sharma', role:'Head of Engineering', avatar:'👩‍💻', bio:'Full-stack architect.', image:'' },
      { id:3, name:'David Chen', role:'AI Solutions Lead', avatar:'👨‍🔬', bio:'PhD in ML. Leads our AI division.', image:'' },
      { id:4, name:'Sarah Blake', role:'Creative Director', avatar:'👩‍🎨', bio:'Award-winning designer.', image:'' },
    ],
    testimonials: [
      { id:1, text:'Asproite transformed our infrastructure. The cloud migration was flawless.', name:'Marcus Webb', role:'CTO, NovaTech Financial', avatar:'👨' },
      { id:2, text:'The MediConnect app exceeded every expectation.', name:'Dr. Aisha Patel', role:'Medical Director, MediConnect', avatar:'👩' },
      { id:3, text:'From design to launch in 8 weeks — our conversion rate increased by 60%.', name:'Tom Lawson', role:'CEO, LuxeStore UK', avatar:'👨' },
    ],
    faqs: [
      { id:1, q:'How quickly can you start?', a:'Typically within 1-2 weeks of agreeing scope.' },
      { id:2, q:'Do you work with small businesses?', a:'Absolutely. We work with organisations of all sizes.' },
      { id:3, q:'What is included in hardware decommissioning?', a:'Full asset inventory, certified data destruction, WEEE-compliant recycling, and audit documentation.' },
      { id:4, q:'Do you offer ongoing support?', a:'Yes — all projects include a post-launch support period.' },
    ],
    timeline: [
      { id:1, year:'1999', title:'Asproite is Born', body:'Founded in London.' },
      { id:2, year:'2005', title:'Software & Web Division', body:'Launched dedicated divisions.' },
      { id:3, year:'2012', title:'India Office Opens', body:'Opened our Vadodara office.' },
      { id:4, year:'2018', title:'Cloud & AI Services', body:'Became certified AWS and Azure partners.' },
      { id:5, year:'2024', title:'Hardware Decommissioning', body:'Launched WEEE-compliant hardware decommissioning.' },
    ],
    effects: { neuralCanvas:true, customCursor:true, scrollReveal:true, marquee:true, orbitRings:true },
  };
}

function loadDB() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaults = getDefaults();
      // Deep merge: keep defaults for any missing top-level keys
      return { ...defaults, ...parsed };
    }
  } catch(e) {}
  return getDefaults();
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event('asproite_data_updated'));
}

export async function adminLogin(password) {
  if (password !== getAdminPassword()) throw new Error('Wrong password');
  localStorage.setItem('adminToken', 'local-admin-token');
  return { token: 'local-admin-token' };
}

export async function adminLogout() {
  localStorage.removeItem('adminToken');
}

export function isLoggedIn() {
  return localStorage.getItem('adminToken') === 'local-admin-token';
}

export async function adminGetData() { return loadDB(); }

export async function adminSave(section, data) {
  const db = loadDB();
  db[section] = data;
  saveDB(db);
  return { ok: true };
}

export async function changeAdminPassword(currentPw, newPw) {
  if (currentPw !== getAdminPassword()) throw new Error('Current password is incorrect');
  if (!newPw || newPw.length < 6) throw new Error('New password must be at least 6 characters');
  localStorage.setItem(ADMIN_PW_KEY, newPw);
  return { ok: true };
}

export async function resetAdminPassword() {
  localStorage.removeItem(ADMIN_PW_KEY);
  return { ok: true };
}

export async function adminUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ url: e.target.result });
    reader.onerror = () => reject(new Error('Upload failed'));
    reader.readAsDataURL(file);
  });
}

export async function fetchSiteData() { return loadDB(); }
