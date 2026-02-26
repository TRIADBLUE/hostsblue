/**
 * Website AI Service — Builder AI: generation, coach chat, rewrite, SEO
 * Uses the provider abstraction. Does NOT care which AI backend is active.
 */

import { AIProviderFactory, type AIProvider, type ProviderConfig, type Message, type TokenUsage } from './ai-provider.js';
import { BLOCK_TYPES, type BlockType, type WebsiteBlock, type WebsiteTheme, defaultTheme, generateBlockId, createDefaultBlock } from '../../shared/block-types.js';

// ============================================================================
// TYPES
// ============================================================================

export interface GenerateWebsiteInput {
  businessName: string;
  businessType: string;
  businessDescription?: string;
  style?: string;
  selectedPages?: string[];
}

export interface GeneratedWebsite {
  theme: WebsiteTheme;
  pages: GeneratedPage[];
  usage?: TokenUsage;
}

export interface GeneratedPage {
  slug: string;
  title: string;
  isHomePage: boolean;
  showInNav: boolean;
  blocks: WebsiteBlock[];
}

export interface CoachResponse {
  message: string;
  operations: CoachOperation[];
  suggestions: string[];
  usage?: TokenUsage;
}

export interface CoachOperation {
  id: string;
  type: 'add_block' | 'update_block' | 'remove_block' | 'update_theme' | 'update_seo';
  description: string;
  payload: Record<string, any>;
}

// ============================================================================
// STYLE PRESETS
// ============================================================================

const styleThemes: Record<string, Partial<WebsiteTheme>> = {
  Professional: { primaryColor: '#1E3A5F', secondaryColor: '#3B82F6', accentColor: '#10B981', bgColor: '#ffffff', fontHeading: 'Inter', fontBody: 'Inter' },
  Creative: { primaryColor: '#7C3AED', secondaryColor: '#EC4899', accentColor: '#F0ABFC', bgColor: '#FAF5FF', fontHeading: 'Space Grotesk', fontBody: 'Inter' },
  Bold: { primaryColor: '#DC2626', secondaryColor: '#F97316', accentColor: '#FCD34D', bgColor: '#ffffff', fontHeading: 'Inter', fontBody: 'Inter' },
  Minimal: { primaryColor: '#0F172A', secondaryColor: '#475569', accentColor: '#94A3B8', bgColor: '#FAFAFA', fontHeading: 'Inter', fontBody: 'Inter' },
};

// ============================================================================
// BLOCK SCHEMA DESCRIPTIONS (for AI prompts)
// ============================================================================

const blockSchemaDescription = `Available block types (JSON):
- "header": { logoText, navLinks: [{label, href}], ctaText?, ctaLink? }
- "hero": { heading, subheading?, ctaText?, ctaLink?, secondaryCtaText?, secondaryCtaLink?, backgroundImage?, layout: "simple"|"split"|"overlay", alignment: "left"|"center"|"right" }
- "text": { content: "HTML string" }
- "image": { src, alt, caption?, maxWidth: "sm"|"md"|"lg"|"full" }
- "features": { heading, subheading?, columns: 2-4, items: [{icon?, title, description}] }
- "cta": { heading, text?, buttonText, buttonLink, backgroundColor? }
- "testimonials": { heading, layout: "cards"|"single", items: [{quote, name, role?, avatar?}] }
- "pricing": { heading, subheading?, columns: [{name, price, period?, features: string[], ctaText, highlighted: bool}] }
- "faq": { heading, items: [{question, answer}] }
- "gallery": { heading?, columns: 2-4, images: [{src, alt}] }
- "contact": { heading, showForm: bool, email?, phone?, address?, mapEmbed? }
- "team": { heading, members: [{name, role, photo?, bio?}] }
- "stats": { items: [{value, label, prefix?, suffix?}] }
- "logo-cloud": { heading?, logos: [{src, alt, url?}] }
- "footer": { companyName, links: [[{label, href}]], copyright?, socialLinks: [{platform, url}] }

Each block object: { id: "unique_string", type: "block_type", data: { ...block_data }, style: { paddingY: "lg", paddingX: "md", maxWidth: "lg" } }`;

// ============================================================================
// WEBSITE AI SERVICE
// ============================================================================

export class WebsiteAIService {
  private provider: AIProvider;
  private isMock: boolean;

  constructor(config: ProviderConfig | null) {
    this.provider = AIProviderFactory.create(config);
    this.isMock = AIProviderFactory.isMock(config);
  }

  /**
   * Generate a complete website from business description
   */
  async generateWebsite(input: GenerateWebsiteInput): Promise<GeneratedWebsite> {
    if (this.isMock) {
      return this.mockGenerateWebsite(input);
    }

    const pages = input.selectedPages || ['Home', 'About', 'Services', 'Contact'];
    const theme = { ...defaultTheme, ...(styleThemes[input.style || 'Professional'] || {}) };

    const systemPrompt = `You are an expert web designer AI. Generate a complete website as JSON.

${blockSchemaDescription}

RULES:
- Every page MUST start with a "header" block and end with a "footer" block
- The home page should have a "hero" block right after the header
- Use realistic, industry-appropriate placeholder content for a ${input.businessType} business named "${input.businessName}"
- For images, use https://placehold.co/WIDTHxHEIGHT/COLOR/ffffff?text=LABEL format
- Generate unique block IDs using format "blk_RANDOM" (8+ chars)
- Make content specific and compelling, NOT generic
- Include 4-8 blocks per page (including header/footer)`;

    const userPrompt = `Generate a website for:
Business: "${input.businessName}"
Type: ${input.businessType}
Description: ${input.businessDescription || 'A ' + input.businessType.toLowerCase() + ' business'}
Style: ${input.style || 'Professional'}
Pages needed: ${pages.join(', ')}

Return JSON: { "pages": [{ "slug": "home", "title": "Home", "isHomePage": true, "showInNav": true, "blocks": [...] }] }`;

    try {
      const { data: result, usage } = await this.provider.chatJSON<{ pages: GeneratedPage[] }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        '{ "pages": [{ "slug": string, "title": string, "isHomePage": boolean, "showInNav": boolean, "blocks": WebsiteBlock[] }] }',
        { maxTokens: 8192, temperature: 0.7 },
      );

      // Validate and fix block IDs
      for (const page of result.pages) {
        for (const block of page.blocks) {
          if (!block.id) block.id = generateBlockId();
          if (!block.style) block.style = { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' };
        }
      }

      return { theme, pages: result.pages, usage };
    } catch (err) {
      console.error('AI generation failed, falling back to mock:', err);
      return this.mockGenerateWebsite(input);
    }
  }

  /**
   * AI Coach chat — business advisor + site editor
   */
  async coachChat(
    command: string,
    siteContext: { businessName: string; businessType: string; pages: { slug: string; title: string; blocks: WebsiteBlock[] }[] },
    history: Message[],
  ): Promise<CoachResponse> {
    if (this.isMock) {
      return this.mockCoachChat(command);
    }

    const systemPrompt = `You are an AI website coach for "${siteContext.businessName}" (${siteContext.businessType}).
You help the user improve their website AND give business advice.

Current site structure:
${siteContext.pages.map(p => `- Page "${p.title}" (/${p.slug}): ${p.blocks.length} blocks [${p.blocks.map(b => b.type).join(', ')}]`).join('\n')}

${blockSchemaDescription}

RESPONSE FORMAT (JSON):
{
  "message": "Your conversational response to the user",
  "operations": [
    {
      "id": "op_unique_id",
      "type": "add_block" | "update_block" | "remove_block" | "update_theme" | "update_seo",
      "description": "Human-readable description of the change",
      "payload": { ...change data }
    }
  ],
  "suggestions": ["Optional follow-up suggestions as strings"]
}

For "add_block": payload = { pageSlug, afterBlockId?, block: WebsiteBlock }
For "update_block": payload = { pageSlug, blockId, updates: partial block data }
For "remove_block": payload = { pageSlug, blockId }
For "update_theme": payload = { ...partial theme }
For "update_seo": payload = { pageSlug, seo: { title?, description?, ogImage? } }

If the user asks for advice (SEO, marketing, etc.), return operations=[] and put advice in message+suggestions.
If the user asks for site changes, return the changes as operations the user can accept/reject.`;

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // last 10 messages for context
      { role: 'user', content: command },
    ];

    try {
      const { data: result, usage } = await this.provider.chatJSON<CoachResponse>(
        messages,
        '{ "message": string, "operations": CoachOperation[], "suggestions": string[] }',
        { maxTokens: 4096, temperature: 0.7 },
      );

      // Ensure valid structure
      return {
        message: result.message || 'I processed your request.',
        operations: Array.isArray(result.operations) ? result.operations : [],
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
        usage,
      };
    } catch (err) {
      console.error('AI coach chat failed:', err);
      return this.mockCoachChat(command);
    }
  }

  /**
   * Generate a single block
   */
  async generateBlock(type: BlockType, businessContext: { businessName: string; businessType: string }): Promise<WebsiteBlock & { usage?: TokenUsage }> {
    if (this.isMock) {
      return createDefaultBlock(type);
    }

    const systemPrompt = `Generate a single website block as JSON for a ${businessContext.businessType} business named "${businessContext.businessName}".
${blockSchemaDescription}
Return only the block object. Make the content specific and compelling for this business type.`;

    try {
      const { data: block, usage } = await this.provider.chatJSON<WebsiteBlock>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a "${type}" block with realistic content.` },
        ],
        'WebsiteBlock { id, type, data, style }',
        { maxTokens: 2048, temperature: 0.7 },
      );

      if (!block.id) block.id = generateBlockId();
      if (!block.style) block.style = { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' };
      block.type = type; // Ensure type is correct
      return { ...block, usage };
    } catch {
      return createDefaultBlock(type);
    }
  }

  /**
   * Rewrite block content with an instruction
   */
  async rewriteContent(block: WebsiteBlock, instruction: string): Promise<WebsiteBlock & { usage?: TokenUsage }> {
    if (this.isMock) {
      return { ...block, data: { ...block.data } };
    }

    const systemPrompt = `You are a website content editor. Given a block and an instruction, return the modified block as JSON.
Keep the same block structure, only modify the content/data as instructed.`;

    try {
      const { data: result, usage } = await this.provider.chatJSON<WebsiteBlock>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Block: ${JSON.stringify(block)}\n\nInstruction: ${instruction}\n\nReturn the modified block as JSON.` },
        ],
        'WebsiteBlock { id, type, data, style }',
        { maxTokens: 2048, temperature: 0.5 },
      );

      result.id = block.id; // Preserve original ID
      result.type = block.type; // Preserve type
      return { ...result, usage };
    } catch {
      return block;
    }
  }

  /**
   * Generate SEO metadata for pages
   */
  async generateSeo(pages: { slug: string; title: string; blocks: WebsiteBlock[] }[], businessContext: { businessName: string; businessType: string }): Promise<{ seo: Record<string, { title: string; description: string }>; usage?: TokenUsage }> {
    if (this.isMock) {
      const seo: Record<string, { title: string; description: string }> = {};
      for (const page of pages) {
        seo[page.slug] = {
          title: `${page.title} | ${businessContext.businessName}`,
          description: `${page.title} page for ${businessContext.businessName}, a ${businessContext.businessType.toLowerCase()} business.`,
        };
      }
      return { seo };
    }

    try {
      const { data, usage } = await this.provider.chatJSON<Record<string, { title: string; description: string }>>(
        [
          { role: 'system', content: 'Generate SEO meta titles and descriptions for each page of a website. Return JSON mapping page slug to { title, description }. Titles should be 50-60 chars, descriptions 150-160 chars.' },
          { role: 'user', content: `Business: "${businessContext.businessName}" (${businessContext.businessType})\nPages: ${pages.map(p => `${p.slug}: ${p.title}`).join(', ')}` },
        ],
        '{ "home": { "title": string, "description": string }, ... }',
        { maxTokens: 1024, temperature: 0.3 },
      );
      return { seo: data, usage };
    } catch {
      const seo: Record<string, { title: string; description: string }> = {};
      for (const page of pages) {
        seo[page.slug] = {
          title: `${page.title} | ${businessContext.businessName}`,
          description: `${page.title} page for ${businessContext.businessName}.`,
        };
      }
      return { seo };
    }
  }

  // ============================================================================
  // MOCK IMPLEMENTATIONS
  // ============================================================================

  private mockGenerateWebsite(input: GenerateWebsiteInput): GeneratedWebsite {
    const pages = input.selectedPages || ['Home', 'About', 'Services', 'Contact'];
    const theme: WebsiteTheme = { ...defaultTheme, ...(styleThemes[input.style || 'Professional'] || {}) };
    const name = input.businessName || 'My Business';
    const type = input.businessType || 'business';

    const generatedPages: GeneratedPage[] = pages.map((pageName, i) => {
      const slug = pageName.toLowerCase().replace(/\s+/g, '-');
      const isHome = i === 0 || pageName === 'Home';

      const blocks: WebsiteBlock[] = [
        {
          id: generateBlockId(), type: 'header',
          data: {
            logoText: name,
            navLinks: pages.map(p => ({ label: p, href: p === 'Home' ? '/' : '/' + p.toLowerCase() })),
            ctaText: 'Get Started', ctaLink: '/contact',
          },
          style: { paddingY: 'md', paddingX: 'md', maxWidth: 'xl' },
        },
      ];

      if (isHome) {
        blocks.push({
          id: generateBlockId(), type: 'hero',
          data: {
            heading: `Welcome to ${name}`,
            subheading: `Your trusted ${type.toLowerCase()} partner — modern solutions for modern businesses.`,
            ctaText: 'Learn More', ctaLink: '/about',
            layout: 'simple', alignment: 'center',
          },
          style: { paddingY: 'xl', paddingX: 'md', maxWidth: 'lg' },
        });
        blocks.push({
          id: generateBlockId(), type: 'features',
          data: {
            heading: 'Why Choose Us',
            subheading: 'We deliver excellence in every project.',
            columns: 3,
            items: [
              { icon: 'zap', title: 'Fast & Efficient', description: `We deliver results quickly without compromising quality.` },
              { icon: 'shield', title: 'Reliable & Trusted', description: `Years of experience serving the ${type.toLowerCase()} industry.` },
              { icon: 'users', title: 'Client-Focused', description: 'Your success is our top priority.' },
            ],
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
        blocks.push({
          id: generateBlockId(), type: 'cta',
          data: {
            heading: 'Ready to Get Started?',
            text: 'Contact us today for a free consultation.',
            buttonText: 'Contact Us', buttonLink: '/contact',
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'About') {
        blocks.push({
          id: generateBlockId(), type: 'hero',
          data: { heading: 'About Us', subheading: `Learn about ${name} and our mission.`, layout: 'simple', alignment: 'center' },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
        blocks.push({
          id: generateBlockId(), type: 'text',
          data: { content: `<p>${name} was founded with a simple mission: to provide exceptional ${type.toLowerCase()} services to our community. Our team of dedicated professionals brings years of experience and a passion for excellence to every project.</p>` },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'md' },
        });
        blocks.push({
          id: generateBlockId(), type: 'stats',
          data: { items: [{ value: '10', label: 'Years Experience', suffix: '+' }, { value: '500', label: 'Happy Clients', suffix: '+' }, { value: '98', label: 'Satisfaction', suffix: '%' }] },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'Services') {
        blocks.push({
          id: generateBlockId(), type: 'hero',
          data: { heading: 'Our Services', subheading: 'Comprehensive solutions tailored to your needs.', layout: 'simple', alignment: 'center' },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
        blocks.push({
          id: generateBlockId(), type: 'features',
          data: {
            heading: 'What We Offer', columns: 3,
            items: [
              { icon: 'target', title: 'Consulting', description: 'Expert guidance to help you reach your goals.' },
              { icon: 'palette', title: 'Design', description: 'Beautiful solutions that represent your brand.' },
              { icon: 'code', title: 'Development', description: 'Custom built for your specific needs.' },
            ],
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'Contact') {
        blocks.push({
          id: generateBlockId(), type: 'contact',
          data: { heading: 'Get in Touch', showForm: true, email: 'hello@example.com', phone: '(555) 123-4567', address: '123 Main St, City, ST 12345' },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'FAQ') {
        blocks.push({
          id: generateBlockId(), type: 'faq',
          data: {
            heading: 'Frequently Asked Questions',
            items: [
              { question: 'What services do you offer?', answer: `We offer a wide range of ${type.toLowerCase()} services tailored to your needs.` },
              { question: 'How can I get started?', answer: 'Simply contact us through our form or give us a call. We offer free consultations.' },
              { question: 'What are your hours?', answer: 'We\'re available Monday through Friday, 9am to 6pm.' },
            ],
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'Testimonials') {
        blocks.push({
          id: generateBlockId(), type: 'testimonials',
          data: {
            heading: 'What Our Clients Say', layout: 'cards',
            items: [
              { quote: `Working with ${name} was the best decision for our business.`, name: 'Jane S.', role: 'Business Owner' },
              { quote: 'Professional, reliable, and truly exceptional service.', name: 'Mike R.', role: 'Marketing Director' },
            ],
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else if (pageName === 'Pricing') {
        blocks.push({
          id: generateBlockId(), type: 'pricing',
          data: {
            heading: 'Our Plans', subheading: 'Choose the perfect plan for your needs.',
            columns: [
              { name: 'Basic', price: '$49', period: '/mo', features: ['Core Features', 'Email Support'], ctaText: 'Get Started', highlighted: false },
              { name: 'Pro', price: '$99', period: '/mo', features: ['All Basic Features', 'Priority Support', 'Advanced Tools'], ctaText: 'Get Started', highlighted: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'Dedicated Manager', 'Custom Solutions'], ctaText: 'Contact Us', highlighted: false },
            ],
          },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
      } else {
        // Generic page
        blocks.push({
          id: generateBlockId(), type: 'hero',
          data: { heading: pageName, subheading: `Learn more about our ${pageName.toLowerCase()}.`, layout: 'simple', alignment: 'center' },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'lg' },
        });
        blocks.push({
          id: generateBlockId(), type: 'text',
          data: { content: `<p>Content for ${pageName} coming soon. This page will be updated with relevant information.</p>` },
          style: { paddingY: 'lg', paddingX: 'md', maxWidth: 'md' },
        });
      }

      // Footer on every page
      blocks.push({
        id: generateBlockId(), type: 'footer',
        data: {
          companyName: name,
          links: [pages.slice(0, 4).map(p => ({ label: p, href: p === 'Home' ? '/' : '/' + p.toLowerCase() }))],
          copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
        },
        style: { paddingY: 'md', paddingX: 'md', maxWidth: 'xl' },
      });

      return { slug, title: pageName, isHomePage: isHome, showInNav: true, blocks };
    });

    return { theme, pages: generatedPages };
  }

  private mockCoachChat(command: string): CoachResponse {
    const lower = command.toLowerCase();

    if (lower.includes('testimonial') || lower.includes('review')) {
      return {
        message: 'I\'ll add a testimonials section to your home page. This will help build trust with potential customers.',
        operations: [{
          id: `op_${Date.now()}`,
          type: 'add_block',
          description: 'Add testimonials section to home page',
          payload: {
            pageSlug: 'home',
            block: createDefaultBlock('testimonials'),
          },
        }],
        suggestions: ['Add customer photos for more authenticity', 'Include star ratings', 'Link to external review sites'],
      };
    }

    if (lower.includes('seo') || lower.includes('search')) {
      return {
        message: 'Here are my SEO recommendations for your site:\n\n1. **Meta descriptions** — Add unique descriptions for each page (150-160 chars)\n2. **Heading structure** — Ensure each page has exactly one H1 tag\n3. **Image alt text** — Add descriptive alt text to all images\n4. **Internal linking** — Cross-link between related pages\n5. **Content length** — Aim for 300+ words on key pages',
        operations: [],
        suggestions: ['Generate SEO meta tags for all pages', 'Add a blog section for organic traffic', 'Check page load speed'],
      };
    }

    if (lower.includes('customer') || lower.includes('lead') || lower.includes('traffic')) {
      return {
        message: 'Here are strategies to attract more customers:\n\n1. **Add social proof** — Testimonials and case studies build trust\n2. **Strong CTA above the fold** — Make your value proposition clear immediately\n3. **Content marketing** — A blog drives organic traffic\n4. **Local SEO** — Optimize for local search if you serve a specific area\n5. **Email capture** — Offer something valuable in exchange for email signups',
        operations: [],
        suggestions: ['Add a testimonials section', 'Create a lead capture CTA', 'Start a blog page'],
      };
    }

    return {
      message: 'I\'m your AI website coach! I can help you:\n\n- **Add sections** — "Add a testimonials section"\n- **Improve SEO** — "How\'s my SEO?"\n- **Business advice** — "How can I get more customers?"\n- **Edit content** — "Update my phone number to 555-9999"\n\nWhat would you like help with?',
      operations: [],
      suggestions: ['Add a testimonials section', 'Improve my SEO', 'How can I get more customers?'],
    };
  }
}
