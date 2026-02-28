// ============================================================================
// CLOUD HOSTING PLANS (Kamatera-powered, hostsblue-branded)
// ============================================================================

export const CLOUD_HOSTING_PLANS = {
  'cloud-developer': {
    name: 'Developer',
    cpu: '1B',
    ramMB: 2048,
    diskGB: 20,
    bandwidthTB: 1,
    monthlyPrice: 1200,
    features: ['1 vCPU', '2GB RAM', '20GB SSD', '1TB Transfer', 'Root Access', 'Free SSL'],
  },
  'cloud-startup': {
    name: 'Startup',
    cpu: '2B',
    ramMB: 4096,
    diskGB: 40,
    bandwidthTB: 2.5,
    monthlyPrice: 2900,
    features: ['2 vCPU', '4GB RAM', '40GB SSD', '2.5TB Transfer', 'Root Access', 'Free SSL', 'Daily Backups'],
  },
  'cloud-scale': {
    name: 'Scale',
    cpu: '4B',
    ramMB: 8192,
    diskGB: 80,
    bandwidthTB: 5,
    monthlyPrice: 5900,
    features: ['4 vCPU', '8GB RAM', '80GB SSD', '5TB Transfer', 'Root Access', 'Free SSL', 'Daily Backups', 'Monitoring'],
  },
  'cloud-enterprise': {
    name: 'Enterprise',
    cpu: '8B',
    ramMB: 16384,
    diskGB: 200,
    bandwidthTB: 10,
    monthlyPrice: 11900,
    features: ['8 vCPU', '16GB RAM', '200GB SSD', '10TB Transfer', 'Root Access', 'Free SSL', 'Daily Backups', 'Monitoring', 'DDoS Protection', 'Priority Support'],
  },
} as const;

export type CloudPlanSlug = keyof typeof CLOUD_HOSTING_PLANS;

export const DATACENTERS = [
  { id: 'US-NY2', name: 'New York', region: 'North America' },
  { id: 'US-TX2', name: 'Dallas', region: 'North America' },
  { id: 'US-SC2', name: 'Santa Clara', region: 'North America' },
  { id: 'CA-TR', name: 'Toronto', region: 'North America' },
  { id: 'EU-LO', name: 'London', region: 'Europe' },
  { id: 'EU-AM', name: 'Amsterdam', region: 'Europe' },
  { id: 'EU-FR', name: 'Frankfurt', region: 'Europe' },
  { id: 'AS-HK', name: 'Hong Kong', region: 'Asia Pacific' },
  { id: 'AS-TYO', name: 'Tokyo', region: 'Asia Pacific' },
  { id: 'IL-TA', name: 'Tel Aviv', region: 'Middle East' },
] as const;

export const OS_IMAGES = [
  { id: 'ubuntu_server_22.04_64-bit', name: 'Ubuntu 22.04 LTS', category: 'Linux' },
  { id: 'ubuntu_server_24.04_64-bit', name: 'Ubuntu 24.04 LTS', category: 'Linux' },
  { id: 'debian_12_64-bit', name: 'Debian 12', category: 'Linux' },
  { id: 'centos_stream_9_64-bit', name: 'CentOS Stream 9', category: 'Linux' },
  { id: 'rocky_linux_9_64-bit', name: 'Rocky Linux 9', category: 'Linux' },
  { id: 'almalinux_9_64-bit', name: 'AlmaLinux 9', category: 'Linux' },
] as const;
