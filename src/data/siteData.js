// ─── SERVICES DATA ───────────────────────────────────────
export const services = [
  {
    id: 1,
    icon: '🌐',
    title: 'Website Development',
    slug: 'website-development',
    tagline: 'High-performance, bespoke websites',
    description: 'Bespoke, high-performance websites engineered for speed, accessibility, and conversion — built on modern stacks that scale with your business.',
    features: [
      'Custom CMS and e-commerce solutions',
      'Performance & Core Web Vitals optimised',
      'Responsive, accessible, and SEO-ready',
    ],
    category: 'development',
  },
  {
    id: 2,
    icon: '⚙️',
    title: 'Software Solutions',
    slug: 'software-solutions',
    tagline: 'Custom-built enterprise software',
    description: 'Custom software development tailored to your workflows — from enterprise applications and automation platforms to API integrations and SaaS products.',
    features: [
      'Enterprise & SME software development',
      'API design, integration & microservices',
      'Legacy system modernisation',
    ],
    category: 'development',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Web Design',
    slug: 'web-design',
    tagline: 'Award-winning UI/UX design',
    description: 'Strategically crafted user experiences that captivate audiences and reflect your brand identity with precision, creativity, and measurable results.',
    features: [
      'UI/UX design & prototyping',
      'Brand identity & design systems',
      'User research & usability testing',
    ],
    category: 'design',
  },
  {
    id: 4,
    icon: '🛡️',
    title: 'IT Support',
    slug: 'it-support',
    tagline: '24/7 responsive support',
    description: '24/7 responsive IT support covering your users and infrastructure. Proactive monitoring, rapid incident response, and ongoing maintenance.',
    features: [
      '24/7 helpdesk & remote support',
      'Proactive infrastructure monitoring',
      'On-site support across the UK',
    ],
    category: 'infrastructure',
  },
  {
    id: 5,
    icon: '☁️',
    title: 'Cloud Services',
    slug: 'cloud-services',
    tagline: 'AWS, Azure & GCP managed services',
    description: 'Cloud migration, architecture, and managed services across AWS, Azure, and GCP. Secure, resilient, and cost-optimised cloud environments built for scale.',
    features: [
      'Cloud migration strategy & execution',
      'Managed cloud operations & FinOps',
      'Disaster recovery & business continuity',
    ],
    category: 'cloud',
  },
  {
    id: 6,
    icon: '📣',
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    tagline: 'Data-driven growth strategies',
    description: 'Data-driven digital marketing strategies — SEO, PPC, content, and social media — designed to grow your audience and maximise return on investment.',
    features: [
      'SEO & technical optimisation',
      'PPC campaign management',
      'Content strategy & social media',
    ],
    category: 'marketing',
  },
  {
    id: 7,
    icon: '📱',
    title: 'Mobile App Solutions',
    slug: 'mobile-apps',
    tagline: 'iOS & Android app development',
    description: 'Native and cross-platform mobile applications for iOS and Android, built for outstanding performance and exceptional user experience.',
    features: [
      'React Native & Flutter development',
      'Native iOS (Swift) & Android (Kotlin)',
      'App Store & Play Store deployment',
    ],
    category: 'development',
  },
  {
    id: 8,
    icon: '🤖',
    title: 'AI Solutions',
    slug: 'ai-solutions',
    tagline: 'Machine learning & intelligent automation',
    description: 'Harness the power of artificial intelligence — from machine learning models and NLP tools to intelligent process automation tailored for your industry.',
    features: [
      'Custom ML model development',
      'NLP, chatbots & generative AI',
      'AI-driven process automation',
    ],
    category: 'cloud',
  },
  {
    id: 9,
    icon: '🖥️',
    title: 'Hardware Decommissioning',
    slug: 'hardware-decommissioning',
    tagline: 'Secure, WEEE-compliant disposal',
    description: 'Secure, compliant, and environmentally responsible decommissioning of IT hardware. Full data destruction, asset recovery, and audit trails.',
    features: [
      'Certified data wiping & destruction (GDPR)',
      'WEEE-compliant recycling & disposal',
      'Full asset inventory & audit documentation',
    ],
    category: 'infrastructure',
    isNew: true,
  },
];

// ─── PORTFOLIO DATA ───────────────────────────────────────
export const portfolioProjects = [
  {
    id: 1,
    title: 'NovaTech Cloud Migration',
    icon: '☁️',
    description: 'End-to-end AWS cloud migration for a 500-person financial services firm — reducing infrastructure costs by 40% while improving uptime to 99.99%.',
    tags: ['Cloud', 'AWS', 'AI'],
    category: 'cloud',
    year: '2024',
    featured: true,
  },
  {
    id: 2,
    title: 'MediConnect Patient App',
    icon: '📱',
    description: 'Cross-platform healthcare app connecting 15,000+ patients with their GPs — appointment booking, prescriptions, and AI-powered symptom checker.',
    tags: ['Mobile', 'React Native'],
    category: 'mobile',
    year: '2024',
  },
  {
    id: 3,
    title: 'LuxeStore E-commerce Platform',
    icon: '🛒',
    description: 'Custom headless commerce platform for a luxury UK retailer — £2M annual turnover, 3× faster page loads than the previous Shopify store.',
    tags: ['E-commerce', 'Web Dev'],
    category: 'web',
    year: '2023',
  },
  {
    id: 4,
    title: 'RetailIQ Demand Forecasting',
    icon: '🤖',
    description: 'ML-powered demand forecasting system for a national supermarket chain — reducing food waste by 18% and improving stock availability.',
    tags: ['AI', 'Machine Learning'],
    category: 'cloud',
    year: '2024',
  },
  {
    id: 5,
    title: 'Meridian Brand Identity',
    icon: '🎨',
    description: 'Complete digital brand identity for an emerging fintech startup — design system, website UI, and mobile app UI/UX from concept to launch.',
    tags: ['Design', 'Branding'],
    category: 'design',
    year: '2023',
  },
  {
    id: 6,
    title: 'NHS Trust IT Managed Services',
    icon: '🏥',
    description: '5-year managed IT services contract for an NHS Trust — covering 1,200 endpoints, 24/7 helpdesk, and infrastructure management across 4 sites.',
    tags: ['IT Support', 'Healthcare'],
    category: 'it',
    year: '2022–Present',
  },
  {
    id: 7,
    title: 'ClearBank Customer Portal',
    icon: '🏦',
    description: 'Secure, real-time banking customer portal built with React and Node.js — serving 50,000+ users with sub-100ms API response times.',
    tags: ['Web Dev', 'Finance'],
    category: 'web',
    year: '2023',
  },
  {
    id: 8,
    title: 'SwiftRoute Delivery App',
    icon: '🚚',
    description: 'Real-time delivery tracking and driver management app — used by 200+ fleet drivers and 10,000+ customers daily across the UK.',
    tags: ['Mobile', 'Logistics'],
    category: 'mobile',
    year: '2023',
  },
  {
    id: 9,
    title: 'GreenBank Asset Disposal',
    icon: '🖥️',
    description: 'Secure decommissioning of 2,400 IT assets for a major UK bank — certified data destruction, zero-landfill recycling, and full audit documentation.',
    tags: ['Decommissioning', 'WEEE'],
    category: 'it',
    year: '2024',
  },
];

export const portfolioFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web Development' },
  { value: 'cloud', label: 'Cloud & AI' },
  { value: 'mobile', label: 'Mobile Apps' },
  { value: 'design', label: 'Design' },
  { value: 'it', label: 'IT Infrastructure' },
];

// ─── TEAM DATA ────────────────────────────────────────────
export const team = [
  { name: 'James Mitchell', role: 'CEO & Founder', avatar: '👨‍💼', bio: '25+ years in enterprise IT. Passionate about building technology that genuinely changes businesses.' },
  { name: 'Priya Sharma', role: 'Head of Engineering', avatar: '👩‍💻', bio: 'Full-stack architect with deep expertise in cloud infrastructure and distributed systems.' },
  { name: 'David Chen', role: 'AI Solutions Lead', avatar: '👨‍🔬', bio: 'PhD in ML. Leads our AI division, building intelligent automation for clients across industries.' },
  { name: 'Sarah Blake', role: 'Creative Director', avatar: '👩‍🎨', bio: 'Award-winning designer with 12 years crafting digital experiences for global brands.' },
];

// ─── TIMELINE DATA ────────────────────────────────────────
export const timeline = [
  { year: '1999', title: 'Asproite is Born', body: 'Founded in London with a mission to make enterprise IT accessible to growing UK businesses. Started with IT support and infrastructure services.' },
  { year: '2005', title: 'Software & Web Division', body: 'Launched dedicated software development and web design divisions. Grew the team to 30+ specialists across the UK.' },
  { year: '2012', title: 'India Office Opens', body: 'Opened our Vadodara office to provide round-the-clock support capabilities and scale engineering capacity for enterprise clients.' },
  { year: '2018', title: 'Cloud & AI Services Launch', body: 'Became certified AWS and Azure partners. Launched AI and machine learning division, helping clients automate and intelligently scale.' },
  { year: '2024', title: 'Hardware Decommissioning', body: 'Launched our newest service: secure, WEEE-compliant hardware decommissioning — full lifecycle IT management from day one to end of life.' },
];

// ─── TESTIMONIALS ─────────────────────────────────────────
export const testimonials = [
  { text: 'Asproite transformed our infrastructure. The cloud migration was flawless — we saw a 40% cost reduction within the first quarter and our team couldn\'t be happier with the ongoing support.', name: 'Marcus Webb', role: 'CTO, NovaTech Financial', avatar: '👨' },
  { text: 'The MediConnect app exceeded every expectation. Asproite\'s team was professional, communicative, and delivered a truly world-class mobile experience that our patients love.', name: 'Dr. Aisha Patel', role: 'Medical Director, MediConnect', avatar: '👩' },
  { text: 'From design to launch in 8 weeks — and the results speak for themselves. Our new platform increased conversion rate by 60%. Asproite are our go-to technology partner.', name: 'Tom Lawson', role: 'CEO, LuxeStore UK', avatar: '👨' },
];

// ─── FAQ DATA ─────────────────────────────────────────────
export const faqs = [
  { q: 'How quickly can you start on a project?', a: 'Typically within 1–2 weeks of agreeing scope. For urgent IT support needs, we can often mobilise within 24–48 hours.' },
  { q: 'Do you work with small businesses?', a: 'Absolutely. We work with organisations of all sizes — from startups and SMEs to large enterprises and public sector bodies.' },
  { q: 'What\'s included in hardware decommissioning?', a: 'Our service covers full asset inventory, certified data destruction (GDPR-compliant), WEEE-compliant recycling, and detailed audit documentation.' },
  { q: 'Do you offer ongoing support after projects?', a: 'Yes — all development and cloud projects include a post-launch support period, and we offer ongoing managed service contracts for long-term support.' },
  { q: 'Are you Microsoft and AWS certified?', a: 'Yes, we hold partnerships and certifications with Microsoft, AWS, and Google Cloud, along with a range of cybersecurity and IT management accreditations.' },
  { q: 'Can you work with our existing IT team?', a: 'Absolutely. We frequently collaborate as an extension of in-house IT teams, providing specialist skills and capacity where they\'re needed most.' },
];

// ─── STATS ────────────────────────────────────────────────
export const stats = [
  { num: 25, suffix: '+', label: 'Years Experience' },
  { num: 500, suffix: '+', label: 'Clients Worldwide' },
  { num: 40, suffix: '+', label: 'IT Services' },
  { num: 99, suffix: '%', label: 'Client Satisfaction' },
];

// ─── TECH STACK ───────────────────────────────────────────
export const techStack = [
  { icon: '☁️', name: 'AWS' }, { icon: '🔵', name: 'Azure' },
  { icon: '🟡', name: 'Google Cloud' }, { icon: '⚛️', name: 'React' },
  { icon: '🐍', name: 'Python' }, { icon: '🟢', name: 'Node.js' },
  { icon: '🐋', name: 'Docker' }, { icon: '☸️', name: 'Kubernetes' },
  { icon: '🔴', name: 'Laravel' }, { icon: '🛡️', name: 'Cisco' },
  { icon: '📊', name: 'Power BI' }, { icon: '🤖', name: 'OpenAI' },
  { icon: '📱', name: 'React Native' }, { icon: '🗄️', name: 'PostgreSQL' },
];
