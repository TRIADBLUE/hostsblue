/**
 * OpenSRS Trust Services — SSL Certificate Integration
 * Handles certificate ordering, retrieval, and management via OpenSRS XCP API
 *
 * Uses the same XCP protocol and credentials as domain API (port 55443)
 * CSR generation uses Node crypto (no external dependencies)
 */

import crypto from 'crypto';
import { encryptCredential } from './wpmudev-integration.js';

const OPENRS_API_URL = process.env.OPENRS_API_URL || 'https://horizon.opensrs.net:55443';
const OPENRS_API_KEY = process.env.OPENRS_API_KEY || '';
const OPENRS_USERNAME = process.env.OPENRS_USERNAME || '';

export class OpenSRSSSLError extends Error {
  code: string;
  retryable: boolean;
  details?: any;

  constructor(message: string, code: string, retryable: boolean = false, details?: any) {
    super(message);
    this.name = 'OpenSRSSSLError';
    this.code = code;
    this.retryable = retryable;
    this.details = details;
  }
}

interface SSLContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization?: string;
  title?: string;
}

export class OpenSRSSSLIntegration {
  private apiUrl: string;
  private apiKey: string;
  private username: string;
  private isMockMode: boolean;

  constructor() {
    this.apiUrl = OPENRS_API_URL;
    this.apiKey = OPENRS_API_KEY;
    this.username = OPENRS_USERNAME;

    this.isMockMode = !this.apiKey || this.apiKey === 'test' || this.apiKey === 'your_opensrs_api_key';

    if (this.isMockMode) {
      console.warn('OpenSRS SSL credentials not configured - using mock mode');
    }
  }

  // ===========================================================================
  // XCP TRANSPORT (same protocol as domains, different action types)
  // ===========================================================================

  private generateSignature(xmlBody: string): string {
    const firstPass = crypto
      .createHash('md5')
      .update(xmlBody + this.apiKey)
      .digest('hex');
    return crypto
      .createHash('md5')
      .update(firstPass + this.apiKey)
      .digest('hex');
  }

  private escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  private unescapeXml(text: string): string {
    return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }

  private valueToXcp(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? '1' : '0';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return this.escapeXml(value);
    if (Array.isArray(value)) {
      return `<dt_array>${value.map((v, i) => `<item key="${i}">${this.valueToXcp(v)}</item>`).join('')}</dt_array>`;
    }
    if (typeof value === 'object') {
      return `<dt_assoc>${Object.entries(value).map(([k, v]) => `<item key="${this.escapeXml(k)}">${this.valueToXcp(v)}</item>`).join('')}</dt_assoc>`;
    }
    return this.escapeXml(String(value));
  }

  private buildXcpEnvelope(action: string, object: string, attributes: Record<string, any>): string {
    return [
      `<?xml version='1.0' encoding='UTF-8' standalone='no'?>`,
      `<!DOCTYPE OPS_envelope SYSTEM 'ops.dtd'>`,
      `<OPS_envelope>`,
      `<header><version>0.9</version></header>`,
      `<body>`,
      `<data_block>`,
      `<dt_assoc>`,
      `<item key="protocol">XCP</item>`,
      `<item key="action">${this.escapeXml(action)}</item>`,
      `<item key="object">${this.escapeXml(object)}</item>`,
      `<item key="attributes">${this.valueToXcp(attributes)}</item>`,
      `</dt_assoc>`,
      `</data_block>`,
      `</body>`,
      `</OPS_envelope>`,
    ].join('\n');
  }

  private parseXcpResponse(xml: string): any {
    let pos = 0;
    const skipWs = () => { while (pos < xml.length && /\s/.test(xml[pos])) pos++; };

    const parseValue = (): any => {
      skipWs();
      if (xml.startsWith('<dt_assoc>', pos)) {
        pos += '<dt_assoc>'.length;
        const result: Record<string, any> = {};
        while (pos < xml.length) {
          skipWs();
          if (xml.startsWith('</dt_assoc>', pos)) { pos += '</dt_assoc>'.length; break; }
          const m = xml.slice(pos).match(/^<item\s+key="([^"]*)">/);
          if (!m) break;
          const key = this.unescapeXml(m[1]);
          pos += m[0].length;
          skipWs();
          if (xml.startsWith('<dt_assoc>', pos) || xml.startsWith('<dt_array>', pos)) {
            result[key] = parseValue();
          } else {
            const end = xml.indexOf('</item>', pos);
            if (end === -1) break;
            result[key] = this.unescapeXml(xml.slice(pos, end).trim());
            pos = end;
          }
          skipWs();
          if (xml.startsWith('</item>', pos)) pos += '</item>'.length;
        }
        return result;
      }
      if (xml.startsWith('<dt_array>', pos)) {
        pos += '<dt_array>'.length;
        const result: any[] = [];
        while (pos < xml.length) {
          skipWs();
          if (xml.startsWith('</dt_array>', pos)) { pos += '</dt_array>'.length; break; }
          const m = xml.slice(pos).match(/^<item\s+key="([^"]*)">/);
          if (!m) break;
          pos += m[0].length;
          skipWs();
          if (xml.startsWith('<dt_assoc>', pos) || xml.startsWith('<dt_array>', pos)) {
            result.push(parseValue());
          } else {
            const end = xml.indexOf('</item>', pos);
            if (end === -1) break;
            result.push(this.unescapeXml(xml.slice(pos, end).trim()));
            pos = end;
          }
          skipWs();
          if (xml.startsWith('</item>', pos)) pos += '</item>'.length;
        }
        return result;
      }
      return null;
    };

    const start = xml.indexOf('<data_block>');
    if (start === -1) throw new OpenSRSSSLError('Invalid XCP response', 'OPENSRS_SSL_PARSE_ERROR');
    pos = start + '<data_block>'.length;
    skipWs();
    const parsed = parseValue();
    if (!parsed) throw new OpenSRSSSLError('Could not parse XCP response', 'OPENSRS_SSL_PARSE_ERROR');
    if (parsed.is_success === '0') {
      const code = parsed.response_code || 'UNKNOWN';
      throw new OpenSRSSSLError(
        `OpenSRS SSL API error (${code}): ${parsed.response_text || 'Unknown'}`,
        `OPENSRS_SSL_API_${code}`,
        parseInt(code) >= 500
      );
    }
    return parsed;
  }

  private async apiRequest(action: string, object: string, attributes: Record<string, any> = {}): Promise<any> {
    if (this.isMockMode) return this.mockResponse(action, attributes);

    const xmlBody = this.buildXcpEnvelope(action, object, attributes);
    const signature = this.generateSignature(xmlBody);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml',
          'X-Username': this.username,
          'X-Signature': signature,
          'Content-Length': String(Buffer.byteLength(xmlBody, 'utf8')),
        },
        body: xmlBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorText = await response.text();
        throw new OpenSRSSSLError(
          `OpenSRS SSL API error (${response.status}): ${errorText}`,
          `OPENSRS_SSL_HTTP_${response.status}`,
          response.status >= 500
        );
      }
      return this.parseXcpResponse(await response.text());
    } catch (error) {
      if (error instanceof OpenSRSSSLError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new OpenSRSSSLError('OpenSRS SSL API request timed out', 'OPENSRS_SSL_TIMEOUT', true);
      }
      throw new OpenSRSSSLError(
        `OpenSRS SSL API request failed: ${(error as Error).message}`,
        'OPENSRS_SSL_NETWORK_ERROR', true
      );
    }
  }

  // ===========================================================================
  // CERTIFICATE ORDERING
  // ===========================================================================

  async orderCertificate(data: {
    productType: 'dv' | 'ov' | 'ev' | 'wildcard' | 'san';
    provider: string;
    domain: string;
    period: number;
    csr: string;
    approverEmail: string;
    contacts: {
      admin: SSLContactData;
      tech?: SSLContactData;
      org?: {
        name: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
      };
    };
  }): Promise<{ orderId: string; status: string }> {
    const attributes: Record<string, any> = {
      product_type: data.productType,
      provider: data.provider,
      domain: data.domain,
      period: data.period,
      csr: data.csr,
      approver_email: data.approverEmail,
      contact_set: {
        admin: {
          first_name: data.contacts.admin.firstName,
          last_name: data.contacts.admin.lastName,
          email: data.contacts.admin.email,
          phone: data.contacts.admin.phone,
          ...(data.contacts.admin.organization && { org_name: data.contacts.admin.organization }),
          ...(data.contacts.admin.title && { title: data.contacts.admin.title }),
        },
      },
    };

    if (data.contacts.tech) {
      attributes.contact_set.tech = {
        first_name: data.contacts.tech.firstName,
        last_name: data.contacts.tech.lastName,
        email: data.contacts.tech.email,
        phone: data.contacts.tech.phone,
      };
    }

    if (data.contacts.org) {
      attributes.organization = {
        name: data.contacts.org.name,
        address: data.contacts.org.address,
        city: data.contacts.org.city,
        state: data.contacts.org.state,
        postal_code: data.contacts.org.postalCode,
        country: data.contacts.org.country,
        phone: data.contacts.org.phone,
      };
    }

    const response = await this.apiRequest('SW_REGISTER', 'TRUST_SERVICE', attributes);
    return {
      orderId: response.attributes?.id || response.attributes?.order_id || '',
      status: response.attributes?.status || 'pending_validation',
    };
  }

  // ===========================================================================
  // CERTIFICATE RETRIEVAL & MANAGEMENT
  // ===========================================================================

  async getCertificate(orderId: string): Promise<{
    status: string;
    certificate?: string;
    intermediateCA?: string;
    rootCA?: string;
    expiresAt?: Date;
  }> {
    const response = await this.apiRequest('GET', 'TRUST_SERVICE', { order_id: orderId });
    const attrs = response.attributes || {};
    return {
      status: attrs.status || 'unknown',
      certificate: attrs.certificate_pem || attrs.cert || undefined,
      intermediateCA: attrs.intermediate_pem || attrs.ca_bundle || undefined,
      rootCA: attrs.root_pem || undefined,
      expiresAt: attrs.expires_at ? new Date(attrs.expires_at) : undefined,
    };
  }

  async listCertificates(): Promise<any[]> {
    const response = await this.apiRequest('GET', 'TRUST_SERVICE', { type: 'list' });
    return response.attributes?.certificates || [];
  }

  async cancelCertificate(orderId: string): Promise<any> {
    const response = await this.apiRequest('CANCEL', 'TRUST_SERVICE', { order_id: orderId });
    return { success: true, status: response.attributes?.status || 'cancelled' };
  }

  async reissueCertificate(orderId: string, newCsr: string): Promise<any> {
    const response = await this.apiRequest('REISSUE', 'TRUST_SERVICE', {
      order_id: orderId,
      csr: newCsr,
    });
    return {
      orderId: response.attributes?.id || orderId,
      status: response.attributes?.status || 'pending_validation',
    };
  }

  async revokeCertificate(orderId: string, reason: string): Promise<any> {
    const response = await this.apiRequest('REVOKE', 'TRUST_SERVICE', {
      order_id: orderId,
      reason,
    });
    return { success: true, status: response.attributes?.status || 'revoked' };
  }

  // ===========================================================================
  // CSR GENERATION (runs on server, NOT sent to OpenSRS)
  // ===========================================================================

  async generateCSR(data: {
    domain: string;
    organization?: string;
    city?: string;
    state?: string;
    country?: string;
  }): Promise<{ csr: string; privateKey: string }> {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // Build subject string
    const subjectParts: string[] = [];
    subjectParts.push(`CN=${data.domain}`);
    if (data.organization) subjectParts.push(`O=${data.organization}`);
    if (data.city) subjectParts.push(`L=${data.city}`);
    if (data.state) subjectParts.push(`ST=${data.state}`);
    subjectParts.push(`C=${data.country || 'US'}`);
    const subject = '/' + subjectParts.join('/');

    // Use Node's built-in X509 CSR generation
    const csr = crypto.createSign('SHA256');
    // Node doesn't have a built-in CSR builder, so we use a minimal DER approach

    // For a production-ready CSR, generate using openssl-compatible format
    // Since Node crypto doesn't natively build CSRs, we build a minimal one
    const csrPem = this.buildMinimalCSR(privateKey, subject, data.domain);

    // Encrypt private key before returning
    const encryptedKey = encryptCredential(privateKey);

    return {
      csr: csrPem,
      privateKey: encryptedKey,
    };
  }

  /**
   * Build a minimal CSR using Node crypto primitives
   * This creates a valid PKCS#10 CSR for the given subject and key
   */
  private buildMinimalCSR(privateKeyPem: string, subject: string, domain: string): string {
    // Parse the private key
    const privateKey = crypto.createPrivateKey(privateKeyPem);

    // For CSR generation, we need to build the DER-encoded CSR structure
    // Subject components
    const subjectEntries = subject.slice(1).split('/').map(part => {
      const [key, value] = part.split('=');
      return { key, value };
    });

    // OID mappings
    const oids: Record<string, number[]> = {
      'CN': [2, 5, 4, 3],
      'O': [2, 5, 4, 10],
      'L': [2, 5, 4, 7],
      'ST': [2, 5, 4, 8],
      'C': [2, 5, 4, 6],
    };

    // Build subject RDN sequence
    const rdnSequence = subjectEntries.map(entry => {
      const oid = oids[entry.key];
      if (!oid) return null;
      const oidDer = this.derOid(oid);
      const isCountry = entry.key === 'C';
      const valueDer = isCountry
        ? this.derPrintableString(entry.value)
        : this.derUtf8String(entry.value);
      const atv = this.derSequence(Buffer.concat([oidDer, valueDer]));
      return this.derSet(atv);
    }).filter(Boolean) as Buffer[];

    const subjectDer = this.derSequence(Buffer.concat(rdnSequence));

    // Get public key DER from private key
    const publicKeyObj = crypto.createPublicKey(privateKey);
    const publicKeyDer = publicKeyObj.export({ type: 'spki', format: 'der' });

    // CSR info: version 0, subject, public key, attributes (empty)
    const version = this.derInteger(0);
    const attributes = Buffer.from([0xa0, 0x00]); // context-specific tag 0, empty
    const csrInfo = this.derSequence(Buffer.concat([version, subjectDer, publicKeyDer, attributes]));

    // Sign the CSR info
    const signer = crypto.createSign('SHA256');
    signer.update(csrInfo);
    const signatureBytes = signer.sign(privateKey);

    // SHA256withRSA algorithm identifier
    const sha256WithRSA = this.derSequence(Buffer.concat([
      this.derOid([1, 2, 840, 113549, 1, 1, 11]),
      Buffer.from([0x05, 0x00]), // NULL
    ]));

    // Bit string for signature (prepend 0x00 for unused bits)
    const signatureBitString = this.derBitString(signatureBytes);

    // Final CSR
    const csrDer = this.derSequence(Buffer.concat([csrInfo, sha256WithRSA, signatureBitString]));

    // Encode as PEM
    const base64 = csrDer.toString('base64');
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN CERTIFICATE REQUEST-----\n${lines.join('\n')}\n-----END CERTIFICATE REQUEST-----`;
  }

  // DER encoding helpers
  private derLength(length: number): Buffer {
    if (length < 128) return Buffer.from([length]);
    if (length < 256) return Buffer.from([0x81, length]);
    return Buffer.from([0x82, (length >> 8) & 0xff, length & 0xff]);
  }

  private derTag(tag: number, content: Buffer): Buffer {
    return Buffer.concat([Buffer.from([tag]), this.derLength(content.length), content]);
  }

  private derSequence(content: Buffer): Buffer { return this.derTag(0x30, content); }
  private derSet(content: Buffer): Buffer { return this.derTag(0x31, content); }
  private derUtf8String(value: string): Buffer { return this.derTag(0x0c, Buffer.from(value, 'utf8')); }
  private derPrintableString(value: string): Buffer { return this.derTag(0x13, Buffer.from(value, 'ascii')); }
  private derBitString(content: Buffer): Buffer {
    return this.derTag(0x03, Buffer.concat([Buffer.from([0x00]), content]));
  }

  private derInteger(value: number): Buffer {
    if (value === 0) return this.derTag(0x02, Buffer.from([0x00]));
    const bytes: number[] = [];
    let v = value;
    while (v > 0) { bytes.unshift(v & 0xff); v >>= 8; }
    if (bytes[0] & 0x80) bytes.unshift(0x00);
    return this.derTag(0x02, Buffer.from(bytes));
  }

  private derOid(components: number[]): Buffer {
    const bytes: number[] = [];
    bytes.push(40 * components[0] + components[1]);
    for (let i = 2; i < components.length; i++) {
      let c = components[i];
      if (c < 128) {
        bytes.push(c);
      } else {
        const parts: number[] = [];
        parts.unshift(c & 0x7f);
        c >>= 7;
        while (c > 0) {
          parts.unshift((c & 0x7f) | 0x80);
          c >>= 7;
        }
        bytes.push(...parts);
      }
    }
    return this.derTag(0x06, Buffer.from(bytes));
  }

  // ===========================================================================
  // PRODUCT CATALOG
  // ===========================================================================

  async getProducts(): Promise<Array<{
    id: string;
    name: string;
    type: string;
    provider: string;
    validationLevel: string;
    maxDomains: number;
    pricing: { years1: number; years2: number; years3: number };
  }>> {
    const response = await this.apiRequest('GET', 'TRUST_SERVICE', { type: 'products' });
    const products = response.attributes?.products;

    if (Array.isArray(products)) {
      return products.map((p: any) => ({
        id: p.id || p.product_id,
        name: p.name || p.product_name,
        type: p.type || p.product_type,
        provider: p.provider || p.vendor,
        validationLevel: p.validation_level || p.type,
        maxDomains: p.max_domains || 1,
        pricing: {
          years1: p.pricing?.['1'] || p.price_1yr || 0,
          years2: p.pricing?.['2'] || p.price_2yr || 0,
          years3: p.pricing?.['3'] || p.price_3yr || 0,
        },
      }));
    }

    return [];
  }

  // ===========================================================================
  // DCV (Domain Control Validation)
  // ===========================================================================

  async resendDcvEmail(orderId: string): Promise<any> {
    const response = await this.apiRequest('RESEND_APPROVER_EMAIL', 'TRUST_SERVICE', {
      order_id: orderId,
    });
    return { success: true, message: response.response_text || 'DCV email resent' };
  }

  async getDcvStatus(orderId: string): Promise<{ method: string; status: string }> {
    const response = await this.apiRequest('GET', 'TRUST_SERVICE', {
      order_id: orderId,
      type: 'dcv_status',
    });
    return {
      method: response.attributes?.dcv_method || 'email',
      status: response.attributes?.dcv_status || 'pending',
    };
  }

  // ===========================================================================
  // MOCK RESPONSES
  // ===========================================================================

  private mockResponse(action: string, attributes: any): any {
    console.log(`[OpenSRS SSL Mock] ${action}`, attributes);

    switch (action) {
      case 'SW_REGISTER':
        return {
          is_success: '1',
          response_code: '200',
          attributes: {
            id: `mock-ssl-${Date.now()}`,
            order_id: `mock-ssl-${Date.now()}`,
            status: 'pending_validation',
          },
        };

      case 'GET': {
        if (attributes.type === 'products') {
          return {
            is_success: '1',
            response_code: '200',
            attributes: {
              products: [
                { id: 'sectigo-dv', name: 'Sectigo PositiveSSL', type: 'dv', provider: 'sectigo', validation_level: 'dv', max_domains: 1, pricing: { '1': 4999, '2': 8999, '3': 12999 } },
                { id: 'sectigo-wildcard', name: 'Sectigo Wildcard SSL', type: 'wildcard', provider: 'sectigo', validation_level: 'dv', max_domains: 1, pricing: { '1': 14999, '2': 27999, '3': 39999 } },
                { id: 'sectigo-ov', name: 'Sectigo InstantSSL', type: 'ov', provider: 'sectigo', validation_level: 'ov', max_domains: 1, pricing: { '1': 9999, '2': 17999, '3': 25999 } },
                { id: 'sectigo-ev', name: 'Sectigo EV SSL', type: 'ev', provider: 'sectigo', validation_level: 'ev', max_domains: 1, pricing: { '1': 19999, '2': 35999, '3': 49999 } },
                { id: 'sectigo-san', name: 'Sectigo Multi-Domain SSL', type: 'san', provider: 'sectigo', validation_level: 'dv', max_domains: 100, pricing: { '1': 7999, '2': 14999, '3': 21999 } },
              ],
            },
          };
        }

        if (attributes.type === 'dcv_status') {
          return {
            is_success: '1',
            response_code: '200',
            attributes: { dcv_method: 'email', dcv_status: 'pending' },
          };
        }

        // Single certificate GET
        return {
          is_success: '1',
          response_code: '200',
          attributes: {
            status: 'issued',
            certificate_pem: '-----BEGIN CERTIFICATE-----\nMOCK_CERT_DATA\n-----END CERTIFICATE-----',
            intermediate_pem: '-----BEGIN CERTIFICATE-----\nMOCK_INTERMEDIATE\n-----END CERTIFICATE-----',
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
        };
      }

      case 'CANCEL':
        return { is_success: '1', response_code: '200', attributes: { status: 'cancelled' } };

      case 'REISSUE':
        return {
          is_success: '1',
          response_code: '200',
          attributes: { id: attributes.order_id, status: 'pending_validation' },
        };

      case 'REVOKE':
        return { is_success: '1', response_code: '200', attributes: { status: 'revoked' } };

      case 'RESEND_APPROVER_EMAIL':
        return { is_success: '1', response_code: '200', response_text: 'DCV email resent' };

      default:
        return { is_success: '1', response_code: '200', attributes: {} };
    }
  }
}
