/**
 * OpenSRS Hosted Email Integration Service
 * Handles email domain, mailbox, alias, and spam management via OpenSRS Hosted Email REST API
 *
 * API: JSON REST over HTTPS
 * Auth: HTTP Basic (username:password)
 * Base URL (test): https://admin.test.hostedemail.com/api
 * Base URL (prod): https://admin.hostedemail.com/api
 */

export class OpenSRSEmailError extends Error {
  code: string;
  retryable: boolean;
  details?: any;

  constructor(message: string, code: string, retryable: boolean = false, details?: any) {
    super(message);
    this.name = 'OpenSRSEmailError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;
  }
}

const OPENSRS_EMAIL_API_URL = process.env.OPENSRS_EMAIL_API_URL || 'https://admin.test.hostedemail.com/api';
const OPENSRS_EMAIL_USER = process.env.OPENSRS_EMAIL_USER || '';
const OPENSRS_EMAIL_PASSWORD = process.env.OPENSRS_EMAIL_PASSWORD || '';

export class OpenSRSEmailIntegration {
  private apiUrl: string;
  private authHeader: string;
  private isMockMode: boolean;

  constructor() {
    this.apiUrl = OPENSRS_EMAIL_API_URL;
    this.authHeader = Buffer.from(`${OPENSRS_EMAIL_USER}:${OPENSRS_EMAIL_PASSWORD}`).toString('base64');

    this.isMockMode = !OPENSRS_EMAIL_USER || OPENSRS_EMAIL_USER === 'test' || OPENSRS_EMAIL_USER === 'your_email_reseller_user';

    if (this.isMockMode) {
      console.warn('OpenSRS Email credentials not configured - using mock mode');
    }
  }

  /**
   * Make authenticated request to OpenSRS Hosted Email REST API
   */
  private async apiRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<any> {
    if (this.isMockMode) {
      return this.mockResponse(endpoint, method, body);
    }

    const url = `${this.apiUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Basic ${this.authHeader}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const retryable = response.status >= 500;
        throw new OpenSRSEmailError(
          `OpenSRS Email API error (${response.status}): ${errorText}`,
          `OPENSRS_EMAIL_HTTP_${response.status}`,
          retryable,
          { status: response.status, body: errorText }
        );
      }

      const text = await response.text();
      if (!text) return {};
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof OpenSRSEmailError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new OpenSRSEmailError(
          'OpenSRS Email API request timed out',
          'OPENSRS_EMAIL_TIMEOUT',
          true
        );
      }
      throw new OpenSRSEmailError(
        `OpenSRS Email API request failed: ${(error as Error).message}`,
        'OPENSRS_EMAIL_NETWORK_ERROR',
        true,
        { originalError: (error as Error).message }
      );
    }
  }

  // ===========================================================================
  // DOMAIN MANAGEMENT (email domain, not registration)
  // ===========================================================================

  async createMailDomain(domain: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}`, 'POST', { domain });
  }

  async deleteMailDomain(domain: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}`, 'DELETE');
  }

  async getMailDomain(domain: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}`);
  }

  // ===========================================================================
  // MAILBOX MANAGEMENT
  // ===========================================================================

  async createMailbox(
    domain: string,
    username: string,
    password: string,
    options?: {
      storageQuotaMB?: number;
      firstName?: string;
      lastName?: string;
      forwardingAddress?: string;
    }
  ): Promise<any> {
    return this.apiRequest(`/domains/${domain}/mailboxes/${username}`, 'POST', {
      password,
      ...(options?.storageQuotaMB && { quota: options.storageQuotaMB }),
      ...(options?.firstName && { first_name: options.firstName }),
      ...(options?.lastName && { last_name: options.lastName }),
      ...(options?.forwardingAddress && { forward: options.forwardingAddress }),
    });
  }

  async deleteMailbox(domain: string, username: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}/mailboxes/${username}`, 'DELETE');
  }

  async getMailbox(domain: string, username: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}/mailboxes/${username}`);
  }

  async updateMailbox(
    domain: string,
    username: string,
    updates: {
      password?: string;
      storageQuotaMB?: number;
      forwardingAddress?: string;
      autoResponder?: {
        enabled: boolean;
        subject: string;
        body: string;
        startDate?: Date;
        endDate?: Date;
      };
    }
  ): Promise<any> {
    const payload: Record<string, any> = {};

    if (updates.password) payload.password = updates.password;
    if (updates.storageQuotaMB) payload.quota = updates.storageQuotaMB;
    if (updates.forwardingAddress !== undefined) payload.forward = updates.forwardingAddress;

    if (updates.autoResponder) {
      payload.vacation = {
        enabled: updates.autoResponder.enabled ? 1 : 0,
        subject: updates.autoResponder.subject,
        body: updates.autoResponder.body,
        ...(updates.autoResponder.startDate && { start: updates.autoResponder.startDate.toISOString().split('T')[0] }),
        ...(updates.autoResponder.endDate && { end: updates.autoResponder.endDate.toISOString().split('T')[0] }),
      };
    }

    return this.apiRequest(`/domains/${domain}/mailboxes/${username}`, 'PUT', payload);
  }

  async listMailboxes(domain: string): Promise<any[]> {
    const response = await this.apiRequest(`/domains/${domain}/mailboxes`);
    return response.mailboxes || response.users || [];
  }

  // ===========================================================================
  // ALIASES
  // ===========================================================================

  async createAlias(domain: string, alias: string, forwardTo: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}/aliases/${alias}`, 'POST', {
      forward: forwardTo,
    });
  }

  async deleteAlias(domain: string, alias: string): Promise<any> {
    return this.apiRequest(`/domains/${domain}/aliases/${alias}`, 'DELETE');
  }

  async listAliases(domain: string): Promise<any[]> {
    const response = await this.apiRequest(`/domains/${domain}/aliases`);
    return response.aliases || [];
  }

  // ===========================================================================
  // USAGE STATS
  // ===========================================================================

  async getMailboxUsage(domain: string, username: string): Promise<{
    storageUsedMB: number;
    messagesCount: number;
  }> {
    const response = await this.apiRequest(`/domains/${domain}/mailboxes/${username}/usage`);
    return {
      storageUsedMB: response.storage_used_mb || response.disk_usage || 0,
      messagesCount: response.messages_count || response.num_messages || 0,
    };
  }

  async getDomainUsage(domain: string): Promise<{
    totalMailboxes: number;
    totalStorageUsedMB: number;
  }> {
    const response = await this.apiRequest(`/domains/${domain}/usage`);
    return {
      totalMailboxes: response.total_mailboxes || response.num_mailboxes || 0,
      totalStorageUsedMB: response.total_storage_used_mb || response.disk_usage || 0,
    };
  }

  // ===========================================================================
  // SPAM SETTINGS
  // ===========================================================================

  async updateSpamSettings(
    domain: string,
    username: string,
    settings: {
      spamFilterLevel: 'low' | 'medium' | 'high';
      whitelistSenders?: string[];
      blacklistSenders?: string[];
    }
  ): Promise<any> {
    return this.apiRequest(`/domains/${domain}/mailboxes/${username}/spam`, 'PUT', {
      level: settings.spamFilterLevel,
      ...(settings.whitelistSenders && { whitelist: settings.whitelistSenders }),
      ...(settings.blacklistSenders && { blacklist: settings.blacklistSenders }),
    });
  }

  // ===========================================================================
  // WEBMAIL URL
  // ===========================================================================

  getWebmailUrl(domain: string): string {
    return `https://webmail.${domain}`;
  }

  // ===========================================================================
  // MOCK RESPONSES
  // ===========================================================================

  private mockResponse(endpoint: string, method: string, body?: any): any {
    console.log(`[OpenSRS Email Mock] ${method} ${endpoint}`, body);

    // Domain endpoints
    if (endpoint.match(/^\/domains\/[^/]+$/) && method === 'POST') {
      const domain = endpoint.split('/')[2];
      return { domain, status: 'active', created_at: new Date().toISOString() };
    }

    if (endpoint.match(/^\/domains\/[^/]+$/) && method === 'DELETE') {
      return { success: true };
    }

    if (endpoint.match(/^\/domains\/[^/]+$/) && method === 'GET') {
      const domain = endpoint.split('/')[2];
      return {
        domain,
        status: 'active',
        num_mailboxes: 3,
        disk_usage: 256,
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    // Mailbox endpoints
    if (endpoint.match(/\/mailboxes\/[^/]+$/) && method === 'POST') {
      const parts = endpoint.split('/');
      const domain = parts[2];
      const username = parts[4];
      return {
        email: `${username}@${domain}`,
        username,
        domain,
        status: 'active',
        quota: body?.quota || 5120,
        created_at: new Date().toISOString(),
      };
    }

    if (endpoint.match(/\/mailboxes\/[^/]+$/) && method === 'DELETE') {
      return { success: true };
    }

    if (endpoint.match(/\/mailboxes\/[^/]+\/usage$/)) {
      return {
        storage_used_mb: 128,
        messages_count: 1247,
      };
    }

    if (endpoint.match(/\/mailboxes\/[^/]+\/spam$/) && method === 'PUT') {
      return { success: true, level: body?.level || 'medium' };
    }

    if (endpoint.match(/\/mailboxes\/[^/]+$/) && method === 'GET') {
      const parts = endpoint.split('/');
      const domain = parts[2];
      const username = parts[4];
      return {
        email: `${username}@${domain}`,
        username,
        domain,
        status: 'active',
        quota: 5120,
        storage_used_mb: 128,
        messages_count: 1247,
        forward: '',
        vacation: { enabled: 0 },
        spam_level: 'medium',
        first_name: 'Mock',
        last_name: 'User',
        last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    if (endpoint.match(/\/mailboxes\/[^/]+$/) && method === 'PUT') {
      return { success: true };
    }

    if (endpoint.match(/\/mailboxes$/) && method === 'GET') {
      const domain = endpoint.split('/')[2];
      return {
        mailboxes: [
          { email: `admin@${domain}`, username: 'admin', status: 'active', quota: 10240, storage_used_mb: 512 },
          { email: `info@${domain}`, username: 'info', status: 'active', quota: 5120, storage_used_mb: 64 },
          { email: `support@${domain}`, username: 'support', status: 'active', quota: 5120, storage_used_mb: 32 },
        ],
      };
    }

    // Alias endpoints
    if (endpoint.match(/\/aliases\/[^/]+$/) && method === 'POST') {
      const parts = endpoint.split('/');
      return { alias: parts[4], forward: body?.forward, domain: parts[2] };
    }

    if (endpoint.match(/\/aliases\/[^/]+$/) && method === 'DELETE') {
      return { success: true };
    }

    if (endpoint.match(/\/aliases$/) && method === 'GET') {
      const domain = endpoint.split('/')[2];
      return {
        aliases: [
          { alias: 'sales', forward: `admin@${domain}` },
          { alias: 'billing', forward: `admin@${domain}` },
        ],
      };
    }

    // Domain usage
    if (endpoint.match(/\/usage$/)) {
      return {
        total_mailboxes: 3,
        total_storage_used_mb: 608,
      };
    }

    return { success: true };
  }
}
