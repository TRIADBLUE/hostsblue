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
// 9. REAL ESTATE
// ============================================================================

const realEstate: WebsiteTemplate = {
  id: 'real-estate',
  name: 'Real Estate',
  description: 'Polished design for realtors, brokers, and property listings.',
  category: 'Real Estate',
  thumbnail: 'https://placehold.co/400x250/1E3A5F/ffffff?text=Real+Estate',
  theme: {
    primaryColor: '#1E3A5F', secondaryColor: '#2563EB', accentColor: '#D4AF37',
    bgColor: '#ffffff', textColor: '#1E293B', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Listings', href: '/listings' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Schedule Viewing', ctaLink: '/contact' }),
        blk('hero', { heading: 'Find Your Dream Home', subheading: 'Expert guidance through every step of buying, selling, or investing in real estate.', ctaText: 'View Listings', ctaLink: '/listings', secondaryCtaText: 'Free Consultation', secondaryCtaLink: '/contact', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/1E3A5F/ffffff?text=Luxury+Home' }),
        blk('stats', { items: [{ value: '500', label: 'Properties Sold', suffix: '+' }, { value: '98', label: 'Client Satisfaction', suffix: '%' }, { value: '$200M', label: 'In Sales Volume', prefix: '' }, { value: '15', label: 'Years Experience', suffix: '+' }] }),
        blk('features', { heading: 'Why Work With Us', columns: 3, items: [
          { icon: 'home', title: 'Local Expertise', description: 'Deep knowledge of neighborhoods, schools, and market trends.' },
          { icon: 'trending-up', title: 'Top Negotiator', description: 'We fight for the best deal on every transaction.' },
          { icon: 'shield', title: 'Full Service', description: 'From listing to closing, we handle everything.' },
        ] }),
        blk('gallery', { heading: 'Featured Properties', columns: 3, images: [
          { src: 'https://placehold.co/400x300/1E3A5F/ffffff?text=Property+1', alt: 'Waterfront Estate' },
          { src: 'https://placehold.co/400x300/2563EB/ffffff?text=Property+2', alt: 'Modern Condo' },
          { src: 'https://placehold.co/400x300/D4AF37/333333?text=Property+3', alt: 'Family Home' },
        ] }),
        blk('testimonials', { heading: 'Happy Homeowners', layout: 'cards', items: [
          { quote: 'Found our perfect home in just two weeks. Incredible service!', name: 'The Johnsons', role: 'First-Time Buyers' },
          { quote: 'Sold our house for 15% above asking price. Truly exceptional.', name: 'David & Maria', role: 'Home Sellers' },
        ] }),
        blk('cta', { heading: 'Ready to Make a Move?', text: 'Whether buying, selling, or investing — let\'s talk about your goals.', buttonText: 'Get Started', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Listings', href: '/listings' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'listings', title: 'Listings', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Listings', href: '/listings' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Schedule Viewing', ctaLink: '/contact' }),
        blk('hero', { heading: 'Current Listings', subheading: 'Browse our available properties.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { heading: '', columns: 3, images: [
          { src: 'https://placehold.co/400x300/1E3A5F/ffffff?text=$425,000', alt: '3BR/2BA Colonial — Oak Street' },
          { src: 'https://placehold.co/400x300/2563EB/ffffff?text=$650,000', alt: '4BR/3BA Modern — Lake View' },
          { src: 'https://placehold.co/400x300/D4AF37/333333?text=$320,000', alt: '2BR/2BA Condo — Downtown' },
          { src: 'https://placehold.co/400x300/1E3A5F/ffffff?text=$1.2M', alt: '5BR/4BA Estate — Hilltop' },
          { src: 'https://placehold.co/400x300/2563EB/ffffff?text=$275,000', alt: '2BR/1BA Bungalow — Elm St' },
          { src: 'https://placehold.co/400x300/D4AF37/333333?text=$550,000', alt: '3BR/2BA Ranch — Maple Dr' },
        ] }),
        blk('cta', { heading: 'Don\'t See What You\'re Looking For?', text: 'We have access to off-market properties. Let us know your criteria.', buttonText: 'Contact Us', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Listings', href: '/listings' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Schedule Viewing', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'Your trusted real estate partner.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>With over 15 years in the local market, we bring unmatched expertise to every transaction. Whether you\'re a first-time buyer, seasoned investor, or looking to sell, our team provides personalized service every step of the way.</p>' }),
        blk('team', { heading: 'Our Agents', members: [
          { name: 'Jennifer Adams', role: 'Principal Broker', photo: 'https://placehold.co/200x200/1E3A5F/ffffff?text=JA' },
          { name: 'Michael Torres', role: 'Senior Agent', photo: 'https://placehold.co/200x200/2563EB/ffffff?text=MT' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Listings', href: '/listings' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Schedule Viewing', ctaLink: '/contact' }),
        blk('contact', { heading: 'Schedule a Consultation', showForm: true, email: 'info@example.com', phone: '(555) 234-5678', address: '100 Main Street, Suite 200, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 10. LAW FIRM
// ============================================================================

const lawFirm: WebsiteTemplate = {
  id: 'law-firm',
  name: 'Law Firm',
  description: 'Authoritative, trust-building design for attorneys and legal practices.',
  category: 'Professional',
  thumbnail: 'https://placehold.co/400x250/1C1917/D4AF37?text=Law+Firm',
  theme: {
    primaryColor: '#1C1917', secondaryColor: '#78350F', accentColor: '#D4AF37',
    bgColor: '#FAFAF9', textColor: '#1C1917', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Practice Areas', href: '/practice-areas' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Experienced Legal Counsel You Can Trust', subheading: 'Dedicated advocacy and personalized legal solutions for individuals and businesses.', ctaText: 'Schedule Consultation', ctaLink: '/contact', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: 'Practice Areas', columns: 3, items: [
          { icon: 'briefcase', title: 'Business Law', description: 'Corporate formation, contracts, mergers and acquisitions.' },
          { icon: 'shield', title: 'Litigation', description: 'Aggressive representation in civil and commercial disputes.' },
          { icon: 'home', title: 'Real Estate', description: 'Residential and commercial real estate transactions.' },
        ] }),
        blk('stats', { items: [{ value: '2,000', label: 'Cases Won', suffix: '+' }, { value: '25', label: 'Years of Practice', suffix: '+' }, { value: '98', label: 'Success Rate', suffix: '%' }, { value: '5', label: 'Attorneys', suffix: '' }] }),
        blk('testimonials', { heading: 'Client Testimonials', layout: 'cards', items: [
          { quote: 'Exceptional legal representation. They fought for us and won.', name: 'Richard M.', role: 'Business Owner' },
          { quote: 'Professional, knowledgeable, and genuinely caring. Highly recommend.', name: 'Sarah P.', role: 'Personal Injury Client' },
        ] }),
        blk('cta', { heading: 'Need Legal Help?', text: 'Contact us for a free, no-obligation consultation.', buttonText: 'Get Free Consultation', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Practice Areas', href: '/practice-areas' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'practice-areas', title: 'Practice Areas', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Practice Areas', href: '/practice-areas' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Practice Areas', subheading: 'Comprehensive legal services for all your needs.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: '', columns: 2, items: [
          { icon: 'briefcase', title: 'Business & Corporate Law', description: 'Entity formation, contracts, compliance, mergers & acquisitions, and shareholder disputes.' },
          { icon: 'shield', title: 'Civil Litigation', description: 'Commercial disputes, breach of contract, insurance claims, and appellate work.' },
          { icon: 'home', title: 'Real Estate Law', description: 'Purchases, sales, leasing, zoning, title disputes, and landlord-tenant matters.' },
          { icon: 'users', title: 'Family Law', description: 'Divorce, custody, support, prenuptial agreements, and estate planning.' },
        ] }),
        blk('cta', { heading: 'Don\'t See Your Issue Listed?', text: 'We handle a wide range of legal matters. Contact us to discuss your situation.', buttonText: 'Contact Us', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Practice Areas', href: '/practice-areas' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'About the Firm', subheading: 'Committed to excellence since 2001.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Our firm was founded on the principle that every client deserves aggressive, compassionate, and results-driven legal representation. With decades of combined experience, our attorneys bring deep expertise and a personal touch to every case.</p>' }),
        blk('team', { heading: 'Our Attorneys', members: [
          { name: 'Robert Hayes, Esq.', role: 'Managing Partner', photo: 'https://placehold.co/200x200/1C1917/D4AF37?text=RH' },
          { name: 'Linda Chen, Esq.', role: 'Senior Partner', photo: 'https://placehold.co/200x200/78350F/ffffff?text=LC' },
          { name: 'Daniel Brooks, Esq.', role: 'Associate', photo: 'https://placehold.co/200x200/1C1917/D4AF37?text=DB' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Practice Areas', href: '/practice-areas' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Free Consultation', ctaLink: '/contact' }),
        blk('contact', { heading: 'Contact Our Office', showForm: true, email: 'intake@example.com', phone: '(555) 100-2000', address: '250 Legal Plaza, Suite 500, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 11. FITNESS
// ============================================================================

const fitness: WebsiteTemplate = {
  id: 'fitness',
  name: 'Fitness',
  description: 'Energetic design for gyms, personal trainers, and wellness brands.',
  category: 'Health',
  thumbnail: 'https://placehold.co/400x250/DC2626/ffffff?text=Fitness',
  theme: {
    primaryColor: '#DC2626', secondaryColor: '#F97316', accentColor: '#FACC15',
    bgColor: '#ffffff', textColor: '#18181B', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Programs', href: '/programs' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Join Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Transform Your Body. Transform Your Life.', subheading: 'Expert coaching, proven programs, and a community that pushes you to be your best.', ctaText: 'Start Your Journey', ctaLink: '/contact', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/DC2626/ffffff?text=Train+Hard' }),
        blk('features', { heading: 'Our Programs', columns: 3, items: [
          { icon: 'zap', title: 'HIIT Training', description: 'High-intensity workouts for maximum fat burn in minimal time.' },
          { icon: 'heart', title: 'Personal Training', description: 'One-on-one coaching tailored to your goals and fitness level.' },
          { icon: 'users', title: 'Group Classes', description: 'Energizing group sessions — yoga, spin, boxing, and more.' },
        ] }),
        blk('stats', { items: [{ value: '5,000', label: 'Members', suffix: '+' }, { value: '50', label: 'Classes Per Week', suffix: '+' }, { value: '20', label: 'Expert Trainers', suffix: '' }, { value: '4.9', label: 'Rating', prefix: '' }] }),
        blk('pricing', { heading: 'Membership Plans', subheading: 'Find the plan that fits your lifestyle.', columns: [
          { name: 'Basic', price: '$29', period: '/month', features: ['Gym Access', 'Locker Room', 'Free WiFi'], ctaText: 'Join Now', highlighted: false },
          { name: 'Pro', price: '$59', period: '/month', features: ['Everything in Basic', 'All Group Classes', 'Fitness Assessment', 'Nutrition Guide'], ctaText: 'Join Now', highlighted: true },
          { name: 'Elite', price: '$99', period: '/month', features: ['Everything in Pro', '4 PT Sessions/Month', 'Recovery Zone', 'Guest Passes'], ctaText: 'Join Now', highlighted: false },
        ] }),
        blk('testimonials', { heading: 'Success Stories', layout: 'cards', items: [
          { quote: 'Lost 30 pounds in 3 months. The trainers here are incredible.', name: 'Jason K.', role: 'Member since 2024' },
          { quote: 'Best gym I\'ve ever been to. The community keeps me coming back.', name: 'Amy L.', role: 'Member since 2023' },
        ] }),
        blk('cta', { heading: 'Start Your Free Trial', text: 'Try us for 7 days — no commitment, no credit card required.', buttonText: 'Get Free Trial', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Programs', href: '/programs' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'programs', title: 'Programs', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Programs', href: '/programs' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Join Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Programs', subheading: 'Something for every fitness level and goal.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: '', columns: 2, items: [
          { icon: 'zap', title: 'HIIT & Conditioning', description: '45-minute sessions combining cardio bursts and strength movements for total-body conditioning.' },
          { icon: 'heart', title: 'Yoga & Mobility', description: 'Improve flexibility, balance, and mental clarity with guided yoga and mobility work.' },
          { icon: 'target', title: 'Strength Training', description: 'Structured strength programs designed to build muscle, power, and confidence.' },
          { icon: 'trophy', title: 'Athletic Performance', description: 'Sport-specific training for athletes looking to take their game to the next level.' },
        ] }),
        blk('cta', { heading: 'Not Sure Where to Start?', text: 'Book a free fitness assessment and we\'ll build a plan just for you.', buttonText: 'Book Assessment', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Programs', href: '/programs' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Join Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'More than a gym — a community.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Founded by athletes and coaches who believe fitness should be accessible, challenging, and fun. Our state-of-the-art facility and expert team are here to help you reach your full potential — no matter where you\'re starting from.</p>' }),
        blk('team', { heading: 'Our Trainers', members: [
          { name: 'Coach Mike', role: 'Head Trainer', photo: 'https://placehold.co/200x200/DC2626/ffffff?text=CM' },
          { name: 'Coach Ana', role: 'Yoga & Mobility', photo: 'https://placehold.co/200x200/F97316/ffffff?text=CA' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Programs', href: '/programs' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Join Now', ctaLink: '/contact' }),
        blk('contact', { heading: 'Get in Touch', showForm: true, email: 'info@example.com', phone: '(555) 300-4000', address: '500 Fitness Blvd, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 12. MEDICAL
// ============================================================================

const medical: WebsiteTemplate = {
  id: 'medical',
  name: 'Medical Practice',
  description: 'Clean, professional design for doctors, clinics, and healthcare providers.',
  category: 'Health',
  thumbnail: 'https://placehold.co/400x250/0284C7/ffffff?text=Medical',
  theme: {
    primaryColor: '#0284C7', secondaryColor: '#0EA5E9', accentColor: '#38BDF8',
    bgColor: '#F0F9FF', textColor: '#0C4A6E', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Appointment', ctaLink: '/contact' }),
        blk('hero', { heading: 'Compassionate Care for Your Whole Family', subheading: 'Comprehensive healthcare with a personal touch. Accepting new patients.', ctaText: 'Book an Appointment', ctaLink: '/contact', secondaryCtaText: 'Our Services', secondaryCtaLink: '/services', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: 'Our Services', columns: 3, items: [
          { icon: 'heart', title: 'Primary Care', description: 'Routine checkups, preventive care, and chronic disease management.' },
          { icon: 'activity', title: 'Urgent Care', description: 'Walk-in care for non-emergency illnesses and injuries.' },
          { icon: 'users', title: 'Pediatrics', description: 'Specialized care for infants, children, and adolescents.' },
        ] }),
        blk('stats', { items: [{ value: '20', label: 'Years Serving', suffix: '+' }, { value: '15k', label: 'Patients Treated', suffix: '+' }, { value: '5', label: 'Board-Certified Doctors', suffix: '' }, { value: '4.9', label: 'Patient Rating', prefix: '' }] }),
        blk('testimonials', { heading: 'Patient Reviews', layout: 'cards', items: [
          { quote: 'The most caring and thorough doctor I\'ve ever had. Highly recommend.', name: 'Margaret W.', role: 'Patient since 2019' },
          { quote: 'Always on time, always listens. This is what healthcare should be.', name: 'Carlos R.', role: 'Patient since 2021' },
        ] }),
        blk('cta', { heading: 'Accepting New Patients', text: 'Schedule your first visit today — most insurance plans accepted.', buttonText: 'Book Appointment', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Appointment', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Services', subheading: 'Comprehensive care under one roof.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: '', columns: 2, items: [
          { icon: 'heart', title: 'Primary Care', description: 'Annual physicals, health screenings, vaccinations, chronic disease management, and preventive care.' },
          { icon: 'activity', title: 'Urgent Care', description: 'Same-day appointments for colds, flu, minor injuries, infections, and allergic reactions.' },
          { icon: 'users', title: 'Pediatrics', description: 'Well-child visits, immunizations, developmental screenings, and adolescent medicine.' },
          { icon: 'clipboard', title: 'Lab & Diagnostics', description: 'On-site blood work, EKG, X-ray, and referral coordination with specialists.' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Appointment', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Our Practice', subheading: 'Putting patients first since 2005.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Our practice was founded with a simple mission: provide outstanding medical care with genuine compassion. We combine modern medicine with old-fashioned attention, ensuring every patient feels heard, respected, and cared for.</p>' }),
        blk('team', { heading: 'Our Physicians', members: [
          { name: 'Dr. Sarah Kim, MD', role: 'Family Medicine', photo: 'https://placehold.co/200x200/0284C7/ffffff?text=SK' },
          { name: 'Dr. James Okafor, MD', role: 'Internal Medicine', photo: 'https://placehold.co/200x200/0EA5E9/ffffff?text=JO' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Appointment', ctaLink: '/contact' }),
        blk('contact', { heading: 'Schedule an Appointment', showForm: true, email: 'appointments@example.com', phone: '(555) 400-5000', address: '200 Health Center Dr, Suite 100, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 13. PHOTOGRAPHY
// ============================================================================

const photography: WebsiteTemplate = {
  id: 'photography',
  name: 'Photography',
  description: 'Image-forward design for photographers and visual artists.',
  category: 'Freelancer',
  thumbnail: 'https://placehold.co/400x250/18181B/ffffff?text=Photography',
  theme: {
    primaryColor: '#18181B', secondaryColor: '#A1A1AA', accentColor: '#E4E4E7',
    bgColor: '#ffffff', textColor: '#18181B', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Portfolio', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'Capturing Moments That Last Forever', subheading: 'Professional photography for weddings, portraits, events, and commercial projects.', ctaText: 'View Portfolio', ctaLink: '/portfolio', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/18181B/ffffff?text=Featured+Photo' }),
        blk('gallery', { heading: 'Recent Work', columns: 3, images: [
          { src: 'https://placehold.co/400x500/18181B/ffffff?text=Portrait', alt: 'Portrait Photography' },
          { src: 'https://placehold.co/400x500/3F3F46/ffffff?text=Wedding', alt: 'Wedding Photography' },
          { src: 'https://placehold.co/400x500/52525B/ffffff?text=Event', alt: 'Event Photography' },
          { src: 'https://placehold.co/400x500/71717A/ffffff?text=Commercial', alt: 'Commercial Photography' },
          { src: 'https://placehold.co/400x500/A1A1AA/333333?text=Nature', alt: 'Nature Photography' },
          { src: 'https://placehold.co/400x500/D4D4D8/333333?text=Architecture', alt: 'Architecture Photography' },
        ] }),
        blk('testimonials', { heading: 'Client Love', layout: 'cards', items: [
          { quote: 'Our wedding photos are absolutely breathtaking. We couldn\'t be happier.', name: 'Emma & Jake', role: 'Wedding Clients' },
          { quote: 'Incredible eye for detail and light. A true artist.', name: 'Nicole S.', role: 'Portrait Session' },
        ] }),
        blk('cta', { heading: 'Let\'s Create Something Beautiful', text: 'Available for bookings — inquire about your session today.', buttonText: 'Get in Touch', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'portfolio', title: 'Portfolio', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Portfolio', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'Portfolio', subheading: 'A selection of my favorite work.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { columns: 2, images: [
          { src: 'https://placehold.co/600x400/18181B/ffffff?text=Series+1', alt: 'Portrait Series' },
          { src: 'https://placehold.co/600x400/3F3F46/ffffff?text=Series+2', alt: 'Wedding Series' },
          { src: 'https://placehold.co/600x400/52525B/ffffff?text=Series+3', alt: 'Event Series' },
          { src: 'https://placehold.co/600x400/71717A/ffffff?text=Series+4', alt: 'Landscape Series' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Portfolio', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('hero', { heading: 'About', subheading: 'The person behind the lens.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>I\'m a professional photographer with over a decade of experience capturing life\'s most important moments. My style blends documentary authenticity with artistic composition — creating images that are both real and timeless.</p><p>Based in the city, available worldwide for destination work.</p>' }),
        blk('pricing', { heading: 'Packages', columns: [
          { name: 'Portrait Session', price: '$350', period: '2 hours', features: ['Outdoor or Studio', '50+ Edited Photos', 'Online Gallery'], ctaText: 'Book Now', highlighted: false },
          { name: 'Wedding', price: '$3,500', period: 'full day', features: ['8 Hours Coverage', '500+ Edited Photos', 'Engagement Session', 'Photo Album'], ctaText: 'Book Now', highlighted: true },
          { name: 'Commercial', price: 'Custom', period: '', features: ['Product Photography', 'Brand Shoots', 'Event Coverage', 'Licensing Included'], ctaText: 'Get Quote', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Portfolio', href: '/portfolio' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] }),
        blk('contact', { heading: 'Book a Session', showForm: true, email: 'hello@example.com', phone: '(555) 500-6000' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 14. WEDDING
// ============================================================================

const wedding: WebsiteTemplate = {
  id: 'wedding',
  name: 'Wedding',
  description: 'Elegant design for wedding planners and event coordinators.',
  category: 'Events',
  thumbnail: 'https://placehold.co/400x250/BE185D/ffffff?text=Wedding',
  theme: {
    primaryColor: '#BE185D', secondaryColor: '#EC4899', accentColor: '#FBCFE8',
    bgColor: '#FDF2F8', textColor: '#831843', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Gallery', href: '/gallery' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Your Dream Wedding, Perfectly Planned', subheading: 'Full-service wedding planning and coordination for couples who want a stress-free, unforgettable celebration.', ctaText: 'Start Planning', ctaLink: '/contact', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/BE185D/ffffff?text=Beautiful+Wedding' }),
        blk('features', { heading: 'Our Services', columns: 3, items: [
          { icon: 'heart', title: 'Full Planning', description: 'From venue selection to the last dance — we handle every detail.' },
          { icon: 'calendar', title: 'Day-Of Coordination', description: 'Relax and enjoy your day while we manage the timeline and vendors.' },
          { icon: 'palette', title: 'Design & Styling', description: 'Custom floral, decor, and styling to bring your vision to life.' },
        ] }),
        blk('gallery', { heading: 'Featured Weddings', columns: 3, images: [
          { src: 'https://placehold.co/400x300/BE185D/ffffff?text=Wedding+1', alt: 'Garden wedding' },
          { src: 'https://placehold.co/400x300/EC4899/ffffff?text=Wedding+2', alt: 'Ballroom reception' },
          { src: 'https://placehold.co/400x300/FBCFE8/831843?text=Wedding+3', alt: 'Beach ceremony' },
        ] }),
        blk('testimonials', { heading: 'Love Letters From Our Couples', layout: 'cards', items: [
          { quote: 'Our wedding was absolute perfection. We didn\'t have to worry about a single thing.', name: 'Sarah & Tom', role: 'June 2025' },
          { quote: 'Worth every penny. Our guests are still talking about how beautiful it was.', name: 'Maria & Chris', role: 'October 2025' },
        ] }),
        blk('cta', { heading: 'Let\'s Plan Your Perfect Day', text: 'Schedule a complimentary consultation to discuss your wedding vision.', buttonText: 'Get in Touch', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Gallery', href: '/gallery' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Gallery', href: '/gallery' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Services & Packages', subheading: 'Tailored packages for every couple and budget.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: '', columns: [
          { name: 'Day-Of Coordination', price: '$2,500', period: '', features: ['Timeline Management', 'Vendor Coordination', 'Setup & Breakdown', 'Emergency Kit'], ctaText: 'Learn More', highlighted: false },
          { name: 'Full Planning', price: '$8,000', period: 'starting at', features: ['Everything in Day-Of', 'Venue Selection', 'Vendor Sourcing', 'Budget Management', 'Design & Styling', 'Rehearsal Direction'], ctaText: 'Learn More', highlighted: true },
          { name: 'Luxury Experience', price: '$15,000', period: 'starting at', features: ['Everything in Full', 'Destination Planning', 'Welcome Events', 'Guest Concierge', 'Post-Wedding Brunch'], ctaText: 'Learn More', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'gallery', title: 'Gallery', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Gallery', href: '/gallery' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Consultation', ctaLink: '/contact' }),
        blk('hero', { heading: 'Gallery', subheading: 'A peek at some of our favorite celebrations.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { columns: 3, images: [
          { src: 'https://placehold.co/400x300/BE185D/ffffff?text=Ceremony', alt: 'Ceremony' },
          { src: 'https://placehold.co/400x300/EC4899/ffffff?text=Reception', alt: 'Reception' },
          { src: 'https://placehold.co/400x300/FBCFE8/831843?text=Details', alt: 'Details' },
          { src: 'https://placehold.co/400x300/BE185D/ffffff?text=Floral', alt: 'Floral Design' },
          { src: 'https://placehold.co/400x300/EC4899/ffffff?text=Couple', alt: 'Couple portraits' },
          { src: 'https://placehold.co/400x300/FBCFE8/831843?text=Party', alt: 'Dance floor' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Gallery', href: '/gallery' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Consultation', ctaLink: '/contact' }),
        blk('contact', { heading: 'Let\'s Start Planning', showForm: true, email: 'hello@example.com', phone: '(555) 600-7000' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 15. CONSTRUCTION
// ============================================================================

const construction: WebsiteTemplate = {
  id: 'construction',
  name: 'Construction',
  description: 'Bold, industrial design for contractors, builders, and construction companies.',
  category: 'Trade',
  thumbnail: 'https://placehold.co/400x250/92400E/ffffff?text=Construction',
  theme: {
    primaryColor: '#92400E', secondaryColor: '#D97706', accentColor: '#FCD34D',
    bgColor: '#ffffff', textColor: '#1C1917', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Projects', href: '/projects' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get a Quote', ctaLink: '/contact' }),
        blk('hero', { heading: 'Building Excellence Since Day One', subheading: 'Commercial and residential construction with quality craftsmanship and on-time delivery.', ctaText: 'Request a Quote', ctaLink: '/contact', secondaryCtaText: 'View Projects', secondaryCtaLink: '/projects', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/92400E/ffffff?text=Construction+Site' }),
        blk('features', { heading: 'Our Services', columns: 3, items: [
          { icon: 'home', title: 'Residential', description: 'Custom homes, renovations, additions, and remodeling projects.' },
          { icon: 'building', title: 'Commercial', description: 'Office buildings, retail spaces, warehouses, and tenant improvements.' },
          { icon: 'wrench', title: 'Renovations', description: 'Kitchen, bathroom, and full-home renovations with expert craftsmanship.' },
        ] }),
        blk('stats', { items: [{ value: '300', label: 'Projects Completed', suffix: '+' }, { value: '20', label: 'Years in Business', suffix: '+' }, { value: '100', label: 'On-Time Delivery', suffix: '%' }, { value: 'A+', label: 'BBB Rating', prefix: '' }] }),
        blk('gallery', { heading: 'Recent Projects', columns: 3, images: [
          { src: 'https://placehold.co/400x300/92400E/ffffff?text=Project+1', alt: 'Custom home build' },
          { src: 'https://placehold.co/400x300/D97706/ffffff?text=Project+2', alt: 'Commercial build-out' },
          { src: 'https://placehold.co/400x300/FCD34D/333333?text=Project+3', alt: 'Kitchen renovation' },
        ] }),
        blk('testimonials', { heading: 'What Our Clients Say', layout: 'cards', items: [
          { quote: 'On time, on budget, and the quality exceeded our expectations.', name: 'Frank D.', role: 'Homeowner' },
          { quote: 'The best contractor we\'ve ever worked with. Period.', name: 'Lisa M.', role: 'Property Developer' },
        ] }),
        blk('cta', { heading: 'Ready to Start Your Project?', text: 'Get a free estimate from our team of experienced builders.', buttonText: 'Get Free Estimate', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Projects', href: '/projects' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Projects', href: '/projects' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get a Quote', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Services', subheading: 'From foundation to finish — we do it all.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: '', columns: 2, items: [
          { icon: 'home', title: 'Custom Home Building', description: 'Turn your dream home into reality with our custom design-build process.' },
          { icon: 'wrench', title: 'Remodeling & Renovations', description: 'Kitchens, bathrooms, basements, and whole-home renovations.' },
          { icon: 'building', title: 'Commercial Construction', description: 'Ground-up commercial builds, tenant improvements, and facility upgrades.' },
          { icon: 'shield', title: 'General Contracting', description: 'Licensed and insured general contracting for projects of any size.' },
        ] }),
        blk('cta', { heading: 'Every Project Starts With a Conversation', text: 'Tell us about your project and we\'ll provide a detailed estimate.', buttonText: 'Contact Us', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'projects', title: 'Projects', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Projects', href: '/projects' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get a Quote', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Work', subheading: 'Browse our completed and in-progress projects.', layout: 'simple', alignment: 'center' }),
        blk('gallery', { columns: 3, images: [
          { src: 'https://placehold.co/400x300/92400E/ffffff?text=Residential+1', alt: 'Modern custom home' },
          { src: 'https://placehold.co/400x300/D97706/ffffff?text=Commercial+1', alt: 'Office building' },
          { src: 'https://placehold.co/400x300/FCD34D/333333?text=Renovation+1', alt: 'Kitchen remodel' },
          { src: 'https://placehold.co/400x300/92400E/ffffff?text=Residential+2', alt: 'Craftsman home' },
          { src: 'https://placehold.co/400x300/D97706/ffffff?text=Commercial+2', alt: 'Retail space' },
          { src: 'https://placehold.co/400x300/FCD34D/333333?text=Renovation+2', alt: 'Bathroom remodel' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'Projects', href: '/projects' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get a Quote', ctaLink: '/contact' }),
        blk('contact', { heading: 'Request a Free Estimate', showForm: true, email: 'info@example.com', phone: '(555) 700-8000', address: '800 Builder Lane, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 16. TECH STARTUP V2
// ============================================================================

const techStartupV2: WebsiteTemplate = {
  id: 'tech-startup-v2',
  name: 'Tech Startup v2',
  description: 'Dark-mode, modern design for SaaS products and AI companies.',
  category: 'Startup',
  thumbnail: 'https://placehold.co/400x250/0F0F23/8B5CF6?text=Tech+v2',
  theme: {
    primaryColor: '#8B5CF6', secondaryColor: '#6366F1', accentColor: '#A78BFA',
    bgColor: '#0F0F23', textColor: '#E2E8F0', fontHeading: 'Space Grotesk', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get Early Access', ctaLink: '/contact' }),
        blk('hero', { heading: 'The Future of Work, Powered by AI', subheading: 'Automate workflows, generate insights, and ship 10x faster with our AI-native platform.', ctaText: 'Request Access', ctaLink: '/contact', secondaryCtaText: 'See it in Action', secondaryCtaLink: '#features', layout: 'simple', alignment: 'center' }),
        blk('logo-cloud', { heading: 'Backed by the best', logos: [
          { src: 'https://placehold.co/120x40/333333/999999?text=YC', alt: 'Y Combinator' },
          { src: 'https://placehold.co/120x40/333333/999999?text=a16z', alt: 'a16z' },
          { src: 'https://placehold.co/120x40/333333/999999?text=Sequoia', alt: 'Sequoia' },
        ] }),
        blk('features', { heading: 'Why Teams Choose Us', subheading: 'Built for developers, loved by teams.', columns: 3, items: [
          { icon: 'zap', title: 'AI-Powered Automation', description: 'Let AI handle repetitive tasks so your team can focus on building.' },
          { icon: 'git-branch', title: 'Git-Native Workflows', description: 'Works with your existing tools — GitHub, GitLab, Bitbucket.' },
          { icon: 'lock', title: 'SOC 2 Compliant', description: 'Enterprise-grade security and compliance out of the box.' },
          { icon: 'globe', title: 'Edge Deployment', description: 'Deploy globally with sub-50ms latency everywhere.' },
          { icon: 'bar-chart', title: 'Real-Time Analytics', description: 'Track performance, usage, and costs in a unified dashboard.' },
          { icon: 'code', title: 'Open API', description: 'Extensible REST and GraphQL APIs for custom integrations.' },
        ] }),
        blk('stats', { items: [{ value: '50k', label: 'Developers', suffix: '+' }, { value: '99.99', label: 'Uptime', suffix: '%' }, { value: '200ms', label: 'Avg Response', prefix: '<' }, { value: '$12M', label: 'Series A', prefix: '' }] }),
        blk('testimonials', { heading: 'What Builders Say', layout: 'cards', items: [
          { quote: 'Replaced 3 tools in our stack. The AI features alone save us 20 hours/week.', name: 'Alex Rivera', role: 'VP Engineering, ScaleAI' },
          { quote: 'Finally a dev tool that actually understands how we work.', name: 'Priya Singh', role: 'CTO, NexGen' },
        ] }),
        blk('cta', { heading: 'Join the Waitlist', text: 'Be among the first to experience the future of development.', buttonText: 'Request Early Access', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'pricing', title: 'Pricing', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Features', href: '/#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get Early Access', ctaLink: '/contact' }),
        blk('hero', { heading: 'Simple Pricing', subheading: 'Start free. Scale when you\'re ready.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: '', columns: [
          { name: 'Free', price: '$0', period: '/month', features: ['1 Workspace', '5 AI Requests/Day', 'Community Support', 'Basic Analytics'], ctaText: 'Get Started', highlighted: false },
          { name: 'Team', price: '$49', period: '/seat/month', features: ['Unlimited Workspaces', '1,000 AI Requests/Day', 'Priority Support', 'Advanced Analytics', 'SSO'], ctaText: 'Start Trial', highlighted: true },
          { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Team', 'Unlimited AI', 'Dedicated CSM', 'Custom SLA', 'On-Prem Option'], ctaText: 'Talk to Sales', highlighted: false },
        ] }),
        blk('faq', { heading: 'Common Questions', items: [
          { question: 'Can I try before committing?', answer: 'Yes — the Free tier has no time limit. The Team plan includes a 14-day trial.' },
          { question: 'How does seat-based pricing work?', answer: 'You only pay for active users. Add or remove seats anytime.' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Features', href: '/#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get Early Access', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'We\'re building the tools we wished existed.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>We\'re a team of engineers and designers who got frustrated with the complexity of modern dev tools. So we built something better — an AI-native platform that automates the boring stuff and lets teams focus on shipping great products.</p>' }),
        blk('team', { heading: 'The Team', members: [
          { name: 'Ana Park', role: 'CEO & Co-Founder', photo: 'https://placehold.co/200x200/8B5CF6/ffffff?text=AP' },
          { name: 'Raj Mehta', role: 'CTO & Co-Founder', photo: 'https://placehold.co/200x200/6366F1/ffffff?text=RM' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Features', href: '/#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Get Early Access', ctaLink: '/contact' }),
        blk('contact', { heading: 'Get in Touch', showForm: true, email: 'hello@example.com' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 17. ONLINE COURSE
// ============================================================================

const onlineCourse: WebsiteTemplate = {
  id: 'online-course',
  name: 'Online Course',
  description: 'Course landing page for educators, coaches, and content creators.',
  category: 'Education',
  thumbnail: 'https://placehold.co/400x250/7C3AED/ffffff?text=Course',
  theme: {
    primaryColor: '#7C3AED', secondaryColor: '#8B5CF6', accentColor: '#C4B5FD',
    bgColor: '#ffffff', textColor: '#1E1B4B', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Course', href: '/course' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Enroll Now', ctaLink: '/course' }),
        blk('hero', { heading: 'Master New Skills. Advance Your Career.', subheading: 'Expert-led online courses designed for real-world results. Learn at your own pace.', ctaText: 'Browse Courses', ctaLink: '/course', secondaryCtaText: 'Free Preview', secondaryCtaLink: '#', layout: 'simple', alignment: 'center' }),
        blk('stats', { items: [{ value: '10k', label: 'Students Enrolled', suffix: '+' }, { value: '50', label: 'Course Hours', suffix: '+' }, { value: '4.8', label: 'Average Rating', prefix: '' }, { value: '95', label: 'Completion Rate', suffix: '%' }] }),
        blk('features', { heading: 'What You\'ll Learn', columns: 3, items: [
          { icon: 'book', title: 'Structured Curriculum', description: 'Step-by-step lessons designed by industry experts.' },
          { icon: 'video', title: 'HD Video Lessons', description: 'Professional video content you can watch anytime, anywhere.' },
          { icon: 'award', title: 'Certificate', description: 'Earn a certificate of completion to showcase your skills.' },
        ] }),
        blk('testimonials', { heading: 'Student Success Stories', layout: 'cards', items: [
          { quote: 'This course helped me land a job at a top tech company. Worth every penny.', name: 'Jordan M.', role: 'Software Engineer' },
          { quote: 'Clear, practical, and incredibly well-structured. Highly recommend.', name: 'Alicia K.', role: 'UX Designer' },
        ] }),
        blk('cta', { heading: 'Start Learning Today', text: 'Join thousands of students who\'ve transformed their careers.', buttonText: 'Enroll Now', buttonLink: '/course' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Course', href: '/course' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'course', title: 'Course', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Course', href: '/course' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Enroll Now', ctaLink: '#pricing' }),
        blk('hero', { heading: 'The Complete Course', subheading: 'Everything you need to go from beginner to professional.', layout: 'simple', alignment: 'center' }),
        blk('features', { heading: 'Course Curriculum', columns: 2, items: [
          { icon: 'play-circle', title: 'Module 1: Foundations', description: 'Core concepts, terminology, and setting up your environment.' },
          { icon: 'play-circle', title: 'Module 2: Intermediate Skills', description: 'Building on the basics with hands-on projects and exercises.' },
          { icon: 'play-circle', title: 'Module 3: Advanced Techniques', description: 'Deep dives into complex topics with real-world case studies.' },
          { icon: 'play-circle', title: 'Module 4: Capstone Project', description: 'Build a complete project to showcase in your portfolio.' },
        ] }),
        blk('pricing', { heading: 'Choose Your Plan', columns: [
          { name: 'Self-Paced', price: '$199', period: 'one-time', features: ['Full Course Access', 'All Video Lessons', 'Downloadable Resources', 'Certificate of Completion'], ctaText: 'Enroll Now', highlighted: false },
          { name: 'With Coaching', price: '$499', period: 'one-time', features: ['Everything in Self-Paced', '4 Live Coaching Calls', 'Code Reviews', 'Private Community Access', '6 Months of Support'], ctaText: 'Enroll Now', highlighted: true },
        ] }),
        blk('faq', { heading: 'FAQ', items: [
          { question: 'Is there a money-back guarantee?', answer: 'Yes — 30-day, no-questions-asked refund policy.' },
          { question: 'How long do I have access?', answer: 'Lifetime access. Once you enroll, the course is yours forever.' },
          { question: 'Do I need prior experience?', answer: 'No! The course is designed for complete beginners.' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Course', href: '/course' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Enroll Now', ctaLink: '/course' }),
        blk('hero', { heading: 'About the Instructor', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>I\'ve spent 15 years in the industry building products used by millions of people. Now I\'m passionate about sharing what I\'ve learned with the next generation of creators. My teaching philosophy is simple: learn by doing.</p>' }),
        blk('stats', { items: [{ value: '15', label: 'Years Experience', suffix: '+' }, { value: '10k', label: 'Students Taught', suffix: '+' }, { value: '4.8', label: 'Instructor Rating', prefix: '' }] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Course', href: '/course' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Enroll Now', ctaLink: '/course' }),
        blk('contact', { heading: 'Questions?', showForm: true, email: 'support@example.com' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 18. BAKERY
// ============================================================================

const bakery: WebsiteTemplate = {
  id: 'bakery',
  name: 'Bakery',
  description: 'Warm, inviting design for bakeries, cafes, and specialty food shops.',
  category: 'Restaurant',
  thumbnail: 'https://placehold.co/400x250/92400E/FEF3C7?text=Bakery',
  theme: {
    primaryColor: '#92400E', secondaryColor: '#B45309', accentColor: '#FDE68A',
    bgColor: '#FFFBEB', textColor: '#451A03', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Order Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Baked Fresh Every Morning', subheading: 'Artisan breads, pastries, and cakes made with love using time-honored recipes.', ctaText: 'View Our Menu', ctaLink: '/menu', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/92400E/FEF3C7?text=Fresh+Bread' }),
        blk('features', { heading: 'What Makes Us Special', columns: 3, items: [
          { icon: 'heart', title: 'Made From Scratch', description: 'Every item is handcrafted from scratch using premium ingredients.' },
          { icon: 'clock', title: 'Fresh Daily', description: 'We bake every morning so everything is perfectly fresh.' },
          { icon: 'star', title: 'Award-Winning', description: 'Voted Best Bakery in the city three years running.' },
        ] }),
        blk('gallery', { heading: 'From Our Ovens', columns: 4, images: [
          { src: 'https://placehold.co/300x300/92400E/FEF3C7?text=Bread', alt: 'Artisan bread' },
          { src: 'https://placehold.co/300x300/B45309/FEF3C7?text=Croissant', alt: 'Buttery croissants' },
          { src: 'https://placehold.co/300x300/D97706/FEF3C7?text=Cake', alt: 'Custom cakes' },
          { src: 'https://placehold.co/300x300/FDE68A/451A03?text=Pastry', alt: 'French pastries' },
        ] }),
        blk('testimonials', { heading: 'What People Say', layout: 'cards', items: [
          { quote: 'The best sourdough I\'ve ever tasted. We come here every weekend.', name: 'Helen R.', role: 'Regular Customer' },
          { quote: 'Our wedding cake was a dream. Absolutely stunning and delicious.', name: 'Amanda & Nick', role: 'Wedding Cake Client' },
        ] }),
        blk('cta', { heading: 'Custom Orders Welcome', text: 'Cakes for birthdays, weddings, and special events. Order today!', buttonText: 'Place an Order', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'menu', title: 'Menu', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Order Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Menu', subheading: 'Freshly baked goods available daily.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: 'Breads', columns: [
          { name: 'Sourdough Loaf', price: '$8', features: ['Traditional fermentation', 'Crispy crust'], ctaText: '', highlighted: false },
          { name: 'Baguette', price: '$5', features: ['Classic French style', 'Perfect with butter'], ctaText: '', highlighted: false },
          { name: 'Multigrain', price: '$9', features: ['Seven grains & seeds', 'High fiber'], ctaText: '', highlighted: true },
        ] }),
        blk('pricing', { heading: 'Pastries & Sweets', columns: [
          { name: 'Croissant', price: '$4.50', features: ['Butter layers', 'Plain or chocolate'], ctaText: '', highlighted: false },
          { name: 'Cinnamon Roll', price: '$5', features: ['Cream cheese frosting', 'Fresh baked'], ctaText: '', highlighted: true },
          { name: 'Fruit Tart', price: '$6', features: ['Seasonal fruit', 'Vanilla custard'], ctaText: '', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Order Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Story', subheading: 'A family tradition of baking.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>What started as a family recipe collection has grown into a beloved neighborhood bakery. For three generations, we\'ve been committed to the art of baking — using traditional methods, premium ingredients, and a whole lot of love. Every loaf, every pastry, every cake is a labor of love.</p>' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Order Now', ctaLink: '/contact' }),
        blk('contact', { heading: 'Visit Us or Order', showForm: true, email: 'hello@example.com', phone: '(555) 800-9000', address: '321 Baker Street, City, ST 12345' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 19. TRAVEL AGENCY
// ============================================================================

const travelAgency: WebsiteTemplate = {
  id: 'travel-agency',
  name: 'Travel Agency',
  description: 'Adventure-inspired design for travel agencies and tour operators.',
  category: 'Travel',
  thumbnail: 'https://placehold.co/400x250/0369A1/ffffff?text=Travel',
  theme: {
    primaryColor: '#0369A1', secondaryColor: '#0284C7', accentColor: '#38BDF8',
    bgColor: '#F0F9FF', textColor: '#0C4A6E', fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Destinations', href: '/destinations' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Plan My Trip', ctaLink: '/contact' }),
        blk('hero', { heading: 'Explore the World With Us', subheading: 'Unforgettable journeys, expertly planned. From tropical getaways to cultural expeditions.', ctaText: 'Browse Destinations', ctaLink: '/destinations', secondaryCtaText: 'Custom Trip', secondaryCtaLink: '/contact', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/0369A1/ffffff?text=Paradise+Beach' }),
        blk('features', { heading: 'Why Travel With Us', columns: 3, items: [
          { icon: 'globe', title: 'Expert Guides', description: 'Local guides who know every hidden gem and secret spot.' },
          { icon: 'shield', title: 'Travel Insurance', description: 'Comprehensive coverage included with every booking.' },
          { icon: 'star', title: 'Curated Experiences', description: 'Handpicked hotels, restaurants, and activities.' },
        ] }),
        blk('gallery', { heading: 'Popular Destinations', columns: 3, images: [
          { src: 'https://placehold.co/400x300/0369A1/ffffff?text=Bali', alt: 'Bali, Indonesia' },
          { src: 'https://placehold.co/400x300/0284C7/ffffff?text=Santorini', alt: 'Santorini, Greece' },
          { src: 'https://placehold.co/400x300/38BDF8/333333?text=Kyoto', alt: 'Kyoto, Japan' },
        ] }),
        blk('stats', { items: [{ value: '100', label: 'Destinations', suffix: '+' }, { value: '25k', label: 'Happy Travelers', suffix: '+' }, { value: '10', label: 'Years of Travel', suffix: '+' }, { value: '4.9', label: 'TripAdvisor', prefix: '' }] }),
        blk('testimonials', { heading: 'Traveler Reviews', layout: 'cards', items: [
          { quote: 'The best vacation of our lives. Every detail was perfect.', name: 'The Williams Family', role: 'Bali Trip 2025' },
          { quote: 'Truly a once-in-a-lifetime experience. Can\'t wait to book again!', name: 'Michelle D.', role: 'Europe Tour 2025' },
        ] }),
        blk('cta', { heading: 'Your Next Adventure Awaits', text: 'Tell us your dream destination and we\'ll make it happen.', buttonText: 'Start Planning', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Destinations', href: '/destinations' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'destinations', title: 'Destinations', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Destinations', href: '/destinations' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Plan My Trip', ctaLink: '/contact' }),
        blk('hero', { heading: 'Our Destinations', subheading: 'Carefully curated trips to the world\'s most incredible places.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: 'Featured Packages', columns: [
          { name: 'Bali Explorer', price: '$2,499', period: '10 days', features: ['Flights Included', 'Luxury Resort', 'Temple Tours', 'Rice Terrace Trek', 'Cooking Class'], ctaText: 'Learn More', highlighted: false },
          { name: 'Greek Islands', price: '$3,299', period: '12 days', features: ['Island Hopping', 'Private Yacht Day', 'Wine Tasting', 'Sunset Dinner', 'Hotel Transfers'], ctaText: 'Learn More', highlighted: true },
          { name: 'Japan Discovery', price: '$4,199', period: '14 days', features: ['Tokyo to Kyoto', 'Bullet Train Pass', 'Tea Ceremony', 'Mt. Fuji Day Trip', 'Local Food Tours'], ctaText: 'Learn More', highlighted: false },
        ] }),
        blk('cta', { heading: 'Don\'t See Your Dream Trip?', text: 'We create fully custom itineraries to any destination in the world.', buttonText: 'Request Custom Trip', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Destinations', href: '/destinations' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Plan My Trip', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'Travel lovers helping you explore the world.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Born from a shared passion for travel and adventure, our agency has been helping explorers discover the world since 2015. We believe travel is more than visiting new places — it\'s about connection, growth, and creating memories that last a lifetime.</p>' }),
        blk('team', { heading: 'Our Travel Experts', members: [
          { name: 'Sofia Martinez', role: 'Founder & Lead Planner', photo: 'https://placehold.co/200x200/0369A1/ffffff?text=SM' },
          { name: 'Ben Nakamura', role: 'Asia Specialist', photo: 'https://placehold.co/200x200/0284C7/ffffff?text=BN' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Destinations', href: '/destinations' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Plan My Trip', ctaLink: '/contact' }),
        blk('contact', { heading: 'Plan Your Trip', showForm: true, email: 'travel@example.com', phone: '(555) 900-1000' }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
  ],
};

// ============================================================================
// 20. SALON & SPA
// ============================================================================

const salonSpa: WebsiteTemplate = {
  id: 'salon-spa',
  name: 'Salon & Spa',
  description: 'Luxurious, calming design for salons, spas, and wellness centers.',
  category: 'Health',
  thumbnail: 'https://placehold.co/400x250/701A75/F5D0FE?text=Salon+%26+Spa',
  theme: {
    primaryColor: '#701A75', secondaryColor: '#A21CAF', accentColor: '#F0ABFC',
    bgColor: '#FAF5FF', textColor: '#581C87', fontHeading: 'Playfair Display', fontBody: 'Inter', borderRadius: 7,
  },
  pages: [
    {
      slug: 'home', title: 'Home', isHomePage: true, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Relax. Rejuvenate. Renew.', subheading: 'A sanctuary of beauty and wellness in the heart of the city.', ctaText: 'Book Appointment', ctaLink: '/contact', secondaryCtaText: 'View Services', secondaryCtaLink: '/services', layout: 'overlay', alignment: 'center', backgroundImage: 'https://placehold.co/1200x600/701A75/F5D0FE?text=Spa+Retreat' }),
        blk('features', { heading: 'Our Services', columns: 3, items: [
          { icon: 'scissors', title: 'Hair Salon', description: 'Cuts, color, styling, and treatments by expert stylists.' },
          { icon: 'heart', title: 'Spa Treatments', description: 'Facials, massages, body wraps, and holistic wellness therapies.' },
          { icon: 'star', title: 'Nail Studio', description: 'Manicures, pedicures, gel, and nail art by skilled technicians.' },
        ] }),
        blk('gallery', { heading: 'Our Space', columns: 4, images: [
          { src: 'https://placehold.co/300x300/701A75/F5D0FE?text=Salon', alt: 'Salon interior' },
          { src: 'https://placehold.co/300x300/A21CAF/F5D0FE?text=Spa', alt: 'Spa room' },
          { src: 'https://placehold.co/300x300/D946EF/ffffff?text=Nails', alt: 'Nail studio' },
          { src: 'https://placehold.co/300x300/F0ABFC/581C87?text=Lounge', alt: 'Relaxation lounge' },
        ] }),
        blk('testimonials', { heading: 'Client Love', layout: 'cards', items: [
          { quote: 'The best salon experience I\'ve ever had. I always leave feeling amazing.', name: 'Jennifer K.', role: 'Regular Client' },
          { quote: 'My go-to spa for years. The facials are incredible.', name: 'Rachel T.', role: 'Spa Member' },
        ] }),
        blk('cta', { heading: 'Treat Yourself', text: 'Book your appointment today and experience true relaxation.', buttonText: 'Book Now', buttonLink: '/contact' }),
        blk('footer', { companyName: '{businessName}', links: [[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }], [{ label: 'Contact', href: '/contact' }, { label: 'Privacy', href: '/privacy' }]], copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'services', title: 'Services', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'Services & Pricing', subheading: 'Everything you need to look and feel your best.', layout: 'simple', alignment: 'center' }),
        blk('pricing', { heading: 'Hair', columns: [
          { name: 'Women\'s Cut', price: '$65', period: '', features: ['Consultation', 'Shampoo & Style', 'Blowout Included'], ctaText: '', highlighted: false },
          { name: 'Color Service', price: '$120', period: 'starting at', features: ['Full Color or Highlights', 'Toner', 'Deep Conditioning'], ctaText: '', highlighted: true },
          { name: 'Men\'s Cut', price: '$35', period: '', features: ['Precision Cut', 'Hot Towel', 'Style'], ctaText: '', highlighted: false },
        ] }),
        blk('pricing', { heading: 'Spa', columns: [
          { name: 'Classic Facial', price: '$85', period: '60 min', features: ['Cleanse & Exfoliate', 'Mask', 'Moisturize'], ctaText: '', highlighted: false },
          { name: 'Swedish Massage', price: '$95', period: '60 min', features: ['Full Body', 'Relaxation Focus', 'Essential Oils'], ctaText: '', highlighted: true },
          { name: 'Mani-Pedi Combo', price: '$70', period: '', features: ['Nail Shaping', 'Cuticle Care', 'Polish or Gel'], ctaText: '', highlighted: false },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'about', title: 'About', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Now', ctaLink: '/contact' }),
        blk('hero', { heading: 'About Us', subheading: 'Where beauty meets wellness.', layout: 'simple', alignment: 'center' }),
        blk('text', { content: '<p>Founded in 2018, our salon and spa is a full-service beauty destination dedicated to helping you look and feel your best. Our team of licensed professionals brings years of experience and a passion for client care to every appointment.</p>' }),
        blk('team', { heading: 'Our Team', members: [
          { name: 'Isabella Cruz', role: 'Owner & Lead Stylist', photo: 'https://placehold.co/200x200/701A75/F5D0FE?text=IC' },
          { name: 'Naomi Walsh', role: 'Spa Director', photo: 'https://placehold.co/200x200/A21CAF/F5D0FE?text=NW' },
        ] }),
        blk('footer', { companyName: '{businessName}', copyright: '© 2026 {businessName}. All rights reserved.' }),
      ],
    },
    {
      slug: 'contact', title: 'Contact', isHomePage: false, showInNav: true,
      blocks: [
        blk('header', { logoText: '{businessName}', navLinks: [{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }], ctaText: 'Book Now', ctaLink: '/contact' }),
        blk('contact', { heading: 'Book an Appointment', showForm: true, email: 'book@example.com', phone: '(555) 111-2222', address: '456 Wellness Way, Suite 10, City, ST 12345' }),
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
  realEstate,
  lawFirm,
  fitness,
  medical,
  photography,
  wedding,
  construction,
  techStartupV2,
  onlineCourse,
  bakery,
  travelAgency,
  salonSpa,
];

export function getTemplateById(id: string): WebsiteTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): WebsiteTemplate[] {
  return templates.filter(t => t.category === category);
}
