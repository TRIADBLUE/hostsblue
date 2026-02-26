import type { WebsiteTheme, WebsiteBlock } from '../block-types.js';
import { generateBlockId } from '../block-types.js';

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  theme: WebsiteTheme;
  pages: TemplatePage[];
}

interface TemplatePage {
  slug: string;
  title: string;
  isHomePage: boolean;
  showInNav: boolean;
  blocks: WebsiteBlock[];
}

function blk(type: WebsiteBlock['type'], data: Record<string, any>): WebsiteBlock {
  return { id: generateBlockId(), type, data, style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' } };
}

// ============================================================================
// 1. BUSINESS PRO
// ============================================================================

const businessPro: WebsiteTemplate = {
  id: 'business-pro',
  name: 'Business Pro',
  description: 'Professional services — clean, trustworthy, conversion-focused.',
  category: 'Agency',
  thumbnail: 'https://placehold.co/400x250/1E3A5F/ffffff?text=Business+Pro',
  theme: {
    primaryColor: '#1E3A5F', secondaryColor: '#3B82F6', accentColor: '#10B981',
    bgColor: '#ffffff', textColor: '#1E293B', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Expert Solutions for Your Business', subheading: 'We deliver results-driven strategies to help your business thrive in a competitive marketplace.', ctaText: 'Schedule a Consultation', ctaLink: '/contact', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: 'Why Choose Us', subheading: 'Trusted by hundreds of businesses worldwide.', columns: 3, items: [
          { icon: 'trophy', title: 'Proven Track Record', description: 'Over 10 years of delivering exceptional results for our clients.' },
          { icon: 'users', title: 'Dedicated Team', description: 'A team of specialists committed to your success.' },
          { icon: 'trending-up', title: 'Growth-Focused', description: 'Strategies designed to accelerate your business growth.' },
        ] }),
        blk('stats', { items: [{ value: '500', label: 'Projects Completed', suffix: '+' }, { value: '98', label: 'Client Satisfaction', suffix: '%' }, { value: '15', label: 'Years Experience', suffix: '+' }, { value: '50', label: 'Team Members', suffix: '+' }] }),
        blk('testimonials', { heading: 'Client Success Stories', layout: 'cards', items: [
          { quote: 'They transformed our entire digital presence. Revenue up 40% in 6 months.', name: 'Sarah Mitchell', role: 'CEO, GrowthTech' },
          { quote: 'Professional, responsive, and truly understood our vision.', name: 'James Wong', role: 'Founder, InnovateCo' },
        ] }),
        blk('cta', { heading: 'Ready to Grow Your Business?', text: 'Get a free consultation and discover how we can help.', buttonText: 'Get Started Today', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Contact', href: '/contact' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'Learn about our mission, values, and the team behind our success.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<h2>Our Story</h2><p>Founded with a passion for helping businesses succeed, we have grown from a small consultancy into a full-service agency trusted by companies worldwide. Our approach combines strategic thinking with hands-on execution to deliver measurable results.</p>' }),
        blk('team', { heading: 'Our Leadership', members: [
          { name: 'Alex Thompson', role: 'CEO & Founder', photo: 'https://placehold.co/200x200/1E3A5F/ffffff?text=AT' },
          { name: 'Maria Garcia', role: 'VP of Operations', photo: 'https://placehold.co/200x200/3B82F6/ffffff?text=MG' },
          { name: 'David Chen', role: 'Creative Director', photo: 'https://placehold.co/200x200/10B981/ffffff?text=DC' },
        ] }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Services', subheading: 'Comprehensive solutions tailored to your needs.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: 'What We Offer', columns: 3, items: [
          { icon: 'target', title: 'Strategy Consulting', description: 'Data-driven strategies to position your business for growth.' },
          { icon: 'palette', title: 'Brand Design', description: 'Compelling visual identities that stand out.' },
          { icon: 'code', title: 'Digital Solutions', description: 'Custom technology solutions for modern businesses.' },
        ] }),
        blk('pricing', { heading: 'Service Packages', columns: [
          { name: 'Starter', price: '$999', period: '/project', features: ['Brand Audit', 'Strategy Session', 'Basic Deliverables'], ctaText: 'Learn More', highlighted: false },
          { name: 'Growth', price: '$2,499', period: '/month', features: ['Everything in Starter', 'Ongoing Strategy', 'Monthly Reports', 'Dedicated Manager'], ctaText: 'Get Started', highlighted: true },
          { name: 'Enterprise', price: 'Custom', period: '', features: ['Full-Service Partnership', 'Custom Solutions', 'Priority Support', 'Quarterly Reviews'], ctaText: 'Contact Us', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Contact', href: '/contact' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Contact Us', subheading: 'We\'d love to hear from you. Get in touch today.', layout: 'simple', alignment: 'center' }),
        blk('contact', { heading: 'Send Us a Message', showForm: true, email: 'hello@example.com', phone: '(555) 123-4567', address: '123 Business Ave, Suite 100, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 2. RESTAURANT
// ============================================================================

const restaurant: WebsiteTemplate = {
  id: 'restaurant',
  name: 'Restaurant',
  description: 'Warm, appetizing design for restaurants, cafes, and food businesses.',
  category: 'Restaurant',
  thumbnail: 'https://placehold.co/400x250/7C2D12/ffffff?text=Restaurant',
  theme: {
    primaryColor: '#7C2D12', secondaryColor: '#EA580C', accentColor: '#F59E0B',
    bgColor: '#FFFBEB', textColor: '#1C1917', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Reserve a Table', ctaLink: '/contact' }),
        blk('hero', { heading: 'A Culinary Experience Like No Other', subheading: 'Fresh ingredients, bold flavors, and a welcoming atmosphere.', ctaText: 'View Our Menu', ctaLink: '/menu', secondaryCtaText: 'Make a Reservation', secondaryCtaLink: '/contact', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/7C2D12/ffffff?text=Restaurant+Hero' }),
        blk('features', { heading: 'Why Dine With Us', columns: 3, items: [
          { icon: 'utensils', title: 'Fresh Ingredients', description: 'Locally sourced, seasonal ingredients in every dish.' },
          { icon: 'wine', title: 'Curated Wine List', description: 'An extensive selection of wines from around the world.' },
          { icon: 'heart', title: 'Made with Love', description: 'Every dish is crafted with passion by our expert chefs.' },
        ] }),
        blk('gallery', { heading: 'From Our Kitchen', columns: 3, images: [
          { src: 'https://placehold.co/400x300/7C2D12/ffffff?text=Dish+1', alt: 'Signature dish' },
          { src: 'https://placehold.co/400x300/EA580C/ffffff?text=Dish+2', alt: 'Chef special' },
          { src: 'https://placehold.co/400x300/F59E0B/ffffff?text=Dish+3', alt: 'Dessert' },
        ] }),
        blk('testimonials', { heading: 'What Our Guests Say', layout: 'cards', items: [
          { quote: 'The best dining experience in town. Every dish was perfection.', name: 'Michael R.', role: 'Food Critic' },
          { quote: 'A hidden gem! The atmosphere and food are simply outstanding.', name: 'Lisa T.', role: 'Regular Guest' },
        ] }),
        blk('cta', { heading: 'Join Us for Dinner', text: 'Make a reservation and experience culinary excellence.', buttonText: 'Reserve a Table', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'menu', title: 'Menu', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Reserve a Table', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Menu', subheading: 'Crafted with love using the finest seasonal ingredients.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: 'Starters', columns: [
          { name: 'Bruschetta', price: '$12', features: ['Heirloom tomatoes', 'Fresh basil', 'Aged balsamic'], ctaText: '', highlighted: false },
          { name: 'Soup of the Day', price: '$10', features: ['Seasonal recipe', 'Artisan bread'], ctaText: '', highlighted: false },
          { name: 'Caesar Salad', price: '$14', features: ['Romaine hearts', 'House croutons', 'Parmesan'], ctaText: '', highlighted: true },
        ] }),
        blk('pricing', { heading: 'Main Courses', columns: [
          { name: 'Grilled Salmon', price: '$28', features: ['Wild-caught', 'Seasonal vegetables', 'Lemon butter'], ctaText: '', highlighted: false },
          { name: 'Filet Mignon', price: '$42', features: ['8oz prime cut', 'Truffle mash', 'Red wine jus'], ctaText: '', highlighted: true },
          { name: 'Pasta Primavera', price: '$22', features: ['Fresh vegetables', 'Handmade pasta', 'Herb cream sauce'], ctaText: '', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Reserve a Table', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Story', subheading: 'A passion for food, a commitment to excellence.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Founded in 2010, our restaurant has been a cornerstone of the local dining scene. We believe in the power of great food to bring people together. Every dish on our menu is prepared with locally-sourced ingredients and time-honored techniques passed down through generations.</p>' }),
        blk('team', { heading: 'Meet Our Chefs', members: [
          { name: 'Chef Marco', role: 'Executive Chef', photo: 'https://placehold.co/200x200/7C2D12/ffffff?text=CM' },
          { name: 'Chef Sophia', role: 'Pastry Chef', photo: 'https://placehold.co/200x200/EA580C/ffffff?text=CS' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Reserve a Table', ctaLink: '/contact' }),
        blk('hero', { heading: 'Visit Us', subheading: 'We\'d love to welcome you.', layout: 'simple', alignment: 'center' }),
        blk('contact', { heading: 'Reservations & Contact', showForm: true, email: 'reservations@example.com', phone: '(555) 987-6543', address: '456 Culinary Blvd, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 3. CREATIVE PORTFOLIO
// ============================================================================

const creativePortfolio: WebsiteTemplate = {
  id: 'creative-portfolio',
  name: 'Creative Portfolio',
  description: 'Image-heavy, minimal design for creatives and designers.',
  category: 'Freelancer',
  thumbnail: 'https://placehold.co/400x250/7C3AED/ffffff?text=Portfolio',
  theme: {
    primaryColor: '#7C3AED', secondaryColor: '#EC4899', accentColor: '#F0ABFC',
    bgColor: '#FAF5FF', textColor: '#1E1B4B', fontHeading: 'Space Grotesk', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Work', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'Creative Design & Strategy', subheading: 'Helping brands tell their story through beautiful design.', ctaText: 'View My Work', ctaLink: '/portfolio', layout: 'split', alignment: 'left' }),
        blk('gallery', { heading: 'Selected Work', columns: 2, images: [
          { src: 'https://placehold.co/600x400/7C3AED/ffffff?text=Project+1', alt: 'Brand Identity' },
          { src: 'https://placehold.co/600x400/EC4899/ffffff?text=Project+2', alt: 'Web Design' },
          { src: 'https://placehold.co/600x400/F0ABFC/333333?text=Project+3', alt: 'Illustration' },
          { src: 'https://placehold.co/600x400/6D28D9/ffffff?text=Project+4', alt: 'Photography' },
        ] }),
        blk('logo-cloud', { heading: 'Brands I\'ve Worked With', logos: [
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Brand+1', alt: 'Brand 1' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Brand+2', alt: 'Brand 2' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Brand+3', alt: 'Brand 3' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Brand+4', alt: 'Brand 4' },
        ] }),
        blk('cta', { heading: 'Let\'s Create Something Amazing', text: 'I\'m available for freelance projects and collaborations.', buttonText: 'Get in Touch', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'portfolio', title: 'Portfolio', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Work', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'My Portfolio', subheading: 'A curated collection of my recent work.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { heading: '', columns: 3, images: [
          { src: 'https://placehold.co/400x300/7C3AED/ffffff?text=Project+1', alt: 'Project 1' },
          { src: 'https://placehold.co/400x300/EC4899/ffffff?text=Project+2', alt: 'Project 2' },
          { src: 'https://placehold.co/400x300/F0ABFC/333333?text=Project+3', alt: 'Project 3' },
          { src: 'https://placehold.co/400x300/6D28D9/ffffff?text=Project+4', alt: 'Project 4' },
          { src: 'https://placehold.co/400x300/A855F7/ffffff?text=Project+5', alt: 'Project 5' },
          { src: 'https://placehold.co/400x300/D946EF/ffffff?text=Project+6', alt: 'Project 6' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Work', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'About Me', subheading: 'Designer, thinker, maker.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>I\'m a multidisciplinary designer with over 8 years of experience creating beautiful, functional digital experiences. I believe great design is about solving problems — not just making things look pretty.</p><p>When I\'m not designing, you\'ll find me exploring new cities, sketching in coffee shops, or experimenting with new creative tools.</p>' }),
        blk('stats', { items: [{ value: '100', label: 'Projects Completed', suffix: '+' }, { value: '8', label: 'Years Experience', suffix: '+' }, { value: '30', label: 'Happy Clients', suffix: '+' }] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Work', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('contact', { heading: 'Let\'s Talk', showForm: true, email: 'hello@example.com' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 4. STARTUP LANDING
// ============================================================================

const startupLanding: WebsiteTemplate = {
  id: 'startup-landing',
  name: 'Startup Landing',
  description: 'Single-page, conversion-focused design for SaaS and tech startups.',
  category: 'Startup',
  thumbnail: 'https://placehold.co/400x250/0F172A/38BDF8?text=Startup',
  theme: {
    primaryColor: '#0F172A', secondaryColor: '#38BDF8', accentColor: '#22D3EE',
    bgColor: '#F8FAFC', textColor: '#0F172A', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'FAQ', href: '#faq' }], ctaText: 'Get Started Free', ctaLink: '#cta' }),
        blk('hero', { heading: 'Build Faster. Ship Smarter.', subheading: 'The all-in-one platform for modern teams to build, deploy, and scale.', ctaText: 'Start Free Trial', ctaLink: '#', secondaryCtaText: 'Watch Demo', secondaryCtaLink: '#', layout: 'simple', alignment: 'center' }),
        blk('logo-cloud', { heading: 'Trusted by innovative teams', logos: [
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Company+1', alt: 'Company 1' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Company+2', alt: 'Company 2' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Company+3', alt: 'Company 3' },
          { src: 'https://placehold.co/120x40/cccccc/666666?text=Company+4', alt: 'Company 4' },
        ] }),
        blk('features', { heading: 'Everything You Need', subheading: 'Powerful features to help your team move faster.', columns: 3, items: [
          { icon: 'zap', title: 'Lightning Fast', description: 'Optimized for speed so your team never waits.' },
          { icon: 'lock', title: 'Secure by Default', description: 'Enterprise-grade security without the complexity.' },
          { icon: 'bar-chart', title: 'Analytics Built-In', description: 'Track everything that matters to your business.' },
          { icon: 'git-branch', title: 'Version Control', description: 'Built-in versioning and collaboration tools.' },
          { icon: 'globe', title: 'Global CDN', description: 'Deploy to 200+ edge locations worldwide.' },
          { icon: 'code', title: 'API First', description: 'Extensible API for custom integrations.' },
        ] }),
        blk('stats', { items: [{ value: '10k', label: 'Active Users', suffix: '+' }, { value: '99.9', label: 'Uptime', suffix: '%' }, { value: '50', label: 'Countries', suffix: '+' }, { value: '4.9', label: 'Rating', prefix: '' }] }),
        blk('pricing', { heading: 'Simple, Transparent Pricing', subheading: 'No hidden fees. Cancel anytime.', columns: [
          { name: 'Hobby', price: '$0', period: '/month', features: ['1 Project', '1GB Storage', 'Community Support'], ctaText: 'Start Free', highlighted: false },
          { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Custom Domains', 'Analytics'], ctaText: 'Start Trial', highlighted: true },
          { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated Support', 'SLA', 'Custom Integrations'], ctaText: 'Contact Sales', highlighted: false },
        ] }),
        blk('testimonials', { heading: 'Loved by Developers', layout: 'cards', items: [
          { quote: 'This tool cut our deployment time from hours to minutes. Game changer.', name: 'Emily Zhang', role: 'CTO, DevFlow' },
          { quote: 'Finally a platform that just works. No more wrestling with infrastructure.', name: 'Marcus Johnson', role: 'Lead Engineer, ScaleUp' },
          { quote: 'The best developer experience I\'ve ever had.', name: 'Priya Patel', role: 'Solo Developer' },
        ] }),
        blk('faq', { heading: 'Frequently Asked Questions', items: [
          { question: 'Is there a free plan?', answer: 'Yes! Our Hobby plan is completely free and includes everything you need to get started.' },
          { question: 'Can I cancel anytime?', answer: 'Absolutely. No contracts, no cancellation fees. You can cancel or change plans at any time.' },
          { question: 'Do you offer refunds?', answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans.' },
        ] }),
        blk('cta', { heading: 'Ready to Build?', text: 'Start for free — no credit card required.', buttonText: 'Get Started Now', buttonLink: '#' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'FAQ', href: '#faq' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 5. E-COMMERCE
// ============================================================================

const ecommerce: WebsiteTemplate = {
  id: 'ecommerce',
  name: 'E-Commerce',
  description: 'Product grid, pricing, and shopping-focused layout.',
  category: 'Retail',
  thumbnail: 'https://placehold.co/400x250/047857/ffffff?text=E-Commerce',
  theme: {
    primaryColor: '#047857', secondaryColor: '#059669', accentColor: '#FCD34D',
    bgColor: '#ffffff', textColor: '#1F2937', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Shop Now', ctaLink: '/shop' }),
        blk('hero', { heading: 'Quality Products, Fair Prices', subheading: 'Discover our curated collection of products designed for modern living.', ctaText: 'Browse Collection', ctaLink: '/shop', layout: 'split', alignment: 'left' }),
        blk('features', { heading: 'Why Shop With Us', columns: 4, items: [
          { icon: 'truck', title: 'Free Shipping', description: 'On all orders over $50' },
          { icon: 'refresh-cw', title: 'Easy Returns', description: '30-day return policy' },
          { icon: 'shield', title: 'Secure Checkout', description: '256-bit SSL encryption' },
          { icon: 'headphones', title: 'Support 24/7', description: 'Always here to help' },
        ] }),
        blk('gallery', { heading: 'Featured Products', columns: 4, images: [
          { src: 'https://placehold.co/300x300/047857/ffffff?text=Product+1', alt: 'Product 1' },
          { src: 'https://placehold.co/300x300/059669/ffffff?text=Product+2', alt: 'Product 2' },
          { src: 'https://placehold.co/300x300/10B981/ffffff?text=Product+3', alt: 'Product 3' },
          { src: 'https://placehold.co/300x300/34D399/333333?text=Product+4', alt: 'Product 4' },
        ] }),
        blk('testimonials', { heading: 'Happy Customers', layout: 'cards', items: [
          { quote: 'Amazing quality and fast shipping. Will definitely order again!', name: 'Rachel K.', role: 'Verified Buyer' },
          { quote: 'Best customer service I\'ve experienced online. Highly recommend.', name: 'Tom S.', role: 'Verified Buyer' },
        ] }),
        blk('cta', { heading: 'Join Our Newsletter', text: 'Get 10% off your first order and stay updated on new arrivals.', buttonText: 'Subscribe', buttonLink: '#' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], [{ label: 'Shipping Policy', href: '/shipping' }, { label: 'Returns', href: '/returns' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'shop', title: 'Shop', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Shop Now', ctaLink: '/shop' }),
        blk('hero', { heading: 'All Products', subheading: 'Browse our full collection.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { columns: 4, images: [
          { src: 'https://placehold.co/300x300/047857/ffffff?text=Product+1', alt: 'Product 1' },
          { src: 'https://placehold.co/300x300/059669/ffffff?text=Product+2', alt: 'Product 2' },
          { src: 'https://placehold.co/300x300/10B981/ffffff?text=Product+3', alt: 'Product 3' },
          { src: 'https://placehold.co/300x300/34D399/333333?text=Product+4', alt: 'Product 4' },
          { src: 'https://placehold.co/300x300/6EE7B7/333333?text=Product+5', alt: 'Product 5' },
          { src: 'https://placehold.co/300x300/A7F3D0/333333?text=Product+6', alt: 'Product 6' },
          { src: 'https://placehold.co/300x300/047857/ffffff?text=Product+7', alt: 'Product 7' },
          { src: 'https://placehold.co/300x300/059669/ffffff?text=Product+8', alt: 'Product 8' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'Our Story', subheading: 'Passionate about quality since day one.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>We started with a simple idea: everyone deserves access to quality products at fair prices. Today, we\'re proud to serve thousands of customers who share our values.</p>' }),
        blk('stats', { items: [{ value: '10k', label: 'Orders Shipped', suffix: '+' }, { value: '4.8', label: 'Average Rating', prefix: '' }, { value: '98', label: 'Return Rate', suffix: '%' }] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Shop', href: '/shop' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('contact', { heading: 'Customer Support', showForm: true, email: 'support@example.com', phone: '1-800-EXAMPLE' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 6. BLOG
// ============================================================================

const blog: WebsiteTemplate = {
  id: 'blog',
  name: 'Blog',
  description: 'Content-first layout for writers, bloggers, and thought leaders.',
  category: 'Blog',
  thumbnail: 'https://placehold.co/400x250/1E40AF/ffffff?text=Blog',
  theme: {
    primaryColor: '#1E40AF', secondaryColor: '#3B82F6', accentColor: '#93C5FD',
    bgColor: '#F8FAFC', textColor: '#1E293B', fontHeading: 'Merriweather', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'Thoughts, Stories & Ideas', subheading: 'A blog about technology, design, and the future of work.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<h2>Latest Post: The Future of Remote Work</h2><p>As more companies embrace distributed teams, the way we think about work is fundamentally changing. Here\'s what I\'ve learned after 5 years of working remotely...</p><p><a href="#">Read more →</a></p>' }),
        blk('text', { content: '<h2>Design Systems at Scale</h2><p>Building and maintaining a design system across a large organization isn\'t easy, but it\'s one of the most impactful investments a team can make...</p><p><a href="#">Read more →</a></p>' }),
        blk('cta', { heading: 'Subscribe to My Newsletter', text: 'Get weekly insights delivered straight to your inbox.', buttonText: 'Subscribe', buttonLink: '#' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'About Me', subheading: 'Writer, technologist, lifelong learner.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>I\'m a technology writer and consultant based in San Francisco. I write about design, development, and the intersection of technology and human experience. My work has appeared in major publications and I regularly speak at industry conferences.</p>' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('contact', { heading: 'Get in Touch', showForm: true, email: 'hello@example.com' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 7. NONPROFIT
// ============================================================================

const nonprofit: WebsiteTemplate = {
  id: 'nonprofit',
  name: 'Nonprofit',
  description: 'Mission-driven design with donation CTA and impact stats.',
  category: 'Nonprofit',
  thumbnail: 'https://placehold.co/400x250/166534/ffffff?text=Nonprofit',
  theme: {
    primaryColor: '#166534', secondaryColor: '#16A34A', accentColor: '#FCD34D',
    bgColor: '#F0FDF4', textColor: '#14532D', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Impact', href: '/impact' }, { label: 'Contact', href: '/contact' }], ctaText: 'Donate Now', ctaLink: '#donate' }),
        blk('hero', { heading: 'Making a Difference, Together', subheading: 'Join us in our mission to create lasting change in communities worldwide.', ctaText: 'Donate Now', ctaLink: '#donate', secondaryCtaText: 'Learn More', secondaryCtaLink: '/about', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/166534/ffffff?text=Mission' }),
        blk('stats', { items: [{ value: '50k', label: 'Lives Impacted', suffix: '+' }, { value: '120', label: 'Communities Served', suffix: '' }, { value: '15', label: 'Countries', suffix: '' }, { value: '$2M', label: 'Raised', prefix: '' }] }),
        blk('features', { heading: 'Our Programs', columns: 3, items: [
          { icon: 'book', title: 'Education', description: 'Providing quality education to underserved communities.' },
          { icon: 'heart', title: 'Healthcare', description: 'Access to essential healthcare services for all.' },
          { icon: 'home', title: 'Housing', description: 'Building safe, affordable housing for families in need.' },
        ] }),
        blk('testimonials', { heading: 'Stories of Impact', layout: 'cards', items: [
          { quote: 'Thanks to this organization, my children now have access to education.', name: 'Maria L.', role: 'Program Beneficiary' },
          { quote: 'The work they do is transformative. Proud to be a monthly donor.', name: 'Robert K.', role: 'Donor since 2020' },
        ] }),
        blk('cta', { heading: 'Help Us Make a Difference', text: 'Every donation, no matter the size, helps us create lasting change.', buttonText: 'Donate Now', buttonLink: '#donate' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Impact', href: '/impact' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved. 501(c)(3) nonprofit.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Impact', href: '/impact' }, { label: 'Contact', href: '/contact' }], ctaText: 'Donate Now', ctaLink: '#donate' }),
        blk('hero', { heading: 'Our Mission', subheading: 'Empowering communities through sustainable programs.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Founded in 2015, our organization has grown from a small community initiative into a global force for good. We believe that every person deserves access to education, healthcare, and safe housing. Our programs are designed to create lasting, sustainable change.</p>' }),
        blk('team', { heading: 'Our Leadership', members: [
          { name: 'Dr. Amanda Fields', role: 'Executive Director', photo: 'https://placehold.co/200x200/166534/ffffff?text=AF' },
          { name: 'James Rivera', role: 'Director of Programs', photo: 'https://placehold.co/200x200/16A34A/ffffff?text=JR' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'impact', title: 'Impact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Impact', href: '/impact' }, { label: 'Contact', href: '/contact' }], ctaText: 'Donate Now', ctaLink: '#donate' }),
        blk('hero', { heading: 'Our Impact', subheading: 'Real numbers, real change.', layout: 'simple', alignment: 'center' }),
        blk('stats', { items: [{ value: '50k', label: 'Lives Impacted', suffix: '+' }, { value: '120', label: 'Communities', suffix: '' }, { value: '500', label: 'Volunteers', suffix: '+' }, { value: '$2M', label: 'Donated', prefix: '' }] }),
        blk('gallery', { heading: 'From the Field', columns: 3, images: [
          { src: 'https://placehold.co/400x300/166534/ffffff?text=Impact+1', alt: 'Education program' },
          { src: 'https://placehold.co/400x300/16A34A/ffffff?text=Impact+2', alt: 'Healthcare outreach' },
          { src: 'https://placehold.co/400x300/22C55E/ffffff?text=Impact+3', alt: 'Housing project' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Impact', href: '/impact' }, { label: 'Contact', href: '/contact' }], ctaText: 'Donate Now', ctaLink: '#donate' }),
        blk('contact', { heading: 'Get Involved', showForm: true, email: 'info@example.org', phone: '(555) 000-1234', address: '789 Mission Drive, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 8. FREELANCER
// ============================================================================

const freelancer: WebsiteTemplate = {
  id: 'freelancer',
  name: 'Freelancer',
  description: 'Personal brand with services, testimonials, and booking CTA.',
  category: 'Freelancer',
  thumbnail: 'https://placehold.co/400x250/0F172A/F1F5F9?text=Freelancer',
  theme: {
    primaryColor: '#0F172A', secondaryColor: '#6366F1', accentColor: '#F59E0B',
    bgColor: '#ffffff', textColor: '#0F172A', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Hire Me', ctaLink: '/contact' }),
        blk('hero', { heading: 'I Help Businesses Grow Online', subheading: 'Freelance developer & consultant specializing in web applications and digital strategy.', ctaText: 'View Services', ctaLink: '/services', secondaryCtaText: 'Let\'s Talk', secondaryCtaLink: '/contact', layout: 'split', alignment: 'left' }),
        blk('features', { heading: 'What I Do', columns: 3, items: [
          { icon: 'code', title: 'Web Development', description: 'Custom websites and web applications built with modern technologies.' },
          { icon: 'smartphone', title: 'Mobile-First Design', description: 'Responsive designs that look great on every device.' },
          { icon: 'trending-up', title: 'Growth Strategy', description: 'Digital strategy and SEO to drive traffic and conversions.' },
        ] }),
        blk('stats', { items: [{ value: '7', label: 'Years Freelancing', suffix: '+' }, { value: '150', label: 'Projects Delivered', suffix: '+' }, { value: '5.0', label: 'Client Rating', prefix: '' }, { value: '48', label: 'Avg. Turnaround', suffix: 'h' }] }),
        blk('testimonials', { heading: 'Client Reviews', layout: 'cards', items: [
          { quote: 'Delivered our project ahead of schedule and exceeded every expectation.', name: 'Kate Williams', role: 'Startup Founder' },
          { quote: 'Incredibly skilled developer with a great eye for design.', name: 'Mark Chen', role: 'Product Manager' },
          { quote: 'Our go-to freelancer for all web projects. Reliable and talented.', name: 'Susan Hayes', role: 'Marketing Director' },
        ] }),
        blk('cta', { heading: 'Have a Project in Mind?', text: 'I\'m currently available for new projects. Let\'s discuss how I can help.', buttonText: 'Get in Touch', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Hire Me', ctaLink: '/contact' }),
        blk('hero', { heading: 'Services & Pricing', subheading: 'Transparent pricing, no surprises.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: '', columns: [
          { name: 'Basic Website', price: '$2,500', period: 'one-time', features: ['5 Pages', 'Responsive Design', 'Contact Form', 'SEO Setup'], ctaText: 'Get Quote', highlighted: false },
          { name: 'Web Application', price: '$5,000', period: 'starting at', features: ['Custom Features', 'Database Integration', 'User Authentication', 'Admin Dashboard', '3 Months Support'], ctaText: 'Get Quote', highlighted: true },
          { name: 'Monthly Retainer', price: '$1,500', period: '/month', features: ['20 Hours/Month', 'Priority Support', 'Ongoing Development', 'Performance Monitoring'], ctaText: 'Get Quote', highlighted: false },
        ] }),
        blk('faq', { heading: 'Common Questions', items: [
          { question: 'What\'s your typical timeline?', answer: 'Most projects are completed within 2-6 weeks depending on complexity.' },
          { question: 'Do you offer ongoing support?', answer: 'Yes, I offer monthly retainer packages for ongoing development and support.' },
          { question: 'What technologies do you use?', answer: 'I primarily work with React, Node.js, TypeScript, and modern web frameworks.' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Hire Me', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Me', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>I\'m a freelance web developer with over 7 years of experience helping businesses establish and grow their online presence. I combine technical expertise with strategic thinking to deliver solutions that don\'t just look great — they drive real business results.</p><p>When I\'m not coding, you\'ll find me hiking, reading, or experimenting with new technologies.</p>' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Hire Me', ctaLink: '/contact' }),
        blk('contact', { heading: 'Let\'s Work Together', showForm: true, email: 'hello@example.com' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// EXPORT ALL TEMPLATES
// ============================================================================

export const templates: WebsiteTemplate[] = [
  businessPro,
  restaurant,
  creativePortfolio,
  startupLanding,
  ecommerce,
  blog,
  nonprofit,
  freelancer,
];

export function getTemplateById(id: string): WebsiteTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return templates.filter(t => t.category === category);
}
