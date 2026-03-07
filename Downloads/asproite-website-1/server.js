const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'asproite2024';
const DB_PATH = path.join(__dirname, 'db.json');

const sessions = new Map();
app.use(express.json({ limit: '10mb' }));

// Try to load multer for image uploads
let upload = null;
try {
  const multer = require('multer');
  const UPLOADS_DIR = path.join(__dirname, 'dist', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
} catch(e) {}

app.use(express.static(path.join(__dirname, 'dist')));

function readDB() {
  try { if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) {}
  return {};
}
function writeDB(data) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }
function getDB() { return { ...getDefaults(), ...readDB() }; }
function getDefaults() {
  return {
    siteInfo: { companyName: 'Asproite Cloud and Consultancy', tagline: 'Your End-to-End IT Partner', email: 'info@asproite.com', phone: '+44 (0)7555185061', londonAddress: 'Kingsland Road, London, E13 9PA', indiaAddress: 'Gotri Road, Vadodara, 390001', logo: '', description: 'Asproite delivers end-to-end IT solutions trusted by organisations across the UK for over 25 years.' },
    stats: [{ num: 25, suffix: '+', label: 'Years Experience' }, { num: 500, suffix: '+', label: 'Clients Worldwide' }, { num: 40, suffix: '+', label: 'IT Services' }, { num: 99, suffix: '%', label: 'Client Satisfaction' }],
    services: [
      { id: 1, icon: '🌐', title: 'Website Development', tagline: 'High-performance websites', description: 'Bespoke, high-performance websites engineered for speed.', features: ['Custom CMS solutions', 'Performance optimised', 'Responsive and SEO-ready'], category: 'development', isNew: false },
      { id: 2, icon: '⚙️', title: 'Software Solutions', tagline: 'Custom enterprise software', description: 'Custom software development tailored to your workflows.', features: ['Enterprise software development', 'API design & microservices', 'Legacy system modernisation'], category: 'development', isNew: false },
      { id: 3, icon: '🎨', title: 'Web Design', tagline: 'Award-winning UI/UX', description: 'Strategically crafted user experiences.', features: ['UI/UX design & prototyping', 'Brand identity & design systems', 'User research & usability testing'], category: 'design', isNew: false },
      { id: 4, icon: '🛡️', title: 'IT Support', tagline: '24/7 support', description: '24/7 responsive IT support.', features: ['24/7 helpdesk & remote support', 'Proactive monitoring', 'On-site support across the UK'], category: 'infrastructure', isNew: false },
      { id: 5, icon: '☁️', title: 'Cloud Services', tagline: 'AWS, Azure & GCP', description: 'Cloud migration and managed services.', features: ['Cloud migration strategy', 'Managed cloud operations', 'Disaster recovery'], category: 'cloud', isNew: false },
      { id: 6, icon: '📣', title: 'Digital Marketing', tagline: 'Data-driven growth', description: 'Data-driven digital marketing strategies.', features: ['SEO & technical optimisation', 'PPC campaign management', 'Content strategy & social media'], category: 'marketing', isNew: false },
      { id: 7, icon: '📱', title: 'Mobile App Solutions', tagline: 'iOS & Android apps', description: 'Native and cross-platform mobile applications.', features: ['React Native & Flutter', 'Native iOS & Android', 'App Store deployment'], category: 'development', isNew: false },
      { id: 8, icon: '🤖', title: 'AI Solutions', tagline: 'Machine learning & automation', description: 'Harness the power of artificial intelligence.', features: ['Custom ML model development', 'NLP & chatbots', 'AI-driven automation'], category: 'cloud', isNew: false },
      { id: 9, icon: '🖥️', title: 'Hardware Decommissioning', tagline: 'Secure WEEE-compliant disposal', description: 'Secure, compliant IT hardware decommissioning.', features: ['Certified data destruction', 'WEEE-compliant recycling', 'Full audit documentation'], category: 'infrastructure', isNew: true },
    ],
    portfolio: [
      { id: 1, title: 'NovaTech Cloud Migration', icon: '☁️', description: 'AWS cloud migration reducing infrastructure costs by 40%.', tags: ['Cloud', 'AWS'], category: 'cloud', year: '2024', featured: true, image: '' },
      { id: 2, title: 'MediConnect Patient App', icon: '📱', description: 'Healthcare app connecting 15,000+ patients.', tags: ['Mobile', 'React Native'], category: 'mobile', year: '2024', featured: false, image: '' },
      { id: 3, title: 'LuxeStore E-commerce', icon: '🛒', description: 'Custom headless commerce platform.', tags: ['Web Dev'], category: 'web', year: '2023', featured: false, image: '' },
    ],
    team: [
      { id: 1, name: 'James Mitchell', role: 'CEO & Founder', avatar: '👨‍💼', bio: '25+ years in enterprise IT.', image: '' },
      { id: 2, name: 'Priya Sharma', role: 'Head of Engineering', avatar: '👩‍💻', bio: 'Full-stack architect.', image: '' },
      { id: 3, name: 'David Chen', role: 'AI Solutions Lead', avatar: '👨‍🔬', bio: 'PhD in ML. Leads our AI division.', image: '' },
      { id: 4, name: 'Sarah Blake', role: 'Creative Director', avatar: '👩‍🎨', bio: 'Award-winning designer.', image: '' },
    ],
    testimonials: [
      { id: 1, text: 'Asproite transformed our infrastructure. The cloud migration was flawless.', name: 'Marcus Webb', role: 'CTO, NovaTech Financial', avatar: '👨' },
      { id: 2, text: 'The MediConnect app exceeded every expectation.', name: 'Dr. Aisha Patel', role: 'Medical Director, MediConnect', avatar: '👩' },
      { id: 3, text: 'From design to launch in 8 weeks — our conversion rate increased by 60%.', name: 'Tom Lawson', role: 'CEO, LuxeStore UK', avatar: '👨' },
    ],
    faqs: [
      { id: 1, q: 'How quickly can you start?', a: 'Typically within 1-2 weeks of agreeing scope.' },
      { id: 2, q: 'Do you work with small businesses?', a: 'Absolutely. We work with organisations of all sizes.' },
      { id: 3, q: 'What is included in hardware decommissioning?', a: 'Full asset inventory, certified data destruction, WEEE-compliant recycling, and audit documentation.' },
      { id: 4, q: 'Do you offer ongoing support?', a: 'Yes — all projects include a post-launch support period.' },
    ],
    timeline: [
      { id: 1, year: '1999', title: 'Asproite is Born', body: 'Founded in London.' },
      { id: 2, year: '2005', title: 'Software & Web Division', body: 'Launched dedicated divisions.' },
      { id: 3, year: '2012', title: 'India Office Opens', body: 'Opened our Vadodara office.' },
      { id: 4, year: '2018', title: 'Cloud & AI Services', body: 'Became certified AWS and Azure partners.' },
      { id: 5, year: '2024', title: 'Hardware Decommissioning', body: 'Launched WEEE-compliant hardware decommissioning.' },
    ],
    effects: { neuralCanvas: true, customCursor: true, scrollReveal: true, marquee: true, orbitRings: true },
  };
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || !sessions.has(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.post('/api/admin/login', (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Invalid password' });
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now());
  res.json({ token });
});

app.post('/api/admin/logout', authMiddleware, (req, res) => {
  sessions.delete(req.headers['x-admin-token']);
  res.json({ ok: true });
});

app.get('/api/data', (req, res) => res.json(getDB()));
app.get('/api/admin/data', authMiddleware, (req, res) => res.json(getDB()));

app.put('/api/admin/:section', authMiddleware, (req, res) => {
  const db = getDB();
  db[req.params.section] = req.body;
  writeDB(db);
  res.json({ ok: true });
});

if (upload) {
  app.post('/api/admin/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    res.json({ url: '/uploads/' + req.file.filename });
  });
}

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.listen(PORT, () => console.log('Asproite running on port ' + PORT));
