/**
 * Multi-Provider AI Abstraction
 * Supports: DeepSeek (default), OpenAI, Anthropic/Claude, Groq, and any OpenAI-compatible endpoint.
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// TYPES
// ============================================================================

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface ProviderConfig {
  provider: 'deepseek' | 'openai' | 'anthropic' | 'groq' | 'custom';
  apiKey: string;
  modelName?: string;
  baseUrl?: string;
}

export interface AIProvider {
  chat(messages: Message[], options?: ChatOptions): Promise<string>;
  chatJSON<T>(messages: Message[], schemaHint: string, options?: ChatOptions): Promise<T>;
}

// ============================================================================
// PROVIDER DEFAULTS
// ============================================================================

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string; model: string }> = {
  deepseek: { baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' },
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  anthropic: { baseUrl: '', model: 'claude-sonnet-4-20250514' },
  custom: { baseUrl: '', model: '' },
};

// ============================================================================
// OPENAI-COMPATIBLE PROVIDER (DeepSeek, OpenAI, Groq, Custom)
// ============================================================================

class OpenAICompatibleProvider implements AIProvider {
  private client: OpenAI;
  private model: string;

  constructor(config: ProviderConfig) {
    const defaults = PROVIDER_DEFAULTS[config.provider] || PROVIDER_DEFAULTS.custom;
    this.model = config.modelName || defaults.model;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl || defaults.baseUrl,
    });
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      top_p: options?.topP,
    });
    return response.choices[0]?.message?.content || '';
  }

  async chatJSON<T>(messages: Message[], schemaHint: string, options?: ChatOptions): Promise<T> {
    const systemMsg = messages.find(m => m.role === 'system');
    const otherMsgs = messages.filter(m => m.role !== 'system');

    const enhancedSystem = `${systemMsg?.content || ''}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no explanation. The JSON must conform to this schema:\n${schemaHint}`;

    const allMessages: Message[] = [
      { role: 'system', content: enhancedSystem },
      ...otherMsgs,
    ];

    const raw = await this.chat(allMessages, { ...options, temperature: options?.temperature ?? 0.3 });

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}

// ============================================================================
// ANTHROPIC PROVIDER
// ============================================================================

class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(config: ProviderConfig) {
    this.model = config.modelName || PROVIDER_DEFAULTS.anthropic.model;
    this.client = new Anthropic({ apiKey: config.apiKey });
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    const systemMsg = messages.find(m => m.role === 'system');
    const nonSystemMsgs = messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
      ...(systemMsg ? { system: systemMsg.content } : {}),
      messages: nonSystemMsgs.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const textBlock = response.content.find(b => b.type === 'text');
    return textBlock ? (textBlock as { type: 'text'; text: string }).text : '';
  }

  async chatJSON<T>(messages: Message[], schemaHint: string, options?: ChatOptions): Promise<T> {
    const systemMsg = messages.find(m => m.role === 'system');
    const otherMsgs = messages.filter(m => m.role !== 'system');

    const enhancedSystem = `${systemMsg?.content || ''}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no explanation. The JSON must conform to this schema:\n${schemaHint}`;

    const allMessages: Message[] = [
      { role: 'system', content: enhancedSystem },
      ...otherMsgs,
    ];

    const raw = await this.chat(allMessages, { ...options, temperature: options?.temperature ?? 0.3 });
    const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}

// ============================================================================
// MOCK PROVIDER (for development/testing without API key)
// ============================================================================

class MockProvider implements AIProvider {
  async chat(messages: Message[]): Promise<string> {
    const lastMsg = messages[messages.length - 1]?.content || '';
    if (lastMsg.toLowerCase().includes('seo')) {
      return 'Your site has good heading structure. Consider adding more descriptive meta descriptions and alt text for images. Adding structured data (schema.org) could improve search visibility.';
    }
    if (lastMsg.toLowerCase().includes('customer') || lastMsg.toLowerCase().includes('lead')) {
      return 'To attract more customers, consider: 1) Add social proof (testimonials, case studies), 2) Create a clear value proposition above the fold, 3) Include calls-to-action on every page, 4) Start a blog for organic traffic.';
    }
    return 'I can help you improve your website! Try asking me to add sections, improve your SEO, or give business advice.';
  }

  async chatJSON<T>(_messages: Message[], _schemaHint: string): Promise<T> {
    // Return a mock response — the website-ai service handles mock generation directly
    return { message: 'Mock mode active. Configure an AI provider in Settings to use real AI generation.' } as T;
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export class AIProviderFactory {
  static create(config: ProviderConfig | null): AIProvider {
    if (!config || !config.apiKey) {
      return new MockProvider();
    }

    switch (config.provider) {
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'deepseek':
      case 'openai':
      case 'groq':
      case 'custom':
      default:
        return new OpenAICompatibleProvider(config);
    }
  }

  static isMock(config: ProviderConfig | null): boolean {
    return !config || !config.apiKey;
  }
}

/**
 * Test connection to a provider by sending a simple message.
 */
export async function testProviderConnection(config: ProviderConfig): Promise<{ success: boolean; message: string }> {
  try {
    const provider = AIProviderFactory.create(config);
    const response = await provider.chat([
      { role: 'user', content: 'Say "connected" in one word.' },
    ], { maxTokens: 10, temperature: 0 });

    if (response && response.length > 0) {
      return { success: true, message: `Connected to ${config.provider}. Response: "${response.trim()}"` };
    }
    return { success: false, message: 'No response received from provider.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed.' };
  }
}
