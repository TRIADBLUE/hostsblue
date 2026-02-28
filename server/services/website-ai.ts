/**
 * Website AI Service — Coach Green: generation, coach chat, rewrite, SEO, onboarding
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
  preview?: {
    label: string;
    before?: string;
    after?: string;
    blockType?: string;
  };
}

export interface OnboardingChatInput {
  message: string;
  step: 'greeting' | 'business_name' | 'business_type' | 'style' | 'pages' | 'generate';
  context: {
    businessName?: string;
    businessType?: string;
    style?: string;
    selectedPages?: string[];
  };
}

export interface OnboardingChatResponse {
  message: string;
  extractedData?: {
    businessName?: string;
    businessType?: string;
    style?: string;
    selectedPages?: string[];
  };
  readyToGenerate?: boolean;
  suggestions?: string[];
  usage?: TokenUsage;
}

// ============================================================================
// COACH GREEN SYSTEM PROMPT
// ============================================================================

const COACH_GREEN_PERSONA = `You are Coach Green, the friendly AI website-building assistant at hostsblue.com.

PERSONALITY:
- Warm, encouraging, and professional — like a knowledgeable friend who happens to be a web expert
- You celebrate user progress ("Great choice!" "That's going to look amazing!")
- You give direct, actionable advice — never vague
- You speak in first person and address the user directly
- You're enthusiastic about helping businesses grow online
- You never mention AI providers, models, or technical AI details — you are simply "Coach Green"

RULES:
- NEVER say "I'm an AI" or mention GPT/Claude/DeepSeek/OpenAI/Anthropic
- NEVER give generic advice — always tailor to their specific business
- Keep responses concise (2-4 sentences for chat, longer for business advice)
- When suggesting site changes, always explain WHY it helps their business
- Use hostsblue brand language: "your site", "your visitors", "your customers"
- If you don't know something, say "Let me think about the best approach for your business..."`;

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
   * Onboarding chat — Coach Green guides the user through setup
   */
  async onboardingChat(input: OnboardingChatInput): Promise<OnboardingChatResponse> {
    if (this.isMock) {
      return this.mockOnboardingChat(input);
    }

    const systemPrompt = `${COACH_GREEN_PERSONA}

You are helping a user set up their new website through a conversational onboarding flow.

Current step: ${input.step}
Context gathered so far: ${JSON.stringify(input.context)}

Your job is to:
1. Respond warmly to their input
2. Extract any relevant data from their message (business name, type, style preference, page selections)
3. Guide them to the next step naturally

RESPONSE FORMAT (JSON):
{
  "message": "Your conversational response",
  "extractedData": { "businessName"?: string, "businessType"?: string, "style"?: string, "selectedPages"?: string[] },
  "readyToGenerate": boolean,
  "suggestions": ["optional quick-reply suggestions"]
}

Step guidance:
- "greeting": Welcome them, ask about their business name
- "business_name": Acknowledge their name, ask what type of business
- "business_type": Acknowledge type, ask about preferred style (Professional, Creative, Bold, Minimal)
- "style": Acknowledge style, suggest pages (Home, About, Services, Contact, FAQ, Testimonials, Pricing)
- "pages": Acknowledge pages, set readyToGenerate=true
- "generate": Confirm everything and set readyToGenerate=true

Extract data from natural language. For example:
- "I run a bakery called Sweet Dreams" -> { businessName: "Sweet Dreams", businessType: "Bakery" }
- "I want it to look clean and modern" -> { style: "Minimal" }`;

    try {
      const { data: result, usage } = await this.provider.chatJSON<OnboardingChatResponse>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input.message },
        ],
        '{ "message": string, "extractedData"?: object, "readyToGenerate"?: boolean, "suggestions"?: string[] }',
        { maxTokens: 1024, temperature: 0.7 },
      );

      return {
        message: result.message || "Let's get started!",
        extractedData: result.extractedData,
        readyToGenerate: result.readyToGenerate || false,
        suggestions: result.suggestions || [],
        usage,
      };
    } catch (err) {
      console.error('Onboarding chat failed:', err);
      return this.mockOnboardingChat(input);
    }
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

    const systemPrompt = `${COACH_GREEN_PERSONA}

You are generating a complete website as JSON.

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
   * AI Coach chat — Coach Green: business advisor + site editor
   */
  async coachChat(
    command: string,
    siteContext: { businessName: string; businessType: string; pages: { slug: string; title: string; blocks: WebsiteBlock[] }[] },
    history: Message[],
  ): Promise<CoachResponse> {
    if (this.isMock) {
      return this.mockCoachChat(command);
    }

    const systemPrompt = `${COACH_GREEN_PERSONA}

You are coaching the user on their website for "${siteContext.businessName}" (${siteContext.businessType}).
You help improve their website AND give business/marketing advice.

Current site structure:
${siteContext.pages.map(p => `- Page "${p.title}" (/${p.slug}): ${p.blocks.length} blocks [${p.blocks.map(b => b.type).join(', ')}]`).join('\n')}

${blockSchemaDescription}

RESPONSE FORMAT (JSON):
{
  "message": "Your conversational response as Coach Green",
  "operations": [
    {
      "id": "op_unique_id",
      "type": "add_block" | "update_block" | "remove_block" | "update_theme" | "update_seo",
      "description": "Human-readable description of the change",
      "payload": { ...change data },
      "preview": {
        "label": "Short label for the preview card",
        "before": "Optional text showing current state",
        "after": "Text showing what it will look like after",
        "blockType": "Optional block type being added"
      }
    }
  ],
  "suggestions": ["Optional follow-up suggestions as strings"]
}

For "add_block": payload = { pageSlug, afterBlockId?, block: WebsiteBlock }
For "update_block": payload = { pageSlug, blockId, updates: partial block data }
For "remove_block": payload = { pageSlug, blockId }
For "update_theme": payload = { ...partial theme }
For "update_seo": payload = { pageSlug, seo: { title?, description?, ogImage? } }

IMPORTANT:
- Always include a "preview" object on operations so users can see before/after
- If the user asks for advice (SEO, marketing, etc.), return operations=[] and put advice in message+suggestions
- If the user asks for site changes, return the changes as operations they can accept/reject
- Explain WHY each change helps their business`;

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10),
      { role: 'user', content: command },
    ];

    try {
      const { data: result, usage } = await this.provider.chatJSON<CoachResponse>(
        messages,
        '{ "message": string, "operations": CoachOperation[], "suggestions": string[] }',
        { maxTokens: 4096, temperature: 0.7 },
      );

      return {
        message: result.message || "I've got some ideas for you!",
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

    const systemPrompt = `${COACH_GREEN_PERSONA}

Generate a single website block as JSON for a ${businessContext.businessType} business named "${businessContext.businessName}".
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
      block.type = type;
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

    const systemPrompt = `${COACH_GREEN_PERSONA}

You are editing website content. Given a block and an instruction, return the modified block as JSON.
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

      result.id = block.id;
      result.type = block.type;
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
          { role: 'system', content: `${COACH_GREEN_PERSONA}\n\nGenerate SEO meta titles and descriptions for each page of a website. Return JSON mapping page slug to { title, description }. Titles should be 50-60 chars, descriptions 150-160 chars.` },
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

  private mockOnboardingChat(input: OnboardingChatInput): OnboardingChatResponse {
    const { step, context } = input;

    switch (step) {
      case 'greeting':
        return {
          message: "Hey there! I'm Coach Green, your website-building sidekick. I'm going to help you create a beautiful website in just a few minutes. Let's start with the basics — what's your business name?",
          suggestions: [],
        };

      case 'business_name': {
        const name = input.message.trim();
        return {
          message: `Love it — "${name}" is a great name! What type of business is ${name}? For example: Restaurant, Law Firm, Fitness Studio, Photography, Tech Startup...`,
          extractedData: { businessName: name },
          suggestions: ['Restaurant', 'Law Firm', 'Fitness Studio', 'Photography'],
        };
      }

      case 'business_type': {
        const type = input.message.trim();
        return {
          message: `A ${type} — exciting! Now let's talk style. How do you want your site to feel?\n\n- **Professional** — Clean, corporate, trustworthy\n- **Creative** — Vibrant, artistic, unique\n- **Bold** — Strong colors, high-energy\n- **Minimal** — Simple, elegant, spacious`,
          extractedData: { businessType: type },
          suggestions: ['Professional', 'Creative', 'Bold', 'Minimal'],
        };
      }

      case 'style': {
        const style = input.message.trim();
        const matched = Object.keys(styleThemes).find(s => style.toLowerCase().includes(s.toLowerCase())) || 'Professional';
        return {
          message: `${matched} style — that's going to look amazing! Last step: which pages do you want? I'd recommend starting with these, but you can customize:`,
          extractedData: { style: matched },
          suggestions: ['Home, About, Services, Contact', 'Home, About, Services, FAQ, Contact', 'Home, About, Pricing, Testimonials, Contact'],
        };
      }

      case 'pages':
      case 'generate': {
        const pages = input.message.includes(',')
          ? input.message.split(',').map(p => p.trim()).filter(Boolean)
          : ['Home', 'About', 'Services', 'Contact'];
        return {
          message: `Perfect! I've got everything I need. Here's what I'm building:\n\n- **Business:** ${context.businessName || 'Your Business'}\n- **Type:** ${context.businessType || 'Business'}\n- **Style:** ${context.style || 'Professional'}\n- **Pages:** ${pages.join(', ')}\n\nLet me work my magic... ✨`,
          extractedData: { selectedPages: pages },
          readyToGenerate: true,
          suggestions: [],
        };
      }

      default:
        return {
          message: "Hey! I'm Coach Green. Let's build your website — what's your business name?",
          suggestions: [],
        };
    }
  }

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
        message: "Great idea! Social proof is one of the most powerful conversion tools. I'll add a testimonials section to your home page — this will help build trust with potential customers who are on the fence.",
        operations: [{
          id: `op_${Date.now()}`,
          type: 'add_block',
          description: 'Add testimonials section to home page',
          payload: {
            pageSlug: 'home',
            block: createDefaultBlock('testimonials'),
          },
          preview: {
            label: 'Add Testimonials',
            after: 'New testimonials section with customer quotes',
            blockType: 'testimonials',
          },
        }],
        suggestions: ['Add customer photos for more authenticity', 'Include star ratings', 'Link to external review sites'],
      };
    }

    if (lower.includes('seo') || lower.includes('search')) {
      return {
        message: "Let me analyze your site's SEO. Here are my recommendations:\n\n1. **Meta descriptions** — Add unique descriptions for each page (150-160 chars)\n2. **Heading structure** — Ensure each page has exactly one H1 tag\n3. **Image alt text** — Add descriptive alt text to all images\n4. **Internal linking** — Cross-link between related pages\n5. **Content length** — Aim for 300+ words on key pages\n\nThese changes can significantly boost your search rankings!",
        operations: [],
        suggestions: ['Generate SEO meta tags for all pages', 'Add a blog section for organic traffic', 'Check page load speed'],
      };
    }

    if (lower.includes('customer') || lower.includes('lead') || lower.includes('traffic')) {
      return {
        message: "Great question! Here's my playbook for attracting more customers:\n\n1. **Add social proof** — Testimonials and case studies build instant trust\n2. **Strong CTA above the fold** — Make your value proposition crystal clear\n3. **Content marketing** — A blog drives organic traffic over time\n4. **Local SEO** — Huge win if you serve a specific area\n5. **Email capture** — Offer something valuable in exchange for signups\n\nWant me to add any of these to your site?",
        operations: [],
        suggestions: ['Add a testimonials section', 'Create a lead capture CTA', 'Start a blog page'],
      };
    }

    return {
      message: "Hey! I'm Coach Green, your website-building partner. I can help you:\n\n- **Add sections** — \"Add a testimonials section\"\n- **Improve SEO** — \"How's my SEO?\"\n- **Business advice** — \"How can I get more customers?\"\n- **Edit content** — \"Update my phone number to 555-9999\"\n\nWhat would you like to work on?",
      operations: [],
      suggestions: ['Add a testimonials section', 'Improve my SEO', 'How can I get more customers?'],
    };
  }
}
