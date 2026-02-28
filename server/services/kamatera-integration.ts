// ============================================================================
// KAMATERA CLOUD API INTEGRATION (white-labeled as hostsblue Cloud Hosting)
// ============================================================================

interface KamateraServer {
  id: string;
  name: string;
  datacenter: string;
  cpu: string;
  ram: number;
  disk: string;
  power: string;
  networks: Array<{ network: string; ips: string[] }>;
  billing: string;
}

interface CreateServerConfig {
  name: string;
  datacenter: string;
  image: string;
  cpu: string;
  ramMB: number;
  diskSizeGB: number;
  billingCycle: 'monthly' | 'hourly';
  password: string;
  network?: string;
  scriptCommands?: string;
}

export interface CommandStatus {
  id: string;
  status: string;
  description: string;
  log: string;
}

interface Snapshot {
  id: string;
  name: string;
  sizeGB: number;
  createdAt: string;
}

class KamateraError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'KamateraError';
  }
}

export class KamateraService {
  private baseUrl: string;
  private clientId: string;
  private secret: string;
  private defaultDatacenter: string;

  constructor() {
    this.baseUrl = 'https://console.kamatera.com/service';
    this.clientId = process.env.KAMATERA_CLIENT_ID || '';
    this.secret = process.env.KAMATERA_SECRET || '';
    this.defaultDatacenter = process.env.KAMATERA_DEFAULT_DATACENTER || 'US-NY2';
  }

  private async request<T>(method: string, path: string, body?: any, retries = 3): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const url = `${this.baseUrl}${path}`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'clientId': this.clientId,
          'secret': this.secret,
        };

        const response = await fetch(url, {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
          const errorBody = await response.text().catch(() => 'Unknown error');
          // Rewrite provider branding from error messages
          const sanitized = errorBody
            .replace(/kamatera/gi, 'cloud hosting')
            .replace(/console\.kamatera\.com/gi, 'cloud infrastructure');
          throw new KamateraError(
            `Cloud hosting service error: ${sanitized}`,
            response.status
          );
        }

        return await response.json() as T;
      } catch (err: any) {
        lastError = err;
        if (err instanceof KamateraError && err.statusCode && err.statusCode < 500) {
          throw err; // Don't retry client errors
        }
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new KamateraError('Cloud hosting request failed after retries');
  }

  async listServers(): Promise<KamateraServer[]> {
    return this.request<KamateraServer[]>('GET', '/servers');
  }

  async getServer(serverId: string): Promise<KamateraServer> {
    if (!serverId) throw new KamateraError('Server ID is required');
    return this.request<KamateraServer>('GET', `/server/${serverId}`);
  }

  async createServer(config: CreateServerConfig): Promise<{ commandId: string }> {
    if (!config.name || !config.image || !config.cpu || !config.password) {
      throw new KamateraError('Server name, image, CPU, and password are required');
    }
    if (config.ramMB < 256) throw new KamateraError('Minimum RAM is 256MB');
    if (config.diskSizeGB < 10) throw new KamateraError('Minimum disk size is 10GB');

    const body = {
      name: config.name,
      datacenter: config.datacenter || this.defaultDatacenter,
      image: config.image,
      cpu: config.cpu,
      ram: config.ramMB,
      disk: `size=${config.diskSizeGB}`,
      dailybackup: true,
      managed: false,
      billingcycle: config.billingCycle,
      password: config.password,
      ...(config.network && { network: config.network }),
      ...(config.scriptCommands && { script: config.scriptCommands }),
    };

    const result = await this.request<any>('POST', '/server', body);
    return { commandId: result.commandIds?.[0] || result.commandId || result.id };
  }

  async powerOn(serverId: string): Promise<void> {
    if (!serverId) throw new KamateraError('Server ID is required');
    await this.request('POST', `/server/${serverId}/power`, { power: 'on' });
  }

  async powerOff(serverId: string): Promise<void> {
    if (!serverId) throw new KamateraError('Server ID is required');
    await this.request('POST', `/server/${serverId}/power`, { power: 'off' });
  }

  async reboot(serverId: string): Promise<void> {
    if (!serverId) throw new KamateraError('Server ID is required');
    await this.request('POST', `/server/${serverId}/reboot`);
  }

  async terminateServer(serverId: string): Promise<void> {
    if (!serverId) throw new KamateraError('Server ID is required');
    await this.request('DELETE', `/server/${serverId}`);
  }

  async changePassword(serverId: string, password: string): Promise<void> {
    if (!serverId || !password) throw new KamateraError('Server ID and password are required');
    if (password.length < 8) throw new KamateraError('Password must be at least 8 characters');
    await this.request('PUT', `/server/${serverId}/password`, { password });
  }

  async resizeCpu(serverId: string, cpu: string): Promise<void> {
    if (!serverId || !cpu) throw new KamateraError('Server ID and CPU type are required');
    await this.request('PUT', `/server/${serverId}/cpu`, { cpu });
  }

  async resizeRam(serverId: string, ramMB: number): Promise<void> {
    if (!serverId || !ramMB) throw new KamateraError('Server ID and RAM amount are required');
    if (ramMB < 256) throw new KamateraError('Minimum RAM is 256MB');
    await this.request('PUT', `/server/${serverId}/ram`, { ram: ramMB });
  }

  async listSnapshots(serverId: string): Promise<Snapshot[]> {
    if (!serverId) throw new KamateraError('Server ID is required');
    return this.request<Snapshot[]>('GET', `/server/${serverId}/snapshots`);
  }

  async createSnapshot(serverId: string, name: string): Promise<void> {
    if (!serverId || !name) throw new KamateraError('Server ID and snapshot name are required');
    await this.request('POST', `/server/${serverId}/snapshot`, { name });
  }

  async revertSnapshot(serverId: string, snapshotId: string): Promise<void> {
    if (!serverId || !snapshotId) throw new KamateraError('Server ID and snapshot ID are required');
    await this.request('PUT', `/server/${serverId}/snapshot`, { id: snapshotId });
  }

  async getServerOptions(): Promise<any> {
    return this.request<any>('GET', '/server/options');
  }

  async getCommandStatus(commandId: string): Promise<CommandStatus> {
    if (!commandId) throw new KamateraError('Command ID is required');
    return this.request<CommandStatus>('GET', `/queue/${commandId}`);
  }
}
