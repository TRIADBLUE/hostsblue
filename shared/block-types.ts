import { z } from 'zod';

// ============================================================================
// BLOCK STYLE OVERLAY (shared by all blocks)
// ============================================================================

export const blockStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  paddingY: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  paddingX: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional(),
  hidden: z.boolean().optional(),
});

export type BlockStyle = z.infer<typeof blockStyleSchema>;

export const defaultBlockStyle: BlockStyle = {
  paddingY: 'lg',
  paddingX: 'md',
  maxWidth: 'lg',
  hidden: false,
};

// ============================================================================
// BLOCK TYPE DEFINITIONS
// ============================================================================

export const BLOCK_TYPES = [
  'header', 'hero', 'text', 'image', 'features', 'cta', 'testimonials',
  'pricing', 'faq', 'gallery', 'contact', 'team', 'stats', 'logo-cloud', 'footer',
  'custom-code', 'product-grid', 'product-detail',
] as const;

export type BlockType = typeof BLOCK_TYPES[number];

// ---- Header ----
export const headerBlockSchema = z.object({
  logo: z.string().optional(),
  logoText: z.string().optional(),
  navLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  sticky: z.boolean().default(false),
});
export type HeaderBlock = z.infer<typeof headerBlockSchema>;

// ---- Hero ----
export const heroBlockSchema = z.object({
  heading: z.string().default('Welcome to Our Website'),
  subheading: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  backgroundImage: z.string().optional(),
  layout: z.enum(['simple', 'split', 'overlay']).default('simple'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
});
export type HeroBlock = z.infer<typeof heroBlockSchema>;

// ---- Text ----
export const textBlockSchema = z.object({
  content: z.string().default('<p>Enter your text here...</p>'),
});
export type TextBlock = z.infer<typeof textBlockSchema>;

// ---- Image ----
export const imageBlockSchema = z.object({
  src: z.string().default(''),
  alt: z.string().default(''),
  caption: z.string().optional(),
  maxWidth: z.enum(['sm', 'md', 'lg', 'full']).default('lg'),
});
export type ImageBlock = z.infer<typeof imageBlockSchema>;

// ---- Features ----
export const featuresBlockSchema = z.object({
  heading: z.string().default('Our Features'),
  subheading: z.string().optional(),
  columns: z.number().min(2).max(4).default(3),
  items: z.array(z.object({
    icon: z.string().optional(),
    title: z.string(),
    description: z.string(),
  })).default([]),
});
export type FeaturesBlock = z.infer<typeof featuresBlockSchema>;

// ---- CTA ----
export const ctaBlockSchema = z.object({
  heading: z.string().default('Ready to Get Started?'),
  text: z.string().optional(),
  buttonText: z.string().default('Get Started'),
  buttonLink: z.string().default('#'),
  backgroundColor: z.string().optional(),
});
export type CTABlock = z.infer<typeof ctaBlockSchema>;

// ---- Testimonials ----
export const testimonialsBlockSchema = z.object({
  heading: z.string().default('What Our Clients Say'),
  layout: z.enum(['cards', 'single']).default('cards'),
  items: z.array(z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string().optional(),
    avatar: z.string().optional(),
  })).default([]),
});
export type TestimonialsBlock = z.infer<typeof testimonialsBlockSchema>;

// ---- Pricing ----
export const pricingBlockSchema = z.object({
  heading: z.string().default('Pricing Plans'),
  subheading: z.string().optional(),
  columns: z.array(z.object({
    name: z.string(),
    price: z.string(),
    period: z.string().optional(),
    features: z.array(z.string()).default([]),
    ctaText: z.string().default('Get Started'),
    highlighted: z.boolean().default(false),
  })).default([]),
});
export type PricingBlock = z.infer<typeof pricingBlockSchema>;

// ---- FAQ ----
export const faqBlockSchema = z.object({
  heading: z.string().default('Frequently Asked Questions'),
  items: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).default([]),
});
export type FAQBlock = z.infer<typeof faqBlockSchema>;

// ---- Gallery ----
export const galleryBlockSchema = z.object({
  heading: z.string().optional(),
  columns: z.number().min(2).max(4).default(3),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().default(''),
  })).default([]),
});
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;

// ---- Contact ----
export const contactBlockSchema = z.object({
  heading: z.string().default('Get in Touch'),
  showForm: z.boolean().default(true),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  mapEmbed: z.string().optional(),
});
export type ContactBlock = z.infer<typeof contactBlockSchema>;

// ---- Team ----
export const teamBlockSchema = z.object({
  heading: z.string().default('Meet Our Team'),
  members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    bio: z.string().optional(),
  })).default([]),
});
export type TeamBlock = z.infer<typeof teamBlockSchema>;

// ---- Stats ----
export const statsBlockSchema = z.object({
  items: z.array(z.object({
    value: z.string(),
    label: z.string(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
  })).default([]),
});
export type StatsBlock = z.infer<typeof statsBlockSchema>;

// ---- Logo Cloud ----
export const logoCloudBlockSchema = z.object({
  heading: z.string().optional(),
  logos: z.array(z.object({
    src: z.string(),
    alt: z.string().default(''),
    url: z.string().optional(),
  })).default([]),
});
export type LogoCloudBlock = z.infer<typeof logoCloudBlockSchema>;

// ---- Footer ----
export const footerBlockSchema = z.object({
  companyName: z.string().default(''),
  links: z.array(z.array(z.object({
    label: z.string(),
    href: z.string(),
  }))).default([]),
  copyright: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
  })).default([]),
});
export type FooterBlock = z.infer<typeof footerBlockSchema>;

// ---- Custom Code ----
export const customCodeBlockSchema = z.object({
  html: z.string().default(''),
  css: z.string().default(''),
  js: z.string().default(''),
  position: z.enum(['inline', 'head', 'body-end']).default('inline'),
});
export type CustomCodeBlock = z.infer<typeof customCodeBlockSchema>;

// ---- Product Grid ----
export const productGridBlockSchema = z.object({
  heading: z.string().default('Our Products'),
  columns: z.number().min(2).max(4).default(3),
  maxProducts: z.number().default(12),
  categorySlug: z.string().optional(),
  showPrice: z.boolean().default(true),
});
export type ProductGridBlock = z.infer<typeof productGridBlockSchema>;

// ---- Product Detail ----
export const productDetailBlockSchema = z.object({
  productSlug: z.string().default(''),
});
export type ProductDetailBlock = z.infer<typeof productDetailBlockSchema>;

// ============================================================================
// UNIFIED BLOCK SCHEMA
// ============================================================================

export const blockDataSchemaMap = {
  header: headerBlockSchema,
  hero: heroBlockSchema,
  text: textBlockSchema,
  image: imageBlockSchema,
  features: featuresBlockSchema,
  cta: ctaBlockSchema,
  testimonials: testimonialsBlockSchema,
  pricing: pricingBlockSchema,
  faq: faqBlockSchema,
  gallery: galleryBlockSchema,
  contact: contactBlockSchema,
  team: teamBlockSchema,
  stats: statsBlockSchema,
  'logo-cloud': logoCloudBlockSchema,
  footer: footerBlockSchema,
  'custom-code': customCodeBlockSchema,
  'product-grid': productGridBlockSchema,
  'product-detail': productDetailBlockSchema,
} as const;

export const websiteBlockSchema = z.object({
  id: z.string(),
  type: z.enum(BLOCK_TYPES),
  data: z.record(z.any()),
  style: blockStyleSchema.optional(),
});

export type WebsiteBlock = z.infer<typeof websiteBlockSchema>;

// ============================================================================
// THEME SCHEMA
// ============================================================================

export const themeSchema = z.object({
  primaryColor: z.string().default('#064A6C'),
  secondaryColor: z.string().default('#1844A6'),
  accentColor: z.string().default('#10B981'),
  bgColor: z.string().default('#ffffff'),
  textColor: z.string().default('#09080E'),
  fontHeading: z.string().default('Inter'),
  fontBody: z.string().default('Inter'),
  borderRadius: z.number().default(7),
});

export type WebsiteTheme = z.infer<typeof themeSchema>;

export const defaultTheme: WebsiteTheme = {
  primaryColor: '#064A6C',
  secondaryColor: '#1844A6',
  accentColor: '#10B981',
  bgColor: '#ffffff',
  textColor: '#09080E',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  borderRadius: 7,
};

// ============================================================================
// DEFAULT BLOCK FACTORIES
// ============================================================================

let blockCounter = 0;

export function generateBlockId(): string {
  blockCounter++;
  return `blk_${Date.now().toString(36)}_${blockCounter.toString(36)}`;
}

export function createDefaultBlock(type: BlockType): WebsiteBlock {
  const defaults: Record<BlockType, () => Record<string, any>> = {
    header: () => ({
      logoText: 'My Website',
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      ctaText: 'Get Started',
      ctaLink: '#',
    }),
    hero: () => ({
      heading: 'Welcome to Our Website',
      subheading: 'We help businesses grow with modern solutions.',
      ctaText: 'Get Started',
      ctaLink: '#',
      layout: 'simple',
      alignment: 'center',
    }),
    text: () => ({
      content: '<p>Enter your text here. You can format this with bold, italic, and more.</p>',
    }),
    image: () => ({
      src: 'https://placehold.co/800x400/064A6C/ffffff?text=Your+Image',
      alt: 'Placeholder image',
      maxWidth: 'lg',
    }),
    features: () => ({
      heading: 'Our Features',
      subheading: 'Everything you need to succeed.',
      columns: 3,
      items: [
        { icon: 'zap', title: 'Fast & Reliable', description: 'Lightning-fast performance you can count on.' },
        { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security built in.' },
        { icon: 'headphones', title: '24/7 Support', description: 'Our team is always here to help.' },
      ],
    }),
    cta: () => ({
      heading: 'Ready to Get Started?',
      text: 'Join thousands of satisfied customers today.',
      buttonText: 'Start Now',
      buttonLink: '#',
    }),
    testimonials: () => ({
      heading: 'What Our Clients Say',
      layout: 'cards',
      items: [
        { quote: 'An amazing service that transformed our business.', name: 'Jane Smith', role: 'CEO, TechCorp' },
        { quote: 'Professional, reliable, and truly outstanding.', name: 'John Doe', role: 'Founder, StartupXYZ' },
        { quote: 'Couldn\'t be happier with the results.', name: 'Sarah Johnson', role: 'Marketing Director' },
      ],
    }),
    pricing: () => ({
      heading: 'Simple, Transparent Pricing',
      subheading: 'Choose the plan that fits your needs.',
      columns: [
        { name: 'Starter', price: '$9', period: '/month', features: ['1 Website', '10GB Storage', 'Email Support'], ctaText: 'Start Free', highlighted: false },
        { name: 'Professional', price: '$29', period: '/month', features: ['5 Websites', '50GB Storage', 'Priority Support', 'Custom Domain'], ctaText: 'Get Started', highlighted: true },
        { name: 'Enterprise', price: '$99', period: '/month', features: ['Unlimited Websites', '500GB Storage', 'Phone Support', 'Custom Domain', 'API Access'], ctaText: 'Contact Sales', highlighted: false },
      ],
    }),
    faq: () => ({
      heading: 'Frequently Asked Questions',
      items: [
        { question: 'How do I get started?', answer: 'Simply sign up for an account and follow our quick setup guide.' },
        { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no fees.' },
        { question: 'Do you offer a free trial?', answer: 'Yes, all plans come with a 14-day free trial.' },
      ],
    }),
    gallery: () => ({
      heading: 'Our Work',
      columns: 3,
      images: [
        { src: 'https://placehold.co/400x300/064A6C/ffffff?text=Project+1', alt: 'Project 1' },
        { src: 'https://placehold.co/400x300/1844A6/ffffff?text=Project+2', alt: 'Project 2' },
        { src: 'https://placehold.co/400x300/10B981/ffffff?text=Project+3', alt: 'Project 3' },
      ],
    }),
    contact: () => ({
      heading: 'Get in Touch',
      showForm: true,
      email: 'hello@example.com',
      phone: '(555) 123-4567',
      address: '123 Main Street, City, ST 12345',
    }),
    team: () => ({
      heading: 'Meet Our Team',
      members: [
        { name: 'Alex Thompson', role: 'CEO & Founder', photo: 'https://placehold.co/200x200/064A6C/ffffff?text=AT' },
        { name: 'Maria Garcia', role: 'CTO', photo: 'https://placehold.co/200x200/1844A6/ffffff?text=MG' },
        { name: 'David Chen', role: 'Lead Designer', photo: 'https://placehold.co/200x200/10B981/ffffff?text=DC' },
      ],
    }),
    stats: () => ({
      items: [
        { value: '500', label: 'Clients Served', suffix: '+' },
        { value: '98', label: 'Satisfaction Rate', suffix: '%' },
        { value: '24', label: 'Support Response', suffix: 'h' },
        { value: '10', label: 'Years Experience', suffix: '+' },
      ],
    }),
    'logo-cloud': () => ({
      heading: 'Trusted By',
      logos: [
        { src: 'https://placehold.co/120x40/cccccc/666666?text=Partner+1', alt: 'Partner 1' },
        { src: 'https://placehold.co/120x40/cccccc/666666?text=Partner+2', alt: 'Partner 2' },
        { src: 'https://placehold.co/120x40/cccccc/666666?text=Partner+3', alt: 'Partner 3' },
        { src: 'https://placehold.co/120x40/cccccc/666666?text=Partner+4', alt: 'Partner 4' },
      ],
    }),
    footer: () => ({
      companyName: 'My Website',
      links: [
        [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Services', href: '/services' },
        ],
        [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Contact', href: '/contact' },
        ],
      ],
      copyright: `© ${new Date().getFullYear()} My Website. All rights reserved.`,
      socialLinks: [],
    }),
    'custom-code': () => ({
      html: '',
      css: '',
      js: '',
      position: 'inline',
    }),
    'product-grid': () => ({
      heading: 'Our Products',
      columns: 3,
      maxProducts: 12,
      showPrice: true,
    }),
    'product-detail': () => ({
      productSlug: '',
    }),
  };

  return {
    id: generateBlockId(),
    type,
    data: defaults[type](),
    style: { ...defaultBlockStyle },
  };
}

// ============================================================================
// BLOCK CATEGORIES (for toolbar palette)
// ============================================================================

export const BLOCK_CATEGORIES = [
  {
    label: 'Layout',
    types: ['header', 'hero', 'footer'] as BlockType[],
  },
  {
    label: 'Content',
    types: ['text', 'image', 'gallery', 'stats'] as BlockType[],
  },
  {
    label: 'Sections',
    types: ['features', 'testimonials', 'team', 'pricing', 'faq', 'cta'] as BlockType[],
  },
  {
    label: 'E-Commerce',
    types: ['product-grid', 'product-detail'] as BlockType[],
  },
  {
    label: 'Other',
    types: ['contact', 'logo-cloud', 'custom-code'] as BlockType[],
  },
];

export const BLOCK_LABELS: Record<BlockType, string> = {
  header: 'Header',
  hero: 'Hero',
  text: 'Text',
  image: 'Image',
  features: 'Features',
  cta: 'Call to Action',
  testimonials: 'Testimonials',
  pricing: 'Pricing',
  faq: 'FAQ',
  gallery: 'Gallery',
  contact: 'Contact',
  team: 'Team',
  stats: 'Stats',
  'logo-cloud': 'Logo Cloud',
  footer: 'Footer',
  'custom-code': 'Custom Code',
  'product-grid': 'Product Grid',
  'product-detail': 'Product Detail',
};
